import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Session, SessionSchema } from "../../schemas";
import { UserSessionRepository } from "./repository/abstract/user-session.abstract";
import { MongoUserSessionRepository } from "./repository/mongo-user-session.repository";

@Global()
@Module({
    imports: [MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }])],
    providers: [
        {
            provide: UserSessionRepository,
            useClass: MongoUserSessionRepository
        }
    ],
    exports: [UserSessionRepository]
})
export class UserSessionModule { }