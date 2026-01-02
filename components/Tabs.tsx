'use client';

import { UserRole } from '@/types';

export type TabType = 'ranking' | 'matches' | 'teams';

interface TabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  role: UserRole;
}

export default function Tabs({ activeTab, onTabChange, role }: TabsProps) {
  const tabs: { id: TabType; label: string; adminOnly?: boolean }[] = [
    { id: 'ranking', label: 'Xếp Hạng' },
    { id: 'matches', label: 'Trận Đấu' },
    { id: 'teams', label: 'Đội', adminOnly: true },
  ];

  const visibleTabs = tabs.filter(tab => !tab.adminOnly || role === 'admin');

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <nav className="flex space-x-8">
          {visibleTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
