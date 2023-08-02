import { ApiProperty } from '@nestjs/swagger';
import { SignInDto } from './sign-in.dto';
import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class ResetPasswordDto extends SignInDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Reset Password Token',
    type: String,
    nullable: false,
    required: true,
    example: 'example@email.com',
  })
  resetToken: string;
}
