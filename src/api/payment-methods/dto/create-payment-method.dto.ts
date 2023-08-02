import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Common, Regex } from 'src/common/constants/common.constant';
import { PaymentMethod } from '../entities/payment-method.entity';

export class CreatePaymentMethodDto {
  static resource = PaymentMethod.name;

  @ApiProperty({
    description: 'Name of payment method',
    type: String,
    nullable: false,
    required: true,
    example: 'example',
  })
  @MaxLength(Common.Name.MAX_LENGTH)
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of product',
    type: String,
    nullable: true,
    required: false,
    example: 'example',
  })
  @MaxLength(Common.Description.MAX_LENGTH)
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Account number (bank code)',
    type: String,
    nullable: true,
    required: false,
    example: '0123456789',
  })
  @MaxLength(Common.AccountNumber.MAX_LENGTH)
  @IsNumberString()
  @IsOptional()
  accountNumber?: string;

  @ApiProperty({
    description: 'Account Owner',
    type: String,
    nullable: true,
    required: false,
    example: 'example',
  })
  @MaxLength(Common.Name.MAX_LENGTH)
  @IsString()
  @IsOptional()
  accountOwner?: string;

  @Matches(Regex.URL)
  @IsOptional()
  @ApiProperty({
    description: 'Avatar path of user',
    nullable: true,
    required: false,
    type: String,
    example: 'https://example.com/avatar.jpg',
  })
  qrCode?: string;
}
