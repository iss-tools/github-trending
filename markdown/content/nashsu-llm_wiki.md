# nashsu/llm_wiki

[GitHub URL](https://github.com/nashsu/llm_wiki)


## LLM Wiki：你的个人 AI 知识图谱与 Wiki 自动生成器

> 基于大模型的本地个人知识库，自动将文档转化为结构化 Wiki 与知识图谱。

- **Tags**: 知识图谱, RAG, 本地部署, 自动化, Tauri
- **Category**: 知识管理, AI 工具, 效率工具

## Details

# 一句话总结
LLM Wiki（nashsu/llm_wiki）是一个“会自己长出来”的个人知识库桌面应用：它把你的文档自动吃进去、用大模型增量生成结构化 Wiki 页面、建好知识图谱，还能本地查、本地跑、接 MCP 与 API，是 RAG 之外的“持续编译知识”新范式之一。
---
## 背景与痛点：为什么我们会需要“持续编译”的 Wiki？
### 传统笔记/知识库的三大痛点
- 碎片化与孤岛化：PDF、网页、Word、Markdown 散落在不同工具，很难形成一张可“穿越”的知识地图。
- 维护成本高：要做好索引、分类、双向链接、去重与更新，非常费时间；人为主理常常“建了却不用”。
- 检索靠回忆：要么靠全文搜索，要么靠“我好像放在某个文件夹里”，而不是基于概念与关系的“联想式检索”。
### 传统 RAG 的局限
- 每次都从零检索+合成：大量 Token 被重复消费，结果也不稳定。
- 缺少持久化结构：检索结果是一次性的“快照”，不积累、不沉淀，很难形成“第二大脑”。
### LLM Wiki 的切入点
LLM Wiki 在 Andrej Karpathy 的“llm-wiki”设计模式之上，做出了一个可落地的桌面应用：不“每次都重新推导结论”，而是把知识“编译”成可持久、可追溯、可漫游的 Wiki 页面与知识图谱。再结合图挖掘、Deep Research、Review 与人机协同，做到“LLM 维护，人类策展”。
---
## 核心亮点与功能剖析
### 1. 设计理念：人机分工、三层结构、持续编译
- **三层结构**：Raw Sources（原始素材）→ Wiki（LLM 生成的结构化页面）→ Schema（规则与配置）。原始素材只读不改，Wiki 由 LLM 持续更新，Schema 由你定义。
- **三大核心操作**：Ingest（吃进新资料、增量生成/维护页面）、Query（多阶段检索+图扩展+上下文组装）、Lint（定期清理与修正）。
- **持续编译**：采用 SHA256 增量缓存，未改动的文件直接跳过，避免重复消耗 Token 与时间。
### 2. 两步式链式思考 Ingest（Two-Step Chain-of-Thought Ingest）
- Step1（分析）：先提取关键实体、概念、论点，并与现有 Wiki 做关联与冲突检测，输出结构化分析。
- Step2（生成）：基于分析再写页，产出摘要、实体/概念页、更新 index/overview/log，同时生成 Review 条目与 Deep Research 候选查询。
- 效果：减少幻觉、提升一致性、增强结构化程度——相当于“写论文”前先列好详细提纲。
### 3. 4 信号知识图谱 + Louvain 社区发现
- **4 信号相关性**：直接链接（×3.0）、来源重叠（×4.0）、Adamic-Adar（×1.5）、类型亲和（×1.0）。
- **可视化**：基于 sigma.js + graphology + ForceAtlas2，节点颜色按类型/社区切换，支持交互式高亮邻居与缩放。
- **Louvain 聚类**：自动发现知识簇，并对“凝聚度”打分，低凝聚度社区（<0.15）会特别标注。
- **Graph Insights**：自动给出“意外连接”与“知识缺口”（孤立节点、稀疏社区、桥接节点），并可一键触发 Deep Research 进行补全。
### 4. 多阶段检索与上下文预算控制
- Phase 1：Token 化检索（英文分词+去停用词；中文 CJK bigram），标题命中有加权，并在 Wiki 与原始 Source 中检索。
- Phase 1.5：可选向量检索（LanceDB，OpenAI 兼容 /v1/embeddings 端点），召回从 58.2% 提升到 71.4%（项目 Benchmark）。
- Phase 2：图扩展，从种子节点出发，利用 4 信号做 2 跳扩展与衰减。
- Phase 3：可配置 4K–1M Token 的上下文窗口，按 60/20/5/15 分配给 Wiki 页/聊天历史/索引/系统提示。
- Phase 4：上下文组装与页码引用系统，要求 LLM 回答时标注来源页编号。
### 5. Deep Research + Web Search + Review 队列
- **Deep Research**：从图谱 Insight 触发，自动基于 overview.md + purpose.md 生成领域相关的搜索主题与查询；支持 Tavily/SerpApi/SearXNG 进行全网搜索并自动摄入结果；最终合成带交叉引用的研究页。
- **Review 队列**：异步人机闭环，LLM 在 Ingest 时标记需人工确认的事项，并预生成搜索查询供你决策；可选动作有限定（Create Page、Deep Research、Skip），防止 LLM“乱造动作”。
- ** cascade 删除**：删除源文件会级联清理相关 Wiki 页（共享实体页仅移除来源引用），并清理 index 与死链，减少僵尸页堆积。
### 6. 多模态与多格式摄入
- 图片：从 PDF 中抽取嵌入式图片并用视觉 LLM 生成事实性描述，支持图感搜索与灯箱预览、跳转来源。
- 文档格式：PDF（内置 pdf-extract；可选 MinerU Cloud/Local）、DOCX/PPTX/Excel/ODS、EPUB/MOBI、Org mode、图片/视频、网页剪藏（Readability.js + Turndown.js → Markdown）。
- 文件夹导入与自动监听 raw/sources 变更，并在 Activity 面板可视化队列与进度。
### 7. Chat、Agent 与技能（Skills）
- 多会话、持久化、可重生成、可“Save to Wiki”归档答案到 wiki/queries 并自动摄入。
- Rust 后端 Agent：具备工具调用能力（Wiki/Source/Graph/Web/AnyTXT/文件生成/Shell 审批等），支持技能目录扫描与 /skill 命令切换，生成的文件在 agent-workspace 预览与打开。
- 本地 HTTP API（127.0.0.1:19828，Token 保护）+ 内置 MCP 服务器：支持检索、图遍历、重扫源、Review 导出与解析；并提供一键安装的 agent skill（npx skills add ...）用于 Claude Code / Codex 等 MCP 客户端。
### 8. UI/UX 与跨平台体验
- 三栏布局：左侧 Knowledge/Files，中间 Chat，右侧 Preview，支持拖拽调整与最小/最大宽度约束；侧边图标栏可切换 Wiki/Sources/Search/Graph/Lint/Review/Deep Research/Settings。
- Markdown 渲染：KaTeX 公式、Mermaid 图表、GFM 表格、代码块、Wikilink 转换；Mermaid 错误以精简卡片展示，避免刷屏。
- Thinking/Reasoning 展示：对 DeepSeek/QwQ 等“思维块”提供流式 5 行滚动展示与折叠，并与主回答分离。
- 跨平台：Tauri v2 做桌面，支持 macOS/Windows/Linux；统一路径 normalize、Unicode 安全（CJK）、macOS 关闭到托盘等细节打磨。
---
## 技术栈与架构解析（面向开发者）
- **桌面框架**：Tauri v2（Rust 后端）+ React 19 + TypeScript + Vite。
- **UI**：shadcn/ui + Tailwind CSS v4。
- **编辑器**：Milkdown（ProseMirror WYSIWYG）。
- **图**：sigma.js + graphology + ForceAtlas2 + graphology-communities-louvain。
- **搜索**：Token 化检索 + 图相关性 + 可选向量（LanceDB，Rust 嵌入式）。
- **文档解析**：pdf-extract（Rust）+ docx-rs + calamine + EPUB/MOBI 解析；可选 MinerU。
- **状态管理**：Zustand。
- **LLM 接入**：Streaming fetch，支持 OpenAI/Anthropic/Google/Ollama/自定义（按项目配置 Chat 与 Ingest 模型）。
- **Web Search**：Tavily / SerpApi / SearXNG JSON API。
- **本地 API 与 MCP**：REST API（SSE 流式）+ 内置 MCP Server（与 API 同源）。
### 架构亮点
- 前端 React/TS 负责 UI 与交互，后端 Rust 处理重任务（文档解析、向量检索、Agent 工具调用、图算法），兼顾性能与跨平台打包。
- 增量缓存（SHA256）、持久化队列、崩溃恢复等设计，适合长时间运行的“知识编译器”角色。
- API + MCP 为外部 Agent（如 Claude Code）提供了“标准接口”，避免各自造轮子。
### Demo：最小可复现的本地 HTTP 调用示例
假设你已在 Settings 启用 API 并生成 token，可在本地 shell 中尝试：
- 健康检查：
  - curl http://127.0.0.1:19828/api/v1/health
- 列出项目（需 Header Authorization）：
  - curl -H "Authorization: Bearer YOUR_TOKEN" http://127.0.0.1:19828/api/v1/projects
- 混合检索（POST JSON）：
  - curl -X POST -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d '{"q": "注意力机制","limit":10}' http://127.0.0.1:19828/api/v1/projects/{id}/search
- 获取图结构：
  - curl -H "Authorization: Bearer YOUR_TOKEN" http://127.0.0.1:19828/api/v1/projects/{id}/graph
---
## 上手门槛与部署体验
### 装上就能跑（面向最终用户）
- 预编译二进制：macOS（dmg，Apple Silicon + Intel）、Windows（msi）、Linux（deb / AppImage）， Releases 页面直接下载安装即可。
- Quick Start 步骤清晰：新建项目（选场景模板）→ Settings 填 LLM Provider 与模型 → 导入文档 → 看 Activity 面板自动 Wiki 化 → Chat/Graph/Review/Lint 使用。
- Web Clipper（Chrome 扩展）：加载 unpacked 后，快捷键 Alt+Shift+L / Cmd+Shift+L 一键剪藏，自动触发两步式摄入。
### 从源码构建（面向开发者）
- 前置：Node.js 20+、Rust 1.88+、protoc；脚本给出 macOS/Linux/Windows 的安装命令。
- 命令示例（从 README）：
  - git clone https://github.com/nashsu/llm_wiki.git
  - cd llm_wiki
  - npm install
  - npm --prefix mcp-server ci && npm run mcp:build
  - npm run tauri dev    # 开发
  - npm run tauri build  # 生产打包
- 体验评价：Tauri v2 的工程化很成熟，依赖声明明确；首次编译略耗时但符合桌面端常规。需要注意 Node 版本与 protoc 的路径，否则可能构建失败。
---
## 社区活跃度与生命力（公开信号）
- Star History 显示该项目 Stars 达到 1.7 万+，意味着较高关注度与用户基础。
- GitHub Actions CI/CD 已配置，自动为 macOS（ARM + Intel）、Windows（.msi）、Linux（.deb / .AppImage）产出构建，说明作者对“跨平台分发”有持续维护意愿。
- 第三方文章把 nashsu/llm_wiki 作为“LLM Wiki”范式实现之一来讨论，并与 Karpathy 原始方案进行搭配使用建议，侧面印证其在技术社区的讨论度。
- License 为 GPL-3.0，意味着对商业分发有约束，但对个人与自研项目友好。
（注：受本次检索可用工具限制，未能直接抓取 GitHub 侧边栏的实时 Stars/Forks 数值与 Issues/PR 统计，建议以项目主页当前数值为准。）
---
## 目标人群与收益
### 谁最适合用
- 研究人员/咨询顾问/律师/分析师：需要长期跟踪大量报告与论文，并做跨来源对比与观点沉淀。
- 开发者/技术写作者：文档、API、RFC、Issue、讨论帖等素材分散，需要快速查证、交叉引用与自动归纳。
- 个人知识管理重度用户：尝试过 Obsidian/Notion/Logseq，但“整理比输入更累”，想要“半自动打理”的知识库。
### 能带来什么具体收益
- 节省整理时间：两步 Ingest 自动分门别类、出实体/概念页与索引，减少手工归类成本。
- 提升检索可靠性：多阶段检索+图扩展+来源追踪，给出页码级引用，方便快速验证与溯源。
- “意外发现”能力：Graph Insights 的“意外连接”与“知识缺口”能帮助你看到原本被忽略的线索或领域空白。
- 与 Agent 生态打通：通过 MCP 与 HTTP API，让外部 AI（Claude Code 等）直接查阅你本地的知识库，成为你的“外挂大脑”。
---
## 竞品/同类对比
### 与 Obsidian / Logseq / Notion
- **LLM Wiki 强项**：自动生成结构化内容、图谱分析、Deep Research、LLM 原生的图推理与 Review 队列，侧重“内容自组织”。
- **传统 PKM 强项**：社区插件生态极其丰富、协作与移动端成熟。但自动化程度低，缺少 LLM 原生的多阶段检索与图推理。
### 与传统 RAG 框架（LlamaIndex、LangChain）
- **差异点**：RAG 侧重“问答触发，检索即用”；LLM Wiki 侧重“持久化 Wiki + 图谱 + Review”，先把知识“编译好”，再查、再维护。
- **互补性**：你在外部可以用 RAG 做即时问答，把结论与发现“回流”到 LLM Wiki，形成持久层。
### 与 nvk/llm-wiki（Karpathy 模式的另一实现）
- nvk/llm-wiki 更偏 CLI/脚本化、极客向，适合定制流水线；LLM Wiki 更偏桌面应用与“开箱即用”，自带 UI/UX、图可视化与多格式支持。
### 与其他本地向量搜索方案
- LLM Wiki 的向量检索（LanceDB）是“可选的”，核心检索逻辑不依赖向量，因此对于只想做关键词+图扩展的用户，资源占用更低。
---
## 局限与不足
### 学习与配置成本
- 需要自行准备 LLM Provider 与模型，配置 API Key，对非技术用户有一定门槛。
- 知识图谱的 4 信号与社区发现指标对“小白”稍显抽象，需要一点时间理解用法。
### 资源占用与运行要求
- 大量文档摄入与 Ingest 会产生较多 LLM 调用，Token 消耗不低（本地模型尤需考虑算力/显存）。
- Rust 后端虽然高效，但桌面应用仍需占用一定内存与磁盘（尤其是开启向量检索与大量媒体文件）。
### 模型依赖与质量波动
- Wiki 质量、实体抽取、概念命名与关联都依赖 LLM 的表现，不同模型输出差异明显，需要耐心调整 schema/prompt 和设置。
- 错误的 Ingest 可能会传播：例如实体页命名不准，需通过 Lint 与 Review 进行修正与清理。
### 生态与协作
- 目前偏“个人桌面端”，缺少多用户实时协作与云同步方案；团队使用需自行设计项目迁移与共享策略（虽然有 ZIP 导入/导出）。
- 社区插件生态尚不成熟，扩展主要通过 API + MCP + Skills，需要一定开发能力。
### 许可证约束
- GPL-3.0 对闭源分发有要求，企业在产品化集成时需提前评估合规方案。
---
## 结语与行动建议
### 终极评判
- 如果你希望在本地构建一个“会自动生长、可追溯、可漫游”的个人知识库，并且愿意把 LLM 当成“维护者”而非“一次性查询工具”，LLM Wiki 是当前少数做到这一思路的完整桌面实现之一。它在增量 Ingest、知识图谱、Review 与 Deep Research 等维度做了相当细致的工程化，适合研究与重度知识工作者上手尝试。
### 行动建议（给不同角色）
- 新手/小白：先从预编译二进制开始，选一个“阅读/研究”场景模板，导入少量熟悉资料，跑一遍 Ingest，再试着用 Chat 与 Graph 找一两个你关心的问题，验证“是否节省时间”。
- 开发者：从源码构建体验一次，阅读 README 中的项目结构与 API 文档，试一试本地 HTTP API 与 MCP 集成（例如用 npx skills add 接入 Claude Code）。
- 研究者/分析师：重点关注 Graph Insights 与 Deep Research，先用小规模论文/报告集，观察“意外连接”与“知识缺口”是否能给你带来新思路或新选题。
- 团队/企业：评估 GPL-3.0 合规与项目迁移/共享流程，是否适合作为个人与团队的“知识底座”之一，再考虑与现有协作工具（如 Obsidian/Notion）如何分工与回流。
一句话收尾：如果你把知识当作“要编译的代码”，LLM Wiki 就是你的本地“编译器+IDE+知识地图”——值得一试，但要做好前期配置与持续投入“策展”的准备。
