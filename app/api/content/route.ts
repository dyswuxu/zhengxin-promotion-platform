import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ContentRequest {
  type: 'poster' | 'video' | 'audio' | 'music' | 'text';
  productName: string;
  sellingPoints: string[];
  price: number;
  targetUser?: string;
  description?: string;
}

const API_KEY = process.env.MINIMAX_API_KEY;
const API_BASE = 'https://api.minimaxi.com';

async function callMiniMax(endpoint: string, body: any): Promise<any> {
  const response = await fetch(`${API_BASE}/v1${endpoint}`, {
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
async function generatePoster(productName: string, sellingPoints: string[], price: number, description?: string): Promise<string> {
  const prompt = description
    ? `${productName}：${description}。美食摄影风格，深橙暖色调背景食欲感强，产品特写占主体，无任何文字纯视觉美食图，专业商业摄影高清质感。`
    : `正新鸡排美食摄影风格海报，深橙色暖色调背景食欲感强，产品"${productName}"特写占主体，配酱汁光泽和食欲配色，无任何文字纯视觉美食图，专业商业摄影高清质感。`;
  
  const data = await callMiniMax('/image_generation', {
    model: 'image-01',
    prompt,
    image_size: '1024x1024',
    num_images: 1,
  });
  
  return data.data?.image_urls?.[0] || data.images?.[0]?.url || data.url || '';
}

// 生成种草视频
async function generateVideo(productName: string, sellingPoints: string[], description?: string): Promise<{ taskId: string }> {
  const prompt = description
    ? `15秒正新鸡排新品种草视频，${description}。画面节奏明快食欲感强，包含产品特写、门店场景、消费者试吃等镜头，核心卖点：${sellingPoints[0] || '酥脆美味'}`
    : `15秒正新鸡排新品种草视频，画面节奏明快食欲感强，包含产品特写、门店场景、消费者试吃等镜头，核心卖点：${sellingPoints[0] || '酥脆美味'}`;
  
  const data = await callMiniMax('/video_generation', {
    model: 'MiniMax-Hailuo-2.3',
    prompt,
    duration: 6,
    resolution: '768P',
  });
  
  return { taskId: data.task_id || data.id || '' };
}

// 查询视频状态
async function getVideoStatus(taskId: string): Promise<{ status: string; url?: string }> {
  const response = await fetch(`${API_BASE}/v1/query/video_generation?task_id=${taskId}`, {
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

// 生成音频（叫卖）
async function generateAudio(productName: string, sellingPoints: string[], price: number, description?: string): Promise<string> {
  const text = `好消息！正新鸡排隆重推出新品——${productName}！${sellingPoints[0] || '表皮酥脆 内里鲜嫩'}，一口下去超满足！新品尝鲜价，只要${price}元！全国门店同步上市，欢迎品尝！${description ? ' ' + description : ''}`;
  
  const response = await callMiniMax('/t2a_v2', {
    model: 'speech-2.8-hd',
    text,
    stream: false,
    voice_setting: {
      voice_id: 'male-qn-qingse',
    },
    audio_setting: {
      format: 'mp3',
      sample_rate: 32000,
    },
    output_format: 'url',
  });
  
  const url = response.data?.audio_url || response.audio_url || response.url || '';
  if (url) {
    return url;
  }
  return '';
}

// 生成音乐（宣传歌曲）
async function generateMusic(productName: string, sellingPoints: string[], price: number, description?: string): Promise<string> {
  const prompt = description
    ? `正新鸡排品牌宣传歌曲，${description}。节奏明快活泼，30秒左右，传递"美味、欢乐、分享"的品牌氛围，歌词围绕产品"${productName}"核心卖点"${sellingPoints[0] || '酥脆美味'}"展开，适合门店播放`
    : `正新鸡排品牌宣传歌曲，节奏明快活泼，30秒左右，传递"美味、欢乐、分享"的品牌氛围，歌词围绕产品"${productName}"核心卖点"${sellingPoints[0] || '酥脆美味'}"展开，适合门店播放`;

  const data = await callMiniMax('/music_generation', {
    model: 'music-2.6',
    prompt,
    lyrics: `正新鸡排${productName}，美味难挡！${sellingPoints[0] || '酥脆多汁'}，一口沦陷！新品尝鲜价${price}元，全国门店同步发售！`,
    output_format: 'url',
  });
  
  const musicUrl = data.data?.audio_url || data.audio_url || data.url || '';
  if (musicUrl) {
    return musicUrl;
  }
  return '';
}

// 生成文案（种草+话术）
async function generateText(productName: string, sellingPoints: string[], price: number, description?: string): Promise<{ posts: Array<{ platform: string; content: string }> }> {
  const styleNote = description ? `\n\n用户指定风格：${description}` : '';
  const prompt = `为正新鸡排新品"${productName}"生成以下推广内容${styleNote}，直接输出JSON数组：
1. 朋友圈文案（轻松亲切，50字内，含emoji）
2. 小红书种草笔记（种草风格，标题+正文，100字内，含emoji）
3. 门店推销话术（简短有力，适合店员向顾客推荐）

格式：[{"platform":"朋友圈","content":"..."},{"platform":"小红书","content":"..."},{"platform":"门店话术","content":"..."}]`;

  const response = await callMiniMax('/text/chatcompletion_pro', {
    model: 'MiniMax-M2.7-highspeed',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 512,
  });
  const content = response.choices?.[0]?.message?.content || '';
  
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // Handle both array and {posts: array} formats
      const postsArray = Array.isArray(parsed) ? parsed : parsed.posts || [];
      return { posts: postsArray };
    }
  } catch {
    // fallback
  }
  return {
    posts: [
      { platform: '朋友圈', content: `正新新品「${productName}」🔥酥脆多汁！仅${price}元，赶紧来尝~` },
      { platform: '小红书', content: `被问爆的新品！正新「${productName}」✨一口沦陷的快乐，冲！` },
      { platform: '门店话术', content: `老板，新品「${productName}」刚上市，外面卖${price}元，现在扫码有优惠！` },
    ],
  };
}

export async function POST(request: Request) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: 'MINIMAX_API_KEY not configured' }, { status: 500 });
    }

    const body: ContentRequest = await request.json();
    const { type, productName, sellingPoints, price, description } = body;

    if (!type || !productName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let result: any = { type };

    switch (type) {
      case 'poster': {
        const url = await generatePoster(productName, sellingPoints, price, description);
        result.url = url;
        break;
      }
      case 'video': {
        const { taskId } = await generateVideo(productName, sellingPoints, description);
        result.taskId = taskId;
        result.status = 'pending';
        break;
      }
      case 'audio': {
        const url = await generateAudio(productName, sellingPoints, price, description);
        result.url = url;
        break;
      }
      case 'music': {
        const url = await generateMusic(productName, sellingPoints, price, description);
        result.url = url;
        break;
      }
      case 'text': {
        const posts = await generateText(productName, sellingPoints, price, description);
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