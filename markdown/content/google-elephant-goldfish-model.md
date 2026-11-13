# google/elephant-goldfish-model

[GitHub URL](https://github.com/google/elephant-goldfish-model)


## Google Elephant-Goldfish Model 深度评测：AI Coding Agent 的「记忆手术刀」

> Google 开源的设计评审插件：让「有记忆的大象」Agent 写设计文档，让「零记忆的金鱼」子 Agent 独立挑刺，在写代码前暴露设计缺陷。

- **Tags**: GitHub 开源, Google, AI Coding Agent, 设计评审, 工作流插件
- **Category**: AI 编程, 开发工具, 效率提升

## Details

# Google Elephant-Goldfish Model 深度评测：AI Coding Agent 的「记忆手术刀」
> **一句话总结**：这是 Google 开源的、把「写设计文档」和「审设计文档」拆成两种 Agent 的新范式插件——大象（有记忆的 Agent）负责写、金鱼（零上下文的子 Agent）负责挑刺，把 AI 协作里最隐蔽的 bug——"你俩都忘了对方不知道什么"——提前暴露在写代码之前。
> **首因结论**：如果你每周都要和 Claude Code、Codex、Antigravity 这类 Agent 一起设计新功能，EGM 是目前**少有的、由 Google Distinguished Engineer 亲自背书的、能强制引入"独立旁观者视角"的流程层工具**。它不是模型、不写代码，却能在你按下 Implement 之前，把 80% 的"想当然"过滤掉。代价是 token、时间，以及一个硬要求——你的 Agent 必须能 spawn 出真正干净的子 Agent。
---
## 一、背景与痛点：一段 45 分钟的"AI 沦陷史"
作者 Dave Rensin 是 Google 的 Distinguished Engineer，他基于自己的内部工具（几个月内做到 10 万+ 用户）写了一篇文章《Elephants, Goldfish, and the New Golden Age of Software Engineering》（Medium, 2026.04），里面有一个让所有用过 AI Coding Agent 的人都会心一笑的描述：
> 你跟 Agent 聊了 45 分钟。前 10 分钟像魔法，30 分钟开始它建议一个不存在的 import，45 分钟它开始幻觉数据库列名、覆盖你刚写好的单测，并且对你提出的任何烂点子都点头。
EGM 仓库的 `architecture.md` 把这种"长上下文 Agent"病态拆成**四种系统性失败模式**：
1. **Hallucination Cascades & Context Pollution**——同一个线程既采访你、又设计、又写代码，会把早期猜测当真理，"验证自己的错误而不是发现错误"；
2. **Premature Implementation（" weeds syndrome"）**——Agent 默认就地写代码，绕过架构定位、YAGNI 检查、复用既有基础设施；
3. **Chat Dump Fatigue**——长文档直接怼在聊天流里，既污染上下文又让用户体验崩溃；
4. **Documentation Drift**——项目启动时写的 spec 几周后就跟代码脱节，反而成了未来 Agent 的"毒上下文"。
**核心洞察一句话**：让一个"什么都记得"的 Agent 来审自己刚写的设计，等于让作者自己 review 自己的论文——它会顺手补全所有它心里有但纸上没有的坑。你需要一只真正"什么都不记得"的金鱼。
> 💡 **小白友好比喻**：大象 Agent 像一个跟你合作三个月的资深同事，他知道所有"哦那个 Friday 规则啊你懂的"；金鱼 Agent 像刚入职第一天就被塞了一份 PRD 的实习生，他不懂"Friday 规则"是什么就会直接问。**不懂，才是他能替你抓出 bug 的根本原因**。
---
## 二、项目速写：不是模型，是"流程层"
先把几个关键事实钉死，避免误读：
| 维度 | 内容 |
|------|------|
| 仓库地址 | `github.com/google/elephant-goldfish-model` |
| 类型 | **Plugin（skills + reviewer personas）**，不含任何模型权重 |
| License | Apache 2.0 |
| 是否官方 Google 产品 | **否**，README 原话："not an officially supported Google product" |
| 规模 | 7 skills + 9 reviewer personas + 6 brainstorm lenses + 5 review stages |
| GitHub 数据 | ~18.5k stars（本周新增 5.5k）、~1,400 forks、202 commits，截至 2026-11-13 |
| 内部采用 | Google 官方宣称"Thousands of Google engineers use EGM" |
| 宿主 Agent | Antigravity、Claude Code ≥2.1.271、Claude Cowork、Codex 0.163+、ChatGPT Work、Cline（手动） |
**它解决的问题不是"代码写不出来"，而是"代码之前那一步没人把关"**。当 AI 能替你写代码之后，瓶颈不再是 coding 速度，而是 design 决策质量——这就是 Rensin 文章里那句被 UMD 课程原封不动引用的话：
> "If we aren't careful, we aren't just writing code faster. We are mass-producing our mistakes."
---
## 三、架构与核心能力：解剖一只真正的"金鱼"
EGM 是一个**纯 Markdown + 极少量胶水代码**的项目，没有 Python、没有 Node、没有任何 LLM 调用 SDK——所有智能都来自宿主 Agent 自己。这个架构选择本身就是一种极简美学：**它能跑在哪，只取决于宿主 Agent 能否提供两个能力**——
1. 读一份 Markdown 格式的 skill 文件；
2. spawn 出一个真正"零上下文"的子 Agent。
如果做不到第 2 条，**EGM 会主动终止 review，而不是在同一上下文里假装跑一遍**。这是它最有洁癖、也最值得尊敬的设计决定。
### 3.1 四层解耦架构
来自官方 `architecture.md`：
```
skills/       ← 7 个 slash command 入口（brainstorm / draft / review / resolve / bootstrap / drift-report / review-loop）
agents/       ← 9 个 reviewer persona（Comprehension / Design Critic / Implementation Readiness / Codebase Auditor / Structural Validator / Style Editor / Inventive Catalyst / Synthesizer / Zoom-Out）
resources/document_standards/  ← 各阶段评分 rubric（zoom-out-standard.md / feature-spec-standard.md 等）
docs/         ← 自举文档 + 自身的设计文档（是的，EGM 自己也用 EGM 写 spec）
```
**没有 fork 任何 harness 专属 skill**——Claude Code、Codex、Antigravity 共享同一套文本，只在各自 `plugin/` 目录下有一份适配器，把"subagent"翻译成自家 API。这就是它能 4 个平台同步首发的原因。
### 3.2 端到端工作流（5 个阶段）
来自官方时序图：
```mermaid
Human → /egm-brainstorm → concepts_brief.md
Human → /egm-draft      → docs/designs/FEATURE.md
Human → /egm-review     → 5-stage Goldfish Review Reports
Human → /egm-resolve    → 修订 + 你做最终决策
Human → git commit (spec 入库)
Human → 让实现 Agent 严格照 spec 写代码
```
**关键强制点**：Phase 1-4 **只允许写 spec 和 review 报告，禁止碰 production 代码**。这是 convention 不是 enforcement——文档自己承认"nothing enforces it"——但 rubric 会让越界的 reviewer 直接打 Blocker。
### 3.3 五阶段 Goldfish Review——它最核心的"魔法时刻"
这是 EGM 区别于其他 Spec Kit 的真正差异点：
| 阶段 | 角色 | 检查什么 | 防的是什么 |
|------|------|---------|-----------|
| ① Initial Zoom Out | 怀疑论架构师 | 整体复杂度是否合理、YAGNI、能否复用既有库 | 过度设计 |
| ② Comprehension Test | 天真读者 | **逐段 paraphrase 设计文档**，复述错了就说明文档有歧义 | "自以为解释清楚了" |
| ③ Critic Review | 敌意设计评审 | 架构、扩展性、failure modes、edge cases | 系统性风险 |
| ④ Intermediate Zoom Out | 再来一遍宏观 | 修订后的新增内容是否引入新问题 | 修补引入的二次复杂度 |
| ⑤ Implementation Readiness | 务实 Tech Lead | 文件路径、函数签名、测试用例是否都落实了 | "实现的人还要再猜一次" |
每阶段最多允许 1 次 re-audit，findings 按 **Blocker / Major / Nit** 分级。**Codex 0.163.0 端到端实测：15 个 fresh-context reviewer，573 秒跑完 2 个 live test**。
> 🎯 **Brainstorm 阶段的 7 视角 lens**（来自 `egm-brainstorm`）：YAGNI、Token 成本、UX、迁移路径、可观测性、技术债，外加一个**唱反调者**——他的唯一工作是问"这个功能到底该不该存在？是不是已有库覆盖了 80%？"
### 3.4 三条铁一般的"防作弊"规则
这是 EGM 真正打动工程师的部分：
1. **禁 flattery**：reviewer persona 明文规定不得说"this idea is great / brilliant"，必须以"最锋利的反方论点"开场；
2. **强制隔离**：每个 goldfish 子 Agent 只给 Read / Grep / Glob 三个工具，`CLAUDE.md` 和宿主会话历史被显式排除出上下文；
3. **不能 spawn subagent 就直接停**：绝不"在同一个 chat 里换个 prompt 模拟一遍"——那种 review 不叫 goldfish review，叫自欺欺人。
> 💡 **一句话理解本质**：**"上下文工程"的主流思路是给 Agent 更多上下文；EGM 的反常识创新是，给第二个 Agent 刻意地、结构性地断供上下文**——因为"不懂"才能挑出"懂的人看不见"的 bug。
---
## 四、上手门槛与部署体验
### 4.1 安装（按宿主 Agent 选）
```bash
# Claude Code（推荐 2.1.271+，否则无法保证 subagent 真隔离）
claude plugin marketplace add google/elephant-goldfish-model
claude plugin install egm@egm
# Codex CLI
codex plugin marketplace add google/elephant-goldfish-model
codex plugin add egm@egm
# Antigravity CLI
agy plugin install https://github.com/google/elephant-goldfish-model
```
来源：官方 README。
> ⚠️ **避坑 1**：**必须安装完整 plugin，不能只拷 `skills/` 目录**——skills 在运行时会去 `agents/` 读 persona、去 `resources/document_standards/` 读 rubric，残缺安装直接报错。
> ⚠️ **避坑 2**：装完后**必须新开一个 session**，旧会话里 plugin 命令不会生效。
> ⚠️ **避坑 3**：Antigravity CLI 1.4.8 上命令补全有 bug（issue #196），1.4.10 才修复——**手打时记得带 `/egm:` 前缀**。
### 4.2 60 秒最小可用 Demo
不需要新写 spec，对一份已有文档开火即可：
```
/egm:egm-review docs/designs/webhooks.md
```
EGM 会 spawn 5 类 goldfish，每个从零读你的 markdown + 它引用的源码，输出 5 份独立 review report。**这是一个非常狠的体检**——如果某个 finding 让你"惊讶"，那恰恰证明：**不完整的是文档，不是 reviewer**。
如果想试全流程，仓库 README 自带的示例需求是 *"Add webhook delivery to this project"*——典型的高歧义、多失败场景需求，正好是 goldfish 最能发挥的地方。
### 4.3 社区活跃度
- **202 commits、~1,400 forks、本周新增 5.5k stars**——维护非常活跃；
- Issue #237 已经公开记录一个重要 bug：**Codex reviewer 会泄漏 `AGENTS.md`**，破坏 goldfish 的"零上下文"前提——这是目前最需要警惕的 known issue；
- 项目自身的 `AI_POLICY` 要求：外部贡献者提交 PR 前，**必须先用 EGM 自己的命令写一份 EGM 设计文档**——这是一种罕见的"吃自己的狗粮到极致"的做法；
- Google Open Source Blog 已为其发布专门介绍。
---
## 五、目标人群与真实收益
### 5.1 谁应该立刻用
| 人群 | 收益 |
|------|------|
| **Claude Code / Codex 重度用户** | 把"先聊 1 小时再写代码"的隐性流程，变成"先出 spec 再动手"的强制 SOP |
| **要在老代码库里加新子系统** | `egm-bootstrap` 自动生成 README hierarchy，给大象一份"地图" |
| **长期维护的设计文档** | `egm-drift-report` 每周跑一次，告诉你 spec 哪里跟代码脱节了 |
| **教学/独立开发者** | UMD CMSC389A 已经把它列入正式课程第 14 章，对"为什么不能 one-shot"有详细论证 |
| **Agent Workflow 设计者** | 可以**只偷学这个范式**——"独立零上下文评审者"比"长自我批评"更容易推理 |
### 5.2 谁不应该碰
- 只是改个 typo、加一行 log 的小 bug fix——**官方 FAQ 原话**："For a small, clear bug fix, use your normal workflow"；
- **没有 subagent 能力的轻量级 Agent**（早期 Cursor / 部分简易 CLI）——EGM 会直接拒绝 review；
- **想用它替代单测**——README 明确说"a review does not replace tests or human judgment"。
---
## 六、竞品对比：EGM 在 Spec-Driven Development 阵营里的位置
Marktechpost 横向对比了目前主流的 Spec-First 工具：
| 维度 | **Google EGM** | GitHub Spec Kit | Kiro Specs | Superpowers |
|------|---------------|----------------|-----------|-------------|
| 类型 | Plugin（skills + personas） | Toolkit + Specify CLI | IDE/CLI/Web 内置功能 | Skills Plugin |
| License | Apache 2.0 | MIT | 商业（订阅） | MIT |
| 工作流 | Brainstorm→Draft→Review→Drift | Constitution→Specify→Plan→Tasks→Converge | Requirements→Design→Tasks | Brainstorm→Plan→Subagent Build→TDD→Review |
| **Spec 由零上下文子 Agent 审？** | ✅ **是，5 阶段、写代码之前** | ❓ 未披露 | ❓ 仅 Analyze Requirements | ❌ 子 Agent 只在实现层隔离 |
| 宿主 | Antigravity / Claude Code / Codex / ChatGPT 等 | Copilot 及其他 Agent | 仅 Kiro | 16 个 harness |
| 成本 | 免费 plugin，吃宿主模型 token | 免费工具，吃宿主 token | 订阅 | 免费 plugin，吃宿主 token |
**EGM 的真正差异点只有一句话**：Spec Kit 和 Kiro 把"评审"留给人类在阶段之间做；Superpowers 把子 Agent 隔离留到实现阶段。**只有 EGM 在"写任何代码之前"的 spec 阶段，强制塞进 5 个零上下文 AI 评审者**。
> 💡 **选型建议**：如果你已经在用 Claude Code 且写了 spec 但经常被 reviewer 漏掉细节，EGM 是最低成本的补强；如果你想要完整 SDD 工具链（constitution、tasks、converge），Spec Kit 更合适；如果你只想要"实现阶段多 Agent 协作"，Superpowers 更轻。
---
## 七、局限与不足：官方都没避讳的几个坑
这部分要写得毫不客气，因为**这些坑在 EGM 自己的文档和 issue 里都明晃晃写着**。
### 7.1 Token 成本是真实的、且不小
- 一次完整 review 会 spawn 5-6 个 fresh reviewer，每个都从零读你的 spec + 引用源码；
- 低订阅额度用户（Claude Pro 5x、Codex 免费档）容易一次跑爆 quota——**实测中 Claude Cowork 在第 5-7 阶段就触发了 usage limit 截断**；
- 官方 FAQ 不给" productivity improvement"的承诺，只说"Completing the EGM workflow alone does not demonstrate a productivity improvement"——这是工程文化里非常罕见的诚实。
### 7.2 隔离性并非 100% 可靠
- **Issue #237**：Codex 上 reviewer 会把 `AGENTS.md` 泄漏进上下文；
- Claude Code 需要 ≥2.1.271 才有"verified isolation"，老版本没有保证；
- 跨宿主移植时（比如 Cline），**必须自己确认 subagent 真的是 fresh context**，否则"金鱼"变"读过日记的金鱼"，整个方法论就崩了。
### 7.3 反馈量是"设计出来的过量"
官方明文说 review 输出**比你想要的更多**——5 类 reviewer 各自跑，会有大量 Nit 级噪音。你需要用 `/egm-resolve` 自己挑——这是个体力活，不是魔法。
### 7.4 没有任何 Benchmark
- 官方仓库和 Google Open Source Blog **都没有发布"goldfish review 能抓多少真实 bug"的量化数据**；
- 唯一的"证据"是 Codex 端到端跑通时长（573s / 482s）和 adoption 数据；
- 这是 Agent 工具的普遍痛点，但用户应心里有数：**它是一份 plausible 的工作流，不是被验证有效的工程方法**。
### 7.5 文档体量与学习曲线
- README 简洁，但 `docs/designs/architecture.md`、`review.md`、UMD 的 14 章（超过 100 节）才是真正理解它的入门材料；
- 对完全没用过 subagent 的开发者，"为什么不能 one-shot 写 spec"这种"反直觉"需要内化——UMD 课程甚至专门写了一节 "The Sycophant Challenge" 教你怎么把模型从谄媚螺旋里拽出来。
### 7.6 不是官方产品
它挂在 `google/` org 下，但 README 明确免责。**Google 不承诺维护、不承诺 SLA、不承诺安全审计**——用在关键 production 流程里要有这个心理预期。
---
## 八、结语与行动建议：一篇真正的"使用决策"
> **终极评判**：EGM 不是"又一个 AI Coding 工具"，而是**这个阶段少有的、由工程师为工程师写的"AI 协作方法论"**。它的全部价值不在代码，而在那个看似简单的洞察——**"让不懂的人 review，比让懂的人 review 更能找到 bug"**。
### 给不同人的最小行动方案
| 你的情况 | 今晚就做这件事 |
|---------|---------------|
| 用 Claude Code ≥2.1.271 | 跑两条命令安装 → 拿你最近写的一份 spec 试 `/egm:egm-review` → 数一数有几次你被 reviewer 问住 |
| 用 Codex CLI | 同上，但留意 Issue #237（AGENTS.md 泄漏），重要场景先在小项目验证 |
| 用 Antigravity | `agy plugin install` 一条命令搞定，1.4.10+ |
| 都不用但写代码 | **别装 plugin，去读 Rensin 的论文**——把"Goldfish 协议"作为 prompt 模板放进你的工作流即可 |
| 教学/带团队 | 把 UMD CMSC389A 第 14 章当讲义，比读论文更适合新人 |
### 最后一句掏心窝的话
EGM 自己的 FAQ 里有句话，比它任何功能都值得记住：
> "Regardless of the tool you choose, please remember: **You own the outcomes.**"
工具是流程的载体，决定代码质量的永远是人——但 EGM 至少把"该问的问题"提前塞到了你面前，让你在按下 Implement 之前，**被迫当一次更清醒的工程师**。
仅此而已，也足够了。
---
**参考来源**：本评测所有事实、命令、对比、issue 编号均来自 Google 官方仓库（README / architecture.md / faq.md）、Marktechpost、MindStudio、Beri.net、ExplainX、UMD CMSC389A 课程讲义、Level Up Coding、Towards AI 等公开资料，检索截止 2026-11-13。
