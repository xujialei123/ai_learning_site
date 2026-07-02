
import { Hero, KnowledgeGroupView, Section } from "@/components/Blocks";
import { backendGroups } from "@/data/content";

export default function BackendPage() {
  return (
    <>
      <Hero title="后端完整知识体系" desc="真实项目常用的后端知识，不只包括 Redis 和数据库，还包括 API、权限、存储、队列、日志、安全、部署等。" />

      <Section title="后端最小掌握标准">
        <ul>
          <li>能设计 REST API，并说明 Method、参数、响应和错误码。</li>
          <li>能把接口拆成 Controller、Service、Repository。</li>
          <li>能设计数据库表、索引、状态字段和基本事务。</li>
          <li>能说清 Redis 在缓存、限流、锁、队列里的用法。</li>
          <li>能把慢任务放进队列，由 Worker 异步处理。</li>
          <li>能设计登录、RBAC、多租户数据隔离。</li>
          <li>能记录 requestId、错误日志、业务日志和 AI 调用日志。</li>
        </ul>
      </Section>

      {backendGroups.map((group) => <KnowledgeGroupView key={group.title} group={group} />)}
    </>
  );
}
