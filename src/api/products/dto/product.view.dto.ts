import { Expose } from 'class-transformer';

export class ProductViewDto {
  @Expose()
  minPrice: number;

  @Expose()
  maxPrice: number;

  @Expose()
  minDiscount: number;

  @Expose()
  maxDiscount: number;

  @Expose()
  totalQuantity: number;

  @Expose()
  totalPurchased: number;
}
