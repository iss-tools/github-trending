# kunchenguid/firstmate

[GitHub URL](https://github.com/kunchenguid/firstmate)


## FirstMate 开源项目深度评测

> FirstMate 是一个以你为船长、以大模型为船员的开源代理发行版，能自动调度多个 AI 船员实现从任务到 PR 的闭环工作流。

- **Tags**: 多代理, 自动化工作流, GitHub, 终端工具, AI 辅助开发
- **Category**: AI 编程, 开发工具, 开源项目

## Details

# firstmate（kunchenguid/firstmate）深度评测
一句话总结：firstmate 是一个“以你为船长、以大模型为船员”的开源“代理发行版（agent distro）”——你只和第一水手（First Mate）对话，它自动在隔离环境里并行调度多个船员（crewmates），把修 bug、调研、审计、加特性等变为“从 PR 到合并”的闭环工作流。
## 背景与痛点：它为何诞生？
- 多代理时代的“标签页地狱”。在终端里跑一个 AI 编程会话不难，但一旦需要多任务并行（修登录测试、做调研、写计划、做审计），你就成了 session-juggler：既要盯多个终端窗口/标签，又要手动在项目间复制上下文，很容易忘掉哪个会话里还有未跑完的测试。
- 缺少“统一调度”和“安全边界”。不少 AI 代理工具直接就写你工作区的文件，缺少隔离和可审计的流程；要么就需要你大量手工编排和上下文注入，难以把“一次请求”变为“一条完成的 PR 路径”。
- 重复而琐碎的“fleet 管理”。要管理不同的后端（tmux/Herdr/Zellij/Orca 等）、多任务状态、等待/唤醒、错误恢复，需要一个在代码层面固化下来的编排层，而不是每次手写脚本去糊。
firstmate 的解法：把“编排、安全边界、状态管理、后端适配、技能体系、任务分片”等能力封装为一个可克隆的目录（一个 agent distro），只要求你拥有一个“已验证的 Harness（终端型 AI 编程客户端）”，便能开箱用上整支 AI 船队。
---
## 核心亮点与功能剖析
### 1) One Liaison：你只和 First Mate 对话
- **你→First Mate**：用自然语言给出需求（例如“修一下登录测试的抖动，再顺手加暗色模式”）。
- **First Mate→Crewmates**：它自动把任务拆解，把子任务分发给不同后端窗口中的船员，每个船员持有自己的 worktree 与执行上下文。
- **结果只回传给你**：你收到的是可审核的 PR、本地合并提案或调研报告，而不是一堆待办的终端会话。
**比喻**：像在舰桥上向大副下命令，大副再传达各舱位；你无需逐个指挥水手。
### 2) A visible crew：全流程可见、可干预的“舰队”
- 每个船员在自己的 tmux 窗口或 Herdr/Zellij/Orca/cmux 终端里干活；你可以随时查看或直接敲键盘干预；First Mate 负责把你的手动干预“收束回”统一状态与决策流程。
- 这解决了“黑盒多代理”无法观测、无法打断、难以审计的问题。
### 3) Disposable worktrees：并行不冲突的“树屋（treehouse）”
- 每个任务运行在干净的 git worktree（treehouse 提供），或 Orca 管理的 worktree，保证对同一仓库的并行修改不会互相踩踏。
- 任务结束（或被取消）后，worktree 被安全拆除，原仓库保持干净。
### 4) Two task shapes：Ship 与 Scout
- **Ship**：以“可落地的改动”为目标，根据项目的“项目模式（no-mistakes/direct-PR/local-only）”产出 PR 或本地合并。
- **Scout**：以“独立调研报告”为目标，在 data/<id>/report.md 形成调研结论与决策清单，用于下一步行动。
- 灵活覆盖“写代码”与“只研究”两种常见场景。
### 5) Explicit project modes：以规则守住“权限边界”
- **no-mistakes**：走本地 no-mistakes 网关，完成评审/测试/lint 后再推送并打开 PR（项目自身贡献流程也使用此管道）。
- **direct-PR**：直推 PR，由你决策是否合并；适合更快节奏的团队工作流。
- **local-only**：仅在本地落地，不走远端 PR，适合本地重构或工具化任务。
- **+yolo**：可选标志，放宽对常规合并决策的“必须确认”，但仍有硬规则边界（见 AGENTS.md 的硬规则）。
### 6) Optional Secondmates：跨机的“副水手”网络
- 可在一台或多台 SSH 可达主机上注册“Secondmate”——每个都拥有独立的 FM_HOME（数据、状态、项目、会话锁）。
- 用于把不同职责/环境/配额的任务分发到不同节点，同时保持统一的路由、状态同步与恢复机制；remote 路由由 guarded SSH 传输与校验，保证安全。
### 7) Event-driven, zero-token supervision：省 token 的“低功耗监工”
- 使用一个 bash watcher 在后台“睡着”，只在有事件（任务状态变更、待决决策等）时才唤醒 First Mate；避免了“持续轮询式对话”带来的 token 烧钱。
- 针对已验证的主 Harness，还提供“turn-end 后备阻断/跟追”，防止对话盲收尾导致任务悬挂。
### 8) Optional Relay：公域提及→同一工作流
- 用本地的 .env 配置一对 token，即可让 First Mate 回复你在 X/Twitter 与 Discord 的公开提及，把可逆请求纳入同一生命周期，并在里程碑与最终结果时发布最多 3 条公开跟进；即使会话重启或历史被压缩，承诺会给出的最终回复会被从磁盘恢复并执行。
- 提供 dry-run 预览，在真正“go-live”前把将要发出的回复与丢弃内容记录在本地审查。
### 9) Strict project boundary & Restart-proof：不乱写、易恢复
- First Mate 对 projects/ 只读，仅通过 AGENTS.md 硬规则 1 所限定的“受守卫的、船长批准”的操作路径执行写操作；具体项目变更由船员在你设定的“合并权限”下完成。
- 状态全在磁盘与活动会话后端持久化；杀掉会话后，下一次启动会自动 reconcile（调和）并继续工作，包括对已确认死亡的 secondmate 的恢复。
---
## 技术栈与架构解析（GitHub 开源项目视角）
- **核心编排层**：AGENTS.md 作为“第一水手”的完整职位说明书，定义了角色边界、硬规则、路由与技能触发；它不是代码，而是“在执行前被代理读取并遵循的指令规范”。
- **脚本体系（Shell 工具带）**：bin/ 目录汇集大量 Bash 脚本，负责启动（fm-session-start.sh）、生成任务元数据（fm-spawn.sh）、后端检测（fm-backend.sh）、状态清理（fm-teardown.sh）、收发消息（fm-send.sh）、状态调和（fm-crew-state.sh）等。这些脚本采用头部注释作为权威使用说明。
- **工作树隔离**：依赖 git worktree；由 treehouse（或 Orca）提供“租约式”工作树，避免并行任务在同一仓库上冲突；任务终止时由 teardown 流程进行清理与校验。
- **后端抽象**：运行时后端可配置为 tmux（默认参考）/Herdr/Zellij/Orca/cmux；spawn 时依次从 --backend → FM_BACKEND → config/backend → 运行时自动检测（$TMUX、HERDR_ENV=1 等）→ 默认 tmux 选择。
- ** Harness 适配层**：通过 .agents/skills/harness-adapters/ 下技能树与 bin/fm-harness.sh/bin/fm-spawn.sh 等完成对不同 Harness（Claude Code、Grok、Pi/pi-signed、Codex、OpenCode、Cursor Agent CLI 等）的检测、launch 与 Hook 安装；部分 Harness 通过安装全局 turn-end hook 或项目级 hooks.json 实现“turn-end 后备阻断/唤醒”。
- **项目模式与验证**：no-mistakes 作为本地 git 代理，推送前在工作树中跑 AI 驱动的 review/test/lint 流水线，并通过 GitHub Actions 的“Require no-mistakes”检查，要求 PR 必须带符合规范的签名与结构化证明。
- **配置与状态管理**：
  - data/：持久化舰队记录（项目/secondmate 注册、船长偏好、学习记录、backlog、brief、scout 报告等）。
  - state/：运行时任务元数据、事件日志、终端结果、 watcher 唤醒队列等。
  - config/：本地操作选择，包括 backend、crew-harness、crew-dispatch.json、secondmate-harness、watched-tools.json、wedge-alarm、voice-read-scope/deny 等。
  - projects/：本地项目克隆，对 First Mate 只读，仅通过受守卫路径进行写操作。
  - 环境变量：FM_HOME、FM_BACKEND、及各后端专用变量（HERDR_SESSION、FM_ZELLIJ_SESSION、CMUX_SOCKET_PASSWORD、FM_SUPERVISOR_BACKEND/TARGET 等）用于覆盖与调优。
- **内置技能与两阶技能布局**：
  - .agents/skills/：FirstMate 内部使用的技能，带 metadata.internal: true，对常规安装器不可见；仅在活 First Mate home 中有意义。
  - skills/：面向安装器的独立技能（如 stow），不依赖 FirstMate 的路径与词汇。
  - 用户可直接调用的技能如 /afk（离线副监督）、/ahoy（事件与决策复盘）、/bearings（状态四段摘要）、/updatefirstmate（自更新）、/stow（知识扫档与老化归档）。
---
## 上手门槛与部署体验
- 前置：
  - 已验证的主 Harness：Claude Code、Grok、Pi/pi-signed、Codex、OpenCode 或 Cursor Agent CLI。
  - Git 与 GitHub CLI（gh），需完成 gh auth login。
  - 所选运行时后端 CLI（默认 tmux；可选 Herdr/Zellij/Orca/cmux）及其依赖（如 jq）。
  - 通用工具链：node、git、gh、no-mistakes（≥1.46.0）、gh-axi、chrome-devtools-axi、lavish-axi、tasks-axi、quota-axi 等；First Mate 会在启动时检测并提示具体安装指令。
- 安装与启动（最简示例）：
  - 克隆仓库并在该目录中打开一个支持的 Harness：
    ```bash
    gh auth login
    git clone https://github.com/kunchenguid/firstmate
    cd firstmate
    pi       # 或 claude/grok/cursor 等
    ```
  - AGENTS.md 会接管后续流程；First Mate 会检测缺失的工具并在你批准后安装。
- 后端选择与配置：
  - 通过 FM_BACKEND 环境变量或 config/backend 文件指定后端（tmux/herdr/zellij/orca/cmux）；不指定则按环境变量自动检测，默认 tmux。
  - 各后端有专门文档（tmux-backend.md、herdr-backend.md、zellij-backend.md、orca-backend.md、cmux-backend.md），包括设置要点与限制。
- 文档与测试：
  - docs/ 提供架构、配置、验证、语音 Relay、wedge 警报、各后端、turn-end 防护等详细说明。
  - 测试用例与运行命令在 CONTRIBUTING.md 有说明（bin/fm-test-run.sh 多种运行模式）。
- 体验要点：
  - 对终端玩家非常友好；但对非 CLI 用户来说，需要先习惯所选 Harness 的使用。
  - 没有图形向导，依赖文档与命令行指引；不过首次启动时工具检测与提示降低了“不知道缺什么”的困惑。
---
## Demo/代码示例：最小可用场景（以 tmux + Pi 为例）
```bash
# 1) 登录 GitHub CLI
gh auth login
# 2) 克隆 firstmate
git clone https://github.com/kunchenguid/firstmate
cd firstmate
# 3) 启动 First Mate（示例：Pi）
#   信任提示选“是”以加载 .pi/ 下的扩展
pi
# 4) 在会话中下达自然语言任务（示例）
ahoy! 请看看我的 GitHub 项目 org/repo，修好那个抖动的登录测试，再加个暗色模式
# 5) First Mate 将检查工具链、在 projects/ 下克隆项目、在 tmux 窗口里生成并管理两个独立船员任务；
#    完成后会类似返回（原文示意）：
# PR ready for review, captain: https://github.com/you/xyz/pull/42  (fix flaky login test - risk: low - CI green)
# 6) 你决定合并
alright merge it
```
要点：你不需要手动开多个会话或复制粘贴上下文；一条自然语言请求 + 一条确认命令即可闭环。
---
## 目标人群与收益：谁最值得用？能带来什么？
- 最适合：
  - 需要并行处理多个任务/多个项目的中高级开发者或技术负责人。
  - 已在终端使用 AI 编程工具（Claude Code/Grok/Pi/Cursor Agent 等），希望把“单会话对话”升级为“多船员舰队调度”的用户。
  - 对 CI/CD、code review、工作树隔离与安全敏感，希望把 AI 参与纳入可审计流程的团队。
- 收益：
  - 效率：多任务并行，一次自然语言请求可带动多个子任务，减少标签页与会话管理开销。
  - 安全：项目只读边界、no-mistakes 流水线、合并必须显式批准等硬规则降低误操作与破坏性变更的风险。
  - 可观测与可干预：每个任务在独立窗口运行，可随时查看/打断；状态持久化与 reconcile 能力让“重启会话≠丢失进度”。
  - 扩展性：Secondmate（跨机节点）、Relay（公域提及）、语音 Relay（可选）等高级能力满足多主机与社交回复需求。
---
## 竞品/同类对比：它处在什么位置？
- 与“单体编码代理/插件”相比：
  - 它不依赖特定的单一 Harness，而是以“distro”方式兼容多个终端型编码客户端，并把“编排”层固化在目录与脚本中；更像“操作系统层”而非“单应用”。
- 与“MCP 服务器/技能市场”相比：
  - 它不是 MCP 服务器，而是一整套编排、状态管理与技能体系；可以把 MCP/外部工具作为“能力单元”接入，但 First Mate 提供的是“舰队级调度”而不是“单项工具调用”。
- 与“全自研多代理框架”相比：
  - First Mate 的可观测性与安全边界更强，但前提是你要接受其“Harness + Bash + Git + tmux/等后端”的技术栈；全自研框架可能在业务定制上更灵活，但要自己实现监督、隔离与恢复机制。
- 独特竞争力：
  - “单一交互面 + 可见船员 + worktree 隔离 + 事件驱动监督 + 可选 Secondmate/Relay + 自带 no-mistakes PR 流水线”的组合，目前在开源生态中并不多见。
---
## 局限与不足：客观存在的权衡与风险
- 门槛：需要 CLI 与所选 Harness 的使用经验；对“只接受图形界面”的用户有一定门槛。
- 复杂度：文档量大、配置项多（后端/secondmate/Relay/voice/wedge-alarm/环境变量），初次通读成本不低；建议先跑默认 tmux + 单主流程，再逐步扩展。
- 依赖链：通用与后端相关的 CLI 工具较多（git/gh/node/jq/no-mistakes/各后端 CLI 等），首次启动需要批量安装或更新。
- 平台与后端限制：部分后端（如 zellij/orca/cmux）仍处于实验性质，Codex App 尚未被接受为运行时后端；Windows 路径与权限也有已知 issue 需留意。 docs 相关页面说明了各后端现状与限制。
- 模型成本与质量：First Mate 本身不是模型；你仍要为所用的 Harness 与模型调用付费；监督虽尽量零 token，但子任务依然消耗 token。
- 不当使用风险：如果把 +yolo 与宽松的合并权限组合不当，仍可能引入意外合并；需要阅读 AGENTS.md 的硬规则与项目模式的语义后再调整姿势。
---
## 社区活跃度与生命力（截至页面观测）
- Star/Fork：约 4.9k Star，1.6k Fork（页面显示）；Issues 387，PR 742，显示较高参与度与活跃度。
- 提交与文档更新：docs/ 与 AGENTS.md 等持续更新，配置文档与各后端说明都有近期维护痕迹。
- Issue 与 PR：从 Issue 列表可见围绕 Windows 路径、监督/状态判定、Relay 等的讨论与修复跟进，说明维护者在响应问题；PR 数量也代表持续贡献与合并活动。
- CI 与治理：GitHub Actions + no-mistakes 管道确保合并质量；CONTRIBUTING.md 要求主分支 PR 必须通过 no-mistakes 与结构化证明，维持了项目自身与贡献质量的高标准。
---
## 结语与行动建议
- 终极评判：firstmate 把“多代理编排”从“概念玩具”落地为“工程可用”的终端工作流，尤其适合习惯 CLI 并已有 AI 编程 Harness 的开发者。它不提供图形化体验，但在可观测、安全边界、并行调度与自更新方面做到了一个完整的“舰队操作系统”雏形。
- 行动建议：
  - 小白（首次接触 CLI AI 编程）：先选一个你最熟悉的 Harness（如 Claude Code/Grok/Cursor），跑通简单的单任务；不要急于启用 Secondmate/Relay 等高级功能。
  - 进阶者（已有多会话管理痛点）：用 tmux 默认后端跑起“多任务并行（Ship + Scout）”工作流，尝试 /ahoy 和 /bearings 两个复盘技能，感受“状态可见”和“决策清单”的价值。
  - 团队/多机场景：阅读 remote-secondmates.md 与 no-mistakes 文档，评估是否用 Secondmate 把不同环境/配额的任务分流，并把 PR 流水线对齐到团队 CI。
## 推荐阅读顺序（快速上手）
- README：看“Quick Start”与“How It Works”与“Built-in skills”三节。
- AGENTS.md：理解“第一水手”的职责、硬规则与布局；这决定了你能安全地让它做什么。
- docs/configuration.md：掌握 FM_HOME、config/、data/、state/ 与环境变量；这是“正确调参”的基础。
- docs/tmux-backend.md（或你选的后端文档）：确保你选的后端满足版本与前置要求。
> 备注：本评测基于仓库当前文档与可见页面内容编写，功能与状态可能随版本更新而变化；建议在生产使用前先在隔离环境中验证并关注 docs/ 与变更日志。
