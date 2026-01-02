'use client';

import { useState } from 'react';
import { useTournament } from '@/hooks/useTournament';
import Header from '@/components/Header';
import LoginModal from '@/components/LoginModal';
import Tabs, { TabType } from '@/components/Tabs';
import RankingTable from '@/components/RankingTable';
import MatchList from '@/components/MatchList';
import TeamManager from '@/components/TeamManager';

export default function Home() {
  const {
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
  } = useTournament();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('ranking');

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        role={role}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={logout}
      />

      <Tabs activeTab={activeTab} onTabChange={setActiveTab} role={role} />

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'ranking' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Bảng Xếp Hạng Giải Đấu</h2>
            <RankingTable teams={teams} />
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Các Trận Đấu</h2>
                <div className="flex items-center gap-3 flex-1 sm:max-w-md">
                  <div className="flex-shrink-0 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên đội..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    onChange={(e) => {
                      const searchInput = e.target as HTMLInputElement;
                      const event = new CustomEvent('matchSearch', { detail: searchInput.value });
                      window.dispatchEvent(event);
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm font-medium text-gray-700">Lọc trận đấu:</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="matchFilter"
                      value="all"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      onChange={(e) => {
                        const event = new CustomEvent('matchFilterStatus', { detail: e.target.value });
                        window.dispatchEvent(event);
                      }}
                    />
                    <span className="text-sm text-gray-700">Tất cả ({matches.length})</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="matchFilter"
                      value="played"
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      onChange={(e) => {
                        const event = new CustomEvent('matchFilterStatus', { detail: e.target.value });
                        window.dispatchEvent(event);
                      }}
                    />
                    <span className="text-sm text-gray-700">Đã đấu ({matches.filter(m => m.scoreA !== null && m.scoreB !== null).length})</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="matchFilter"
                      value="unplayed"
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      onChange={(e) => {
                        const event = new CustomEvent('matchFilterStatus', { detail: e.target.value });
                        window.dispatchEvent(event);
                      }}
                    />
                    <span className="text-sm text-gray-700">Chưa đấu ({matches.filter(m => m.scoreA === null || m.scoreB === null).length})</span>
                  </label>
                </div>
              </div>
            </div>
            <MatchList
              matches={matches}
              teams={teams}
              role={role}
              onUpdateScore={updateMatchScore}
              onClearScore={clearMatchScore}
            />
          </div>
        )}

        {activeTab === 'teams' && role === 'admin' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản Lý Đội</h2>
            <TeamManager
              teams={teams}
              onAddTeam={addTeam}
              onRemoveTeam={removeTeam}
              onUpdateTeam={updateTeam}
              onGenerateMatches={generateMatches}
              onRecalculatePoints={recalculateAllPoints}
              onResetTournament={resetTournament}
            />
          </div>
        )}
      </main>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={login}
      />
    </div>
  );
}
