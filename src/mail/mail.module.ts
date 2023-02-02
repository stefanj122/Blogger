import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ApproveMailListener } from 'src/events/approveMail.listener';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp-relay.sendinblue.com',
        secure: false,
        port: 587,
        auth: {
          user: 'stefan.jeftic122@gmail.com',
          pass: 'xsmtpsib-f330f922361a0a6f0f954fe1a974fd7d6f5a00f50aacbda0de0717444b8ec518-m3IdRJx7fYMbXHra',
        },
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          secret: true,
        },
      },
    }),
  ],
  providers: [MailService, ApproveMailListener],
  exports: [MailService],
})
export class MailModule {}
