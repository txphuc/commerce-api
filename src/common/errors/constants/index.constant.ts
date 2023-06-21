import { CategoryDto } from 'src/api/categories/dto/category.dto';
import { authError } from './auth.constant';
import { commonError } from './common.constant';

export const indexError = {
  ...authError,
  ...commonError,
  ...CategoryDto,
};
