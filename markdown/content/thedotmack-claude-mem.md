# thedotmack/claude-mem

[GitHub URL](https://github.com/thedotmack/claude-mem)

- **Stars**: 92093
- **Language**: JavaScript

## Claude Code 持久化记忆插件：claude-mem 深度评测

> 为 Claude Code 增加“永久记忆”的外挂，解决 AI 跨会话遗忘问题。

- **Tags**: GitHub, Claude, 记忆管理, 知识库, 上下文增强
- **Category**: AI 编程, 开发工具, 效率工具

## Details

# 一句话总结
claude-mem 是一款为 Claude Code 等代码助手“外接大脑”的持久化记忆与上下文压缩系统：自动抓取会话中的工具调用与操作，把信息压缩成可检索的记忆，在新会话启动时自动注入相关上下文，帮你不再“每次从零开始”。
---
## 背景与痛点
- 会话隔夜即忘：大模型代码助手（Claude Code 等）每次会话都是新上下文，项目之前的决策、坑点、Hack、依赖关系都需要你重新讲一遍，费时费力，也容易前后不一致。
- 上下文窗口有限且昂贵：把所有历史全塞回新会话既不现实也不经济；简单的“复制粘贴关键决策”方案容易遗漏、不可检索、不可审计。
- 知识不落地：团队成员间或者个人跨设备时，之前的“经验”散在聊天记录和本地笔记，难以用自然语言一键检索与复用。
claude-mem 正是为解决这些问题而生的“记忆层”中间件：它挂载在你的会话生命周期上，捕捉、压缩、存储、检索，并在下次启动时“把大脑带回来”。
---
## 核心亮点与功能剖析
### 持久化记忆与自动上下文注入
- 在会话结束时自动生成语义摘要，写入本地 SQLite 数据库（默认 `~/.claude-mem/claude-mem.db`）；新会话启动时，从最近约 10 次会话中挑选并注入上下文，无需你手动整理。
- 对 AI 的比喻：给 Claude Code 增加了一个“随身笔记本”，每天结束时它自动写日记，第二天早上自动翻到重点页签给你看。
### 分层检索与渐进式披露（Progressive Disclosure）
- 提供三层检索：先“search”拿索引（轻量，~50–100 tokens/条），再用“timeline”看时间线上下文，最后“get_observations”按需拉取完整详情（~500–1000 tokens/条）。按需展开，既省 token 又更聚焦。
- 官方给出的典型 MCP 工具调用示例：
  ```js
  // Step 1: Search for index
  search(query="authentication bug", type="bugfix", limit=10)
  // Step 2: Review index, identify relevant IDs (e.g., #123, #456)
  // Step 3: Fetch full details
  get_observations(ids=[123, 456])
  ```
  
### 技术栈与架构设计
- 插件层（Hooks）：5 个生命周期钩子（SessionStart / UserPromptSubmit / PreToolUse（Read） / PostToolUse（*） / Stop）负责在关键节点捕获会话信息并通知 Worker。架构清晰、职责分明。
- Worker 服务（Node.js + Express + Bun 管理）：暴露 HTTP API 与 SSE 实时流，托管 Web 查看器与搜索端点，对观测数据进行后处理（用 Claude Agent SDK 生成摘要），并管理本地数据库写入/读取。
- 存储与搜索：SQLite（FTS5 全文检索）+ 可选 Chroma 向量库的混合检索方案；向量搜索可按需开启，兼顾语义理解与性能。路径默认为 `~/.claude-mem/claude-mem.db`。 
- Viewer UI：React + TypeScript 构建，通过 esbuild 打包为单文件（viewer.html），提供实时记忆流、无限滚动、项目过滤等可视化界面。由 Worker 在本地端口直接提供。 
### 多语言与模式系统（Modes & Languages）
- 支持多语言模式（如 code--zh 中文、code--ja 日文等，已内置 28 种语言），通过 `~/.claude-mem/settings.json` 的 `CLAUDE_MEM_MODE` 切换。示例：
  ```json
  { "CLAUDE_MEM_MODE": "code--zh" }
  ```
  
- 模式也影响工作流（例如代码 vs 邮件调查 vs 轻松闲聊），让记忆记录更贴合场景。
### 自然语言搜索与“知识代理”（Knowledge Agents）
- mem-search 技能与 MCP 搜索工具支持用自然语言搜索项目历史（如“我们最近修过哪些认证 bug？”），并能按类型、日期、项目、文件等过滤。 
- “知识代理”允许你从观测历史构建可查询的“知识库”（大脑），提升长期知识的复用度。
### 隐私控制与引用（Citations）
- 可在内容中使用 `<private>` 标签排除敏感信息被存储；数据默认为本地优先，可选云端同步。 
- 所有“观测”都有 ID，可通过 Worker API 或 Web 查看器引用，方便审计与可回溯。 
### 文档与本地化
- 官方文档站（docs.claude-mem.ai）提供安装、使用、配置、架构、最佳实践等体系化文档，并支持多语言 README（含中文）。
---
## 目标人群与收益
- 深度使用 Claude Code 等代码助手的开发者：每日多会话、长会话，受益最大，能节省“重复交代项目背景”的大量时间。
- 多人协作团队：个人记忆沉淀并跨设备/成员共享（配置好共享数据库或云端同步），加速新人 Onboard 与决策追溯。
- 知识型写作者/分析师：需要维护长周期的研究记录、邮件调查、资料整理，可以通过记忆与搜索提高信息复用。
- 收益点：
  - 提升效率：新会话直接“热启动”，避免反复解释；检索式回忆节省翻找时间。官方设计强调渐进披露以节省 token。
  - 降低失误：避免重复掉进同一个坑，历史观测可追溯。
  - 提升可维护性：项目级别的决策与架构点有据可查（Web 查看器可视化）。
  - 本地优先与可控：数据存在本地，敏感信息可通过标签排除，降低外泄风险。
---
## 竞品/同类对比
- 与“纯提示工程”相比：claude-mem 把记忆从“依赖你怎么写 Prompt”变成系统化的捕获-压缩-检索流程，长期稳定性更高，不需要每次都手动写“项目上下文模板”。
- 与通用的 RAG/知识库系统相比：它专为 AI 助手的会话生命周期与工具调用观测设计，开箱即用；无需你手动构建 ETL、清洗、索引流程。Hooks 架构与 Worker 服务极大降低了接入成本。
- 与简单的“聊天记录全文搜索”相比：更注重结构化观测（Read/Write/工具调用）、语义摘要与三层渐进检索，既有“索引”又有“时间线上下文”，而不仅是关键词命中。 
- 与“云端笔记 + 手动粘贴”相比：自动化程度高，检索自然语言化，且无需切换工作流；但依赖 Node.js/Bun/本地运行环境。
---
## 上手门槛与部署体验
- 安装非常简洁：
  - `npx claude-mem install` 一键安装（支持 Claude Code）；也可以通过 Claude Code 插件市场安装：
    ```
    /plugin marketplace add thedotmack/claude-mem
    /plugin install claude-mem
    ```
    安装后重启 Claude Code 即可自动注入先前会话的上下文。
- 系统要求：
  - Node.js ≥20；Claude Code 最新版；Bun（如缺失会自动安装）；uv（可选，用于向量搜索，自动安装）；SQLite 3 随包附带。
- 配置与模式：
  - 配置文件：`~/.claude-mem/settings.json`（首次运行自动生成）。可设置模型、Worker 端口、数据目录、日志级别、上下文注入策略等。 
  - 多语言/模式：通过 `CLAUDE_MEM_MODE` 切换（如 code--zh）。 
- Worker 与 Web Viewer：
  - Worker 启动后会在终端打印本地 URL，你可以在浏览器中打开 Web 查看器查看实时记忆流，带项目过滤与设置持久化，体验直观。 
---
## Demo / 代码示例
- 安装后（Claude Code）：
  - 不需要写代码即可启用；重启 Claude Code，新会话开始时，系统会自动注入前次会话上下文。 
- 在会话中搜索项目历史（MCP/技能示意）：
  ```js
  // Step 1: 搜索索引
  search(query="认证相关的 bug", type="bugfix", limit=10)
  // Step 2: 看时间线上下文
  timeline(observation_id=123)
  // Step 3: 按需拉取详情
  get_observations(ids=[123, 456])
  ```
  
- 配置中文模式示例（编辑 `~/.claude-mem/settings.json`）：
  ```json
  { "CLAUDE_MEM_MODE": "code--zh" }
  ```
  保存后重启 Claude Code 即可生效。 
---
## 社区活跃度与生命力
- 仓库 README 显示有完整文档、架构演进说明、Hooks 引用、Worker 服务说明、数据库与检索架构等配套资料；文档站持续更新并包含多语言与平台集成指南。 
- Issues 与社区渠道：官方 Issues、X 账号、Discord 社区均已列出，便于反馈与交流。 
- 分支策略：`main` 为稳定版并发布到 npm；`core-dev` 与 `community-edge` 用于早期可靠性修复与社区集成源码运行，显示项目有较成熟的版本管理与迭代节奏。 
---
## 局限与不足
- 环境依赖：需要 Node.js ≥20、Bun、Claude Code 等前置条件，不适用于完全不想折腾运行环境的用户。Windows 用户需确保 npm 在 PATH 中。 
- 学习曲线：尽管安装简单，但熟练使用“渐进式检索”、配置模式/语言、理解 Hooks 与 Worker 架构仍需一定时间与阅读文档。 
- 本地维护成本：记忆存储在本地 SQLite，需自行管理数据库备份与迁移（可结合官方的 Cloud Sync / cmem.ai Pro 方案，但仍需配置与理解云端边界）。 
- 模型依赖：摘要生成依赖 AI 模型（默认 Claude Agent SDK，可换 Gemini / OpenRouter），需要相应可用性与配额；环境变量与后端配置不当会导致 Worker 处理异常。 
- 隐私与合规边界：尽管有 `<private>` 标签与本地优先策略，但在企业环境里仍需评估“记忆”的留存、访问控制与删除策略。 
- 端口与多用户：默认端口策略为 `37700 + (uid % 100)`，在多用户/多环境共存时需留意冲突与配置。 
---
## 结语与行动建议
- 终极评判：claude-mem 把“AI 助手不会跨会话记忆”变成了一个可工程化解决、可配置、可检索的系统问题，而不是每次都要靠 Prompt 技巧来弥补。它自动化强、架构清晰、文档完善，适合长期依赖 Claude Code 等助手的重度用户与团队，能显著提升研发与知识工作的连续性与效率。
- 适合立即尝试的人群：
  - 每天用 Claude Code 的开发者，尤其是中大型项目或多人协作。
  - 希望通过自然语言搜索“历史决策与坑点”的知识型工作者。
- 建议的起步路径：
  - 用 `npx claude-mem install` 一键安装，先默认模式跑 1–2 天，观察 Web 查看器中自动记录的内容。
  - 熟悉后，按照文档尝试 `CLAUDE_MEM_MODE` 切换到中文模式（code--zh），并配置项目级的上下文注入策略。 
  - 根据合规要求评估 `<private>` 标签与本地/云端策略，决定是否开启 Cloud Sync 与 cmem.ai Pro。 
- 长期建议：
  - 把记忆当作团队知识资产的一部分，定期整理与归档；结合文档站的最佳实践（如“上下文工程”“渐进披露”）优化记忆注入粒度与检索质量。 
  - 若要在多设备/团队间共享，建议统一数据库路径或云端同步，并制定访问与删除策略，避免“记忆膨胀”导致检索质量下降。
