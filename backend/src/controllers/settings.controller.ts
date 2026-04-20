import { Request, Response, NextFunction } from 'express';
import { ISettingsService } from '../services/interfaces/ISettings.service.js';
import { UpdateSettingsDto } from '../dto/settings.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';

export class SettingsController {
  constructor(private readonly settingsService: ISettingsService) {}

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await this.settingsService.get();
      res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request<unknown, unknown, UpdateSettingsDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.settingsService.update(req.body);
      res.json({ success: true, message: MESSAGES.SETTINGS.UPDATED });
    } catch (error) {
      next(error);
    }
  }
}