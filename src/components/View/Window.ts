import { IEvents } from "../base/events";
import { View } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IModalData {
  content: HTMLElement;
}

export class ModalWindow extends View<IModalData> {
  protected _content: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this._content = ensureElement<HTMLElement>('.modal__content', container);
    this._initEventListeners();
  }
  private _initEventListeners(): void {
    this.container.addEventListener('click', this.close.bind(this));
    this._content.addEventListener('click', (e) => e.stopPropagation());
    this._closeButton.addEventListener('click', this.close.bind(this));
    document.addEventListener('keydown', this._handleKeyDown.bind(this));
  }
  private _handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.close();
    }
  }
  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }
  open(): void {
    this.toggleClass(this.container, 'modal_active', true);
    this.events.emit('modal:open');
  }
  close(): void {
    this.toggleClass(this.container, 'modal_active', false);
    this.events.emit('modal:close');
  }
  render(data?: Partial<IModalData>): HTMLElement {
    if (data?.content) {
      this.content = data.content;
    }
    this.open();
    return this.container;
  }
  clear(): void {
    this._content.replaceChildren();
  }
}