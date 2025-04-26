import { IEvents } from "../base/events";
import { Form } from "./Form";
import { IOrderFormData, PaymentOption } from "../../types";
import { ensureElement } from "../../utils/utils";

interface IAddressFormState {
  payment: PaymentOption;
  address: string;
  errors: string[];
  valid: boolean;
}

export class FormAddressModal extends Form<IAddressFormState> {
  protected _paymentOnline: HTMLButtonElement;
  protected _paymentOnReceipt: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;
  protected _selectedPayment: PaymentOption;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this._paymentOnline = ensureElement<HTMLButtonElement>(
      'button[name="online"]',
      container
    );
    
    this._paymentOnReceipt = ensureElement<HTMLButtonElement>(
      'button[name="on-receipt"]',
      container
    );
    this._addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container
    );
    this._submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]', 
      container
    );
    this._initHandlers();
  }
  private _initHandlers(): void {
      this._paymentOnline.addEventListener('click', () => {
        this.payment = 'Онлайн';
        this.events.emit('order:payment:change', { payment: 'Онлайн' });
      });
      this._paymentOnReceipt.addEventListener('click', () => {
        this.payment = 'При получении';
        this.events.emit('order:payment:change', { payment: 'При получении' });
      });
      this._addressInput.addEventListener('input', () => {
        this.valid = this._validateForm();
      });
      this._submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (this._validateForm()) {
          this.events.emit('order:address:submit', this.formData);
          this.events.emit('order:submit');
        }
      });
  }
  set payment(method: PaymentOption) {
    this._selectedPayment = method;
    this.toggleClass(this._paymentOnline, 'button_alt-active', method === 'Онлайн');
    this.toggleClass(this._paymentOnReceipt, 'button_alt-active', method === 'При получении');
    this.valid = this._validateForm();
  }
  set address(value: string) {
    this._addressInput.value = value;
    this.valid = this._validateForm();
  }
  set errors(value: string[]) {
    const errorElement = this.container.querySelector('.form__errors');
    if (errorElement) {
      errorElement.textContent = value.join(', ');
    }
  }
  private _validateForm(): boolean {
    const errors: string[] = [];
    
    if (!this._selectedPayment) {
      errors.push('Выберите способ оплаты');
    }
    
    if (!this._addressInput.value.trim()) {
      errors.push('Укажите адрес доставки');
    }
    
    this.errors = errors;
    return errors.length === 0;
  }
  get formData(): Pick<IOrderFormData, 'payment' | 'address'> {
    return {
      payment: this._selectedPayment as PaymentOption,
      address: this._addressInput.value
    };
  }
}