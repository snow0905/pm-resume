// ============================================================
// 岗位匹配器 — Match Service
// ============================================================
// 封装 mock / real 两种匹配逻辑。
// USE_MOCK_MATCH = false 时调用千问 3.6 API。
// ============================================================

import type { MatchResult } from "@/types";
import { buildMatchMessages } from "@/lib/prompts/jobMatchPrompt";
import { resumeMatchProfile } from "@/data/resumeMatchProfile";
import { validateMatchResult } from "@/lib/schemas/matchResultSchema";

// ================================================================
// 模式开关：true = mock，false = 真实 AI
// ================================================================
const USE_MOCK_MATCH = true;

// ================================================================
// Mock 结果（仅开发调试用）
// ================================================================
const mockMatchResult: MatchResult = {
  overallScore: 89,
  conclusion:
    "候选人 6 年零售 SaaS 产品经验与 JD 高度重合，平台化设计与复杂业务抽象能力突出，从 0 到 1 项目落地经验完整。AI 方向探索是差异化加分项，建议进入面试环节。",
  highlights: [
    "6 年零售 SaaS 产品经验，业务场景与 JD 高度重合",
    "具备从 0 到 1 的平台产品搭建与复杂业务抽象能力",
    "AI 方向探索与 Vibe Coding 实践构成差异化加分",
  ],
  concerns: [
    "简历中未体现大型产品团队管理经验（5 人以上），若 JD 有团队管理要求，建议进一步沟通确认。",
    "跨行业经验（民宿→教育→零售 SaaS）虽构成广度优势，建议面试中确认候选人对零售赛道的长期投入意愿。",
  ],
  jdKeywords: [
    "SaaS 产品",
    "B 端平台",
    "数据分析",
    "交易链路",
    "会员营销",
    "跨团队协作",
  ],
  dimensions: [
    {
      id: "businessScenario",
      key: "businessScenario",
      title: "业务场景匹配度",
      scorePercent: 92,
      weight: 0.25,
      summary:
        "6 年零售 SaaS 产品经验，覆盖会员营销、搜索策略、交易链路及 B 端配置后台全流程，与 JD 业务场景高度重合。",
      jdEvidence: [
        "6 年以上产品经验",
        "零售 SaaS 或电商背景",
        "B 端平台产品经验",
      ],
      resumeEvidence: [
        "6 年产品经理经验（2019.07 — 2026.04），多点 DMALL 近 6 年零售 SaaS 产品经验",
        "覆盖会员营销、搜索策略、交易链路及 B 端配置后台全流程",
        "参与社区拼团、O2O、B2C、便利店、停车缴费等多业态场景建设",
      ],
      scoringReason:
        "6 年产品经验与零售 SaaS 背景高度匹配，覆盖 B 端平台、交易链路、会员营销等多业务场景，与 JD 要求的业务场景高度重合。",
      matchReason:
        "6 年零售 SaaS 产品经验与 JD 高度重合，覆盖 B 端平台、交易链路、会员营销等多业务场景，行业认知深度与 JD 要求完全匹配。",
      deductionReason:
        "跨行业经验（民宿→教育→零售 SaaS）虽构成广度优势，但在单一赛道的深度耕耘时间相对分散。",
      finalScore: 92,
    },
    {
      id: "productCapability",
      key: "productCapability",
      title: "产品能力匹配度",
      scorePercent: 88,
      weight: 0.3,
      summary:
        "B 端平台化设计、数据分析与策略优化、跨团队推进和复杂业务抽象四个核心能力均有明确项目证据，产品闭环完整。",
      jdEvidence: [
        "B 端平台化设计能力",
        "数据分析与策略优化能力",
        "跨团队协作推进能力",
        "复杂业务场景抽象能力",
      ],
      resumeEvidence: [
        "从 0 到 1 搭建商家运营配置平台，研发人力依赖降低 90%，核心配置 10 秒热更新",
        "建设搜索数据中心，统一核心指标口径，支持业务方自助分析",
        "协同会员、订单、结算、支付等多个系统推进需求交付",
        "将 10+ 类营销玩法抽象为可配置策略工具，新玩法接入缩短至 3 人日",
      ],
      scoringReason:
        "B 端平台化设计、数据分析、跨团队推进和复杂业务抽象四个核心能力均有明确项目证据，产品闭环完整。",
      matchReason:
        "B 端平台化设计、数据分析驱动决策、跨团队协作推进和复杂业务抽象四个核心能力均有明确项目证据，产品闭环完整。",
      deductionReason:
        "部分项目缺少量化的业务结果指标，如 GMV 提升、转化率优化等具体数据，建议补充关键指标佐证。",
      finalScore: 88,
    },
    {
      id: "projectExperience",
      key: "projectExperience",
      title: "项目经验匹配度",
      scorePercent: 90,
      weight: 0.3,
      summary:
        "多个项目以核心负责人角色独立推进，具备从 0 到 1 的完整落地经验，项目复杂度与 JD 要求匹配度高。",
      jdEvidence: [
        "有独立负责项目的经验",
        "能从 0 到 1 推动产品落地",
        "具备复杂业务场景的产品方案设计经验",
      ],
      resumeEvidence: [
        "作为项目负责人主导会员营销策略 Skill 建设，从需求梳理到上线落地全程负责",
        "从 0 到 1 搭建商家小程序配置后台，首版约 80 人天上线",
        "负责多业态交易链路设计，沉淀区域禁售、围栏校验等复杂场景解决方案",
      ],
      scoringReason:
        "多个项目以核心负责人角色独立推进，具备从 0 到 1 的完整落地经验，项目复杂度与 JD 要求匹配度高。",
      matchReason:
        "多个项目以核心负责人角色独立推进，具备从 0 到 1 的完整落地经验，项目复杂度与独立负责能力与 JD 要求高度匹配。",
      deductionReason:
        "简历中未体现大型产品团队管理经验（5 人以上规模），若 JD 包含团队管理要求需进一步确认。",
      finalScore: 90,
    },
    {
      id: "bonusPotential",
      key: "bonusPotential",
      title: "岗位加分匹配度",
      scorePercent: 85,
      weight: 0.15,
      summary:
        "AI 方向持续探索、Vibe Coding 快速验证能力和跨行业迁移经验构成差异化加分，结构化表达有直接证据。",
      jdEvidence: [
        "AI 产品思维或智能化运营经验",
        "创新探索与快速验证能力",
        "结构化表达与文档能力",
      ],
      resumeEvidence: [
        "关注 AI Agent、智能运营、营销自动化方向",
        "个人网站集成 AI 岗位匹配器作为 Vibe Coding 实践",
        "输出《互动题型设计规范》，具备结构化文档撰写能力",
        "具备民宿→教育→零售 SaaS 三段跨行业经验",
      ],
      scoringReason:
        "AI 方向探索、Vibe Coding 快速验证和跨行业迁移能力构成差异化加分，结构化表达有直接证据。",
      matchReason:
        "AI 方向持续探索与 Vibe Coding 快速验证能力构成差异化加分，结构化文档撰写能力有直接证据支撑。",
      deductionReason:
        "AI 产品化经验目前以个人探索为主，缺乏商业化 AI 产品落地案例，若岗位强调 AI 驱动需进一步考察深度。",
      finalScore: 85,
    },
  ],
};

// ================================================================
// 辅助函数
// ================================================================
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ================================================================
// 真实 AI 调用
// ================================================================
async function requestRealJobMatch(jobDescription: string): Promise<MatchResult> {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    throw new Error("DASHSCOPE_API_KEY 未配置");
  }

  const { system, user } = buildMatchMessages({
    jobDescription,
    resumeMatchProfile,
  });

  const baseUrl =
    process.env.DASHSCOPE_BASE_URL ||
    "https://dashscope.aliyuncs.com/compatible-mode/v1";

  const apiResponse = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "qwen3.6-plus",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      thinking: { type: "disabled" },
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!apiResponse.ok) {
    const errText = await apiResponse.text().catch(() => "");
    console.error("千问 API 错误:", apiResponse.status, errText.slice(0, 300));
    throw new Error(`千问 API 返回 ${apiResponse.status}`);
  }

  const data = await apiResponse.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("千问 API 返回空内容");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    console.error("千问返回非 JSON:", content.slice(0, 300));
    throw new Error("模型返回格式异常");
  }

  // Zod + 逻辑校验
  const validation = validateMatchResult(parsed);
  if (!validation.valid) {
    console.error("结果校验失败:", validation.errors);
    throw new Error(`结果校验失败: ${validation.errors.join("; ")}`);
  }

  return validation.data!;
}

// ================================================================
// 对外接口
// ================================================================

/**
 * 执行岗位匹配。
 * - mock 模式：延迟 800ms-1.2s 返回 mock 结果
 * - 真实模式：调用千问 3.6 API
 */
export async function matchJob(jobDescription: string): Promise<MatchResult> {
  if (USE_MOCK_MATCH) {
    const delay = 800 + Math.random() * 400;
    await wait(delay);
    return mockMatchResult;
  }

  return requestRealJobMatch(jobDescription);
}

/**
 * 检查当前是否为 mock 模式
 */
export function isMockMode(): boolean {
  return USE_MOCK_MATCH;
}
