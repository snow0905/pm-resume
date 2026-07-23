import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import test from "node:test";
import { buildSystemPrompt } from "../src/lib/prompts/jobMatchPrompt.ts";
import { validateMatchResult } from "../src/lib/schemas/matchResultSchema.ts";

const host = "127.0.0.1";
const port = 3117;
const baseUrl = `http://${host}:${port}`;

async function waitForServer(processOutput) {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  throw new Error(`Next.js did not start in time.\n${processOutput.join("")}`);
}

test("the model prompt supplies the exact JSON response contract", () => {
  const prompt = buildSystemPrompt();

  for (const requiredField of [
    "overallScore",
    "conclusion",
    "highlights",
    "concerns",
    "dimensions",
    "scorePercent",
    "jdEvidence",
    "resumeEvidence",
    "scoringReason",
    "matchReason",
    "deductionReason",
    "finalScore",
  ]) {
    assert.match(
      prompt,
      new RegExp(`"${requiredField}"\\s*:`),
      `prompt must define the ${requiredField} JSON field`,
    );
  }
});

test("an overlong model conclusion is trimmed instead of rejecting the report", () => {
  const result = validateMatchResult({
    overallScore: 50,
    conclusion: "结".repeat(301),
    highlights: ["亮点1", "亮点2"],
    concerns: ["待确认点"],
    dimensions: Array.from({ length: 4 }, (_, index) => ({
      id: `dimension-${index}`,
      key: `dimension-${index}`,
      title: `维度${index}`,
      scorePercent: 50,
      weight: 0.25,
      summary: "摘要",
      jdEvidence: ["JD证据"],
      resumeEvidence: ["简历证据"],
      scoringReason: "评分依据",
      matchReason: "匹配原因",
      deductionReason: "扣分原因",
      finalScore: 50,
    })),
  });

  assert.equal(result.valid, true);
  assert.equal(result.data?.conclusion.length, 300);
});

test(
  "production defaults to the real matcher instead of returning mock data",
  { timeout: 40_000 },
  async () => {
    const env = { ...process.env, NODE_ENV: "production" };
    delete env.DASHSCOPE_API_KEY;
    delete env.DASHSCOPE_BASE_URL;
    delete env.USE_MOCK_MATCH;

    const processOutput = [];
    const server = spawn(
      process.execPath,
      [
        "./node_modules/next/dist/bin/next",
        "dev",
        "--hostname",
        host,
        "--port",
        String(port),
      ],
      {
        cwd: process.cwd(),
        env,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    server.stdout.on("data", (chunk) => processOutput.push(chunk.toString()));
    server.stderr.on("data", (chunk) => processOutput.push(chunk.toString()));

    try {
      await waitForServer(processOutput);

      const response = await fetch(`${baseUrl}/api/match-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jd: "招聘幼儿园钢琴老师，要求音乐教育本科和教师资格证。",
        }),
      });

      assert.equal(
        response.status,
        500,
        "without a real API key, the route must fail instead of returning a successful mock report",
      );
    } finally {
      server.kill("SIGTERM");
      await new Promise((resolve) => server.once("close", resolve));
    }
  },
);

test(
  "a timed out model request returns a specific timeout error",
  { timeout: 40_000 },
  async () => {
    const appPort = 3119;
    const fakeApiPort = 3120;
    const fakeApi = createServer(() => {
      // Keep the response open so the application timeout must cancel it.
    });

    await new Promise((resolve) =>
      fakeApi.listen(fakeApiPort, host, resolve),
    );

    const env = {
      ...process.env,
      NODE_ENV: "production",
      DASHSCOPE_API_KEY: "test-key",
      DASHSCOPE_BASE_URL: `http://${host}:${fakeApiPort}`,
      DASHSCOPE_REQUEST_TIMEOUT_MS: "100",
    };
    delete env.USE_MOCK_MATCH;

    const processOutput = [];
    const server = spawn(
      process.execPath,
      [
        "./node_modules/next/dist/bin/next",
        "dev",
        "--hostname",
        host,
        "--port",
        String(appPort),
      ],
      {
        cwd: process.cwd(),
        env,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    server.stdout.on("data", (chunk) => processOutput.push(chunk.toString()));
    server.stderr.on("data", (chunk) => processOutput.push(chunk.toString()));

    try {
      const appUrl = `http://${host}:${appPort}`;
      const deadline = Date.now() + 30_000;
      while (Date.now() < deadline) {
        try {
          const response = await fetch(appUrl);
          if (response.ok) break;
        } catch {
          await new Promise((resolve) => setTimeout(resolve, 250));
        }
      }

      const response = await fetch(`${appUrl}/api/match-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd: "测试岗位 JD" }),
      });
      const body = await response.json();

      assert.equal(response.status, 500);
      assert.equal(body.error, "匹配分析超时，请稍后重试");
    } finally {
      server.kill("SIGTERM");
      await new Promise((resolve) => server.once("close", resolve));
      await new Promise((resolve, reject) =>
        fakeApi.close((error) => (error ? reject(error) : resolve())),
      );
    }
  },
);
