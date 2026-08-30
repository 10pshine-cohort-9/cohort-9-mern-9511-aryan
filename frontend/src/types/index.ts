export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  color?: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NoteSavePayload {
  title: string;
  content: string;
  tags: string[];
  color: string;
  isPinned: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  statusCode?: number;
  data?: T;
  errors?: string[];
}
