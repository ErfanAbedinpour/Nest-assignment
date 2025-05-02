import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { HashingService } from "./hashing/hashing.abstract";
import { ArgonHashingService } from "./hashing/argon/argon-hashing.service";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { UserTokenService } from "./jwt-strategies/user-token.service";
import { APP_GUARD } from "@nestjs/core";
import { RoleAccessGuard } from "./guards/role-access.guard";
import { AuthorizationGuard } from "./guards/authorization.guard";
import { JwtVerificationGuard } from "./guards/jwt-verification.guard";

@Module({
    controllers: [AuthController],
    imports: [UserModule, JwtModule.register({})],
    providers: [
        {
            provide: HashingService,
            useClass: ArgonHashingService
        },
        AuthService,
        UserTokenService,
        JwtVerificationGuard,
        {
            provide: APP_GUARD,
            useClass: AuthorizationGuard

        },
        {
            provide: APP_GUARD,
            useClass: RoleAccessGuard
        }
    ],
})
export class AuthModule { }