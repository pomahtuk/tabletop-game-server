import * as bcrypt from "bcrypt";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "http-status-codes";

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
    try {
      const createdUser = await this.usersService.createUser({
        ...registrationData,
        password: hashedPassword,
      });
      return AuthService.cleanUpUser(createdUser);
    } catch (error) {
      throw new HttpException("Something went wrong", INTERNAL_SERVER_ERROR);
    }
  }

  public async getAuthenticatedUser(
    email: string,
    plainTextPassword: string
  ): Promise<User> {
    try {
      const user = await this.usersService.getUserByEmail(email);
      await AuthService.verifyPassword(plainTextPassword, user.password);
      return AuthService.cleanUpUser(user);
    } catch (error) {
      throw new HttpException("Wrong credentials provided", BAD_REQUEST);
    }
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
      throw new HttpException("Wrong credentials provided", BAD_REQUEST);
    }
  }

  private static cleanUpUser(user: User): User {
    delete user.password;
    return user;
  }
}
