import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { UserRepository } from "./repository/abstract/user.repository";
import { UserRole } from "../../schemas";
import { MongoServerError } from "mongodb";
import { ErrorMessages } from "../../errorResponses/errorResponse.enum ";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    private readonly logger = new Logger(UserService.name)

    async createUser(name: string, email: string, password: string, role?: UserRole) {
        try {
            await this.userRepository.create({ email, name, password, role })
            return { msg: "User Created successfully" }
        } catch (err) {
            // handling MongoException
            if (err instanceof MongoServerError) {
                // if err.code === 11000 Means Email was registered before.
                if (err.code === 11000) {
                    throw new BadRequestException(ErrorMessages.UNIQUE_EMAIl)
                }
            }
            this.logger.error(err)
            throw new InternalServerErrorException()
        }
    }
}