
"use client";

import { useMemo, useState } from "react";
import { Hero, Section } from "@/components/Blocks";
import { glossary } from "@/data/content";

export default function GlossaryPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return glossary;
    return glossary.filter((x) => (x.term + x.desc).toLowerCase().includes(query));
  }, [q]);

  return (
    <>
      <Hero title="术语库" desc="后端与 AI 应用常用术语速查。遇到不懂的词，也可以直接选中问 AI。" />

      <Section title="搜索术语">
        <input
          className="searchBox"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索：Webhook、Rerank、RBAC、队列、Prompt Injection..."
        />

        {filtered.map((item) => (
          <div className="term" key={item.term}>
            <b>{item.term}</b>
            <p>{item.desc}</p>
          </div>
        ))}
      </Section>
    </>
  );
}
