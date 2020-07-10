import { Variant } from "@/components/LoginModal.vue";
import { UserData } from "@/api/users";

export type ValidationError = {
  [key in "email" | "username" | "password"]?: string;
};

const usernameRegex = new RegExp(/^([a-zA-Z0-9\.\!\@\$\&\~\_])+$/);
const pwdRegex = new RegExp(
  /^([a-zA-Z0-9\*\.\!\#\@\$\%\^\&\(\)\{\}\[\]\:\;\<\>\,\.\?\/\~\_\+\-\=\|\\])+$/gm
);

export interface ValidationResponse {
  valid: boolean;
  errors?: ValidationError;
}

const validateUserAndAction = (
  action: Variant,
  { email, username, password }: UserData
): ValidationResponse => {
  let errors: ValidationError = {};
  let valid = true;

  if (action === "restore") {
    if (!email || email.length < 2) {
      valid = false;
      errors = {
        ...errors,
        email: "Email should be present",
      };
    }
    return {
      valid,
      errors,
    };
  }

  // password
  if (!password || password.length < 6) {
    valid = false;
    errors = {
      ...errors,
      password: "Password must be present and longer than 5 characters",
    };
  } else if (!password.match(pwdRegex)) {
    valid = false;
    errors = {
      ...errors,
      password:
        "Can only contain numbers, letters and symbols: * . ! # @ $ % ^ & ( ) [ ] : ; < > , . ?  ~ _ + - = | /",
    };
  } else if (password.length > 255) {
    valid = false;
    errors = {
      ...errors,
      password: "Password can not be longer than 255 characters",
    };
  }

  if (action === "login") {
    // email
    if (!email || email.length < 3) {
      errors = {
        ...errors,
        password: "Email must be present",
      };
    }

    return {
      valid,
      errors,
    };
  }

  // username
  if (!username || username.length < 4) {
    valid = false;
    errors = {
      ...errors,
      username: "Username must be present",
    };
  } else if (!username.match(usernameRegex)) {
    valid = false;
    errors = {
      ...errors,
      username:
        "Username can only contain numbers, letters and symbols: . ! @ $ & ~ _",
    };
  } else if (username.length > 255) {
    valid = false;
    errors = {
      ...errors,
      username: "Username can not be longer than 255 characters",
    };
  }

  return {
    valid,
    errors,
  };
};

export default validateUserAndAction;
