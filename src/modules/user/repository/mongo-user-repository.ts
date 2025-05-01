import { Injectable } from "@nestjs/common";
import { UserRepository } from "./abstract/user.repository";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../../../schemas";
import { Model } from "mongoose";
import { UserPersist } from "./persistance/user-persist";

@Injectable()
export class MongoUserRepository implements UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

    async create(user: UserPersist): Promise<void> {
        const userModel = new this.userModel(user);
        try {
            await userModel.save()
            return
        } catch (err) {
            throw err;
        }
    }

}