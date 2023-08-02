import { Expose, Type } from 'class-transformer';
import { ItemDto } from 'src/api/items/dto/item.dto';

export class OrderItemDto {
  @Expose()
  id: number;

  @Expose()
  quantity: number;

  @Expose()
  originalAmount: number;

  @Expose()
  actualAmount: number;

  @Expose()
  comment: string;

  @Expose()
  images: string[];

  @Expose()
  rating: number;

  @Expose()
  @Type(() => ItemDto)
  item: ItemDto;

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
