
import { Hero, Section } from "@/components/Blocks";
import { featureMaps } from "@/data/content";

export default function FeaturesPage() {
  return (
    <>
      <Hero title="功能到技术栈映射" desc="以后不要只问我要学什么，而是看一个功能背后需要哪些后端与 AI 能力。" />

      <Section title="功能映射表">
        <div className="tableWrap">
          <table>
            <thead>
              <tr><th>功能</th><th>业务场景</th><th>需要的技术栈</th><th>核心表/模块</th><th>风险点</th></tr>
            </thead>
            <tbody>
              {featureMaps.map((item) => (
                <tr key={item.feature}>
                  <td><b>{item.feature}</b></td>
                  <td>{item.scenario}</td>
                  <td>{item.stack.map((x) => <span className="badge" key={x}>{x}</span>)}</td>
                  <td>{item.tables.join("、")}</td>
                  <td>{item.risks.join("、")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="知识库上传完整拆解">
        <pre className="code">{`功能：商家上传 FAQ.pdf

前端：
  - 选择文件、显示上传进度、展示解析状态

API：
  - POST /api/knowledge-docs
  - multipart/form-data
  - 校验文件大小、格式、商家权限

后端：
  - Controller 接收文件
  - Service 保存文件到对象存储
  - Repository 创建 knowledge_docs 记录
  - Queue 推送 parse_doc 任务
  - Worker 异步解析 PDF
  - 切片后写入 doc_chunks
  - 生成 Embedding
  - 更新状态 parse_success / parse_failed
  - Logger 记录 requestId、docId、耗时、失败原因

涉及知识：
  文件上传、对象存储、数据库、队列、Worker、状态机、Embedding、日志、权限、多租户`}</pre>
      </Section>

      <Section title="AI 聊天问答完整拆解">
        <pre className="code">{`功能：用户问“周末几点关门？”

API：
  - POST /api/chat/sessions/:id/messages
  - SSE 返回流式回答

后端：
  - 校验登录和商家数据权限
  - 保存用户消息
  - 调 retrieval service
  - 问题转 Embedding
  - 按 merchant_id 检索 doc_chunks
  - Rerank / 过滤低分片段
  - 组装 Prompt
  - 调用模型流式输出
  - 保存 AI 回复
  - 保存 retrieval_logs 和 ai_reply_logs
  - 如果低置信度，生成 handoff ticket

涉及知识：
  SSE、数据库、向量检索、Prompt、结构化输出、日志、评估、转人工`}</pre>
      </Section>
    </>
  );
}
