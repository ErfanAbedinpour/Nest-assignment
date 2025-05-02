import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './DTO/create-product.dto';
import { UpdateProductDto } from './DTO/update-product.dto';
import { IsAuth } from '../auth/decorator/auth.decorator';
import { RoleAccess } from '../auth/decorator/role-access.decorator';
import { UserRole } from '../../schemas';
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { ProductDTO } from './DTO/product.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @IsAuth()
    @RoleAccess(UserRole.ADMIN)
    @ApiBearerAuth("JWT-AUTH")
    @ApiCreatedResponse({ description: "Product created successfully", type: ProductDTO })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Get()
    @ApiOkResponse({ description: "Product fetched successfully", type: [ProductDTO] })
    findAll() {
        return this.productService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({ description: "Product fetch successfully", type: ProductDTO })
    @ApiNotFoundResponse({ description: "Product not found" })
    findOne(@Param('id') id: string) {
        return this.productService.findOne(id);
    }

    @Put(':id')
    @IsAuth()
    @RoleAccess(UserRole.ADMIN)
    @ApiBearerAuth("JWT-AUTH")
    @ApiOkResponse({ description: "Product Updated successfully", type: ProductDTO })
    @ApiNotFoundResponse({ description: "Product not found" })
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    @IsAuth()
    @RoleAccess(UserRole.ADMIN)
    @ApiBearerAuth("JWT-AUTH")
    @ApiNotFoundResponse({ description: "Product not found" })
    @ApiOkResponse({ description: "Product Removed successfully", type: ProductDTO })
    remove(@Param('id') id: string) {
        return this.productService.remove(id);
    }
}
