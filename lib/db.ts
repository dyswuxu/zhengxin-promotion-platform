import Database from 'better-sqlite3';
import path from 'path';

// Use /tmp on Vercel (ephemeral filesystem), ./data locally
const isVercel = process.env.VERCEL === 'true';
const dataDir = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'platform.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    const fs = require('fs');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initializeSchema();
  }
  return db;
}

function initializeSchema() {
  const database = db!;

  // Products table
  database.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      cost REAL NOT NULL,
      gross_margin REAL NOT NULL,
      target_user TEXT,
      selling_points TEXT,
      launch_date TEXT,
      region TEXT,
      status TEXT DEFAULT 'draft',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Promotion plans table
  database.exec(`
    CREATE TABLE IF NOT EXISTS promotion_plans (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      positioning TEXT,
      consumer_scene TEXT,
      purchase_reason TEXT,
      selling_points TEXT,
      promotion_phases TEXT,
      store_sop TEXT,
      marketing_assets TEXT,
      score TEXT,
      generated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Tasks table
  database.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      store_id TEXT NOT NULL,
      store_name TEXT,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      deadline TEXT NOT NULL,
      description TEXT,
      completed_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Stores table
  database.exec(`
    CREATE TABLE IF NOT EXISTS stores (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      region TEXT NOT NULL,
      city TEXT DEFAULT '',
      district TEXT DEFAULT '',
      address TEXT DEFAULT '',
      manager_name TEXT DEFAULT '',
      manager_phone TEXT DEFAULT '',
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Users table (for Feishu SSO)
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      feishu_open_id TEXT UNIQUE,
      name TEXT,
      avatar_url TEXT,
      role TEXT DEFAULT 'user',
      created_at TEXT DEFAULT (datetime('now')),
      last_login TEXT
    )
  `);

  // Analytics table
  database.exec(`
    CREATE TABLE IF NOT EXISTS analytics (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      date TEXT NOT NULL,
      sales INTEGER DEFAULT 0,
      conversion_rate REAL DEFAULT 0,
      avg_order_value REAL DEFAULT 0,
      region TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);
}

// Product operations
export function createProduct(product: {
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
  status?: string;
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO products (id, name, category, price, cost, gross_margin, target_user, selling_points, launch_date, region, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    product.id,
    product.name,
    product.category,
    product.price,
    product.cost,
    product.grossMargin,
    product.targetUser,
    JSON.stringify(product.sellingPoints),
    product.launchDate,
    product.region,
    product.status || 'draft'
  );
}

export function getProducts(status?: string) {
  const db = getDb();
  let stmt;
  if (status) {
    stmt = db.prepare('SELECT * FROM products WHERE status = ? ORDER BY created_at DESC');
    return stmt.all(status);
  }
  stmt = db.prepare('SELECT * FROM products ORDER BY created_at DESC');
  return stmt.all();
}

export function getProductById(id: string) {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  return stmt.get(id);
}

export function updateProduct(id: string, updates: Record<string, unknown>) {
  const db = getDb();
  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = Object.values(updates);
  const stmt = db.prepare(`UPDATE products SET ${fields}, updated_at = datetime('now') WHERE id = ?`);
  return stmt.run(...values, id);
}

export function deleteProduct(id: string) {
  const db = getDb();
  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  return stmt.run(id);
}

// Promotion plan operations
export function savePromotionPlan(plan: {
  id: string;
  productId: string;
  positioning: string;
  consumerScene: string;
  purchaseReason: string;
  sellingPoints: string[];
  promotionPhases: unknown[];
  storeSop: unknown[];
  marketingAssets: unknown[];
  score: { popularity: number; repurchase: number; riskAlert: string };
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO promotion_plans (id, product_id, positioning, consumer_scene, purchase_reason, selling_points, promotion_phases, store_sop, marketing_assets, score, generated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);
  return stmt.run(
    plan.id,
    plan.productId,
    plan.positioning,
    plan.consumerScene,
    plan.purchaseReason,
    JSON.stringify(plan.sellingPoints),
    JSON.stringify(plan.promotionPhases),
    JSON.stringify(plan.storeSop),
    JSON.stringify(plan.marketingAssets),
    JSON.stringify(plan.score)
  );
}

export function getPromotionPlanByProductId(productId: string) {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM promotion_plans WHERE product_id = ? ORDER BY generated_at DESC LIMIT 1');
  return stmt.get(productId);
}

// Task operations
export function createTask(task: {
  id: string;
  productId: string;
  storeId: string;
  storeName?: string;
  type: string;
  deadline: string;
  description?: string;
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO tasks (id, product_id, store_id, store_name, type, deadline, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    task.id,
    task.productId,
    task.storeId,
    task.storeName || '',
    task.type,
    task.deadline,
    task.description || ''
  );
}

export function getTasks(filters?: { productId?: string; status?: string }) {
  const db = getDb();
  let sql = 'SELECT t.*, p.name as product_name FROM tasks t LEFT JOIN products p ON t.product_id = p.id WHERE 1=1';
  const params: string[] = [];

  if (filters?.productId) {
    sql += ' AND t.product_id = ?';
    params.push(filters.productId);
  }
  if (filters?.status) {
    sql += ' AND t.status = ?';
    params.push(filters.status);
  }

  sql += ' ORDER BY t.deadline ASC';
  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

export function updateTaskStatus(id: string, status: string, completedAt?: string) {
  const db = getDb();
  let sql = 'UPDATE tasks SET status = ?';
  const params: string[] = [status];

  if (completedAt) {
    sql += ', completed_at = ?';
    params.push(completedAt);
  }

  sql += ' WHERE id = ?';
  params.push(id);

  const stmt = db.prepare(sql);
  return stmt.run(...params);
}

export function getTaskById(id: string) {
  const db = getDb();
  const stmt = db.prepare('SELECT t.*, p.name as product_name FROM tasks t LEFT JOIN products p ON t.product_id = p.id WHERE t.id = ?');
  return stmt.get(id);
}

// Analytics operations
export function saveAnalytics(data: {
  id: string;
  productId: string;
  date: string;
  sales: number;
  conversionRate: number;
  avgOrderValue: number;
  region: string;
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO analytics (id, product_id, date, sales, conversion_rate, avg_order_value, region)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    data.id,
    data.productId,
    data.date,
    data.sales,
    data.conversionRate,
    data.avgOrderValue,
    data.region
  );
}

export function getAnalytics(productId?: string) {
  const db = getDb();
  let stmt;
  if (productId) {
    stmt = db.prepare('SELECT * FROM analytics WHERE product_id = ? ORDER BY date DESC');
    return stmt.all(productId);
  }
  stmt = db.prepare(`
    SELECT a.*, p.name as product_name
    FROM analytics a
    LEFT JOIN products p ON a.product_id = p.id
    ORDER BY a.date DESC
  `);
  return stmt.all();
}