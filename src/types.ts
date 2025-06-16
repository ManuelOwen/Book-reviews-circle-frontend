export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  organization?: string;
  bio?: string;
  avatar_url?: string;
  favorite_genres: string[];
  created_at?: string;
  updated_at?: string;
} 