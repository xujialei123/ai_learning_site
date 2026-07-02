
import { Hero, Section } from "@/components/Blocks";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero
        title="AI 全栈后端与 AI 应用学习站 V6"
        desc="完整迁移增强版：保留系统图、后端体系、AI体系、项目落点、功能映射、链路、Demo、60天任务，并重做了 Ask AI 交互。"
      />

      <Section title="这版修了什么">
        <div className="callout good">
          V5 静态版的内容这次完整迁移进 Next.js，不再只保留少量页面。Ask AI 也改成右侧学习助手，支持选词、手动输入、连续追问和快捷键。
        </div>
        <div className="grid three">
          <div className="card"><h3>内容完整</h3><p>后端、AI 应用、功能映射、三条链路、Demo、任务表、术语库都保留。</p></div>
          <div className="card"><h3>图示恢复</h3><p>恢复完整系统图和 RAG 知识库工程图，避免页面只有文字。</p></div>
          <div className="card"><h3>交互增强</h3><p>选词后出现工具条，也可以按 Alt + A 打开右侧 AI 学习助手。</p></div>
        </div>
      </Section>

      <Section title="推荐学习顺序">
        <div className="tableWrap">
          <table>
            <thead><tr><th>顺序</th><th>页面</th><th>目的</th></tr></thead>
            <tbody>
              <tr><td>1</td><td><Link href="/system">系统总览</Link></td><td>先理解后端与 AI 应用完整关系。</td></tr>
              <tr><td>2</td><td><Link href="/backend">后端完整知识体系</Link></td><td>补齐真实项目常用后端知识。</td></tr>
              <tr><td>3</td><td><Link href="/ai">AI 应用完整知识体系</Link></td><td>补齐 RAG、Agent、评估、护栏等知识。</td></tr>
              <tr><td>4</td><td><Link href="/features">功能到技术栈映射</Link></td><td>学会从功能反推技术栈。</td></tr>
              <tr><td>5</td><td><Link href="/demos">练习 Demo 实验室</Link></td><td>通过交互 Demo 消化知识点。</td></tr>
              <tr><td>6</td><td><Link href="/tasks">60 天任务制学习</Link></td><td>每天按一个任务执行。</td></tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Agnes 配置">
        <pre className="code">{`cp .env.local.example .env.local

# 修改 .env.local
AGNES_API_BASE_URL=https://apihub.agnes-ai.com/v1
AGNES_API_KEY=你的_agnes_api_key
AGNES_MODEL=agnes-2.0-flash

npm install
npm run dev`}</pre>
      </Section>
    </>
  );
}
