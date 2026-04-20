import { ContactStatus } from '../entities/contact.schema.js';

export interface ContactQueryDto {
  page?: number;
  limit?: number;
  status?: ContactStatus;
}

export interface ReplyDto {
  reply: string;
}