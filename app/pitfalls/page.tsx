
"use client";

import { useMemo, useState } from "react";
import { Hero, Section } from "@/components/Blocks";
import { pitfalls, type Pitfall, type PitfallCategory } from "@/data/pitfalls";

const severityClass: Record<Pitfall["severity"], string> = {
  "资损事故": "sev-money",
  "数据事故": "sev-data",
  "全站故障": "sev-outage",
  "安全事故": "sev-security",
  "体验问题": "sev-ux",
  "成本失控": "sev-money"
};

function PitfallCard({ item }: { item: Pitfall }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <article className="pitCard">
      <header className="pitHead">
        <h3>{item.title}</h3>
        <div className="pitBadges">
          <span className={`sevBadge ${severityClass[item.severity]}`}>{item.severity}</span>
          <span className="badge">{item.category}</span>
        </div>
      </header>

      <div className="pitScene">
        <span className="kLabel mistake">事故现场</span>
        <p>{item.symptom}</p>
      </div>

      {!revealed ? (
        <div className="pitThink">
          <p>先自己想 30 秒：问题可能出在哪？怎么修？怎么防？</p>
          <button onClick={() => setRevealed(true)}>看根因与预防</button>
        </div>
      ) : (
        <div className="pitAnswer">
          <div className="kRow">
            <span className="kLabel hard">根因</span>
            <p>{item.rootCause}</p>
          </div>
          <div className="kRow">
            <span className="kLabel use">怎么修</span>
            <p>{item.fix}</p>
          </div>
          <div className="pitPrevent">
            <b>预防清单</b>
            <ul>
              {item.prevention.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
          <button className="ghost" onClick={() => setRevealed(false)}>收起</button>
        </div>
      )}
    </article>
  );
}

export default function PitfallsPage() {
  const categories = useMemo(
    () => Array.from(new Set(pitfalls.map((p) => p.category))) as PitfallCategory[],
    []
  );
  const [active, setActive] = useState<PitfallCategory | "全部">("全部");

  const filtered = active === "全部" ? pitfalls : pitfalls.filter((p) => p.category === active);

  return (
    <>
      <Hero
        title="真实项目踩坑集"
        desc="每个案例都是真实项目里高频发生的事故。先看「事故现场」自己判断问题在哪，再对照根因和预防清单——这训练的是 AI 时代最值钱的能力：判断力。"
      />

      <Section title="怎么用这个页面">
        <ol>
          <li>看「事故现场」的现象描述，<b>先别点开答案</b>，自己推理 30 秒：可能是什么原因？</li>
          <li>点开对照根因——猜对了说明这块知识已内化，猜错了去对应知识页补课。</li>
          <li>把「预防清单」变成你写代码时的检查习惯，这比背概念有用得多。</li>
          <li>进阶玩法：选中案例文字，让 AI 助手「结合项目」出一道类似的排查题考你。</li>
        </ol>
      </Section>

      <Section title={`案例列表（${filtered.length} 个）`}>
        <div className="pitFilter">
          <button
            className={active === "全部" ? "" : "ghost"}
            onClick={() => setActive("全部")}
          >
            全部 {pitfalls.length}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={active === cat ? "" : "ghost"}
              onClick={() => setActive(cat)}
            >
              {cat} {pitfalls.filter((p) => p.category === cat).length}
            </button>
          ))}
        </div>

        <div className="pitList">
          {filtered.map((item) => <PitfallCard key={item.title} item={item} />)}
        </div>
      </Section>
    </>
  );
}
