import { useState, useEffect, useCallback } from 'react';
import { Team, Match, TournamentState, UserRole } from '@/types';
import { tournamentService } from '@/services/tournamentService';
import { authService } from '@/services/authService';
import { generateRoundRobinMatches } from '@/utils/roundRobin';
import { createNewTeam } from '@/utils/ranking';

export function useTournament() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [role, setRole] = useState<UserRole>('user');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const savedState = await tournamentService.loadTournament();
      const savedRole = await tournamentService.loadRole();
      
      if (savedState) {
        setTeams(savedState.teams);
        setMatches(savedState.matches);
      }
      
      setRole(savedRole);
      setIsLoaded(true);
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      tournamentService.saveTournament({ teams, matches });
    }
  }, [teams, matches, isLoaded]);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    const isAuthenticated = await authService.login(username, password);
    if (isAuthenticated) {
      setRole('admin');
      await tournamentService.saveRole('admin');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setRole('user');
    tournamentService.clearRole();
  }, []);

  const addTeam = useCallback((name: string) => {
    const newTeam = createNewTeam(name);
    setTeams(prev => [...prev, newTeam]);
  }, []);

  const removeTeam = useCallback((teamId: string) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
    setMatches(prev => prev.filter(m => m.teamAId !== teamId && m.teamBId !== teamId));
  }, []);

  const updateTeam = useCallback((teamId: string, newName: string) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId ? { ...team, name: newName } : team
    ));
  }, []);

  const generateMatches = useCallback(() => {
    setMatches(prevMatches => {
      // Get existing match pairs to avoid duplicates
      const existingPairs = new Set(
        prevMatches.map(m => {
          const pair = [m.teamAId, m.teamBId].sort();
          return `${pair[0]}-${pair[1]}`;
        })
      );

      // Generate all possible matches
      const allMatches = generateRoundRobinMatches(teams);
      
      // Filter out matches that already exist
      const newMatchesToAdd = allMatches.filter(match => {
        const pair = [match.teamAId, match.teamBId].sort();
        const pairKey = `${pair[0]}-${pair[1]}`;
        return !existingPairs.has(pairKey);
      });

      // Keep existing matches and add only new ones
      return [...prevMatches, ...newMatchesToAdd];
    });
    
    // Only reset stats for teams that don't have any matches played yet
    setTeams(prev => prev.map(team => {
      // If team has no played matches, reset their stats
      if (team.played === 0) {
        return {
          ...team,
          played: 0,
          win: 0,
          lose: 0,
          pointDiff: 0,
          rankingPoint: 0,
        };
      }
      // Keep existing stats for teams that have played
      return team;
    }));
  }, [teams]);

  const updateMatchScore = useCallback((matchId: string, scoreA: number, scoreB: number) => {
    const oldMatch = matches.find(m => m.id === matchId);
    if (!oldMatch) return;
    
    setTeams(prevTeams => {
      return prevTeams.map(team => {
        if (team.id !== oldMatch.teamAId && team.id !== oldMatch.teamBId) {
          return team;
        }
        
        let newTeam = { ...team };
        
        if (oldMatch.scoreA !== null && oldMatch.scoreB !== null) {
          const oldDiff = oldMatch.scoreA - oldMatch.scoreB;
          
          if (team.id === oldMatch.teamAId) {
            newTeam.played -= 1;
            newTeam.win -= oldDiff > 0 ? 1 : 0;
            newTeam.lose -= oldDiff < 0 ? 1 : 0;
            newTeam.pointDiff -= oldDiff;
            newTeam.rankingPoint -= oldDiff > 0 ? 1 : 0;
          } else if (team.id === oldMatch.teamBId) {
            newTeam.played -= 1;
            newTeam.win -= oldDiff < 0 ? 1 : 0;
            newTeam.lose -= oldDiff > 0 ? 1 : 0;
            newTeam.pointDiff += oldDiff;
            newTeam.rankingPoint -= oldDiff < 0 ? 1 : 0;
          }
        }
        
        if (scoreA !== null && scoreB !== null) {
          const diff = scoreA - scoreB;
          
          if (team.id === oldMatch.teamAId) {
            newTeam.played += 1;
            newTeam.win += diff > 0 ? 1 : 0;
            newTeam.lose += diff < 0 ? 1 : 0;
            newTeam.pointDiff += diff;
            newTeam.rankingPoint += diff > 0 ? 1 : 0;
          } else if (team.id === oldMatch.teamBId) {
            newTeam.played += 1;
            newTeam.win += diff < 0 ? 1 : 0;
            newTeam.lose += diff > 0 ? 1 : 0;
            newTeam.pointDiff -= diff;
            newTeam.rankingPoint += diff < 0 ? 1 : 0;
          }
        }
        
        return newTeam;
      });
    });
    
    setMatches(prevMatches => 
      prevMatches.map(m => 
        m.id === matchId ? { ...m, scoreA, scoreB } : m
      )
    );
  }, [matches]);

  const clearMatchScore = useCallback((matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match || match.scoreA === null || match.scoreB === null) return;
    
    // Revert team stats
    setTeams(prevTeams => {
      return prevTeams.map(team => {
        if (team.id !== match.teamAId && team.id !== match.teamBId) {
          return team;
        }
        
        let newTeam = { ...team };
        const diff = match.scoreA! - match.scoreB!;
        
        if (team.id === match.teamAId) {
          newTeam.played -= 1;
          newTeam.win -= diff > 0 ? 1 : 0;
          newTeam.lose -= diff < 0 ? 1 : 0;
          newTeam.pointDiff -= diff;
          newTeam.rankingPoint -= diff > 0 ? 1 : 0;
        } else if (team.id === match.teamBId) {
          newTeam.played -= 1;
          newTeam.win -= diff < 0 ? 1 : 0;
          newTeam.lose -= diff > 0 ? 1 : 0;
          newTeam.pointDiff += diff;
          newTeam.rankingPoint -= diff < 0 ? 1 : 0;
        }
        
        return newTeam;
      });
    });
    
    // Clear match scores
    setMatches(prevMatches => 
      prevMatches.map(m => 
        m.id === matchId ? { ...m, scoreA: null, scoreB: null } : m
      )
    );
  }, [matches]);

  const recalculateAllPoints = useCallback(() => {
    setTeams(prevTeams => {
      const resetTeams = prevTeams.map(team => ({
        ...team,
        played: 0,
        win: 0,
        lose: 0,
        pointDiff: 0,
        rankingPoint: 0,
      }));

      const updatedTeams = resetTeams.map(team => {
        let newTeam = { ...team };
        
        matches.forEach(match => {
          if (match.scoreA === null || match.scoreB === null) return;
          
          const diff = match.scoreA - match.scoreB;
          
          if (team.id === match.teamAId) {
            newTeam.played += 1;
            newTeam.win += diff > 0 ? 1 : 0;
            newTeam.lose += diff < 0 ? 1 : 0;
            newTeam.pointDiff += diff;
            newTeam.rankingPoint += diff > 0 ? 1 : 0;
          } else if (team.id === match.teamBId) {
            newTeam.played += 1;
            newTeam.win += diff < 0 ? 1 : 0;
            newTeam.lose += diff > 0 ? 1 : 0;
            newTeam.pointDiff -= diff;
            newTeam.rankingPoint += diff < 0 ? 1 : 0;
          }
        });
        
        return newTeam;
      });

      return updatedTeams;
    });
  }, [matches]);

  const resetTournament = useCallback(() => {
    setTeams([]);
    setMatches([]);
    tournamentService.clearAll();
    tournamentService.saveRole(role);
  }, [role]);

  return {
    teams,
    matches,
    role,
    isLoaded,
    login,
    logout,
    addTeam,
    removeTeam,
    updateTeam,
    generateMatches,
    updateMatchScore,
    clearMatchScore,
    recalculateAllPoints,
    resetTournament,
  };
}
