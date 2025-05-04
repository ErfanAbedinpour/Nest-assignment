import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../../../schemas";
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserDTO {
    @ApiProperty({ description: "userID" })
    id: string

    @ApiProperty({ description: "UserName", example: "Ahmad" })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string

    @ApiProperty({ description: "User Email", example: "test@gmail.com" })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @IsEmail()
    email: string

    @ApiProperty({ enum: () => UserRole, description: "UserRole", example: UserRole.USER })
    @IsNotEmpty()
    @MinLength(3)
    @IsEnum(UserRole)
    role: UserRole
}