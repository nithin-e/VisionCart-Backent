import { ICollection } from '../../entities/collection.schema.js';
import { Collection } from '../../entities/collection.schema.js';
import { Product, IProduct } from '../../entities/product.schema.js';
import { ICollectionRepository } from '../interfaces/ICollection.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { CreateCollectionDto, UpdateCollectionDto, CollectionQueryDto } from '../../dto/collection.dto.js';

export class CollectionRepository implements ICollectionRepository {
  async findAll(query: CollectionQueryDto): Promise<PaginatedResponse<ICollection>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [collections, total] = await Promise.all([
      Collection.find({ isActive: true }).skip(skip).limit(limit).lean(),
      Collection.countDocuments({ isActive: true }),
    ]);

    return {
      items: collections as unknown as ICollection[],
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  async findById(id: string): Promise<ICollection | null> {
    return Collection.findById(id).lean() as Promise<ICollection | null>;
  }

  async findBySlug(slug: string): Promise<ICollection | null> {
    return Collection.findOne({ slug }).lean() as Promise<ICollection | null>;
  }

  async create(data: CreateCollectionDto, slug: string): Promise<ICollection> {
    const collection = new Collection({
      name: data.name,
      slug,
      description: data.description || '',
      image: data.image || '',
    });
    return collection.save() as Promise<ICollection>;
  }

  async update(id: string, data: UpdateCollectionDto, newSlug?: string): Promise<ICollection | null> {
    const updateData: Record<string, unknown> = { ...data };
    if (newSlug) {
      updateData.slug = newSlug;
    }
    return Collection.findByIdAndUpdate(id, updateData, { new: true }).lean() as Promise<ICollection | null>;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await Collection.findByIdAndUpdate(id, { isActive: false }, { new: true });
    return result !== null;
  }

  async addProductsToCollection(collectionId: string, productIds: string[]): Promise<ICollection | null> {
    return Collection.findByIdAndUpdate(
      collectionId,
      { $addToSet: { productIds: { $each: productIds } } },
      { new: true }
    ).lean() as Promise<ICollection | null>;
  }

  async addCollectionToProducts(collectionId: string, productIds: string[]): Promise<boolean> {
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $addToSet: { collectionIds: collectionId } }
    );
    return result.modifiedCount > 0;
  }

  async findProductsByIds(productIds: string[]): Promise<IProduct[]> {
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    return products as unknown as IProduct[];
  }
}