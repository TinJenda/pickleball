'use client';

import { useState } from 'react';
import { Match, Team, UserRole } from '@/types';

interface MatchItemProps {
  matchNumber: number;
  match: Match;
  teams: Team[];
  role: UserRole;
  onUpdateScore: (matchId: string, scoreA: number, scoreB: number) => void;
  onClearScore: (matchId: string) => void;
}

export default function MatchItem({ matchNumber, match, teams, role, onUpdateScore, onClearScore }: MatchItemProps) {
  const teamA = teams.find(t => t.id === match.teamAId);
  const teamB = teams.find(t => t.id === match.teamBId);
  
  const [scoreA, setScoreA] = useState<string>(match.scoreA?.toString() || '');
  const [scoreB, setScoreB] = useState<string>(match.scoreB?.toString() || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!teamA || !teamB) return null;

  const hasScore = match.scoreA !== null && match.scoreB !== null;
  const isAdmin = role === 'admin';

  const handleSave = () => {
    const numScoreA = parseInt(scoreA);
    const numScoreB = parseInt(scoreB);
    
    if (!isNaN(numScoreA) && !isNaN(numScoreB) && numScoreA >= 0 && numScoreB >= 0) {
      onUpdateScore(match.id, numScoreA, numScoreB);
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setScoreA(match.scoreA?.toString() || '');
    setScoreB(match.scoreB?.toString() || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setScoreA(match.scoreA?.toString() || '');
    setScoreB(match.scoreB?.toString() || '');
    setIsEditing(false);
  };

  return (
    <div className={`bg-white border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow ${
      hasScore ? 'border-green-200 bg-green-50' : 'border-gray-200'
    }`}>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex-shrink-0">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-semibold text-xs">
            {matchNumber}
          </span>
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex-1 min-w-0 sm:text-left">
            <div className="font-medium text-gray-900 text-sm sm:text-base">{teamA.name}</div>
          </div>
          
          <div className="flex items-center justify-center gap-2 flex-shrink-0">
            {isAdmin && isEditing ? (
              <input
                type="number"
                value={scoreA}
                onChange={(e) => {
                  const value = e.target.value;
                  const numValue = parseInt(value);
                  if (!isNaN(numValue) && numValue > 11) {
                    setScoreA('11');
                  } else if (value === '' || !isNaN(numValue)) {
                    setScoreA(value);
                  }
                }}
                className="w-14 sm:w-16 px-2 py-1 border border-gray-300 rounded text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                min="0"
                max="11"
              />
            ) : (
              <div className={`w-14 sm:w-16 text-center font-bold text-base sm:text-lg ${
                hasScore 
                  ? (match.scoreA! > match.scoreB! ? 'text-green-600' : match.scoreA! < match.scoreB! ? 'text-red-600' : 'text-gray-700')
                  : 'text-gray-400'
              }`}>
                {match.scoreA ?? '-'}
              </div>
            )}
            
            <span className="text-gray-400 font-medium text-xs sm:text-sm">vs</span>
            
            {isAdmin && isEditing ? (
              <input
                type="number"
                value={scoreB}
                onChange={(e) => {
                  const value = e.target.value;
                  const numValue = parseInt(value);
                  if (!isNaN(numValue) && numValue > 11) {
                    setScoreB('11');
                  } else if (value === '' || !isNaN(numValue)) {
                    setScoreB(value);
                  }
                }}
                className="w-14 sm:w-16 px-2 py-1 border border-gray-300 rounded text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                min="0"
                max="11"
              />
            ) : (
              <div className={`w-14 sm:w-16 text-center font-bold text-base sm:text-lg ${
                hasScore 
                  ? (match.scoreB! > match.scoreA! ? 'text-green-600' : match.scoreB! < match.scoreA! ? 'text-red-600' : 'text-gray-700')
                  : 'text-gray-400'
              }`}>
                {match.scoreB ?? '-'}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 sm:text-right">
            <div className="font-medium text-gray-900 text-sm sm:text-base">{teamB.name}</div>
          </div>
        </div>
        
        {isAdmin && (
          <div className="flex gap-2 flex-shrink-0">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-2 sm:px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium"
                >
                  Lưu
                </button>
                <button
                  onClick={handleCancel}
                  className="px-2 sm:px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors text-xs sm:text-sm font-medium"
                >
                  Hủy
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                {hasScore && (
                  <button
                    onClick={() => onClearScore(match.id)}
                    className="px-2 sm:px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                  >
                    Xóa
                  </button>
                )}
                <button
                  onClick={handleEdit}
                  className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                >
                  {hasScore ? 'Sửa' : 'Thêm'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
