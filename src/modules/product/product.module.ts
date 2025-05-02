import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../../schemas';
import { ProductRepository } from './repository/abstract/product.repository';
import { MongoProductRepository } from './repository/abstract/mongo-product-repository.impl';
import { DescriptionService } from './ai/abstract-description.service';
import { ProductCreatedHandler } from './events/handlers/product-created.handler';
import { OpenRouterDescriptionService } from './ai/openAi-description.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: ProductRepository,
      useClass: MongoProductRepository,
    },
    {
      provide: DescriptionService,
      useClass: OpenRouterDescriptionService,
    },
    ProductCreatedHandler,
  ],
  exports: [ProductService],
})
export class ProductModule {}
