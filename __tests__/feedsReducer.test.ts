import reducer, {
  fetchFeeds,
  initialState
} from '../src/services/slices/feedsSlice';

const feedsMockData = {
  success: true,
  orders: [],
  total: 1,
  totalToday: 1
};

describe('Тестирование feedsReducer', () => {
  describe('Асинхронная функция для получения ленты заказов: fetchFeeds', () => {
    test('Начало запроса: fetchFeeds.pending', () => {
      const state = reducer(initialState, fetchFeeds.pending('pending'));

      expect(state.isLoading).toBeTruthy();
      expect(state.error).toBeNull();
    });

    test('Результат запроса: fetchFeeds.fulfilled', () => {
      const state = reducer(
        initialState,
        fetchFeeds.fulfilled(feedsMockData, 'fulfilled')
      );

      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.data).toEqual(feedsMockData);
    });

    test('Ошибка запроса: fetchFeeds.rejected', () => {
      const error = 'fetchFeeds.rejected';

      const state = reducer(
        initialState,
        fetchFeeds.rejected(new Error(error), 'rejected')
      );

      expect(state.isLoading).toBeFalsy();
      expect(state.error?.message).toEqual(error);
    });
  });
});
