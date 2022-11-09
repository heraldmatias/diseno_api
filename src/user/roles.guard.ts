/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from './role.enum';
import { User } from './user';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
        context.getHandler(),
        context.getClass(),
    ]);

    if (!requireRoles){
        return true;
    }

    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization;

    if (typeof(header) === 'undefined') {
      return false;
    }
    if (!header.includes('Bearer ')) {
      return false;
    }
    
    const token = header.split(' ')[1];
    const data = this.jwtService.decode(token, {
        complete: false,
        json:true
    }) as User;
    
    if (!data) {
      return false;
    }

    return requireRoles.some(role => data.roles.includes(role));
  }
}