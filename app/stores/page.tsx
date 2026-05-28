'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Store,
  Upload,
  Download,
  Search,
  MapPin,
  Phone,
  User,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface Store {
  id: string;
  name: string;
  region: string;
  city: string;
  district: string;
  address: string;
  manager_name: string;
  manager_phone: string;
  status: string;
  created_at: string;
}

export default function StoresPage() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');

  useEffect(() => {
    fetchStores();
  }, []);

  async function fetchStores() {
    setLoading(true);
    try {
      const res = await fetch('/api/stores');
      const data = await res.json();
      setStores(data.stores || []);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredStores = stores.filter(s => {
    if (regionFilter !== 'all' && s.region !== regionFilter) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !s.district?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !s.manager_name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const regions = Array.from(new Set(stores.map(s => s.region))).sort();

  const handleImport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setImporting(true);
    setImportStatus(null);

    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    if (!file) {
      setImportStatus('error');
      setMessage('请选择文件');
      setImporting(false);
      return;
    }

    try {
      const response = await fetch('/api/stores/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setImportStatus('success');
        setMessage(`成功导入 ${result.count} 家门店`);
        fetchStores();
      } else {
        setImportStatus('error');
        setMessage(result.error || '导入失败');
      }
    } catch (error) {
      setImportStatus('error');
      setMessage('导入失败，请重试');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">门店管理</h1>
          <p className="text-text-primary-secondary mt-1">管理所有门店信息，共 {stores.length} 家门店</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/api/stores/template')}
            className="flex items-center gap-2 px-4 py-2 border border-dark-border rounded-lg hover:bg-dark-bg transition-colors text-sm"
          >
            <Download size={18} />
            下载模板
          </button>
          <button
            onClick={() => window.location.href = '/api/stores/export'}
            className="flex items-center gap-2 px-4 py-2 border border-dark-border rounded-lg hover:bg-dark-bg transition-colors text-sm"
          >
            <Download size={18} />
            导出门店
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Import Section */}
        <div className="lg:col-span-1">
          <div className="bg-dark-card rounded-xl border border-dark-border p-6 sticky top-6">
            <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Upload size={18} className="text-accent" />
              批量导入
            </h2>

            <form onSubmit={handleImport} className="space-y-4">
              <div className="border-2 border-dashed border-dark-border rounded-lg p-6 text-center hover:border-accent transition-colors">
                <FileSpreadsheet className="mx-auto text-text-primary-secondary mb-3" size={36} />
                <p className="text-sm text-text-primary-secondary mb-2">点击选择Excel文件</p>
                <p className="text-xs text-text-primary-secondary">支持 .xlsx, .xls 格式</p>
                <input
                  type="file"
                  name="file"
                  accept=".xlsx,.xls"
                  className="mt-3 w-full"
                />
              </div>

              <button
                type="submit"
                disabled={importing}
                className="w-full h-11 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors btn-press disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {importing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    导入中...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    开始导入
                  </>
                )}
              </button>
            </form>

            {importStatus && (
              <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
                importStatus === 'success' ? 'bg-battle-green/20 text-battle-green' : 'bg-red-500/20 text-red-400'
              }`}>
                {importStatus === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span className="text-sm">{message}</span>
              </div>
            )}

            {/* Import Tips */}
            <div className="mt-6 p-4 bg-dark-bg rounded-lg">
              <h3 className="text-sm font-medium text-text-primary mb-2">导入说明</h3>
              <ul className="text-xs text-text-primary-secondary space-y-1">
                <li>• 第一行为表头，请勿修改</li>
                <li>• 必填字段：门店名称、所在区域</li>
                <li>• 可选字段：城市、区县、地址、店长姓名、联系电话</li>
                <li>• 区域统一填写：华东、华南、华北、华中、西南、西北、东北</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stores List */}
        <div className="lg:col-span-2">
          <div className="bg-dark-card rounded-xl border border-dark-border p-6">
            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary-secondary" size={16} />
                <input
                  type="text"
                  placeholder="搜索门店名称、区县、店长..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 border border-dark-border rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <select
                value={regionFilter}
                onChange={e => setRegionFilter(e.target.value)}
                className="h-10 px-3 border border-dark-border rounded-lg text-sm focus:outline-none focus:border-accent"
              >
                <option value="all">全部区域</option>
                {regions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-battle-blue/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-primary">{stores.length}</p>
                <p className="text-xs text-text-primary-secondary">门店总数</p>
              </div>
              <div className="bg-battle-green/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-success">
                  {stores.filter(s => s.status === 'active').length}
                </p>
                <p className="text-xs text-text-primary-secondary">活跃门店</p>
              </div>
              <div className="bg-battle-orange/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-accent">{regions.length}</p>
                <p className="text-xs text-text-primary-secondary">覆盖区域</p>
              </div>
            </div>

            {/* List */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="border border-dark-border rounded-lg p-4">
                    <div className="skeleton h-5 w-40 mb-2 rounded" />
                    <div className="skeleton h-4 w-full rounded" />
                  </div>
                ))}
              </div>
            ) : filteredStores.length === 0 ? (
              <div className="text-center py-12">
                <Store className="mx-auto text-text-primary-secondary mb-4" size={48} />
                <p className="text-text-primary-secondary">暂无门店数据</p>
                <p className="text-xs text-text-primary-secondary mt-1">请先导入门店数据</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredStores.map(store => (
                  <div
                    key={store.id}
                    className="border border-dark-border rounded-lg p-4 hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Store size={18} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-text-primary">{store.name}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-text-primary-secondary">
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {store.region} {store.district || ''}
                            </span>
                            {store.manager_name && (
                              <span className="flex items-center gap-1">
                                <User size={14} />
                                {store.manager_name}
                              </span>
                            )}
                            {store.manager_phone && (
                              <span className="flex items-center gap-1">
                                <Phone size={14} />
                                {store.manager_phone}
                              </span>
                            )}
                          </div>
                          {store.address && (
                            <p className="text-xs text-text-primary-secondary mt-1">{store.address}</p>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        store.status === 'active'
                          ? 'bg-battle-green/20 text-battle-green'
                          : 'bg-dark-border text-text-primary-secondary'
                      }`}>
                        {store.status === 'active' ? '活跃' : store.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}