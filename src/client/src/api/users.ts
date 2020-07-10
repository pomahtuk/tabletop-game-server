export interface UserData {
  username?: string;
  password?: string;
  email?: string;
}

const baseHost = "https://api.konquest.space";
const defaultParams = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export const login = (userData: UserData) => {
  return fetch(`${baseHost}/auth/login`, {
    ...defaultParams,
    body: JSON.stringify(userData),
  }).then((response) => response.json());
};

export const register = (userData: UserData) => {
  return fetch(`${baseHost}/auth/register`, {
    ...defaultParams,
    body: JSON.stringify(userData),
  }).then((response) => response.json());
};
