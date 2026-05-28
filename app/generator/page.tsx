'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Target,
  Store,
  Megaphone,
  Swords,
  BarChart3,
  Package,
  Image,
  Video,
  Music,
  FileText,
  Play,
  RefreshCw,
  Send,
  Rocket,
  MessageSquare,
} from 'lucide-react';

// Step configuration
const steps = [
  { key: 'input', label: '新品情报', icon: Target },
  { key: 'packages', label: '战略礼包', icon: Package },
  { key: 'preview', label: '内容预览', icon: Megaphone },
  { key: 'launch', label: '启动战役', icon: Rocket },
];

const categories = ['鸡排', '小吃', '饮品', '套餐'];
const regions = ['全国', '华东', '华南', '华北', '华中', '西南', '西北', '东北'];

// Mock generated packages
const mockPackages = [
  { 
    id: 1, 
    icon: '🎯', 
    name: '新品上市卡', 
    desc: '完整的上市节奏与执行路线图',
    status: 'generated',
    details: ['Day1-3预热计划', 'Day4-10强曝光方案', 'Day11-20套餐策略', 'Day21-30裂变机制']
  },
  { 
    id: 2, 
    icon: '🏪', 
    name: '门店卖法包', 
    desc: '店员话术、推荐技巧、套餐组合',
    status: 'generated',
    details: ['标准话术模板', '套餐推荐逻辑', '异议处理指南', '快速成单技巧']
  },
  { 
    id: 3, 
    icon: '📢', 
    name: '新品传播包', 
    desc: '海报、视频、文案一站式产出',
    status: 'generated',
    details: ['主视觉海报×3', '15秒种草视频', '朋友圈文案×5', '小红书种草笔记']
  },
  { 
    id: 4, 
    icon: '⚔️', 
    name: '新品PK机制', 
    desc: '区县与门店间的竞争激励机制',
    status: 'generated',
    details: ['区县排行榜', '门店龙虎榜', '个人销冠赛', '奖励与惩罚机制']
  },
  { 
    id: 5, 
    icon: '📊', 
    name: '30天复盘机制', 
    desc: '数据追踪、定期复盘、经验沉淀',
    status: 'pending',
    details: ['日/周数据汇报', '问题预警机制', '爆品经验沉淀', '改进建议报告']
  },
];

// Mock content preview data
const mockContentPreview = {
  poster: { color: '#F97316', title: '蔬香鸡腿排', subtitle: '新品上市 · 限时尝鲜' },
  video: { duration: '0:15', thumbnail: '#8B5CF6' },
  audio: { duration: '30秒', text: '欢迎品尝蔬香鸡腿排...' },
  posts: [
    { platform: '朋友圈', content: '解锁蔬香鸡腿排的宝藏吃法🍗' },
    { platform: '小红书', content: '被问爆的新品！一口沦陷的快乐！' },
  ],
};

function PackageCard({ pkg, onClick }: { pkg: typeof mockPackages[0]; onClick: () => void }) {
  const statusColors = {
    generated: 'bg-battle-green/20 text-battle-green border-battle-green/30',
    generating: 'bg-battle-orange/20 text-battle-orange border-battle-orange/30',
    pending: 'bg-text-secondary/20 text-text-secondary border-text-secondary/30',
  };
  
  const Icon = Target;
  
  return (
    <div 
      onClick={onClick}
      className="content-card cursor-pointer hover:border-accent/50 transition-all group"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          {pkg.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-text-primary">{pkg.name}</h3>
          <p className="text-sm text-text-secondary mt-1">{pkg.desc}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[pkg.status as keyof typeof statusColors]}`}>
          {pkg.status === 'generated' ? '✓ 已生成' : pkg.status === 'generating' ? '⟳ 生成中' : '○ 待生成'}
        </span>
      </div>
      
      {pkg.status === 'generating' && (
        <div className="mb-4 h-1.5 bg-dark-border rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-battle-orange rounded-full animate-pulse" />
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2">
        {pkg.details.map((detail, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
            <CheckCircle2 size={12} className="text-battle-green" />
            <span>{detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentVisualizer({ type, content, onVideoStatusCheck }: { type: string; content?: any; onVideoStatusCheck?: () => void }) {
  // 如果有真实内容，使用真实内容
  if (content) {
    if (type === 'poster') {
      return (
        <div className="bg-gradient-to-br from-battle-orange/30 to-battle-orange/10 border border-battle-orange/30 rounded-xl p-6 h-full flex flex-col">
          <div className="flex-1 bg-dark-bg rounded-lg flex items-center justify-center relative overflow-hidden">
            {content.url ? (
              <img src={content.url} alt="海报" className="w-full h-full object-contain rounded" />
            ) : (
              <div className="text-center z-10">
                <div className="w-16 h-16 bg-battle-orange/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Image size={32} className="text-battle-orange" />
                </div>
                <div className="text-text-primary">海报生成中...</div>
              </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <span className="text-xs text-text-secondary">海报尺寸：1080×1080px</span>
          </div>
        </div>
      );
    }
    
    if (type === 'video') {
      return (
        <div className="bg-gradient-to-br from-battle-purple/30 to-battle-purple/10 border border-battle-purple/30 rounded-xl p-6 h-full">
          <div className="bg-dark-bg rounded-lg aspect-video flex items-center justify-center relative">
            {content.url ? (
              <video src={content.url} controls className="w-full h-full object-contain rounded" />
            ) : content.taskId ? (
              <div className="text-center z-10">
                <div className="w-16 h-16 bg-battle-purple/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Video size={32} className="text-battle-purple ml-1" />
                </div>
                <div className="text-text-primary mb-2">视频生成中...</div>
                {onVideoStatusCheck && (
                  <button onClick={onVideoStatusCheck} className="px-3 py-1 bg-battle-purple/20 text-battle-purple rounded text-xs">
                    刷新状态
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center z-10">
                <div className="w-16 h-16 bg-battle-purple/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Video size={32} className="text-battle-purple ml-1" />
                </div>
                <div className="text-text-primary">等待生成视频...</div>
              </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm text-text-secondary">15秒种草视频 · 竖版</span>
          </div>
        </div>
      );
    }
    
    if (type === 'audio') {
      return (
        <div className="bg-gradient-to-br from-battle-green/30 to-battle-green/10 border border-battle-green/30 rounded-xl p-6 h-full">
          <div className="bg-dark-bg rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-battle-green/20 rounded-full flex items-center justify-center">
              <Music size={24} className="text-battle-green" />
            </div>
            <div className="flex-1">
              {content.url ? (
                <audio src={content.url} controls className="w-full" />
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-dark-border rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-battle-green rounded-full animate-pulse" />
                    </div>
                    <span className="text-xs text-text-secondary">生成中...</span>
                  </div>
                  <div className="text-xs text-text-secondary">店内广播词</div>
                </>
              )}
            </div>
          </div>
          {content.url && (
            <div className="mt-4 p-3 bg-dark-bg rounded-lg">
              <div className="text-xs text-text-secondary flex items-start gap-2">
                <FileText size={14} className="text-battle-green flex-shrink-0 mt-0.5" />
                <span>广播词音频已生成</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    if (type === 'text') {
      return (
        <div className="space-y-3">
          {(content.posts || mockContentPreview.posts).map((post: any, i: number) => (
            <div key={i} className="bg-dark-bg rounded-lg p-4 border border-dark-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-0.5 bg-battle-blue/20 text-battle-blue rounded">
                  {post.platform}
                </span>
              </div>
              <p className="text-sm text-text-primary">{post.content}</p>
            </div>
          ))}
        </div>
      );
    }
  }

  // Fallback to mock data when no content generated yet
  if (type === 'poster') {
    return (
      <div className="bg-gradient-to-br from-battle-orange/30 to-battle-orange/10 border border-battle-orange/30 rounded-xl p-6 h-full flex flex-col">
        <div className="flex-1 bg-dark-bg rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-battle-orange/10 to-transparent" />
          <div className="text-center z-10">
            <div className="w-16 h-16 bg-battle-orange/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Image size={32} className="text-battle-orange" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{mockContentPreview.poster.title}</div>
            <div className="text-sm text-text-secondary mt-2">{mockContentPreview.poster.subtitle}</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <span className="text-xs text-text-secondary">海报尺寸：1080×1080px</span>
        </div>
      </div>
    );
  }
  
  if (type === 'video') {
    return (
      <div className="bg-gradient-to-br from-battle-purple/30 to-battle-purple/10 border border-battle-purple/30 rounded-xl p-6 h-full">
        <div className="bg-dark-bg rounded-lg aspect-video flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-battle-purple/20 to-transparent" />
          <div className="w-16 h-16 bg-battle-purple/20 rounded-full flex items-center justify-center z-10">
            <Play size={32} className="text-battle-purple ml-1" />
          </div>
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {mockContentPreview.video.duration}
          </div>
        </div>
        <div className="mt-4 text-center">
          <span className="text-sm text-text-secondary">15秒种草视频 · 竖版</span>
        </div>
      </div>
    );
  }
  
  if (type === 'audio') {
    return (
      <div className="bg-gradient-to-br from-battle-green/30 to-battle-green/10 border border-battle-green/30 rounded-xl p-6 h-full">
        <div className="bg-dark-bg rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-battle-green/20 rounded-full flex items-center justify-center">
            <Music size={24} className="text-battle-green" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-2 bg-dark-border rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-battle-green rounded-full" />
              </div>
              <span className="text-xs text-text-secondary">{mockContentPreview.audio.duration}</span>
            </div>
            <div className="text-xs text-text-secondary">店内广播词</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-dark-bg rounded-lg">
          <div className="text-xs text-text-secondary flex items-start gap-2">
            <FileText size={14} className="text-battle-green flex-shrink-0 mt-0.5" />
            <span>"{mockContentPreview.audio.text}"</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (type === 'text') {
    return (
      <div className="space-y-3">
        {mockContentPreview.posts.map((post, i) => (
          <div key={i} className="bg-dark-bg rounded-lg p-4 border border-dark-border">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-0.5 bg-battle-blue/20 text-battle-blue rounded">
                {post.platform}
              </span>
            </div>
            <p className="text-sm text-text-primary">{post.content}</p>
          </div>
        ))}
      </div>
    );
  }
  
  return null;
}

export default function BattleCreatorWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '蔬香鸡腿排',
    category: '鸡排',
    price: '18',
    cost: '8',
    targetUser: '18-30岁年轻白领、学生群体',
    sellingPoints: '甄选鸡腿肉，秘制蔬香腌料，外酥里嫩多汁',
    launchDate: '2026-05-21',
    region: '全国',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsGeneratingContent(true);
    try {
      // 真实调用AI生成内容
      const sellingPointsArray = formData.sellingPoints.split('\n').filter((s: string) => s.trim());
      const [posterRes, videoRes, audioRes, textRes] = await Promise.all([
        fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'poster', productName: formData.name, sellingPoints: sellingPointsArray, price: formData.price }),
        }),
        fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'video', productName: formData.name, sellingPoints: sellingPointsArray, price: formData.price }),
        }),
        fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'audio', productName: formData.name, sellingPoints: sellingPointsArray, price: formData.price }),
        }),
        fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'text', productName: formData.name, sellingPoints: sellingPointsArray, price: formData.price }),
        }),
      ]);
      
      const [poster, video, audio, text] = await Promise.all([posterRes.json(), videoRes.json(), audioRes.json(), textRes.json()]);
      
      setGeneratedContent({ poster, video, audio, text });
      setIsGenerating(false);
      setIsGeneratingContent(false);
      setCurrentStep(2);
    } catch (e) {
      console.error('内容生成失败:', e);
      setIsGenerating(false);
      setIsGeneratingContent(false);
      // 即使失败也允许进入下一步查看
      setCurrentStep(2);
    }
  };

  const handleLaunch = () => {
    // Simulate launch
    alert('🎉 战役已启动！正在跳转至战役指挥台...');
    router.push('/');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent to-battle-orange rounded-xl flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          新品战役创建向导
        </h1>
        <p className="text-text-secondary mt-2">输入产品信息，AI将为您生成完整的30天战役方案</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8 bg-dark-card rounded-xl p-4 border border-dark-border">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isPast = index < currentStep;
          
          return (
            <button
              key={step.key}
              onClick={() => index < currentStep && setCurrentStep(index)}
              disabled={index > currentStep}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                isActive ? 'bg-accent/20 text-accent' :
                isPast ? 'text-battle-green hover:bg-dark-bg cursor-pointer' :
                'text-text-secondary cursor-not-allowed'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isActive ? 'bg-accent text-white' :
                isPast ? 'bg-battle-green text-white' :
                'bg-dark-border text-text-secondary'
              }`}>
                {isPast ? <CheckCircle2 size={16} /> : <Icon size={16} />}
              </div>
              <span className="font-medium text-sm">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step 1: Input */}
      {currentStep === 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="bg-dark-card rounded-xl border border-dark-border p-6">
            <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
              <Target size={20} className="text-accent" />
              新品情报录入
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  产品名称 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="如：韩式炸鸡、藤椒鸡排"
                  className="w-full h-12 px-4 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">产品类别</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">推广区域</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                  >
                    {regions.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    售价（元） <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="如：18"
                    className="w-full h-12 px-4 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    成本（元） <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    placeholder="如：8"
                    className="w-full h-12 px-4 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">目标人群</label>
                <input
                  type="text"
                  name="targetUser"
                  value={formData.targetUser}
                  onChange={handleInputChange}
                  placeholder="如：18-30岁年轻白领、学生群体"
                  className="w-full h-12 px-4 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">核心卖点</label>
                <textarea
                  name="sellingPoints"
                  value={formData.sellingPoints}
                  onChange={handleInputChange}
                  placeholder="输入产品核心卖点，每行一个"
                  rows={3}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">上市时间</label>
                <input
                  type="date"
                  name="launchDate"
                  value={formData.launchDate}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
          </div>
          
          {/* Right: Live Preview */}
          <div className="bg-dark-card rounded-xl border border-dark-border p-6">
            <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
              <Sparkles size={20} className="text-accent" />
              实时定位预览
            </h2>
            
            <div className="bg-gradient-to-br from-accent/10 to-battle-orange/5 border border-accent/20 rounded-xl p-6 mb-6">
              <div className="text-xs text-text-secondary mb-2">一句话定位</div>
              <div className="text-xl font-bold text-text-primary leading-relaxed">
                {formData.name} — {formData.sellingPoints.split('\n')[0] || '美味难挡'}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                <span className="text-sm text-text-secondary">建议零售价</span>
                <span className="text-lg font-bold text-battle-green">¥{formData.price}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                <span className="text-sm text-text-secondary">毛利率</span>
                <span className="text-lg font-bold text-battle-blue">
                  {Math.round(((parseFloat(formData.price) - parseFloat(formData.cost)) / parseFloat(formData.price)) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                <span className="text-sm text-text-secondary">目标人群</span>
                <span className="text-sm font-medium text-text-primary">{formData.targetUser}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                <span className="text-sm text-text-secondary">推广区域</span>
                <span className="text-sm font-medium text-text-primary">{formData.region}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Packages */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text-primary">战略礼包生成中...</h2>
              <p className="text-text-secondary mt-1">AI正在为您构建完整的30天战役方案</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-battle-green/20 text-battle-green rounded-lg text-sm font-medium">
                ✓ 新品上市卡
              </div>
              <div className="px-4 py-2 bg-battle-green/20 text-battle-green rounded-lg text-sm font-medium">
                ✓ 门店卖法包
              </div>
              <div className="px-4 py-2 bg-battle-orange/20 text-battle-orange rounded-lg text-sm font-medium animate-pulse">
                生成中... 传播包
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockPackages.map((pkg) => (
              <PackageCard 
                key={pkg.id} 
                pkg={pkg} 
                onClick={() => {}} 
              />
            ))}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={isGeneratingContent}
              className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGeneratingContent ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  AI生成中...
                </>
              ) : (
                <>
                  下一步：预览内容
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Content Preview */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-text-primary">传播包内容预览</h2>
            <p className="text-text-secondary mt-1">AI已生成以下营销物料，您可以在启动前预览和调整</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Poster */}
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <Image size={16} className="text-battle-orange" />
                海报物料
              </h3>
              <ContentVisualizer type="poster" content={generatedContent?.poster} />
            </div>
            
            {/* Video */}
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <Video size={16} className="text-battle-purple" />
                视频物料
              </h3>
              <ContentVisualizer type="video" content={generatedContent?.video} />
            </div>
            
            {/* Audio */}
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <Music size={16} className="text-battle-green" />
                音频物料
              </h3>
              <ContentVisualizer type="audio" content={generatedContent?.audio} />
            </div>
            
            {/* Text */}
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <FileText size={16} className="text-battle-blue" />
                文案物料
              </h3>
              <ContentVisualizer type="text" content={generatedContent?.text} />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-dark-border">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 border border-dark-border text-text-secondary rounded-lg hover:bg-dark-bg transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              返回上一步
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors flex items-center gap-2"
            >
              下一步：启动战役
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Launch */}
      {currentStep === 3 && (
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-accent to-battle-orange rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow-accent animate-pulse">
            <Rocket size={48} className="text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            准备就绪！启动30天新品战役
          </h2>
          <p className="text-text-secondary text-lg mb-8">
            「{formData.name}」将在全国{formData.region}范围内同步推进
          </p>
          
          <div className="bg-dark-card rounded-xl border border-dark-border p-6 mb-8">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-battle-blue">30</div>
                <div className="text-sm text-text-secondary">战役天数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-battle-orange">11</div>
                <div className="text-sm text-text-secondary">参与区县</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-battle-green">286</div>
                <div className="text-sm text-text-secondary">执行门店</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 border border-dark-border text-text-secondary rounded-lg hover:bg-dark-bg transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              返回修改
            </button>
            <button
              onClick={handleLaunch}
              className="px-8 py-4 bg-accent text-white rounded-xl font-bold text-lg hover:bg-accent-dark transition-colors shadow-glow-accent flex items-center gap-3"
            >
              <Send size={20} />
              立即启动战役
            </button>
          </div>
        </div>
      )}

      {/* Bottom navigation for Step 0 */}
      {currentStep === 0 && (
        <div className="flex justify-end mt-8 pt-6 border-t border-dark-border">
          <button
            onClick={() => setCurrentStep(1)}
            className="px-8 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors shadow-glow-accent flex items-center gap-2"
          >
            <Sparkles size={18} />
            生成战略礼包
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}