// Common types for the application

// Interface definitions matching Prisma models
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  password?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  description?: string | null;
  bannerUrl?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Prompt {
  id: string;
  title: string;
  body: string;
  copyCount: number;
  photoUrls: string[];
  folderId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromptTag {
  id: string;
  promptId: string;
  tagId: string;
  createdAt: Date;
}

// Extended Prompt type with related data
export type PromptWithRelations = Prompt & {
  folder: Folder;
  tags: Tag[];
};

// Extended Folder type with related data
export type FolderWithPrompts = Folder & {
  prompts: Prompt[];
};

// Response types for API endpoints
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Pagination type
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// Query parameters for prompt listing
export type PromptQueryParams = {
  page?: number;
  pageSize?: number;
  folderId?: string;
  tagIds?: string[];
  searchQuery?: string;
  sortBy?: 'copyCount' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
};

// Form data for creating/updating prompts
export interface PromptFormData {
  id?: string; // Optional ID for updates
  title: string;
  body: string;
  folderId: string;
  tagIds: string[];
}

// Form data for creating/updating folders
export type FolderFormData = {
  name: string;
  description?: string;
};

// Form data for creating tags
export type TagFormData = {
  name: string;
};
