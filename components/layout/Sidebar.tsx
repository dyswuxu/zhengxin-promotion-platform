'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Sparkles,
  ListTodo,
  BarChart3,
  RefreshCw,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/', label: '首页', icon: LayoutDashboard },
  { href: '/products', label: '新品中心', icon: Package },
  { href: '/generator', label: 'AI推广生成器', icon: Sparkles },
  { href: '/tasks', label: '推广任务', icon: ListTodo },
  { href: '/analytics', label: '数据看板', icon: BarChart3 },
  { href: '/review', label: '复盘中心', icon: RefreshCw },
  { href: '/stores', label: '门店管理', icon: Package },
  { href: '/settings', label: '系统设置', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-border flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">正</span>
          </div>
          <div>
            <h1 className="text-primary font-semibold text-sm leading-tight">正新新品推广</h1>
            <p className="text-muted text-xs">作战平台</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-6 py-3 text-sm transition-colors relative
                ${isActive
                  ? 'text-accent bg-accent/5 font-medium'
                  : 'text-text hover:bg-gray-50'
                }
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
              )}
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted text-center">
          v1.0.0 · MVP版本
        </div>
      </div>
    </aside>
  );
}