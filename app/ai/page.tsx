
import { Hero, KnowledgeGroupView, Section } from "@/components/Blocks";
import { aiGroups } from "@/data/content";

export default function AiPage() {
  return (
    <>
      <Hero title="AI 应用完整知识体系" desc="真实 AI 应用工程常用知识，不只包括 RAG，还包括模型调用、结构化输出、工具调用、Agent、评估、护栏、成本和生产化。" />

      <Section title="RAG 知识库工程图">
        <img className="diagram" src="/diagrams/rag-flow.svg" alt="RAG知识库工程链路" />
      </Section>

      <Section title="AI 应用最小掌握标准">
        <ul>
          <li>能写清楚 Prompt 的角色、任务、约束、资料和输出格式。</li>
          <li>能让模型输出稳定 JSON，而不是靠自然语言解析。</li>
          <li>能解释 Token、上下文、成本和延迟的关系。</li>
          <li>能设计 RAG：解析、切片、Embedding、检索、引用、拒答。</li>
          <li>能设计工具调用：schema、权限、超时、审批、日志。</li>
          <li>能准备 AI 评估集，统计准确率、拒答率、幻觉率。</li>
        </ul>
      </Section>

      {aiGroups.map((group) => <KnowledgeGroupView key={group.title} group={group} />)}
    </>
  );
}
