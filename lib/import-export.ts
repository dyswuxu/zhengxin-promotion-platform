// Data import/export utilities for Excel files
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from './db';

interface ProductData {
  name: string;
  category: string;
  price: number;
  cost: number;
  targetUser: string;
  sellingPoints: string[];
  launchDate: string;
  region: string;
}

interface StoreData {
  name: string;
  region: string;
  city: string;
  district: string;
  address: string;
  managerName: string;
  managerPhone: string;
}

// Export products to Excel
export function exportProductsToExcel(products: any[]): Buffer {
  const workbook = XLSX.utils.book_new();

  const exportData = products.map(p => ({
    '新品名称': p.name,
    '类别': p.category,
    '售价': p.price,
    '成本': p.cost,
    '毛利率': `${p.grossMargin?.toFixed(1) || 0}%`,
    '目标人群': p.targetUser,
    '卖点': Array.isArray(p.sellingPoints) ? p.sellingPoints.join('、') : p.sellingPoints,
    '上市时间': p.launchDate,
    '区域': p.region,
    '状态': getStatusText(p.status),
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  XLSX.utils.book_append_sheet(workbook, worksheet, '新品列表');

  // Add summary sheet
  const summaryData = [
    { '统计项': '新品总数', '数值': products.length },
    { '统计项': '进行中', '数值': products.filter(p => p.status === 'promoting').length },
    { '统计项': '爆发中', '数值': products.filter(p => p.status === 'exploding').length },
    { '统计项': '已结束', '数值': products.filter(p => ['review', 'ended'].includes(p.status)).length },
    { '统计项': '平均毛利率', '数值': `${(products.reduce((sum, p) => sum + (p.grossMargin || 0), 0) / products.length).toFixed(1)}%` },
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, '统计摘要');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

// Export tasks to Excel
export function exportTasksToExcel(tasks: any[]): Buffer {
  const workbook = XLSX.utils.book_new();

  const exportData = tasks.map(t => ({
    '任务描述': t.description,
    '所属新品': t.productName,
    '执行门店': t.storeName,
    '任务类型': getTaskTypeText(t.type),
    '状态': getTaskStatusText(t.status),
    '截止时间': t.deadline,
    '完成时间': t.completedAt || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  XLSX.utils.book_append_sheet(workbook, worksheet, '任务列表');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

// Export stores to Excel
export function exportStoresToExcel(stores: any[]): Buffer {
  const workbook = XLSX.utils.book_new();

  const exportData = stores.map(s => ({
    '门店名称': s.name,
    '区域': s.region,
    '城市': s.city,
    '区县': s.district,
    '地址': s.address,
    '店长姓名': s.managerName,
    '店长电话': s.managerPhone,
    '状态': s.status === 'active' ? '营业中' : '已关闭',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  XLSX.utils.book_append_sheet(workbook, worksheet, '门店列表');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

// Import products from Excel file
export async function importProductsFromExcel(buffer: Uint8Array | Buffer): Promise<{ success: number; failed: number; errors: string[] }> {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as any[];

  const db = getDb();
  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    try {
      const name = row['新品名称'] || row['name'];
      const category = row['类别'] || row['category'] || '鸡排';
      const price = parseFloat(row['售价'] || row['price']);
      const cost = parseFloat(row['成本'] || row['cost']);

      if (!name || isNaN(price) || isNaN(cost)) {
        errors.push(`行${i + 2}: 缺少必填字段（名称或价格）`);
        failed++;
        continue;
      }

      const grossMargin = ((price - cost) / price) * 100;
      const targetUser = row['目标人群'] || row['targetUser'] || '';
      const sellingPoints = (row['卖点'] || row['sellingPoints'] || '').split(/[,、;]/).filter(Boolean);
      const launchDate = row['上市时间'] || row['launchDate'] || new Date().toISOString().split('T')[0];
      const region = row['区域'] || row['region'] || '全国';

      db.prepare(`
        INSERT INTO products (id, name, category, price, cost, gross_margin, target_user, selling_points, launch_date, region, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', datetime('now'), datetime('now'))
      `).run(
        uuidv4(),
        name,
        category,
        price,
        cost,
        grossMargin,
        targetUser,
        JSON.stringify(sellingPoints),
        launchDate,
        region
      );

      success++;
    } catch (error: any) {
      errors.push(`行${i + 2}: ${error.message}`);
      failed++;
    }
  }

  return { success, failed, errors };
}

// Import stores from Excel file
export async function importStoresFromExcel(buffer: Uint8Array | Buffer): Promise<{ success: number; failed: number; errors: string[] }> {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as any[];

  const db = getDb();
  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    try {
      const name = row['门店名称'] || row['name'];
      const region = row['区域'] || row['region'];

      if (!name || !region) {
        errors.push(`行${i + 2}: 缺少必填字段（名称或区域）`);
        failed++;
        continue;
      }

      db.prepare(`
        INSERT OR REPLACE INTO stores (id, name, region, city, district, address, manager_name, manager_phone, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', datetime('now'), datetime('now'))
      `).run(
        uuidv4(),
        name,
        region,
        row['城市'] || '',
        row['区县'] || '',
        row['地址'] || '',
        row['店长姓名'] || '',
        row['店长电话'] || ''
      );

      success++;
    } catch (error: any) {
      errors.push(`行${i + 2}: ${error.message}`);
      failed++;
    }
  }

  return { success, failed, errors };
}

// Generate product template
export function generateProductTemplate(): Buffer {
  const workbook = XLSX.utils.book_new();

  const templateData = [
    {
      '新品名称': '示例：藤椒鸡排',
      '类别': '鸡排',
      '售价': '18',
      '成本': '7',
      '目标人群': '年轻白领、学生',
      '卖点': '麻香微辣|外酥里嫩|性价比高',
      '上市时间': '2026-06-01',
      '区域': '华东',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  XLSX.utils.book_append_sheet(workbook, worksheet, '新品数据');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

// Generate store template
export function generateStoreTemplate(): Buffer {
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

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

// Helper functions
function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    draft: '草稿',
    not_started: '未开始',
    promoting: '推广中',
    exploding: '爆发',
    review: '复盘',
    ended: '已结束',
  };
  return statusMap[status] || status;
}

function getTaskTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    launch: '上新执行',
    material: '物料张贴',
    promotion: '促销执行',
    data_feedback: '数据回传',
  };
  return typeMap[type] || type;
}

function getTaskStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '未开始',
    in_progress: '进行中',
    completed: '已完成',
    delayed: '延迟',
    abnormal: '异常',
  };
  return statusMap[status] || status;
}