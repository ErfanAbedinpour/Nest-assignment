import { UserRole } from '../../../../schemas';

export class UserPersist {
  name: string;

  email: string;

  password: string;

  role?: UserRole;
}
