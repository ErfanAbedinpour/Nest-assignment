import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductRepository } from './product.repository';
import { Product, ProductDocument } from '../../../../schemas';
import { ProductPersist } from './persistance/product.persist';
import { ObjectId } from 'mongodb';

@Injectable()
export class MongoProductRepository implements ProductRepository {
  constructor(@InjectModel(Product.name) private model: Model<Product>) {}

  async create(data: ProductPersist): Promise<ProductDocument> {
    return new this.model(data).save();
  }

  async findAll(limit = 10, page = 1): Promise<ProductDocument[]> {
    return this.model
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-vector -__v')
      .exec();
  }

  async findById(id: string): Promise<ProductDocument | null> {
    return this.model.findById(new ObjectId(id)).select('-vector -__v').exec();
  }

  async update(
    id: string,
    data: Partial<ProductPersist>,
  ): Promise<ProductDocument | null> {
    return this.model
      .findByIdAndUpdate(new ObjectId(id), data, { new: true })
      .select('-vector -__v')
      .exec();
  }

  async delete(id: string): Promise<ProductDocument | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
