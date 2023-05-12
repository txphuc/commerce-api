import { IsEmail, Matches, MaxLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/api/users/entities/user.entity';
import { Common, Regex } from 'src/common/constants/common.constant';

export class SignInDto {
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

  @Matches(Regex.PASSWORD)
  @ApiProperty({
    description: 'User password must match regex',
    type: String,
    nullable: false,
    required: true,
    example: 'Aa@123456',
  })
  password: string;
}
