'use client';

import { useState, useMemo, useEffect } from 'react';
import { Match, Team, UserRole } from '@/types';
import MatchItem from './MatchItem';

interface MatchListProps {
  matches: Match[];
  teams: Team[];
  role: UserRole;
  onUpdateScore: (matchId: string, scoreA: number, scoreB: number) => void;
  onClearScore: (matchId: string) => void;
}

export default function MatchList({ matches, teams, role, onUpdateScore, onClearScore }: MatchListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'played' | 'unplayed'>('all');

  useEffect(() => {
    const handleSearch = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSearchQuery(customEvent.detail);
    };

    const handleFilterStatus = (e: Event) => {
      const customEvent = e as CustomEvent;
      setFilterStatus(customEvent.detail as 'all' | 'played' | 'unplayed');
    };

    window.addEventListener('matchSearch', handleSearch);
    window.addEventListener('matchFilterStatus', handleFilterStatus);
    
    return () => {
      window.removeEventListener('matchSearch', handleSearch);
      window.removeEventListener('matchFilterStatus', handleFilterStatus);
    };
  }, []);

  const filteredMatches = useMemo(() => {
    let result = matches;

    // Filter by match status
    if (filterStatus === 'played') {
      result = result.filter(match => match.scoreA !== null && match.scoreB !== null);
    } else if (filterStatus === 'unplayed') {
      result = result.filter(match => match.scoreA === null || match.scoreB === null);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(match => {
        const teamA = teams.find(t => t.id === match.teamAId);
        const teamB = teams.find(t => t.id === match.teamBId);
        
        if (!teamA || !teamB) return false;
        
        return teamA.name.toLowerCase().includes(query) || 
               teamB.name.toLowerCase().includes(query);
      });
    }

    return result;
  }, [matches, teams, searchQuery, filterStatus]);

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-5xl mb-4">🎾</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa Tạo Trận Đấu</h3>
        <p className="text-gray-500">
          {role === 'admin' 
            ? 'Vào tab Đội để tạo trận đấu' 
            : 'Admin cần tạo trận đấu trước'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searchQuery && (
        <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          Tìm thấy <span className="font-semibold">{filteredMatches.length}</span> trận đấu
        </div>
      )}

      {filteredMatches.length === 0 && searchQuery ? (
        <div className="text-center py-12 border border-gray-200 rounded-lg">
          <div className="text-gray-400 text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Không tìm thấy trận đấu</h3>
          <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
        </div>
      ) : filteredMatches.length > 0 ? (
        <div className="space-y-3">
          {filteredMatches.map((match) => (
            <MatchItem
              key={match.id}
              matchNumber={matches.indexOf(match) + 1}
              match={match}
              teams={teams}
              role={role}
              onUpdateScore={onUpdateScore}
              onClearScore={onClearScore}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
