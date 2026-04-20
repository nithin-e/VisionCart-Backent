import { ICollection } from '../../entities/collection.schema.js';
import { ICollectionService } from '../interfaces/ICollection.service.js';
import { ICollectionRepository } from '../../repositories/interfaces/ICollection.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { CreateCollectionDto, UpdateCollectionDto, CollectionQueryDto, AssignProductsDto } from '../../dto/collection.dto.js';
import { generateSlug } from '../../utility/slug.util.js';
import { HttpError } from '../../middleware/error.middleware.js';
import { MESSAGES } from '../../constants/messages.constant.js';
import { StatusCode } from '../../constants/statusCode.js';

export class CollectionService implements ICollectionService {
  constructor(private readonly collectionRepository: ICollectionRepository) {}

  async getAll(query: CollectionQueryDto): Promise<PaginatedResponse<ICollection>> {
    return this.collectionRepository.findAll(query);
  }

  async getById(id: string): Promise<ICollection | null> {
    return this.collectionRepository.findById(id);
  }

  async create(data: CreateCollectionDto): Promise<ICollection> {
    const slug = generateSlug(data.name);
    const existingCollection = await this.collectionRepository.findBySlug(slug);
    if (existingCollection) {
      throw new HttpError(MESSAGES.COLLECTION.ALREADY_EXISTS, StatusCode.BAD_REQUEST);
    }
    return this.collectionRepository.create(data, slug);
  }

  async update(id: string, data: UpdateCollectionDto): Promise<ICollection | null> {
    const existingCollection = await this.collectionRepository.findById(id);
    if (!existingCollection) {
      throw new HttpError(MESSAGES.COLLECTION.NOT_FOUND, StatusCode.NOT_FOUND);
    }
    let newSlug: string | undefined;
    if (data.name && data.name !== existingCollection.name) {
      newSlug = generateSlug(data.name);
      const duplicate = await this.collectionRepository.findBySlug(newSlug);
      if (duplicate && duplicate._id.toString() !== id) {
        throw new HttpError(MESSAGES.COLLECTION.ALREADY_EXISTS, StatusCode.BAD_REQUEST);
      }
    }
    return this.collectionRepository.update(id, data, newSlug);
  }

  async delete(id: string): Promise<boolean> {
    const existingCollection = await this.collectionRepository.findById(id);
    if (!existingCollection) {
      throw new HttpError(MESSAGES.COLLECTION.NOT_FOUND, StatusCode.NOT_FOUND);
    }
    return this.collectionRepository.softDelete(id);
  }

  async assignProducts(collectionId: string, data: AssignProductsDto): Promise<boolean> {
    const existingCollection = await this.collectionRepository.findById(collectionId);
    if (!existingCollection) {
      throw new HttpError(MESSAGES.COLLECTION.NOT_FOUND, StatusCode.NOT_FOUND);
    }

    const validProducts = await this.collectionRepository.findProductsByIds(data.productIds);
    if (validProducts.length !== data.productIds.length) {
      const foundIds = validProducts.map((p) => p._id.toString());
      const invalidIds = data.productIds.filter((id) => !foundIds.includes(id));
      throw new HttpError(MESSAGES.COLLECTION.INVALID_PRODUCT_IDS(invalidIds.join(', ')), StatusCode.BAD_REQUEST);
    }

    await this.collectionRepository.addProductsToCollection(collectionId, data.productIds);
    await this.collectionRepository.addCollectionToProducts(collectionId, data.productIds);

    return true;
  }
}