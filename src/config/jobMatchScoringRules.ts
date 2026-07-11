// ============================================================
// 岗位匹配器 — 详细评分规则
// ============================================================
// 用途：开发理解、mock 设计、结果校验、测试用例、Prompt 调优
// 注意：此文件不直接发送给模型。运行时只发送 jobMatchPrompt.ts 中的短 Prompt。
// ============================================================

export interface DimensionScoringRule {
  key: string;
  label: string;
  weight: number;
  shortRule: string;
  scoreBands: { range: string; meaning: string }[];
}

export interface JobMatchScoringRules {
  dimensions: DimensionScoringRule[];
  globalRules: string[];
  validationRules: {
    emptyEvidenceMaxScore: number;
    minDimensions: number;
    maxDimensions: number;
    minHighlights: number;
    maxSummaryLength: number;
    weightedScoreTolerance: number;
  };
}

export const jobMatchScoringRules: JobMatchScoringRules = {
  dimensions: [
    {
      key: "businessScenario",
      label: "业务场景匹配度",
      weight: 0.25,
      shortRule:
        "判断 JD 所需业务场景与候选人过往业务经历是否相近或具备迁移性。",
      scoreBands: [
        {
          range: "90-100",
          meaning: "JD 核心业务场景与简历项目高度重合（如 JD 要求零售 SaaS，简历有多年零售 SaaS 经验）。",
        },
        {
          range: "80-89",
          meaning: "业务场景不完全相同，但产品问题高度相似，具备较强迁移性（如电商搜索 → 内容推荐）。",
        },
        {
          range: "70-79",
          meaning: "只匹配部分业务场景，有一定相关性但非核心领域（如做过 B 端但不熟悉 JD 所在行业）。",
        },
        {
          range: "60-69",
          meaning: "主要是通用产品经验匹配，缺少直接场景证据。",
        },
        {
          range: "<60",
          meaning: "业务场景差异较大，缺少可验证相关经历。",
        },
      ],
    },
    {
      key: "productCapability",
      label: "产品能力匹配度",
      weight: 0.3,
      shortRule:
        "判断 JD 要求的产品基本功（需求拆解、方案设计、数据分析、跨团队推进等）是否能在简历中找到明确项目证据。",
      scoreBands: [
        {
          range: "90-100",
          meaning: "JD 核心产品能力要求都有明确项目证据支撑，简历中有完整的「问题→动作→结果」链路。",
        },
        {
          range: "80-89",
          meaning: "大部分产品能力匹配，有多个项目体现完整产品闭环。",
        },
        {
          range: "70-79",
          meaning: "基础产品能力匹配（如需求分析、PRD 撰写），但部分关键能力（如策略设计、平台化）证据不足。",
        },
        {
          range: "60-69",
          meaning: "只有泛化职责描述（如「负责 XX 产品」），缺少明确方法或项目证明。",
        },
        {
          range: "<60",
          meaning: "JD 所需能力与简历能力呈现明显不一致。",
        },
      ],
    },
    {
      key: "projectExperience",
      label: "项目经验匹配度",
      weight: 0.3,
      shortRule:
        "判断候选人项目经历是否能支撑 JD 中的核心职责和落地要求，重点关注项目角色深度、问题复杂度与成果。",
      scoreBands: [
        {
          range: "90-100",
          meaning: "多个项目能直接对应 JD 核心职责，且候选人为核心负责人，项目成果可量化。",
        },
        {
          range: "80-89",
          meaning: "有相关项目经验，能证明类似问题处理能力，但项目角色或规模略有差异。",
        },
        {
          range: "70-79",
          meaning: "项目相关性存在，但角色深度、项目规模或结果证据不足。",
        },
        {
          range: "60-69",
          meaning: "项目偏执行或辅助，缺少独立负责与落地证明。",
        },
        {
          range: "<60",
          meaning: "缺少与 JD 关键职责相关的项目经历。",
        },
      ],
    },
    {
      key: "bonusPotential",
      label: "岗位加分项匹配度",
      weight: 0.15,
      shortRule:
        "判断 AI 工具使用、Vibe Coding、快速验证、结构化表达、跨行业经验等差异化能力是否为岗位加分。",
      scoreBands: [
        {
          range: "90-100",
          meaning: "JD 明确提到 AI、效率工具、创新探索、快速验证等要求，且简历有直接证据。",
        },
        {
          range: "80-89",
          meaning: "JD 未明确要求 AI，但岗位重视效率、创新或快速验证，相关能力构成加分。",
        },
        {
          range: "70-79",
          meaning: "加分项与岗位不是强相关，但能体现主动学习和产品表达能力。",
        },
        {
          range: "60-69",
          meaning: "加分项与 JD 关联较弱，只能作为个人特点展示。",
        },
        {
          range: "<60",
          meaning: "JD 所需加分项在简历中没有体现。",
        },
      ],
    },
  ],

  globalRules: [
    "评分不是关键词匹配，而是 JD 要求 → 简历证据映射 → 证据强弱评分的证据链推理。",
    "每个维度必须给出 JD 要求（jdEvidence）、简历证据（resumeEvidence）和评分原因（scoringReason）。",
    "没有简历证据不得给高分。如果某维度 resumeEvidence 为空或仅为泛化描述，该维度分数不得超过 70。",
    "如果只是关键词相似但缺少项目支撑（problem → productActions → outcomes 链路不完整），对应维度不得超过 75。",
    "不得编造简历中不存在的信息。所有 resumeEvidence 必须能在简历原文中找到对应依据。",
    "综合分必须根据四个维度按权重计算，不得显著偏离加权平均值。",
    "如果证据不足，需在 concerns 中说明不确定或待确认的点。",
    "全部使用中文输出。",
  ],

  validationRules: {
    emptyEvidenceMaxScore: 70,
    minDimensions: 4,
    maxDimensions: 4,
    minHighlights: 2,
    maxSummaryLength: 300,
    weightedScoreTolerance: 5,
  },
};
