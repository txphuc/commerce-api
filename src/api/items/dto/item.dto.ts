import { Expose, Transform } from 'class-transformer';

export class ItemDto {
  @Expose()
  id: number;

  @Expose()
  productId: number;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  @Transform(({ value }) => Number(value))
  price: number;

  @Expose()
  quantity: number;

  @Expose()
  purchased: number;

  @Expose()
  discount: number;

  @Expose()
  images: string[];

  @Expose()
  specification?: object;

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
