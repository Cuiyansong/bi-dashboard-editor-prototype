/** 平台首页 Hero（本地生成，科技感海军蓝宽屏 Banner，与 #213c7f 品牌一致） */
export const PLATFORM_HERO_IMAGE = "/platform-hero-banner.png";

/** 备选 Hero（本地图不可用时回退 Unsplash） */
export const PLATFORM_HERO_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2400&q=80";

export const PLATFORM_PRIMARY = "#213c7f";
export const PLATFORM_PRIMARY_DARK = "#1a3066";

/** 模板 id → 模块示意顶图（用于卡片预览区背景，可选） */
export const PLATFORM_TEMPLATE_COVER_IMAGES: Partial<Record<string, string>> = {
  "report-kpi": "https://ai-public.mastergo.com/ai/img_res/224de50020426cf3f7bb4a1188f2b630.jpg",
  strategy: "https://ai-public.mastergo.com/ai/img_res/0fab16d4fc572c359506f8f869670a16.jpg",
  "self-service-query": "https://ai-public.mastergo.com/ai/img_res/32533a4839a9363052766bb0128c42c7.jpg",
  "product-analysis": "https://ai-public.mastergo.com/ai/img_res/420ffe8eefcfd440200821e12c7f8b1f.jpg",
  "post-evaluation": "https://ai-public.mastergo.com/ai/img_res/6ac626092887eb00b274674bb90161b5.jpg",
};
