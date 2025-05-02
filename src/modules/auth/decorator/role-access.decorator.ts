import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../schemas';

export const ROLE_ACCESS = 'RoleAccess';
export const RoleAccess = (role: UserRole) => SetMetadata(ROLE_ACCESS, role);
