'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, FlaskConical, Calendar, Store, ArrowRight } from 'lucide-react';
import { TrialPlan, TrialStatus, TrialStatusLabel, TrialStatusColor, StoreTypeLabel } from '@/types';
import { formatDate } from '@/lib/utils';

const statusTabs: Array<{ key: string | null; label: string }> = [
  { key: null, label: '全部' },
  { key: 'executing', label: '进行中' },
  { key: 'completed', label: '已完成' },
  { key: 'planning', label: '计划中' },
  { key: 'cancelled', label: '已终止' },
];

export default function TrialPage() {
  const [trials, setTrials] = useState<TrialPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    fetchTrials();
  }, [activeTab]);

  async function fetchTrials() {
    setLoading(true);
    try {
      const url = activeTab
        ? `/api/trial?status=${activeTab}`
        : '/api/trial';
      const res = await fetch(url);
      const data = await res.json();
      setTrials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch trials:', error);
    } finally {
      setLoading(false);
    }
  }

  function getTrialProgress(trial: TrialPlan): { current: number; total: number; percentage: number } {
    if (trial.status === 'completed' || trial.status === 'cancelled') {
      return { current: trial.status === 'completed' ? 7 : 0, total: 7, percentage: trial.status === 'completed' ? 100 : 0 };
    }
    
    const start = new Date(trial.startDate);
    const end = new Date(trial.endDate);
    const now = new Date();
    
    if (now < start) {
      return { current: 0, total: 7, percentage: 0 };
    }
    
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysPassed = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return { 
      current: Math.min(daysPassed, totalDays), 
      total: totalDays, 
      percentage: Math.min(Math.round((daysPassed / totalDays) * 100), 100) 
    };
  }

  function getStatusBadge(status: TrialStatus) {
    const colorClass = TrialStatusColor[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {TrialStatusLabel[status]}
      </span>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">试卖中心</h1>
          <p className="text-text-primary-secondary mt-1">7天试卖决策系统，新品放大的决策关口</p>
        </div>
        <Link
          href="/trial/new/plan"
          className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors btn-press"
        >
          <Plus size={18} />
          <span>创建试卖</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FlaskConical className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-text-primary-secondary text-sm">全部试卖</p>
              <p className="text-2xl font-bold text-text-primary">{trials.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <FlaskConical className="text-accent" size={20} />
            </div>
            <div>
              <p className="text-text-primary-secondary text-sm">进行中</p>
              <p className="text-2xl font-bold text-text-primary">
                {trials.filter(t => t.status === 'executing').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
              <FlaskConical className="text-success" size={20} />
            </div>
            <div>
              <p className="text-text-primary-secondary text-sm">已完成</p>
              <p className="text-2xl font-bold text-text-primary">
                {trials.filter(t => t.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <FlaskConical className="text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-text-primary-secondary text-sm">决策通过率</p>
              <p className="text-2xl font-bold text-text-primary">
                {trials.filter(t => t.status === 'completed' && t.conclusion).length > 0
                  ? Math.round(
                      (trials.filter(t => 
                        t.status === 'completed' && 
                        t.conclusion && 
                        (t.conclusion.decision === 'approve' || t.conclusion.decision === 'modify_then_approve')
                      ).length / 
                      trials.filter(t => t.status === 'completed' && t.conclusion).length) * 100
                    )
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-border">
        {statusTabs.map((tab) => (
          <button
            key={tab.key || 'all'}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-accent text-accent'
                : 'border-transparent text-text-primary-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Trial List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
        </div>
      ) : trials.length === 0 ? (
        <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
          <FlaskConical className="w-12 h-12 text-text-primary-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">暂无试卖记录</h3>
          <p className="text-text-primary-secondary mb-6">创建第一个试卖计划，开启新品决策流程</p>
          <Link
            href="/trial/new/plan"
            className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
          >
            <Plus size={18} />
            <span>创建试卖</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {trials.map((trial) => {
            const progress = getTrialProgress(trial);
            return (
              <div
                key={trial.id}
                className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-text-primary">{trial.productName}</h3>
                      {getStatusBadge(trial.status)}
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-text-primary-secondary">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>{formatDate(trial.startDate)} ~ {formatDate(trial.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Store size={14} />
                        <span>{trial.storeIds?.length || 0}家门店</span>
                      </div>
                      {trial.storeTypes?.length > 0 && (
                        <div className="flex items-center gap-1">
                          {trial.storeTypes.slice(0, 3).map((type, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-dark-bg rounded text-xs">
                              {StoreTypeLabel[type as keyof typeof StoreTypeLabel]}
                            </span>
                          ))}
                          {trial.storeTypes.length > 3 && (
                            <span className="text-xs">+{trial.storeTypes.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                
                  <div className="flex items-center gap-4">
                    {/* Progress */}
                    {trial.status === 'executing' && (
                      <div className="text-right">
                        <p className="text-xs text-text-primary-secondary mb-1">
                          第{progress.current}天/共{progress.total}天
                        </p>
                        <div className="w-24 h-2 bg-dark-bg rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <Link
                      href={`/trial/${trial.id}/${
                        trial.status === 'planning' || trial.status === 'preparing' ? 'plan' :
                        trial.status === 'executing' ? 'execute' :
                        'review'
                      }`}
                      className="flex items-center gap-1 text-accent hover:text-accent-dark text-sm font-medium"
                    >
                      {trial.status === 'planning' ? '编辑' : '查看'}
                      <ArrowRight size={14} />
                    </Link>
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