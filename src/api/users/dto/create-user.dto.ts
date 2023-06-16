import {
  IsEmail,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/api/users/entities/user.entity';
import { Common, Regex } from 'src/common/constants/common.constant';
import { Gender, GenderArray } from 'src/common/enums/gender.enum';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
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

  @Matches(Regex.PASSWORD)
  @ApiProperty({
    description: 'User password must match regex',
    type: String,
    nullable: false,
    required: true,
    example: 'Aa@123456',
  })
  password: string;

  @MaxLength(Common.FullName.MAX_LENGTH)
  @IsString()
  @ApiProperty({
    description: 'Full name of user',
    type: String,
    nullable: false,
    required: true,
    example: 'User Name',
  })
  fullName: string;

  @IsEnum(Gender)
  @ApiProperty({
    description: `Gender of user: ${Gender.Male} is male, ${Gender.Female} is female, ${Gender.Others} is others`,
    enum: GenderArray,
    nullable: false,
    required: true,
    example: Gender.Male,
  })
  gender: Gender;

  @Matches(Regex.DATE)
  @ApiProperty({
    description: 'Birthday of user',
    type: 'string(Date)',
    nullable: false,
    required: true,
    example: '1997-02-20',
  })
  birthday: Date;

  @MaxLength(Common.Phone.MAX_LENGTH)
  @IsNumberString()
  @ApiProperty({
    description: 'Phone number of user',
    type: String,
    nullable: false,
    required: true,
    example: '0905123456',
  })
  phone: string;

  @IsString()
  @ApiProperty({
    description: 'Address of user',
    type: String,
    nullable: false,
    required: true,
    example: 'Danang',
  })
  address: string;

  @IsEnum(Role)
  @IsOptional()
  @ApiProperty({
    description: 'Role of user',
    nullable: true,
    required: false,
    example: Role.User,
  })
  role?: Role;
}
