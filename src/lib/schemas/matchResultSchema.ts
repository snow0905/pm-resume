// ============================================================
// 岗位匹配器 — Zod Schema 校验
// ============================================================
// 校验千问 3.6 返回的 JSON 结构。
// 校验失败时不应将不合格结果直接返回前端。
// ============================================================

import { z } from "zod";

export const matchDimensionSchema = z.object({
  id: z.string().min(1),
  key: z.string().min(1),
  title: z.string().min(1),
  scorePercent: z.number().min(0).max(100),
  weight: z.number().min(0).max(1),
  summary: z.string().min(1),
  jdEvidence: z.array(z.string()),
  resumeEvidence: z.array(z.string()),
  scoringReason: z.string().min(1),
  matchReason: z.string().min(1),
  deductionReason: z.string().min(1),
  finalScore: z.number().min(0).max(100),
});

export const matchResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  conclusion: z
    .string()
    .min(1)
    .transform((value) => value.slice(0, 300)),
  highlights: z.array(z.string()).min(2).max(3),
  concerns: z.array(z.string()).min(1).max(2),
  dimensions: z.array(matchDimensionSchema).length(4),
});

export type MatchResultValidated = z.infer<typeof matchResultSchema>;

/**
 * 分数逻辑校验（schema 之外的质量检查）
 */
export function validateScoreLogic(data: MatchResultValidated): string[] {
  const errors: string[] = [];

  // 1. 证据为空的维度分数不应超过 70
  for (const dim of data.dimensions) {
    if (dim.resumeEvidence.length === 0 && dim.scorePercent > 70) {
      errors.push(
        `维度「${dim.title}」无简历证据但分数为 ${dim.scorePercent}，超过 70 上限`,
      );
    }
  }

  // 2. overallScore 应与加权平均分接近（容差 ±5）
  const weightedSum = data.dimensions.reduce(
    (sum, d) => sum + d.scorePercent * d.weight,
    0,
  );
  if (Math.abs(data.overallScore - weightedSum) > 5) {
    errors.push(
      `overallScore(${data.overallScore}) 与加权平均分(${weightedSum.toFixed(1)}) 偏差过大`,
    );
  }

  // 3. dimensions 数量必须为 4
  if (data.dimensions.length !== 4) {
    errors.push(`dimensions 数量为 ${data.dimensions.length}，期望 4`);
  }

  // 4. highlights 至少 2 条
  if (data.highlights.length < 2) {
    errors.push(`highlights 仅 ${data.highlights.length} 条，至少需要 2 条`);
  }

  // 5. concerns 至少 1 条
  if (data.concerns.length < 1) {
    errors.push(`concerns 至少需要 1 条待确认点`);
  }

  return errors;
}

/**
 * 综合校验：先 schema 校验，再逻辑校验。
 */
export function validateMatchResult(raw: unknown): {
  valid: boolean;
  data?: MatchResultValidated;
  errors: string[];
} {
  const schemaResult = matchResultSchema.safeParse(raw);
  if (!schemaResult.success) {
    const schemaErrors = schemaResult.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`,
    );
    return { valid: false, errors: schemaErrors };
  }

  const logicErrors = validateScoreLogic(schemaResult.data);
  if (logicErrors.length > 0) {
    return { valid: false, data: schemaResult.data, errors: logicErrors };
  }

  return { valid: true, data: schemaResult.data, errors: [] };
}
