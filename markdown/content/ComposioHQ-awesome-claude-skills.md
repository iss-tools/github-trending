# ComposioHQ/awesome-claude-skills

[GitHub URL](https://github.com/ComposioHQ/awesome-claude-skills)

- **Stars**: 73707
- **Language**: Python

## Claude 技能生态的宝藏清单：awesome-claude-skills 评测

> 收录 1000+ Claude 技能的精华清单，助你一键提升 AI 自动化效率。

- **Tags**: Claude, Skills, 自动化, Prompt工程, 工具集
- **Category**: AI 工具, 开源项目, 资源合集

## Details

> awesome-claude-skills：一份围绕 Claude “技能（Skills）”生态的精编清单，收录 1000+ 可直接复用的技能与工具，帮你在 Claude.ai、Claude Code 和 API 之间统一工作流、提升自动化能力。**它是上手 Claude Skills 的最佳起点之一，更是淘金实用技能的“入口目录”。**
## 背景与痛点
### Skills 诞生的背景
- Anthropic 在 2025 年 10 月提出 “Claude Skills” 概念，同年 12 月开放为标准。Skills 本质是“可复用的指令包”，每个技能是一个含 SKILL.md 的文件夹，定义了在特定任务中“怎么一步一步做”，并可选地携带脚本与参考资源。它在 Claude Code / Claude.ai / Claude API 间可移植。该标准让“把工作流打包、版本化和复用”成为可能。
### 没有目录时的问题
- 技能散落在社区各仓库，缺乏统一导航与质量把关；
- 新人不知道“有哪些可用技能”，容易重复造轮子或加载过多无用技能；
- 技能质量参差不齐，安全性难评估，甚至存在“恶意技能”的风险（研究显示部分技能存在安全缺陷）。
### 这个清单要解决的核心痛点
- 一站式入口：从文档处理、开发工具、数据分析，到业务与营销、协作与项目管理、安全与系统，分类清晰；
- 质量门槛：通过 CONTRIBUTING 明确技能必须基于真实场景、有文档与示例、跨平台可用、安全确认等要求，拒绝“玩具级”或“危险的”内容；
- 快速上手：提供 Getting Started（网页/CLI/API 三种用法）、Creating Skills 模板与最佳实践，降低小白与专业玩家的尝试成本。
---
## 核心亮点与功能剖析
### 1) “渐进式加载”的设计精髓
- Skills 不会一股脑把所有指令塞入上下文。会话启动时，Claude 仅加载每个技能的“元数据（名称与描述）”，约 100 tokens；只有当它判断某个技能与当前任务相关，才加载完整的 SKILL.md（通常 <5000 tokens）与附属的 scripts/references。这让同一会话“挂载数百技能”而不撑爆上下文窗口，这和操作系统按需加载动态库非常相似。
### 2) 精心设计的分类体系
- Document Processing：Word/PDF/Excel/PowerPoint/Markdown→EPUB 等，一站式搞定文档操作与转换；
- Development & Code Tools：Web 构件构建、AWS CDK、博客生成、变更日志生成、全页截图、iOS 模拟器交互、安全模糊测试、SDLC 多子角色编排等；
- Data & Analysis：数据分析与可视化类技能（如 D3.js 可视化）。
- Business & Marketing、Communication & Writing、Creative & Media、Productivity & Organization、Collaboration & Project Management、Security & Systems：覆盖非代码工作流，极大扩展 Claude 的“可办事项边界”。
- App Automation via Composio：通过 MCP Gateway 一把连接 1000+ 外部应用（Gmail/Slack/Notion/GitHub 等），并给出 Quickstart 插件安装与配置路径，让 Claude 从“聊天”进阶到“办事”。
### 3) 与 MCP（Model Context Protocol）分层互补
- Skills 不替代 MCP 与工具：MCP 解决“连接外部系统（认证/传输/发现）”，工具是“可调用的函数”，Skills 是“行为层（工作流怎么做、顺序与边界）”。三者常组合使用。该清单也明确区分这一关系，并给出 MCP/工具/技能并用的实践链接，利于开发者体系化落地自动化。
### 4) 社区与生态活水
- Fork 数约 8.4k、Star 数约 73.4k、Issues 136、Pull requests 1.2k，显示强社区参与度与持续贡献流；
- 贡献规范强调“真实用例 + 文档 + 示例 + 跨平台测试 + 安全确认 + 可移植性”，并要求 PR 附带场景说明与来源致谢，既维护质量也尊重原创；
- README 提供官方文档入口（Anthropic Skills 公告、用户指南、API 文档、社区论坛）、官方 skills 仓库、以及社区总结（Top Claude Skills、Notion 技能集合等），形成“目录—官方—实践”三环相扣。
### 5) Quickstart 与模板开箱即用
- 网页侧：点击 Skills 图标，从市场或上传自定义技能即可；
- Claude Code CLI：提供 mkdir/cp/head 三步快速安装与校验命令，极其亲民；
- API 调用示例：给出 anthropic SDK 如何在 messages.create 中指定 skills 的极简样板，开发者可直接复制修改；
- Creating Skills：提供目录结构与 SKILL.md 模板（YAML frontmatter + When to Use + Instructions + Examples），并总结最佳实践（聚焦可重复任务、写示例与边界、文档前置、先测后提交），让“写技能”不再是黑盒。
---
## 目标人群与收益
### 核心人群与收益
- Claude.ai 普通用户：找到文档处理、写作、协作、生产力等技能，省去反复“教 Claude”的时间；按需激活后即可获得稳定、可复用的执行结果。
- Claude Code / CLI 工程师：直接集成开发类技能（变更日志、全页截图、iOS 模拟器、模糊测试、多子角色 SDLC 等），提升本地终端与 CI 场景的自动化水平；API 示例让自定义技能无缝纳入自动化流水线。
- 产品/运营/内容创作者：通过 Business & Marketing、Communication & Writing、Creative & Media 中的技能，快速把营销文案、资料调研、简报、newsletter 等工作“标准化”为可复用技能。
- 安全与运维人员：Security & Systems 分类与 FFUF 等技能，为 Claude 赋能基础的安全测试与系统运维流程，但需要注意在生产环境前人工审核与沙箱化运行。
- 平台与集成开发者：App Automation via Composio 与 MCP 相关条目，为需要“多应用连通”的场景提供单端点、认证审计与统一管控的可行路径。
---
## 竞品/同类对比
| 项目 | 定位与收录范围 | 质量与维护 | 独特竞争力 |
|---|---|---|---|
| awesome-claude-skills（本文） | 聚焦 Claude Skills 与工作流工具；覆盖 9+ 主分类，含官方示例、社区插件与 MCP/自动化条目； | Star 73.4k，PR 数 1.2k，贡献规范细致，强调“真实用例 + 跨平台 + 安全”； | 与 Claude Code/Claude.ai/Claude API 深度对齐， Getting Started 与模板完善；与 Composio MCP Gateway 联动，可实现 1000+ 应用集成。 |
| anthropics/skills（官方示例仓库） | 官方技能样本与参考实现，如 docx/pdf/pptx/xlsx/web-artifacts-builder 等； | 官方维护，更新可靠；面向教学与规范，数量有限但标杆性强 | 是“技能语法与最佳实践”的权威来源；awesome-claude-skills 也链接该仓库作为核心资源。 |
| awesomeclaude.ai（目录站点） | 在线目录化浏览，204+ 技能，13 分类，侧重“发现与检索”； | 更新与维护情况相对未公开披露，体验更偏搜索/过滤 | 网页交互式体验更适合浏览，但缺少 GitHub PR/Issue 与模板等开发侧配套。 |
| Firecrawl “Best Claude Code Skills” 博文 | 精选推荐型内容，聚焦“值得一试”的技能并附上手指南； | 质量较高但属主观选品，更新频率取决于博客节奏 | 适合快速扫榜和实操体验，但覆盖广度不如 awesome-claude-skills 这类“清单库”。 |
| Composio 博文“Top Claude Skills” | 由集成方 Composio 撰写，更偏“生态与最佳实践”视角； | 适合了解“在集成场景下如何选技能”，但不作为主目录使用 | 适合想在自家流水线里用 Claude+技能的人阅读，与 awesome-claude-skills 形成互补。 |
> 小结：在广度、质量门槛与开发侧配套上，awesome-claude-skills 是当前 Claude Skills 生态的核心入口之一；官方仓库提供规范标杆，第三方站点/博文提供浏览与实战视角，搭配使用更佳。
---
## 局限与不足
### 1) 安全与信任依赖人工审核
- 虽然贡献指南要求“安全确认、测试、跨平台可用”，但作为 Awesome 清单，仓库并不会对所有技能执行自动化审计。安全研究也指出：非官方来源的技能可能存在安全隐患，甚至“反向 Shell”等风险。安装任何第三方技能前，建议人工审查 SKILL.md 与 scripts/ 目录，并隔离运行或限制权限。
### 2) 学习曲线仍存在
- 完全小白可能会被“MCP / 技能 / 工具”三层关系与 CLI 配置路径吓到；尽管 README 提供了 Getting Started 与模板，但真正“上手写出自己的技能”仍需要一定动手实验与调试。
### 3) 依赖外部生态
- 部分技能依赖外部工具或服务（例如 FFUF、D3.js、浏览器扩展、云服务），若这些依赖在本地或网络不可用，技能无法正常工作。阅读每个技能 README 与依赖项很重要。
### 4) 部分条目会指向外部站点/商业化服务
- 与 Composio MCP Gateway、dashboard.composio.dev、以及部分商业化工具的联动明确存在，虽能带来显著便利，但团队使用需评估隐私、合规与供应商锁定。建议按需使用，并预留“退路”或“本地替代方案”。
---
## 淘金摘优：5 个值得“立刻用起来”的神仙资源
- **great_cto（AI 产品构建管道/多子角色 SDLC 编排）**  
  - 能力概览：通过 61 个专业子代理（架构师/设计顾问/资深开发/QA/安全/DevOps 等）完成从“需求描述”到“已部署应用”的自动化管道。支持 6 大可复用构建范式（CRUD/Booking/CRM/Dashboard/Marketplace/Content），提供风险分层与“单一人工门（批准 spec）”的工作流，实测端到端成本显著低于传统方式。  
  - 目标人群：个人工程师/技术型独立创始人/技术型 CTO，想在 Claude Code 或 Codex 上“单人像团队一样出货”。  
  - 如何安装与使用（最简路径）：  
    - 安装前置：Node 18.17+，并已安装 Claude Code；然后执行 npx great-cto init。  
    - 交互：在 Claude Code 中执行 /start "描述你的产品" 按提示批准 spec，后续自动化构建、测试与部署。  
  - 注意事项：  
    - 本项目目前定位为“单人工程组织”，多开发团队不宜直接套用，详见 FAQ。  
    - 生产环境使用前务必评估安全、测试覆盖度与人工审核节点。
- **Connect（连接 Claude 到 1000+ 应用）**  
  - 能力概览：提供“connect-apps”插件，让 Claude 能执行邮件发送、Issue 创建、Slack 消息、数据库更新等真实动作，底层通过 Composio 集成 1000+ 服务并处理认证；含 MCP Gateway 能力（单端点、团队访问控制、审计日志）。  
  - 目标人群：需要在 Claude 中打通 Gmail/Slack/GitHub/Notion 等工作流的用户或团队。  
  - 如何安装与使用（最简路径）：  
    - 安装插件：claude --plugin-dir ./connect-apps-plugin；按提示粘贴 API Key（免费获取链接：dashboard.composio.dev）；重启后尝试发送一封测试邮件确认连通性。  
  - 注意事项：  
    - 请在隔离环境先跑通；把控好技能的权限范围，避免“过度授权”。
- **Master Claude for Legal（法律团队专用技能包）**  
  - 能力概览：面向法律团队的技能包，包含 NDA 分诊、多版本对比、引文核实、会议简报、Newsletter 状态汇总等模式，并提供 10 份参考文档与 3 个律所模板，源自公开的“Claude for Legal Teams”网络研讨会数据集。  
  - 目标人群：律所/法务团队，需要将合同审阅、案情检索、合规简报等日常流水线化。  
  - 如何使用（建议）：  
    - 下载技能文件夹并按“Claude Code CLI”方式放入 ~/.config/claude-code/skills/，或在 Claude.ai 上传自定义技能；按照仓库 README 提供的模板进行本地化修改与试运行。  
  - 注意事项：  
    - 法律内容高度敏感，务必设置访问控制与审计日志；输出应作为“草稿”由具备资质的律师复核。
- **Full-Page Screenshot（零依赖全页截图）**  
  - 能力概览：基于 Chrome DevTools Protocol 的全页截图技能，零外部依赖，适合将网页生成完整截图留存或文档化。  
  - 目标人群：QA/技术写作者/运营需要自动化生成网页快照与对比的用户。  
  - 如何使用（预期方式）：  
    - 按技能目录结构将技能放入 Claude Code 的 skills 目录；在对话中请求“对给定 URL 执行全页截图并根据路径保存”；依据仓库说明确认本地 Chrome/Chromium 可用及参数配置。  
  - 注意事项：  
    - 截图任务通常涉及网络与本地文件写入，建议沙箱运行并限定输出目录。
- **Claude Code Terminal Title（终端窗口动态标题）**  
  - 能力概览：为 Claude Code 的终端窗口自动生成能“描述正在做的工作”的动态标题，避免多窗口迷失。  
  - 目标人群：高频使用 Claude Code 的开发者，经常同时开多个终端/会话。  
  - 如何使用：  
    - 按技能目录将技能放入 Claude Code 的 skills 目录，并确保脚本具备执行权限；一般无需额外配置即可在会话中自动生效（具体以技能 README 为准）。  
  - 注意事项：  
    - 脚本会修改终端标题，若对环境敏感，建议先在非生产环境测试。
---
## 上手门槛与检索体验
- 网页端上手：  
  - 在 Claude.ai 打开 Skills，市场或自定义上传即可（详见 Getting Started）。  
- Claude Code CLI 上手：  
  - 三行示例完成安装与校验：mkdir -p ~/.config/claude-code/skills/；cp -r skill-name ~/.config/claude-code/skills/；head ~/.config/claude-code/skills/skill-name/SKILL.md。随后技能会在相关任务时自动激活。  
- API 上手：  
  - 提供 anthropic SDK 的极简调用示例：skills=["skill-id-here"] 指定技能，适合将技能纳入自动化任务调度。  
- 检索体验：  
  - 目录锚点+分类清晰，且每个条目为“简短描述 + 链接”，易于扫读；部分条目附作者致谢（@handle），便于溯源与查阅更多作品。
---
## 维护状态与时效性
- 社区数据：Star 73.4k、Fork 8.4k、Pull requests 1.2k， Issues 136，显示出较高的关注与持续贡献氛围；  
- 规范与模板完善：CONTRIBUTING 明确技能标准与 PR 流程，降低维护熵增；README 指向官方文档与社区资源，保证与 Claude Skills 标准的同步更新。  
- 风险提示：作为“清单仓库”，其“时效性”很大程度取决于收录链接的存活与子仓库维护；建议结合官方 anthropics/skills 与第三方目录一起使用，以应对可能的链接失效或内容过时。
---
## 结语与行动建议
- 终极评判：awesome-claude-skills 是当前 Claude Skills 生态中覆盖面最全、质量门槛较高、开发配套最完善的开源清单之一。它既是“发现与收录”的入口，也是“学习与贡献”的教材；只要配合官方示例与安全审查意识，就能在 Claude 的三大界面（网页/CLI/API）上建立起真正可复用的自动化工作流。
- 立即可做的三件事：  
  1) 访问仓库，根据你的角色从 9 大分类中挑选 1–2 个技能，按 Getting Started 安装试用；推荐先试 Connect 或 Document Processing 类技能，快速尝到“自动化”的甜头。  
  2) 创建你的第一个 Skill：使用 README 提供的模板，把一段你经常对 Claude 提示的“稳定流程”写成 SKILL.md，放入 Claude Code skills 目录或上传到 Claude.ai 验证；关键要写清“何时用、怎么用、示例与边界”。  
  3) 养成安全习惯：在加载任何第三方技能前，先扫描 SKILL.md 与 scripts/ 目录中的可疑指令（尤其是 curl/ssh/chmod/sudo 等），优先使用沙箱或最小权限运行。对团队/生产环境，建议建立内部“技能白名单与评审流程”。
- 可选的进阶路径：  
  - 阅读官方的 Skills API 文档与 Agent Skills 工程深度文，了解如何在代码中动态加载技能、组合 MCP 服务器与工具，构建“企业级”智能代理流水线。  
  - 结合 great_cto 等高级技能，尝试把“从需求到部署”的端到端流水线跑通，记录成本、质量与风险，逐步形成你自己的“AI 工程SOP”。
一句话收尾：awesome-claude-skills 是你把 Claude 从“聊天对象”升级为“可靠执行伙伴”的地图与工具箱，关键是“用起来、管好安全、沉淀自己的技能”。
