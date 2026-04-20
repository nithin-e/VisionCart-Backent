import { IStore } from '../../entities/store.schema.js';
import { CreateStoreDto, UpdateStoreDto } from '../../dto/store.dto.js';

export interface IStoreRepository {
  findAll(): Promise<IStore[]>;
  findById(id: string): Promise<IStore | null>;
  create(data: CreateStoreDto): Promise<IStore>;
  update(id: string, data: UpdateStoreDto): Promise<IStore | null>;
  delete(id: string): Promise<boolean>;
}