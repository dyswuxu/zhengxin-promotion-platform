'use client';

import { Search, Bell, User, Zap } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="h-14 bg-dark-card border-b border-dark-border flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input
            type="text"
            placeholder="搜索战役、产品、门店..."
            className="w-full h-9 pl-10 pr-4 bg-dark-bg border border-dark-border rounded-lg text-text-primary placeholder:text-text-secondary text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-battle-green/10 border border-battle-green/30 rounded-full">
        <div className="w-2 h-2 bg-battle-green rounded-full animate-pulse" />
        <span className="text-xs text-battle-green font-medium">战役进行中</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-dark-bg rounded-lg transition-colors">
          <Bell size={20} className="text-text-secondary" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-dark-border">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-battle-orange rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="text-text-primary">
            <p className="text-sm font-medium">爆品部</p>
            <p className="text-xs text-text-secondary">指挥官</p>
          </div>
        </div>
      </div>
    </header>
  );
}