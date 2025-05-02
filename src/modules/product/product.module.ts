import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../../schemas';
import { ProductRepository } from './repository/abstract/product.repository';
import { MongoProductRepository } from './repository/abstract/mongo-product-repository.impl';
import { DescriptionService } from './ai/abstract/description.service';
import { ProductCreatedHandler } from './events/handlers/product-created.handler';
import { OpenRouterDescriptionService } from './ai/openRouter-description.service.impl';
import { EmbeddingService } from './ai/abstract/embedding.service';
import { OpenApiEmbeddingService } from './ai/openApi-embedding.service.impl';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductCreatedHandler,
    {
      provide: ProductRepository,
      useClass: MongoProductRepository,
    },
    {
      provide: DescriptionService,
      useClass: OpenRouterDescriptionService,
    },
    {
      provide: EmbeddingService,
      useClass: OpenApiEmbeddingService
    }
  ],
  exports: [ProductService],
})
export class ProductModule { }
