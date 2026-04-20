import { ISettings } from '../../entities/settings.schema.js';
import { Settings } from '../../entities/settings.schema.js';
import { ISettingsRepository } from '../interfaces/ISettings.repository.js';
import { UpdateSettingsDto } from '../../dto/settings.dto.js';

export class SettingsRepository implements ISettingsRepository {
  async findOne(): Promise<ISettings> {
    let settings = await Settings.findOne().lean();
    if (!settings) {
      const created = await Settings.create({});
      return created.toObject() as unknown as ISettings;
    }
    return settings as unknown as ISettings;
  }

  async update(data: UpdateSettingsDto): Promise<ISettings | null> {
    const updated = await Settings.findOneAndUpdate({}, data, { upsert: true, new: true }).lean();
    return updated as unknown as ISettings | null;
  }
}