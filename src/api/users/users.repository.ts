import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { PageOptionsDto } from 'src/common/dto/pagination/page-options.dto';
import { PageDto } from 'src/common/dto/pagination/page.tdo';
import { PageMetaDto } from 'src/common/dto/pagination/page-meta.dto';
import { getSkip } from 'src/common/utils/pagination.util';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async getAllUsersPagination(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    const { search, order, page, take } = pageOptionsDto;
    console.log(page);
    const queryBuilder = this.createQueryBuilder('user');
    queryBuilder.orderBy('user.id', order);
    if (page) {
      queryBuilder.skip(getSkip(pageOptionsDto)).take(take);
    }

    if (pageOptionsDto.search) {
      queryBuilder
        .where('user.email ilike :email', { email: `%${search}%` })
        .orWhere('user.full_name ilike :fullName', { fullName: `%${search}%` })
        .orWhere('user.phone ilike :phone', { phone: `%${search}%` })
        .orWhere('user.address ilike :address', { address: `%${search}%` });
    }
    const [entities, itemCount] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto(pageOptionsDto, itemCount);

    if (!page) {
      pageMetaDto.take = itemCount;
      pageMetaDto.pageCount = 1;
      pageMetaDto.hasNext = false;
      pageMetaDto.hasPrevious = false;
    }

    return new PageDto(entities, pageMetaDto);
  }
}
