'use client';

import Image from 'next/image';
import { UserRole } from '@/types';

interface HeaderProps {
  role: UserRole;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Header({ role, onLoginClick, onLogout }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <Image 
              src="/logo.png" 
              alt="Pickleball Logo" 
              width={48} 
              height={48}
              className="rounded-full scale-[1.2]"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">BXH Pickleball</h1>
            <p className="text-blue-100 text-sm mt-1">Giải mừng 2026</p>
          </div>
        </div>
        <div>
          {role === 'admin' ? (
            <div className="flex items-center gap-3">
              <span className="bg-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Admin
              </span>
              <button
                onClick={onLogout}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Đăng Xuất
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Đăng Nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
