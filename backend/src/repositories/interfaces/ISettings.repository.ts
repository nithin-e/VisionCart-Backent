import { ISettings } from '../../entities/settings.schema.js';
import { UpdateSettingsDto } from '../../dto/settings.dto.js';

export interface ISettingsRepository {
  findOne(): Promise<ISettings>;
  update(data: UpdateSettingsDto): Promise<ISettings | null>;
}