import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from '@nestjs/class-validator';
import { Order } from 'src/common/enums/order.enum';

export class PageOptionsDto {
  static resource = PageOptionsDto.name;

  @ApiPropertyOptional({
    default: '',
  })
  @IsString()
  @IsOptional()
  search?: string = '';

  @ApiPropertyOptional({
    minimum: 0,
    default: 0,
  })
  @Type(() => Number)
  @Min(0)
  @IsInt()
  @IsOptional()
  page?: number = 0;

  @ApiPropertyOptional({
    minimum: 1,
    default: 10,
  })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  @IsOptional()
  take?: number = 10;

  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  order?: Order = Order.ASC;
}
