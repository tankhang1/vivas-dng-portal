export type AuthUser = {
  id: string;
  username: string;
  displayName: string;
  role: string;
};

export type AuthLoginResponse = {
  accessToken: string;
  expiresAt: string;
  user: AuthUser;
};
