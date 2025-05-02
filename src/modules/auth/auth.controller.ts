import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterUserDTO } from './DTO/register-user.dto';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { LoginUserDTO } from './DTO/login-user.dto';
import { GenerateTokenDTO } from './DTO/generate-token.DTO';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiBody({ type: RegisterUserDTO })
  @ApiCreatedResponse({
    description: 'UserCreatedSuccessfully',
    schema: { properties: { msg: { type: 'string' } } },
  })
  @ApiBadRequestResponse({ description: 'Email is exist before.' })
  registerUser(@Body() registerUserDto: RegisterUserDTO) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginUserDTO })
  @ApiOkResponse({
    description: 'User Login successfully',
    schema: {
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Invalid Credential' })
  loginUser(@Body() loginUserDto: LoginUserDTO) {
    return this.authService.loginUser(loginUserDto);
  }

  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Token Generated successfully',
    schema: {
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid Token' })
  generateToken(@Body() @Body() refreshTokenBody: GenerateTokenDTO) {
    return this.authService.generateToken(refreshTokenBody);
  }
}
