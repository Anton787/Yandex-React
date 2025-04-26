import { IEvents } from '../base/events';
import { FormErrors, IOrderFormData, IOrder } from '../../types';
import { BasketModel } from './BasketModel';

export class FormModel {
  private _total: number;
  private _formData: IOrderFormData = {
    payment: 'Онлайн',
    email: '',
    phone: '',
    address: '',
  };
  errors: FormErrors = {};
  private _basketItems: string[] = [];

  constructor(private events: IEvents, private basketModel: BasketModel) {}

  setField<K extends keyof IOrderFormData>(field: K, value: IOrderFormData[K]): void {
    this._formData[field] = value;
    this.events.emit('form:changed', this.getFormData());
  }
  getFormData(): Readonly<IOrderFormData> {
    return { ...this._formData };
  }
  getField<K extends keyof IOrderFormData>(field: K): IOrderFormData[K] {
    return this._formData[field];
  }
  setBasketItems(items: string[]): void {
    this._basketItems = items;
  }
  setTotal(total: number): void {
    this._total = total;
  }
  getOrderData(): IOrder {
    this.setBasketItems(this.basketModel.getProductIds());
    this.setTotal(this.basketModel.getTotal());
    
    return {
      payment: this.getField('payment'),
      email: this.getField('email'),
      phone: this.getField('phone'),
      address: this.getField('address'),
      items: this._basketItems,
      total: this._total
    };
  }
}