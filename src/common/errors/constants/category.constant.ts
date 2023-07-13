import { Category } from 'src/api/categories/entities/category.entity';

export const categoryError = {
  invalidParent: {
    code: 'category-3000',
    field: 'parentId',
    resource: Category.name,
  },
  isValidSpecificationList: 'category-3000',
};
