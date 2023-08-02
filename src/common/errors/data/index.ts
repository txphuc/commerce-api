import auth from './auth';
import category from './category';
import common from './common';
import order from './order';
import product from './product';

export default {
  ...common,
  ...auth,
  ...category,
  ...product,
  ...order,
};
