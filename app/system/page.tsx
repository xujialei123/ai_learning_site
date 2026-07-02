
import { Hero, Section } from "@/components/Blocks";

export default function SystemPage() {
  return (
    <>
      <Hero title="系统总览" desc="从用户请求到后端业务、数据、AI、工具、评估、部署的完整关系。" />

      <Section title="完整系统图">
        <img className="diagram" src="/diagrams/system-diagram.svg" alt="真实项目里的后端与AI应用知识系统" />
      </Section>

      <Section title="完整链路">
        <pre className="code">{`用户操作
  -> 前端后台页面
  -> HTTP / REST / SSE / WebSocket / Webhook
  -> 后端 Controller / Middleware
  -> Service 业务逻辑
  -> 权限校验 / 多租户隔离
  -> 数据库 / Redis / 对象存储 / 队列
  -> RAG 检索 / Agent 工具调用 / LLM 生成
  -> AI 评估 / 护栏 / 日志监控
  -> 前端展示结果
  -> 部署、告警、复盘、持续优化`}</pre>
      </Section>

      <Section title="为什么要系统学">
        <div className="tableWrap">
          <table>
            <thead><tr><th>只学单点</th><th>会出现的问题</th><th>系统化后的理解</th></tr></thead>
            <tbody>
              <tr><td>只学 Redis</td><td>不知道它为什么出现在项目里。</td><td>Redis 用于缓存、限流、锁、队列，不替代数据库。</td></tr>
              <tr><td>只学 RAG</td><td>做出来的回答不稳定，也不知道怎么排查。</td><td>RAG 依赖文档解析、切片、向量、日志、评估和拒答。</td></tr>
              <tr><td>只学 Node 接口</td><td>接口能跑，但没有权限、错误处理和日志。</td><td>真实后端要考虑安全、可观测性、异步和部署。</td></tr>
              <tr><td>只学 Prompt</td><td>模型回答好坏靠感觉。</td><td>AI 应用要结构化输出、评估集、护栏和版本管理。</td></tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
