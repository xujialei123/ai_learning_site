import Link from "next/link";
import { Hero, KnowledgeGroupView, Section } from "@/components/Blocks";
import { backendGroups } from "@/data/content";

export default function BackendPage() {
  return (
    <>
      <Hero
        title="后端完整知识体系"
        desc="从 API、分层、数据库到 Linux、Nginx、Docker、云部署与架构名词。学会这些说法，才能准确指挥 AI 写后端和上线。"
      />

      <Section title="怎么学才不会忘">
        <ol>
          <li><b>先记一句话</b>：每张卡片顶部的蓝色速记句，合上卡片能复述出来就算过关。</li>
          <li><b>用自测 tab</b>：先自己想 30 秒，再点开答案，比直接阅读记忆深 3 倍。</li>
          <li><b>面试 tab 背答法</b>：对外面试用 30 秒结构化回答，不要背长文。</li>
          <li><b>术语库随时查</b>：遇到 SSH、upstream、幂等、熔断等词，去「术语库」搜；指挥 AI 时把准确名词写进指令。</li>
        </ol>
      </Section>

      <Section title="想动手做完整项目？">
        <p>
          打开{" "}
          <Link href="/tutorial">后端实战教程</Link>
          ：从零搭建「智问」多租户 AI 知识库客服，按天打卡，把本页技术在一个仓库里全部用上。
        </p>
      </Section>

      <Section title="指挥 AI 时怎么说话（超实用）">
        <ul>
          <li>别说「帮我写个上传」→ 说「按 Controller/Service/Repository 分层，DTO 用 Zod，要幂等键和大小/MIME 校验」。</li>
          <li>别说「部署一下」→ 说「多阶段 Dockerfile + compose（app/postgres/redis）+ Nginx 反代 443 + /health 健康检查」。</li>
          <li>别说「优化性能」→ 说「给列表接口加 Redis 缓存 TTL 5 分钟，并处理缓存穿透；目标 P95 低于 200ms」。</li>
          <li>先看本页最后一章「指挥 AI 写后端：说法对照」，再去让 AI 动手。</li>
        </ul>
      </Section>

      <Section title="后端最小掌握标准">
        <ul>
          <li>能解释 Node.js 事件循环、为什么单线程能扛高并发、什么代码会阻塞。</li>
          <li>能设计 REST API，并说明 Method、参数、响应和错误码。</li>
          <li>能把接口拆成 Controller、Service、Repository。</li>
          <li>能实现生产级注册登录：密码哈希、验证码防刷、JWT、第三方登录。</li>
          <li>能设计数据库表、索引、状态字段和基本事务。</li>
          <li>能说清 Redis 在缓存、限流、锁、队列里的用法。</li>
          <li>能把慢任务放进队列，由 Worker 异步处理。</li>
          <li>能设计登录、RBAC、多租户数据隔离。</li>
          <li>能用 SSH 登录服务器，看进程/端口/日志，配环境变量。</li>
          <li>能说清 DNS → HTTPS → Nginx 反代 → 应用 → 数据库 这条链路。</li>
          <li>能写（或指挥 AI 写）Dockerfile、compose、Nginx 反代与健康检查。</li>
          <li>能解释超时、重试、熔断、降级、优雅停机是怎么配合的。</li>
          <li>能记录 requestId、错误日志、业务日志和 AI 调用日志。</li>
        </ul>
      </Section>

      <Section title="建议学习顺序（前端转后端 / 指挥 AI）">
        <ol>
          <li><b>后端基础与 API + 工程分层</b>：会定接口契约、会点名分层，指挥 AI 才不糊。</li>
          <li><b>Node.js 运行时</b>：懂事件循环与阻塞，才知道哪些活不能放请求里。</li>
          <li><b>数据与存储 + 认证</b>：表设计、索引、JWT/RBAC、多租户——业务后端核心。</li>
          <li><b>缓存、队列与性能</b>：Redis、限流、异步 Worker——上规模必备。</li>
          <li><b>Linux + 网络域名 HTTPS</b>：服务器怎么进、域名怎么指、证书挂哪。</li>
          <li><b>Docker + Nginx + 云部署</b>：镜像、反代、流水线、回滚——能真正上线。</li>
          <li><b>通信与架构名词 + 指挥 AI 说法对照</b>：同步异步、网关 BFF、验收标准怎么写。</li>
          <li><b>测试 + 高可用 + 安全可观测</b>：从「能跑」到「能上线能排障」。</li>
        </ol>
      </Section>

      {backendGroups.map((group) => <KnowledgeGroupView key={group.title} group={group} />)}
    </>
  );
}
