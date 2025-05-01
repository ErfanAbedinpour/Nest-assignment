import { Injectable } from "@nestjs/common";
import { UserRepository } from "./abstract/user.repository";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserRole } from "../../../schemas";
import { Model } from "mongoose";
import { UserPersist } from "./persistance/user-persist";

@Injectable()
export class MongoUserRepository implements UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

    async create(user: UserPersist): Promise<void> {
        const userModel = new this.userModel(
            {
                email: user.email,
                password: user.password,
                name: user.name,
                role: user.role ?? UserRole.USER
            }
        );
        try {
            console.log('i am here')
            await userModel.save()
            return
        } catch (err) {
            throw err;
        }
    }

}