import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { User } from '../entities/user.entity';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'email', 'role']),
) {
  static resource = User.name;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Avatar path of user',
    nullable: true,
    required: false,
    type: String,
    example: 'https://example.com/avatar.jpg',
  })
  avatar?: string;
}
