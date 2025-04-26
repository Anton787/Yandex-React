import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { View } from "../base/Component";

interface ISuccessState {
  total: number;
}

export class Success extends View<ISuccessState> {
  protected _description: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this._description = ensureElement<HTMLElement>('.order-success__description', container);
    this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
    this._closeButton.addEventListener('click', () => {
        this.events.emit('success:close');
    });
  }
  set total(value: number) {
    this.setText(this._description, `Списано ${value} синапсов`);
  }
  render(state: Partial<ISuccessState>): HTMLElement {
    if (state.total !== undefined) {
      this.total = state.total;
    }
    return this.container;
  }
}