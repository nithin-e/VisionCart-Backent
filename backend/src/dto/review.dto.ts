export interface ReviewQueryDto {
  page?: number;
  limit?: number;
  isApproved?: boolean;
  productId?: string;
}