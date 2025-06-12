import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrdersState = {
  data: TOrder[];
  error: null | SerializedError;
  isOrderLoading: boolean;
  isOrdersLoading: boolean;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

export const initialState: TOrdersState = {
  data: [],
  isOrderLoading: true,
  isOrdersLoading: true,
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const fetchOrders = createAsyncThunk(
  'orders/fetch',
  async () => await getOrdersApi()
);

export const createOrder = createAsyncThunk<
  { order: TOrder; name: string },
  string[]
>('createOrder/fetch', async (data, { rejectWithValue }) => {
  const res = await orderBurgerApi(data);
  if (!res?.success) {
    return rejectWithValue(res);
  }
  return { order: res.order, name: res.name };
});

export const fetchOrder = createAsyncThunk<TOrder, number>(
  'order/fetch',
  async (data, { rejectWithValue }) => {
    const res = await getOrderByNumberApi(data);
    if (!res?.success) {
      return rejectWithValue(res);
    }
    return res.orders[0];
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearModalData: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.isOrderLoading = true;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orderModalData = action.payload;
      })
      .addCase(fetchOrder.rejected, (state) => {
        state.isOrderLoading = false;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.error;
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
      });
  }
});

export const { clearModalData } = ordersSlice.actions;
export default ordersSlice.reducer;
