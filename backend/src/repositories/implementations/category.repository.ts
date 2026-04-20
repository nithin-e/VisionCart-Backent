import { ICategory } from '../../entities/category.schema.js';
import { Category } from '../../entities/category.schema.js';
import { ICategoryRepository } from '../interfaces/ICategory.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { CreateCategoryDto, UpdateCategoryDto, CategoryQueryDto } from '../../dto/category.dto.js';

export class CategoryRepository implements ICategoryRepository {
  async findAll(query: CategoryQueryDto): Promise<PaginatedResponse<ICategory>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      Category.find({ isActive: true }).skip(skip).limit(limit).lean(),
      Category.countDocuments({ isActive: true }),
    ]);

    return {
      items: categories as unknown as ICategory[],
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  async findById(id: string): Promise<ICategory | null> {
    return Category.findById(id).lean() as Promise<ICategory | null>;
  }

  async findBySlug(slug: string): Promise<ICategory | null> {
    return Category.findOne({ slug }).lean() as Promise<ICategory | null>;
  }

  async create(data: CreateCategoryDto, slug: string): Promise<ICategory> {
    const category = new Category({
      name: data.name,
      slug,
      description: data.description || '',
      image: data.image || '',
    });
    return category.save() as Promise<ICategory>;
  }

  async update(id: string, data: UpdateCategoryDto, newSlug?: string): Promise<ICategory | null> {
    const updateData: Record<string, unknown> = { ...data };
    if (newSlug) {
      updateData.slug = newSlug;
    }
    return Category.findByIdAndUpdate(id, updateData, { new: true }).lean() as Promise<ICategory | null>;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await Category.findByIdAndUpdate(id, { isActive: false }, { new: true });
    return result !== null;
  }
}