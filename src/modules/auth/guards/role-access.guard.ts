import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLE_ACCESS } from '../decorator/role-access.decorator';
import { UserRole } from '../../../schemas';
import { ErrorMessages } from '../../../errorResponses/errorResponse.enum ';

@Injectable()
export class RoleAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }
  async canActivate(ctx: ExecutionContext) {
    const roleMeta = this.reflector.getAll<UserRole[]>(ROLE_ACCESS, [
      ctx.getClass(),
      ctx.getHandler(),
    ]) || [undefined];

    if (!roleMeta) return true;

    const req = ctx.switchToHttp().getRequest<Request>();

    for (const meta of roleMeta) {
      if (!meta) continue;
      else if (meta !== req.user.role)
        throw new ForbiddenException(ErrorMessages.INVALID_ACCESS);
    }

    try {
      return true;
    } catch (err) {
      throw err;
    }
  }
}
