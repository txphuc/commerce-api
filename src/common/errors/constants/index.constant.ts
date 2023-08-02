import { authError } from './auth.constant';
import { categoryError } from './category.constant';
import { commonError } from './common.constant';
import { orderError } from './order.constant';
import { productError } from './product.constant';

export const indexError = {
  ...authError,
  ...commonError,
  ...categoryError,
  ...productError,
  ...orderError,
};
