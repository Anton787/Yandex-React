import { IEvents } from "../base/events";
import { View } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IFormState {
  valid: boolean;
  errors: string[];
}

export class Form<T extends Record<string, any>> extends View<IFormState> {
  protected _submitButton: HTMLButtonElement;
  protected _errorContainer: HTMLElement;
  protected _form: HTMLFormElement;
  
  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);
    this._form = container;
    this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
    this._errorContainer = ensureElement<HTMLElement>('.form__errors', container);
    this._form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`form:${this._form.name}:submit`);
    });
  }
  set valid(value: boolean) {
      this.setDisabled(this._submitButton, !value);
  }
  set errors(value: string[]) {
      this.setText(this._errorContainer, value.join(', '));
  }
  render(state: Partial<T> & IFormState): HTMLFormElement {
      const { valid, errors, ...inputs } = state;
      Object.entries(inputs).forEach(([key, value]) => {
          const element = this._form.elements.namedItem(key);
          if (element && 'value' in element) {
              element.value = value ?? '';
          }
      });
      super.render({ valid, errors });
      return this._form;
  }
}