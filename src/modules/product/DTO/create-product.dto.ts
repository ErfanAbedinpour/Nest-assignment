import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsNumberString,
  IsNotEmpty,
} from 'class-validator';
import Decimal from 'decimal.js';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of Product', example: 'Mouse' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'NumberString For Product Price',
    example: '120000',
    type: 'string',
  })
  @IsNumberString()
  @Type(() => Decimal)
  price: Decimal;

  @ApiProperty({
    description: 'The Category of Product',
    example: 'computer-utils',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'Description For Product',
    example: 'this Product is One of The Best Mouse in the world',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
