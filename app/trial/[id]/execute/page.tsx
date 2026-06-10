'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Store, CheckCircle2, AlertCircle, TrendingUp, Users, MessageSquare, Wrench } from 'lucide-react';
import { TrialPlan, TrialDailyReport, StoreTypeLabel } from '@/types';
import { formatDate } from '@/lib/utils';

const PHASE_CONFIG = {
  preparing: {
    label: '准备阶段',
    days: '试卖前3天',
    description: '总部定标准，区县做准备',
    focus: '门店操作验证',
    metrics: [],
  },
  phase1: {
    label: '第1-2天',
    days: '第1-2天',
    description: '先看门店能不能顺畅做',
    focus: '门店操作验证',
    metrics: [
      { key: 'operationIssues', label: '操作问题', icon: Wrench },
      { key: 'newProductSales', label: '新品销量', icon: TrendingUp },
    ],
  },
  phase2: {
    label: '第3-5天',
    days: '第3-5天',
    description: '重点看顾客买不买、套餐带不带得动',
    focus: '顾客购买验证',
    metrics: [
      { key: 'newProductSales', label: '新品销量', icon: TrendingUp },
      { key: 'newProductRatio', label: '新品占比', icon: TrendingUp },
      { key: 'comboRate', label: '套餐率', icon: Users },
    ],
  },
  phase3: {
    label: '第6-7天',
    days: '第6-7天',
    description: '看能不能复制和放大',
    focus: '可复制性验证',
    metrics: [
      { key: 'newProductSales', label: '新品销量', icon: TrendingUp },
      { key: 'comboRate', label: '套餐率', icon: Users },
    ],
  },
};

function getCurrentPhase(trial: TrialPlan): 'preparing' | 'phase1' | 'phase2' | 'phase3' {
  const start = new Date(trial.startDate);
  const end = new Date(trial.endDate);
  const now = new Date();
  
  if (now < start) return 'preparing';
  
  const daysPassed = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysPassed <= 2) return 'phase1';
  if (daysPassed <= 5) return 'phase2';
  return 'phase3';
}

function getCurrentDay(trial: TrialPlan): number {
  const start = new Date(trial.startDate);
  const now = new Date();
  const daysPassed = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(daysPassed, 7));
}

export default function TrialExecutePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [trial, setTrial] = useState<TrialPlan | null>(null);
  const [reports, setReports] = useState<TrialDailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [showReportForm, setShowReportForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    newProductSales: 0,
    newProductRatio: 0,
    comboRate: 0,
    avgOrderValueChange: 0,
    whyBuy: '',
    whyNotBuy: '',
    bestScene: '',
    operationIssues: '',
    staffFeedback: '',
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    setLoading(true);
    try {
      const [trialRes, reportsRes] = await Promise.all([
        fetch(`/api/trial/${id}`),
        fetch(`/api/trial/${id}/reports`),
      ]);
      
      const trialData = await trialRes.json();
      const reportsData = await reportsRes.json();
      
      setTrial(trialData);
      setReports(reportsData.reports || []);
      
      if (trialData.storeIds?.length > 0) {
        setSelectedStore(trialData.storeIds[0]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function submitReport() {
    if (!selectedStore) return;
    
    try {
      const currentDay = trial ? getCurrentDay(trial) : 1;
      const today = new Date().toISOString().split('T')[0];
      
      await fetch(`/api/trial/${id}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: selectedStore,
          storeName: selectedStore,
          day: currentDay,
          reportDate: today,
          ...formData,
          customerFeedback: {
            whyBuy: formData.whyBuy,
            whyNotBuy: formData.whyNotBuy,
            bestScene: formData.bestScene,
          },
          operationIssues: formData.operationIssues.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      
      setShowReportForm(false);
      setFormData({
        newProductSales: 0,
        newProductRatio: 0,
        comboRate: 0,
        avgOrderValueChange: 0,
        whyBuy: '',
        whyNotBuy: '',
        bestScene: '',
        operationIssues: '',
        staffFeedback: '',
      });
      
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Failed to submit report:', error);
      alert('提交失败');
    }
  }

  function getAggregatedByDay(day: number) {
    const dayReports = reports.filter(r => r.day === day);
    if (dayReports.length === 0) return null;
    
    return {
      avgSales: Math.round(dayReports.reduce((sum, r) => sum + (r.newProductSales || 0), 0) / dayReports.length),
      avgRatio: Math.round(dayReports.reduce((sum, r) => sum + (r.newProductRatio || 0), 0) / dayReports.length),
      avgComboRate: Math.round(dayReports.reduce((sum, r) => sum + (r.comboRate || 0), 0) / dayReports.length),
      totalStores: dayReports.length,
    };
  }

  if (loading || !trial) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentPhase = getCurrentPhase(trial);
  const currentDay = getCurrentDay(trial);
  const phaseConfig = PHASE_CONFIG[currentPhase];
  const phaseOrder = ['preparing', 'phase1', 'phase2', 'phase3'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/trial"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border hover:bg-dark-bg transition-colors"
          >
            <ArrowLeft size={18} className="text-text-primary" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{trial.productName}</h1>
            <p className="text-text-primary-secondary">试卖执行台</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-accent/10 rounded-lg">
            <span className="text-accent font-bold">第{currentDay}天/共7天</span>
          </div>
          <Link
            href={`/trial/${id}/review`}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
          >
            进入复盘决策
          </Link>
        </div>
      </div>

      {/* 7-Day Timeline */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          {phaseOrder.map((phase, idx) => (
            <div key={phase} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  phase === currentPhase
                    ? 'bg-accent text-white'
                    : phaseOrder.indexOf(currentPhase) > idx
                      ? 'bg-success text-white'
                      : 'bg-dark-bg text-text-primary-secondary'
                }`}>
                  {phaseOrder.indexOf(currentPhase) > idx ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>
                <p className={`text-xs mt-2 ${
                  phase === currentPhase ? 'text-accent font-medium' : 'text-text-primary-secondary'
                }`}>
                  {PHASE_CONFIG[phase as keyof typeof PHASE_CONFIG].days}
                </p>
              </div>
              {idx< phaseOrder.length - 1 && (
                <div className={`w-20 h-0.5 mx-2 ${
                  phaseOrder.indexOf(currentPhase) > idx
                    ? 'bg-success'
                    : 'bg-dark-border'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        {/* Current Phase Info */}
        <div className="bg-accent/10 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-accent mb-1">{phaseConfig.label}</h3>
          <p className="text-text-primary-secondary text-sm">{phaseConfig.description}</p>
          <p className="text-text-primary-secondary text-sm mt-2">
            <span className="font-medium text-text-primary">验证重点：</span>{phaseConfig.focus}
          </p>
        </div>

        {/* Daily Data Summary */}
        <div className="grid grid-cols-7 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6, 7].map(day => {
            const data = getAggregatedByDay(day);
            return (
              <div
                key={day}
                className={`p-3 rounded-lg border text-center ${
                  day === currentDay
                    ? 'border-accent bg-accent/10'
                    : data
                      ? 'border-dark-border bg-dark-bg'
                      : 'border-dark-border border-dashed opacity-50'
                }`}
              >
                <p className="text-xs text-text-primary-secondary mb-1">第{day}天</p>
                {data ? (
                  <>
                    <p className="text-lg font-bold text-text-primary">{data.avgSales}</p>
                    <p className="text-xs text-text-primary-secondary">销量</p>
                  </>
                ) : (
                  <p className="text-xs text-text-primary-secondary">暂无数据</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Entry Section */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">📊 今日数据录入</h2>
          {!showReportForm && (
            <button
              onClick={() => setShowReportForm(true)}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors text-sm"
            >
              录入今日数据
            </button>
          )}
        </div>

        {showReportForm ? (
          <div className="space-y-4">
            {/* Store Selector */}
            <div>
              <label className="block text-sm text-text-primary-secondary mb-2">选择门店</label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
              >
                {trial.storeIds?.map((storeId: string) => (
                  <option key={storeId} value={storeId}>{storeId}</option>
                ))}
              </select>
            </div>

            {/* Metrics Input */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-text-primary-secondary mb-2">新品销量</label>
                <input
                  type="number"
                  value={formData.newProductSales}
                  onChange={(e) => setFormData({ ...formData, newProductSales: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-text-primary-secondary mb-2">新品占比%</label>
                <input
                  type="number"
                  value={formData.newProductRatio}
                  onChange={(e) => setFormData({ ...formData, newProductRatio: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-text-primary-secondary mb-2">套餐率%</label>
                <input
                  type="number"
                  value={formData.comboRate}
                  onChange={(e) => setFormData({ ...formData, comboRate: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-text-primary-secondary mb-2">客单价变化</label>
                <input
                  type="number"
                  value={formData.avgOrderValueChange}
                  onChange={(e) => setFormData({ ...formData, avgOrderValueChange: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Customer Feedback */}
            <div className="space-y-3">
              <h3 className="font-medium text-text-primary flex items-center gap-2">
                <MessageSquare size={16} className="text-accent" />
                顾客反馈
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-text-primary-secondary mb-2">为什么买</label>
                  <input
                    type="text"
                    value={formData.whyBuy}
                    onChange={(e) => setFormData({ ...formData, whyBuy: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                    placeholder="口味好、价格实惠..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-primary-secondary mb-2">为什么不买</label>
                  <input
                    type="text"
                    value={formData.whyNotBuy}
                    onChange={(e) => setFormData({ ...formData, whyNotBuy: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                    placeholder="太贵了、不够辣..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-primary-secondary mb-2">什么场景更容易买</label>
                  <input
                    type="text"
                    value={formData.bestScene}
                    onChange={(e) => setFormData({ ...formData, bestScene: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                    placeholder="工作餐、聚会..."
                  />
                </div>
              </div>
            </div>

            {/* Operation Issues */}
            <div>
              <label className="block text-sm text-text-primary-secondary mb-2">操作问题（多个用逗号分隔）</label>
              <input
                type="text"
                value={formData.operationIssues}
                onChange={(e) => setFormData({ ...formData, operationIssues: e.target.value })}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                placeholder="备料麻烦,高峰期出餐慢..."
              />
            </div>

            {/* Staff Feedback */}
            <div>
              <label className="block text-sm text-text-primary-secondary mb-2">店员反馈</label>
              <textarea
                value={formData.staffFeedback}
                onChange={(e) => setFormData({ ...formData, staffFeedback: e.target.value })}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                rows={2}
                placeholder="店员是否愿意推荐、顾客反馈..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setShowReportForm(false)}
                className="px-4 py-2 border border-dark-border rounded-lg hover:bg-dark-bg transition-colors text-text-primary"
              >
                取消
              </button>
              <button
                onClick={submitReport}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
              >
                提交今日数据
              </button>
            </div>
          </div>
        ) : (
          <p className="text-text-primary-secondary text-sm">
            点击"录入今日数据"按钮，为门店录入今天的试卖数据
          </p>
        )}
      </div>

      {/* Store Reports Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-text-primary mb-4">门店汇总</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4 text-sm text-text-primary-secondary font-medium">门店</th>
                <th className="text-left py-3 px-4 text-sm text-text-primary-secondary font-medium">天数</th>
                <th className="text-right py-3 px-4 text-sm text-text-primary-secondary font-medium">平均销量</th>
                <th className="text-right py-3 px-4 text-sm text-text-primary-secondary font-medium">平均占比</th>
                <th className="text-right py-3 px-4 text-sm text-text-primary-secondary font-medium">套餐率</th>
                <th className="text-left py-3 px-4 text-sm text-text-primary-secondary font-medium">操作问题</th>
              </tr>
            </thead>
            <tbody>
              {trial.storeIds?.map((storeId: string) => {
                const storeReports = reports.filter(r => r.storeId === storeId);
                const avgSales = storeReports.length > 0
                  ? Math.round(storeReports.reduce((sum, r) => sum + (r.newProductSales || 0), 0) / storeReports.length)
                  : 0;
                const avgRatio = storeReports.length > 0
                  ? Math.round(storeReports.reduce((sum, r) => sum + (r.newProductRatio || 0), 0) / storeReports.length)
                  : 0;
                const avgCombo = storeReports.length > 0
                  ? Math.round(storeReports.reduce((sum, r) => sum + (r.comboRate || 0), 0) / storeReports.length)
                  : 0;
                const allIssues = storeReports.flatMap(r => r.operationIssues || []);
                const uniqueIssues = Array.from(new Set(allIssues));
                
                return (
                  <tr key={storeId} className="border-b border-dark-border hover:bg-dark-bg/50">
                    <td className="py-3 px-4 text-text-primary">{storeId}</td>
                    <td className="py-3 px-4 text-text-primary">{storeReports.length}天</td>
                    <td className="py-3 px-4 text-right text-text-primary font-medium">{avgSales}</td>
                    <td className="py-3 px-4 text-right text-text-primary">{avgRatio}%</td>
                    <td className="py-3 px-4 text-right text-text-primary">{avgCombo}%</td>
                    <td className="py-3 px-4 text-text-primary-secondary text-sm">
                      {uniqueIssues.length > 0 ? uniqueIssues.join(', ') : '无'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}