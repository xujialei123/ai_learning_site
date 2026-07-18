
import { Hero, Section } from "@/components/Blocks";
import Link from "next/link";

const stages = [
  {
    stage: "第一阶段 · 建立全局",
    goal: "先知道一个完整系统长什么样，再学细节",
    links: [
      { href: "/system", label: "系统总览", desc: "理解从请求到 AI 回复的完整链路" },
      { href: "/flows", label: "请求/数据/AI 链路", desc: "把知识点用链路串起来，避免孤立学习" }
    ]
  },
  {
    stage: "第二阶段 · 打好地基",
    goal: "前端 + 后端核心知识，每个知识点都有项目落点",
    links: [
      { href: "/frontend", label: "前端知识体系", desc: "HTML/CSS/JS/React/Next.js/工程化/安全" },
      { href: "/backend", label: "后端知识体系", desc: "API/分层/数据库/缓存/队列/安全/部署" }
    ]
  },
  {
    stage: "第三阶段 · AI 应用能力",
    goal: "从零基础概念到 RAG、Agent、评估、护栏、前沿方向",
    links: [
      { href: "/ai", label: "AI 应用知识体系", desc: "含零基础入门篇和 2026 前沿篇" },
      { href: "/ai-tools", label: "AI 编程工具教程", desc: "Claude Code、Codex、Cursor 及国产工具上手" },
      { href: "/features", label: "功能到技术栈映射", desc: "学会从一个功能反推需要哪些技术" }
    ]
  },
  {
    stage: "第四阶段 · 动手与自测",
    goal: "边练边学，用打卡和面试题检验自己",
    links: [
      { href: "/tutorial", label: "后端实战教程", desc: "从零搭建多租户 AI 知识库，技术点全覆盖可打卡" },
      { href: "/pitfalls", label: "真实项目踩坑集", desc: "看事故现场推根因，训练判断力" },
      { href: "/demos", label: "练习 Demo 实验室", desc: "交互式 Demo，动手理解概念" },
      { href: "/tasks", label: "任务制学习计划", desc: "每天一个任务，支持打卡记录进度" },
      { href: "/interview", label: "AI 面试题库", desc: "AI 生成面试题，自测掌握程度" }
    ]
  }
];

export default function HomePage() {
  return (
    <>
      <Hero
        title="AI 全栈与 AI 应用学习站"
        desc="面向初学者的系统化学习路径：前端、后端、AI 应用工程一站式覆盖。每个知识点都标注了项目落点、常见误区和深入理解，遇到不懂的词随时选中问 AI。"
      />

      <Section title="怎么用这个网站（3 步上手）">
        <div className="grid three">
          <div className="card">
            <h3>1. 按路径学</h3>
            <p>按下面四个阶段的顺序学习，不要跳着学。每个知识点先看简介，再展开深入理解。</p>
          </div>
          <div className="card">
            <h3>2. 不懂就问 AI</h3>
            <p>选中任何不懂的词或句子，点击弹出的按钮让 AI 解释；也可以按 Alt + A 打开右侧 AI 助手手动提问。</p>
          </div>
          <div className="card">
            <h3>3. 每天打卡</h3>
            <p>去「任务制学习计划」页每天完成一个任务并打卡，学完用「AI 面试题库」自测。</p>
          </div>
        </div>
      </Section>

      <Section title="推荐学习路径">
        <div className="stageList">
          {stages.map((s) => (
            <div className="stageCard" key={s.stage}>
              <div className="stageHead">
                <h3>{s.stage}</h3>
                <p>{s.goal}</p>
              </div>
              <div className="stageLinks">
                {s.links.map((l) => (
                  <Link className="stageLink" href={l.href} key={l.href}>
                    <b>{l.label}</b>
                    <span>{l.desc}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="首次运行配置（Ask AI 功能需要）">
        <p className="groupIntro">本站的 AI 助手基于 Agnes API。第一次运行需要配置环境变量：</p>
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
