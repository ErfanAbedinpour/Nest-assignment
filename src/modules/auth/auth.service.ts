import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { RegisterUserDTO } from "./DTO/register-user.dto";
import { HashingService } from "./hashing/hashing.abstract";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly argonHashing: HashingService) { }

    private readonly logger = new Logger(AuthService.name);

    async registerUser(user: RegisterUserDTO) {
        try {
            // should be HashPassword
            await this.userService.createUser(user.name, user.email, user.password);

            return { msg: "User Registered successfully" }

        } catch (err) {
            this.logger.error(err)
            throw new InternalServerErrorException()
        }
    }
}