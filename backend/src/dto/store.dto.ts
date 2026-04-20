export interface CreateStoreDto {
  name: string;
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  lat: number;
  lng: number;
}

export interface UpdateStoreDto {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  lat?: number;
  lng?: number;
  isActive?: boolean;
}