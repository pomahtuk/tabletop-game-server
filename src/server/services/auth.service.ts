import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

import { UsersService } from "./users.service";
import { User } from "../dao/entities/user";
import { HttpException } from "../exceptions/httpException";
import { hashPassword, validatePassword } from "../helpers/password";
import ValidationException from "../exceptions/validationException";
import { MailerService } from "./mailer.service";

export class AuthService {
  private usersService: UsersService;
  private mailerService: MailerService;

  constructor(usersService: UsersService, mailerService: MailerService) {
    this.usersService = usersService;
    this.mailerService = mailerService;
  }

  public async register(registrationData: any): Promise<User> {
    const pwdError = await validatePassword(registrationData.password);
    if (pwdError) {
      throw new ValidationException("User is not valid", [pwdError]);
    }
    const hashedPassword = await hashPassword(registrationData.password);
    const createdUser = await this.usersService.createUser({
      ...registrationData,
      password: hashedPassword,
      activationCode: uuidv4(),
      isActive: false,
    });
    await this.mailerService.sendActivationEmail(createdUser);
    return AuthService.cleanUpUser(createdUser);
  }

  public async getAuthenticatedUser(
    email: string,
    plainTextPassword: string
  ): Promise<User> {
    const user = await this.usersService.getUserByEmail(email);
    // do not allow not activated users to login
    if (!user.isActive) {
      throw new HttpException(
        "User was not activated",
        StatusCodes.UNAUTHORIZED
      );
    }
    await AuthService.verifyPassword(plainTextPassword, user.password);
    return AuthService.cleanUpUser(user);
  }

  public async activateUser(code: string): Promise<User> {
    const user = await this.usersService.getUserByActivationCode(code);
    user.isActive = true;
    user.activationCode = null;
    return this.usersService.saveUser(user);
  }

  private static async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<void> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        "Wrong credentials provided",
        StatusCodes.UNAUTHORIZED
      );
    }
  }

  private static cleanUpUser(user: User): User {
    user.password = "";
    return user;
  }
}
