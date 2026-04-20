import { IContact } from '../../entities/contact.schema.js';
import { Contact } from '../../entities/contact.schema.js';
import { IContactRepository } from '../interfaces/IContact.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { ContactQueryDto } from '../../dto/contact.dto.js';

export class ContactRepository implements IContactRepository {
  async findAll(query: ContactQueryDto): Promise<PaginatedResponse<IContact>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.status) {
      filter.status = query.status;
    }

    const [messages, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Contact.countDocuments(filter),
    ]);

    return {
      items: messages as unknown as IContact[],
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  async findById(id: string): Promise<IContact | null> {
    return Contact.findById(id).lean() as Promise<IContact | null>;
  }

  async replyToMessage(id: string, reply: string): Promise<IContact | null> {
    return Contact.findByIdAndUpdate(
      id,
      { reply, status: 'replied' },
      { new: true }
    ).lean() as Promise<IContact | null>;
  }
}