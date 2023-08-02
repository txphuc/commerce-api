import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from './page-options.dto';
import { IsBoolean, IsEnum, IsOptional } from '@nestjs/class-validator';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { Transform, Type } from 'class-transformer';

export class OrderPageOptionsDto extends PageOptionsDto {
  static resource = OrderPageOptionsDto.name;

  @ApiPropertyOptional({ enum: OrderStatus, default: null })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus = null;

  @ApiPropertyOptional({ default: null })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) {
      return true;
    }
    if (value === null || value === undefined) {
      return value;
    }
    return false;
  })
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean = null;
}
