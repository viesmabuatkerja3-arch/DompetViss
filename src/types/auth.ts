/**
 * Tipe data otentikasi pengguna
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  loginMethod: 'google' | 'email' | 'demo';
  createdAt: string;
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Disimpan lokal untuk simulasi autentikasi email
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
}
