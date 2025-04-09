// Базовые типы
export type PaymentOption = 'Онлайн' | 'При получении'
export type FormErrors = Partial<Record<keyof IOrderFormData, string>>;

// ===API модели====
/** Ответ API для списка товаров (соответствует вашему JSON) */
export interface IApiProductList {
  total: number;
  items: IApiProduct[];
}

/** Модель товара из API */
export interface IApiProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// ===Модели приложения===

// модель продукта 
export interface IProduct extends IApiProduct {
  inBasket: boolean;
}

// модель информации о пользователе
export interface IOrderFormData{
  payment: PaymentOption;
  address: string;
  email: string;
  phone: string;
}

// Модель элемента корзины
export interface IBasketItem{
  productId: string;
  title: string;
  price: number;
}

// Модель корзины
export interface IBasketData{
  items: IBasketItem[];
  total_price: number;
}

// Модель заказа для отправки 
export interface IOrder extends IOrderFormData {
  items: string[]; //id товаров в корзине
  total_price: number;
}

// ===Сервисы===

// Сервис для отправки данных о заказе 
export interface IOrderService{
  sumbitOrder(order: IOrder): void;
}

// Сервис для работы с корзиной
export interface IBasketService {
  add(id: string): void;
  getItems(): string[];
  remove(id: string): void;
  clear(): void;
  getTotalSum(): number;
}

export interface ProductService {
  getProducts(): Promise<IApiProductList>;
  getProduct(id: string): Promise<IApiProduct>;
}

// Слой View 

// Базовый интерфейс для всех View-компонентов
export interface IView<T> {
  render(data: T): HTMLElement;
}

// Модальное окно
export interface IModal<T> extends IView<T> {
  open(): void;
  close(): void;
}

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