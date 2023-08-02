import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { User } from '../entities/user.entity';
import { IsOptional, Matches } from '@nestjs/class-validator';
import { Regex } from 'src/common/constants/common.constant';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'email', 'role']),
) {
  static resource = User.name;

  @Matches(Regex.URL)
  @IsOptional()
  @ApiProperty({
    description: 'Avatar path of user',
    nullable: true,
    required: false,
    type: String,
    example: 'https://example.com/avatar.jpg',
  })
  avatar?: string;
}
