import { IEvents } from "../base/events";
import { IApiProduct } from "../../types";

export class BasketModel {
  private items: IApiProduct[] = [];
  private events: IEvents;

  constructor(events: IEvents) {
      this.events = events;
  }
  getProductIds(): string[] {
    return this.items.map(item => item.id);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  add(item: IApiProduct): void {
    if (!this.items.some(existing => existing.id === item.id)) {
      this.items.push(item);
      this.events.emit('basket:changed', this.items);
    }
  }
  remove(itemId: string): void {
    this.items = this.items.filter(item => item.id !== itemId);
    this.events.emit('basket:changed', this.items);
  }
  clear(): void {
    this.items = [];
    this.events.emit('basket:changed', this.items);
  }
  get total(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
  get products(): ReadonlyArray<IApiProduct> {
    return [...this.items];
  }
}