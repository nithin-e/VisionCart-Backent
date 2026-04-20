import { IStore } from '../../entities/store.schema.js';
import { Store } from '../../entities/store.schema.js';
import { IStoreRepository } from '../interfaces/IStore.repository.js';
import { CreateStoreDto, UpdateStoreDto } from '../../dto/store.dto.js';

export class StoreRepository implements IStoreRepository {
  async findAll(): Promise<IStore[]> {
    const stores = await Store.find({ isActive: true }).lean();
    return stores as unknown as IStore[];
  }

  async findById(id: string): Promise<IStore | null> {
    return Store.findById(id).lean() as Promise<IStore | null>;
  }

  async create(data: CreateStoreDto): Promise<IStore> {
    const storeData = {
      ...data,
      location: {
        type: 'Point',
        coordinates: [data.lng, data.lat],
      },
    };
    const store = new Store(storeData);
    return store.save() as Promise<IStore>;
  }

  async update(id: string, data: UpdateStoreDto): Promise<IStore | null> {
    const updateData: Record<string, unknown> = { ...data };
    if (data.lat !== undefined && data.lng !== undefined) {
      updateData.location = {
        type: 'Point',
        coordinates: [data.lng, data.lat],
      };
    } else if (data.lat !== undefined) {
      const existing = await Store.findById(id).select('lng').lean();
      if (existing) {
        updateData.location = {
          type: 'Point',
          coordinates: [existing.lng, data.lat],
        };
      }
    } else if (data.lng !== undefined) {
      const existing = await Store.findById(id).select('lat').lean();
      if (existing) {
        updateData.location = {
          type: 'Point',
          coordinates: [data.lng, existing.lat],
        };
      }
    }
    return Store.findByIdAndUpdate(id, updateData, { new: true }).lean() as Promise<IStore | null>;
  }

  async delete(id: string): Promise<boolean> {
    const result = await Store.findByIdAndDelete(id);
    return result !== null;
  }
}