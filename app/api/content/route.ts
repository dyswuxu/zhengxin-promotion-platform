import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ContentRequest {
  type: 'poster' | 'video' | 'audio' | 'text';
  productName: string;
  sellingPoints: string[];
  price: number;
  targetUser?: string;
}

const API_KEY = process.env.MINIMAX_API_KEY;

async function callMiniMax(endpoint: string, body: any): Promise<any> {
  const response = await fetch(`https://api.minimax.io/v1${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`MiniMax API error: ${response.status} - ${JSON.stringify(data)}`);
  }
  return data;
}

// 生成海报图片
async function generatePoster(productName: string, sellingPoints: string[], price: number): Promise<string> {
  const prompt = `正新鸡排新品海报，风格：美食摄影，深橙色背景，产品名称"${productName}"大字居中，副标题"新品上市 限时尝鲜"，底部"正新鸡排 全国门店同步发售"，简洁专业风格，适合打印喷绘`;
  
  const data = await callMiniMax('/images/generations', {
    model: 'image-01',
    prompt,
    image_size: '1024x1024',
    num_images: 1,
  });
  
  return data.images?.[0]?.url || '';
}

// 生成种草视频
async function generateVideo(productName: string, sellingPoints: string[]): Promise<{ taskId: string }> {
  const prompt = `15秒正新鸡排新品种草视频脚本：开场产品特写，中段展示美味口感，结尾LOGO定格。风格：食欲感强、明快节奏、暖色调。产品：${productName}，核心卖点：${sellingPoints[0] || '酥脆美味'}`;
  
  const data = await callMiniMax('/video/generation', {
    model: 'MiniMax-Hailuo-2.3-Fast',
    prompt,
  });
  
  return { taskId: data.task_id || data.id || '' };
}

// 查询视频状态
async function getVideoStatus(taskId: string): Promise<{ status: string; url?: string }> {
  const response = await fetch(`https://api.minimax.io/v1/video/status?task_id=${taskId}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
  });
  const data = await response.json();
  return {
    status: data.status || data.task_status || 'unknown',
    url: data.video_url || data.url || '',
  };
}

// 生成音频（店内广播词）
async function generateAudio(productName: string, sellingPoints: string[], price: number): Promise<string> {
  const text = `欢迎光临正新鸡排！本店新品「${productName}」震撼上市！${sellingPoints[0] || '酥脆多汁'}，一口沦陷！新品尝鲜价仅需${price}元，限时优惠，欢迎品尝！`;
  
  const data = await callMiniMax('/speech/synthesis', {
    model: 'speech-2.8-hd',
    text,
    voice_setting: {
      voice_id: 'Chinese_Yunvocal_4',
    },
    audio_setting: {
      format: 'mp3',
      sample_rate: 32000,
    },
  });
  
  return data.data?.url || data.url || '';
}

// 生成文案
async function generateText(productName: string, sellingPoints: string[], price: number, targetUser?: string): Promise<{ posts: Array<{ platform: string; content: string }> }> {
  const prompt = `为正新鸡排新品"${productName}"生成朋友圈和小红书推广文案。

要求：
1. 朋友圈文案1条：轻松亲切，种草风格，包含产品名、价格、核心卖点，带适量emoji，50字以内
2. 小红书文案1条：种草分享风格，包含标题和正文，突出"${sellingPoints[0] || '美味'}"，带适量emoji，100字以内

直接输出JSON格式：
{"posts":[{"platform":"朋友圈","content":"..."},{"platform":"小红书","content":"..."}]}`;

  const response = await fetch('https://api.minimax.io/v1/text/chatcompletion_pro', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: {
      model: 'MiniMax-M2.7',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 512,
    },
  });
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // fallback
  }
  return {
    posts: [
      { platform: '朋友圈', content: `🔥正新新品「${productName}」上市！${sellingPoints[0]}，仅${price}元！` },
      { platform: '小红书', content: `被问爆的新品！正新「${productName}」一口沦陷的快乐✨` },
    ],
  };
}

export async function POST(request: Request) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: 'MINIMAX_API_KEY not configured' }, { status: 500 });
    }

    const body: ContentRequest = await request.json();
    const { type, productName, sellingPoints, price, targetUser } = body;

    if (!type || !productName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let result: any = { type };

    switch (type) {
      case 'poster': {
        const url = await generatePoster(productName, sellingPoints, price);
        result.url = url;
        break;
      }
      case 'video': {
        const { taskId } = await generateVideo(productName, sellingPoints);
        result.taskId = taskId;
        result.status = 'pending';
        break;
      }
      case 'audio': {
        const url = await generateAudio(productName, sellingPoints, price);
        result.url = url;
        break;
      }
      case 'text': {
        const posts = await generateText(productName, sellingPoints, price, targetUser);
        result.posts = posts;
        break;
      }
      default:
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Content generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');
  const type = searchParams.get('type');

  if (!API_KEY) {
    return NextResponse.json({ error: 'MINIMAX_API_KEY not configured' }, { status: 500 });
  }

  if (type === 'video' && taskId) {
    try {
      const status = await getVideoStatus(taskId);
      return NextResponse.json(status);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}