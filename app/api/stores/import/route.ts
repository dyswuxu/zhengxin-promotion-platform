import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
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

    // Insert stores into database
    const db = getDb();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO stores (id, name, region, city, district, address, manager_name, manager_phone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let count = 0;
    for (const row of data) {
      const id = uuidv4();
      const name = row['门店名称'] || row['name'] || '';
      const region = row['区域'] || row['region'] || '';
      const city = row['城市'] || row['city'] || '';
      const district = row['区县'] || row['district'] || '';
      const address = row['地址'] || row['address'] || '';
      const managerName = row['店长姓名'] || row['manager_name'] || '';
      const managerPhone = row['店长电话'] || row['manager_phone'] || '';

      if (!name || !region) {
        continue; // Skip rows without required fields
      }

      stmt.run(id, name, region, city, district, address, managerName, managerPhone, 'active');
      count++;
    }

    return NextResponse.json({
      success: true,
      count,
      message: `成功导入 ${count} 家门店`,
    });
  } catch (error) {
    console.error('Store import error:', error);
    return NextResponse.json(
      { error: '导入失败，请检查文件格式' },
      { status: 500 }
    );
  }
}

// Download template
export async function GET() {
  try {
    // Create template workbook
    const workbook = XLSX.utils.book_new();
    const templateData = [
      {
        '门店名称': '正新鸡排-徐州泉山区店',
        '区域': '华东',
        '城市': '徐州',
        '区县': '泉山区',
        '地址': '淮海西路100号',
        '店长姓名': '张三',
        '店长电话': '13800138000',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    XLSX.utils.book_append_sheet(workbook, worksheet, '门店数据');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="门店导入模板.xlsx"',
      },
    });
  } catch (error) {
    console.error('Template download error:', error);
    return NextResponse.json(
      { error: '模板下载失败' },
      { status: 500 }
    );
  }
}