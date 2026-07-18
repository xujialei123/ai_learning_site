
"use client";

import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

type AskMode = "explain" | "project" | "practice" | "manual";
type Message = {
  role: "user" | "ai" | "error";
  content: string;
};

const modeLabel: Record<Exclude<AskMode, "manual">, string> = {
  explain: "解释概念",
  project: "结合项目",
  practice: "给练习"
};

const suggestions = [
  { text: "Rerank 是什么？", mode: "explain" as AskMode },
  { text: "Redis 限流怎么设计？", mode: "manual" as AskMode },
  { text: "向量检索和关键词搜索有什么区别？", mode: "explain" as AskMode },
  { text: "JWT 和 Session 怎么选？", mode: "explain" as AskMode },
  { text: "帮我设计一个限流方案", mode: "practice" as AskMode }
];

export default function AskAssistant() {
  const [selected, setSelected] = useState("");
  const [toolbar, setToolbar] = useState<{ x: number; y: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const queueRef = useRef<Array<{ mode: AskMode; question: string }>>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  // 只看实际滚动位置：贴近底部就跟随新消息，离开底部就停止跟随
  const pinnedRef = useRef(true);
  const [showJump, setShowJump] = useState(false);

  function handleBodyScroll() {
    const el = bodyRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    pinnedRef.current = atBottom;
    setShowJump(!atBottom);
  }

  function jumpToBottom() {
    const el = bodyRef.current;
    if (!el) return;
    pinnedRef.current = true;
    setShowJump(false);
    el.scrollTop = el.scrollHeight;
  }

  useEffect(() => {
    if (pinnedRef.current) {
      const el = bodyRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }
  }, [messages, loading, thinking]);

  useEffect(() => {
    function handleMouseUp() {
      setTimeout(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim() || "";
        if (!text || text.length < 2) {
          setToolbar(null);
          return;
        }
        const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
        const rect = range?.getBoundingClientRect();
        if (!rect) return;

        setSelected(text.slice(0, 600));
        setInput(`请解释：${text.slice(0, 300)}`);
        setToolbar({
          x: Math.min(rect.left + rect.width / 2, window.innerWidth - 260),
          y: Math.max(rect.top - 52, 12)
        });
      }, 0);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setOpen(true);
        setToolbar(null);
      }
      if (e.key === "Escape") {
        setToolbar(null);
      }
    }

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function processQueue() {
    if (queueRef.current.length === 0) return;

    const { mode, question } = queueRef.current.shift()!;
    await askWithParams(mode, question);
  }

  async function askWithParams(mode: AskMode, question: string) {
    setOpen(true);
    setToolbar(null);
    setThinking(true);
    // 发新问题时重新跟随到底部
    pinnedRef.current = true;
    setShowJump(false);

    const pageTitle = document.title;
    const pageContext = document.body.innerText.slice(0, 7000);
    const userMsg =
      mode === "manual"
        ? question
        : `${modeLabel[mode]}：${selected || question}`;

    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          term: selected,
          question,
          mode,
          pageTitle,
          pageContext,
          history: messages.slice(-6)
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "请求失败");
      }

      if (!res.body) {
        throw new Error("没有收到流式响应");
      }

      setThinking(false);
      setLoading(true);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";

      setMessages((prev) => [...prev, { role: "ai", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiContent += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg && lastMsg.role === "ai") {
            lastMsg.content = aiContent;
          }
          return updated;
        });
      }
    } catch (err) {
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        { role: "error", content: err instanceof Error ? err.message : "请求失败" }
      ]);
    } finally {
      setLoading(false);

      if (queueRef.current.length > 0) {
        setTimeout(() => processQueue(), 300);
      }
    }
  }

  async function ask(mode: AskMode, customQuestion?: string) {
    const question =
      customQuestion ||
      input.trim() ||
      (selected ? `请解释：${selected}` : "");

    if (!question) {
      setOpen(true);
      setMessages((prev) => [...prev, { role: "error", content: "请先选中文本，或者在输入框里输入问题。" }]);
      return;
    }

    setInput("");

    if (loading || thinking) {
      queueRef.current.push({ mode, question });
      setMessages((prev) => [...prev, { role: "user", content: `(排队中) ${question}` }]);
      return;
    }

    await askWithParams(mode, question);
  }

  return (
    <>
      {toolbar && (
        <div className="selectionToolbar" style={{ left: toolbar.x, top: toolbar.y }}>
          <button onClick={() => ask("explain")}>解释</button>
          <button onClick={() => ask("project")}>结合项目</button>
          <button onClick={() => ask("practice")}>给练习</button>
        </div>
      )}

      {!open && (
        <button className="aiFab" onClick={() => setOpen(true)}>
          AI 学习助手
        </button>
      )}

      {open && (
        <>
          <div className="aiDrawerMask" onClick={() => setOpen(false)} />
          <aside className="aiDrawer">
            <div className="aiDrawerHeader">
              <div>
                <h3>AI 学习助手</h3>
                <div className="smallText">选词解释 / 结合项目 / 连续追问 / Alt + A 打开</div>
              </div>
              <button className="ghost" onClick={() => setOpen(false)}>关闭</button>
            </div>

            <div className="aiDrawerBody" ref={bodyRef} onScroll={handleBodyScroll}>
              {selected && (
                <div className="selectedBox">
                  <b>当前选中：</b>
                  <div>{selected}</div>
                </div>
              )}

              {messages.length === 0 && (
                <div className="aiHint">
                  <div style={{ marginBottom: 12 }}>👋 你好！我是你的 AI 学习助手，可以帮你理解技术概念、结合项目讲解、或者给你出练习题。</div>
                  <div style={{ marginBottom: 8 }}><b>试试这些：</b></div>
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="suggestionItem"
                      onClick={() => ask(s.mode, s.text)}
                    >
                      {s.text}
                    </div>
                  ))}
                </div>
              )}

              {messages.map((msg, index) => (
                <div className={`chatMessage ${msg.role}`} key={index}>
                  {msg.role === "ai" ? (
                    <div className="markdown-body">
                      <Markdown>{msg.content || "..."}</Markdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              ))}

              {thinking && (
                <div className="chatMessage ai thinking">
                  <div className="thinkingDots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="thinkingText">正在思考中...</div>
                </div>
              )}

              {loading && messages.length > 0 && messages[messages.length - 1].role === "ai" && messages[messages.length - 1].content === "" && (
                <div className="chatMessage ai thinking">
                  <div className="thinkingDots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="thinkingText">正在组织回答...</div>
                </div>
              )}

              {queueRef.current.length > 0 && (
                <div className="queueHint">
                  📋 已有 {queueRef.current.length} 条消息排队中
                </div>
              )}
            </div>

            {showJump && (
              <button className="jumpToBottom" onClick={jumpToBottom}>
                ↓ 回到底部{(loading || thinking) ? "（回复中）" : ""}
              </button>
            )}

            <div className="aiDrawerFooter">
              <div className="quickRow">
                <button onClick={() => ask("explain")} disabled={loading || thinking}>解释选中内容</button>
                <button onClick={() => ask("project")} disabled={loading || thinking}>结合项目讲</button>
                <button onClick={() => ask("practice")} disabled={loading || thinking}>给我练习</button>
                <button onClick={() => { setMessages([]); queueRef.current = []; }}>清空对话</button>
              </div>

              <textarea
                className="askInput"
                value={input}
                placeholder={loading || thinking ? "正在回复中，消息会进入排队..." : "也可以手动提问，比如：奶茶店点单系统里 Redis 限流怎么设计？"}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    ask("manual");
                  }
                }}
              />

              <div className="drawerActions">
                <span className="smallText">
                  {loading || thinking ? "回复中..." : "Ctrl / Cmd + Enter 发送"}
                </span>
                <button onClick={() => ask("manual")} disabled={false}>
                  {loading || thinking ? "排队" : "发送"}
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
