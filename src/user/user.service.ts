/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Role } from './role.enum';
import { User } from './user';

@Injectable()
export class UserService {
  private users: User[] = [
    new User(1, "admin", "admin", [Role.ADMIN]),
    new User(2, "userread", "userReadAll", [Role.READALL]),
    new User(3, "userone", "userReadOne", [Role.READ]),
    new User(4, "userw", "admin", [Role.USERW]),
    new User(5, "userd", "admin", [Role.USERD]),
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
