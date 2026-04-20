export interface CreateCollectionDto {
  name: string;
  description?: string;
  image?: string;
}

export interface UpdateCollectionDto {
  name?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface CollectionQueryDto {
  page?: number;
  limit?: number;
}

export interface AssignProductsDto {
  productIds: string[];
}