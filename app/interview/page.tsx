
"use client";

import { useEffect, useMemo, useState } from "react";
import { Hero, Section } from "@/components/Blocks";
import {
  clearInterviewQuestions,
  deleteInterviewQuestion,
  exportQuestionsAsJson,
  listInterviewQuestions,
  saveInterviewQuestions,
  type InterviewCategory,
  type InterviewDifficulty,
  type InterviewQuestion
} from "@/lib/interviewDb";
import { presetQuestions } from "@/data/interviewPresets";

async function exportToPdf(questions: InterviewQuestion[], title: string = "面试题库") {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, 14, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Export Date: ${new Date().toLocaleDateString("zh-CN")} | Total: ${questions.length}`, 14, 28);

  let y = 38;
  const lineHeight = 7;
  const pageHeight = 280;

  questions.forEach((q, index) => {
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    const questionText = `${index + 1}. ${q.question}`;
    const questionLines = doc.splitTextToSize(questionText, 180);
    doc.text(questionLines, 14, y);
    y += questionLines.length * lineHeight;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`[${q.category}] [${q.difficulty}]`, 14, y);
    y += lineHeight;

    doc.setTextColor(23, 32, 51);
    const answerLines = doc.splitTextToSize(q.answer, 175);
    doc.text(answerLines, 14, y);
    y += answerLines.length * lineHeight + 4;

    doc.setDrawColor(226, 232, 240);
    doc.line(14, y, 196, y);
    y += 6;
  });

  doc.save(`${title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

const categories: Array<InterviewCategory | "全部"> = [
  "全部",
  "前端",
  "后端",
  "数据库",
  "Redis",
  "架构",
  "AI应用",
  "RAG",
  "Agent",
  "部署运维",
  "安全",
  "综合"
];

const difficulties: Array<InterviewDifficulty | "全部"> = [
  "全部",
  "基础",
  "中级",
  "高级",
  "综合"
];

const FLASH_STORAGE_KEY = "interview-flash-mastery-v1";
const FLASH_FOCUS = new Set(["后端", "AI应用", "RAG", "Agent", "Redis", "数据库", "架构"]);

type Mastery = "unknown" | "learning" | "mastered";

function loadMastery(): Record<string, Mastery> {
  try {
    const raw = localStorage.getItem(FLASH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveMastery(data: Record<string, Mastery>) {
  localStorage.setItem(FLASH_STORAGE_KEY, JSON.stringify(data));
}

export default function InterviewPage() {
  const [topic, setTopic] = useState("Node 后端 + Redis + RAG");
  const [category, setCategory] = useState<InterviewCategory | "综合">("综合");
  const [difficulty, setDifficulty] = useState<InterviewDifficulty | "综合">("综合");
  const [count, setCount] = useState(10);
  const [items, setItems] = useState<InterviewQuestion[]>([]);
  const [keyword, setKeyword] = useState("");
  const [filterCategory, setFilterCategory] = useState<InterviewCategory | "全部">("全部");
  const [filterDifficulty, setFilterDifficulty] = useState<InterviewDifficulty | "全部">("全部");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [flashIndex, setFlashIndex] = useState(0);
  const [flashRevealed, setFlashRevealed] = useState(false);
  const [mastery, setMastery] = useState<Record<string, Mastery>>({});

  useEffect(() => {
    setMastery(loadMastery());
  }, []);

  async function refresh() {
    try {
      const data = await listInterviewQuestions();
      setItems(data);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "读取 IndexedDB 失败");
    }
  }

  useEffect(() => {
    async function init() {
      const existing = await listInterviewQuestions();
      const existingIds = new Set(existing.map((q) => q.question));

      const newQuestions = presetQuestions
        .filter((q) => !existingIds.has(q.question))
        .map((q) => ({
          ...q,
          id: `preset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          createdAt: Date.now()
        }));

      if (newQuestions.length > 0) {
        await saveInterviewQuestions(newQuestions);
      }

      refresh();
    }
    init();
  }, []);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return items.filter((item) => {
      const hitKeyword =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.tags.join(" ").toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q);

      const hitCategory = filterCategory === "全部" || item.category === filterCategory;
      const hitDifficulty = filterDifficulty === "全部" || item.difficulty === filterDifficulty;

      return hitKeyword && hitCategory && hitDifficulty;
    });
  }, [items, keyword, filterCategory, filterDifficulty]);

  const stats = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((item) => map.set(item.category, (map.get(item.category) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [items]);

  const flashPool = useMemo(() => {
    const focus = items.filter((q) => FLASH_FOCUS.has(q.category));
    const review = focus.filter((q) => mastery[q.id] !== "mastered");
    return review.length > 0 ? review : focus;
  }, [items, mastery]);

  const flashCard = flashPool[flashIndex % Math.max(flashPool.length, 1)];

  const masteryStats = useMemo(() => {
    const pool = items.filter((q) => FLASH_FOCUS.has(q.category));
    let mastered = 0;
    let learning = 0;
    pool.forEach((q) => {
      if (mastery[q.id] === "mastered") mastered++;
      else if (mastery[q.id] === "learning") learning++;
    });
    return { total: pool.length, mastered, learning };
  }, [items, mastery]);

  function setCardMastery(id: string, level: Mastery) {
    setMastery((prev) => {
      const next = { ...prev, [id]: level };
      saveMastery(next);
      return next;
    });
    setFlashRevealed(false);
    setFlashIndex((i) => i + 1);
  }

  function shuffleFlash() {
    setFlashIndex(Math.floor(Math.random() * Math.max(flashPool.length, 1)));
    setFlashRevealed(false);
  }

  async function generateQuestions() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/interview-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, category, difficulty, count })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "生成失败");
      }

      const generated = data.items as InterviewQuestion[];
      await saveInterviewQuestions(generated);
      await refresh();
      setMessage(`已生成并保存 ${generated.length} 道题到 IndexedDB。`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "生成失败");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteInterviewQuestion(id);
    await refresh();
  }

  async function handleClear() {
    const ok = confirm("确定清空本地 IndexedDB 里的所有面试题吗？");
    if (!ok) return;

    await clearInterviewQuestions();
    await refresh();
    setMessage("已清空本地面试题库。");
  }

  function toggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <>
      <Hero
        title="AI 面试题库"
        desc="内置 40+ 道 2026 高频题（后端/RAG/Agent/MCP）。支持闪卡复习、分类筛选、AI 生成新题。建议每天 10 张闪卡 + 知识页自测。"
      />

      <Section title="闪卡复习（加强记忆）">
        <div className="callout good">
          点击卡片翻面看答案。会了的点「掌握了」，模糊的点「还要复习」——系统会优先推送未掌握的题。
        </div>

        {flashPool.length === 0 ? (
          <div className="callout warn">题库为空，刷新页面加载预设题，或下方 AI 生成一批。</div>
        ) : (
          <div className="flashPanel">
            <div className="flashStats">
              <span>复习池 <b>{flashPool.length}</b> 道</span>
              <span>已掌握 <b>{masteryStats.mastered}</b> / {masteryStats.total}</span>
              <span>待加强 <b>{masteryStats.learning}</b></span>
            </div>

            <div
              className={`flashCard${flashRevealed ? " revealed" : ""}`}
              onClick={() => setFlashRevealed(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setFlashRevealed(true)}
            >
              <div className="flashMeta">
                <span className="badge">{flashCard.category}</span>
                <span className="badge">{flashCard.difficulty}</span>
                {mastery[flashCard.id] === "learning" && <span className="badge">待复习</span>}
              </div>
              <p className="flashQuestion">{flashCard.question}</p>
              {flashRevealed ? (
                <p className="flashAnswer">{flashCard.answer}</p>
              ) : (
                <p className="flashAnswer" style={{ color: "var(--muted)", textAlign: "center" }}>
                  先自己想 30 秒，点击翻面
                </p>
              )}
            </div>

            <div className="flashActions">
              <button className="secondary" onClick={() => setFlashIndex((i) => Math.max(0, i - 1))}>
                上一题
              </button>
              <button onClick={shuffleFlash}>随机一题</button>
              <button
                className="secondary"
                onClick={() => setFlashIndex((i) => i + 1)}
              >
                下一题
              </button>
              {flashRevealed && (
                <>
                  <button
                    className="ghost"
                    onClick={() => setCardMastery(flashCard.id, "learning")}
                  >
                    还要复习
                  </button>
                  <button onClick={() => setCardMastery(flashCard.id, "mastered")}>
                    掌握了
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </Section>

      <Section title="生成面试题">
        <div className="callout good">
          面试题会通过 Next.js API Route 调 Agnes 生成，然后保存到浏览器 IndexedDB。
          这些题默认只保存在当前浏览器本地，不会进入数据库。
        </div>

        <div className="demoPanel">
          <label>方向 / 关键词</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：Vue3 面试题、Node 后端、Redis 缓存、RAG、AI Agent、系统设计"
          />

          <label>分类</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as InterviewCategory)}>
            {categories.filter((x) => x !== "全部").map((x) => <option key={x}>{x}</option>)}
          </select>

          <label>难度</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as InterviewDifficulty)}>
            {difficulties.filter((x) => x !== "全部").map((x) => <option key={x}>{x}</option>)}
          </select>

          <label>数量</label>
          <input
            type="number"
            min={3}
            max={30}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />

          <button onClick={generateQuestions} disabled={loading}>
            {loading ? "Agnes 正在生成..." : "AI 生成并保存到 IndexedDB"}
          </button>
          <button className="secondary" onClick={() => exportQuestionsAsJson(items)}>导出 JSON</button>
          <button className="secondary" onClick={() => exportToPdf(filtered, "面试题库")}>导出 PDF</button>
          <button className="ghost" onClick={handleClear}>清空题库</button>

          {message && <div className="demoOutput">{message}</div>}
        </div>
      </Section>

      <Section title="本地题库统计">
        <div className="grid three">
          <div className="card">
            <h3>总题数</h3>
            <p>{items.length} 道</p>
          </div>
          <div className="card">
            <h3>当前筛选</h3>
            <p>{filtered.length} 道</p>
          </div>
          <div className="card">
            <h3>分类分布</h3>
            <p>{stats.length ? stats.map(([k, v]) => `${k}:${v}`).join("，") : "暂无数据"}</p>
          </div>
        </div>
      </Section>

      <Section title="筛选展示">
        <div className="demoPanel">
          <label>关键词搜索</label>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索题目、答案、标签、生成主题"
          />

          <label>分类筛选</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as InterviewCategory | "全部")}>
            {categories.map((x) => <option key={x}>{x}</option>)}
          </select>

          <label>难度筛选</label>
          <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value as InterviewDifficulty | "全部")}>
            {difficulties.map((x) => <option key={x}>{x}</option>)}
          </select>
        </div>

        {filtered.length === 0 && (
          <div className="callout warn">
            暂无题目。你可以先输入方向，让 Agnes 生成一批面试题。
          </div>
        )}

        <div className="grid two">
          {filtered.map((item) => (
            <article className="card" key={item.id}>
              <div>
                <span className="badge">{item.category}</span>
                <span className="badge">{item.difficulty}</span>
                {item.tags.map((tag) => <span className="badge" key={tag}>{tag}</span>)}
              </div>

              <h3>{item.question}</h3>

              <p>
                <b>来源：</b>{item.source === "agnes" ? "Agnes 生成" : "手动添加"}　
                <b>主题：</b>{item.topic}
              </p>

              {expanded[item.id] ? (
                <div className="demoOutput">{item.answer}</div>
              ) : (
                <p>{item.answer.slice(0, 120)}{item.answer.length > 120 ? "..." : ""}</p>
              )}

              <button onClick={() => toggle(item.id)}>
                {expanded[item.id] ? "收起答案" : "展开答案"}
              </button>
              <button className="ghost" onClick={() => handleDelete(item.id)}>删除</button>
            </article>
          ))}
        </div>
      </Section>

      <Section title="推荐复习顺序">
        <ol>
          <li><b>后端</b>：事件循环 → REST/幂等 → JWT → Redis 三板斧(缓存/限流/锁) → 分层架构</li>
          <li><b>RAG</b>：切片 → Embedding → Hybrid → Rerank → 召回排查链路</li>
          <li><b>Agent</b>：Tool Calling → Agent Loop → MCP → LangGraph → Memory</li>
          <li><b>生产化</b>：Harness → 评测黄金集 → 模型网关 → Prompt Injection 防护</li>
          <li>去知识页的「AI 面试高频考点」模块，用每张卡的<b>自测 tab</b>配合闪卡复习</li>
        </ol>
      </Section>
    </>
  );
}
