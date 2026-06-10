'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Store, CheckCircle2 } from 'lucide-react';
import { TrialPlan, StoreType, StoreTypeLabel } from '@/types';
import { formatDate } from '@/lib/utils';

interface Store {
  id: string;
  name: string;
  region: string;
  district: string;
  type?: StoreType;
}

export default function TrialPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [trial, setTrial] = useState<TrialPlan | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    setLoading(true);
    try {
      const [trialRes, storesRes] = await Promise.all([
        fetch(`/api/trial/${id}`),
        fetch('/api/stores'),
      ]);
      
      const trialData = await trialRes.json();
      const storesData = await storesRes.json();
      
      setTrial(trialData);
      setStores(Array.isArray(storesData) ? storesData : storesData.stores || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !trial) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/trial"
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border hover:bg-dark-bg transition-colors"
        >
          <ArrowLeft size={18} className="text-text-primary" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{trial.productName}</h1>
          <p className="text-text-primary-secondary">试卖计划详情</p>
        </div>
      </div>

      {/* Plan Details */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-text-primary mb-4">计划信息</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-text-primary-secondary">试卖周期</p>
              <p className="font-medium text-text-primary">
                {formatDate(trial.startDate)} ~ {formatDate(trial.endDate)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Store size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-primary-secondary">门店数量</p>
              <p className="font-medium text-text-primary">{trial.storeIds?.length || 0}家</p>
            </div>
          </div>
        </div>
      </div>

      {/* Store List */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-text-primary mb-4">试卖门店</h2>
        
        {/* Store Type Legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          {(Object.keys(StoreTypeLabel) as StoreType[]).map((type) => (
            <div key={type} className="flex items-center gap-2 px-3 py-1 bg-dark-bg rounded-lg text-xs">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-text-primary-secondary">{StoreTypeLabel[type]}</span>
            </div>
          ))}
        </div>

        {/* Stores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {trial.storeIds?.map((storeId: string) => {
            const store = stores.find(s => s.id === storeId);
            const storeType = trial.storeTypes?.[trial.storeIds.indexOf(storeId)] || 'community';
            
            return (
              <div key={storeId} className="p-3 rounded-lg border border-dark-border bg-dark-bg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-text-primary text-sm">{storeId}</p>
                    <p className="text-xs text-text-primary-secondary">
                      {StoreTypeLabel[storeType as StoreType] || '社区门店'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4">
        <Link
          href="/trial"
          className="px-6 py-2 border border-dark-border rounded-lg hover:bg-dark-bg transition-colors text-text-primary"
        >
          返回列表
        </Link>
        <Link
          href={`/trial/${id}/execute`}
          className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
        >
          开始执行
        </Link>
      </div>
    </div>
  );
}