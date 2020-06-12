import * as bcrypt from "bcrypt";
import validator from "validator";
import { ValidationError } from "class-validator/types/validation/ValidationError";

const passwordMinSize = 6;
const passwordMaxSize = 255;

export const passwordMessage =
  "Can only contain numbers, letters and symbols: * . ! # @ $ % ^ & ( ) [ ] : ; < > , . ?  ~ _ + - = | /";
export const passwordSizeMessage = `Must be between ${passwordMinSize} and ${passwordMaxSize} characters long`;

export const hashPassword = (password: string) => bcrypt.hash(password, 10);

export const validatePassword = async (
  password?: string
): Promise<ValidationError | undefined> => {
  if (!password) {
    return undefined;
  }

  const baseError: ValidationError = {
    property: "password",
    children: [],
    value: password,
  };

  const sizeValid = validator.isLength(password, {
    min: passwordMinSize,
    max: passwordMaxSize,
  });

  if (!sizeValid) {
    baseError.constraints = {
      length: passwordSizeMessage,
    };
    return baseError;
  }

  const regexValid = validator.matches(
    password,
    /^([a-zA-Z0-9\*\.\!\#\@\$\%\^\&\(\)\{\}\[\]\:\;\<\>\,\.\?\/\~\_\+\-\=\|\\])+$/gm
  );

  if (!regexValid) {
    baseError.constraints = {
      matches: passwordMessage,
    };
    return baseError;
  }

  return undefined;
};
