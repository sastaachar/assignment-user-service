export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  expiresIn: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: number;
  role: string;
} 