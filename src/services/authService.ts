import { UserPersona, UserRoleType } from '../types';
import { MOCK_PERSONAS } from '../data/mockData';

const AUTH_STORAGE_KEY = 'cummins_ppwr_auth_user';

class AuthService {
  private currentUser: UserPersona | null = null;
  private listeners: Array<(user: UserPersona | null) => void> = [];

  constructor() {
    this.loadUser();
  }

  private loadUser() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const matched = MOCK_PERSONAS.find(p => p.id === parsed.id || p.email === parsed.email);
        this.currentUser = matched || parsed;
      } else {
        // Default demo session: Super Admin
        this.currentUser = MOCK_PERSONAS[0];
        this.saveUser();
      }
    } catch {
      this.currentUser = MOCK_PERSONAS[0];
    }
  }

  private saveUser() {
    try {
      if (this.currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to persist auth state', e);
    }
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.currentUser));
  }

  public subscribe(fn: (user: UserPersona | null) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  public getCurrentUser(): UserPersona | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public loginWithPersona(personaId: string): UserPersona | null {
    const persona = MOCK_PERSONAS.find(p => p.id === personaId);
    if (persona) {
      this.currentUser = persona;
      this.saveUser();
      this.notify();
      return persona;
    }
    return null;
  }

  public loginWithEmail(email: string): UserPersona | null {
    const trimmed = email.toLowerCase().trim();
    const persona = MOCK_PERSONAS.find(p => p.email.toLowerCase() === trimmed) || MOCK_PERSONAS[0];
    this.currentUser = persona;
    this.saveUser();
    this.notify();
    return persona;
  }

  public logout() {
    this.currentUser = null;
    this.saveUser();
    this.notify();
  }

  public isSuperAdmin(): boolean {
    return this.currentUser?.role === 'SUPER_ADMIN';
  }

  public isFactoryManager(): boolean {
    return this.currentUser?.role === 'FACTORY_MANAGER';
  }

  public isDataEntry(): boolean {
    return this.currentUser?.role === 'DATA_ENTRY';
  }

  public hasPermission(permission: keyof UserPersona['permissions']): boolean {
    if (!this.currentUser) return false;
    return !!this.currentUser.permissions[permission];
  }
}

export const authService = new AuthService();
