# CopilotKit/OpenBot

[GitHub URL](https://github.com/CopilotKit/OpenBot)


## OpenBot 深度评测：给每个 AI Agent 一间带保险门的独立工位

> CopilotKit 开源的 AI 数字同事平台，为每个 Agent 提供独立容器、专属浏览器和 fail-closed 治理网关，MIT 协议可完全自托管。

- **Tags**: CopilotKit, AG-UI, Agent治理, 自托管, 开源
- **Category**: 开发工具, AI Agent, 开源项目

## Details

# 深度评测：CopilotKit/OpenBot —— 把每个 AI Agent 关进带保险门的独立工位
> **一句话总结**：OpenBot 是 CopilotKit 团队在 2026 年 8 月开源的"AI 数字同事"平台——它不只是又一个聊天窗口，而是给每个 AI Agent 分配一台独立"电脑"（独立 Docker 容器 + 专属 Chromium 浏览器 + 隔离文件工作区），所有动作都经过一道"先决策、后执行、必留痕"的治理网关，MIT 协议完全自托管，截止 2026 年 10 月 GitHub Star 已突破 7k，被多个独立评测称为**"敢把它放在安全团队面前"的开源 Agent 治理参考实现**。
---
## 一、背景与痛点：为什么"Agent Demo 好看，上生产就翻车"
如果你在过去两年里玩过浏览器自动化 Agent、Manus 类的"数字员工"、或者自己写过 LangGraph 工作流，大概率经历过这样的尴尬时刻：
- **能力与信任的悖论**：Agent 不能点鼠标就是聊天框，但能点鼠标、能拿你登录态的 Agent，就是一颗定时炸弹。README 用一句话戳穿现状：*"An agent that can use your tools is not the same thing as an agent you can let near them"*（"能用你工具的 Agent"和"你敢让它靠近你工具的 Agent"是两回事）。
- **审计变成"事后补作业"**：绝大多数 Agent 框架的日志是"跑完顺手写一份"，而 OpenBot 的设计哲学反过来——**没有写审计行的动作根本不允许发生**。
- **框架绑定地狱**：今天用 LangGraph，明天换 Mastra、后天 CrewAI，把治理逻辑焊死在某一个框架上，等于两年后要连根拔掉。
**OpenBot 就是冲着这三个老问题来的**。它由以色列兄弟 Atai Barkai 和 Uli Barkai 创办的 CopilotKit 公司打造——这家公司 2026 年 5 月刚完成由 Glilot Capital、NFX、SignalFire 领投的 **2700 万美元 A 轮融资**，核心框架 CopilotKit 在 GitHub 有 4 万+ Star，并且主导了 **AG-UI（Agent-User Interaction Protocol）开放协议**，已被 Google、Microsoft、Amazon、Oracle 等巨头采纳。换句话说，**OpenBot 不是团队副业，而是其"企业级 Agent 前端栈"战略的关键拼图**。
> 💡 **小白版比喻**：把 OpenBot 想象成一间数字办公室——每个 AI 同事有自己的工位（Docker 容器）、自己的电脑（专属浏览器和登录态）、自己能开的那几个抽屉（被授权的工具），而办公室前台（治理网关）会记录每位同事每一次抽屉操作。它不是又一个"聊天窗口"，而是一整套"AI 员工管理制度"。
---
## 二、核心亮点：三道防线把 Agent 从"野马"变成"合规员工"
### 1. 每个 Bot 一台独立"电脑"（Per-Bot Computer）
这是 OpenBot 最有辨识度的设计。Supervisor 进程会为每个 Bot 启动一个独立 Docker 容器，里面装着：
- **专属 Chromium 浏览器**：A 同事登录过的 Gmail，B 同事在物理上碰不到（不只是一个共享沙箱里的不同标签页）。
- **独立的 `/workspace` 文件卷**：文件读写严格锁死在自己工作区里。
- **可选 gVisor 内核级隔离**（`COMPUTER_RUNTIME=runsc`）：连内核syscall都被沙箱化。
- **仅绑定 127.0.0.1 + 每容器独立 Token**：知道端口也连不进去。
Supervisor 进程被刻意"瘦身"——只暴露 `ensure / stop / reset / list` 四个动词，**禁止直接命名容器**，源码注释明确写出威胁模型："把 Docker socket 放进 API Server，等于让每一个请求处理 bug 离宿主机只剩一步之遥"。
### 2. CEL 治理网关：fail-closed 的"动作决策门"
这是源码层面最值得玩味的部分。所有对浏览器、文件、MCP、组件的操作，必须经过唯一一道 `server/src/computer/gateway.ts`，它做四件事，顺序严格：
```
解析 ref → 评估 CEL 策略 → 先写审计行 → 才执行动作
```
- **fail-closed 语义**：Deny 规则先于 Allow 评估；策略为空则什么都不允许；**策略规则写错了是"拒绝"而不是"放行"**；策略文件本身格式错误，服务器直接拒绝启动。
- **元素 ref 不透明化**：模型看到的"按钮 5"是一串由服务端 ARIA 快照生成的引用，点击时必须回传这个 ref——堵死了"模型嘴上说点 A，实际代码里点 B"的越权路径。
- **审计不是日志，是闸门**：拒绝的动作会带着触发它的具体规则名返回，前台可读 `/admin/audit` 一目了然。
### 3. Take the Wheel：人在关键时刻"接管方向盘"
Bot 遇到登录墙、2FA、CAPTCHA 时会主动求助；管理员在同一个面板里接管浏览器，**接管期间 Bot 的动作直接被拒（不是排队）**，全部过程以 `computer.help_requested / control_taken / control_released` 事件留痕。v0.0.5 又把这个能力做成了"任何时刻人可主动介入"。
### 4. AG-UI 协议：不绑死任何一个 Agent 框架
这是 OpenBot 区别于 LangGraph/CrewAI 等"框架类"竞品的关键——**它跑在框架之上，而不是替代框架**。任何说 AG-UI 的 endpoint 都能接入为 Bot，包括：
- LangGraph、Mastra、CrewAI、Pydantic AI、Google ADK 构建的 Agent
- 手写的 Agent（只要实现 AG-UI endpoint）
- 端点校验走的是和浏览器导航同一套私网/URL 检查
> 💡 **为什么这很重要**：你可以继续用自己团队的 Agent 栈，OpenBot 只负责把它"装进"一个有治理、有 UI、有审计、有权限的公司级壳子里——这是它和 Dify、AutoGPT 完全不同的赛道。
### 5. 其他值得一提的细节
- **组件式输出（Generative UI）**：Agent 回复不只是文本，可以是 React 组件（图表、表格、按钮），还能在 `/admin/playground` 里写沙箱组件免部署发布。
- ** governed MCP**：内置 Atlassian、Box、Slack、Salesforce、ServiceNow、Google Drive、Notion 连接器；任何未明确分类为"读"的 MCP 工具**默认按"写"处理**，权限 fail-closed。
- **密钥永不出壳**：审计只记录密钥长度，不记录内容；密钥加密存储、API 永不返回。
- **Routine 定时任务**：可以配置"每天早上九点发晨会简报"，运行时继承创建者的权限，且失败 N 次自动停用。
---
## 三、上手门槛与部署体验：Alpha 但不糊弄
### 环境要求
| 组件 | 要求 | 说明 |
|---|---|---|
| Docker | 必装 | 跑 PostgreSQL 和 Bot 容器 |
| Bun | 1.3+ | 应用和 API 服务器的运行时 |
| CopilotKit Intelligence | 免费 plan 即可 | 跑线程/记忆，也可自托管 |
| 模型 API Key | 自备 | OpenAI / Anthropic / Google 任选，无内置模型 |
### 最小可运行命令（来自官方 README）
```bash
# 1. 克隆 + 配置
git clone https://github.com/CopilotKit/openbot.git
cd openbot
cp .env.example .env
# 2. 拿 CopilotKit Intelligence 凭证
npx --yes copilotkit@latest login
npx --yes copilotkit@latest project select
npx --yes copilotkit@latest license --write
# 把 cpk-... 填到 .env 的 INTELLIGENCE_API_KEY
# 3. 填模型 Key（KEY_ENCRYPTION_KEY 本地可用示例值，生产用 openssl 生成）
# OPENAI_API_KEY=sk-...
# 4. 启动
bun install
bash scripts/start.sh
# 自动：起 Docker、跑数据库迁移、起 API(3001) + 前端(3010)、做健康检查
# 5. 打开 http://localhost:3010
```
新克隆的仓库默认 `OPENBOT_SINGLE_USER=true` 单管理员模式，**配置好 OAuth 登录后才能开放给团队**——这是刻意的安全设计。
### 单容器极简部署（v0.0.x 新增）
```bash
docker build -t openbot .
docker run -p 3001:3001 --env-file .env \
  -e EMBEDDED_POSTGRES=on -v openbot-data:/var/lib/postgresql/data openbot
```
一个镜像把前端、API、Bot 浏览器、PostgreSQL 都打包了，不用 Kubernetes。
### 文档与 DX
官方文档在 `docs/` 目录下分模块（configuration.md、coworkers.md、deployment.md），README 自带 `Main surfaces` 路由表（`/agents`、`/bot`、`/admin/audit`、`/admin/boundaries` 等 13 个页面），结构清晰。**但要注意：当前处于 Alpha 阶段，官方明确警告会有破坏性变更**，v0.0.5 的 changelog 里就修复了一个"egress 规则 IP 段写错被当成 `/0` 放行所有地址"的安全 bug。
### 社区活跃度
| 指标 | 状态 |
|---|---|
| 发布日期 | 2026-08-20 |
| 4 天 Star 数 | 600 |
| 2 个月 Star 数 | ~7,000（截至 2026-10-23） |
| 最新版本 | v0.0.5 |
| License | MIT |
| 维护节奏 | 高频迭代，Issue/PR 活跃 |
---
## 四、真实场景演示：每个动作都有"案底"
官方 README 给了三个最直观的测试路径，可以直接抄作业：
```
Try it:
1. 在 /bot 页面输入："Open news.ycombinator.com and tell me the top story."
   → Bot 在自己的 Chromium 里打开 HN，读头条返回给你，
     你可以在 /channel 页面右侧的 Live Screen 看到它真实操作的画面。
2. 让 Bot 填写 https://httpbin.org/forms/post 测试表单，
   然后去 /admin/audit 看每一步动作的审计记录。
3. 在 /admin/boundaries 添加一条 deny 规则（比如"禁止访问 google.com"），
   重新执行同一动作，看它如何被拒绝并返回具体的规则名。
```
**小白版理解**：就像雇了一个新同事，你可以在他工位后面站着看（Live Screen）、查他的操作台账、贴一张"这扇门不许开"的告示——而且这三件事都是产品功能，不是事后追查。
---
## 五、目标人群与收益：谁该关注，谁能拿到什么
| 人群 | 核心收益 | 成本提示 |
|---|---|---|
| **平台/安全团队** | 拿到一个开源、可读、可审计的"Agent 治理"参考实现，直接抄架构去自建 | 需要 Docker + Bun + 模型 Key 的运维能力 |
| **AG-UI 生态开发者** | 一个完整的 coworker 参考实现，把你的 Agent 变成有 UI、有权限、有屏幕的"员工" | 需要理解 AG-UI endpoint |
| **企业内部工具负责人** | 数据不出企业、模型自选、协议开放、可以深度定制 | 模板而非产品，自己扛升级与维护 |
| **想研究 Agent Safety 的工程师** | 源码即教材：怎么写 fail-closed 策略、怎么做不透明 ref、怎么设计审计 | 中等阅读门槛 |
**避坑提醒**：如果你期待"一键起个团队 Copilot、今天就把全公司接上"——这不是 OpenBot 的定位，它是给愿意自己动手的人准备的。
---
## 六、竞品横向对比：开源 Agent 同事赛道格局
2026 年下半年，Grok Bot（xAI，8 月 11 日发布，闭源）带火了"Roster of bots + cloud computer"这个产品形态，短短两个多月出现了多家开源对标。Bitdoze 在 10 月底做了一次系统评测，以下是核心数据：
| 项目 | Stars | License | 界面 | 电脑隔离 | 模型支持 |
|---|---|---|---|---|---|
| **OpenBot (CopilotKit)** | **7.0k** | **MIT** | Web | **每 Bot 独立容器 + Chromium** | **任意 AG-UI agent** |
| Rakazo | 5.3k | Apache-2.0 | Web + 桌面 + iOS/Android | Team 共享 or Private 每台 | 通过 Pi 接任意 |
| OpenMausBot | 5.5k | Apache-2.0 | 桌面 (Electron) | Cloud box / 本地 VM / 主机 | Claude/Codex/Grok CLI |
| OpenHuman | 42.2k | GPL-3.0 | 桌面 + 终端 + 服务器 | 单 Agent + 主机 + Chrome | 26 provider + 本地 |
| Eigent | 15.6k | Apache-2.0 | 桌面 | 本机 | 任意含本地 |
| Hermes Agent | 256.4k | MIT | CLI/TUI/Web | 本地/Docker/SSH/云 | OpenAI 兼容 |
| OpenClaw | 392.8k | MIT | 聊天 + Control UI | 自有服务器 | 任意 |
**OpenBot 的独特生态位**：Bitdoze 评测原话——*"OpenBot is the one I'd hand to a security team"*（OpenBot 是我会交给安全团队的那个）。原因是它把"治理"当成产品而非特性：
- **vs Grok Bot（闭源竞品）**：Grok Bot 一个账号下所有 Bot 共享一台 Firecracker VM，xAI 文档自己都说 "Do not use separate Bots as a security boundary"；OpenBot 反着做，每 Bot 一个独立容器。
- **vs Dify / LangGraph / CrewAI**：这些是"Agent 编排框架"，OpenBot 是"Agent 应用平台"——它假定你已经有 Agent（或用内置 demo），负责把它"安顿"成可被企业信任的数字同事。
- **vs Rakazo / OpenMausBot**：那两个在"产品体验"上更接近 Grok Bot，但治理深度不及 OpenBot；OpenBot 没有手机客户端、没有语音模式，换来的是更严的边界。
---
## 七、局限与不足：必须看到的四个短板
**坦诚说，OpenBot 现在还不是一个"拿来就能上生产"的产品。**
1. **Alpha 状态，破坏性变更频繁**：官方 README 第一段就是警告。v0.0.5 的 changelog 里有好几个"此升级会改变现有部署行为"的条目，包括自我托管横幅、egress 规则修复等。
2. **模板而非产品，没有升级路径**：官方明确说不发 npm 包、没有托管版。所有定制（如把 `examples/fintech` 的 13 个示例同事换成你自己的）都意味着**自己承担后续合并上游代码的合并成本**。
3. **对 CopilotKit Intelligence 有一定绑定**：线程持久化默认走 Intelligence 服务（有免费 plan，可自托管，但仍然是 CopilotKit 自家产品）；加上需要 License Token，对完全不想绑任何厂商的团队来说是个心理门槛。
4. **生态位偏窄**：没有移动端 App、没有语音模式、没有 Grok Bot 那种"录屏教学"（Teach-a-task）能力，目前单副本部署（README 说明暂时如此）；如果你要的是"个人 Agent 助手"，OpenHuman、Hermes Agent 这类更合适。
5. **学习门槛集中在治理层**：CEL 策略语言、AG-UI endpoint 写法、Supervisor/Docker 拓扑——这些都要求读者有 Docker + TypeScript + 一点 IaC 功底。**纯小白建议先在本地跑通 demo，再考虑真正部署**。
---
## 八、结语与行动建议
**OpenBot 的真正价值不在于"今天就能替代 ChatGPT 企业版"，而在于它把"可信 Agent"这个口号变成了可读、可审计、可 fork 的工程实现。** 在 AG-UI 被 Google/Microsoft/Amazon/Oracle 采纳、CopilotKit 拿下 2700 万美金 A 轮的当下，它背后是一个已经押对了协议赛道的团队，而不是又一个独立开发者的玩具项目。
**给你的三步行动建议：**
1. **如果你是企业平台团队**：先在本机用 `bash scripts/start.sh` 跑通 demo，重点研究 `server/src/computer/gateway.ts` 和 `/admin/boundaries` 的 CEL 策略——这套思路可以直接借鉴到自己的治理架构里，不一定非要直接用 OpenBot。
2. **如果你已经用 LangGraph / Mastra / CrewAI**：花一小时把你的 Agent 包成 AG-UI endpoint 接进 OpenBot，体验一下"有屏幕、有审计、有权限"的差别，比看十篇公众号有用。
3. **如果你只是好奇**：等 v1.0 之前先观望即可。Alpha 阶段跟版本追得很累，建议订阅 CopilotKit 官方博客看 milestone（最近 v0.0.5 加了 Notion/Drive 连接器、Bot-to-bot 委派、Routines 定时任务、智能消息路由、Take the Wheel 全时接管）。
**一句话收尾**：在一个所有 Agent 产品都在比"谁更聪明"的市场里，OpenBot 比的是"谁更值得被信任"——这个差异化切入点，可能在 2027 年回头看会成为它最值钱的一手牌。
