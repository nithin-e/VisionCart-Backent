import { ICollection } from '../../entities/collection.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { CreateCollectionDto, UpdateCollectionDto, CollectionQueryDto, AssignProductsDto } from '../../dto/collection.dto.js';

export interface ICollectionService {
  getAll(query: CollectionQueryDto): Promise<PaginatedResponse<ICollection>>;
  getById(id: string): Promise<ICollection | null>;
  create(data: CreateCollectionDto): Promise<ICollection>;
  update(id: string, data: UpdateCollectionDto): Promise<ICollection | null>;
  delete(id: string): Promise<boolean>;
  assignProducts(collectionId: string, data: AssignProductsDto): Promise<boolean>;
}