/** 平台首页 Hero（本地生成，科技感海军蓝宽屏 Banner，与 #213c7f 品牌一致） */
export const PLATFORM_HERO_IMAGE = "/platform-hero-banner.png";

/** 备选 Hero（本地图不可用时回退 Unsplash） */
export const PLATFORM_HERO_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2400&q=80";

export const PLATFORM_PRIMARY = "#213c7f";
export const PLATFORM_PRIMARY_DARK = "#1a3066";

/** 模板 id → 平台首页卡片封面（本地科技感示意，与 #213c7f 品牌一致） */
export const PLATFORM_TEMPLATE_COVER_IMAGES: Partial<Record<string, string>> = {
  "report-kpi": "/templates/report-kpi.png",
  "product-analysis": "/templates/product-analysis.png",
  "self-service-query": "/templates/self-service-query.png",
  strategy: "/templates/strategy.png",
  "post-evaluation": "/templates/post-evaluation.png",
};
