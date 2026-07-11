import { VibeProjectItem } from "@/types";

export const vibeProjects: VibeProjectItem[] = [
  {
    id: "ai-matching-site",
    indexLabel: "VIBE 01",
    title: "AI 岗位匹配简历网站",
    visualTitle: "AI岗位匹配器",
    oneLiner: "让招聘方看懂你——而非只看到关键词",
    status: "可交互 Demo",
    description:
      "个人求职展示网站，内含 AI 岗位匹配器。招聘方粘贴 JD 后，AI 从多个维度分析候选人与岗位的匹配关系，让匹配结果可视化、可解释。体现了产品思维 + AI 实践的完整闭环。",
    tags: ["AI 匹配", "可视化", "产品闭环"],
    demoUrl: "/demo/ai-job-matcher",
    visualUrl: "/AI岗位匹配器报告.jpg",
  },
  {
    id: "ai-agent-exploration",
    indexLabel: "VIBE 02",
    title: "个人收藏库",
    visualTitle: "个人收藏库",
    oneLiner: "让碎片收藏长成可行动的生活清单",
    status: "方案探索中",
    description:
      "面向高频收藏生活信息的用户，支持截图、链接和文字随手收纳。AI 自动识别主题、生成标签、沉淀灵感，并将碎片内容转化为旅行、购物、餐厅等可行动生活清单。",
    tags: ["AI Agent", "生活收藏", "信息整理"],
    demoUrl: "http://localhost:3000/demo/inspiration-garden",
    visualUrl: "/灵感花园首页.jpg",
  },
];
