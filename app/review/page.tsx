'use client';

import { useEffect, useState } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Lightbulb,
  Archive,
} from 'lucide-react';

interface ReviewCase {
  id: string;
  productName: string;
  type: 'success' | 'failure';
  score: number;
  keyFactors: string[];
  lessons: string[];
  createdAt: string;
}

export default function ReviewPage() {
  const [cases, setCases] = useState<ReviewCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'success' | 'failure'>('all');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setCases([
        {
          id: '1',
          productName: '韩式炸鸡',
          type: 'success',
          score: 88,
          keyFactors: ['差异化口味', '精准人群定位', '完整预热动作'],
          lessons: ['新品必须有3天以上预热期', '社交媒体传播是关键', '门店执行标准化很重要'],
          createdAt: '2026-05-20',
        },
        {
          id: '2',
          productName: '藤椒鸡排',
          type: 'success',
          score: 82,
          keyFactors: ['口味独特', '定价合理', '区域配合度高'],
          lessons: ['区域试点策略有效', '门店激励提升执行力'],
          createdAt: '2026-05-18',
        },
        {
          id: '3',
          productName: '香辣鸡排',
          type: 'failure',
          score: 45,
          keyFactors: ['定价偏高', '预热不足', '执行一致性差'],
          lessons: ['新品定价需要更多调研', '预热期至少7天', '需要更严格的执行跟踪'],
          createdAt: '2026-05-15',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredCases = filter === 'all'
    ? cases
    : cases.filter(c => c.type === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text">复盘中心</h1>
        <p className="text-muted mt-1">沉淀成功与失败经验，优化未来推广策略</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={24} className="text-success" />
            </div>
            <div>
              <p className="text-sm text-muted">成功案例</p>
              <p className="text-2xl font-bold text-text">
                {cases.filter(c => c.type === 'success').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center">
              <XCircle size={24} className="text-error" />
            </div>
            <div>
              <p className="text-sm text-muted">失败案例</p>
              <p className="text-2xl font-bold text-text">
                {cases.filter(c => c.type === 'failure').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted">平均评分</p>
              <p className="text-2xl font-bold text-text">
                {cases.length > 0
                  ? Math.round(cases.reduce((sum, c) => sum + c.score, 0) / cases.length)
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI insights */}
      <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
            <Lightbulb size={20} className="text-accent" />
          </div>
          <h2 className="font-semibold text-text">AI优化建议</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-white/60 rounded-lg p-4">
            <span className="text-accent">•</span>
            <p className="text-sm">
              <strong>预热期重要性：</strong>数据显示，有完整7天预热期的新品成功率比没有预热的高出47%。建议所有新品必须包含T-7的预热动作。
            </p>
          </div>
          <div className="flex items-start gap-3 bg-white/60 rounded-lg p-4">
            <span className="text-accent">•</span>
            <p className="text-sm">
              <strong>定价策略：</strong>定价在15-25元区间的新品最受欢迎，毛利率应控制在55%-65%之间以保证竞争力。
            </p>
          </div>
          <div className="flex items-start gap-3 bg-white/60 rounded-lg p-4">
            <span className="text-accent">•</span>
            <p className="text-sm">
              <strong>执行标准化：</strong>门店执行合规率&gt;85%的新品，销量比低于85%的组别高出32%。建议加强门店培训和监督。
            </p>
          </div>
        </div>
      </div>

      {/* Cases list */}
      <div className="bg-white rounded-xl border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-text">案例库</h2>
          <div className="flex items-center gap-2">
            {(['all', 'success', 'failure'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  filter === f
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-muted hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? '全部' : f === 'success' ? '成功' : '失败'}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="mx-auto text-muted animate-spin" size={32} />
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="p-12 text-center">
              <Archive className="mx-auto text-muted mb-4" size={48} />
              <p className="text-muted">暂无案例</p>
            </div>
          ) : (
            filteredCases.map(reviewCase => (
              <div key={reviewCase.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      reviewCase.type === 'success'
                        ? 'bg-success/10 text-success'
                        : 'bg-error/10 text-error'
                    }`}>
                      {reviewCase.type === 'success' ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <XCircle size={20} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-text">{reviewCase.productName}</h3>
                      <p className="text-xs text-muted">评分 {reviewCase.score} · {reviewCase.createdAt}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    reviewCase.type === 'success'
                      ? 'bg-success/10 text-success'
                      : 'bg-error/10 text-error'
                  }`}>
                    {reviewCase.type === 'success' ? '成功' : '失败'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted mb-2">关键因素</p>
                    <ul className="space-y-1">
                      {reviewCase.keyFactors.map((factor, i) => (
                        <li key={i} className="text-sm text-text flex items-start gap-2">
                          <span className="text-success">✓</span>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-2">经验教训</p>
                    <ul className="space-y-1">
                      {reviewCase.lessons.map((lesson, i) => (
                        <li key={i} className="text-sm text-text flex items-start gap-2">
                          <span className="text-accent">•</span>
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}