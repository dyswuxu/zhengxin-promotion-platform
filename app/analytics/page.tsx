'use client';

import { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  AlertTriangle,
  Brain,
  Target,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#FF6B35', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

// AI Insight component
function AIInsight({ text, type = 'info' }: { text: string; type?: 'success' | 'warning' | 'info' }) {
  const typeConfig = {
    success: { icon: '✓', bgClass: 'bg-battle-green/10 border-battle-green/30', textClass: 'text-battle-green' },
    warning: { icon: '!', bgClass: 'bg-battle-orange/10 border-battle-orange/30', textClass: 'text-battle-orange' },
    info: { icon: '💡', bgClass: 'bg-battle-blue/10 border-battle-blue/30', textClass: 'text-battle-blue' },
  };
  const config = typeConfig[type];
  
  return (
    <div className={`p-4 rounded-lg border ${config.bgClass}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg">{config.icon}</span>
        <div>
          <div className="text-xs font-semibold text-text-secondary mb-1 flex items-center gap-2">
            <Brain size={14} className={config.textClass} />
            AI经营判断
          </div>
          <p className="text-sm text-text-primary leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  // Mock data for charts
  const salesTrendData = [
    { date: 'Day1', value: 8500 },
    { date: 'Day2', value: 10200 },
    { date: 'Day3', value: 9800 },
    { date: 'Day4', value: 12500 },
    { date: 'Day5', value: 15800 },
    { date: 'Day6', value: 14200 },
    { date: 'Day7', value: 18600 },
  ];

  const categoryData = [
    { name: '鸡排', value: 45 },
    { name: '套餐', value: 30 },
    { name: '小吃', value: 15 },
    { name: '饮品', value: 10 },
  ];

  const regionData = [
    { region: '上海浦东区', sales: 25800, growth: 15 },
    { region: '杭州西湖区', sales: 21900, growth: 12 },
    { region: '苏州园区', sales: 19800, growth: 8 },
    { region: '南京鼓楼区', sales: 17500, growth: -5 },
    { region: '宁波鄞州区', sales: 15200, growth: 22 },
  ];

  const phaseProgressData = [
    { phase: '预热期', target: 10000, actual: 9200 },
    { phase: '强曝光', target: 25000, actual: 18600 },
    { phase: '套餐放大', target: 50000, actual: 0 },
    { phase: '裂变复购', target: 80000, actual: 0 },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <BarChart3 size={28} className="text-accent" />
            战况数据中心
          </h1>
          <p className="text-text-secondary mt-1">蔬香鸡腿排新品战役 · Day 7 / 30</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-battle-orange/20 text-battle-orange rounded-full text-sm font-medium">
            ⚡ 强曝光阶段
          </span>
        </div>
      </div>

      {/* Stats overview - Battle Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-battle-green/10 to-transparent border border-battle-green/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-secondary text-sm">战役总销量</span>
            <Target size={18} className="text-battle-green" />
          </div>
          <p className="text-3xl font-bold text-text-primary">12,580</p>
          <p className="text-sm text-battle-green mt-1">📈 超额完成预热目标</p>
        </div>

        <div className="bg-gradient-to-br from-battle-purple/10 to-transparent border border-battle-purple/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-secondary text-sm">套餐率</span>
            <BarChart3 size={18} className="text-battle-purple" />
          </div>
          <p className="text-3xl font-bold text-text-primary">68%</p>
          <p className="text-sm text-battle-purple mt-1">📊 较预热期提升12%</p>
        </div>

        <div className="bg-gradient-to-br from-battle-orange/10 to-transparent border border-battle-orange/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-secondary text-sm">连带率</span>
            <Package size={18} className="text-battle-orange" />
          </div>
          <p className="text-3xl font-bold text-text-primary">2.3x</p>
          <p className="text-sm text-battle-orange mt-1">🎯 目标: 2.0x</p>
        </div>

        <div className="bg-gradient-to-br from-accent/10 to-transparent border border-accent/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-secondary text-sm">执行率</span>
            <Zap size={18} className="text-accent" />
          </div>
          <p className="text-3xl font-bold text-text-primary">82%</p>
          <p className="text-sm text-battle-orange mt-1">⚠️ 需关注门店执行</p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="space-y-4">
        <AIInsight 
          type="success"
          text="华东区域表现强劲，上海浦东区销量突破25,800份，套餐率达75%，建议总结其成功经验并复制到其他区域。"
        />
        <AIInsight 
          type="warning"
          text="南京鼓楼区执行率降至65%，主要原因是门店POP物料张贴滞后。建议区域负责人立即跟进，可安排总部督导支持。"
        />
        <AIInsight 
          type="info"
          text="根据当前增长趋势，预计Day10强曝光结束时可达36,000份销量，建议提前准备套餐放大阶段的物料库存。"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-3 gap-6">
        {/* Sales trend */}
        <div className="col-span-2 bg-dark-card rounded-xl border border-dark-border p-6">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-battle-green" />
            销量趋势
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#F8FAFC'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#FF6B35"
                  strokeWidth={3}
                  dot={{ fill: '#FF6B35', strokeWidth: 0, r: 4 }}
                  name="销量"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category distribution */}
        <div className="bg-dark-card rounded-xl border border-dark-border p-6">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span className="text-battle-purple">📊</span>
            品类占比
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#94A3B8' }}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#F8FAFC'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Phase Progress */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6">
        <h3 className="font-semibold text-text-primary mb-6 flex items-center gap-2">
          <Target size={18} className="text-accent" />
          战役阶段进度
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {phaseProgressData.map((phase, i) => {
            const colors = ['battle-blue', 'battle-orange', 'battle-purple', 'battle-green'];
            const progress = phase.actual / phase.target * 100;
            
            return (
              <div key={phase.phase} className="bg-dark-bg rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-medium text-${colors[i]}`}>
                    {phase.phase}
                  </span>
                  {i === 1 && (
                    <span className="text-xs bg-battle-orange/20 text-battle-orange px-2 py-0.5 rounded animate-pulse">
                      进行中
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-text-primary mb-2">
                  {i === 0 ? '92%' : i === 1 ? '74%' : '0%'}
                </div>
                <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-${colors[i]} rounded-full transition-all`}
                    style={{ width: `${i === 0 ? 92 : i === 1 ? 74 : 0}%` }}
                  />
                </div>
                <div className="text-xs text-text-secondary mt-2">
                  {i === 0 ? '超额完成' : i === 1 ? '进行中' : '未开始'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Region performance */}
        <div className="bg-dark-card rounded-xl border border-dark-border p-6">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Users size={18} className="text-battle-blue" />
            区域战况
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94A3B8" fontSize={12} />
                <YAxis dataKey="region" type="category" stroke="#94A3B8" fontSize={12} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#F8FAFC'
                  }}
                />
                <Bar dataKey="sales" fill="#3B82F6" name="销量" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top products - replaced with execution heat */}
        <div className="bg-dark-card rounded-xl border border-dark-border p-6">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Target size={18} className="text-battle-green" />
            门店执行排行
          </h3>
          <div className="space-y-3">
            {[
              { name: '浦东张江店', rate: 95, trend: 'up' },
              { name: '浦东陆家嘴店', rate: 92, trend: 'up' },
              { name: '西湖文三路店', rate: 88, trend: 'up' },
              { name: '苏州观前街店', rate: 85, trend: 'down' },
              { name: '南京新街口店', rate: 65, trend: 'down' },
            ].map((store, i) => (
              <div key={store.name} className="flex items-center gap-4 p-3 bg-dark-bg rounded-lg">
                <span className="w-6 text-center font-bold text-text-secondary">{i + 1}</span>
                <span className="flex-1 text-sm text-text-primary">{store.name}</span>
                <div className="w-24 h-2 bg-dark-border rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${store.rate >= 85 ? 'bg-battle-green' : store.rate >= 70 ? 'bg-battle-orange' : 'bg-red-500'}`}
                    style={{ width: `${store.rate}%` }}
                  />
                </div>
                <span className={`text-sm font-bold ${store.rate >= 85 ? 'text-battle-green' : store.rate >= 70 ? 'text-battle-orange' : 'text-red-400'}`}>
                  {store.rate}%
                </span>
                {store.trend === 'up' ? (
                  <TrendingUp size={16} className="text-battle-green" />
                ) : (
                  <TrendingDown size={16} className="text-red-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-gradient-to-br from-dark-card to-dark-bg rounded-xl border border-dark-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-battle-blue/20 rounded-lg flex items-center justify-center">
            <Brain size={20} className="text-battle-blue" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">战役AI总结</h3>
            <p className="text-xs text-text-secondary">基于当前数据分析</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 bg-dark-bg rounded-lg">
            <div className="text-xs text-text-secondary mb-2">预热期 (Day 1-3)</div>
            <div className="text-lg font-bold text-battle-green">92%</div>
            <div className="text-xs text-text-secondary">目标达成率</div>
          </div>
          <div className="p-4 bg-dark-bg rounded-lg">
            <div className="text-xs text-text-secondary mb-2">强曝光期 (Day 4-10)</div>
            <div className="text-lg font-bold text-battle-orange">74%</div>
            <div className="text-xs text-text-secondary">当前进度</div>
          </div>
          <div className="p-4 bg-dark-bg rounded-lg">
            <div className="text-xs text-text-secondary mb-2">战役预测</div>
            <div className="text-lg font-bold text-text-primary">超额</div>
            <div className="text-xs text-text-secondary">预计完成率 115%</div>
          </div>
        </div>
      </div>
    </div>
  );
}