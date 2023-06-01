import { PageOptionsDto } from '../dto/pagination/page-options.dto';

export function getSkip(pageOptionsDto: PageOptionsDto) {
  return (pageOptionsDto.page - 1) * pageOptionsDto.take;
}
