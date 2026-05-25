import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

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
        'Content-Disposition': 'attachment; filename="store_import_template.xlsx"',
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