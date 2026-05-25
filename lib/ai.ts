// AI generation module for promotion plans
// Uses MiniMax API via mmx CLI

interface GenerateInput {
  productName: string;
  category: string;
  price: number;
  cost: number;
  targetUser: string;
  sellingPoints: string[];
  launchDate: string;
  region: string;
}

interface GenerateOutput {
  positioning: string;
  consumerScene: string;
  purchaseReason: string;
  sellingPoints: string[];
  promotionPhases: Array<{
    name: string;
    period: string;
    description: string;
    actions: string[];
  }>;
  storeSop: Array<{
    title: string;
    content: string[];
  }>;
  marketingAssets: Array<{
    type: 'poster' | 'social' | 'delivery' | 'banner';
    title: string;
    content: string;
  }>;
  score: {
    popularity: number;
    repurchase: number;
    riskAlert: string;
  };
}

// Call MiniMax AI via mmx CLI
async function callMiniMaxAI(prompt: string): Promise<string> {
  const { execSync } = require('child_process');

  try {
    const result = execSync(
      `mmx text chat --message "user:${prompt}" --output json --quiet --non-interactive`,
      {
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        timeout: 60000, // 60 second timeout
      }
    );

    const response = JSON.parse(result);
    return response.content || response.message || result;
  } catch (error: any) {
    console.error('MiniMax API call failed:', error.message);
    throw new Error(`AI API调用失败: ${error.message}`);
  }
}

// Parse AI response to extract structured JSON
function parseAIResponse(response: string): any {
  // Clean the response first
  let jsonStr = response.trim();

  // Remove markdown code blocks if present
  if (jsonStr.startsWith('```json')) {
    jsonStr = jsonStr.slice(7);
  } else if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.slice(3);
  }
  if (jsonStr.endsWith('```')) {
    jsonStr = jsonStr.slice(0, -3);
  }
  jsonStr = jsonStr.trim();

  // Remove any leading explanation text before JSON
  const jsonStart = jsonStr.indexOf('{');
  if (jsonStart > 0) {
    jsonStr = jsonStr.slice(jsonStart);
  }

  // Remove any text after JSON
  const jsonEnd = jsonStr.lastIndexOf('}');
  if (jsonEnd > 0 && jsonEnd < jsonStr.length - 1) {
    jsonStr = jsonStr.slice(0, jsonEnd + 1);
  }

  try {
    return JSON.parse(jsonStr);
  } catch {
    console.error('JSON parse failed, attempting fallback extraction');
    return extractJsonFallback(jsonStr);
  }
}

// Fallback: try to extract partial JSON for key fields
function extractJsonFallback(text: string): any {
  const result: any = {};

  // Try to find positioning
  const positioningMatch = text.match(/"positioning"\s*:\s*"([^"]+)"/);
  if (positioningMatch) result.positioning = positioningMatch[1];

  // Try to find consumerScene
  const consumerMatch = text.match(/"consumerScene"\s*:\s*"([^"]+)"/);
  if (consumerMatch) result.consumerScene = consumerMatch[1];

  // Try to find purchaseReason
  const reasonMatch = text.match(/"purchaseReason"\s*:\s*"([^"]+)"/);
  if (reasonMatch) result.purchaseReason = reasonMatch[1];

  // Try to extract sellingPoints array
  const sellingMatch = text.match(/"sellingPoints"\s*:\s*\[([\s\S]*?)\]/);
  if (sellingMatch) {
    const points = sellingMatch[1].match(/"([^"]+)"/g);
    if (points) result.sellingPoints = points.map(p => p.slice(1, -1));
  }

  // Return null if we couldn't extract anything meaningful
  if (Object.keys(result).length === 0) {
    return null;
  }

  return result;
}

// Build AI prompt for promotion plan generation
function buildPrompt(input: GenerateInput): string {
  const sellingPointsStr = input.sellingPoints.length > 0
    ? input.sellingPoints.join('、')
    : '待定';

  return `你是正新鸡排的爆品策略专家。请为以下新品生成JSON格式的推广方案。

产品信息：
- 产品名称：${input.productName}
- 产品类别：${input.category}
- 售价：${input.price}元
- 成本：${input.cost}元
- 毛利率：${((input.price - input.cost) / input.price * 100).toFixed(1)}%
- 目标人群：${input.targetUser || '所有消费者'}
- 核心卖点：${sellingPointsStr}
- 上市时间：${input.launchDate}
- 推广区域：${input.region}

要求：
1. 只输出纯JSON，不要任何解释文字、前言或结语
2. JSON开头不能有空格或其他字符，必须以{开头
3. JSON结尾不能有空格或其他字符，必须以}结尾
4. 字段包含：
   - positioning: 一句话产品定位
   - consumerScene: 核心消费场景描述
   - purchaseReason: 核心购买理由
   - sellingPoints: 5个卖点的数组
   - promotionPhases: 3个阶段的数组（预热期、上新期、放量期），每个包含name、period、description、actions
   - storeSop: 4个SOP的数组（陈列标准、话术模板、推荐组合、出餐动线），每个包含title和content数组
   - marketingAssets: 4个物料的数组（海报、社交、外卖、Banner），每个包含type、title、content
   - score: 包含popularity(0-100)、repurchase(0-100)、riskAlert的对象`;
}

// Main AI generation function using MiniMax
export async function generatePromotionPlan(input: GenerateInput): Promise<GenerateOutput> {
  // First try real AI
  try {
    console.log('调用MiniMax AI生成推广方案...');
    const prompt = buildPrompt(input);
    const response = await callMiniMaxAI(prompt);

    const parsed = parseAIResponse(response);
    if (parsed && parsed.positioning) {
      console.log('AI生成成功！');
      return parsed as GenerateOutput;
    }

    console.log('AI返回格式异常，使用备用方案');
  } catch (error) {
    console.log('AI调用失败，使用模拟数据:', error);
  }

  // Fallback to simulated data with realistic content
  return generateSimulatedPlan(input);
}

// Simulated fallback with better quality than random
function generateSimulatedPlan(input: GenerateInput): GenerateOutput {
  const grossMargin = ((input.price - input.cost) / input.price * 100).toFixed(1);
  const categoryContext = getCategoryContext(input.category);

  // More intelligent score calculation
  let basePopularity = 70;
  let baseRepurchase = 65;

  // Adjust based on margin
  if (parseFloat(grossMargin) > 60) {
    basePopularity += 10;
    baseRepurchase += 5;
  } else if (parseFloat(grossMargin) < 40) {
    basePopularity -= 10;
    baseRepurchase -= 5;
  }

  // Adjust based on category
  if (input.category === '鸡排') {
    basePopularity += 5; // Core product line
  }

  const popularity = Math.min(99, Math.max(50, Math.round(basePopularity + Math.random() * 10)));
  const repurchase = Math.min(95, Math.max(50, Math.round(baseRepurchase + Math.random() * 10)));

  return {
    positioning: `${input.productName}——${categoryContext.positioning}`,
    consumerScene: categoryContext.scene,
    purchaseReason: `${input.productName}以${input.price}元的价格切入市场，主打${input.sellingPoints[0] || '独特口味'}优势，精准匹配${input.targetUser || '年轻消费群体'}的需求，在${input.region}区域形成差异化竞争。`,
    sellingPoints: [
      `核心卖点：${input.sellingPoints[0] || '独家风味，唇齿留香'}`,
      `价格优势：${input.price}元定价，性价比高于同类竞品`,
      `情感价值：${categoryContext.emotion}`,
      `差异化：${categoryContext.differentiation}`,
      `品质保障：正新品牌背书，品质稳定出品`,
    ],
    promotionPhases: [
      {
        name: '预热期',
        period: 'T-7 ~ T-0',
        description: '新品上市前一周，通过社交媒体、门店预热海报等进行前期宣传，制造话题热度，吸引消费者期待。',
        actions: [
          '门店摆放新品预告立牌',
          '朋友圈、社群发布新品预告',
          '外卖平台头像更换为新品元素',
          '员工内部培训新品知识',
        ],
      },
      {
        name: '上新期',
        period: 'T-0 ~ T+7',
        description: '新品正式上市，配合首发优惠活动，快速积累首批用户，形成口碑传播。',
        actions: [
          '线下门店陈列突出位置',
          '外卖平台限时优惠活动',
          '买一赠一或加量不加价活动',
          '消费者试吃活动',
        ],
      },
      {
        name: '放量期',
        period: 'T+7 ~ T+21',
        description: '根据市场反馈调整策略，扩大推广范围，提升销量，冲击爆款。',
        actions: [
          '区域门店全面铺货',
          '联合区域KOL进行推广',
          '会员专属优惠锁定复购',
          '数据跟踪优化调整',
        ],
      },
    ],
    storeSop: [
      {
        title: '陈列标准',
        content: [
          '新品陈列在柜台最显眼位置（视线平行处）',
          '使用专属POP立牌标注"新品推荐"',
          '外卖菜单置顶展示，标注"人气新品"',
          '门店LED屏幕循环播放新品信息',
        ],
      },
      {
        title: '话术模板',
        content: [
          `"您好，欢迎品尝我们的新品【${input.productName}】，今天买还能享首发优惠哦"`,
          `"这款新品主打【${input.sellingPoints[0] || '独特口味'}】，很多顾客反馈特别好"`,
          `"正好现在有活动，买两份更划算，要帮您推荐吗？"`,
        ],
      },
      {
        title: '推荐组合',
        content: [
          '主食+新品：提升客单价',
          '新品+饮品：打造下午茶场景',
          '双份新品：满足分享需求',
        ],
      },
      {
        title: '出餐动线',
        content: [
          '新品订单优先制作，保证新鲜度',
          '高峰期提前备料，避免等待时间过长',
          '出餐口设置新品专属领取区',
        ],
      },
    ],
    marketingAssets: [
      {
        type: 'poster',
        title: '门店海报文案',
        content: `【新品上市】\n\n${input.productName}\n震撼登场\n\n仅售 ${input.price}元\n\n${input.sellingPoints[0] || '独特风味，等你来尝'}\n\n—— 正新鸡排 匠心出品——`,
      },
      {
        type: 'social',
        title: '社交媒体文案',
        content: `🔥重磅消息！正新新品「${input.productName}」今日上市！\n\n精选${input.targetUser || '年轻消费者'}最爱，${input.sellingPoints[0] || '一口沦陷的美味'}\n\n转发此条朋友圈，集赞${Math.floor(Math.random() * 15 + 10)}个，即可获得新品免费试吃券一张！\n\n#正新鸡排 #新品上市 #${input.region}`,
      },
      {
        type: 'delivery',
        title: '外卖平台标题',
        content: `${input.productName} | 正新新品上市 | 首发特惠 ${input.price}元 | ${input.sellingPoints[0] || '独特风味'} | 门店同款`,
      },
      {
        type: 'banner',
        title: 'Banner建议',
        content: `主视觉：产品实物图+"新品上市"标签\n文案：「${input.productName}」震撼登场 首发价${input.price}元\n行动号召：立即抢购 / 了解详情\n底部：正新鸡排 全国门店同步上市`,
      },
    ],
    score: {
      popularity,
      repurchase,
      riskAlert: popularity > 80 ? '爆品潜力高，建议重点推广' : popularity > 60 ? '有一定市场前景，注意观察数据反馈' : '建议优化产品卖点或定价策略',
    },
  };
}

function getCategoryContext(category: string): { positioning: string; scene: string; emotion: string; differentiation: string } {
  const contexts: Record<string, { positioning: string; scene: string; emotion: string; differentiation: string }> = {
    '鸡排': {
      positioning: '外酥里嫩，爆汁过瘾的国民小食',
      scene: '一人食的正餐解馋、闺蜜聚会的分享零食、加班充能的深夜食堂',
      emotion: '满足感+治愈感，一口咬下满满的幸福感',
      differentiation: '独家腌制工艺，肉质更嫩；现点现炸，保证酥脆',
    },
    '小吃': {
      positioning: '花样多、选择丰富的小食集合',
      scene: '追剧零食、朋友聚会、下午茶点心',
      emotion: '趣味性+探索感，每次都有新鲜感',
      differentiation: '多种口味可选，满足不同偏好；小份包装，灵活消费',
    },
    '饮品': {
      positioning: '解腻清口、正新专属搭配饮品',
      scene: '餐后解腻、夏日消暑、下午茶伴侣',
      emotion: '清爽感+年轻态，活力满满',
      differentiation: '正新门店专属，与炸鸡完美搭配',
    },
    '套餐': {
      positioning: '性价比超高的完美一餐',
      scene: '工作餐、学生餐、家庭聚餐',
      emotion: '超值感+饱腹感，花小钱吃饱吃好',
      differentiation: '主食+小食+饮品一键搞定，省心省力',
    },
  };

  return contexts[category] || contexts['鸡排'];
}

// Generate tasks for a product
export async function generateTasks(productId: string, productName: string, launchDate: string) {
  const tasks = [
    {
      id: `task_${productId}_1`,
      productId,
      storeId: 'store_001',
      storeName: '徐州泉山区门店（示例）',
      type: 'material',
      deadline: new Date(new Date(launchDate).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `「${productName}」物料张贴与预热准备`,
    },
    {
      id: `task_${productId}_2`,
      productId,
      storeId: 'store_001',
      storeName: '徐州泉山区门店（示例）',
      type: 'launch',
      deadline: launchDate,
      description: `「${productName}」新品正式上市执行`,
    },
    {
      id: `task_${productId}_3`,
      productId,
      storeId: 'store_001',
      storeName: '徐州泉山区门店（示例）',
      type: 'promotion',
      deadline: launchDate,
      description: `「${productName}」首发优惠活动执行`,
    },
    {
      id: `task_${productId}_4`,
      productId,
      storeId: 'store_001',
      storeName: '徐州泉山区门店（示例）',
      type: 'data_feedback',
      deadline: new Date(new Date(launchDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `「${productName}」首周销售数据回传`,
    },
  ];

  return tasks;
}