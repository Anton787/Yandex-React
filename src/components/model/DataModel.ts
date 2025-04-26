import { IApiProduct } from "../../types";
import { IEvents } from "../base/events";

export class DataModel {
  private _products: IApiProduct[] = [];
  private _selectedProduct: IApiProduct | null = null;

  constructor(private events: IEvents) {}

  set products(items: IApiProduct[]) {
    this._products = items;
    this.events.emit('products:updated', this._products);
  }
  get products(): IApiProduct[] {
    return this._products;
  }
  get selectedProduct(): IApiProduct | null {
    return this._selectedProduct;
  }
}