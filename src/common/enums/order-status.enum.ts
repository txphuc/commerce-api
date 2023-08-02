export enum OrderStatus {
  Unconfirmed = 'Unconfirmed',
  Canceled = 'Canceled',
  Confirmed = 'Confirmed',
  Preparing = 'Preparing',
  Delivering = 'Delivering',
  Completed = 'Completed',
}

export const OrderStatusArray = [
  OrderStatus.Unconfirmed,
  OrderStatus.Canceled,
  OrderStatus.Confirmed,
  OrderStatus.Preparing,
  OrderStatus.Delivering,
  OrderStatus.Completed,
];
