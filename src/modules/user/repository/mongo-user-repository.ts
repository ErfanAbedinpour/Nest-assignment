import { Injectable } from "@nestjs/common";
import { UserRepository } from "./abstract/user.repository";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument, UserRole } from "../../../schemas";
import { Model } from "mongoose";
import { UserPersist } from "./persistance/user-persist";
import { RepositoryException } from "../../../exception/respository.exception";
import { ErrorMessages } from "../../../errorResponses/errorResponse.enum ";

@Injectable()
export class MongoUserRepository implements UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

    async create(user: UserPersist): Promise<void> {

        try {
            await this.userModel.create(
                {
                    email: user.email,
                    password: user.password,
                    name: user.name,
                    role: user.role ?? UserRole.USER
                }
            );
            return
        } catch (err) {
            throw err;
        }
    }


    async findById(id: string): Promise<UserDocument> {
        try {
            const user = await this.userModel.findById(id);
            if (!user)
                throw new RepositoryException(ErrorMessages.USER_NOT_FOUND)

            return user;

        } catch (err) {
            throw err;
        }
    }


    async delete(id: string): Promise<boolean> {
        try {
            const result = await this.userModel.deleteOne({ _id: id });
            return result.deletedCount >= 1;

        } catch (err) {
            throw err;
        }
    }


    async update(id: string, data: Partial<UserPersist>): Promise<UserDocument> {
        try {
            const result = await this.userModel.findOneAndUpdate({ _id: id }, data, { new: true });
            if (!result)
                throw new RepositoryException(ErrorMessages.USER_NOT_FOUND)

            return result

        } catch (err) {
            throw err
        }
    }
}