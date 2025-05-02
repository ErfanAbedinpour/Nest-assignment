import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './repository/abstract/product.repository';
import { CreateProductDto } from './DTO/create-product.dto';
import Decimal from 'decimal.js';
import { ProductDocument } from '../../schemas';
import { ErrorMessages } from '../../errorResponses/errorResponse.enum ';
import { UpdateProductDto } from './DTO/update-product.dto';
import { ProductPersist } from './repository/abstract/persistance/product.persist';

@Injectable()
export class ProductService {
    constructor(private readonly repository: ProductRepository) { }

    async create(dto: CreateProductDto) {
        console.log('price is ', dto.price)
        return this.repository.create({
            category: dto.category,
            name: dto.name,
            originalDescription: dto.description,
            price: dto.price
        });
    }

    async findAll(limit: number = 10, page: number = 1): Promise<ProductDocument[]> {
        return this.repository.findAll(limit, page);
    }

    async findOne(id: string): Promise<ProductDocument> {
        const product = await this.repository.findById(id);
        if (!product) throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND);
        return product;
    }

    async update(id: string, dto: UpdateProductDto): Promise<ProductDocument> {

        const product = await this.repository.update(id, { name: dto.name, category: dto.category, originalDescription: dto.description, price: dto.price });
        if (!product) throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND);
        return product;
    }

    async remove(id: string): Promise<ProductDocument> {
        const product = await this.repository.delete(id);
        if (!product) throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND);
        return product;
    }
}