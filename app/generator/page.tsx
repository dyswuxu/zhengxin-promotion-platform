'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ChevronRight,
  Loader2,
  Copy,
  RefreshCw,
  CheckCircle2,
  FileText,
  Clock,
  Store,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';

const categories = ['鸡排', '小吃', '饮品', '套餐'];
const regions = ['全国', '华东', '华南', '华北', '华中', '西南', '西北', '东北'];

export default function GeneratorPage() {
  const router = useRouter();
  const [step, setStep] = useState<'input' | 'generating' | 'result'>('input');
  const [formData, setFormData] = useState({
    name: '',
    category: '鸡排',
    price: '',
    cost: '',
    targetUser: '',
    sellingPoints: '',
    launchDate: '',
    region: '全国',
  });
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.cost) {
      alert('请填写必填项：产品名称、售价、成本');
      return;
    }

    setStep('generating');
    setProgress(0);

    // Simulate generation progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 300);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (data.success) {
        setGeneratedPlan(data.plan);
        setStep('result');
      } else {
        alert('生成失败，请重试');
        setStep('input');
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('生成失败，请重试');
      setStep('input');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板');
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">AI推广标准包生成器</h1>
        <p className="text-muted mt-1">输入产品信息，AI自动生成完整的推广方案</p>
      </div>

      {step === 'input' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product info card */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold text-text mb-6 flex items-center gap-2">
              <FileText size={18} className="text-accent" />
              产品基本信息
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  产品名称 <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="如：韩式炸鸡、藤椒鸡排"
                  className="w-full h-10 px-4 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">产品类别</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full h-10 px-4 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  售价（元） <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="如：18"
                  className="w-full h-10 px-4 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  成本（元） <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  placeholder="如：8"
                  className="w-full h-10 px-4 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">目标人群</label>
                <input
                  type="text"
                  name="targetUser"
                  value={formData.targetUser}
                  onChange={handleInputChange}
                  placeholder="如：18-30岁年轻白领、学生群体"
                  className="w-full h-10 px-4 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">推广区域</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full h-10 px-4 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                >
                  {regions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-text mb-2">核心卖点</label>
                <textarea
                  name="sellingPoints"
                  value={formData.sellingPoints}
                  onChange={handleInputChange}
                  placeholder="输入产品核心卖点，每行一个，如：独家酱料、酥脆多汁、健康轻食"
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">上市时间</label>
                <input
                  type="date"
                  name="launchDate"
                  value={formData.launchDate}
                  onChange={handleInputChange}
                  className="w-full h-10 px-4 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors btn-press flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            开始生成推广方案
            <ChevronRight size={18} />
          </button>
        </form>
      )}

      {step === 'generating' && (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 size={32} className="text-accent animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-text mb-2">AI正在生成推广方案</h2>
          <p className="text-muted mb-6">正在分析产品信息，构建推广策略...</p>

          <div className="max-w-md mx-auto">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted mt-2">{progress}%</p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-left">
            {[
              { icon: FileText, text: '分析产品定位' },
              { icon: TrendingUp, text: '制定推广策略' },
              { icon: Store, text: '生成门店SOP' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${progress > i * 30 ? 'opacity-100' : 'opacity-40'}`}>
                <item.icon size={18} className="text-accent" />
                <span className="text-sm">{item.text}</span>
                {progress > i * 30 && <CheckCircle2 size={16} className="text-success ml-auto" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'result' && generatedPlan && (
        <div className="space-y-6">
          {/* Success header */}
          <div className="bg-success/10 border border-success/20 rounded-xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                <CheckCircle2 size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text">推广方案已生成</h2>
                <p className="text-sm text-muted">AI已为「{formData.name}」生成完整的推广标准包</p>
              </div>
            </div>
            <button
              onClick={() => {
                setStep('input');
                setGeneratedPlan(null);
              }}
              className="flex items-center gap-2 text-sm text-accent hover:underline"
            >
              <RefreshCw size={16} />
              重新生成
            </button>
          </div>

          {/* Score section */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-border p-6 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-accent">{generatedPlan.score.popularity}</span>
              </div>
              <p className="text-sm text-muted">受欢迎指数</p>
            </div>
            <div className="bg-white rounded-xl border border-border p-6 text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-success">{generatedPlan.score.repurchase}</span>
              </div>
              <p className="text-sm text-muted">复购潜力</p>
            </div>
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={20} className="text-warning" />
                <span className="font-medium">风险提示</span>
              </div>
              <p className="text-sm text-muted">{generatedPlan.score.riskAlert}</p>
            </div>
          </div>

          {/* Positioning */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-text mb-4">爆品定位策略</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-muted mb-2">一句话定位</p>
                <p className="text-sm font-medium">{generatedPlan.positioning}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-muted mb-2">消费场景</p>
                <p className="text-sm font-medium">{generatedPlan.consumerScene}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-muted mb-2">核心购买理由</p>
                <p className="text-sm font-medium">{generatedPlan.purchaseReason}</p>
              </div>
            </div>
          </div>

          {/* Selling points */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text">传播卖点拆解</h3>
              <button
                onClick={() => handleCopy(generatedPlan.sellingPoints.join('\n'))}
                className="flex items-center gap-1 text-xs text-muted hover:text-text"
              >
                <Copy size={14} />
                复制
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {generatedPlan.sellingPoints.map((point: string, i: number) => (
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
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
              <Clock size={18} className="text-accent" />
              推广节奏建议
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {generatedPlan.promotionPhases.map((phase: any, i: number) => (
                <div key={i} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">{phase.name}</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {phase.period}
                    </span>
                  </div>
                  <p className="text-xs text-muted mb-3">{phase.description}</p>
                  <ul className="space-y-1">
                    {phase.actions.map((action: string, j: number) => (
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
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
              <Store size={18} className="text-accent" />
              门店执行SOP
            </h3>
            <div className="space-y-4">
              {generatedPlan.storeSop.map((sop: any, i: number) => (
                <div key={i} className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{sop.title}</h4>
                  <ul className="space-y-2">
                    {sop.content.map((item: string, j: number) => (
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
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-accent" />
              营销物料清单
            </h3>
            <div className="space-y-4">
              {generatedPlan.marketingAssets.map((asset: any, i: number) => (
                <div key={i} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{asset.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-muted px-2 py-0.5 rounded">
                        {asset.type}
                      </span>
                      <button
                        onClick={() => handleCopy(asset.content)}
                        className="text-xs text-muted hover:text-text flex items-center gap-1"
                      >
                        <Copy size={12} />
                        复制
                      </button>
                    </div>
                  </div>
                  <pre className="text-sm text-muted whitespace-pre-wrap bg-gray-50 p-3 rounded">
                    {asset.content}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-3 border border-border rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              查看所有新品
            </button>
            <button
              onClick={() => {
                // Save product and redirect
                router.push('/products');
              }}
              className="px-6 py-3 bg-accent text-white rounded-lg text-sm hover:bg-accent-dark transition-colors btn-press"
            >
              保存并发布
            </button>
          </div>
        </div>
      )}
    </div>
  );
}