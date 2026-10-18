/**
 * Pengelolaan sesi otentikasi login dengan Email dan Google.
 * Data sesi disimpan di localStorage browser sehingga persisten antar refresh.
 */

import { UserProfile, StoredUser } from '../types/auth';

const SESSION_KEY = 'dompetku_auth_session_v1';
const USERS_REGISTRY_KEY = 'dompetku_registered_users_v1';

/**
 * Mendapatkan sesi user yang sedang aktif
 */
export function getActiveSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Gagal membaca sesi auth:', err);
    return null;
  }
}

/**
 * Menyimpan sesi user yang berhasil login
 */
export function setActiveSession(user: UserProfile): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Gagal menyimpan sesi auth:', err);
  }
}

/**
 * Menghapus sesi user (Logout)
 */
export function clearActiveSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.error('Gagal menghapus sesi auth:', err);
  }
}

/**
 * Mendapatkan daftar user yang terdaftar
 */
function getRegisteredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    if (!raw) {
      // Inisialisasi akun demo bawaan
      const defaultUsers: StoredUser[] = [
        {
          id: 'user_demo_1',
          name: 'Pengguna Keuangan',
          email: 'demo@dompetku.id',
          passwordHash: 'password123',
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Login dengan Email dan Password
 */
export function loginWithEmail(email: string, password: string): { success: boolean; error?: string; user?: UserProfile } {
  const cleanEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();

  const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!found) {
    return {
      success: false,
      error: 'Email belum terdaftar. Silakan buat akun baru terlebih dahulu.',
    };
  }

  if (found.passwordHash !== password) {
    return {
      success: false,
      error: 'Kata sandi tidak sesuai. Silakan periksa kembali.',
    };
  }

  const profile: UserProfile = {
    id: found.id,
    name: found.name,
    email: found.email,
    loginMethod: 'email',
    createdAt: found.createdAt,
  };

  setActiveSession(profile);
  return { success: true, user: profile };
}

/**
 * Mendaftar akun baru dengan Email dan Password
 */
export function registerWithEmail(name: string, email: string, password: string): { success: boolean; error?: string; user?: UserProfile } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  if (!cleanName) {
    return { success: false, error: 'Nama lengkap wajib diisi.' };
  }
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Format email tidak valid.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Kata sandi minimal 6 karakter.' };
  }

  const users = getRegisteredUsers();
  const alreadyExists = users.some((u) => u.email.toLowerCase() === cleanEmail);
  if (alreadyExists) {
    return { success: false, error: 'Email ini sudah terdaftar. Silakan langsung masuk.' };
  }

  const newUser: StoredUser = {
    id: 'user_' + Date.now().toString(36),
    name: cleanName,
    email: cleanEmail,
    passwordHash: password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));

  const profile: UserProfile = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    loginMethod: 'email',
    createdAt: newUser.createdAt,
  };

  setActiveSession(profile);
  return { success: true, user: profile };
}

/**
 * Login dengan Akun Google
 */
export function loginWithGoogle(customEmail?: string, customName?: string): UserProfile {
  const email = customEmail || 'pengguna.google@gmail.com';
  const name = customName || 'Pengguna Google';

  const profile: UserProfile = {
    id: 'google_' + Date.now().toString(36),
    name,
    email,
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=10b981&textColor=ffffff`,
    loginMethod: 'google',
    createdAt: new Date().toISOString(),
  };

  setActiveSession(profile);
  return profile;
}

/**
 * Login Cepat Tamu / Demo
 */
export function loginAsDemo(): UserProfile {
  const profile: UserProfile = {
    id: 'demo_user',
    name: 'Tamu / Akun Demo',
    email: 'tamu@dompetku.id',
    loginMethod: 'demo',
    createdAt: new Date().toISOString(),
  };

  setActiveSession(profile);
  return profile;
}
