# anomalyco/opencode

[GitHub URL](https://github.com/anomalyco/opencode)


## OpenCode：开源AI编程代理，终端优先，模型无关

> 一款开源的AI编程代理，主打终端优先、模型无关与隐私友好，支持本地/TUI/GitHub自动化。

- **Tags**: AI Agent, Terminal, OpenSource, Privacy, GitHub Actions
- **Category**: AI编程, 开发工具, GitHub自动化

## Details

<|assistant|>我需要打开 anomalyco/opencode 仓库的 releases 页面，获取最新版本号、更新频率、跨平台构建产物信息，以评估“更新节奏”与“多平台支持”。</think>
# 一句话总结
OpenCode（GitHub: anomalyco/opencode）是一款开源的 AI 编程代理（Agent），主打“终端优先、模型无关、隐私友好”，既可在本地 CLI/TUI 里帮你自动改代码、跑命令、读项目，也能集成 GitHub App 实现评论触发自动修 Bug/提 PR，适合不想被单一厂商锁定、又重视代码隐私的开发者与团队。
---
## 背景与痛点
### 诞生的背景
- 团队源于 Anomaly，也接续了 SST（Serverless Stack）的开源基因，项目在 2025 年快速蹿升，已成为开发者工具领域增长最猛的 OSS 之一：Star 数逼近 20 万、贡献者超过 450 人、MIT 开源协议，活跃度与社区规模都处于头部水平。
- 早期版本曾在 2026 年 1 月披露过两个安全漏洞（CVE-2026-22812、CVE-2026-22813），但官方在短时间内发布补丁，体现了安全响应能力。
- 官方明确表明“本仓库与另一个同名 repo 无关”，避免社区混淆。
### 解决的核心痛点
- “我要干的活怎么还没从脑子到代码？”：过去要不停切 IDE/终端/浏览器查接口、改配置、跑测试。OpenCode 能直接在你熟悉的终端里“读懂项目 + 执行多步任务 + 改文件 + 提交”，大幅缩短“想法—代码”的路径。
- “不想把代码喂给云上闭源助手”：OpenCode 采用客户端/服务器架构，不在官方服务端存储你的代码或上下文（但使用的 LLM 提供商仍可能有自身的数据留存政策），适合受监管环境与离线/内网部署诉求。
- “ Claude Code 很强，但被 Anthropic 锁死”：OpenCode 兼容“类 Claude Code”的工作流，同时支持 75+ 家 LLM 提供商（Anthropic、OpenAI、Google、本地 Ollama 等），不被单一厂商绑定。
- “AI 帮我写代码，但谁来审查它？”：内置“Plan 只读/Build 执行”双模式与权限确认机制，帮你把“看”与“改”隔离开来，降低风险。
---
## 核心亮点与功能剖析
### 1) 终端优先的 TUI 体验与双模式代理
- 打开终端运行 opencode 后，你会进入一个流畅的 TUI，支持 Tab 切换两种内置 Agent：
  - build：默认“全权限”模式，可读写文件、跑 bash 命令，适合日常开发与自动迭代。
  - plan：只读模式，拒绝文件编辑并默认在跑命令前征询你同意，非常适合陌生代码库探索与改动规划。
- 比喻：Plan 就像“只看不做”的审阅顾问；Build 则是“可以动手干活的工程师”。你先用 Plan 看清风险，再切 Build 让它执行。
### 2) 模型无关与多提供商支持
- 不绑定任何一家模型商，支持 75+ 提供商（Anthropic、OpenAI、Google、本地 Ollama 等）。你在配置中即可按需切换，统一一个“指挥台”。
- OpenCode Zen 是官方验证过的模型精选列表，适合不想折腾选型的人先上手。
### 3) 客户端/服务器架构与多端接入
- 设计为 C/S，后端跑在本地或服务器，前端可以是终端 TUI，也可以是桌面应用、IDE 扩展或移动端驱动，实现“同一大脑，多副面孔”。
- 桌面应用处于 Beta，支持 macOS/Windows/Linux 的原生包，提升可视化与团队协作的便利度。
### 4) 与 GitHub 的深度集成（Issue/PR 自动化）
- 官方 GitHub App 配合 GitHub Actions，只需在仓库里配置一条工作流文件，即可实现：
  - 在 Issue/PR 评论里输入 /opencode 或 /oc，触发 Agent 读取上下文、自动修 Bug/提 PR/回复评论。
  - 定时任务（cron）自动审查代码、汇总 TODO 等，自动化质量门禁。
- 所有任务在你自己的 Runner 上跑，代码不离开你的基础设施，符合“在自家地基上干活”的原则。
### 5) 头显级别的版本节奏与社区治理
- Releases 几乎每天迭代（如 v1.18.27 在 2026-08-28 发布，连续多个版本修复与改进）。CHANGELOG 涵盖流式超时重试、多提供商兼容、会话紧凑化、桌面 UI 等细节更新，迭代密度高、维护力度强。
- 每个版本都感谢多名社区贡献者，外部 PR 能持续合入（主要是 bug 修复、新提供商适配、性能优化等）。核心特性走设计评审流程，保证方向一致性。
---
## 目标人群与收益
### 谁最适合用
- 个人开发者/独立黑客：希望把重复的“写样板代码、修老项目、跑测试”变成“说句话就完成”的人。
- 远程/云服务器重度用户：常在 SSH/终端里干活，希望在无 GUI 环境下也能享受 AI Agent 自动化的人。
- 需要严格隐私/合规的团队与公司：要求代码不出自家基础设施、可接入本地/专有模型的组织（金融、医疗、政企等）。
- 已有 GitHub Copilot 订阅的开发者：可以把 Copilot 订阅复用到 OpenCode，不增加额外账号与费用。
- 开源项目维护者：希望用 GitHub 评论/Action 实现“自动分类 Issue/自动 Review/自动提 PR”，降低社区运营成本。
### 能带来的具体收益
- 效率：一键把“需求 → 文件修改 → 测试 → 提交”的闭环自动化，减少切 IDE、查文档、写样板的时间。
- 成本：MIT 开源、可自托管、不锁定单一模型，可根据成本与能力自由选择最合适的 LLM 提供商；还能利用已有的 Copilot 订阅。
- 质量：Plan 模式做“人工审查前的机器审查”，PR 自动审查可强化编码规范与潜在 Bug 提前发现。
- 合规：代码不存储在 OpenCode 服务端、可在内网/离线部署，更符合监管与隐私要求。
---
## 竞品/同类对比
| 维度 | OpenCode（anomalyco/opencode） | Claude Code（Anthropic） | GitHub Copilot（IDE 插件） | 本地 IDE 插件类（Continue、Cursor 等） |
|---|---|---|---|---|
| 开放性 | MIT 开源，可自托管、可二次开发。 | 闭源、厂商锁定 | 闭源、与 GitHub 生态绑定 | 通常开源，但侧重 IDE 内集成 |
| 模型灵活性 | 75+ 提供商，模型无关。 | 仅 Anthropic 家族 | 主要 OpenAI 家族 | 看具体插件，一般多家可选 |
| 使用场景 | 终端 TUI + 桌面 + IDE + GitHub App 自动化 | 终端/IDE 强绑定 | VS/IDE 内补全与聊天 | IDE 内为主 |
| 隐私/合规 | 代码不上传官方服务端；可本地/内网。 | 强依赖云端处理 | 依赖云端处理 | 多数可接本地模型但需自维护 |
| GitHub 集成 | 原生 GitHub App + Actions 自动化（/opencode、/oc）。 | 无官方自动化 | 无官方自动化 | 多数无 |
| 学习成本 | 需要 CLI/终端习惯与模型配置步骤 | 较低（产品导向） | 低（开箱即用） | 中等（IDE 内配置） |
---
## 局限与不足
- 上手门槛：终端 TUI 对 CLI 不熟悉的用户有学习曲线；首次需要配置模型/Provider 或自建本地模型环境。
- 需要自行准备 LLM 费用与密钥：OpenCode 本身免费，但使用模型需对应付费；需要根据用量进行成本控制与限额管理。
- 历史安全记录：2026 年 1 月的两条 CVE（自动启动未认证 HTTP 服务、Markdown 渲染 XSS）提醒我们需要及时更新版本，尤其是暴露在公网/共享环境时。
- issue 量大：开放性带来的副作用是 open issues 数以千计，核心团队更聚焦在主 roadmap，社区贡献需遵循贡献指南（核心功能走设计流程）。
- 本地模型性能门槛：接本地 Ollama 或其他模型时，推理质量与速度高度依赖本地算力与模型选择，不适合期望“开箱即用、零配置”的用户。
---
## 技术栈与架构解析
- 开发语言与框架：TypeScript + Go（后端与部分组件），整体采用现代前端栈 + 高性能终端渲染，终端 UI 体验比传统 ncurses 更顺滑。
- 开发依赖：Bun（运行时与包管理）、Golang 1.24.x；本地开发通过 bun install && bun dev 启动。
- 架构：客户端/服务器模式，后端负责模型交互与工具执行（文件读写、命令执行、外部工具接入等），前端可以是 TUI、桌面或 Web；支持通过环境变量配置 MCP（Model Context Protocol）服务器，实现工具扩展与隔离配置。
- 仓库治理：MIT 协议；核心功能不接受未经设计评审的 PR，但大量社区 PR 聚焦 bug 修复与提供商适配，保持代码质量与迭代节奏。
---
## 上手门槛与部署体验
### 安装方式（多平台）
- 官方一键脚本（YOLO 风格）：
  - curl -fsSL https://opencode.ai/install | bash
- 包管理器：
  - npm：npm i -g opencode-ai@latest（支持 bun/pnpm/yarn）
  - Homebrew（macOS/Linux）：brew install anomalyco/tap/opencode
  - Windows：scoop install opencode 或 choco install opencode
  - Arch：sudo pacman -S opencode 或 paru -S opencode-bin
  - Mise：mise use -g opencode
  - Nix：nix run nixpkgs#opencode 或 github:anomalyco/opencode
- 桌面应用：提供 dmg/exe/deb/rpm/AppImage，支持 brew cask 与 Scoop 安装桌面版（Beta）。
### Docker 使用体验
- 官方镜像：docker run -it --rm ghcr.io/anomalyco/opencode 可快速启动容器进行体验。
- 国内加速：轩辕镜像等提供加速拉取路径，适合云服务器环境快速部署；实践中建议固定版本号以避免 latest 的不稳定性。
### 本地开发与初始化
- 进入项目目录后，首次运行 opencode 并执行 /init，会分析项目结构、在根目录生成 AGENTS.md（建议提交到 Git），帮助 Agent 理解你的项目模式和上下文。
- 使用 /connect 连接并配置 Provider（OpenCode Zen 官方推荐新手先从官方精选模型开始）。
---
## 社区活跃度与生命力
- 规模与趋势：Star 数接近 20 万、月新增数千；贡献者 456+、Open Issues 约 5.2K、Health Score 约 75，表明生态庞大且持续活跃；更新频率每天多次 Release，版本迭代极快。
- 社区互动：Discord 与 X（Twitter）入口，社区围绕 Skills/Commands/Agent 展开，贡献者在安全、提供商适配、UI 细节改进等方面持续提交 PR。
- 生态：Awesome OpenCode 汇总插件、主题、Agent 与项目，官方还提供 JS/Go/Python SDK，便于二次开发与集成。
---
## Demo / 代码示例（极简上手）
### 1) 终端 TUI 快速上手（最小示例）
- 安装：
  - npm i -g opencode-ai@latest
- 配置模型与项目初始化：
  - cd your-project
  - opencode
  - 在 TUI 里执行 /connect → 选择 Provider（例如 OpenCode Zen）→ 粘贴 API Key
  - 执行 /init → 生成 AGENTS.md（提交到 Git）
- 使用提示：
  - “解释这个项目的登录流程” → Agent 会基于文件树与内容给出解读
  - “给用户服务加单元测试” → Agent 在 build 模式下新建/修改文件并运行测试
### 2) GitHub App + Actions 自动化（可直接复用的工作流）
- 在仓库创建 .github/workflows/opencode.yml（示例来自官方中文文档）：
```yaml
name: opencode
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  opencode:
    if: |
      contains(github.event.comment.body, '/oc') ||
      contains(github.event.comment.body, '/opencode')
    runs-on: ubuntu-latest
    permissions:
      id-token: write
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
          persist-credentials: false
      - uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
          # share: true
```
- 安装官方 GitHub App（github.com/apps/opencode-agent），并在仓库 Secrets 中配置模型所需的 API Key；之后在 Issue/PR 评论中输入 /oc 让 OpenCode 自动工作。
### 3) 定时自动审查（每周一早上审查代码）
```yaml
name: Scheduled OpenCode Task
on:
  schedule:
    - cron: "0 9 * * 1" # 每周一 UTC 9:00
jobs:
  opencode:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
      pull-requests: write
      issues: write
    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: false
      - uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
          prompt: |
            Review the codebase for any TODO comments and create a summary.
            If you find issues worth addressing, open an issue to track them.
```
### 4) PR 审查自动示例
```yaml
name: opencode-review
on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
      pull-requests: read
      issues: read
    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: false
      - uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          model: anthropic/claude-sonnet-4-20250514
          use_github_token: true
          prompt: |
            Review this pull request:
            - Check for code quality issues
            - Look for potential bugs
            - Suggest improvements
```
---
## 结语与行动建议
### 终极评判
- OpenCode 在“终端优先 + 模型无关 + 隐私友好 + GitHub 深度集成”的交叉点上，做出了非常务实的工程化落地，适合希望在自有基础设施中构建 AI 编程自动化工作流的团队与个人。
- 其高强度的更新节奏与活跃的社区贡献，使其在兼容新模型与修复问题方面反应很快，但也意味着要保持关注版本更新以获取安全与功能修复。
- 对习惯了 IDE/浏览器流程的小白来说，CLI/TUI 是一道需要克服的门槛；但对服务器重度用户与团队而言，一旦跨过这道坎，带来的效率与合规收益会非常显著。
### 行动建议
- 如果你是个人开发者、习惯终端且愿意折腾模型配置：从 npm/brew 安装开始，先用 /connect + /init 在一个非生产项目里玩起来，感受“Plan vs Build”双模式的工作流差异。
- 如果你是团队决策人/开源维护者：先在仓库试点 GitHub App + Actions 集成，选择一个内部/公开仓库，使用 /oc 触发自动修复与 PR 审查，收集成员反馈后再推广到更多仓库。
- 如果你所在行业对数据敏感：先在内网/自建 Runner 上验证 OpenCode 流程，确保日志与权限管控与组织合规对齐，必要时接入本地模型而非公有云。
- 通用最佳实践：定期升级到最新版本（尤其是有安全补丁时），固定 Release Tag 用于生产环境，避免 latest；以最小权限原则配置 Secrets 与权限。
---
## 参考与延伸
- 仓库主页与 README（anomalyco/opencode）
- 仓库统计与趋势（gstars.dev 数据面板）
- 官方文档（多语言，含 GitHub 集成、安装与配置）
- Releases 与 CHANGELOG（v1.18.27 等近期版本）
- 安全漏洞公告（CVE-2026-22812、CVE-2026-22813）
- 生态汇总（Awesome OpenCode）
- 背景资料（SST 与 Anomaly 团队渊源）
- 第三方实践（Docker 部署与镜像源对比）
