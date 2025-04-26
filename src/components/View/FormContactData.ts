import { IEvents } from "../base/events";
import { Form } from "./Form";
import { IOrderFormData } from "../../types";
import { ensureElement } from "../../utils/utils";

interface IContactsFormState {
  email: string;
  phone: string;
  errors: string[];
  valid: boolean;
}

export class FormContactModal extends Form<IContactsFormState> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;
  protected _submitButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
    this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this._initValidation();
    this._initSubmitHandler();
  }

  private _initSubmitHandler(): void {
    this._submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (this._validateForm()) {
        this.events.emit('order:contacts:submit', this.formData);
        this.events.emit('order:complete');
      }
    });
  }

  private _initValidation(): void {
    this._emailInput.addEventListener('input', () => this._validateForm());
    this._phoneInput.addEventListener('input', () => this._validateForm());
  }
  set email(value: string) {
    this._emailInput.value = value;
    this._validateForm();
  }
  set phone(value: string) {
    this._phoneInput.value = value;
    this._validateForm();
  }
  private _validateForm(): boolean {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,12}$/;

    if (!this._emailInput.value) {
        errors.push('Укажите email');
    } else if (!emailRegex.test(this._emailInput.value)) {
        errors.push('Некорректный email');
    }

    if (!this._phoneInput.value) {
        errors.push('Укажите телефон');
    } else {
        const cleanPhone = this._phoneInput.value.replace(/\D/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            errors.push('Некорректный телефон');
        }
    }

    this.errors = errors;
    this.valid = errors.length === 0;
    return errors.length === 0;
  }
  get formData(): Pick<IOrderFormData, 'email' | 'phone'> {
    return {
      email: this._emailInput.value,
      phone: this._phoneInput.value
    };
  }
}