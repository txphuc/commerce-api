import { Common } from '../../../common/constants/common.constant';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Item } from '../../../api/items/entities/item.entity';
import { Base } from '../../../common/entities/base.entity';

@Entity({ name: 'order_items' })
@Index('order_id_item_id_unique_index', ['orderId', 'itemId'], { unique: true })
@Index('order_id_index', ['orderId'])
@Index('item_id_index', ['itemId'])
export class OrderItem extends Base {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'order_items_pkey' })
  id: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'item_id' })
  itemId: number;

  @Column('int4', { default: 1 })
  quantity: number;

  @Column({ name: 'original_amount', type: 'decimal', precision: 16, scale: 2, default: 0 })
  originalAmount: number;

  @Column({ name: 'actual_amount', type: 'decimal', precision: 16, scale: 2, default: 0 })
  actualAmount: number;

  @Column({ length: Common.Comment.MAX_LENGTH, nullable: true })
  comment?: string;

  @Column('varchar', { array: true, nullable: true })
  images?: string[];

  @Column('int2', { nullable: true })
  rating?: number;

  @ManyToOne(() => Order, (order) => order.orderItems, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id', foreignKeyConstraintName: 'order_items_ order_id_fkey' })
  order: Order;

  @ManyToOne(() => Item, (item) => item.orderItems, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'item_id', foreignKeyConstraintName: 'order_items_ item_id_fkey' })
  item: Item;
}
