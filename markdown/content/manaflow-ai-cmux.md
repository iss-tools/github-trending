# manaflow-ai/cmux

[GitHub URL](https://github.com/manaflow-ai/cmux)


## cmux 深度评测：专为 AI Agent 并行调度而生的 macOS 原生终端

> cmux 是一款基于 Ghostty 引擎的开源 macOS 终端，让你同时管理多个 AI Coding Agent，谁在等你一眼就知道

- **Tags**: macOS, 开源项目, AI Agent, 终端工具, Claude Code
- **Category**: 开发工具, AI 编程, 效率工具

## Details

# cmux 深度评测：一个把"AI 编排"塞回终端的macOS 原生小怪物
> **一句话总结**：cmux 是一款由 Manaflow 团队开源、基于 Ghostty 渲染引擎的原生 macOS 终端应用，专为你同时跑多个 AI Coding Agent（Claude Code / Codex / OpenCode / Aider…）而生的"多线程调度台"——垂直侧边栏显示每个 Agent 的分支、PR 和监听端口，谁需要你的输入，谁的 Pane 就亮起一圈蓝光，`⌘⇧U` 一键跳过去。
它不是又一个套壳 Electron 的"AI 终端"，也不是要抢 Claude Code 饭碗的"编排器"——它把自己定位得很清楚：**"a primitive, not a solution"（一个原语，不是一个解决方案）**。这句话是理解 cmux 的钥匙。
---
## 一、背景与痛点：为什么这个项目会火
### 1.1 真实痛点：当你同时跑 6 个 Claude Code 会话
cmux 作者在 README 里写了一段非常接地气的自述：他一开始用 Ghostty + 原生 macOS 通知跑一堆 Claude Code 会话，结果发现——
> Claude Code 的通知永远是那句干巴巴的"Claude is waiting for your input"，没有任何上下文；Tab 开多了之后连标题都看不清，只能挨个 Pane 点进去查谁卡住了。
这不是作者一个人的痛。2026 年的典型开发者工作流已经变成了这样：左侧 Claude Code 在重构一个服务，右侧 Codex 在写单测，下面 Aider 在 bisect 一个回归，右下角 Gemini CLI 在修 lint。**人类不再敲每一条命令，而是变成了调度员、审核员和"决定哪个 PR 能上线"的那个人**。
传统终端没有为这种"人机混合调度"设计过任何东西——tmux 是 30 年前为"一个人管多个 shell"设计的，iTerm2 是为"一个人高效打命令"设计的。它们都不假设"用户走开了，5 个 AI 正在替他干活，他需要一眼知道谁在等他"。
### 1.2 诞生与走红
- **发布时间**：2026 年 2 月公开发布，当天冲上 Hacker News 第二。
- **Star 增长**：截至 2026 年 5 月约 **19.8k stars**，到 9 月已突破 **27k stars**——对一个上线不到 8 个月的项目来说是相当罕见的速度，主要来自 HN 和 Twitter 的病毒式传播。
- **当前版本**：v0.64+（2026 年 5 月底更新节奏非常快，几乎每周一个 release）。
- **开发团队**：Manaflow，一个小型独立团队；商业模式是"开源免费 + Founder's Edition 付费早鸟"（提前体验 cmux AI、iOS 应用、Cloud VM 等）。
### 1.3 它解决了什么核心问题
把一句话拆开：**"如何在不离开终端的前提下，并行管理 N 个 AI Agent，并且知道每一个在干嘛、谁需要你"**。
具体来说，cmux 解决了三个此前没有工具能优雅处理的问题：
1. **通知的"语义化"**——不是"终端有输出"这种噪音，而是"Claude Code 在 workspace-3 等你确认"，并且你能一眼看到。
2. **多 Agent 的"可视化"**——每个 Workspace 对应一个任务，侧边栏显示 git 分支、关联 PR 编号、监听端口、最新一条通知文本。
3. **Agent 与浏览器、远程机器的"组合"**——Agent 可以直接读写旁边的浏览器 Pane，也可以 `cmux ssh` 直接把远程机变成一个 Workspace。
---
## 二、核心亮点与功能剖析
### 2.1 libghostty：站在巨人肩膀上的渲染引擎
cmux 不是 Ghostty 的 fork，而是把 Ghostty 项目发布的 **libghostty 作为库嵌入**——就像应用嵌 WebKit 一样嵌一个终端渲染引擎。
这意味着：
- **GPU 加速（Metal）渲染**，启动速度和内存占用远优于 Electron 方案（Warp、很多"AI 终端"的痛点）；
- **完全兼容 Ghostty 配置**：你原有的 `~/.config/ghostty/config` 里字体、主题、配色直接生效，零迁移成本；
- cmux 本体用 **Swift + AppKit** 写，不是套壳 Web。这是它和 Warp、Wave 这类 Electron 终端在底层哲学上的根本区别。
> **比喻一下**：如果 Ghostty 是 Chrome 的 Blink 引擎，那 cmux 就是 Brave——同一套内核，但外壳和产品定位完全不同。
### 2.2 "Agent-Aware" 的侧边栏与通知环（这是最大卖点）
这是 cmux 相对所有传统终端最"AI Native"的部分：
- **每个 Workspace 在侧边栏一行**，显示 git 分支、PR 状态/编号、CWD、监听端口、最新通知文本——你不用点进去，就能一眼看清每个 Agent 在哪个任务上。
- **蓝色通知环**：当 Agent 停下来等待输入，对应 Pane 外框亮起蓝环，侧边栏 Tab 同时点亮。
- **通知面板**（`⌘I`）+ **跳转最新未读**（`⌘⇧U`）：把你从"6 个 Pane 逐个检查"的 alt-tab 地狱里解放出来。
通知来源有三条通道，全部是开放标准而非 cmux 私有协议：
```bash
# 1. CLI（最简单）
cmux notify --title "Claude Code" --subtitle "Waiting" --body "Agent needs input"
# 2. OSC 777（任何语言、任何 shell）
printf '\e]777;notify;Tests passed;All 142 green\a'
# 3. OSC 99（Kitty 协议，支持 subtitle 等富字段）
printf '\e]99;i=1;e=1;d=0;p=title:Build Complete\e\\'
```
也就是说，你写的任何脚本、任何语言、任何 Agent（只要支持 hooks 或 OSC）都能往 cmux 里"广播"通知，而不需要 cmux 主动适配。
### 2.3 与 Claude Code 的深度 Hook 集成（强烈推荐每个用户都配）
这是 cmux 的"杀手锏"级用法，也是 README 里明确推荐的一步：
```bash
# 一条命令给 Claude Code / Codex / OpenCode 装上 hooks
cmux hooks setup
cmux hooks setup codex
cmux hooks setup --agent opencode
```
装完之后，每当 Agent 停止、或者一个 sub-agent 完成 Task，cmux 自动收到事件，对应的 Pane 亮蓝环、侧边栏点亮，桌面通知同时触发。Claude Code 的 **Teams 模式**（Teammates）也能通过 `cmux claude-teams` 一条命令变成原生分屏——每个 teammate 一个 Pane，带侧边栏元数据和通知，不再需要 tmux。
**这句话是给你的**：如果你已经在用 Claude Code 但还没装 cmux，光这一条 hooks 集成就值得你花 5 分钟装一下——这是所有"终端 + AI"组合里最丝滑的通知方案，没有之一。
### 2.4 内嵌可编程浏览器（从 Vercel Labs 的 agent-browser 移植）
cmux 内置一个真正的浏览器 Pane（`⌘⇧L` 打开），可以和终端左右分屏，并暴露**完整的脚本 API**：导航、快照 DOM / accessibility tree、点击、填表、执行 JS、读 console 和 network。
用途非常具体：
- 让 Claude Code 写完 UI 改动后，**自己去 dev server 里点一遍验证**，不用切出去；
- 浏览器 Pane 的 Cookie/Session 可以从 Chrome、Firefox、Arc 等 20+ 浏览器**一键导入**，所以打开就是已登录状态，Agent 可以直接操作你已登录的 SaaS。
远程场景同样支持：`cmux ssh user@remote` 创建远程 Workspace，浏览器 Pane 的网络流量走远程机，所以远程机上的 localhost 也能直接打开；甚至支持拖拽图片上传（走 scp）。
### 2.5 CLI + Unix Socket API：完全可编程
这是 cmux "primitive" 哲学的核心体现——**所有 UI 能做的事，都能通过 CLI 或 Socket 做**：创建 workspace、分屏、发按键、读屏、截图、控制浏览器。
```bash
# 把 cmux 暴露到 PATH（外部的脚本/CI 才能用）
sudo ln -sf "/Applications/cmux.app/Contents/Resources/bin/cmux" /usr/local/bin/cmux
# 常用示例
cmux list-workspaces
cmux notify --title "Build Complete" --body "webpack finished in 4.2s"
```
这意味着你可以用脚本预置每天早上的 workspace 布局、用 CI 触发通知、用 AppleScript 联动、甚至让另一个 Agent 来指挥 cmux。
### 2.6 会话恢复（有限但够用）
cmux 退出后会记住窗口布局、workspace、Pane 结构、工作目录、scrollback、浏览器历史。**但不会 checkpoint 任意运行中的进程**——重启后 Claude Code 会话是否恢复，取决于你有没有装 hooks（装了就会保存 session ID 以便 resume）。
如果你需要 tmux 级别的"活进程跨重启存活"，cmux 提供 `cmux local-tmux`（Zellij 用户用 `cmux local-zellij`）作为可选方案。
### 2.7 其他细节
- **SSH**：原生支持，`cmux ssh user@host` 直接生成远程 Workspace；
- **浏览器导入**：Cookie / 历史 / Session 一键从 Chrome / Firefox / Arc 等 20+ 浏览器导入；
- **自定义命令**：在 `cmux.json` 里定义项目专属动作，从 Command Palette 触发；
- **Nightly 构建**：独立 bundle ID，可与稳定版共存；
- **iOS BETA**：TestFlight 上有 cmux BETA，可从手机 attach 到 Mac 的终端，Founder's Edition 含早鸟资格。
---
## 三、上手门槛与部署体验
### 3.1 系统要求
- macOS **14.0 (Sonoma) 或更高**
- Apple Silicon 或 Intel
- 不支持 Linux / Windows（社区有 `cmux-windows` 的非官方移植，作者自嘲是"vibe-coded"，不建议生产使用）。
### 3.2 两种安装方式
**方式 1：DMG（推荐首次安装）**
```bash
# 从 GitHub Releases 下载
# https://github.com/manaflow-ai/cmux/releases/latest/download/cmux-macos.dmg
# 拖入 Applications，cmux 会通过 Sparkle 自动更新
```
**方式 2：Homebrew**
```bash
brew tap manaflow-ai/cmux
brew install --cask cmux
# 后续升级
brew upgrade --cask cmux
```
首次启动 macOS 会提示"来自已识别开发者的应用"，点 Open 即可。
### 3.3 推荐的首次配置（5 分钟见效）
1. **接 Ghostty 配置**：什么都不用做，cmux 自动读 `~/.config/ghostty/config`；
2. **装 Agent Hooks**：`cmux hooks setup`，然后重启 Claude Code——通知环立刻生效；
3. **建几个 Workspace 试试**：`⌘N` 新建、`⌘1-8` 跳转、`⌘D` 左右分屏、`⌘⇧D` 上下分屏；
4. **试通知**：`cmux notify --title "Hello" --body "cmux CLI works"`；
5. **打开浏览器 Pane**：`⌘⇧L`，感受 Agent 直接操作网页的体验。
### 3.4 常用快捷键速查
| 快捷键 | 作用 |
| --- | --- |
| `⌘N` / `⌘1-8` | 新建 Workspace / 跳转 |
| `⌘D` / `⌘⇧D` | 右分屏 / 下分屏 |
| `⌘⇧L` | 打开浏览器分屏 |
| `⌘I` | 通知面板 |
| `⌘⇧U` | 跳到最近未读 |
| `⌘B` | 切换侧边栏 |
| `⌘⇧R` | 重命名 Workspace |
完整列表见 README 或 `Settings → Keyboard Shortcuts`（全部可自定义）。
---
## 四、竞品对比：cmux 在 2026 年的坐标系
横向对比是目前 agent 终端生态里最常见的几个选择：
| 维度 | **cmux** | tmux | iTerm2 | Warp | Pane |
| --- | --- | --- | --- | --- | --- |
| **平台** | macOS 14+ | 全平台（含 SSH） | macOS | 全平台 | Win + Mac + Linux |
| **技术栈** | Swift/AppKit + libghostty | C（终端内多路复用） | Objective-C | Electron/Tauri | Electron 系 |
| **GPU 渲染** | ✅ Metal | 取决于宿主终端 | ❌ | ⚠️ | ⚠️ |
| **Agent 通知环** | ✅ 原生 | ❌（要自己搭） | ⚠️ 通用通知 | ⚠️ | ✅ |
| **垂直侧边栏+分支/PR** | ✅ | ❌（status bar） | ❌ | ⚠️ | ✅ |
| **内嵌可编程浏览器** | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Git Worktree 自动化** | ❌（自己管） | ❌ | ❌ | ❌ | ✅ 自动 |
| **多 Agent 编排** | ⚠️ 原语级 | ❌ | ❌ | ⚠️ 内置 AI | ✅ 完整 |
| **SSH 会话** | ✅ 原生 | ✅（核心能力） | ✅ | ✅ | ✅ |
| **会话恢复（活进程）** | ⚠️ 需 `local-tmux` | ✅（核心能力） | ⚠️ | ⚠️ | ✅ App 层 |
| **开源许可** | GPL-3.0（+ 商业版） | ISC | GPL-2.0 | ❌ 闭源 | AGPL-3.0 |
| **成熟度** | 8 个月，27k★ | 18 年 | 15+ 年 | 5 年 | 较新 |
数据综合自 cmux README、runpane.com 对比页、dev.to 深度文和 Petronella 的合规向分析。
### 4.1 一句话定位
- **vs tmux**：tmux 是"运行在任意终端里的多路复用器"，cmux 是"原生 macOS 应用"。你牺牲了 tmux 的普适性和 SSH 持久性，换来了 macOS 原生通知、GPU 渲染和可视化侧边栏。两者并不冲突——很多人 cmux + SSH + tmux 一起用。
- **vs iTerm2**：iTerm2 是 15 年打磨的成熟 macOS 终端，shell integration 和 trigger 生态非常完善，但它**不是为"AI Agent 调度"设计的**——通知没有 workspace 上下文，没有侧边栏，没有 GPU 加速。如果你一天到晚泡在 Claude Code 里，iTerm2 会让"哪个 Agent 在等我"变成永恒的猜谜。
- **vs Warp**：Warp 是更重的 Electron 应用，自带 AI 功能但试图**接管你的整个工作流**；cmux 刻意反向定位——"我不做编排器，我只做原语，你爱怎么搭怎么搭"。喜欢自由度的会爱 cmux，喜欢开箱即用的会选 Warp。
- **vs Pane / Conductor 等专用编排器**：Pane 是完全不同的物种——它做 worktree 生命周期管理、自动 diff 审查、commit-push 键盘流。cmux 不做这些，但 Pane 没有 cmux 的浏览器 Pane 和 Ghostty 级渲染。两个不互斥，可以互补。
---
## 五、目标人群与收益：谁该立刻装？
### 5.1 强烈推荐（裨益立竿见影）
- **同时跑 2 个以上 AI Coding Agent 的 macOS 开发者**——这是 cmux 的"100% 命中"用户群。装上 hooks 后，你再也不用逐个 Pane 查谁卡住了，效率提升是量变到质变的。
- **Claude Code 重度用户**——hooks 集成 + Teams 模式原生支持 + 浏览器验证，这三件套在 Claude Code 生态里找不到更顺滑的搭配。
- **已经在用 Ghostty 的开发者**——配置零迁移，相当于"白嫖"一层 Agent UI。
- **喜欢用 CLI 脚本化一切的老派工程师**——Socket API 完整开放，你可以把 cmux 当成一个可编程的终端基础设施来用。
### 5.2 谨慎尝试（能跑但缺胳膊少腿）
- **Windows / Linux 用户**——直接 Pass，社区移植版不成熟；
- **重度依赖 SSH 长会话的开发者**——cmux 的 SSH 是新加的，但 tmux 级别的活进程持久化仍要靠 `cmux local-tmux` 这种间接方案；
- **带合规要求的团队（医疗 / 金融 / 国防）**——Petronella 的合规向文章提醒得很到位：cmux 本身**不解决**数据驻留、审计日志、最小权限的问题，这些问题是任何 Agent 终端都要面对的，团队需要在 cmux 之外自己搭建护栏。
### 5.3 它能为你解决的具体痛点
1. **认知负担**：从"记 6 个 Tab 各在干什么"变成"侧边栏一眼看完"；
2. **响应延迟**：Agent 等你输入时立刻知道，而不是 5 分钟后发现它在那儿空转；
3. **上下文切换**：`⌘⇧U` 一键跳到最紧急的那个，省掉 tab 循环；
4. **验证闭环**：Agent 写完 UI 改动直接在内置浏览器自测，不用切出去手动点；
5. **可重复的工作流**：用 CLI + cmux.json 把每天早上的"开工布局"固化成脚本。
---
## 六、局限与不足（必须诚实地说）
### 6.1 仅 macOS 是硬伤
Swift/AppKit 决定了 cmux **只能跑在 macOS 14+** 上。对 Linux / Windows 用户来说，Pane、Conductor、tmux+插件是更现实的选择。社区有 `cmux-windows` 移植尝试，但作者自己说是 vibe-coded，不能拿去生产。
### 6.2 "Primitive" 哲学的代价
cmux **不做** git worktree 自动化、不做任务分解、不做跨 Agent 的结果聚合、不做 PR review 循环。它把这一切留给你自己组装。这既是最大优点（不被任何产品经理的偏见绑架），也是最大缺点（你得自己是架构师）。如果你想要"开箱即用的 Agent 工厂"，Pane 或 Conductor 这类产品更适合。
### 6.3 会话持久化仍有缺口
退出 cmux 后能恢复布局、工作目录、scrollback，但**运行中的进程不会 checkpoint**。要用 tmux 做底座才能跨重启存活。这对"Agent 跑一晚上，早上来看结果"的场景是真实痛点。
### 6.4 项目还很年轻
8 个月大，API 和配置格式可能变。27k stars 的增长曲线很漂亮，但意味着大量 issue、大量 feature request，维护压力会随着流行度飙升。Nightly 构建的 bug 也有专门 Discord 频道收集，说明作者自己也承认稳定性还在迭代。
### 6.5 双许可的潜在摩擦
cmux 用 GPL-3.0 + 商业授权的双许可模式。对个人开发者和开源项目完全无感，但如果你所在的公司想**分发**或**嵌入** cmux，需要先过一遍法务。相比之下，Pane 用 AGPL-3.0 不卖商业许可，对纯使用者更省心。
### 6.6 一个值得思考的隐忧
Petronella 的文章里有一个很有远见的观察：**"Agent 终端"这个品类之所以存在，部分原因是今天的 Agent 还不擅长主动请求帮助**。如果未来 Agent 能在卡住时自己 webhook、自己提 PR、自己发 Slack，cmux 的可视化通知价值就会下降。这不是说 cmux 会死，而是说选型时值得想想"5 年后我还需要这个工具吗"。
---
## 七、Zen of cmux：一句话读懂它的产品哲学
README 里那段 "The Zen of cmux" 是整个项目最有灵魂的部分，值得单独抄录：
> cmux is not prescriptive about how developers hold their tools. It's a terminal and browser with a CLI, and the rest is up to you.
>
> cmux is a primitive, not a solution.
>
> The best developers have always built their own tools. Nobody has figured out the best way to work with agents yet, and the teams building closed products definitely haven't either.
>
> Give a million developers composable primitives and they'll collectively find the most efficient workflows faster than any product team could design top-down.
这段话把 cmux 和 Warp、Cursor、Conductor 这类"我们最懂你"产品划清了界限。它赌的是**"智慧在社区里，不在产品经理脑子里"**——这种姿态在 2026 年"AI 编排器"遍地开花、都想锁死你工作流的时代，反而是一种稀缺。
---
## 八、结语与行动建议
**cmux 是过去一年里"AI Coding 生态"里最让人眼前一亮的工具之一**。它没有试图重新发明 Agent，没有试图重新发明 IDE，也没有试图把终端做成 chatbot。它只做了一件事：**让多 Agent 并行这件事，第一次在终端里变得**可视化**、**可通知**、**可编程**。
### 最终评判
- **如果你是 macOS + Claude Code / Codex / OpenCode 用户**：装。不装是你的损失，5 分钟就能见效。
- **如果你是 Windows / Linux 用户**：等一等，或者看看 Pane / Zellij。
- **如果你是团队技术负责人**：cmux 可以作为个人生产力工具推荐给团队，但合规、审计、密钥管理这些"团队级"问题，它不是答案。
- **如果你是开发者工具产品经理**：cmux 的"primitive not solution"定位、libghostty 的"内核复用"思路、hooks 的开放通知协议——这三件事都值得写进你的产品灵感库。
### 立即可做的三件事
1. 访问 **github.com/manaflow-ai/cmux** 看一眼 README（有 14 种语言翻译，包括简体中文）；
2. `brew tap manaflow-ai/cmux && brew install --cask cmux`；
3. `cmux hooks setup` 把 Claude Code 接上——然后体验一次 `⌘⇧U` 跳到最新未读的瞬间，你会明白什么叫"agent-aware"。
GitHub 仓库：**https://github.com/manaflow-ai/cmux** · 官网与文档：**https://cmux.com**
