'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Package,
  Target,
  Zap,
  Users,
  BarChart3,
  ChevronRight,
  Play,
  Image,
  Video,
  Music,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

// Phase configuration
const phases = [
  { 
    key: 'preheat', 
    name: '上市预热', 
    days: 'Day 1-3', 
    color: 'blue',
    icon: '🔥',
    tasks: ['市场调研', '竞品分析', '预热物料准备', '门店培训启动', '社交媒体预埋']
  },
  { 
    key: 'exposure', 
    name: '强曝光', 
    days: 'Day 4-10', 
    color: 'orange',
    icon: '⚡',
    tasks: ['启动大规模推广', 'KOL合作投放', '门店POP布置', '限时优惠执行', '数据监控优化']
  },
  { 
    key: 'package', 
    name: '套餐放大', 
    days: 'Day 11-20', 
    color: 'purple',
    icon: '📦',
    tasks: ['套餐组合优化', '连带销售推广', '会员专享活动', '复购激励机制', '区域PK启动']
  },
  { 
    key: 'viral', 
    name: '裂变复购', 
    days: 'Day 21-30', 
    color: 'green',
    icon: '🚀',
    tasks: ['裂变活动引爆', '私域社群激活', '复购数据追踪', '爆品经验沉淀', '战役复盘总结']
  },
];

// Mock data for battle command center
const mockStats = {
  currentDay: 7,
  currentPhase: 'exposure',
  totalSales: 12580,
  salesGrowth: 15,
  packageRate: 68,
  packageGrowth: 5,
  attachRate: 2.3,
  attachGrowth: 8,
  executionRate: 82,
  executionGrowth: -5,
};

const mockRegionRankings = [
  { rank: 1, name: '上海浦东区', sales: 2580, packageRate: 75, executionRate: 92, change: 0 },
  { rank: 2, name: '杭州西湖区', sales: 2190, packageRate: 71, executionRate: 88, change: 1 },
  { rank: 3, name: '苏州园区', sales: 1980, packageRate: 69, executionRate: 85, change: -1 },
  { rank: 4, name: '南京鼓楼区', sales: 1750, packageRate: 65, executionRate: 80, change: 0 },
  { rank: 5, name: '宁波鄞州区', sales: 1520, packageRate: 62, executionRate: 78, change: 2 },
  { rank: 6, name: '无锡梁溪区', sales: 1380, packageRate: 60, executionRate: 75, change: -1 },
  { rank: 7, name: '常州钟楼区', sales: 1180, packageRate: 58, executionRate: 72, change: 0 },
];

const mockStores = [
  { name: '浦东张江店', status: 'good', sales: 580, execution: 95 },
  { name: '浦东陆家嘴店', status: 'good', sales: 520, execution: 92 },
  { name: '西湖文化广场店', status: 'warning', sales: 380, execution: 68 },
  { name: '西湖文三路店', status: 'good', sales: 450, execution: 88 },
  { name: '苏州观前街店', status: 'good', sales: 420, execution: 85 },
  { name: '南京新街口店', status: 'warning', sales: 350, execution: 65 },
  { name: '宁波天一广场店', status: 'good', sales: 400, execution: 82 },
  { name: '无锡三阳广场店', status: 'danger', sales: 220, execution: 48 },
  { name: '常州南大街店', status: 'good', sales: 380, execution: 80 },
];

const mockTodayTasks = {
  hq: [
    { name: '发布朋友圈预热文案', status: 'completed' },
    { name: '对接KOL投放排期', status: 'completed' },
    { name: '审核区域执行报告', status: 'in_progress' },
    { name: '调整限时优惠力度', status: 'pending' },
    { name: '监控实时销售数据', status: 'pending' },
  ],
  region: [
    { name: '门店POP物料检查', status: 'completed' },
    { name: '店员话术抽查', status: 'in_progress' },
    { name: '区域PK战报收集', status: 'pending' },
    { name: '问题门店专项辅导', status: 'pending' },
  ],
  store: [
    { name: '早会新品推荐话术', status: 'completed' },
    { name: '套餐组合推荐', status: 'in_progress' },
    { name: '闭店数据汇报', status: 'pending' },
  ],
};

const mockContentFactory = [
  { type: 'poster', name: '主视觉海报', status: 'completed', progress: 100 },
  { type: 'poster', name: '朋友圈海报', status: 'completed', progress: 100 },
  { type: 'video', name: '15秒短视频', status: 'generating', progress: 65 },
  { type: 'audio', name: '店内广播词', status: 'completed', progress: 100 },
  { type: 'text', name: '朋友圈文案', status: 'completed', progress: 100 },
  { type: 'text', name: '小红书种草文', status: 'pending', progress: 0 },
];

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; class: string }> = {
    completed: { label: '已完成', class: 'bg-battle-green/20 text-battle-green border border-battle-green/30' },
    in_progress: { label: '进行中', class: 'bg-battle-orange/20 text-battle-orange border border-battle-orange/30' },
    pending: { label: '未开始', class: 'bg-text-secondary/20 text-text-secondary border border-text-secondary/30' },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.class}`}>
      {c.label}
    </span>
  );
}

// Phase timeline component
function PhaseTimeline({ currentPhase, onPhaseClick }: { currentPhase: string; onPhaseClick: (phase: string) => void }) {
  const currentIndex = phases.findIndex(p => p.key === currentPhase);
  
  return (
    <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
      <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
        <Target className="text-accent" size={20} />
        30天战役进度
      </h2>
      
      <div className="relative flex items-center justify-between">
        {/* Progress line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-dark-border rounded-full mx-8">
          <div 
            className="h-full bg-gradient-to-r from-battle-blue via-battle-orange to-battle-purple rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 0.5) / phases.length) * 100}%` }}
          />
        </div>
        
        {phases.map((phase, index) => {
          const isActive = phase.key === currentPhase;
          const isPast = index < currentIndex;
          const colorClass = `battle-${phase.color}`;
          
          return (
            <button
              key={phase.key}
              onClick={() => onPhaseClick(phase.key)}
              className={`relative z-10 flex flex-col items-center group transition-all ${
                isActive ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-xl
                transition-all duration-300
                ${isActive ? `bg-${colorClass} shadow-glow-${phase.color}` : isPast ? `bg-${colorClass}` : 'bg-dark-border'}
                ${isActive ? '' : isPast ? '' : 'grayscale opacity-60'}
              `}>
                {phase.icon}
              </div>
              <div className="mt-3 text-center">
                <div className={`text-sm font-bold ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {phase.name}
                </div>
                <div className="text-xs text-text-secondary mt-1">{phase.days}</div>
              </div>
              {isActive && (
                <div className="absolute -bottom-2 px-2 py-0.5 bg-accent rounded-full text-xs text-white font-bold">
                  当前
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Selected phase tasks */}
      <div className="mt-8 p-4 bg-dark-bg rounded-lg">
        <div className="text-sm font-semibold text-text-secondary mb-3">
          {phases.find(p => p.key === currentPhase)?.name} · 作战任务清单
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {phases.find(p => p.key === currentPhase)?.tasks.map((task, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle2 size={14} className="text-battle-green" />
              <span className="text-text-secondary">{task}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Stats card component
function BattleStatCard({ 
  label, 
  value, 
  unit, 
  trend, 
  trendValue, 
  color = 'accent' 
}: { 
  label: string; 
  value: string | number; 
  unit: string;
  trend: 'up' | 'down'; 
  trendValue: string;
  color?: string;
}) {
  const colorClasses: Record<string, string> = {
    accent: 'from-accent/20 to-accent/5 border-accent/30',
    blue: 'from-battle-blue/20 to-battle-blue/5 border-battle-blue/30',
    orange: 'from-battle-orange/20 to-battle-orange/5 border-battle-orange/30',
    green: 'from-battle-green/20 to-battle-green/5 border-battle-green/30',
  };
  
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-5 card-hover`}>
      <div className="text-xs text-text-secondary font-medium mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-text-primary">{value}</span>
        <span className="text-sm text-text-secondary">{unit}</span>
      </div>
      <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${
        trend === 'up' ? 'text-battle-green' : 'text-red-400'
      }`}>
        {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{trendValue}</span>
        {trend === 'up' ? '↑' : '↓'}
      </div>
    </div>
  );
}

// Region ranking row
function RegionRankingRow({ region }: { region: typeof mockRegionRankings[0] }) {
  const rankClass = region.rank === 1 ? 'rank-gold' : region.rank === 2 ? 'rank-silver' : region.rank === 3 ? 'rank-bronze' : 'border-l-2 border-dark-border';
  
  return (
    <div className={`flex items-center py-3 px-4 bg-dark-bg/50 rounded-lg ${rankClass}`}>
      {/* Rank */}
      <div className="w-10 flex items-center justify-center">
        {region.rank === 1 && <span className="text-2xl">🏆</span>}
        {region.rank === 2 && <span className="text-xl">🥈</span>}
        {region.rank === 3 && <span className="text-xl">🥉</span>}
        {region.rank > 3 && <span className="w-7 h-7 bg-dark-border rounded-full flex items-center justify-center text-sm text-text-secondary">{region.rank}</span>}
      </div>
      
      {/* Name */}
      <div className="flex-1">
        <div className="font-semibold text-text-primary">{region.name}</div>
      </div>
      
      {/* Sales */}
      <div className="text-center px-4">
        <div className="text-lg font-bold text-text-primary">{region.sales.toLocaleString()}</div>
        <div className="text-xs text-text-secondary">销量</div>
      </div>
      
      {/* Package rate */}
      <div className="text-center px-4">
        <div className="text-lg font-bold text-battle-purple">{region.packageRate}%</div>
        <div className="text-xs text-text-secondary">套餐率</div>
      </div>
      
      {/* Execution rate */}
      <div className="text-center px-4">
        <div className={`text-lg font-bold ${
          region.executionRate >= 85 ? 'text-battle-green' :
          region.executionRate >= 70 ? 'text-battle-orange' : 'text-red-400'
        }`}>
          {region.executionRate}%
        </div>
        <div className="text-xs text-text-secondary">执行率</div>
      </div>
      
      {/* Change */}
      <div className="w-16 text-center">
        {region.change > 0 && (
          <span className="text-battle-green font-bold">↑升{region.change}</span>
        )}
        {region.change < 0 && (
          <span className="text-red-400 font-bold">↓降{Math.abs(region.change)}</span>
        )}
        {region.change === 0 && (
          <span className="text-text-secondary text-sm">—</span>
        )}
      </div>
    </div>
  );
}

// Store heat map block
function StoreBlock({ store }: { store: typeof mockStores[0] }) {
  const statusConfig = {
    good: { class: 'heat-good', label: '优秀', icon: '✓' },
    warning: { class: 'heat-warning', label: '注意', icon: '!' },
    danger: { class: 'heat-danger', label: '掉队', icon: '✗' },
  };
  const config = statusConfig[store.status as keyof typeof statusConfig];
  
  return (
    <div className={`store-block ${config.class}`}>
      <div className="text-sm font-semibold text-text-primary mb-2">{store.name}</div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-text-primary">{store.sales}</div>
          <div className="text-xs text-text-secondary">销量</div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${
            store.execution >= 85 ? 'text-battle-green' :
            store.execution >= 70 ? 'text-battle-orange' : 'text-red-400'
          }`}>
            {store.execution}%
          </div>
          <div className="text-xs text-text-secondary">执行</div>
        </div>
      </div>
      <div className={`mt-2 text-xs px-2 py-0.5 rounded-full inline-block ${
        store.status === 'good' ? 'bg-battle-green/20 text-battle-green' :
        store.status === 'warning' ? 'bg-battle-orange/20 text-battle-orange' :
        'bg-red-500/20 text-red-400'
      }`}>
        {config.icon} {config.label}
      </div>
    </div>
  );
}

// Content factory item
function ContentFactoryItem({ item }: { item: typeof mockContentFactory[0] }) {
  const typeIcons: Record<string, React.ReactNode> = {
    poster: <Image size={20} />,
    video: <Video size={20} />,
    audio: <Music size={20} />,
    text: <FileText size={20} />,
  };
  
  return (
    <div className="content-card flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        item.status === 'completed' ? 'bg-battle-green/20 text-battle-green' :
        item.status === 'generating' ? 'bg-battle-orange/20 text-battle-orange' :
        'bg-dark-border text-text-secondary'
      }`}>
        {typeIcons[item.type]}
      </div>
      
      <div className="flex-1">
        <div className="text-sm font-medium text-text-primary">{item.name}</div>
        {item.status === 'generating' && (
          <div className="mt-2 h-1.5 bg-dark-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-battle-orange rounded-full transition-all duration-500"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}
      </div>
      
      <StatusBadge status={item.status === 'completed' ? 'completed' : item.status === 'generating' ? 'in_progress' : 'pending'} />
    </div>
  );
}

// Task column component
function TaskColumn({ title, tasks, accentColor }: { title: string; tasks: Array<{ name: string; status: string }>; accentColor: string }) {
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  
  return (
    <div className="bg-dark-card rounded-xl border border-dark-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-primary">{title}</h3>
        <span className="text-xs bg-dark-bg px-2 py-1 rounded-full text-text-secondary">
          {completedCount}/{tasks.length} 完成
        </span>
      </div>
      
      <div className="space-y-2">
        {tasks.map((task, i) => (
          <div 
            key={i} 
            className={`p-3 bg-dark-bg rounded-lg status-${task.status === 'completed' ? 'completed' : task.status === 'in_progress' ? 'in-progress' : 'pending'}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-primary">{task.name}</span>
              <StatusBadge status={task.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main page component
export default function BattleCommandCenter() {
  const [selectedPhase, setSelectedPhase] = useState(mockStats.currentPhase);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  return (
    <div className="space-y-6">
      {/* Section 1: Hero Banner */}
      <div className="bg-gradient-to-br from-dark-card via-dark-bg to-dark-card rounded-2xl border border-dark-border p-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-battle-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-battle-blue/5 rounded-full blur-3xl" />
        
        <div className="relative flex items-start justify-between">
          {/* Left: Campaign info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="phase-badge phase-exposure">
                ⚡ Day 7 · 强曝光阶段
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-text-primary mb-3">
              蔬香鸡腿排新品战役
            </h1>
            
            <p className="text-text-secondary text-lg flex items-center gap-2">
              <Users size={18} />
              全国11区县同步推进中
            </p>
            
            {/* Quick stats row */}
            <div className="flex items-center gap-6 mt-6">
              <div className="text-center">
                <div className="text-xs text-text-secondary mb-1">战役天数</div>
                <div className="text-2xl font-bold text-battle-orange">7/30</div>
              </div>
              <div className="h-8 w-px bg-dark-border" />
              <div className="text-center">
                <div className="text-xs text-text-secondary mb-1">参与门店</div>
                <div className="text-2xl font-bold text-text-primary">286</div>
              </div>
              <div className="h-8 w-px bg-dark-border" />
              <div className="text-center">
                <div className="text-xs text-text-secondary mb-1">累计销量</div>
                <div className="text-2xl font-bold text-battle-green">12580</div>
              </div>
            </div>
          </div>
          
          {/* Right: Key metrics */}
          <div className="grid grid-cols-2 gap-4">
            <BattleStatCard
              label="当前销量"
              value="12,580"
              unit="份"
              trend="up"
              trendValue="+15%"
              color="green"
            />
            <BattleStatCard
              label="套餐率"
              value="68"
              unit="%"
              trend="up"
              trendValue="+5%"
              color="purple"
            />
            <BattleStatCard
              label="连带率"
              value="2.3"
              unit="倍"
              trend="up"
              trendValue="+8%"
              color="orange"
            />
            <BattleStatCard
              label="执行率"
              value="82"
              unit="%"
              trend="down"
              trendValue="-5%"
              color="accent"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Phase Timeline */}
      <PhaseTimeline 
        currentPhase={selectedPhase} 
        onPhaseClick={setSelectedPhase} 
      />

      {/* Section 3: Today's Battle Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TaskColumn title="🏛️ 总部动作" tasks={mockTodayTasks.hq} accentColor="blue" />
        <TaskColumn title="🗺️ 区县动作" tasks={mockTodayTasks.region} accentColor="orange" />
        <TaskColumn title="🏪 门店动作" tasks={mockTodayTasks.store} accentColor="green" />
      </div>

      {/* Section 4: Region PK Rankings */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <BarChart3 className="text-battle-gold" size={22} />
            区县PK榜
          </h2>
          <Link 
            href="/analytics" 
            className="text-sm text-accent hover:underline flex items-center gap-1"
          >
            查看详情 <ChevronRight size={14} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mockRegionRankings.map((region) => (
            <RegionRankingRow key={region.rank} region={region} />
          ))}
        </div>
      </div>

      {/* Section 5: Store Execution Heat Map */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Target className="text-battle-orange" size={22} />
            门店执行热力图
          </h2>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-battle-green/30 border border-battle-green/30" />
              <span className="text-text-secondary">优秀</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-battle-orange/30 border border-battle-orange/30" />
              <span className="text-text-secondary">注意</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500/30" />
              <span className="text-text-secondary">掉队</span>
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {mockStores.map((store, i) => (
            <StoreBlock key={i} store={store} />
          ))}
        </div>
      </div>

      {/* Section 6: AI Content Factory */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Sparkles className="text-accent" size={22} />
            AI内容工厂
          </h2>
          <Link 
            href="/generator" 
            className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Play size={14} />
            生成更多内容
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockContentFactory.map((item, i) => (
            <ContentFactoryItem key={i} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}