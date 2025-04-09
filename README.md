# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура проекта
Проект использует следующие архитектурные принципы:

- **Разделение на слои**:

  - **Слой данных (M)**: содержит модели данных и их бизнес логику
  - **Слой отображения (V)**: содержит компоненты пользовательского интерфейса, отвечающие за отображение данных
  - **Слой связывания (P)**: связывает слой данных и слой отображения через событийную модель.

  - **Слабое связывание (Loose Coupling)**
    Компоненты взаимодействуют через события, а не прямые зависимости. Например:
    - Добавление товара в корзину инициирует событие через EventEmitter.
    - Открытие модалки товара обрабатывается через коллбэки в интерфейсах View.

## Типизация и модели данных
Все типы данных собраны в файле src/types/index.ts, что обеспечивает централизованное управление интерфейсами.

## UML (делал в 1 раз, не знаю на сколько это верно)
![UML](/uml.png)

## Модели данных
Эта часть содержит типы, которые располагаются на слое данных. Это либо сами модели, либо некоторые сервисы, которые 
отвечают за выполнение бизнес логики. В моем случае это модели api, продуктов, корзины, заказа и соответствующие сервисы.

Базовая модель данных, получаемых от API:
```ts
export interface ApiProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Расширенная модель для приложения
export interface IProduct extends ApiProduct {
  inBasket: boolean;
}
```

Корзина
```ts
// Элемент корзины
export interface IBasketItem {
  productId: string;
  title: string;
  price: number;
}

// Состояние корзины
export interface IBasketData {
  items: IBasketItem[];
  total_price: number;
}
```

Заказ
```ts
// Данные пользователя
export interface IOrderFormData {
  payment: PaymentOption;
  address: string;
  email: string;
  phone: string;
}

// объединение данных - Полный заказ для отправки
export interface IOrder extends IOrderFormData {
  items: string[];
  total_price: number;
}
```

## Сервисы

Сервис заказов
```ts
export interface IOrderService {
  sumbitOrder(order: IOrder): void;
}
```

Сервис корзины 
```ts
export interface IBasketService {
  add(id: string): void; // Добавление по ID товара
  getItems(): string[]; // Получение ID товаров
  remove(id: string): void; // Удаление по ID
  clear(): void; // Очистка корзины
  getTotalSum(): number; // Итоговая сумма
}
```

На этом слое находятся модели, которые отвечают за отправку некоторых событий от слоя к слоя. Все это находится в events.ts

```ts
// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string,
    data: unknown
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    /**
     * Установить обработчик на событие
     */
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }

    /**
     * Снять обработчик с события
     */
    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            this._events.get(eventName)!.delete(callback);
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    /**
     * Инициировать событие с данными
     */
    emit<T extends object>(eventName: string, data?: T) {
        this._events.forEach((subscribers, name) => {
            if (name === '*') subscribers.forEach(callback => callback({
                eventName,
                data
            }));
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }

    /**
     * Слушать все события
     */
    onAll(callback: (event: EmitterEvent) => void) {
        this.on("*", callback);
    }

    /**
     * Сбросить все обработчики
     */
    offAll() {
        this._events = new Map<string, Set<Subscriber>>();
    }

    /**
     * Сделать коллбек триггер, генерирующий событие при вызове
     */
    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            });
        };
    }
}
```

Вот код, предоставленный авторами курса. Мы видим некий общий интерфейс IEvents, который определяет некий общий брокер сообщений.
И далее видим пример реализации брокера. Этот брокер далее будет использоваться модели представления и моделями бизнес-логики 
для общения друг с другом. Это позволяет достичь низкой связности кода. 

## Модели отображения

Базовые интерфейсы
```ts
// Базовый интерфейс для всех View-компонентов
export interface IView<T> {
  render(data: T): HTMLElement;
}

// Модальное окно
export interface IModal<T> extends IView<T> {
  open(): void;
  close(): void;
}
```

Компоненты 
```ts
// Отображения списка продуктов
export interface IProductListView extends IView<IProduct[]> {
  onProductClick?: (id: string) => void; // клик на товар
}

// Модальное окно товара
export interface IProductModalView extends IModal<IProduct> {
  onAddToBasket?: (id: string) => void; // добавления в корзину
}

// Модальное окно корзины
export interface IBasketView extends IModal<IBasketItem[]> {
  onRemoveItem?: (id: string) => void; // удаления товара
  onCheckout?: () => void; // оформления заказа
}

// Модальное окно формы заказа
export interface IOrderFormView extends IModal<{
  currentStep: 1 | 2; // Текущий шаг
  formData: Partial<IOrderFormData>; // Все данные формы делаем необязательными чтобы можно было идти по шаагм
  errors?: FormErrors;
}> {
  onNextStep: (currentData: Pick<IOrderFormData, 'payment' | 'address'>) => void; //берём только 2 поля данных 
  onSubmit: (fullData: IOrderFormData) => void; //отправляем уже полные данные 
}
```

## Принцип взаимодействия 

**Пользователь кликает на товар:**
  - **IProductListView генерирует событие product:open.**
  - **EventEmitter передаёт событие в IProductModalView.**

**Добавление в корзину:**
  - **IProductModalView вызывает onAddToBasket.**
  - **IBasketService обновляет данные корзины.**
  - **В следующем шаге генерируется событие basket:update для перерисовки UI.**


## Если честно, немного теряюсь в курсе от Яндекса, не знаю из-за чего (может быть привык сильно к HTML академии).
## Если есть какие-то недочёты или я что-то не так понимаю по заданию, дайте, пожалуйста, обратную связь.
P.S Просто по мимо того, что я хотел бы 100 баллов за курс, так я ещё и специально пошёл на этот курс из-за того, что тут и Ts React, которые оба мне сейчас нужны и хотелось бы нормально изучать и делать, а сейчас чувство, что я путаюсь в формулировке заданий
