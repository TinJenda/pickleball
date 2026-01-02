export interface Team {
  id: string;
  name: string;
  played: number;
  win: number;
  lose: number;
  pointDiff: number;
  rankingPoint: number;
}

export interface Match {
  id: string;
  teamAId: string;
  teamBId: string;
  scoreA: number | null;
  scoreB: number | null;
}

export interface TournamentState {
  teams: Team[];
  matches: Match[];
}

export type UserRole = 'user' | 'admin';
