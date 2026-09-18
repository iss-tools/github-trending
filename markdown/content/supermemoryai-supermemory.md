# supermemoryai/supermemory

[GitHub URL](https://github.com/supermemoryai/supermemory)


## Supermemory 深度评测：给 AI 安装持久大脑的开源记忆层

> Supermemory 是一套为 AI 打造的持久记忆层引擎，让 AI 跨会话记住用户偏好和上下文

- **Tags**: AI 记忆, RAG, 开源项目, 知识管理, 本地部署
- **Category**: 开发工具, AI 编程

## Details

# Supermemory 深度评测：给 AI 安装“持久大脑”的开源记忆层
> 一句话总结：Supermemory 是一套为 AI 打造的“持久记忆层 + 用户画像 + RAG + 连接器”的一站式引擎，可作为 API/本地服务集成到任何应用或编辑器（含 MCP），让 AI 跨会话记住你、理解你；既适合个人“第二大脑”，也适合企业为自家产品加记忆能力。
---
## 一、背景与痛点：AI 记不住，产品难“懂你”
- 背景：如今大模型越来越聪明，但对话之间的记忆却基本“断片”。每次新会话都要重新交代偏好、项目背景、历史决策，既浪费 Token，又影响体验。
- 痛点：
  - 跨会断忆：Claude/ChatGPT 等“下次再聊”就是陌生人，要你手动复述。
  - 框架碎片：想为产品加“长期记忆”，往往要自己拼向量库、切分、Embedding、存储、召回与冲突处理，工程量大且易出错。
  - 画像缺失：多数 RAG 只把“文档”召回，不沉淀“关于用户的事实”，导致系统答得广但不贴人。
- Supermemory 的定位：把“记忆”这件事做成独立的一层，与模型无关，支持任何 LLM（OpenAI/Anthropic/Gemini/Ollama 等），并提供统一 API、MCP 服务器与本地二进制，做到“一次接入，到处记住”。
---
## 二、核心亮点与功能剖析
### 1) 记忆引擎：不只是 RAG，而是“事实图谱 + 时间感知”
- 自动抽取：从对话内容中提取“值得记住”的事实与偏好，而非原样存储全量对话。
- 时间与冲突处理：能识别“我搬家到 SF”取代“我住在 NYC”这类新旧矛盾，并根据时间自动遗忘过期信息（如“明天有考试”过期后不再召回）。
- “记忆 vs RAG”的区分：官方强调“Memory ≠ RAG”。RAG 只是文档检索，与用户无关；Memory 则维护“关于用户的事实”，两者同时运行，既查知识库，也查个人化事实。
### 2) 用户画像（User Profiles）：50ms 拿到完整人设
- 结构：
  - static：长期事实（如“资深工程师”“偏好暗色、用 Vim”）。
  - dynamic：近期上下文（如“正在做 auth 迁移”“在调限流问题”）。
- 性能：一次调用约 50ms 返回画像，适合在每次对话开始时注入系统提示，让 AI“瞬间懂人”。
### 3) 混合检索（Hybrid Search）：文档 + 记忆，一查双得
- 默认为 hybrid 模式：一次查询同时返回文档 RAG 结果 + 用户记忆，满足“通用知识 + 个人语境”的联合检索需求。
- 支持纯记忆模式：只查记忆，避免文档噪声，提升聚焦度。
### 4) 连接器（Connectors）：把外部资料“实时喂”进记忆
- 支持源：Google Drive、Gmail、Notion、OneDrive、GitHub 与通用网页爬虫；通过 Webhook 实时同步，文档自动处理并分块可搜。
- 场景：个人知识库、产品文档、合同/协议等被自动索引，并与用户记忆合并召回。
### 5) 多模态提取器：PDF/图片/视频/代码一应俱全
- 能力：PDF、图像（OCR）、视频（转录）、代码（AST 感知分块）上传即用。
- 好处：不用自己造轮子处理多模态，降低接入复杂度。
### 6) 本地优先（Supermemory local）与跨模型兼容
- 本地运行方式：
  - `curl -fsSL https://supermemory.ai/install | bash`
  - 或 `npx supermemory local`。
- 特性：
  - 单一二进制、零配置：首启自动嵌入图引擎、本地嵌入模型与凭证，本地跑在 `http://localhost:6767`。
  - 模型灵活：可用 OpenAI/Anthropic/Gemini/Groq 等，也完全脱机接 Ollama。
  - 数据可迁移：所有数据存储在 `./.supermemory` 目录，备份/迁移极方便。
- API 统一：本地与托管平台 API 兼容，只需改 `baseURL` 即可由本地切到云端。
### 7) MCP 与插件：给常用 AI IDE/工具“插上记忆”
- 客户端支持：Claude Desktop、Cursor、Windsurf、VS Code、Claude Code、OpenCode、OpenClaw、Hermes 等；通过 MCP 一键接入记忆层。
- MCP 快速安装：
  - `npx -y install-mcp@latest https://mcp.supermemory.ai/mcp --client claude --oauth=yes`（支持换 cursor/windsurf/vscode 等）。
- 配置示例（MCP 客户端配置片段）：
  ```json
  {
    "mcpServers": {
      "supermemory": {
        "url": "https://mcp.supermemory.ai/mcp"
      }
    }
  }
  ```
  也可改为 API Key 认证。所有配置仅改几行即可生效。
- 可用工具（MCP 工具集）：
  - `memory`：保存/遗忘信息；AI 会在适当时机自动调用。
  - `recall`：按查询检索记忆 + 用户画像摘要。
  - `context`：在对话开始时注入完整画像；在 Cursor/Claude Code 中只需输入 `/context`。
### 8) 面向开发者的 API 与框架集成
- SDK：支持 Node/TypeScript (`import Supermemory from "supermemory"`) 与 Python (`from supermemory import Supermemory`)。
- 核心方法：
  - `client.add()`：存入文本/对话/URL/HTML。
  - `client.profile()`：获取用户画像 + 可选搜索结果。
  - `client.search.memories()`：混合检索（文档 + 记忆）或纯记忆检索。
  - `client.search.documents()`：带元过滤的文档检索。
  - `client.documents.uploadFile()`：上传多模态文件。
  - `client.documents.list()`：列出与过滤文档。
  - `client.settings.update()`：配置记忆提取与分片策略。
- 框架集成：提供 Vercel AI SDK、LangChain、LangGraph、OpenAI Agents SDK、Mastra、Agno、n8n 等封装，一行即可“把记忆织进链路”。
### 9) 基准表现与“工具箱”
- 官方基准（三大记忆基准）：
  - LongMemEval（跨会话长期记忆与知识更新）：81.6%，排名第 1。
  - LoCoMo（长对话事实召回，含单/多跳、时序与对抗）：排名第 1。
  - ConvoMem（个性化与偏好学习）：排名第 1。
- 效率指标：
  - 在 LongMemEval 上达到约 95% Recall@15 的同时，仅增加约 720 个 token，实现约 99.4% 的上下文缩减（文档主体数据在另一版 README 给出）。
- 配套开源工具：
  - MemoryBench：可复现的内存层基准框架，支持横向对比 Supermemory、Mem0、Zep 等方案。
  - 命令示例：`bun run src/index.ts run -p supermemory -b longmemeval -j gpt-4o -r my-run`。
  - 技能式自测：`npx skills add supermemoryai/memorybench`，并在对话中用 `/benchmark-context` 自动评测自有记忆方案。
---
## 三、目标人群与收益：谁最值得用？能得到什么？
### 1) 每日重度使用 AI 的知识工作者/工程师
- 痛点：要在不同 AI 工具间不断重复“我是谁、我在干什么、我偏好什么”。
- 收益：
  - 一装 MCP，AI 自动记忆你的项目、偏好、决策历史；新对话直接“接上进度”，极大降低重复沟通成本。
  - 本地模式让数据留在机器，适合对隐私敏感的个人用户。
### 2) 正在做 AI Agent/应用的开发团队
- 痛点：要自己搭建记忆层（向量库、切分、Embedding、冲突与过期管理），集成成本高、维护重。
- 收益：
  - 一套 API 拿到记忆 + RAG + 画像 + 连接器，大幅缩短开发时间。
  - 支持多云模型：可随模型切换而不动记忆层，避免被单一厂商绑定。
  - 框架集成丰富：主流 AI 工程栈基本“即插即用”。
### 3) 企业/产品需要“个性化能力”与“合规可控”
- 痛点：合规要求高，需要本地/自建，而现有方案多为 SaaS 且封闭。
- 收益：
  - 提供本地二进制与统一 API，便于私有化部署与审计。
  - 连接器可把企业知识源（Gmail/Notion/Drive/GitHub）自动摄入，形成“企业知识 + 用户记忆”的双向增强。
### 4) 研究者与基准构建者
- 痛点：缺乏标准化的记忆评测工具与可复现流程。
- 收益：
  - 官方开源 MemoryBench，支持多方案对比，可作为研究基线或内部评估工具。
---
## 四、竞品/同类对比：它处在什么位置？
| 维度 | Supermemory | Mem0 | Zep | 通用 RAG 方案（自建） |
|---|---|---|---|---|
| 记忆与画像分离 | 是（Memory + Profile） | 以记忆为主 | 图谱与时间线设计 | 需自行实现 |
| 冲突/过期/时间感知 | 内置（自动忘、自动消解矛盾） | 部分支持 | 有时间线，更新策略需配置 | 完全自己搞 |
| 混合检索（文档+记忆） | 原生 hybrid 模式 | 需自行组合 | 需自行组合 | 需自行组合 |
| 连接器 | 6+ SaaS（Gmail/Drive/Notion/OneDrive/GitHub/网页） | 较少 | 偏基础存储 | 无/自建 |
| 多模态提取 | PDF/OCR/视频转录/AST 分块 | 较少 | 有限 | 自建 |
| 本地/自建 | 一键本地二进制；统一 API | 多为云端/自建 | 自建为主 | 自建 |
| 框架集成 | Vercel AI SDK/LangChain/LangGraph 等 | 有一定集成 | 较少 | 无 |
| 基准与工具 | MemoryBench + 多个 SOTA 排名 | 有一定评测 | 有论文支撑 | 无 |
简要结论：Supermemory 把“记忆层”做成了产品级、可评测、可插拔的基础设施，适合希望“快速落地 + 长期可演进”的团队；自建方案灵活但工程成本高；Mem0/Zep 更偏研究与底层抽象，Supermemory 更贴近“开箱即用”。
---
## 五、Demo / 代码示例：上手门槛与核心用法（开发者视角）
### 1) Node/TypeScript 快速上手
```bash
npm install supermemory
```
```ts
import Supermemory from "supermemory";
const client = new Supermemory();
// 存入一段用户偏好
await client.add({
  content: "User loves TypeScript and prefers functional patterns",
  containerTag: "user_123",
});
// 获取画像 + 检索记忆
const { profile, searchResults } = await client.profile({
  containerTag: "user_123",
  q: "What programming style does the user prefer?",
});
console.log(profile.static);   // ["Loves TypeScript", "Prefers functional patterns"]
console.log(profile.dynamic);  // ["Working on API integration"]
// searchResults 为相关记忆列表
```
### 2) Python 快速上手
```bash
pip install supermemory
```
```python
from supermemory import Supermemory
client = Supermemory()
client.add(
    content="User loves TypeScript and prefers functional patterns",
    container_tag="user_123"
)
result = client.profile(container_tag="user_123", q="programming style")
print(result.profile.static)   # 长期事实
print(result.profile.dynamic)  # 近期上下文
```
### 3) 混合检索示例（TS）
```ts
const results = await client.search.memories({
  q: "how do I deploy?",
  containerTag: "user_123",
  searchMode: "hybrid",
});
// hybrid 返回文档（RAG）+ 个人偏好（Memory）
```
### 4) 仅检索记忆（排除文档噪声）
```ts
const results = await client.search.memories({
  q: "user preferences",
  containerTag: "user_123",
  searchMode: "memories",
});
```
### 5) 获取用户画像（并注入系统提示）
```ts
const { profile } = await client.profile({ containerTag: "user_123" });
// profile.static -> 长期事实，profile.dynamic -> 近期上下文
```
### 6) 框架集成示例：Vercel AI SDK
```ts
import { openai } from "@ai-sdk/openai";
import { withSupermemory } from "@supermemory/tools/ai-sdk";
const model = withSupermemory(
  openai("gpt-4o"),
  { containerTag: "user_123", customId: "conv-1" }
);
// 模型调用会自动携带记忆层
```
### 7) 框架集成示例：Mastra
```ts
import { withSupermemory } from "@supermemory/tools/mastra";
const agent = new Agent(withSupermemory(config, "user-123", { mode: "full" }));
```
---
## 六、技术栈与架构解析（推断与官方说明）
- 本地运行：提示包含 `npx supermemory local`，表明本地 CLI/Server 极可能是 Node/TypeScript 生态（且提供 npm 包）。
- 嵌入与图引擎：官方文档称“嵌入式 Supermemory 图引擎 + 本地嵌入模型”，结合默认嵌入 `Xenova/bge-base-en-v1.5`（ONNX/Transformers.js 生态），可实现无需 API Key 的本地向量化。
- 架构图（官方）：
  - 应用/AI 工具
    - Supermemory
      - Memory Engine（抽取、更新、冲突处理、自动遗忘）
      - User Profiles（静态 + 动态）
      - Hybrid Search（RAG + Memory）
      - Connectors（外部数据实时同步）
      - File Processing（多模态提取与分块）。
---
## 七、上手门槛与部署体验
- 不写代码的用户：
  - 方案 A：直接使用 Supermemory App（`app.supermemory.ai`）并搭配浏览器扩展与 MCP，适合个人“第二大脑”。
  - 方案 B：一键安装 MCP，在 Claude Desktop/Cursor 等 IDE 中直接享受“带记忆”的 AI。
- 开发者：
  - API Quickstart 文档完整，npm/pip 一行安装；RESTful API 易接入任何语言。
  - 本地模式：`curl ... | bash` 或 `npx` 即可，首启有交互向导配置模型与嵌入；数据集中在 `./.supermemory`，备份方便。
  - 框架集成：提供了多框架封装，对主流 AI 工程栈友好。
---
## 八、社区活跃度与生命力
- Stars：StarHistory 显示约 29.2k Stars（截至 2026-03-05），属热门开源项目。
- 文档与生态：官网提供 Docs、Quickstart、Dashboard、Discord、集成页面与 Benchmark 页面，并配套多个开源插件（claude-supermemory、cursor-supermemory、opencode-supermemory 等），说明持续维护与生态扩张。
- Benchmarks 与工具：开源 MemoryBench 评测框架，对外提供复现能力，展现“研究+工程”双重视角。
---
## 九、局限与不足
- 运维与集成复杂度（企业场景）：
  - 本地二进制虽简单，但企业级需求（监控、日志、多租户、RBAC、审计）需要自行构建，当前文档偏重开发者体验。
- 学习曲线：
  - “记忆 vs RAG”概念需要团队对齐；混合检索与 profile 用法需要一定的调参经验。
- 生态锁定风险：
  - 虽然 API 兼容多家模型，但记忆层本身是自家实现；若后续协议/商用条款变更，迁移成本需评估。
- 开源协议与商业化边界：
  - 第三方对比文章提到 GitHub 为 MIT 授权（需以仓库为准），但托管平台与 SaaS 服务的定价与限制需结合官网政策审慎采用。
- 多语言/多区域支持：
  - 文档支持简体中文，但对非英文内容的检索质量与时区/本地化实践仍需在实践中验证。
---
## 十、结语与行动建议（通用）
- 终极评判：Supermemory 把“AI 记忆层”做成了可评测、可本地、可集成的基础设施，既适合个人给 AI 工具“装大脑”，也适合企业快速为产品加个性化与上下文能力。其基准成绩、多模态支持与统一 API 让它在同类方案中具有独特竞争力。
- 给个人的建议：
  - 想体验“AI 记住我”：先从 MCP 插件 + Claude Desktop/Cursor 入手，无代码即可感知价值。
  - 对数据隐私敏感：使用 `npx supermemory local`，接 Ollama 实现完全本地闭环。
- 给开发者/团队的建议：
  - 新项目：直接使用 Supermemory API + 框架集成，避免自建记忆层带来的“坑”。
  - 自有评测需求：用 MemoryBench 做基线对比，量化收益，再规模化接入。
- 给企业的建议：
  - 从一个具体场景切入（如客服助手/内部知识问答），结合连接器把既有知识源统一摄入；在合规要求下优先考虑本地部署，并做好备份与迁移预案。
---
## 参考与链接（文中已引用）
- GitHub 仓库（含 README、API 示例、基准与架构图）
- StarHistory（Stars 与趋势）
- Supermemory 官方文档（Quickstart、MCP、集成、Benchmarks）
- Zep 相关论文（用于对比视角）
- 第三方对比（SecondBrain vs Supermemory，含协议信息）
