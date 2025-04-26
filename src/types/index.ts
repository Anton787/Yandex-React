export type PaymentOption = 'Онлайн' | 'При получении'
export type FormErrors = Partial<Record<keyof IOrderFormData, string>>;

export interface IApiProductList {
  total: number;
  items: IApiProduct[];
}

export interface IApiProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IOrderFormData{
	payment: PaymentOption;
	email: string;
	phone: string;
	address: string;
}

export interface IBasketItem{
  productId: string;
  title: string;
  price: number;
}

export interface IBasketData{
  items: string[];
  total_price: number;
}

export interface IOrder extends IOrderFormData {
  items: string[];
  total: number;
}

export interface IOrderResult {
  id: string;
  total: number;
}