
"use client";

import { useState } from "react";
import type { KnowledgeGroup } from "@/data/content";

export function Hero({ title, desc }: { title: string; desc: string }) {
  return (
    <section className="hero">
      <p className="eyebrow">Backend & AI Application Knowledge System</p>
      <h1>{title}</h1>
      <p>{desc}</p>
    </section>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="section"><h2>{title}</h2>{children}</section>;
}

export function KnowledgeGroupView({ group }: { group: KnowledgeGroup }) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (name: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (
    <Section title={group.title}>
      <p>{group.intro}</p>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>知识点</th>
              <th>你需要理解什么</th>
              <th>项目中怎么用</th>
              <th>常见误区</th>
              <th>项目难点</th>
            </tr>
          </thead>
          <tbody>
            {group.items.map((item) => (
              <tr key={item.name}>
                <td><b>{item.name}</b></td>
                <td>
                  <div>{item.desc}</div>
                  {item.understanding && (
                    <>
                      <button
                        className="expandBtn"
                        onClick={() => toggleItem(item.name)}
                      >
                        {expandedItems.has(item.name) ? "收起" : "展开理解内容"}
                      </button>
                      {expandedItems.has(item.name) && (
                        <div className="understanding">
                          {item.understanding.split("；").map((point, i) => (
                            <div key={i} className="understanding-point">{point}</div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </td>
                <td>{item.projectUse}</td>
                <td>{item.mistake}</td>
                <td>{item.difficulty || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
