import reducer, {
  fetchUser,
  updateUser,
  register,
  login,
  logout,
  initialState
} from '../src/services/slices/userSlice';

const userMockData = {
  email: 'example@example.mail',
  name: 'Example'
};

const registerMockData = {
  email: 'example@example.mail',
  name: 'Example',
  password: 'Example'
};

const loginMockData = {
  email: 'example@example.mail',
  password: 'Example'
};

describe('Тестирование userReducer', () => {
  // Регистрация
  describe('Асинхронная функция для регистрации: register', () => {
    test('Начало запроса: register.pending', () => {
      const state = reducer(
        initialState,
        register.pending('pending', registerMockData)
      );

      expect(state.registerError).toBeUndefined();
    });

    test('Результат запроса: register.fulfilled', () => {
      const state = reducer(
        initialState,
        register.fulfilled(userMockData, 'fulfilled', registerMockData)
      );

      expect(state.isAuthenticated).toBeTruthy();
      expect(state.registerError).toBeUndefined();
      expect(state.data).toEqual(userMockData);
    });

    test('Ошибка запроса: register.rejected', () => {
      const error = 'register.rejected';

      const state = reducer(
        initialState,
        register.rejected(new Error(error), 'rejected', registerMockData)
      );

      expect(state.registerError?.message).toEqual('Неверные данные');
    });
  });

  // Логин
  describe('Асинхронная функция для входа в аккаунт: login', () => {
    test('Начало запроса: login.pending', () => {
      const state = reducer(
        initialState,
        login.pending('pending', loginMockData)
      );

      expect(state.loginError).toBeUndefined();
    });

    test('Результат запроса: login.fulfilled', () => {
      const state = reducer(
        initialState,
        login.fulfilled(userMockData, 'fulfilled', loginMockData)
      );

      expect(state.isAuthenticated).toBeTruthy();
      expect(state.loginError).toBeUndefined();
      expect(state.data).toEqual(userMockData);
    });

    test('Ошибка запроса: login.rejected', () => {
      const error = 'login.rejected';

      const state = reducer(
        initialState,
        login.rejected(new Error(error), 'rejected', loginMockData)
      );

      expect(state.loginError?.message).toEqual(error);
    });
  });

  // Выход
  describe('Асинхронная функция выхода из аккаунта: logout', () => {
    test('Результат запроса: logout.fulfilled', () => {
      const state = reducer(
        initialState,
        logout.fulfilled(undefined, 'fulfilled')
      );

      expect(state.isAuthenticated).toBeFalsy();
      expect(state.data).toEqual({
        email: '',
        name: ''
      });
    });
  });

  // Проверка авторизации
  describe('Асинхронная функция проверки авторизации: fetchUser', () => {
    test('Результат запроса: fetchUser.fulfilled', () => {
      const state = reducer(
        initialState,
        fetchUser.fulfilled(userMockData, 'fulfilled')
      );

      expect(state.isAuthenticated).toBeTruthy();
      expect(state.isAuthChecked).toBeTruthy();
      expect(state.data).toEqual(userMockData);
    });

    test('Ошибка запроса: fetchUser.rejected', () => {
      const error = 'fetchUser.rejected';

      const state = reducer(
        initialState,
        fetchUser.rejected(new Error(error), 'rejected')
      );

      expect(state.isAuthenticated).toBeFalsy();
      expect(state.isAuthChecked).toBeTruthy();
    });
  });

  // Обновление информации о пользователе
  describe('Асинхронная функция редактирования информации пользователя: updateUser', () => {
    test('Результат запроса: updateUser.fulfilled', () => {
      const state = reducer(
        initialState,
        updateUser.fulfilled(userMockData, 'fulfilled', userMockData)
      );

      expect(state.data).toEqual(userMockData);
    });
  });
});
