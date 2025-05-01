import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { UserRepository } from "./repository/abstract/user.repository";
import { UserRole } from "../../schemas";
import { MongoServerError } from "mongodb";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    private readonly logger = new Logger(UserService.name)

    async createUser(name: string, email: string, password: string, role?: UserRole) {
        try {
            await this.userRepository.create({ email, name, password, role })
            return { msg: "User Created successfully" }
        } catch (err) {
            if (err instanceof MongoServerError) {
                //TODO: Handling 11000 Code for UniqueConstraint Exception for User Email
            }
            this.logger.error(err)
            throw new InternalServerErrorException()
        }
    }
}