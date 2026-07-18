export type ShortcutRow = {
  action: string;
  keys: string;
  note?: string;
};

export type ToolOps = {
  id: string;
  name: string;
  form: string;
  when: string;
  shortcuts: ShortcutRow[];
  modes: { name: string; use: string }[];
  mustDo: string[];
};

export type DirectPattern = {
  title: string;
  bad: string;
  good: string;
  why: string;
};

export type ScenarioPlaybook = {
  id: string;
  scene: string;
  steps: string[];
  prompt: string;
};

/** 各工具核心操作 */
export const toolOps: ToolOps[] = [
  {
    id: "cursor",
    name: "Cursor",
    form: "AI 原生 IDE",
    when: "日常写代码、改小功能、边看边改的主力环境",
    shortcuts: [
      { action: "接受灰色补全", keys: "Tab", note: "连续补全可连按" },
      { action: "拒绝补全", keys: "Esc" },
      { action: "内联编辑选中代码", keys: "Ctrl/Cmd + K" },
      { action: "打开侧边对话", keys: "Ctrl/Cmd + L" },
      { action: "Agent / Composer", keys: "Ctrl/Cmd + I 或切 Agent 面板" },
      { action: "引用文件/文件夹", keys: "对话里输入 @", note: "@文件 @文件夹 @Docs @Web" },
      { action: "看改动 diff", keys: "Agent 完成后在 diff 里逐文件审查" }
    ],
    modes: [
      { name: "Tab 补全", use: "写重复模式、补全函数体，速度最快" },
      { name: "Inline Edit (Cmd+K)", use: "改当前选中几行，范围可控" },
      { name: "Chat", use: "问为什么、解释报错、要方案不直接大改" },
      { name: "Agent", use: "跨多文件实现功能；必须看 diff 再 Accept" }
    ],
    mustDo: [
      "项目根建 .cursor/rules，写分层、响应格式、禁止事项",
      "大任务拆成「一次只改一个模块」",
      "永远先看 diff，别点 Accept All 盲批",
      "敏感操作（删库、鉴权、支付）人工逐行读"
    ]
  },
  {
    id: "claude-code",
    name: "Claude Code",
    form: "终端 CLI Agent",
    when: "大规模重构、跨很多文件、需要先规划再动手的长任务",
    shortcuts: [
      { action: "启动", keys: "项目目录执行 claude" },
      { action: "初始化项目说明", keys: "/init", note: "生成 CLAUDE.md" },
      { action: "切换 Plan Mode", keys: "Shift + Tab", note: "先方案后执行" },
      { action: "压缩上下文", keys: "/compact" },
      { action: "查看帮助", keys: "/help" },
      { action: "退出", keys: "/exit 或 Ctrl+C" }
    ],
    modes: [
      { name: "普通对话执行", use: "小改动、查问题、跑测试" },
      { name: "Plan Mode", use: "复杂任务必开：先出计划，你批准再改代码" },
      { name: "子代理/并行", use: "大任务拆子任务时由它编排（视版本能力）" }
    ],
    mustDo: [
      "进项目先 /init，把规范写进 CLAUDE.md",
      "复杂任务永远 Plan Mode，看懂再放行",
      "命令执行权限保持「每次确认」",
      "长任务用 tmux/稳定终端，避免断线丢会话"
    ]
  },
  {
    id: "codex",
    name: "OpenAI Codex",
    form: "CLI + 云端 Agent",
    when: "批量模式化改动、云端跑测试并自动提 PR",
    shortcuts: [
      { action: "本地 CLI 启动", keys: "codex（项目目录）" },
      { action: "云端任务", keys: "ChatGPT → Codex → 绑 GitHub → 丢任务" },
      { action: "项目说明", keys: "仓库放 AGENTS.md" }
    ],
    modes: [
      { name: "本地 CLI", use: "交互式改代码，类似终端 Agent" },
      { name: "云端 Agent", use: "沙箱执行、跑测、开 PR；可多任务并行" }
    ],
    mustDo: [
      "适合「全项目换日志 / 批量加类型」这类模式化活",
      "复杂业务架构仍用 Claude Code / Cursor Agent 交互式做",
      "PR 必须人工审查再合并",
      "AGENTS.md 写清结构与禁止事项，提高云端成功率"
    ]
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    form: "IDE 插件",
    when: "不换编辑器、先体验补全与对话",
    shortcuts: [
      { action: "接受补全", keys: "Tab" },
      { action: "内联对话", keys: "Ctrl/Cmd + I（以当前版本为准）" },
      { action: "打开 Chat", keys: "侧边栏 Copilot Chat" }
    ],
    modes: [
      { name: "补全", use: "写代码时灰色建议" },
      { name: "Chat / Agent", use: "解释、小改、逐步增强到跨文件" }
    ],
    mustDo: [
      "打开相关文件再提问，补全质量靠上下文",
      "学生可认证免费 Pro",
      "重型重构仍建议上 Cursor Agent 或 Claude Code"
    ]
  },
  {
    id: "domestic",
    name: "国产工具（Trae / 通义 / Comate / CodeBuddy）",
    form: "IDE 或插件",
    when: "免翻墙、免费额度、中文需求、小程序/阿里云生态",
    shortcuts: [
      { action: "Trae SOLO/Builder", keys: "侧栏切 SOLO，丢完整需求" },
      { action: "通义 @workspace", keys: "对话里 @workspace 问全库" },
      { action: "Comate Plan / Ask", keys: "右上角切模式与模型" },
      { action: "CodeBuddy Craft", keys: "复杂任务用 Craft，先建依赖图" }
    ],
    modes: [
      { name: "补全 + 对话", use: "日常与海外工具类似" },
      { name: "SOLO / Zulu / Craft", use: "从需求到多文件改动，记得拆任务、审代码" }
    ],
    mustDo: [
      "生成项目要自己跑通并读懂",
      "Java/Go 优先通义；小程序优先 CodeBuddy",
      "规则/规范同样要写进项目说明文件"
    ]
  }
];

/** 指挥原则：坏说法 vs 好说法 */
export const directPatterns: DirectPattern[] = [
  {
    title: "先契约，后实现",
    bad: "帮我写个上传接口",
    good: "先给出 OpenAPI/Zod：路径 POST /api/knowledge-docs，字段 title+file，错误码；我确认后再写 Controller/Service/Repository。",
    why: "先钉死输入输出，避免 AI 乱猜字段导致返工。"
  },
  {
    title: "点名分层与目录",
    bad: "实现登录功能",
    good: "按 modules/auth 分层：route 只接参，Service 写 bcrypt+JWT，Repository 访库；不要把 SQL 写进 route.ts。",
    why: "不说分层，AI 容易把所有逻辑堆进一个文件。"
  },
  {
    title: "写清非功能需求",
    bad: "做一个聊天",
    good: "SSE 流式；每用户每分钟 20 次限流；超时 60s；日志带 requestId；跨租户必须 403。",
    why: "限流、超时、权限 AI 默认不会主动做全。"
  },
  {
    title: "给验收标准",
    bad: "优化一下",
    good: "完成后：npm test 全绿；用商家 A token 访问 B 的文档返回 403；重复提交不建双份。",
    why: "可测的完成条件，AI 才知道什么叫做完。"
  },
  {
    title: "约束改动范围",
    bad: "顺便把项目重构一下",
    good: "只改 modules/knowledge 与对应测试；不要升级大版本依赖；不要动 auth。",
    why: "范围失控是 Agent 最大风险之一。"
  },
  {
    title: "一次一事",
    bad: "加上传、解析、向量检索、聊天、部署全做了",
    good: "本轮只做：上传 API + 落库 + 状态=uploaded。下一轮再做队列 Worker。",
    why: "步子越小，diff 越好审，翻车越好回滚。"
  }
];

/** 指挥 AI 的标准五段式 */
export const promptSkeleton = `你是资深全栈工程师。当前项目：【技术栈 / 目录约定】。

【目标】一句话说明要完成什么。

【约束】
- 分层：Controller / Service / Repository
- 统一响应：{ code, message, data, requestId }
- 多租户：所有查询带 merchantId
- 不要改：【列出文件或模块】
- 不要引入未核实的依赖包

【验收】
1. …
2. …
3. 跑：npm test / curl 示例

【先做】若任务复杂：先输出实现计划与将改文件列表，等我确认后再改代码。`;

/** 场景剧本 */
export const scenarioPlaybooks: ScenarioPlaybook[] = [
  {
    id: "new-api",
    scene: "新增一个后端接口",
    steps: [
      "让 AI 先出 Zod schema + 示例请求/响应",
      "你确认字段与错误码",
      "再让它按分层实现，并补集成测试",
      "本地 curl 验收后再提交"
    ],
    prompt: `在现有分层约定下新增 POST /api/xxx。
先只输出：路径、Zod schema、成功/失败响应示例、涉及文件列表。
不要写实现代码，等我回复「按此实现」。`
  },
  {
    id: "fix-bug",
    scene: "修 Bug",
    steps: [
      "贴报错栈、复现步骤、期望行为",
      "要求先定位根因，不要直接大面积改",
      "给最小修复 + 回归测试",
      "你验证复现路径消失"
    ],
    prompt: `Bug：【现象】
复现：【步骤】
期望：【结果】
相关日志/requestId：【】
请先分析可能根因（列 3 个假设），指出最可能的文件与函数；
经我确认后再做最小修复，并补一条能抓住该 Bug 的测试。`
  },
  {
    id: "refactor",
    scene: "重构 / 拆文件",
    steps: [
      "开 Plan Mode 或先要计划",
      "要求行为不变、测试先绿",
      "按文件分批改，每批审查",
      "禁止顺手加新功能"
    ],
    prompt: `重构【模块名】：目标是可读性与分层，行为完全不变。
先输出计划与文件列表；保持现有测试通过；禁止新功能；
每改完一个文件暂停等我审查。`
  },
  {
    id: "test",
    scene: "补测试",
    steps: [
      "指定测纯逻辑还是接口",
      "要求 Mock 外部 AI/支付",
      "列出边界用例",
      "跑通 npm test"
    ],
    prompt: `为【函数/接口】补 Vitest。
覆盖：正常路径、鉴权失败、跨租户 403、参数错误。
Mock 掉 LLM/Embedding。完成后执行测试并汇报结果。`
  },
  {
    id: "deploy",
    scene: "写部署相关文件",
    steps: [
      "说明目标环境：单机 Docker / Nginx",
      "要求多阶段 Dockerfile + compose + nginx.conf",
      "健康检查与 SSE 反代注意点写进注释",
      "你在本机 compose up 验证"
    ],
    prompt: `为当前 Next.js 项目写生产向 Dockerfile（多阶段、非 root）、
docker-compose.prod.yml（web/worker/postgres/redis/nginx）、
nginx 反代（SSE 关缓冲、上传 20m）。
附启动与回滚命令；不要把 .env 打进镜像。`
  },
  {
    id: "explain",
    scene: "学习：让 AI 当导师",
    steps: [
      "先自己写或先读代码",
      "问为什么，不要直接要答案",
      "让它出题考你",
      "对照本站知识页加深"
    ],
    prompt: `不要直接给我最终代码。
请像导师一样：1) 用类比解释【概念】；2) 指出我这段代码的问题；
3) 给提示让我改；4) 我改完后再评。最后出 2 道相关小测验。`
  },
  {
    id: "review",
    scene: "让 AI 做代码审查",
    steps: [
      "贴 diff 或指定文件",
      "要求按安全/正确/性能/可维护分类",
      "只改 Critical，其余记 TODO",
      "你决定是否采纳"
    ],
    prompt: `请审查以下改动，按 Critical / Warning / Nit 分级：
重点：越权、注入、密钥、幂等、错误处理、测试缺口。
先给审查意见，不要直接改代码；等我指定再改 Critical 项。`
  },
  {
    id: "tutorial",
    scene: "跟着本站「后端实战教程」做一步",
    steps: [
      "打开 /tutorial 当天步骤",
      "复制步骤里的「AI 指令」",
      "粘贴到 Cursor Agent 或 Claude Code",
      "按验收标准自测再打卡"
    ],
    prompt: `（直接使用教程页每一步的「复制给 AI 的指令」）
额外补一句：请遵守本仓库 CLAUDE.md / .cursor/rules；改完列出验收命令。`
  }
];

/** 规则文件应该写什么 */
export const rulesGuide = {
  files: [
    { tool: "Cursor", file: ".cursor/rules/*.mdc 或 rules", tip: "可按目录/通配生效" },
    { tool: "Claude Code", file: "CLAUDE.md", tip: "进项目 /init 生成后改" },
    { tool: "Codex", file: "AGENTS.md", tip: "云端 Agent 尤其依赖它" }
  ],
  mustInclude: [
    "项目一句话与目录结构",
    "技术栈版本（Next App Router、Prisma、Redis…）",
    "分层与统一响应格式",
    "多租户 / 鉴权硬性要求",
    "常用命令：dev / test / worker / migrate",
    "禁止事项：禁止提交 .env、禁止瞎升级大版本、禁止 Accept 后不看 diff"
  ],
  sample: `# 项目约定（示例）

## 栈
Next.js App Router + Prisma + PostgreSQL + Redis + Zod

## 分层
Route Handler 只做 HTTP；业务在 Service；DB 在 Repository。

## API
统一 { code, message, data, requestId }；错误码分段见 lib/http/errors.ts。

## 安全
所有业务查询必须带 merchantId；禁止把密钥写进代码。

## 命令
npm run dev | npm test | npm run worker | npx prisma migrate dev

## 禁止
- 不相关大重构
- 未核实的 npm 包名
- 在 Controller 写 SQL`
};

/** 每日协作流程 */
export const dailyWorkflow = [
  {
    title: "开工 5 分钟",
    points: [
      "看清今天只做哪一件事（对照 /tutorial 或自己的 issue）",
      "打开相关文件，让 AI 有上下文",
      "确认规则文件还在、环境能跑"
    ]
  },
  {
    title: "执行中",
    points: [
      "小改：Cmd+K / Chat；跨文件：Agent；大改：Plan Mode",
      "每完成一小步就运行/自测，不要攒一大坨",
      "看不懂的生成代码立刻追问「解释这一行」"
    ]
  },
  {
    title: "收工前",
    points: [
      "过一遍 diff：权限、边界、命名、测试",
      "跑测试与关键手动路径",
      "写清楚 commit message（为什么）",
      "记录明天下一步，避免上下文丢失"
    ]
  }
];

/** 安全与审查清单 */
export const reviewChecklist = [
  "有没有改到不该改的文件？",
  "鉴权/多租户条件是否还在？",
  "是否引入奇怪的新依赖？（去 npm 核实）",
  "错误是否走统一错误码？有没有把堆栈暴露给前端？",
  "密钥、Token、手机号是否进了日志或代码？",
  "失败是否可重试？写接口是否幂等？",
  "有没有对应测试或至少手动验收步骤？"
];

/** 工具组合建议 */
export const comboTips = [
  {
    title: "推荐组合 A（大多数人）",
    body: "Cursor 日常 + 终端里 Claude Code 做重型任务；规则两边都写（rules + CLAUDE.md）。"
  },
  {
    title: "推荐组合 B（预算敏感）",
    body: "Trae / Copilot 免费档练手 → 熟练后上 Cursor Pro；部署与长任务再上 CLI Agent。"
  },
  {
    title: "推荐组合 C（批量打扫）",
    body: "模式化全库替换用 Codex 云端开 PR；业务逻辑仍在 Cursor 里交互完成。"
  }
];
