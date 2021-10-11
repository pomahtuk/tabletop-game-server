import {
  getRepository,
  Repository,
  DeleteResult,
  QueryFailedError,
} from "typeorm";
import { StatusCodes } from "http-status-codes";

import { User, UserData } from "../dao/entities/user";
import { HttpException } from "../exceptions/httpException";
import { validate } from "class-validator";
import ValidationException from "../exceptions/validationException";

export class UsersService {
  private repo: Repository<User>;

  constructor() {
    this.repo = getRepository(User);
  }

  public getUsers(page: number = 0, limit: number = 10): Promise<User[]> {
    return this.repo.find({
      relations: ["games"],
      skip: page * limit,
      take: limit,
      cache: true,
    });
  }

  public async getUser(userId: string): Promise<User> {
    const user = await this.repo.findOne(userId, {
      relations: ["games"],
    });
    if (user) {
      return user;
    }
    throw new HttpException(
      "User with this id does not exist",
      StatusCodes.NOT_FOUND
    );
  }

  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.repo.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      "User with this email does not exist",
      StatusCodes.NOT_FOUND
    );
  }

  public async getUserByActivationCode(activationCode: string): Promise<User> {
    const user = await this.repo.findOne({ activationCode });
    if (user) {
      return user;
    }
    throw new HttpException(
      "User with this activation code does not exist",
      StatusCodes.NOT_FOUND
    );
  }

  public deleteUser(userId: string): Promise<DeleteResult> {
    return this.repo.delete(userId);
  }

  public async createUser(newUser: UserData): Promise<User> {
    const userInstance = await UsersService.validateIncomingUser(newUser);
    try {
      const user = this.repo.create(userInstance);
      return await this.repo.save(user);
    } catch (error) {
      // TODO: not any! use proper types!
      const typedError = error as any;
      if (
        typedError.code === "SQLITE_CONSTRAINT" ||
        typedError.code === "ER_DUP_ENTRY"
      ) {
        throw new HttpException(
          "User with that email or username already exists",
          StatusCodes.BAD_REQUEST,
          typedError
        );
      }
      // NOTE: ignoring branch not corresponding to expected exception as other exceptions
      // are not supposed to happen anw will be an indication of DB issue, so, external dependency
      /* istanbul ignore next */
      throw new HttpException(
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
        typedError
      );
    }
  }

  public async updateUser(userId: string, newUser: any): Promise<User> {
    // prevent overriding of Id;
    if (newUser.id && newUser.id !== userId) {
      throw new HttpException(
        "Changing User id is forbidden",
        StatusCodes.FORBIDDEN
      );
    }
    const userInstance = await UsersService.validateIncomingUser(newUser);
    const user = await this.getUser(userId);
    try {
      this.repo.merge(user, userInstance);
      return await this.repo.save(user);
    } catch (error) {
      // TODO: not any! use proper types!
      const typedError = error as any;
      if (
        typedError.code === "SQLITE_CONSTRAINT" ||
        typedError.code === "ER_DUP_ENTRY"
      ) {
        throw new HttpException(
          "User with that email or username already exists",
          StatusCodes.BAD_REQUEST,
          typedError
        );
      }
      // NOTE: ignoring branch not corresponding to expected exception as other exceptions
      // are not supposed to happen anw will be an indication of DB issue, so, external dependency
      /* istanbul ignore next */
      throw new HttpException(
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
        typedError
      );
    }
  }

  public async saveUser(user: User): Promise<User> {
    try {
      await UsersService.validateUserInstance(user);
      return await this.repo.save(user);
    } catch (error) {
      // TODO: not any! use proper types!
      const typedError = error as any;
      if (
        typedError.code === "SQLITE_CONSTRAINT" ||
        typedError.code === "ER_DUP_ENTRY"
      ) {
        throw new HttpException(
          "User with that email or username already exists",
          StatusCodes.BAD_REQUEST,
          typedError
        );
      }
      // NOTE: ignoring branch not corresponding to expected exception as other exceptions
      // are not supposed to happen anw will be an indication of DB issue, so, external dependency
      /* istanbul ignore next */
      throw new HttpException(
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
        typedError
      );
    }
  }

  private static async validateIncomingUser(newUser: UserData): Promise<User> {
    const userInstance = new User(newUser);
    return await UsersService.validateUserInstance(userInstance);
  }

  private static async validateUserInstance(userInstance: User): Promise<User> {
    const validationErrors = await validate(userInstance);
    if (validationErrors.length > 0) {
      throw new ValidationException("User is not valid", validationErrors);
    }
    return userInstance;
  }
}
