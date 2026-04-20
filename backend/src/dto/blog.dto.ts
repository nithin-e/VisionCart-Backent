export interface BlogQueryDto {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface CreateBlogDto {
  title: string;
  content: string;
  image?: string;
}

export interface UpdateBlogDto {
  title?: string;
  content?: string;
  image?: string;
  isActive?: boolean;
}