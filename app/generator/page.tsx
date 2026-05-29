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
  // 如果有真实内容且没有报错，使用真实内容
  if (content && !content.error) {
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
    
    if (type === 'music') {
      return (
        <div className="bg-gradient-to-br from-yellow-500/30 to-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 h-full">
          <div className="bg-dark-bg rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <Music size={24} className="text-yellow-500" />
            </div>
            <div className="flex-1">
              {content.url ? (
                <audio src={content.url} controls className="w-full" />
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-dark-border rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-yellow-500 rounded-full animate-pulse" />
                    </div>
                    <span className="text-xs text-text-secondary">生成中...</span>
                  </div>
                  <div className="text-xs text-text-secondary">品牌宣传歌曲</div>
                </>
              )}
            </div>
          </div>
          {content.url && (
            <div className="mt-4 p-3 bg-dark-bg rounded-lg">
              <div className="text-xs text-text-secondary flex items-start gap-2">
                <FileText size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                <span>宣传歌曲已生成</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    if (type === 'text') {
      // Handle nested {posts: [...]} format from API
      const rawPosts = content.posts;
      const postsArray = rawPosts?.posts ? rawPosts.posts : (Array.isArray(rawPosts) ? rawPosts : []);
      return (
        <div className="space-y-3">
          {postsArray.length > 0 ? postsArray.map((post: any, i: number) => (
            <div key={i} className="bg-dark-bg rounded-lg p-4 border border-dark-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-0.5 bg-battle-blue/20 text-battle-blue rounded">
                  {post.platform}
                </span>
              </div>
              <p className="text-sm text-text-primary">{post.content}</p>
            </div>
          )) : <div className="text-text-secondary text-sm">文案生成中...</div>}
        </div>
      );
    }
  }

    if (content.error) {
      return (
        <div className="bg-dark-bg rounded-lg p-4 flex items-center justify-center h-full">
          <div className="text-text-secondary text-sm text-center">{content.error}</div>
        </div>
      );
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
  
  if (type === 'music') {
    return (
      <div className="bg-gradient-to-br from-yellow-500/30 to-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 h-full">
        <div className="bg-dark-bg rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <Music size={24} className="text-yellow-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-2 bg-dark-border rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-yellow-500 rounded-full" />
              </div>
              <span className="text-xs text-text-secondary">30s</span>
            </div>
            <div className="text-xs text-text-secondary">品牌宣传歌曲</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-dark-bg rounded-lg">
          <div className="text-xs text-text-secondary flex items-start gap-2">
            <FileText size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" />
            <span>正新鸡排品牌宣传曲</span>
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
  const [currentStep, setCurrentStep] = useState<number>(0);
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
  const [enabledItems, setEnabledItems] = useState<Record<string, boolean>>({
    poster: true,
    video: true,
    audio: true,
    music: true,
    text: true,
  });
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [itemDescriptions, setItemDescriptions] = useState<Record<string, string>>({
    poster: '美食摄影风格，无文字纯视觉，深橙暖色调背景',
    video: '产品特写+门店场景+试吃，食欲感强节奏明快',
    audio: '新品叫卖音频，温暖亲切，适合门店广播',
    music: '品牌宣传歌曲，节奏明快活泼，传递美味欢乐氛围',
    text: '朋友圈文案+小红书种草+门店话术',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGenerate = async () => {
    if (Object.values(enabledItems).every(v => !v)) {
      alert('请至少选择一种内容类型生成');
      return;
    }
    
    setIsGenerating(true);
    setIsGeneratingContent(true);
    setGeneratedContent(null);
    
    const sellingPointsArray = formData.sellingPoints.split('\n').filter((s: string) => s.trim());
    
    // 只生成已勾选的内容
    const tempContent: any = {};
    
    try {
    // 1. 海报
    if (enabledItems.poster) {
      try {
        const r = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'poster', productName: formData.name, sellingPoints: sellingPointsArray, price: formData.price, description: itemDescriptions.poster }),
        });
        const data = await r.json();
        tempContent.poster = data;
      } catch(e) { tempContent.poster = { error: '海报请求失败' }; }
    }
    
    // 2. 视频
    if (enabledItems.video) {
      try {
        const r = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'video', productName: formData.name, sellingPoints: sellingPointsArray, price: formData.price, description: itemDescriptions.video }),
        });
        const data = await r.json();
        tempContent.video = data;
      } catch(e) { tempContent.video = { error: '视频请求失败' }; }
    }
    
    // 3. 音频
    if (enabledItems.audio) {
      try {
        const r = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'audio', productName: formData.name, sellingPoints: sellingPointsArray, price: formData.price, description: itemDescriptions.audio }),
        });
        const data = await r.json();
        tempContent.audio = data;
      } catch(e) { tempContent.audio = { error: '音频请求失败' }; }
    }
    
    // 4. 文案
    if (enabledItems.text) {
      try {
        const r = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'text', productName: formData.name, sellingPoints: sellingPointsArray, price: formData.price, description: itemDescriptions.text }),
        });
        const data = await r.json();
        tempContent.text = data;
      } catch(e) { tempContent.text = { error: '文案请求失败', posts: [] }; }
    }
    
    // 5. 音乐
    if (enabledItems.music) {
      try {
        const r = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'music', productName: formData.name, sellingPoints: sellingPointsArray, price: formData.price, description: itemDescriptions.music }),
        });
        const data = await r.json();
        tempContent.music = data;
      } catch(e) { tempContent.music = { error: '音乐请求失败' }; }
    }
    } catch (e) {
      console.error('内容生成失败:', e);
    }
    
    setGeneratedContent(tempContent);
    
    setIsGenerating(false);
    setIsGeneratingContent(false);
    setCurrentStep(3);
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

      {/* Step 1: Content Plan Confirmation */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-text-primary">AI内容方案确认</h2>
            <p className="text-text-secondary mt-1">请确认以下内容生成方案，AI将根据您的选择进行创作</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 海报 */}
            <div className={`bg-dark-card rounded-xl border p-5 transition-all ${enabledItems.poster ? 'border-battle-orange/50' : 'border-dark-border opacity-60'}`}>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={enabledItems.poster}
                  onChange={(e) => setEnabledItems(prev => ({ ...prev, poster: e.target.checked }))}
                  className="w-5 h-5 rounded bg-dark-bg border-dark-border text-battle-orange focus:ring-battle-orange"
                />
                <div className="w-10 h-10 bg-battle-orange/20 rounded-lg flex items-center justify-center">
                  <Image size={20} className="text-battle-orange" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-text-primary">海报物料</div>
                  <div className="text-xs text-text-secondary">image-01 模型</div>
                </div>
                <button
                  onClick={() => setEditingItem(editingItem === 'poster' ? null : 'poster')}
                  className="text-xs px-2 py-1 bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors"
                >
                  {editingItem === 'poster' ? '收起' : '编辑'}
                </button>
              </div>
              {editingItem === 'poster' && (
                <div className="mt-3 p-3 bg-dark-bg rounded-lg border border-dark-border">
                  <textarea
                    value={itemDescriptions.poster}
                    onChange={(e) => setItemDescriptions(prev => ({ ...prev, poster: e.target.value }))}
                    placeholder="描述内容特点..."
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded text-text-primary text-sm resize-none"
                    rows={2}
                  />
                </div>
              )}
              <div className="text-sm text-text-secondary space-y-1">
                <p>• 产品：<span className="text-text-primary">{formData.name}</span></p>
                <p>• 卖点：<span className="text-text-primary">{formData.sellingPoints.split('\n')[0] || '酥脆美味'}</span></p>
                <p>• 价格：<span className="text-text-primary">¥{formData.price}</span></p>
                <p className="text-xs mt-2 text-text-secondary">{itemDescriptions.poster}</p>
              </div>
            </div>

            {/* 视频 */}
            <div className={`bg-dark-card rounded-xl border p-5 transition-all ${enabledItems.video ? 'border-battle-purple/50' : 'border-dark-border opacity-60'}`}>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={enabledItems.video}
                  onChange={(e) => setEnabledItems(prev => ({ ...prev, video: e.target.checked }))}
                  className="w-5 h-5 rounded bg-dark-bg border-dark-border text-battle-purple focus:ring-battle-purple"
                />
                <div className="w-10 h-10 bg-battle-purple/20 rounded-lg flex items-center justify-center">
                  <Video size={20} className="text-battle-purple" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-text-primary">视频物料</div>
                  <div className="text-xs text-text-secondary">video-01 模型</div>
                </div>
                <button
                  onClick={() => setEditingItem(editingItem === 'video' ? null : 'video')}
                  className="text-xs px-2 py-1 bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors"
                >
                  {editingItem === 'video' ? '收起' : '编辑'}
                </button>
              </div>
              {editingItem === 'video' && (
                <div className="mt-3 p-3 bg-dark-bg rounded-lg border border-dark-border">
                  <textarea
                    value={itemDescriptions.video}
                    onChange={(e) => setItemDescriptions(prev => ({ ...prev, video: e.target.value }))}
                    placeholder="描述视频风格..."
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded text-text-primary text-sm resize-none"
                    rows={2}
                  />
                </div>
              )}
              <div className="text-sm text-text-secondary space-y-1">
                <p>• 产品：<span className="text-text-primary">{formData.name}</span></p>
                <p>• 时长：<span className="text-text-primary">15秒竖版</span></p>
                <p>• 卖点：<span className="text-text-primary">{formData.sellingPoints.split('\n')[0] || '酥脆美味'}</span></p>
                <p className="text-xs mt-2 text-text-secondary">{itemDescriptions.video}</p>
              </div>
            </div>

            {/* 音频 */}
            <div className={`bg-dark-card rounded-xl border p-5 transition-all ${enabledItems.audio ? 'border-battle-green/50' : 'border-dark-border opacity-60'}`}>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={enabledItems.audio}
                  onChange={(e) => setEnabledItems(prev => ({ ...prev, audio: e.target.checked }))}
                  className="w-5 h-5 rounded bg-dark-bg border-dark-border text-battle-green focus:ring-battle-green"
                />
                <div className="w-10 h-10 bg-battle-green/20 rounded-lg flex items-center justify-center">
                  <Music size={20} className="text-battle-green" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-text-primary">音频物料</div>
                  <div className="text-xs text-text-secondary">Speech 2.8 模型</div>
                </div>
                <button
                  onClick={() => setEditingItem(editingItem === 'audio' ? null : 'audio')}
                  className="text-xs px-2 py-1 bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors"
                >
                  {editingItem === 'audio' ? '收起' : '编辑'}
                </button>
              </div>
              {editingItem === 'audio' && (
                <div className="mt-3 p-3 bg-dark-bg rounded-lg border border-dark-border">
                  <textarea
                    value={itemDescriptions.audio}
                    onChange={(e) => setItemDescriptions(prev => ({ ...prev, audio: e.target.value }))}
                    placeholder="描述音频风格..."
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded text-text-primary text-sm resize-none"
                    rows={2}
                  />
                </div>
              )}
              <div className="text-sm text-text-secondary space-y-1">
                <p>• 产品：<span className="text-text-primary">{formData.name}</span></p>
                <p>• 价格：<span className="text-text-primary">¥{formData.price}</span></p>
                <p>• 卖点：<span className="text-text-primary">{formData.sellingPoints.split('\n')[0] || '酥脆美味'}</span></p>
                <p className="text-xs mt-2 text-text-secondary">{itemDescriptions.audio}</p>
              </div>
            </div>

            {/* 音乐 */}
            <div className={`bg-dark-card rounded-xl border p-5 transition-all ${enabledItems.music ? 'border-yellow-500/50' : 'border-dark-border opacity-60'}`}>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={enabledItems.music}
                  onChange={(e) => setEnabledItems(prev => ({ ...prev, music: e.target.checked }))}
                  className="w-5 h-5 rounded bg-dark-bg border-dark-border text-yellow-500 focus:ring-yellow-500"
                />
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Music size={20} className="text-yellow-500" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-text-primary">音乐物料</div>
                  <div className="text-xs text-text-secondary">Music-2.6 模型</div>
                </div>
                <button
                  onClick={() => setEditingItem(editingItem === 'music' ? null : 'music')}
                  className="text-xs px-2 py-1 bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors"
                >
                  {editingItem === 'music' ? '收起' : '编辑'}
                </button>
              </div>
              {editingItem === 'music' && (
                <div className="mt-3 p-3 bg-dark-bg rounded-lg border border-dark-border">
                  <textarea
                    value={itemDescriptions.music}
                    onChange={(e) => setItemDescriptions(prev => ({ ...prev, music: e.target.value }))}
                    placeholder="描述音乐风格..."
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded text-text-primary text-sm resize-none"
                    rows={2}
                  />
                </div>
              )}
              <div className="text-sm text-text-secondary space-y-1">
                <p>• 产品：<span className="text-text-primary">{formData.name}</span></p>
                <p>• 时长：<span className="text-text-primary">约30秒</span></p>
                <p>• 卖点：<span className="text-text-primary">{formData.sellingPoints.split('\n')[0] || '酥脆美味'}</span></p>
                <p className="text-xs mt-2 text-text-secondary">{itemDescriptions.music}</p>
              </div>
            </div>

            {/* 文案 */}
            <div className={`bg-dark-card rounded-xl border p-5 transition-all ${enabledItems.text ? 'border-battle-blue/50' : 'border-dark-border opacity-60'}`}>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={enabledItems.text}
                  onChange={(e) => setEnabledItems(prev => ({ ...prev, text: e.target.checked }))}
                  className="w-5 h-5 rounded bg-dark-bg border-dark-border text-battle-blue focus:ring-battle-blue"
                />
                <div className="w-10 h-10 bg-battle-blue/20 rounded-lg flex items-center justify-center">
                  <FileText size={20} className="text-battle-blue" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-text-primary">文案物料</div>
                  <div className="text-xs text-text-secondary">M2.7-highspeed 模型</div>
                </div>
                <button
                  onClick={() => setEditingItem(editingItem === 'text' ? null : 'text')}
                  className="text-xs px-2 py-1 bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors"
                >
                  {editingItem === 'text' ? '收起' : '编辑'}
                </button>
              </div>
              {editingItem === 'text' && (
                <div className="mt-3 p-3 bg-dark-bg rounded-lg border border-dark-border">
                  <textarea
                    value={itemDescriptions.text}
                    onChange={(e) => setItemDescriptions(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="描述文案风格..."
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded text-text-primary text-sm resize-none"
                    rows={2}
                  />
                </div>
              )}
              <div className="text-sm text-text-secondary space-y-1">
                <p>• 产品：<span className="text-text-primary">{formData.name}</span></p>
                <p>• 包含：<span className="text-text-primary">朋友圈文案+小红书种草+门店话术</span></p>
                <p className="text-xs mt-2 text-text-secondary">{itemDescriptions.text}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-dark-card rounded-lg border border-dark-border">
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">
                <span className="text-text-primary font-medium">已选择 {Object.values(enabledItems).filter(Boolean).length} </span>项内容待生成
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setEnabledItems({ poster: true, video: true, audio: true, music: true, text: true })}
                  className="text-xs px-3 py-1 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors"
                >
                  全选
                </button>
                <button
                  onClick={() => setEnabledItems({ poster: false, video: false, audio: false, music: false, text: false })}
                  className="text-xs px-3 py-1 bg-dark-bg text-text-secondary rounded-lg hover:bg-dark-border transition-colors"
                >
                  取消全选
                </button>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-2">取消勾选的内容将跳过生成，确认后再生成</p>
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-dark-border">
            <button
              onClick={() => setCurrentStep(0)}
              className="px-6 py-3 bg-dark-bg text-text-secondary rounded-lg font-medium hover:bg-dark-border transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              返回修改信息
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-8 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors shadow-glow-accent flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  AI生成中...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  确认生成
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Packages */}
      {currentStep === 2 && (
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
              onClick={() => setCurrentStep(3)}
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
      {currentStep === 3 && (
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
            
            {/* Music */}
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <Music size={16} className="text-yellow-500" />
                音乐物料
              </h3>
              <ContentVisualizer type="music" content={generatedContent?.music} />
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
      {currentStep === 4 && (
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