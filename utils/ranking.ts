import { Team } from '@/types';

export function sortTeamsByRanking(teams: Team[]): Team[] {
  return [...teams].sort((a, b) => {
    if (b.rankingPoint !== a.rankingPoint) {
      return b.rankingPoint - a.rankingPoint;
    }
    
    if (b.pointDiff !== a.pointDiff) {
      return b.pointDiff - a.pointDiff;
    }
    
    return a.name.localeCompare(b.name);
  });
}

export function createNewTeam(name: string): Team {
  return {
    id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    played: 0,
    win: 0,
    lose: 0,
    pointDiff: 0,
    rankingPoint: 0,
  };
}
