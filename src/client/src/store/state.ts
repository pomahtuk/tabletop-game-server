export interface User {
  username: string;
  email: string;
}

export interface State {
  loadingUser: boolean;
  userError?: string;
  user?: User;
}

const state: State = {
  loadingUser: false,
  userError: undefined,
  user: undefined,
};

export default state;
