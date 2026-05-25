import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    const db = getDb();
    const stores = db.prepare('SELECT * FROM stores ORDER BY region, name').all() as Array<{
      id: string;
      name: string;
      region: string;
      city: string;
      district: string;
      address: string;
      manager_name: string;
      manager_phone: string;
      status: string;
    }>;

    if (stores.length === 0) {
      return NextResponse.json(
        { error: '暂无门店数据' },
        { status: 404 }
      );
    }

    // Convert to Excel format
    const excelData = stores.map(store => ({
      '门店名称': store.name,
      '区域': store.region,
      '城市': store.city || '',
      '区县': store.district || '',
      '地址': store.address || '',
      '店长姓名': store.manager_name || '',
      '店长电话': store.manager_phone || '',
      '状态': store.status === 'active' ? '活跃' : store.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '门店数据');

    // Auto-adjust column widths
    const colWidths = [
      { wch: 20 }, // 门店名称
      { wch: 10 }, // 区域
      { wch: 12 }, // 城市
      { wch: 12 }, // 区县
      { wch: 30 }, // 地址
      { wch: 12 }, // 店长姓名
      { wch: 15 }, // 店长电话
      { wch: 10 }, // 状态
    ];
    worksheet['!cols'] = colWidths;

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="stores_export.xlsx"',
      },
    });
  } catch (error) {
    console.error('Store export error:', error);
    return NextResponse.json(
      { error: '导出门店数据失败' },
      { status: 500 }
    );
  }
}