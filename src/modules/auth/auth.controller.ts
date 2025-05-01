import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { RegisterUserDTO } from "./DTO/register-user.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post("signup")
    registerUser(@Body() registerUserDto: RegisterUserDTO) {
        return this.authService.registerUser(registerUserDto);
    }

    @Post("signin")
    @HttpCode(HttpStatus.OK)
    loginUser() { }

}