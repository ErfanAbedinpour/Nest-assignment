import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './DTO/create-product.dto';
import { UpdateProductDto } from './DTO/update-product.dto';
import { IsAuth } from '../auth/decorator/auth.decorator';
import { RoleAccess } from '../auth/decorator/role-access.decorator';
import { UserRole } from '../../schemas';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductDTO } from './DTO/product.dto';
import { GetSimilarProductQueryDTO } from './DTO/get-similar-product.dto';
import { GetAllProductDTO } from './DTO/get-all-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @IsAuth()
  @RoleAccess(UserRole.ADMIN)
  @ApiBearerAuth('JWT-AUTH')
  @ApiCreatedResponse({
    description: 'Product created successfully',
    type: ProductDTO,
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Product fetched successfully',
    type: [ProductDTO],
  })
  findAll(@Query() getAllProductDTO: GetAllProductDTO) {
    return this.productService.findAll(
      getAllProductDTO.limit || 10,
      getAllProductDTO.page || 1,
    );
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Product fetch successfully',
    type: ProductDTO,
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @IsAuth()
  @RoleAccess(UserRole.ADMIN)
  @ApiBearerAuth('JWT-AUTH')
  @ApiOkResponse({
    description: 'Product Updated successfully',
    type: ProductDTO,
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @IsAuth()
  @RoleAccess(UserRole.ADMIN)
  @ApiBearerAuth('JWT-AUTH')
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiOkResponse({
    description: 'Product Removed successfully',
    type: ProductDTO,
  })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Get(':id/similar')
  @ApiOkResponse({
    description: 'Product fetched successfully',
    type: [ProductDTO],
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  findSimilar(@Query() findSimilarProductQuery: GetSimilarProductQueryDTO) {
    return this.productService.findSimilarProduct(findSimilarProductQuery);
  }
}
