import { PartialType } from '@nestjs/mapped-types';
import { CreateGoogleUserDto } from './create-google-user.dto';
import { User } from '../entities/user.entity';

export class UpdateGoogleUserDto extends PartialType(CreateGoogleUserDto) {
  static resource = User.name;
}
