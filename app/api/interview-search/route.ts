
import { NextRequest, NextResponse } from "next/server";

type InterviewQuestionPayload = {
  question: string;
  answer: string;
  category: string;
  difficulty: string;
  tags: string[];
};

function extractJsonArray(text: string) {
  const direct = text.trim();
  try {
    return JSON.parse(direct);
  } catch {
    // continue
  }

  const codeBlock = direct.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeBlock?.[1]) {
    try {
      return JSON.parse(codeBlock[1].trim());
    } catch {
      // continue
    }
  }

  const start = direct.indexOf("[");
  const end = direct.lastIndexOf("]");
  if (start >= 0 && end > start) {
    const maybe = direct.slice(start, end + 1);
    return JSON.parse(maybe);
  }

  throw new Error("AI 没有返回合法 JSON 数组。");
}

function normalizeCategory(value: string) {
  const allowed = ["前端", "后端", "数据库", "Redis", "架构", "AI应用", "RAG", "Agent", "部署运维", "安全", "综合"];
  return allowed.includes(value) ? value : "综合";
}

function normalizeDifficulty(value: string) {
  const allowed = ["基础", "中级", "高级", "综合"];
  return allowed.includes(value) ? value : "综合";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topic = String(body.topic || "").trim();
    const category = String(body.category || "综合").trim();
    const difficulty = String(body.difficulty || "综合").trim();
    const count = Math.max(3, Math.min(Number(body.count || 10), 30));

    if (!topic || topic.length < 2) {
      return NextResponse.json({ error: "请输入要生成/搜索的面试题方向。" }, { status: 400 });
    }

    const apiKey = process.env.AGNES_API_KEY;
    const baseUrl = (process.env.AGNES_API_BASE_URL || "https://apihub.agnes-ai.com/v1").replace(/\/$/, "");
    const model = process.env.AGNES_MODEL || "agnes-2.0-flash";

    if (!apiKey) {
      return NextResponse.json({ error: "缺少 AGNES_API_KEY，请在 .env.local 中配置。" }, { status: 500 });
    }

    const systemPrompt = `你是资深技术面试官和技术学习导师，负责为前端工程师准备全栈、后端、架构、AI应用工程相关面试题。
要求：
1. 只返回 JSON 数组，不要 markdown，不要解释。
2. 每个元素包含 question、answer、category、difficulty、tags。
3. category 只能从：前端、后端、数据库、Redis、架构、AI应用、RAG、Agent、部署运维、安全、综合 中选择。
4. difficulty 只能从：基础、中级、高级、综合 中选择。
5. answer 要适合学习，不能只有一句话，最好包含要点、项目场景、常见误区。
6. 题目要偏真实面试和真实项目，不要太水。`;

    const userPrompt = `请生成 ${count} 道技术面试题。

方向/关键词：${topic}
期望分类：${category}
期望难度：${difficulty}

输出格式示例：
[
  {
    "question": "Redis 为什么不能直接替代 MySQL？",
    "answer": "Redis 主要是内存键值数据库，适合缓存、限流、锁等场景...",
    "category": "Redis",
    "difficulty": "基础",
    "tags": ["Redis", "缓存", "数据库"]
  }
]`;

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.35,
        max_tokens: Math.max(1200, count * 300)
      })
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Agnes API 请求失败：${res.status} ${text.slice(0, 500)}` },
        { status: 500 }
      );
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content || "";
    const parsed = extractJsonArray(content) as InterviewQuestionPayload[];

    if (!Array.isArray(parsed)) {
      throw new Error("AI 返回内容不是数组。");
    }

    const now = Date.now();
    const items = parsed.slice(0, count).map((item, index) => ({
      id: `agnes_${now}_${index}_${Math.random().toString(36).slice(2, 8)}`,
      question: String(item.question || "").trim(),
      answer: String(item.answer || "").trim(),
      category: normalizeCategory(String(item.category || category)),
      difficulty: normalizeDifficulty(String(item.difficulty || difficulty)),
      tags: Array.isArray(item.tags) ? item.tags.map(String).slice(0, 8) : [topic],
      source: "agnes" as const,
      topic,
      createdAt: now + index
    })).filter((item) => item.question && item.answer);

    return NextResponse.json({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : "生成面试题失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
