import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/model/ApiModel';
import { DataModel } from './components/model/DataModel';
import { BasketModel } from './components/model/BasketModel';
import { FormModel } from './components/model/FormModel';

import { Page } from './components/View/Page';
import { Card } from './components/View/Card';
import { ModalCard } from './components/View/ModalCard';
import { ModalWindow } from './components/View/Window';
import { BasketView } from './components/View/Basket';
import { BasketItemView } from './components/View/BasketItem';
import { FormAddressModal } from './components/View/FormAddress';
import { FormContactModal } from './components/View/FormContactData';
import { Success } from './components/View/Success';

import { IApiProduct, IOrderFormData } from './types';
import { ensureElement, cloneTemplate } from './utils/utils';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new ApiModel(CDN_URL, API_URL);
const page = new Page(document.body, events);
const modal = new ModalWindow(ensureElement('#modal-container'), events);

const productModel = new DataModel(events);
const basketModel = new BasketModel(events);
const formModel = new FormModel(events, basketModel);

const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderFormView = new FormAddressModal(cloneTemplate(orderTemplate), events);
const contactFormView = new FormContactModal(cloneTemplate(contactsTemplate), events);
const successView = new Success(cloneTemplate(successTemplate), events);

api.getListCards()
  .then((data: IApiProduct[]) => {
    productModel.products = data;
  })
  .catch(console.error);


events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});

events.on('products:updated', (products: IApiProduct[]) => {
  page.catalog = products.map(item => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), events);
    (card['container'] as HTMLElement).addEventListener('click', () => {
      events.emit('card:select', item);
    });;
    return card.render(item);
  });
});

events.on('card:select', (item: IApiProduct) => {
  const preview = new ModalCard(cloneTemplate(cardPreviewTemplate), events);
  preview.buttonText = basketModel.products.some(p => p.id === item.id) 
    ? 'Удалить из корзины' 
    : 'В корзину';
  modal.content = preview.render(item);
  modal.open();
});

events.on('card:button_click', (data: { id: string }) => {
  const itemId = data.id;
  const item = productModel.products.find(p => p.id === itemId);
  
  if (!item) return;

  if (basketModel.products.some(p => p.id === itemId)) {
    basketModel.remove(itemId);
  } else {
    basketModel.add(item);
  }
  
  modal.close();
});

events.on('basket:changed', (items: IApiProduct[]) => {
  page.counter = items.length;
  formModel.setBasketItems(items.map(item => item.id));
  formModel.setTotal(items.reduce((sum, item) => sum + item.price, 0));
  basketView.items = items.map((item, index) => {
    const basketItem = new BasketItemView(cloneTemplate(basketItemTemplate), events);
    basketItem.onClick = () => basketModel.remove(item.id);
    return basketItem.render({
      index,
      title: item.title,
      price: item.price
    });
  });
  basketView.total = basketModel.total;
});

events.on('basket:open', () => {
  modal.content = basketView.render();
  modal.open();
});

events.on('order:open', () => {
  modal.content = orderFormView.render({
    payment: 'Онлайн',
    address: '',
    valid: false,
    errors: []
  });
  modal.open();
});

events.on('form:errors', (errors: Partial<IOrderFormData>) => {
  const { payment, address } = errors;
  orderFormView.valid = !payment && !address;
  orderFormView.errors = Object.values({ payment, address }).filter(Boolean);
});

events.on('order:address:submit', (data: Pick<IOrderFormData, 'payment' | 'address'>) => {
  formModel.setField('payment', data.payment);
  formModel.setField('address', data.address);
});

events.on('order:contacts:submit', (data: Pick<IOrderFormData, 'email' | 'phone'>) => {
  formModel.setField('email', data.email);
  formModel.setField('phone', data.phone);
});
events.on('order:submit', () => {
  modal.content = contactFormView.render({
    email: '',
    phone: '',
    valid: false,
    errors: []
  });
});

events.on('order:complete', () => {
  try {
    const orderData = formModel.getOrderData();
    api.makeOrder(orderData)
      .then(() => {
        basketModel.clear();
        successView.total = orderData.total;
        modal.content = successView.render({ total: orderData.total });
        modal.open();
      })
  } catch (error) {
    console.error('Ошибка формирования заказа:', error);
  }
});

events.on('success:close', () => {
  modal.close();
});