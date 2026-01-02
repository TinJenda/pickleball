import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { TournamentState, UserRole } from '@/types';
import { ITournamentService } from './tournamentService';

export class FirestoreTournamentService implements ITournamentService {
  private tournamentId: string;
  private collectionName = 'tournaments';

  constructor(tournamentId: string = 'default') {
    this.tournamentId = tournamentId;
  }

  async saveTournament(state: TournamentState): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, this.tournamentId);
      await setDoc(docRef, {
        teams: state.teams,
        matches: state.matches,
        updatedAt: new Date().toISOString(),
      });
      console.log('Tournament saved to Firestore');
    } catch (error) {
      console.error('Error saving tournament to Firestore:', error);
      throw error;
    }
  }

  async loadTournament(): Promise<TournamentState | null> {
    try {
      const docRef = doc(db, this.collectionName, this.tournamentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Tournament loaded from Firestore');
        return {
          teams: data.teams || [],
          matches: data.matches || [],
        };
      }
      
      console.log('No tournament found in Firestore');
      return null;
    } catch (error) {
      console.error('Error loading tournament from Firestore:', error);
      return null;
    }
  }

  async saveRole(role: UserRole): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pickleball_role', role);
    }
  }

  async loadRole(): Promise<UserRole> {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('pickleball_role');
      return (role === 'admin' ? 'admin' : 'user') as UserRole;
    }
    return 'user';
  }

  async clearRole(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pickleball_role');
    }
  }

  async clearAll(): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, this.tournamentId);
      await deleteDoc(docRef);
      console.log('Tournament deleted from Firestore');
    } catch (error) {
      console.error('Error deleting tournament from Firestore:', error);
      throw error;
    }
  }
}
