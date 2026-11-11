# herdrdev/herdr

[GitHub URL](https://github.com/herdrdev/herdr)


## Herdr 深度评测：AI Agent 时代的终端运行时，tmux 的下一代替代品

> 一个用 Rust 编写的 AI Agent 终端运行时，让你同时管理十几个 AI 编码 Agent，还能让它们互相派活协作。

- **Tags**: AI Agent, 终端工具, 开源项目, Rust, tmux替代
- **Category**: 开发工具, AI 编程

## Details

# Herdr 深度评测：当 tmux 遇上一群想被指挥的 AI Agent
> 一句话总结：**Herdr 是一个用 Rust 写的"Agent 运行时（Runtime）"——它让 Claude Code、Codex、Copilot CLI 这些 AI 编码 Agent 在持久化终端里同时跑十几个，并且让 Agent 之间能互相派活、汇报状态；它就是为 2026 年"多 Agent 并行开发"这个新工作流而生的 tmux。** 项目自 2026 年 3 月底由单人开发者 Can 启动，仅 5 个月就冲到近 50k Stars、34 万下载，并于 8 月正式加入 Y Combinator F26 批次。
---
## 一、背景与痛点：tmux 解决不了的"那件事"
要理解 Herdr 为什么突然爆火，得先看清楚 2026 年开发者的真实日常。一个典型的高级工程师现在可能同时在跑：Claude Code 做架构、Codex 做实现、Gemini CLI 做研究、Copilot CLI 做小修补——五个、十个 Agent 同时在终端里运行。
这套工作流暴露了传统终端复用器的三个根本盲区：
1. **没有"状态感"**。tmux 知道有 10 个 pane，但不知道哪个 pane 里的 Agent 正在阻塞等你确认权限、哪个已经跑完闲置 20 分钟。Josh Finnie 在博客里直白地抱怨："我一天要来回来去切 6 个 pane，就为了看哪一个其实在等我"。
2. **没有"协作感"**。tmux 里的 Agent 互相隔离在各自 pane 中，无法让主 Agent 启动一个 helper Agent、给它派活、然后等它做完再继续。
3. **重启即失联**。tmux 撑得住 SSH 掉线，撑不住笔记本重启——一个跑了 6 小时、烧了几百万 token 的任务说没就没。
Herdr 的作者 Can 在加入 YC 的博客里把定位讲得很清楚："我不想再装一个'又一个 Agent'。我想要的是一个**让我的 Agent 能集成进来**的运行时（Runtime）"。这就是 Herdr 与 tmux、Zellij 在哲学层面的根本差异——它们是"复用器"，Herdr 是"运行时"。
一个形象的比喻：**tmux 是给 10 个人一人发一个工位，至于他们在干嘛它不管；Herdr 是给这 10 个人各发一个工位，外加一块看板、一套对讲机和一个值班经理**。
---
## 二、核心亮点与功能剖析
### 2.1 持久化终端会话：随时离开，工作不停
Herdr 是标准的 client-server 架构：后台 server 持有真正的 PTY（伪终端），你看到的 TUI 只是 thin client。这意味着：
- **关闭终端窗口、断网、合上笔记本盖子，Agent 继续跑**；
- **重连后布局、pane、Agent 全部还在原位**；
- 服务器重启后，Herdr 能**恢复布局结构**，对支持的 Agent（装了官方 integration 的）还能**恢复对话上下文**。
底层是单 Rust 二进制（约 10–11 MB），无 Electron、无账户、无遥测、零依赖——这一点对 VPS 用户尤其友好，5 美元的 Hetzner 小机器都能跑。
### 2.2 Agent 状态感知：真正"看得见"你的 Agent 大军
这是 Herdr 杀手级特性。每个 pane 里的 Agent 会被标记为四种语义状态之一：**working（工作中）/ blocked（等你）/ done（已完成）/ idle（空闲）**，侧边栏实时显示。
技术上，Herdr 走了两条路：
- **零配置启发式**：通过进程名匹配 + 终端输出模式识别，开箱即用支持 14+ 主流 Agent（Claude Code、Codex、Copilot CLI、Cursor Agent、Pi、Droid、Amp、OpenCode、Grok CLI、Gemini CLI、Antigravity、Kimi Code、Hermes、QoderCLI、Kiro CLI 等）。
- **官方集成**：`herdr integration install claude` 之类命令会安装 hook，让 Agent 通过更精确的协议上报状态。
值得注意的是，作者 Mitchell Hashimoto（Ghostty、HashiCorp 创始人）2026 年 10 月专门发布了 **OSC 7501 "Program Status Protocol"** 终端转义序列规范，让任意程序可以主动告诉终端"我空闲/工作中/被阻塞/完成/失败，以及原因"——Herdr 的 Agent 状态体系正是这个新标准的早期落地者。换句话说，Herdr 站在了终端协议演进的浪头上，而不只是个临时 hack。
### 2.3 Agent 原生：让 Agent 指挥 Agent
这是 tmux、Zellij 都做不到的事。Herdr 提供 **CLI + Socket API**（OpenRPC 格式，可 `herdr schema` 导出 JSON Schema），Agent 可以编程式地：
```bash
# 让 Agent 在新 pane 里启动另一个 Agent
herdr pane split --vertical
herdr pane run "claude --prompt '修复认证 bug'"
# 等待某个 pane 的 Agent 进入 done 状态再继续
herdr wait --pane 2 --state done
# 读取另一个 pane 的输出
herdr pane read --pane 2 --lines 50
```
由此衍生出真正的多 Agent 编排模式：**主 Agent 派生 helper Agent → 等待 → 汇报 → 收尾**，相当于在终端层面实现了简易版的 LangGraph。在 herdr-core（Herdr 的无头内核版本，命令叫 `hc`）里这套模式更明显：
```bash
# 让 codex 跑一个 review 任务，结束时通过 hc send 汇报
hc run --bg --name review codex "review src/x.rs. Done: hc send $HC_TERMINAL_ID"
hc wait review
hc read --lines 60 review
hc send review "顺便也看下 tests"
```
而且 `hc --skill` 一条命令就能把整套 Agent 操作手册打印出来——这是刻意为 AI Agent 设计的"一次读完就会用"的接口。
### 2.4 多机一窗与远程管理
v0.9 引入的多机支持是和 tmux 拉开差距的另一关键能力：
```bash
herdr machine add workbox        # 注册一台 SSH 机器
herdr machine add laptop --name box
herdr run --on box --cwd /srv/app cargo test
herdr attach box/t3              # 直接 attach 到远程某个终端
```
侧边栏把 Local 和所有远程机器放在同一个列表里，每台机器保持独立的 reconnect，不需要再嵌套 SSH + tmux。还有 `herdr --remote user@host` 的 thin client 模式，本地键位、本地剪贴板都能保留。
### 2.5 鼠标键盘双一等公民
如果 tmux 的纯键盘流让你劝退过，Herdr 会让人眼前一亮：**点击选 pane、拖边框 resize、右键菜单 split/close/rename**，全部原生支持；同时 tmux 风格的 prefix 键（默认 `Ctrl+B`）和快捷键也在，两种输入方式并行不悖。
### 2.6 插件生态：一个月 500+，三个月 1000+
插件模型极其克制：一个 `herdr-plugin.toml` 清单 + 任意可执行文件（Bash / JS / Lua / Rust / Go / PowerShell 都行），**整个 herdr CLI 就是插件 API**，没有 SDK、没有沙箱、没有额外抽象层。
插件能做：注册动作、监听事件（如 `worktree.created`）、添加 pane（overlay/popup/split/tab/zoomed）、处理 Ctrl+点击链接等。市场在 `herdr.dev/plugins`，自动索引带 `herdr-plugin` topic 的 GitHub 仓库，每 30 分钟刷新一次。
---
## 三、上手指南：从 0 到第一个多 Agent 工作流
### 3.1 一行安装
```bash
# macOS / Linux
curl -fsSL https://herdr.dev/install.sh | sh
# 或
brew install herdr
# Windows (PowerShell)
powershell -ExecutionPolicy Bypass -c "irm https://herdr.dev/install.ps1 | iex"
```
启动即用：直接输入 `herdr`。
### 3.2 最小可演示场景：3 个 Agent 并行
```bash
herdr                                   # 启动 TUI
# Ctrl+B, V     垂直分屏
# 在三个 pane 里分别启动：
claude     # 主 Agent：架构
codex      # 实现 Agent
copilot    # 杂活 Agent
```
右侧栏立刻能看到三个 Agent 的实时状态。`Ctrl+B, D` detach 后合上笔记本，明早 `herdr` 一敲，所有现场原样恢复。
### 3.3 用 Agent 指挥 Agent（核心杀手锏）
```bash
# 在 Claude Code 里对它说：
# "帮我开一个新 pane 跑 npm run dev，等它启动完成"
```
Claude Code 读到 `herdr --skill` 后会自己调用：
```bash
herdr pane split --vertical
herdr pane run "npm run dev"
herdr wait --pane 2 --state blocked --timeout 30000
```
整个"开 dev server → 等就绪 → 接管"流程不需要你碰键盘。
### 3.4 推荐配置（直接可粘贴）
```toml
# ~/.config/herdr/config.toml
[keys]
prefix = "ctrl+a"          # 改成你肌肉记忆里的 tmux 前缀
[theme]
name = "rose-pine"
onboarding = false
```
### 3.5 必看命令速查
| 命令 | 作用 |
|---|---|
| `herdr` | 启动 / 重新 attach |
| `herdr --remote user@host` | thin client 连远程 |
| `herdr machine add host` | 注册远程机器 |
| `herdr agent wait reviewer --until blocked` | 等某 Agent 进入指定状态 |
| `herdr agent read reviewer --lines 120` | 读取最近输出 |
| `herdr plugin install owner/repo` | 装插件 |
| `herdr schema` | 导出 OpenRPC API（写客户端用） |
---
## 四、淘金摘优：5 个神仙级插件推荐
Herdr 插件市场已有约 1000+ 索引条目、1500+ tag 仓库，但官方明确"不做安全审查、不做沙箱"。下面这 5 个经过社区验证、星数与实用性双高：
### ① herdr-reviewr（804★）—— 把"代码评审"塞进 Agent 工作流
`persiyanov/herdr-reviewr` 用 Rust 写的 diff 评审 pane：在 Agent 写完代码后，自动打开一个高亮 diff 视图，你可以**逐行留评论，一键发回 Claude Code / Codex / OpenCode / Pi**。这是把"代码评审"这个最大的人机协作痛点直接编进 Agent 循环里——不用切到浏览器、不用复制粘贴。
```bash
herdr plugin install persiyanov/herdr-reviewr
```
### ② zoetrope（978★）—— 看 Agent 的"实时脑内剧场"
`furkankly/zoetrope` 把 Claude Code 或 Codex 会话画成**实时流程图**，终端里也能渲染，浏览器里也能开。当你有 3 个 Agent 同时跑、想知道"那个家伙现在到底在干嘛"时，这一格 pane 比任何日志都直观。
```bash
herdr plugin install furkankly/zoetrope
```
### ③ herdr-agent-usage（168★）—— 盯紧你的 token 账单
`levi-qiao/herdr-agent-usage` 在侧边栏显示 Claude、Codex、Grok、Devin、Cursor 等 Agent 的 token 用量、context 占用与 cache 命中。Agent 时代的真实成本就是 token，没有它你就活在"下月账单开盲盒"里。⚠️ 注意：仓库 `senna-lang/herdr-agent-usage` 是同名不同作者的项目，**装的时候务必写全 `owner/repo`**。
```bash
herdr plugin install levi-qiao/herdr-agent-usage
```
### ④ herdr-plus（345★）—— 用一份 TOML 描述整个工作空间
`cloudmanic/herdr-plus` 提供两件事：**Projects**（一个 TOML 文件声明整个 workspace 的 tabs/splits/启动命令，一键恢复成完整环境，且支持 git worktree 一键开新分支）和 **Quick Actions**（任意目录下的模糊启动器）。如果你每天要切换 5 个项目，这个就是止损神器。布局文件可以提交到 dotfiles，2am 改配置也心里有底。
```bash
herdr plugin install cloudmanic/herdr-plus
```
### ⑤ collie（1256★）—— 手机上指挥你的 Agent 军团
`AltanS/collie` 是个自托管的 PWA，能从手机驱动跑在 Herdr / tmux / zellij 里的 Claude Code、Pi、Codex、OpenCode。默认走 Tailscale、自带推送通知、不用过 App Store。配合 VPS 使用就是终极自由：**真·人不在电脑前也在写代码**。
```bash
herdr plugin install AltanS/collie
```
> **通用避坑**：装任何插件前先读 `herdr-plugin.toml`；第一次安装不要传 `--yes`；用 `--ref v1.2.0` 锁定版本；凭据放 `HERDR_PLUGIN_CONFIG_DIR`，**别放会被覆盖的 `HERDR_PLUGIN_ROOT`**。
---
## 五、目标人群与收益
| 人群 | 适合度 | 具体收益 |
|---|---|---|
| 同时跑 3+ AI Agent 的资深开发 | ⭐⭐⭐⭐⭐ | 状态一眼可见、Agent 间可编排，按 Josh Finnie 的说法"我不再每 10 分钟被卡 15 分钟" |
| VPS / 自托管重度用户 | ⭐⭐⭐⭐⭐ | 单 Rust 二进制 + 无遥测 + thin client，5 美元 VPS 就能搭"永不下班的 Agent 工厂" |
| 想做 Agent 编排 / 多 Agent 产品的工程师 | ⭐⭐⭐⭐ | Socket API + OSC 7501 是难得的协议级抓手，可直接做自家 Agent 的宿主 |
| 严重依赖 tmux 老配置的人 | ⭐⭐ | 切换成本真实存在，18 年的插件和肌肉记忆要重新算账 |
| 纯 Windows 用户 | ⭐⭐ | 支持仍在 beta， elevated server、通知等有平台 caveats |
| 只偶尔用 1 个 Agent 的开发 | ⭐⭐ | tmux / Zellij 已经够用，没必要换 |
---
## 六、竞品对比
| 维度 | **Herdr** | tmux | Zellij | TuiOS / Rex / Muxy |
|---|---|---|---|---|
| 核心定位 | Agent 运行时 | 通用复用器 | 友好型工作空间 | "复用器即终端"派 |
| Agent 状态感知 | ✅ 原生（OSC 7501） | ❌ | ❌ | 部分有 |
| Agent 编排 API | ✅ CLI + Socket (OpenRPC) | 仅终端脚本 | 插件脚本 | 看具体实现 |
| 多机一窗 | ✅ `machine add` | ❌ | ❌ | 部分有 |
| 鼠标原生 | ✅ 开箱即用 | 需配置 | ✅ | 看具体实现 |
| 单二进制 | ✅ ~10MB | ✅ | ✅ | 看具体实现 |
| 插件模型 | 可执行文件 + TOML 清单 | 脚本 + hooks | WASM/WASI | 各异 |
| 项目年龄 | ~5 个月（2026.03 起） | 18 年 | 已稳定 | 较新 |
| 许可证 | Apache-2.0 | ISC | MIT | — |
| 商业背托 | YC F26（独立） | 社区 | 社区 | 多为独立 |
数据综合自 Flavio Copes、bitdoze、Josh Finnie 等多篇横向评测。
**何时仍选 tmux**：你有一份精心调教的 `.tmux.conf`、18 年的肌肉记忆、要管理关键生产服务器、Agent 只是 pane 里众多普通进程之一。
**何时选 Zellij**：你想要开箱即好的默认配置、可见快捷键提示、浮动 pane，主要工作对象仍是普通 shell。
**何时选 Herdr**：你一天要管 5 个 Agent、需要知道谁在等你、想让 Agent 互相派活，或者要从手机上接管 VPS 里的会话。
---
## 七、局限与不足（必读）
1. **项目还很年轻**。从 2026 年 3 月底立项算起仅约 5 个月，对比 tmux 的 18 年，长期稳定性、崩溃恢复、内存占用等尚未经过足够时间考验。
2. **Windows 仍是 beta**。官方 README 也明说有平台特定 caveat，elevated server 默认只接受管理员客户端、quoted shell 命令需要 PATH 里有 `sh`（Git Bash 提供）等细节得自己踩。
3. **插件市场是"自动索引"，不是"安全审查"**。约 1000+ 插件没人审、没沙箱，插件以你的用户身份、你的环境变量、全 CLI 权限跑。装任何插件前读一遍 `herdr-plugin.toml` 是底线动作。
4. **默认会"打电话回家"**。后台会检查新版本和 Agent 检测清单更新，介意的话要在 config 里关掉。
5. **重启后真正"活着"的只有布局**。Herdr 自己恢复的是 workspace 形状，任意 shell/服务/测试进程会以新 shell 启动；只有装了官方 integration 的 Agent（Claude Code 等）才能恢复会话上下文。tmux-resurrect 类的全量快照仍要靠 `herdr-resurrect` 这类插件补。
6. **许可刚从 AGPL 切到 Apache-2.0**。对企业用户这是好事，但如果你之前基于 AGPL 版本做了分发，需要重审合规。
7. **学习曲线是"概念多"而非"操作难"**。Workspace / Tab / Pane / Agent / Session / Machine / Template 这套对象模型比 tmux 复杂，文档（herdr.dev/docs）值得通读一遍再上手。
---
## 八、结语与行动建议
**如果 AI Agent 已经是你工作流里的一等公民，Herdr 不是又一个花哨工具，而是缺的那层"地基"**。它把"Agent 只是终端里的进程"这个 1990 年代假设，改写为"Agent 是有状态、可对话、可编排的一等公民"——这是和 tmux 完全不同的命题。
**给三类读者的行动建议**：
- 🔥 **重度多 Agent 用户**：今天就装，先装 `herdr-plus` + `herdr-reviewr` + `herdr-agent-usage` 这套组合，3 小时内你会回不去。
- 🧪 **观望型用户**：在 VPS 上以 `herdr --remote` 试一周，本地 tmux 不动，零成本并行。
- 🛠️ **工具作者 / Agent 开发者**：去读 `herdr schema` 输出的 OpenRPC 文档和 OSC 7501 规范，把你的 Agent 接到这个生态里——这是 2026 年少数"协议级"的窗口期。
**综合评分：9 / 10**。扣 1 分给年轻项目的稳定性风险、Windows beta 状态和无审查的插件市场；它已经是我个人 2026 年最看好的开发者工具，没有之一。
