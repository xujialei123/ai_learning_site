
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
      <Hero
        title="术语库"
        desc="后端、服务器、部署、架构与 AI 应用名词速查。指挥 AI 前先搜准词：SSH、upstream、幂等、熔断、BFF……选中也能直接问站内 AI。"
      />

      <Section title="搜索术语">
        <input
          className="searchBox"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索：SSH、Nginx、Docker、幂等、熔断、BFF、Webhook、RAG..."
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
