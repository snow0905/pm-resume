// ============================================================
// POST /api/match-job — AI 岗位匹配
// ============================================================
// 后端代理层：校验 JD → 调用 matchJob service → 返回结果
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { matchJob } from "@/lib/services/matchJob";

const JD_MAX_LENGTH = 8000;

export async function POST(request: NextRequest) {
  try {
    // ---- 1. 解析请求 ----
    const body = await request.json().catch(() => null);
    if (!body || typeof body.jd !== "string") {
      return NextResponse.json({ error: "请提供岗位 JD 内容" }, { status: 400 });
    }

    const jd = body.jd.trim();
    if (!jd) {
      return NextResponse.json({ error: "请输入岗位 JD 内容" }, { status: 400 });
    }
    if (jd.length > JD_MAX_LENGTH) {
      return NextResponse.json(
        { error: `JD 内容过长，请精简至 ${JD_MAX_LENGTH} 字以内再试` },
        { status: 400 },
      );
    }

    // ---- 2. 调用匹配服务 ----
    const result = await matchJob(jd);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: "匹配分析超时，请稍后重试" },
        { status: 500 },
      );
    }
    console.error("POST /api/match-job 未预期错误:", err);
    return NextResponse.json(
      { error: "匹配分析暂时失败，请稍后重试" },
      { status: 500 },
    );
  }
}
