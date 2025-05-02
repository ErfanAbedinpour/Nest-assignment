import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDTO } from './DTO/register-user.dto';
import { HashingService } from './hashing/hashing.abstract';
import { LoginUserDTO } from './DTO/login-user.dto';
import { ErrorMessages } from '../../errorResponses/errorResponse.enum ';
import { UserTokenService } from './jwt-strategies/user-token.service';
import { GenerateTokenDTO } from './DTO/generate-token.DTO';
import { JsonWebTokenError } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import { UserRole } from '../../schemas';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly argonHashing: HashingService,
    private readonly userTokenService: UserTokenService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async registerUser(user: RegisterUserDTO) {
    try {
      // hashPassword
      const hashedPass = await this.argonHashing.hash(user.password);

      const userLength = await this.userService.getUsersLength();
      await this.userService.createUser(
        user.name,
        user.email,
        hashedPass,
        userLength < 1 ? UserRole.ADMIN : UserRole.USER,
      );

      return { msg: 'User Registered successfully' };
    } catch (err) {
      // if Error was returned From userService is HttpException Instance Just throw it.
      if (err instanceof HttpException) throw err;

      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async loginUser({ email, password }: LoginUserDTO) {
    try {
      const user = await this.userService.findUserByEmail(email);

      // verify User Password
      const isPasswordMatch = await this.argonHashing.verify(
        user.password,
        password,
      );

      if (!isPasswordMatch)
        throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);

      // Generate User Jwt Token
      const { accessToken, refreshToken } =
        await this.userTokenService.generateToken({
          email: user.email,
          id: user.id,
          name: user.name,
          role: user.role,
        });

      return { accessToken, refreshToken };
    } catch (err) {
      if (err instanceof HttpException) throw err;

      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async generateToken(genToken: GenerateTokenDTO) {
    try {
      /**
       *
       * 1. Verify RefreshToken
       * 2. Check Token is valid Or Not
       * 3. Invalidate Old RefreshToken
       * 4. FindUserById
       * 5. GenerateNewTokens
       */
      const tokenPayload = await this.userTokenService.verifyRefreshToken(
        genToken.refreshToken,
      );

      const isValid = await this.userTokenService.isValidate(
        tokenPayload.tokenId,
        genToken.refreshToken,
      );

      if (!isValid)
        throw new BadRequestException(ErrorMessages.INVALID_REFRESH_TOKEN);

      await this.userTokenService.invalidate(tokenPayload.tokenId);

      const user = await this.userService.findUserById(
        new ObjectId(tokenPayload.userId),
      );

      if (!user) throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);

      return this.userTokenService.generateToken({
        email: user.email,
        id: user.id,
        name: user.name,
        role: user.role,
      });
    } catch (err) {
      if (err instanceof HttpException) throw err;

      if (err instanceof JsonWebTokenError)
        throw new BadRequestException(ErrorMessages.INVALID_REFRESH_TOKEN);
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
