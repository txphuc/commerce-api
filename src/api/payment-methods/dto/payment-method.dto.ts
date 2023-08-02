import { Expose } from 'class-transformer';
export class PaymentMethodDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  accountNumber: string;

  @Expose()
  accountOwner: string;

  @Expose()
  qrCode?: string;

  @Expose()
  createdBy: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedBy: number;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt: Date;
}
