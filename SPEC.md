# 正新新品推广作战平台 - MVP 设计规范

## 1. Concept & Vision

**核心理念：** "把爆品经验 → 变成AI标准化生产线"

这是一个面向爆品部 + 一线运营团队的 AI 驱动新品推广管理系统。界面风格采用**专业、高效、清晰**的企业级设计语言，以深蓝/藏青色为主色调，配合明亮的橙色作为强调色，传达稳重可靠的品质感同时保持活力。

系统让每一新品都能"自动生成打法"，每一门店都能"照标准执行"，每一次成功都能"反哺系统变强"。

## 2. Design Language

### 色彩系统
```
Primary:     #1E3A5F (深海蓝 - 专业稳重)
Secondary:   #2D5A87 (中蓝 - 层次过渡)
Accent:      #FF6B35 (活力橙 - 强调行动)
Success:     #10B981 (翠绿)
Warning:     #F59E0B (琥珀)
Error:       #EF4444 (红色)
Background:  #F8FAFC (浅灰白)
Surface:     #FFFFFF (卡片白)
Text:        #1F2937 (深灰)
TextMuted:   #6B7280 (中灰)
Border:      #E5E7EB (边框灰)
```

### 字体
- 主字体：系统字体栈 `-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`
- 标题：600/700 weight
- 正文：400 weight
- 数据：tabular-nums

### 空间系统
- 基础单位：4px
- 间距：8/12/16/24/32/48px
- 圆角：6px(小) / 8px(中) / 12px(卡片)
- 阴影：`0 1px 3px rgba(0,0,0,0.1)` / `0 4px 12px rgba(0,0,0,0.08)`

### 动效哲学
- 页面切换：fade 200ms ease-out
- 卡片悬停：translateY(-2px) + shadow 增强，150ms
- 按钮交互：scale(0.98) + background-color 变化，100ms
- 数据加载：骨架屏 shimmer 动画
- AI 生成：打字机效果 + 逐行显示

## 3. Layout & Structure

### 整体架构
```
┌─────────────────────────────────────────────────────────┐
│  Logo + 系统名称          搜索栏         用户信息      │ ← 顶栏 64px
├────────────┬────────────────────────────────────────────┤
│            │                                            │
│  主导航    │            主内容区域                      │
│  240px     │                                            │
│            │                                            │
│  - 首页    │                                            │
│  - 新品中心│                                            │
│  - AI生成器│                                            │
│  - 推广任务│                                            │
│  - 数据看板│                                            │
│  - 复盘中心│                                            │
│            │                                            │
└────────────┴────────────────────────────────────────────┘
```

### 响应式策略
- Desktop (≥1280px)：完整侧边栏 + 宽内容区
- Tablet (768-1279px)：折叠侧边栏 + 自适应内容
- Mobile (<768px)：底部Tab导航

## 4. Features & Interactions

### 4.1 首页仪表盘
- **当前推广新品数**：实时统计进行中的新品
- **本月爆品成功率**：百分比展示 + 趋势线
- **TOP新品排行榜**：列表展示前5名
- **异常预警**：红色标识需要关注的新品

### 4.2 新品管理中心
- **新品列表**：Tab切换（进行中/已结束/草稿）
- **新建新品**：表单弹窗，必填项校验
- **新品状态**：未开始 → 推广中 → 爆发 → 复盘 → 结束
- **状态变更**：确认弹窗 + 成功提示

### 4.3 AI推广标准包生成器（核心）
**输入阶段：**
- 产品信息（名称、类别、定价、成本）
- 目标人群
- 价格策略
- 竞争对手（可选）
- 上市周期选择

**输出阶段（6大模块）：**
1. 爆品定位策略（一句话定位 + 消费场景 + 核心购买理由）
2. 传播卖点拆解（3-5条）
3. 推广节奏建议（预热期/上新期/放量期时间轴）
4. 门店执行SOP（陈列/话术/推荐组合/出餐动线）
5. 营销物料清单（海报文案/社媒文案/外卖标题/Banner）
6. 爆款预判评分（受欢迎指数/复购潜力/风险提示）

**AI生成交互：**
- 点击"生成推广方案" → loading动画 + 分段展示
- 生成完成 → 逐模块显示 + 评分高亮
- 支持"重新生成"/"编辑"/"复制"

### 4.4 推广任务系统
- **任务列表**：按门店/区域筛选
- **任务状态**：未开始/进行中/已完成/延迟/异常
- **批量操作**：勾选 → 批量分配/标记完成
- **截止日期**：红/黄/绿三色标识

### 4.5 数据看板
- **新品维度**：销量趋势图、转化率、客单价变化
- **门店维度**：上新完成率、执行合规率
- **区域维度**：区域爆品贡献、渗透率
- **图表类型**：折线图（趋势）、柱状图（对比）、饼图（占比）

### 4.6 复盘中心
- **成功案例库**：沉淀成功模式
- **失败案例库**：分类整理失败原因
- **AI优化建议**：基于历史数据的策略迭代

## 5. Component Inventory

### 导航组件
- **SidebarNav**：240px宽，白色背景，选中项橙色左边框+橙色文字
- **TopBar**：64px高，深蓝背景，白色文字

### 卡片组件
- **StatCard**：数值 + 标签 + 趋势箭头，用于首页统计
- **ProductCard**：新品列表项，包含状态标签、日期、快捷操作
- **TaskCard**：任务卡片，包含状态色边框、执行人、截止日期

### 表单组件
- **Input**：label + input + error message，聚焦时橙色边框
- **Select**：下拉选择，支持搜索
- **DatePicker**：日期选择
- **TextArea**：多行文本，用于长内容输入

### 反馈组件
- **Modal**：居中弹窗，背景遮罩
- **Toast**：右上角提示，3秒自动消失
- **Skeleton**：加载骨架屏
- **EmptyState**：空数据状态插画 + 引导文案

### 数据展示
- **Table**：带排序、分页、筛选
- **Chart**：基于 Recharts 的图表组件
- **Badge**：状态标签（进行中/已完成等）

## 6. Technical Approach

### 技术栈
- **前端**：Next.js 14 (App Router) + TypeScript + TailwindCSS
- **后端**：Next.js API Routes + Server Actions
- **数据库**：SQLite (better-sqlite3) - MVP阶段足够
- **AI**：MiniMax API (通过 mmx-cli 或直接 API 调用)
- **图标**：Lucide React

### 项目结构
```
zhengxin-promotion-platform/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页仪表盘
│   ├── products/
│   │   ├── page.tsx            # 新品列表
│   │   └── [id]/page.tsx       # 新品详情
│   ├── generator/
│   │   └── page.tsx            # AI生成器
│   ├── tasks/
│   │   └── page.tsx            # 任务中心
│   ├── analytics/
│   │   └── page.tsx            # 数据看板
│   └── review/
│       └── page.tsx            # 复盘中心
├── components/
│   ├── layout/                 # 布局组件
│   ├── ui/                     # 基础UI组件
│   ├── products/               # 新品相关组件
│   ├── generator/             # AI生成器组件
│   └── charts/                # 图表组件
├── lib/
│   ├── db.ts                   # 数据库连接
│   ├── ai.ts                   # AI调用
│   └── utils.ts                # 工具函数
├── styles/
│   └── globals.css             # 全局样式
└── types/
    └── index.ts                # 类型定义
```

### API 设计
```
GET    /api/products            # 获取新品列表
POST   /api/products            # 创建新品
GET    /api/products/:id         # 获取新品详情
PUT    /api/products/:id         # 更新新品
DELETE /api/products/:id         # 删除新品

POST   /api/generate             # AI生成推广方案
GET    /api/tasks               # 获取任务列表
PUT    /api/tasks/:id           # 更新任务状态
GET    /api/analytics           # 获取分析数据
```

### 数据模型
```typescript
// 新品
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  grossMargin: number;
  targetUser: string;
  sellingPoints: string[];
  launchDate: string;
  region: string;
  status: 'draft' | 'not_started' | 'promoting' | 'exploding' | 'review' | 'ended';
  createdAt: string;
  updatedAt: string;
}

// 推广方案
interface PromotionPlan {
  id: string;
  productId: string;
  positioning: string;
  scenes: string[];
  promotionPhases: Phase[];
  storeSop: Sop[];
  marketingAssets: Asset[];
  score: number;
  generatedAt: string;
}

// 任务
interface Task {
  id: string;
  productId: string;
  storeId: string;
  type: 'launch' | 'material' | 'promotion' | 'data_feedback';
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'abnormal';
  deadline: string;
  completedAt?: string;
}
```

## 7. MVP 优先级

### P0（必须实现）
- ✅ 首页仪表盘（统计卡片）
- ✅ 新品列表 + 新建 + 详情
- ✅ AI推广方案生成（核心）
- ✅ 简单数据看板
- ✅ 基础任务管理

### P1（第二阶段）
- AI文案生成（海报/外卖标题/话术）
- 复盘系统
- 成功率预测

### P2（后续迭代）
- 多版本A/B推广方案
- 门店行为分析
- 自动优化策略AI

---

*最后更新：2026-05-22*