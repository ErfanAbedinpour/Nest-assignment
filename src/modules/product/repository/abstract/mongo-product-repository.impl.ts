import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductRepository } from './product.repository';
import { Product, ProductDocument } from '../../../../schemas';
import { ProductPersist } from './persistance/product.persist';
import { ObjectId } from 'mongodb';

@Injectable()
export class MongoProductRepository implements ProductRepository, OnModuleInit {
  constructor(@InjectModel(Product.name) private model: Model<Product>) {}

  /**
   * Create vector Search Index
   */
  async onModuleInit() {
    /**
     *  Create Vector Search Index
     *
     */
    const index = {
      name: 'vector_idx',
      type: 'vectorSearch',
      definition: {
        fields: [
          {
            type: 'vector',
            path: 'vector',
            similarity: 'cosine',
            numDimensions: 768,
          },
        ],
      },
    };

    await this.model.createSearchIndex(index);
  }

  async create(data: ProductPersist): Promise<ProductDocument> {
    return new this.model(data).save();
  }

  async findAll(limit?: number, page?: number): Promise<ProductDocument[]> {
    limit = limit || 10;
    page = page || 1;

    return this.model
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-__v')
      .exec();
  }

  async findById(id: string): Promise<ProductDocument | null> {
    return this.model.findById(new ObjectId(id)).select('-__v').exec();
  }

  async update(
    id: string,
    data: Partial<ProductPersist>,
  ): Promise<ProductDocument | null> {
    return this.model
      .findByIdAndUpdate(new ObjectId(id), data, { new: true })
      .select('-__v')
      .exec();
  }

  async delete(id: string): Promise<ProductDocument | null> {
    return this.model.findByIdAndDelete(id).select('-__v').exec();
  }

  async similaritySearch(
    query: number[],
    limit: number,
    threshold: number,
  ): Promise<ProductDocument[]> {
    const results = await this.model.aggregate([
      {
        $vectorSearch: {
          index: 'vector_idx',
          path: 'vector',
          queryVector: query,
          numCandidates: 100,
          limit: limit,
        },
      },
      {
        $project: {
          name: 1,
          _id: 1,
          price: 1,
          originalDescription: 1,
          standardizedDescription: 1,
          category: 1,
          score: {
            $meta: 'vectorSearchScore',
          },
        },
      },
      {
        $match: {
          score: { $gte: threshold },
        },
      },
    ]);

    /**
     *      */
    return results;
  }
}
