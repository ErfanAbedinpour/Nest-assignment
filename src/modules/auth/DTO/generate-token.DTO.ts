import { IsJWT, IsNotEmpty } from "class-validator";

export class GenerateTokenDTO {
    @IsJWT()
    @IsNotEmpty()
    refreshToken: string
}