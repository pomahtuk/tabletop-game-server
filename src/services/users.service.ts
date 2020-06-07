import { getRepository, Repository, DeleteResult } from "typeorm";
import {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from "http-status-codes";

import { User } from "../dao/entities/user";
import { HttpException } from "../exceptions/httpException";
import { validate } from "class-validator";
import ValidationException from "../exceptions/validationException";

export class UsersService {
  private repo: Repository<User>;

  constructor() {
    this.repo = getRepository(User);
  }

  public getUsers(): Promise<User[]> {
    return this.repo.find({
      relations: ["games"],
    });
  }

  public async getUser(userId: string): Promise<User> {
    const user = await this.repo.findOne(userId, {
      relations: ["games"],
    });
    if (user) {
      return user;
    }
    throw new HttpException("User with this id does not exist", NOT_FOUND);
  }

  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.repo.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException("User with this email does not exist", NOT_FOUND);
  }

  public deleteUser(userId: string): Promise<DeleteResult> {
    return this.repo.delete(userId);
  }

  public async createUser(newUser: User): Promise<User> {
    const userInstance = await this.validateUser(newUser);
    try {
      const user = this.repo.create(userInstance);
      return await this.repo.save(user);
    } catch (error) {
      if (error?.code === "SQLITE_CONSTRAINT") {
        throw new HttpException(
          "User with that email or username already exists",
          BAD_REQUEST,
          error
        );
      }
      throw new HttpException(
        "Something went wrong",
        INTERNAL_SERVER_ERROR,
        error
      );
    }
  }

  public async updateUser(userId: string, newUser: any): Promise<User> {
    // prevent overriding of Id;
    if (newUser.id && newUser.id !== userId) {
      throw new HttpException("Changing User id is forbidden", FORBIDDEN);
    }
    const user = await this.repo.findOne(userId, {
      relations: ["games"],
    });
    if (user) {
      const userInstance = await this.validateUser(newUser);
      try {
        this.repo.merge(user, userInstance);
        return await this.repo.save(user);
      } catch (error) {
        if (error?.code === "SQLITE_CONSTRAINT") {
          throw new HttpException(
            "User with that email or username already exists",
            BAD_REQUEST,
            error
          );
        }
        throw new HttpException(
          "Something went wrong",
          INTERNAL_SERVER_ERROR,
          error
        );
      }
    }
    throw new HttpException("User with this id does not exist", NOT_FOUND);
  }

  private async validateUser(newUser: User): Promise<User> {
    const userInstance = new User(newUser);
    const validationErrors = await validate(userInstance);
    if (validationErrors.length > 0) {
      throw new ValidationException(
        "User is not valid",
        validationErrors.map(
          (e) =>
            `property ${e.property} has failed the following constraints: ${
              e.constraints
                ? Object.keys(e.constraints).map((key) => e.constraints![key])
                : ""
            }`
        )
      );
    }
    return userInstance;
  }
}
