import { IsEnum } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/api/users/entities/user.entity';
import { Role } from 'src/common/enums/role.enum';

export class UpdateUserRoleDto {
  static resource = User.name;

  @IsEnum(Role)
  @ApiProperty({
    description: 'Role of user',
    nullable: false,
    required: true,
    example: Role.User,
  })
  role!: Role;
}
