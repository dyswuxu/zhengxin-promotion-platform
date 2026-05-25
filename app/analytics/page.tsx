'use client';

import { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  AlertTriangle,
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

const COLORS = ['#FF6B35', '#1E3A5F', '#10B981', '#F59E0B', '#6B7280'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  // Mock data for charts
  const salesTrendData = [
    { date: '05-15', value: 12500 },
    { date: '05-16', value: 15800 },
    { date: '05-17', value: 14200 },
    { date: '05-18', value: 18600 },
    { date: '05-19', value: 22400 },
    { date: '05-20', value: 21800 },
    { date: '05-21', value: 25600 },
  ];

  const categoryData = [
    { name: '鸡排', value: 45 },
    { name: '小吃', value: 30 },
    { name: '饮品', value: 15 },
    { name: '套餐', value: 10 },
  ];

  const regionData = [
    { region: '华东', sales: 45000, growth: 12 },
    { region: '华南', sales: 38000, growth: 8 },
    { region: '华中', sales: 32000, growth: 15 },
    { region: '华北', sales: 28000, growth: -3 },
    { region: '西南', sales: 22000, growth: 20 },
  ];

  const topProductsData = [
    { name: '韩式炸鸡', sales: 12580, growth: 35 },
    { name: '藤椒鸡排', sales: 9870, growth: 12 },
    { name: '香辣鸡排', sales: 8540, growth: -5 },
    { name: '蜂蜜芥末', sales: 6230, growth: 8 },
    { name: '原味鸡排', sales: 4120, growth: -15 },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-32 rounded" />
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
      <div>
        <h1 className="text-2xl font-bold text-text">数据看板</h1>
        <p className="text-muted mt-1">追踪新品推广效果和核心指标</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted text-sm">本月销量</span>
            <TrendingUp size={18} className="text-success" />
          </div>
          <p className="text-3xl font-bold text-text">156,000</p>
          <p className="text-sm text-success mt-1">+12.5% 较上月</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted text-sm">平均转化率</span>
            <BarChart3 size={18} className="text-primary" />
          </div>
          <p className="text-3xl font-bold text-text">8.5%</p>
          <p className="text-sm text-success mt-1">+1.2% 较上月</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted text-sm">平均客单价</span>
            <Package size={18} className="text-accent" />
          </div>
          <p className="text-3xl font-bold text-text">¥32.5</p>
          <p className="text-sm text-warning mt-1">-0.8% 较上月</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted text-sm">活跃新品</span>
            <Users size={18} className="text-primary" />
          </div>
          <p className="text-3xl font-bold text-text">24</p>
          <p className="text-sm text-muted mt-1">本月新增 6 款</p>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-3 gap-6">
        {/* Sales trend */}
        <div className="col-span-2 bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text mb-4">销量趋势</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#FF6B35"
                  strokeWidth={2}
                  dot={{ fill: '#FF6B35', strokeWidth: 0 }}
                  name="销量"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category distribution */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text mb-4">品类占比</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Region performance */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text mb-4">区域表现</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" fontSize={12} />
                <YAxis dataKey="region" type="category" stroke="#6B7280" fontSize={12} width={50} />
                <Tooltip />
                <Bar dataKey="sales" fill="#1E3A5F" name="销量" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text mb-4">TOP新品排行榜</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip />
                <Bar dataKey="sales" fill="#FF6B35" name="销量" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Region growth table */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold text-text mb-4">区域增长详情</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 text-sm font-medium text-muted">区域</th>
              <th className="text-right py-3 text-sm font-medium text-muted">销量</th>
              <th className="text-right py-3 text-sm font-medium text-muted">增长率</th>
              <th className="text-right py-3 text-sm font-medium text-muted">占比</th>
              <th className="text-right py-3 text-sm font-medium text-muted">趋势</th>
            </tr>
          </thead>
          <tbody>
            {regionData.map(row => (
              <tr key={row.region} className="border-b border-border last:border-0">
                <td className="py-4 text-sm font-medium">{row.region}</td>
                <td className="py-4 text-sm text-right">{row.sales.toLocaleString()}</td>
                <td className="py-4 text-sm text-right">
                  <span className={row.growth > 0 ? 'text-success' : 'text-error'}>
                    {row.growth > 0 ? '+' : ''}{row.growth}%
                  </span>
                </td>
                <td className="py-4 text-sm text-right">{(row.sales / 165000 * 100).toFixed(1)}%</td>
                <td className="py-4 text-right">
                  {row.growth > 0 ? (
                    <TrendingUp size={16} className="text-success inline" />
                  ) : (
                    <TrendingDown size={16} className="text-error inline" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}