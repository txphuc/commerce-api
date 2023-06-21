import { Category } from 'src/api/categories/entities/category.entity';

export const CategoryError = {
  invalidParent: {
    code: 'category-3000',
    field: 'parentId',
    resource: Category.name,
  },
};
