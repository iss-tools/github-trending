# wshobson/agents

[GitHub URL](https://github.com/wshobson/agents)


## wshobson/agents 深度评测：4 万 Star 的多工具链 AI 编程插件市场

> 一个把 202 个专家 Agent 打包成跨 7 大 AI 编程工具统一插件市场的开源仓库，是 Claude Code 生态最具工程化也最容易装错的资源合集。

- **Tags**: Claude Code, AI Agent, 插件市场, 开源项目, 编程效率
- **Category**: 开发工具, AI 编程, 资源合集

## Details

# 深度评测：wshobson/agents —— AI 编程圈的"瑞士军刀"，还是另一堆从未被触发的 Prompt 卡片？
> **一句话总结**：这是一个由前 Apple 工程师 Seth Hobson 维护的多工具链 AI 编程插件市场，把 **202 个专家 Agent、185 个 Skill、105 个 Command、94 个插件** 打包成跨 7 大编程工具（Claude Code / Codex CLI / Cursor / OpenCode / Copilot / Antigravity / Pi）的统一仓库，目前约 **4 万 Star**、MIT 开源，是 Claude Code 生态目前最具工程化、也是最容易"装错"的资源合集。
---
## 一、背景与创作者：这不是又一个"Prompt 合集"
先说作者。**Seth Hobson（GitHub ID: wshobson）** 的履历不是那种"AI 玩家"式的博客写手，而是有着 15 年以上分布式系统与数据应用经验的工程老兵——2015–2021 在 Apple 担任高级软件工程师，之后在 Kuali 做高级 SWE，2024 年创立 Major 7 Apps LLC，2025 年起担任 United Data Technologies 的 Senior AI Engineer，主业聚焦 LLM、RAG、MCP、A2A 等 Agent 协议栈。
他在 2025 年 7 月 Claude Code Subagent 功能刚发布时就建了这个仓库。当时这类项目普遍停留在"我写了 20 个 agent md 文件大家来抄"的层面，而 Seth 的核心贡献是把这些"人格 prompt"重新定义成了 **可发布、可版本化、可跨工具安装的软件包（Plugin）**，并把整个仓库打造成一个完整的"插件市场"。这个定位让它从一众多胞胎中独立出来——到 2026 年 6 月已冲到 36.7K Star，10 月前后逼近 41K Star，进入 GitHub 全球 Star 排名前 1000。
> 💡 **本质一句话**：它不是"Agent 模板包"，而是一套 **"一次编写、到处安装" 的 Agent 软件分发协议**。
---
## 二、技术栈与架构解析：三层抽象 + 适配器模式
### 2.1 为什么叫"多 Harness（Multi-Harness）"？
这是这个仓库最容易被人忽视但**最核心的工程创新**。所谓 Harness，就是承载大模型的"驾驶舱"——Claude Code、Cursor、Codex CLI 都是 Harness，但它们读取 Agent / Skill / Command 的格式各不相同。
2026 年 5 月的 PR #541 和 #542 做了一次关键重构，把架构彻底抽象成"**单一事实源 + 按目标工具生成产物**"：
```
plugins/<name>/            ← 唯一的 Markdown 源（Claude Code 插件格式）
   ├── agents/*.md         ← Agent 定义（YAML frontmatter + 系统提示）
   ├── skills/*/SKILL.md   ← Skill 知识包
   └── commands/*.md       ← Slash 命令
        ↓ tools/adapters/  ← 按目标工具生成
        ↓
Claude Code / Codex (TOML) / Cursor (rules) / OpenCode / Copilot / Antigravity / Pi
```
**比喻一下**：它就像 Docker 把"程序 + 依赖"打包成镜像，让任何 Linux 都能跑——wshobson/agents 把"提示词 + 工具权限 + 模型路由"打包成 Plugin，让任何 AI 编程工具都能加载同一套"专家团"。
### 2.2 三层概念：Plugin / Agent / Skill / Command 别再混淆
这是最多新手踩坑的地方。仓库里的抽象一共四层：
| 概念 | 本质 | 触发方式 | 类比 |
|------|------|---------|------|
| **Plugin** | 安装单元（打包） | `/plugin install` | apt 包 |
| **Agent** | 人格 + 工具 + 模型路由 | Claude 自动委派（隐式） | 一个"专家岗位" |
| **Skill** | 知识包（惰性加载） | 描述短语匹配触发 | 一本"参考手册" |
| **Command** | 显式入口 | `/command` | 一个"快捷键" |
每个 Agent 是一个 Markdown 文件，YAML frontmatter 声明 `name`、`description`、`tools`（白名单）、`model`（opus / sonnet / haiku / fable / inherit），正文就是该 Agent 的完整 system prompt。**它的真正价值不是"角色扮演"，而是"上下文防火墙"**——每个子 Agent 拥有独立 context window，执行完只把 summary 回传主线程，避免刷屏污染主上下文。
### 2.3 三档模型路由：成本设计是认真的
仓库对 202 个 Agent 做了精细的模型分档，这在同类合集里极少见：
- **Tier 1 · Opus（约 42 个）**：架构、安全审计、代码评审、incident-responder 等"决策密集型"工作；
- **Tier 2 · Inherit（约 42 个）**：跟随会话默认模型，成本可控；
- **Tier 3 · Haiku（低成本档）**：SEO 元信息优化、社交发布、客户支持、reference-builder 等"高频低难度"任务。
这种"按任务复杂度自动分配算力"的设计，是把成本当成一等公民来对待的。
---
## 三、上手体验：5 分钟到 5 分钟踩坑
### 3.1 Claude Code 用户（最丝滑）
在 Claude Code 里直接两条命令搞定：
```bash
# 1. 注册插件市场
/plugin marketplace add wshobson/agents
# 2. 装一个具体插件（千万别一次装一堆）
/plugin install python-development@claude-code-workflows
# 3. 调用插件里的命令
/python-development:python-scaffold Create a FastAPI service with tests
```
### 3.2 其他工具链用户
Codex CLI 用原生 marketplace 命令；Cursor 走 plugin marketplace registry；OpenCode / Antigravity / Copilot / Pi 则需要 clone 仓库后跑 makefile：
```bash
gh repo clone wshobson/agents ~/agents
cd ~/agents
make install-opencode       # 或 install-antigravity / install-copilot / install-pi
```
### 3.3 只想要 Skill 不想要 Agent 的极简党
甚至提供了单独装 skill 的轻量路由：
```bash
gh skill install wshobson/agents python-testing-patterns
npx skills add wshobson/agents --skill python-testing-patterns
```
**部署体验评价**：文档体系完整（usage.md / agents.md / harnesses.md / ARCHITECTURE.md / 质量评估指南一应俱全），有多语言适配器生成、还有 `make validate STRICT=1` 的质量校验和 `plugin-eval` 的静态评分 CLI——这种工程化程度在"Prompt 仓库"里是独一档的。
---
## 四、淘金摘优：别装 94 个，这 6 个才是真护城河
作者自己在架构文档里就警告过 **"不要装全部"**，但很多读者还是会被 Star 数冲昏头脑。第三方深度审计文章给出的结论更直白：**94 个插件里约 65% 是任何同类仓库都会给的语言/基建"标准件"，真正的护城河是剩下 35%**。
下面这 6 个是我认为**值得单独写进团队规范的"神仙组件"**：
### ⭐ 1. `plugin-eval` —— 唯一带统计质量评分的 Agent 评测框架
三层评估：静态分析（<2 秒、免费、确定性）→ LLM Judge（约 30 秒、4 次 API 调用，打分 triggering accuracy / output quality / scope calibration / orchestration fitness）→ Monte Carlo（约 2 分钟、50 次调用、Wilson 置信区间 + Elo 排名）。输出 Bronze/Silver/Gold/Platinum 徽章和字母等级，支持 `--threshold 70` 接入 CI。
**这是整个 Claude Code 生态里其他仓库都没有的能力**。如果你团队要自建内部插件库，光这一项就值得把整个 marketplace 拉下来。
### ⭐ 2. `conductor` —— 把 Claude Code 变成"轻量级项目管理器"
命令链：`/conductor:setup` → `/conductor:new-track` → `/conductor:implement` → `/conductor:revert`。哲学是 **Context → Spec & Plan → Implement**：先沉淀项目愿景、技术栈、风格指南为持久上下文，再让后续所有 Agent 调用都读取这套上下文，避免每次冷启动。
做多周需求、需求经常模糊变动的工程团队，这是从"prompt 修补"升级到"工程化交付"的关键一块。
### ⭐ 3. `agent-teams` —— 真正的并行多 Agent
7 个预设：`team-review`、`team-debug --hypotheses 3`、`team-feature`、`team-fullstack`、`team-research`、`team-security`、`team-migration`。
`team-debug --hypotheses 3` 是最直观的收益场景：让三个 Agent 并行追不同假设、各自取证、主 Agent 仲裁。对于"间歇性 bug 不知道为啥"这类问题，能省下数小时盲试时间。需要开启 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 和 tmux。
### ⭐ 4. `protect-mcp` —— 合规党的"审计刚需"
给每个 MCP 工具调用套上 Cedar 策略校验 + Ed25519 签名回执 + 哈希链式追加日志，**离线可验证**。金融机构、医疗、所有"合规部门会问你 AI 到底做了什么"的场景，这一项直接封神。同类生态里几乎没人做这件事。
### ⭐ 5. `block-no-verify` —— 小而必须的"防呆插件"
一个 PreToolUse hook，拦截任何含 `--no-verify`、`--no-gpg-sign` 的 Bash 调用。解决的问题：AI Agent 很爱绕过失败的 pre-commit hook 让 CI 变绿。装一次，永久免疫这一类脚气。
### ⭐ 6. `HADS`（Human-AI Document Standard）—— 让 AI 读文档省 token 的语义标签
用 `<<purpose>>`、`<<constraints>>`、`<<examples>>` 这类语义标签标注 Markdown 段落，Claude 读文档时 token 消耗大幅下降，人类读原文档毫无干扰。这是第一次有人把"文档即 Agent 的 API"做成了可用的 skill。
> 💡 **核心心法**：把 wshobson/agents 当 **目录（Catalog）用**，别当框架用。每次开新任务，去 catalog 里挑 2–3 个匹配的插件装上，做完任务 `/plugin` 卸掉。这跟你不会 `apt install` 整个 Debian 仓库是一个道理。
---
## 五、竞品对比：它到底比 VoltAgent 强在哪？
Claude Code Subagent 合集赛道目前主要有三家：wshobson/agents、VoltAgent/awesome-claude-code-subagents、0xfurai 系列。对比如下：
| 维度 | **wshobson/agents** | **VoltAgent/awesome-claude-code-subagents** | **0xfurai 系列** |
|------|---------------------|-------------------------------------------|------------------|
| 定位 | 多 Harness 插件市场 | Claude Code Subagent 索引清单 | Agent 模板合集 |
| 规模 | 202 Agents / 185 Skills / 105 Commands / 94 Plugins | 154+ Agents / 10 分类 | 数十个 Agents |
| Star | ~41K（2026.10） | ~23K | 数千级 |
| 跨工具 | ✅ Claude Code / Codex / Cursor / OpenCode / Copilot / Antigravity / Pi | ❌ 仅 Claude Code | ❌ |
| 插件化 / 卸载 | ✅ Plugin 粒度可装可卸 | ❌ 手动复制 md 文件 | ❌ |
| 模型路由 | ✅ 显式 opus/sonnet/haiku/fable/inherit | ⚠️ 少部分标注 | ⚠️ |
| 质量评估 | ✅ plugin-eval（静态 + LLM + Monte Carlo） | ❌ | ❌ |
| 治理 / 审计 | ✅ protect-mcp、block-no-verify、signed-audit-trails | ❌ | ❌ |
| 编排 | ✅ agent-teams、conductor、full-stack-orchestration | ❌ | ❌ |
**结论**：VoltAgent 适合"我想抄几个 agent md 文件回家"的轻量玩家；**wshobson/agents 适合真正把 AI 编程接入日常工作流的工程团队**——它有分发、有版本、有质量门槛、有成本分档、有治理。
---
## 六、局限与真实踩坑：别被 Star 数冲昏头
评测必须客观。这个仓库有几个**真实存在、且很容易让你翻车**的问题：
### 6.1 上下文膨胀是头号陷阱
每个安装的插件会向 Claude Code 上下文注入 agents/commands/skills 的元数据。**实测装 20 个插件后，你还没开始打字，就已经烧掉 5–10K token**。这不是仓库 bug，是 Plugin 机制的固有代价。
### 6.2 路由歧义：Agent 描述重叠导致 Claude 摆烂
装多了之后，你说"帮我搭个 Python 服务"，Claude 要在 `python-development`、`backend-development`、`api-scaffolding`、`full-stack-orchestration` 之间做选择——**选错或者干脆不做委派直接在主线程跑**的概率显著上升。第三方实测结论是：**"10 个精准描述的 Agent 远胜 100 个模糊描述的 Agent"**。
### 6.3 Opus 成本问题
42 个 Agent 默认路由到 Opus（$5 / $25 per M tokens）。如果你跑高频任务（代码 review 每次都触发 code-reviewer），月账单可能陡增。建议把使用频率高的 Agent 的 model 字段手动改成 sonnet 或 inherit。
### 6.4 触发是"概率"而非"确定"
Subagent 的委派由 Claude 主模型根据 description 匹配决定，**本质是概率路由，不是确定性调度**。对于必须 100% 触发的场景（如 CI 强制 review），还是要靠 Hooks 和显式 `/command` 兜底。
### 6.5 强绑定 Anthropic 生态
虽然号称多 Harness，但 skill 的深度能力（MCP 配置、hooks、模型别名）在 Claude Code 上最完整，其他工具只是"能跑"，不是"等效"。比如 Pi 的 Agent 必须装 subagent 扩展才能用。
### 6.6 质量参差是合集类项目的宿命
94 个插件里 SEO、营销、HR、法务这些"非工程"领域明显比核心的 Python/K8s/Security 插件弱，更像凑数。**用工程类插件，谨慎用商业类插件**。
---
## 七、目标人群与收益
### 🎯 强烈推荐安装的 4 类人
| 人群 | 推荐组件 | 直接收益 |
|------|---------|---------|
| **重度 Claude Code / Cursor 用户** | python-development + developer-essentials | 代码评审、脚手架、测试生成效率提升 3–5 倍 |
| **多工具链切换的工程师** | 整仓 + 多 harness 适配器 | 一套配置同步 7 个工具，不用维护 7 份 prompt |
| **工程团队 Tech Lead** | plugin-eval + conductor + agent-teams | 团队级 Agent 质量门槛 + 多周项目上下文管理 |
| **金融 / 医疗 / 合规行业开发者** | protect-mcp + signed-audit-trails | 拿出可离线验证的"AI 做了什么"审计凭证 |
### 🚫 不建议折腾的 3 类人
- **只是想体验一下 Claude Code**：内置的 Explore / Plan / general-purpose 三个 subagent 已经够用，先跑熟原生能力；
- **Cursor / Windsurf 新手**：先用平台自带的 rules 系统，理解规则加载机制后再考虑跨工具分发；
- **对 token 成本极度敏感的个人用户**：装全套的成本远超收益，挑 2 个插件就够。
---
## 八、结语与终极评判
**综合评分：9 / 10**（同类目下无出其右，扣 1 分是上下文膨胀和 Opus 成本这两把双刃剑）。
wshobson/agents 的真正价值不在于"它有 202 个 Agent"——这只是一句漂亮的 README 文案。**它的真正贡献是把 Claude Code 生态的"提示词"从散文时代带入了软件包时代**：有分发协议（Plugin marketplace）、有版本管理、有多目标编译（adapter 模式）、有质量评测（plugin-eval 的三层统计框架）、甚至有治理审计。
三条落地建议：
1. **装前先做减法**：访问 `docs/agents.md` 的分类索引，按你本周的工作挑 2–3 个插件，不要"我全都装"；
2. **把 cost 当一等公民**：检查每个 Agent 的 `model` 字段，把高频触发的 Opus 降级到 Sonnet 或 Inherit；
3. **优先装"护城河级"组件**：plugin-eval、conductor、agent-teams、protect-mcp、block-no-verify、HADS 这 6 个是同类仓库没有的，先装它们，再考虑语言包。
在 AI 编程工具从"单一 assistant"进化到"专业团队协作"的 2026 年，这个仓库是当前**最像"基础设施"而非"玩具合集"**的方案——前提是你懂得像挑 Docker 镜像一样克制地用它。
