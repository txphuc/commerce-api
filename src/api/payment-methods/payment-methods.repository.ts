import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PaymentMethod } from './entities/payment-method.entity';

@Injectable()
export class PaymentMethodsRepository extends Repository<PaymentMethod> {
  constructor(private dataSource: DataSource) {
    super(PaymentMethod, dataSource.createEntityManager());
  }
}
