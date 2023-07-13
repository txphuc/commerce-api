import { Product } from '../../products/entities/product.entity';
import { Common } from '../../../common/constants/common.constant';
import { Base } from '../../../common/entities/base.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
@Index('categories_name_index', ['name'], { unique: true, where: 'deleted_at IS NULL' })
export class Category extends Base {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'categories_pkey' })
  id: number;

  @Column({ length: Common.Name.MAX_LENGTH })
  name: string;

  @Column({ length: Common.Description.MAX_LENGTH, nullable: true })
  description: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column('varchar', { name: 'specification_list', nullable: true, array: true })
  specificationList: string[];

  @ManyToOne(() => Category, (category) => category.children, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id', foreignKeyConstraintName: 'categories_category_id_fkey' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  children: Category[];

  @OneToMany(() => Product, (product) => product.category, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  products: Product[];
}
