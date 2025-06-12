import reducer, {
  fetchOrder,
  fetchOrders,
  createOrder,
  clearModalData,
  initialState
} from '../src/services/slices/ordersSlice';

const ordersMockData = [
  {
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093d'
    ],
    _id: '6622337897ede0001d0666b5',
    status: 'done',
    name: 'EXAMPLE_NAME',
    createdAt: '2025-04-19T09:03:52.748Z',
    updatedAt: '2025-04-19T09:03:58.057Z',
    number: 38321
  }
];

describe('Тестирование ordersReducer', () => {
  test('Сброс содержимого модального окна заказа', () => {
    const _initialState = {
      isOrderLoading: true,
      isOrdersLoading: true,
      orderRequest: false,
      orderModalData: ordersMockData[0],
      error: null,
      data: []
    };

    const state = reducer(_initialState, clearModalData());

    // Модальное окно очистилось не затронув другие состояния
    expect(state.orderModalData).toBeNull();
    expect(state.data).toHaveLength(0);
    expect(state.error).toBeNull();
    expect(state.orderRequest).toBeFalsy();
    expect(state.isOrdersLoading).toBeTruthy();
    expect(state.isOrderLoading).toBeTruthy();
  });

  describe('Асинхронная функция для получения заказов: fetchOrders', () => {
    test('Начало запроса: fetchOrders.pending', () => {
      const state = reducer(initialState, fetchOrders.pending('pending'));

      expect(state.isOrdersLoading).toBeTruthy();
      expect(state.error).toBeNull();
    });

    test('Результат запроса: fetchOrders.fulfilled', () => {
      const state = reducer(
        initialState,
        fetchOrders.fulfilled(ordersMockData, 'fulfilled')
      );

      expect(state.isOrdersLoading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.data).toEqual(ordersMockData);
    });

    test('Ошибка запроса: fetchOrders.rejected', () => {
      const error = 'fetchOrders.rejected';

      const state = reducer(
        initialState,
        fetchOrders.rejected(new Error(error), 'rejected')
      );

      expect(state.isOrdersLoading).toBeFalsy();
      expect(state.error?.message).toEqual(error);
    });
  });

  describe('Асинхронная функция для получения заказа по номеру: fetchOrder', () => {
    test('Начало запроса: fetchOrder.pending', () => {
      const state = reducer(
        initialState,
        fetchOrder.pending('pending', ordersMockData[0].number)
      );

      expect(state.isOrderLoading).toBeTruthy();
    });

    test('Результат запроса: fetchOrder.fulfilled', () => {
      const state = reducer(
        initialState,
        fetchOrder.fulfilled(
          ordersMockData[0],
          'fulfilled',
          ordersMockData[0].number
        )
      );

      expect(state.isOrderLoading).toBeFalsy();
      expect(state.orderModalData).toEqual(ordersMockData[0]);
    });

    test('Ошибка запроса: fetchOrder.rejected', () => {
      const error = 'fetchOrder.rejected';

      const state = reducer(
        initialState,
        fetchOrder.rejected(new Error(error), 'rejected', -1)
      );

      expect(state.isOrderLoading).toBeFalsy();
    });
  });

  describe('Асинхронная функция для создания заказа: createOrder', () => {
    test('Начало запроса: createOrder.pending', () => {
      const state = reducer(
        initialState,
        createOrder.pending('pending', ordersMockData[0].ingredients)
      );

      expect(state.orderRequest).toBeTruthy();
    });

    test('Результат запроса: createOrder.fulfilled', () => {
      const state = reducer(
        initialState,
        createOrder.fulfilled(
          { order: ordersMockData[0], name: 'EXAMPLE' },
          'fulfilled',
          ordersMockData[0].ingredients
        )
      );

      expect(state.orderRequest).toBeFalsy();
      expect(state.orderModalData).toEqual(ordersMockData[0]);
    });

    test('Ошибка запроса: createOrder.rejected', () => {
      const error = 'createOrder.rejected';

      const state = reducer(
        initialState,
        createOrder.rejected(new Error(error), 'rejected', [])
      );

      expect(state.orderRequest).toBeFalsy();
    });
  });
});
