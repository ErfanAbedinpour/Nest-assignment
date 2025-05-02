import { Injectable } from "@nestjs/common";
import { UserSessionRepository } from "./abstract/user-session.abstract";
import { InjectModel } from "@nestjs/mongoose";
import { Session } from "../../../schemas";
import { Model } from "mongoose";

@Injectable()
export class MongoUserSessionRepository implements UserSessionRepository {
    constructor(@InjectModel(Session.name) private readonly sessionModel: Model<Session>) { }


    async create(token: string, userId: string, tokenId: string): Promise<void> {
        try {
            await this.sessionModel.create({ token, tokenId, user: userId });
        } catch (err) {
            throw err
        }
    }


    async invalidate(tokenId: string): Promise<void> {
        await this.sessionModel.deleteOne({ tokenId })
    }


    async isValid(tokenId: string, token: string): Promise<boolean> {
        const curentToken = await this.sessionModel.findOne({ tokenId })

        if (!curentToken || curentToken.token !== token)
            return false

        return true;
    }
}