'use client';

import { useState, FormEvent, useRef } from 'react';
import { Team } from '@/types';
import ConfirmDialog from './ConfirmDialog';

interface TeamManagerProps {
  teams: Team[];
  onAddTeam: (name: string) => void;
  onRemoveTeam: (teamId: string) => void;
  onUpdateTeam: (teamId: string, newName: string) => void;
  onGenerateMatches: () => void;
  onRecalculatePoints: () => void;
  onResetTournament: () => void;
}

export default function TeamManager({
  teams,
  onAddTeam,
  onRemoveTeam,
  onUpdateTeam,
  onGenerateMatches,
  onRecalculatePoints,
  onResetTournament,
}: TeamManagerProps) {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [teamToRemove, setTeamToRemove] = useState<{ id: string; name: string } | null>(null);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingTeamName, setEditingTeamName] = useState('');
  const player1InputRef = useRef<HTMLInputElement>(null);

  const handleAddTeam = (e: FormEvent) => {
    e.preventDefault();
    if (player1Name.trim() && player2Name.trim()) {
      const teamName = `${player1Name.trim()} - ${player2Name.trim()}`;
      onAddTeam(teamName);
      setPlayer1Name('');
      setPlayer2Name('');
      // Focus back to player1 input
      setTimeout(() => {
        player1InputRef.current?.focus();
      }, 0);
    }
  };

  const handlePlayer1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/-/g, '');
    setPlayer1Name(value);
  };

  const handlePlayer2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/-/g, '');
    setPlayer2Name(value);
  };

  const handleRemoveTeam = (teamId: string, teamName: string) => {
    setTeamToRemove({ id: teamId, name: teamName });
  };

  const confirmRemoveTeam = () => {
    if (teamToRemove) {
      onRemoveTeam(teamToRemove.id);
      setTeamToRemove(null);
    }
  };

  const handleEditTeam = (teamId: string, teamName: string) => {
    setEditingTeamId(teamId);
    setEditingTeamName(teamName);
  };

  const handleSaveEdit = () => {
    if (editingTeamId && editingTeamName.trim()) {
      onUpdateTeam(editingTeamId, editingTeamName.trim());
      setEditingTeamId(null);
      setEditingTeamName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTeamId(null);
    setEditingTeamName('');
  };

  const handleReset = () => {
    onResetTournament();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Thêm Đội Mới</h3>
        <form onSubmit={handleAddTeam} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <input
              ref={player1InputRef}
              type="text"
              value={player1Name}
              onChange={handlePlayer1Change}
              placeholder="Tên người chơi 1"
              className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm sm:text-base"
              required
            />
            <span className="text-gray-500 font-bold text-xl text-center sm:text-left">-</span>
            <input
              type="text"
              value={player2Name}
              onChange={handlePlayer2Change}
              placeholder="Tên người chơi 2"
              className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm sm:text-base"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Thêm Đội
          </button>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Danh Sách Đội ({teams.length})
        </h3>
        
        {teams.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có đội nào
          </div>
        ) : (
          <div className="space-y-2">
            {teams.map(team => (
              <div
                key={team.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {editingTeamId === team.id ? (
                  <>
                    <input
                      type="text"
                      value={editingTeamName}
                      onChange={(e) => setEditingTeamName(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      autoFocus
                    />
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors text-sm font-medium"
                      >
                        Hủy
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-gray-800">{team.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTeam(team.id, team.name)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleRemoveTeam(team.id, team.name)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        Xóa
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Hành Động Giải Đấu</h3>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onGenerateMatches}
              disabled={teams.length < 2}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Tạo Trận Đấu Vòng Tròn
            </button>
            {/* <button
              onClick={onRecalculatePoints}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Tính Lại Điểm
            </button> */}
          </div>
          <p className="text-sm text-gray-500 text-center">
            {teams.length < 2 
              ? 'Cần ít nhất 2 đội để tạo trận đấu' 
              : `Sẽ tạo ${teams.length * (teams.length - 1) / 2} trận đấu`}
          </p>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Reset Giải Đấu
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={teamToRemove !== null}
        title="Xóa Đội"
        message={`Bạn có chắc muốn xóa đội "${teamToRemove?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xác Nhận Xóa"
        cancelText="Hủy"
        onConfirm={confirmRemoveTeam}
        onCancel={() => setTeamToRemove(null)}
        variant="danger"
      />

      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Đặt Lại Giải Đấu"
        message="Bạn có chắc muốn đặt lại toàn bộ giải đấu? Điều này sẽ xóa tất cả đội, trận đấu và điểm số. Hành động này không thể hoàn tác."
        confirmText="Xác Nhận Đặt Lại"
        cancelText="Hủy"
        onConfirm={handleReset}
        onCancel={() => setShowResetConfirm(false)}
        variant="danger"
      />
    </div>
  );
}
