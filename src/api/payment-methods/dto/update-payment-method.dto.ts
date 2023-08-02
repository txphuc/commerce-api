import { PartialType } from '@nestjs/swagger';
import { CreatePaymentMethodDto } from './create-payment-method.dto';
import { PaymentMethod } from '../entities/payment-method.entity';

export class UpdatePaymentMethodDto extends PartialType(CreatePaymentMethodDto) {
  static resource = PaymentMethod.name;
}
