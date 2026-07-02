
import { NextRequest } from "next/server";
import { askAgnesStream, type AskMode } from "@/lib/agnes";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const term = String(body.term || "").trim();
    const question = String(body.question || "").trim();
    const mode = (body.mode || "manual") as AskMode;
    const pageTitle = String(body.pageTitle || "");
    const pageContext = String(body.pageContext || "");
    const history = Array.isArray(body.history) ? body.history : [];

    if (!term && !question) {
      return new Response(JSON.stringify({ error: "请先选中文本，或者输入一个问题。" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (term.length > 800 || question.length > 1200) {
      return new Response(JSON.stringify({ error: "内容太长，请缩短选中内容或问题。" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!["explain", "project", "practice", "manual"].includes(mode)) {
      return new Response(JSON.stringify({ error: "不支持的提问模式。" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const stream = await askAgnesStream({ term, question, mode, pageTitle, pageContext, history });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "服务异常";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
