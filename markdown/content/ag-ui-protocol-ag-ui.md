# ag-ui-protocol/ag-ui

[GitHub URL](https://github.com/ag-ui-protocol/ag-ui)


## AG-UI Protocol 深度评测：Agent 与前端交互的开放标准协议

> AG-UI 是让 AI Agent 与前端界面标准化通信的开放协议，被称为 Agent 协议栈继 MCP、A2A 之后的'第三极'

- **Tags**: AG-UI, Agent协议, CopilotKit, 前端交互, Human-in-the-Loop
- **Category**: AI 编程, 开发工具, 开源项目

## Details

# AG-UI Protocol 深度评测：让 Agent 真正"住进"你的产品，而不是停在对话框里
> 如果说 MCP 让 Agent 长出了手（调用工具）、A2A 让 Agent 学会了协作（多智能体对话），那么 **AG-UI 解决的最后一个问题，是如何让 Agent 把脸贴到用户面前**。它是目前唯一被 Google ADK、Microsoft Agent Framework、AWS Bedrock、LangChain、CrewAI、Mastra、Pydantic AI 等 20+ 主流框架"原生"采纳的 Agent-前端开放协议，Star 数约 **17K**，由已融到 **2700 万美元 A 轮** 的 CopilotKit 主导。一句话：**如果你在做带 UI 的 Agent 产品，绕不开它；如果只是练手聊天机器人，可以先观望。**
---
## 评测速览
| 维度 | 评价 | 备注 |
|------|------|------|
| **项目定位** | Agent ↔ 前端通信协议 | 不是库，是规范 + 多语言 SDK |
| **技术成熟度** | ⭐⭐⭐⭐⭐ | 1.0 规范已冻结，含 JSON Schema |
| **生态广度** | ⭐⭐⭐⭐⭐ | Google / Microsoft / AWS / Oracle 一方支持 |
| **上手门槛** | ⭐⭐⭐⭐ | 有脚手架，但概念需消化 |
| **治理风险** | ⚠️ 中 | 由 VC 支持的初创公司主导，非基金会 |
| **Star 数** | ~17,000+（2026-11） | CopilotKit + AG-UI 合计 40K+ |
| **License** | MIT | 完全可商用 |
| **最适合谁** | 做产品级 Agent 应用的人 | 而不是科研或纯后端 Pipeline |
---
## 01 · 背景：Agent 跑得飞快，前端还在用 2010 年的方式"打招呼"
要理解 AG-UI 为什么会出现，得先理解它要杀死的那个痛点。
传统 Web 的通信范式是 **"请求-响应"**：前端发请求、后端返结果、前端渲染、收工。这种模式在 CRUD 应用里运转良好，但放进 Agent 时代立刻捉襟见肘，因为 Agent 有四个"反传统"的特征：
- **长时间运行且流式输出**：一次回答可能跑 30 秒，token 一个一个吐；
- **不确定性**：Agent 可能中途决定调工具、可能要求人审批、可能改变主意；
- **结构化 + 非结构化混合 IO**：一段文字里可能夹着 JSON、可能夹着一张图、可能夹着一个待用户确认的表单；
- **递归组合**：主 Agent 调子 Agent，子 Agent 再调孙 Agent。
在没有标准协议之前，开发者要解决的是 **"每个 Agent 框架 × 每种前端"的笛卡尔积**：LangChain 要写一套 WebSocket 格式、CrewAI 又要写一套、Mastra 再来一套……再加上文本流 hack、轮询、自造 diff 算法，前端工程师和后端 Agent 工程师被中间这层"胶水代码"折磨得死去活来。
> **一句话类比：AG-UI 做的事，相当于给 Agent 和前端之间装了一个"通用插座"。任何 Agent 只要按标准 emit 事件，任何前端只要按标准消费事件，两边就能直接对接，不用再互相定制。**
AG-UI 由 **CopilotKit** 团队在 2025 年发布，源于他们在为企业构建 in-app Agent 时被这一层胶水折磨出来的真实痛点。2026 年 5 月，CopilotKit 完成 2700 万美元 A 轮融资（Glilot Capital、NFX、SignalFire 领投），AG-UI 已被 Google ADK、Microsoft Agent Framework、AWS Strands、Amazon Bedrock AgentCore、Oracle Agent Spec、LangChain、Mastra、Pydantic AI、Agno、LlamaIndex、AG2、CrewAI 等采纳为 1st-party 集成，每周安装量超过 **400 万次**，企业客户包括 DocuSign、S&P Global、Cisco、Deutsche Telekom、Function Health。
---
## 02 · 它到底是什么：协议、规范，还是又一个 SDK 库？
这是新手最常见的误解，必须先拆清楚。
**AG-UI 不是一个 UI 框架，也不是一个组件库，而是一个"协议规范"**——类似 HTTP、WebSocket、JSON-RPC 的角色。它定义的是：
1. **约 30 种标准事件类型**（早期宣传是 16 种，1.0 后随 Reasoning / Subagent 等扩展到 30+）；
2. **事件的标准 JSON Schema**（机器可读，所有官方 SDK 都从同一份 Schema 生成）；
3. **传输无关性**（SSE、WebSocket、Webhook、HTTP 均可承载）；
4. **双向通信语义**（Agent → 前端推事件，前端 → Agent 也能传消息、中断、审批）。
SDK 只是协议的"参考实现"，官方提供了 **TypeScript、Python、.NET** 三方官方 SDK，社区还贡献了 **Kotlin、Golang、Dart、Java、Rust、Ruby、C++** 等绑定。这意味着你可以用 Rust 写 Agent 后端、用 Kotlin 写 Android 前端，只要双方说 AG-UI 协议，就能通信。
> **关键洞察：协议 + SDK 的分层设计，让 AG-UI 拥有和 HTTP 一样的能力——只要遵循规范，任何语言、任何框架、任何 UI 载体（浏览器、终端、Slack、Teams、原生 App）都可以是它的客户端。**
---
## 03 · 核心架构：事件流是它的灵魂
理解 AG-UI，本质上就是理解它的 **事件驱动模型**。一次完整的 Agent 运行，会通过一个持久化连接（SSE 或 WebSocket）向前端推流一串 JSON 事件。所有事件分为六大类：
### ① Lifecycle 生命周期事件
`RUN_STARTED`、`STEP_STARTED`、`STEP_FINISHED`、`RUN_FINISHED`、`RUN_ERROR`。
作用：让前端能展示进度条、loading 状态、错误兜底。1.0 之后还引入了 `outcome: "cancelled"` 和 Token 用量统计（包括缓存 token、推理 token 的细分语义）。
### ② Text Message 文本消息事件
`TEXT_MESSAGE_START` / `CONTENT` / `END`。
作用：实现"打字机"效果，token 流式渲染。这是所有聊天界面的基础。
### ③ Tool Call 工具调用事件
`TOOL_CALL_START` / `ARGS` / `END` / `RESULT`。
作用：让前端实时显示 Agent 正在调用什么工具、参数是什么、结果是什么，并且可以在敏感操作前**暂停请求人工审批**——这是 Human-in-the-Loop 的关键。
### ④ State Management 状态同步事件
`STATE_SNAPSHOT` + `STATE_DELTA`。
作用：这是 AG-UI **最精妙的设计**。Agent 和前端共享同一个"可变状态"，但不用每次全量重传，而是用 **快照 + 增量 diff** 的方式同步——类似 Excel 协同编辑。Agent 改了第 5 行的某个格子，前端只收到"update cell B3"，而不是整张表格。
### ⑤ Reasoning 推理事件
`REASONING_START` / `MESSAGE_*` / `END` / `ENCRYPTED_VALUE`。
作用：把 Agent 的"内心独白"（思考链）和"对外发言"分离，前端可以选择显示或隐藏。1.0 引入的 `REASONING_ENCRYPTED_VALUE` 还能加密思考链，对商业 Agent 很实用。
### ⑥ Subagent 子代理事件
`SUBAGENT_STARTED` / `FINISHED` / `ERROR`。
作用：一级公民支持子 Agent 的派生、嵌套、并行和归因（attribution），便于在 UI 里画"Agent 协作树"。
加上 `RAW`（透传）、`CUSTOM`（自定义扩展）、`MESSAGES_SNAPSHOT`、`ACTIVITY_*` 等特殊事件，构成了完整的"Agent 行为词汇表"。
> **最大的亮点：** 传统 REST 是"我问你答，答完就完事"；AG-UI 是"我在干活，每 100ms 给你播报一次进度，你随时可以打断、审批、改方向"。**Agent 从黑盒后端变成了一个和你坐在同一张桌子上、可以随时对话协作的同事。**
---
## 04 · 生态位：MCP、A2A、AG-UI 三足鼎立
很多人会把这三个协议搞混，**这是评测 AG-UI 时最值得建立的"心智模型"**：
| 协议 | 解决的问题 | 类比 | 谁主导 |
|------|----------|------|--------|
| **MCP** (Model Context Protocol) | Agent ↔ 外部工具 / 数据源 | Agent 的"手和眼睛"，让它能摸到 GitHub、Notion、数据库 | Anthropic |
| **A2A** (Agent2Agent) | Agent ↔ Agent 协作 | 同事之间的"群聊协议" | Google |
| **AG-UI** (Agent-User Interaction) | Agent ↔ 用户界面 | Agent 的"脸和嘴"，让它能被人看见、被人指挥 | CopilotKit |
三者不是竞争关系，而是**分层互补**：一个完整的客户支持 Agent，可能通过 **MCP** 查客户历史 → 通过 **A2A** 协调技术支持 Agent → 通过 **AG-UI** 在浏览器里向用户实时呈现进度并请求审批。
把这个分层画清楚，你就理解了为什么 Google、Microsoft、AWS 都愿意把 AG-UI 集成到自家 Agent Framework 里——**因为这是 Agent 协议栈里"最后一块拼图"，谁先标准化，谁就占据了 Agent-UI 这一层的入口。**
---
## 05 · 上手体验：10 行代码跑通 Hello World
AG-UI 提供了 **`npx create-ag-ui-app`** 一键脚手架，但为了直观感受协议本身，下面给出两个最小可运行示例。
### 5.1 前端：用 `HttpAgent` 连接任意远端 Agent
```typescript
import { HttpAgent } from "@ag-ui/client";
import { Observable } from "rxjs";
const agent = new HttpAgent({
  url: "http://localhost:8000/my-agent",  // 你的 Agent 后端
  headers: { Authorization: "Bearer xxx" },
});
agent.runAgent(
  { threadId: "t-1", runId: "r-1", messages: [...] },
  {
    onTextMessageContentEvent: ({ event }) => {
      // 把 token 流式渲染到 DOM
      document.body.append(event.delta);
    },
    onToolCallStartEvent: ({ event }) => {
      // 显示"Agent 正在调用 search..."
      showToolCall(event.name);
    },
    onStateDeltaEvent: ({ event }) => {
      // 增量更新共享状态
      applyDelta(event.delta);
    },
  }
);
```
**就这么多**。你不需要处理 WebSocket 协议、不需要自己 diff 状态、不需要写 token 流解析——所有脏活都被协议封装掉了。
### 5.2 后端：用 Python SDK 让 LangGraph Agent 兼容 AG-UI
```python
from ag_ui.encoder import EventEncoder
from ag_ui.langgraph import LangGraphAgent
from my_graph import build_graph
encoder = EventEncoder()
agent = LangGraphAgent(
    name="my_assistant",
    description="A demo agent",
    graph=build_graph(),  # 你原本的 LangGraph 代码
)
@app.post("/my-agent")
async def run_agent(input: RunAgentInput):
    events = agent.stream(input)  # 产生 AG-UI 标准事件流
    return StreamingResponse(
        encoder.encode(events),
        media_type="text/event-stream",
    )
```
只要你的 LangGraph / CrewAI / Mastra Agent 能被包成 `LangGraphAgent` / `CrewAIAgent` / `MastraAgent`，**它就自动变成 AG-UI 兼容的服务**，前端用上面 5.1 的代码就能直接连。
### 5.3 最快体验路径
```bash
# 一行命令生成完整的 Agent + 前端模板
npx create-ag-ui-app my-agent-app
```
官方还有 **AG-UI Dojo**（每个 demo 仅 50-200 行代码，专注演示单个 building block）和 **在线 Demo**：https://agui-demo.vercel.app/ ，强烈建议先去 Dojo 把 16 个事件类型"摸一遍"再开始写业务。
---
## 06 · 生态与社区：为什么 Google/Microsoft 都接入了
评测一个协议，**生态比代码更重要**。AG-UI 在这一项上接近满分：
### 一方集成（1st Party，官方文档 + Demo）
- **Microsoft Agent Framework** ✅（含安全最佳实践文档）
- **Google ADK**（JS + Python）✅
- **Google Antigravity** ✅
- **AWS Strands Agents** ✅
- **Amazon Bedrock AgentCore** ✅
- **Oracle Agent Spec** ✅
- **Mastra / Pydantic AI / Agno / LlamaIndex / AG2** ✅
### 合作伙伴
- **LangChain / LangGraph** ✅
- **CrewAI** ✅
### 社区
- **Claude Agent SDK** ✅
- **OpenAI Agent SDK** 🛠️ In Progress
- **Cloudflare Agents** ✅
- **A2A 协议互通** ✅
### SDK 覆盖
官方：TS / Python / .NET
社区：Kotlin / Golang / Dart / Java / Rust / Ruby / C++ / Nim（进行中）
### 治理与活跃度
- 公开的 **双周 Working Group 会议**，任何人可参与
- **GitHub Issues** 数量活跃（当前 267 个 open，每天有新 Issue 进入）
- AG-UI **1.0 规范已冻结**，引入了明确的版本治理策略：1.0 不变，未来通过 draft + 社区讨论演进
- 1.0 评审期间收到了 **Anthropic、Google、Microsoft、Pydantic、TanStack** 的反馈
> **关键判断：AG-UI 已经越过了"个人项目"阶段，进入"行业标准之争"阶段。** 一旦 Google ADK 和 Microsoft Agent Framework 把它作为默认选项，后来者再想另起炉灶的难度会指数级上升。
---
## 07 · 商业与治理：CopilotKit 的开源赌局
这是评测开源项目必须敢于触碰的灰色地带。AG-UI 背后不是基金会，而是一家**已融资 2700 万美元、约 25 人、总部在西雅图**的初创公司 CopilotKit，创始人是兄弟俩 Atai Barkai 和 Uli Barkai。
### 他们的商业模式
1. **AG-UI 协议**：MIT 协议，完全开源中立；
2. **CopilotKit 库**：开源前端栈（React/Angular/Vue/RN/Slack/Teams 客户端组件）；
3. **CopilotKit Enterprise Intelligence**：商业化产品——自托管、可观测性、Continual Learning、跨设备同步，卖给 Fortune 500。
### 围绕治理的争议
技术媒体 aiwatcher.ai 的评论很尖锐：*"AG-UI 名义上是中立标准，但拥有标准的公司同时在卖高级支持和企业版本，这是每一个开源初创公司都会走的钢丝。"*
CEO Atai Barkai 的回应是：*"AG-UI 是完全开放的协议，我们的商业化产品是为了强化开源栈，而不是替代它。开源版本要让 95% 的用户无需付费、无需联系任何人就能上手。"*
客观地说：
- ✅ 协议本身 MIT、有公开 Working Group、有 JSON Schema、有正式的版本化治理
- ✅ 多家巨头（Anthropic / Google / Microsoft）参与了 1.0 评审，某种意义上形成了"制衡"
- ⚠️ 但**最终合并权、Roadmap 决定权仍在 CopilotKit 手中**
- ⚠️ 与 Vercel AI SDK、assistant-ui、OpenAI Apps SDK 存在直接竞争，"中立性"承诺能否兑现仍待观察
> **建议：** 把 AG-UI 当作"目前事实标准"来采用是理性的，但**关键业务不要把 UI 实现深度绑定到 CopilotKit 闭源产品上**，确保协议层和商业产品层是可替换的。
---
## 08 · 局限与风险：客观存在的几个问题
没有完美的协议，下面这些点值得认真对待。
### ① 事件类型膨胀：从"16 种"变成"30+ 种"
早期宣传是 ~16 种事件，1.0 之后加入了 Reasoning（6 种）、Subagent（3 种）、Activity（2 种）、加密值等，EventType 枚举已经接近 30 个。**对新手来说，"该用哪个事件"的学习曲线变陡了。** 不过 SDK 都提供了高阶封装，多数业务只需关心 5-8 个核心事件。
### ② 协议与 SDK 的耦合度
SDK 是从同一份 JSON Schema 生成的，这本来是优点，但也意味着 **Schema 升级时所有语言 SDK 必须同步**——目前看维护节奏是 Days 级别同步，但若社区 SDK（如 Rust、Nim）跟不上主仓节奏，会出现碎片化。
### ③ 0.x → 1.0 迁移成本
1.0 改动包括：Tool Result 可携带 content parts（图片/文档）、Run 结束语义重构（outcome 字段）、Token Usage 规范化等。**已生产环境的项目升级需要测试覆盖**，官方说"多数用户几乎无需改动"，但重型集成（如自定义 Middleware）建议跑一遍迁移清单。
### ④ 与同类标准的潜在竞争
- **Google 的 A2UI**：声明式 Generative UI 协议，与 AG-UI 的 Generative UI 能力有部分重叠
- **Anthropic 的 MCP Apps**：基于 MCP 的 UI 渲染方案
- **Vercel AI SDK**：JavaScript 生态里的强势对手，绑定 Vercel 全栈
- **assistant-ui**：专注 React 聊天 UI 的组件库
CopilotKit 的应对策略是"全都支持"——同时兼容 AG-UI、A2UI、MCP Apps，但这让它的客户端 SDK 变得相当庞大。
### ⑤ 治理风险（再次强调）
协议主导权集中在一家风投支持的初创公司手中，是长期最大变量。**任何把 AG-UI 作为"未来十年基础设施"的企业，都应保留自建适配层的能力。**
---
## 09 · 与同类方案的对比
| 方案 | 类型 | 优势 | 劣势 | 适合谁 |
|------|------|------|------|--------|
| **AG-UI** | 开放协议 + 多语言 SDK | 跨框架、跨语言、被巨头采纳、1.0 已冻结 | 治理集中、事件略多 | 想做产品级、跨栈 Agent 应用的团队 |
| **Vercel AI SDK** | JS 库（非协议） | DX 极佳、与 Next.js 深度集成、文档漂亮 | 强绑定 Vercel 生态、非协议（难跨语言） | 全栈 JS 团队、Vercel 重度用户 |
| **assistant-ui** | React 组件库 | UI 精致、开箱即用 | 只是 UI 层、无协议抽象 | 只需快速搭聊天界面的前端 |
| **MCP** | 协议（Anthropic） | 工具生态爆炸、已成事实标准 | 不解决 UI 问题 | 所有 Agent 都该用，但解决的是另一层 |
| **OpenAI Apps SDK** | 闭源 SDK | 与 ChatGPT 深度集成 | **仅限 ChatGPT 内部**，无法用在自己产品 | 想进 ChatGPT 分发的开发者 |
| **自研 WebSocket 协议** | 自造轮子 | 完全可控、无外部依赖 | 重复造轮、无生态 | 仅推荐给有强合规/定制需求的团队 |
> **结论：AG-UI 在"开放协议"这一档没有真正对等的对手**——Vercel AI SDK 是库不是协议，OpenAI Apps SDK 是围栏花园，MCP 解决的是另一层。**它是当前唯一一个"协议级"的 Agent-UI 标准。**
---
## 10 · 结语：谁该上车、谁该观望
### ✅ 立刻上车的人
1. **正在做"带 UI 的 Agent 产品"的全栈团队**——能用 AG-UI 替掉你 80% 的胶水代码，让前端工程师和 Agent 工程师解耦；
2. **企业内部要在多个产品里嵌入 Agent 能力**——AG-UI 让你写一次 Agent，多个前端（Web、移动端、Slack、Teams）都能直接接；
3. **需要 Human-in-the-Loop 的严肃业务**（金融审批、医疗决策、运维操作）——`INTERRUPT` 事件和 Tool Call 审批机制是为这种场景量身定做的；
4. **要在 LangChain / Mastra / Pydantic AI / CrewAI 之间换框架**——AG-UI 是事实上的解耦层，换框架时前端代码不用动。
### 🤔 先观望的人
1. **只在终端跑 Pipeline 的纯后端 Agent**——你根本不需要 UI，MCP + 自己写的 CLI 就够；
2. **重度绑定 Vercel 全栈的 JS 团队**——Vercel AI SDK 的 DX 在 JS 生态里更好，没必要为了协议级能力换栈；
3. **对治理敏感、要求协议由基金会主导的企业**——可以等 1.x 演进一两轮再深度绑定；
4. **学生 / 玩票项目**——直接 `npx create-ag-ui-app` 体验 1 小时即可，不必深究规范。
### 📌 行动清单
| 你的情况 | 推荐动作 |
|---------|---------|
| 想快速感受 | 跑官方 Demo：https://agui-demo.vercel.app/ |
| 想动手写 | `npx create-ag-ui-app my-app`，跑通 LangGraph + React 模板 |
| 想深学规范 | 读 https://docs.ag-ui.com/spec/1.0 和 AG-UI Dojo 源码 |
| 想跟进演进 | 加入 Discord + 双周 Working Group |
| 担心锁定 | 协议层走 AG-UI，UI 层自己写或用 assistant-ui，避开 CopilotKit 闭源产品 |
---
## 终极判断
**AG-UI 是 2025-2026 年 Agent 生态里少有的"基础设施级"创新**——它没有炫酷的模型能力，却精准切中了"Agent 时代前端应该如何工作"这个被忽视的空白。从 Star 增长曲线（一年从 0 到 17K）、巨头采纳速度、以及 CopilotKit 的融资进度来看，它已经基本坐稳了 **"Agent 协议栈第三极"** 的位置。
它不是没有风险——治理集中、生态竞争、协议本身的复杂度都在持续演化。但 **"Agent 必须有标准化的 UI 通信层"** 这个方向，已经被 industry 共识确认。AG-UI 不一定是最终胜出的协议，但**它跑通的这套事件模型（流式、双向、状态同步、可中断、Human-in-the-Loop），几乎可以肯定是未来 Agent 应用的标准范式。**
> **一句话收尾：MCP 让 Agent 有了手，A2A 让 Agent 有了同伴，AG-UI 让 Agent 有了脸。在 Agent 真正"长出脸"这件事上，目前没有任何开放协议比它走得更远。**
