# garrytan/gbrain

[GitHub URL](https://github.com/garrytan/gbrain)


## GBrain 深度评测：YC 总裁 Garry Tan 开源的 AI Agent 记忆系统

> GBrain 是 YC 总裁开源的 AI Agent 本地记忆系统，让 Claude Code 等智能体真正拥有跨会话长期记忆

- **Tags**: AI Agent, MCP, 知识库, 开源项目, 本地优先
- **Category**: AI 编程, 开发工具, 知识管理

## Details

# GBrain 深度评测：YC 总裁 Garry Tan 开源的 AI Agent 记忆系统
> **一句话总结**：GBrain 是 Y Combinator 总裁 Garry Tan 为自己的 AI Agent 打造的"第二大脑"——一套 MCP 原生、Markdown 优先、本地优先的开源 Agent 记忆层，让 Claude Code / Codex / Cursor 等智能体真正拥有跨会话、可追溯、可共享的长期记忆。它不是又一个向量数据库封装，而是把"知识复利"作为设计目标的系统级方案。
---
## 一、背景与痛点：为什么需要"给 Agent 装大脑"
所有 LLM Agent 都有一个结构性缺陷：**模型本身不会在两次会话之间保留任何东西**。今天它学到关于你客户的偏好、项目的上下文、你说话的风格，明天就全部归零——除非外部有一个"东西"替它记住。
这正是 2026 年"Agent Memory"赛道的核心痛点。当下的 RAG 方案大多停留在"找出最相关的 10 个 chunk"，本质上是**搜索引擎思维**：找到材料，但把"读"和"组装"留给你。Garry Tan 在 YC 内部运营着自己的 Agent 集群——他要管理的不是几百条笔记，而是 **155,795 个页面、24,589 个人物、5,340 家公司、66 个后台 cron 任务**。
GBrain 就是他在生产环境里打磨出来、然后以 MIT 协议开源的解决方案。**项目于 2026 年 4 月 5 日发布，24 小时内斩获约 5,000 stars，截至当前累计已突破 26,000 stars**，是目前 Agent 记忆领域最热门的开源项目之一。
> **一句金句**：Search 找到的是"页面"，Brain 给你的是"答案 + 来源 + 我不知道什么"。
---
## 二、核心亮点与功能剖析
### 亮点 1：三层架构，"复利"是设计出来的，不是副产品
GBrain 最独特的地方在于：**它有三个互相强化的循环，让系统越用越聪明**。
**① 分层自动丰富**
- 一个人物第一次被提到 → 生成 Tier 3 存根页
- 跨 3 个不同来源被提到 → 自动升级 Tier 2，触发 web + 社交 enrichment
- 出现过会议、或 8 次以上提及 → 触发完整 Tier 1 流水线
- 不需要你告诉它"谁重要"，大脑自己学会。
**② Fail-improve 自进化循环**
每次 LLM 回退分类失败都会被记录，并从中生成更好的正则模式。**GBrain 越跑越便宜**——这与大多数 LLM 系统成本随时间膨胀完全相反。
**③ 反链加成排序**
被其他页面引用多的页面，检索权重自动提升。链接密度越大，高频关键页越容易浮出水面。
### 亮点 2：零 LLM 调用的"自织"知识图谱（这是真正的护城河）
每次向大脑写入内容，GBrain 用**纯正则和字符串匹配**抽取类型化实体关系——`works_at`、`invested_in`、`attended`、`founded`、`advises`——并自动织入知识图谱，**每条写入零 token 成本**。
这不是向量搜索能做的事。**"谁跟我们这家投资组合公司有关系？通过谁？"**是图遍历问题，不是语义匹配问题。
官方 BrainBench 数据（自报，240 页语料）：
- **P@5 = 49.1%，R@5 = 97.9%**
- 图谱层开启比关闭 **+31.4 点 P@5**
- 在生产脑上关系检索将 R@5 从 0.6626 提升到 0.7241
### 亮点 3：Synthesis 合成层 + Gap Analysis（最被低估的能力）
这是 GBrain 区别于一切 RAG 工具的关键。`gbrain think` 不仅返回答案，还会**主动告诉你"大脑还不知道什么"**——
- 哪个页面已经 6 周没更新（可能过期）
- 哪条结论没有引用支撑
- 哪两个页面在互相矛盾
- 哪里存在明显信息缺口，值得去问当事人
**这种"知道自己无知"的能力，往往比"知道得多"更值钱**。
### 亮点 4：24/7 "Dream Cycle" 知识卫生后台
知识库会腐烂——重复、引用断裂、互相矛盾。GBrain 用 cron 任务在夜里自动跑：
- 人物页去重
- 修复断掉的引用
- 打分 salience
- 检测矛盾
- 准备明天的任务清单
**"睡一觉起来比睡前更聪明"——这是 Garry Tan 的原话，也是这个产品的核心承诺**。
### 亮点 5：Markdown + Git 作为 Source of Truth（真正的所有权）
数据在你的本地数据库、以可读的 Markdown 形式躺在你的 Git 仓库里。你可以：
- `git diff` 查看 Agent 昨晚学到了什么
- 分支你的大脑，实验重组方案
- 数据库挂了 → 从 Markdown 仓库重建
- 没有任何 vendor lock-in
---
## 三、上手门槛与部署体验
### 安装一条命令，30 分钟可用
**⚠️ 重要避坑提示：GBrain 没有 npm 包，npm 上的 `gbrain` 是无关甚至恶意的同名包，千万不要 `npm install -g gbrain`**。正确姿势只有一条：
```bash
# 1. 通过 Bun + GitHub 直装（官方唯一推荐方式）
bun install -g github:garrytan/gbrain#stable
# 2. 一键接入 Claude Code 或 Codex
gbrain setup claude-code
# 或：gbrain setup codex
# 3. 无任何 Agent，单独跑 CLI（无 key、无 Docker、无 embedding）
gbrain init --pglite --no-embedding
gbrain import ~/notes/ --no-embed
gbrain search "a phrase from a note" --json
gbrain doctor  # 健康自检
```
**架构友好度**：默认 PGLite（嵌入式 Postgres 17 via WASM），**零配置、无需 Docker、无需外部 Postgres**。需要共享或大规模时再切到 Postgres + pgvector（Supabase 或自托管）。
### 双引擎、单一契约
```
Markdown 仓库 → Sync → Brain Engine
                       ├─ PGLite（个人脑，~50K 页）
                       └─ Postgres + pgvector（共享/大规模）
                ↓
        CLI / MCP ← Agent（Claude Code / Codex / Cursor / ChatGPT...）
                ↓
        Hybrid Search + Typed Graph → Synthesis → 带引用的答案
```
### 接入任意 Agent 的"万能咒语"
如果你的 Agent 不在官方支持列表里，把下面这段粘给它即可：
```
Add GBrain memory to this existing agent. Read and follow:
https://raw.githubusercontent.com/garrytan/gbrain/master/INSTALL_FOR_AGENTS.md
Keep my current identity and instructions, start keyless, and show me the
search-mode choice. Verify a remember/recall round trip with real GBrain calls.
```
### MCP 暴露到任何地方
```bash
gbrain mcp expose          # 通过 Tailscale tailnet 发布
gbrain mcp expose --funnel # 让 ChatGPT、Grok Bot 等云端 Agent 也能连
```
---
## 四、Demo / 真实效果演示（最关键的一节）
### 对比 1：`search` vs `think` —— 这是 GBrain 的灵魂
**场景**：明天要和 Alice 开会，想提前准备。
**传统 PKM 工具（`gbrain search`）的输出：**
```bash
gbrain search "what do I need to know before my meeting with Alice?"
```
返回 5 个最相关页面：
```
1. people/alice — Alice runs engineering at Acme...
2. meetings/2026-03-15-alice-q1 — Q1 product review...
3. meetings/2026-01-08-acme-kickoff — Kickoff meeting...
4. customers/acme — Acme is a series-B fintech...
5. notes/2026-04-22 — Quick chat with Alice about pricing...
```
然后你自己去读完这 5 篇。
**GBrain 的 `think` 输出（杀手锏）：**
```bash
gbrain think "what do I need to know before my meeting with Alice?"
```
```
Alice runs engineering at Acme (a series-B fintech). You last spoke
on April 22 in a quick pricing chat. Three things are still open
from that conversation:
1. She owes you the security review for the new tier
   (deadline was May 1; no update since).
2. You committed to pricing for a 500-seat tier
   (you sent it April 25; no response yet).
3. She mentioned they're hiring a CISO; you said you'd intro
   someone from your network.
Heads up: nothing's been added to the brain about Alice or Acme
since April 22, six weeks ago. She may have replied through email
or Slack DM, channels the brain doesn't see. Worth asking her to
catch up before assuming any of this is still current.
```
**每句话都有引用源页，结尾的"Heads up"明确告诉你哪里可能是盲区**。会议准备，一气呵成。
### 对比 2：图谱查询的天然优势
```bash
# 向量搜索答不了，图谱才能答的问题
gbrain think "who's working on AI agents at portfolio companies?"
# 配合 find_trajectory 可以一次追问：
# "这家公司指标怎么变 + 团队现状 + 承诺过什么 + 上次见面何时 + 我能提供什么价值"
```
### 对比 3：让 Agent 自动跑整合流水线
```bash
# Schema 自动适配你已有的笔记结构（不强制你换目录命名）
gbrain schema detect         # 聚类你的文件系统
gbrain schema suggest        # LLM 细化提议
gbrain schema review-candidates --apply  # 人工把关
gbrain schema use my-pack    # 激活
# 让 Agent 帮你干
"我的 schema 跟我的笔记对不上——从我的语料里提议新类型"
"把 lab results 加为一种新的页面类型"
```
---
## 五、目标人群与收益
### 谁最该立刻装上
| 人群 | 收益 |
|---|---|
| **Claude Code / Codex / Cursor 重度用户** | Agent 不再每次会话都从零开始，写代码的"项目脑"持续积累 |
| **创业者 / 投资人 / 销售负责人** | 会议准备从 30 分钟翻笔记变成 10 秒问一句"提醒我 X 是谁" |
| **研究者 / 写作者** | Markdown + Git 所有权，知识永远不被 SaaS 锁死 |
| **10-50 人小团队** | Company Brain 模式：全团队共享一个被授权分级的"机构记忆" |
| **AI Agent 开发者** | MCP 原生、30+ 工具、契约式 API，是研究 Agent Memory 设计的活教材 |
### 能解决的具体痛点
- **AI 失忆症**：今天聊完明天忘 → 跨会话、跨 Agent 共享同一份脑
- **RAG 只能给材料不能给答案** → think 命令给出合成答案 + gap analysis
- **关系型问题答不上来** → 类型化图谱免费织入，毫秒级图遍历
- **知识库腐烂** → Dream Cycle 自动去重、修引用、找矛盾
- **数据隐私焦虑** → 本地优先 + MIT + Markdown，你的脑永远是你的
---
## 六、竞品对比
| 维度 | **GBrain** | Mem0 | Hindsight | MemPalace | 传统 RAG (LangChain 等) |
|---|---|---|---|---|---|
| **定位** | 个人/小团队的"第二大脑" | 通用 Agent Memory API | 多租户 Agent 记忆平台 | 个人记忆助手 | 通用检索增强框架 |
| **数据所有权** | Markdown + Git，完全本地 | SaaS / 自托管均可 | 多租户 SaaS 设计 | SaaS 为主 | 取决于实现 |
| **图谱能力** | ✅ 类型化图谱，零 LLM 调用写入 | ⚠️ 弱 | ⚠️ 一般 | ❌ | ❌ |
| **合成层** | ✅ think + gap analysis | ⚠️ 部分支持 | ⚠️ 部分支持 | ⚠️ | ❌ |
| **MCP 原生** | ✅ 30+ 工具 | ⚠️ 需适配 | ⚠️ 需适配 | ⚠️ | ❌ |
| **多租户就绪度** | ❌ 单 operator 设计中心 | ✅ | ✅✅ | ⚠️ | 取决于实现 |
| **成本效率** | ✅✅ 抽取零 token | 中 | 中 | 中 | 中 |
| ** maturity** | v0.41.x，快速迭代 | 较成熟 | 较成熟 | 较成熟 | 成熟 |
| **适合谁** | 个人 Operator、追求知识复利 | 想要 SaaS 化 Memory API | 多租户 Agent 产品方 | 个人助手用户 | 通用 RAG 需求 |
**核心结论**：GBrain 是"个人脑"赛道的最强开源选择，但**它不是为多租户 Agent 产品设计的**——如果你做的是面向终端用户的 Agent 产品，应该看 Hindsight；如果你要的是托管 API，看 Mem0。
---
## 七、局限与不足（必须知道的几条）
### 1. 单 Operator 设计，不是多租户
GBrain 的设计中心是"一个人跑一个脑"。多客户端（OAuth 2.1 per-client scope）是一等公民，但**多 operator（不同用户、不同 brain、隔离保证）不是设计目标**。要做 Agent 产品服务成千上万的终端用户？结构上就不匹配。
### 2. 版本年轻，breaking change 频繁
当前 0.41.x，**版本迭代非常快，文档随时可能过时**。一次升级可能改变 schema、改 API。升级是你的责任，不是项目的。
### 3. 自托管 = 真实的运维工作量
数据库、同步调度、后台 enrichment 任务、embedding/reranker API key、版本管理——**"MIT 免费"指的是 license，不是 total cost**。Garry Tan 自己说"30 分钟装完"，但跑稳需要持续投入。
### 4. Benchmark 是项目自报的
BrainBench、R@5 97.9% 这些数字都来自项目自己的评测语料，没有第三方审计。**作为设计方向的参考有价值，作为绝对性能承诺需打折扣**。
### 5. 默认 embedding 走第三方 API
默认配置下，你的数据片段会发送到 Voyage/OpenAI 等第三方 embedding 服务。**对合规敏感的团队，必须显式切换到 Ollama / llama.cpp / LM Studio 本地推理**，否则就是隐私边界被打开了。
### 6. ⚠️ 最致命的坑：npm 同名包
`npm install -g gbrain` 会装到一个**与本项目无关的 squatted package**，shadow 掉真二进制。**必须也只能**通过 `bun install -g github:garrytan/gbrain#stable` 安装。装错了？跑 `gbrain doctor` 自救。
### 7. 集成广度偏窄（对非 OpenClaw/Hermes 用户）
GBrain 对 OpenClaw 和 Hermes Agent 是 first-class 支持，**其他 harness 都要自己写胶水代码**。如果你不用 OpenClaw/Hermes/Claude Code/Codex，集成成本会显著上升。
---
## 八、商业模式
| 方案 | 价格 | 适合 |
|---|---|---|
| **Self-host** | $0（MIT） | 技术能力强、想要数据完全掌控 |
| **Tools（CLI 单人）** | $19/月，7 天试用 | 不想管运维的个人用户 |
| **Personal（hosted）** | $49/月 | 单人、托管、跨设备 |
| **Team** | $199/月（含 $100 AI 用量） | 10-50 人团队共享 company brain |
| **Enterprise** | 议价 | 多团队隔离、合规需求 |
**性价比评价**：自托管版是真正的"免费午餐"，托管版价格在 AI 工具里属于中上——但 GBrain 的护城河是**Markdown + Git 的所有权**，自托管才是它的灵魂用法。
---
## 九、社区活跃度与生命力
- **发布**：2026 年 4 月 5 日，24 小时破 5K stars
- **当前**：约 26K stars，处于 Agent 生态第一梯队
- **更新节奏**：极快，每周多次 release，社区 PR 按波次批量合并（不逐个 merge，保证主分支稳定）
- **文档**：覆盖 architecture、guides、integrations、ethos、tutorials——**是开源项目里罕见的"自己为自己写了完整的设计书"**
- **态度**：营销文案诚实到罕见——**"R@5 0.9791 是 graph-oracle-parse 上界，不是产品分数"**这种自我泼冷水式标注，在开源圈非常难得
---
## 十、结语与行动建议
### 终极评判
**GBrain 是目前 Agent Memory 赛道里"个人脑"方向最值得投入时间研究的开源项目**——不是为了用而用，而是因为它把"知识复利"这件事真正工程化了：分层丰富 + 零 LLM 调用图抽取 + Dream Cycle 后台维护 + Markdown 所有权，这套组合拳在 2026 年的开源 Agent 生态里没有等价物。
**但它不是"所有 Agent 记忆问题的答案"**。单 operator 的设计中心、年轻的版本线、自托管的运维成本、自报的 benchmark，都是把它用对场景的前提条件。
### 给你的具体行动建议
1. **如果你是 Claude Code / Codex / Cursor 重度用户**：今晚就装上，跑 `gbrain init --pglite --no-embedding` 体验无 key 模式，30 分钟见真章。
2. **如果你是技术研究者 / 架构师**：重点读 `docs/architecture/` 目录（topologies.md、retrieval architecture、entity recall）——这是当前公开的最佳 Agent Memory 设计教材。
3. **如果你做 Agent 产品（多租户）**：跳过 GBrain，看 Hindsight 或自研。
4. **如果你关心合规 / 数据隐私**：装好后第一件事是切到 Ollama 本地 embedding + reranker，关掉 Voyage 默认。
5. **如果你只是想体验概念**：直接用 gbrain.io hosted 版（$49/月），跑两周再决定要不要自托管。
6. **绝对不要做**：`npm install -g gbrain`。这条写在你贴纸板上。
> **最后一句金句**：在 Agent 时代，"记住"不再是模型的内置能力，而是你为自己搭建的基础设施——GBrain 是目前最优雅、最便宜、也最"你的"那一份。
