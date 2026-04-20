import { ICategory } from '../../entities/category.schema.js';
import { ICategoryService } from '../interfaces/ICategory.service.js';
import { ICategoryRepository } from '../../repositories/interfaces/ICategory.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { CreateCategoryDto, UpdateCategoryDto, CategoryQueryDto } from '../../dto/category.dto.js';
import { generateSlug } from '../../utility/slug.util.js';
import { HttpError } from '../../middleware/error.middleware.js';
import { MESSAGES } from '../../constants/messages.constant.js';
import { StatusCode } from '../../constants/statusCode.js';

export class CategoryService implements ICategoryService {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async getAll(query: CategoryQueryDto): Promise<PaginatedResponse<ICategory>> {
    return this.categoryRepository.findAll(query);
  }

  async getById(id: string): Promise<ICategory | null> {
    return this.categoryRepository.findById(id);
  }

  async create(data: CreateCategoryDto): Promise<ICategory> {
    const slug = generateSlug(data.name);
    const existingCategory = await this.categoryRepository.findBySlug(slug);
    if (existingCategory) {
      throw new HttpError(MESSAGES.CATEGORY.ALREADY_EXISTS, StatusCode.BAD_REQUEST);
    }
    return this.categoryRepository.create(data, slug);
  }

  async update(id: string, data: UpdateCategoryDto): Promise<ICategory | null> {
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new HttpError(MESSAGES.CATEGORY.NOT_FOUND, StatusCode.NOT_FOUND);
    }
    let newSlug: string | undefined;
    if (data.name && data.name !== existingCategory.name) {
      newSlug = generateSlug(data.name);
      const duplicate = await this.categoryRepository.findBySlug(newSlug);
      if (duplicate && duplicate._id.toString() !== id) {
        throw new HttpError(MESSAGES.CATEGORY.ALREADY_EXISTS, StatusCode.BAD_REQUEST);
      }
    }
    return this.categoryRepository.update(id, data, newSlug);
  }

  async delete(id: string): Promise<boolean> {
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new HttpError(MESSAGES.CATEGORY.NOT_FOUND, StatusCode.NOT_FOUND);
    }
    return this.categoryRepository.softDelete(id);
  }
}