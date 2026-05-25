'use client';

import { Search, Bell, User } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="h-16 bg-primary flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
          <input
            type="text"
            placeholder="搜索新品、活动..."
            className="w-full h-9 pl-10 pr-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 text-sm focus:outline-none focus:bg-white/20"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
          <Bell size={20} className="text-white/80" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/20">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="text-white">
            <p className="text-sm font-medium">爆品部</p>
            <p className="text-xs text-white/70">管理员</p>
          </div>
        </div>
      </div>
    </header>
  );
}