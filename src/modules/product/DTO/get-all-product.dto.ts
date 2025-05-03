import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetAllProductDTO {
    @ApiProperty({ type: 'string', description: "Limit Of Product", example: 10, required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit: number

    @ApiProperty({ type: 'string', description: "Page", example: 1, required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page: number
}