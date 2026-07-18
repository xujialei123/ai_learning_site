"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Hero, Section } from "@/components/Blocks";
import {
  countTutorialSteps,
  tutorialPhases,
  tutorialProject,
  tutorialTechChecklist,
  type TutorialStep
} from "@/data/backendTutorial";

const STORAGE_KEY = "backend-tutorial-progress-v1";

export default function TutorialPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);
  const [phaseId, setPhaseId] = useState(tutorialPhases[0].id);
  const [copied, setCopied] = useState<string | null>(null);

  const allSteps = useMemo(
    () => tutorialPhases.flatMap((p) => p.steps.map((s) => ({ ...s, phaseId: p.id }))),
    []
  );
  const total = countTutorialSteps();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  }, [done, loaded]);

  const doneCount = useMemo(
    () => allSteps.filter((s) => done[s.id]).length,
    [allSteps, done]
  );
  const percent = Math.round((doneCount / total) * 100);
  const nextStep = allSteps.find((s) => !done[s.id]);
  const phase = tutorialPhases.find((p) => p.id === phaseId) ?? tutorialPhases[0];

  function toggle(id: string) {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function reset() {
    if (confirm("确定清空本教程的全部打卡进度吗？")) setDone({});
  }

  async function copyPrompt(step: TutorialStep) {
    try {
      await navigator.clipboard.writeText(step.aiPrompt);
      setCopied(step.id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      alert("复制失败，请手动选中提示词复制。");
    }
  }

  function phaseProgress(pid: string) {
    const steps = tutorialPhases.find((p) => p.id === pid)?.steps ?? [];
    const d = steps.filter((s) => done[s.id]).length;
    return { d, t: steps.length };
  }

  return (
    <>
      <Hero
        title="后端实战教程：从零搭建完整项目"
        desc="按天执行，做出可演示、可部署的多租户 AI 知识库客服。每一步都对应知识体系里的技术，并附带可复制的 AI 指令。"
      />

      <Section title="你将做成什么">
        <div className="callout good">
          <b>{tutorialProject.name}</b> — {tutorialProject.oneLiner}
        </div>
        <p className="groupIntro">{tutorialProject.repoHint}</p>
        <div className="grid two">
          <div className="card">
            <h3>技术栈（本教程会用到）</h3>
            <ul className="tutList">
              {tutorialProject.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3>最终演示清单</h3>
            <ul className="tutList">
              {tutorialProject.finalDemo.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="我的进度">
        <div className="progressWrap">
          <div className="progressMeta">
            <b>
              {doneCount} / {total} 步
            </b>
            <span>{percent}%</span>
          </div>
          <div className="progressBar">
            <div className="progressFill" style={{ width: `${percent}%` }} />
          </div>
          {nextStep ? (
            <p className="progressNext">
              下一步：<b>{nextStep.day}</b> — {nextStep.title}
              <button
                className="secondary"
                style={{ marginLeft: 12 }}
                onClick={() => {
                  const p = allSteps.find((s) => s.id === nextStep.id);
                  if (p) setPhaseId(p.phaseId);
                }}
              >
                跳到该阶段
              </button>
            </p>
          ) : (
            <p className="progressNext">全部完成！去面试题库用项目经验做一轮模拟面试吧。</p>
          )}
          <button className="ghost" onClick={reset}>
            清空教程打卡
          </button>
        </div>
      </Section>

      <Section title="怎么用本教程">
        <ol>
          <li>
            <b>每天只做一步</b>（标注了预计耗时）。先读「先学」链接到知识页，再动手。
          </li>
          <li>
            <b>卡住就复制「AI 指令」</b>到 Cursor / Claude，但要自己看懂 diff 再接受。
          </li>
          <li>
            <b>验收标准全勾上</b>再点打卡；不要跳步（尤其是鉴权与多租户）。
          </li>
          <li>
            配合{" "}
            <Link href="/backend">后端知识体系</Link>、{" "}
            <Link href="/glossary">术语库</Link>、{" "}
            <Link href="/interview">面试闪卡</Link>。
          </li>
        </ol>
      </Section>

      <Section title="阶段导航">
        <div className="tutPhaseNav">
          {tutorialPhases.map((p) => {
            const { d, t } = phaseProgress(p.id);
            return (
              <button
                key={p.id}
                className={`tutPhaseBtn${phaseId === p.id ? " active" : ""}`}
                onClick={() => setPhaseId(p.id)}
              >
                <span className="tutPhaseTitle">{p.title}</span>
                <span className="tutPhaseMeta">
                  {d}/{t} 步
                </span>
              </button>
            );
          })}
        </div>

        <div className="tutPhaseHead">
          <h3>{phase.title}</h3>
          <p>{phase.subtitle}</p>
          <div className="callout warn">
            <b>本阶段完成标志：</b>
            {phase.outcome}
          </div>
        </div>

        <div className="tutStepList">
          {phase.steps.map((step) => (
            <article
              key={step.id}
              className={`tutStep${done[step.id] ? " done" : ""}`}
              id={step.id}
            >
              <header className="tutStepHead">
                <div>
                  <span className="badge">{step.day}</span>
                  <span className="badge">{step.hours}</span>
                  <h3>{step.title}</h3>
                  <p className="tutGoal">{step.goal}</p>
                </div>
                <label className="tutCheck">
                  <input
                    type="checkbox"
                    checked={!!done[step.id]}
                    onChange={() => toggle(step.id)}
                  />
                  打卡完成
                </label>
              </header>

              <div className="tutBlock">
                <b>本步技术点</b>
                <div className="tutTags">
                  {step.techs.map((t) => (
                    <span className="badge" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="tutBlock">
                <b>先学（知识页）</b>
                <p>
                  {step.study} → 打开 <Link href="/backend">/backend</Link> 对照阅读
                </p>
              </div>

              <div className="tutBlock">
                <b>动手清单</b>
                <ol>
                  {step.todos.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ol>
              </div>

              {step.files && step.files.length > 0 && (
                <div className="tutBlock">
                  <b>建议产出文件</b>
                  <pre className="code">{step.files.join("\n")}</pre>
                </div>
              )}

              <div className="tutBlock">
                <div className="tutPromptBar">
                  <b>复制给 AI 的指令</b>
                  <button className="secondary" onClick={() => copyPrompt(step)}>
                    {copied === step.id ? "已复制" : "复制指令"}
                  </button>
                </div>
                <pre className="code">{step.aiPrompt}</pre>
              </div>

              <div className="tutBlock">
                <b>验收标准（全过再打卡）</b>
                <ul>
                  {step.accept.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section title="技术覆盖对照表">
        <p className="groupIntro">
          下表确保知识体系里的后端关键技术都在教程里用过至少一次。点步骤 ID 可跳到对应阶段。
        </p>
        <div className="tutTechTable">
          {tutorialTechChecklist.map((row) => (
            <div className="tutTechRow" key={row.tech}>
              <div className="tutTechName">{row.tech}</div>
              <div className="tutTechSteps">
                {row.stepIds.map((id) => {
                  const step = allSteps.find((s) => s.id === id);
                  return (
                    <button
                      key={id}
                      className={`badge tutJump${done[id] ? " ok" : ""}`}
                      onClick={() => {
                        if (step) setPhaseId(step.phaseId);
                        setTimeout(() => {
                          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                        }, 50);
                      }}
                    >
                      {step?.day ?? id}
                      {done[id] ? " ✓" : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="学习节奏建议">
        <ul>
          <li>
            <b>兼职</b>：每天 1 步，约 3 周完成。
          </li>
          <li>
            <b>全职冲刺</b>：每天 2–3 步，约 8–10 天完成。
          </li>
          <li>
            <b>卡关原则</b>：同一验收标准连续失败 2 次，先回知识页自测 tab，再问站内 AI。
          </li>
          <li>
            做完后用面试题：「如何设计多租户 RAG 客服」「缓存三板斧」「SSE 与限流」对照本项目回答。
          </li>
        </ul>
      </Section>
    </>
  );
}
