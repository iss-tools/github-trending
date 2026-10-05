# msitarzewski/agency-agents

[GitHub URL](https://github.com/msitarzewski/agency-agents)


## Agency Agents 深度评测：把一整个「AI 广告公司」装进 Claude Code 的 Prompt 宝库

> 一个 MIT 开源的 230+ AI Agent 人格提示词合集，把工程师、设计师、营销、投放等一整个虚拟 Agency 团队装进 Claude Code 等 AI 编程工具。

- **Tags**: Claude Code, AI Agent, Prompt工程, 开源项目, SubAgents
- **Category**: AI 编程, 开发工具, Prompt 资源

## Details

# Agency Agents 深度评测：把一整个「AI 广告公司」装进 Claude Code 的 Prompt 宝库
> **一句话总结**：Agency Agents 是一个由 Michael Sitarzewski 维护、MIT 协议开源的 **AI Agent 人格提示词合集**——用 200+ 份高度结构化的 Markdown 文件，把前端工程师、UI 设计师、Reddit 社区运营、 reality checker、投放审计师等一整个虚拟 Agency「打包」进 Claude Code、Cursor、Codex 等主流 Agentic Coding 工具，本质上是目前**规模最大、颗粒度最细、覆盖行业最广的 Claude Code SubAgents 第三方角色库**。
---
## 一、背景与痛点：从一条 Reddit 帖到 60k+ Star
### 1.1 作者其人：不是第一次做「Agency」
Michael Sitarzewski 在 Crunchbase 上的头衔是 **Tandem Theory 的 VP of Innovation and Technology**，同时也是 Epic Mini Life 的 Co-Founder 和 Epic 的 CEO——一家长期深耕广告与创意技术领域的连续创业者。 这个背景解释了为什么这个仓库里**营销、付费媒体、销售、设计部门的 Agent 密度远高于大多数「程序员视角」的 Prompt 库**：作者本人就是在 Agency 体系里泡了很多年的人。
### 1.2 诞生故事：12 小时 50+ 请求
根据官方 about 页面，Agency Agents 起源于作者在 Reddit 上分享的一组 AI Agent 人格 Prompt，**12 小时内收到 50+ 条「求更多角色」的回复**，于是被催更成了一个独立仓库，目前宣称已累计 **60k+ GitHub Stars、43+ 贡献者、144+ 个 Agent（README 自述 230+）跨 12+ 个 Division**。 数字可能因时间点而浮动，但「规模第一梯队」这个判断是站得住的。
### 1.3 它解决的核心痛点
在 Claude Code 原生支持 SubAgents 之后，所有人都遇到了同一堵墙：**默认 Agent 都是「通用全才」，写起代码来什么都懂一点，但真正干活时缺专业深度的「人格」。** 例如：
- 让 Claude Code 自己跑，它写 Reddit 推广文案就是「营销腔 AI 味」
- 让它做代码评审，它会「你好我好」，不敢揪出真问题
- 让它做 UI，产出永远长一样
Agency Agents 给出的解法是——**用「行业老炮」的人格、工作流、交付物标准去「限定」模型的思考路径**，把 Generic Prompt 升级为 Domain Expert Persona。
---
## 二、核心亮点：它凭什么不是「又一个 Prompt 合集」
### 2.1 亮点一：高度结构化的「Agent 蓝图」——不只是人设，而是工作流
每个 Agent 都是一个 Markdown 文件，遵循统一模板：
```
---
name: evidence-collector
description: 基于截图证据的 QA Agent…
color: teal
---
# Identity & Memory   ← 人格、记忆、口头禅
# Core Mission        ← 核心使命
# Critical Rules      ← 领域专属硬规则（如"必须有视觉证据"）
# Technical Deliverables  ← 交付物示例（含代码/表格/清单）
# Workflow Process    ← 步骤化工作流
# Success Metrics     ← 可量化的成功标准
```
这是它和 Awesome-ChatGPT-Prompts 这类「一句话人设」合集**最本质的差别**：不是给 Claude 一个名字，而是给它一套**认知框架 + 行为边界 + 验收标准**。
### 2.2 亮点二：Division 划分极其反「程序员中心主义」
大多数同类项目都是 Engineering 主导，但 Agency Agents 的 **18+ 个 Division** 里，营销、付费媒体、销售、GIS、医疗、财务、学术各占一席，甚至有：
- **Paid Media Division**（PPC Campaign Strategist / Search Query Analyst / Tracking & Measurement Specialist）
- **GIS Division**（BIM/GIS Specialist、Drone/Reality Mapping、GeoAI Engineer）
- **Academic Division**（Narratologist、Anthropologist、Geographer——专门给游戏世界观构建用的）
- **Game Development Division** 下又细分为 Unity / Unreal / Godot / Blender / Roblox 五套独立 Agent
这种跨行业广度在同类项目里几乎绝无仅有，也让它真正成为「一整个 Agency」而非「一个 Dev 团队」。
### 2.3 亮点三：多工具适配是「一等公民」，不是后期补丁
原生支持 Claude Code 之后，作者写了完整的 `convert.sh` + `install.sh` 转换器，把同一套 Markdown 转译为 14 个工具的格式：
| 工具 | 安装路径 | 转换方式 |
|---|---|---|
| Claude Code | `~/.claude/agents/` | 原生 |
| GitHub Copilot | `~/.github/agents/` | 原生 |
| Cursor | `.cursor/rules/` | `.mdc` 规则 |
| Aider | `./CONVENTIONS.md` | 合并为索引 |
| Windsurf | `.windsurfrules` | 单文件合并 |
| Codex | `~/.codex/agents/` | TOML |
| Kimi Code | `~/.config/kimi/agents/` | YAML |
| Osaurus / Hermes / OpenClaw… | … | SKILL.md / plugin / SOUL.md |
还提供 Homebrew 安装的原生桌面 App，一键浏览 + 安装 + 自动更新。
### 2.4 亮点四：人格金句，字里行间能看出「老炮经验」
> "I don't just test your code - I default to finding 3-5 issues and require visual proof for everything." —— **Evidence Collector**（测试部）
> "You're not marketing on Reddit - you're becoming a valued community member who happens to represent a brand." —— **Reddit Community Builder**（营销部）
这些不是 LLM 编出来的鸡汤，而是把 Agency 行业里「甲方训话」「QA 红线」「社区潜规则」直接烧进了 Prompt。**当 Claude 接到这个人格，它的「拒绝指出问题」倾向会被强制压下去**——这是大多数 Prompt 库做不到的。
---
## 三、Demo 速览：怎么用？5 分钟跑通
### 3.1 安装（三选一）
```bash
# 方案 A：Homebrew 装桌面 App（推荐小白）
brew install --cask msitarzewski/agency-agents/agency-agents
# 方案 B：脚本直装 Claude Code
git clone https://github.com/msitarzewski/agency-agents
cd agency-agents
./scripts/install.sh --tool claude-code
# 方案 C：只装一个部门（推荐——见后文"避坑"）
./scripts/install.sh --tool claude-code --division engineering,security
```
### 3.2 激活一个 Agent
装好后，在 Claude Code 里直接说话即可触发：
```
用户输入：
"Hey Claude, activate Frontend Developer mode and 
 help me build a React component with Core Web Vitals optimization"
```
```
AI 输出（Frontend Developer 人格激活）：
"Frontend Developer online. Before we touch code, let's 
 set the performance budget: LCP < 2.5s, INP < 200ms, CLS < 0.1.
 For the component you described, I'd propose…
 // 代码示例：React 19 + Suspense 边界 + memoization 策略
 // Lighthouse 验证步骤
 // 图片懒加载与 preconnect 配置"
```
### 3.3 真实效果对比（同一个任务，两种 Prompt）
**不用 Agency Agents**：
> 帮我做 Reddit 推广。
输出：典型的「AI 营销腔」，第一条建议就是「Make a catchy post with emojis!」
**激活 Reddit Community Builder 后**：
> activate Reddit Community Builder, help me plan a launch post for r/SideProject
输出会强制遵循 Reddit 文化：先 30 天 lurking 记录、辨认 sub 的「软广红线」、给出「先回 10 个别人问题再发自己的帖」的 warm-up 序列、明确禁止 emoji 堆砌。**这是「懂 Reddit 的老用户」视角，不是「懂营销的 AI」视角。**
---
## 四、目标人群与收益矩阵
| 人群 | 推荐切入点 Division | 核心收益 |
|---|---|---|
| 独立开发者 / Solo Builder | Engineering + Design + Testing | 一人 = 一个小团队，无需雇佣 UI/QA |
| 初创 MVP 团队 | Engineering + Product + Marketing | README 里的「Scenario 1」即模板 |
| 广告/投放从业者 | Paid Media + Marketing | 把 Account Audit / Tracking / Creative 拆成流水线 |
| 跨境电商运营 | Marketing Division 中文部分 | 小红书/抖音/快手/B站/百度/知乎/微信公众号全覆盖 |
| 游戏独立开发者 | Game Dev（Unity/Unreal/Godot/Roblox）+ Academic | 世界观构建 + 数值 + 技术美术一站式 |
| GIS / 数字孪生团队 | GIS Division | 这是其他 Prompt 库完全没有的垂直领域 |
| 咨询 / 财务 / 法务 | Finance + Specialized Division | FP&A、M&A、Legal Billing、GDPR 合规顾问齐备 |
---
## 五、竞品对比：在 Claude Code 生态里它处于什么位置
| 项目 | 规模 | 核心定位 | 适合谁 |
|---|---|---|---|
| **Anthropic 官方 SubAgents** | 少量内置 | 原生机制参考 | 想从零学 SubAgents 的人 |
| **wshobson/agents** | ~80 个 | 精简、偏 Engineering | 想要小而美 |
| **VoltAgent/awesome-claude-code-subagents** | 100+ | 列表型聚合 | 想自己挑 |
| **Agency Agents** | **230+ / 18+ Division** | **完整 Agency + 多工具适配** | **想要一站式、跨行业** |
| AssemblyZero | 12+ | 参数化编排框架 | 重度 Multi-Agent 用户 |
| Taku.ai | Marketplace | Skill 分发平台 | 想赚分发分成 |
**差异化优势**：Agency Agents 是同类里**唯一把「Agency 行业 SOP」作为一等公民**的项目——它的 Paid Media、Reddit/TikTok/小红书运营、Legal/Finance Agent 在其他仓库里几乎找不到对应物。**劣势**：体积大，不轻量。
---
## 六、局限与不足：客观的吐槽环节
### 6.1 ⚠️ 一次性装满会「撑爆」系统提示
230+ Agent 全部装进 `~/.claude/agents/` 后，Claude Code 会在每次会话的 System Prompt 里注入 Agent 列表。**实测过多 Agent 共存时，会显著消耗 token 预算、降低响应速度，并让模型在选 Agent 时「选择困难」**。强烈建议用 `--division` 或 `--agent` 精准安装，只装当前项目用得到的 5-15 个。
### 6.2 ⚠️ OpenCode 上游 Bug 限制
OpenCode 运行时目前只能注册约 **119 个 Agent，超出会静默丢弃**（README 已明示），装全套会失效。 在 OpenCode 上务必用 `--division` 控制数量。
### 6.3 ⚠️ 「人格≠能力」：它是 Prompt，不是真 Multi-Agent
需要清醒认识到：**这些 Agent 本质是提示词角色扮演，不是真的并行执行的多智能体系统**。所谓「Agents Orchestrator」也只是引导主 Claude 按角色顺序思考。要真正跑多 Agent 并行，仍需 Claude Code 的 Task 工具或外挂编排框架（如 LangGraph）。**期待它像 CrewAI / AutoGen 一样并发，会失望。**
### 6.4 ⚠️ 质量参差不齐
43+ 贡献者意味着风格不一。**核心 Engineering / Marketing / Testing 部门颗粒度极细、有真实经验感；而部分新增的「长尾」Agent（如 Korean Business Navigator、Focus Music Architect）明显偏 PPT 化，更像快速合并 PR 的产物。** 推荐「先读后装」，挑颗粒度厚的用。
### 6.5 ⚠️ 维护模式依赖 AI
qmmit.dev 的数据显示，该仓库**近期 33.3% 的 commit 由 AI Agent 完成**，17 位贡献者参与。 这既是「AI 维护 AI 项目」的有趣案例，也意味着 PR 审查质量波动、文档和代码可能有「AI 幻觉自举」的隐患。
---
## 七、行动建议：3 步走路线图
1. **今天就试（5 分钟）**：`brew install --cask msitarzewski/agency-agents/agency-agents`，先只装 `engineering` + `testing` 两个 Division，挑 **Frontend Developer、Code Reviewer、Evidence Collector** 三个跑一个真实项目，感受「人格化提示」和 Generic Prompt 的差距。
2. **本周内做**：阅读 2-3 份核心 Agent 的 Markdown 源文件（推荐 `evidence-collector.md` 和 `reddit-community-builder.md`），理解「Critical Rules + Success Metrics」这种写法，然后**仿写一份你本职工作的专属 Agent**，比装现成的更香。
3. **长期看**：把 Agency Agents 当成「Agent Persona 设计范本库」而非「工具库」——它真正的价值是**一套可以复用的 Agent 提示词工程方法论**，学会之后你自己也能写出同等质量的领域专家人格。
**终极评判**：对于在 Claude Code / Cursor 生态里希望「一个人当一支队伍」的独立开发者和中小团队，这是目前**不可替代的参考实现**，强烈推荐；对于只写后端、不需要跨行业人格的开发者，wshobson/agents 这类轻量项目可能更合适；而对于期待「真·多 Agent 并行编排」的研究者，这只是个 Prompt 起点而非答案。**总评：★★★★☆（4.5/5）**——扣掉的半星给 token 开销和质量不均，加上的四星半给它的广度、深度和行业洞察。
