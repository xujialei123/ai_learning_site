
import { Hero, KnowledgeGroupView, Section } from "@/components/Blocks";
import { aiGroups } from "@/data/content";

export default function AiPage() {
  return (
    <>
      <Hero title="AI 应用完整知识体系" desc="RAG、Agent、工具调用、评测与生产化。每题带速记、面试答法、自测。2026 面试重点看「AI 面试高频考点」模块。" />

      <Section title="怎么学才不会忘">
        <ol>
          <li><b>先搞清链路</b>：RAG = 解析→切片→向量→检索→生成；Agent = 想→调工具→看结果→循环。</li>
          <li><b>优先学「AI 面试高频考点」</b>：MCP、Context Engineering、召回排查、LangGraph、评测，外面问得最多。</li>
          <li><b>每张卡走一遍：速记 → 自测 → 面试</b>，能用自己的话讲给同事听，才算真会。</li>
          <li><b>别贪前沿概念</b>：LLM Wiki、GBrain 等了解即可，面试先拿下 RAG/Agent/工具调用。</li>
        </ol>
      </Section>

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
