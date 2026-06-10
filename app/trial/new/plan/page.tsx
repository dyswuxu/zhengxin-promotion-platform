'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Store, CheckCircle2, AlertCircle } from 'lucide-react';
import { Product, StoreType, StoreTypeLabel } from '@/types';

interface Store {
  id: string;
  name: string;
  region: string;
  district: string;
  type?: StoreType;
}

export default function NewTrialPlanPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [storeTypes, setStoreTypes] = useState<Record<string, StoreType>>({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [productsRes, storesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/stores'),
      ]);
      const productsData = await productsRes.json();
      const storesData = await storesRes.json();
      
      setProducts(productsData.products || productsData || []);
      setStores(Array.isArray(storesData) ? storesData : storesData.stores || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateEndDate(start: string): string {
    if (!start) return '';
    const date = new Date(start);
    date.setDate(date.getDate() + 6); // 7 days total (start + 6 more)
    return date.toISOString().split('T')[0];
  }

  function getStoresByType(type: StoreType): Store[] {
    return stores.filter(s => storeTypes[s.id] === type);
  }

  function assignStoreTypes() {
    const types: Record<string, StoreType> = {};
    const groupedStores: Record<StoreType, Store[]> = {
      school: [],
      business: [],
      community: [],
      delivery: [],
      night_market: [],
    };
    
    // Auto-assign based on store name or district keywords
    stores.forEach(store => {
      const name = store.name.toLowerCase();
      const district = store.district?.toLowerCase() || '';
      
      if (name.includes('学校') || name.includes('校区') || district.includes('学校')) {
        groupedStores.school.push(store);
      } else if (name.includes('商圈') || name.includes('广场') || name.includes('万达')) {
        groupedStores.business.push(store);
      } else if (name.includes('社区') || name.includes('小区')) {
        groupedStores.community.push(store);
      } else if (name.includes('外卖') || name.includes('线上')) {
        groupedStores.delivery.push(store);
      } else if (name.includes('夜宵') || name.includes('宵夜')) {
        groupedStores.night_market.push(store);
      } else {
        // Default assignment for unclassified stores
        groupedStores.community.push(store);
      }
    });
    
    // Assign types to selected stores
    selectedStores.forEach(storeId => {
      const store = stores.find(s => s.id === storeId);
      if (!store) return;
      
      const name = store.name.toLowerCase();
      const district = store.district?.toLowerCase() || '';
      
      if (name.includes('学校') || name.includes('校区') || district.includes('学校')) {
        types[storeId] = 'school';
      } else if (name.includes('商圈') || name.includes('广场') || name.includes('万达')) {
        types[storeId] = 'business';
      } else if (name.includes('社区') || name.includes('小区')) {
        types[storeId] = 'community';
      } else if (name.includes('外卖') || name.includes('线上')) {
        types[storeId] = 'delivery';
      } else if (name.includes('夜宵') || name.includes('宵夜')) {
        types[storeId] = 'night_market';
      } else {
        types[storeId] = 'community';
      }
    });
    
    setStoreTypes(types);
  }

  function toggleStore(storeId: string) {
    setSelectedStores(prev => {
      if (prev.includes(storeId)) {
        return prev.filter(id => id !== storeId);
      }
      if (prev.length >= 15) {
        alert('最多选择15家门店');
        return prev;
      }
      return [...prev, storeId];
    });
  }

  async function handleSubmit() {
    if (!selectedProduct) {
      alert('请选择试卖产品');
      return;
    }
    if (!startDate) {
      alert('请选择开始日期');
      return;
    }
    if (selectedStores.length < 8) {
      alert('请至少选择8家门店');
      return;
    }

    setSubmitting(true);
    try {
      assignStoreTypes();
      
      const endDate = calculateEndDate(startDate);
      const types = Object.values(storeTypes);
      
      const res = await fetch('/api/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct,
          startDate,
          endDate,
          storeIds: selectedStores,
          storeTypes: types,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        router.push(`/trial/${data.id}/execute`);
      } else {
        const error = await res.json();
        alert('创建失败: ' + (error.error || '未知错误'));
      }
    } catch (error) {
      console.error('Failed to create trial:', error);
      alert('创建失败');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
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
          <h1 className="text-2xl font-bold text-text-primary">创建试卖计划</h1>
          <p className="text-text-primary-secondary mt-1">选择产品和门店，设定7天试卖周期</p>
        </div>
      </div>

      {/* Product Selection */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <Store size={18} className="text-accent" />
          选择试卖产品
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.length === 0 ? (
            <p className="text-text-primary-secondary col-span-2">
              暂无产品，请先在新品中心创建产品
            </p>
          ) : (
            products.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product.id)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedProduct === product.id
                    ? 'border-accent bg-accent/10'
                    : 'border-dark-border hover:border-accent/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedProduct === product.id
                      ? 'border-accent bg-accent'
                      : 'border-dark-border'
                  }`}>
                    {selectedProduct === product.id && (
                      <CheckCircle2 size={14} className="text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{product.name}</p>
                    <p className="text-sm text-text-primary-secondary">
                      {product.category} · ¥{product.price}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Date Selection */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-accent" />
          设定试卖周期
        </h2>
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm text-text-primary-secondary mb-2">开始日期</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
            />
          </div>
          <div className="text-text-primary-secondary text-2xl">→</div>
          <div>
            <label className="block text-sm text-text-primary-secondary mb-2">结束日期</label>
            <input
              type="date"
              value={calculateEndDate(startDate)}
              readOnly
              className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary opacity-60"
            />
          </div>
          <div className="px-4 py-2 bg-accent/10 rounded-lg">
            <span className="text-accent font-bold">7天</span>
          </div>
        </div>
      </div>

      {/* Store Selection */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Store size={18} className="text-accent" />
            选择试卖门店
          </h2>
          <div className="text-sm text-text-primary-secondary">
            已选择 <span className="text-accent font-bold">{selectedStores.length}</span> 家（需至少8家）
          </div>
        </div>
        
        {selectedStores.length > 0 && selectedStores.length < 8 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-warning/10 rounded-lg">
            <AlertCircle size={16} className="text-warning" />
            <span className="text-sm text-warning">必须至少选择8家门店才能创建试卖</span>
          </div>
        )}

        {/* Store Type Legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          {(Object.keys(StoreTypeLabel) as StoreType[]).map((type) => (
            <div key={type} className="flex items-center gap-2 px-3 py-1 bg-dark-bg rounded-lg text-xs">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-text-primary-secondary">{StoreTypeLabel[type]}</span>
            </div>
          ))}
        </div>

        {/* Store List by Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => toggleStore(store.id)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedStores.includes(store.id)
                  ? 'border-accent bg-accent/10'
                  : 'border-dark-border hover:border-accent/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedStores.includes(store.id)
                    ? 'border-accent bg-accent'
                    : 'border-dark-border'
                }`}>
                  {selectedStores.includes(store.id) && (
                    <CheckCircle2 size={14} className="text-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-text-primary text-sm truncate">{store.name}</p>
                  <p className="text-xs text-text-primary-secondary">{store.region} {store.district}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {stores.length === 0 && (
          <p className="text-center text-text-primary-secondary py-8">
            暂无门店数据，请先在门店管理中导入门店
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4">
        <Link
          href="/trial"
          className="px-6 py-2 border border-dark-border rounded-lg hover:bg-dark-bg transition-colors text-text-primary"
        >
          取消
        </Link>
        <button
          onClick={handleSubmit}
          disabled={submitting || !selectedProduct || !startDate || selectedStores.length < 8}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            submitting || !selectedProduct || !startDate || selectedStores.length < 8
              ? 'bg-dark-bg text-text-primary-secondary cursor-not-allowed'
              : 'bg-accent text-white hover:bg-accent-dark'
          }`}
        >
          {submitting ? '创建中...' : '创建试卖并开始执行'}
        </button>
      </div>
    </div>
  );
}