import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class GenerateTokenDTO {
  @ApiProperty({ description: 'user refresh Token' })
  @IsJWT()
  @IsNotEmpty()
  refreshToken: string;
}
