// ============================================================
// 岗位匹配器 — 运行时短 Prompt 模板
// ============================================================
// 每次真实调用千问 3.6 时发送给模型。
// 只包含任务说明、四维评分权重、关键约束、JSON 输出要求。
// 详细评分规则请参见 jobMatchScoringRules.ts，不拼入运行时 Prompt。
// ============================================================

import type { ResumeMatchProfile } from "@/data/resumeMatchProfile";

export function buildSystemPrompt(): string {
  return `你是一名专业招聘筛选助手。你的任务是基于候选人的结构化简历摘要和岗位 JD，生成岗位匹配报告。

## 核心原则

评分不是关键词匹配，而是：JD 要求解析 → 简历证据映射 → 证据强弱评分。

## 四个评分维度

1. **业务场景匹配度**（权重 25%）：判断 JD 业务场景与简历业务经历是否相近或可迁移。
2. **产品能力匹配度**（权重 30%）：判断 JD 要求的产品基本功是否有简历项目证据支撑。
3. **项目经验匹配度**（权重 30%）：判断项目经历是否能支撑 JD 核心职责与落地要求。
4. **岗位加分项匹配度**（权重 15%）：判断 AI 工具、快速验证、结构化表达等差异化能力是否构成加分。

## 关键约束

- 每个维度必须给出 jdEvidence（JD 要求）、resumeEvidence（简历证据）和 scoringReason（评分原因）。
- 没有简历证据不得高分。resumeEvidence 为空或仅泛化描述的维度，分数不得超过 70。
- 关键词相似但缺少项目支撑（无 problem→动作→结果 链路）的维度，分数不得超过 75。
- 不得编造简历中不存在的信息。
- 综合分 overallScore 必须根据四个维度按权重计算，不得显著偏离加权平均值。
- 如果某方面证据不足，请在 concerns 数组中说明待确认点。
- 全部使用中文。
- 只输出 JSON，不要输出 Markdown 代码块标记，不要输出解释文字。`;
}

export function buildUserPrompt(params: {
  jobDescription: string;
  resumeMatchProfile: ResumeMatchProfile;
}): string {
  const profile = params.resumeMatchProfile;

  // 只发送结构化摘要，不发送完整 MD 简历
  const compactProfile = {
    candidate: profile.candidate,
    positioning: profile.positioning,
    businessDomains: profile.businessDomains.map((d) => ({
      name: d.name,
      keywords: d.keywords,
      evidence: d.evidence,
    })),
    coreCapabilities: profile.coreCapabilities.map((c) => ({
      capability: c.capability,
      keywords: c.keywords,
      evidence: c.evidence,
    })),
    projectEvidences: profile.projectEvidences.map((p) => ({
      name: p.name,
      role: p.role,
      businessContext: p.businessContext,
      problem: p.problem,
      productActions: p.productActions,
      outcomes: p.outcomes,
      keywords: p.keywords,
    })),
    bonusSignals: profile.bonusSignals.map((b) => ({
      name: b.name,
      description: b.description,
      evidence: b.evidence,
    })),
    education: profile.education,
  };

  return `候选人结构化简历摘要：\n${JSON.stringify(compactProfile, null, 2)}\n\n---\n\n岗位 JD：\n${params.jobDescription}\n\n请基于以上信息生成岗位匹配报告。`;
}

/**
 * 构建完整的千问 API messages 数组
 */
export function buildMatchMessages(params: {
  jobDescription: string;
  resumeMatchProfile: ResumeMatchProfile;
}): { system: string; user: string } {
  return {
    system: buildSystemPrompt(),
    user: buildUserPrompt(params),
  };
}
