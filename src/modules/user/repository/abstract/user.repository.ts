import { UserPersist } from "../persistance/user-persist";

export abstract class UserRepository {
    abstract create(user: UserPersist): Promise<void>
}