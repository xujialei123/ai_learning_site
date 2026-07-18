export type TutorialStep = {
  id: string;
  day: string;
  title: string;
  goal: string;
  /** 本步会用到的技术点 */
  techs: string[];
  /** 对应知识页锚点提示 */
  study: string;
  /** 具体要做什么 */
  todos: string[];
  /** 建议目录/文件 */
  files?: string[];
  /** 可复制给 AI 的指令 */
  aiPrompt: string;
  /** 做完怎么验收 */
  accept: string[];
  /** 预计耗时 */
  hours: string;
};

export type TutorialPhase = {
  id: string;
  title: string;
  subtitle: string;
  outcome: string;
  steps: TutorialStep[];
};

/** 实战项目：智问 · 多租户 AI 知识库客服（把后端知识体系技术全部用上） */
export const tutorialProject = {
  name: "智问 KnowledgeBot",
  oneLiner: "一个可部署的多租户 AI 知识库问答系统：注册登录、上传文档、RAG 问答、限流、异步解析、Docker + Nginx 上线。",
  stack: [
    "Next.js (App Router) + TypeScript",
    "PostgreSQL + Prisma + pgvector",
    "Redis（缓存 / 限流 / 锁 / 简易队列）",
    "JWT + bcrypt + RBAC + 多租户 merchant_id",
    "文件上传 + 对象存储（可先本地盘，后换 OSS）",
    "OpenAI 兼容 API（Embedding + Chat + SSE）",
    "Zod 校验 + 统一响应 + 错误码",
    "Vitest 单测 + API 集成测试",
    "Docker Compose + Nginx + HTTPS 思路",
    "结构化日志 + /health + requestId"
  ],
  repoHint: "建议新建独立仓库 knowledge-bot，不要和本学习站混在一个项目里。",
  finalDemo: [
    "商家管理员注册并创建租户",
    "上传 PDF/Markdown，后台异步切片 + Embedding",
    "用户登录后提问，SSE 流式回答并带来源引用",
    "超限流返回 429；跨租户访问返回 403",
    "docker compose up 一键起全栈；Nginx 反代 80 端口"
  ]
};

export const tutorialPhases: TutorialPhase[] = [
  {
    id: "p0",
    title: "第 0 阶段 · 立项与环境",
    subtitle: "先把「要做成什么」和「本地怎么跑」钉死",
    outcome: "空仓库能跑 Hello API，数据库/Redis 容器已就绪，.env 规范清晰。",
    steps: [
      {
        id: "p0-s1",
        day: "Day 1",
        title: "写清产品范围与模块边界",
        goal: "用一页纸定义功能、非目标、角色，避免后面范围膨胀。",
        techs: ["领域建模", "模块化单体", "指挥 AI：契约优先"],
        study: "后端知识 → 工程分层 / Domain Model；指挥 AI 说法对照",
        todos: [
          "画用户角色：超级管理员 / 商家管理员 / 客服只读",
          "列 MVP 功能：注册登录、文档上传、解析状态、问答、引用来源",
          "列非目标：先不做支付、不做企微接入、不做多模型路由",
          "定模块目录：auth / merchant / knowledge / chat / jobs / admin"
        ],
        files: ["docs/PRODUCT.md", "docs/MODULES.md"],
        aiPrompt: `我要做一个多租户 AI 知识库问答 MVP（Next.js + Prisma + Redis）。
请帮我写 PRODUCT.md：角色、核心用户故事 5 条、非目标、成功指标。
再写 MODULES.md：模块边界与禁止跨层调用规则。不要写代码。`,
        accept: [
          "能用 1 分钟向别人讲清产品是干什么的",
          "模块列表不超过 6 个，边界清楚"
        ],
        hours: "1–2h"
      },
      {
        id: "p0-s2",
        day: "Day 1–2",
        title: "初始化 Next.js + TypeScript + ESLint",
        goal: "从前端你熟悉的 Next 起一个全栈骨架。",
        techs: ["Next.js App Router", "TypeScript", "环境变量"],
        study: "前端 → Next.js；后端 → Config 配置层",
        todos: [
          "create-next-app（App Router、TS、ESLint）",
          "建立 src 或沿用 app/ 结构：app/api、lib、modules",
          "添加 .env.example（DATABASE_URL、REDIS_URL、JWT_SECRET、AI_*）",
          "用 Zod 做 env 启动校验（缺变量直接抛错退出）"
        ],
        files: [
          "package.json",
          ".env.example",
          "lib/env.ts",
          "app/api/health/route.ts"
        ],
        aiPrompt: `用 create-next-app 的默认 App Router + TS 结构。
请生成：1) lib/env.ts 用 zod 校验环境变量；2) GET /api/health 返回 { ok: true, time }；
3) .env.example。不要接数据库。说明如何 npm run dev 验证。`,
        accept: [
          "npm run dev 能打开页面",
          "curl /api/health 返回 JSON",
          "故意删环境变量时启动报错信息清晰"
        ],
        hours: "1–2h"
      },
      {
        id: "p0-s3",
        day: "Day 2",
        title: "Docker Compose 起 PostgreSQL + Redis",
        goal: "本地依赖容器化，和后面生产部署同一套路。",
        techs: ["Docker", "docker compose", "PostgreSQL", "Redis", "Volume"],
        study: "后端 → Docker 与容器化；数据与存储；Linux 基础",
        todos: [
          "写 docker-compose.yml：postgres:17、redis:7、健康检查",
          "挂卷持久化 PG 数据",
          "把 DATABASE_URL / REDIS_URL 写进 .env.local",
          "验证：docker compose ps、redis-cli ping、psql 能连"
        ],
        files: ["docker-compose.yml", ".dockerignore"],
        aiPrompt: `请写 docker-compose.yml：服务 postgres(17) + redis(7)，
含 healthcheck、volume、端口 5432/6379，以及给 Next 用的 DATABASE_URL/REDIS_URL 示例。
说明 Windows/Mac 如何启动与排障（端口占用）。`,
        accept: [
          "compose up -d 后两个服务 healthy",
          "重启电脑后数据还在（volume 生效）"
        ],
        hours: "1–2h"
      }
    ]
  },
  {
    id: "p1",
    title: "第 1 阶段 · API 地基与工程分层",
    subtitle: "统一响应、错误码、分层，后面所有接口都长一个样",
    outcome: "任意接口都走 Controller→Service→Repository，错误格式统一，带 requestId。",
    steps: [
      {
        id: "p1-s1",
        day: "Day 3",
        title: "统一响应格式 + 错误码 + requestId",
        goal: "前端和 AI 都能依赖稳定的 JSON 契约。",
        techs: ["REST", "统一响应", "错误码", "中间件", "requestId"],
        study: "后端 → 后端基础与 API（统一响应 / 错误码）",
        todos: [
          "定义 ApiResponse<T>：code/message/data/requestId",
          "错误码分段：1xxxx 参数、2xxxx 认证、3xxxx 权限、4xxxx 业务、5xxxx 系统",
          "每个请求生成 requestId，写入响应头与日志",
          "封装 ok()/fail() 工具，禁止接口直接 res.json 乱返回"
        ],
        files: [
          "lib/http/response.ts",
          "lib/http/errors.ts",
          "lib/http/request-id.ts"
        ],
        aiPrompt: `为 Next.js Route Handlers 设计统一响应与错误体系：
{ code, message, data, requestId }；BizError 类；错误码枚举；
中间件式包装函数 withApi(handler)。给 2 个示例：成功列表、参数错误。`,
        accept: [
          "故意触发参数错误，返回 4xx 业务码而不是裸 500",
          "响应头能看到 x-request-id"
        ],
        hours: "2h"
      },
      {
        id: "p1-s2",
        day: "Day 3–4",
        title: "落地 Controller / Service / Repository 分层",
        goal: "业务不依赖 req/res，方便测试与换框架。",
        techs: ["Controller", "Service", "Repository", "DTO/Zod"],
        study: "后端 → 后端工程分层（整章）",
        todos: [
          "选一个简单资源 merchants 或 users 做模板",
          "Route Handler 只做：解析→调 Service→返回",
          "Service 不引用 NextRequest",
          "用 Zod 定义 CreateXxxSchema，z.infer 导出类型"
        ],
        files: [
          "modules/merchant/merchant.schema.ts",
          "modules/merchant/merchant.repository.ts",
          "modules/merchant/merchant.service.ts",
          "app/api/merchants/route.ts"
        ],
        aiPrompt: `按 Controller(Route Handler)/Service/Repository 分层实现商家创建接口。
Zod 校验 name；Repository 先可用内存 Map 模拟，稍后换 Prisma。
强调：Service 零 HTTP 依赖。附带目录树。`,
        accept: [
          "POST 创建商家成功",
          "缺字段返回统一错误格式",
          "Service 文件里搜不到 NextRequest"
        ],
        hours: "2–3h"
      },
      {
        id: "p1-s3",
        day: "Day 4",
        title: "Prisma 接入 + 首批表迁移",
        goal: "真实数据库替换内存仓库。",
        techs: ["Prisma", "迁移", "表设计", "软删除", "多租户字段"],
        study: "后端 → 数据与存储（表设计 / ORM / 迁移）",
        todos: [
          "prisma init，连上 compose 的 Postgres",
          "建表：User、Merchant、Membership(user↔merchant+role)",
          "字段：id、created_at、updated_at、deleted_at",
          "跑 migrate dev，用 Prisma Studio 看表"
        ],
        files: ["prisma/schema.prisma", "lib/db.ts"],
        aiPrompt: `写 Prisma schema：User(email唯一, passwordHash)、Merchant(name)、
Membership(userId, merchantId, role: OWNER|ADMIN|AGENT，联合唯一)。
软删除用 deletedAt。给出迁移命令与种子创建一个演示商家。`,
        accept: [
          "prisma migrate 成功",
          "Studio 能看到三张表与关联"
        ],
        hours: "2–3h"
      }
    ]
  },
  {
    id: "p2",
    title: "第 2 阶段 · 认证、权限与多租户",
    subtitle: "没有这块，后面所有业务都是裸奔",
    outcome: "注册登录可用；JWT 鉴权；RBAC；所有查询强制 merchant_id。",
    steps: [
      {
        id: "p2-s1",
        day: "Day 5",
        title: "注册登录：bcrypt + JWT + 防枚举",
        goal: "生产级登录最小闭环。",
        techs: ["密码哈希", "JWT", "参数校验", "登录防枚举"],
        study: "后端 → 认证与用户体系；JWT/Session",
        todos: [
          "注册：校验邮箱密码 → bcrypt.hash → 建用户",
          "登录：限流占位 → 查用户 → compare → 签 JWT",
          "错误文案统一「账号或密码错误」",
          "accessToken 短期；可选 refresh 存表"
        ],
        files: [
          "modules/auth/*",
          "app/api/auth/register/route.ts",
          "app/api/auth/login/route.ts"
        ],
        aiPrompt: `实现 register/login API：bcrypt cost 12（贴合 2026 OWASP 建议，也可用 argon2id）；JWT(HS256) 含 sub/email/exp；
统一错误不暴露用户是否存在；返回 { accessToken, user }。
给前端最小登录页字段说明。`,
        accept: [
          "错误密码与不存在用户返回相同文案",
          "Token 能在受保护接口验过"
        ],
        hours: "3h"
      },
      {
        id: "p2-s2",
        day: "Day 6",
        title: "鉴权中间件 + RBAC + 多租户隔离",
        goal: "每个业务请求都知道「谁、哪个商家、什么角色」。",
        techs: ["RBAC", "多租户隔离", "BOLA 防护", "中间件"],
        study: "后端 → RBAC/ABAC、多租户隔离",
        todos: [
          "requireAuth 解析 JWT，注入 userId",
          "requireMerchant：从 header X-Merchant-Id 取租户并校验 membership",
          "requireRole('ADMIN') 装饰敏感操作",
          "写测试：商家 A token 读商家 B 数据 → 403"
        ],
        files: ["lib/auth/guards.ts", "modules/membership/*"],
        aiPrompt: `为 Next Route Handler 写 requireAuth / requireMerchant / requireRole。
所有知识库查询必须 where: { merchantId }。
给一个「跨租户访问应 403」的集成测试伪代码。`,
        accept: [
          "无 Token → 401",
          "跨租户 → 403",
          "AGENT 角色不能删除文档"
        ],
        hours: "3h"
      },
      {
        id: "p2-s3",
        day: "Day 6–7",
        title: "前端：登录页 + 请求拦截器 + 租户切换",
        goal: "前后端真正打通。",
        techs: ["React", "Fetch", "Token 存储", "CORS 同源"],
        study: "前端 → 认证与授权；Fetch API",
        todos: [
          "登录页表单；Token 存内存或 httpOnly（学习阶段可先 localStorage 并注明风险）",
          "封装 apiClient：自动带 Authorization 与 X-Merchant-Id",
          "401 跳登录；业务 code ≠ 0 弹 message",
          "简单控制台：显示当前商家与角色"
        ],
        files: ["app/login/page.tsx", "lib/api-client.ts", "app/(app)/layout.tsx"],
        aiPrompt: `用 Next.js App Router 写登录页 + apiClient。
统一处理 code/message/requestId；保存 token 与 merchantId。
说明生产应改用 httpOnly Cookie 的原因（XSS）。`,
        accept: [
          "登录后能进控制台",
          "刷新后（若持久化）仍保持登录或明确要求重登"
        ],
        hours: "2–3h"
      }
    ]
  },
  {
    id: "p3",
    title: "第 3 阶段 · 知识库：上传、解析、向量",
    subtitle: "RAG 数据管道：文件 → 切片 → Embedding → 可检索",
    outcome: "上传文档后状态机流转到 ready，向量可查。",
    steps: [
      {
        id: "p3-s1",
        day: "Day 7–8",
        title: "文档表设计 + 上传 API（校验 Magic Number）",
        goal: "元数据进库，文件落盘或本地 uploads/。",
        techs: ["multipart 上传", "文件安全校验", "状态机", "对象存储思路"],
        study: "后端 → 文件上传与存储实战；表设计",
        todos: [
          "表 KnowledgeDoc：title、status(uploaded/processing/ready/failed)、mime、size、storageKey、failReason",
          "限制大小与类型；UUID 重命名",
          "上传后 status=uploaded，返回 docId",
          "列表接口分页 + merchant 过滤"
        ],
        files: [
          "prisma/schema.prisma（KnowledgeDoc）",
          "modules/knowledge/*",
          "app/api/knowledge-docs/route.ts"
        ],
        aiPrompt: `实现知识库文档上传：multipart、10MB 限制、仅 pdf/md/txt、
Magic Number 校验、存本地 uploads/{merchantId}/、Prisma 落库、状态机字段。
列表 Cursor/Offset 分页任选一种并说明理由。`,
        accept: [
          "非法扩展名被拒",
          "上传后 DB 有记录，磁盘有文件",
          "另一商家看不到该文档"
        ],
        hours: "3–4h"
      },
      {
        id: "p3-s2",
        day: "Day 8–9",
        title: "Redis 队列 + Worker：异步解析与切片",
        goal: "慢任务出请求路径，可重试、可幂等。",
        techs: ["消息队列", "Worker", "分布式锁", "重试与死信", "幂等"],
        study: "后端 → 缓存队列与性能（队列/Worker/锁/重试）",
        todos: [
          "上传成功后 LPUSH 任务 parse:doc",
          "Worker 循环 BRPOP；同一 docId 用 Redis 锁防并发解析",
          "解析文本 → Chunk 切片（~500 token，15% overlap）→ 写入 DocChunk",
          "失败重试 3 次，超过记 failed + failReason；幂等键=docId+version"
        ],
        files: [
          "modules/jobs/parse.worker.ts",
          "modules/knowledge/chunker.ts",
          "scripts/worker.ts"
        ],
        aiPrompt: `用 Redis List 实现文档解析队列 + Worker（可先同仓库 scripts/worker.ts）。
含：锁、重试、状态流转 uploaded→processing→ready/failed、切片函数与单测。
说明如何用 npm run worker 与 next dev 并行。`,
        accept: [
          "上传后不阻塞 HTTP，几秒内变 ready",
          "重复投递同一任务不会双倍切片",
          "故意坏文件会 failed 且有原因"
        ],
        hours: "4h"
      },
      {
        id: "p3-s3",
        day: "Day 9–10",
        title: "Embedding + pgvector 检索",
        goal: "语义检索跑通 TopK。",
        techs: ["Embedding", "pgvector", "Metadata Filter", "Hybrid 预备"],
        study: "AI → RAG 与知识库工程；后端 → 向量存储",
        todos: [
          "Postgres 启用 vector 扩展；Chunk 表加 embedding 列",
          "Worker ready 前批量调用 Embedding API 写入",
          "检索函数：按 merchantId 过滤 + 余弦距离 TopK",
          "写一个调试接口：输入问题返回命中 chunk（仅 ADMIN）"
        ],
        files: [
          "modules/ai/embedding.ts",
          "modules/knowledge/search.ts",
          "app/api/debug/search/route.ts"
        ],
        aiPrompt: `Prisma + pgvector：DocChunk(content, embedding vector, merchantId, docId, heading)。
实现 embedTexts 与 searchChunks(query, merchantId, k=5)。
用 OpenAI 兼容 API（baseURL 可配置）。注意成本：相同文本可缓存到 Redis。`,
        accept: [
          "相似问题能命中相关段落",
          "SQL/代码层必带 merchantId",
          "Redis 能命中重复问题的 embedding 缓存"
        ],
        hours: "3–4h"
      }
    ]
  },
  {
    id: "p4",
    title: "第 4 阶段 · 问答：Prompt、SSE、限流、护栏",
    subtitle: "把检索结果变成可靠的流式回答",
    outcome: "聊天页可流式问答；有引用；会拒答；有限流与日志。",
    steps: [
      {
        id: "p4-s1",
        day: "Day 10–11",
        title: "会话表 + Chat API（非流式先跑通）",
        goal: "先同步返回 JSON，再升级 SSE。",
        techs: ["Prompt 结构", "结构化输出", "引用来源", "拒答策略"],
        study: "AI → 模型调用与 Prompt；RAG 引用/拒答",
        todos: [
          "表 ChatSession / ChatMessage",
          "流程：鉴权→限流→检索→拼 Prompt→调 LLM→存消息",
          "Prompt：只基于资料回答；输出 JSON：answer/sources/confidence/needHandoff",
          "低相似度直接拒答，不调昂贵模型（可配置）"
        ],
        files: [
          "modules/chat/*",
          "modules/ai/prompt.ts",
          "app/api/chat/route.ts"
        ],
        aiPrompt: `实现 POST /api/chat：body { sessionId?, question }。
检索 Top5 → 若最高分 < 0.6 拒答；否则 LLM 结构化输出。
Zod 校验模型输出；失败重试 1 次。保存 user/assistant 消息与 sources。`,
        accept: [
          "有资料时答得靠谱并带来源",
          "无关问题拒答",
          "消息写入数据库"
        ],
        hours: "3–4h"
      },
      {
        id: "p4-s2",
        day: "Day 11–12",
        title: "SSE 流式输出 + 前端打字机",
        goal: "体验接近正式 AI 产品。",
        techs: ["SSE", "流式输出", "Web Streams"],
        study: "后端 → SSE/WebSocket；AI → 流式输出",
        todos: [
          "新增或改造 /api/chat/stream 返回 text/event-stream",
          "Nginx/本地注意：勿缓冲（后面部署会配）",
          "前端 ReadableStream 拼接；结束后再拉完整消息或本地收尾保存",
          "用户可中止（AbortController）"
        ],
        files: [
          "app/api/chat/stream/route.ts",
          "app/(app)/chat/page.tsx"
        ],
        aiPrompt: `Next.js Route Handler 实现 SSE 流式聊天。
事件：token / meta(sources) / done / error。
前端 React 组件展示打字效果与来源列表。说明如何测（curl -N）。`,
        accept: [
          "浏览器逐字出现",
          "curl -N 能看到 event 流",
          "中止后服务端停止浪费 token（尽量）"
        ],
        hours: "3h"
      },
      {
        id: "p4-s3",
        day: "Day 12",
        title: "Redis 限流 + AI 调用日志 + 成本字段",
        goal: "防刷、可记账、可追查。",
        techs: ["限流", "结构化日志", "成本监控", "Metrics 思路"],
        study: "后端 → 限流、结构化日志；AI → 成本/延迟监控",
        todos: [
          "每用户每分钟 N 次 AI 请求（滑动窗口或固定窗口）",
          "超限 429 + Retry-After",
          "表 AiCallLog：tokens、model、latencyMs、requestId、merchantId",
          "日志 JSON：禁止打印完整密钥与用户隐私"
        ],
        files: [
          "lib/rate-limit.ts",
          "modules/ai/usage.ts"
        ],
        aiPrompt: `实现 Redis 滑动窗口限流中间件 + AiCallLog 写入。
给管理接口：按天汇总 token（仅 OWNER）。
说明限流 key 设计：rl:ai:{userId}:{window}。`,
        accept: [
          "压测超限必现 429",
          "每次问答有用量日志",
          "日志无密码/完整 Token"
        ],
        hours: "2–3h"
      },
      {
        id: "p4-s4",
        day: "Day 13",
        title: "安全护栏：注入测试 + PII 脱敏 + 审计",
        goal: "客服场景能上线的底线。",
        techs: ["Prompt Injection 防护", "PII 脱敏", "审计日志", "Guardrails"],
        study: "AI → Prompt Injection / Guardrails / PII；后端 → 审计日志",
        todos: [
          "准备 5 条注入样本（忽略规则、泄露 system）跑回归",
          "工具调用若暂无，至少保证后端权限不靠模型",
          "日志手机号脱敏",
          "删除文档写 audit_logs"
        ],
        files: [
          "modules/security/*",
          "docs/SECURITY_TESTS.md"
        ],
        aiPrompt: `列出 5 条 Prompt Injection 测试用例与期望行为；
实现简单输入检测（可规则）+ 日志 PII 脱敏函数 + 删除文档审计。
强调：权限校验在服务端，不信任模型。`,
        accept: [
          "注入样本不能套出系统提示全文",
          "删除操作 audit 可查",
          "日志中手机号为掩码"
        ],
        hours: "2–3h"
      }
    ]
  },
  {
    id: "p5",
    title: "第 5 阶段 · 缓存、一致性与稳定性",
    subtitle: "从能用变成耐用",
    outcome: "热点配置走缓存；核心路径有超时；发布可优雅停机（本地模拟）。",
    steps: [
      {
        id: "p5-s1",
        day: "Day 14",
        title: "商家配置缓存 + 更新删缓存",
        goal: "Cache Aside 跑通。",
        techs: ["Redis 缓存", "TTL", "缓存一致性", "穿透防护"],
        study: "后端 → Redis 缓存 / TTL / 一致性 / 穿透击穿雪崩",
        todos: [
          "缓存 merchant settings，TTL 5 分钟 + 随机抖动",
          "更新设置：写库后删缓存",
          "不存在的 merchant 缓存空值短 TTL",
          "命中率可临时打日志观察"
        ],
        files: ["modules/merchant/cache.ts"],
        aiPrompt: `实现 getMerchantSettings 的 Cache Aside：Redis JSON、TTL 抖动、
更新时 delete key、穿透空值缓存。附 redis-cli 验证步骤。`,
        accept: [
          "第二次读取不再打 DB（可用日志证明）",
          "更新后马上读到新值"
        ],
        hours: "2h"
      },
      {
        id: "p5-s2",
        day: "Day 14–15",
        title: "超时、重试、健康检查",
        goal: "依赖挂了不拖死整个进程。",
        techs: ["超时重试熔断", "健康检查", "优雅停机"],
        study: "后端 → 高可用与稳定性",
        todos: [
          "AI fetch 必须 AbortController 超时",
          "仅对 429/5xx 重试，指数退避 + 抖动",
          "/health/live 与 /health/ready（查 DB+Redis）",
          "Worker 与 Next 处理 SIGTERM 的说明写进 README"
        ],
        files: [
          "lib/http/fetch-retry.ts",
          "app/api/health/live/route.ts",
          "app/api/health/ready/route.ts"
        ],
        aiPrompt: `封装 fetchWithTimeoutRetry；区分 live/ready 健康检查；
ready 检查 DB/Redis 且单次超时 1s。说明 Docker HEALTHCHECK 怎么写。`,
        accept: [
          "停掉 Redis 时 ready 失败，live 仍可成功",
          "AI 超时不会挂死请求线程（有错误返回）"
        ],
        hours: "2–3h"
      }
    ]
  },
  {
    id: "p6",
    title: "第 6 阶段 · 测试、前端打磨与评测",
    subtitle: "敢重构、敢演示、敢说指标",
    outcome: "核心单测/接口测通过；有 20 条黄金问题集。",
    steps: [
      {
        id: "p6-s1",
        day: "Day 15–16",
        title: "单测 + 接口集成测试",
        goal: "覆盖切片、权限、限流、登录。",
        techs: ["单元测试", "集成测试", "Mock 外部依赖"],
        study: "后端 → 后端测试与代码质量",
        todos: [
          "Vitest：chunker、脱敏、限流纯逻辑",
          "集成测试：注册登录、跨租户 403（可用 testcontainers 或 compose 测试库）",
          "Mock Embedding/LLM，避免 CI 烧钱",
          "npm test 进 package.json"
        ],
        files: ["tests/**", "vitest.config.ts"],
        aiPrompt: `为 chunker 与 requireMerchant 越权场景写 Vitest。
AI 调用用 mock。说明 CI 中如何复用 docker compose 的 postgres/redis。`,
        accept: [
          "npm test 全绿",
          "至少 8 条有意义测试，不是测 getter"
        ],
        hours: "3h"
      },
      {
        id: "p6-s2",
        day: "Day 16",
        title: "管理台页面打磨 + 黄金评估集",
        goal: "可演示；AI 质量可回归。",
        techs: ["React 页面", "AI 评估集", "检索命中率"],
        study: "AI → AI 评估集 / 检索命中率；前端 React",
        todos: [
          "页面：文档列表与状态、上传、聊天、简单用量",
          "准备 20 条问答黄金集（含应拒答）",
          "写脚本跑检索命中率（可先手工表）",
          "README 加演示账号与截图位"
        ],
        files: [
          "app/(app)/**",
          "eval/golden-set.json",
          "scripts/eval-retrieval.ts"
        ],
        aiPrompt: `生成 20 条黄金集 JSON：question、expectDocHint、shouldRefuse。
再给一个脚本：对每题 searchChunks，统计 Top3 命中率。
前端三个页面信息架构简图也写一下。`,
        accept: [
          "陌生人能按 README 点开并完成「上传→提问」",
          "黄金集可重复跑"
        ],
        hours: "3–4h"
      }
    ]
  },
  {
    id: "p7",
    title: "第 7 阶段 · 容器化、Nginx 与发布",
    subtitle: "真正「能上线」的形状",
    outcome: "一台云主机上：compose + Nginx 反代，HTTPS 路径清楚，可回滚。",
    steps: [
      {
        id: "p7-s1",
        day: "Day 17",
        title: "多阶段 Dockerfile + 生产 compose",
        goal: "应用镜像可复现构建。",
        techs: ["Dockerfile 多阶段", "compose 编排", "非 root", "健康检查"],
        study: "后端 → Docker 与容器化；十二要素",
        todos: [
          "Dockerfile：builder + runner（slim），非 root",
          "compose.prod：web、worker、postgres、redis、nginx",
          "环境变量运行时注入，镜像不含 .env",
          "本地 compose -f docker-compose.prod.yml up --build 验证"
        ],
        files: [
          "Dockerfile",
          "docker-compose.prod.yml",
          "nginx/nginx.conf"
        ],
        aiPrompt: `为 Next.js standalone 输出写多阶段 Dockerfile + prod compose（web/worker/db/redis/nginx）。
nginx 反代 web:3000，上传 client_max_body_size 20m；SSE proxy_buffering off。
HEALTHCHECK 打 /api/health/ready。`,
        accept: [
          "浏览器经 Nginx:80 访问成功",
          "Worker 容器在消费队列",
          "删容器重建，DB 数据还在"
        ],
        hours: "3–4h"
      },
      {
        id: "p7-s2",
        day: "Day 18",
        title: "云主机部署清单：SSH、安全组、域名、证书",
        goal: "公网可访问且不是裸奔。",
        techs: ["SSH", "安全组", "DNS", "HTTPS", "反向代理"],
        study: "后端 → Linux 服务器；网络域名 HTTPS；云部署",
        todos: [
          "买/用一台云主机；安全组只开 22/80/443；DB 端口不对公网",
          "SSH 密钥登录；部署 compose",
          "域名 A 记录指向主机；Certbot 或 Caddy 上 HTTPS（可先 HTTP 再补证书）",
          "写 docs/DEPLOY.md：发版、回滚（镜像 tag）、看日志命令"
        ],
        files: ["docs/DEPLOY.md", "docs/RUNBOOK.md"],
        aiPrompt: `写一份单机 Docker 部署手册：安全组、SSH、安装 Docker、
拉取/构建、.env 配置、nginx HTTPS（Let's Encrypt）、回滚与 journalctl/docker logs 排障。
含检查清单 checklist。`,
        accept: [
          "外网能打开登录页",
          "5432/6379 外网扫不到（或未映射）",
          "按 RUNBOOK 能定位「连不上 DB」类问题"
        ],
        hours: "3–5h"
      },
      {
        id: "p7-s3",
        day: "Day 19",
        title: "CI 流水线 + 最终验收演示",
        goal: "提交即测；自己做一次完整演示。",
        techs: ["CI/CD", "GitHub Actions", "回滚", "可观测清单"],
        study: "后端 → CI/CD；可观测上线清单",
        todos: [
          "GitHub Actions：lint + test（服务用 service container）",
          "镜像 tag 用 git sha",
          "按最终 Demo 清单录一段自己操作（或写演示脚本）",
          "复盘：列出下一版 3 个改进（Hybrid、Rerank、真正 OSS）"
        ],
        files: [".github/workflows/ci.yml", "docs/DEMO_SCRIPT.md"],
        aiPrompt: `写 GitHub Actions：node 22（2026 Active LTS）、启动 postgres/redis service、npm test。
再写 DEMO_SCRIPT.md：3 分钟演示台词（注册→上传→提问→限流→跨租户 403）。
最后给「作品集介绍」一段话（STAR）。`,
        accept: [
          "CI 在 GitHub 上绿过至少一次",
          "能独立完整演示不看稿",
          "README 新人可按步骤跑起来"
        ],
        hours: "3h"
      }
    ]
  }
];

export const tutorialTechChecklist: { tech: string; stepIds: string[] }[] = [
  { tech: "HTTP / REST / 统一响应 / 错误码", stepIds: ["p1-s1"] },
  { tech: "分层 Controllers/Service/Repository + Zod", stepIds: ["p1-s2"] },
  { tech: "PostgreSQL + Prisma 迁移 + 表设计", stepIds: ["p1-s3", "p3-s1"] },
  { tech: "JWT + bcrypt + 登录安全", stepIds: ["p2-s1"] },
  { tech: "RBAC + 多租户隔离", stepIds: ["p2-s2"] },
  { tech: "前端登录与 API Client", stepIds: ["p2-s3"] },
  { tech: "文件上传与安全校验", stepIds: ["p3-s1"] },
  { tech: "Redis 队列 / Worker / 锁 / 重试 / 幂等", stepIds: ["p3-s2"] },
  { tech: "Embedding + pgvector + Metadata Filter", stepIds: ["p3-s3"] },
  { tech: "Prompt / 结构化输出 / 拒答 / 引用", stepIds: ["p4-s1"] },
  { tech: "SSE 流式", stepIds: ["p4-s2"] },
  { tech: "限流 + AI 用量日志", stepIds: ["p4-s3"] },
  { tech: "Prompt Injection / PII / 审计", stepIds: ["p4-s4"] },
  { tech: "缓存一致性 / 穿透", stepIds: ["p5-s1"] },
  { tech: "超时重试 / 健康检查 / 优雅停机", stepIds: ["p5-s2"] },
  { tech: "单测 + 集成测试 + Mock", stepIds: ["p6-s1"] },
  { tech: "评估集 / 命中率", stepIds: ["p6-s2"] },
  { tech: "Docker / Compose / Nginx", stepIds: ["p7-s1"] },
  { tech: "SSH / 安全组 / DNS / HTTPS / 部署手册", stepIds: ["p7-s2"] },
  { tech: "CI/CD + 演示与作品集", stepIds: ["p7-s3"] }
];

export function countTutorialSteps() {
  return tutorialPhases.reduce((n, p) => n + p.steps.length, 0);
}
