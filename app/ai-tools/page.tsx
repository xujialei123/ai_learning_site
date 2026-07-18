
import { Hero, Section } from "@/components/Blocks";
import { overseasTools, domesticTools, usageGuides, type AiTool } from "@/data/aiTools";

function ToolCard({ tool }: { tool: AiTool }) {
  return (
    <article className="toolCard">
      <header className="toolHead">
        <div>
          <h3>{tool.name}</h3>
          <p className="toolMeta">{tool.vendor} · {tool.form}</p>
        </div>
        <div className="toolTags">
          <span className="badge">{tool.pricing}</span>
        </div>
      </header>

      <p className="toolIntro">{tool.intro}</p>

      <div className="kRow">
        <span className="kLabel use">适合场景</span>
        <p>{tool.bestFor}</p>
      </div>

      <details className="toolDetails">
        <summary>快速上手步骤</summary>
        <pre className="code">{tool.quickstart}</pre>
      </details>

      <details className="toolDetails">
        <summary>核心能力</summary>
        <ul>
          {tool.features.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </details>

      <details className="toolDetails">
        <summary>使用技巧</summary>
        <ul>
          {tool.tips.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </details>

      <a className="toolLink" href={tool.url} target="_blank" rel="noopener noreferrer">
        官网 → {tool.url}
      </a>
    </article>
  );
}

export default function AiToolsPage() {
  return (
    <>
      <Hero
        title="AI 编程工具教程"
        desc="Claude Code、Codex、Cursor 以及国内主流 AI 编程工具的上手教程、核心用法和选型建议。工具会一直变，但「怎么和 AI 协作写代码」的方法是通用的。"
      />

      <Section title="先分清三种形态">
        <div className="grid three">
          <div className="card">
            <h3>AI 原生 IDE</h3>
            <p>Cursor、Trae、Qoder。完整编辑器，AI 深度嵌入写代码的每个环节。日常开发的主力，学习成本最低。</p>
          </div>
          <div className="card">
            <h3>CLI / 终端 Agent</h3>
            <p>Claude Code、Codex CLI。在终端里对话下任务，自主读写文件、跑命令、执行测试。适合重构和长任务。</p>
          </div>
          <div className="card">
            <h3>插件 / 云端 Agent</h3>
            <p>Copilot、通义灵码（插件）、Codex 云端。不换编辑器即可用，或把任务丢到云端沙箱自动产出 PR。</p>
          </div>
        </div>
        <div className="callout">
          2026 年专业开发者的常见组合是「一个 AI IDE + 一个 CLI Agent」：日常在 Cursor/Trae 里写，
          遇到重型任务在内置终端启动 Claude Code 或 Codex。两类工具是互补不是二选一。
        </div>
      </Section>

      <Section title="海外主流工具">
        <div className="toolList">
          {overseasTools.map((tool) => <ToolCard key={tool.name} tool={tool} />)}
        </div>
      </Section>

      <Section title="国内主流工具">
        <p className="groupIntro">
          国产工具的共同优势：个人版基本免费、中文理解好、国内网络直连、部分支持私有化部署。
          智谱 CodeGeeX、讯飞 iFlyCode 等也在竞争，下面挑四个生态最完整的详细讲。
        </p>
        <div className="toolList">
          {domesticTools.map((tool) => <ToolCard key={tool.name} tool={tool} />)}
        </div>
      </Section>

      <Section title="怎么选（按你的情况对号入座）">
        <div className="tableWrap">
          <table>
            <thead>
              <tr><th>你的情况</th><th>推荐</th><th>理由</th></tr>
            </thead>
            <tbody>
              <tr><td>零成本先体验 AI 编程</td><td>Trae 或 Copilot 免费档</td><td>完全免费，开箱即用，中文友好</td></tr>
              <tr><td>选一个日常主力 IDE</td><td>Cursor</td><td>体验最成熟、生态最好、迭代最快</td></tr>
              <tr><td>大规模重构 / 复杂长任务</td><td>Claude Code</td><td>Plan Mode + 全库推理是当前上限</td></tr>
              <tr><td>批量任务自动提 PR</td><td>Codex 云端 Agent</td><td>并行沙箱执行，改代码变审代码</td></tr>
              <tr><td>写 Java/Go 后端、用阿里云</td><td>通义灵码</td><td>JetBrains 支持好，企业生态深</td></tr>
              <tr><td>做微信小程序</td><td>CodeBuddy</td><td>微信生态全链路打通</td></tr>
              <tr><td>想试遍国产模型</td><td>文心快码 Comate</td><td>文心/DeepSeek/Kimi/GLM 随意切换</td></tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="通用使用心法（比选工具更重要）">
        <div className="grid two">
          {usageGuides.map((guide) => (
            <div className="card" key={guide.title}>
              <h3>{guide.title}</h3>
              <ul>
                {guide.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="给初学者的提醒">
        <div className="callout warn">
          AI 工具能让你 10 倍速产出代码，但也能让你 10 倍速积累看不懂的代码。
          学习阶段的原则：<b>AI 写的每一行你都要能解释</b>。用本站的知识体系补全原理，
          用 AI 工具加速实践，两条腿一起走——这正是这个学习站存在的意义。
        </div>
      </Section>
    </>
  );
}
