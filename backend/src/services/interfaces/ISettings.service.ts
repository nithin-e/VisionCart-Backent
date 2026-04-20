import { ISettings } from '../../entities/settings.schema.js';
import { UpdateSettingsDto } from '../../dto/settings.dto.js';

export interface ISettingsService {
  get(): Promise<ISettings>;
  update(data: UpdateSettingsDto): Promise<ISettings | null>;
}