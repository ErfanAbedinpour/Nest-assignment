import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './repository/abstract/product.repository';
import { CreateProductDto } from './DTO/create-product.dto';
import { ProductDocument } from '../../schemas';
import { ErrorMessages } from '../../errorResponses/errorResponse.enum ';
import { UpdateProductDto } from './DTO/update-product.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductCreatedEvent } from './events/create-product.event';
import { omit } from 'lodash';
import { GetSimilarProductQueryDTO } from './DTO/get-similar-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly repository: ProductRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateProductDto) {
    const result = (
      await this.repository.create({
        category: dto.category,
        name: dto.name,
        originalDescription: dto.description,
        price: dto.price,
      })
    ).toObject();

    // Remove vector and __v FROM Result (Not Perfect Approach!!)
    const cleanResult = omit(result, ['vector', '__v']);
    // use EventEmitter For Decouple Services. This Standardize The Description And Store Them in DB
    this.eventEmitter.emit(
      'product.created',
      new ProductCreatedEvent(result.id, result.originalDescription),
    );

    return cleanResult;
  }

  async findAll(
    limit: number = 10,
    page: number = 1,
  ): Promise<ProductDocument[]> {
    return this.repository.findAll(limit, page);
  }

  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.repository.findById(id);
    if (!product) throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND);
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductDocument> {
    const product = await this.repository.update(id, {
      name: dto.name,
      category: dto.category,
      originalDescription: dto.description,
      price: dto.price,
    });
    if (!product) throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND);
    return product;
  }

  async remove(id: string): Promise<ProductDocument> {
    const product = await this.repository.delete(id);
    if (!product) throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND);
    return product;
  }

  findSimilarProduct(dto: GetSimilarProductQueryDTO) {}
}
