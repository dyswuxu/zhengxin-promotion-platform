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
  Target,
  FlaskConical,
} from 'lucide-react';

const navItems = [
  { href: '/', label: '战役指挥台', icon: LayoutDashboard },
  { href: '/products', label: '新品中心', icon: Package },
  { href: '/trial', label: '试卖中心', icon: FlaskConical },
  { href: '/generator', label: 'AI战略生成器', icon: Sparkles },
  { href: '/tasks', label: '作战任务', icon: Target },
  { href: '/analytics', label: '战况数据中心', icon: BarChart3 },
  { href: '/review', label: '战役复盘', icon: RefreshCw },
  { href: '/stores', label: '门店管理', icon: Package },
  { href: '/settings', label: '系统设置', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-dark-card border-r border-dark-border flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="h-16 flex items-center px-6 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-battle-orange to-accent rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">正</span>
          </div>
          <div>
            <h1 className="text-text-primary font-bold text-sm leading-tight">新品作战平台</h1>
            <p className="text-text-secondary text-xs">指挥台 v2.0</p>
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
                flex items-center gap-3 px-6 py-3 text-sm transition-all relative
                ${isActive
                  ? 'text-accent bg-accent/10 font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-dark-hover'
                }
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full" />
              )}
              <Icon size={18} className={isActive ? 'text-accent' : ''} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer status */}
      <div className="p-4 border-t border-dark-border">
        <div className="bg-dark-bg rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <div className="w-2 h-2 rounded-full bg-battle-green animate-pulse" />
            <span>系统正常 · 在线</span>
          </div>
        </div>
      </div>
    </aside>
  );
}