
"use client";

import { useState } from "react";
import type { KnowledgeGroup, KnowledgeItem } from "@/data/content";

export function Hero({ title, desc }: { title: string; desc: string }) {
  return (
    <section className="hero">
      <p className="eyebrow">Full-Stack & AI Application Learning</p>
      <h1>{title}</h1>
      <p>{desc}</p>
    </section>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="section"><h2>{title}</h2>{children}</section>;
}

function KnowledgeItemCard({ item }: { item: KnowledgeItem }) {
  const [open, setOpen] = useState(false);
  const [showUnderstanding, setShowUnderstanding] = useState(false);

  return (
    <div className={`kItem${open ? " open" : ""}`}>
      <button className="kHeader" onClick={() => setOpen(!open)} aria-expanded={open}>
        <div className="kHeaderText">
          <span className="kName">{item.name}</span>
          <span className="kDesc">{item.desc}</span>
        </div>
        <span className="kChevron" aria-hidden>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="kBody">
          <div className="kRow">
            <span className="kLabel use">项目中怎么用</span>
            <p>{item.projectUse}</p>
          </div>
          <div className="kRow">
            <span className="kLabel mistake">常见误区</span>
            <p>{item.mistake}</p>
          </div>
          {item.difficulty && (
            <div className="kRow">
              <span className="kLabel hard">项目难点</span>
              <p>{item.difficulty}</p>
            </div>
          )}

          {item.understanding && (
            <>
              <button className="expandBtn" onClick={() => setShowUnderstanding(!showUnderstanding)}>
                {showUnderstanding ? "收起深入理解" : "展开深入理解"}
              </button>
              {showUnderstanding && (
                <div className="understanding">
                  {item.understanding.split("；").map((point, i) => (
                    <div key={i} className="understanding-point">{point}</div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function KnowledgeGroupView({ group }: { group: KnowledgeGroup }) {
  return (
    <Section title={group.title}>
      <p className="groupIntro">{group.intro}</p>
      <div className="kList">
        {group.items.map((item) => (
          <KnowledgeItemCard key={item.name} item={item} />
        ))}
      </div>
    </Section>
  );
}
