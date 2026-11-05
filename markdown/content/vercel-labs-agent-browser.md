# vercel-labs/agent-browser

[GitHub URL](https://github.com/vercel-labs/agent-browser)


## Vercel Agent-Browser 深度评测：让 AI Agent 省 80% Token 的浏览器自动化神器

> Vercel 用 Rust 打造的 CLI 工具，让 Claude Code 等 AI Agent 高效操控浏览器，Token 消耗直降 80% 以上。

- **Tags**: Vercel, AI Agent, 浏览器自动化, Rust, Claude Code
- **Category**: 开发工具, AI 编程, 浏览器自动化

## Details

# Vercel Agent-Browser 深度评测：把"浏览器"塞进 AI Agent 命令行里的 43k-Star 新星
---
## 一句话总结
**Agent-Browser 是 Vercel Labs 用 Rust 写的一个轻量 CLI，专门为 AI Agent（Claude Code、Cursor、Codex 等）设计的"浏览器方向盘"——它用一个反直觉的"少即是多"设计，把浏览器自动化的 token 消耗砍掉 80% 以上，是 2026 年 coding agent 生态里最值得装的一把"瑞士军刀"。**
---
## 背景与痛点：为什么这么个项目能一夜爆红
要理解 agent-browser 为什么火（GitHub 上 **43.9k stars、3k forks**，在 Vercel Labs 的仓库里位列第一），得先理解 2025–2026 年所有 coding agent 都卡在同一个坑里。
### 痛点：AI 写完了代码，谁去验证？
Pulumi 工程师在一篇著名博客里把这个困境描述得很到位：当 AI agent 帮你写完一个 dashboard，它说"完成了"，但你不敢信，必须自己打开浏览器点一圈。**没有浏览器自动化，AI 写得越多，人越累**——因为最后的"验证环节"永远要人来兜底。
### 真正的痛点：token 烧得比油还快
把 Playwright MCP 这种传统方案接到 Claude Code 里，你会立刻撞上另一个墙：**context window 爆炸**。GitHub Issue #889 记录了 Playwright MCP 在 0.0.30 → 0.0.32 之间 token 消耗暴涨 6 倍；有用户反馈单张截图就吃掉 **15,000+ tokens**，5 小时的 token 配额几次点击就被烧光。
为什么会这样？传统方案的思路是"给 AI 看完整的世界"——每一步都返回完整的 DOM 树、完整的可访问性树、每一条 console log。**信息丰富 = 决策准确**，听起来没毛病，但代价是 AI 的注意力被垃圾信息淹没。
### Vercel 的"反直觉"哲学：少即是多
Vercel 在做 D0 text-to-SQL agent 时发现了同样的规律：17 个专用工具 → 80% 成功率、274 秒、10 万 tokens；砍到只剩 2 个通用工具 → **100% 成功率、77 秒、6 万 tokens**。结论是："我们之所以限制推理，是因为不相信模型能推理。"
Agent-Browser 就是这套哲学在浏览器自动化上的彻底落地。
---
## 核心亮点与技术架构：Rust + Refs 的双引擎
### 架构拆解：客户端-守护进程分离
很多人第一次看 agent-browser 以为它只是个"套壳的 Playwright CLI"，其实它的架构相当干净：
```
┌─────────────┐         ┌──────────────────┐         ┌─────────┐
│  Rust CLI   │ ──IPC──▶│  Rust Daemon     │──CDP───▶│ Chrome  │
│ (无状态)    │         │ (常驻、管理会话)  │         │ for T.  │
└─────────────┘         └──────────────────┘         └─────────┘
```
关键设计点：**热路径上没有 Node 进程**。CLI 本身是原生 Rust 二进制，daemon 也是纯 Rust，直接通过 Chrome DevTools Protocol（CDP）和 Chrome 通信，跳过了 Playwright/Puppeteer 那一整层 Node 桥接。每次命令启动开销在毫秒级，而 Node 方案要冷启动一个 V8 进程。
Daemon 在第一次命令时自动启动，浏览器在多次命令之间**保持打开**——这意味着 agent 不必每条命令都重新开浏览器，登录态、cookie、滚动位置都自然保留。默认 1 小时空闲后自动关停，可用 `--idle-timeout` 调整。
### 灵魂设计：Snapshot + Ref 系统
这是整个项目最值得单独拿出来讲的东西。它的核心抽象只有两个：
**第一步，`snapshot` 把页面压缩成带 ref 的极简文本：**
```
$ agent-browser snapshot -i
- link "S Snip.ly" [ref=e1]
- link "Home" [ref=e2]
- link "Dashboard" [ref=e3]
- button "Shorten URL" [ref=e9]
- textbox "Paste your long URL here..." [ref=e8]
```
Pulumi 的实测：**同一个页面，Playwright MCP 返回 8,247 字符，agent-browser 返回 280 字符**。
**第二步，agent 用 ref 操作元素，返回超短确认：**
```
$ agent-browser fill @e8 "https://example.com/test"
✓ Done
$ agent-browser click @e9
✓ Done
```
每次确认只有 6 个字符，而 Playwright MCP 每次点击后会回吐整页状态（12,891 字符）。
### "Ralph Wiggum Loop" 实测：82.5% 的上下文缩减
Pulumi 在一个真实项目（部署在 AWS 的 URL 短链服务 + Analytics dashboard）上跑了同一套 6 个 E2E 测试，结果如下：
| 指标 | Playwright MCP | Agent-Browser |
|---|---|---|
| 同页快照体积 | 8,247 字符 | 280 字符 |
| 单次点击确认 | 12,891 字符 | 6 字符 |
| **整体上下文消耗** | — | **↓ 82.5%** |
dev.to 上另一份独立测试给出的对比更激进：**agent-browser 的 token 效率约为 Playwright MCP 的 5.7 倍**。
### 50+ 命令的"全家桶"
千万别被"轻量"两个字骗了，它的命令表覆盖度非常夸张，分了 11 大类：
| 类别 | 代表命令 |
|---|---|
| 导航与读取 | `open`、`snapshot`、`read`、`get`、`is` |
| 交互 | `click`、`fill`、`type`、`hover`、`drag`、`upload`、`find` |
| 等待 | `wait`（支持 `networkidle`、`selector`、`text`） |
| 截取 | `screenshot`、`pdf`、`record`、`diff` |
| 网络与状态 | `cookies`、`storage`、`network route`（可 mock 请求）、`eval` |
| 调试与性能 | `console`、`errors`、`trace`、`profiler`、`vitals`、`react` |
| 会话与鉴权 | `session`、`auth vault`、`profiles`、`confirm/deny` |
| Agent 集成 | `skills`、`mcp`、`chat`、`batch` |
几个特别值得点名的：`network route` 可以拦截和 mock 请求（做单测很有用）；`react tree` 能检查 React 应用的组件树；`vitals` 直接抓 Web Vitals 指标；`auth vault` 提供加密的凭据存储；`batch` 把多条命令塞进一次调用，进一步压缩开销。
### 多引擎与云浏览器支持
默认用 Chrome for Testing，但你可以：
- **`--cdp` / `--auto-connect`**：附身到你正在跑的真实 Chrome（继承登录态、扩展）
- **`--engine lightpanda`** 或 **`obscura`**：切换其他引擎
- **iOS Simulator**：驱动 Mobile Safari
- **云端 Provider**：Browserbase、Browserless、Browser Use、Kernel、AgentCore 一键接入
Vercel 自己也在推"Agent Marketplace"，把 Browserbase 这类云浏览器塞进 Vercel Sandbox 里跑，长连接 + 有状态会话的场景特别顺。
---
## 真实上手体验：从零到自动化的 5 行命令
这部分是给读者的"直接收益"——你装完之后照着敲就行。
### 安装（三种姿势）
```bash
# 推荐：npm 全局装（自动选对应平台二进制）
npm install -g agent-browser
agent-browser install        # 第一次下载 Chrome for Testing
# macOS 也可以
brew install agent-browser
agent-browser install
# 懒人版：不安装直接试
npx agent-browser open example.com
```
原生二进制覆盖 macOS（ARM64/x64）、Linux（ARM64/x64，glibc 和 musl 双版本）、Windows（x64），**没有 Python 依赖，没有 Node 运行时依赖**。
### 接入 Claude Code / Cursor / Codex
最优雅的方式是用 Vercel 自家的 skills 工具：
```bash
npx skills add vercel-labs/agent-browser
```
它会在 `.claude/skills/` 下装一个**极薄的 stub skill**——只告诉 agent 一句话："用 agent-browser 时先跑 `agent-browser skills get core`"。这样 skill 的指令永远和 CLI 版本同步，不会出现 skill 写的命令在新版本里不存在的问题。
或者更暴力一点，在 `AGENTS.md` 里加两行：
```
Use `agent-browser` for browser automation. Before the first use, run
`agent-browser skills get core` and follow it.
```
如果你的 agent 是 MCP-only（比如某些沙箱客户端不让跑 shell），还有兜底方案：
```bash
agent-browser mcp      # 启动一个 stdio MCP server
```
### 一个最小可跑的自动化流
```bash
# 1. 打开页面
agent-browser open https://github.com/login
# 2. 看一眼页面结构
agent-browser snapshot -i
# - textbox "Username" [ref=e7]
# - textbox "Password" [ref=e12]
# - button "Sign in"   [ref=e15]
# 3. 操作
agent-browser fill @e7 "your-name"
agent-browser fill @e12 "your-password"
agent-browser click @e15
# 4. 验证结果
agent-browser get url
agent-browser screenshot /tmp/logged-in.png
# 5. 关掉
agent-browser close
```
整个流程的 token 开销在几百 token 量级。**这就是 agent-browser 最让人爽的地方：你看完这个例子，就已经会用它了。**
---
## 目标人群与收益
### 谁必须装
1. **Claude Code / Cursor / Codex / Windsurf / Copilot 的重度用户**：只要你的 agent 经常要写前端、调 API、做 E2E 测试，这个工具能直接把你的 token 账单砍半。
2. **自验证 agent 工作流的实践者**：像 Pulumi 博客里的"Ralph Wiggum Loop"——agent 写代码 → 自己开浏览器测 → 失败自己改 → 通过再交付。Agent-browser 是这条流水线的最关键一环。
3. **构建多 agent 并行系统的工程师**：`--session agent1` / `--session agent2` 给每个并发 agent 独立的 cookie 和 storage，session 隔离成本几乎为零。
4. **轻量级数据采集 / 表单自动化需求方**：不需要写 Python 脚本、不需要装 Playwright，几行 shell 命令搞定。
### 收益量化
- **Token 成本**：实测降 80%–93%，意味着同一个 Claude 订阅能跑 5–10 倍的自动化步骤。
- **响应速度**：原生 Rust 启动 + 常驻 daemon + `batch` 命令，单步延迟降到亚秒级。
- **心智负担**：refs 系统让 agent 不用纠结 CSS 选择器或 XPath，"看到什么点什么"，幻觉率明显低于"看 DOM 猜选择器"的模式。
---
## 竞品对比：Agent-Browser 处在什么位置
2026 年初这个赛道已经卷起来了，至少有 5 个工具在抢同一块蛋糕。下表是一个综合维度对比：
| 维度 | **Agent-Browser** | Browser-use | Playwright CLI | Playwright MCP | DevTools MCP |
|---|---|---|---|---|---|
| 开发者 | Vercel Labs | Browser-use 团队 | Microsoft | Microsoft | Google |
| 实现语言 | **纯 Rust** | Python | Node (Playwright) | Node | Node |
| 集成方式 | Shell CLI / Skill / MCP | Bash CLI / Skill | Shell CLI / Skill | MCP Server | MCP Server |
| Token 效率 | **极低（↓80–93%）** | 极低 | 极低（↓75–99%） | 高 | 中 |
| 浏览器支持 | Chrome（可切换引擎）| Chromium / 真实 Chrome / 云 | Chromium / Firefox / WebKit | 全三家 | 仅 Chrome |
| 真实 Chrome Profile | ✅ `--cdp` | ✅ `-b real` | ✅ | ✅ | ✅ |
| 云端并行 | 通过 Browserbase 等 | ✅ 原生支持 | ❌ | ❌ | ❌ |
| Trace 证据 | 截图 / 视频流 | 截图 | **完整 Playwright Trace** | Trace | DevTools |
| 启动速度 | **最快（原生二进制）** | 慢（Python） | 中等 | 慢 | 慢 |
| Session 隔离 | ✅ `--session` | ✅ | ✅ | 部分支持 | 部分 |
| MCP 兜底 | ✅ `agent-browser mcp` | ❌ | 需另装 | 原生 | 原生 |
### 怎么选
- **追求最快 loop、只在 Chrome 跑、 Claude Code / Cursor 主战场** → **Agent-Browser**
- **需要 Firefox / WebKit 跨浏览器、或团队已在 Playwright 生态里** → Playwright CLI
- **要云端并行爬多个站点、真实 Chrome profile、Python 脚本联动** → Browser-use
- **你的 agent 只能用 MCP（沙箱环境）** → Playwright MCP / DevTools MCP（或者用 agent-browser 的 `mcp` 模式兜底）
- **反爬严重、需要代理和数据中心 IP** → Bright Data Browser API 这类专门做反检测的方案
---
## 局限与不足：诚实的部分
### 1. 浏览器覆盖面窄
默认只有 Chrome（Chrome for Testing）。虽然能 `--engine` 切换 Lightpanda / Obscura，但**没法像 Playwright 那样一键跑 Firefox 或 WebKit**。如果你的 E2E 测试要求三浏览器矩阵，agent-browser 不是答案。
### 2. 项目很年轻，API 仍在抖动
v0.39 已经发了 130 个版本，最近几乎每两天一个 patch。Release notes 里能看到大量"fix xxx to do yyy instead"的语义调整，意味着**生产锁定版本要谨慎**，建议在 `package.json` 里 pin 死版本，升级前读 changelog。
### 3. 强依赖 shell 访问权
整个设计前提是 agent 能跑 shell 命令。如果你的 agent 跑在严格的沙箱里（比如某些 Web 端 chat 界面），只能走 MCP 兜底，但那样就丢掉了 token 效率的最大优势。
### 4. Ref 的时效性陷阱
README 里明确警告：**refs 描述的是 snapshot 那一刻的页面**。一旦发生导航或 DOM 变更，旧的 `@e1` 可能指向别的元素，必须重新 snapshot。这在实际使用里是 agent 容易踩的坑——尤其是 SPA 页面点击后局部更新，agent 如果偷懒不重新 snapshot 就可能点错。
### 5. 复杂 SPA 的边界场景
Snapshot 输出的是可访问性树，**视觉信息被刻意丢弃**。对于靠 Canvas、复杂 CSS 布局、或者依赖视觉反馈（拖拽、图形编辑器）的页面，agent 光看文字 snapshot 不够，得配合 `screenshot` 才能决策——但截图又是 token 大头，抵消了一部分优势。
### 6. 命令行心智 vs 声明式心智
50+ 命令的学习曲线不算陡，但也不是"零成本"。新手 agent 在没有 skill 引导的情况下，可能会瞎猜命令名。好在官方通过 `agent-browser skills get core` 把最佳实践塞进 agent 上下文，基本能解决。
---
## 结语与行动建议
**Agent-Browser 不是又一个 Playwright，而是一次针对 AI Agent 时代浏览器自动化范式的重新设计。** 它赌的是一件事：未来 agent 跑浏览器的瓶颈不是"功能够不够多"，而是"context 够不够省"。从 43k stars、Vercel Labs 的资源倾斜、以及它在 Claude Code 生态里被默认推荐的态势来看，这个赌注目前是押对了。
### 给不同角色的具体建议
- **个人开发者 / 独立 agent 玩家**：今晚就装上。`npm install -g agent-browser && agent-browser install`，5 分钟接入 Claude Code，你立刻能感受到 token 消耗的差异。
- **团队工程负责人**：建议在 CI 里做 A/B 测试——同一组 E2E 用例分别用 Playwright CLI 和 agent-browser 跑一周，量化 token 成本和稳定性再做技术选型。
- **生产环境部署**：用 `package.json` pin 死版本，订阅 GitHub Releases 关注 breaking change，重要凭据走 `auth vault` 加密。
- **观望者**：可以先用 `npx agent-browser open example.com` 跑一遍感受一下，无需任何安装承诺。
### 一句话评分（满分 10）
- **创新性**：9 / 10（refs + 紧凑快照的设计值得记进教科书）
- **性能与 token 效率**：9.5 / 10（独立实测 80%+ 降幅）
- **生态成熟度**：7 / 10（年轻但增长极快）
- **上手体验**：9 / 10（一行命令，零依赖）
- **综合推荐度**：**9 / 10 — 2026 年 AI Coding Agent 工具链的必装项之一**
如果你只允许自己的 Claude Code 装 3 个工具，agent-browser 应该在名单上。
