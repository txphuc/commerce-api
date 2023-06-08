import { IsEmail, IsString, Matches, MaxLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { User } from 'src/api/users/entities/user.entity';
import { Common, Regex } from 'src/common/constants/common.constant';

export class changePasswordDto {
  static resource = User.name;

  @IsEmail()
  @MaxLength(Common.Email.MAX_LENGTH)
  @ApiProperty({
    description: 'Email of user',
    type: String,
    nullable: false,
    required: true,
    example: 'example@email.com',
  })
  email: string;

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
