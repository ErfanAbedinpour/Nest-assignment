import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { RegisterUserDTO } from "./DTO/register-user.dto";
import { AuthService } from "./auth.service";
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { LoginUserDTO } from "./DTO/login-user.dto";

@Controller("auth")
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post("signup")
    @ApiBody({ type: RegisterUserDTO })
    @ApiCreatedResponse({ description: "UserCreatedSuccessfully", schema: { properties: { msg: { type: 'string' } } } })
    @ApiBadRequestResponse({ description: "Email is exist before." })
    registerUser(@Body() registerUserDto: RegisterUserDTO) {
        return this.authService.registerUser(registerUserDto);
    }

    @Post("signin")
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: LoginUserDTO })
    @ApiOkResponse({ description: "User Login successfully", })
    loginUser(@Body() loginUserDto: LoginUserDTO) {
        return this.authService.loginUser(loginUserDto);
    }

}