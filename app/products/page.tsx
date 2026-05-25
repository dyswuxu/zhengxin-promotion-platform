'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';
import { Product, ProductStatus, ProductStatusLabel } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';

const statusTabs: Array<{ key: string | null; label: string }> = [
  { key: null, label: '全部' },
  { key: 'promoting', label: '推广中' },
  { key: 'exploding', label: '爆发' },
  { key: 'review', label: '复盘' },
  { key: 'draft', label: '草稿' },
  { key: 'ended', label: '已结束' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const url = activeTab
        ? `/api/products?status=${activeTab}`
        : '/api/products';
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">新品中心</h1>
          <p className="text-muted mt-1">管理所有新品推广项目</p>
        </div>
        <Link
          href="/generator"
          className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors btn-press"
        >
          <Plus size={18} />
          <span>新建新品</span>
        </Link>
        <button
          onClick={() => window.location.href = '/api/export-products'}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <Download size={18} />
          导出
        </button>
        <label className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors text-sm cursor-pointer">
          <Upload size={18} />
          导入
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const formData = new FormData();
              formData.append('file', file);
              const res = await fetch('/api/products/import', { method: 'POST', body: formData });
              const data = await res.json();
              if (data.success) {
                alert(`成功导入 ${data.count} 条新品`);
                fetchProducts();
              } else {
                alert('导入失败: ' + (data.error || '未知错误'));
              }
              e.target.value = '';
            }}
          />
        </label>
        <button
          onClick={() => window.location.href = '/api/products/import?type=template'}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <Download size={18} />
          下载模板
        </button>
      </div>

      {/* Tabs and filters */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Status tabs */}
          <div className="flex items-center gap-1">
            {statusTabs.map(tab => (
              <button
                key={tab.key ?? 'all'}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors relative ${
                  activeTab === tab.key
                    ? 'text-accent font-medium bg-accent/5'
                    : 'text-muted hover:text-text hover:bg-gray-50'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input
              type="text"
              placeholder="搜索新品..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-9 pl-9 pr-4 border border-border rounded-lg text-sm focus:outline-none focus:border-accent w-64"
            />
          </div>
        </div>
      </div>

      {/* Products list */}
      <div className="space-y-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl border border-border p-6">
                <div className="skeleton h-4 w-24 mb-3 rounded" />
                <div className="skeleton h-6 w-40 mb-2 rounded" />
                <div className="skeleton h-4 w-full mb-4 rounded" />
                <div className="flex gap-4">
                  <div className="skeleton h-4 w-20 rounded" />
                  <div className="skeleton h-4 w-20 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="text-muted" size={24} />
            </div>
            <h3 className="font-medium text-text mb-2">暂无新品</h3>
            <p className="text-muted text-sm mb-4">创建您的第一个新品开始推广</p>
            <Link
              href="/generator"
              className="inline-flex items-center gap-2 text-accent hover:underline"
            >
              <Plus size={16} />
              新建新品
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const statusColor: Record<ProductStatus, string> = {
    draft: 'bg-gray-100 text-gray-600',
    not_started: 'bg-blue-100 text-blue-600',
    promoting: 'bg-orange-100 text-orange-600',
    exploding: 'bg-green-100 text-green-600',
    review: 'bg-yellow-100 text-yellow-600',
    ended: 'bg-gray-100 text-gray-500',
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="bg-white rounded-xl border border-border p-6 card-hover block"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs px-2 py-1 rounded-full ${statusColor[product.status]}`}>
          {ProductStatusLabel[product.status]}
        </span>
        <span className="text-xs text-muted">{product.category}</span>
      </div>

      <h3 className="font-semibold text-text mb-2">{product.name}</h3>

      <div className="flex items-center gap-4 text-sm text-muted mb-4">
        <span>{formatCurrency(product.price)}</span>
        <span>·</span>
        <span>毛利率 {product.grossMargin.toFixed(1)}%</span>
      </div>

      <div className="flex items-center justify-between text-xs text-muted pt-4 border-t border-border">
        <span>上市：{formatDate(product.launchDate)}</span>
        <span>{product.region}</span>
      </div>
    </Link>
  );
}