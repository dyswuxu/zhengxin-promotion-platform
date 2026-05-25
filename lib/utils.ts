import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return `¥${amount.toFixed(2)}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600',
    not_started: 'bg-blue-100 text-blue-600',
    promoting: 'bg-orange-100 text-orange-600',
    exploding: 'bg-green-100 text-green-600',
    review: 'bg-yellow-100 text-yellow-600',
    ended: 'bg-gray-100 text-gray-500',
  };
  return colors[status] || colors.draft;
}

export function getTaskStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-600',
    in_progress: 'bg-blue-100 text-blue-600',
    completed: 'bg-green-100 text-green-600',
    delayed: 'bg-yellow-100 text-yellow-600',
    abnormal: 'bg-red-100 text-red-600',
  };
  return colors[status] || colors.pending;
}

export function calculateGrossMargin(price: number, cost: number): number {
  if (price === 0) return 0;
  return ((price - cost) / price) * 100;
}

export function getDeadlineStatus(deadline: string): 'normal' | 'warning' | 'danger' {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'danger';
  if (diffDays <= 2) return 'warning';
  return 'normal';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}