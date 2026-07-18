"use client";

import { useState } from "react";
import type { KnowledgeGroup, KnowledgeItem } from "@/data/content";
import { enrichKnowledgeGroup, splitUnderstandingPoints } from "@/lib/knowledge";

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

type TabId = "quick" | "deep" | "interview" | "quiz";

function KnowledgeItemCard({ item }: { item: KnowledgeItem }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabId>("quick");
  const [quizOpen, setQuizOpen] = useState(false);

  const oneLine = item.oneLine ?? item.desc;
  const points =
    item.keyPoints?.length
      ? item.keyPoints
      : splitUnderstandingPoints(item.understanding);

  const tabs = [
    { id: "quick" as const, label: "速记", show: true },
    { id: "deep" as const, label: "深入", show: points.length > 0 || !!item.understanding },
    { id: "interview" as const, label: "面试", show: !!item.interviewQA },
    { id: "quiz" as const, label: "自测", show: !!item.interviewQA || points.length > 0 }
  ].filter((t) => t.show);

  return (
    <div className={`kItem${open ? " open" : ""}`}>
      <button className="kHeader" onClick={() => setOpen(!open)} aria-expanded={open}>
        <div className="kHeaderText">
          <span className="kName">{item.name}</span>
          <span className="kDesc">{oneLine}</span>
        </div>
        <span className="kChevron" aria-hidden>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="kBody">
          <div className="kOneLine">{oneLine}</div>

          {item.analogy && (
            <div className="kRow">
              <span className="kLabel analogy">通俗理解</span>
              <p>{item.analogy}</p>
            </div>
          )}

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

          {item.memoryTip && (
            <div className="kMemoryTip">
              <span className="kMemoryIcon">💡</span>
              {item.memoryTip}
            </div>
          )}

          {tabs.length > 0 && (
            <>
              <div className="kTabs" role="tablist">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    className={`kTab${tab === t.id ? " active" : ""}`}
                    onClick={() => {
                      setTab(t.id);
                      if (t.id !== "quiz") setQuizOpen(false);
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="kTabPanel">
                {tab === "quick" && points.length > 0 && (
                  <ul className="kPoints">
                    {points.slice(0, 5).map((point, i) => (
                      <li key={i}>{point.replace(/^\d+\)\s*/, "")}</li>
                    ))}
                  </ul>
                )}

                {tab === "deep" && (
                  <div className="understanding">
                    {points.length > 0 ? (
                      <ul className="kPoints">
                        {points.map((point, i) => (
                          <li key={i}>{point.replace(/^\d+\)\s*/, "")}</li>
                        ))}
                      </ul>
                    ) : (
                      item.understanding?.split("；").map((point, i) => (
                        <div key={i} className="understanding-point">{point}</div>
                      ))
                    )}
                  </div>
                )}

                {tab === "interview" && item.interviewQA && (
                  <div className="kInterview">
                    <p className="kInterviewQ"><b>常问：</b>{item.interviewQA.question}</p>
                    <p className="kInterviewA"><b>答法：</b>{item.interviewQA.answer}</p>
                  </div>
                )}

                {tab === "quiz" && (
                  <div className="kQuiz">
                    <p className="kQuizPrompt">
                      {item.interviewQA
                        ? "先用自己的话回答下面这道题，再点开核对。"
                        : "先回忆这个知识点的 3 个要点，再点开核对。"}
                    </p>
                    {item.interviewQA && (
                      <p className="kQuizQuestion">{item.interviewQA.question}</p>
                    )}
                    <button
                      className="expandBtn"
                      onClick={() => setQuizOpen(!quizOpen)}
                    >
                      {quizOpen ? "收起答案" : "我想好了，看答案"}
                    </button>
                    {quizOpen && (
                      <div className="kQuizAnswer">
                        {item.interviewQA ? (
                          <p>{item.interviewQA.answer}</p>
                        ) : (
                          <ul className="kPoints">
                            {points.slice(0, 3).map((point, i) => (
                              <li key={i}>{point.replace(/^\d+\)\s*/, "")}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function KnowledgeGroupView({ group }: { group: KnowledgeGroup }) {
  const enriched = enrichKnowledgeGroup(group);
  return (
    <Section title={enriched.title}>
      <p className="groupIntro">{enriched.intro}</p>
      <div className="kList">
        {enriched.items.map((item) => (
          <KnowledgeItemCard key={item.name} item={item} />
        ))}
      </div>
    </Section>
  );
}
