import { IStore } from '../../entities/store.schema.js';
import { IStoreService } from '../interfaces/IStore.service.js';
import { IStoreRepository } from '../../repositories/interfaces/IStore.repository.js';
import { CreateStoreDto, UpdateStoreDto } from '../../dto/store.dto.js';
import { HttpError } from '../../middleware/error.middleware.js';
import { MESSAGES } from '../../constants/messages.constant.js';
import { StatusCode } from '../../constants/statusCode.js';

export class StoreService implements IStoreService {
  constructor(private readonly storeRepository: IStoreRepository) {}

  async getAll(): Promise<IStore[]> {
    return this.storeRepository.findAll();
  }

  async getById(id: string): Promise<IStore | null> {
    return this.storeRepository.findById(id);
  }

  async create(data: CreateStoreDto): Promise<IStore> {
    if (data.lat < -90 || data.lat > 90) {
      throw new HttpError(MESSAGES.STORE.LAT_INVALID, StatusCode.BAD_REQUEST);
    }
    if (data.lng < -180 || data.lng > 180) {
      throw new HttpError(MESSAGES.STORE.LNG_INVALID, StatusCode.BAD_REQUEST);
    }
    return this.storeRepository.create(data);
  }

  async update(id: string, data: UpdateStoreDto): Promise<IStore | null> {
    const existingStore = await this.storeRepository.findById(id);
    if (!existingStore) {
      throw new HttpError(MESSAGES.STORE.NOT_FOUND, StatusCode.NOT_FOUND);
    }

    const lat = data.lat ?? existingStore.lat;
    const lng = data.lng ?? existingStore.lng;

    if (lat < -90 || lat > 90) {
      throw new HttpError(MESSAGES.STORE.LAT_INVALID, StatusCode.BAD_REQUEST);
    }
    if (lng < -180 || lng > 180) {
      throw new HttpError(MESSAGES.STORE.LNG_INVALID, StatusCode.BAD_REQUEST);
    }

    return this.storeRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    const existingStore = await this.storeRepository.findById(id);
    if (!existingStore) {
      throw new HttpError(MESSAGES.STORE.NOT_FOUND, StatusCode.NOT_FOUND);
    }
    return this.storeRepository.delete(id);
  }
}