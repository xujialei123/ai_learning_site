
import Link from "next/link";

const links = [
  ["/", "首页"],
  ["/system", "系统总览"],
  ["/frontend", "前端完整知识体系"],
  ["/backend", "后端完整知识体系"],
  ["/ai", "AI应用完整知识体系"],
  ["/features", "功能到技术栈映射"],
  ["/flows", "请求/数据/AI链路"],
  ["/demos", "练习Demo实验室"],
  ["/interview", "AI面试题库"],
  ["/tasks", "60天任务制学习"],
  ["/glossary", "术语库"],
  ["/resources", "可靠链接"]
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">AI</div>
        <div>
          <strong>AI 全栈后端与 AI 应用系统化学习站 V6</strong>
          <span>后端 + AI 应用 + 项目落地 + Agnes</span>
        </div>
      </div>

      <nav className="nav">
        {links.map(([href, label]) => (
          <Link href={href} key={href}>{label}</Link>
        ))}
      </nav>

      <div className="sideNote">
        <b>学习方式</b>
        <p>选中不懂的词，点击解释/项目/练习。也可以按 Alt + A 打开右侧 AI 学习助手手动提问。</p>
      </div>
    </aside>
  );
}
