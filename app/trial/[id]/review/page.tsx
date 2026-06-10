'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Sparkles } from 'lucide-react';
import { TrialPlan, TrialDecision, TrialDecisionLabel, TrialDailyReport } from '@/types';

export default function TrialReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [trial, setTrial] = useState<TrialPlan | null>(null);
  const [reports, setReports] = useState<TrialDailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [conclusion, setConclusion] = useState({
    decision: '' as TrialDecision | '',
    mainCrowd: '',
    mainScene: '',
    bestCombo: '',
    standardScript: '',
    adjustmentIssues: '',
    productViability: '',
    storeViability: '',
    replicability: '',
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
      
      // Load existing conclusion if any
      if (trialData.conclusion) {
        setConclusion(trialData.conclusion);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateAverages() {
    if (reports.length === 0) return { avgSales: 0, avgRatio: 0, avgCombo: 0 };
    
    return {
      avgSales: Math.round(reports.reduce((sum, r) => sum + (r.newProductSales || 0), 0) / reports.length),
      avgRatio: Math.round(reports.reduce((sum, r) => sum + (r.newProductRatio || 0), 0) / reports.length),
      avgCombo: Math.round(reports.reduce((sum, r) => sum + (r.comboRate || 0), 0) / reports.length),
    };
  }

  function getTopFeedback(field: 'whyBuy' | 'whyNotBuy' | 'bestScene'): string {
    const fieldReports = reports.filter(r => r.customerFeedback?.[field]);
    if (fieldReports.length === 0) return '暂无数据';
    
    const counts: Record<string, number> = {};
    fieldReports.forEach(r => {
      const text = r.customerFeedback[field];
      if (text) {
        counts[text] = (counts[text] || 0) + 1;
      }
    });
    
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : '暂无数据';
  }

  function getOperationIssues(): string[] {
    const allIssues = reports.flatMap(r => r.operationIssues || []);
    const counts: Record<string, number> = {};
    allIssues.forEach(issue => {
      counts[issue] = (counts[issue] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([issue]) => issue);
  }

  async function submitConclusion() {
    if (!conclusion.decision) {
      alert('请选择决策结果');
      return;
    }
    
    setSubmitting(true);
    try {
      await fetch(`/api/trial/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'completed',
          conclusion,
        }),
      });
      
      alert('结论已保存');
      fetchData();
    } catch (error) {
      console.error('Failed to save conclusion:', error);
      alert('保存失败');
    } finally {
      setSubmitting(false);
    }
  }

  function analyzeViability(): { product: 'pass' | 'warning' | 'fail'; store: 'pass' | 'warning' | 'fail'; replicability: 'pass' | 'warning' | 'fail' } {
    const avg = calculateAverages();
    
    return {
      product: avg.avgRatio >= 30 ? 'pass' : avg.avgRatio >= 15 ? 'warning' : 'fail',
      store: getOperationIssues().length <= 2 ? 'pass' : getOperationIssues().length <= 4 ? 'warning' : 'fail',
      replicability: avg.avgCombo >= 50 ? 'pass' : avg.avgCombo >= 30 ? 'warning' : 'fail',
    };
  }

  if (loading || !trial) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  const avg = calculateAverages();
  const viability = analyzeViability();
  const decisions: Array<{ key: TrialDecision; icon: typeof CheckCircle2; color: string; label: string }> = [
    { key: 'approve', icon: CheckCircle2, color: 'bg-error text-white', label: '可以放大' },
    { key: 'modify_then_approve', icon: CheckCircle2, color: 'bg-accent text-white', label: '小改后放大' },
    { key: 'extend_trial', icon: AlertTriangle, color: 'bg-warning text-white', label: '继续试卖' },
    { key: 'postpone', icon: XCircle, color: 'bg-gray-500 text-white', label: '暂缓推广' },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
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
            <p className="text-text-primary-secondary">试卖复盘决策</p>
          </div>
        </div>
      </div>

      {/* Red Conclusion Banner */}
      <div className="bg-error text-white rounded-xl p-4">
        <p className="font-bold text-lg">🔴 试卖是正式推广前的决策关口</p>
      </div>

      {/* Three Questions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`bg-dark-card border rounded-xl p-5 ${
          viability.product === 'pass' ? 'border-success' : viability.product === 'warning' ? 'border-warning' : 'border-error'
        }`}>
          <h3 className="font-bold text-text-primary mb-3">产品能不能成立</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-primary-secondary">新品占比</span>
              <span className={`font-bold ${avg.avgRatio >= 30 ? 'text-success' : avg.avgRatio >= 15 ? 'text-warning' : 'text-error'}`}>
                {avg.avgRatio}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-primary-secondary">为什么买</span>
              <span className="text-text-primary text-right text-xs max-w-[150px] truncate">{getTopFeedback('whyBuy')}</span>
            </div>
           <div className="flex items-center justify-between">
              <span className="text-text-primary-secondary">为什么不买</span>
              <span className="text-text-primary text-right text-xs max-w-[150px] truncate">{getTopFeedback('whyNotBuy')}</span>
            </div>
          </div>
          <div className={`mt-3 px-3 py-2 rounded-lg text-sm ${
            viability.product === 'pass' ? 'bg-success/20 text-success' : 
            viability.product === 'warning' ? 'bg-warning/20 text-warning' : 
            'bg-error/20 text-error'
          }`}>
            {viability.product === 'pass' ? '✅ 顾客接受度高' : 
             viability.product === 'warning' ? '⚠️ 需要优化调整' : 
             '❌ 顾客接受度低'}
          </div>
        </div>

        <div className={`bg-dark-card border rounded-xl p-5 ${
          viability.store === 'pass' ? 'border-success' : viability.store === 'warning' ? 'border-warning' : 'border-error'
        }`}>
          <h3 className="font-bold text-text-primary mb-3">门店能不能承接</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-primary-secondary">主要操作问题</span>
              <span className="text-text-primary">{getOperationIssues().length}个</span>
            </div>
            {getOperationIssues().slice(0, 3).map((issue, idx) => (
              <div key={idx} className="text-xs text-text-primary-secondary truncate">
                · {issue}
              </div>
            ))}
          </div>
          <div className={`mt-3 px-3 py-2 rounded-lg text-sm ${
            viability.store === 'pass' ? 'bg-success/20 text-success' : 
            viability.store === 'warning' ? 'bg-warning/20 text-warning' : 
            'bg-error/20 text-error'
          }`}>
            {viability.store === 'pass' ? '✅ 门店操作顺畅' : 
             viability.store === 'warning' ? '⚠️ 存在操作问题' : 
             '❌ 门店承接困难'}
          </div>
        </div>

        <div className={`bg-dark-card border rounded-xl p-5 ${
          viability.replicability === 'pass' ? 'border-success' : viability.replicability === 'warning' ? 'border-warning' : 'border-error'
        }`}>
          <h3 className="font-bold text-text-primary mb-3">卖法能不能复制</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-primary-secondary">套餐率</span>
              <span className={`font-bold ${avg.avgCombo >= 50 ? 'text-success' : avg.avgCombo >= 30 ? 'text-warning' : 'text-error'}`}>
                {avg.avgCombo}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-primary-secondary">最佳场景</span>
              <span className="text-text-primary text-xs">{getTopFeedback('bestScene')}</span>
            </div>
           <div className="flex items-center justify-between">
              <span className="text-text-primary-secondary">平均日销量</span>
              <span className="text-text-primary font-medium">{avg.avgSales}</span>
            </div>
          </div>
          <div className={`mt-3 px-3 py-2 rounded-lg text-sm ${
            viability.replicability === 'pass' ? 'bg-success/20 text-success' : 
            viability.replicability === 'warning' ? 'bg-warning/20 text-warning' : 
            'bg-error/20 text-error'
          }`}>
            {viability.replicability === 'pass' ? '✅ 卖法可复制' : 
             viability.replicability === 'warning' ? '⚠️ 仅部分门店可执行' : 
             '❌ 卖法尚未跑通'}
          </div>
        </div>
      </div>

      {/* Conclusion Form */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-text-primary mb-4">📋 试卖结论表</h2>
        
        {/* Decision Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {decisions.map(({ key, icon: Icon, color, label }) => (
            <button
              key={key}
              onClick={() => setConclusion({ ...conclusion, decision: key })}
              className={`p-4 rounded-xl border-2 transition-all ${
                conclusion.decision === key
                  ? `border-2 ${color.replace('bg-', 'border-')} ${color}`
                  : 'border-dark-border hover:border-accent/50 bg-dark-bg'
              }`}
            >
              <Icon size={24} className={`mx-auto mb-2 ${
                conclusion.decision === key ? '' : 'text-text-primary-secondary'
              }`} />
              <p className={`text-sm font-medium ${
                conclusion.decision === key ? '' : 'text-text-primary'
              }`}>{label}</p>
            </button>
          ))}
        </div>

        {/* Conclusion Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-primary-secondary mb-2">主推人群</label>
            <input
              type="text"
              value={conclusion.mainCrowd}
              onChange={(e) => setConclusion({ ...conclusion, mainCrowd: e.target.value })}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
              placeholder="学生/上班族/社区居民..."
            />
          </div>
          <div>
            <label className="block text-sm text-text-primary-secondary mb-2">主推场景</label>
            <input
              type="text"
              value={conclusion.mainScene}
              onChange={(e) => setConclusion({ ...conclusion, mainScene: e.target.value })}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
              placeholder="工作餐/聚会/夜宵..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-text-primary-secondary mb-2">最优套餐结构</label>
            <input
              type="text"
              value={conclusion.bestCombo}
              onChange={(e) => setConclusion({ ...conclusion, bestCombo: e.target.value })}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
              placeholder="单品+饮料 / 主食+小食+饮料..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-text-primary-secondary mb-2">标准推荐话术</label>
            <textarea
              value={conclusion.standardScript}
              onChange={(e) => setConclusion({ ...conclusion, standardScript: e.target.value })}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
              rows={2}
              placeholder="店员标准推荐话术..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-text-primary-secondary mb-2">需要调整的问题</label>
            <textarea
              value={conclusion.adjustmentIssues}
              onChange={(e) => setConclusion({ ...conclusion, adjustmentIssues: e.target.value })}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
              rows={2}
              placeholder="产品方向成立，但价格/套餐/话术/操作需要调整..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <Link
            href="/trial"
            className="px-4 py-2 border border-dark-border rounded-lg hover:bg-dark-bg transition-colors text-text-primary"
          >
            返回列表
          </Link>
          {conclusion.decision === 'approve' || conclusion.decision === 'modify_then_approve' ? (
            <Link
              href="/generator"
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
            >
              <Sparkles size={16} />
              生成推广方案
            </Link>
          ) : null}
          <button
            onClick={submitConclusion}
            disabled={submitting || !conclusion.decision}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              submitting || !conclusion.decision
                ? 'bg-dark-bg text-text-primary-secondary cursor-not-allowed'
                : 'bg-success text-white hover:bg-success/90'
            }`}
          >
            {submitting ? '保存中...' : '保存结论'}
          </button>
        </div>
      </div>
    </div>
  );
}