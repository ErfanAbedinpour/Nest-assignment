import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repository/abstract/user.repository';
import { UserDocument, UserRole } from '../../schemas';
import { MongoServerError, ObjectId } from 'mongodb';
import { ErrorMessages } from '../../errorResponses/errorResponse.enum ';
import { UpdateUserDTO } from './DTO/update-user.dto';
import { omit } from 'lodash';
import { UserDTO } from './DTO/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  private readonly logger = new Logger(UserService.name);

  async createUser(
    name: string,
    email: string,
    password: string,
    role?: UserRole,
  ) {
    try {
      await this.userRepository.create({ email, name, password, role });
      return { msg: 'User Created successfully' };
    } catch (err) {
      // handling MongoException
      if (err instanceof MongoServerError) {
        // if err.code === 11000 Means Email was registered before.
        if (err.code === 11000) {
          throw new BadRequestException(ErrorMessages.UNIQUE_EMAIl);
        }
      }
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async findUserById(id: string): Promise<UserDocument> {
    const user = await this.userRepository.findById(id.toString());

    if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);

    return user;
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);

    return user;
  }

  getUsersLength() {
    return this.userRepository.getDocumentLength();
  }


  getAllUsers() {
    return this.userRepository.getAll();
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDTO) {
    const user = await this.userRepository.findById(userId)

    if (!user)
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND)

    try {
      const result = await this.userRepository.update(userId, updateUserDto)
      return omit(result.toObject(), ['password'])
    } catch (err) {
      this.logger.error(err)
      throw new InternalServerErrorException()
    }

  }


  async deleteUser(userId: string) {
    const user = await this.userRepository.findById(userId)

    if (!user)
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND)

    try {
      await this.userRepository.delete(userId)
      return { msg: "User Removed successfully" }
    } catch (err) {
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }
}
