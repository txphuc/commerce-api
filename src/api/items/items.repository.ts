import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsRepository extends Repository<Item> {
  constructor(private dataSource: DataSource) {
    super(Item, dataSource.createEntityManager());
  }
}
