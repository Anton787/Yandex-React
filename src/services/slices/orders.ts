import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { clearIngredients } from '@slices/builderSlice';
import { createOrder } from '@slices/ordersSlice';

import { AppDispatch, RootState } from '@store';

export const ordersMiddleware: Middleware =
  (store: MiddlewareAPI<AppDispatch, RootState>) => (next) => (action) => {
    if (createOrder.fulfilled.match(action)) {
      store.dispatch(clearIngredients());
    }

    next(action);
  };
