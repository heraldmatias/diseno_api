/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UserService, AuthService, JwtService],
  controllers: [UserController]
})
export class UserModule {}
