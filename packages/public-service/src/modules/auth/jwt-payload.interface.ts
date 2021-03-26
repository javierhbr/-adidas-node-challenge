export interface JwtPayload {
  username: string;
  lastLogin: string;
  loginDate: string;
  expiresIn: string;
  expireDate: string;
}
