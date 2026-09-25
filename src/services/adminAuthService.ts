const ADMIN_CREDENTIALS = {
  username: 'admin_ilham',
  password: 'ilhamfazril',
};

const AUTH_STORAGE_KEY = 'ra_almaqom_admin_session';
const LEGACY_AUTH_STORAGE_KEY = 'mts_fatahillah_admin_session';

export interface AdminSession {
  username: string;
  displayName: string;
  role: string;
  loggedInAt: number;
}

export function loginAdmin(usernameInput: string, passwordInput: string): { success: boolean; error?: string; session?: AdminSession } {
  const cleanUser = usernameInput.trim();
  const cleanPass = passwordInput.trim();

  if (!cleanUser || !cleanPass) {
    return { success: false, error: 'Silakan isi username dan kata sandi.' };
  }

  if (cleanUser === ADMIN_CREDENTIALS.username && cleanPass === ADMIN_CREDENTIALS.password) {
    const session: AdminSession = {
      username: ADMIN_CREDENTIALS.username,
      displayName: 'Ilham Fazril (Administrator)',
      role: 'Administrator Konten Utama',
      loggedInAt: Date.now(),
    };
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
    } catch {
      // Fallback
    }
    return { success: true, session };
  }

  return { 
    success: false, 
    error: 'Username atau kata sandi tidak cocok. Pastikan menggunakan akun admin yang terdaftar.' 
  };
}

export function logoutAdmin(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

export function getAdminSession(): AdminSession | null {
  try {
    let raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_AUTH_STORAGE_KEY);
      if (raw) {
        localStorage.setItem(AUTH_STORAGE_KEY, raw);
        localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
      }
    }
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (session && session.username === ADMIN_CREDENTIALS.username) {
      return session;
    }
    return null;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null;
}

export const isAdminLoggedIn = isAdminAuthenticated;
