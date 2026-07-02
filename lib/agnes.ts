
export type AskMode = "explain" | "project" | "practice" | "manual";

type HistoryMessage = {
  role: "user" | "ai" | "error";
  content: string;
};

export type AskInput = {
  term: string;
  question: string;
  mode: AskMode;
  pageTitle?: string;
  pageContext?: string;
  history?: HistoryMessage[];
};

function buildPrompt({ term, question, mode, pageTitle, pageContext, history }: AskInput) {
  const apiKey = process.env.AGNES_API_KEY;
  const baseUrl = (process.env.AGNES_API_BASE_URL || "https://apihub.agnes-ai.com/v1").replace(/\/$/, "");
  const model = process.env.AGNES_MODEL || "agnes-2.0-flash";
  const maxTokens = Number(process.env.AGNES_MAX_TOKENS || 900);

  if (!apiKey) {
    throw new Error("缺少 AGNES_API_KEY。请复制 .env.local.example 为 .env.local，并填入你的 Agnes API Key。");
  }

  const modeInstruction: Record<AskMode, string> = {
    explain: "解释选中的词或句子。先一句话解释，再用前端工程师能理解的方式讲清楚。",
    project: "重点结合 AI 商家客服运营系统解释：在项目哪里用、为什么需要、不会会出什么问题。",
    practice: "先简要解释，再给 3 个练习任务和 3 个自测问题。",
    manual: "回答用户的手动提问。结合页面上下文，尽量落到后端、全栈和 AI 应用项目。"
  };

  const systemPrompt = `你是中文技术学习导师，面向前端工程师补后端、架构和 AI 应用工程能力。
回答要求：
1. 用中文，具体、实用，不要空泛。
2. 尽量结合"AI 商家客服运营系统"。
3. 对概念要讲：是什么、为什么需要、项目中用在哪、常见误区、下一步怎么练。
4. 不要编造用户账号、API Key、真实价格。
5. 控制在 300-900 字。
6. 使用 Markdown 格式输出，包括标题、列表、代码块等。`;

  const historyText = (history || [])
    .slice(-6)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const userPrompt = `【模式】
${modeInstruction[mode]}

【当前选中】
${term || "无"}

【用户问题】
${question || "无"}

【当前页面】
${pageTitle || "未知页面"}

【页面上下文节选】
${(pageContext || "").slice(0, 4500)}

【最近对话】
${historyText || "无"}`;

  return { apiKey, baseUrl, model, maxTokens, systemPrompt, userPrompt };
}

export async function askAgnes(input: AskInput) {
  const { apiKey, baseUrl, model, maxTokens, systemPrompt, userPrompt } = buildPrompt(input);

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
      temperature: 0.3,
      max_tokens: maxTokens
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Agnes API 请求失败：${res.status} ${text.slice(0, 500)}`);
  }

  const data = await res.json();
  const answer = data?.choices?.[0]?.message?.content;
  if (!answer) {
    throw new Error("Agnes API 没有返回 choices[0].message.content。请检查模型名称和接口配置。");
  }

  return answer as string;
}

export async function askAgnesStream(input: AskInput): Promise<ReadableStream<Uint8Array>> {
  const { apiKey, baseUrl, model, maxTokens, systemPrompt, userPrompt } = buildPrompt(input);

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
      temperature: 0.3,
      max_tokens: maxTokens,
      stream: true
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Agnes API 请求失败：${res.status} ${text.slice(0, 500)}`);
  }

  if (!res.body) {
    throw new Error("Agnes API 没有返回流式响应。");
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = res.body!.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;

            const data = trimmed.slice(6);
            if (data === "[DONE]") {
              controller.close();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    }
  });

  return stream;
}
