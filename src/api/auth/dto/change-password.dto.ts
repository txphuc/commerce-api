import { IsString, Matches } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { User } from 'src/api/users/entities/user.entity';
import { Regex } from 'src/common/constants/common.constant';

export class ChangePasswordDto {
  static resource = User.name;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User old password',
    type: String,
    nullable: true,
    required: false,
    example: 'Aa@123456',
  })
  oldPassword: string;

  @Matches(Regex.PASSWORD)
  @ApiProperty({
    description: 'User new password',
    type: String,
    nullable: false,
    required: true,
    example: 'Aa@123456',
  })
  newPassword: string;
}
