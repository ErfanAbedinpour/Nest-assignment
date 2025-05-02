import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";

export class RegisterUserDTO {
    @ApiProperty({ description: "user Name", example: "Ahmad" })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string

    @ApiProperty({ description: "userPassword", minLength: 8, example: "Example12341324_" })
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({ minLength: 8 })
    password: string

    @ApiProperty({ description: "UserEmail", example: "example@gmail.com" })
    @IsNotEmpty()
    @IsEmail()
    email: string
}