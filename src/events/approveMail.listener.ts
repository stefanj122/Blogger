import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Comment } from 'src/entitie/comment.entity';
import { User } from 'src/entitie/user.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ApproveMailListener {
  constructor(private readonly mailService: MailService) {}
  @OnEvent('newComment')
  async handlePostVisit(user: User, comment: Comment) {
    return await this.mailService.sendApprove(user, comment);
  }
}
