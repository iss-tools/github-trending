# milind-soni/OpenMausBot

[GitHub URL](https://github.com/milind-soni/OpenMausBot)


## OpenMausBot 深度评测：把 Claude、Codex、Grok 变成一支免费 AI 团队的开源桌面应用

> 一款免费开源的桌面应用，像用通讯录一样指挥多个 AI Bot 干活，100% 复用你已有的 Claude/Grok/ChatGPT 订阅，不额外花一分钱。

- **Tags**: 开源项目, AI Agent, 多模型, 本地优先, BYOA
- **Category**: AI Agent, 开发工具, 效率工具

## Details

# OpenMausBot 深度评测：把"AI 团队"塞进一个聊天窗口的开源野心
## 📌 一句话总结
**OpenMausBot 是一个把 Claude Code、Codex、Grok CLI 包装成"通讯录式 AI 团队"的本地优先开源桌面应用**——你像用 WhatsApp 一样给每个 AI 助手发消息，它们各自有独立人格、独立模型、独立云电脑，干活前会问你一句"可以吗"，对你已经付费的订阅是 100% 复用，不额外收一分钱。它是 2026 年 8 月 12 日、xAI 发布 Grok Bot 后不到 24 小时内冒出来的开源"平替"，今天已经涨到约 5k+ Star。
---
## 🌅 背景与痛点：它为什么在 7 周内扎堆出现的"Agent 产品潮"里有立足之地
要理解 OpenMausBot 的价值，得先看 2026 年上半年发生了什么。README 里作者自己数了一下：**7 周之内，四家大厂接连发布"个人 Agent"封闭产品**：
- xAI 的 **Grok Bot**（2026 年 8 月 11 日进入公测）：$200 门槛、Waitlist、只跑 Grok 一家模型、所有 Bot 共享一台云电脑
- Meta 的 **Muse**：单 Agent、Meta 云 VM、仅限美加地区
- OpenAI 的 **dots**：锁在 ChatGPT 里、只跑 GPT、要 Pro/Business Premium
- Manus 的 **Cue**：邀请制，Agent 还自带手机、邮箱和钱包
这波产品的共同形状是——**把"AI 助手"升级成"一群各自有电脑的 AI 同事"**，但代价是：模型被锁死、电脑在厂商那边、你的数据也跨过了那条线。
OpenMausBot 的作者 Milind Soni（GitHub 上有 145 个仓库的独立开发者，也接受 GitHub Sponsors 赞助）做的事情可以概括为一句话：**"把这种新形状的 Agent 产品，用开源和 BYOA（Bring Your Own Agent）的方式重新做一遍"**。它保留了 Grok Bot 的"通讯录 + 多 Bot + 每人有电脑"的交互直觉，但底层的模型调用、电脑、数据存储全部搬回你自己的机器。
> 一个形象的比喻：Grok Bot 像租用一整层写字楼的"AI 外包公司"，钱按月烧，工位在别人楼里；OpenMausBot 更像是**在你自己家客厅里雇了一群兼职员工**——他们用你已有的会员卡去买咖啡（复用 Claude/Codex/Grok 订阅）、用你多余的电脑干活，工资表（聊天记录）就锁在你自家抽屉里。
---
## ✨ 核心亮点与功能剖析：它到底凭什么拿到 5k+ Star
### 亮点 1：每个 Bot 一颗独立大脑
这是评测者公认"最反直觉也最实用"的功能。Grok Bot 只能跑 Grok，而 OpenMausBot 的侧边栏里每一个联系人都可以**单独指定模型**，甚至**对话中途切换模型**——写论文的 Bot 用 Claude，跑代码的 Bot 用 Codex，做调研的 Bot 用 Grok。
更妙的是它**不开 API、不走代理**，而是直接调用你本机已登录的 `claude` / `codex` / `grok` CLI——你的 Claude Pro、ChatGPT Plus、SuperGrok 订阅直接被复用，**OpenMausBot 本身一分钱不收、也不要你再开任何账号**。这是它与市面上绝大多数 Agent 平台（包括 Manus、Lindy）在商业模式上的根本分野。
### 亮点 2：每个 Bot 一台"能动手脚"的电脑
打开 Computer 面板，Bot 的专属 Linux 云桌面（由 boat.dev 提供）就会启动，你能**实时看到它在屏幕上点哪儿、打开什么应用**；也可以点"Open desktop"亲自接管浏览器里的桌面；甚至可以让它控制"你这台 Mac"。
给非技术读者打个比方：以前你跟 ChatGPT 聊天，它只能"嘴上说说"；现在它像**被远程接上了一双手和一个显示器**——能真的去点 Chrome、写文档、跑脚本，而你就坐在它身后看着它的屏幕。
### 亮点 3：权限审批卡片——这是它"敢用"的关键
这是评测者眼中**比模型切换更重要的功能**。每当 Bot 想跑一条 Shell 命令、改一个文件、问一个外部问题，聊天窗口里就会弹出一张卡片，给你三个选择：**Allow / Deny / 在聊天里直接回答**。
> 比喻：就像手机 App 第一次要用摄像头时会问你"允许吗"。OpenMausBot 把这个直觉搬到了 Agent 世界——**每个危险动作都被拦下来变成你的一次点击决定**，Bot 永远不会"擅自删库跑路"。
### 亮点 4：500+ 应用即插即用（Composio 生态）
通过 Composio Sessions，一次 OAuth 授权就能让**所有 Bot 共享** Gmail、Slack、GitHub、Notion、Linear 等数百个应用的访问权。这意味着你完全可以搭出这样的阵容：
- 晨报 Bot：每天读 Gmail，把待办起草好等你点头
- 项目 Bot：自动同步 Linear 工单到 Notion
- 客服 Bot：监听 Slack 提问，从你的文档里找答案起草回复
### 亮点 5：频道、团队、例程与 Webhook——奔着"生产力"去的
- **Channels**：工作 / 个人 / 每个项目独立上下文，互不污染记忆
- **Jev 决策模型**：消息进来时几百毫秒内决定派哪个 Bot 接单（用 OpenRouter 或 Jev key 配置）
- **Routines**：定时任务（5 分钟到 24 小时）+ **Webhook 触发器**（默认监听 `127.0.0.1:8800`，Bearer 认证）
- **Team 导入**：一份 Markdown 文件即可一键装好一个"完整团队"（Chief of Staff、Playbook、频道、Bot 全套）
- **语音通话**：选 ElevenLabs / Fish Audio / Grok / 本地 Chatterbox，让 Bot 用嘴回答你，甚至可以"打电话"给它
### 亮点 6：MCP Server 与 CLI——它不只是个 App，还是个"平台"
OpenMausBot 内置一个 **stdio MCP 服务器**，Claude Desktop、Cursor 等外部客户端可以直接操控 Bot 团队（查看、发任务、切模型、中断），但刻意**不暴露**审批授权、删除、密钥等高危接口——这是个挺有分寸的设计。
同时提供 `openmausbot` CLI，能在脚本和 CI 里跑：
```bash
openmausbot team apply team.yaml
openmausbot run "Room Lead" "Rehearse the launch of https://example.com" --export ./out
```
支持 `--json` 输出和可分支的退出码，意味着**它可以在 GitHub Actions 里被当成一个"AI CI 步骤"**用。
---
## 🏗️ 技术栈与架构解析：为什么这套架构挺"讲究"
技术选型一眼望去很普通，但组合起来很有想法：
| 层 | 技术 | 作用 |
|---|---|---|
| 桌面壳 | **Electron** | macOS / Windows / Ubuntu 三端 |
| UI | **React + Vite + Tailwind** | 聊天界面，端口 5199 |
| Harness 服务器 | **TypeScript / Node** | 本机 `127.0.0.1:8799`，独占所有 Agent 进程 |
| 驱动 | `server/drivers/` | 每家模型一个 driver（stream-JSON / JSON-RPC / ACP） |
| 事件总线 | **SSE 单流** | 所有客户端只 fold 一条流，状态统一 |
| 权限代理 | Permission Broker | 拦截每次危险操作 |
| 云电脑 | boat.dev | 每 Bot 独立 Linux 桌面 |
| 应用连接 | Composio | 500+ SaaS OAuth |
| 本机控制 | Cua Driver 0.19.3 | 操作你自己的 Mac / Ubuntu |
架构上最值得称赞的是**驱动 SPI 的极简设计**：作者在 README 里明确说，**新增一家模型 provider = 在 `server/drivers/` 加一个文件 + 一行注册**；如果是任何讲 ACP 协议的 CLI 或 OpenAI 兼容端点，**改 config 就能接进来，零代码**。这种"小接口、大生态"的设计让它在 2026 年这个新模型每周都在冒的年份里，能保持轻身段。
本地优先的具体含义也很实在：**对话记录、API key、事件流全部存在 `~/.openmausbot` 目录**，Harness 服务器只在 127.0.0.1 上监听，事件按线程持久化为 NDJSON。但评测者需要诚实指出——**模型本身依然在云端跑**（Claude/Codex/Grok 的服务器），所以它是"本地优先"而不是"本地模型"，prompt 里塞的敏感内容依然会到你订阅的那家模型厂。
---
## 🚀 上手门槛与部署体验：最容易的入口、最容易卡住的地方
### 最简单路径：下载安装包
README 提供的发布矩阵相当友好：
| 平台 | 形态 | 状态 |
|---|---|---|
| macOS（Apple Silicon / Intel） | 签名并公证的 .dmg | **完全支持** |
| Windows（x64） | 未签名安装包 | 可用，SmartScreen 会警告 |
| Ubuntu 24.04 x64（GNOME） | .deb / AppImage | **Beta** |
| Ubuntu Wayland | 主机控制被禁用 | Issue #345 未解决 |
| 手机 | QR 配对 + Web PWA | 可选 |
唯一**真正的前置要求**是：**至少装好并登录其中一个 CLI**——`claude` / `codex` / `grok`。装好后它们会自动出现在模型选择器里。
### 源码路径（推荐给想折腾的人）
```bash
git clone https://github.com/milind-soni/OpenMausBot && cd OpenMausBot
pnpm install
pnpm dev:server    # harness server → 127.0.0.1:8799
pnpm dev           # app → http://127.0.0.1:5199
pnpm dev:desktop   # Electron 壳
```
要求 Node 24+、pnpm。
### 无桌面路径：一行命令跑起来
```bash
npm install -g openmausbot
openmausbot
# 或者：npx openmausbot
```
首次启动会引导你选 AI 接入方式、登模型、可选配对手机。要部署到 VPS 常驻：
```bash
npx openmausbot serve --tunnel       # 托管公网地址
npx openmausbot serve --tailscale    # 走你的 tailnet
```
### 上手时容易踩的坑（来自第三方实测）
1. **CLI 配置是最容易卡住的一步**——很多人没装过 Claude Code 或 Codex CLI，这一步建议照官方文档一步步来，或让现有 AI 助手帮你在终端里跑
2. **Windows 安装包未签名**，SmartScreen 会提示"未知发布者"，需要点"更多信息 → 仍要运行"
3. **Ubuntu Wayland 用户目前无法启用主机控制**，只能用云 VM 或 Local VM
4. **密钥以明文存放在私有 config.json**（Unix 下 0600 权限）——本机安全取决于你，不要在多人共用的机器上存敏感 key
---
## 🌍 社区活跃度与生命力：早期但真实在跑
- **Star 数**：截至 2026 年 10 月初约 **5.2k–5.6k**，Fork 784
- **Trendshift**：2026 年 8 月 12 日上榜 TypeScript 当日 Trending，也是全语言当日 Trending
- **最后 commit**：截至 2026 年 10 月下旬，距撰稿约 21 天——不算日更，但属于"持续在动"的状态
- **License**：**Apache 2.0**（除 `enterprise/` 目录为 source-available）
- **Issue 数**：README 提到 #29、#113、#345 都还在跟，其中 #345（Wayland 安全门）是 Linux 侧关键阻塞项
- **生态**：作者另开了 `openmausbot-teams` 仓库维护公开的团队模板，第三方评测社区（AI Profit Boardroom 等）已经出了横向对比文
一个值得点赞的细节：**作者在 README 顶部专门放了一段"与本代币无关"声明**，明确警告"任何以 OpenMausBot、Maus、SupaMaus 命名的加密货币都与我无关"——这是 2026 年开源圈被币圈碰瓷太多次之后的标准操作，但也侧面说明这项目的热度已经到了会被蹭的程度。
---
## 🎯 目标人群与收益：你该不该装
| 你是谁 | 用它干嘛 | 能拿到什么 |
|---|---|---|
| **已订阅 Claude / Codex / Grok 的开发者** | 把订阅榨到极限 | **不花一分钱**把单助手升级成团队，复用已有额度 |
| **独立开发者 / 小团队** | 自动化研究、写文档、跑代码 | 一个 Bot 管文档、一个跑脚本、一个盯 Slack，在同一个窗口里指挥 |
| **追求本地优先 / 数据自主的用户** | 不想让数据全在 Meta / OpenAI 的 VM 里 | 会话、密钥、事件流都在 `~/.openmausbot` |
| **想学 Agent 架构的工程师** | 读源码 | 驱动 SPI、SSE 事件总线、权限代理这三块设计都很干净 |
| **不喜欢被 Waitlist / $200 订阅绑死的尝鲜者** | 抢先体验"AI 团队"形状 | **零成本、零等待** |
| **自动化 / CI 爱好者** | 让 Agent 进流水线 | MCP server + `openmausbot` CLI，可以进 GitHub Actions |
**最不适合的人**：希望"开箱即用零配置"的小白（必须先装一个 CLI）；希望纯离线运行的隐私洁癖者（模型仍在云端）；想要企业级 SLA 的团队（项目还没到那个成熟度）。
---
## ⚔️ 竞品对比：它在"个人 Agent 战场"上的真实位置
| 产品 | 模型选择 | 电脑归属 | 是否要新订阅 | 价格 | 开源 | Waitlist |
|---|---|---|---|---|---|---|
| **OpenMausBot** | Claude / Codex / Grok / 自定义 | 你的机器 / Boat 云 VM / Local VM | 否（BYOA） | **免费** | ✅ Apache 2.0 | 无 |
| **xAI Grok Bot** | 仅 Grok | xAI 共享云 | 要 SuperGrok/Cursor 顶级 | ~$200/月 | ❌ | 有 |
| **Meta Muse** | Meta 自家 | Meta 云 VM | 要 Meta 账号 | 订阅内 | ❌ | 仅美加 |
| **OpenAI dots** | 仅 GPT | OpenAI 侧 | 要 Pro/Business Premium | 含在订阅 | ❌ | 无 |
| **Manus Cue** | Manus 自家 | Manus 给的"专属手机+邮箱+钱包" | 邀请制 | 未公开 | ❌ | 有 |
| **Hermes** | 多模型 | 本地为主 | 看接入方式 | 免费 | ✅ | 无 |
来源汇总自 OpenMausBot README 对比表与第三方评测。
**独特竞争力一句话**：**它是这个战场上唯一"既开源、又 BYOA、又零 Waitlist、又有云电脑"的产品**——其它选手至少要占其中两条短板。
---
## ⚠️ 局限与不足：避坑指南
直接引用第三方实测和我的判断：
1. **早期项目，糙是必然的**——作者自己在 README 里也写了 "Early but real"；聊天里问题卡片的排版、Agent 之间的转接都还有毛刺
2. **模型面窄**——原生 driver 只覆盖 Claude / Codex / Grok 三家（虽然可以通过 config 接 OpenRouter、Fireworks、DeepSeek、Cline 等 OpenAI/Anthropic 兼容端点）
3. **权限卡片在重度使用时会变烦**——每次跑命令都要点一下 Allow，高频自动化场景需要权衡（也可以配置自动通过，但要自觉承担风险）
4. **Agent 互相 @ 的功能在第三方实测中失败过**——这是 Grok Bot 一个被称赞的能力，OpenMausBot 还在补
5. **Computer Use 整体依然慢**——不是这个项目的锅，是整个行业的锅，但要有心理预期
6. **安全扫描有警告**——SkillsLLM 的 npm audit 扫到若干 HIGH（sharp/libheif、undici DoS、miniflare、wrangler）和 MEDIUM（ajv ReDoS）。这些主要是依赖链问题，**不代表可被远程利用**，但部署到公网前请自己跑一遍 `pnpm audit` 并升级依赖
7. **没有官方移动 App**——iOS / Android 都走 Web PWA + 配对码，体验原生感一般
8. **Webhook 接收器只能跑在本地**（`127.0.0.1:8800`），公网触发需要自己用 Tailscale Funnel 或反向代理暴露——托管中继还在开发中
9. **API key 明文存盘**——`~/.openmausbot/config.json` 是 0600 权限的明文 JSON，务必确保本机安全
10. **Boat 云电脑是付费第三方服务**——OpenMausBot 本身免费，但用云 VM 会按 boat.dev 的计费走，试用结束可能产生费用
---
## 🏁 结语与行动建议：终极评判
**OpenMausBot 是 2026 年"个人 Agent 元年"最值得跟踪的开源项目之一，它做的事情不是发明新概念，而是把一个被大厂锁在付费墙和 Waitlist 后面的产品形状，用 BYOA + 本地优先的方式开源了出来。**
它不是最顺滑的（Grok Bot 的体验打磨更好），不是最技术自由的（Hermes 更可玩），也不是最企业级的（Manus Cue 在"Agent 拥有独立身份"上更激进）。但它是**唯一一个你今天就能下载、不用等、不用新增订阅、数据留在本机、还可以 fork 改造**的选择。
**给你的三条行动建议：**
- **如果你已经有 Claude Pro / ChatGPT Pro / SuperGrok 订阅** → 现在就去 [GitHub Releases](https://github.com/milind-soni/OpenMausBot) 下载对应平台的安装包，5 分钟就能跑起来，把它当作"订阅的隐藏第二层价值"
- **如果你想深入学 Agent 架构** → clone 下来读 `server/drivers/` 和 `server/harness/`，这两个目录的"小接口 + 事件总线 + 权限代理"设计，是 2026 年少见的教学级范例
- **如果你是企业用户 / 想生产部署** → 等 1-2 个版本迭代，重点关注 #345（Wayland 安全门）、托管 Webhook 中继、`enterprise/` 目录的演进；现在更适合在 POC 或个人工作流里试水，不建议直接上生产
**一句话收尾**：在"AI 团队"这个新兴产品类别里，OpenMausBot 不一定是最终赢家，但它把"入场券"的价格打到了 0——**而这张票值得每个对 AI Agent 未来好奇的人撕一次**。
