
import { Hero, Section } from "@/components/Blocks";

export default function FlowsPage() {
  return (
    <>
      <Hero title="请求 / 数据 / AI 链路" desc="用链路方式把后端和 AI 知识串起来，避免孤立学习。" />

      <Section title="请求链路">
        <pre className="code">{`前端操作
  -> HTTP 请求
  -> Nginx / 网关
  -> requestId middleware
  -> auth middleware
  -> permission middleware
  -> controller 参数校验
  -> service 业务逻辑
  -> repository 数据库读写
  -> redis / queue / object storage / ai provider
  -> 统一响应
  -> 前端展示 loading / success / error`}</pre>
      </Section>

      <Section title="数据链路">
        <pre className="code">{`业务数据产生
  -> 参数校验
  -> 数据库事务
  -> 索引支持查询
  -> Redis 缓存热点数据
  -> 队列异步处理慢任务
  -> 日志记录操作
  -> 定时任务统计
  -> 看板展示指标`}</pre>
      </Section>

      <Section title="AI 链路">
        <pre className="code">{`用户问题
  -> 输入清洗
  -> 意图分类
  -> RAG 检索
  -> Prompt 组装
  -> 模型生成结构化输出
  -> 引用来源检查
  -> 工具调用或转人工
  -> AI日志
  -> 评估与反馈闭环`}</pre>
      </Section>
    </>
  );
}
