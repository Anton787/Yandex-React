import { IApiProduct } from "../../types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

const categories = new Map([
  ['софт-скил', 'soft'],
  ['другое', 'other'],
  ['дополнительное', 'additional'],
  ['кнопка', 'button'],
  ['хард-скил', 'hard']
]);

export class Card extends Component<IApiProduct> {
    protected _image: HTMLImageElement;
    protected _title: HTMLElement; 
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;

  constructor(container: HTMLElement, protected events?: IEvents) {
    super(container);
    
    this._image = ensureElement<HTMLImageElement>('.card__image', container);
    this._title = ensureElement('.card__title', container);
    this._category = container.querySelector('.card__category') || undefined;
    this._price = ensureElement('.card__price', container);
    this._button = container.querySelector('.card__button') || undefined;
  }
  set id(value: string) {
      this.container.dataset.id = value;
  }
  get id(): string {
      return this.container.dataset.id || '';
  }
  set title(value: string) {
      this.setText(this._title, value);
  }
  set category(value: string) {
    this.setText(this._category, value);
    if (this._category) {
      this._category.classList.add(
        `card__category_${categories.get(value) ? categories.get(value) : 'other'}`
      );
    };
  };
  set price(value: number | null) {
      const priceText = value ? `${value} синапсов` : 'Бесценно';
      this.setText(this._price, priceText);
      if (this._button) {
        this.setDisabled(this._button, value === null);
      }
  }
  set image(value: string) {
      this.setImage(this._image, value, this._title.textContent || '');
  }
  set buttonText(value: string) {
      if (this._button) {
        this.setText(this._button, value);
      }
  }
  render(data: Partial<IApiProduct>): HTMLElement {
      Object.assign(this as object, data);
      return this.container;
  }
}