# 正新新品推广作战平台

AI驱动的新品推广管理系统，帮助正新鸡排团队高效管理新品推广全流程。

## 功能特性

- 📦 **新品管理中心** - 管理所有新品，支持状态筛选和搜索
- 🤖 **AI推广生成器** - 输入产品信息，AI自动生成完整推广方案
- ✅ **推广任务系统** - 追踪任务执行，支持状态更新和飞书通知
- 📊 **数据看板** - 查看核心指标和销量趋势
- 🔄 **复盘中心** - 沉淀成功与失败经验，优化未来策略
- 🏪 **门店管理** - 批量导入门店数据，统一管理

## 技术栈

- **前端**: Next.js 14 + TypeScript + TailwindCSS
- **数据库**: SQLite (better-sqlite3)
- **AI**: MiniMax API
- **图标**: Lucide React
- **图表**: Recharts

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 启动生产服务
npm run start
```

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── products/          # 新品管理
│   ├── generator/          # AI推广生成器
│   ├── tasks/              # 推广任务
│   ├── stores/             # 门店管理
│   └── api/                # API路由
├── components/             # React组件
├── lib/                    # 工具函数和业务逻辑
├── types/                  # TypeScript类型
└── data/                   # SQLite数据库
```

## 配置说明

复制 `.env.local.example` 为 `.env.local` 并填写配置：

- `FEISHU_APP_ID` - 飞书应用ID
- `FEISHU_APP_SECRET` - 飞书应用密钥
- `DATABASE_PATH` - 数据库路径

## 访问地址

开发环境: http://localhost:3000

## License

MIT