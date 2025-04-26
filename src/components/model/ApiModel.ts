import { Api, ApiListResponse } from "../base/api";
import { IApiProduct, IOrderResult, IOrder } from "../../types";

export class ApiModel extends Api {
  private cdn: string;

  constructor(
    cdn: string, 
    baseUrl: string, 
    options?: RequestInit){
      super(baseUrl, options);
      this.cdn = cdn;
  };

  getListCards() {
    return this.get('/product')
      .then((products: ApiListResponse<IApiProduct>) => (
        products.items.map((item) => ({...item, image: this.cdn + item.image})))
      ).catch(error => {
        console.error('Ошибка загрузки:', error);
    });;
  };

  makeOrder(data: IOrder) {
      return this.post('/order', data)
          .then((res: IOrderResult) => res);
  }
}