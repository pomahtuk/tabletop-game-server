import { UsersService } from "./users.service";
import crypto from "crypto";
import { hashPassword, validatePassword } from "../helpres/password";
import { HttpException } from "../exceptions/httpException";
import { UNAUTHORIZED } from "http-status-codes";
import ValidationException from "../exceptions/validationException";
import { MailerService } from "./mailer.service";

export interface PasswordResetRequest {
  email: string;
  token: string;
  password: string;
}

export class PasswordResetService {
  private usersService: UsersService;
  private mailerService: MailerService;
  private TIME_FRAME: number = 30 * 60 * 1000; // 30 minutes

  constructor(usersService: UsersService, mailerService: MailerService) {
    this.usersService = usersService;
    this.mailerService = mailerService;
  }

  public async startPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.getUserByEmail(email);
    user.passwordResetToken = crypto.randomBytes(5).toString("hex");
    user.passwordResetTokenExpiresAt = new Date(Date.now() + this.TIME_FRAME);
    await Promise.all([
      this.usersService.saveUser(user),
      this.mailerService.sendResetEmail(user),
    ]);
  }

  public async resetPassword(req: PasswordResetRequest): Promise<void> {
    const user = await this.usersService.getUserByEmail(req.email);
    // basic sanity check
    if (
      user.passwordResetToken !== req.token ||
      !user.passwordResetTokenExpiresAt
    ) {
      throw new HttpException("Could not change password", UNAUTHORIZED);
    }

    // check if timeline is nice
    const dateDiff = user.passwordResetTokenExpiresAt.getTime() - Date.now();

    if (dateDiff < 0) {
      throw new HttpException("Password reset token expired.", UNAUTHORIZED);
    }

    const pwdError = await validatePassword(req.password);
    if (pwdError) {
      throw new ValidationException("User is not valid", [pwdError]);
    }

    user.password = await hashPassword(req.password);
    user.passwordResetToken = null;
    user.passwordResetTokenExpiresAt = null;

    await this.usersService.saveUser(user);
  }
}
