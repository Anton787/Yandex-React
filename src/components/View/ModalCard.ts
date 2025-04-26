import { IEvents } from "../base/events";
import { IApiProduct } from "../../types";
import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";

export class ModalCard extends Card {
  protected _description: HTMLParagraphElement;
  protected _buttonBasket: HTMLButtonElement;

  constructor(container: HTMLElement, protected events?: IEvents) {
    super(container);
    this._description = ensureElement<HTMLParagraphElement>('.card__text', container);
    this._buttonBasket = ensureElement<HTMLButtonElement>('.card__button', container);
    this._buttonBasket.addEventListener('click', () => {
      events.emit('card:button_click', { id: this.id });
    });
  }
  set description(value: string) {
    this.setText(this._description, value);
  }
  set buttonText(value: string) {
    this.setText(this._buttonBasket, value);
  }
  set buttonDisabled(value: boolean) {
    this.setDisabled(this._buttonBasket, value);
  }
  updateButtonState(product: IApiProduct): void {
    this.buttonDisabled = product.price === null;
    this.buttonText = product.price === null ? 'Недоступно' : 'В корзину';
  }
}