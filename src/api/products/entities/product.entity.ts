import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from '../../../common/entities/base.entity';
import { Common } from '../../../common/constants/common.constant';
import { Category } from '../../../api/categories/entities/category.entity';
import { Item } from '../../../api/items/entities/item.entity';
import { ProductView } from './product.view.entity';

@Entity({ name: 'products' })
export class Product extends Base {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'products_pkey' })
  id: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column({ length: Common.Name.MAX_LENGTH })
  name: string;

  @Column({ length: Common.Description.MAX_LENGTH, nullable: true })
  description?: string;

  @Column('varchar', { array: true })
  images: string[];

  @ManyToOne(() => Category, (category) => category.products, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id', foreignKeyConstraintName: 'products_category_id_fkey' })
  category: Category;

  @OneToMany(() => Item, (item) => item.product, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  items: Item[];

  @OneToOne(() => ProductView, (info) => info.product)
  info: ProductView;
}
