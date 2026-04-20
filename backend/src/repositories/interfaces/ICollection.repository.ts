import { ICollection } from '../../entities/collection.schema.js';
import { IProduct } from '../../entities/product.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { CreateCollectionDto, UpdateCollectionDto, CollectionQueryDto } from '../../dto/collection.dto.js';

export interface ICollectionRepository {
  findAll(query: CollectionQueryDto): Promise<PaginatedResponse<ICollection>>;
  findById(id: string): Promise<ICollection | null>;
  findBySlug(slug: string): Promise<ICollection | null>;
  create(data: CreateCollectionDto, slug: string): Promise<ICollection>;
  update(id: string, data: UpdateCollectionDto, newSlug?: string): Promise<ICollection | null>;
  softDelete(id: string): Promise<boolean>;
  addProductsToCollection(collectionId: string, productIds: string[]): Promise<ICollection | null>;
  addCollectionToProducts(collectionId: string, productIds: string[]): Promise<boolean>;
  findProductsByIds(productIds: string[]): Promise<IProduct[]>;
}