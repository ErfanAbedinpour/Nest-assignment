import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDTO {
    @ApiProperty({ example: "example@gmail.com" })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: "Test13241234_" })
    password: string
}