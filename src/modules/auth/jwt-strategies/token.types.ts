import { UserRole } from '../../../schemas';

export interface AccessTokenPayload {
  role: UserRole;
  userId: string;
  name: string;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
}
