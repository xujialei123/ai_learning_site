
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
5. answer 必须详细、适合学习，是一份能直接拿来复习的讲解，不能只有一两句话。每道题的 answer 至少 300 字，并按以下小标题分段（纯文本，不要用 # * \` 等 markdown 符号），每个小标题单独成行：
   核心概念：用一两句话讲清本质。
   原理与机制：底层怎么工作、为什么这样设计。
   项目场景：在真实项目里怎么用、解决什么问题。
   常见误区：面试者容易答错或忽略的点。
   加分回答：能体现深度的延伸点或最佳实践。
6. 题目要偏真实面试和真实项目，有一定深度和区分度，不要太水。`;

    const userPrompt = `请生成 ${count} 道技术面试题。

方向/关键词：${topic}
期望分类：${category}
期望难度：${difficulty}

输出格式示例：
[
  {
    "question": "Redis 为什么不能直接替代 MySQL？",
    "answer": "核心概念：Redis 是基于内存的键值数据库，MySQL 是持久化的关系型数据库，两者定位不同，不能相互替代。\n原理与机制：Redis 数据主要存在内存中，读写走内存所以极快，但内存容量有限、成本高；持久化靠 RDB 快照和 AOF 日志，异常场景仍可能丢少量数据。MySQL 数据落盘，支持事务 ACID、复杂 SQL 查询、多表关联和二级索引。\n项目场景：真实项目里通常 MySQL 存业务主数据（订单、用户），Redis 做缓存热点数据、限流、分布式锁、排行榜、会话等，二者配合使用。\n常见误区：把 Redis 当成主库存所有数据；忽略缓存与数据库的一致性（更新数据库后没删缓存导致脏读）；以为 Redis 完全不会丢数据。\n加分回答：能讲清缓存更新策略（Cache Aside）、缓存穿透/击穿/雪崩的应对，以及 Redis 持久化与主从、哨兵、集群的取舍。",
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
        temperature: 0.5,
        max_tokens: Math.min(Math.max(2000, count * 800), 8000)
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
