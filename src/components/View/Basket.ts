import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { View } from "../base/Component";
import { IApiProduct } from "../../types";

interface IBasketView {
  items: HTMLElement[];
  total: number;
}

export class BasketView extends View<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _headerCounter: HTMLElement;
  private _items: IApiProduct[] = [];

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this._list = ensureElement<HTMLElement>('.basket__list', container);
    this._total = ensureElement<HTMLElement>('.basket__price', container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', container);
    this._headerCounter = ensureElement<HTMLElement>('.header__basket-counter');
    this._showEmptyState();
    this._button.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }
  private _showEmptyState(): void {
    this._list.replaceChildren(
      document.createElement('p').textContent = 'Корзина пуста'
    );
    this.setDisabled(this._button, true);
    this._total.textContent = '';
  }
  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
      this.setDisabled(this._button, false);
    } else {
      this._showEmptyState();
    }
  }
  set total(value: number) {
    this.setText(this._total, `${value} синапсов`);
  }  
}