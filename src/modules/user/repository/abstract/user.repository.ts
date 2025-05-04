import { UserPersist } from '../persistance/user-persist';
import { User, UserDocument } from '../../../../schemas';

export abstract class UserRepository {
  abstract create(user: UserPersist): Promise<UserDocument>;

  abstract findById(id: string): Promise<UserDocument | null>;

  abstract findByEmail(email: string): Promise<UserDocument | null>;

  abstract delete(id: string): Promise<boolean>;

  abstract update(
    id: string,
    data: Partial<UserPersist>,
  ): Promise<UserDocument>;

  abstract getDocumentLength(): Promise<number>;

  abstract getAll(): Promise<UserDocument[]>
}
