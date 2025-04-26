import { View } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

interface IPageState {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

export class Page extends View<IPageState> {
  protected _counter: HTMLElement;
  protected _catalog: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basketButton: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this._counter = ensureElement<HTMLElement>('.header__basket-counter');
    this._catalog = ensureElement<HTMLElement>('.gallery');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._basketButton = ensureElement<HTMLElement>('.header__basket');
    this._initEventListeners();
  }
  private _initEventListeners(): void {
    this._basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }
  set counter(value: number) {
    this.setText(this._counter, String(value));
  }
  set catalog(items: HTMLElement[]) {
    if (items.length) {
      this._catalog.replaceChildren(...items);
    } else {
      this._catalog.innerHTML = '<p class="catalog__empty">Каталог пуст</p>';
    }
  }
  set locked(value: boolean) {
    this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
    this.setDisabled(this._basketButton, value);
  }
}