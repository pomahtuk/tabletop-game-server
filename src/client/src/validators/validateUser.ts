import { Variant } from "@/components/AuthModal.vue";
import { UserData } from "@/api/users";
import validator from "validator";
import isEmail = validator.isEmail;

export type ValidationError = {
  [key in "email" | "username" | "password"]?: string;
};

const usernameRegex = new RegExp(/^([a-zA-Z0-9\.\!\@\$\&\~\_])+$/);
const pwdRegex = new RegExp(
  /^([a-zA-Z0-9\*\.\!\#\@\$\%\^\&\(\)\{\}\[\]\:\;\<\>\,\.\?\/\~\_\+\-\=\|\\])+$/gm
);
const passwordMinSize = 6;
const passwordMaxSize = 255;
export const passwordSizeMessage = `Password must be between ${passwordMinSize} and ${passwordMaxSize} characters long`;

const usernameMinSize = 4;
const usernameMaxSize = 255;
export const usernameSizeMessage = `Username must be between ${usernameMinSize} and ${usernameMaxSize} characters long`;

export interface ValidationResponse {
  valid: boolean;
  errors?: ValidationError;
}

interface InternalValidation {
  valid: boolean;
  error?: string;
}

const validatePassword = (password?: string): InternalValidation => {
  if (!password) {
    return {
      valid: false,
      error: passwordSizeMessage,
    };
  }

  const sizeValid = validator.isLength(password, {
    min: passwordMinSize,
    max: passwordMaxSize,
  });

  if (!sizeValid) {
    return {
      valid: false,
      error: passwordSizeMessage,
    };
  }

  const regexValid = validator.matches(password, pwdRegex);

  console.log(password, regexValid, password.match(pwdRegex));

  if (!regexValid) {
    return {
      valid: false,
      error:
        "Password can only contain numbers, letters and symbols: * . ! # @ $ % ^ & ( ) [ ] : ; < > , . ?  ~ _ + - = | /",
    };
  }

  return {
    valid: true,
  };
};

const validateEmail = (email?: string): InternalValidation => {
  const emailIsValid = isEmail(email || "");
  return {
    valid: emailIsValid,
    error: emailIsValid ? undefined : "Email must be valid",
  };
};

const validateUsername = (username?: string): InternalValidation => {
  if (!username) {
    return {
      valid: false,
      error: usernameSizeMessage,
    };
  }

  const sizeValid = validator.isLength(username, {
    min: usernameMinSize,
    max: usernameMaxSize,
  });

  if (!sizeValid) {
    return {
      valid: false,
      error: usernameSizeMessage,
    };
  }

  const regexValid = validator.matches(username || "", usernameRegex);

  if (!regexValid) {
    return {
      valid: false,
      error:
        "Username can only contain numbers, letters and symbols: . ! @ $ & ~ _",
    };
  }

  return {
    valid: true,
  };
};

const validateUserAndAction = (
  action: Variant,
  { email, username, password }: UserData
): ValidationResponse => {
  let errors: ValidationError = {};
  let valid = true;

  if (action === "restore") {
    const { valid: validEmail, error: errorEmail } = validateEmail(email);
    if (!validEmail) {
      valid = false;
      errors = {
        ...errors,
        email: errorEmail,
      };
    }
    return {
      valid,
      errors,
    };
  }

  // password
  const { valid: validPwd, error: errorPwd } = validatePassword(password);
  if (!validPwd) {
    valid = false;
    errors = {
      ...errors,
      password: errorPwd,
    };
  }

  if (action === "login") {
    const { valid: validEmail, error: errorEmail } = validateEmail(email);
    if (!validEmail) {
      valid = false;
      errors = {
        ...errors,
        email: errorEmail,
      };
    }

    return {
      valid,
      errors,
    };
  }

  // username
  const { valid: validUsername, error: errorUsername } = validateUsername(
    username
  );
  if (!validUsername) {
    valid = false;
    errors = {
      ...errors,
      username: errorUsername,
    };
  }

  return {
    valid,
    errors,
  };
};

export default validateUserAndAction;
