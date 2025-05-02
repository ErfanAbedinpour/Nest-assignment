import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class GetSimilarProductQueryDTO {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ description: 'MongoDb Id' })
  id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1)
  @ApiProperty({ description: 'threshold must be between 0,1', example: '0.8' })
  threshold: number;
}
