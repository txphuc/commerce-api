import { Expose } from 'class-transformer';
import { Item } from '../entities/item.entity';

export class ItemDto {
  static resource = Item.name;

  @Expose()
  id: number;

  @Expose()
  productId: number;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
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
