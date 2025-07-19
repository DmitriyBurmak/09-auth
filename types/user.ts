export interface User {
  id: string;
  email: string;
  username?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  username?: string;
}
