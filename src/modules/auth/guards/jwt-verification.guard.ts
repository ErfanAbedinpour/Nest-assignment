import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AccessTokenPayload } from '../jwt-strategies/token.types';
import { ErrorMessages } from '../../../errorResponses/errorResponse.enum ';
import { UserRole } from '../../../schemas';

@Injectable()
export class JwtVerificationGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // getRequest
    const req = ctx.switchToHttp().getRequest<Request>();

    // Check Header Schema
    const [bearer, token] = req.headers.authorization?.split(' ') || [];

    if (!bearer || !token)
      throw new ForbiddenException(ErrorMessages.INVALID_HEADER);

    try {
      // Verify JWT
      const jwtPayload = await this.jwtService.verifyAsync<AccessTokenPayload>(
        token,
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
        },
      );

      // Inject To Request
      req.user = {
        id: jwtPayload.userId,
        name: jwtPayload.name,
        role: jwtPayload.role,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException(ErrorMessages.INVALID_TOKEN);
    }
  }
}

// Inject UserObject in Request Context In Express
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        name: string;
        role: UserRole;
      };
    }
  }
}
