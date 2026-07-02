
import { Hero, Section } from "@/components/Blocks";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero
        title="AI 全栈后端与 AI 应用学习站"
        desc="完整迁移增强版：保留系统图、后端体系、AI体系、项目落点、功能映射、链路、Demo、60天任务，并重做了 Ask AI 交互。"
      />


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
