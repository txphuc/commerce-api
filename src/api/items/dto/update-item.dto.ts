import { PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';
import { Item } from '../entities/item.entity';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  static resource = Item.name;
}
