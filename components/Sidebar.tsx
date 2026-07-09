
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const groups: Array<{ title: string; links: Array<[string, string]> }> = [
  {
    title: "开始",
    links: [
      ["/", "首页 · 学习路径"],
      ["/system", "系统总览"],
      ["/flows", "请求/数据/AI 链路"]
    ]
  },
  {
    title: "知识体系",
    links: [
      ["/frontend", "前端知识体系"],
      ["/backend", "后端知识体系"],
      ["/ai", "AI 应用知识体系"],
      ["/features", "功能到技术栈映射"]
    ]
  },
  {
    title: "练习与自测",
    links: [
      ["/demos", "练习 Demo 实验室"],
      ["/tasks", "任务制学习计划"],
      ["/interview", "AI 面试题库"]
    ]
  },
  {
    title: "查询",
    links: [
      ["/glossary", "术语库"],
      ["/resources", "可靠链接"]
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">AI</div>
        <div>
          <strong>AI 全栈学习站</strong>
          <span>前端 · 后端 · AI 应用 · 项目落地</span>
        </div>
      </div>

      <nav className="nav">
        {groups.map((group) => (
          <div className="navGroup" key={group.title}>
            <div className="navGroupTitle">{group.title}</div>
            {group.links.map(([href, label]) => (
              <Link
                href={href}
                key={href}
                className={pathname === href ? "active" : undefined}
              >
                {label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="sideNote">
        <b>学习方式</b>
        <p>选中不懂的词，点击解释/项目/练习。也可以按 Alt + A 打开右侧 AI 学习助手手动提问。</p>
      </div>
    </aside>
  );
}
