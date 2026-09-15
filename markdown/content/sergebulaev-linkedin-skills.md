# sergebulaev/linkedin-skills

[GitHub URL](https://github.com/sergebulaev/linkedin-skills)


## linkedin-skills：基于 Claude 的 LinkedIn 营销自动化技能包

> 一套基于 Claude 的 LinkedIn 营销技能包，支持自动发文、评论、审校及互动监控，助你高效构建个人品牌。

- **Tags**: GitHub, Claude, LinkedIn, 自动化, 内容营销
- **Category**: 社交媒体运营, AI 编程, 效率工具

## Details

# linkedin-skills 深度评测
一句话总结  
linkedin-skills 是一套面向 Claude（Code/Codex/Desktop/Web）的 LinkedIn 营销技能包，包含 11 个技能与轻量 Python 工具层，帮你用自然语言驱动“起草—审校—发布”的全流程，且始终保留“人审后发布”的批准卡。它把常见的 LinkedIn 运营动作（发文、评论、评论回复、人设/资料优化、内容排期、互动跟踪、跨平台内容复用等）变成可重复调用的技能，同时兼容 Apify 读数据、Publora 发帖、Pixfaro 生成配图等三方服务，整体采用 MIT 协议、无需注册即可开始使用（草稿模式）。
## 背景与痛点：为什么会出现这个项目？
- 痛点 1：批量产出≠有效产出。大部分人用 AI 代写 LinkedIn，容易得到“同质化模板文”，触发平台“slop 过滤”或被读者一眼识别为 AI 味，影响个人/公司形象。  
- 痛点 2：缺乏“人审卡”。许多一键发布工具缺少中间审核环节，容易造成失当内容直接外发，风险高。  
- 痛点 3：互动运营碎片化。评论、追评、评论区的作者回复追踪、互动对象（谁是潜客、同行、大号）的分类复盘，很难在单一工作流里完成。  
- 痛点 4：内容系统化缺失。缺乏稳定的 7 天排期、人设与品牌声音配置、选题库与钩子公式等“工程化”支撑，运营依赖个人感觉，难以持续。  
- 痛点 5：与开发者工作流割裂。习惯在终端/IDE 里工作的工程师，不愿频繁切换到浏览器里去复制粘贴或使用 SaaS 面板。
linkedin-skills 的定位是“内容工程（Content Engineering）”——用 Claude 做写作层，用技能与工具层把“读数据—决策—审校—发布—监测”自动化起来，同时始终留人在环（human-in-the-loop）审核每一草稿。
## 核心亮点与功能剖析
### 1）11 个技能一览（从写作到运营的闭环）
| 技能 | 核心能力 | 场景举例 |
|---|---|---|
| Post Writer | 按 20+ 钩子公式与目标起草帖子；含创始人专属角度与结构公式（F17–F20） | “写一篇关于 AI 公司正在取代传统代理商的帖子，目标要爆款” |
| Comment Drafter | 针对任意帖子 URL 写评论；可使用 Apify 自动抓取帖子内容（否则让你贴） | “对这个帖子加一条有深度的评论：https://linkedin.com/posts/...” |
| Reply Handler | 批量起草评论回复；正确处理 LinkedIn 的 2 层评论扁平化（回复的 parent 须指向顶层评论） | “处理这篇帖子下所有评论的回复，筛掉低质量，批量给我草稿” |
| Post Audit | 对照 2026 年的算法规则与 AI 检测模式做发布前体检 | “帮我检查这段草稿，是否有 AI 味或平台不欢迎的特征” |
| Humanizer | 移除高频 AI 词汇与模式（如过多破折号、reveal bridges、堆叠三元组等）；包含多检测器“散布测试” | “把这段 AI 生成文本改得更像人写的” |
| Hook Extractor | 反向拆解爆款帖的钩子公式并返回空白模板 | “这个帖子用了什么钩子公式？https://linkedin.com/posts/...；给我一个填空模板” |
| Content Planner | 7 天内容排期（主题、格式、钩子、发布时间、评论目标等）；支持创始人专属计划模板 | “帮我做 7 天计划，我是 B2B SaaS 创始人，目标受众是 VP of Marketing” |
| Engagement Monitor | 两个工作流：① 监控你在别人帖子下的评论，若作者回复则在 6–24h 窗口起草追评；② 抓取某帖点赞/评论者并按 ICP 归类（同行/潜在客户/仰望对象） | “追踪我这周在高权重帖子下的评论，哪些需要我追评？” |
| Profile Optimizer | 改写 Headline、About、Featured、Experience，贴合 2026 的转化模式 | “优化我的主页以获取更多 inbound 销售线索：https://linkedin.com/in/yourname” |
| Employee Advocacy | 员工发声计划：14 天启动、发布节奏、品牌守则、ROI 追踪 | “帮我规划一个 10 人团队的员工发声计划” |
| Repurposer | 把跨平台内容改写成 LinkedIn 原生帖子：重写钩子、扩充到 900–1300 字、外链移至首评、跑一遍 humanizer | “把我这篇 Newsletter 变成一篇 LinkedIn 帖子” |
亮点解释：
- “始终先草稿、后批准”：所有写操作都会先返回草稿并等待你确认，不会静默发到 LinkedIn（除非你接入了 Publora 并显式批准）。
- 创始人专用层：10 个创始人角度模板（如“重新定价品类”“内容到管道”“只有一位受众的稀缺计算”等）与 4 个结构化钩子公式，内容策划优先服务于“建立信任”而非单纯曝光。
### 2）工程化架构：技能 + 轻量 Python 工具层
代码组织清晰，分为：
- skills/：各技能的 SKILL.md，Claude Code/Codex 会按 frontmatter 自动发现并激活；其他 Agent 也可作为 prompt 上下文读取。
- lib/：纯 Python 工具层（无复杂依赖），与 Claude 之外的其他 Agent/脚本通用。核心包括 URL 解析、Apify 客户端（读数据）、Publora 客户端（写）、Pixfaro（图）等。
- references/：纯 Markdown 参考资料（行业基准、互动指标分类等），可直接作为知识库注入。
- scripts/：纯 Python CLI 工具；例如同步 Codex 市场打包的脚本。
**运行时兼容性**（不 exhaustive）：
- Claude Code（CLI/IDE）、Claude Desktop、claude.ai Web：通过插件或本地克隆自动发现技能。
- Codex CLI：通过 `codex plugin marketplace add` / `codex plugin add` 安装。
- OpenClaw、Hermes Agent、Cursor/Cline/Aider 等通用 Agent：可把 SKILL.md 与 lib/ 纳入系统提示或上下文使用。
### 3）“读—写—图”三件套接入说明（均为可选）
- 读（Apify）：4 个无 Cookie 的 Actor，分别用于拉取帖子正文、评论与回复、用户近期评论、点赞/评论者。费用约 $1–$5/1000 条结果；免费额度 $5/月通常足够日常创作者使用。未配置 Token 时，技能会要求你手工粘贴文本或 URL。
- 写（Publora）：一个发布 API，兼容 LinkedIn 的三种 URL 格式与反应类型怪癖（例如用 PRAISE 而非 CELEBRATE，用 INTEREST 而非 INSIGHTFUL）。免费层 15 条/月（多平台合计）。技能会根据你的批准调用发布，并把可能的错误（如 400 reactionType）在内部处理。
- 图（Pixfaro）：支持用图像模型生成封面/轮播/金句图，并提供“像素级文字/Logo 叠加”服务，保证品牌一致性与文字清晰度。未配置时，技能仅生成图像提示词并让你自行生成。
### 4）Voice rules：内置风格守则，尽量减少“AI 味”
技能会自动遵循一系列风格规则，例如：
- 破折号密度上限约每 100 词 1 个（2026 年密度比单纯有无更重要）。
- 人名首字母大写（小写在英文语境中显得不尊重）。
- 避免高频 AI 词汇：leverage、fundamentally、streamline、harness、delve、unlock、foster 等。
- 数字优于形容词：“$14,200”优于“显著节省”。
- 评论聚焦一个犀利洞察，而非三个模糊观点。
- 字数指导：评论 200–350 字符；帖子 900–1,300 字符。
### 5）多 Agent/环境兼容与“技能市场”生态
- 通用 CLI：`npx skills add sergebulaev/linkedin-skills`，适用于任何遵循 SKILL.md 标准的 Agent。
- Hermes Agent：直接克隆到技能目录即可按 `/<skill-name>` 调用。
- 社区技能：作者设立了“社区技能”扩展点，已有第三方扩展如 linkedin-outreach（起草连接请求与跟进序列），通过 PR 一行即可加入列表。
### 6）上手部署体验
- 对非开发用户：最直接是在 claude.ai Web 或 Claude Desktop 中，按路径 Customize → Plugins → Add → Add marketplace → Add from a repository → 输入 `sergebulaev/linkedin-skills` → 同步并添加即可。前提是具备带代码执行权限的付费 Claude 计划（Pro/Max/Team/Enterprise）。
- 对开发者：可 `git clone` 后直接作为 Claude Code 工作目录（.claude/skills 镜像会自动被发现），或使用 `/plugin marketplace add` 与 `/plugin install` 等命令。如需读/写/图功能，按 .env.example 填写三件套的 Token 即可。
### 7）Demo / 最简可用示例
- 基础安装（Claude Code / Codex CLI）：
  ```
  /plugin marketplace add sergebulaev/linkedin-skills
  /plugin install linkedin-skills@linkedin-skills
  ```
- 或本地克隆即开即用（无需插件）：
  ```
  git clone https://github.com/sergebulaev/linkedin-skills.git
  cd linkedin-skills
  ```
- 在 Claude 中自然语言触发（举例）：
  - 写帖：“Write me a LinkedIn post about why AI agencies are replacing traditional ones. Make it viral.”
  - 评论：“Comment on this post: https://linkedin.com/posts/... — I want to add a thoughtful take.”
  - 审校草稿：“Audit this post draft for AI tells and algorithm issues: [粘贴文本]”
  - 7 天计划：“Create a 7-day LinkedIn content plan. I’m a B2B SaaS founder targeting VPs of Marketing.”
- 开发者侧快速调用（Python 代码示例）：
  ```
  import sys; sys.path.insert(0, "path/to/linkedin-skills")
  from lib import parse_linkedin_url, PubloraClient, ApifyClient
  parsed = parse_linkedin_url("https://www.linkedin.com/posts/slug-activity-7448808898326654978-iW20")
  print(parsed["post_urn"])  # urn:li:activity:7448808898326654978
  apify = ApifyClient()  # 从环境读 APIFY_TOKEN
  post = apify.fetch_post(post_url="...")
  engagers = apify.fetch_post_engagers(post_url="...", max_items=50)
  client = PubloraClient()  # 从环境读 PUBLORA_API_KEY
  client.create_comment(post_urn=parsed["post_urn"], message="draft", platform_id="linkedin-xxx")
  ```
## 目标人群与收益
- 创始人/独立创业者：收益在于把个人 IP 与获客流程系统化；创始人角度与 7 天计划模板能让你持续产出“高信任”内容，而不是单纯追求流量。
- 市场与增长运营人员：用内容排期、评论批量回复、互动对象分类与监控，把“碎片互动”变成可追踪、可度量的工作流；结合 Apify 与 Publora，可以打通“读—评—发”的数据链路。
- 习惯用 Claude 的工程师/创作者：不离开终端/IDE 即可完成LinkedIn 内容与互动运营；无需频繁切换到 SaaS 后台。
- 团队与公司：借助 Employee Advocacy 技能，快速拉起一套可治理、可追踪的员工发声计划（发布频率、守则、ROI 指标）。
实际收益包括：
- 时间：减少从选题到发帖的重复提示与手工编辑；技能会自动套用结构模板与人设规则。
- 质量：Post Audit 与 Humanizer 降低“翻车”概率；多检测器散布测试能帮你了解不同 AI 检测工具的一致性。
- 数据驱动：通过 Engagement Monitor 与参考资料（行业基准、指标分类），把互动运营从“感觉”变成“可量化的日常动作”。
- 控制与安全：始终由你批准后才发布；可选三件套也均通过环境变量与官方 API 交互，不依赖浏览器 Cookie 或不可控的私有抓取服务。
## 竞品/同类对比
| 维度 | linkedin-skills | 典型 SaaS 发文/代笔平台 | 本地通用 Claude 提示词/模板 |
|---|---|:---|:---|
| 运行环境 | Claude 生态（Code/Codex/Desktop/Web），CLI/IDE 友好，多 Agent 兼容 | 浏览器为主，部分提供移动端 | 各类聊天窗口，需手工粘贴 |
| 发布方式 | 默认草稿+复制粘贴；可选 Publora 自动发布 | 一键发布为主，审批视产品而定 | 手工发，无自动链路 |
| 读数据（互动、评论） | 通过 Apify 读；内置 ICP 分类与作者回复追踪 | 少数提供内置统计，一般不批量拉第三方帖子评论 | 需手工复制或自行写爬虫 |
| 人设与品牌支持 | Voice rules + Voice & Brand Profile（模板在 skills 内） | 依赖产品内“语气设置”，颗粒度不一 | 每次提示都需重复描述 |
| AI 味控制 | 内置 Humanizer 与 Post Audit，针对 2026 年平台特征做提示 | 偶有“润色”功能，但透明度有限 | 需手工设计与维护提示 |
| 可编程性与定制 | Python lib 可二次开发；支持自定义 posting script（`LINKEDIN_SKILLS_CUSTOM_POSTER`） | 一般以 Web UI/API 为主，定制受限 | 完全自定义，但需自建工程 |
| 成本 | 核心技能免费（MIT）；可选三件套按量计费，Apify 免费额度通常足够日常创作者 | 常见订阅制，按月/账户/平台收费 | 仅 Claude 订阅费 |
差异化：
- 更贴近“内容工程”视角，提供可编程、可集成、可复制的工具链，而非一个封闭的 SaaS 面板。
- 开源与多 Agent 兼容使其能嵌入现有工作流（如企业内部知识库、运营自动化流水线等）。
- 强调“人审”与“风险先于发布”的流程，对品牌安全更友好。
## 局限与不足
- 需要 Claude 付费计划与代码执行权限： Skills/Plugins 的使用前提是 Claude Pro/Max/Team/Enterprise 并启用代码执行，否则无法在 Web 或 Desktop 中安装使用。对只用免费版 Claude 或其他模型用户门槛较高。
- 英语与 LinkedIn 英文生态优化为主：Voice rules 与创始人角度材料多为英文语境；其他语言需要你自行在 Voice & Brand Profile 中补充本地化规则与语料。
- 仅“读/写”不覆盖私信/群组：当前技能主要针对公开帖子与评论；私信、群组发帖并未覆盖。
- 三方服务依赖与成本波动：Apify/Publora/Pixfaro 均为第三方，存在可用性与价格调整的风险；不过项目允许草稿模式，不配置任何 Key 也能使用核心写作与审校。
- 学习成本：对不熟悉 Claude Code/终端/环境变量的非技术人员，安装与配置（尤其是 .env、API Key 管理）仍有门槛。
## 结语与行动建议
终极评判：  
linkedin-skills 把 LinkedIn 运营从“靠感觉与运气”升级为“可重复、可审计、可扩展的内容工程流水线”。如果你本身就在用 Claude（尤其是 Claude Code/Codex/Desktop），并且希望在终端/IDE 里完成“写作—审校—发布—监测”的闭环，它是一个极具性价比、可自由定制且安全可控的开源方案。即便不接三件套，仅用草稿模式也能显著提升 LinkedIn 内容的产出速度与一致性。
行动建议（按用户类型）：
- 你是创始人/个人品牌：从最简单的“Write me a LinkedIn post...”和“Create a 7-day LinkedIn content plan...”开始，逐步建立你的 Voice & Brand Profile；若想提升效率，再按需接入 Apify 与 Publora。
- 你是市场/增长运营：先试用 Content Planner 与 Engagement Monitor，把排期与互动对象分类做起来；随后结合公司治理需求评估是否接入 Publora 做统一发布与审批链路。
- 你是开发者：尝试把 lib/ 作为你自有 Agent 或脚本的依赖，用 parse_linkedin_url、ApifyClient、PubloraClient 来构建你专属的运营自动化工具链；.env.example 与 Readme 的“OpenClaw quickstart/Generic Python agent quickstart”提供了直接可复制的代码示例。
## 附录：资源与链接
- 仓库主页（README、安装与 11 个技能详解）：https://github.com/sergebulaev/linkedin-skills  
- LICENSE（MIT 协议）：https://github.com/sergebulaev/linkedin-skills/blob/main/LICENSE  
- .env.example（环境变量模板与说明）：https://github.com/sergebulaev/linkedin-skills/blob/main/.env.example  
- lib/apify_client.py（读数据封装与 Actor 列表）：https://github.com/sergebulaev/linkedin-skills/blob/main/lib/apify_client.py
