import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../../../common/entities/base.entity';
import { Common } from '../../../common/constants/common.constant';
import { Product } from '../../../api/products/entities/product.entity';
import { OrderItem } from '../../../api/orders/entities/order-item.entity';

@Entity({ name: 'items' })
export class Item extends Base {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'items_pkey' })
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ length: Common.Name.MAX_LENGTH })
  name: string;

  @Column({ length: Common.Description.MAX_LENGTH, nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 16, scale: 2, default: 0 })
  price: number;

  @Column('integer', { default: 0 })
  quantity: number;

  @Column('integer', { default: 0 })
  purchased: number;

  @Column('real', { default: 0 })
  discount: number;

  @Column('varchar', { array: true })
  images: string[];

  @Column({ nullable: true, type: 'jsonb' })
  specification?: object;

  @ManyToOne(() => Product, (product) => product.items, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id', foreignKeyConstraintName: 'items_product_id_fkey' })
  product: Product;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.item, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  orderItems: OrderItem[];
}
