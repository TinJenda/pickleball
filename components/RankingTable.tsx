'use client';

import { Team } from '@/types';
import { sortTeamsByRanking } from '@/utils/ranking';

interface RankingTableProps {
  teams: Team[];
}

export default function RankingTable({ teams }: RankingTableProps) {
  const sortedTeams = sortTeamsByRanking(teams);

  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-5xl mb-4">🏆</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa Có Đội</h3>
        <p className="text-gray-500">Thêm Đội để bắt đầu giải đấu</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Hạng
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Đội
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Đã Đấu
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Thắng
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Thua
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              +/-
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Points
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedTeams.map((team, index) => {
            const rank = index + 1;
            const isTopThree = rank <= 3;
            const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
            
            return (
              <tr
                key={team.id}
                className={`
                  hover:bg-gray-50 transition-colors
                  ${isTopThree ? 'bg-yellow-50' : ''}
                `}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${isTopThree ? 'text-yellow-600' : 'text-gray-700'}`}>
                      {rank}
                    </span>
                    {medalEmoji && <span className="text-xl">{medalEmoji}</span>}
                  </div>
                </td>
                <td className="px-4 py-4 min-w-[180px] sm:min-w-0">
                  <div className={`font-medium ${isTopThree ? 'text-gray-900' : 'text-gray-700'}`}>
                    {team.name}
                  </div>
                </td>
                <td className="px-4 py-4 text-center text-gray-700">
                  {team.played}
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-green-600 font-medium">{team.win}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-red-600 font-medium">{team.lose}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`font-medium ${
                    team.pointDiff > 0 ? 'text-green-600' : 
                    team.pointDiff < 0 ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {team.pointDiff > 0 ? '+' : ''}{team.pointDiff}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                    {team.rankingPoint}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
