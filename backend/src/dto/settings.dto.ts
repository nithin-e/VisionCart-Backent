export interface UpdateSettingsDto {
  siteName?: string;
  supportEmail?: string;
  contactPhone?: string;
  currency?: string;
  taxPercentage?: number;
  shippingCharge?: number;
  freeShippingThreshold?: number;
}