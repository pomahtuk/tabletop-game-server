export interface User {
  username: string;
  email: string;
}

export interface State {
  loadingUser: boolean;
  user?: User;
}

const state: State = {
  loadingUser: false,
  user: undefined,
};

export default state;
