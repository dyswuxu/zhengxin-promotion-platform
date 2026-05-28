'use client';

import { useEffect, useState } from 'react';
import {
  Target,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Search,
  ChevronRight,
  Play,
  Flag,
  Shield,
  Zap,
} from 'lucide-react';

// Phase colors and configuration
const phases = [
  { 
    key: 'preheat', 
    name: '预热期', 
    days: 'Day 1-3',
    color: 'blue',
    bgClass: 'bg-battle-blue/10 border-battle-blue/30',
    textClass: 'text-battle-blue',
    icon: '🔥',
  },
  { 
    key: 'exposure', 
    name: '强曝光', 
    days: 'Day 4-10',
    color: 'orange',
    bgClass: 'bg-battle-orange/10 border-battle-orange/30',
    textClass: 'text-battle-orange',
    icon: '⚡',
  },
  { 
    key: 'package', 
    name: '套餐放大', 
    days: 'Day 11-20',
    color: 'purple',
    bgClass: 'bg-battle-purple/10 border-battle-purple/30',
    textClass: 'text-battle-purple',
    icon: '📦',
  },
  { 
    key: 'viral', 
    name: '裂变复购', 
    days: 'Day 21-30',
    color: 'green',
    bgClass: 'bg-battle-green/10 border-battle-green/30',
    textClass: 'text-battle-green',
    icon: '🚀',
  },
];

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

// Mock battle order data
const mockTasks = [
  // Preheat phase
  { id: '1', description: '市场调研报告提交', phase: 'preheat', status: 'completed', type: 'launch', productName: '蔬香鸡腿排', storeName: '总部', deadline: '2026-05-21' },
  { id: '2', description: '竞品分析文档', phase: 'preheat', status: 'completed', type: 'data_feedback', productName: '蔬香鸡腿排', storeName: '总部', deadline: '2026-05-22' },
  { id: '3', description: '门店培训材料准备', phase: 'preheat', status: 'completed', type: 'launch', productName: '蔬香鸡腿排', storeName: '总部', deadline: '2026-05-22' },
  { id: '4', description: '社交媒体预热内容发布', phase: 'preheat', status: 'in_progress', type: 'promotion', productName: '蔬香鸡腿排', storeName: '全国', deadline: '2026-05-23' },
  
  // Exposure phase
  { id: '5', description: '启动大规模推广', phase: 'exposure', status: 'in_progress', type: 'promotion', productName: '蔬香鸡腿排', storeName: '全国', deadline: '2026-05-24' },
  { id: '6', description: 'KOL合作内容上线', phase: 'exposure', status: 'pending', type: 'promotion', productName: '蔬香鸡腿排', storeName: '全国', deadline: '2026-05-26' },
  { id: '7', description: '门店POP物料张贴', phase: 'exposure', status: 'pending', type: 'material', productName: '蔬香鸡腿排', storeName: '上海浦东区', deadline: '2026-05-25' },
  { id: '8', description: '限时优惠活动执行', phase: 'exposure', status: 'pending', type: 'promotion', productName: '蔬香鸡腿排', storeName: '全国', deadline: '2026-05-28' },
  { id: '9', description: '每日销售数据汇报', phase: 'exposure', status: 'in_progress', type: 'data_feedback', productName: '蔬香鸡腿排', storeName: '全国', deadline: '2026-05-27' },
  
  // Package phase
  { id: '10', description: '套餐组合优化', phase: 'package', status: 'pending', type: 'launch', productName: '蔬香鸡腿排', storeName: '全国', deadline: '2026-06-01' },
  { id: '11', description: '会员专享活动上线', phase: 'package', status: 'pending', type: 'promotion', productName: '蔬香鸡腿排', storeName: '全国', deadline: '2026-06-05' },
  
  // Viral phase
  { id: '12', description: '裂变活动引爆', phase: 'viral', status: 'pending', type: 'promotion', productName: '蔬香鸡腿排', storeName: '全国', deadline: '2026-06-10' },
  { id: '13', description: '战役复盘总结', phase: 'viral', status: 'pending', type: 'data_feedback', productName: '蔬香鸡腿排', storeName: '总部', deadline: '2026-06-18' },
];

// Status config
const statusConfig: Record<string, { 
  label: string; 
  bgClass: string; 
  textClass: string;
  icon: React.ReactNode;
}> = {
  pending: { 
    label: '未开始', 
    bgClass: 'bg-text-secondary/10 text-text-secondary border-text-secondary/30',
    textClass: 'text-text-secondary',
    icon: <Clock size={14} />,
  },
  in_progress: { 
    label: '进行中', 
    bgClass: 'bg-battle-orange/10 text-battle-orange border-battle-orange/30',
    textClass: 'text-battle-orange',
    icon: <Play size={14} />,
  },
  completed: { 
    label: '已完成', 
    bgClass: 'bg-battle-green/10 text-battle-green border-battle-green/30',
    textClass: 'text-battle-green',
    icon: <CheckCircle2 size={14} />,
  },
  delayed: { 
    label: '延迟', 
    bgClass: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
    textClass: 'text-yellow-500',
    icon: <AlertTriangle size={14} />,
  },
  abnormal: { 
    label: '异常', 
    bgClass: 'bg-red-500/10 text-red-400 border-red-500/30',
    textClass: 'text-red-400',
    icon: <XCircle size={14} />,
  },
};

// Phase selector component
function PhaseSelector({ selectedPhase, onPhaseSelect }: { selectedPhase: string; onPhaseSelect: (phase: string) => void }) {
  const currentIndex = phases.findIndex(p => p.key === selectedPhase);
  
  return (
    <div className="bg-dark-card rounded-xl border border-dark-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <Target size={18} className="text-accent" />
        <span className="font-semibold text-text-primary">战役时间轴</span>
        <span className="text-xs text-text-secondary ml-auto">Day 7 of 30</span>
      </div>
      
      <div className="relative flex items-center justify-between">
        {/* Progress line */}
        <div className="absolute top-5 left-4 right-4 h-0.5 bg-dark-border rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-battle-blue via-battle-orange to-battle-purple rounded-full"
            style={{ width: `${(currentIndex / (phases.length - 1)) * 100}%` }}
          />
        </div>
        
        {phases.map((phase, index) => {
          const isActive = phase.key === selectedPhase;
          
          return (
            <button
              key={phase.key}
              onClick={() => onPhaseSelect(phase.key)}
              className={`relative z-10 flex flex-col items-center group transition-all ${
                isActive ? 'scale-105' : 'hover:scale-102'
              }`}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-lg
                transition-all duration-300 border-2
                ${isActive ? `${phase.bgClass} shadow-glow-${phase.color}` : 'bg-dark-bg border-dark-border'}
              `}>
                {phase.icon}
              </div>
              <div className={`mt-2 text-center ${isActive ? '' : 'opacity-60'}`}>
                <div className={`text-xs font-bold ${isActive ? phase.textClass : 'text-text-secondary'}`}>
                  {phase.name}
                </div>
                <div className="text-xs text-text-secondary">{phase.days}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Battle order card
function BattleOrderCard({ task }: { task: typeof mockTasks[0] }) {
  const phase = phases.find(p => p.key === task.phase);
  const status = statusConfig[task.status];
  const isCompleted = task.status === 'completed';
  
  return (
    <div className={`
      bg-dark-card rounded-xl border border-dark-border p-5 
      transition-all card-hover
      ${isCompleted ? 'opacity-70' : ''}
      status-${task.status}
    `}>
      <div className="flex items-start gap-4">
        {/* Phase indicator */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${phase?.bgClass}`}>
          {phase?.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className={`font-semibold text-text-primary ${isCompleted ? 'line-through' : ''}`}>
                {task.description}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                📦 {task.productName} · 📍 {task.storeName}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${status.bgClass}`}>
              {status.icon}
              {status.label}
            </span>
          </div>
          
          <div className="flex items-center gap-4 mt-3">
            <span className={`text-xs px-2 py-1 rounded ${phase?.bgClass} ${phase?.textClass}`}>
              {phase?.icon} {phase?.name}
            </span>
            <span className="text-xs text-text-secondary flex items-center gap-1">
              <Clock size={12} />
              截止：{task.deadline}
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          {task.status === 'pending' && (
            <button className="px-3 py-1.5 text-xs bg-battle-blue/20 text-battle-blue rounded-lg hover:bg-battle-blue/30 transition-colors">
              开始执行
            </button>
          )}
          {task.status === 'in_progress' && (
            <button className="px-3 py-1.5 text-xs bg-battle-green/20 text-battle-green rounded-lg hover:bg-battle-green/30 transition-colors">
              标记完成
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Task stats summary
function TaskStatsSummary({ tasks, selectedPhase }: { tasks: typeof mockTasks; selectedPhase: string }) {
  const phaseTasks = tasks.filter(t => t.phase === selectedPhase || selectedPhase === 'all');
  const completed = phaseTasks.filter(t => t.status === 'completed').length;
  const inProgress = phaseTasks.filter(t => t.status === 'in_progress').length;
  const pending = phaseTasks.filter(t => t.status === 'pending').length;
  
  return (
    <div className="bg-dark-card rounded-xl border border-dark-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flag size={18} className="text-accent" />
          <span className="font-semibold text-text-primary">任务概览</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xl font-bold text-battle-green">{completed}</div>
            <div className="text-xs text-text-secondary">已完成</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-battle-orange">{inProgress}</div>
            <div className="text-xs text-text-secondary">进行中</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-text-secondary">{pending}</div>
            <div className="text-xs text-text-secondary">待执行</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BattleOrdersPage() {
  const [tasks] = useState(mockTasks);
  const [selectedPhase, setSelectedPhase] = useState('exposure');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(t => {
    if (selectedPhase !== 'all' && t.phase !== selectedPhase) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !t.productName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !t.storeName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleExport = () => {
    window.location.href = '/api/tasks/export';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <Shield size={28} className="text-accent" />
            作战任务中心
          </h1>
          <p className="text-text-secondary mt-1">30天战役任务追踪与管理</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary">
            共 {filteredTasks.length} 个任务
          </span>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border text-text-primary rounded-lg hover:bg-dark-hover transition-colors text-sm"
          >
            <Download size={16} />
            导出
          </button>
        </div>
      </div>

      {/* Phase Timeline */}
      <PhaseSelector 
        selectedPhase={selectedPhase} 
        onPhaseSelect={setSelectedPhase} 
      />

      {/* Task Stats Summary */}
      <TaskStatsSummary tasks={tasks} selectedPhase={selectedPhase} />

      {/* Filters */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-4">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">状态：</span>
            <div className="flex items-center gap-1">
              {statusFilters.map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setStatusFilter(filter.key)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    statusFilter === filter.key
                      ? 'bg-accent text-white'
                      : 'bg-dark-bg text-text-secondary hover:bg-dark-hover'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-6 w-px bg-dark-border" />
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">类型：</span>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="h-8 px-3 bg-dark-bg border border-dark-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent"
            >
              {typeFilters.map(filter => (
                <option key={filter.key} value={filter.key}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="h-6 w-px bg-dark-border" />
          
          <div className="flex items-center gap-2">
            <Search size={16} className="text-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索任务..."
              className="h-8 px-3 bg-dark-bg border border-dark-border rounded-lg text-xs text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent w-48"
            />
          </div>
        </div>
      </div>

      {/* Battle Orders List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-dark-card rounded-xl border border-dark-border p-12 text-center">
          <Target className="mx-auto text-text-secondary mb-4" size={48} />
          <h3 className="font-medium text-text-primary mb-2">暂无任务</h3>
          <p className="text-sm text-text-secondary">当前筛选条件下没有任务</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <BattleOrderCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}