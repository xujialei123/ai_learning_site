import type { KnowledgeItem } from "./content";

/** 按知识点名称补充速记、要点、面试答法——不用改 content.ts 几万字正文 */
export const knowledgeMemoryPatches: Record<string, Partial<KnowledgeItem>> = {
  "事件循环与非阻塞 IO": {
    oneLine: "单线程接客，IO 交给系统异步干，CPU 活别堵在门口。",
    analogy: "像餐厅只有一个服务员，点单后厨房做菜（IO）不用他站着等，他继续接待下一桌；但如果他在门口削土豆（同步 CPU），所有客人都得等。",
    keyPoints: [
      "主线程只做调度，网络/文件/数据库 IO 异步完成",
      "每轮循环：timers → poll → check，中间清空微任务(Promise)",
      "同步 JSON.parse、bcrypt、readFileSync 会阻塞全部请求",
      "CPU 密集用 worker_threads，监控 event loop delay > 100ms"
    ],
    interviewQA: {
      question: "Node.js 单线程为什么能扛高并发？什么会阻塞？",
      answer: "因为 IO 非阻塞，一个线程可同时挂起大量请求等 IO 回调；阻塞来自同步 CPU 计算（大 JSON、加密、正则灾难）。生产环境用 worker 或独立服务处理 CPU 任务，并监控事件循环延迟。"
    },
    memoryTip: "记法：IO 异步 = 高并发；CPU 同步 = 全员卡顿"
  },
  "REST API 设计": {
    oneLine: "用名词表资源，用 HTTP 动词表动作，别把所有事都 POST。",
    analogy: "资源像图书馆的书架标签，GET 是查阅，POST 是新增藏书，PATCH 是改某一栏，DELETE 是下架。",
    keyPoints: [
      "URL 用名词复数：/knowledge-docs，不用 /getDocs",
      "GET 查询、POST 创建(201)、PATCH 部分更新、DELETE 删除(204)",
      "查询参数做过滤/排序/分页：?status=active&page=1",
      "POST 非幂等，支付/创建要带幂等键"
    ],
    interviewQA: {
      question: "如何设计 RESTful API？PUT 和 PATCH 区别？",
      answer: "资源用名词+HTTP Method 表达语义；GET/PUT/DELETE 幂等，POST 创建非幂等。PUT 全量替换整个资源，PATCH 只更新传入字段。列表要分页，响应用统一格式和合理状态码。"
    },
    memoryTip: "POST 创建、GET 查、PATCH 改局部、DELETE 删——四个动词先背熟"
  },
  "幂等设计": {
    oneLine: "同一请求执行多次，结果和执行一次一样。",
    keyPoints: [
      "客户端带幂等键(Idempotency-Key)，服务端 Redis/DB 去重",
      "数据库 UNIQUE 约束兜底（订单号、业务键）",
      "支付回调、Webhook、队列重试必须幂等",
      "GET/PUT/DELETE 天然幂等，POST 需要额外设计"
    ],
    interviewQA: {
      question: "接口幂等怎么实现？哪些场景必须做？",
      answer: "客户端生成唯一幂等键，服务端记录已处理 ID 或依赖唯一索引；典型场景：支付回调、表单重复提交、消息队列重试、Webhook。POST 创建类接口必做，GET 天然幂等。"
    },
    memoryTip: "幂等 = 重复点提交也不会多扣钱、多建单"
  },
  "JWT / Session": {
    oneLine: "JWT 无状态带证，Session 有状态存服务端。",
    keyPoints: [
      "JWT：Header+Payload+Signature，适合分布式，难主动失效",
      "Session：服务端存会话，可随时踢下线，分布式要共享存储",
      "access 短期(15min) + refresh 长期，refresh 存库可撤销",
      "Token 放 httpOnly Cookie 比 localStorage 更安全"
    ],
    interviewQA: {
      question: "JWT 和 Session 怎么选？",
      answer: "单体/要强登出控 Session；前后端分离/微服务用 JWT。安全要求高可 JWT+Redis 黑名单。access 短、refresh 长，改密码后使旧 refresh 失效。"
    },
    memoryTip: "JWT=自带身份证；Session=前台登记本"
  },
  "Redis 缓存": {
    oneLine: "把热点数据放内存，少打数据库。",
    keyPoints: [
      "适合读多写少，命中率目标 >80%",
      "String/Hash/ZSet 按场景选，别什么都 String",
      "必须设 TTL，永不过期会读到脏数据",
      "写数据后删缓存(Cache Aside)，不要直接更新缓存"
    ],
    interviewQA: {
      question: "Redis 在项目里有哪些典型用法？",
      answer: "缓存热点配置、限流计数、分布式锁、轻量队列、Session。核心是减轻 DB 压力，但要处理一致性、穿透/击穿/雪崩，并设合理 TTL。"
    },
    memoryTip: "缓存/限流/锁/队列——面试说这四个场景就够"
  },
  "缓存穿透 / 击穿 / 雪崩": {
    oneLine: "穿透查不存在、击穿热点过期、雪崩集体失效。",
    keyPoints: [
      "穿透：恶意查不存在 ID → 缓存空值或布隆过滤器",
      "击穿：热点 key 过期瞬间 → 互斥锁或逻辑不过期+异步刷新",
      "雪崩：大量 key 同时过期或 Redis 宕机 → TTL 加随机、多级缓存、熔断",
      "监控命中率，低于 80% 要排查"
    ],
    interviewQA: {
      question: "缓存穿透、击穿、雪崩分别是什么？怎么解决？",
      answer: "穿透是查不存在数据每次都打到 DB，用空值缓存或布隆过滤器；击穿是热点 key 过期并发打穿，用互斥锁或永不过期异步更新；雪崩是大量 key 同时失效或 Redis 挂了，用 TTL 随机化、多级缓存和降级。"
    },
    memoryTip: "穿=假 ID，击=热 key，崩=一起挂"
  },
  "超时、重试与熔断": {
    oneLine: "设超时防拖死，可重试带退避，连续失败就熔断。",
    keyPoints: [
      "fetch 默认无超时，必须 AbortController 包装",
      "只重试 502/503/超时，不重试 400/401/404",
      "POST 重试要带幂等键",
      "熔断：连续失败后快速失败，给下游恢复时间"
    ],
    interviewQA: {
      question: "调用下游 AI API 如何做超时、重试、熔断？",
      answer: "分层超时（连接 3s、AI 生成 60s）；只重试可恢复错误+指数退避；连续失败触发熔断返回降级（缓存/转人工）。POST 必须幂等，避免重试重复扣费。"
    },
    memoryTip: "超时保命、重试救急、熔断止损"
  },
  "Controller": {
    oneLine: "只接请求、校验参数、调 Service、返回响应。",
    keyPoints: [
      "不写业务逻辑，不直接操作数据库",
      "解析 params/query/body，调用 Service",
      "异常交给全局错误中间件",
      "一个 Controller 对应一个资源路由组"
    ],
    interviewQA: {
      question: "Controller / Service / Repository 各干什么？",
      answer: "Controller 处理 HTTP 入参出参；Service 编排业务规则和事务；Repository 封装数据库读写。这样换框架只改 Controller 薄层，业务可单测。"
    },
    memoryTip: "C 接待、S 办事、R 找档案"
  },
  "什么是 RAG": {
    oneLine: "先查资料再回答，不是让模型背你的数据。",
    analogy: "开卷考试：考生(LLM)不会背全书，你先帮他翻到相关页(检索)，他再根据页内容作答。",
    keyPoints: [
      "解决 LLM 不知道私有数据、会幻觉的问题",
      "流程：问题 → 检索 chunks → 拼进 Prompt → 生成",
      "不训练模型，文档更新即可生效",
      "必须带来源引用，不知道就拒答"
    ],
    interviewQA: {
      question: "RAG 是什么？和微调有什么区别？",
      answer: "RAG 是检索增强生成：先向量/关键词检索知识库片段，再让 LLM 基于片段回答。微调改模型权重、成本高、更新慢；RAG 适合企业知识库问答，数据可实时更新且可追溯来源。"
    },
    memoryTip: "RAG = 检索 + 生成，不是训练"
  },
  "什么是 Agent": {
    oneLine: "能自己选工具、多步执行任务的 AI，不是只会聊天。",
    keyPoints: [
      "聊天=问答，Agent=完成任务（查单、建工单）",
      "核心：理解意图 → 选工具 → 执行 → 观察结果 → 循环",
      "工具真正执行在后端，模型只输出调用意图",
      "必须有权限、步数限制、日志审计"
    ],
    interviewQA: {
      question: "AI Agent 和普通聊天机器人有什么区别？",
      answer: "聊天机器人只做文本问答；Agent 能根据任务自主选择并调用工具（查数据库、调 API），多步循环直到完成。工程上关键是 Tool Schema、权限校验、最大步数、人工审批和全链路日志。"
    },
    memoryTip: "Chat 动嘴，Agent 动手"
  },
  "Agent Loop (ReAct)": {
    oneLine: "想一步 → 做一步 → 看结果 → 再想，直到做完或超限。",
    keyPoints: [
      "Thought → Action → Observation 循环",
      "必须设最大步数（如 10 步）防死循环",
      "相同工具+参数连调 3 次要停止",
      "Workflow 固定流程更稳，Agent 动态但更不可控"
    ],
    interviewQA: {
      question: "Agent Loop 是什么？和 Workflow 怎么选？",
      answer: "Agent Loop 是 ReAct 循环：模型推理后选工具执行，观察结果再继续，直到任务完成或触达步数/超时上限。Workflow 适合投诉、审批等固定流程；Agent 适合开放性问题但要加步数限制、白名单和人工兜底。"
    },
    memoryTip: "ReAct = Reason + Act，想完再做"
  },
  "Tool Calling": {
    oneLine: "模型说想调哪个工具，后端校验后才真执行。",
    keyPoints: [
      "模型输出工具名+JSON 参数，不直接执行",
      "后端校验权限、参数、幂等后再调业务",
      "OpenAI function calling / Claude tool_use 是标准形态",
      "每次调用记日志：工具、参数、结果、耗时"
    ],
    interviewQA: {
      question: "Function Calling 完整流程？安全注意什么？",
      answer: "用户提问→LLM 返回 tool_calls→后端校验权限和参数→执行→结果回传 LLM→生成最终回复。安全：工具白名单、参数防注入、敏感操作审批、最大步数、全量审计日志，绝不信任模型绕过权限。"
    },
    memoryTip: "模型提议，后端拍板"
  },
  "Chunk 切片": {
    oneLine: "长文档切成小块，方便检索又不丢上下文。",
    keyPoints: [
      "常见 500 Token，重叠 15%（50-100 Token）",
      "按标题/段落切比硬切句子好",
      "表格、代码块尽量保持完整",
      "chunk 要带 doc_id、页码、标题等元数据"
    ],
    interviewQA: {
      question: "RAG 切片大小怎么定？切太大太小有什么问题？",
      answer: "一般 200-1000 Token，常用 500，重叠 15% 防语义断裂。太大检索不精准、浪费 Token；太小丢上下文、答案不完整。按文档结构切分，保留元数据，用评估集反调参数。"
    },
    memoryTip: "500 字块 + 15% 重叠，先记这组数"
  },
  "Embedding": {
    oneLine: "把文字变成数字向量，语义相近的距离就近。",
    keyPoints: [
      "只用于检索相似内容，不负责生成答案",
      "中文常用 bge-large-zh，英文 OpenAI embedding",
      "相同文本可缓存向量，模型升级要重算",
      "和 pgvector/Pinecone 配合做 ANN 搜索"
    ],
    interviewQA: {
      question: "Embedding 是什么？在 RAG 里起什么作用？",
      answer: "把文本编码为高维向量，语义相近的文本向量距离近。RAG 中对问题和 chunk 都做 Embedding，用余弦相似度找 TopK，再交给 LLM 生成。选模型要看语种、维度和成本。"
    },
    memoryTip: "Embedding 找相似，LLM 写答案——别搞反"
  },
  "Hybrid Search": {
    oneLine: "向量找语义 + 关键词找精确，两个结果合并。",
    keyPoints: [
      "向量擅长口语化，关键词擅长订单号/型号",
      "常用 RRF 或加权融合排序",
      "默认向量 70% + 关键词 30% 可调",
      "专有名词查询应提高关键词权重"
    ],
    interviewQA: {
      question: "为什么 RAG 要做 Hybrid Search？",
      answer: "纯向量对订单号、SKU、专有名词召回差；纯关键词不懂同义改写。混合搜索各取所长，再 Rerank 提升 Top 结果质量，是企业知识库标配。"
    },
    memoryTip: "向量懂意思，关键词懂编号"
  },
  "Rerank": {
    oneLine: "粗召回 20 条后，用精排模型挑出最相关的 3-5 条。",
    keyPoints: [
      "向量召回快但不准，Rerank 慢但准",
      "流程：召回 Top20-50 → Rerank → 取 Top3-5 给 LLM",
      "BGE-Reranker / Cohere Rerank 常用",
      "延迟 +100-500ms，命中率可提升 20-30%"
    ],
    interviewQA: {
      question: "Rerank 解决什么问题？和 Embedding 检索区别？",
      answer: "Embedding 双塔检索快但精度有限；Rerank 用 Cross-Encoder 对 query-chunk 对精细打分。先宽召回再精排，是 RAG 提质的关键一环。"
    },
    memoryTip: "先捞一大网(召回)，再挑肥瘦(重排)"
  },
  "结构化输出": {
    oneLine: "让模型输出 JSON，后端直接校验，别用正则抠自然语言。",
    keyPoints: [
      "定义 Schema：answer、sources、confidence、need_handoff",
      "OpenAI JSON mode / function calling 约束格式",
      "Zod 校验，失败则重试或降级",
      "流式场景需结束后拼接再解析"
    ],
    interviewQA: {
      question: "如何让 LLM 稳定输出 JSON？失败怎么处理？",
      answer: "用 JSON mode 或 function calling 绑定 Schema，Prompt 给示例；后端 Zod 校验，格式错误重试 1-2 次或走默认降级。流式输出等完成后统一解析，边流边解析易碎。"
    },
    memoryTip: "Schema 定格式，Zod 验真假"
  },
  "Prompt Injection 防护": {
    oneLine: "用户输入里藏指令骗模型，要多层防御不能只靠 Prompt。",
    keyPoints: [
      "攻击：忽略规则、泄露 System Prompt、越权调工具",
      "输入过滤 + System 约束 + 后端权限校验",
      "即使模型被骗，后端仍拒绝无权限操作",
      "记录可疑输入，定期红队测试"
    ],
    interviewQA: {
      question: "如何防止 Prompt Injection？",
      answer: "分层防护：输入检测危险模式、System Prompt 明确禁止、检索和输出过滤、工具调用后端强制鉴权。核心原则：永远不要信任模型输出能替代权限系统。"
    },
    memoryTip: "Prompt 是软防线，后端权限是硬防线"
  },
  "Token 与上下文": {
    oneLine: "Token 计费和容量单位，塞太多又贵又慢还可能忘前文。",
    keyPoints: [
      "中文约 1-2 Token/字，输入+输出都计费",
      "上下文 = 输入上限，不是越大越好",
      "RAG 控制 chunk 数量，聊天限制历史条数",
      "监控每次调用的 token 用量"
    ],
    interviewQA: {
      question: "Token、上下文窗口、成本什么关系？",
      answer: "Token 是计费单位；上下文窗口是单次请求输入+输出总上限。塞满上下文成本高、延迟大，且中间可能 lost in the middle。实践：限制历史、压缩 RAG、简单任务用小模型。"
    },
    memoryTip: "Token=钱+时间，上下文不是免费无限"
  },
  "拒答策略": {
    oneLine: "知识库没有依据时，说不知道并转人工，绝不编造。",
    keyPoints: [
      "相似度 < 0.6 或置信度低时拒答",
      "拒答话术固定，自动转人工或建工单",
      "收集拒答问题反哺知识库",
      "客服场景宁可拒答，不可幻觉"
    ],
    interviewQA: {
      question: "RAG 系统什么时候该拒答？怎么评估？",
      answer: "检索 TopK 相似度低于阈值、或多源矛盾、模型置信度低时应拒答并转人工。评估拒答率（不能太高）和拒答准确率（该拒必须拒），用固定评估集回归测试。"
    },
    memoryTip: "不会就说不会——客服铁律"
  }
};
