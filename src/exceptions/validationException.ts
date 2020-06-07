import { HttpException } from "./httpException";
import { BAD_REQUEST } from "http-status-codes";

export default class ValidationException extends HttpException {
  errors?: string[];

  constructor(message: string, errors?: string[]) {
    super(
      errors && errors.length > 0
        ? `${message}. Errors: \n ${errors.map((e) => `- ${e};`).join("\n")}`
        : message,
      BAD_REQUEST
    );
    this.errors = errors;
  }
}
