import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { commonError } from 'src/common/errors/constants/common.constant';
import { CurrentUserType } from 'src/common/types/current-user.type';
import { createErrorType } from 'src/common/types/error.type';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethod } from './entities/payment-method.entity';
import { PaymentMethodsRepository } from './payment-methods.repository';
import { Not } from 'typeorm';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class PaymentMethodsService {
  private readonly logger = new Logger(PaymentMethodsService.name);
  constructor(private readonly paymentMethodsRepository: PaymentMethodsRepository) {}

  async findOneById(id: number): Promise<PaymentMethod> {
    const paymentMethods = await this.paymentMethodsRepository.findOneBy({ id: id });
    if (!paymentMethods) {
      throw new BadRequestException(
        createErrorType(PaymentMethod.name, 'id', commonError.isNotFound, id),
      );
    }
    return paymentMethods;
  }

  async getAllPaymentMethods(currentUser: CurrentUserType) {
    return await this.paymentMethodsRepository.find({
      withDeleted: currentUser?.role === Role.Admin,
    });
  }

  async create(
    createPaymentMethodDto: CreatePaymentMethodDto,
    currentUser: CurrentUserType,
  ): Promise<PaymentMethod> {
    let paymentMethod = await this.paymentMethodsRepository.findOneBy({
      name: createPaymentMethodDto.name,
    });
    if (paymentMethod) {
      throw new BadRequestException(
        createErrorType(
          PaymentMethod.name,
          'name',
          commonError.alreadyExists,
          createPaymentMethodDto.name,
        ),
      );
    }
    paymentMethod = this.paymentMethodsRepository.create(createPaymentMethodDto);
    paymentMethod.setCreatedUser(currentUser?.userId);
    return await this.paymentMethodsRepository.save(paymentMethod);
  }

  async update(
    id: number,
    currentUser: CurrentUserType,
    updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    const paymentMethod = await this.findOneById(id);
    const otherPaymentMethodByName = await this.paymentMethodsRepository.findOne({
      where: { name: updatePaymentMethodDto.name, id: Not(id) },
    });
    if (otherPaymentMethodByName) {
      throw new BadRequestException(
        createErrorType(
          PaymentMethod.name,
          'name',
          commonError.alreadyExists,
          updatePaymentMethodDto.name,
        ),
      );
    }
    Object.assign(paymentMethod, updatePaymentMethodDto);
    paymentMethod.setUpdatedUser(currentUser?.userId);

    return await this.paymentMethodsRepository.save(paymentMethod);
  }

  async softDelete(id: number, currentUser: CurrentUserType) {
    const paymentMethod = await this.findOneById(id);
    paymentMethod.setUpdatedUser(currentUser?.userId);
    paymentMethod.deletedAt = new Date();
    await this.paymentMethodsRepository.save(paymentMethod);
  }

  async unDelete(id: number, currentUser: CurrentUserType) {
    const paymentMethod = await this.paymentMethodsRepository.findOne({
      where: { id: id },
      withDeleted: true,
    });
    if (!paymentMethod) {
      throw new BadRequestException(
        createErrorType(PaymentMethod.name, 'id', commonError.isNotFound, id),
      );
    }
    if (paymentMethod.deletedAt === null) {
      throw new BadRequestException(
        createErrorType(PaymentMethod.name, 'id', commonError.notDeletedYet, id),
      );
    }
    paymentMethod.deletedAt = null;
    paymentMethod.setUpdatedUser(currentUser?.userId);
    await this.paymentMethodsRepository.save(paymentMethod);
  }
}
