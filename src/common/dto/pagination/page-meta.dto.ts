import { Expose } from 'class-transformer';
import { PageOptionsDto } from './page-options.dto';

@Expose()
export class PageMetaDto {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPrevious: boolean;
  hasNext: boolean;

  constructor(pageOptionsDto: PageOptionsDto, itemCount: number) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPrevious = this.page > 1;
    this.hasNext = this.page < this.pageCount;
  }
}
