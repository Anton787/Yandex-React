import reducer, {
  fetchIngredients,
  initialState
} from '../src/services/slices/ingredientsSlice';

// import reducer from '../src/services/slices/ingredientsSlice';

const ingredientsMockData = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
  }
];

describe('Тестирование ingredientsReducer', () => {
  describe('Асинхронная функция для получения ингридиентов: fetchIngredients', () => {
    test('Начало запроса: fetchIngredients.pending', () => {
      const state = reducer(initialState, fetchIngredients.pending('pending'));

      expect(state.isLoading).toBeTruthy();
      expect(state.error).toBeNull();
    });

    test('Результат запроса: fetchIngredients.fulfilled', () => {
      const state = reducer(
        initialState,
        fetchIngredients.fulfilled(ingredientsMockData, 'fulfilled')
      );

      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.data).toEqual(ingredientsMockData);
    });

    test('Ошибка запроса: fetchIngredients.rejected', () => {
      const error = 'fetchIngredients.rejected';

      const state = reducer(
        initialState,
        fetchIngredients.rejected(new Error(error), 'rejected')
      );

      expect(state.isLoading).toBeFalsy();
      expect(state.error?.message).toEqual(error);
    });
  });
});
