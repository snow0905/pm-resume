import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";
import { buildSystemPrompt } from "../src/lib/prompts/jobMatchPrompt.ts";

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
