export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface SearchParams {
  search?: string;
}

export interface QueryParams extends PaginationParams, SearchParams {}

export interface ItemsResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
}

export interface ItemResponse<T> {
  data: T;
}

export type Project = {
  id: string;
  name: string;
  description?: string;
  color?: string;
  tasks: Task[];
  group: string;
  isFavourites?: boolean;
};

export type Task = {
  id: string;
  name: string;
  description?: string;
  priority?: 0 | 1 | 2 | 3 | 4;
  project?: Project;
  date?: string;
  status: TaskStatus;
  projectId?: string;
};

export enum TaskStatus {
  IN_WORK = 'IN_WORK',
  FULFILLED = 'FULFILLED',
}

export interface User {
  id: number;
  email: string;
  username?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isLoadingApi: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  data: {
    user: User;
    accessToken: string | null;
    refreshToken: string | null;
  };
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
