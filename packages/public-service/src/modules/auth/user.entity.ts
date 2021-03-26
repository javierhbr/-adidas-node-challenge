export class User {
  constructor(username: string) {
    this.username = username;
  }
  id: number;
  username: string;
  password: string;
  salt: string;
}
