
# AI 全栈后端与 AI 应用学习站 V6

这是 Next.js + Agnes 的完整迁移增强版。

## V7 新增：AI 面试题库

- 新增 `/interview` 页面
- 输入方向/关键词后调用 Agnes 生成面试题
- 自动保存到浏览器 IndexedDB
- 支持分类、难度、标签、关键词筛选
- 支持展开答案、删除、清空、导出 JSON
- 新增 `/api/interview-search` 服务端接口，API Key 不暴露到前端

## 改进点

相比上一版：

- 恢复完整内容，不再只保留少量页面
- 恢复系统图和 RAG 图
- 保留后端完整知识体系
- 保留 AI 应用完整知识体系
- 保留功能到技术栈映射
- 保留请求 / 数据 / AI 链路
- 保留 Demo 实验室
- 保留 60 天任务表
- 保留术语库
- Ask AI 改成右侧学习助手

## Ask AI 交互

支持：

- 选中文字后弹出工具条
- 解释选中内容
- 结合项目解释
- 给练习
- 右侧抽屉式对话，不挡正文
- 手动输入问题
- 连续追问
- 清空对话
- Alt + A 打开助手
- Ctrl / Cmd + Enter 发送

## 安装

```bash
npm install
```

## 配置 Agnes

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`：

```env
AGNES_API_BASE_URL=https://apihub.agnes-ai.com/v1
AGNES_API_KEY=你的_agnes_api_key
AGNES_MODEL=agnes-2.0-flash
AGNES_MAX_TOKENS=900
```

## 启动

```bash
npm run dev
```

打开：

```text
http://localhost:3000
```

## 目录

```text
app/
  api/ask/route.ts
  system/page.tsx
  backend/page.tsx
  ai/page.tsx
  features/page.tsx
  flows/page.tsx
  demos/page.tsx
  tasks/page.tsx
  glossary/page.tsx
  interview/page.tsx
  resources/page.tsx
  api/interview-search/route.ts

components/
  AskAssistant.tsx
  Sidebar.tsx
  Blocks.tsx

data/
  content.ts

lib/
  agnes.ts

public/diagrams/
  system-diagram.svg
  rag-flow.svg
```


## AI 面试题库说明

打开：

```text
http://localhost:3000/interview
```

使用方式：

1. 输入方向，例如：`Node 后端 + Redis + RAG`。
2. 选择分类和难度。
3. 点击“AI 生成并保存到 IndexedDB”。
4. 页面会自动保存到浏览器本地 IndexedDB。
5. 可以按分类、难度、关键词筛选。
6. 可以导出 JSON。

注意：IndexedDB 是浏览器本地存储，换浏览器或清除网站数据后会丢失。后续可以扩展成服务端数据库同步。
