import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Comment } from 'src/entitie/comment.entity';
import { User } from 'src/entitie/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendApprove(user: User, comment: Comment) {
    const urlApprove = `http://localhost:3000/comment/approve/${comment.id}/?approve=true`;
    const urlDontApprove = `http://localhost:3000/comment/approve/${comment.id}/?approve=false`;

    const result = await this.mailerService.sendMail({
      to: user.email,
      from: 'stefan.jeftic122@gmail.com',
      template: './obradMail',
      subject: 'Approve Comment',
      context: {
        name: user.name,
        title: comment.title,
        content: comment.content,
        urlApprove,
        urlDontApprove,
      },
    });
    console.log(result);
  }
}
