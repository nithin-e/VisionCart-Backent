import { IContact } from '../../entities/contact.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { ContactQueryDto } from '../../dto/contact.dto.js';

export interface IContactRepository {
  findAll(query: ContactQueryDto): Promise<PaginatedResponse<IContact>>;
  findById(id: string): Promise<IContact | null>;
  replyToMessage(id: string, reply: string): Promise<IContact | null>;
}