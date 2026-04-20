import { IContact } from '../../entities/contact.schema.js';
import { IContactService } from '../interfaces/IContact.service.js';
import { IContactRepository } from '../../repositories/interfaces/IContact.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { ContactQueryDto, ReplyDto } from '../../dto/contact.dto.js';
import { HttpError } from '../../middleware/error.middleware.js';
import { MESSAGES } from '../../constants/messages.constant.js';
import { StatusCode } from '../../constants/statusCode.js';

export class ContactService implements IContactService {
  constructor(private readonly contactRepository: IContactRepository) {}

  async getAll(query: ContactQueryDto): Promise<PaginatedResponse<IContact>> {
    return this.contactRepository.findAll(query);
  }

  async getById(id: string): Promise<IContact | null> {
    return this.contactRepository.findById(id);
  }

  async replyToMessage(id: string, data: ReplyDto): Promise<IContact | null> {
    const message = await this.contactRepository.findById(id);
    if (!message) {
      throw new HttpError(MESSAGES.CONTACT.NOT_FOUND, StatusCode.NOT_FOUND);
    }

    if (message.status === 'replied') {
      throw new HttpError(MESSAGES.CONTACT.ALREADY_REPLIED, StatusCode.BAD_REQUEST);
    }

    if (!data.reply || data.reply.trim().length === 0) {
      throw new HttpError(MESSAGES.CONTACT.REPLY_REQUIRED, StatusCode.BAD_REQUEST);
    }

    return this.contactRepository.replyToMessage(id, data.reply);
  }
}