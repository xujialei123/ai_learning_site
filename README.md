# AI 全栈与 AI 应用学习站

面向初学者的系统化学习站点：前端、后端、AI 应用工程、AI 协作编程与实战教程一站式覆盖。基于 Next.js，站内 Ask AI 助手对接 Agnes API。

## 你能学到什么

- **前端 / 后端 / AI 知识体系**：知识点带速记、项目落点、常见误区、面试答法与自测
- **服务器与部署**：Linux、DNS/HTTPS、Docker、Nginx、云发布与相关术语
- **AI 协作**：各编程工具操作速查、指挥 AI 的指令模板与场景剧本
- **后端实战教程**：从零搭建多租户 AI 知识库客服，按天打卡
- **面试题库**：预设高频题 + Agnes 生成题，支持闪卡复习与导出
- **Ask AI**：选中文字解释，或 Alt + A 打开右侧学习助手

## 页面导航

| 路径 | 说明 |
|------|------|
| `/` | 首页 · 学习路径 |
| `/system` `/flows` | 系统总览、请求/数据/AI 链路 |
| `/frontend` `/backend` `/ai` | 前端 / 后端 / AI 知识体系 |
| `/ai-coding` | AI 编程：操作与指挥指南 |
| `/ai-tools` | AI 编程工具介绍与选型 |
| `/tutorial` | 后端实战教程（可打卡） |
| `/features` | 功能到技术栈映射 |
| `/pitfalls` | 真实项目踩坑集 |
| `/demos` | 练习 Demo 实验室 |
| `/tasks` | 任务制学习计划 |
| `/interview` | AI 面试题库（含闪卡） |
| `/glossary` | 术语库 |
| `/resources` | 可靠链接 |

## 安装与启动

```bash
npm install
cp .env.local.example .env.local
# 编辑 .env.local 填入 Agnes 配置
npm run dev
```

打开：http://localhost:3000

## 配置 Agnes（Ask AI / 生成面试题）

编辑 `.env.local`：

```env
AGNES_API_BASE_URL=https://apihub.agnes-ai.com/v1
AGNES_API_KEY=你的_agnes_api_key
AGNES_MODEL=agnes-2.0-flash
AGNES_MAX_TOKENS=900
```

API Key 只在服务端使用（`/api/ask`、`/api/interview-search`），不会暴露到浏览器。

## Ask AI 用法

- 选中页面文字 → 弹出工具条（解释 / 结合项目 / 给练习）
- `Alt + A` 打开右侧助手，可连续追问
- `Ctrl / Cmd + Enter` 发送

## 面试题库说明

打开 http://localhost:3000/interview

1. 可用预设题或输入方向让 Agnes 生成
2. 保存到浏览器 IndexedDB（本地，清站点数据会丢）
3. 支持分类 / 难度 / 关键词筛选、闪卡复习、导出 JSON / PDF

## 推荐学习顺序

1. 首页路径建立全局感 → `/system`、`/flows`
2. 打地基 → `/frontend`、`/backend`（配合 `/glossary`）
3. AI 应用 → `/ai`
4. 学会使唤 AI → `/ai-coding`，工具选型 → `/ai-tools`
5. 动手做项目 → `/tutorial`（每天一步，复制步骤里的 AI 指令）
6. 自测 → `/interview` 闪卡、`/tasks` 打卡

## 目录结构

```text
app/
  page.tsx                 # 首页
  backend/ ai/ frontend/   # 知识体系
  ai-coding/               # 操作与指挥指南
  ai-tools/                # 工具介绍
  tutorial/                # 后端实战教程
  interview/ pitfalls/ demos/ tasks/
  glossary/ resources/ features/ flows/ system/
  api/ask/                 # Ask AI
  api/interview-search/    # 生成面试题

components/
  AskAssistant.tsx Sidebar.tsx Blocks.tsx

data/
  content.ts               # 前后端 / AI 知识点
  backendOps.ts            # 服务器与部署模块
  backendTutorial.ts       # 实战教程步骤
  aiCodingGuide.ts         # 指挥 AI 指南
  aiTools.ts knowledgeMemory.ts interviewPresets.ts
  pitfalls.ts

lib/
  agnes.ts knowledge.ts interviewDb.ts

public/diagrams/
  system-diagram.svg rag-flow.svg
```

## 技术栈

- Next.js（App Router）+ TypeScript
- 本地进度：localStorage / IndexedDB
- Agnes API（对话与面试题生成）
