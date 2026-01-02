import { TournamentState, UserRole } from '@/types';

const TOURNAMENT_KEY = 'pickleball_tournament';
const ROLE_KEY = 'pickleball_role';

export const storage = {
  saveTournament: (state: TournamentState): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOURNAMENT_KEY, JSON.stringify(state));
    }
  },

  loadTournament: (): TournamentState | null => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(TOURNAMENT_KEY);
      if (data) {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error('Failed to parse tournament data:', e);
          return null;
        }
      }
    }
    return null;
  },

  saveRole: (role: UserRole): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ROLE_KEY, role);
    }
  },

  loadRole: (): UserRole => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem(ROLE_KEY);
      return (role === 'admin' ? 'admin' : 'user') as UserRole;
    }
    return 'user';
  },

  clearRole: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ROLE_KEY);
    }
  },

  clearAll: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOURNAMENT_KEY);
      localStorage.removeItem(ROLE_KEY);
    }
  },
};
