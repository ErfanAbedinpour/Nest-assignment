import { OnEvent } from '@nestjs/event-emitter';
import { DescriptionService } from '../../ai/abstract/description.service';
import { Product } from '../../../../schemas';
import { ObjectId } from 'mongodb';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductCreatedEvent } from '../create-product.event';
import { EmbeddingService } from '../../ai/abstract/embedding.service';

export class ProductCreatedHandler {
  constructor(
    private productDescription: DescriptionService,
    private embeddingService: EmbeddingService,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }
  private readonly logger = new Logger(ProductCreatedHandler.name);

  @OnEvent('product.created')
  async handle(event: ProductCreatedEvent) {
    try {

      const standardized = await this.productDescription.standardize(
        event.originalDescription,
      );

      const vector = await this.embeddingService.generateEmbedding(standardized);

      await this.productModel.updateOne(
        { _id: new ObjectId(event.id) },
        { standardizedDescription: standardized, vector }
      );

    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}


