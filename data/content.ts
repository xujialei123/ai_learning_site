
export type KnowledgeItem = {
  name: string;
  desc: string;
  projectUse: string;
  mistake: string;
  understanding?: string;
  difficulty?: string;
};

export type KnowledgeGroup = {
  title: string;
  intro: string;
  items: KnowledgeItem[];
};

export type FeatureMap = {
  feature: string;
  scenario: string;
  stack: string[];
  tables: string[];
  risks: string[];
};

export const backendGroups: KnowledgeGroup[] = [
  {
    title: "后端基础与 API",
    intro: "解决前端和后端怎么通信、接口怎么设计、错误怎么返回、请求怎么被保护。",
    items: [
      { name: "HTTP 基础", desc: "Method、状态码、Header、Body、Cookie、缓存、CORS，是前后端通信的地基。", projectUse: "所有后台接口、上传文件、登录、AI 流式回复都依赖 HTTP。", mistake: "不要把跨域、业务错误、服务器错误混为一谈。", understanding: "1) HTTP Method 语义：GET(查询，幂等安全)、POST(创建，非幂等)、PUT(全量替换，幂等)、PATCH(部分更新)、DELETE(删除，幂等)，选错方法会导致接口语义混乱、缓存失效；2) 状态码分层：1xx(信息)、2xx(成功：200 OK/201 Created/204 No Content)、3xx(重定向：301永久/302临时/304未修改)、4xx(客户端错误：400参数错/401未登录/403无权限/404不存在/409冲突/429限流)、5xx(服务器错误：500内部错/502网关错/503服务不可用)；3) Header 详解：Content-Type(application/json/multipart/form-data)、Authorization(Bearer token)、Cache-Control(no-cache/no-store/max-age)、Access-Control-Allow-Origin(CORS)、Set-Cookie(httpOnly/secure/sameSite)、Accept-Language；4) 缓存机制：强缓存(Cache-Control max-age/Expires，直接用本地副本)、协商缓存(If-None-Match ETag/If-Modified-Since，服务器判断是否更新)、304 Not Modified 表示资源未变；5) Cookie vs Token：Cookie 自动携带、受同源策略限制、适合 SSR；Token 手动设置 Header、跨域友好、适合前后端分离；6) CORS 详解：预检请求(OPTIONS)、简单请求 vs 非简单请求、Allow-Credentials、Expose-Headers；7) HTTP/2 优势：多路复用、头部压缩、服务器推送、二进制分帧。" },
      { name: "REST API 设计", desc: "用资源和 HTTP Method 表达业务动作，接口更清晰。", projectUse: "GET /knowledge-docs、POST /chat-sessions、PATCH /docs/:id/status。", mistake: "不要所有接口都用 POST。", understanding: "1) 资源命名规则：名词复数(/users)、小写连字符(/knowledge-docs)、不用动词(/getUsers ❌ → GET /users ✅)；2) 层级关系：/merchants/:id/knowledge-docs(商家下的知识库)、/chats/:id/messages(会话的消息)，最多嵌套两层；3) 查询参数设计：过滤(?status=active)、排序(?sort=created_at&order=desc)、分页(?page=1&limit=20)、搜索(?q=关键词)；4) 状态码语义：GET→200、POST→201 Created、PUT/PATCH→200、DELETE→204 No Content；5) PUT vs PATCH：PUT 全量替换(客户端传完整对象)、PATCH 部分更新(只传修改字段)；6) 幂等性：GET/PUT/DELETE 天然幂等，POST 需要幂等键；7) HATEOAS：响应中包含相关链接，如 { data: [...], links: { self: '/users/1', next: '/users/2' } }；8) 过滤嵌套资源：GET /merchants/123/knowledge-docs?status=active。" },
      { name: "接口版本管理", desc: "当客户端和后端都在迭代时，用 v1/v2 或兼容策略避免破坏旧功能。", projectUse: "Web 管理台、小程序、客服端可能同时接入同一套后端。", mistake: "不要随意改接口字段，容易导致旧页面挂掉。", understanding: "1) URL 版本：/api/v1/users、/api/v2/users，简单直观，客户端显式切换；2) Header 版本：Accept: application/vnd.api.v1+json，更 RESTful，URL 干净；3) 向后兼容黄金法则：新增字段不破坏旧客户端、删除字段要等所有客户端升级完成；4) 字段重命名过渡：保留旧字段同时返回新字段，标记 deprecated，给 2-3 个月迁移期；5) 版本废弃流程：发出 Deprecation 头、设置 Sunset 日期、文档通知、监控调用量；6) 数据库 Schema 兼容：新增列用默认值、删除列先停用再删除、重命名列用视图过渡；7) 多版本共存：v1 和 v2 代码可以共存(条件分支或独立模块)，但共享底层 Service；8) 版本决策：小改动用兼容策略不需要新版本，破坏性变更才升版本号。" },
      { name: "参数校验", desc: "对 query、body、params、file 做类型和业务校验。", projectUse: "校验文件大小、格式、分页参数、消息长度。", mistake: "不要只在前端校验，后端必须兜底。", understanding: "1) 参数来源区分：params(路径参数，/users/:id 中的 id)、query(查询字符串，?page=1)、body(请求体，POST 数据)、file(文件上传)；2) 校验层次：类型校验(string/number/boolean)、格式校验(email/uuid/日期)、范围校验(1-100/min:1)、业务校验(用户名是否存在)；3) 校验库选择：Zod(类型安全、TS 推导)、Joi(功能全、链式调用)、class-validator(装饰器风格)；4) 文件校验：大小限制(如 10MB)、MIME 类型(如 application/pdf)、文件名安全(防止路径注入)、扩展名白名单；5) 批量操作校验：数组长度限制(如最多 100 条)、每项都要校验、部分失败处理；6) 错误信息设计：字段名 + 失败原因 + 修复建议(如 email 格式不正确，请输入有效的邮箱地址)；7) 校验时机：Controller 层做基础校验，Service 层做业务校验；8) 防御性编程：SQL 注入、XSS 攻击、文件上传漏洞都要在参数校验阶段拦截。" },
      { name: "统一响应格式", desc: "用 code、message、data、requestId 统一返回，前端更好处理。", projectUse: "错误提示、日志排查、客服后台弹窗。", mistake: "不要每个接口返回格式都不一样。", understanding: "1) 成功响应：{ code: 0, message: 'ok', data: { ... } }，code=0 表示成功；2) 错误响应：{ code: 40001, message: '参数错误', requestId: 'abc123', details: { field: 'email', reason: '格式不正确' } }；3) 分页响应：{ code: 0, data: { list: [...], total: 100, page: 1, limit: 20, hasMore: true } }；4) requestId 生成：UUID v4 或 nanoid，注入到 Response Header 和日志；5) 前端拦截器：axios/fetch 拦截器根据 code 统一处理(0=成功、401=跳登录、其他=弹错误)；6) 安全原则：不要暴露内部错误堆栈、数据库表名、SQL 语句给前端；7) 流式响应：SSE 保持连接，每条消息仍遵循统一格式；8) 嵌套数据：data 中可以嵌套，但顶层结构必须一致。" },
      { name: "错误码体系", desc: "区分参数错误、未登录、无权限、业务冲突、外部服务失败。", projectUse: "AI 调用失败、知识库解析失败、用户无权限删除。", mistake: "不要所有错误都返回 500。", understanding: "1) 错误码分段设计：1xxxx 参数错误、2xxxx 认证错误、3xxxx 权限错误、4xxxx 业务错误、5xxxx 系统错误、6xxxx 外部依赖错误；2) 五位数结构：第一位=大类、第二位=子类、后三位=具体错误；3) 常见错误码：10001=参数缺失、10002=参数类型错误、10003=参数格式错误、20001=未登录、20002=Token 过期、20003=Token 无效、30001=无权限、30002=无角色、40001=资源不存在、40002=状态冲突、40003=重复操作、50001=服务器内部错误、50002=数据库错误、60001=AI 服务不可用、60002=AI 超时、60003=AI 限流；4) 错误码稳定性：一旦发布不能改，废弃用弃用流程；5) 文档化：维护错误码文档，前端和 AI 工具都要能查到；6) 重试判断：客户端根据错误码判断是否重试(50001 可重试、40001 不可重试)；7) 日志关联：错误码 + requestId 关联日志，便于排查；8) 国际化：message 支持多语言，根据 Accept-Language 返回对应语言。" },
      { name: "分页与排序", desc: "列表数据必须分页，配合索引避免大数据量卡死。", projectUse: "聊天记录、日志列表、知识库文档列表。", mistake: "不要一次性返回全部数据。", understanding: "1) Offset 分页：LIMIT 20 OFFSET 100，简单但深分页慢(跳过大量数据)、数据漂移(新增数据导致重复)；2) Cursor 分页：WHERE id > last_id LIMIT 20，性能稳定、无数据漂移，适合无限滚动；3) 参数设计：page + limit(适合后台管理)、cursor + limit(适合移动端)、offset + limit(简单场景)；4) 排序字段：created_at、updated_at、自定义排序字段(如 position)；5) 排序方向：ASC 升序、DESC 降序，多字段排序(如 status ASC, created_at DESC)；6) 深分页优化：超过 1000 条强制用 cursor，或用 Elasticsearch；7) 总数查询：SELECT COUNT(*) 全表扫描慢，可用缓存、近似值( SHOW TABLE STATUS )、或异步统计；8) 前端配合：加载更多(追加数据)、跳页(后台管理)、排序切换、筛选条件变化重置分页；9) 返回设计：{ list: [...], total: 100, page: 1, limit: 20, hasMore: true, nextCursor: 'xxx' }。" },
      { name: "幂等设计", desc: "重复请求不会造成重复创建、重复扣费、重复解析。", projectUse: "重复上传回调、重复点击提交、队列任务重试。", mistake: "不要假设用户只会点一次按钮。", understanding: "1) 幂等键：客户端生成唯一 ID(如 UUID)放入 Header 或 Body，服务端用 Redis/DB 记录已处理的 ID；2) 数据库唯一约束：业务键加 UNIQUE 索引(如订单号 order_no)，重复插入自动失败；3) Token 机制：服务端预生成 Token 返回客户端，客户端携带提交，用过即删；4) 典型场景：支付回调(重复回调不重复扣款)、表单提交(防重复提交)、消息队列(重试不重复处理)、Webhook(重复推送不重复处理)；5) 前端配合：按钮点击后 disable + loading、请求完成后恢复、页面跳转前取消请求；6) 乐观锁：UPDATE SET version=version+1 WHERE id=? AND version=?，版本不匹配则失败；7) 分布式幂等：多实例部署时，幂等键要存 Redis 而非本地内存；8) 幂等 vs 防重：幂等允许多次调用结果相同，防重是完全拒绝重复调用。" },
      { name: "SSE / WebSocket", desc: "SSE 适合 AI 流式输出；WebSocket 适合双向实时客服。", projectUse: "AI 打字机回复、客服实时消息。", mistake: "不要为了普通流式回复过度使用 WebSocket。", understanding: "1) SSE(Server-Sent Events)：单向服务端推送，基于 HTTP 协议，浏览器原生 EventSource API；适合 AI 流式输出、通知推送、实时日志；2) WebSocket：全双工双向通信，需要 HTTP 握手升级协议(ws/wss)；适合聊天、协作编辑、游戏、实时对战；3) SSE 优势：基于 HTTP(无跨域问题)、自动重连、断点续传(lastEventId)、简单轻量；4) SSE 劣势：单向(客户端发消息用普通 HTTP)、最大连接数受浏览器限制(6个/域名)；5) WebSocket 优势：双向、低延迟、二进制传输、无 HTTP 头开销；6) WebSocket 劣势：需要握手、需要心跳保活、代理/防火墙可能拦截；7) 实现要点：SSE 用 text/event-stream 格式，每条消息 data: xxx\n\n；WebSocket 用 ws/wss 协议；8) 连接管理：心跳检测(每 30s ping)、断线重连(指数退避)、连接数限制(单用户最多 5 个)；9) AI 流式场景：SSE 就够用，每个 Token 发一个 event，前端拼接显示，流式结束后保存完整消息到数据库。" },
      { name: "Webhook", desc: "第三方平台主动把事件推给你的接口，需要验签、幂等和重试。", projectUse: "企微消息、支付回调、第三方平台客服消息。", mistake: "不要信任未经验证的 webhook 请求。", understanding: "1) 验签：HMAC-SHA256 签名算法，用密钥对请求体计算签名，对比第三方传递的签名；2) 签名位置：可能在 Header(X-Webhook-Signature)或 Body 中；3) 幂等处理：用事件 ID(event_id)做幂等键，存 Redis/DB，重复推送直接返回成功；4) 快速响应：收到后立即返回 200，异步处理业务，避免第三方超时重试(通常 5s 超时)；5) 重试机制：第三方通常重试 3-5 次(指数退避)，你需要处理重复请求；6) 事件类型：区分不同事件(event_type 字段)走不同处理逻辑(message/payment/refund)；7) 日志记录：记录原始请求体、签名、处理结果、耗时，便于排查；8) 安全加固：IP 白名单(只允许第三方 IP)、HTTPS 强制、请求体大小限制；9) 常见 Webhook：微信支付回调、企微消息推送、Stripe 支付事件、GitHub Push 事件；10) 处理模式：同步处理(简单但慢)、异步处理(推荐：收到后入队，Worker 处理)。" }
    ]
  },
  {
    title: "后端工程分层",
    intro: "解决代码怎么组织，避免 AI 一次生成一堆能跑但难维护的代码。",
    items: [
      { name: "Controller", desc: "接收请求、做基础校验、调用 Service、返回响应。", projectUse: "knowledge.controller 上传文档、查询列表。", mistake: "不要把复杂业务全写在 Controller。", understanding: "1) 只做三件事：解析参数(req.params/query/body)、调用 Service、返回响应(res.json)；2) 不处理业务逻辑，只做 HTTP 请求/响应转换；3) 基础校验：必填字段检查、类型转换、格式校验(如 email 格式)；4) 异常捕获：try-catch 包裹 Service 调用，捕获业务异常转换为 HTTP 响应；5) 路由组织：一个 Controller 对应一个资源(knowledge.controller 处理 /knowledge-docs 路由)；6) 文件上传：multer 中间件处理 multipart/form-data，Controller 只接收 file 信息；7) 中间件组合：router.get('/docs', auth, validate, controller.list)；8) 依赖注入：Controller 依赖 Service，不直接操作数据库；9) 测试友好：可以单独测试 Controller(模拟 req/res)，不需要启动 HTTP 服务器。" },
      { name: "Service", desc: "处理业务流程和规则。", projectUse: "上传后保存文件、创建记录、推送解析任务。", mistake: "不要让 Service 直接混乱操作各种外部服务，应该抽象 provider。", understanding: "1) 核心职责：业务逻辑编排、状态流转、事务管理、业务校验；2) 方法设计：create/update/delete + 业务动作(uploadDocument/processPayment/sendNotification)；3) 事务管理：@Transactional 装饰器或手动管理，多个写操作原子性；4) 依赖注入：依赖 Repository(数据访问)、Provider(外部服务)、Cache(缓存)；5) 不依赖 HTTP：不引用 req/res，便于单元测试和复用；6) 异常抛出：throw new BizError(40001, '文档不存在')，由全局异常处理转换为 HTTP；7) 业务领域划分：KnowledgeService(知识库)、ChatService(聊天)、PaymentService(支付)；8) 幂等处理：Service 内部检查业务幂等性；9) 日志记录：关键业务操作记录 info 日志，异常记录 error 日志；10) 测试策略：Mock Repository/Provider，测试纯业务逻辑。" },
      { name: "Repository / DAO", desc: "封装数据库读写，让业务层不关心 SQL 细节。", projectUse: "knowledge.repository 查询 docs、chunks、logs。", mistake: "不要把 SQL 到处散落。", understanding: "1) 封装所有数据库操作：CRUD(findById/create/update/delete)、复杂查询(findMany/findOne)、批量操作(bulkCreate/bulkUpdate)；2) ORM 选择：Prisma(类型安全、schema 优先)、TypeORM(装饰器风格)、Drizzle(轻量级)；3) 返回 Model：转换数据库字段名为业务字段名(如 merchant_id → merchantId)；4) 查询构建：条件过滤(where)、排序(orderBy)、分页(skip/take)、关联查询(include)；5) 事务方法：prisma.$transaction([tx.repository.create(), tx.repository.update()])；6) 多租户：全局 filter 自动添加 merchant_id 条件；7) 软删除：where: { deletedAt: null } 默认过滤已删除数据；8) 测试：Mock Repository 返回固定数据，测试 Service 业务逻辑；9) 性能优化：批量操作减少 SQL 次数、避免 N+1 查询、使用 findMany 的 include 选项。" },
      { name: "DTO / Schema", desc: "定义接口输入输出结构，便于校验、文档和类型推导。", projectUse: "CreateDocDto、ChatMessageDto、ToolCallDto。", mistake: "不要让前后端靠猜字段对接。", understanding: "1) Request DTO：定义请求体结构，配合 Zod/Joi 做校验；2) Response DTO：定义响应结构，隐藏内部字段(password、internalId)；3) 类型推导：从 Schema 自动生成 TypeScript 类型(z.infer<typeof schema>)；4) 分组校验：CreateDocDto(必填 title/content)、UpdateDocDto(可选字段)、QueryDocDto(过滤参数)；5) 字段说明：添加 description 用于 Swagger 文档生成；6) 嵌套校验：数组校验(.array().max(100))、对象内部字段校验；7) 自定义校验：z.string().refine() 实现业务规则(如用户名不能重复)；8) 默认值：z.string().default('') 处理可选字段；9) 前后端共享：DTO 定义放在共享包中，前端直接使用类型；10) 文档生成：从 Schema 自动生成 OpenAPI/Swagger 文档。" },
      { name: "Middleware", desc: "在请求进入业务前处理鉴权、日志、跨域、限流、错误。", projectUse: "authMiddleware、rateLimitMiddleware、loggerMiddleware。", mistake: "中间件顺序很重要，日志和 requestId 应尽量靠前。", understanding: "1) 执行顺序：全局中间件 → 路由中间件 → Controller → Service；2) 推荐顺序：请求日志(最早，记录开始时间) → CORS → RequestId 生成 → Body 解析 → 鉴权 → 限流 → Controller → 错误处理(最外层 catch)；3) Next.js 实现：middleware.ts 在 Edge 层运行(只能用 Web API)、Route Handlers 内用 next-connect 组合中间件；4) Express/Koa：app.use() 全局中间件、router.use() 路由中间件；5) 鉴权中间件：解析 JWT/Session，注入 req.user；6) 限流中间件：Redis INCR + TTL，超限返回 429；7) 错误中间件：catch 所有异常，转换为统一错误响应；8) 中间件特点：短小精悍、不阻塞请求、无状态(不依赖上一个中间件的状态)；9) 异步中间件：async (req, res, next) → next()，错误要传递给 next(err)。" },
      { name: "Config 配置层", desc: "环境变量、模型配置、数据库地址、限流阈值统一管理。", projectUse: ".env、config.ts、模型供应商配置。", mistake: "不要把 API Key 写死在代码里。", understanding: "1) 环境变量(.env)：数据库连接(DATABASE_URL)、API Key(OPENAI_API_KEY)、服务地址(API_BASE_URL)；2) 环境分级：.env.development、.env.staging、.env.production、.env.local(不提交)；3) 配置文件(config.ts)：用 zod 校验环境变量，解析为类型安全的对象；4) 配置分层：环境变量 → 默认值 → 业务配置 → 运行时配置；5) 启动校验：服务启动时检查必填变量，缺失则报错退出；6) 敏感信息：.env 加入 .gitignore，用 .env.example 说明格式，密钥用 Vault 或云密钥管理；7) 动态配置：限流阈值、模型参数可通过 Redis/配置中心热更新；8) 配置中心：大规模系统用 Nacos/Apollo/Consul 集中管理配置；9) 类型安全：从环境变量到 config 对象全链路 TypeScript 类型推导；10) 安全原则：API Key 不打印到日志、不暴露给前端、定期轮换。" },
      { name: "Provider / Adapter", desc: "对外部服务做抽象，避免业务绑定某个供应商。", projectUse: "AIProvider、StorageProvider、ChannelAdapter。", mistake: "不要让业务代码直接写死某个模型或平台。", understanding: "1) 接口定义：interface AIProvider { chat(messages): Promise<Response>; embedding(text): Promise<number[]> }；2) 实现类：OpenAIClient implements AIProvider、ClaudeClient implements AIProvider；3) 依赖注入：Service 依赖 AIProvider 接口，运行时注入具体实现；4) 切换供应商：修改配置指向不同实现，业务代码不变；5) 适配器模式：企微/钉钉/飞书的消息格式统一转换为内部消息模型；6) 熔断降级：Provider 内部实现熔断逻辑，失败时切换备用；7) 测试友好：Mock Provider 返回固定结果，测试纯业务逻辑；8) 常见 Provider：AIProvider(模型调用)、StorageProvider(文件存储)、ChannelProvider(消息渠道)、PaymentProvider(支付)；9) 配置驱动：用配置文件指定使用哪个 Provider 实现；10) 版本升级：Provider 内部封装 SDK 版本升级，业务代码无感知。" },
      { name: "Domain Model", desc: "围绕业务概念建模，而不是围绕页面建模。", projectUse: "Merchant、KnowledgeDoc、ChatSession、ToolCall。", mistake: "不要让页面结构决定后端数据模型。", understanding: "1) 业务实体：Merchant(商家)、KnowledgeDoc(知识库文档)、ChatSession(会话)、ToolCall(工具调用)；2) 状态机：KnowledgeDoc 有 status 字段，定义状态流转 uploaded→processing→ready/failed，每个状态对应可执行操作；3) 值对象：不单独建表，嵌入主实体(如 settings JSONB、metadata JSON)；4) 关联关系：一对多(Merchant→KnowledgeDoc)、多对多(User↔Role)、一对一(User→Profile)；5) 字段设计：id(主键)、created_at(创建时间)、updated_at(更新时间)、deleted_at(软删除)、version(乐观锁)；6) 多租户字段：每张表都有 merchant_id，确保数据隔离；7) DDD 思考：聚合根(Merchant)、实体(KnowledgeDoc)、值对象(Money/Address)、领域服务；8) 避免贫血模型：业务逻辑放在 Domain Model 内部，而非全部堆在 Service；9) 模型命名：单数形式(Merchant)、字段用下划线(merchant_id)、状态用枚举；10) 反模式：不要为每个页面创建独立模型、不要用 JSON 存所有数据、不要忽略关联关系。" }
    ]
  },
  {
    title: "数据与存储",
    intro: "解决数据放哪里、怎么查、怎么保证一致性和性能。",
    items: [
      { name: "关系型数据库", desc: "保存核心结构化业务数据，支持事务、索引、关联。", projectUse: "用户、角色、商家、知识库、聊天、日志。", mistake: "核心业务数据不要只放 Redis。", understanding: "1) 为什么选关系型：ACID 事务支持、数据一致性保证、复杂查询(JOIN/子查询/窗口函数)；2) PostgreSQL 优势：JSONB 字段、全文搜索(tsvector)、pgvector 向量扩展、数组类型、CTE 递归查询；3) MySQL vs PostgreSQL：MySQL 简单快速、PG 功能更全，新项目推荐 PG；4) 数据分类：核心业务数据(用户/订单/知识库)放关系库、缓存数据放 Redis、文件放对象存储、向量放 pgvector；5) 连接池：pgBouncer/Prisma 默认连接池，复用连接，配置最大连接数(如 20)；6) 读写分离：主库写、从库读，降低主库压力；7) 慢查询监控：开启 slow_query_log，定期分析优化；8) 数据库选型：单机够用就不用分布式，复杂度要匹配业务规模。" },
      { name: "表设计", desc: "字段、主键、外键、状态、时间、软删除、多租户字段。", projectUse: "knowledge_docs、doc_chunks、chat_messages。", mistake: "状态字段要提前设计，不能只靠文本描述。", understanding: "1) 主键：UUID(分布式友好)或自增 ID(简单)；2) 必备字段：id、created_at、updated_at、deleted_at(软删除)；3) 多租户：merchant_id 字段，所有查询都要带；4) 状态字段：枚举类型，定义可选值(如 status: 'draft'|'active'|'archived')；5) 外键：关联其他表，保持引用完整性；6) JSON 字段：存灵活配置，如 settings JSONB；7) 避免：过多 NULL 字段、过长 VARCHAR、冗余字段。" },
      { name: "索引设计", desc: "围绕 where、join、order by 设计，提升查询速度。", projectUse: "merchant_id + status + created_at。", mistake: "不是字段越多索引越好，索引也有写入成本。", understanding: "1) 单字段索引：频繁出现在 WHERE 的字段(如 merchant_id)；2) 复合索引：多条件查询，顺序重要(区分度高的在前，如 merchant_id + status + created_at)；3) 最左前缀：复合索引 ABC，查询条件必须包含 A，才能用到索引；4) 覆盖索引：SELECT 的字段都在索引中，避免回表查询；5) 部分索引：CREATE INDEX idx ON docs(status) WHERE status='active'，只索引有效数据；6) 索引失效：函数操作(WHERE DATE(created_at)='2024-01-01')、隐式类型转换(WHERE id='123')、LIKE '%xxx'、OR 条件、NOT IN；7) 写入成本：每次 INSERT/UPDATE/DELETE 都要更新索引，索引越多写入越慢；8) 索引数量：单表不超过 5-6 个索引；9) 监控工具：EXPLAIN ANALYZE 分析查询计划、pg_stat_user_indexes 监控索引使用率；10) 删除无用索引：长期未使用的索引要删除，减少写入开销。" },
      { name: "事务", desc: "多个写操作要么全成功要么全失败。", projectUse: "创建会话和首条消息、扣费和记录账单。", mistake: "涉及多表一致性时不要只靠顺序执行。", understanding: "1) ACID：原子性(全部成功或全部回滚)、一致性(数据符合约束)、隔离性(并发事务互不干扰)、持久性(提交后数据不丢失)；2) 隔离级别：读未提交(脏读)、读已提交(Oracle 默认)、可重复读(MySQL 默认)、串行化(最严格但最慢)；3) 并发问题：脏读(读到未提交数据)、幻读(新增行被读到)、不可重复读(同一查询结果不同)；4) 事务范围：尽量小，只包含必要的写操作，避免长时间锁表；5) Prisma 事务：prisma.$transaction([tx.user.create(), tx.order.create()])；6) 超时控制：设置事务超时(如 30s)，防止锁表；7) 死锁预防：按固定顺序访问资源、避免事务嵌套、设置超时检测；8) 分布式事务：跨服务时用 Saga(补偿事务)或 TCC(Try-Confirm-Cancel)；9) 本地消息表：事务内写入消息表，异步发送，保证最终一致性。" },
      { name: "ORM / 迁移", desc: "用代码管理表结构和查询，记录数据库变更。", projectUse: "Prisma / TypeORM migrations。", mistake: "生产环境不要手动随便改表。", understanding: "1) ORM 优势：类型安全、自动 SQL、关联查询、迁移管理；2) Prisma：schema.prisma 定义模型，prisma migrate 管理变更；3) 迁移文件：每次表结构变更生成 SQL 文件，可追溯；4) 种子数据：seeds.ts 初始化测试数据；5) 生产流程：开发→生成迁移→测试→部署→执行迁移；6) 注意：复杂查询用 raw SQL，不要完全依赖 ORM；7) 不要在生产环境手动 ALTER TABLE。" },
      { name: "对象存储", desc: "保存大文件，不把 PDF、图片、音频直接塞数据库。", projectUse: "知识库原文件、聊天附件、语音文件。", mistake: "数据库只保存文件 URL、hash、大小、状态等元数据。", understanding: "1) 为什么用对象存储：便宜、高可用、CDN 加速、无限扩展；2) 存储策略：按日期/类型分目录(2024/01/xxx.pdf)；3) 文件命名：UUID + 原始后缀，避免重名；4) 元数据：数据库保存 url、size、mimeType、hash、uploadTime；5) 访问控制：私有文件用签名 URL，过期后失效；6) 清理策略：删除记录时同步删除文件，定期清理孤儿文件。" },
      { name: "全文搜索", desc: "关键词搜索和日志搜索，和向量检索互补。", projectUse: "搜索聊天记录、搜索知识库标题。", mistake: "向量检索不等于完全替代关键词搜索。", understanding: "1) 适用场景：精确匹配(订单号)、标题搜索、日志搜索；2) PostgreSQL 全文搜索：tsvector + tsquery，支持中文分词；3) Elasticsearch：分布式搜索，适合大规模日志；4) 搜索语法：关键词、短语、通配符、布尔组合；5) 分词器：中文需要 jieba 或 Elasticsearch IK 插件；6) 与向量搜索互补：全文搜索找精确匹配，向量搜索找语义相似。" },
      { name: "向量存储", desc: "保存 Embedding，用于语义检索。", projectUse: "RAG 检索 doc_chunks。", mistake: "向量库不是普通业务数据库。", understanding: "1) 向量是什么：高维浮点数组，表示文本语义；2) 存储方式：pgvector(集成方便)、Pinecone(托管服务)、Milvus(自建)；3) 相似度计算：余弦相似度、欧氏距离、内积；4) 索引类型：HNSW(近似最近邻)、IVF(倒排索引)；5) 混合查询：向量 + 元数据过滤(merchant_id)；6) 注意：向量库不适合存业务数据，只存 embedding + id + metadata。" },
      { name: "备份与恢复", desc: "数据库和文件都要有备份策略。", projectUse: "误删知识库、服务器故障恢复。", mistake: "没有备份的项目不能算可交付。", understanding: "1) 备份类型：全量备份(每天)、增量备份(每小时)；2) PostgreSQL：pg_dump 全量、WAL 归档增量；3) 文件备份：对象存储本身有冗余，重要文件额外备份；4) 恢复演练：定期测试备份能否正常恢复；5) RPO：最多丢失多少数据(如 1 小时)；6) RTO：恢复需要多长时间(如 4 小时)；7) 自动化：用 cron 或云服务定时备份。" },
      { name: "数据保留策略", desc: "哪些数据保留多久，哪些需要脱敏或删除。", projectUse: "聊天日志、客户手机号、AI 调用日志。", mistake: "日志不是越多越好，敏感信息要控制。", understanding: "1) 分类保留：核心业务数据永久、日志保留 90 天、临时数据 7 天；2) 合规要求：GDPR 要求用户可请求删除数据；3) 脱敏规则：手机号 138****1234、邮箱 a***@example.com；4) 自动清理：定时任务删除过期数据；5) 软删除 vs 硬删除：软删除可恢复，硬删除释放空间；6) 审计日志：删除操作本身要记录；7) 备份数据也要按策略清理。" }
    ]
  },
  {
    title: "缓存、队列与性能",
    intro: "解决系统速度、慢任务、限流和成本控制。",
    items: [
      { name: "Redis 缓存", desc: "缓存热点数据，减少数据库压力。", projectUse: "商家配置、权限、热门问题。", mistake: "缓存要考虑过期和一致性。", understanding: "1) 数据类型：String(简单缓存 SET key value)、Hash(对象 HSET user:1 name '张三')、List(队列 LPUSH/BRPOP)、Set(去重/交集 SADD/SMEMBERS)、ZSet(排行榜 ZADD/ZRANGE)；2) 适用场景：读多写少(命中率>80%)、数据量大、查询复杂；3) 不适用：数据经常变更(写多读少)、需要事务、需要复杂查询(JOIN)；4) 连接池：ioredis/redis 库配置 maxConnections、retryDelays；5) 序列化：JSON.stringify/parse(便于调试)、MessagePack(更小更快)；6) 缓存粒度：整条数据缓存(简单)、字段级缓存(灵活)、查询结果缓存(通用)；7) 监控：INFO 命令查看内存/命中率、SLOWLOG 查看慢命令；8) 内存淘汰策略：noeviction(不淘汰)、allkeys-lru(全部 LRU)、volatile-lru(仅过期 key LRU)；9) Pipeline：批量操作减少网络往返。" },
      { name: "TTL 过期", desc: "缓存必须有过期或刷新策略。", projectUse: "商家配置缓存 5 分钟。", mistake: "缓存永不过期容易读到旧数据。", understanding: "1) 固定 TTL：EXPIRE key 300(5分钟后过期)，适合稳定数据；2) 滑动 TTL：每次访问刷新过期时间(访问后重新设置 TTL)，适合会话数据；3) 过期策略：惰性删除(访问时检查是否过期，省 CPU)、定期删除(随机抽样检查，平衡 CPU)；4) TTL 随机化：base_ttl + random(0, 300)，避免大量 key 同时过期(雪崩)；5) 业务驱动 TTL：商家配置 5 分钟、用户会话 30 分钟、AI 模型列表 1 小时、热门内容 10 分钟；6) 永不过期+异步更新：热点数据不过期，后台定时刷新，适合读极多场景；7) 监控：设置过期 key 数量告警，TTL 过短导致频繁穿透；8) TTL 单位：秒级精度够用，毫秒级用 EXPIRETIME 查看。" },
      { name: "缓存一致性", desc: "数据库更新后如何处理缓存。", projectUse: "更新知识库后删除相关缓存。", mistake: "先更新数据库，再删除缓存是常见策略。", understanding: "1) Cache Aside(旁路缓存)：读时缓存、写时删除，最常用策略；2) 读流程：缓存命中→直接返回；缓存未命中→查库→写入缓存→返回；3) 写流程：更新数据库→删除缓存(而非更新缓存)；4) 为什么删除而非更新：避免并发写导致缓存与 DB 不一致，下次读时自然重建；5) 延迟双删：更新 DB→删缓存→延迟 N 毫秒(如 500ms)→再删一次，解决主从延迟问题；6) 最终一致性：容忍短暂不一致(秒级)，通过 TTL 兜底；7) 强一致性：用消息队列通知所有节点清除缓存，或用 Canal 监听 binlog；8) 并发问题：线程 A 写 DB 删缓存，线程 B 读缓存miss→读旧 DB→写入旧缓存；9) 解决方案：延迟双删、binlog 监听、Redis 订阅；10) 实际选择：大多数场景用 Cache Aside + TTL 就够了，强一致用 Canal 监听 binlog。" },
      { name: "缓存穿透 / 击穿 / 雪崩", desc: "缓存系统常见三类风险。", projectUse: "不存在的文档 ID、热点商家配置、大量 key 同时过期。", mistake: "不要只知道名词，要知道对应场景。", understanding: "1) 缓存穿透：查询不存在的数据(如恶意请求不存在的 ID)，缓存永远 miss，每次都查库；解决：缓存空值(SET key null EX 60)、布隆过滤器(Bloom Filter 快速判断 key 是否存在)、参数校验(拦截非法 ID)；2) 缓存击穿：热点 key 过期瞬间，大量请求同时打到 DB；解决：互斥锁(SETNX 加锁，只有一个请求查库)、永不过期 + 异步更新(热点数据不过期，后台定时刷新)；3) 缓存雪崩：大量 key 同时过期 或 Redis 宕机，请求全部打到 DB；解决：TTL 加随机值(避免同时过期)、多级缓存(L1 本地缓存 + L2 Redis)、熔断降级(DB 压力大时返回默认值)；4) 监控指标：缓存命中率(低于 80% 要排查)、DB QPS 突增、Redis 连接数；5) 上线前评估：识别热点数据、预估并发量、设置合理 TTL。" },
      { name: "限流", desc: "限制请求频率，保护系统并控制 AI 成本。", projectUse: "每用户每分钟最多问 AI 20 次。", mistake: "AI 接口一定要做限流，否则成本容易失控。", understanding: "1) 限流维度：按 IP(防爬虫)、按用户(防滥用)、按接口(保护慢接口)、全局(保护系统)；2) 固定窗口：时间窗口内计数，简单但有边界突发问题(窗口边界可能 2 倍流量)；3) 滑动窗口：时间窗口滑动，更精确，Redis ZSET 实现；4) 令牌桶：固定速率放入令牌，请求消耗令牌，允许突发(桶容量)；5) 漏桶：固定速率处理请求，平滑流量，不允许突发；6) Redis 实现：INCR + EXPIRE(固定窗口)、ZSET + 时间戳(滑动窗口)；7) 返回设计：429 Too Many Requests + Retry-After: 60 头 + 错误码 42900；8) 分级限流：普通接口 100 次/分钟、AI 接口 20 次/分钟、敏感接口 5 次/分钟；9) 白名单：内部测试用户、健康检查接口不限流；10) 监控：记录限流触发次数、用户分布，动态调整阈值。" },
      { name: "分布式锁", desc: "防止多个进程同时处理同一任务。", projectUse: "同一文档不能同时解析两次。", mistake: "锁必须设置过期，避免死锁。", understanding: "1) 为什么需要：多 Worker/多实例部署时，防止同一任务被重复处理；2) Redis 实现：SET lock:doc:123 {uuid} NX EX 30(原子设置+过期)；3) 锁粒度：按业务 ID 加锁(如 lock:doc:{id})，不同文档可并行；4) 超时设置：比任务最长执行时间略长(如任务最长 20s，锁设 30s)；5) 锁续期：长任务用看门狗机制(Watchdog)，每 10s 续期一次；6) 释放锁：Lua 脚本原子操作，只有持有者才能释放(对比 UUID)；7) Redlock：多节点 Redis(如 5 个)加锁，多数(3个)成功才算获取锁；8) 可重入锁：同一线程可多次加锁(用计数器)；9) 公平锁：按请求顺序获取锁(用 Redis List)；10) 对比：Redis 锁(性能高)、ZooKeeper(强一致)、etcd(K8s 生态)。" },
      { name: "消息队列", desc: "把慢任务异步化，削峰填谷。", projectUse: "文档解析、Embedding、通知发送。", mistake: "不要在用户请求里直接做所有慢任务。", understanding: "1) 三大作用：解耦(生产者/消费者独立)、异步(不阻塞请求)、削峰(突发流量平滑处理)；2) 选型对比：Redis List(最简单、可靠性一般)、RabbitMQ(功能全、可靠、适合中小规模)、Kafka(高吞吐、适合日志/大数据)；3) 消息结构：{ type: 'parse_doc', payload: { docId }, idempotentKey: 'xxx', retryCount: 0, maxRetry: 3 }；4) 消费模式：推模式(RabbitMQ，Broker 主动推)、拉模式(Kafka，消费者拉取)；5) 消息持久化：RabbitMQ 持久化队列+消息、Kafka 多副本；6) 消费确认：手动 ACK(处理成功后确认)、NACK/Reject(处理失败，重新入队或进死信)；7) 死信队列(DLQ)：多次失败的消息进入死信，等待人工处理；8) 幂等消费：用消息 ID 做幂等键，防止重复处理；9) 监控：队列长度、消费延迟、失败率、吞吐量；10) 顺序性：Kafka 分区内有序、RabbitMQ 单队列有序。" },
      { name: "Worker", desc: "后台任务执行者，处理队列任务。", projectUse: "parse-worker、embedding-worker。", mistake: "Worker 需要日志、重试和幂等。", understanding: "1) 单一职责：一个 Worker 只处理一种任务(parse-doc、embedding、send-notification)，便于独立扩缩容；2) 并发控制：配置同时处理的任务数(bull 的 concurrency)，避免 CPU/内存耗尽；3) 失败处理：try-catch 捕获异常、记录错误日志、NACK 重新入队或进入死信；4) 幂等：消费前检查幂等键，相同任务不重复处理；5) 优雅停机：收到 SIGTERM 后停止消费新任务，等待当前任务完成(最多 30s)，超时强制退出；6) 监控指标：任务处理数、成功率、平均耗时、队列积压数；7) 日志：每次任务记录 taskId、开始时间、结束时间、结果、耗时；8) 资源管理：PDF 解析 Worker 要限制并发(内存/CPU 密集)、AI 调用 Worker 要限流；9) 健康检查：定时任务(如每 5 分钟)检查 Worker 是否存活；10) 水平扩展：多实例部署时，每个实例独立消费，通过 Redis 锁防重复。" },
      { name: "重试与死信", desc: "失败任务重试，多次失败进入死信等待人工处理。", projectUse: "PDF 解析失败、AI 接口超时。", mistake: "失败任务不能只打印日志。", understanding: "1) 立即重试：网络抖动(1次)，直接 NACK 重新入队；2) 延迟重试：服务暂时不可用，延迟 5s/30s/5min 后重试；3) 指数退避：1s→2s→4s→8s→16s，避免雪崩；4) 重试次数：配置 maxRetry(如 3-5 次)，超过则放弃；5) 可重试错误：网络超时、5xx 服务器错误、429 限流；6) 不可重试错误：400 参数错误(重试也没用)、401/403 权限错误、404 资源不存在；7) 死信队列(DLQ)：多次失败的任务进入死信，等待人工排查修复；8) 死信处理：人工修复后重新入队、或直接丢弃并告警通知；9) 监控告警：死信数量 > 0 立即告警、定时统计死信分布；10) 补偿机制：死信任务记录详细上下文(参数+错误+重试历史)，便于排查。" },
      { name: "定时任务", desc: "按时间执行统计、清理、同步。", projectUse: "每日客服报表、清理过期日志。", mistake: "定时任务也要有日志和失败告警。", understanding: "1) cron 表达式：0 2 * * * (每天凌晨2点)、*/5 * * * * (每5分钟)、0 0 * * 1 (每周一)；2) Node.js 实现：node-cron(单机)、Bull 定时任务(分布式)；3) 分布式加锁：多实例部署时，用 Redis SETNX 防止重复执行；4) 常见任务：数据统计(日报/周报)、缓存刷新、过期数据清理、数据同步；5) 执行记录：记录 taskId、开始时间、结束时间、结果、耗时；6) 超时控制：任务卡死要能自动终止(如 5 分钟超时)；7) 告警通知：执行失败或超时发企微/钉钉通知；8) 避免：任务间隔 < 执行时间(导致任务堆积)、大量任务同时执行(资源争抢)；9) 依赖检查：任务开始前检查依赖服务是否可用；10) 补偿任务：失败的任务支持手动重跑。" }
    ]
  },
  {
    title: "安全、可观测性与交付",
    intro: "决定项目能否真实上线、排查和维护。",
    items: [
      { name: "JWT / Session", desc: "识别用户身份。", projectUse: "管理后台登录、客服工作台登录。", mistake: "登录态和权限不是一回事。", understanding: "1) JWT 结构：Header(算法 HS256/RS256) + Payload(用户ID/角色/过期时间) + Signature(签名)；2) 签发流程：用户登录→验证密码→生成 JWT(含 userId/role/expire)→返回给客户端；3) 验证流程：客户端携带 Authorization: Bearer token→服务端验证签名+过期时间→解析出 userId；4) 存储方案：localStorage(易 XSS，不适合敏感场景)、httpOnly Cookie(防 XSS，CSRF 风险)、内存(最安全，刷新丢失)；5) Token 刷新：access_token 短期(15分钟) + refresh_token 长期(7天)，access_token 过期用 refresh_token 换新；6) Token 黑名单：用户登出时将 token 加入黑名单(Redis SET)，验证时检查；7) Session 对比：服务端存储会话数据，适合单体应用，JWT 无状态适合分布式；8) 安全原则：不存敏感信息(手机号/密码)、使用 HTTPS、设置合理过期时间、签名密钥保密。" },
      { name: "RBAC / ABAC", desc: "角色权限和属性权限。", projectUse: "管理员、客服、运营、多商家隔离。", mistake: "按钮隐藏不等于接口安全。", understanding: "1) RBAC 模型：用户→角色→权限(如 admin、support_agent、viewer)；2) 权限粒度：resource:action(如 knowledge:read、knowledge:delete、chat:send)；3) 权限表设计：users、roles、permissions、user_roles、role_permissions 五张表；4) ABAC 模型：基于属性(如 owner_id == user_id、merchant_id == current_merchant)；5) 实现：中间件校验 permissions.includes(knowledge:delete)，不依赖前端隐藏按钮；6) 多租户权限：merchant_id + role 组合判断(只能操作本商家数据)；7) 超级管理员：绕过所有权限检查，但操作必须审计；8) 权限缓存：用户登录时加载权限到 Redis(SET user:1:permissions)，避免每次查库；9) 权限变更：修改权限后清除用户缓存；10) 安全测试：用低权限用户直接调用高权限接口，应返回 403。" },
      { name: "多租户隔离", desc: "同一套系统服务多个商家，数据必须隔离。", projectUse: "所有查询都带 merchant_id。", mistake: "最容易出严重越权漏洞。", understanding: "1) 三种隔离方式：共享数据库+merchant_id(最常用，成本低)、独立 schema(中等)、独立数据库(隔离强但成本高)；2) 数据隔离：所有表都有 merchant_id 字段，查询必须带 WHERE merchant_id = ?；3) ORM 拦截：Prisma middleware 或 TypeORM interceptor 自动添加 merchant_id；4) 缓存隔离：缓存 key 必须包含 merchant_id(如 config:{merchantId}:{key})；5) 文件隔离：对象存储按 merchant_id 分目录(merchant_123/docs/xxx.pdf)；6) 跨租户测试：用商家 A 的 token 请求商家 B 的数据，应返回 403；7) 管理后台：超级管理员可查看所有商家数据，但普通用户只能看自己的；8) SQL 注入防护：ORM 参数化查询，避免拼接 SQL；9) 日志隔离：日志中记录 merchant_id，便于按商家排查；10) 威胁：最容易出严重越权漏洞，必须每次代码审查都检查。" },
      { name: "审计日志", desc: "记录谁在什么时候做了什么。", projectUse: "删除文档、修改知识库、人工接管。", mistake: "敏感操作必须能追溯。", understanding: "1) 五要素：who(user_id)、what(操作类型)、when(时间戳)、where(IP/User-Agent)、result(成功/失败)；2) 必记操作：增删改、权限变更、登录登出、数据导出、批量操作；3) 敏感操作额外记录：操作前后数据快照(before/after JSON)，便于审计；4) 存储：audit_logs 表，append-only 不可修改，考虑独立数据库；5) 表结构：id、user_id、merchant_id、action、resource_type、resource_id、before_data、after_data、ip、user_agent、created_at；6) 查询：按用户、时间范围、操作类型、资源类型筛选；7) 保留策略：至少 180 天，金融/医疗可能需要更长；8) 异常告警：批量删除、异地登录、高频操作实时通知；9) 合规要求：GDPR、等保、PCI DSS 都要求审计日志。" },
      { name: "结构化日志", desc: "日志以固定字段保存，便于检索。", projectUse: "requestId、userId、merchantId、latency。", mistake: "console.log 不是生产日志系统。", understanding: "1) JSON 结构化：{ timestamp: '2024-01-01T00:00:00Z', level: 'info', message: 'user login', requestId: 'xxx', userId: '123' }；2) 日志级别：debug(开发调试)、info(正常流程)、warn(潜在问题)、error(错误)、fatal(致命错误)；3) 必备字段：timestamp、level、message、requestId(链路追踪)、userId、merchantId、latency(ms)；4) 日志库：pino(高性能、JSON 原生)、winston(功能全、transport 丰富)；5) 日志收集：stdout → Fluentd/Filebeat → Elasticsearch → Kibana(ELK)；6) 脱敏规则：手机号 138****1234、邮箱 a***@example.com、Token 抽取前几位；7) 禁止：console.log(无级别/无结构)、拼接字符串(性能差)、打印敏感信息(密码/Token)；8) 请求日志：记录 method、url、status、latency、requestId；9) 错误日志：记录 error.stack、请求上下文、重试信息。" },
      { name: "Metrics 指标", desc: "可量化系统状态。", projectUse: "QPS、错误率、AI 耗时、队列积压。", mistake: "没有指标就不知道系统健康状况。", understanding: "1) 四大黄金指标(SRE)：延迟(请求耗时)、流量(QPS/TPS)、错误率(错误/总请求)、饱和度(CPU/内存/连接数)；2) 业务指标：QPS、并发用户数、AI 调用量、知识库文档数、转化率；3) 系统指标：CPU 使用率、内存使用率、磁盘 IO、网络带宽、GC 次数；4) 自定义指标：AI 调用耗时、检索命中率、队列积压长度、缓存命中率；5) 工具链：Prometheus(采集+存储) + Grafana(可视化) + AlertManager(告警)；6) 告警规则：错误率 > 1%、P99 延迟 > 2s、队列积压 > 1000、CPU > 80%；7) 仪表盘：按服务、按商家、按时间维度展示，便于定位问题；8) 指标类型：Counter(累计值)、Gauge(瞬时值)、Histogram(分布)、Summary(分位数)；9) 采样率：生产环境全量采集，开发环境按需采样。" },
      { name: "Tracing 链路追踪", desc: "一次请求跨多个模块时能串起来。", projectUse: "从前端 requestId 追到 AI 调用。", mistake: "链路复杂后只靠单条日志不够。", understanding: "1) 为什么需要：一次请求经过前端→网关→Controller→Service→Repository→DB→外部 API，跨多个服务；2) 核心概念：Trace(完整调用链)、Span(单次操作，如一次 DB 查询)、TraceID(全局唯一标识)、SpanID(单个 Span 标识)、ParentSpanID(父子关系)；3) 实现：每个请求生成 requestId(TraceID)，贯穿整个调用链，写入 Response Header；4) 工具：OpenTelemetry(标准 SDK，厂商无关)、Jaeger/Zipkin(可视化 UI)；5) Span 信息：服务名、操作名、开始时间、耗时、状态(OK/ERROR)、日志关联；6) 采样策略：全量(开发环境)、按比例(生产 1%)、自适应(错误请求全采)；7) 排查：一个 requestId 串联所有日志和 Span，快速定位瓶颈；8) 上下文传播：HTTP Header(Traceparent)、gRPC Metadata；9) 延迟分析：瀑布图展示每个 Span 耗时，找出慢查询。" },
      { name: "CI/CD", desc: "自动构建、测试、部署。", projectUse: "提交后跑测试并部署测试环境。", mistake: "手动部署容易漏步骤。", understanding: "1) CI(持续集成)：提交代码→自动运行 lint+测试+构建，快速反馈；2) CD(持续部署)：测试通过→自动部署到测试/预发/生产环境；3) 流程：lint(代码规范) → 单元测试(函数级) → 集成测试(接口级) → 构建 Docker 镜像 → 推送镜像仓库 → 部署；4) 工具：GitHub Actions(YAML 配置)、GitLab CI(.gitlab-ci.yml)、Jenkins(插件丰富)；5) 环境分层：开发(本地) → 测试(自动部署) → 预发(手动审批) → 生产(手动审批)；6) 回滚策略：发现问题能快速回退到上一版本(镜像 Tag)；7) 通知：构建失败/部署成功发企微/钉钉通知；8) 并行执行：lint+测试并行、多个测试文件并行；9) 缓存优化：node_modules 缓存、Docker 层缓存。" },
      { name: "Docker / Nginx / PM2", desc: "部署与进程管理。", projectUse: "前端静态资源、后端服务、反向代理。", mistake: "本地能跑不等于线上能跑。", understanding: "1) Docker 核心：打包应用+依赖+环境，镜像(Image)运行容器(Container)；2) Dockerfile：多阶段构建减小镜像(FROM node AS builder → FROM node:slim)；3) docker-compose：定义多服务编排(app+postgres+redis)，一键启动；4) Nginx 反向代理：proxy_pass 转发请求、负载均衡(upstream)、静态资源服务(root)；5) Nginx HTTPS：SSL 证书配置、HTTP 自动跳转 HTTPS、HSTS 头；6) PM2 进程管理：自动重启(cluster 模式)、日志管理、CPU 监控；7) 常见坑：端口映射(-p 3000:3000)、文件路径(容器内路径)、环境变量(.env 文件挂载)、网络配置(服务间通信)；8) 健康检查：Docker HEALTHCHECK、Nginx upstream max_fails；9) 日志管理：容器日志 docker logs、Nginx access.log/error.log、PM2 logs。" },
      { name: "API 文档", desc: "让前端、后端、AI 工具都知道接口怎么用。", projectUse: "Swagger / OpenAPI、接口示例。", mistake: "接口没文档，AI 编程工具也容易瞎改。", understanding: "1) OpenAPI 规范：JSON/YAML 格式定义接口结构、参数类型、响应格式、错误码；2) Swagger UI：自动生成可交互的文档页面，支持在线测试；3) 文档内容：接口描述、请求参数(query/body/params)、请求示例、响应示例、错误码说明；4) 生成方式：代码注解(Swagger Decorator)自动生成、独立配置文件维护；5) 版本管理：API 版本与文档版本同步，多版本并存；6) 在线测试：Swagger UI 直接测试接口，填参数→发送→看响应；7) AI 友好：AI 编程工具(Copilot/Cursor)读取 OpenAPI 文档理解接口，生成正确调用代码；8) Postman 集成：从 OpenAPI 导入生成 Postman Collection；9) 文档维护：代码变更时同步更新文档，否则文档会过时；10) 安全：生产环境隐藏 Swagger UI，只在测试环境暴露。" }
    ]
  }
];

export const frontendGroups: KnowledgeGroup[] = [
  {
    title: "HTML & 语义化",
    intro: "构建可访问、SEO 友好的页面结构。",
    items: [
      { name: "语义化标签", desc: "用正确的标签表达正确的内容含义。", projectUse: "header、nav、main、article、section、footer。", mistake: "不要所有内容都用 div 堆。", understanding: "1) 为什么用语义化：屏幕阅读器可识别、SEO 更友好、代码可读性高；2) 常用标签：header(页头)、nav(导航)、main(主内容)、article(独立内容)、section(分区)、aside(侧边栏)、footer(页脚)；3) 内联语义：strong(重要)、em(强调)、mark(高亮)、time(时间)、code(代码)；4) ARIA 属性：role、aria-label、aria-hidden 辅助无障碍；5) 嵌套规则：标题层级 h1→h6、列表嵌套 ul/ol/li、表格结构 thead/tbody/tfoot；6) SEO 优化：h1 唯一、meta description、alt 属性、语义化结构提升爬虫理解。", difficulty: "无障碍适配需要额外学习 ARIA 规范，老项目重构语义化标签工作量大" },
      { name: "表单与验证", desc: "构建用户友好的表单体验。", projectUse: "登录表单、知识库上传表单、搜索表单。", mistake: "不要只依赖前端验证。", understanding: "1) 表单元素：input(text/email/password/number/file)、select、textarea、button；2) 原生验证：required、pattern、min/max、minlength/maxlength；3) 自定义验证：setCustomValidity、reportValidity；4) 实时反馈：input 事件校验、blur 事件校验、提交时校验；5) 无障碍：label 关联 input、fieldset/legend 分组、aria-describedby 错误提示；6) 文件上传：accept 限制类型、multiple 多选、FormData 上传。", difficulty: "复杂表单(多步骤、联动、动态字段)状态管理复杂，文件上传进度和断点续传实现难" },
      { name: "多媒体", desc: "处理图片、视频、音频的最佳实践。", projectUse: "产品图片、教学视频、语音消息。", mistake: "图片不做优化会严重影响性能。", understanding: "1) 图片格式：WebP(推荐)、AVIF(更小)、JPEG(照片)、PNG(透明)、SVG(矢量)；2) 响应式图片：srcset、sizes、picture 元素；3) 懒加载：loading='lazy'、Intersection Observer；4) 视频：video 标签、poster 封面、preload 策略；5) 音频：audio 标签、背景音乐自动播放限制；6) 性能：图片压缩、CDN 加载、占位符(placeholder)。", difficulty: "图片格式兼容性处理、视频流式播放、大文件上传切片实现复杂" },
      { name: "Meta 信息", desc: "页面元数据配置。", projectUse: "SEO 优化、社交分享、PWA。", mistake: "忘记配置 meta 会影响分享和搜索。", understanding: "1) 基础 meta：charset、viewport、description、keywords；2) Open Graph：og:title、og:description、og:image、og:url；3) Twitter Cards：twitter:card、twitter:title、twitter:image；4) PWA：manifest.json、theme-color、apple-touch-icon；5) 安全：Content-Security-Policy、X-Frame-Options；6) Next.js：head.tsx 统一管理、metadata 对象导出。", difficulty: "动态页面 meta 需要服务端渲染配合，PWA 缓存策略配置复杂" }
    ]
  },
  {
    title: "CSS & 样式",
    intro: "构建美观、响应式、高性能的界面。",
    items: [
      { name: "盒模型", desc: "理解 content、padding、border、margin。", projectUse: "所有元素布局的基础。", mistake: "默认 content-box 会导致宽高计算问题。", understanding: "1) 两种模式：content-box(默认，width 只含内容)、border-box(width 含 padding 和 border)；2) 全局设置：box-sizing: border-box；3) 外边距合并：垂直方向相邻 margin 会合并，取较大值；4) BFC：块级格式化上下文，解决 margin 合并和浮动问题；5) overflow：hidden 触发 BFC；6) 调试：浏览器 DevTools 盒模型可视化。", difficulty: "嵌套布局中宽高计算容易出错，需要熟练使用 DevTools 盒模型调试" },
      { name: "Flexbox", desc: "一维布局的最佳方案。", projectUse: "导航栏、按钮组、卡片对齐。", mistake: "不要用 Flexbox 做复杂二维布局。", understanding: "1) 容器属性：display: flex、flex-direction、justify-content、align-items；2) 项目属性：flex-grow、flex-shrink、flex-basis、flex 简写；3) 对齐：align-self 单独对齐、gap 间距；4) 换行：flex-wrap、flex-flow 简写；5) 顺序：order 属性；6) 常见模式：居中、等分布局、圣杯布局、粘性页脚。", difficulty: "flex-grow/shrink/basis 组合使用需要经验，圣杯布局细节多" },
      { name: "Grid", desc: "二维布局的强大工具。", projectUse: "页面整体布局、仪表盘网格、图片画廊。", mistake: "Grid 复杂度高，简单布局用 Flexbox。", understanding: "1) 容器属性：display: grid、grid-template-columns/rows、gap；2) 项目属性：grid-column/row、grid-area；3) 分区命名：grid-template-areas；4) 自动填充：repeat(auto-fill, minmax(200px, 1fr))；5) 对齐：place-items、place-content；6) 响应式：配合媒体查询调整列数。", difficulty: "Grid 语法较多，auto-fill/auto-fit 区别容易混淆，嵌套 Grid 调试困难" },
      { name: "响应式设计", desc: "适配不同屏幕尺寸。", projectUse: "桌面、平板、手机自适应。", mistake: "不要只考虑桌面端。", understanding: "1) 移动优先：先写移动端样式，逐步增强；2) 媒体查询：@media (min-width: 768px)；3) 断点设计：手机(<640px)、平板(640-1024px)、桌面(>1024px)；4) 相对单位：rem、em、vw/vh、%；5) 图片响应式：max-width: 100%、srcset；6) 测试：Chrome DevTools 设备模拟、真机测试。", difficulty: "多断点样式覆盖容易混乱，图片/字体在不同设备适配需要细致调整" },
      { name: "动画与过渡", desc: "让界面更生动。", projectUse: "按钮悬停、页面切换、加载动画。", mistake: "动画过多会影响性能和用户体验。", understanding: "1) transition：过渡动画(hover、focus 状态变化)；2) animation：关键帧动画(@keyframes)；3) transform：translate 位移、scale 缩放、rotate 旋转；4) 性能：只动画 transform 和 opacity(触发 GPU 加速)；5) will-change：提前告知浏览器将要变化的属性；6) prefers-reduced-motion：尊重用户减少动画的设置。", difficulty: "动画性能优化需要了解合成层、避免触发重排，复杂动画序列编排复杂" },
      { name: "CSS 变量", desc: "主题化和样式复用。", projectUse: "暗色模式、品牌色切换。", mistake: "不要硬编码颜色值。", understanding: "1) 定义：--primary-color: #2563eb；2) 使用：color: var(--primary-color)；3) 作用域：:root 全局、.theme 局部；4) 动态切换：JS 修改 CSS 变量实现主题切换；5) 默认值：var(--color, #000)；6) 配合 Tailwind：自定义主题配置。", difficulty: "CSS 变量与预处理器变量容易混淆，主题切换需要考虑组件库兼容性" },
      { name: "Tailwind CSS", desc: "实用优先的 CSS 框架。", projectUse: "快速开发、统一设计系统。", mistake: "不要滥用，保持语义化。", understanding: "1) 核心理念：实用类优先，避免自定义 CSS；2) 响应式：sm:、md:、lg: 前缀；3) 状态：hover:、focus:、active:；4) 自定义：tailwind.config.js 扩展主题；5) 优点：开发快、包小(PurgeCSS)、一致性好；6) 缺点：HTML 冗长、学习曲线。", difficulty: "自定义主题配置复杂，与组件库样式冲突需要深度覆盖，class 过多影响可读性" }
    ]
  },
  {
    title: "JavaScript 核心",
    intro: "掌握语言基础，写出高质量代码。",
    items: [
      { name: "作用域与闭包", desc: "理解变量的生命周期和访问规则。", projectUse: "模块封装、私有变量、防抖节流。", mistake: "var 的函数作用域容易导致问题。", understanding: "1) 作用域类型：全局作用域、函数作用域、块级作用域(let/const)；2) 作用域链：内部可访问外部，外部不能访问内部；3) 闭包：函数记住创建时的作用域，可访问外部变量；4) 经典应用：防抖(debounce)、节流(throttle)、模块模式；5) 内存泄漏：闭包持有大对象不释放；6) let/const vs var：块级作用域、没有变量提升、暂时性死区。", difficulty: "闭包导致的内存泄漏难以定位，需要 Chrome DevTools Memory 面板分析" },
      { name: "异步编程", desc: "处理耗时操作的核心机制。", projectUse: "API 请求、文件上传、定时任务。", mistake: "回调地狱难以维护。", understanding: "1) 回调函数：最基本的异步方式，容易嵌套；2) Promise：链式调用、catch 错误处理、Promise.all/race；3) async/await：同步写法、try-catch 错误处理；4) 事件循环：宏任务(setTimeout)、微任务(Promise)、执行顺序；5) 并发控制：Promise.all(并行)、Promise.allSettled(容错)；6) 常见陷阱：for 循环中的异步、await 顺序执行。", difficulty: "事件循环执行顺序、并发控制、错误处理链容易出错，流式响应处理复杂" },
      { name: "事件机制", desc: "理解事件流和事件处理。", projectUse: "点击事件、表单提交、键盘快捷键。", mistake: "事件委托忘记判断目标元素。", understanding: "1) 事件流：捕获阶段 → 目标阶段 → 冒泡阶段；2) 事件委托：利用冒泡，在父元素处理子元素事件；3) addEventListener：第三个参数控制捕获/冒泡；4) 事件对象：target、currentTarget、preventDefault、stopPropagation；5) 常用事件：click、input、submit、keydown、scroll、resize；6) 自定义事件：CustomEvent、dispatchEvent。", difficulty: "事件委托边界判断、滚动/缩放性能优化、自定义事件通信设计" },
      { name: "原型与继承", desc: "JavaScript 的对象模型。", projectUse: "理解内置对象、框架原理。", mistake: "class 语法糖背后仍是原型。", understanding: "1) 原型链：对象通过 __proto__ 连接，向上查找属性；2) 构造函数：new 创建对象，prototype 共享方法；3) class 语法：语法糖，背后是原型继承；4) extends：继承父类，super 调用父类方法；5) 内置对象：Array、Object、Function 的原型方法；6) 常见问题：instanceof 判断、hasOwnProperty 区分自有/继承属性。", difficulty: "原型链调试复杂，理解 this 绑定规则需要大量练习" },
      { name: "模块化", desc: "代码组织和复用的最佳实践。", projectUse: "组件库、工具函数、API 封装。", mistake: "全局变量污染、依赖混乱。", understanding: "1) ES Modules：import/export、default/named 导出；2) 动态导入：import() 按需加载、代码分割；3) 导出方式：具名导出、默认导出、重新导出；4) 循环依赖：模块互相导入的问题和解决；5) Tree Shaking：打包时移除未使用代码；6) 命名规范：index.js 作为入口、文件名与导出一致。", difficulty: "循环依赖排查困难，Tree Shaking 失效需要分析 sideEffects 配置" },
      { name: "错误处理", desc: "构建健壮的应用。", projectUse: "API 错误、渲染错误、用户输入错误。", mistake: "吞掉错误会导致问题难排查。", understanding: "1) try-catch：捕获同步错误；2) async 错误：await 的 try-catch、Promise catch；3) 全局错误：window.onerror、unhandledrejection；4) 错误边界：React ErrorBoundary 捕获渲染错误；5) 错误类型：TypeError、ReferenceError、SyntaxError；6) 日志上报：错误收集、sentry、自定义上报。", difficulty: "异步错误捕获不完整、ErrorBoundary 无法捕获事件处理错误、错误堆栈丢失" },
      { name: "性能优化", desc: "让应用更快更流畅。", projectUse: "首屏加载、列表渲染、动画流畅。", mistake: "过早优化和忽视瓶颈都不对。", understanding: "1) 测量工具：Lighthouse、Performance 面板、Core Web Vitals；2) 加载优化：代码分割、懒加载、预加载、CDN；3) 渲染优化：减少重排重绘、虚拟滚动、requestAnimationFrame；4) 内存优化：及时释放、避免内存泄漏、WeakMap/WeakSet；5) 网络优化：HTTP/2、缓存策略、资源压缩；6) React 特有：memo、useMemo、useCallback、避免不必要渲染。", difficulty: "性能瓶颈定位需要熟练使用 Performance 面板，优化策略需要权衡开发成本" }
    ]
  },
  {
    title: "React 核心",
    intro: "构建现代用户界面的核心库。",
    items: [
      { name: "组件思维", desc: "用组件拆分和组合构建界面。", projectUse: "Button、Input、Card、Modal 组件。", mistake: "组件太大会难维护，太小会碎片化。", understanding: "1) 组件分类：展示组件(纯UI)、容器组件(逻辑)、复合组件；2) 拆分原则：单一职责、可复用、可测试；3) Props 设计：单一数据源、最小化、合理默认值；4) 组件命名：PascalCase、描述性名称；5) 文件组织：一个文件一个组件、index.js 导出；6) 复合组件：React.Children、cloneElement 实现灵活组合。", difficulty: "组件粒度把握需要经验，Props 设计不合理会导致频繁重构" },
      { name: "Hooks", desc: "函数组件的核心能力。", projectUse: "useState、useEffect、useRef、useCallback。", mistake: "Hooks 不能在条件语句或循环中调用。", understanding: "1) useState：状态管理、函数式更新、惰性初始化；2) useEffect：副作用处理、依赖数组、清理函数；3) useRef：DOM 引用、可变值、不触发重渲染；4) useMemo/useCallback：性能优化、避免不必要的计算/创建；5) useContext：跨组件共享数据；6) 自定义 Hook：抽取复用逻辑、命名以 use 开头；7) 规则：只在顶层调用、只在 React 函数中调用。", difficulty: "useEffect 依赖数组容易遗漏，闭包陷阱导致状态过期，自定义 Hook 逻辑抽取需要经验" },
      { name: "状态管理", desc: "管理应用的共享状态。", projectUse: "用户登录状态、购物车、全局配置。", mistake: "Props drilling 层级太深会很痛苦。", understanding: "1) 本地状态：useState、useReducer；2) 提升状态：共同父组件持有；3) Context：React.createContext、Provider、useContext；4) 状态库：Zustand(轻量)、Redux Toolkit(复杂)、Jotai(原子化)；5) 服务端状态：SWR、React Query(TanStack Query)；6) 选型原则：小应用 Context、中等 Zustand、大型 Redux。", difficulty: "状态管理方案选型、异步状态处理、状态持久化和恢复需要仔细设计" },
      { name: "渲染优化", desc: "避免不必要的重渲染。", projectUse: "大列表、频繁更新、复杂组件。", mistake: "过早优化和忽视瓶颈都不对。", understanding: "1) React.memo：纯展示组件缓存；2) useMemo：缓存计算结果；3) useCallback：缓存函数引用；4) 虚拟滚动：react-window、react-virtuoso；5) 代码分割：React.lazy、Suspense；6) 分析工具：React DevTools Profiler、why-did-you-render。", difficulty: "性能瓶颈定位需要 Profiler 分析，memo 使用时机需要权衡，虚拟滚动列表交互复杂" },
      { name: "Next.js", desc: "React 全栈框架。", projectUse: "本项目使用的框架。", mistake: "不要把所有逻辑都放在客户端组件。", understanding: "1) 渲染模式：SSR(服务端渲染)、SSG(静态生成)、ISR(增量静态)、CSR(客户端渲染)；2) 路由：App Router、文件系统路由、动态路由 [id]、布局 layout.tsx；3) 数据获取：Server Components、fetch 缓存、revalidate；4) API Routes：route.ts 处理后端逻辑；5) 中间件：middleware.ts 处理请求重写、鉴权；6) 部署：Vercel(推荐)、Docker、自建服务器。", difficulty: "Server/Client Component 边界划分、缓存策略配置、流式渲染调试复杂" }
    ]
  },
  {
    title: "前端工程化",
    intro: "构建、测试、部署的完整流程。",
    items: [
      { name: "构建工具", desc: "打包和编译前端代码。", projectUse: "Vite、Webpack、Turbopack。", mistake: "构建配置不要太纠结，够用就行。", understanding: "1) Vite：开发快(ESM)、配置简单、生产用 Rollup；2) Webpack：功能全、插件丰富、配置复杂；3) Turbopack：Next.js 内置、更快、配置最少；4) 核心概念：入口、出口、loader、plugin、mode；5) 代码分割：动态 import、chunk 分析；6) 环境变量：.env、.env.local、NEXT_PUBLIC_ 前缀。", difficulty: "Webpack 配置复杂、构建产物分析、monorepo 多包构建需要深入理解" },
      { name: "包管理", desc: "管理项目依赖。", projectUse: "npm、yarn、pnpm。", mistake: "node_modules 不要提交到 Git。", understanding: "1) npm：默认、package-lock.json；2) yarn：更快、yarn.lock；3) pnpm：磁盘友好、pnpm-lock.yaml；4) 依赖类型：dependencies(运行时)、devDependencies(开发时)、peerDependencies(宿主)；5) 版本语义：^兼容、~精确；6) 常用命令：install、update、remove、outdated。", difficulty: "依赖版本冲突排查困难、幽灵依赖问题、lock 文件冲突解决" },
      { name: "ESLint", desc: "代码质量检查工具。", projectUse: "自动检查代码规范。", mistake: "不要禁用所有规则。", understanding: "1) 配置：.eslintrc、extends 继承预设；2) 规则：off/warn/error；3) 插件：eslint-plugin-react、eslint-plugin-import；4) 自动修复：eslint --fix；5) 集成：VS Code 插件、Git hooks(pre-commit)；6) Next.js 内置 ESLint 配置。", difficulty: "自定义规则编写、与 Prettier 冲突配置、TypeScript ESLint 规则需要理解 AST" },
      { name: "Prettier", desc: "代码格式化工具。", projectUse: "统一代码风格。", mistake: "和 ESLint 功能有重叠，需要配置协调。", understanding: "1) 配置：.prettierrc、printWidth、tabWidth、semi；2) 忽略：.prettierignore；3) 与 ESLint 集成：eslint-config-prettier、eslint-plugin-prettier；4) 保存时格式化：VS Code settings；5) 命令行：prettier --write；6) 必要性：团队协作必装。", difficulty: "与 ESLint 规则冲突需要仔细配置，忽略文件列表需要维护" },
      { name: "Git 工作流", desc: "版本控制和协作。", projectUse: "代码管理、分支策略、PR 流程。", mistake: "不要直接在 main 分支开发。", understanding: "1) 分支策略：main(生产)、develop(开发)、feature/*、hotfix/*；2) 提交规范：feat/fix/chore/docs/refactor；3) 合并方式：merge(保留历史)、squash(压缩提交)、rebase(线性历史)；4) 冲突解决：手动合并、理解冲突标记；5) .gitignore：node_modules、.env、dist；6) Git Hooks：husky、lint-staged。", difficulty: "复杂合并冲突解决、rebase 操作风险、monorepo 部分提交需要熟练掌握" },
      { name: "测试", desc: "保证代码质量的防线。", projectUse: "单元测试、集成测试、E2E 测试。", mistake: "测试不是越多越好，要覆盖核心逻辑。", understanding: "1) 测试金字塔：单元测试(多)→集成测试(中)→E2E 测试(少)；2) 单元测试：Jest、Vitest、测试纯函数；3) 组件测试：React Testing Library、测试用户交互；4) E2E 测试：Playwright、Cypress、测试完整流程；5) 测试原则：AAA(Arrange-Act-Assert)、FIRST(快速/独立/可重复/自验证)；6) 覆盖率：不是目标，是参考。", difficulty: "Mock/Stub 设计、异步测试处理、E2E 测试稳定性维护成本高" },
      { name: "性能监控", desc: "线上性能追踪和优化。", projectUse: "加载速度、交互响应、错误追踪。", mistake: "本地快不等于线上快。", understanding: "1) Core Web Vitals(2024 年更新后)：LCP(加载)、INP(交互响应，2024 年 3 月正式取代 FID)、CLS(稳定性)；2) 监控工具：Lighthouse、Web Vitals 库、Sentry；3) 性能指标：FCP、TTFB、TTI、TBT；4) 分析方法：Chrome Performance 面板、火焰图；5) 优化方向：首屏、懒加载、缓存、CDN；6) 用户体验：真实用户监控(RUM)。", difficulty: "性能指标解读、真实用户数据与实验室数据差异分析、优化效果量化" }
    ]
  },
  {
    title: "网络与安全",
    intro: "理解 HTTP、API、安全防护。",
    items: [
      { name: "HTTP 协议", desc: "前后端通信的基础。", projectUse: "所有 API 请求。", mistake: "不理解 HTTP 会导致接口对接问题。", understanding: "1) 请求方法：GET/POST/PUT/PATCH/DELETE；2) 状态码：2xx 成功、3xx 重定向、4xx 客户端错误、5xx 服务器错误；3) Headers：Content-Type、Authorization、Cache-Control；4) Cookie：httpOnly、secure、sameSite；5) CORS：跨域资源共享、预检请求；6) HTTP/2：多路复用、头部压缩。", difficulty: "缓存策略配置复杂、跨域问题排查、HTTPS 证书配置需要经验" },
      { name: "Fetch API", desc: "现代的网络请求方式。", projectUse: "调用后端 API。", mistake: "忘记处理错误和边界情况。", understanding: "1) 基本用法：fetch(url, options)；2) 响应处理：res.json()、res.text()、res.blob()；3) 错误处理：fetch 不会 reject HTTP 错误，需要手动检查 res.ok；4) 请求配置：method、headers、body、credentials；5) 流式响应：ReadableStream；6) 取消请求：AbortController。", difficulty: "超时处理、请求取消、并发控制、流式响应处理需要封装" },
      { name: "认证与授权", desc: "保护用户身份和权限。", projectUse: "登录、权限控制、多租户。", mistake: "前端隐藏不等于后端安全。", understanding: "1) JWT：无状态令牌、存储位置、刷新机制；2) OAuth：第三方登录(微信、GitHub)；3) Session：服务端存储会话；4) 存储安全：httpOnly Cookie vs localStorage；5) 权限控制：前端路由守卫、按钮权限、接口权限；6) 安全原则：不存密码、HTTPS、CSRF 防护。", difficulty: "Token 刷新机制设计、多端登录状态同步、权限粒度控制实现复杂" },
      { name: "XSS 防护", desc: "防止恶意脚本注入。", projectUse: "用户输入、富文本渲染。", mistake: "React 默认转义，但 dangerouslySetInnerHTML 有风险。", understanding: "1) 攻击类型：存储型、反射型、DOM 型；2) 防护：输入过滤、输出编码、CSP；3) React：默认转义、dangerouslySetInnerHTML 要谨慎；4) CSP：Content-Security-Policy 限制脚本来源；5) Cookie：httpOnly 防止 JS 读取；6) 测试：XSS payload 测试。", difficulty: "富文本 XSS 过滤规则设计、CSP 策略配置、DOM 型 XSS 排查困难" },
      { name: "CSRF 防护", desc: "防止跨站请求伪造。", projectUse: "表单提交、敏感操作。", mistake: "同源策略不能防 CSRF。", understanding: "1) 攻击原理：利用用户已登录状态发起请求；2) 防护：CSRF Token、SameSite Cookie；3) SameSite：Strict/Lax/None；4) 检查 Origin/Referer 头；5) 双重提交 Cookie；6) 关键操作二次确认。", difficulty: "SameSite Cookie 兼容性、CSRF Token 生成和验证、前后端协同防护" },
      { name: "CORS 配置", desc: "跨域资源共享。", projectUse: "前后端分离开发。", mistake: "开发时 Allow-Origin: * 不能上线。", understanding: "1) 什么是同源：协议+域名+端口相同；2) 简单请求：GET/POST/HEAD，直接发送；3) 预检请求：复杂请求先发 OPTIONS；4) Headers：Access-Control-Allow-Origin、Allow-Methods、Allow-Headers；5) 凭证：Access-Control-Allow-Credentials；6) Next.js：next.config.js rewrites 代理。", difficulty: "预检请求性能影响、动态 Origin 配置、生产环境严格策略需要仔细规划" }
    ]
  }
];

export const aiGroups: KnowledgeGroup[] = [
  {
    title: "AI 基础概念",
    intro: "从零开始理解 AI，不需要数学背景也能懂。",
    items: [
      { name: "什么是 AI", desc: "人工智能的基本定义和分类。", projectUse: "理解整个 AI 应用的技术背景。", mistake: "AI 不是万能的，它只是工具。", understanding: "1) AI 定义：让机器模拟人类智能的技术；2) 分类：弱 AI(专用，如客服机器人)、强 AI(通用，目前不存在)；3) 子领域：机器学习、深度学习、自然语言处理(NLP)、计算机视觉(CV)；4) 与传统编程区别：传统=规则+数据→结果，AI=数据+结果→规则；5) 现状：大语言模型(LLM)是当前最热门的 AI 技术。" },
      { name: "什么是大语言模型", desc: "ChatGPT/GPT-4 背后的技术原理。", projectUse: "理解我们项目中使用的 AI 技术。", mistake: "LLM 不是数据库，它不能直接查询你的数据。", understanding: "1) 本质：一个超大的文字接龙模型，根据上文预测下文；2) 训练：用海量文本训练，学习语言模式和知识；3) 参数：GPT-4 有万亿级参数，参数越多能力越强但成本越高；4) 能力：理解语言、生成文本、推理、翻译、总结；5) 局限：不知道你的私有数据、可能编造内容(幻觉)、有知识截止日期。" },
      { name: "什么是 Token", desc: "AI 处理文本的最小单位。", projectUse: "计算成本、控制长度。", mistake: "1 个汉字不等于 1 个 Token，通常 1 汉字 = 1-2 Token。", understanding: "1) 定义：文本被切分成的最小单位，类似词语；2) 英文：一个单词通常 1 个 Token；3) 中文：一个汉字 1-2 个 Token；4) 作用：模型按 Token 处理文本，上下文长度按 Token 计算；5) 成本：按 Token 计费，输入+输出都算；6) 估算：1000 Token 约等于 750 英文单词 约等于 500 中文字。" },
      { name: "什么是 Embedding", desc: "把文本变成数字向量的技术。", projectUse: "语义搜索、知识库检索。", mistake: "Embedding 不是用来生成回答的，是用来搜索的。", understanding: "1) 目的：让计算机理解文本的意思；2) 原理：把文本转换成一串数字(如 1536 个数字)；3) 特点：语义相近的文本，数字串也相近；4) 用途：搜索(找相似内容)、分类(判断相似度)、推荐；5) 与向量数据库配合：存储 Embedding，快速搜索相似内容；6) 模型选择：OpenAI、BGE、M3E 等。" },
      { name: "什么是 RAG", desc: "让 AI 基于你的资料回答的技术。", projectUse: "本项目的核心架构。", mistake: "RAG 不是训练模型，而是给模型查资料。", understanding: "1) 全称：Retrieval Augmented Generation(检索增强生成)；2) 问题：LLM 不知道你的私有数据；3) 解决：先检索相关资料，再让 LLM 基于资料回答；4) 流程：用户问题→检索知识库→找到相关片段→喂给 LLM→生成回答；5) 优势：不需要训练模型、数据实时更新、可追溯来源；6) 应用：客服、问答、文档助手。" },
      { name: "什么是 Prompt", desc: "给 AI 的指令和输入。", projectUse: "控制 AI 的行为和输出。", mistake: "Prompt 不是随便写的，它需要精心设计。", understanding: "1) 定义：你给 AI 的输入，包括问题、指令、上下文；2) 重要性：同样的问题，不同的 Prompt 效果可能差很远；3) 组成：角色(你是...)、目标(请...)、约束(必须/不能)、资料(参考...)；4) 技巧：具体清晰、给出示例、分步骤、限定输出格式；5) 优化：反复测试、对比效果、记录最佳实践。" },
      { name: "什么是 Agent", desc: "让 AI 自主执行任务的技术。", projectUse: "AI 客服调用工具查订单、创建工单。", mistake: "Agent 不是完全自动化的，需要人工监督。", understanding: "1) 定义：能自主决策、调用工具、完成任务的 AI 系统；2) 与聊天区别：聊天=问答，Agent=执行任务；3) 核心能力：理解任务→选择工具→调用执行→返回结果；4) 工具调用：查数据库、调 API、发消息等；5) 安全问题：需要权限控制、人工审批、日志审计；6) 应用：智能客服、自动化助手、代码生成。" },
      { name: "AI 应用全景图", desc: "常见的 AI 应用类型和场景。", projectUse: "了解 AI 在不同领域的应用。", mistake: "不是所有问题都适合用 AI 解决。", understanding: "1) 对话类：客服、聊天机器人、语音助手；2) 内容类：写作、翻译、摘要、图片生成；3) 搜索类：语义搜索、推荐系统、知识问答；4) 分析类：情感分析、分类、数据提取；5) 自动化类：代码生成、文档处理、流程自动化；6) 选型原则：明确目标→评估可行性→选择技术方案→小范围验证。" },
      { name: "AI 开发工具箱", desc: "初学者需要知道的工具和平台。", projectUse: "快速上手 AI 开发。", mistake: "工具太多不要贪，先掌握核心的几个。", understanding: "1) 模型平台：OpenAI API、Anthropic API、Google Gemini、国产模型(DeepSeek、通义、Kimi)；2) 向量数据库：pgvector(推荐新手)、Pinecone(托管)；3) 开发框架：Vercel AI SDK(推荐新手)、LangChain/LangGraph(Agent 编排)、LlamaIndex(RAG 专用)；4) 前端工具：react-markdown、shadcn/ui；5) 监控工具：LangSmith、Langfuse；6) 学习资源：OpenAI Cookbook、Anthropic 文档、Vercel AI SDK 文档。" }
    ]
  },
  {
    title: "模型调用与 Prompt",
    intro: "解决如何稳定调用模型、控制输入输出、成本和失败。",
    items: [
      { name: "LLM 基础进阶", desc: "深入理解模型能力、上下文、输入输出和局限。", projectUse: "客服回复、总结、分类、改写。", mistake: "模型不是数据库，不知道你的私有文档。", understanding: "1) 模型能力：文本生成、分类、翻译、总结、推理；2) 上下文窗口：模型一次能处理的最大 Token 数(主流模型 128K-1M)；3) 输入输出：输入是 Prompt，输出是生成的文本；4) 局限：不知道你的私有数据、可能产生幻觉、有知识截止日期；5) 温度(temperature)：0=确定性高，1=创造性高；6) 选型：简单任务用小模型(便宜)、复杂任务用大模型(贵)；7) API 调用：REST 请求，返回 JSON。" },
      { name: "Token 与上下文", desc: "Token 影响成本、速度、上下文容量。", projectUse: "控制 RAG 片段数量、限制聊天历史。", mistake: "上下文不能无限塞。", understanding: "1) Token 是什么：文本的最小单位，英文≈单词，中文≈1-2字；2) 计数：1 token ≈ 0.75 英文单词 ≈ 0.5 中文字；3) 成本：按输入+输出 Token 计费，旗舰模型比轻量模型贵 10-30 倍(以官方最新价目表为准)；4) 上下文窗口：输入+输出总 Token 不能超过模型限制；5) 塞太多：成本高、速度慢、可能丢失前面信息；6) 优化：限制聊天历史条数、压缩 RAG 片段、截断长文本；7) 监控：记录每次调用的 Token 用量。" },
      { name: "Prompt 结构", desc: "角色、目标、约束、资料、输出格式、拒答规则。", projectUse: "客服 Prompt：只能基于知识库回答。", mistake: "Prompt 不是越长越好，而是越清楚越好。", understanding: "1) 角色：你是XX客服，语气友好专业；2) 目标：回答用户关于产品的问题；3) 约束：只能基于知识库回答，不知道就说不知道；4) 资料：[知识库内容]；5) 输出格式：JSON 包含 answer、sources、confidence；6) 拒答规则：低置信度转人工；7) 测试：用不同问题测试 Prompt 效果，迭代优化。" },
      { name: "System / Developer / User 消息", desc: "不同层级的指令边界。", projectUse: "系统规则、业务规则、用户问题分开。", mistake: "不要把所有规则都混在用户问题里。", understanding: "1) System：最高优先级，定义模型行为(如只能基于知识库回答)；2) Developer：业务规则(如输出 JSON 格式)；3) User：用户实际问题；4) 优先级：System > Developer > User；5) 分离好处：规则稳定不变，用户问题每次不同；6) 安全：System Prompt 防止用户注入攻击；7) 调试：单独测试 System Prompt 的效果。" },
      { name: "结构化输出", desc: "让模型按 schema 输出 JSON，便于后端处理。", projectUse: "answer、sources、confidence、need_handoff。", mistake: "不要靠正则硬解析自然语言。", understanding: "1) 为什么需要：JSON 比自然语言更容易解析、校验；2) 定义 Schema：answer(string)、sources(array)、confidence(number)、need_handoff(boolean)；3) 实现：OpenAI function calling 或 JSON mode；4) 校验：用 Zod/Joi 校验输出是否符合 schema；5) 降级：模型输出格式错误时重试或默认值；6) 示例：在 Prompt 中给出输出示例；7) 好处：前端直接使用，不需要额外解析。" },
      { name: "流式输出", desc: "边生成边返回，提高聊天体验。", projectUse: "SSE 打字机回复。", mistake: "流式也要保存完整消息。", understanding: "1) 为什么需要：用户不想等 5 秒看完整回复，边生成边看更流畅；2) SSE 实现：text/event-stream，每个 Token 发一个 event；3) 前端：EventSource 接收，拼接显示；4) 完整性：流式结束后保存完整消息到数据库；5) 错误处理：流式中断要能恢复或提示；6) 中断：用户可以取消流式生成；7) 注意：流式不能用结构化输出(JSON)，需要后处理。" },
      { name: "模型路由", desc: "不同任务选择不同模型。", projectUse: "分类用便宜模型，复杂回答用强模型。", mistake: "不是所有任务都需要最强模型。", understanding: "1) 任务分类：简单(分类、提取)→轻量模型(如 GPT-4o-mini、Claude Haiku、国产小模型)、复杂(推理、创作)→旗舰模型(如 GPT-5、Claude、Gemini)；2) 成本控制：90% 的请求走轻量模型，10% 走旗舰模型；3) 路由规则：按任务类型、用户等级、负载情况；4) 实现：AIProvider 接口，内部根据路由选择模型；5) 监控：每个模型的调用量、成本、成功率；6) 降级：主模型不可用时切换备用模型；7) 测试：对比不同模型在同一任务上的效果。" },
      { name: "降级与重试", desc: "模型失败时切换模型、重试或转人工。", projectUse: "AI 服务超时后提示稍后或人工接管。", mistake: "不要让 AI API 失败导致整个客服不可用。", understanding: "1) 失败类型：网络超时、限流、模型错误、内容过滤；2) 重试策略：立即重试(1次)→指数退避(2次)→切换模型；3) 降级路径：旗舰模型 → 轻量模型 → 缓存回复 → 转人工；4) 超时设置：流式 30 秒、非流式 60 秒；5) 熔断：连续失败 N 次后停止调用，避免雪崩；6) 用户提示：服务繁忙，请稍后重试；7) 监控：失败率 > 5% 要告警。" }
    ]
  },
  {
    title: "RAG 与知识库工程",
    intro: "解决如何让 AI 基于你的资料回答，而不是凭空发挥。",
    items: [
      { name: "文档解析", desc: "PDF、docx、txt、网页转文本。", projectUse: "商家上传 FAQ、退款政策、套餐说明。", mistake: "解析失败要有状态和原因。", understanding: "1) PDF 解析：pdf-parse(简单 PDF)、pdf.js(前端)、Unstructured(复杂布局/表格/图片)；2) docx：mammoth(保留结构)、docx 库；3) 网页：Cheerio 提取正文，去导航/广告/页脚；4) 纯文本：txt/markdown 直接读取；5) 解析失败处理：记录失败原因(格式不支持/加密/损坏/超时)，状态设为 failed，支持重试；6) 预览：解析后生成纯文本预览(截取前 500 字)；7) 元数据提取：标题、作者、页数、创建时间、修改时间；8) 批量解析：大文件分页处理，超时自动终止；9) 二进制检测：上传时校验文件头(Magic Number)，防止伪装文件。" },
      { name: "文本清洗", desc: "去页眉页脚、乱码、重复内容。", projectUse: "提高切片和检索质量。", mistake: "脏文本会直接影响检索质量。", understanding: "1) 页眉页脚去除：按页分割后，检测固定位置重复文本并删除；2) 乱码处理：UTF-8 编码转换，去除不可见字符(\\x00-\\x1F)；3) 重复内容检测：MinHash/SimHash 相似度检测，去除高度重复段落；4) 特殊字符：保留标点符号，去除多余空格/换行/制表符；5) 格式统一：全角→半角、繁体→简体(可选)、统一标点；6) HTML 清洗：去除标签，保留文本内容；7) 质量评估：清洗前后对比文本可读性；8) 日志：记录清洗前后文本差异(删除了多少内容)；9) 可配置：清洗规则可配置，不同文档类型用不同规则。" },
      { name: "Chunk 切片", desc: "把长文档拆成适合检索的小块。", projectUse: "按标题、段落、固定长度、滑动窗口。", mistake: "切太大不准，切太小丢上下文。", understanding: "1) 切片大小：200-1000 Token，常见 500 Token(约 300-400 中文字)；2) 重叠：相邻 chunk 重叠 50-100 Token(约 15%)，避免语义断裂；3) 切分策略：按标题(层级清晰，保留标题)、按段落(自然语义边界)、固定长度(简单)、滑动窗口(重叠多)；4) 元数据：每个 chunk 记录所属文档(doc_id)、页码(page)、位置(offset)、标题(heading)；5) 特殊处理：表格完整保留、代码块完整保留、列表完整保留；6) 边界处理：不要在句子中间切断；7) 测试：人工检查切片质量，调整大小/重叠参数；8) 评估：检索命中率反推切片效果；9) 动态切片：根据文档结构自动选择切分策略。" },
      { name: "Embedding", desc: "把文本转向量，表示语义。", projectUse: "用户问题和 chunk 做相似度检索。", mistake: "Embedding 不负责生成答案。", understanding: "1) 什么是向量：高维浮点数组(如 1536 维)，语义相近的文本向量距离近；2) 模型选择：OpenAI text-embedding-3-small(便宜/1536维)、text-embedding-3-large(精准/3072维)、bge-large-zh-v1.5(中文专用)；3) 调用流程：文本→Tokenize→模型→向量数组；4) 成本：$0.02/1M tokens(比生成模型便宜 100 倍)；5) 批量处理：一次请求最多 2048 条文本；6) 维度选择：1536 维够用，更高维度不一定更好，增加存储和计算成本；7) 中英文：多语言模型支持中英文混合，中文专用模型效果更好；8) 缓存：相同文本的 Embedding 可以缓存，避免重复调用；9) 更新策略：Embedding 模型更新时，需要重新生成所有向量。" },
      { name: "向量数据库 / pgvector", desc: "保存和搜索向量。", projectUse: "doc_chunks 向量检索。", mistake: "向量库不是普通业务数据库。", understanding: "1) pgvector：PostgreSQL 扩展，集成方便，适合中小规模(百万级)；2) 专用向量库：Pinecone(全托管)、Milvus(自建，大规模)、Weaviate(自建，支持混合)；3) 索引类型：HNSW(精确，内存占用高)、IVF(近似，速度快)、Flat(暴力搜索，小数据用)；4) 相似度计算：余弦相似度(最常用，衡量方向)、欧氏距离(衡量距离)、内积(衡量相关性)；5) 查询流程：查询文本→Embedding→向量→ANN 搜索→Top K 结果；6) 混合查询：向量 + 元数据过滤(WHERE merchant_id = ?)；7) 性能：pgvector 百万级 OK、千万级慢，亿级用 Milvus；8) 成本：pgvector 零成本(已有 PostgreSQL)、Pinecone 按用量付费；9) 选型：小项目 pgvector、中项目 Pinecone、大项目 Milvus。" },
      { name: "Metadata Filter", desc: "用元数据过滤范围。", projectUse: "merchant_id、doc_id、category、status。", mistake: "没有过滤会造成跨商家数据泄漏。", understanding: "1) 为什么需要：向量检索只管语义相似，不管权限/范围；2) 过滤维度：merchant_id(多租户，必须)、doc_id(指定文档)、category(分类)、status(状态：仅已发布)；3) 实现：向量查询时加 WHERE 条件；4) pgvector 示例：SELECT * FROM doc_chunks WHERE merchant_id = $1 AND status = 'active' ORDER BY embedding <=> $2 LIMIT 10；5) 性能：过滤字段必须加索引；6) 安全测试：用商家 A 的 ID 查询，确保只返回商家 A 的数据；7) 组合过滤：多个条件 AND 组合(merchant_id + category + status)；8) 动态过滤：根据用户角色动态添加过滤条件(管理员不过滤、普通用户过滤)。" },
      { name: "Hybrid Search", desc: "关键词搜索 + 向量搜索结合。", projectUse: "用户问具体编号或专有名词时更稳。", mistake: "向量搜索不一定适合所有查询。", understanding: "1) 为什么混合：向量找语义相似(适合口语化问题)、关键词找精确匹配(适合编号/专有名词)；2) 适用场景：订单号、产品型号、专有名词、缩写；3) 实现：分别执行向量搜索和关键词搜索，合并结果；4) 权重分配：向量 70% + 关键词 30%(可配置)；5) 合并策略：RRF(Reciprocal Rank Fusion，按排名融合)、加权求和(按分数融合)；6) 去重：相同 chunk 合并分数，取最高分；7) 对比测试：纯向量 vs 纯关键词 vs 混合，选最优；8) 动态权重：根据查询类型自动调整权重(编号查询关键词权重高)。" },
      { name: "Rerank", desc: "对初步检索结果重新排序。", projectUse: "提高 Top 结果质量。", mistake: "TopK 召回多不等于最终质量好。", understanding: "1) 为什么需要：初步检索(向量/关键词)召回 Top 20-50，但排序不够精准；2) Rerank 模型：Cohere Rerank(商业)、BGE-Reranker(开源)、Cross-Encoder；3) 流程：先召回 Top 20-50 → Rerank 重新打分 → 取 Top 3-5；4) 原理：用更精准的模型(如 Cross-Encoder)重新计算查询与每个 chunk 的相关性分数；5) 成本：比生成模型便宜很多，每次 0.001-0.01 美元；6) 延迟：增加 100-500ms，但 Top-5 质量提升 20-30%；7) 评估：对比 Rerank 前后的检索命中率；8) 场景：RAG 质量要求高时使用，简单场景可以跳过。" },
      { name: "Query Rewrite", desc: "改写用户问题以提升检索。", projectUse: "晚上几点关门 改写为 营业时间。", mistake: "改写不能改变用户原意。", understanding: "1) 为什么需要：用户口语化表达(咋退款)与知识库书面表达(退款流程)不匹配；2) 改写方式：同义词替换、问题规范化、补充上下文、拆分复合问题；3) 示例：'咋退款'→'退款流程'、'AI好用吗'→'人工智能产品评价'、'晚上几点关门'→'营业时间'；4) 实现：用 LLM 改写(效果好但慢)、规则匹配(快但覆盖有限)；5) 多查询改写：改写成 2-3 个查询，取并集，提高召回率；6) 限制：改写后必须与原意一致，不能改变用户意图；7) 测试：对比改写前后的检索命中率；8) 缓存：常见问题的改写结果可以缓存。" },
      { name: "Context Compression", desc: "压缩上下文，减少 token 成本。", projectUse: "只保留和问题相关的句子。", mistake: "压缩不能丢掉关键依据。", understanding: "1) 为什么需要：检索到的 chunk 可能包含大量无关内容，浪费 Token；2) 压缩方法：提取关键句、LLM 摘要、滑动窗口截取、关键词高亮；3) 保留原则：与问题相关的句子、包含答案的段落、包含数字/事实的句子；4) 压缩比：原 chunk 1000 Token → 压缩后 200-300 Token(70% 压缩率)；5) 成本权衡：压缩本身消耗 Token，但总成本降低(减少生成模型输入)；6) 引用追溯：压缩后要能追溯到原文位置(保留 offset)；7) 测试：对比压缩前后的回答质量和成本；8) 场景：长文档检索、多 chunk 合并时使用。" },
      { name: "引用来源", desc: "回答必须能追踪到文档和片段。", projectUse: "展示 FAQ.pdf 第 3 段。", mistake: "没有来源，排查和信任都很难。", understanding: "1) 为什么需要：让用户相信回答有依据、便于排查错误、符合合规要求；2) 引用格式：文档名 + 页码/段落 + 原文片段(如 FAQ.pdf 第 3 段)；3) 实现：检索时记录 chunk 的元数据(doc_id, page, offset, heading)；4) 展示：回答中标注[1][2]，底部显示来源列表，点击跳转到原文；5) 可追溯：来源必须可验证，用户能点击查看原文；6) 信任度：引用越多、来源越权威，可信度越高；7) 评估：人工检查引用是否准确(引用的是否真的是答案来源)；8) 缺失处理：无法提供来源的回答要标注'无法验证'。" },
      { name: "拒答策略", desc: "知识库无答案时不能编。", projectUse: "低相似度转人工。", mistake: "客服场景宁可拒答，也不能乱答。", understanding: "1) 为什么拒答：防止幻觉，客服场景幻觉成本高(错误价格/政策)；2) 判断依据：检索相似度 < 阈值(如 0.6)、LLM 输出置信度低；3) 拒答话术：'抱歉，我暂时无法回答这个问题，已为您转接人工客服'；4) 转人工流程：自动创建工单、记录问题和上下文、通知客服；5) 缺口分析：收集拒答问题，分析为什么检索不到，补充知识库；6) 评估指标：拒答率(不能太高影响体验)、拒答准确率(该拒的必须拒)；7) 监控：每日统计拒答问题类型，识别知识库缺口；8) 迭代：拒答问题定期人工审核，转化为知识库内容。" }
    ]
  },
  {
    title: "Agent 与工具调用",
    intro: "解决 AI 如何安全地调用业务系统，而不是只聊天。",
    items: [
      { name: "Agent Loop (ReAct)", desc: "AI 自主思考-行动-观察的循环机制，是 2024-2025 最火的 AI 工程模式。", projectUse: "智能客服自动解决问题、自动化工作流、代码生成。", mistake: "Agent Loop 不是无限循环，必须有边界控制。", understanding: "1) 核心循环：Thought(思考)→Action(行动)→Observation(观察)→循环直到完成；2) ReAct 框架：Reasoning(推理)+ Acting(行动)，让模型先想再做；3) 与传统区别：传统=预定义流程，Agent=模型自主决策；4) 循环示例：用户问退款→思考(需要查订单)→调用 getOrderStatus→观察(订单已发货)→思考(需要查询退款政策)→检索知识库→生成回答；5) 关键设计：1) 循环终止条件(完成/失败/超时)；2) 最大步数限制(防止无限循环)；3) 每步记录(Thought/Action/Observation 便于调试)；4) 错误处理(工具失败后重试或换方案)；5) 成本控制(每步都消耗 Token)；6) 应用场景：复杂问题分解、多步骤任务、需要推理的场景；7) 业界实现：LangChain Agent、OpenAI Assistants API、Anthropic Claude Tool Use；8) 与 Workflow 区别：Workflow=固定流程可预测，Agent Loop=动态决策灵活但不可预测。" },
      { name: "Chain of Thought (CoT)", desc: "让模型展示推理过程，提升复杂任务准确率。", projectUse: "数学计算、逻辑推理、多步骤分析。", mistake: "CoT 会增加 Token 消耗，简单问题不需要。", understanding: "1) 核心思想：让模型一步步思考，而不是直接给答案；2) 实现方式：在 Prompt 中加'请一步步分析'；3) 效果：复杂问题准确率提升 20-40%；4) 变体：Zero-shot CoT(直接说'let's think step by step')、Few-shot CoT(给推理示例)；5) 成本：输出 Token 增加 2-5 倍；6) 适用：数学题、逻辑推理、代码调试；7) 不适用：简单问答、闲聊、分类任务；8) 与 Agent Loop 关系：CoT 是思考方式，Agent Loop 是执行框架。" },
      { name: "Tool Calling", desc: "模型选择调用哪个后端工具。", projectUse: "查订单、查库存、创建工单。", mistake: "模型只能建议调用，真正执行必须后端控制。", understanding: "1) 完整流程：用户问题→LLM 判断需要调用工具→返回工具名+参数(JSON)→后端校验权限→执行工具→结果返回 LLM→生成最终回答；2) 模型不执行：模型只输出'我想调用 XX 工具，参数是 XXX'，后端决定是否执行；3) 实现方式：OpenAI function calling、Anthropic tool_use、Google function calling；4) 并行调用：一次可以建议多个工具调用(如同时查订单和查库存)；5) 选择依据：模型根据工具描述和用户问题自动选择；6) 安全校验：后端必须校验参数合法性(防注入)、用户权限(防越权)、操作合理性(防滥用)；7) 超时控制：工具执行超时要能中断，避免阻塞；8) 日志记录：每次调用记录工具名、参数、结果、耗时、成功/失败。" },
      { name: "Tool Schema", desc: "定义工具参数、类型和返回。", projectUse: "getOrderStatus(orderId)。", mistake: "Schema 不清楚会导致参数混乱。", understanding: "1) 定义内容：工具名、描述、参数(JSON Schema)、返回格式；2) 示例：{ name: 'getOrderStatus', description: '查询指定订单的当前状态', parameters: { type: 'object', properties: { orderId: { type: 'string', description: '订单号，格式为 ORD-XXXXX' } }, required: ['orderId'] } }；3) 描述要清晰：模型靠描述判断何时使用，描述不清会导致误用；4) 参数类型：string、number、boolean、enum、array、object；5) 必填标记：required 字段标记哪些参数必须提供；6) 返回格式：定义返回结构，便于 LLM 理解(如 { status: string, updatedAt: string } )；7) 测试验证：用不同问题测试模型是否正确选择工具和传递参数；8) 版本管理：工具参数变更要考虑向后兼容。" },
      { name: "工具权限", desc: "AI 调用工具前后端必须校验权限。", projectUse: "客服不能执行退款。", mistake: "AI 不能绕过用户权限。", understanding: "1) 权限校验时机：工具执行前，后端统一校验，不依赖 LLM 判断；2) 工具分级：只读(查询订单)、写入(创建工单)、敏感(退款/删除)；3) 角色限制：客服只能查询，管理员才能退款/删除；4) 实现：工具执行器中间件统一校验 permissions.includes('order:refund')；5) 多租户隔离：只能操作本商家的数据(merchant_id 校验)；6) 审计日志：记录每次工具调用的用户、参数、结果、IP；7) 防注入：校验参数合法性，防止 SQL 注入、命令注入；8) 熔断机制：连续失败 N 次后暂停工具调用，避免雪崩。" },
      { name: "人工审批", desc: "高风险操作需要人确认。", projectUse: "退款、删除数据、发送优惠券。", mistake: "高风险动作不要完全自动化。", understanding: "1) 高风险操作定义：退款(涉及资金)、删除数据(不可逆)、发送优惠券(涉及成本)、修改配置(影响全局)；2) 审批流程：AI 建议操作→创建审批单(记录操作详情)→通知审批人→人工确认/拒绝→执行/取消；3) 实现：工具执行器检查是否需要审批(配置化)，需要则返回待确认状态；4) 超时处理：审批超时(如 24 小时)自动取消，记录超时原因；5) 拒绝处理：记录拒绝原因，AI 改用其他方案或转人工；6) 通知方式：企微消息、短信、邮件，多渠道通知；7) 审计追踪：审批记录不可删除，保留完整审批历史；8) 紧急通道：特殊情况下(如系统故障)可跳过审批，但必须记录。" },
      { name: "Workflow", desc: "比自由 Agent 更可控的固定流程。", projectUse: "投诉流程：分类 -> 收集信息 -> 创建工单 -> 转人工。", mistake: "不是所有流程都需要自由 Agent。", understanding: "1) 为什么需要：固定流程更可控、可预测、易调试、易统计；2) 状态机定义：步骤 + 流转条件 + 超时处理(如 收集信息→超时 5 分钟→自动转人工)；3) 示例流程：投诉分类→收集信息(订单号/手机号/问题描述)→创建工单→转人工→解决→关闭；4) 实现：Workflow 引擎按步骤执行，每步校验输入，支持条件分支；5) 与 Agent 区别：Agent 自由选择工具(不可预测)、Workflow 按预定义流程(可控)；6) 适用场景：客服投诉、订单处理、审批流程、工单系统；7) 优势：每个步骤可统计耗时、成功率，便于优化；8) 可配置：流程可配置化，不同商家可用不同流程。" },
      { name: "Agent State", desc: "保存多步任务状态。", projectUse: "当前收集到订单号、手机号、问题类型。", mistake: "状态不保存，多轮任务容易断。", understanding: "1) 为什么需要：多轮对话中，AI 需要记住之前收集的信息(如已收集订单号，还需要手机号)；2) 状态内容：当前步骤、已收集字段({ orderId: 'xxx', phone: null })、上下文变量、开始时间；3) 存储方案：Redis(短期，30 分钟过期)、数据库(长期，支持持久化)；4) 生命周期：任务开始→进行中→完成/失败/超时；5) 超时清理：状态过期自动清理(如 30 分钟)，避免内存泄漏；6) 并发隔离：同一用户多个任务状态隔离(用 taskId 区分)；7) 断点恢复：对话中断后，下次继续从断点恢复(读取状态继续执行)；8) 版本控制：状态结构变更时要兼容旧状态。" },
      { name: "Memory", desc: "保存长期偏好或业务上下文，必须注意隐私和权限。", projectUse: "用户常问问题、商家配置。", mistake: "不要随便保存敏感个人信息。", understanding: "1) 短期记忆：当前对话上下文(messages 数组)，存在请求上下文，请求结束即释放；2) 长期记忆：用户偏好(语言/风格)、历史问题、常用功能，存在数据库；3) 业务上下文：商家配置、知识库状态、系统参数，存在 Redis/配置中心；4) 隐私保护：手机号、地址、身份证等敏感信息不要存入记忆；5) 权限隔离：记忆按用户/商家隔离，不能跨租户访问；6) 用户权利：用户可请求查看/删除自己的记忆(GDPR 合规)；7) 容量限制：记忆容量有限(如最近 100 条)，优先保留重要信息；8) 安全审计：记忆访问日志，防止滥用。" },
      { name: "Handoff", desc: "AI 无法处理时转人工。", projectUse: "投诉、低置信度、敏感问题。", mistake: "没有人工兜底的客服 AI 不稳。", understanding: "1) 触发条件：AI 拒答(低相似度)、用户明确要求、投诉类问题、敏感问题(退款/法律)；2) 转人工流程：AI 判断需要转人工→创建工单(记录问题/上下文)→通知客服(企微/短信)→客服接管对话；3) 上下文传递：把对话历史、用户信息、AI 分析结果(已收集信息/问题分类)传给客服；4) 实现：创建 handoff 记录，更新会话状态为 'waiting_human'；5) 通知方式：企微消息(实时)、浏览器通知、短信(紧急)；6) 回到 AI：客服处理完可以让用户继续与 AI 对话(状态切回 'ai_active')；7) 评估指标：转人工率(越低越好)、转人工后解决率、用户满意度；8) 优化方向：分析转人工原因，补充知识库/优化 Prompt，降低转人工率。" },
      { name: "工具调用日志", desc: "记录 AI 调用了什么、参数、结果、耗时。", projectUse: "tool_call_logs。", mistake: "没有日志无法审计 AI 的动作。", understanding: "1) 记录内容：工具名(getOrderStatus)、参数({orderId: 'xxx'})、返回结果({status: 'shipped'})、耗时(150ms)、成功/失败；2) 关联信息：requestId(链路追踪)、userId(操作人)、sessionId(会话)、merchantId(商家)；3) 存储：tool_call_logs 表，保留 90 天(可配置)；4) 查询维度：按工具名、按用户、按时间范围、按成功/失败筛选；5) 审计要求：敏感操作(退款/删除)的日志不可删除，保留更长(如 1 年)；6) 监控指标：工具调用成功率、平均耗时、失败原因分布；7) 排查流程：用户投诉→查 requestId→查工具调用日志→分析参数和结果；8) 告警：工具调用失败率 > 10% 立即告警。" },
      { name: "防止过度自主", desc: "Agent 不应无限循环或越权行动。", projectUse: "限制最大步数、工具白名单。", mistake: "Agent 越自主，越需要边界。", understanding: "1) 最大步数：限制一次任务最多调用工具 N 次(如 10 次)，超过强制停止；2) 工具白名单：只能调用预定义的工具(如 getOrderStatus/createTicket)，不能调用危险工具(如 deleteAll/refund)；3) 参数校验：防止注入攻击(SQL 注入/命令注入)、越权访问(只能查自己的订单)；4) 循环检测：相同工具+相同参数连续调用 3 次则停止(防止死循环)；5) 成本控制：每次工具调用都消耗 Token，设置单次任务 Token 上限；6) 人工兜底：超过限制或检测到异常时自动转人工；7) 审计日志：记录 Agent 的每一步决策(选择工具/参数/结果)，便于事后审计；8) 超时机制：单次任务总耗时超过 5 分钟强制停止。" }
    ]
  },
  {
    title: "AI 质量、安全与生产化",
    intro: "解决 AI 功能能不能真实上线。",
    items: [
      { name: "AI 评估集", desc: "固定问题集，用于回归测试。", projectUse: "100 条商家客服问题。", mistake: "不能只靠肉眼看几条效果。", understanding: "1) 评估集构成：标准问题 + 标准答案 + 预期行为(回答/拒答/转人工)；2) 覆盖场景：常见问题、边界问题、敏感问题、多轮对话；3) 评估维度：检索命中率、回答准确率、拒答率、幻觉率、延迟；4) 自动化评估：脚本批量调用 AI，对比预期输出；5) 人工评估：抽样人工评分，校准自动评估；6) 持续更新：新增问题、失败案例补充到评估集；7) 版本管理：评估集有版本号，每次评估记录版本。" },
      { name: "检索命中率", desc: "正确答案是否出现在检索结果。", projectUse: "RAG 调优核心指标。", mistake: "检索不到，生成再强也容易错。", understanding: "1) 定义：正确答案是否出现在 Top-K 检索结果中；2) 计算：命中数 / 总问题数 × 100%；3) 目标：Top-3 命中率 > 85%，Top-5 > 95%；4) 调优方向：切片大小、Embedding 模型、Hybrid Search、Rerank；5) 监控：每次检索记录命中情况，按问题类型分析；6) 失败分析：未命中原因(切片不合理、Embedding 不准、查询改写失败)；7) 对比实验：A/B 测试不同检索策略的效果。" },
      { name: "回答准确率", desc: "最终回答是否正确。", projectUse: "人工评分或规则评分。", mistake: "准确率要分场景统计。", understanding: "1) 定义：AI 最终回答是否正确回答了用户问题；2) 评估方式：人工评分(1-5分)、规则评分(关键词匹配)、LLM 评估；3) 分场景统计：简单问题准确率、复杂问题准确率、拒答准确率；4) 目标：整体准确率 > 80%，简单问题 > 95%；5) 错误分类：检索失败、生成错误、幻觉、拒答不当；6) 持续优化：分析错误案例，针对性优化 Prompt/检索；7) A/B 测试：新版本上线前对比准确率。" },
      { name: "拒答率", desc: "无答案时是否拒答。", projectUse: "防止胡说。", mistake: "拒答不是失败，是安全能力。", understanding: "1) 定义：知识库无答案时，AI 正确拒答而非编造；2) 计算：正确拒答数 / 应拒答数 × 100%；3) 目标：应拒答问题的拒答率 > 95%；4) 判断依据：检索相似度 < 阈值(如 0.6)、LLM 置信度低；5) 拒答话术：'抱歉，我暂时无法回答这个问题，已为您转接人工客服'；6) 评估：拒答率太低(幻觉风险)、太高(用户体验差)；7) 缺口分析：收集拒答问题，补充知识库。" },
      { name: "幻觉率", desc: "是否编造知识库没有的内容。", projectUse: "价格、退款政策尤其危险。", mistake: "客服场景幻觉成本很高。", understanding: "1) 定义：AI 回答中包含知识库没有的信息(编造价格、政策、功能)；2) 检测：人工审核、LLM 辅助判断、引用来源校验；3) 目标：幻觉率 < 5%，关键领域(价格/退款) = 0%；4) 高危场景：价格、退款政策、产品功能、法律条款；5) 预防：严格 Prompt 约束(只基于知识库)、引用来源、拒答策略；6) 监控：用户投诉、人工抽检、自动检测；7) 案例库：收集幻觉案例，训练时避免。" },
      { name: "成本监控", desc: "记录 token、模型、调用次数。", projectUse: "控制 AI 接口费用。", mistake: "不记录 token 就不知道商业上能不能跑。", understanding: "1) 记录内容：每次调用的 input_tokens、output_tokens、模型、费用；2) 成本计算：按各模型官方价目表算，旗舰模型和轻量模型单价可差 10-30 倍，价格更新快，写代码时读配置而非硬编码；3) 按维度统计：按用户、按商家、按功能、按模型；4) 告警：单日费用超过阈值、单用户费用异常；5) 优化方向：压缩上下文、用便宜模型、缓存常见问题；6) 成本预算：设定每月 AI 费用上限；7) 报表：日报/周报/月报，分析成本趋势。" },
      { name: "延迟监控", desc: "记录检索耗时、模型耗时、总耗时。", projectUse: "优化用户等待。", mistake: "用户不关心你技术多复杂，只关心慢不慢。", understanding: "1) 延迟分解：检索耗时(向量搜索)、Rerank 耗时、模型耗时(生成)、网络耗时；2) 目标：总延迟 < 3 秒(流式首 Token < 1 秒)；3) 记录：每次请求记录各阶段耗时；4) 监控：P50/P95/P99 延迟、按模型/按功能维度；5) 优化：缓存常见查询、异步预计算、模型路由(简单任务用快模型)；6) 告警：P95 延迟 > 5 秒；7) 用户体验：流式输出(边生成边显示)减少感知延迟。" },
      { name: "Prompt Injection 防护", desc: "防止用户诱导 AI 泄漏规则或越权。", projectUse: "恶意用户说忽略之前规则。", mistake: "Prompt 护栏不是百分百安全，还要后端权限。", understanding: "1) 攻击方式：用户在输入中嵌入指令(忽略规则、输出系统 Prompt、执行未授权操作)；2) 防护层次：输入过滤(检测危险关键词)、Prompt 约束(不能违反规则)、后端权限(即使 AI 被骗，后端也校验权限)；3) 输入过滤：检测 prompt injection 关键词(忽略规则、输出系统 Prompt)；4) Prompt 约束：在 System Prompt 中明确禁止行为；5) 后端权限：工具调用前校验用户权限，AI 无法绕过；6) 监控：记录可疑输入，人工审核；7) 测试：定期用攻击样本测试系统韧性。" },
      { name: "PII 脱敏", desc: "保护手机号、地址、姓名等敏感信息。", projectUse: "日志和模型输入脱敏。", mistake: "日志里不要明文堆敏感信息。", understanding: "1) PII 类型：手机号、身份证号、邮箱、地址、银行卡号；2) 脱敏规则：手机号 138****1234、邮箱 a***@example.com、身份证 110***********1234；3) 脱敏时机：日志记录前、发送给 AI 模型前、存储前；4) 实现：正则匹配 + 替换、NER 模型识别 + 替换；5) 日志脱敏：pino 日志中间件自动脱敏；6) AI 输入脱敏：发送给模型前脱敏，模型返回后还原；7) 合规要求：GDPR、CCPA、等保都要求 PII 保护；8) 审计：定期检查日志和数据库中的 PII 泄漏。" },
      { name: "Guardrails 护栏", desc: "规则、权限、过滤、拒答、人工兜底的组合。", projectUse: "不是单个 Prompt。", mistake: "不要以为一句系统提示就能解决安全。", understanding: "1) 多层防护：输入过滤→Prompt 约束→检索过滤→输出校验→后端权限→人工兜底；2) 输入层：检测 Prompt Injection、PII 过滤、敏感词过滤；3) Prompt 层：系统规则(只基于知识库)、拒答规则、格式约束；4) 检索层：Metadata Filter(多租户)、相似度阈值；5) 输出层：引用来源校验、幻觉检测、格式校验；6) 后端层：工具权限校验、操作审批、限流；7) 兜底层：低置信度转人工、异常告警；8) 监控：各层拦截率、整体安全指标；9) 迭代：根据攻击样本持续优化护栏。" },
      { name: "反馈闭环", desc: "用户点踩、人工修正、未命中问题进入优化池。", projectUse: "持续提升知识库和 Prompt。", mistake: "没有反馈闭环，AI 质量很难持续提升。", understanding: "1) 反馈来源：用户点踩/点赞、人工客服修正、管理员审核、评估集失败案例；2) 反馈收集：前端反馈按钮、后台反馈入口、自动收集(低置信度)；3) 反馈分类：检索失败、生成错误、幻觉、拒答不当、其他；4) 处理流程：反馈→分类→分配→修复→验证→上线；5) 优化方向：补充知识库(检索失败)、优化 Prompt(生成错误)、调整阈值(拒答不当)；6) 效果追踪：修复前后对比准确率；7) 闭环验证：修复后重新评估，确认效果。" },
      { name: "版本管理", desc: "Prompt、模型、评估集、知识库都要有版本。", projectUse: "改 Prompt 后能回滚和对比。", mistake: "改了什么说不清，就没法复盘。", understanding: "1) Prompt 版本：每次修改记录版本号、修改内容、修改原因；2) 模型版本：记录模型版本(如 gpt-4-turbo-2024-04-09)；3) 评估集版本：每次评估记录评估集版本，结果可对比；4) 知识库版本：文档更新记录版本，支持回滚；5) 变更日志：每次变更记录 who/what/when/why；6) 回滚能力：Prompt/模型/知识库都能快速回滚到上一版本；7) 对比实验：A/B 测试新旧版本效果；8) 审计：版本历史不可删除，便于追溯。" }
    ]
  },
  {
    title: "AI 应用开发实战",
    intro: "从 0 到 1 构建 AI 应用的完整流程。",
    items: [
      { name: "第一个 AI 应用", desc: "5 分钟创建一个 AI 聊天机器人。", projectUse: "快速上手 AI 开发。", mistake: "不要一开始就追求完美，先跑通再优化。", understanding: "1) 最简配置：一个 API Key + 一个前端页面；2) 代码示例：调用 OpenAI API 发送消息；3) 流式输出：用 SSE 实现打字机效果；4) 错误处理：网络错误、API 限流、Token 超限；5) 下一步：加知识库(RAG)、加工具(Agent)、加记忆(Memory)。" },
      { name: "知识库应用开发", desc: "让 AI 基于你的文档回答问题。", projectUse: "客服、文档助手、内部知识库。", mistake: "文档质量决定回答质量，垃圾进垃圾出。", understanding: "1) 步骤：文档上传→解析→切片→Embedding→存储→检索→生成；2) 技术选型：pgvector(简单)、Pinecone(托管)；3) 切片策略：500 Token + 15% 重叠；4) 检索优化：Hybrid Search + Rerank；5) 评估：准备 100 条测试问题，计算命中率；6) 常见坑：文档格式乱、切片太大、检索不准。" },
      { name: "Agent 应用开发", desc: "让 AI 自主调用工具完成任务。", projectUse: "智能客服、自动化助手。", mistake: "Agent 需要严格的权限控制，不能让它乱来。", understanding: "1) 步骤：定义工具→注册工具→模型选择→执行→返回；2) 工具定义：名称、描述、参数 Schema；3) 权限控制：后端校验，不依赖模型判断；4) 安全机制：白名单、限流、审批、日志；5) 监控：工具调用成功率、耗时、失败原因；6) 示例：查订单、创建工单、发送消息。" },
      { name: "多模态应用", desc: "处理图片、音频、视频的 AI 应用。", projectUse: "图片识别、语音转文字、视频分析。", mistake: "多模态成本更高，要权衡必要性。", understanding: "1) 图片理解：主流旗舰模型(GPT-5/Claude/Gemini)均原生支持看图；2) 语音转文字：Whisper API；3) 文字转语音：TTS API；4) 图片生成：DALL-E、Midjourney；5) 应用场景：商品图片识别、语音客服、视频字幕；6) 注意：多模态 Token 成本更高，处理时间更长。" },
      { name: "AI 应用部署", desc: "把 AI 应用部署到线上。", projectUse: "Vercel、Docker、云服务器。", mistake: "线上环境和本地环境可能不一样。", understanding: "1) 部署平台：Vercel(推荐 Next.js)、Railway、Render；2) 环境变量：API Key 不要硬编码；3) 限流：防止用户滥用；4) 监控：错误率、延迟、成本；5) 日志：记录所有 API 调用；6) 成本控制：设置预算告警。" },
      { name: "AI 项目选型指南", desc: "如何选择合适的 AI 技术方案。", projectUse: "新项目技术选型。", mistake: "不要为了用 AI 而用 AI，有些问题传统方案更好。", understanding: "1) 问题分类：问答→RAG、执行任务→Agent、内容生成→直接调用；2) 模型选择：简单任务→轻量模型(GPT-4o-mini/Claude Haiku)、复杂任务→旗舰模型(GPT-5/Claude/Gemini)、中文场景→国产模型(DeepSeek/通义/Kimi)；3) 成本评估：Token 费用 × 调用量 = 月成本；4) 合规要求：数据安全、隐私保护；5) 团队能力：不要选团队hold不住的技术；6) MVP 优先：先做最小可用版本，验证效果后再优化。" }
    ]
  },
  {
    title: "AI 行业应用案例",
    intro: "了解 AI 在各行各业的实际应用。",
    items: [
      { name: "智能客服", desc: "用 AI 替代或辅助人工客服。", projectUse: "本项目的核心场景。", mistake: "AI 客服不能完全替代人工，需要人机协作。", understanding: "1) 核心功能：FAQ 自动回复、工单创建、转人工；2) 技术栈：RAG + Agent + Webhook；3) 关键指标：解决率、转人工率、用户满意度；4) 常见问题：幻觉、检索不到、响应慢；5) 优化方向：知识库扩充、Prompt 优化、流程自动化。" },
      { name: "内容生成", desc: "用 AI 生成文章、营销文案、产品描述。", projectUse: "营销、运营、内容创作。", mistake: "AI 生成的内容需要人工审核，不能直接发布。", understanding: "1) 应用：文章生成、广告文案、产品描述、邮件模板；2) 技术：直接调用 LLM + Prompt 模板；3) 质量控制：人工审核、品牌调性检查；4) 批量生成：队列 + 流式输出；5) 版本管理：保存生成历史，便于对比。" },
      { name: "智能搜索", desc: "用 AI 提升搜索体验。", projectUse: "内部知识库、电商搜索。", mistake: "向量搜索不适合所有场景，要结合关键词搜索。", understanding: "1) 传统搜索：关键词匹配，找不到同义词；2) AI 搜索：语义理解，能找到意思相近的内容；3) 混合搜索：关键词 + 向量，效果最好；4) 应用：内部文档搜索、电商商品搜索、代码搜索；5) 优化：Query Rewrite、Rerank、个性化排序。" },
      { name: "代码助手", desc: "用 AI 辅助编程、代码审查、文档生成。", projectUse: "开发效率提升。", mistake: "AI 生成的代码需要仔细审查，可能有安全漏洞。", understanding: "1) 工具：Cursor、Claude Code、GitHub Copilot、Windsurf；2) 功能：代码补全、Bug 修复、代码解释、单元测试；3) 使用技巧：写好注释、提供上下文、分步骤提问；4) 注意：代码审查、安全检查、性能测试；5) 局限：复杂逻辑、架构设计、业务理解。" },
      { name: "数据分析", desc: "用 AI 分析数据、生成报表、发现趋势。", projectUse: "运营分析、用户画像、异常检测。", mistake: "AI 分析结果需要业务验证，不能盲目相信。", understanding: "1) 应用：数据清洗、趋势分析、异常检测、预测；2) 技术：自然语言查询(NL2SQL)、自动报表；3) 工具：ChatGPT Code Interpreter、专业 BI 工具；4) 价值：降低数据分析门槛、快速洞察；5) 风险：数据安全、结果准确性、隐私保护。" },
      { name: "AI 教育", desc: "用 AI 个性化学习、自动出题、智能辅导。", projectUse: "本项目就是 AI 教育应用。", mistake: "AI 辅导不能替代老师，要人机结合。", understanding: "1) 应用：个性化学习路径、自动出题、作业批改、答疑；2) 技术：RAG(知识问答)、Prompt(教学引导)、评估(学习效果)；3) 优势：24/7 可用、个性化、耐心；4) 局限：不能理解学生情感、可能给出错误答案；5) 本项目：全栈+AI 知识体系学习。" }
    ]
  },
  {
    title: "AI 前沿 (2026)",
    intro: "2026 年 AI 行业最新范式：Agent RL、记忆系统、世界模型、模型专业化，紧跟 arXiv 和产业一线。",
    items: [
      { name: "Agentic RL (Agent 强化学习)", desc: "用强化学习专门训练 AI Agent 的决策能力，2026 年 Agent 训练的主流方法。", projectUse: "训练客服 Agent 在多轮对话中自主选择最优工具和策略。", mistake: "Agentic RL 不是普通 RLHF，它训练的是多步决策而非单次回答。", understanding: "1) 核心思想：让 Agent 在模拟环境中反复试错，学习长期最优策略(而非单步正确)；2) 与 RLHF 区别：RLHF 训练单次回答质量，Agentic RL 训练多步交互的累积奖励；3) Token-In Token-Out：Agent 输入文本+工具调用，输出文本+动作，整个过程端到端训练；4) 训练流程：构建模拟环境→Agent 交互→收集轨迹→计算奖励→策略优化→循环；5) 框架：OpenAI、Anthropic、DeepSeek 都在用 Agentic RL 训练 Agent；6) 难点：奖励稀疏(多步后才知道对不对)、探索空间大(工具组合爆炸)、模拟环境搭建；7) 效果：Agentic RL 训练的 Agent 在企业级任务上比纯 SFT 提升 30-50%；8) 适用场景：复杂工作流、多工具协作、需要长期规划的任务。" },
      { name: "Agent 记忆系统 (Fact-Graph Memory)", desc: "让 Agent 拥有结构化长期记忆，能记住事实、关系和历史决策。", projectUse: "客服 Agent 记住用户历史问题、偏好、之前提到的订单号。", mistake: "把所有对话历史塞进上下文不是记忆系统，会爆 Token 且检索低效。", understanding: "1) 核心问题：Agent 需要长期记忆(跨会话)，但上下文窗口有限且成本高；2) 三种记忆：工作记忆(当前对话上下文)、情景记忆(历史对话摘要)、语义记忆(提取的事实和关系)；3) Fact-Graph Memory：把提取的事实存入知识图谱(实体+关系)，查询时图遍历+向量检索；4) 代表研究：Danus(数学推理 Agent 用 Fact-Graph Memory)、StateFuse(多 Agent 共享状态记忆)；5) 实现方式：对话→LLM 提取事实→存入图数据库/向量库→Agent 需要时检索；6) 关键设计：事实去重、冲突解决(同一用户两次说不同地址)、遗忘机制(过时信息清理)；7) 隐私：用户可查看/删除自己的记忆(GDPR)；8) 与 RAG 区别：RAG 检索知识库文档，Agent Memory 检索历史交互事实。" },
      { name: "World Models (世界模型)", desc: "让 AI 理解物理世界的因果关系，进行预测和规划，2026 年 AI 研究热点。", projectUse: "Agent 模拟操作后果再执行，避免真实系统中的错误操作。", mistake: "World Model 不是搜索引擎，它是理解因果关系的内部模拟器。", understanding: "1) 核心思想：Agent 内部构建一个'世界模型'，在行动前先在脑中模拟后果；2) 与 LLM 区别：LLM 是语言接龙(相关性)，World Model 是因果推理(如果做A会发生B)；3) 应用：自动驾驶(预测其他车的行为)、机器人(预测抓取结果)、游戏AI(预测对手策略)；4) 代表研究：2026 年 7 月 arXiv 发布《A Definition and Roadmap for World Models》系统梳理；5) 训练方式：从视频/模拟环境中学习物理规律和因果关系；6) 与 Agent 结合：Agent 用 World Model 做 planning(先模拟再行动)；7) 局限：计算开销大、需要大量环境数据、当前主要在游戏和自动驾驶领域；8) 趋势：2026 年 World Model 从学术走向产品(游戏AI、机器人控制)。" },
      { name: "模型专业化 (Specialization)", desc: "从通用大模型走向垂直领域专家模型，2026 年'专业化不可避免'成为共识。", projectUse: "医疗、法律、代码、科学等领域需要专业模型而非通用模型。", mistake: "专业化不等于小模型，而是用专业数据和 RL 让模型在特定领域超越通用模型。", understanding: "1) 趋势：通用模型(GPT-4/Claude)在所有领域都'还行'，但专业领域需要'极致'；2) 专业化路径：领域数据预训练→领域 SFT→领域 RLHF/Agentic RL；3) 代表：Claude Science(科研)、Claude Code(编程)、代码专用模型(DeepSeek-Coder)、数学专用模型；4) 2026 论文《Why Specialization Is Inevitable》：通用模型有天花板，专业模型用更少参数达到更好效果；5) 优势：效果更好、推理更快(模型更小)、成本更低(Token 更少)；6) 挑战：领域数据获取难、评估标准不统一、模型碎片化管理；7) 与微调区别：微调是通用模型适配，专业化是专门为某领域设计架构和训练流程；8) 选型：通用任务→通用模型、高频专业任务→专业模型、低频任务→通用模型+RAG。" },
      { name: "Agent 安全护栏 (Intent-Driven Guardrails)", desc: "基于意图推理的安全系统，能理解用户真实意图而非只匹配关键词。", projectUse: "识别用户是想正常查询还是试图绕过 AI 限制。", mistake: "关键词过滤已经不够了，2026 年的攻击用正常词汇绕过。", understanding: "1) 传统防护：关键词黑名单(容易绕过)、正则匹配(规则脆弱)；2) Intent-Driven Guardrails：用 LLM 分析用户意图，判断是否有害(即使字面无害)；3) 代表研究：DT-Guard(意图驱动推理训练的安全护栏)、Anthropic 的 jailbreak 严重性评分框架；4) 工作流程：用户输入→意图分析(是正常查询还是攻击？)→分级处理(放行/警告/拦截/转人工)；5) 多层防护：输入意图分析→Prompt 约束→输出校验→后端权限→审计日志；6) 与传统 WAF 区别：WAF 防网络攻击，Guardrails 防 AI 语义攻击；7) 行业协作：Anthropic 联合 Amazon/Google/Microsoft 建立 jailbreak 评分标准(Glasswing)；8) 关键能力：区分'好奇测试'和'恶意攻击'，不过度拦截正常用户。" },
      { name: "端侧 AI (On-Device AI)", desc: "在手机、PC、IoT 设备上直接运行 AI 模型，数据不出本地。", projectUse: "手机端 AI 助手、本地代码补全、隐私敏感场景。", mistake: "端侧 AI 不是把大模型塞进手机，而是用量化+蒸馏的小模型。", understanding: "1) 为什么需要：隐私(数据不出设备)、低延迟(不需要网络)、离线可用、成本低(不调 API)；2) 技术栈：量化(GPTQ/AWQ/GGUF)、蒸馏(大模型→小模型)、剪枝(去掉冗余参数)、推理引擎(llama.cpp/vLLM)；3) 代表：Apple Intelligence(端侧推理)、BaseRT(Apple Silicon 原生 Metal 加速)、Ollama(本地部署)；4) 模型规模：端侧通常 1B-7B 参数(手机)、7B-13B(PC)、70B+(服务器)；5) 硬件加速：NPU(手机神经处理单元)、GPU(CUDA/Metal)、专用 AI 芯片；6) 效果：7B 模型在手机上可达到 GPT-3.5 水平，适合简单任务；7) 局限：复杂推理仍需云端、多模态能力有限、模型更新需要 OTA；8) 趋势：2026 年'端云协同'成为主流(简单任务端侧，复杂任务云端)。" },
      { name: "实时语音 AI (Real-Time Voice AI)", desc: "AI 直接理解和生成语音，实现自然对话，延迟低于 500ms。", projectUse: "语音客服、语音助手、实时翻译。", mistake: "语音 AI 不是 ASR→LLM→TTS 三段拼接，而是端到端理解。", understanding: "1) 传统方式：语音→文字(ASR)→LLM 处理→文字→语音(TTS)，延迟 2-5 秒；2) 2026 方式：端到端语音模型直接理解语音并生成语音，延迟 < 500ms；3) 代表：GPT-4o 原生语音、Gemini Live、Hugging Face + Cerebras 实时语音(Gemma 4)；4) 能力：理解语气/情感/停顿、被打断后自然恢复、多语言实时切换；5) 技术：多模态模型(音频+文本联合训练)、流式生成(边听边说)、KV Cache 优化(低延迟)；6) 应用：语音客服(替代传统 IVR)、实时翻译、无障碍辅助、游戏 NPC；7) 挑战：背景噪声处理、多人同时说话、情感识别准确性；8) 与传统语音助手区别：Siri/Alexa 是命令式，2026 语音 AI 是对话式(能闲聊、能追问、能表达情感)。" },
      { name: "KV Cache 压缩", desc: "优化长上下文推理的显存和速度，2026 年长上下文部署的关键技术。", projectUse: "在有限 GPU 上运行 100K+ 上下文的模型服务。", mistake: "KV Cache 压缩不是裁剪 Prompt，而是在推理层优化显存占用。", understanding: "1) 核心问题：LLM 推理时每个 Token 的 Key-Value 都要存(KV Cache)，长上下文→显存爆炸；2) 压缩方法：DepthWeave-KV(跨层残差分解)、FreqDepthKV(频率引导深度共享)、稀疏注意力(只保留重要位置)；3) 效果：显存占用降低 50-80%，推理速度提升 2-3 倍，质量损失 < 2%；4) 与 Prompt Caching 区别：Prompt Caching 复用计算结果，KV Cache 压缩减少存储大小；5) 代表研究：2026 年 7 月多篇 arXiv 论文聚焦 KV Cache 优化；6) 实现：在推理引擎(vLLM/TGI)层面实现，应用层无感知；7) 适用场景：长上下文部署、多用户并发、边缘设备推理；8) 趋势：KV Cache 压缩 + 量化 + 稀疏注意力 = 2026 年长上下文部署三件套。" },
      { name: "AI 科学发现 (AI for Science)", desc: "AI 深度参与科学研究：假设生成、实验设计、数据分析、论文写作。", projectUse: "科研团队用 AI 加速文献综述、实验设计、数据分析。", mistake: "AI for Science 不是让 AI 替代科学家，而是加速科研流程。", understanding: "1) 代表产品：Claude Science(Anthropic，科研 AI 工作台)、AlphaFold(蛋白质结构)、GNoME(材料发现)；2) 能力：文献检索与综述、假设生成与验证、实验设计优化、数据分析可视化、论文草稿生成；3) Claude Science 特色：集成科研工具包(Jupyter/R/Python)、可审计产物(每次推理可追溯)、灵活计算资源；4) 应用领域：药物发现(加速分子筛选)、材料科学(预测新材料属性)、气候模型(模拟气候变化)；5) 关键要求：可审计性(每步推理有依据)、可复现性(代码+数据+环境)、领域专家监督；6) 局限：不能替代同行评审、不能独立做重大发现、需要领域知识指导；7) 趋势：2026 年'AI Scientist'从概念走向实验室日常工具；8) 伦理：AI 生成的科研成果需要明确标注，数据使用需要合规。" },
      { name: "多 Agent 编排 (Multi-Agent Orchestration)", desc: "多个 Agent 在生产环境中协作，有状态同步、冲突解决、故障恢复。", projectUse: "客服 Agent + 工单 Agent + 审核 Agent 协作处理复杂投诉。", mistake: "2026 年的 Multi-Agent 不是'多个 LLM 聊天'，而是有状态管理的生产系统。", understanding: "1) 2026 进化：从 Demo 级(多个 Agent 对话)→生产级(状态同步+冲突解决+故障恢复)；2) 状态管理：StateFuse(确定性冲突保留记忆)——多 Agent 共享状态时保留各自视角；3) 编排模式：Orchestrator(中心调度)、Event-Driven(事件驱动)、Hierarchical(层级分派)；4) 挑战与解决：通信延迟→异步消息队列、错误传播→隔离+重试、调试困难→分布式追踪；5) 代表框架：LangGraph(状态图)、CrewAI(角色扮演)、AutoGen(微软)；6) 与 Workflow 区别：Workflow=固定流程可预测，Multi-Agent=动态协作灵活但需约束；7) 生产级要求：熔断降级(一个 Agent 挂了不影响整体)、审计日志(每步决策可追溯)、成本控制(每个 Agent 的 Token 消耗)；8) 适用场景：企业级自动化、跨系统协作、需要多步推理的复杂任务。" },
      { name: "AI Coding Agent (成熟期)", desc: "2026 年 AI 编程从'辅助补全'进化为'自主完成任务'，成为开发者日常工具。", projectUse: "用 Claude Code/Cursor 自主定位 Bug、修改代码、运行测试、提交 PR。", mistake: "AI Coding Agent 不是替代程序员，而是把程序员从重复劳动中解放。", understanding: "1) 2026 现状：Claude Code 已从内部 CLI 成为 Anthropic 主力产品，Cursor 成为开发者标配；2) 能力进化：2024=代码补全→2025=单文件修改→2026=跨文件重构+测试+部署；3) 工作流程：理解代码库→定位问题→制定方案→修改代码→运行测试→验证→提交；4) 安全沙箱：在隔离环境执行代码(Docker/gVisor)，防止破坏宿主系统；5) 代表产品：Claude Code(CLI Agent)、Cursor(AI IDE)、GitHub Copilot Workspace、Windsurf；6) 效率：简单任务 10x、中等任务 3-5x、复杂架构仍需人工；7) 局限：大型代码库全局理解有限、架构决策仍需人工、安全敏感代码需审查；8) 趋势：2026 年'AI 协作编程'成为默认开发模式，开发者角色转向'AI 架构师'。" }
    ]
  }
];

export const featureMaps: FeatureMap[] = [
  {
    feature: "知识库上传",
    scenario: "商家上传 FAQ.pdf，系统自动解析、切片、生成向量，供后续 RAG 使用。",
    stack: ["文件上传", "对象存储", "knowledge_docs 表", "parse_queue 队列", "Worker 解析", "doc_chunks 表", "Embedding", "状态机", "失败原因", "权限校验", "日志"],
    tables: ["knowledge_docs", "doc_chunks", "parse_jobs", "audit_logs"],
    risks: ["文件过大", "格式不支持", "PDF 解析失败", "重复解析", "跨商家访问", "Embedding 失败"]
  },
  {
    feature: "AI 聊天问答",
    scenario: "用户提问，系统检索知识库并让模型基于引用回答。",
    stack: ["chat_sessions", "chat_messages", "SSE 流式接口", "RAG 检索", "Prompt 模板", "结构化输出", "引用来源", "AI 日志", "转人工规则"],
    tables: ["chat_sessions", "chat_messages", "retrieval_logs", "ai_reply_logs"],
    risks: ["检索不到", "模型幻觉", "回答无来源", "响应慢", "token 成本高", "低置信度没有转人工"]
  },
  {
    feature: "第三方 Webhook 接入",
    scenario: "企微或其他平台把用户消息推送到你的系统。",
    stack: ["Webhook 入口", "签名校验", "幂等 key", "ChannelAdapter", "消息标准化", "队列削峰", "失败重试", "审计日志"],
    tables: ["webhook_events", "channel_messages", "chat_sessions"],
    risks: ["伪造请求", "重复回调", "消息乱序", "平台超时", "失败无重试"]
  },
  {
    feature: "订单查询工具",
    scenario: "AI 在客服对话中调用后端工具查询订单状态。",
    stack: ["Tool Calling", "Tool Schema", "权限校验", "订单 API Adapter", "超时重试", "工具调用日志", "人工审批策略"],
    tables: ["tool_call_logs", "orders 或外部订单 API"],
    risks: ["越权查订单", "参数错误", "外部 API 超时", "敏感信息泄漏"]
  },
  {
    feature: "AI 质量评估",
    scenario: "用固定测试集评估 AI 客服回答质量。",
    stack: ["eval_cases", "eval_runs", "检索命中率", "回答准确率", "拒答率", "幻觉率", "成本/延迟统计", "回归对比"],
    tables: ["eval_cases", "eval_runs", "eval_results"],
    risks: ["只凭感觉判断", "没有失败案例库", "Prompt 改动不可回滚", "忽略成本和延迟"]
  }
];

export const learningTasks = [
  "HTTP Method / 状态码：为知识库模块设计 GET/POST/PATCH/DELETE。",
  "统一响应 / 错误码：设计 code/message/data/requestId。",
  "Controller / Service / Repository：拆解上传文档接口。",
  "参数校验 / DTO：设计 CreateKnowledgeDocDto。",
  "JWT / Session：解释登录态如何传递。",
  "RBAC / 数据权限：设计管理员、客服、运营权限。",
  "多租户 merchant_id：说明每张表为什么要有 merchant_id。",
  "数据库表设计：设计 users、merchants、knowledge_docs。",
  "索引 / 事务：为知识库列表设计索引。",
  "对象存储：设计 PDF 文件存储路径。",
  "Redis 缓存：设计商家配置缓存。",
  "Redis 限流：设计 AI 提问限流。",
  "分布式锁：防止同一文档重复解析。",
  "队列 / Worker：设计文档解析异步任务。",
  "重试 / 死信 / 幂等：设计解析失败处理。",
  "日志 / requestId：设计请求日志字段。",
  "Metrics / Tracing：设计 AI 耗时和错误率指标。",
  "Webhook：设计第三方消息接入入口。",
  "SSE / WebSocket：设计 AI 流式回复。",
  "Prompt 结构：写客服系统 Prompt。",
  "结构化输出：设计 answer/sources/confidence。",
  "Token / 上下文：控制 RAG 上下文长度。",
  "文档解析 / 清洗：列出 PDF 解析失败场景。",
  "Chunk 切片：设计切片大小和重叠。",
  "Embedding / 向量检索：解释语义搜索流程。",
  "Metadata Filter：按 merchant_id 过滤检索。",
  "Hybrid Search / Rerank：说明什么时候需要混合搜索。",
  "Query Rewrite：把用户口语问题改写成检索问题。",
  "引用来源 / 拒答：设计无答案拒答规则。",
  "AI 回复日志：设计 ai_reply_logs 字段。",
  "Tool Calling：设计 getOrderStatus 工具。",
  "工具权限：设计工具调用前权限校验。",
  "Workflow / Handoff：设计投诉转人工流程。",
  "Agent 状态：保存多步任务上下文。",
  "Prompt Injection：准备 5 条攻击测试。",
  "PII 脱敏：设计手机号脱敏规则。",
  "Guardrails：设计护栏组合。",
  "AI 评估集：准备 20 条测试问题。",
  "准确率 / 拒答率 / 幻觉率：计算一次评估结果。",
  "成本 / 延迟：设计 token 和耗时记录。",
  "Prompt 版本管理：设计 prompt_versions 表。",
  "模型路由 / 降级：设计简单任务和复杂任务模型选择。",
  "缓存一致性：更新知识库后如何刷新缓存。",
  "统计看板：设计咨询量 / 解决率 / 未命中问题。",
  "API 文档：写一个接口文档示例。",
  "Docker / PM2 / Nginx：画部署链路。",
  "环境变量 / 密钥：写 .env.example。",
  "备份 / 数据保留：设计聊天日志保留策略。",
  "CI/CD：设计提交后自动检查流程。",
  "安全总检查：用 OWASP API 思路检查接口。",
  "架构模块边界：设计 modules 目录。",
  "Provider / Adapter：设计 AIProvider 和 ChannelAdapter。",
  "降级方案：列出 5 个外部依赖失败处理。",
  "测试用例：写 10 条端到端测试。",
  "代码审查：让 AI 审查一次项目。",
  "README：写本地运行步骤。",
  "演示数据：准备一个火锅店知识库。",
  "作品介绍：写项目亮点。",
  "复盘卡点：列出下一阶段最需要补的 3 个点。",
  "是否买课判断：根据卡点决定是否买专项课。",
  "Agentic RL：用 LangGraph 搭建一个 Agent 模拟环境，观察多步决策轨迹。",
  "Fact-Graph Memory：设计一个从对话中提取事实并存入图数据库的流程。",
  "World Model：用 LLM 模拟一个'如果用户执行X操作会怎样'的规划模块。",
  "模型专业化：对比通用模型和代码专用模型在同一编程任务上的表现。",
  "Intent-Driven Guardrails：准备 10 条意图攻击样本，测试关键词过滤 vs 意图分析的拦截率。",
  "端侧 AI：用 Ollama 在本地部署 7B 模型，测试问答和代码补全效果。",
  "KV Cache 压缩：用 vLLM 部署长上下文模型，对比压缩前后的显存占用和延迟。",
  "AI for Science：用 Claude Science 或类似工具完成一次文献综述 + 数据分析。",
  "Multi-Agent Orchestration：用 LangGraph 设计一个多 Agent 客服系统，含状态同步和故障恢复。",
  "AI Coding Agent：用 Claude Code 自主修复一个中等难度 Bug，记录完整流程。",
  "实时语音 AI：对比传统 ASR→LLM→TTS 和端到端语音模型的延迟差异。",
  "Agent 安全总检查：设计一套完整的 Agent 安全护栏方案(输入→推理→输出→权限→审计)。"
];

export const glossary = [
  ...backendGroups.flatMap(group => group.items.map(item => ({ term: item.name, desc: item.desc + " 项目中：" + item.projectUse }))),
  ...aiGroups.flatMap(group => group.items.map(item => ({ term: item.name, desc: item.desc + " 项目中：" + item.projectUse }))),
  { term: "多租户", desc: "一套系统服务多个商家或组织，关键是数据、权限、配置隔离。" },
  { term: "状态机", desc: "把业务对象的状态和可执行动作定义清楚，例如 waiting_parse -> processing -> success/failed。" },
  { term: "死信队列", desc: "多次处理失败的任务进入死信，等待人工处理或后续排查。" },
  { term: "OpenAPI / Swagger", desc: "接口文档规范，帮助前后端和 AI 工具理解接口结构。" },
  { term: "BOLA", desc: "Broken Object Level Authorization，对象级越权，API 安全高风险问题。" },
  { term: "Agentic RL", desc: "用强化学习专门训练 AI Agent 的多步决策能力，2026 年 Agent 训练主流方法。" },
  { term: "Fact-Graph Memory", desc: "Agent 的结构化长期记忆，把事实存入知识图谱，支持图遍历+向量检索。" },
  { term: "World Model", desc: "让 AI 理解物理世界因果关系的内部模拟器，在行动前先预测后果。" },
  { term: "Intent-Driven Guardrails", desc: "基于意图推理的 AI 安全系统，理解用户真实意图而非只匹配关键词。" },
  { term: "On-Device AI", desc: "在手机/PC/IoT 设备上直接运行 AI 模型，数据不出本地。" },
  { term: "KV Cache 压缩", desc: "优化长上下文推理的显存和速度，2026 年长上下文部署关键技术。" },
  { term: "AI for Science", desc: "AI 深度参与科学研究：假设生成、实验设计、数据分析、论文写作。" },
  { term: "Model Specialization", desc: "从通用大模型走向垂直领域专家模型，用专业数据和 RL 达到极致效果。" },
  { term: "端云协同", desc: "简单任务在端侧设备执行，复杂任务上传云端，2026 年主流部署模式。" }
];

export type Resource = {
  name: string;
  url: string;
  category: string;
  note?: string;
};

export const resources: Resource[] = [
  { name: "Agnes 2.0 Flash 文档", url: "https://agnes-ai.com/zh-Hans/docs/agnes-20-flash", category: "本站 AI 助手", note: "本站 Ask AI 使用的模型文档" },
  { name: "Agnes Cherry Studio 集成文档", url: "https://agnes-ai.com/zh-Hans/docs/cid6", category: "本站 AI 助手" },
  { name: "MDN Web 文档（中文）", url: "https://developer.mozilla.org/zh-CN/", category: "前端", note: "HTML/CSS/JS 最权威的入门与查询手册" },
  { name: "MDN HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP", category: "前端", note: "理解前后端通信的地基" },
  { name: "React 官方文档（中文）", url: "https://zh-hans.react.dev/", category: "前端", note: "新版文档对初学者非常友好，从 Hooks 讲起" },
  { name: "Next.js 官方文档", url: "https://nextjs.org/docs", category: "前端", note: "本项目使用的框架，重点看 App Router 部分" },
  { name: "TypeScript 官方手册", url: "https://www.typescriptlang.org/docs/handbook/intro.html", category: "前端" },
  { name: "Node.js Learn", url: "https://nodejs.org/learn/getting-started/introduction-to-nodejs", category: "后端" },
  { name: "Express Guide", url: "https://expressjs.com/en/guide/routing/", category: "后端" },
  { name: "PostgreSQL Docs", url: "https://www.postgresql.org/docs/current/", category: "后端" },
  { name: "Prisma 文档", url: "https://www.prisma.io/docs", category: "后端", note: "Node.js 生态最常用的 ORM，类型安全" },
  { name: "Redis Docs", url: "https://redis.io/docs/latest/", category: "后端" },
  { name: "Docker Docs", url: "https://docs.docker.com/get-started/", category: "部署运维" },
  { name: "Nginx Docs", url: "https://nginx.org/en/docs/", category: "部署运维" },
  { name: "OWASP API Security", url: "https://owasp.org/API-Security/editions/2023/en/0x11-t10/", category: "安全", note: "API 安全十大风险，做后端必读" },
  { name: "OpenAI 开发文档", url: "https://platform.openai.com/docs", category: "AI 应用", note: "模型调用、结构化输出、工具调用的官方参考" },
  { name: "Anthropic (Claude) 文档", url: "https://docs.anthropic.com/", category: "AI 应用", note: "Tool Use、Prompt 工程指南写得非常好" },
  { name: "Vercel AI SDK", url: "https://sdk.vercel.ai/docs", category: "AI 应用", note: "Next.js 项目里做流式对话最顺手的 SDK" },
  { name: "LangGraph 文档", url: "https://langchain-ai.github.io/langgraph/", category: "AI 应用", note: "Agent 编排与状态管理框架" },
  { name: "pgvector", url: "https://github.com/pgvector/pgvector", category: "AI 应用", note: "PostgreSQL 向量扩展，RAG 入门首选" },
  { name: "OpenAI Cookbook", url: "https://cookbook.openai.com/", category: "AI 应用", note: "大量可直接跑的示例代码" }
];
