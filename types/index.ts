// Product types
export interface Product {
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
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export type ProductStatus = 'draft' | 'not_started' | 'promoting' | 'exploding' | 'review' | 'ended';

export const ProductStatusLabel: Record<ProductStatus, string> = {
  draft: '草稿',
  not_started: '未开始',
  promoting: '推广中',
  exploding: '爆发',
  review: '复盘',
  ended: '已结束',
};

export const ProductStatusColor: Record<ProductStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  not_started: 'bg-blue-100 text-blue-600',
  promoting: 'bg-accent-light/20 text-accent',
  exploding: 'bg-success/20 text-success',
  review: 'bg-warning/20 text-warning',
  ended: 'bg-gray-100 text-muted',
};

// Promotion Plan types
export interface PromotionPhase {
  name: string;
  period: string;
  description: string;
  actions: string[];
}

export interface StoreSop {
  title: string;
  content: string[];
}

export interface MarketingAsset {
  type: 'poster' | 'social' | 'delivery' | 'banner';
  title: string;
  content: string;
}

export interface PromotionPlan {
  id: string;
  productId: string;
  positioning: string;
  consumerScene: string;
  purchaseReason: string;
  sellingPoints: string[];
  promotionPhases: PromotionPhase[];
  storeSop: StoreSop[];
  marketingAssets: MarketingAsset[];
  score: {
    popularity: number;
    repurchase: number;
    riskAlert: string;
  };
  generatedAt: string;
}

// Task types
export interface Task {
  id: string;
  productId: string;
  productName?: string;
  storeId: string;
  storeName?: string;
  type: TaskType;
  status: TaskStatus;
  deadline: string;
  description: string;
  completedAt?: string;
  createdAt: string;
}

export type TaskType = 'launch' | 'material' | 'promotion' | 'data_feedback';

export const TaskTypeLabel: Record<TaskType, string> = {
  launch: '上新执行',
  material: '物料张贴',
  promotion: '促销执行',
  data_feedback: '数据回传',
};

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'delayed' | 'abnormal';

export const TaskStatusLabel: Record<TaskStatus, string> = {
  pending: '未开始',
  in_progress: '进行中',
  completed: '已完成',
  delayed: '延迟',
  abnormal: '异常',
};

export const TaskStatusColor: Record<TaskStatus, string> = {
  pending: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-600',
  completed: 'bg-success/20 text-success',
  delayed: 'bg-warning/20 text-warning',
  abnormal: 'bg-error/20 text-error',
};

// Analytics types
export interface AnalyticsData {
  totalProducts: number;
  successRate: number;
  topProducts: Array<{ name: string; sales: number; trend: 'up' | 'down' }>;
  alerts: Array<{ productId: string; productName: string; message: string }>;
  salesTrend: Array<{ date: string; value: number }>;
}

// Form types
export interface ProductFormData {
  name: string;
  category: string;
  price: string;
  cost: string;
  targetUser: string;
  sellingPoints: string;
  launchDate: string;
  region: string;
}