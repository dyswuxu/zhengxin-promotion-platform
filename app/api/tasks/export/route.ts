import { NextResponse } from 'next/server';
import { getTasks } from '@/lib/db';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    const tasks = getTasks() as Array<{
      id: string;
      product_name: string;
      store_name: string;
      type: string;
      status: string;
      deadline: string;
      description: string;
      completed_at?: string;
    }>;

    if (tasks.length === 0) {
      return NextResponse.json(
        { error: '暂无任务数据' },
        { status: 404 }
      );
    }

    // Convert to Excel format
    const typeMap: Record<string, string> = {
      launch: '上新执行',
      material: '物料张贴',
      promotion: '促销执行',
      data_feedback: '数据回传',
    };

    const statusMap: Record<string, string> = {
      pending: '未开始',
      in_progress: '进行中',
      completed: '已完成',
      delayed: '延迟',
      abnormal: '异常',
    };

    const excelData = tasks.map(task => ({
      '新品名称': task.product_name || '',
      '门店名称': task.store_name || '',
      '任务类型': typeMap[task.type] || task.type,
      '任务状态': statusMap[task.status] || task.status,
      '截止日期': task.deadline || '',
      '任务描述': task.description || '',
      '完成时间': task.completed_at || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '任务数据');

    // Auto-adjust column widths
    const colWidths = [
      { wch: 20 }, // 新品名称
      { wch: 20 }, // 门店名称
      { wch: 12 }, // 任务类型
      { wch: 12 }, // 任务状态
      { wch: 15 }, // 截止日期
      { wch: 30 }, // 任务描述
      { wch: 20 }, // 完成时间
    ];
    worksheet['!cols'] = colWidths;

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="tasks_export.xlsx"',
      },
    });
  } catch (error) {
    console.error('Task export error:', error);
    return NextResponse.json(
      { error: '导出任务数据失败' },
      { status: 500 }
    );
  }
}