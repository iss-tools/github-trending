# elie222/rakazo

[GitHub URL](https://github.com/elie222/rakazo)


## Rakazo 深度评测：把自己请来的 AI 员工，养在自己服务器上

> 开源自托管的 AI Agent 平台，让你在自己服务器上养出拥有独立电脑、记忆和日程的 AI 员工

- **Tags**: AI Agent, 自托管, 开源, 沙盒, 大模型
- **Category**: 开发工具, AI Agent, 开源项目

## Details

# Rakazo 深度评测：把自己请来的 AI 员工，真正"养"在自己服务器上
## 一句话总结
**Rakazo 是一个用 TypeScript 打造的开源、自托管 AI Agent 平台，让你能在自己的机器上养出一只只"拥有独立电脑、记忆和日程"的 AI 员工，用哪个大模型、连哪个工具、数据存哪儿，全部自己说了算——它目前是 xAI Grok Bot、Lindy AI、Zapier Central 这类托管式 AI 助手最值得关注的开源替代品之一。**
---
## 背景与痛点：五天写出来的"反叛之作"
2026 年 8 月，xAI 推出了 Grok Bot——一个只能绑死在 Grok 模型、只能跑在 X 平台上的托管 AI 助手。**五天之后，Inbox Zero 的开发者 Elie Steinbock 就在 GitHub 上放出了 Rakazo 的第一版克隆。**
这不是简单的"套壳复刻"。Elie 的动机非常清晰：**托管式 AI 助手有一个绕不过去的信任问题——你的 AI 要替你登录邮箱、CRM、甚至银行，凭据和会话必须交给第三方服务器。**对个人玩家也许无所谓，但对合规敏感的团队，这就是一票否决。
Rakazo 把这个痛点重新定义了一遍：**Agent 的运行时应该是模型无关的、可以部署在你自己硬件上的、行为可审计的。** Apache-2.0 协议开源，没有席位费，没有按任务计费，没有"明天涨价"的风险。Elie 本人在 GitHub 上多次登上全球趋势开发者第一名，旗下的 Inbox Zero 已经在邮箱 AI 助手赛道验证过开源模式能跑通——Rakazo 是他把自己的 Agent 经验从"邮箱单一场景"推广到"通用 AI 同事"的一次跃迁。
---
## 核心亮点与功能剖析
### 1. 真正"拥有电脑"的 Bot
这是 Rakazo 最关键的差异化设计。**每个 Bot 都被分配一个独立的"计算机"——一个带图形 Linux 桌面、浏览器和终端的沙盒容器。** 它不是靠 API 调用一堆集成，而是像真人一样打开浏览器、点按钮、填表单、跑命令。
打个比方：竞品更像是"打电话给一个远程助手，让他凭嘴指挥你操作"；Rakazo 则是"给这位助手在自家机房里配了一台专属电脑，他自己坐下来干活"。
这台"电脑"可以是：
| 沙盒 Provider | 适合场景 |
|---|---|
| `docker` | 本机默认，最简单，bot 跑在你自己的容器里 |
| `e2b` | 托管沙盒，多用户部署推荐，把 bot 桌面隔离在远端 |
| `daytona` / `createos` / `boat` / `railway` | 云端沙盒备选 |
| `desktop` | 直接跑在宿主机，**只在自己单用户机器上使用** |
| `fake` | 测试用模拟器 |
### 2. 模型层彻底解耦（BYOM）
Rakazo 通过 Pi 抽象层支持几乎所有的模型来源：Claude Pro/Max 订阅、ChatGPT Plus/Pro 订阅、Anthropic/OpenAI 官方 API、OpenRouter、Grok、甚至本地 Ollama 或 LM Studio。**每个 Bot 可以单独指定模型**——便宜模型做日常分类归档，聪明模型写重要草稿，成本可以被精细切分。
订阅党可以继续用 Claude Pro 或 ChatGPT Pro 的额度，不用额外买 API Key，这在同类产品里相当少见。
### 3. 可读的 Routines（例程）
Bot 学会一项工作流程后，会把步骤**保存为纯 Markdown 文件**，你可以打开看、改、提交到 Git。这跟竞品普遍采用的"专有可视化流程编辑器"形成鲜明对比——你的 Agent 行为像代码一样可审计、可版本化、可迁移。
### 4. 审批门控与审计日志
每个 Bot 都能配置"哪些操作可以自主执行，哪些必须先请示"。所有动作都会落到你自己服务器上的审计日志。**对合规团队而言，这是能否上线的关键开关。**
### 5. 出厂自带的 8 个 Bot 模板
新建 Bot 时会有一段"面试"，问你干什么活、你什么风格、连哪些工具，然后它才上岗。官方模板覆盖：Sales Outbound、Inbox Manager、Talent Scout、Expense Manager、Coding Agent、Account Manager、Paid Media、Chief of Staff。
### 6. 语音、多端与 Bot 之间的协作
- 支持 ElevenLabs / OpenAI / Cartesia / Fish Audio 的语音（说话、听回复、打电话给 Bot）
- Web / Electron 桌面端 / iPhone / Android 全平台
- Bot 之间可以互相同级协作，也可以派生短命的 subagent
### 7. 技术栈一览（专业读者关注）
- 前端：React 19 + Vite + Tailwind CSS
- 桌面与移动：Electron + Expo
- API：Hono + oRPC
- 数据：PostgreSQL + Prisma，Better Auth 做账号
- 队列：Graphile Worker（**队列直接存 Postgres，不需要 Redis**，少一个组件要运维）
- 沙盒：Docker / E2B / Daytona 等可插拔
- 集成：Composio、Pipedream Connect、远程 MCP、OpenAPI
架构上的"精妙"主要体现在两点：**用 Postgres 一个数据库同时承担状态存储和任务队列**，省掉 Redis；**把"Bot 的大脑"（模型）和"Bot 的身体"（沙盒电脑）完全解耦**，任意组合都不需要重写配置。
---
## 上手门槛与部署体验
Rakazo 给了两条路，难度差距巨大。
### 路线 A：一键脚本（Docker 镜像，推荐小白）
只要装了 Docker Engine + Compose 插件，一条命令拉起整个栈：
```bash
mkdir -p rakazo && cd rakazo &&
curl -fsSLO https://raw.githubusercontent.com/elie222/rakazo/main/infra/compose/install-images.sh &&
bash install-images.sh
```
脚本会下载 Compose 文件、生成随机 `.env` 密钥、启动服务。打开 `http://127.0.0.1:5173` 注册账号、连一个模型就能用了。
### 路线 B：源码部署（开发者向）
```bash
git clone https://github.com/elie222/rakazo.git
cd rakazo
cp .env.example .env
# 填好 POSTGRES_PASSWORD / BETTER_AUTH_SECRET / ENCRYPTION_KEY / SCREEN_PROXY_SECRET
docker compose --env-file .env \
  -f infra/compose/docker-compose.yml \
  -f infra/compose/docker-compose.postgres-host.yml \
  up postgres -d
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm sandbox:build
pnpm dev
```
### 真实的硬件门槛
这是许多人会低估的地方。**Rakazo 不只是"跑一个 Node 应用"，而是同时要跑 Postgres、API、Worker、Web、沙盒 Supervisor 五个进程，外加每一个"醒着"的 Bot 一个独立容器。**
| 场景 | 推荐配置 |
|---|---|
| 仅控制面（沙盒交给 E2B 托管） | 2 vCPU / 4 GB |
| 自带 Docker 沙盒，1 个 Bot 醒着 | 至少 4 GB，推荐 8 GB |
| 多个 Bot 同时在线 | 8 GB+，按 `docker stats` 实测调整 |
| 磁盘 | 40 GB 起（沙盒镜像 + Node modules + Postgres 卷） |
每个 Bot 默认允许占 2 GB 内存 + 2 CPU 核。`SANDBOX_IDLE_MS=600000` 会在 Bot 空闲 10 分钟后关掉它的电脑，**这是省内存的命门，千万别设为 0**（除非你的 Docker 沙盒真的不心疼内存）。
### ⚠️ 安全避坑指南
这是评测里最想强调的一段。自托管 Agent 的安全性取决于你怎么配沙盒：
1. **`SANDBOX_PROVIDER=desktop` 绝对不要用在公共服务器上**——Bot 会直接以 API 进程用户身份跑 shell，能读到你的 `.env`、SSH key、云凭据。任何 Bot 读到的网页文本都可能变成命令注入到你的服务器。
2. **Docker 模式比 desktop 安全，但 Supervisor 挂载了 `/var/run/docker.sock`**——Docker socket 等价于 root 权限。务必给 `SANDBOX_SUPERVISOR_TOKEN` 设置独立强随机值，不要让它默认复用 `BETTER_AUTH_SECRET`。
3. **多用户或对安全要求高的部署，优先选 `e2b`**——把 Bot 桌面彻底搬出宿主机。
4. **Postgres 端口保持 loopback，绝不要暴露公网。**
5. **Beta 阶段，pin commit 而不是 tag**，方便升级炸了之后一键回滚。
---
## 社区活跃度与生命力
Rakazo 的增长曲线放在整个 GitHub 都算激进：
- 发布 5 天即 747 star，日均增长约 165 颗
- 截至 2026 年 10 月中旬，**约 4,445 star / 798 forks**
- 版本迭代迅速：v0.1.0-beta（8 月 13 日）→ 已发布 7 个稳定版本，最新 v0.1.6（9 月 8 日），但仍自称 beta
- 周边生态：作者同步维护了一个 **botdirectory.ai**——社区共建的 Bot 提示词目录，一个 Markdown 文件就能贡献一个新 Bot（Elon Musk 转发过）
- Issues 活跃，作者对问题响应及时，中文/英文社区讨论均在增长
需要提醒的是，**这个项目的 contributor 结构目前仍然以 Elie 一个人为主**，Bus Factor 不高。社区周边生态（模板、目录、教程）倒是发展得很快。
---
## 竞品对比：Rakazo 在地图上的位置
| 维度 | **Rakazo** | Grok Bot (xAI) | Lindy AI | Zapier Central | Hermes Agent (Nous) | OpenClaw |
|---|---|---|---|---|---|---|
| 协议 | Apache-2.0 开源 | 闭源 | 闭源 | 闭源 | 开源 | 开源 |
| 自托管 | ✅ 完全支持 | ❌ | ❌ | ❌ | ✅ | ✅ |
| 模型选择 | 任意（Claude/GPT/Grok/本地） | 仅 Grok | 多模型 | OpenAI 系 | 多模型 | 多模型 |
| 凭据存储 | 你自己的机器 | xAI 服务器 | Lindy 服务器 | Zapier 服务器 | 自托管可选 | 自托管可选 |
| Bot 持久记忆 | ✅ 跨会话 | ✅ | 部分 | ❌ 每次 run 独立 | ✅ | ✅ |
| 内置沙盒桌面 | ✅ 浏览器+终端+GUI | 云端 | 云端 | 云端 | 需自行搭建 | 需自行搭建 |
| 计费模式 | 免费自托管 | 订阅 | 按席位 | 按任务 | 免费自托管 | 免费自托管 |
| 入门难度 | 中（需 Docker） | 极低 | 低 | 极低 | 中高 | 中 |
**Rakazo 的独特定位**可以概括为三句话：
- 相比 Grok Bot / Muse / Dots / Instinct：它是**唯一让你拥有全部控制权**的那一个。
- 相比 Hermes Agent、OpenClaw：**它的"开箱即用度"最高**——桌面应用、移动端、Bot 模板、图形化沙盒浏览器一应俱全；Hermes 更偏工程师向组件拼装，OpenClaw 更偏"常驻 Agent 运行时"。
- 相比 Zapier / Make：**Rakazo 的 Bot 是带记忆的长期员工，而 Zapier 是一次性的触发-动作管道**，本质是两种工作模型。
---
## 目标人群与收益
**非常适合：**
- **开发者 / 独立开发者**：想给流程加一个 7×24 的 AI 同事，但不愿意把凭据交给 Lindy 或 Zapier。Rakazo 让你月成本只剩下 VPS + 模型 API，长期下来比订阅制便宜一个数量级。
- **小团队 / 创业公司**：8 个官方 Bot 模板直接覆盖邮件、销售、招聘、报销、Bug 分诊、付费投放等高频场景，按席位计费的压力瞬间消失。
- **隐私与合规敏感团队**：金融、医疗、律所等行业的团队，可以完全在自有基础设施上跑 Agent，凭据不出内网。
- **AI Agent 学习者**：代码全开、TypeScript 栈现代、模块划分清晰，是研究"如何搭建一个生产级 Agent 平台"的优秀教材。
**暂时不适合：**
- **完全零技术的非程序员**：即便有一键脚本，后面调模型、配沙盒、查日志仍需要基本命令行能力。
- **只想要一个 ChatGPT 替代品的人**：Rakazo 的价值在于"持久 Bot 做长期工作"，不是聊天工具。
- **需要官方 SLA / 24 小时技术支持的企业**：目前只有社区支持，云托管版本还在 waitlist。
---
## 局限与不足（必须直面）
1. **Beta 状态， breaking changes 常态**。从 8 月发布到 10 月，已经经历了多次结构性调整（例如 VPS 资源建议数字被官方撤回，改为要求用户实测）。生产部署务必 pin commit。
2. **资源占用不轻**。每个 Bot 都是一个带图形 Linux 桌面 + 浏览器的容器，内存吃紧的环境会很快吃满。这不是一个"1 GB VPS 也能跑"的项目。
3. **托管云尚未开放**。官网显示 Cloud 版在 waitlist 中，但目前只能自托管。想要"零运维"的团队得再等等。
4. **邮件集成目前主要面向 Gmail / Outlook**，通用 IMAP/SMTP 账号仍在 Issues 里排队。
5. **单人主导的维护风险**。尽管 Elie 产出稳定，但 Bus Factor = 1 仍然是客观存在的项目隐忧。
6. **安全配置的"默认值并不安全"**。`desktop` 沙盒模式、Supervisor Token 默认复用、Postgres 端口暴露——任何一个踩错都是灾难性的，文档里有提醒，但需要用户主动读。
7. **Bot 行为的"幻觉边界"仍在**。Rakazo 本身做得再严谨，底下的 LLM 还是会犯错。审批门控必须用上，否则让 Agent 自由发挥删邮箱、发邮件的风险真实存在。
---
## 结语与行动建议
Rakazo 是那种**用 5 天时间写出来、却在 2 个月里把方向走对**的项目：它没有试图再造一个 ChatGPT，而是精准地切下了"自托管 AI 同事"这个赛道，把模型层、沙盒层、工具层、审批层全部解耦，让"AI 员工"第一次变得像自家服务器上的一个 Docker 服务一样可拥有、可审计、可替换模型。
如果你想现在就上手，可以按下面三步走：
1. **先看 Demo 再决定**：去 [rakazo.com](https://rakazo.com) 看一眼"扫邮箱"的真实演示，确认这就是你想要的交互模式。
2. **本机 Docker 一键装起来**：用 `install-images.sh` 脚本，本机 Docker 沙盒默认启用，不碰任何生产数据，先试它的 8 个 Bot 模板里你最痛的那一个（多数人选 Inbox Manager 或 Coding Agent）。
3. **再决定要不要上 VPS**：真正让 Bot 产生复利价值的是"24 小时不掉线"。确认场景成立后，再迁到一台 8 GB 内存的 VPS，把 `SANDBOX_PROVIDER` 改成 `e2b`（最省心）或继续 `docker`（最省钱），HTTPS 用 Caddy 一层罩住。
一句话定调：**它不是最精致的那个 Agent 产品，但目前是"主权感"最强的那个**——对在意数据、在意成本、在意不被任何一家模型厂绑架的人来说，这份"你拥有自己的 AI 员工"的承诺，比 100 个花哨功能更有分量。
