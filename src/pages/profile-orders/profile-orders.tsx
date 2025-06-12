import { fetchOrders } from '@slices/ordersSlice';
import { useDispatch, useSelector } from '@store';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector((state) => state.orders.data);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);
  return <ProfileOrdersUI orders={orders} />;
};
