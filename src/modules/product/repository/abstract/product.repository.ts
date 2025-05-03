import { ProductDocument } from '../../../../schemas';
import { ProductPersist } from './persistance/product.persist';

export abstract class ProductRepository {
  abstract create(data: ProductPersist): Promise<ProductDocument>;
  abstract findAll(limit?: number, page?: number): Promise<ProductDocument[]>;
  abstract findById(id: string): Promise<ProductDocument | null>;
  abstract update(
    id: string,
    data: Partial<ProductPersist>,
  ): Promise<ProductDocument | null>;
  abstract delete(id: string): Promise<ProductDocument | null>;

  abstract similaritySearch(query: number[], limit: number, threshold: number): Promise<ProductDocument[]>;
}
