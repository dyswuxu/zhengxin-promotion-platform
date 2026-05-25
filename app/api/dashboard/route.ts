import { NextResponse } from 'next/server';
import { getProducts, getTasks, getAnalytics } from '@/lib/db';

export async function GET() {
  try {
    // Get stats
    const products = getProducts() as Array<{
      id: string;
      name: string;
      status: string;
      price: number;
      created_at: string;
    }>;
    const tasks = getTasks() as Array<{ status: string }>;
    const analytics = getAnalytics() as Array<{ sales: number }>;

    // Calculate success rate (products in exploding/review status)
    const successCount = products.filter(p =>
      ['exploding', 'review', 'ended'].includes(p.status)
    ).length;
    const successRate = products.length > 0
      ? Math.round((successCount / products.length) * 100)
      : 78; // default

    // Calculate total sales
    const totalSales = analytics.reduce((sum, a) => sum + (a.sales || 0), 0);

    // Top products (mock data for MVP)
    const topProducts = [
      { name: '韩式炸鸡（新品）', sales: 12580, trend: 'up' as const },
      { name: '藤椒鸡排', sales: 9870, trend: 'up' as const },
      { name: '香辣鸡排', sales: 8540, trend: 'down' as const },
      { name: '蜂蜜芥末鸡排', sales: 6230, trend: 'up' as const },
      { name: '原味鸡排', sales: 4120, trend: 'down' as const },
    ];

    // Alerts (mock data for MVP)
    const alerts = [
      { productName: '藤椒鸡排', message: '徐州泉山区门店执行率低于60%' },
      { productName: '香辣鸡排', message: '今日销量环比下降15%，需要关注' },
    ];

    return NextResponse.json({
      totalProducts: products.length || 8,
      successRate: `${successRate}%`,
      topProducts,
      alerts,
      totalSales,
      pendingTasks: tasks.filter(t => t.status === 'pending').length,
      inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}