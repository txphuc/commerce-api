import { Order } from '../../../api/orders/entities/order.entity';
import { Common } from '../../../common/constants/common.constant';
import { Base } from '../../../common/entities/base.entity';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'payment_method' })
@Index('payment_methods_name_index', ['name'], { unique: true, where: 'deleted_at IS NULL' })
export class PaymentMethod extends Base {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'payment_methods_pkey' })
  id: number;

  @Column({ length: Common.Name.MAX_LENGTH })
  name: string;

  @Column({ length: Common.Description.MAX_LENGTH, nullable: true })
  description?: string;

  @Column({ name: 'account_number', length: Common.AccountNumber.MAX_LENGTH, nullable: true })
  accountNumber?: string;

  @Column({ name: 'account_owner', length: Common.Name.MAX_LENGTH, nullable: true })
  accountOwner?: string;

  @Column({ name: 'qr_code', length: Common.Images.URL_MAX_LENGTH, nullable: true })
  qrCode?: string;

  @OneToMany(() => Order, (order) => order.paymentMethod, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  orders: Order[];
}
