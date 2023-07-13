import { OneToOne, ViewColumn, ViewEntity } from 'typeorm';
import { Product } from './product.entity';

@ViewEntity({
  expression: (connection) =>
    connection
      .createQueryBuilder()
      .select('product.id', 'product_id')
      .addSelect('MIN(item.price)', 'min_price')
      .addSelect('MAX(item.price)', 'max_price')
      .addSelect('MIN(item.discount)', 'min_discount')
      .addSelect('MAX(item.discount)', 'max_discount')
      .addSelect('SUM(item.quantity)', 'total_quantity')
      .addSelect('SUM(item.purchased)', 'total_purchased')
      .from(Product, 'product')
      .leftJoin('product.items', 'item')
      .where('product.deleted_at is null and item.deleted_at is null')
      .groupBy('product.id'),
})
export class ProductView {
  @ViewColumn({ name: 'product_id' })
  productId: number;

  @ViewColumn({ name: 'min_price' })
  minPrice: number;

  @ViewColumn({ name: 'max_price' })
  maxPrice: number;

  @ViewColumn({ name: 'min_discount' })
  minDiscount: number;

  @ViewColumn({ name: 'max_discount' })
  maxDiscount: number;

  @ViewColumn({ name: 'total_quantity' })
  totalQuantity: number;

  @ViewColumn({ name: 'total_purchased' })
  totalPurchased: number;

  @OneToOne(() => Product, (product) => product.info)
  product: Product;
}
