import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createProduct } from '@/lib/db';
import * as XLSX from 'xlsx';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '未选择文件' },
        { status: 400 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet) as any[];

    if (!data.length) {
      return NextResponse.json(
        { error: '文件中没有数据' },
        { status: 400 }
      );
    }

    // Insert products into database
    let count = 0;
    for (const row of data) {
      const name = row['产品名称'] || row['name'] || '';
      const category = row['类别'] || row['category'] || '鸡排';
      const price = parseFloat(row['售价'] || row['price'] || '0');
      const cost = parseFloat(row['成本'] || row['cost'] || '0');

      if (!name || price <= 0) {
        continue; // Skip rows without required fields
      }

      const grossMargin = ((price - cost) / price) * 100;
      const launchDate = row['上市时间'] || row['launchDate'] || new Date().toISOString().split('T')[0];
      const region = row['推广区域'] || row['region'] || '全国';
      const targetUser = row['目标人群'] || row['targetUser'] || '';
      const sellingPoints = row['核心卖点'] || row['sellingPoints'] || '';
      const sellingPointsArray = sellingPoints ? sellingPoints.split(/[,，]/).filter((s: string) => s.trim()) : [];

      createProduct({
        id: uuidv4(),
        name,
        category,
        price,
        cost,
        grossMargin,
        targetUser,
        sellingPoints: sellingPointsArray,
        launchDate,
        region,
        status: 'not_started',
      });
      count++;
    }

    return NextResponse.json({
      success: true,
      count,
      message: `成功导入 ${count} 个新品`,
    });
  } catch (error) {
    console.error('Product import error:', error);
    return NextResponse.json(
      { error: '导入失败，请检查文件格式' },
      { status: 500 }
    );
  }
}

// Download template
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'template') {
      // Create template workbook
      const workbook = XLSX.utils.book_new();
      const templateData = [
        {
          '产品名称': '新品示例',
          '类别': '鸡排',
          '售价': '18',
          '成本': '8',
          '目标人群': '年轻白领',
          '核心卖点': '口味好,价格实惠',
          '上市时间': '2026-06-01',
          '推广区域': '华东',
        },
      ];

      const worksheet = XLSX.utils.json_to_sheet(templateData);
      XLSX.utils.book_append_sheet(workbook, worksheet, '新品数据');

      // Auto-adjust column widths
      const colWidths = [
        { wch: 15 }, // 产品名称
        { wch: 10 }, // 类别
        { wch: 10 }, // 售价
        { wch: 10 }, // 成本
        { wch: 15 }, // 目标人群
        { wch: 20 }, // 核心卖点
        { wch: 15 }, // 上市时间
        { wch: 10 }, // 推广区域
      ];
      worksheet['!cols'] = colWidths;

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="product_import_template.xlsx"',
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Template download error:', error);
    return NextResponse.json(
      { error: '模板下载失败' },
      { status: 500 }
    );
  }
}