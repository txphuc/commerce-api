import { Expose } from 'class-transformer';
import { Gender } from 'src/common/enums/gender.enum';
import { Role } from 'src/common/enums/role.enum';

export class UserDto {
  @Expose()
  userId: number;

  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  fullName: string;

  @Expose()
  gender: Gender;

  @Expose()
  birthDate: Date;

  @Expose()
  phone: string;

  @Expose()
  address: string;

  @Expose()
  role: Role;

  @Expose()
  avatar: Role;

  @Expose()
  isActivated: boolean;
}
