# backnotprop/plannotator

[GitHub URL](https://github.com/backnotprop/plannotator)


## Plannotator 深度评测：让 AI 编码 Agent 的计划与代码变得可批注、可回传

> 一个开源本地工具，把 Claude Code 等 AI 编码 Agent 的计划和代码搬到浏览器里行级批注，再一键回传给 Agent 修正。

- **Tags**: Claude Code, 代码审查, AI Agent, 开源工具, 人机协作
- **Category**: 开发工具, AI 编程

## Details

# Plannotator 深度评测：把"失控的 AI 编码 Agent"拉回你手里
> **一句话总结**：Plannotator 是一个开源（MIT/Apache-2.0）的本地优先"人机协作审批层"，它把 Claude Code、Codex、OpenCode 等 AI 编码代理生成的计划与代码，搬到浏览器/VS Code 里，让你像批改作业一样**行级标注、一键回传**给 Agent，把"放养式 vibe coding"变成"带闸门的流水线"。
---
## 一、背景与痛点：Agent 越跑越快，人却在"信息断联"
2025 年底到 2026 年，Agentic Coding 彻底爆发——Claude Code、Codex CLI、Gemini CLI、OpenCode、Copilot CLI 一个接一个落地，开发者从"写代码"变成"审 Agent 写的代码"。但随之而来一个尴尬的现状：
- **计划环节失守**：Agent 给出一份几十行的实施计划，按个 `y` 就开始跑，跑完发现方向错了；
- **代码审查流断裂**：diff 在终端里滚，想留个注释还得切到 GitHub 或 IDE，反馈再手动粘回终端；
- **异步协作无处安放**：Agent 在跑长任务时你人不在电脑前，回来只能看到一片"已完成"以及一堆需要返工的产物。
作者 Michael Ramos（GitHub ID：`backnotprop`）在博客里直接点出了这个空白——**Agent 有"计划模式"，但没有像样的"计划评审界面"**。Plannotator 于 2025 年 12 月 28 日建仓，12 月 29 日就上了 Product Hunt；2026 年 4 月 29 日带着全新的 Annotate / Code Review / Inbox 又发了一次。截至 2026 年 9 月，仓库已有约 **8,655 Stars、646 Forks、161 个未关闭 issue/PR**，版本迭代到 v0.27.14，明显踩中了行业情绪。
---
## 二、核心定位：它到底是干什么的？
把 Plannotator 比喻成"**Agent 的橡皮图章就长在你手上**"：
- 它不是又一个 Agent，也不训练任何模型；
- 它是一个**夹在 Agent 和你之间的"审批 UI + 反馈回路"**；
- Agent 把"待审材料"（计划 / diff / 文档 / URL）打包丢给 Plannotator → 浏览器弹出一个精致的评审界面 → 你画线、写批注 → 点"Send Feedback" → 这些批注**作为下一轮输入原样回灌给 Agent**。
整个流程数据**不出本机**，官方明确说明"runs locally, no usage telemetry or analytics"，对希望保留隐私的团队非常友好。
---
## 三、核心亮点与功能剖析
### 1. Plan Review：把"按 Y 确认"变成"行级批注"
这是 Plannotator 起家的核心能力。在 Claude Code 中，当 Agent 进入 Plan Mode 准备输出方案时，Plannotator 通过 Hook 拦截 `ExitPlanMode` 事件，把计划以 Markdown 渲染在浏览器里。
具体行为随 Claude Code 版本略有差异：
- **Claude Code 2.1.287 及以上 + 交互式终端**：Plannotator mod 默认开启，Claude 不会阻塞等待，你的批复到达后作为一条消息回传；
- **更老版本、`claude -p` / SDK 调用、Windows 环境**：Hook 会挂住 `ExitPlanMode`，Claude 真正"原地等你打分"。
交互流程可以这样概括：
```
Claude → ExitPlanMode（含计划 Markdown）
        ↓
Plannotator 启动本地 Server → 自动打开浏览器 UI
        ↓
你在 UI 中：✓ Approve   /   ✗ 选中行写批注 → Send Feedback
        ↓
批注结构化后回传 Claude，作为下一轮 Prompt
```
### 2. Code Review：完整 diff 查看器，本地也能用
Plannotator 的 Code Review 不是"GitHub PR 网页的替代品"，而是一个**通用 diff 评审台**：
- 支持本地 diff、commit、branch、worktree，也支持 GitHub / GitLab PR；
- 左侧文件树 + 右侧 diff，支持行内注释、Conventional Comments 标签（如 `suggestion:`、`issue:`）；
- 可选叠加"AI 审查 Agent"作为辅助，但**模型不是必经环节**——纯粹的手动评审也完全可用。
内置三条最常用的命令：
| 命令 | 用途 |
|---|---|
| `/plannotator-annotate <file\|dir\|url>` | 给任意 Markdown / 文档 / 文件夹 / 网页打批注 |
| `/plannotator-review [PR_URL]` | 启动代码审查（本地 diff 或 PR） |
| `/plannotator-last` | 给 Agent 最近一次输出加批注 |
### 3. Plannotator Inbox：异步任务里的"留言板"
这是 2026 年新增的能力，针对"你人不在电脑前"的场景。启动 `plannotator inbox` 后，Agent 在执行长任务时如果遇到选择题、需要你确认文件、或想请你看一份生成结果，会把信息**写进本地收件箱**继续干活；你随时打开一个本地窗口，**用点击答题、标注文件、按发送**即可——不会把 Agent 会话卡死。任何 Agent 也能通过 MCP（`plannotator inbox mcp`）接入。
把这条链路想成"Agent 的工作微信"：它不阻塞，但消息都不会丢。
### 4. Herdr Annotate：终端版的"批注流"
如果你就是离不开终端，Plannotator 又提供了 **Herdr Annotate**——一个终端内嵌的 Markdown 批注工具，可以直接对 Agent 回复或长 Markdown 文档画线、写反馈，然后一键回传。支持 Claude Code、Codex、Pi、Copilot CLI、Droid。这让 Plannotator 不再强制你切到浏览器。
### 5. VS Code 扩展：评审就在编辑器里
通过 `backnotprop.plannotator-webview`，可以把评审 UI 嵌到 VS Code 的一个 Tab 中：
- 计划评审 + 代码评审都在编辑器内完成；
- 编辑器里选中代码 `Cmd+Shift+.` 直接打批注，批注自动汇入评审面板；
- 主题自动同步 VS Code 配色，面板在 Approve / Send 后自动关闭。
### 6. 团队协作与历史
- **URL 分片分享**：小规模分享直接把批注塞进 URL fragment，无状态、无需服务端；较大内容走加密短链；
- **版本历史**：每份计划都自动存版本，可对比任意两版差异；
- **草稿自动保存**：评审服务崩了也不丢批注。
---
## 四、技术架构速览
Plannotator 的整体结构可以拆成四层：
1. **CLI 编排器**（npm 安装的 `plannotator` 命令）——负责启动本地服务、注册 Agent Hook、注入 Slash Commands；
2. **本地 HTTP Server**——承载 Web UI 与 REST 接口，所有数据落本地；
3. **Agent 适配层**——目前有三类接入方式：
   - **Plugin/Hook**：Claude Code、Codex、OpenCode、Pi（如 `@plannotator/pi-extension`）等官方或社区插件；
   - **MCP**：通过 `plannotator inbox mcp` 让任意支持 MCP 的 Agent 读写 Inbox；
   - **Slash Commands / Skills**：把 `plannotator-review`、`plannotator-annotate`、`plannotator-last` 三个 skill 写到 `~/.claude/skills`。
4. **前端评审界面**——React/Vue 类 SPA，提供 diff 视图、行级批注、Conventional Comments 标签、版本 diff。
值得一提的是，作者还专门维护了一个对照仓库 `plannotator/spec-planning-frameworks`，把同一份需求丢给 Superpowers、GSD、GitHub Spec Kit、BMad Method、Kiro Specs 等 6 套 Spec 框架做对照实验，方便社区理解不同 planning 流派的产物差异。这种"自家工具做行业基准"的玩法，在工具型开源项目里非常少见。
---
## 五、上手门槛与部署体验
### 安装（macOS / Linux / WSL / Windows 全支持）
官方推荐走 npm：
```bash
npm install -g plannotator
```
然后在 Claude Code 里执行：
```
/install-github-plugin backnotprop/plannotator
```
重启 Claude Code 即可。安装脚本会顺带写入三个 skill（`plannotator-review` / `plannotator-annotate` / `plannotator-last`），如果设置了 `$CLAUDE_CONFIG_DIR`，则写到对应的 skills 目录。
OpenCode 用户可以从 npm 装 `@knownasred/plannotator-opencode` 社区适配版（v0.6.7），Pi 也有官方 `@plannotator/pi-extension`。
### 最小使用示例（Claude Code）
```
你：帮我把 src/auth 重构成 JWT 校验中间件
Claude：（进入 Plan Mode，准备 ExitPlanMode）
       → Plannotator Hook 拦截 → 浏览器弹出计划评审页
你：在浏览器中：
   1) 第 12 行 "直接修改 session 表" 选中 → 标签 issue → 注释 "改成只读 session，写 token 到 redis"
   2) 第 27 行 "未考虑 token 撤销" → 标签 suggestion → 注释 "加一个 revoke 接口"
   3) 点 Send Feedback
Claude：（拿到结构化批注，作为下一轮输入）
       → 重新输出修正后的计划
```
### 文档与 Demo
官方文档 `docs.plannotator.ai` 结构清晰，按"Open source / Workspaces / Agents / Planning Library / Learn"五大模块组织，还配了完整的 demo 视频。
---
## 六、目标人群与收益
| 用户类型 | 能解决什么痛点 |
|---|---|
| **重度 Claude Code / Codex 用户** | 摆脱"按 Y 盲跑"→ 把计划真的过一遍脑子，减少返工 |
| **Agentic Coding 团队（2 人以上）** | 把评审沉淀为团队 SOP，新人上手成本骤降；通过 URL 分享做异步协作 |
| **异步/远程工作者** | Inbox 让 Agent 跑长任务时不再阻塞，回来再批注 |
| **终端原教旨主义者** | Herdr Annotate 给了一个不切出去也能批注的方案 |
| **写技术文档 / PRD 的人** | `/plannotator-annotate` 把任意 Markdown/URL 变成可批注对象，特别适合让 Agent 帮你写文档再回炉 |
---
## 七、竞品与同类对比
### 1. 与 Claude Code 原生 Plan Mode 的区别
原生 Plan Mode 是一个**文本回车确认**的界面，没有行级标注、没有版本历史、也没有 diff 视图。Plannotator 的价值在于——**把 Plan Mode 升级为视觉评审工作流**，并且这一升级对**其他 Agent 通用**（Codex / OpenCode / Pi 也能接）。
### 2. 与 Spec Kit / Superpowers / BMad / GSD 等 Spec 框架的关系
这些框架关注的是"**怎么写出一份好计划**"（流程与模板），而 Plannotator 关注的是"**计划怎么被审**"。二者不是替代关系，而是上下工序。作者自己跑过同 brief 下六套框架的对照，明显是在为生态搭建"基准层"，希望能成为 Spec 框架的通用评审出口。
### 3. 与 Packmind / Open Code Review 等审查工具的关系
Packmind 偏向知识治理与最佳实践沉淀；Open Code Review 偏 PR 流程。Plannotator 的差异化在两点：
- **本地优先**，零依赖云服务；
- **打通 Agent 回路**，不只是"评审后人工去改"，而是**评审结果直接作为 Agent 下一轮 Prompt**。
### 4. 数据：热度与活跃度
| 维度 | 数据（截至 2026 年 9 月） |
|---|---|
| Stars | ~8,655（9 月 13 日），社区站点显示已逼近 9.9k |
| Forks | 646 |
| 开放 issue/PR | 161 |
| 最新版本 | v0.27.14 |
| 首发到 Star 数 | 建仓半年即冲上 8k+，属于 DevTools 领域的"爆款" |
---
## 八、局限与不足（务必了解再上）
1. **强依赖 Claude Code / OpenCode 等特定 Agent**：目前没接 Cursor、Windsurf、Zed 等图形化 IDE 类 Agent，对纯 IDE 用户不太适用。
2. **Windows 行为有差异**：老版本 Claude Code / SDK 模式 / Windows 下要走"阻塞式 Hook"路径，体验不如交互式终端顺畅。
3. **功能扩展快但命名易混淆**：Plannotator 主仓库、plannotator-tui、plannotator-tui 的 Herdr Annotate、plannotator-webview VS Code 扩展、plannotator inbox、Herdr……名字接近，新用户需要花点时间分清各自的边界。
4. **国内访问 Plannotator 官网可能受网络影响**：本地运行没问题，但走加密短链分享给国内同事时，可能需要考虑可达性。
5. **学习成本不为零**：要真正用好 Conventional Comments 标签、版本 diff、Inbox/MCP 等进阶玩法，建议先读一遍 docs 中的 Agents 章节。
---
## 九、结语与行动建议
**最终评判**：Plannotator 是 2025–2026 年这波 Agentic Coding 浪潮里**少有的、真正解决"人在环"痛点的工具**。它没有去抢"再做一个更聪明的 Agent"这条卷到头的老路，而是选择了另一个方向——**让人类成为 Agent 的最强反馈函数**。在 Agent 自治能力还没达到"免检"水准的今天，这种把"信任边界"还给用户的思路，是稀缺且有长期价值的。
**适合立即上手的人**：
- 已经每天用 Claude Code / Codex 跑任务的开发者；
- 正在团队内部推广 Agentic Workflow，但被"产出质量不稳定"卡住的技术 lead；
- 想沉淀个人"评审→指令→再评审"飞轮的 solo builder。
**上手节奏建议**：
1. 先用 `npm install -g plannotator` + `/install-github-plugin backnotprop/plannotator` 在 Claude Code 里跑通最简单的 Plan Review；
2. 第二步把 `/plannotator-annotate` 用在你日常写的 Markdown / PRD 上，体感会迅速拉满；
3. 第三步再上 Inbox 与 Herdr Annotate，把异步与终端场景补齐；
4. 最后，去 `plannotator/spec-planning-frameworks` 仓库看看六套 Spec 框架的对照实验，挑一套顺手的流程塞进你的工作流。
如果你正在被"Agent 越干越离谱、自己却越来越闲"的空虚感困扰，那 Plannotator 大概率就是你这一周最值得花 30 分钟装上的工具。
