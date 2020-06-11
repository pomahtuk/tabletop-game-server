import { UsersService } from "./users.service";
import * as crypto from "crypto";
import { hashPassword } from "../helpres/password";
import { HttpException } from "../exceptions/httpException";
import { UNAUTHORIZED } from "http-status-codes";

export interface PasswordResetRequest {
  email: string;
  token: string;
  password: string;
}

export class PasswordResetService {
  private usersService: UsersService;
  private TIME_FRAME: number = 30 * 60 * 1000;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  public async startPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.getUserByEmail(email);
    user.passwordResetToken = crypto.randomBytes(5).toString("hex");
    user.passwordResetTokenExpiresAt = new Date(Date.now() + this.TIME_FRAME); // 30 minutes from now
    await this.usersService.saveUser(user);
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

    // FIXME: password has to to be validated before hashing

    user.password = await hashPassword(req.password);
    user.passwordResetToken = null;
    user.passwordResetTokenExpiresAt = null;

    await this.usersService.saveUser(user);
  }
}
