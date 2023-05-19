import { Common } from '../../../common/constants/common.constant';
import { Base } from '../../../common/entities/base.entity';
import { Gender } from '../../../common/enums/gender.enum';
import { Role } from '../../../common/enums/role.enum';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@Index('users_email_index', ['email'], {
  unique: true,
  where: 'deleted_at IS NULL',
})
export class User extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: Common.Email.MAX_LENGTH })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true, name: 'full_name', length: Common.FullName.MAX_LENGTH })
  fullName?: string;

  @Column({ nullable: true, type: 'enum', enum: Gender })
  gender?: Gender;

  @Column({ nullable: true, length: Common.Phone.MAX_LENGTH })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ name: 'is_activated', default: false })
  isActivated: boolean;

  @Column({ name: 'activation_key', nullable: true })
  activationKey: string;

  @Column({ name: 'reset_token', nullable: true })
  resetToken: string;

  @Column({ name: 'reset_token_exp', nullable: true })
  resetTokenExp: Date;
}
