import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PageMetaDto } from './page-meta.dto';
import { IsArray } from '@nestjs/class-validator';

@Expose()
export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
