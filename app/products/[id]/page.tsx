'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  ListTodo,
  BarChart3,
  RefreshCw,
  FileText,
  Store,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Product, PromotionPlan, Task, ProductStatusLabel } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';

type TabKey = 'plan' | 'tasks' | 'analytics' | 'review';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [plan, setPlan] = useState<PromotionPlan | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('plan');

  useEffect(() => {
    if (params.id) {
      fetchProductData(params.id as string);
    }
  }, [params.id]);

  async function fetchProductData(id: string) {
    setLoading(true);
    try {
      const [productRes, planRes, tasksRes] = await Promise.all([
        fetch(`/api/products/${id}`),
        fetch(`/api/products/${id}/plan`),
        fetch(`/api/tasks?productId=${id}`),
      ]);

      const productData = await productRes.json();
      const planData = await planRes.json();
      const tasksData = await tasksRes.json();

      setProduct(productData.product);
      setPlan(planData.plan);
      setTasks(tasksData.tasks || []);
    } catch (error) {
      console.error('Failed to fetch product data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-32 rounded" />
        <div className="skeleton h-64 w-full rounded-xl" />
        <div className="skeleton h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">新品不存在</p>
        <Link href="/products" className="text-accent hover:underline mt-2 inline-block">
          返回新品中心
        </Link>
      </div>
    );
  }

  const tabs: Array<{ key: TabKey; label: string; icon: React.ElementType }> = [
    { key: 'plan', label: 'AI推广方案', icon: Sparkles },
    { key: 'tasks', label: '执行任务', icon: ListTodo },
    { key: 'analytics', label: '数据表现', icon: BarChart3 },
    { key: 'review', label: '复盘', icon: RefreshCw },
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-muted hover:text-text transition-colors"
      >
        <ArrowLeft size={18} />
        <span>返回新品中心</span>
      </Link>

      {/* Product header */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-text">{product.name}</h1>
              <span className={`text-xs px-2 py-1 rounded-full ${
                product.status === 'promoting' ? 'bg-orange-100 text-orange-600' :
                product.status === 'exploding' ? 'bg-green-100 text-green-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {ProductStatusLabel[product.status]}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span>{product.category}</span>
              <span>·</span>
              <span>{formatCurrency(product.price)}</span>
              <span>·</span>
              <span>毛利率 {product.grossMargin.toFixed(1)}%</span>
            </div>
          </div>
          <Link
            href="/generator"
            className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors btn-press"
          >
            <Sparkles size={18} />
            <span>重新生成方案</span>
          </Link>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div>
            <p className="text-xs text-muted mb-1">目标人群</p>
            <p className="text-sm font-medium">{product.targetUser || '全部人群'}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">上市时间</p>
            <p className="text-sm font-medium">{formatDate(product.launchDate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">推广区域</p>
            <p className="text-sm font-medium">{product.region}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">任务进度</p>
            <p className="text-sm font-medium">
              {tasks.filter(t => t.status === 'completed').length}/{tasks.length} 已完成
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-border">
        <div className="flex border-b border-border">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === tab.key
                  ? 'text-accent'
                  : 'text-muted hover:text-text'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'plan' && <PromotionPlanTab plan={plan} />}
          {activeTab === 'tasks' && <TasksTab tasks={tasks} />}
          {activeTab === 'analytics' && <AnalyticsTab productId={product.id} />}
          {activeTab === 'review' && <ReviewTab product={product} plan={plan} />}
        </div>
      </div>
    </div>
  );
}

// Promotion Plan Tab
function PromotionPlanTab({ plan }: { plan: PromotionPlan | null }) {
  if (!plan) {
    return (
      <div className="text-center py-12">
        <Sparkles className="mx-auto text-muted mb-4" size={48} />
        <h3 className="font-medium text-text mb-2">暂无推广方案</h3>
        <p className="text-sm text-muted mb-4">AI将根据产品信息生成完整的推广方案</p>
        <Link
          href="/generator"
          className="inline-flex items-center gap-2 text-accent hover:underline"
        >
          <Sparkles size={16} />
          生成推广方案
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Score */}
      <div className="flex items-center gap-8">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-2 mx-auto">
            <span className="text-3xl font-bold text-accent">{plan.score.popularity}</span>
          </div>
          <p className="text-xs text-muted">受欢迎指数</p>
        </div>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-2 mx-auto">
            <span className="text-3xl font-bold text-success">{plan.score.repurchase}</span>
          </div>
          <p className="text-xs text-muted">复购潜力</p>
        </div>
        <div className="flex-1 bg-warning/10 rounded-lg p-4">
          <p className="text-sm font-medium text-warning mb-1">风险提示</p>
          <p className="text-sm text-text">{plan.score.riskAlert}</p>
        </div>
      </div>

      {/* Positioning */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-muted mb-2">一句话定位</p>
          <p className="text-sm font-medium">{plan.positioning}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-muted mb-2">消费场景</p>
          <p className="text-sm font-medium">{plan.consumerScene}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-muted mb-2">核心购买理由</p>
          <p className="text-sm font-medium">{plan.purchaseReason}</p>
        </div>
      </div>

      {/* Selling points */}
      <div>
        <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
          <FileText size={18} className="text-accent" />
          传播卖点拆解
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {plan.sellingPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
              <span className="w-6 h-6 bg-accent/10 text-accent rounded-full flex items-center justify-center text-xs flex-shrink-0">
                {i + 1}
              </span>
              <p className="text-sm">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Promotion phases */}
      <div>
        <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
          <Clock size={18} className="text-accent" />
          推广节奏
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {plan.promotionPhases.map((phase, i) => (
            <div key={i} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">{phase.name}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  {phase.period}
                </span>
              </div>
              <p className="text-xs text-muted mb-3">{phase.description}</p>
              <ul className="space-y-1">
                {phase.actions.map((action, j) => (
                  <li key={j} className="text-xs text-muted flex items-start gap-2">
                    <span className="text-accent">•</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Store SOP */}
      <div>
        <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
          <Store size={18} className="text-accent" />
          门店执行SOP
        </h3>
        <div className="space-y-4">
          {plan.storeSop.map((sop, i) => (
            <div key={i} className="border border-border rounded-lg p-4">
              <h4 className="font-medium mb-2">{sop.title}</h4>
              <ul className="space-y-2">
                {sop.content.map((item, j) => (
                  <li key={j} className="text-sm text-muted flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-success mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Marketing assets */}
      <div>
        <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
          <FileText size={18} className="text-accent" />
          营销物料清单
        </h3>
        <div className="space-y-4">
          {plan.marketingAssets.map((asset, i) => (
            <div key={i} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{asset.title}</span>
                <span className="text-xs bg-gray-100 text-muted px-2 py-0.5 rounded">
                  {asset.type}
                </span>
              </div>
              <pre className="text-sm text-muted whitespace-pre-wrap bg-gray-50 p-3 rounded">
                {asset.content}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Tasks Tab
function TasksTab({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState<string>('all');

  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(t => t.status === filter);

  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-600',
    in_progress: 'bg-blue-100 text-blue-600',
    completed: 'bg-green-100 text-green-600',
    delayed: 'bg-yellow-100 text-yellow-600',
    abnormal: 'bg-red-100 text-red-600',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock size={14} />,
    in_progress: <Clock size={14} />,
    completed: <CheckCircle2 size={14} />,
    delayed: <AlertTriangle size={14} />,
    abnormal: <AlertTriangle size={14} />,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {['all', 'pending', 'in_progress', 'completed', 'delayed', 'abnormal'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-muted hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? '全部' : status === 'pending' ? '未开始' :
             status === 'in_progress' ? '进行中' : status === 'completed' ? '已完成' :
             status === 'delayed' ? '延迟' : '异常'}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <ListTodo className="mx-auto text-muted mb-4" size={48} />
          <p className="text-muted">暂无任务</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                statusColors[task.status]
              }`}>
                {statusIcons[task.status]}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{task.description}</p>
                <p className="text-xs text-muted">{task.storeName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">截止 {formatDate(task.deadline)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Analytics Tab
function AnalyticsTab({ productId }: { productId: string }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/analytics?productId=${productId}`)
      .then(res => res.json())
      .then(res => setData(res.data || []));
  }, [productId]);

  // Mock data for visualization
  const chartData = data.length > 0 ? data : [
    { date: '05-15', sales: 1200 },
    { date: '05-16', sales: 1800 },
    { date: '05-17', sales: 1500 },
    { date: '05-18', sales: 2200 },
    { date: '05-19', sales: 2800 },
    { date: '05-20', sales: 3200 },
    { date: '05-21', sales: 2900 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-muted mb-1">累计销量</p>
          <p className="text-2xl font-bold">15,600</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-muted mb-1">转化率</p>
          <p className="text-2xl font-bold">8.5%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-muted mb-1">客单价</p>
          <p className="text-2xl font-bold">¥32.5</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-muted mb-1">毛利率</p>
          <p className="text-2xl font-bold">58.2%</p>
        </div>
      </div>

      {/* Chart */}
      <div className="border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-4">销量趋势</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#FF6B35"
                strokeWidth={2}
                dot={{ fill: '#FF6B35', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Review Tab
function ReviewTab({ product, plan }: { product: Product; plan: PromotionPlan | null }) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <RefreshCw className="mx-auto text-muted mb-4" size={48} />
        <h3 className="font-medium text-text mb-2">复盘功能</h3>
        <p className="text-sm text-muted">
          {product.status === 'review' || product.status === 'ended'
            ? '新品已结束推广，可以进行复盘总结'
            : '新品仍在推广中，复盘功能将在推广结束后开放'}
        </p>
      </div>

      {plan && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold mb-4">AI优化建议</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-success">✓</span>
              <p className="text-sm">本次推广方案评分{plan.score.popularity}分，建议保持现有卖点</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-success">✓</span>
              <p className="text-sm">预热期执行效果良好，下次可提前3天开始预热</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-warning">!</span>
              <p className="text-sm">上新期转化率有提升空间，建议优化产品定价</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}