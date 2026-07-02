
import { Hero, KnowledgeGroupView, Section } from "@/components/Blocks";
import { frontendGroups } from "@/data/content";

export default function FrontendPage() {
  return (
    <>
      <Hero title="前端完整知识体系" desc="从 HTML/CSS 基础到 React/Next.js，再到工程化、性能优化、安全防护，构建完整的前端技术栈。" />

      <Section title="前端最小掌握标准">
        <ul>
          <li>掌握 HTML 语义化标签、CSS 盒模型、Flexbox、Grid 布局。</li>
          <li>理解 JavaScript 异步编程、事件机制、闭包、原型链。</li>
          <li>熟练使用 TypeScript 进行类型定义和泛型编程。</li>
          <li>掌握 React 组件化开发、Hooks、状态管理。</li>
          <li>了解 Next.js 渲染模式、路由、数据获取。</li>
          <li>能配置 ESLint、Prettier、Git 工作流。</li>
          <li>理解 HTTP 协议、CORS、XSS/CSRF 防护。</li>
        </ul>
      </Section>

      {frontendGroups.map((group) => <KnowledgeGroupView key={group.title} group={group} />)}
    </>
  );
}
