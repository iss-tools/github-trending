# alirezarezvani/claude-skills

[GitHub URL](https://github.com/alirezarezvani/claude-skills)


## alirezarezvani/claude-skills：388个技能弹药库，一套代码通吃13款AI编程工具

> 目前规模最大、覆盖最广的Claude Code开源技能库，388个生产级技能+727个零依赖Python工具，一套代码适配Claude Code、Cursor、Codex等13款AI编程助手。

- **Tags**: Claude Code, 开源项目, AI Skills, 跨平台兼容, Prompt工程
- **Category**: AI 编程, 开发工具, 效率资源

## Details

# alirezarezvani/claude-skills 深度评测
> **一句话总结**：这是目前**规模最大、覆盖面最广、跨平台兼容性最强**的 Claude Code Skills 开源弹药库——388 个生产级技能、727 个零依赖 Python 工具，一套代码同时适配 Claude Code、Codex、Cursor、Gemini CLI 等 13 款主流 AI 编程助手，由一位深耕医疗 AI、持有 ISO 27001 认证的柏林 CTO 以个人之力维护，已斩获 **26,529 Stars / 3,739 Forks**。
---
## 一、背景与痛点：Claude Code 的"技能生态"为何需要这个仓库
要理解这个仓库的价值，得先理解 Anthropic 在 2025 年推出的 **Skills 机制**。
**一个贴切的比喻**：Claude 本身是一位天赋极高、见多识广但"没有你公司工牌"的外包专家。你可以把任务交给他，但他不知道你公司的代码规范、不知道 MDR 医疗器械法规长什么样、不知道你团队用 Terraform 还是 Pulumi。而 **Skill 就像给他塞进公文包的一套"岗位 SOP 手册"**——一个文件夹里放一份 `SKILL.md`（工作流指令），加上可选的 Python 脚本和参考文档，AI 一旦匹配到对应场景，就会按手册办事。
**痛点由此而生**：
- Anthropic 官方仓库 `anthropics/skills` 只发布了文档处理类 skill（Word/Excel/PPT 等），覆盖工程、市场、合规等领域的**生产级技能几乎空白**；
- 社区虽有 `awesome-claude-code` 等聚合列表，但多数只是"链接收藏夹"，没有统一格式，无法一键安装；
- 不同 AI 编程工具（Cursor / Codex / Aider）的 Skill 格式互不兼容，重复造轮子严重。
**alirezarezvani/claude-skills 正是为填补这片空白而生**——它不是"又一个合集"，而是一个**带标准化 SKILL.md 协议、内置可执行 Python 脚本、跨 13 平台自动转换格式**的完整生态。
---
## 二、作者与社区：一个人的"超级工厂"
作者 **Alireza Rezvani** 的履历本身就是这个仓库内容质量的背书：
| 维度 | 信息 |
|---|---|
| 身份 | 柏林医疗科技公司 **LINDERA** 工程负责人 |
| 技术年限 | 22 年（12 岁开始写代码） |
| 核心领域 | 医疗 AI（跌倒预测，服务德/荷/奥/西 80+ 护理机构）、**MDR 认证**、**ISO 27001 合规** |
| 内容影响力 | Medium 3,200+ 订阅，GitHub 26K+ Stars |
**这个背景解释了仓库的两个独特气质**：
1. **为什么合规/法规类 Skill 这么硬核**——`ra-qm-team/` 下有 19 个技能专门处理 MDR 2017/745、FDA、ISO 27001、GDPR、SOC 2，这在其他 Claude 仓库里几乎绝迹，因为普通开发者根本接触不到这些场景，而 Rezvani 是真的在医疗科技一线做合规的人。
2. **为什么 C-Level Advisory 能铺满整个 C-Suite**——46 个技能覆盖 CEO/CTO/CFO/CMO/CISO 等 13 个高管视角，外加"founder-mode"下的 22 个 `cs:*` 命令，明显是单人创业者在长期 solo 工作中沉淀下来的方法论。
---
## 三、核心亮点：三个"人无我有"的设计
### 亮点 1：727 个零依赖 Python 工具 —— 真正的"开箱即跑"
这是整个仓库**最被低估的工程亮点**。绝大多数 Skill 仓库只给 Markdown 指令，而这个仓库给每个 Skill 配套了**只用 Python 标准库**的 CLI 工具，**零 pip 安装**：
```bash
# SaaS 健康度计算器
python3 finance/saas-metrics-coach/scripts/metrics_calculator.py \
  --mrr 80000 --customers 200 --churned 3 --json
# 品牌语调分析
python3 marketing-skill/content-production/scripts/brand_voice_analyzer.py article.txt
# 技术债务评分
python3 c-level-advisor/cto-advisor/scripts/tech_debt_analyzer.py /path/to/codebase
# RICE 优先级排序
python3 product-team/product-manager-toolkit/scripts/rice_prioritizer.py features.csv
```
**这解决了什么问题**：纯 Prompt 型 Skill 在企业内网、air-gapped 环境、Windows 老旧机器上经常因依赖问题崩掉；纯标准库脚本则**任何有 Python 的地方都能跑**——这是作者长期做企业级交付养成的习惯。
### 亮点 2：13 平台一套代码 —— `convert.sh` 的"格式翻译器"
这是全仓库**最具差异化竞争力**的能力。Skill 格式在各个工具间互不兼容：
| 工具 | Skill 格式 | 安装命令 |
|---|---|---|
| Claude Code | 原生 plugin | `/plugin marketplace add alirezarezvani/claude-skills` |
| OpenAI Codex | `~/.codex/skills/` | `npx agent-skills-cli add alirezarezvani/claude-skills --agent codex` |
| Cursor | `.mdc` 规则 | `./scripts/install.sh --tool cursor --target .` |
| Aider | `CONVENTIONS.md` | `./scripts/install.sh --tool aider --target .` |
| Gemini CLI | 原生 skill | `./scripts/gemini-install.sh` |
| Windsurf / Kilo Code / OpenCode / Augment / Antigravity | 各自目录 | `./scripts/install.sh --tool <name>` |
一键全量转换只需：
```bash
./scripts/convert.sh --tool all   # 15 秒内生成所有平台的镜像目录
./scripts/install.sh --tool cursor --target /path/to/project
find .cursor/rules -name "*.mdc" | wc -l  # 验证：应输出 346
```
**这意味着**：今天用 Claude Code，明天团队切换 Cursor，你不需要重写任何 Skill——这种"反供应商锁定"的设计在 2026 年多模型混战的格局下极具战略价值。
### 亮点 3：Skill Security Auditor —— 给弹药库装一把"保险栓"
v2.0 引入的 `skill-security-auditor` 是个反身性设计——**用 Skill 仓库自身的安全 Skill 去扫描其他 Skill 是否有恶意代码**：
```bash
python3 engineering/skill-security-auditor/scripts/skill_security_auditor.py /path/to/skill/
```
扫描维度涵盖命令注入、代码执行、数据外泄、**Prompt Injection**、依赖供应链风险、权限提升，返回 `PASS / WARN / FAIL` 加修复建议。
**为什么这点重要**：第三方 Skill 本质是"你允许 AI 执行的指令包"，一个恶意 Skill 可以诱导 AI 执行 `rm -rf` 或上传 `.env`。Skill Directory 类平台统计显示野外 36% 的 Skill 存在安全隐患。这个仓库自带安全审计工具，说明作者对生态风险有清醒认知——这是**社区仓库里罕见的"生产级自律"**。
---
## 四、技术架构：Skill 是怎么"长出来"的
每个 Skill 都遵循**统一的目录协议**（这也是 agentskills.io 的 SKILL.md 标准）：
```
engineering/zero-hallucination-coder/
├── SKILL.md          # frontmatter + 结构化指令（核心）
├── scripts/          # 可执行 Python 工具
├── references/       # 模板、检查清单、领域知识
└── assets/           # 静态资源
```
`SKILL.md` 的 frontmatter 通常包含 `name`、`description`（含触发关键词）、`version` 等元数据，正文则是**分阶段的工作流指令**。比如 `zero-hallucination-coder` 的核心流程被压缩成一行心法：
> **Discuss → Map → Decompose → Execute → Verify**
这是对"AI 一上来就乱写代码"的解药——强制 AI 先讨论、再画图、再拆解，最后才动笔并自检。
**仓库还内置了一套轻量的"编排协议"**，用于跨域任务：
| 模式 | 适用场景 |
|---|---|
| Solo Sprint | 独立开发者，按阶段切换 Persona |
| Domain Deep-Dive | 一个 Persona + 多个 Skill 堆叠（如架构评审） |
| Multi-Agent Handoff | 多个 Persona 互相 review（高风险决策） |
| Skill Chain | 纯流水线（内容生产） |
**一个 6 周产品发布的编排示例**：
```
Week 1-2: startup-cto + aws-solution-architect + senior-frontend  → 构建
Week 3-4: growth-marketer + launch-strategy + copywriting + seo-audit → 筹备
Week 5-6: solo-founder + email-sequence + analytics-tracking  → 发布迭代
```
这种"把项目管理方法论直接编码进 Skill 编排"的做法，比裸 Prompt 工程高一个维度。
---
## 五、上手门槛与部署体验
### Claude Code 路径（推荐，最丝滑）
```bash
# 1. 在 Claude Code 内添加 marketplace
/plugin marketplace add alirezarezvani/claude-skills
# 2. 按需安装领域包（不用一次装全部！）
/plugin install engineering-skills@claude-code-skills              # 24 个核心工程技能
/plugin install engineering-advanced-skills@claude-code-skills     # 25 个 POWERFUL 级
/plugin install marketing-skills@claude-code-skills                # 43 个营销技能
/plugin install c-level-skills@claude-code-skills                  # 28 个高管咨询
# 3. 或单装某个技能
/plugin install skill-security-auditor@claude-code-skills
/plugin install playwright-pro@claude-code-skills
/plugin install self-improving-agent@claude-code-skills
```
### 手动路径（通用兜底）
```bash
git clone https://github.com/alirezarezvani/claude-skills.git
# 把任意 Skill 文件夹复制到对应目录
cp -r claude-skills/engineering-team/<skill-name> ~/.claude/skills/   # Claude Code
cp -r claude-skills/engineering-team/<skill-name> ~/.codex/skills/    # Codex
```
### Windows 用户避坑指南
仓库专门为 Windows 写了 Installation Notes，两个**必踩的坑**提前告诉你：
```bash
# 必须开启 Developer Mode 并用 symlinks 模式 clone，
# 否则 .gemini/ / .codex/ 镜像树会变成 1 行文本指针，Skill 全部失效
git clone -c core.symlinks=true https://github.com/alirezarezvani/claude-skills.git
# 设置 UTF-8，避免部分打印 Unicode 的工具在 GBK 控制台崩溃
set PYTHONUTF8=1
```
**文档质量评分：8.5/10**。README 信息密度极高（甚至偏高），安装文档、CHANGELOG、CONTRIBUTING 齐备，但缺一个独立的 Docs 站点——目前全部依赖 GitHub 阅读，对小白稍显吃力。
---
## 六、淘金摘优：5 个最值得单独拿出来吹的 Skill
从 388 个技能里，我挑出 5 个**最具"复用价值 × 创新度"**的，这是你即使不装整个仓库也该抄走的部分：
### 🥇 `zero-hallucination-coder`（工程 POWERFUL）
**反幻觉编程五步法**：Discuss → Map → Decompose → Execute → Verify。强制 AI 在写代码前先和你对齐需求、画架构图、拆子任务，每个阶段有明确的"过门条件"。对**长任务、遗留系统改造**场景能显著减少"AI 自信地写出错误代码"的概率。
### 🥈 `agent-memory`（工程 POWERFUL）
**四层 L0-L3 记忆阶梯**，架设在 Claude Code 的 hooks 之上。核心规则设计得很克制：记忆"晋升"必须经过**跨 session、跨天复现**的验证，有争议或含敏感信息的声明会被拒绝晋升，**任何内容写入 `CLAUDE.md` 都必须人工 adopt**。这是把 Memory Engineering 真正当成一门工程学来做的实现，比"无脑记笔记"的方案安全得多。
### 🥉 `skill-security-auditor`
前文已详述。**它本身就是一份开源的 Skill 安全审计 checklist**，即使你不装这个仓库，也值得把它的扫描脚本复制到自己的 Skill 工作流里——社区生态尚无强制安全门槛，这是你唯一能依赖的"自保武器"。
### 🏅 `book-to-skill`（知识工程化神器）
**把一本书、一个 docs 文件夹、一组 spec 文档编译成一个可安装的 Skill**。比如你可以把《Designing Data-Intensive Applications》编译成 `ddia-book` Skill，让 Claude 在讨论分布式系统时自动引用书中的原则。**这是个人知识库 → AI 能力的最短路径**，目前几乎没有同类实现。
### 🏅 `aeo`（Answer Engine Optimization，营销组）
**E-E-A-T 审计 + 跨 5 个 LLM 的引用追踪**。在 ChatGPT、Perplexity、Claude 等成为新流量入口的时代，传统 SEO 已经不够——你还需要让 LLM 在回答问题时**主动引用你的内容**。这个 Skill 把 AEO 从概念做成了可执行的 workflow，属于**抢占下一波流量红利**的早期工具。
---
## 七、竞品对比：它在 Claude 生态里的坐标
| 维度 | **alirezarezvani/claude-skills** | **anthropics/skills**（官方） | **awesome-claude-code** | 其他 Skill Directory 类站点 |
|---|---|---|---|---|
| Stars | **26.5K** | 官方背书 | 数千级 | 平台聚合 |
| 数量 | 388 个 Skill + 727 个脚本 | 文档处理为主 | 链接合集 | 数千但质量参差 |
| 格式 | SKILL.md 标准 + 跨 13 工具 | SKILL.md | 无统一格式 | 各家不一 |
| 安装体验 | `/plugin install` 一键 | 手动复制 | 手动跳转 | 一键但需注册 |
| Python 工具 | ✅ 727 个零依赖 | ❌ 极少 | ❌ | 少量 |
| 合规/法规覆盖 | ✅ **MDR/FDA/ISO/GDPR/SOC2** | ❌ | ❌ | ❌ |
| 安全审计 | ✅ 自带 | ❌ | ❌ | 第三方扫描 |
| 维护方 | 个人作者 | Anthropic 官方 | 社区 | 商业公司 |
| 商业风险 | 个人带宽 | 稳定 | 低 | 服务可能收费/关闭 |
**结论**：**官方仓库是"标准制定者"，这个仓库是"最大实践者"**。如果你只需要处理 PDF/Excel，用官方就够了；如果你需要一个能真实用于生产、覆盖合规与商业全场景的"瑞士军刀"，这个仓库目前没有对手。相比 awesome-claude-code 这种"目录页"，它是**可直接消费的成品**；相比 Skills Directory 类商业平台，它是**MIT 协议、可自行审计源码的开放生态**。
---
## 八、客观短板：这 5 个坑你要有心理准备
1. **Skill 数量 vs Token 成本的悖论**  
   388 个 Skill 听起来很爽，但每个 Skill 的 `description` 都会进入 AI 的候选池。**装得越多，上下文越膨胀，响应越慢、成本越高**。正确姿势是**按需安装**——只装当前项目相关领域的 10-20 个，而不是 `/plugin install all`。
2. **质量分层明显**  
   25 个 "POWERFUL tier" 是精品，但长尾的技能里存在明显的"模板感"——尤其是 C-Level Advisory 里的 46 个高管视角技能，**很多本质是同一套 Prompt 换个身份前缀**，实际增益参差不齐。别被数字迷惑，优先看 POWERFUL tier 和 Recently Enhanced 列表。
3. **Bus Factor = 1 的长期风险**  
   这是**个人维护的仓库**，不是基金会项目。虽然现在每月活跃更新（最后 push 2026-08-30），但一旦作者工作重心转移（比如 LINDERA 业务压力），仓库可能进入"低维护"状态。**建议：fork 一份自留，关键 Skill 下载到本地归档**。
4. **C-Level / 合规类 Skill 的"幻觉陷阱"**  
   MDR 2017/745、FDA 合规这类内容，Skill 提供的是**决策框架和检查清单**，不是法律意见。真实合规决策仍需咨询专业顾问——Skill 能帮你"结构化地提问"，不能替你"签字担责"。
5. **缺独立文档站 & 学习曲线偏陡**  
   所有知识压缩在 README 和各 Skill 的 SKILL.md 里，**没有官方 Docs 站点、没有视频教程**。对 Claude Code 完全零基础的用户，建议先看 Anthropic 官方的 Skills 文档再回来用这个仓库。
---
## 九、结语与行动建议
**综合评级：⭐⭐⭐⭐½（4.5/5）**——这是一个**理念超前、工程扎实、覆盖无死角**的项目，扣半星是因为个人维护风险和部分 Skill 的模板化倾向。
### 分人群行动清单
**👨‍💻 独立开发者 / Solo Founder**
直接走完整安装路径，**必装**：`engineering-skills` + `engineering-advanced-skills` + `productivity` + `business-growth-skills`。配合 `startup-cto` Persona 和 `Solo Sprint` 编排模式，这是**一个人当一支团队用的最完整武器库**。
**🏢 企业工程团队 / 架构师**
重点取用：`POWERFUL tier` 里的 `rag-architect`、`database-designer`、`ci-cd-pipeline-builder`、`tech-debt-tracker`，以及 `skill-security-auditor` 作为团队 Skill 治理工具。**合规团队**可以重点评估 `ra-qm-team/` 和 `compliance-os/`，这是市面上唯一开源的医疗/金融合规 Skill 资产。
**📊 产品 / 市场 / 增长从业者**
`marketing-skill/` 的 49 个技能 + `product-team/` 的 17 个技能可以独立安装，**不必碰工程部分**。`aeo`（LLM 引用优化）是 2026 年内容营销的早期红利工具，值得单独研究。
**🧪 研究者 / 学术党**
`research/` 下的 `litreview`、`grants`（NIH 基金申请）、`patent`、`deep-research` 组成了完整的学术工作流，配合 `book-to-skill` 可以**把自己读过的论文集编译成个人研究 Skill**。
**⚠️ 所有人的共同建议**：
- **不要一次装满**，按项目领域增量安装；
- **每次安装前用 `skill-security-auditor` 扫一遍**（尤其装第三方 Skill 时）；
- **fork 一份**到自己的账号下，规避 upstream 消失的风险；
- Windows 用户务必按 Symlinks 指引操作，否则会以为"装了但没用"。
在 AI 编程工具生态割裂、Skill 标准尚未统一的 2026 年，这个仓库用实际行动证明了**"一套知识、处处可用"**的可能性——无论你是否最终采用它，它的目录结构、跨平台转换脚本和安全审计思路，都值得你扒下来当模板抄。
