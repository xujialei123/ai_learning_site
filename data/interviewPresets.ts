import type { InterviewQuestion } from "@/lib/interviewDb";

export const presetQuestions: Omit<InterviewQuestion, "id" | "createdAt">[] = [
  // ============ 前端基础 ============
  {
    question: "React 中 useEffect 的清理函数什么时候执行？",
    answer: "1) 组件卸载时执行清理；2) 依赖数组变化时，先执行上一次的清理，再执行新的 effect；3) 常见场景：取消订阅、清除定时器、移除事件监听；4) 注意：清理函数在浏览器绘制之后异步执行，不会阻塞渲染。",
    category: "前端",
    difficulty: "基础",
    tags: ["React", "Hooks", "useEffect"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "解释 JavaScript 的事件循环（Event Loop）机制",
    answer: "1) 调用栈执行同步代码；2) 遇到异步任务(如 setTimeout、Promise)放入任务队列；3) 宏任务：setTimeout、setInterval、I/O；4) 微任务：Promise.then、MutationObserver；5) 执行顺序：同步代码 → 微任务 → 宏任务；6) Node.js 有额外的阶段(timers、poll、check)。",
    category: "前端",
    difficulty: "中级",
    tags: ["JavaScript", "异步", "Event Loop"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "React Server Components 和 Client Components 的区别？",
    answer: "1) Server Components 在服务端渲染，不能用 useState/useEffect；2) Client Components 用 'use client' 声明，可在浏览器运行；3) Server Components 优势：零客户端 JS、直接访问数据库、SEO 好；4) 选择原则：数据获取用 Server，交互用 Client；5) Next.js App Router 默认所有组件是 Server Component。",
    category: "前端",
    difficulty: "高级",
    tags: ["React", "Next.js", "SSR"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "前端性能优化有哪些核心指标和优化手段？",
    answer: "指标：1) LCP(最大内容绘制) < 2.5s；2) FID(首次输入延迟) < 100ms；3) CLS(累积布局偏移) < 0.1；4) TTFB(首字节时间) < 800ms。优化：1) 代码分割+懒加载；2) 图片优化(WebP、srcset)；3) 减少重排重绘；4) 使用 memo/useMemo/useCallback；5) Service Worker 缓存；6) CDN 加速。",
    category: "前端",
    difficulty: "高级",
    tags: ["性能优化", "Core Web Vitals"],
    source: "manual",
    topic: "全栈+AI面试题"
  },

  // ============ 后端基础 ============
  {
    question: "Node.js 中间件的执行顺序为什么很重要？",
    answer: "1) 中间件按注册顺序执行；2) 日志中间件要最先注册，确保记录所有请求；3) 错误处理中间件要最后注册，catch 所有异常；4) 鉴权中间件要在业务中间件之前；5) next() 调用下一个中间件，不调用则请求终止；6) 错误传递用 next(err)。",
    category: "后端",
    difficulty: "基础",
    tags: ["Node.js", "中间件", "Express"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "JWT 和 Session 如何选择？各有什么优缺点？",
    answer: "JWT：1) 无状态，服务端不存储；2) 适合分布式系统；3) 缺点：无法主动失效、Token 体积大。Session：1) 有状态，服务端存储；2) 可随时失效；3) 缺点：占用服务器内存、分布式需要共享 Session。选择：1) 单体应用用 Session；2) 分布式/前后端分离用 JWT；3) 安全要求高用 JWT + Redis 黑名单。",
    category: "后端",
    difficulty: "中级",
    tags: ["JWT", "Session", "认证"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "如何设计一个高可用的 REST API？",
    answer: "1) 统一响应格式：{ code, message, data, requestId }；2) 错误码体系：分段设计(1xxxx参数、2xxxx认证、5xxxx系统)；3) 版本管理：/api/v1/；4) 限流：Redis + 滑动窗口；5) 熔断降级：连续失败后返回默认值；6) 幂等设计：幂等键+唯一约束；7) 监控告警：错误率、延迟、QPS。",
    category: "后端",
    difficulty: "高级",
    tags: ["API设计", "高可用", "系统设计"],
    source: "manual",
    topic: "全栈+AI面试题"
  },

  // ============ 数据库 ============
  {
    question: "MySQL 索引的最左前缀原则是什么？",
    answer: "1) 复合索引(a,b,c)查询时必须包含 a；2) WHERE a=1 AND b=2 可以用索引；3) WHERE b=2 AND c=3 不能用索引(缺少 a)；4) WHERE a=1 AND c=3 只能用到 a；5) 范围查询后的字段不能用索引：WHERE a>1 AND b=2，b 用不到索引。",
    category: "数据库",
    difficulty: "中级",
    tags: ["MySQL", "索引", "查询优化"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "数据库事务的隔离级别有哪些？会产生什么问题？",
    answer: "1) 读未提交：会产生脏读；2) 读已提交(Oracle默认)：解决脏读，但有不可重复读；3) 可重复读(MySQL默认)：解决不可重复读，但有幻读；4) 串行化：解决所有问题，但性能最差。脏读：读到未提交数据；不可重复读：同一查询两次结果不同；幻读：新增行被读到。",
    category: "数据库",
    difficulty: "中级",
    tags: ["MySQL", "事务", "隔离级别"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "PostgreSQL 相比 MySQL 有什么优势？",
    answer: "1) JSONB 类型：支持 JSON 查询和索引；2) 数组类型：原生支持数组；3) 全文搜索：tsvector + tsquery；4) pgvector 扩展：支持向量检索；5) CTE 递归查询：支持复杂查询；6) 更严格的标准遵循；7) 适合 AI 应用：向量存储+全文搜索一体化。",
    category: "数据库",
    difficulty: "高级",
    tags: ["PostgreSQL", "数据库选型"],
    source: "manual",
    topic: "全栈+AI面试题"
  },

  // ============ Redis ============
  {
    question: "Redis 缓存穿透、击穿、雪崩分别是什么？如何解决？",
    answer: "穿透：查询不存在的数据，每次都查 DB。解决：缓存空值、布隆过滤器。击穿：热点 key 过期，大量请求打到 DB。解决：互斥锁、永不过期+异步更新。雪崩：大量 key 同时过期或 Redis 宕机。解决：TTL 加随机值、多级缓存、熔断降级。",
    category: "Redis",
    difficulty: "中级",
    tags: ["Redis", "缓存", "高并发"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "Redis 限流的滑动窗口算法如何实现？",
    answer: "1) 使用 Redis ZSET 存储请求时间戳；2) 每次请求：ZADD key timestamp timestamp；3) 删除过期请求：ZREMRANGEBYSCORE key 0 (now - window)；4) 统计请求数：ZCARD key；5) 判断是否超限：ZCARD > limit 则拒绝；6) 设置 key 过期时间：EXPIRE key window。",
    category: "Redis",
    difficulty: "高级",
    tags: ["Redis", "限流", "滑动窗口"],
    source: "manual",
    topic: "全栈+AI面试题"
  },

  // ============ AI 应用 ============
  {
    question: "RAG 系统中如何优化检索质量？",
    answer: "1) 切片优化：调整 chunk 大小(200-1000 Token)和重叠(15%)；2) Embedding 选择：中文用 bge-large-zh，英文用 OpenAI text-embedding-3；3) Hybrid Search：向量+关键词结合；4) Rerank：用 Cross-Encoder 重新排序；5) Query Rewrite：用户口语化问题改写；6) Metadata Filter：按 merchant_id 过滤多租户。",
    category: "AI应用",
    difficulty: "高级",
    tags: ["RAG", "向量检索", "Embedding"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "AI Agent 的工具调用流程是什么？需要注意什么安全问题？",
    answer: "流程：1) 用户问题→LLM 判断需要调用工具；2) 返回工具名+参数(JSON)；3) 后端校验权限；4) 执行工具；5) 结果返回 LLM→生成最终回答。安全：1) 参数校验防注入；2) 用户权限校验防越权；3) 工具白名单限制；4) 敏感操作人工审批；5) 工具调用日志审计；6) 最大步数限制防无限循环。",
    category: "AI应用",
    difficulty: "高级",
    tags: ["Agent", "Tool Calling", "安全"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "如何防止 Prompt Injection 攻击？",
    answer: "1) 输入过滤：检测危险关键词(忽略规则、输出系统Prompt)；2) System Prompt 约束：明确禁止行为；3) 后端权限：即使 AI 被骗，后端也校验权限；4) 输出过滤：检测是否包含系统信息；5) 分层防护：输入→Prompt→检索→输出→后端；6) 监控：记录可疑输入，人工审核。",
    category: "AI应用",
    difficulty: "高级",
    tags: ["Prompt Injection", "安全", "Guardrails"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "AI 客服系统的幻觉率如何控制？",
    answer: "1) 严格 Prompt：只基于知识库回答，不知道就说不知道；2) 检索质量：提高 Top-3 命中率>85%；3) 引用来源：回答必须标注来源；4) 相似度阈值：检索相似度<0.6 拒答；5) 评估集：100+问题定期回归测试；6) 反馈闭环：用户点踩的问题补充知识库；7) 监控：幻觉率<5%，关键领域=0%。",
    category: "AI应用",
    difficulty: "高级",
    tags: ["幻觉", "RAG", "质量控制"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "SSE 流式输出的实现原理是什么？",
    answer: "1) SSE(Server-Sent Events)：服务端单向推送；2) 响应头：Content-Type: text/event-stream；3) 数据格式：data: xxx\\n\\n；4) 结束标志：data: [DONE]；5) 前端：EventSource 或 fetch + ReadableStream；6) 优势：基于 HTTP、自动重连、兼容性好；7) 场景：AI 流式输出、实时日志。",
    category: "AI应用",
    difficulty: "中级",
    tags: ["SSE", "流式输出", "实时通信"],
    source: "manual",
    topic: "全栈+AI面试题"
  },

  // ============ 架构 ============
  {
    question: "如何设计一个支持多租户的 SaaS 系统？",
    answer: "1) 数据隔离：共享数据库+merchant_id 字段；2) 缓存隔离：key 包含 merchant_id；3) 文件隔离：按 merchant_id 分目录；4) 权限隔离：查询必须带 merchant_id；5) ORM 拦截：全局 filter 自动添加；6) 测试：用不同 token 访问对方数据应返回 403。",
    category: "架构",
    difficulty: "高级",
    tags: ["多租户", "SaaS", "系统设计"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "微服务架构和单体架构如何选择？",
    answer: "单体适用：1) 团队<10人；2) 业务复杂度低；3) 快速迭代验证。微服务适用：1) 团队>20人；2) 业务边界清晰；3) 需要独立部署扩展。选择原则：1) 先单体后拆分；2) 按业务边界拆分；3) 共享库减少重复；4) 服务网格管理复杂度。",
    category: "架构",
    difficulty: "高级",
    tags: ["微服务", "架构选型", "系统设计"],
    source: "manual",
    topic: "全栈+AI面试题"
  },

  // ============ 安全 ============
  {
    question: "XSS 攻击的类型和防御措施有哪些？",
    answer: "类型：1) 存储型：恶意脚本存入数据库；2) 反射型：URL 参数注入；3) DOM 型：前端 JS 操作 DOM 注入。防御：1) 输入过滤：去掉 script 标签；2) 输出编码：HTML 实体编码；3) CSP：Content-Security-Policy 限制脚本来源；4) httpOnly Cookie：防止 JS 读取；5) React 默认转义。",
    category: "安全",
    difficulty: "中级",
    tags: ["XSS", "Web安全", "前端安全"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "CORS 跨域问题的解决方案有哪些？",
    answer: "1) 服务端设置 Access-Control-Allow-Origin；2) 预检请求：OPTIONS 方法；3) Next.js rewrites 代理；4) Nginx 反向代理；5) 开发环境：webpack-dev-server proxy。注意：1) 生产环境不要用 *；2) 带 Cookie 时需要 Allow-Credentials；3) 预检请求会增加延迟。",
    category: "安全",
    difficulty: "基础",
    tags: ["CORS", "跨域", "Web安全"],
    source: "manual",
    topic: "全栈+AI面试题"
  },

  // ============ 部署运维 ============
  {
    question: "Docker 容器化部署的核心步骤是什么？",
    answer: "1) 编写 Dockerfile：定义构建步骤；2) 多阶段构建：减小镜像体积；3) docker-compose：定义多服务编排；4) 环境变量：.env 文件挂载；5) 数据持久化：volume 挂载；6) 健康检查：HEALTHCHECK 指令；7) 日志管理：docker logs。",
    category: "部署运维",
    difficulty: "中级",
    tags: ["Docker", "容器化", "部署"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "CI/CD 流水线如何设计？",
    answer: "1) 触发：push/PR 时触发；2) 检查：lint + 类型检查；3) 测试：单元测试 + 集成测试；4) 构建：Docker 镜像构建；5) 推送：推送镜像仓库；6) 部署：自动部署测试环境，手动审批生产环境；7) 通知：成功/失败通知；8) 工具：GitHub Actions、GitLab CI。",
    category: "部署运维",
    difficulty: "高级",
    tags: ["CI/CD", "自动化", "DevOps"],
    source: "manual",
    topic: "全栈+AI面试题"
  },

  // ============ 综合 ============
  {
    question: "如何设计一个完整的 AI 客服系统架构？",
    answer: "1) 接入层：Webhook 接收企微/钉钉消息；2) 会话管理：chat_sessions + chat_messages；3) RAG 检索：知识库→切片→Embedding→向量检索；4) LLM 生成：Prompt 模板 + 流式输出；5) 工具调用：查订单、创建工单；6) 转人工：低置信度自动转接；7) 监控：Token 成本、幻觉率、转人工率。",
    category: "综合",
    difficulty: "综合",
    tags: ["系统设计", "AI客服", "全栈"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "面试中如何回答「说说你的项目经验」？",
    answer: "STAR 法则：1) Situation：项目背景(电商客服系统)；2) Task：你的职责(负责 RAG 检索优化)；3) Action：具体做了什么(切片优化、Hybrid Search、Rerank)；4) Result：效果(命中率从 60% 提升到 85%)。注意：1) 用数据说话；2) 突出技术难点；3) 说明业务价值。",
    category: "综合",
    difficulty: "综合",
    tags: ["面试技巧", "项目经验", "STAR法则"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "全栈工程师需要掌握哪些核心技能？",
    answer: "1) 前端：React/Next.js、TypeScript、CSS 布局；2) 后端：Node.js、REST API、中间件；3) 数据库：PostgreSQL、Redis、索引优化；4) AI：Prompt Engineering、RAG、Agent；5) 部署：Docker、CI/CD、监控；6) 安全：认证授权、XSS/CSRF 防护；7) 软技能：系统设计、问题排查、沟通协作。",
    category: "综合",
    difficulty: "综合",
    tags: ["全栈", "技能树", "职业发展"],
    source: "manual",
    topic: "全栈+AI面试题"
  },
  {
    question: "如何评估一个 AI 应用项目的技术方案？",
    answer: "1) 准确率：检索命中率>85%，回答准确率>80%；2) 延迟：首 Token<1s，总时长<3s；3) 成本：单次对话 Token 费用可控；4) 安全：幻觉率<5%，无 Prompt Injection；5) 可维护：Prompt 版本管理、评估集回归；6) 可扩展：模型路由、多租户支持；7) 监控：全链路追踪、告警。",
    category: "综合",
    difficulty: "综合",
    tags: ["AI项目", "技术评审", "架构设计"],
    source: "manual",
    topic: "全栈+AI面试题"
  }
];
