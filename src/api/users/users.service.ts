import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/common/enums/role.enum';
import { hash } from 'src/common/utils/bcrypt.util';
import { authError } from 'src/common/errors/constants/auth.constant';
import { commonError } from 'src/common/errors/constants/common.constant';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';
import { UsersRepository } from './users.repository';
import { PageDto } from 'src/common/dto/pagination/page.tdo';
import { PageOptionsDto } from 'src/common/dto/pagination/page-options.dto';
import { v4 as uuid } from 'uuid';
import { EmailsService } from '../emails/emails.service';
import { ConfigService } from '@nestjs/config';
import { MailOptionsType } from 'src/common/types/mail-options.type';
import { addMinutes, isAfter } from 'date-fns';
import { createErrorType } from 'src/common/types/error.type';
import { getConfirmEmail } from 'src/common/utils/html.util';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailsService: EmailsService,
    private readonly configService: ConfigService,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findOneById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    throw new NotFoundException({
      resource: User.name,
      field: 'id',
      code: commonError.isNotFound,
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    let user = await this.findOneByEmail(createUserDto.email);
    if (user) {
      if (user.isActivated) {
        throw new BadRequestException(authError.unConfirmedEmail);
      } else {
        throw new BadRequestException(authError.isExistEmail);
      }
    } else {
      createUserDto.role = Role.User;
      user = this.usersRepository.create(createUserDto);
      user.password = await hash(createUserDto.password);
      this.sendConfirmEmail(user);
      return await this.usersRepository.save(user);
    }
  }

  async createGoogleUser(createGoogleUserDto: CreateGoogleUserDto): Promise<User> {
    const user = this.usersRepository.create(createGoogleUserDto);
    user.role = Role.User;
    user.isActivated = true;
    return await this.usersRepository.save(user);
  }

  async getAllUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    return await this.usersRepository.getAllUsersPagination(pageOptionsDto);
  }

  async confirmEmail(email: string, activationKey: string) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException(createErrorType(User.name, 'email', commonError.isNotFound));
    }
    if (user.isActivated) {
      throw new BadRequestException(authError.alreadyConfirmedEmail);
    }
    if (user.activationExp && isAfter(new Date(), user.activationExp)) {
      throw new BadRequestException(authError.expiredActivation);
    }
    if (user.activationKey !== activationKey) {
      throw new BadRequestException(authError.wrongActivationKey);
    }
    user.isActivated = true;
    user.activationKey = null;
    user.activationExp = null;
    return await this.usersRepository.save(user);
  }

  async resendConfirmEmail(email: string): Promise<void> {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException(createErrorType(User.name, 'email', commonError.isNotFound));
    }
    if (user.isActivated) {
      throw new BadRequestException(authError.alreadyConfirmedEmail);
    }
    await this.sendConfirmEmail(user);
    await this.usersRepository.save(user);
  }

  private async sendConfirmEmail(user: User): Promise<void> {
    user.activationKey = uuid();
    const now = new Date();
    user.activationExp = addMinutes(now, 30);
    const confirmationUrl = `${this.configService.get('email.confirmationUrl')}?email=${
      user.email
    }&activationKey=${user.activationKey}`;
    const mailOptions: MailOptionsType = {
      from: this.configService.get('email.username'),
      to: user.email,
      subject: 'Confirm email',
      html: getConfirmEmail(confirmationUrl),
    };
    await this.emailsService.sendEmail(mailOptions);
  }
}
