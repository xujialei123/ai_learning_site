
export type AiTool = {
  name: string;
  vendor: string;
  form: string;
  pricing: string;
  bestFor: string;
  intro: string;
  quickstart: string;
  features: string[];
  tips: string[];
  url: string;
};

export const overseasTools: AiTool[] = [
  {
    name: "Cursor",
    vendor: "Anysphere",
    form: "AI 原生 IDE（基于 VS Code）",
    pricing: "免费档可用，Pro 约 $20/月",
    bestFor: "日常开发主力工具，学习曲线最低，前端转全栈首选",
    intro: "基于 VS Code 深度改造的 AI 原生 IDE，界面和操作习惯完全无缝迁移。核心能力：Tab 智能补全（能预测你下一段要写什么）、Cmd+K 内联编辑、Agent 模式（Composer）自主规划并修改多个文件、Bugbot 代码审查。生态支持最好，MCP、Rules 等新特性通常最先落地。",
    quickstart: `1. 官网下载安装，用 GitHub/Google 账号登录
2. File → Open Folder 打开你的项目
3. 写代码时按 Tab 接受灰色的 AI 补全建议
4. 选中代码按 Cmd/Ctrl + K，用自然语言描述修改意图
5. Cmd/Ctrl + L 打开右侧对话，问关于代码库的任何问题
6. 切到 Agent 模式，直接下任务：「给这个项目加一个登录页」
7. 进阶：在项目根目录建 .cursor/rules 目录写项目规则，
   AI 会自动遵守（如「所有接口必须有参数校验」）`,
    features: [
      "Tab 补全：连续多行预测，写重复模式代码极快",
      "Agent（Composer）：跨文件自主修改，带可视化 diff 审查",
      "@ 引用：@文件、@文件夹、@docs 精准喂上下文",
      "Bugbot：自动审查你的代码改动，找出潜在 Bug",
      "多模型切换：GPT / Claude / Gemini 全系可选"
    ],
    tips: [
      "从 Tab 补全和 Cmd+K 用起，熟了再上 Agent 模式",
      "Agent 改完必须看 diff 再接受，不要盲目 Accept All",
      "大任务拆小：一次让它做一件事，比一次做十件事质量高",
      "把编码规范写进 .cursor/rules，一劳永逸"
    ],
    url: "https://cursor.com"
  },
  {
    name: "Claude Code",
    vendor: "Anthropic",
    form: "终端 CLI Agent（也有 IDE 扩展/网页版）",
    pricing: "Claude Pro $20/月起，或 API 按量付费",
    bestFor: "大规模重构、跨多文件的复杂任务、长时间自主执行",
    intro: "Anthropic 官方的终端优先编程 Agent，被认为是当前「深度代码库推理」的上限。在终端里运行，直接读文件、跑命令、改代码、执行测试。King 特性是 Plan Mode（先推理规划、你批准后再动手）和子代理编排（并行拆解子任务）。适合丢给它一个大任务后去干别的事。",
    quickstart: `# 安装（需要 Node.js 18+）
npm install -g @anthropic-ai/claude-code

# 进入你的项目目录并启动
cd my-project
claude

# 首次运行会引导登录（Claude Pro 订阅或 API Key）

# 常用操作
/init          # 让它分析项目并生成 CLAUDE.md 项目说明
Shift+Tab      # 切换 Plan Mode：先出方案，批准后再执行
/compact       # 压缩对话历史，释放上下文
/help          # 查看全部命令

# 示例任务
> 把这个项目的所有接口加上统一的错误处理中间件，
  完成后跑一遍测试确认没有破坏现有功能`,
    features: [
      "Plan Mode：复杂任务先推理出完整方案，批准后执行",
      "全库理解：递归收集上下文，重构时能照顾到所有引用点",
      "权限系统：每个文件修改和命令执行都可要求确认",
      "CLAUDE.md：项目级记忆文件，写清规范后它持续遵守",
      "Git 集成：自动提交、写 commit message、处理 PR"
    ],
    tips: [
      "第一次进项目先跑 /init，生成 CLAUDE.md 能显著提升后续质量",
      "复杂任务永远先 Plan Mode，看懂方案再放行",
      "配合 Cursor 用：日常在 Cursor 写，重型任务在内置终端启动 claude",
      "长任务用 tmux 保持会话，断线不丢进度"
    ],
    url: "https://code.claude.com/docs"
  },
  {
    name: "OpenAI Codex",
    vendor: "OpenAI",
    form: "CLI Agent + ChatGPT 云端 Agent",
    pricing: "与 ChatGPT 订阅绑定（Plus/Pro），CLI 可用 API Key",
    bestFor: "批量任务并行处理、云端自动提 PR、CI/CD 自动化",
    intro: "OpenAI 官方编程 Agent，有两种形态：轻量 CLI（Rust 编写，启动快）和 ChatGPT 里的云端 Agent。云端模式是它的杀手锏——提交任务后在云端沙箱里独立执行（读代码、装依赖、跑测试、生成 diff），最后自动创建 GitHub PR，而且支持多任务并行：同时丢 5 个重构任务，半小时后回来收 PR。",
    quickstart: `# 方式一：CLI（本地交互）
npm install -g @openai/codex
cd my-project
codex
# 登录 ChatGPT 账号或配置 API Key

# 方式二：云端 Agent（批量任务）
1. 打开 chatgpt.com 侧边栏的 Codex
2. 绑定 GitHub 授权目标仓库
3. 提交任务：「把项目里所有 console.log 换成结构化日志」
4. Codex 在云端沙箱执行并跑测试
5. 完成后自动创建 PR，你只需要审查合并`,
    features: [
      "云端并行：多个任务同时跑，互不干扰",
      "自动验证：沙箱里跑测试确认改动没破坏功能才提 PR",
      "GPT-5.x 系列模型：改动细致、注重审查每一处变更",
      "Token 效率高：同样任务消耗比同类工具低",
      "GitHub 深度集成：直接产出可审查的 PR"
    ],
    tips: [
      "适合「模式化」批量任务：全项目换日志库、批量加类型注解",
      "复杂业务逻辑的架构级改动，交互式工具（Claude Code）更合适",
      "收到 PR 一定人工审查，从「写代码」变「审代码」",
      "在仓库放 AGENTS.md 说明项目结构，云端执行成功率更高"
    ],
    url: "https://openai.com/codex"
  },
  {
    name: "GitHub Copilot",
    vendor: "GitHub / 微软",
    form: "IDE 插件 + Cloud Agent + CLI",
    pricing: "有免费档（每月限量），Pro $10/月",
    bestFor: "零门槛入门 AI 辅助编程、VS Code/JetBrains 重度用户",
    intro: "最早出圈的 AI 编程助手，现在是「插件形态」的代表：不换编辑器，在 VS Code/JetBrains 里装插件即用。免费档零门槛（每月限量补全和对话），适合第一次接触 AI 编程的人试水。Agent 模式和 Cloud Agent 也已跟进，Pro 档可切换 Claude/Gemini 等多家模型。",
    quickstart: `1. VS Code 扩展市场搜索 GitHub Copilot 安装
2. 用 GitHub 账号登录（免费档直接用）
3. 写代码时自动出现灰色补全建议，Tab 接受
4. Ctrl/Cmd + I 打开内联对话
5. 侧边栏 Chat 面板提问、让它解释报错
6. Agent 模式：让它跨文件完成一个完整功能`,
    features: [
      "免费档：每月限量的补全 + 对话，学生认证后 Pro 免费",
      "无缝嵌入：不改变现有编辑器和习惯",
      "多模型：Pro 起可选 OpenAI / Anthropic / Google",
      "Copilot CLI：终端里解释命令、生成脚本"
    ],
    tips: [
      "学生用 GitHub Student Pack 认证，Copilot Pro 免费",
      "补全质量依赖上下文：打开相关文件、写好函数名和注释",
      "它是「辅助」定位，重型 Agent 任务不如 Claude Code/Codex"
    ],
    url: "https://github.com/features/copilot"
  }
];

export const domesticTools: AiTool[] = [
  {
    name: "Trae",
    vendor: "字节跳动",
    form: "AI 原生 IDE（独立应用）",
    pricing: "个人版完全免费",
    bestFor: "预算敏感的个人开发者、前端/全栈快速原型、中文场景",
    intro: "国内首个 AI 原生 IDE，基于 VS Code 开源代码深度定制，完全免费是最大卖点。SOLO 模式可以从需求描述直接自主完成整个项目搭建，对中文需求理解准确。模型用豆包系列 + DeepSeek（国际版可用 Claude 等），前端场景的对话式编程体验在国产工具里最好。",
    quickstart: `1. 官网下载 Trae（有国内版和国际版，国内版无需科学上网）
2. 手机号/抖音账号登录，个人版免费
3. 打开或新建项目，界面和 VS Code 基本一致
4. 侧边栏 Chat：日常问答、解释代码、局部修改
5. Builder/SOLO 模式：输入完整需求，
   如「做一个奶茶店点单页面，含购物车和结算」，
   它会自主创建文件、写代码、跑起来给你看
6. 用中文描述需求即可，无需刻意写英文`,
    features: [
      "完全免费，无使用次数焦虑",
      "SOLO 模式：从需求到可运行项目的全自动化",
      "中文理解好，国内网络直连无需代理",
      "内置国产化知识库（信创/国产数据库适配场景有优势）"
    ],
    tips: [
      "适合作为第一个 AI IDE 上手，零成本体验 Agent 开发",
      "复杂大型项目的完成度不如 Claude Code，大任务记得拆小",
      "生成的项目要自己读懂再用，别当黑盒"
    ],
    url: "https://www.trae.cn"
  },
  {
    name: "通义灵码 / Qoder",
    vendor: "阿里巴巴",
    form: "IDE 插件（VS Code/JetBrains）+ 独立 IDE（Qoder）",
    pricing: "个人版免费，企业版定制",
    bestFor: "Java/Go 后端、阿里云用户、企业级研发团队",
    intro: "阿里的 AI 编程工具，国内用户规模最大。插件形态成熟稳定（VS Code 和 JetBrains 全支持），独立 IDE 形态叫 Qoder。核心模型 Qwen3-Coder + DeepSeek 双模驱动。最大优势是企业级生态：与阿里云、云效 DevOps 链路深度打通，Java/云原生场景的补全质量突出。",
    quickstart: `1. VS Code / IDEA 扩展市场搜索「通义灵码」安装
2. 用阿里云账号登录（免费注册）
3. 代码补全自动生效，Tab 接受
4. 选中代码右键：解释代码 / 生成注释 / 生成单元测试
5. 侧边栏对话：@workspace 提问整个项目相关的问题
6. AI 程序员模式：跨文件修改和自主任务执行
7. 大型项目用 Qoder（独立 IDE），仓库级理解更强`,
    features: [
      "JetBrains 支持最好（IDEA 写 Java 的首选国产工具）",
      "一键生成单元测试，后端场景实用",
      "企业版支持私有化部署，满足合规要求",
      "阿里云/云效生态联动"
    ],
    tips: [
      "写 Java/Go 后端时优先考虑它，训练数据在这块最强",
      "复杂任务自主规划能力弱于 Trae SOLO，适合渐进式辅助",
      "@workspace 提问前先让它索引完整个项目"
    ],
    url: "https://lingma.aliyun.com"
  },
  {
    name: "文心快码 Comate",
    vendor: "百度",
    form: "IDE 插件 + 独立 IDE",
    pricing: "个人版免费，企业版定制",
    bestFor: "多模型切换、复杂工程项目、C++/底层开发",
    intro: "百度的 AI 编程工具，特点是「模式最多、可选模型最多」：Zulu、Ask、Plan、Architect、Figma2Code 等六七种工作模式，模型可选文心、Kimi、DeepSeek、GLM、MiniMax。采用规范驱动（SPEC）模式抑制幻觉，多智能体协同处理复杂任务，C++ 代码质量在国产工具中领先。",
    quickstart: `1. VS Code 扩展市场搜索「文心快码 Baidu Comate」安装
   （或下载独立 IDE）
2. 百度账号登录，个人版免费
3. 右上角切换模型（文心/DeepSeek/Kimi/GLM 等）
4. Ask 模式：日常问答和解释
5. Plan 模式：先生成任务计划再逐步执行，适合大改动
6. Zulu 智能体：给它一个完整需求自主完成
7. Figma2Code：贴 Figma 链接直接生成前端代码`,
    features: [
      "多模型自由切换，一个工具试遍国产主流模型",
      "规范驱动（SPEC）：按工程规范生成，幻觉率低",
      "Figma 设计稿转代码，前端提效明显",
      "私有化部署方案完善，金融/国企常用"
    ],
    tips: [
      "模式多导致上手成本高，先只用 Ask + Plan 两个模式",
      "不同任务换不同模型：中文注释用文心，算法题试 DeepSeek",
      "复杂工程审查场景发挥它的知识图谱优势"
    ],
    url: "https://comate.baidu.com"
  },
  {
    name: "CodeBuddy",
    vendor: "腾讯",
    form: "IDE 插件 + 独立 IDE + CLI",
    pricing: "个人版免费（部分能力需申请）",
    bestFor: "微信小程序开发、腾讯云生态、大型复杂项目",
    intro: "腾讯的 AI 编程工具，核心亮点是 Craft 智能体模式——自动构建项目依赖图谱，用工程化思路理解代码之间的关系，而不是单点响应，大项目里「只见树木不见森林」的问题它解决得最好。与微信开发者工具、云函数、腾讯云深度集成，做小程序基本是首选。",
    quickstart: `1. 官网下载独立 IDE 或安装 VS Code 插件
   （部分新能力需要申请内测资格）
2. 微信/QQ 账号登录
3. 日常补全和对话与其他工具类似
4. Craft 模式：提交复杂任务，
   它会先构建依赖图谱再规划修改
5. 小程序开发：直接生成页面 + 云函数 + 配置，
   与微信开发者工具联动调试`,
    features: [
      "Craft 智能体：依赖图谱驱动，大型项目理解力强",
      "微信小程序全链路支持（页面/云函数/发布）",
      "混元 + DeepSeek 混合模型，响应速度快",
      "腾讯云部署链路打通"
    ],
    tips: [
      "做微信生态（小程序/公众号/云开发）时优先选它",
      "复杂编译配置和错误定位是它的强项，可以丢硬骨头",
      "内测功能记得先去官网申请资格"
    ],
    url: "https://copilot.tencent.com"
  }
];

export const usageGuides = [
  {
    title: "把 AI 当导师而不是代写",
    points: [
      "学习阶段先自己写，卡住了再问 AI「为什么」而不是「帮我写」",
      "让 AI 解释它生成的每一段代码，看不懂的部分追问到懂为止",
      "定期让 AI 给你出题：「基于这个项目，考我 3 个后端问题」",
      "每周挑一段 AI 写的代码，尝试不看原文自己重写一遍"
    ]
  },
  {
    title: "写好指令（这是最核心的技能）",
    points: [
      "带上下文：「这个 Next.js 项目用 App Router 和 Prisma」比「帮我写接口」好十倍",
      "说清约束：技术栈、代码风格、不要改哪些文件、性能要求",
      "给验收标准：「完成后跑 npm test 确认通过」",
      "大任务拆小步：一次一个明确目标，做完审查再继续"
    ]
  },
  {
    title: "项目规则文件是团队协作的关键",
    points: [
      "Cursor 用 .cursor/rules，Claude Code 用 CLAUDE.md，Codex 用 AGENTS.md",
      "写进去：项目结构说明、编码规范、常用命令、禁止事项",
      "例如：「所有接口必须走统一响应格式」「测试文件放 __tests__ 目录」",
      "规则文件随项目提交到 Git，新人和 AI 都能立刻上手"
    ]
  },
  {
    title: "安全与审查底线",
    points: [
      "API Key、密码绝不出现在给 AI 的对话和代码里，用环境变量",
      "AI 改动必须逐行看 diff 再接受，尤其涉及权限、支付、删除的代码",
      "Agent 的命令执行权限保持「每次确认」，别图省事全部放行",
      "AI 生成的依赖包要核实存在且可信（防幻觉包名的供应链攻击）"
    ]
  }
];
