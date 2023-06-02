import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailOptionsType } from 'src/common/types/mail-options.type';

@Injectable()
export class EmailsService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailsService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('email.host'),
      port: configService.get('email.port'),
      secure: false,
      auth: {
        user: configService.get('email.username'),
        pass: configService.get('email.password'),
      },
    });
  }

  async sendEmail(mailOptions: MailOptionsType) {
    const info = await this.transporter.sendMail(mailOptions);
    this.logger.log('Email sent successfully! Message ID: ' + info.messageId);
  }
  catch(error: any) {
    this.logger.log('Error occurred: ' + error.message);
    throw new BadRequestException(error.message);
  }
}
