import { authError } from './auth.constant';
import { commonError } from './common.constant';

export const indexError = {
  ...authError,
  ...commonError,
};
