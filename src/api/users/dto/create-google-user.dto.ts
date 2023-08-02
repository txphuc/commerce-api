import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/api/users/entities/user.entity';
import { Common, Regex } from 'src/common/constants/common.constant';

export class CreateGoogleUserDto {
  static resource = User.name;

  @MaxLength(Common.Email.MAX_LENGTH)
  @IsEmail()
  @ApiProperty({
    description: 'Email of user',
    type: String,
    nullable: false,
    required: true,
    example: 'example@email.com',
  })
  email: string;

  @MaxLength(Common.FullName.MAX_LENGTH)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Full name of user',
    type: String,
    nullable: false,
    required: true,
    example: 'User Name',
  })
  fullName: string;

  @Matches(Regex.URL)
  @IsOptional()
  @ApiProperty({
    description: 'Avatar path of user',
    nullable: true,
    required: false,
    example: 'https://example.com/avatar.jpg',
  })
  avatar?: string;

  constructor(email: string, fullName: string, avatar?: string) {
    this.email = email;
    this.fullName = fullName;
    this.avatar = avatar;
  }
}
