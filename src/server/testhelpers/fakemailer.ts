import { MailerService } from "../services/mailer.service";
import { User } from "../dao/entities/user";

export class FakeMailer implements MailerService {
  private readonly sender: (user: User) => any;

  constructor(sender: (user: User) => any) {
    this.sender = sender;
  }

  public async sendResetEmail(user: User): Promise<any> {
    this.sender(user);
  }

  public async sendActivationEmail(user: User): Promise<any> {
    this.sender(user);
  }
}
