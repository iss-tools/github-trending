# spotify/portal-ai-plugins

[GitHub URL](https://github.com/spotify/portal-ai-plugins)


## Spotify Portal AI Plugins 深度评测：让便宜模型替 Claude Code 打工的官方省钱方案

> Spotify 官方开源的 AI 编码插件市场，把大文件阅读等烧钱任务路由给廉价模型，实测节省 82-94% 的 token 成本。

- **Tags**: Spotify, Claude Code, Token优化, Backstage, AI插件
- **Category**: AI 编程, 开发工具, 开源项目

## Details

# Spotify Portal AI Plugins 深度评测：把"AI 编码里的笨重体力活"外包给便宜模型的官方解法
---
## 一句话总结
**这是 Spotify 官方开源的 Claude Code / Codex / Cursor 插件市场，其中 `shunt` 插件通过"AI 分工路由"机制，把 AI 编码助手最烧钱的"读大文件、写样板代码"这类 I/O 重活，偷偷转包给 Gemini 2.5 Flash 这类便宜的小模型，在 Java 单体仓库上实测节省约 82–94% 的 token 成本——它不是又一个 AI 编码工具，而是给现有 AI 编码工具"打补丁省钱"的基础设施。**
---
## 背景与痛点：AI 编码的钱都花在哪了？
### 一个反直觉的真相：AI Agent 大部分时间不在"思考"
Spotify 工程师在官方博客里抛出了一个扎心洞察：
> "AI 编码代理为我做的大部分事，不是思考，而是 I/O。读五个文件只为回答关于一个方法的问题；生成一个和旁边二十个测试文件长得一模一样的测试文件；开会后更新文档——成千上万的 token 烧掉了，几乎没有推理。"
这是一个非常重要的认知翻转。当你用 Claude Code 读一个 3000 行的 Java 文件时，你烧的是 Opus 级别前沿模型的输入 token，但那个动作根本不需要"前沿智能"——它只需要"眼睛"。这就是典型的**用爱因斯坦去买咖啡**。
### 账单焦虑已经真实发生
Spotify 引用的行业数据相当夸张：
- **到 2028 年，AI 编码成本预计将超过普通开发者的平均薪资**
- **25% 的工程负责人每月为每个开发者烧掉 200–500 美元 token 费**
- **有些团队已经单开发者月账单突破 2000 美元**
而与此同时，AI 编码的渗透率在 Spotify 内部"完全失控"地增长：超过 **99%** 的工程师每周使用 AI 编码工具，94% 报告生产力提升，PR 提交频率上升 76%。**用得越爽，账单越痛**——这是一个结构性矛盾。
### Spotify 自己的解题路径：从 Backstage 到 Portal 到 AiKA
要理解这个仓库的分量，得先理清 Spotify 的"平台工程三部曲"：
1. **Backstage（2020 开源给 CNCF）**：内部开发者门户（IDP）的鼻祖，把公司里所有微服务、文档、Owner、健康状态收进一张"软件目录"。
2. **Portal for Backstage（SaaS 版）**：Spotify 把自己用了多年的 Backstage 做成 SaaS 商业产品，提供免代码的插件管理界面。
3. **AiKA Modes（2026 推出）**：Portal 上的"声明式代理运行时"——你可以把它理解为 **"Agent 界的 AWS Lambda"**：写个 YAML 描述指令、选个模型、配好温度，Portal 帮你跑在一个临时执行环境里，用完即焚，不用管基础设施、不用管 API Key。
而这个 `portal-ai-plugins` 仓库，就是把这些能力用"插件"的方式塞进 Claude Code、Codex、Cursor 里——让这些 AI 编码 Agent 能直接"看到"你的软件目录、调用 Portal 动作，并且让便宜模型替昂贵模型打工。
**一句话理解它的设计哲学**：不是再造一个 AI 编码工具，而是给现有的 AI 编码工具做"成本优化的肾透析"。
---
## 核心亮点与功能剖析：两个插件，两套完全不同的故事
仓库目前主要有两个插件：**`portal`** 和 **`shunt`**。它们解决的问题完全不同，值得分开讲。
### 插件一：`portal`——企业软件目录的"AI 前台"
这个插件本质是把 Spotify Portal 的能力通过 CLI 暴露给 AI Agent，让 Agent 能回答"我们公司有哪些服务负责支付？这个服务当前 Owner 是谁？最近有没有 Incident？文档在哪？"这类问题。
它提供六个标准 Workflow：
| Workflow | 用途 |
|---------|------|
| `setup` | 配置 Portal CLI 认证 |
| `doctor` | 跑只读诊断，验证插件/CLI/认证/动作是否就绪 |
| `search` | 用自然语言搜索软件目录和技术文档 |
| `service` | 生成简明的服务运维简报（Owner、健康、事故、文档） |
| `actions` | 发现、检查、预览、安全调用 Portal 动作 |
| `feedback` | 给 Portal 团队提交反馈 |
它的价值场景很明确：**在大厂/中大型企业里，工程师每天在 20 个系统之间切换找"这个服务归谁管"这类元信息**。让 Claude Code 直接问 Portal，等于把"企业内部知识地图"塞进了 AI 编码工具的工作流。
底层就是一行命令：
```bash
npx @spotify/portal-cli <command>
```
`setup` 会验证 `auth`、`actions`、`owner`、`search`、`service` 这几个子命令是否可用。
### 插件二：`shunt`——真正的"杀手锏"，本文的主角
`shunt` 这个名字取得非常妙——"分流、变道"。它解决的问题前面已经说了：**把 AI Agent 的 I/O 重活外包给便宜模型**。
它的工作机制分三层，是个教科书级的工程设计：
#### **Layer 1：PreToolUse Hooks（强制拦截层）**
Claude Code 的 hook 机制会在每次工具调用前触发。`shunt` 注册了两个钩子：
- **`check-file-size`**：拦截每一次 `Read` 调用。如果文件超过阈值（默认 350 行，可通过 `SHUNT_MIN_LINES` 环境变量调整），就**阻止这次读**，并告诉 Claude"请改用 /bulk-reader 技能"。
- **`check-bash-read`**：拦截 `cat`、`head`、`tail`、`less`、`more` 等命令对大文件的调用。但**管道命令（如 `cat file | grep`）会放行**，因为那是带目的的定向读取。
**精妙之处**：阈值机制的设计哲学是"**定向读放行，漫读拦截**"。Claude 用 `Read(offset=100, limit=50)` 这种带偏移量的精准读，hook 不会拦——只有"我要把这个 3000 行文件全吞进来"这种行为才被重定向。
#### **Layer 2：Bash 脚本（委托执行层）**
两个核心脚本，包装 Portal CLI 调用：
```bash
# 把多个文件包进 XML 标签，发给 bulk-reader 模式，附上问题
bulk-read --question "What does this service do?" --paths src/Service.java src/Handler.java
# 把规格和参考文件发给 code-writer 模式，直接写入磁盘
code-write --spec "Write tests for UserService" \
           --reference tests/OrderTest.java \
           --target tests/UserTest.java
```
关键设计：**Claude 永远不看到生成的代码**——`code-write` 把产出直接写到磁盘，省掉的是"昂贵的输出 token"。
#### **Layer 3：Skills（提示引导层）**
两个 Markdown 格式的 skill 文件（`/bulk-reader` 和 `/code-writer`）告诉 Claude 何时、如何调用脚本。即使 Claude 不读 skill 描述，Layer 1 的 hook 依然会拦截——**这是个优雅的降级设计**。
### AiKA Modes：真正"承重墙"是它
如果把 `shunt` 看作一辆车，AiKA Modes 才是发动机。看一个 `bulk-reader` 的真实配置：
```yaml
name: bulk-reader
description: Bulk file reader for code analysis - delegates I/O from Claude Code
instructions: You are a precise code analyst. Read the provided files 
  and answer the question concisely. Output structured bullets only. 
  Lead every bullet with the exact name, type, or line number.
visibility: public
model: gemini-2.5-flash
resourceLimits:
  temperature: 0.2
tags:
  - coding
  - delegation
```
**几个值得咀嚼的细节**：
1. **`visibility: public` 意味着这两个模式对全公司共享**——你今天就可以直接用 Spotify 预先调好的版本，不用自己创建。
2. **`temperature: 0.2`** 体现了工程严谨：I/O 型任务不需要创造性，越稳定越好。
3. **instructions 里那句"Output only the code — no markdown fences"** 是踩过坑后的经验——没有这句，便宜模型会把代码裹在 \`\`\`markdown 围栏里，Claude 还得二次解析。
4. **模式解析是按 "你自己的 → 你团队的 → 公开的" 优先级**——fork 公开的 `bulk-reader` 改造后，你的版本自动优先，零配置。
Spotify 的总结句很值得记住："**AiKA modes 把模型路由从一个系统工程问题，变成了一个配置问题**。你不需要搭建基础设施，你只需要描述你想要什么，然后给它起个名字。"
---
## 上手门槛与部署体验
### 部署：三条命令，一分钟内完成
**Claude Code**：
```bash
claude plugin marketplace add spotify/portal-ai-plugins
claude plugin install portal@portal
claude plugin install shunt@portal   # 可选：token 省钱神器
```
然后新开会话，运行 `/portal:setup` 即可。
**Codex**：
```bash
codex plugin marketplace add spotify/portal-ai-plugins
codex
```
打开 `/plugins`，安装 Spotify Portal，开始任务后说 "Set up Spotify Portal for me"。
**Cursor**：在团队 marketplace 里注册 `spotify/portal-ai-plugins` 仓库，然后在 Cursor Settings → Plugins 里安装。
### 真正的门槛不在安装，而在**你得有 Portal**
这是评测必须诚实指出的：**`portal` 插件的所有功能都依赖一个 Portal 实例**。Portal for Backstage 是 Spotify 的商业 SaaS 产品——对于个人开发者或没部署 Backstage 的小团队来说，`portal` 插件基本用不上。
**但 `shunt` 有个巧妙的地方**：它需要 AiKA 插件启用的 Portal 实例，可 Spotify 把 `bulk-reader` 和 `code-writer` 两个模式做成了 **public**，理论上任何能连上 Portal 的 Claude Code 实例都能用。这对于 Spotify 客户是即插即用，对于非客户则构成了一个"**你得先买 Portal 才能用这个省钱插件**"的转化漏斗——这是 Spotify 明显的商业逻辑。
### 文档质量：优秀，但有"博客依赖症"
README 本身写得简洁清晰，但真正的深度内容在 Spotify Engineering Blog 那篇 9 月 3 日的博客里。仓库中的 `plugins/shunt/README.md` 也单独提供了说明。**文档质量高于 GitHub 平均水平，但小白需要额外读博客才能建立完整心智模型**。
---
## 真实案例演示：一个用户输入 vs AI 输出的对比
### 场景：让 Claude 回答"这个服务的哪些方法调用了数据库？"
**不用 shunt 的传统流程**：
```
用户：/src 目录下这个 Service 有哪些方法调用了数据库？
Claude Code 内部动作：
  → Read(src/Service.java)              # 1200 行 → 15,000 tokens 输入
  → Read(src/Repository.java)           # 800 行 → 10,000 tokens 输入
  → Read(src/Entity.java)               # 600 行 →  7,000 tokens 输入
  → Claude 推理 → 回答（500 tokens 输出）
Claude 消耗：约 32,500 tokens（全部是 Opus/Sonnet 级别价格）
```
**启用 shunt 后**：
```
用户：/src 目录下这个 Service 有哪些方法调用了数据库？
Claude Code 内部动作：
  → Read 调用被 check-file-size hook 拦截
  → Hook 返回："File exceeds 350 lines. Use /bulk-reader skill."
  → Claude 调用 bulk-read 脚本：
      bulk-read --question "Which methods call the database?" 
                --paths src/Service.java src/Repository.java
  → 脚本通过 Portal CLI 调用 bulk-reader 模式
  → Gemini 2.5 Flash 读文件（成本约 Claude 的 1/10）
  → 返回结构化 bullets
  → Claude 读 bullets（约 800 tokens）→ 回答
Claude 消耗：约 2,000 tokens（Gemini 那部分另算，但便宜一个数量级）
节省：约 90-94%
代价：多等 10-30 秒
```
### 实测基准数据
Spotify 在 Java 单体仓库上跑了 4 个场景，**平均节省约 90%**，整体范围在 **82–94%** 之间。code-write 场景更难用 token 衡量——因为没有 shunt 时，Claude 既读参考文件又生成输出（双份贵价 token），shunt 模式下代码直接落盘，Claude 根本不看到生成结果。
---
## 目标人群与收益：谁该用？能得到什么？
### 🎯 强烈推荐（立刻装）
| 人群 | 收益 |
|------|------|
| **Spotify Portal 客户** | 这是官方插件，`portal` + `shunt` 双开，立刻把内部软件目录接入 AI 工作流 + 省 90% token |
| **Backstage 自建企业** | AiKA 模式思路可以直接借鉴，用自建 Backstage 实现"模型路由配置化" |
| **使用 Claude Code 的中大型团队** | 即使没有 Portal，shunt 的三层架构（hook → script → skill）本身就是一套可借鉴的 Claude Code 工程模式 |
| **被 token 账单折磨的工程负责人** | 那篇博客本身（不装插件）就值回票价——它给出了 AI 编码成本优化的清晰框架 |
### 🎯 值得学习（不必直接装）
| 人群 | 收益 |
|------|------|
| **AI Agent 工具开发者** | 学 PreToolUse hook 的拦截模式、如何设计优雅的降级路径 |
| **平台工程团队** | 学"声明式 Agent"这个抽象——把模型路由从系统工程变配置 |
| **Claude Code 重度用户** | 学怎么用 CLAUDE.md 之外的方式（hook）来**强制**而不是"建议" Claude 的行为 |
### ❌ 不适合
- **个人开发者/学生**：没有 Portal 实例，`portal` 插件完全用不上；`shunt` 的节省在小型项目上可能被 10-30 秒的延迟抵消。
- **主要做编辑/调试/架构设计的场景**：作者自己明确说这些场景不能委托——worker 模型**漏掉了一个 Claude 一眼就能看出的线程安全 bug**。
- **追求低延迟交互的用户**：每次委托都是一次网络往返，10-30 秒的延迟对小文件读取来说是负优化。
---
## 竞品对比：在"AI 编码成本优化"赛道里的位置
这个赛道 2026 年已经相当热闹，`shunt` 不是孤独的探索者：
| 方案 | 思路 | 优势 | 劣势 |
|------|------|------|------|
| **Spotify portal-ai-plugins (shunt)** | Hook 拦截 + Portal AiKA 模式路由到便宜模型 | 官方维护、声明式配置、企业级、模式可复用可共享 | 依赖 Portal 实例，有延迟，不能委托编辑 |
| **自建 CLAUDE.md 路由规则** | 在 prompt 里写"大文件请用 X 工具" | 零依赖 | **advisory 不是 enforced**，Claude 可以无视；每个项目要复制一份 |
| **Cursor / Claude Code 原生模型切换** | 手动切换模型档位 | 简单 | 靠人记忆，不能自动化 |
| **MCP Router 类方案** | 通过 MCP 协议路由到不同模型 | 协议标准化 | MCP 自身还在演进，prompt injection 风险在 2026 年 10 月刚被独立研究员证实可在多 Agent 间跳转 |
| **Together Link 等开源 CLI** | 把 Claude Code 路由到 open-weight 模型 | 免费、自主 | 需要自己运维模型，质量参差 |
**shunt 的独特竞争力**有两个：
1. **声明式 Agent（AiKA Modes）这个抽象层级**——它不是"在 Claude Code 里换模型"，而是"把模型路由做成一个可命名、可分享、可组合的企业级资产"。这是把 LLM Ops 从脚本时代推进到了配置时代。
2. **Spotify 的"自己先吃狗粮"背书**——99% 内部工程师每周使用 AI 工具的规模验证，比创业公司的 demo 有说服力得多。
**但它的天花板也明显**：这套方案在 Claude Code 生态内最优，Codex 支持还是初级的（shunt 只在 Claude Code 可用），Cursor 走的是完全不同的插件机制。
---
## 局限与不足：不回避的四个问题
### 1. **强绑定 Portal 生态，有商业漏斗嫌疑**
没有 Portal 实例，这两个插件基本没有用武之地。对于非 Spotify 客户，这套方案更像是一个精心设计的"**先免费给你看省钱效果，再让你买 Portal**"的转化工具。这不是坏事，但需要明确认知。
### 2. **三个"不能"是硬边界**
作者自己诚实地写了 "What doesn't work" 章节，这份坦诚值得点赞：
- **不能委托编辑**：worker 模型的摘要不含可靠的行号，Claude 需要编辑时还是得自己读那一节。
- **不能委托推理**：worker 模型在测试中漏掉了一个隐蔽的线程安全 bug，Claude 给对上下文后秒级发现。
- **不能委托小读取**：低于 350 行的文件，委托的网络往返延迟反而比直接读更慢。
这意味着 shunt **不是**一个"全程省钱的银弹"，而是一个"**特定场景下的精准工具**"。
### 3. **30 秒超时上限是个真实约束**
Portal 对单次调用硬性上限 30 秒。这意味着特别大的代码生成必须拆分成多次调用，增加了工程复杂度。
### 4. **社区生态还很年轻**
仓库 2026 年 7 月 23 日创建，到今天（2026 年 10 月）才三个多月。虽然背靠 Spotify，但第三方贡献的 modes / 插件生态还没形成，目前 essentially 是"官方一人食堂"。
---
## 结语与行动建议
**这个项目值得关注的真正原因，不是 shunt 省了 90% 的 token 这个数字**——数字会随模型价格战快速贬值（Claude Mythos 5.1 都降了 83% 了），而是它示范了一种思维范式：
> **把 AI 编码中的每一步动作做"智能定价"：能用便宜模型的不用贵模型，能强制的不靠建议，能声明式配置的不写代码。**
三个具体行动建议：
1. **如果你是 Spotify Portal 客户**：今天就装。这是官方开源、官方维护、官方背书的工具，没有不装的理由。三条命令，十分钟见效。
2. **如果你是 Claude Code 重度用户但不是 Portal 客户**：读这篇博客，学习它的**三层架构**（PreToolUse Hook → Bash 脚本 → Skill 文件）。这个模式完全可以脱离 Portal 复刻——用你自己的 API Key、用 Gemini CLI、用任何便宜模型都能实现类似的分流。**核心思想是"用 hook 强制路由"而不是"在 CLAUDE.md 里恳请"**。
3. **如果你是平台工程负责人**：认真研究 AiKA Modes 这个抽象。"声明式 Agent + 临时运行时 + 模式可复用/可分享/可组合"这三件套，可能是 2026 年企业 AI 工程化最重要的一次范式升级——它把模型路由从"每个团队自己写脚本"变成"平台组提供配置界面"。
**终极评判**：这不是一个"改变世界"的项目，但它是一个**极其精准地解决了一个真实且昂贵痛点**的项目。它不是给你新能力，而是把你已有的能力变便宜——而这种"变便宜"的工程智慧，往往比"变强大"更稀缺。8.5 / 10。
**项目地址**：[github.com/spotify/portal-ai-plugins](https://github.com/spotify/portal-ai-plugins) | **License**：Apache 2.0 | **官方深度解读**：[Portal by Spotify cut my Claude Code token usage by 90%](https://engineering.atspotify.com/2026/09/03/portal-by-spotify-cut-my-claude-code-token-usage-by-90/)
