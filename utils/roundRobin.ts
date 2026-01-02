import { Match, Team } from '@/types';

export function generateRoundRobinMatches(teams: Team[]): Match[] {
  const matches: Match[] = [];
  
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        id: `${teams[i].id}-${teams[j].id}`,
        teamAId: teams[i].id,
        teamBId: teams[j].id,
        scoreA: null,
        scoreB: null,
      });
    }
  }
  
  return matches;
}
