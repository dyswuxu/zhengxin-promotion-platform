'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

// Stat card component
function StatCard({
  title,
  value,
  trend,
  trendValue,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  trend?: 'up' | 'down';
  trendValue?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-border card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-text">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-success' : 'text-error'}`}>
              {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <Icon className="text-primary" size={24} />
        </div>
      </div>
    </div>
  );
}

// Top product item
function TopProductItem({
  rank,
  name,
  sales,
  trend,
}: {
  rank: number;
  name: string;
  sales: number;
  trend: 'up' | 'down';
}) {
  return (
    <div className="flex items-center py-3 border-b border-border last:border-0">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3 ${
        rank <= 3 ? 'bg-accent text-white' : 'bg-gray-100 text-muted'
      }`}>
        {rank}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-text">{name}</p>
        <p className="text-xs text-muted">{sales.toLocaleString()} 销量</p>
      </div>
      <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-success' : 'text-error'}`}>
        {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
      </div>
    </div>
  );
}

// Alert item
function AlertItem({
  productName,
  message,
}: {
  productName: string;
  message: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <AlertTriangle className="text-error" size={16} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-text">{productName}</p>
        <p className="text-xs text-muted mt-0.5">{message}</p>
      </div>
      <Link
        href="/products"
        className="text-xs text-accent hover:underline flex-shrink-0"
      >
        查看
      </Link>
    </div>
  );
}

// Quick action card
function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl p-5 border border-border card-hover block"
    >
      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
        <Icon className="text-accent" size={20} />
      </div>
      <h3 className="font-medium text-text mb-1">{title}</h3>
      <p className="text-sm text-muted">{description}</p>
    </Link>
  );
}

export default function HomePage() {
  const [data, setData] = useState({
    totalProducts: 0,
    successRate: 0,
    topProducts: [] as Array<{ name: string; sales: number; trend: 'up' | 'down' }>,
    alerts: [] as Array<{ productName: string; message: string }>,
  });

  useEffect(() => {
    // Fetch dashboard data
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">控制台</h1>
          <p className="text-muted mt-1">欢迎回来，查看您的新品推广概览</p>
        </div>
        <Link
          href="/generator"
          className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors btn-press"
        >
          <Sparkles size={18} />
          <span>新建推广方案</span>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="当前推广新品"
          value={data.totalProducts || 8}
          trend="up"
          trendValue="+3 本月"
          icon={Package}
        />
        <StatCard
          title="爆品成功率"
          value={data.successRate || '78%'}
          trend="up"
          trendValue="+5.2%"
          icon={TrendingUp}
        />
        <StatCard
          title="进行中任务"
          value={24}
          icon={Package}
        />
        <StatCard
          title="异常预警"
          value={2}
          icon={AlertTriangle}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top products */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text">TOP新品排行榜</h2>
            <Link href="/products" className="text-sm text-accent hover:underline">查看全部</Link>
          </div>
          <div className="space-y-1">
            {data.topProducts.length > 0 ? (
              data.topProducts.map((product, index) => (
                <TopProductItem
                  key={index}
                  rank={index + 1}
                  name={product.name}
                  sales={product.sales}
                  trend={product.trend}
                />
              ))
            ) : (
              <>
                <TopProductItem rank={1} name="韩式炸鸡（新品）" sales={12580} trend="up" />
                <TopProductItem rank={2} name="藤椒鸡排" sales={9870} trend="up" />
                <TopProductItem rank={3} name="香辣鸡排" sales={8540} trend="down" />
                <TopProductItem rank={4} name="蜂蜜芥末鸡排" sales={6230} trend="up" />
                <TopProductItem rank={5} name="原味鸡排" sales={4120} trend="down" />
              </>
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text">异常预警</h2>
            <span className="text-xs bg-error/10 text-error px-2 py-1 rounded-full">2 条待处理</span>
          </div>
          <div className="space-y-1">
            {data.alerts.length > 0 ? (
              data.alerts.map((alert, index) => (
                <AlertItem
                  key={index}
                  productName={alert.productName}
                  message={alert.message}
                />
              ))
            ) : (
              <>
                <AlertItem
                  productName="藤椒鸡排"
                  message="徐州泉山区门店执行率低于60%"
                />
                <AlertItem
                  productName="香辣鸡排"
                  message="今日销量环比下降15%，需要关注"
                />
              </>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <h2 className="font-semibold text-text">快捷操作</h2>
          <div className="grid grid-cols-1 gap-4">
            <QuickActionCard
              title="AI生成推广方案"
              description="输入产品信息，AI自动生成完整推广包"
              href="/generator"
              icon={Sparkles}
            />
            <QuickActionCard
              title="管理新品"
              description="查看、编辑、跟踪所有新品状态"
              href="/products"
              icon={Package}
            />
            <QuickActionCard
              title="查看数据看板"
              description="追踪销量、转化率等核心指标"
              href="/analytics"
              icon={TrendingUp}
            />
          </div>
        </div>
      </div>
    </div>
  );
}