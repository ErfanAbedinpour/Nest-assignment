import { HttpException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { RegisterUserDTO } from "./DTO/register-user.dto";
import { HashingService } from "./hashing/hashing.abstract";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly argonHashing: HashingService) { }

    private readonly logger = new Logger(AuthService.name);

    async registerUser(user: RegisterUserDTO) {
        try {
            // hashPassword
            const hashedPass = await this.argonHashing.hash(user.password);

            await this.userService.createUser(user.name, user.email, hashedPass);

            return { msg: "User Registered successfully" }

        } catch (err) {
            // if Error was returned is HttpException Instance Just throw it.
            if (err instanceof HttpException)
                throw err

            this.logger.error(err)
            throw new InternalServerErrorException()
        }
    }
}