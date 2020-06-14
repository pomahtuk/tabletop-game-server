import { User } from "../dao/entities/user";
import * as nodemailer from "nodemailer";
import * as Mail from "nodemailer/lib/mailer";

export interface MailerServiceOptions {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  logging?: boolean;
}

export interface MailerService {
  sendResetEmail: (user: User) => Promise<any>;
  sendActivationEmail: (user: User) => Promise<any>;
}

export class MailerServiceImpl implements MailerService {
  private transport: Mail;
  private from = "Konquest Space <noreply@konquest.space>";

  constructor(options?: MailerServiceOptions) {
    if (options) {
      this.transport = MailerServiceImpl.createTransportFromOptions(options);
    } else {
      this.transport = MailerServiceImpl.createTransportFromEnv();
    }
  }

  public async sendResetEmail(user: User) {
    // TODO: use templates here
    return this.transport.sendMail({
      from: this.from,
      to: user.email,
      subject: "Password reset token",
      text: `Your token to reset password is: ${user.passwordResetToken}. It will expire at ${user.passwordResetTokenExpiresAt}`,
      html: `Your token to reset password is: <b>${user.passwordResetToken}</b>. It will expire at <b>${user.passwordResetTokenExpiresAt}</b>.`,
    });
  }

  public async sendActivationEmail(user: User) {
    // TODO: use templates here
    const link = `http://example.com/auth/activate/${user.activationCode}`;
    return this.transport.sendMail({
      from: this.from,
      to: user.email,
      subject: "Activate your account",
      text: `Follow this link: ${link}`,
      html: `Follow this <a href="${link}">link</a> to activate your account`,
    });
  }

  private static createTransportFromOptions(
    options: MailerServiceOptions
  ): Mail {
    return nodemailer.createTransport({
      host: options.host,
      port: options.port,
      secure: options.secure,
      auth: {
        user: options.user,
        pass: options.pass,
      },
      logger: options.logging,
      debug: options.logging,
    });
  }

  private static createTransportFromEnv(): Mail {
    const {
      SMTP_HOST = "",
      SMTP_PORT = 587,
      SMTP_SECURE = false,
      SMTP_USER,
      SMTP_PASS,
    } = process.env;
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: ~~SMTP_PORT,
      secure: SMTP_SECURE as boolean,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
}
