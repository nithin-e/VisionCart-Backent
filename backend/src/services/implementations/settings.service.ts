import { ISettings } from '../../entities/settings.schema.js';
import { ISettingsService } from '../interfaces/ISettings.service.js';
import { ISettingsRepository } from '../../repositories/interfaces/ISettings.repository.js';
import { UpdateSettingsDto } from '../../dto/settings.dto.js';
import { HttpError } from '../../middleware/error.middleware.js';
import { MESSAGES } from '../../constants/messages.constant.js';
import { StatusCode } from '../../constants/statusCode.js';

export class SettingsService implements ISettingsService {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async get(): Promise<ISettings> {
    return this.settingsRepository.findOne();
  }

  async update(data: UpdateSettingsDto): Promise<ISettings | null> {
    if (data.taxPercentage !== undefined) {
      if (data.taxPercentage < 0 || data.taxPercentage > 100) {
        throw new HttpError(MESSAGES.SETTINGS.TAX_INVALID, StatusCode.BAD_REQUEST);
      }
    }

    if (data.shippingCharge !== undefined) {
      if (data.shippingCharge < 0) {
        throw new HttpError(MESSAGES.SETTINGS.SHIPPING_INVALID, StatusCode.BAD_REQUEST);
      }
    }

    if (data.freeShippingThreshold !== undefined) {
      if (data.freeShippingThreshold < 0) {
        throw new HttpError(MESSAGES.SETTINGS.THRESHOLD_INVALID, StatusCode.BAD_REQUEST);
      }
    }

    if (data.supportEmail !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.supportEmail)) {
        throw new HttpError(MESSAGES.SETTINGS.EMAIL_INVALID, StatusCode.BAD_REQUEST);
      }
    }

    return this.settingsRepository.update(data);
  }
}