import auth from './auth';
import category from './category';
import common from './common';
import product from './product';

export default {
  ...common,
  ...auth,
  ...category,
  ...product,
};
