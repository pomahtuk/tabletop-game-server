import { HttpException } from "./httpException";
import { BAD_REQUEST } from "http-status-codes";
import { ValidationError } from "class-validator";

export default class ValidationException extends HttpException {
  errors?: string[];

  constructor(message: string, errors?: ValidationError[]) {
    let errorStrings: string[] | undefined = undefined;

    if (errors && errors.length > 0) {
      errorStrings = errors.map(
        (e) =>
          `property ${
            e.property
          } has failed the following constraints: ${Object.keys(
            e.constraints!
          ).map((key) => e.constraints![key])}`
      );
    }

    super(
      errorStrings && errorStrings.length > 0
        ? `${message}. Errors: \n ${errorStrings
            .map((e) => `- ${e};`)
            .join("\n")}`
        : message,
      BAD_REQUEST
    );
    this.errors = errorStrings;
  }
}
