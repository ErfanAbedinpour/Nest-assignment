import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsNumber, IsNumberString, Max, Min } from 'class-validator';

export class GetSimilarProductQueryDTO {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ description: 'MongoDb Id' })
  id: string;

  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  @Max(1)
  @ApiProperty({ description: 'threshold must be between 0,1', example: '0.8' })
  threshold: number;

  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  @ApiProperty({ description: 'Limit For Get Product Count', example: 1 })
  limit: number;

}
