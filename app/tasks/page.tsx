'use client';

import { useEffect, useState } from 'react';
import {
  ListTodo,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Search,
} from 'lucide-react';
import { Task, TaskStatusLabel, TaskTypeLabel } from '@/types';
import { formatDate, getDeadlineStatus } from '@/lib/utils';

const statusFilters = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '未开始' },
  { key: 'in_progress', label: '进行中' },
  { key: 'completed', label: '已完成' },
  { key: 'delayed', label: '延迟' },
  { key: 'abnormal', label: '异常' },
];

const typeFilters = [
  { key: 'all', label: '全部类型' },
  { key: 'launch', label: '上新执行' },
  { key: 'material', label: '物料张贴' },
  { key: 'promotion', label: '促销执行' },
  { key: 'data_feedback', label: '数据回传' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateTaskStatus(taskId: string, status: string) {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }

  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (searchQuery && !t.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !t.productName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !t.storeName?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleExport = () => {
    window.location.href = '/api/tasks/export';
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-600',
    in_progress: 'bg-blue-100 text-blue-600',
    completed: 'bg-green-100 text-green-600',
    delayed: 'bg-yellow-100 text-yellow-600',
    abnormal: 'bg-red-100 text-red-600',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock size={14} />,
    in_progress: <Clock size={14} />,
    completed: <CheckCircle2 size={14} />,
    delayed: <AlertTriangle size={14} />,
    abnormal: <XCircle size={14} />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">推广任务</h1>
          <p className="text-muted mt-1">跟踪和管理所有新品推广任务</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">
            共 {filteredTasks.length} 个任务
          </span>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm"
          >
            <Download size={16} />
            导出
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted" />
          <span className="text-sm text-muted">状态：</span>
          <div className="flex items-center gap-1">
            {statusFilters.map(filter => (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  statusFilter === filter.key
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-muted hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">类型：</span>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="h-8 px-3 border border-border rounded-lg text-xs focus:outline-none focus:border-accent"
          >
            {typeFilters.map(filter => (
              <option key={filter.key} value={filter.key}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl border border-border p-6">
              <div className="skeleton h-4 w-48 rounded mb-3" />
              <div className="skeleton h-4 w-full rounded mb-2" />
              <div className="skeleton h-4 w-32 rounded" />
            </div>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <ListTodo className="mx-auto text-muted mb-4" size={48} />
          <h3 className="font-medium text-text mb-2">暂无任务</h3>
          <p className="text-sm text-muted">创建新品后会自动生成推广任务</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map(task => {
            const deadlineStatus = getDeadlineStatus(task.deadline);

            return (
              <div
                key={task.id}
                className="bg-white rounded-xl border border-border p-6 card-hover"
              >
                <div className="flex items-start gap-4">
                  {/* Status icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    statusColors[task.status]
                  }`}>
                    {statusIcons[task.status]}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-text">{task.description}</h3>
                        <p className="text-sm text-muted mt-1">
                          {task.productName} · {task.storeName}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
                        {TaskStatusLabel[task.status as keyof typeof TaskStatusLabel]}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted">
                        类型：{TaskTypeLabel[task.type as keyof typeof TaskTypeLabel]}
                      </span>
                      <span className={`flex items-center gap-1 ${
                        deadlineStatus === 'danger' ? 'text-error' :
                        deadlineStatus === 'warning' ? 'text-warning' :
                        'text-muted'
                      }`}>
                        <Clock size={14} />
                        截止：{formatDate(task.deadline)}
                      </span>
                      {task.completedAt && (
                        <span className="text-success">
                          完成于：{formatDate(task.completedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {task.status === 'pending' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'in_progress')}
                        className="px-3 py-1.5 text-xs bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        开始
                      </button>
                    )}
                    {task.status === 'in_progress' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        className="px-3 py-1.5 text-xs bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors"
                      >
                        完成
                      </button>
                    )}
                    {(task.status === 'pending' || task.status === 'in_progress') && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'abnormal')}
                        className="px-3 py-1.5 text-xs bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors"
                      >
                        标记异常
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}