import { IBlog } from '../../entities/blog.schema.js';
import { Blog } from '../../entities/blog.schema.js';
import { IBlogRepository } from '../interfaces/IBlog.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { BlogQueryDto, CreateBlogDto, UpdateBlogDto } from '../../dto/blog.dto.js';

export class BlogRepository implements IBlogRepository {
  async findAll(query: BlogQueryDto): Promise<PaginatedResponse<IBlog>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive;
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Blog.countDocuments(filter),
    ]);

    return {
      items: blogs as unknown as IBlog[],
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  async findById(id: string): Promise<IBlog | null> {
    return Blog.findById(id).lean() as Promise<IBlog | null>;
  }

  async findBySlug(slug: string): Promise<IBlog | null> {
    return Blog.findOne({ slug }).lean() as Promise<IBlog | null>;
  }

  async create(data: CreateBlogDto, slug: string): Promise<IBlog> {
    const blog = new Blog({
      title: data.title,
      slug,
      content: data.content,
      image: data.image || '',
    });
    return blog.save() as Promise<IBlog>;
  }

  async update(id: string, data: UpdateBlogDto): Promise<IBlog | null> {
    return Blog.findByIdAndUpdate(id, data, { new: true }).lean() as Promise<IBlog | null>;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await Blog.findByIdAndUpdate(id, { isActive: false }, { new: true });
    return result !== null;
  }
}