import { TournamentState, UserRole } from '@/types';

export interface ITournamentService {
  saveTournament(state: TournamentState): Promise<void>;
  loadTournament(): Promise<TournamentState | null>;
  saveRole(role: UserRole): Promise<void>;
  loadRole(): Promise<UserRole>;
  clearRole(): Promise<void>;
  clearAll(): Promise<void>;
}

class LocalStorageTournamentService implements ITournamentService {
  private readonly TOURNAMENT_KEY = 'pickleball_tournament';
  private readonly ROLE_KEY = 'pickleball_role';

  async saveTournament(state: TournamentState): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOURNAMENT_KEY, JSON.stringify(state));
    }
  }

  async loadTournament(): Promise<TournamentState | null> {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.TOURNAMENT_KEY);
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
  }

  async saveRole(role: UserRole): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ROLE_KEY, role);
    }
  }

  async loadRole(): Promise<UserRole> {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem(this.ROLE_KEY);
      return (role === 'admin' ? 'admin' : 'user') as UserRole;
    }
    return 'user';
  }

  async clearRole(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ROLE_KEY);
    }
  }

  async clearAll(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOURNAMENT_KEY);
      localStorage.removeItem(this.ROLE_KEY);
    }
  }
}

import { FirestoreTournamentService } from './firestoreService';

// Switch between localStorage and Firestore
// export const tournamentService: ITournamentService = new LocalStorageTournamentService();
export const tournamentService: ITournamentService = new FirestoreTournamentService();
