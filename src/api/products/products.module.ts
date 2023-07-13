import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsRepository } from './products.repository';
import { Product } from './entities/product.entity';
import { CategoriesModule } from '../categories/categories.module';
import { Item } from '../items/entities/item.entity';
import { ProductView } from './entities/product.view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Item, ProductView]), CategoriesModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
