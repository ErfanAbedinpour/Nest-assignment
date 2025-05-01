import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { RegisterUserDTO } from "./DTO/register-user.dto";
import { HashingService } from "./hashing/hashing.abstract";
import { LoginUserDTO } from "./DTO/login-user.dto";
import { ErrorMessages } from "../../errorResponses/errorResponse.enum ";
import { UserTokenService } from "./jwt-strategies/user-token.service";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly argonHashing: HashingService, private readonly userTokenService: UserTokenService) { }

    private readonly logger = new Logger(AuthService.name);

    async registerUser(user: RegisterUserDTO) {
        try {
            // hashPassword
            const hashedPass = await this.argonHashing.hash(user.password);

            await this.userService.createUser(user.name, user.email, hashedPass);

            return { msg: "User Registered successfully" }

        } catch (err) {
            // if Error was returned From userService is HttpException Instance Just throw it. 
            if (err instanceof HttpException)
                throw err

            this.logger.error(err)
            throw new InternalServerErrorException()
        }
    }


    async loginUser({ email, password }: LoginUserDTO) {
        try {
            const user = await this.userService.findUserByEmail(email);

            // verify User Password 
            const isPasswordMatch = await this.argonHashing.verify(user.password, password);

            if (!isPasswordMatch)
                throw new BadRequestException(ErrorMessages.USER_NOT_FOUND)

            // Generate User Jwt Token
            const { accessToken, refreshToken } = await this.userTokenService.generateToken({ email: user.email, id: user.id, name: user.name, role: user.role });

            return { accessToken, refreshToken };
        } catch (err) {
            if (err instanceof HttpException)
                throw err;

            this.logger.error(err)
            throw new InternalServerErrorException()
        }

    }
}