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

const responseHandler = async (response: Response) => {
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  if (response.status > 400 && response.status < 500) {
    throw new Error(data.message);
  }
  throw new Error(`Bad server response: ${response.status}`);
};

export const login = (userData: UserData) => {
  console.log(userData);
  return fetch(`${baseHost}/auth/login`, {
    ...defaultParams,
    body: JSON.stringify(userData),
  }).then(responseHandler);
};

export const register = (userData: UserData) => {
  return fetch(`${baseHost}/auth/register`, {
    ...defaultParams,
    body: JSON.stringify(userData),
  }).then(responseHandler);
};
