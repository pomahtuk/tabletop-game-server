import * as bcrypt from "bcrypt";
import { UNAUTHORIZED } from "http-status-codes";

import { UsersService } from "./users.service";
import { User } from "../dao/entities/user";
import { HttpException } from "../exceptions/httpException";
import { hashPassword, validatePassword } from "../helpres/password";
import ValidationException from "../exceptions/validationException";

export class AuthService {
  private usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
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
    });
    return AuthService.cleanUpUser(createdUser);
  }

  public async getAuthenticatedUser(
    email: string,
    plainTextPassword: string
  ): Promise<User> {
    const user = await this.usersService.getUserByEmail(email);
    await AuthService.verifyPassword(plainTextPassword, user.password);
    return AuthService.cleanUpUser(user);
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
      throw new HttpException("Wrong credentials provided", UNAUTHORIZED);
    }
  }

  private static cleanUpUser(user: User): User {
    delete user.password;
    return user;
  }
}
