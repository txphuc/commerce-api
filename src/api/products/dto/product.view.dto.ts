import { Expose, Transform } from 'class-transformer';

export class ProductViewDto {
  @Expose()
  @Transform(({ value }) => Number(value))
  minPrice: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  maxPrice: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  minDiscount: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  maxDiscount: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  totalQuantity: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  totalPurchased: number;
}
