import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './DTO/create-product.dto';
import { UpdateProductDto } from './DTO/update-product.dto';
import { IsAuth } from '../auth/decorator/auth.decorator';
import { RoleAccess } from '../auth/decorator/role-access.decorator';
import { UserRole } from '../../schemas';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @IsAuth()
    @RoleAccess(UserRole.ADMIN)
    @ApiBearerAuth("JWT-AUTH")
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productService.findOne(id);
    }

    @Put(':id')
    @IsAuth()
    @RoleAccess(UserRole.ADMIN)
    @ApiBearerAuth("JWT-AUTH")
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    @IsAuth()
    @RoleAccess(UserRole.ADMIN)
    @ApiBearerAuth("JWT-AUTH")
    remove(@Param('id') id: string) {
        return this.productService.remove(id);
    }
}
