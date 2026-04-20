import { IContact } from '../../entities/contact.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { ContactQueryDto, ReplyDto } from '../../dto/contact.dto.js';

export interface IContactService {
  getAll(query: ContactQueryDto): Promise<PaginatedResponse<IContact>>;
  getById(id: string): Promise<IContact | null>;
  replyToMessage(id: string, data: ReplyDto): Promise<IContact | null>;
}