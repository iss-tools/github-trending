# anthropics/claude-quickstarts

[GitHub URL](https://github.com/anthropics/claude-quickstarts)


## Anthropic claude-quickstarts：17 个官方可跑通的 Claude Agent 实战脚手架深度评测

> Anthropic 官方维护的 17 个可跑通 Agent 示例仓库，是学习 Claude Agent 开发最有价值的实战入口。

- **Tags**: Anthropic, Claude, AI Agent, Computer Use, Managed Agents
- **Category**: 开发工具, AI 编程, 开源项目

## Details

# Anthropic claude-quickstarts 深度评测：一套被严重低估的「AI Agent 标准示范田」
> **一句话总结**：这是 Anthropic 官方维护的 Claude API 实战脚手架合集，包含 17 个可跑通、可改造的 Agent 项目，从客服机器人到自动操控桌面的 Computer Use 再到能定时跑任务的 Managed Agents，是目前了解「Anthropic 系 Agent 开发范式」最权威、最高效的入口，但门槛并不像宣传语那样"五分钟上手"。
---
## 一、背景与痛点：为什么 Anthropic 要做这个仓库
Claude 的 API 与 OpenAI 生态有几个显著差异：**官方不提供一条龙的一站式 SDK**，而是把核心能力（Tool Use、Computer Use、Managed Agents、Agent SDK、MCP）拆成若干独立协议与模块。对开发者来说，光看文档很难直观理解"这些能力拼在一起到底长什么样"。
`claude-quickstarts` 就是 Anthropic 给出的「**示范田**」——不是 hello world，而是一个个**可以真的跑起来的、贴近生产场景的参考实现**。它解决的痛点非常具体：
- **不知道 Tool Use 怎么组织**：客服 Agent 示例直接把 RAG、模型切换、UI 全部搭好；
- **不知道 Computer Use 到底怎么跑**：Docker 容器一启动，Claude 真的会去点你的鼠标；
- **不知道 Managed Agents 这种"托管式 Agent"和普通 Agent 区别在哪**：仓库里甚至一口气给了 8 个 Managed Agents 示例，覆盖 Slack / Linear / Sentry / Chat SDK / MCP Server 等主流场景。
仓库由 Anthropic 官方组织维护，**MIT 协议、活跃更新**，截至 2026 年 10 月已有约 19k star、1.7k fork、90 个 open issue，是 Anthropic GitHub 组织里除了 Claude Code（155k star）、Claude Cookbooks（54k star）之外体量最大的实战项目之一。
> 💡 **一个冷知识**：这个仓库最早叫 `anthropic-quickstarts`，后来随着 Claude 品牌统一改名为 `claude-quickstarts`，老链接会自动 302 跳转。网上大量 2024 年的教程截图还是老路径，不要被绕晕。
---
## 二、Quickstart 项目全景图：一张表看清 17 个示例
为方便您快速定位感兴趣的示例，先上一张**分类导航表**：
| 项目 | 类型 | 核心能力 | 技术栈 | 适合谁 |
|------|------|---------|--------|--------|
| **Customer Support Agent** | RAG 对话 | 知识库问答 + 情绪识别 | Next.js + shadcn/ui + Amazon Bedrock KB | 想做客服/知识库机器人 |
| **Financial Data Analyst** | 数据分析对话 | 上传财报 → 抽指标 → 可视化 | Next.js + 图表库 | 金融/BI 方向开发者 |
| **Computer Use Demo** | 桌面操控 | 截图 + 鼠标键盘控制 | Docker 容器 + Python | 想体验"AI 用电脑" |
| **Computer Use Best Practices** | 桌面操控进阶 | 原生 macOS + 教学级最佳实践 | Python + 原生 macOS（建议跑 VM） | 想造生产级 Computer Use Agent |
| **Browser Use Demo** | 浏览器自动化 | DOM 操作 + 表单填写 | Playwright + Python | 想做爬虫/RPA 类 Agent |
| **Browser Toolset Quickstart** | 最小示例 | CDP 协议 + 浏览器 Toolset | Python / TypeScript | 想"读懂"协议的人 |
| **Computer Toolset Quickstart** | 最小示例 | VNC 协议 + Computer Toolset | Python / TypeScript | 想理解底层协议 |
| **Autonomous Coding Agent** | 编码 Agent | 双 Agent 模式（初始化 + 编码）| Claude Agent SDK | 想做自己的 Claude Code |
| **Managed Agents: Chat SDK** | 托管 Agent | 持久会话 + 流式 UI | Next.js + Vercel Chat SDK | 想做 SaaS 聊天产品 |
| **Managed Agents + CopilotKit/AG-UI** | 托管 Agent | 生成式 UI + 流式渲染 | CopilotKit + AG-UI 协议 | 想做"看得见的 Agent" |
| **Managed Agents: Daily Brief** | 定时 Agent | Cron 调度 + 多源汇总 | `ant apply` 部署 | 想做"每日简报"自动化 |
| **Managed Agents: Knowledge Wiki** | 文档蒸馏 | 文档 → Wiki → 低成本问答 | Managed Agents + Memory Store | 投研/律所/咨询 |
| **Managed Agents: Linear** | IM 集成 | Webhook 桥 + 无状态 | Linear OAuth | 团队工作流自动化 |
| **Managed Agents: MCP Server** | MCP 桥接 | 把 Managed Agent 暴露成 9 个工具 | TypeScript + stdio/HTTP | 让 Claude Desktop 调用自家 Agent |
| **Managed Agents: Road Trip Planner** | 多 Agent 协作 | 多 Agent + 凭据注入 + 模型覆盖 | Next.js（无 DB）| 想看 Multi-Agent 怎么编排 |
| **Managed Agents: Sentry** | 定时 Agent | Cron + OAuth Vault | Managed Agents 部署 | 运维/告警分诊 |
| **Managed Agents: Slack** | IM 集成 | @mention + Webhook | 无 DB、无长连接 | 最轻量 Managed Agent 入门 |
> 🎯 **直观判断**：仓库结构其实分三层——
> - **第一层（传统 API 示例）**：客服 Agent、金融分析师，教你怎么用 API + RAG；
> - **第二层（Computer Use / Browser Use）**：教你怎么让 Claude 操控图形界面；
> - **第三层（Managed Agents 全家桶，占 8 个）**：这是 2025 年下半年才推出的"**Agent 即服务**"托管模式，是仓库当前的重头戏。
---
## 三、核心亮点：它做对了什么
### 1. 比官方 Cookbook 更"工程化"
Anthropic 生态有三个互补仓库，定位差异明显：
- **Claude Cookbooks**（54k star）：**教程向**，大量 Jupyter Notebook，教你"为什么这样写"；
- **claude-quickstarts**：**工程向**，每个都是独立 npm/pip 工程，可以 `git clone` 后直接改造成自己的产品；
- **Claude Code**（155k star）：**终端工具**，面向最终用户而非开发者。
如果你读完 Cookbook 不知道下一步怎么落地，`claude-quickstarts` 就是那道"从教程到产品"的桥梁。
### 2. Computer Use / Browser Use 的"双套"设计极聪明
仓库刻意给出了**两个层级**：
- **Demo 版**（容器化、开箱即用）：适合"先看看 Claude 怎么操作电脑"的体验派；
- **Toolset Quickstart 版**（不到 200 行代码、纯协议演示）：**故意不依赖任何 VNC/CDP 库**，直接手写 RFB 协议，让你看清楚 `computer_toolset_20260801` 这个 Toolset 到底发了什么 JSON、Claude 返回了什么 action。
这种"**既能用、又能看懂底层**"的设计在官方仓库里非常少见，是 Anthropic 这次少有的高光之作。
### 3. Managed Agents 示例覆盖度惊人
2025 年下半年 Anthropic 推出 Managed Agents——可以理解成"**Agent 领域的 Serverless**"：你只定义 Agent 该做什么，沙箱、工具执行、会话持久化都由 Anthropic 托管，按 token + 会话数计费。
仓库针对这个新范式一口气给出 8 个示例，覆盖了几乎所有真实业务场景：
- **定时任务**（Daily Brief、Sentry）
- **IM 集成**（Slack、Linear）
- **知识蒸馏**（Knowledge Wiki）
- **多 Agent 协作**（Road Trip Planner）
- **桥接既有生态**（MCP Server、Chat SDK、CopilotKit）
这种"**一个新范式 + 8 种典型落地**"的打法，比大多数竞品的零散示例更系统。
### 4. 教学级"最佳实践"示范
`Computer Use Best Practices` 这个项目尤其值得单独点赞——它是一个**原生 macOS 实现**，明确列出了它示范的工程模式：
> 显式工具定义、正确的图像尺寸与裁剪、Prompt Caching、服务端压缩、批量工具调用、沙箱 Shell、轨迹记录。
这些都是从 Demo 走向生产必踩的坑，Anthropic 把它单独拎出来做成"教学版"，**诚意可见**。
---
## 四、上手体验与代码示例
### 整体步骤（所有示例通用）
```bash
# 1. 拿到 API Key
#    到 https://console.anthropic.com 注册并生成
# 2. 克隆仓库
git clone https://github.com/anthropics/claude-quickstarts
cd claude-quickstarts
# 3. 进入你感兴趣的示例
cd customer-support-agent  # 或者其他
# 4. 安装并配置
npm install
cp .env.example .env.local
# 编辑 .env.local，填入 ANTHROPIC_API_KEY
# 5. 跑起来
npm run dev
```
### 示例 1：Computer Use Demo（最炫酷的一条命令）
```bash
export ANTHROPIC_API_KEY=your-key
docker run \
    -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
    -v $HOME/.anthropic:/home/user/.anthropic \
    -p 5900:5900 -p 5901:5901 -p 6080:6080 -p 8080:8080 \
    -it ghcr.io/anthropics/anthropic-quickstarts/computer-use-demo:latest
```
然后浏览器打开 `http://localhost:8080`，就能看到 Claude 真的在使用一台 Linux 桌面——**点鼠标、打字、截图、看图、再点击**，全程由模型决策。这是 Simon Willison 在 Computer Use 发布当天的推荐入口。
### 示例 2：Agent SDK（最简洁的一段代码）
`Autonomous Coding Agent` 用的就是 Anthropic 自己开源的 Agent SDK，核心 API 只有几十行：
```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";
for await (const message of query({
  prompt: "What files are in this directory?",
  options: {
    model: "opus",
    allowedTools: ["Glob", "Read"],
    maxTurns: 50
  }
})) {
  if (message.type === "assistant") {
    for (const block of message.message.content) {
      if ("text" in block) console.log(block.text);
    }
  }
  if (message.type === "result") {
    console.log("Cost:", message.total_cost_usd);
  }
}
```
SDK 会自动处理 agent loop、工具调用、上下文管理——**这是把 Claude Code 的"心脏"抽出来给你用**。
### 示例 3：Customer Support Agent（一键 RAG）
它的 `.env.local` 模板：
```env
ANTHROPIC_API_KEY=your_anthropic_api_key
BAWS_ACCESS_KEY_ID=your_aws_access_key
BAWS_SECRET_ACCESS_KEY=your_aws_secret_key
```
UI 是 Next.js + shadcn/ui，自带**思维过程可视化**、**知识库溯源展示**、**用户情绪识别**三大特色功能。后端 RAG 用的是 Amazon Bedrock Knowledge Bases——这意味着**你还需要一个 AWS 账号并创建 Bedrock KB**，这一点 README 写得很清楚。
---
## 五、谁最适合用？分人群收益地图
| 你的身份 | 推荐先看哪几个 | 能拿到什么 |
|---------|--------------|-----------|
| **第一次接触 Claude API 的工程师** | Customer Support Agent、Browser Toolset Quickstart | 理解 Tool Use、RAG、Prompt 设计的最小完整闭环 |
| **想做 SaaS 聊天产品的创业者** | Managed Agents: Chat SDK、CopilotKit 版 | 直接抄前端 + 鉴权 + 会话管理的工程范式 |
| **想做"AI 操作电脑/浏览器"产品** | Computer Use Demo（入门）、Computer Use Best Practices（进阶）| 拿到 Anthropic 内部认可的工具调用节奏与成本优化方案 |
| **想自动化团队工作流** | Managed Agents: Slack / Linear / Daily Brief | 不写一行服务器代码就能接入 IM，全靠 Webhook |
| **金融/律所/咨询从业者** | Financial Data Analyst、Knowledge Wiki | 理解怎么把"百万字文档"蒸馏成低成本可查询的 Wiki |
| **研究 Agent 架构的工程师** | Browser Toolset Quickstart、Computer Toolset Quickstart | 读懂 Toolset 协议本质，方便自研 |
| **想给 Claude Desktop 写 MCP 插件** | Managed Agents: MCP Server | 直接复用 9 个工具封装 |
---
## 六、与同类项目的横向对比
横向比较几个"官方 AI Agent 示例仓库"，可以更清楚地看到 `claude-quickstarts` 的独特定位：
| 仓库 | 维护方 | 数量 | 风格 | 强项 | 弱项 |
|------|-------|------|------|------|------|
| **anthropics/claude-quickstarts** | Anthropic 官方 | 17 | 工程化、贴近产品 | Managed Agents 示例独此一家；Computer Use 双层教学 | 部分示例绑死 AWS Bedrock |
| **openai/openai-cookbook** | OpenAI 官方 | 100+ | Notebook 教程向 | 覆盖广、更新勤 | 大多不是可部署工程 |
| **langchain-ai/langchain** | LangChain | N/A | 框架 + 示例 | 生态最大 | 抽象层厚，初学者易迷路 |
| **microsoft/autogen** | Microsoft | N/A | 多 Agent 框架 | Multi-Agent 强 | 学习曲线陡 |
| **anthropics/claude-cookbooks** | Anthropic 官方 | 50+ | Jupyter 教程 | 原理讲解深入 | 偏理论，工程化弱 |
> 🤔 **关键差异**：langchain/autogen 是"**框架**"——要你按它的范式写代码；而 `claude-quickstarts` 是"**参考实现**"——你可以直接 copy 然后**只改业务逻辑**，不被任何框架绑架。这一点对生产项目尤其重要。
---
## 七、局限与不足：必须泼的三盆冷水
作为评测，不能只夸不批。这个仓库有几个**真实存在的问题**：
### 1. "Quickstart" 名字有点夸大
README 写着"quickly get started"，但现实是：
- **Customer Support Agent 强依赖 Amazon Bedrock**——没有 AWS 账号、没建过 Bedrock KB 的人，光配置就得花一两个小时，远比 OpenAI 一个 `OPENAI_API_KEY` 就能跑的 Quickstart 麻烦；
- **Managed Agents 系列需要先在 Anthropic Console 完成 Agent 部署**，新手要理解 session、vault、memory store 三层概念，并不"quick"；
- **Computer Use Demo 拉的 Docker 镜像有 8GB+**，国内网络拉镜像经常卡死。
### 2. 部分示例代码质量参差不齐
Customer Support Agent 的 README 末尾**自带免责声明**：
> "This project is a prototype and is provided on an 'as-is' basis. It is not intended for production use..."
这一点要给 Anthropic 加分（诚实），但也意味着**你不能直接 clone 完就上生产**——鉴权、并发、错误处理、限流都要自己补。
### 3. 强绑 Anthropic 生态，迁移成本高
- Computer Use / Browser Use 用的 `computer_toolset_20260801`、`browser_toolset_20260801` 是 **Anthropic 自定义协议**，无法直接迁移到 GPT 或 Gemini；
- Managed Agents 是**Anthropic 独家托管服务**，按 token + 会话数计费，重度使用时成本可观（Opus 4.6 是 $5/M input + $25/M output）；
- 客服示例绑 Bedrock、金融示例绑其数据源，**想换成阿里云百炼、火山方舟等其他大模型平台需要重写大量代码**。
### 4. 模型名更新滞后
仓库示例里仍能看到 `claude-3-haiku-20240307`、`claude-3-5-sonnet-20240620` 这类 2024 年的旧模型 ID，而 Claude 已经迭代到 4.5 / 4.6 系列。**直接复制旧模型 ID 会遇到"模型不存在"的报错**，需要自己改成最新型号。
### 5. Issue 积压
截至撰写时仓库有 **90 个 open issue、25 个 open PR**，对于官方仓库来说响应速度中等偏慢，**遇到报错别指望 Issue 一定能救你**，更多得靠社区自救。
---
## 八、避坑指南：上手前必读的 5 条建议
1. **先确认 API 可用**：用一行 `curl` 测试 `ANTHROPIC_API_KEY` 是否生效，再去跑示例，避免把网络问题和代码问题混淆；
2. **Bedrock 不是必需**：Customer Support Agent 想跑通最少配置，可以临时把 Bedrock 调用注释掉，先看 UI 与模型对话是否正常；
3. **Computer Use Demo 务必用 VM 或 Docker**：**绝不要直接在本机跑**，Claude 真的会去点你鼠标、删你文件；
4. **注意 Token 消耗**：Computer Use 每次截图都是数千 token 输入，跑一小时可能烧掉几美元，建议先设 `max_turns` 上限；
5. **紧跟模型版本**：跑之前先去 `platform.claude.com/docs` 查最新模型 ID，把示例里的硬编码改掉，否则大量报错其实只是模型名错了。
---
## 九、结语与行动建议
**终极评判**：`claude-quickstarts` 不是被高估的神作，而是一个被低估的"**Anthropic 系 Agent 工程范本**"。它的最大价值不在于"写得多优雅"，而在于**把 Anthropic 体系里所有抽象概念（Tool Use、Toolset、Managed Agent、Agent SDK、MCP）都对应到了一个能跑、能改的真实项目上**。
**三句话总结不同读者的行动建议**：
- 🌱 **新手**：直接跑 `Computer Use Demo`（一条 docker 命令）+ `Browser Toolset Quickstart`（百行代码读懂协议），这两步走完你对 Claude 能力边界就有直觉了；
- 🚀 **工程师**：把 `Customer Support Agent` 当作**Next.js + RAG + Tool Use**的工程模板，把 `Autonomous Coding Agent` 当作**Agent SDK**的入门教材，消化完就能开始写自己的产品；
- 🏢 **架构师/决策者**：重点研究 **Managed Agents 系列 8 个示例**——这代表了 Anthropic 对"Agent 即服务"赛道的下注方向，决定了未来 12 个月生态会往哪里演化。
仓库地址：**github.com/anthropics/claude-quickstarts**（MIT 协议，随便 fork 改造）。
如果你已经在用 OpenAI 生态，建议把这个仓库当作"**对照组**"来看——同一个 Agent 场景，Anthropic 是怎么切的、协议设计有何不同，**这种横向视野比单纯学一个 SDK 更值钱**。
