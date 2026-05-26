import { NextResponse } from 'next/server';
import { getTasks } from '@/lib/db';
import { exportTasksToExcel } from '@/lib/import-export';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || undefined;
    const status = searchParams.get('status') || undefined;

    const tasks = getTasks({ productId, status }) as any[];

    // Normalize tasks data
    const normalizedTasks = tasks.map(t => ({
      id: t.id,
      description: t.description,
      productName: t.product_name,
      storeName: t.store_name,
      type: t.type,
      status: t.status,
      deadline: t.deadline,
      completedAt: t.completed_at,
    }));

    const buffer = exportTasksToExcel(normalizedTasks);
    const uint8Array = new Uint8Array(buffer);

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': "attachment; filename*=UTF-8''tasks.xlsx",
      },
    });
  } catch (error) {
    console.error('Export tasks error:', error);
    return NextResponse.json(
      { error: '导出失败' },
      { status: 500 }
    );
  }
}