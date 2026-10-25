# JetBrains/thinkrail

[GitHub URL](https://github.com/JetBrains/thinkrail)


## JetBrains ThinkRail 深度评测：为多智能体并行而生的开源 AI IDE

> JetBrains 开源的 Agentic IDE，用 Git Worktree 隔离多智能体并行干活，用 Spec Graph 给项目装上'记忆地图'。

- **Tags**: JetBrains, AI IDE, 多智能体, Git Worktree, 开源
- **Category**: 开发工具, AI 编程, 开源项目

## Details

# JetBrains ThinkRail 深度评测：当"老牌 IDE 巨头"遇上"Vibe Coding 新物种"
> **一句话总结**：ThinkRail 是 JetBrains InnovationHub 孵化的一款 Apache-2.0 开源 **Agentic IDE**——它把"AI 编码智能体"当作一等公民，而不是插件；底层跑的是当下火出圈的 `pi` 编码智能体，核心创意是用 **Git Worktree 当沙箱、用 Spec Graph 当"项目活地图"**，让智能体真正"懂你的项目"而不是每次都从零开始猜。如果你已经厌倦了在 Cursor / Windsurf 里反复粘贴上下文，这款产品值得你花 10 分钟装一下。
| 项目速览 | 数据 |
|---|---|
| 仓库 | `JetBrains/thinkrail` |
| 官网 | thinkrail.ai |
| 许可证 | Apache-2.0（可商用） |
| 出品方 | JetBrains InnovationHub（非 IntelliJ 主线团队） |
| 当前版本 | 稳定 v0.2.0 / Nightly 0.3.0-nightly.6（更新极频繁） |
| 平台 | macOS Apple Silicon / Linux x64+ARM64 / Windows x64（**无 Intel Mac 预编译**） |
| 形态 | 桌面安装包 + CLI 启动浏览器 UI，双形态 |
| 底层引擎 | 仅 `pi`（Earendil Works 出品） |
| 社区热度 | 曾登 GitHub Trending、被多份 awesome 清单收录 |
---
## 一、背景与痛点：为什么 JetBrains 要"另起炉灶"
要理解 ThinkRail，得先看清它对准的三个痛点。
**痛点 1：现有 AI IDE 把 Agent 当"增强补丁"，而不是"核心居民"。**
Cursor、Windsurf 本质上都是 VS Code 分叉再加一层 AI。聊天窗塞在侧栏，Agent 的每次会话都要重新理解代码库，跑完一轮任务你的工作目录就被改得面目全非——**多个智能体并行？基本上想都别想**。JetBrains 官方 README 里那句 slogan 一针见血："Agents deserve worktrees, not your working tree"（智能体该用 worktree，而不是污染你的工作区）。
**痛点 2：项目上下文无法沉淀。**
每次开新会话，你都得告诉 Agent"我们用 React 19 + Bun + Tailwind v4，目录长这样……"。这种"金鱼记忆"是当下 vibe coding 最大的内耗。
**痛点 3：JetBrains 自己也焦虑。**
面对 Cursor、Claude Code、OpenAI Codex 的攻势，JetBrains 既有 Junie（主线 AI 助手）和 JetBrains Context（仓库语义索引层），又在 InnovationHub 里孵化了 ThinkRail 这种**激进实验品**——后者不背 IntelliJ 兼容性包袱，可以从零设计"Agent 优先"的 IDE。
至于为什么选 `pi` 当引擎：`pi` 是 Mario Zechner（libGDX 作者）写的极简 Agent 框架，2026 年 5 月迁到 Earendil Works 旗下，因 OpenClaw 走红，被 Armin Ronacher（Flask 作者）公开盛赞为"我几乎 exclusively 在用的编码智能体"。它支持 15+ 模型供应商（Anthropic、OpenAI、Google、Bedrock、Groq、Ollama…），并且**故意不做子智能体和计划模式**——把"自定义"的余地留给宿主，这正是 JetBrains 想要的"薄宿主 + 强引擎"分工。
---
## 二、核心亮点与架构拆解
### 1. Workspace = Git Worktree：给每个 Agent 一间"流动办公室"
这是 ThinkRail 最杀手级的设计。
打个比方：**Worktree 就像给每个智能体分配了一间带独立门禁的"流动办公室"**——他们都能看到公司图纸（共享同一份仓库历史），但各自在工作台上的涂鸦互不可见，最后只有被你签字认可的那份方案才会"搬回"主楼（合并到 main）。
```
~/code/my-repo                          ← 主项目
└─ ~/.thinkrail/worktrees/
   ├─ workspace-1   ⎇ feature/auth      Agent A 在写登录
   ├─ workspace-2   ⎇ fix/flaky-test    Agent B 在修不稳定的测试
   └─ workspace-3   ⎇ spike/ideas       你自己在脑暴
```
每个 workspace 自带独立分支、独立 cwd、独立 diff、独立终端、独立会话。这意味着你可以**同时放三个 Agent 干三件完全不相干的事**，互不踩脚——这是 Cursor / Windsurf 目前做不到的。
### 2. Spec Graph：让项目拥有一张"活的地图"
如果说 Worktree 解决了"并行"，那 Spec Graph 解决的就是"记忆"。
想象你的项目里有一张**活地图**：顶层是"项目目标与需求"，往下分叉出"架构设计"，再往下是每个模块的 `SPEC.md`——用 Markdown + Frontmatter 写成，跟代码一起走 Git 版本管理。
```yaml
---
id: module-server
type: module-design
status: active
parent: architecture
---
```
ThinkRail 内置了一个 `pi-spec-graph` 扩展，给 Agent 提供 `spec_*` 系列工具——它可以**主动去搜索、读取、甚至维护这张地图**。这跟社区流行的"Spec-Driven Development"（SDD）理念高度契合：与其每次徒手贴上下文，不如把项目"是什么、为什么、怎么做"写进结构化文档，让 Agent 自己去查。
**关键洞察**：ThinkRail 自己就是用这套方法开发的——仓库根目录的 `goal-and-requirements.md` 和 `architecture.md` 就是它的"宪法"，每个模块的 `SPEC.md` 与代码同 PR 更新。这种"吃自家狗粮"的坦诚在开源项目里相当难得。
### 3. 三环架构：薄宿主 + 强引擎的工程范本
ThinkRail 的代码组织极其克制，三环分工清晰：
| 层 | 位置 | 职责 |
|---|---|---|
| **引擎宿主** | `packages/server` | `Bun.serve` 起 HTTP+WS，每个 Tab 跑一个 in-process `pi` 会话 |
| **通信协议** | `packages/contracts` | 纯 TypeScript 类型定义，前后端唯一契约 |
| **UI 客户端** | `apps/web` | React 19 + Zustand + Tailwind v4，移动优先，可独立部署 |
最巧妙的一点：**`apps/web` 只依赖 `contracts`，从不依赖 server**。这意味着 UI 可以独立发布——你甚至可以在手机浏览器上打开 IDE，让本机的 Agent 继续干活（这就是他们主打"mobile-first"的原因）。
至于 `pi` 引擎与 ThinkRail 的分工，官方表述非常清楚：**pi 拥有模型、技能、压缩、成本、会话状态；App 拥有工作区、编辑器和通信协议——App 永远不会在背后偷偷拼装 Prompt**。这种"不藏私"的设计对高级用户非常友好。
### 4. 一套 UI，两种形态：桌面 + 浏览器
- **桌面版**：基于 Electrobun 打包的原生安装器（注意：不是 Electron，是 Zed 团队出来做的新东西，包体更小）
- **CLI 版**：一行命令装好后，跑 `thinkrail` 直接在浏览器里打开同一个 IDE
第二种形态被严重低估——它意味着**你可以把宿主跑在一台有 GPU 的远程服务器上，然后在任何轻薄本/平板/iPad 上通过浏览器访问**，本地只承担 UI 渲染。对 M1 MacBook Air 用户或公司受限内网开发者，这是绕过算力瓶颈的捷径。
### 5. 编辑器体验：把 VS Code 的精华"借"来了
Monaco（VS Code 同款编辑器内核）做代码编辑、实时 Git diff、真 PTY 终端（Agent 打字时你也能自己跑测试）、Markdown 渲染带源码切换……该有的都有，没有为了"轻量"牺牲关键能力。
---
## 三、上手体验：从零到第一个 Agent 任务
### 三步启动（推荐先用 CLI 版感受一下）
```bash
# macOS / Linux / WSL
curl -fsSL https://raw.githubusercontent.com/JetBrains/thinkrail/main/install.sh | bash
# Windows (PowerShell)
irm https://raw.githubusercontent.com/JetBrains/thinkrail/main/install.ps1 | iex
# 打开任意 git 仓库
thinkrail ~/code/my-repo
```
装完浏览器会自动弹出一个 IDE 界面。**前置条件只有两个**：`git` 在 PATH 上 + 一个已认证的 `pi` 模型供应商（API key 即可）。
### 想贡献代码或自己构建？
```bash
git clone https://github.com/JetBrains/thinkrail
cd thinkrail
bun install     # 需要 Bun 1.4.0
bun run dev     # 同时启动 host 和 web client
```
类型检查 / lint / 单元测试 / Playwright E2E 一应俱全，工程化程度在 AI 类开源项目里属于**第一梯队**。
### 给 Agent 派活的典型 Prompt
打开一个 workspace 后，你可以直接在聊天框说：
> "读一下 `goal-and-requirements.md` 和 `architecture.md`，然后实现 specs 里描述的『用户偏好设置』模块。"
如果项目里有 Spec Graph，Agent 会自己用 `spec_search` / `spec_read` 工具定位上下文，而不是逼你手动贴文件。
---
## 四、目标人群与收益
| 你是谁 | 你能得到什么 |
|---|---|
| **并行多 Agent 重度玩家** | Worktree 隔离是刚需，目前几乎没有像样的替代品 |
| **长期维护大型仓库的工程师** | Spec Graph 让上下文"沉淀"下来，新会话不用从零喂 |
| **想自托管 / 离线 / 内网使用** | CLI + 浏览器模式 + BYOM，数据不出本机 |
| **想研究 AI IDE 架构的开发者** | 三环架构 + 类型化协议是极佳的学习范本 |
| **pi 生态已有用户** | 现有 pi 配置、技能、权限无缝继承 |
| **纯小白 / 偶尔 vibe coding** | Spec-first 思维有学习曲线，可能 Cursor 更顺手 |
| **JetBrains 全家桶重度用户** | 没有 IntelliJ 的索引、重构、Spring 助推——别抱幻想 |
---
## 五、竞品对比：它究竟站在哪里
> Star 数、版本号等信息具有时效性，下表为定性对比，请以官网实时数据为准。
| 维度 | **ThinkRail** | **Cursor** | **Windsurf** | **Claude Code** | **IntelliJ + Junie** |
|---|---|---|---|---|---|
| 形态 | 独立 Agentic IDE（桌面+浏览器） | VS Code 分叉桌面应用 | VS Code 分叉桌面应用 | 终端原生 CLI | 传统 IDE + 插件 |
| 底层 Agent | 仅 `pi`（可换 15+ 模型供应商） | 自研 Composer + 多模型 | 自研 Cascade | Claude 系 | Junie + 多模型 |
| 多 Agent 并行 | ✅ Worktree 原生隔离 | ⚠️ 有限支持 | ⚠️ 有限支持 | ⚠️ 需手动开多终端 | ❌ |
| 项目上下文沉淀 | ✅ Spec Graph | Memories/规则 | Memories | CLAUDE.md | 项目索引 |
| 移动端访问 | ✅ 浏览器 UI，mobile-first | ❌ | ❌ | SSH 终端 | ❌（Remote Dev 除外） |
| 开源 | ✅ Apache-2.0 | ❌ | ❌ | ❌（客户端闭源） | ❌ |
| 商业模式 | 完全免费，模型费自付 | $20/月起 | $15/月起 | API 或订阅 | 订阅 + AI 信用点 |
| 代码智能（重构/索引） | ⚠️ Monaco 级别（无语义索引） | ✅ 强 | ✅ 强 | ⚠️ 中 | ✅✅ 最强 |
| 学习曲线 | 中等（Spec-first 需适应） | 低 | 低 | 中 | 低（对老用户） |
**一句话定位**：Cursor/Windsurf 在做"更聪明的 VS Code"，Claude Code 在做"更聪明的终端"，而 ThinkRail 在做**"为多 Agent 协作而重新发明的 IDE"**——它赌的是未来工作流是"人 + 多个 Agent 并行"，而不是"人 + 一个很聪明的 Agent 串行"。
---
## 六、局限与不足：把它劝退前必看
客观说，这是一款**0.x 阶段的产品**，毛病不少，以下每一条都可能劝退特定人群：
1. **macOS Intel 用户直接出局**。Electrobun 2.0.1 不提供 Intel 桌面构建，要么用 Apple Silicon，要么源码编译。
2. **macOS CLI 已签名但未公证**，早期 DMG 可能被 Gatekeeper 拦截，需要手动放行。
3. **Linux 桌面版门槛不低**：要求 glibc 2.38+（基本等价于 Ubuntu 24.04+），还要装一串 GTK/WebKit 依赖。
4. **基础遥测无法关闭**。启动事件、模型目录、认证类别等会持续上报到 PostHog EU，`--no-analytics` 只能屏蔽"额外"事件。官方明确说不收集 Prompt、代码、文件路径、凭据，但**"关不掉"**这一点在隐私敏感场景（金融、医疗、内网）仍然是个减分项。
5. **引擎锁死为 `pi`**。不能像 VS Code 插件生态那样接 Claude Agent、OpenAI Codex。如果你是 Claude Code 重度用户，得评估迁移成本。pi 本身刻意不做 sub-agents / plan mode，需要这些能力的用户会觉得"光"。
6. **代码智能远不如 IntelliJ**。没有语义索引、没有 Spring/JPA 助推、没有安全重构——这是 JetBrains 自己做的产品，却**故意不做** IntelliJ 的看家本领，原因很简单：那是另一条产品线的事。如果你依赖 IntelliJ 的深层代码理解，ThinkRail 当主力会很难受。
7. **Spec-first 有学习成本**。你得愿意花时间维护 `SPEC.md`，否则 Spec Graph 就是个空架子。对"临时改两行代码"的场景，这套流程是负资产。
8. **项目尚年轻**。虽然 Issue 处理活跃（open 158 个，关闭也在高速进行），Nightly 几乎天更，但生态（第三方扩展、技能市场）尚未成型，遇冷门坑可能要自己读源码。
9. **与 JetBrains 主线关系尚不明确**。它不是 IntelliJ 插件，也不会接入你的 PyCharm 项目；Junie、JetBrains Context 是另一拨产品。是否长期投入、会不会整合，官方还没给出明确路线图。
---
## 七、结语与行动建议：终极评判
> **一句话定性**：ThinkRail 是 2026 年最值得"围观并小试"的 AI IDE 实验之一——它未必能立刻取代你的 Cursor，但它把"多 Agent 并行 + 项目知识沉淀"这两个 tomorrow's problem 提前做成了 today's UX，值得每一个关注 AI 编码范式的人亲手摸一遍。
**评分（个人主观，10 分制）**：
- 理念前瞻性：**9.5**
- 工程质量：**8.5**
- 上手友好度：**6.5**
- 生产可用性：**7**（对个人项目）/ **5**（对企业关键项目）
- 综合推荐度：**7.5**——值得试，不建议 all-in
**给你的三步行动清单**：
1. **今天就做**：用一行 curl 命令装个 CLI 版，挑一个**非生产**的 hobby 项目跑 30 分钟，重点体验"开三个 workspace 并行派活"的感觉——这一刻你就懂它和 Cursor 的本质区别了。
2. **本周做**：在一个自己最熟悉的中型仓库里，试着写 3~5 份 `SPEC.md`，让 Agent 用 `spec_*` 工具完成一个 feature。**只有走过这一步，你才能客观评价 Spec-Driven 到底是噱头还是生产力**。
3. **本月做**：把它加进你的"季度轮换清单"——每 1~2 个月回来看一眼 Release Notes 和 Spec Graph 的演进。这类新生范式产品，**真正的价值往往在 6~12 个月后才显形**，提前埋个观察点，比跟风切换工具更划算。
最后一句忠告：**别因为它是 JetBrains 出的就默认它是"IntelliJ 的小兄弟"**——它更像 JetBrains 内部一支小团队对着未来扣下的扳机。子弹能不能上膛，要靠你这样的早期用户一起帮它验出来。
