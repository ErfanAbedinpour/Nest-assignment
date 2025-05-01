import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { HashingService } from "./hashing/hashing.abstract";
import { ArgonHashingService } from "./hashing/argon/argon-hashing.service";
import { AuthService } from "./auth.service";

@Module({
    controllers: [AuthController],
    imports: [UserModule],
    providers: [
        {
            provide: HashingService,
            useClass: ArgonHashingService
        },
        AuthService
    ],
})
export class AuthModule { }