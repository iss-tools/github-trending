# chaitanyagiri/munder-difflin

[GitHub URL](https://github.com/chaitanyagiri/munder-difflin)

- **Stars**: 5102
- **Language**: JavaScript

## Munder Difflin 深度评测：本地多智能体协作控制台

> 把本地终端 AI CLI 包装成办公室协作 Agents 的桌面应用，统一管控、记忆与成本。

- **Tags**: 多智能体, 本地化, 可视化协作, 记忆管理, 成本控制
- **Category**: 开发工具, AI编程, 效率工具

## Details

## Munder Difflin 深度评测
一句话总结：Munder Difflin 是一款把本地终端 AI 编程 CLI（如 Claude Code、Grok、Copilot CLI 等）包装成“办公室”里多个协作 Agents 的桌面应用，用 2D 像素风格的 Floor 与长记忆/邮箱/黑板的 Hive 多智能体机制，让你一边看“分身们”干活，一边通过 Michael 这个“GOD Agent”来协调与审批。
---
## 背景与痛点：为什么需要“本地多智能体管理台”？
- 终端 AI CLI 越来越多：Claude Code（claude）、Antigravity（agy）、OpenAI Codex（codex）、xAI Grok（grok）、Kimi Code（kimi）、Gemini CLI（gemini）、Qwen（qwen）、OpenCode（opencode）、Crush（crush）、pi.dev（pi）、GitHub Copilot（copilot）、Cursor（cursor-agent）等，都在抢占“命令行里的结对编程/自动执行”场景。
- 各家订阅和额度分散：你已经在为这些服务付费，但它们各自为战、没有统一协作与记忆；想把不同模型串起来做任务，基本只能靠手工切窗口。
- 多 Agent 协同通常在云端：主流编排平台（如 LangGraph、AutoGen 等）多部署在服务端，要么带来数据隐私顾虑，要么要你自己架基础设施，与“本地终端”割裂。
- 可观测性差：跑了几轮会话，消耗如何、任务进度怎样、谁干了什么，往往只能靠终端滚动记录查，缺少统一控制台与成本明细。
Munder Difflin 的解法是做一个本地的“Desktop Control Room（桌面控制室）”，在 Electron 桌面里统一管理这些终端 Agent，并赋予它们：
- 长记忆（markdown first + 语义检索）
- 邮箱/消息队列（可靠投递与回执）
- 共享黑板与任务看板
- 可视化的办公室 Floor 与每 Agent 的头像、工位
它相当于给你的“终端打工人们”盖了一层协作与记忆的中台，又用 Michael 来做 Floor Boss。
---
## 核心亮点与功能剖析
1) 终端平面（Terminal Plane）：每个 Agent 是真实 PTY 进程
- 技术实现：使用 node-pty 为每个 Agent 创建一个真实的伪终端进程（如 claude），通过 xterm.js 把字节流原样渲染到界面；你可以看到和原来终端一模一样的输出。Electron 主进程的 PtyManager 负责生成/销毁/调整 PTY 尺寸并流式传输数据到渲染器。
- 为什么重要：这保证了“所见即所得”，不是对输出做脆弱的解析；你可以随时在侧边栏的 Command Bar 输入命令，本质是 `tmux send-keys` 或 node-pty 写入 PTY。
- 价值：它不造新的 Agent Runtime，而是“编排你已订阅的那些 CLI”，让它们的现有能力继续生效并叠加协作层。
2) 事件平面（Event Plane）：Hooks、Hive 与 GOD Agent
- Hooks 与事件驱动：通过 Claude Code 的生命周期钩子（UserPromptSubmit、PreToolUse、PostToolUse、Notification、Stop 等），配合 `cth-hook` 这种 Node 小工具把事件 JSON POST 到本地 Unix Domain Socket，驱动界面上的 Avatar 行为（走到文件架、终端站、Web 门户等）。
- Hive 多智能体层：在本地维护一个 `hive/` 的 git 仓库作为协作层：
  - 每个 Agent 有独立目录 `agents/<id>/`，包括 `memory.md`、`inbox/`、`outbox/`、`cursor.json` 等，保证“单写者”避免冲突。
  - 共享 `board.md`（黑板/计划）与 `tasks.json`（任务台账），以及 `log.jsonl`（只追加事件日志）。
  - 主进程统一做 git commit，解决并发写入与 `.git/index.lock` 风险。
- 消息投递与路由：Agent 写 `outbox/`，由 Router 投递到目标 `inbox/`；消息 schema 类 FIPA-ACL（保留 speech act 概念），为防止死循环做了 hop cap 与幂等处理。
- GOD Agent（Michael）：一个始终在线的 `character:michael`、`isGod:true` 的 Agent，负责：
  - 名册与路由
  - 常规请求的自动裁决
  - 升级“关键事项”（费钱、破坏性、变更范围）到人类——通过原生的 CLI 权限提示 HITL（Human-in-the-Loop），而不是另做一个审批队列。
> 打个比方：Floor 就像开放式办公室，Hive 是公司共享盘与邮件系统，Michael 是站在总经理工位上负责分单和捅你的人；你则是董事长，只看汇总、只批重要单子。
3) 记忆与知识：Markdown 优先 + 语义检索（MemPalace）
- 每个 Agents 有一个 `memory.md`，任务开始时读取，学习后追加；另有一个共享的“企业知识图谱”，可挂载你自己的文档与政策，供任意 Agent 查询。
- 语义层：项目集成了 MemPalace CLI 作为语义检索，把 markdown 记忆挖掘到共享 palace 中；支持在 UI 中搜索；在 Apple Silicon 上将嵌入固定到 CPU，规避 CoreML 溢出导致 NaN 的 bug。
- 去重与压缩：有 MemoryReflector 做记忆压缩/蒸馏，以防止记忆无限膨胀（从 CHANGELOG 看到相关演进）。
4) 安全与管控：Human gates + 电路熔断 + 预算/遥测
- Human gates：涉及支出、破坏性操作、范围变更等会升级到人类；支持中途 steer（干预）或停止。
- 电路熔断（Circuit Breaker）：提供 steer → constrain → stop 阶梯式熔断，应对循环、错误风暴或预算超支。
- 预算与成本：按 Agent 设置 Token 预算，使用真实会话回放来算费用，写入持久化账本（Ledger），并结合 OTel spans 与工具瀑布（Tool Waterfall）进行可观测展示。此前版本有成本统计重启重置的 bug，已在 v0.4.5 修复。
- 遥测（Telemetry）：官方构建会发送匿名事件（应用启动、Agent 生成、功能使用等），无 prompts/代码/路径/输出；支持 Settings 切换、环境变量 DO_NOT_TRACK 或自源码编译等方式完全关闭。详见 TELEMETRY.md。
5) 命令中心（Command Center）与内置 IDE
- Kanban 看板与任务依赖、排期任务（含工作日定时触发）、活动日志、CI 监控。
- 内置 Monaco IDE：文件树、标签页、保存，以及 Git Rails（CHANGES · HISTORY · COMPARE），包含提交图、差异、分支对比与“受控的 checkout”。所有文件系统/Git 操作都通过主进程代理。
- Skills 浏览与安装：展示每个 Agent 已具备的技能（Claude Code / OpenCode / Codex 的内置能力），并提供 227+ 技能目录的浏览、搜索、安装、卸载。
6) UI/UX 与视觉：2D 办公室 Floor + 像“《动物森友会》× EarthBound × SNES 菜单”
- Pixi.js 的 Office Floor，每个 Agent 是一个 2D 像素头像，走到不同站点（文件架、终端站、Web 门户、MCP 角落、任务板、邮箱），并有“信封飞来飞去”的消息视觉化。
- 设计系统来自 DESIGN.md，视觉风格为“Animal Crossing × EarthBound × SNES 菜单 UI”，品牌配色用 Dunder Mifflin 的酒红与金；15 个头像来自《The Office》角色（角色绘制通过 portraitArt.ts 过程化生成，非像素贴图）。
- 交互：你可以在 Floor 上点选某个 Agent，看它的实时终端流、发指令、配置目标/Skill/MCP，并在终端点击路径跳转。Michael 还可语音 Talk 进行指挥。
---
## 目标人群与收益：谁适合用？能带来什么具体好处？
- 面向人群：
  - 已订阅多个终端 AI CLI（Claude Code、Grok、Copilot CLI、Cursor、Kimi、Qwen 等）的开发者或效率发烧友。
  - 希望在本地编排多 Agent 协作、做“自动化办公室”的极客/团队。
  - 对成本与可观测性敏感，需要精确知道每个 Agent 花费与耗时的人。
- 核心收益：
  - 统一管控：在一个桌面里看所有 Agent 干活，不再频繁切换终端/浏览器。
  - 协作与分发：利用邮箱与黑板的模式，让不同 Agent 做各自擅长的事（例如一个跑测试、一个写文档、一个修 bug），并通过 GOD Agent 自动分单。
  - 长记忆与知识沉淀：跨会话记住项目惯例、内部规范、错误处理经验，减少重复沟通成本；可选语义检索让召回更高效。
  - 可观测与成本控制：实时 Token/成本账本与工具瀑布，便于预算控制与事后复盘；熔断机制防止失控跑飞。
  - HITL 安全网：关键动作仍由人类审批，避免“无脑执行”带来的误操作风险。
---
## 技术栈与架构解析：它怎么做到的？
- 技术栈：
  - Electron + React + TypeScript 作为桌面与前端主框架；UI 使用 Pixi.js 绘制 2D Floor，xterm.js 负责终端渲染，node-pty 提供 PTY 能力。
  - Hive 层：本地 git 仓库 + SQLite（用于持久化窗口状态与成本账本）+ 原子文件操作（mailbox 临时文件 + rename）。
  - 语义检索：集成 MemPalace CLI，为可选的语义记忆层。
  - 遥测：PostHog，通过 TELEMETRY.md 定义公开契约，并在 release CI 注入 Key；dev 构建不启用。
- 架构要点：
  - 两个数据平面：
    - Terminal Plane：原始字节流，经由 node-pty → IPC → renderer（xterm.js）。
    - Event Plane：结构化事件（hooks、Hive 路由、GOD），驱动 Avatar 与协作逻辑。
  - 单一提交者设计：只有 Electron 主进程负责 git commit；Agent 只写文件，避免 index.lock 冲突。
  - 隔离与联邦：每个 Agent 只写自己的 `agents/<id>/` 目录；跨 Agent 通信通过 outbox/inbox；共享文件（如 board.md）由 GOD Agent 单写。
- 项目结构概览（来自 README 的 `src/` 布局）：
  - `src/main/`：Electron 主进程逻辑，包含 PTY 管理、Hive、Hook 服务器、内存、遥测、断路器、文件/Git 桥接等。
  - `src/preload/`：通过 contextBridge 把类型安全的 `window.cth` 暴露给渲染器。
  - `src/renderer/src/`：React 前端，包含 Office Floor、各个面板（Command Center、MemoryPanel、TasksKanban 等）与 Zustand store。
  - `docs/`：官网素材与 Remotion 动画工程。
  - `HIVE.md`、`SPEC.md`、`DESIGN.md`：分别负责多智能体设计、终端/事件平面规范、视觉系统规范。
---
## 上手门槛与部署体验：怎么跑起来？
- 前置条件：
  - macOS、Windows 或 Linux。
  - Node.js 18+ 与 npm；以及 C/C++ 工具链用于 node-pty 的原生模块（macOS 需 Xcode Command Line Tools）。
  - 至少一个支持的 Agent CLI 在 PATH 中（Claude Code 是默认，也支持 agy、codex、grok、kimi、gemini、qwen、opencode、crush、pi、copilot、cursor-agent）。缺失时大部分可由 harness 自动运行安装器并继续。
  - 可选：本地 LLM（Ollama/LM Studio/vLLM）以及语义记忆 CLI（MemPalace）。
- 安装与运行（开发模式）：
  - 克隆并安装依赖（postinstall 会为 Electron ABI 重建 node-pty）：
    ```bash
    git clone https://github.com/chaitanyagiri/munder-difflin.git
    cd munder-difflin
    npm install
    ```
  - 启动开发模式（热重载）：
    ```bash
    npm run dev
    ```
  - 首次启动会有 Onboarding Wizard，完成引导后进入 Floor；点击 Add Agent 生成首个会话，GOD Agent 会自动坐到 Michael 的办公室工位上。
- 其他脚本：
  - `npm run build`：electron-vite 生产构建。
  - `npm run preview`：预览生产构建。
  - `npm run typecheck`：类型检查。
- 官方构建：macOS（已签名与公证）、Windows、Linux 的可安装包在 Releases 页；标题栏徽章支持一键更新与最新版本检查。
- 文档质量：
  - README、HIVE.md、SPEC.md、DESIGN.md 等规范与设计文档齐全，易于理解原理与扩展。
  - 官网博客提供了多篇深度文章与部署教程（例如在 Mac Mini 上跑、使用开放模型等）。
> 简单理解：如果你已经会用 Claude Code 的命令行，再加几行 npm 指令就能进“办公室”；不需要你写很多配置，系统会尝试自愈缺失 CLI。
---
## 社区活跃度与生命力
- Stars/Forks/Issues/PRs：Pulse 页面显示约 4.7k Stars、573 Forks、63 Issues、60 PRs，说明社区关注度与参与度处于活跃区间。
- 发布节奏：CHANGELOG 与 Tags 显示从 2026 年 8 月中下旬起持续发布版本（v0.3.9、v0.3.8、v0.4.0、v0.4.2、v0.4.4-rc.1、v0.4.5），迭代频率较高且包含大量社区 PR（例如 v0.4.5 合并 23 个社区 PR）。
- 社区渠道：README 提供了 Discord 链接，并鼓励在 PR 中附上 Discord ID 以获得“employee of the month”角色，社区互动感较强。
- Issues 状态：Issues 列表存在一定数量（63），但社区有 PR 流支撑，说明问题在积极消化与迭代中。
---
## 竞品/同类对比：它在“Agent Harness”版图里位于什么位置？
- 作为“Harness”的定位：Munder Difflin 不是一个新 Agent Runtime，而是把已有的终端 CLI 包装成多智能体协作层；你可以把它理解为“本地化、可视化、带记忆的 Claude Code（等） Harness”。
- 与云端编排平台对比：相比 LangGraph、AutoGen、OpenAI Swarm 等，Munder Difflin 强调：
  - 本地优先与数据隐私（所有内容在本地 git 与文件系统，密钥 BYOK，可选本地 LLM）。
  - 深度集成终端 CLI 工具链，不用再切换环境。
  - 可视化 Floor 让多 Agent 协作“可见”，对非工程师友好。
- 与其他本地多 Agent/控制台工具对比：
  - 它不是 Docker 一键部署的后台服务，而是 Electron 桌面，开箱即用（前提是满足 Node/工具链与 Agent CLI）；适合个人/小团队，而非 K8s 级基础设施。
- 参考文章：业界对“Harness Engineering”模式的讨论（如 Böckeler 的框架）强调了“模型决定做什么，Harness 决定允许什么”的设计思路，与 Munder Difflin 的 Human gates + 熔断理念相合。
---
## 局限与不足：客观存在的缺点与风险
- 上手门槛不低：需要 Node、C/C++ 工具链、一个或多个终端 Agent CLI 的订阅，对非开发者或纯终端新手不友好。
- macOS 优先，Windows/Linux 支持仍在追赶：文档与历史描述显示 macOS-first；虽然有官方构建与 v0.4.4-rc.1 这样的 Windows 验证构建，但跨平台成熟度可能略逊于 macOS。
- Electron 资源占用：Pixi.js + 多 PTY + xterm.js + 终端流可能带来不小的 CPU/内存占用，多 Agent 高负载下对机器配置有一定要求（尤其是启用语义检索时）。
- 不支持 Docker 一键部署：项目以桌面应用为主，未提供 Docker Compose 等容器化部署方案，对偏爱容器化运维的用户不太适配。
- Bug 与演进期风险：v0.4.5 修复了三个“你曾信任但实际上有错”的问题（成本统计被重置、Apple Silicon 语义检索 NaN、Agent 间邮箱投递不可靠），说明项目在快速迭代中，稳定性仍需时间与用户场景打磨。
- 资源和安全性：
  - SkillsLLM 的安全扫描曾给出若干警告（非关键），但对安全敏感的用户应自审代码与权限模型，特别是 BYOK 密钥与终端执行范围。
  - 资产中包含第三方像素艺术（LimeZu 的 Modern Interiors），其许可要求署名；代码本身为 MIT 开源协议。
---
## 结语与行动建议：我的终极评判
- 综合评价：Munder Difflin 在“本地多智能体Harness”这个细分领域做出了非常独特且深度的产品：既保留了对终端 AI CLI 的真实 PTY 访问，又用 Hive、GOD Agent 与可视化 Floor 赋予了它们协作、记忆与可观测性。它更像一个“本地 AI 公司的控制台”，适合已经在重度使用终端 Agent、希望更高层次编排与管理的用户。
- 值得关注的点：
  - 不重新发明轮子，而是围绕已有的终端 CLI 做中台与可视化。
  - Markdown-first 的记忆与可选语义检索，工程上务实、兼顾性能与隐私。
  - Human gates 与熔断机制对“可控自动化”至关重要，尤其适合生产环境试点。
- 适合的人群与下一步：
  - 如果你已经在用 Claude Code 或同类终端 CLI、且习惯 Node/CLI，建议尝试官方构建优先（体验开箱即用），再根据需要切到源码模式做定制或贡献。
  - 若你是团队或团队负责人，可先从单机、小范围试跑（CI Watcher + Slack/Webhook 入口），验证多 Agent 协作在你们工作流中的价值再扩展。
- 小白建议：
  - 先确保把某一终端 CLI（如 Claude Code）跑顺，再逐步启用 Floor、Memory、Kanban 等模块；不要上来就铺满 Agent，以免认知过载。
  - 利用 Prerequisites 页面让 Michael 帮你装缺的工具，降低前期踩坑成本。
- 核心代码片段与配置示例（最简上手）：开发模式下快速启动
  ```bash
  git clone https://github.com/chaitanyagiri/munder-difflin.git
  cd munder-difflin
  npm install   # postinstall 会为 Electron ABI 重建 node-pty
  npm run dev   # 启动 Electron 应用（热重载）
  ```
  首次启动后进入 Onboarding，完成后在 Floor 上点击“Add agent”即可添加第一个 Agent（如 claude）。
简而言之：如果你已经习惯了与“终端里的 AI”一起工作，并希望把“一个打工人”变成“一整个办公室”且还能看见他们在干嘛、记住了什么、花了多少钱，Munder Difflin 是当前少数能同时满足这些诉求的本地化方案之一，值得关注与试用。
