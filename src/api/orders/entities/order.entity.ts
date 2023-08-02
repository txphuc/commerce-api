import { User } from '../../../api/users/entities/user.entity';
import { Common } from '../../../common/constants/common.constant';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Base } from '../../../common/entities/base.entity';
import { PaymentMethod } from '../../../api/payment-methods/entities/payment-method.entity';

@Entity({ name: 'orders' })
export class Order extends Base {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'orders_pkey' })
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'is_paid', default: false })
  isPaid: boolean;

  @Column({ name: 'payment_method_id' })
  paymentMethodId: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Unconfirmed })
  status: OrderStatus;

  @Column({ name: 'canceled_date_time', type: 'timestamptz', nullable: true })
  canceledDateTime?: Date;

  @Column({ name: 'confirmed_date_time', type: 'timestamptz', nullable: true })
  confirmedDateTime?: Date;

  @Column({ name: 'start_delivering_date_time', type: 'timestamptz', nullable: true })
  startDeliveringDateTime?: Date;

  @Column({ name: 'completed_date_time', type: 'timestamptz', nullable: true })
  completedDateTime?: Date;

  @Column({ name: 'planned_delivery_date', type: 'timestamptz', nullable: true })
  plannedDeliveryDate?: Date;

  @Column({ length: Common.Name.MAX_LENGTH })
  receiver: string;

  @Column({ length: Common.Address.MAX_LENGTH })
  address: string;

  @Column({ length: Common.Phone.MAX_LENGTH })
  phone: string;

  @Column({ name: 'delivery_fee', type: 'decimal', precision: 16, scale: 2, default: 0 })
  deliveryFee: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  orderItems: OrderItem[];

  @ManyToOne(() => User, (user) => user.orders, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'orders_user_id_fkey' })
  user: User;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.orders, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'payment_method_id',
    foreignKeyConstraintName: 'orders_payment_method_id_fkey',
  })
  paymentMethod: PaymentMethod;
}
