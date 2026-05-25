import { NextResponse } from 'next/server';
import { importProductsFromExcel, generateProductTemplate } from '@/lib/import-export';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '请选择文件' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uint8Array = new Uint8Array(buffer);

    const result = await importProductsFromExcel(uint8Array);

    return NextResponse.json({
      success: true,
      count: result.success,
      failedCount: result.failed,
      errors: result.errors.slice(0, 10), // Limit error messages
    });
  } catch (error) {
    console.error('Import products error:', error);
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
    const downloadTemplate = searchParams.get('download');

    if (downloadTemplate === 'template') {
      const buffer = generateProductTemplate();
      const uint8Array = new Uint8Array(buffer);
      return new NextResponse(uint8Array, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="新品导入模板.xlsx"',
        },
      });
    }

    return NextResponse.json({ message: 'Use POST to import products' });
  } catch (error) {
    console.error('Generate template error:', error);
    return NextResponse.json(
      { error: '模板生成失败' },
      { status: 500 }
    );
  }
}