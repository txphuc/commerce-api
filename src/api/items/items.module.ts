import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { ItemsRepository } from './items.repository';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), ProductsModule],
  controllers: [ItemsController],
  providers: [ItemsService, ItemsRepository],
})
export class ItemsModule {}
