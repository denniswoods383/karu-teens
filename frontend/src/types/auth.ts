export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  bio?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}