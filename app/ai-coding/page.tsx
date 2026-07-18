"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Hero, Section } from "@/components/Blocks";
import {
  comboTips,
  dailyWorkflow,
  directPatterns,
  promptSkeleton,
  reviewChecklist,
  rulesGuide,
  scenarioPlaybooks,
  toolOps
} from "@/data/aiCodingGuide";

export default function AiCodingPage() {
  const [toolId, setToolId] = useState(toolOps[0].id);
  const [sceneId, setSceneId] = useState(scenarioPlaybooks[0].id);
  const [copied, setCopied] = useState<string | null>(null);

  const tool = useMemo(
    () => toolOps.find((t) => t.id === toolId) ?? toolOps[0],
    [toolId]
  );
  const scene = useMemo(
    () => scenarioPlaybooks.find((s) => s.id === sceneId) ?? scenarioPlaybooks[0],
    [sceneId]
  );

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      alert("复制失败，请手动选择文本。");
    }
  }

  return (
    <>
      <Hero
        title="AI 编程：操作与指挥指南"
        desc="各工具怎么操作、日常怎么协作、怎样下指令才不翻车。工具会换，指挥方法通用——这是让 AI 真正帮你干活的核心技能。"
      />

      <Section title="和「工具介绍页」怎么分工">
        <div className="grid two">
          <div className="card">
            <h3>本页 · 操作与指挥</h3>
            <p>快捷键、模式、五段式指令、场景剧本、规则文件、审查清单——教你「怎么使唤 AI」。</p>
          </div>
          <div className="card">
            <h3>
              <Link href="/ai-tools">AI 编程工具教程</Link>
            </h3>
            <p>Cursor / Claude Code / Codex / 国产工具的选型、定价、上手步骤与特性对比。</p>
          </div>
        </div>
        <div className="callout good">
          建议顺序：先扫本页「每日流程」→ 选工具看操作速查 → 用场景剧本干活 → 配合{" "}
          <Link href="/tutorial">后端实战教程</Link> 逐步做项目。
        </div>
      </Section>

      <Section title="每日协作流程">
        <div className="grid three">
          {dailyWorkflow.map((w) => (
            <div className="card" key={w.title}>
              <h3>{w.title}</h3>
              <ul>
                {w.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="工具操作速查">
        <div className="tutPhaseNav">
          {toolOps.map((t) => (
            <button
              key={t.id}
              className={`tutPhaseBtn${toolId === t.id ? " active" : ""}`}
              onClick={() => setToolId(t.id)}
            >
              <span className="tutPhaseTitle">{t.name}</span>
              <span className="tutPhaseMeta">{t.form}</span>
            </button>
          ))}
        </div>

        <div className="callout">
          <b>什么时候用：</b>
          {tool.when}
        </div>

        <div className="grid two" style={{ marginTop: 16 }}>
          <div className="card">
            <h3>快捷键 / 命令</h3>
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>动作</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {tool.shortcuts.map((row) => (
                    <tr key={row.action}>
                      <td>
                        {row.action}
                        {row.note ? (
                          <div className="mutedSmall">{row.note}</div>
                        ) : null}
                      </td>
                      <td>
                        <code>{row.keys}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <h3>模式怎么选</h3>
            <ul>
              {tool.modes.map((m) => (
                <li key={m.name}>
                  <b>{m.name}</b>：{m.use}
                </li>
              ))}
            </ul>
            <h3 style={{ marginTop: 16 }}>必做习惯</h3>
            <ul>
              {tool.mustDo.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="指挥 AI：坏说法 vs 好说法">
        <p className="groupIntro">
          同一需求，说法差一截，产出质量能差一个数量级。对照改口癖。
        </p>
        <div className="directList">
          {directPatterns.map((p) => (
            <article className="directCard" key={p.title}>
              <h3>{p.title}</h3>
              <div className="directBad">
                <span className="kLabel mistake">别这样说</span>
                <p>{p.bad}</p>
              </div>
              <div className="directGood">
                <span className="kLabel use">这样说</span>
                <p>{p.good}</p>
              </div>
              <p className="directWhy">
                <b>为什么：</b>
                {p.why}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="标准五段式指令模板（复制改）">
        <div className="tutPromptBar">
          <p className="groupIntro" style={{ margin: 0 }}>
            复杂任务都套这个骨架：身份与栈 → 目标 → 约束 → 验收 → 先计划后动手。
          </p>
          <button className="secondary" onClick={() => copy(promptSkeleton, "skeleton")}>
            {copied === "skeleton" ? "已复制" : "复制模板"}
          </button>
        </div>
        <pre className="code">{promptSkeleton}</pre>
      </Section>

      <Section title="场景剧本（按场景指挥）">
        <div className="tutPhaseNav">
          {scenarioPlaybooks.map((s) => (
            <button
              key={s.id}
              className={`tutPhaseBtn${sceneId === s.id ? " active" : ""}`}
              onClick={() => setSceneId(s.id)}
            >
              <span className="tutPhaseTitle">{s.scene}</span>
            </button>
          ))}
        </div>

        <div className="grid two">
          <div className="card">
            <h3>操作步骤</h3>
            <ol>
              {scene.steps.map((st) => (
                <li key={st}>{st}</li>
              ))}
            </ol>
          </div>
          <div className="card">
            <div className="tutPromptBar">
              <h3 style={{ margin: 0 }}>可复制指令</h3>
              <button className="secondary" onClick={() => copy(scene.prompt, scene.id)}>
                {copied === scene.id ? "已复制" : "复制"}
              </button>
            </div>
            <pre className="code">{scene.prompt}</pre>
          </div>
        </div>
      </Section>

      <Section title="项目规则文件：让 AI 每次都守规矩">
        <div className="grid three">
          {rulesGuide.files.map((f) => (
            <div className="card" key={f.tool}>
              <h3>{f.tool}</h3>
              <p>
                <code>{f.file}</code>
              </p>
              <p className="mutedSmall">{f.tip}</p>
            </div>
          ))}
        </div>
        <h3 style={{ marginTop: 20 }}>规则里至少写这些</h3>
        <ul>
          {rulesGuide.mustInclude.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <div className="tutPromptBar" style={{ marginTop: 12 }}>
          <b>示例 CLAUDE.md / 规则草稿</b>
          <button className="secondary" onClick={() => copy(rulesGuide.sample, "rules")}>
            {copied === "rules" ? "已复制" : "复制示例"}
          </button>
        </div>
        <pre className="code">{rulesGuide.sample}</pre>
      </Section>

      <Section title="Accept 之前：审查清单">
        <div className="callout warn">
          Agent 越强，越要审查。把下面当成合并前的强制检查。
        </div>
        <ul className="reviewList">
          {reviewChecklist.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Section>

      <Section title="工具怎么组合">
        <div className="grid three">
          {comboTips.map((c) => (
            <div className="card" key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="和下一步怎么配合">
        <ol>
          <li>
            选型与安装细节 → <Link href="/ai-tools">AI 编程工具教程</Link>
          </li>
          <li>
            按天做完整项目 → <Link href="/tutorial">后端实战教程</Link>（每步可复制 AI 指令）
          </li>
          <li>
            把后端名词说准 → <Link href="/backend">后端知识体系</Link> +{" "}
            <Link href="/glossary">术语库</Link>
          </li>
          <li>
            指挥时点名分层 / 限流 / 幂等 → 知识页「指挥 AI 写后端：说法对照」
          </li>
        </ol>
      </Section>
    </>
  );
}
