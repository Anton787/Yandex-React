import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { View } from "../base/Component";

interface IBasketItemView {
  index: number;
  title: string;
  price: number | null;
}

export class BasketItemView extends View<IBasketItemView> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    
    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
  }
  set index(value: number) {
    this.setText(this._index, String(value + 1)); // +1 чтобы начиналось с 1
  }
  set title(value: string) {
    this.setText(this._title, value);
  }
  set price(value: number | null) {
    this.setText(this._price, this.formatPrice(value));
  }
  set onClick(callback: () => void) {
    this._button.addEventListener('click', (e) => {
      e.preventDefault();
      callback();
    });
  }
  private formatPrice(value: number | null): string {
    return value === null ? 'Бесценно' : `${value} синапсов`;
  }
}