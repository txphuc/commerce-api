import { Expose } from 'class-transformer';

export class CategoryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  specificationList: string[];

  @Expose()
  parentId: number;

  @Expose()
  createdBy: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedBy: number;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt: Date;
}
