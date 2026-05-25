import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { generatePromotionPlan } from '@/lib/ai';
import { createProduct, savePromotionPlan, createTask } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.category || !body.price || !body.cost) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, price, cost' },
        { status: 400 }
      );
    }

    const productId = uuidv4();
    const price = parseFloat(body.price);
    const cost = parseFloat(body.cost);
    const grossMargin = ((price - cost) / price) * 100;

    // Parse selling points from newline-separated string
    const sellingPoints = body.sellingPoints
      ? body.sellingPoints.split('\n').filter((s: string) => s.trim())
      : [];

    // Create product first
    createProduct({
      id: productId,
      name: body.name,
      category: body.category,
      price,
      cost,
      grossMargin,
      targetUser: body.targetUser || '',
      sellingPoints,
      launchDate: body.launchDate || new Date().toISOString().split('T')[0],
      region: body.region || '全国',
      status: 'not_started',
    });

    // Generate promotion plan
    const plan = await generatePromotionPlan({
      productName: body.name,
      category: body.category,
      price,
      cost,
      targetUser: body.targetUser || '',
      sellingPoints,
      launchDate: body.launchDate || new Date().toISOString().split('T')[0],
      region: body.region || '全国',
    });

    // Save promotion plan
    const planId = uuidv4();
    savePromotionPlan({
      id: planId,
      productId,
      positioning: plan.positioning,
      consumerScene: plan.consumerScene,
      purchaseReason: plan.purchaseReason,
      sellingPoints: plan.sellingPoints,
      promotionPhases: plan.promotionPhases,
      storeSop: plan.storeSop,
      marketingAssets: plan.marketingAssets,
      score: plan.score,
    });

    // Create default tasks
    const launchDate = body.launchDate || new Date().toISOString().split('T')[0];
    const tasks = [
      {
        id: uuidv4(),
        productId,
        storeId: 'store_001',
        storeName: '徐州泉山区门店（示例）',
        type: 'material',
        deadline: new Date(new Date(launchDate).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: `「${body.name}」物料张贴与预热准备`,
      },
      {
        id: uuidv4(),
        productId,
        storeId: 'store_001',
        storeName: '徐州泉山区门店（示例）',
        type: 'launch',
        deadline: launchDate,
        description: `「${body.name}」新品正式上市执行`,
      },
      {
        id: uuidv4(),
        productId,
        storeId: 'store_001',
        storeName: '徐州泉山区门店（示例）',
        type: 'promotion',
        deadline: launchDate,
        description: `「${body.name}」首发优惠活动执行`,
      },
      {
        id: uuidv4(),
        productId,
        storeId: 'store_001',
        storeName: '徐州泉山区门店（示例）',
        type: 'data_feedback',
        deadline: new Date(new Date(launchDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: `「${body.name}」首周销售数据回传`,
      },
    ];

    for (const task of tasks) {
      createTask(task);
    }

    return NextResponse.json({
      success: true,
      productId,
      planId,
      plan,
    });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: 'Failed to generate promotion plan' },
      { status: 500 }
    );
  }
}