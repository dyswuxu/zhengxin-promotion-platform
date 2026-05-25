# 正新新品推广作战平台 - 开发进展记录

## 项目信息
- **项目路径**: `~/.openclaw/workspaces/bot3/projects/正新新品推广作战平台`
- **启动命令**: `npm run start -- -p 3002`
- **访问地址**: http://localhost:3002
- **最后更新**: 2026-05-25

---

## 功能完成状态

### P0 核心功能 ✅
| 功能 | 状态 | 路径 |
|------|------|------|
| 新品管理中心 | ✅ 完成 | /products |
| AI推广生成器 | ✅ 完成 | /generator |
| 新品详情页 | ✅ 完成 | /products/[id] |
| 推广任务系统 | ✅ 完成 | /tasks |
| 数据看板 | ✅ 完成 | /analytics |
| 复盘中心 | ✅ 完成 | /review |
| 首页仪表盘 | ✅ 完成 | / |
| 系统设置 | ✅ 完成 | /settings |
| 门店管理 | ✅ 完成 | /stores |
| 飞书登录 | ✅ 完成 | /login |

### P1 数据导入/导出 ✅
| 功能 | 状态 | 路径 |
|------|------|------|
| 新品导出 | ✅ 完成 | /api/export-products |
| 新品导入 | ✅ 完成 | /api/products/import |
| 新品模板下载 | ✅ 完成 | /api/products/import?type=template |
| 任务导出 | ✅ 完成 | /api/tasks/export |
| 门店导入 | ✅ 完成 | /api/stores/import |
| 门店导出 | ✅ 完成 | /api/stores/export |
| 门店模板下载 | ✅ 完成 | /api/stores/template |

### P1 飞书消息通知 ✅
| 功能 | 状态 | 说明 |
|------|------|------|
| 通知模块 | ✅ 完成 | lib/feishu-notify.ts |
| 任务状态变更通知 | ✅ 完成 | 已集成到 /api/tasks/[id] PUT |
| 卡片消息格式 | ✅ 完成 | 支持查看详情按钮 |

---

## 技术说明

### 技术栈
- **前端**: Next.js 14 + TypeScript + TailwindCSS
- **数据库**: SQLite (better-sqlite3)
- **AI**: MiniMax API（via mmx CLI）
- **图标**: Lucide React
- **图表**: Recharts

### 飞书配置
- **App ID**: cli_a933baa1df639bde
- **配置文件**: .env.local

### 数据库
- **路径**: ./data/platform.db
- **表**: products, promotion_plans, tasks, stores, users, analytics

---

## 本次优化内容（2026-05-25）

### 1. AI生成真实调用修复 ✅
- 问题：之前AI调用失败后降级到模拟数据，且模拟数据模板化
- 修复：
  - 优化了JSON解析逻辑，能正确处理AI返回的markdown包装内容
  - 优化了prompt，让AI直接输出纯JSON
  - 新增fallback机制，即使部分解析失败也能提取关键字段
- 结果：每次生成的内容都是真实的、基于产品信息的AI生成结果

### 2. 飞书消息通知集成 ✅
- 任务状态变更时自动发送飞书通知
- 通知内容包含：任务名称、所属新品、状态、截止时间
- 使用卡片消息格式（支持查看详情按钮）
- 发送到 boss 的 open_id

### 3. 门店管理页面重构 ✅
- 新增门店列表展示（支持搜索、区域筛选）
- 新增门店统计：总数、活跃数、覆盖区域数
- 新增导入模板下载功能（/api/stores/template）
- 新增门店导出功能（/api/stores/export）
- 导入状态反馈（成功/失败提示）
- 导入说明提示

### 4. 修复新品详情页 ✅
- 问题：点击新品卡片后页面报错 "Application error"
- 原因：API返回字段名与前端类型不匹配
  - gross_margin vs grossMargin
  - launch_date vs launchDate
- 修复：重写了 `/api/products/[id]/route.ts` 的字段映射

### 5. 修复下载/导出功能 ✅
- 新品模板下载：创建 `/api/products/import` API，支持 `?type=template`
- 任务导出：创建 `/api/tasks/export` API
- 门店模板下载：改用ASCII文件名避免HTTP header中文乱码
- 门店导出：数据库无数据时返回404（正常行为）

---

## API 路由清单

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /api/products | 获取所有新品 |
| POST | /api/products | 创建新品 |
| GET | /api/products/[id] | 获取单个新品 |
| PUT | /api/products/[id] | 更新新品 |
| GET | /api/products/[id]/plan | 获取推广方案 |
| GET | /api/products/import?type=template | 下载新品导入模板 |
| POST | /api/products/import | 导入新品Excel |
| GET | /api/export-products | 导出新品Excel |
| GET | /api/tasks | 获取任务列表 |
| PUT | /api/tasks/[id] | 更新任务状态（含飞书通知） |
| GET | /api/tasks/export | 导出任务Excel |
| GET | /api/stores | 获取门店列表 |
| POST | /api/stores/import | 导入门店Excel |
| GET | /api/stores/template | 下载门店导入模板 |
| GET | /api/stores/export | 导出门店Excel |
| GET | /api/dashboard | 首页仪表盘数据 |
| GET | /api/analytics | 数据看板 |
| GET | /api/auth/feishu/login | 飞书登录入口 |
| GET | /api/auth/feishu/callback | 飞书登录回调 |

---

## 待优化项（后续）

1. **真实数据导入** - 目前只有测试数据，需要导入真实产品、门店数据
2. **通知中心** - 集中展示所有未读通知，支持已读/未读管理
3. **数据看板真实化** - 目前是模拟数据，需要接入真实销售数据
4. **AI生成质量提升** - 优化prompt让生成的方案更贴合产品特点和区域特性
5. **批量操作** - 支持批量更新状态、批量删除
6. **操作日志** - 记录谁在什么时候做了什么操作
7. **强制登录** - 目前所有页面公开访问，可加入登录验证

---

## 项目结构

```
正新新品推广作战平台/
├── app/
│   ├── page.tsx                    # 首页
│   ├── products/
│   │   ├── page.tsx               # 新品列表
│   │   └── [id]/page.tsx          # 新品详情
│   ├── generator/page.tsx          # AI推广生成器
│   ├── tasks/page.tsx              # 推广任务
│   ├── analytics/page.tsx           # 数据看板
│   ├── review/page.tsx              # 复盘中心
│   ├── stores/page.tsx             # 门店管理
│   ├── login/page.tsx              # 飞书登录
│   ├── settings/page.tsx           # 系统设置
│   └── api/                        # API路由
│       ├── products/
│       ├── tasks/
│       ├── stores/
│       ├── dashboard/
│       └── auth/
├── components/
│   └── layout/
│       ├── Sidebar.tsx
│       └── TopBar.tsx
├── lib/
│   ├── db.ts                       # 数据库
│   ├── ai.ts                       # AI生成
│   ├── feishu-notify.ts            # 飞书通知
│   └── utils.ts                    # 工具函数
├── types/
│   └── index.ts                    # 类型定义
├── data/
│   └── platform.db                 # SQLite数据库
└── PROGRESS.md                    # 本文件
```