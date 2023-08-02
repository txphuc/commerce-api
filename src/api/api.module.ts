import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmailsModule } from './emails/emails.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ItemsModule } from './items/items.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    EmailsModule,
    CategoriesModule,
    ProductsModule,
    ItemsModule,
    OrdersModule,
    PaymentMethodsModule,
  ],
})
export class ApiModule {}
