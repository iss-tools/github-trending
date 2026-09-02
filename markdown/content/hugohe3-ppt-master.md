# hugohe3/ppt-master

[GitHub URL](https://github.com/hugohe3/ppt-master)


## PPT Master：深度评测开源 AI PPT 生成神器

> 一个能生成原生可编辑 PPTX 文件的开源 AI 助手，支持本地运行与模板复刻。

- **Tags**: PPT 生成, AI 助手, PowerPoint, 开源, 本地部署
- **Category**: AI 生成工具, 办公效率, 开源项目

## Details

现在，让我回答用户的问题。
## 一句话总结
它把“从文档到真正可编辑的 PPTX”这件事做透做深——不是给你一堆不能改的截图或网页，而是一份在 PowerPoint 里可继续精修、带原生形状、图表、动画与讲者备注的完整演示文稿；数据留在本地、模型可自选，适合需要把“底稿 + 改稿”玩明白的专业人士。该仓库为 MIT 协议的开源项目（无订阅费），只产生模型 API 调用成本。
## 背景与痛点：为什么会有 PPT Master？
- 痛点 1：漂亮的往往不可改。很多在线 PPT 生成器输出的是整页图片或网页，交付给同事/客户后，对方想改两个字都要重来。
- 痛点 2：重复劳动多。从资料整理、大纲撰写，到每一页的图文排版、配色、对齐、图表制作，是固定的机械劳作，易错且枯燥。
- 痛点 3：品牌与模板复用难。公司已有 PPT 母版或统一模板，却很难被 AI 工具“理解并继承”。
- 痛点 4：数据隐私与成本。把敏感报告上传到不透明的云端服务有合规风险；订阅制又叠加了长期开支。
PPT Master 的作者 Hugo He 是金融与咨询背景的执业者（CPA/CPV/咨询工程师），长期审阅与打磨演示文稿，因此“原生可编辑”与“能真正落地到工作流”成为他的核心诉求。他将项目定位为“AI Agent 工作流（Skill）”，在本地执行、由模型驱动，把 PowerPoint 的原生能力一层层接进来，而不是造一个封闭的新平台。
## 核心亮点与功能剖析
### 1) 原生 PPTX 深度集成：不是图片，是真实对象
- 原生形状与占位符：生成的是真正的 DrawingML 对象（而非纯文本框），可在 PPT 里调整控制柄、锚点、连接符。
- 数据驱动的图表与表格：可输出“数据支撑”的图表与表格，而非只能截图的静态图。
- 模板与母版体系：通过模板/结构化路由，能生成带有 sldMaster/sldLayout 继承关系的完整母版体系，方便统一改版与样式批量调整。
- 数学公式：LaTeX → OMML 转换，可在 PowerPoint 2010+ 中直接编辑；但非 PowerPoint 客户端（Keynote/WPS/LibreOffice）不在支持范围内。
### 2) 多路由工作流设计（Skill 化）
项目本质是一个“工作流/技能包”（Skill），以 SKILL.md 为入口，根据用户意图路由到不同子流程：
- Generate PPTX（默认）：从文档或主题生成新 PPTX（支持 SVG 预览 → PPTX 导出的两步流程）。
- Generate PPTX — Quick：一跳生成，跳过 Strategist 与 design_spec 的多轮确认；不生成 svg_final 预览，适合快速出稿。
- Generate PPTX — Image to PPTX：从图片（截图/PDF 转图片等）重建为可编辑 PPTX。
- Generate PPTX — Beautify：对已有 PPTX 进行美化与重构。
- Create Template：从现有 PPTX 抽取出可复用的品牌/样式/布局/整套母版。
- Fill Native PPTX：把新内容“灌入”既有模板/母版，保持设计一致性。
- Enhance Native PPTX：为成稿添加转场、元素动画、讲者备注、旁白甚至导出为带配音的视频（需配合外部工具）。
### 3) 本地优先 + 数据隐私 + 无平台锁定
- 除模型调用外，所有流程在本地运行；源资料与中间产物不离机。
- 兼容任何具备 Agent 能力的 AI 工具（Claude Code / Codex CLI / GPT / Gemini / Kimi 等），不绑定特定平台；作者首选 Claude Code 作为主要开发与测试环境。
- 项目为 MIT 开源，没有“平台订阅”，成本完全来自你选择的模型 API（官方或中继）。
### 4) 多格式输入 / 多画布输出
- 输入：PDF / DOCX / HTML / EPUB / URL / Markdown / 图片；较旧格式（.doc/.odt/.rtf/.tex/.rst/.org/.typ）通过 Pandoc 转换。
- 画布与输出：默认为 16:9 PPT；公开资料还提到支持 4:3 PPT，以及小红书竖屏（3:4）、朋友圈（1:1）、短视频（9:16）等输出；整体流程以 SVG 为中间表达，再经 finalize_svg.py 转换为 PPTX。
### 5) 模板与示例生态：从复制到创造
- examples/ 现为独立仓库，并保留在线浏览站（hugohe3.github.io/ppt-master-examples），包含 23 个精选示例项目、共 329 页 SVG，覆盖咨询风、通用风、创意风、杂志/东方美学等范式；例如“顶级咨询风”案例里用到了 MECE、数据看板、2x2 矩阵等顾问级呈现手法。
- 支持把你自己的 .pptx 作为“参考”提取为可复用的模板库（品牌/样式/布局），方便后续一键复刻风格。
## 目标人群与收益：谁适合用、得到什么
- 适合人群：咨询/投行/战略等高频制作者、需要品牌统一的市场/运营/HR、教学课件与培训材料生产者、技术分享与演讲者、具备基本 Python 环境配置能力的个人或小团队。
- 明确收益：
  - 把“从资料到初稿”的时间从小时/天级压缩到分钟/十分钟级，尤其是长文档的结构化与图示化。
  - 所有元素原生可编辑，交付后对方能在 PowerPoint 直接改，大大降低协作成本。
  - 通过模板与母版复刻，统一品牌风格，避免“千人千面”的视觉混乱。
  - 本地执行与可选模型中继，降低隐私风险，长期成本可控（只需支付模型用量）。
## 竞品/同类对比：ppt-master 处于什么位置？
- vs 商业 SaaS（Gamma、Beautiful.ai、AiPPT 等）：SaaS 通常生成速度快、视觉时髦，但输出多为网页或图片；导入 PowerPoint 后难以精细编辑。ppt-master 牺牲了一些“所见即所得的即时爽感”，换来的是原生 PPTX 与长期可维护性，并支持隐私与本地处理。
- vs 其他 AI PPT Skill（html-ppt-skill、guizang-ppt-skill、GordenPPTSkill、ppt-director 等）：公开横测显示，ppt-master 在“可编辑性”上明显领先——生成的 PPTX 每个元素都可直接编辑，而许多竞品只能输出整页图片或难以改的结构；在“中文适配 + 内容结构”维度也表现靠前，适合需要多次修改的商业汇报场景。视觉冲击力不是“最炸”，但均衡耐看、改稿跟手。
- 独特竞争力：PowerPoint 原生对象模型的覆盖深度、多路由工作流（模板抽取/填充/增强/美化）、本地优先与 MIT 开源组合，形成了一个可持续演进、可组合进现有工作流的“能力层”，而非一个封闭产品。
## 局限与不足：你必须知道的边界
- 上手门槛略高：需安装 Python 3.10+，并在具备 Agent 能力的工具（如 Claude Code、Cursor、VS Code 插件）中使用；Windows 需配置 PATH 与执行策略等，官方提供了专门的安装指南以降低难度。
- 结果非“一键即完美”：作者明确写到“这是工具，不是许愿井”。模型决定上限；推荐使用 Kimi K3 或 Claude 等大上下文模型，并配合图像生成能力；否则质量会打折扣，且仍需你在 PowerPoint 里手动精修。
- 生成速度偏慢：公开经验表明，10–20 页的 PPT 大致需要 10–20 分钟；与商业 SaaS 的秒级出图相比，慢不少，但换来的是可编辑性与本地处理。
- 非 PowerPoint 客户端兼容性有限：LaTeX→OMML 公式等特性针对 PowerPoint 2010+ 优化；Keynote、WPS、LibreOffice 等不在合同保证范围，可能会有渲染或编辑问题。
- 学习曲线：要发挥最大价值，需要理解多路由（Generate/Quick/Fill/Enhance/Template）与 design_spec 的写法；初期建议直接用“默认 + Quick”两条路，逐步进阶。
## 技术栈与架构解析：它到底怎么跑？
- 语言与生态：Python 3.10+ 为核心；依赖在 skills/ppt-master/requirements.txt 内置，根目录的 requirements.txt 仅做引用，统一通过 pip install -r 安装即可。仓库包含 scripts/ 工具链用于后处理与导出。
- 流程本质：
  - 解析：把 PDF/DOCX/HTML/URL 等转换为 Markdown/文本表示（必要时调用 Pandoc）。
  - 规划：AI 扮演 Strategist 角色，生成 design_spec.md（模板/版式/配色/页数等），必要时与用户一轮确认；Quick 模式会跳过此交互。
  - 创作：AI 根据 design_spec 与源内容逐页生成 SVG（在 svg_output/），支持图示、图表、图标与配图。
  - 预览与定稿（默认流程）：运行 finalize_svg.py 把 svg_output 合成到 svg_final，形成可插入 PowerPoint 的自包含预览；随后再导出 PPTX 到 exports/。
  - 导出：读取 SVG 并写入 DrawingML 结构的 PPTX，支持形状、图表、表格、备注、动画等；默认以 SVG 导出的“视觉一致性优先”形态生成；若需原生图表/表格可传参 --native-charts-and-tables。
- 路由与角色：SKILL.md 定义路由与全局执行纪律（串行执行、阻塞点确认、不跨阶段打包、确定性路由等）；不同路由对应各自的 runtime authority 文档（如 workflows/profiles/quick-generate.md、create-template.md 等），保证流程可预测且可恢复（例如 resume-execute.md 支持断点续跑）。
## 上手门槛与部署体验：如何跑起来？
- 基础准备：
  - Python 3.10+，并配置 pip。Windows 务必勾选“Add to PATH”，或参考官方 Windows 安装指南。
  - 选择一个 Agent 工具：Claude Code（CLI 或 IDE 插件）、Cursor、VS Code 插件、Codex CLI 等。
- 安装方式（任选其一）：
  - Git clone（推荐）：方便后续更新。
    - git clone https://github.com/hugohe3/ppt-master.git
    - cd ppt-master
    - pip install -r requirements.txt
  - Download ZIP（适合快速试玩）：无法用 git pull 更新，更新需重下 ZIP 并迁移 .env 与 projects/ 目录。
  - Skill marketplace（Claude Code）：npx skills add hugohe3/ppt-master 或在插件中 /plugin marketplace add hugohe3/ppt-master；仅拉取 skill 文件，仍需运行 pip 安装依赖。
- 文档与体验：
  - README 里有“Quick Start + Getting Started + FAQ + Why PPT Master”等模块，引导从安装到首次生成、再到改稿与模板使用。
  - 示例仓库 hugginghe3.github.io/ppt-master-examples 支持在线查看与下载 .pptx，是理解输出质量与风格的最快路径。
## 社区活跃度与生命力
- Star/Fork：页面显示约 48.6k–49k Star、约 3.9k–4k Fork，且曾登上 GitHub Trending（Trendshift 数据显示其出现在 2026-05-01 趋势榜 #3）；说明关注度与使用规模相当可观。
- 更新与版本：
  - 路线图明确，新增“Under consideration”部分（如 LaTeX 数学公式现已交付），持续收敛与 PowerPoint 的能力边界。
  - 近期 v2.9.0/4.8.0 等版本改进了依赖、更新脚本、图片路径、manifest 冲突等，并提供了 skill-only 精简安装包，显示项目在持续打磨与工程化。
- 讨论与生态：
  - GitHub Discussions 有“分享你的作品”等社区互动；B 站上有创作者发布保姆级实战讲解视频，降低了中文用户的上手门槛。
  - SkillsLLM 等第三方平台也收录了该 Skill，并提供安全扫描与安装指引，扩展了分发渠道。
## Demo / 代码示例：第一次上手该怎么做？
以下命令与对话均在仓库根目录执行；路径与参数以官方文档为准。
### 步骤 1：安装依赖（仓库根目录）
- pip install -r requirements.txt
### 步骤 2：把源文件放到 projects/ 目录下（举例）
- 假设你有一份报告 PDF，路径为 projects/q3-report/sources/report.pdf。
### 步骤 3：在 AI IDE 中发起任务（示例）
- 在 Claude Code / Cursor / VS Code 的 AI 聊天面板中输入：
  - Please create a PPT from projects/q3-report/sources/report.pdf
- AI 会先与你确认设计规格（模板、格式、页数等）；确认后自动执行解析、设计、SVG 生成与 PPTX 导出，最终写到 exports/<name>_<timestamp>.pptx。
### 步骤 4：跳过确认的快速生成（Quick 模式）
- Quickly generate a 5-page deck from projects/q3-report/sources/report.pdf — no need to confirm with me
- Quick 模式不生成 svg_final 预览，为一跳式生成与导出；适合快速出稿。
### 步骤 5：常见后处理命令（出自 scripts/docs/troubleshooting.md）
- 预览 SVG 与启动本地服务（需要先执行 finalize_svg.py）：
  - python3 scripts/finalize_svg.py <project_path>
  - python3 -m http.server --directory <project_path>/svg_final 8000
- 验证项目完整性：
  - python3 scripts/project_manager.py validate <project_path>
- 修复讲者备注切分问题（total.md 需要规范的“# 标题 + ---”分隔）：
  - python3 scripts/total_md_split.py <project_path>
## 真实案例演示（简化版，便于直观理解）
以下为“典型输入”与“典型输出”的对比说明，帮助你快速感知其能力边界与风格倾向：
- 用户输入（要点摘要）：
  - 主题：企业私域客户运营体系建设（约 2000 字背景材料，包含增长瓶颈、转型目标、模型框架、案例与落地计划）。
- PPT 输出（在默认咨询风格下的典型表现，参考公开示例与横测反馈）：
  - 结构：问题 → 转型 → 模型 → 案例 → 落地；叙事节奏清晰，逐页展开逻辑链与数据支撑，符合咨询级讲述习惯。
  - 视觉：主色调克制（如深蓝+暖金），强调留白与信息层次；KPI 卡片、趋势图、对比矩阵等均为可编辑对象，非截图。
  - 改稿：一轮修改后能精准调整页数、重点、图示类型与标题表达；在横测中“可编辑性”得分为满分，迭代成本较低。
## 安全与开源协议
- 开源协议：MIT（详见仓库 LICENSE 文件），可商用、可二次开发。
- 数据隐私：除模型 API 调用外，所有处理在本地完成，源材料与中间产物不强制上传第三方；适合金融、政府、企业内敏感场景。
- 第三方扫描：SkillsLLM 提供依赖漏洞审计与 Prompt 注入启发式扫描，未发现高危问题（公开安全报告）。
## 开发者体验（DX）与工程化
- 技能描述与触发：SKILL.md 明确定义了“何时该用此技能”（create/generate/reconstruct/beautify/redesign/template/fill/enhance PPT/PPTX/slide deck/courseware 等），并给出路由与角色切换规范，便于集成到不同 Agent 工具。
- 后处理与运维：scripts/ 提供项目验证、SVG 预览、讲者备注切分、更新仓库等脚本，配合 docs/troubleshooting.md，能覆盖常见问题（验证失败、预览错、备注不切分、导出质量等）。
- 更新机制：Git clone 安装下可用 python3 skills/ppt-master/scripts/update_repo.py 拉取最新版并在 requirements.txt 变更时同步依赖；ZIP 安装需手动更新。
## 结语与行动建议
如果你需要“真正可编辑、能改稿、能复用公司模板、且数据留在本地”的 PPT 生成方案，ppt-master 是目前少有地把 PowerPoint 原生能力做得这么透、生态与文档又比较成熟的开源 Skill。它的投入回报比很适合“要反复改、要品牌统一、要合规模糊边界”的专业场景；但如果你只是偶尔做一次 PPT，且不愿配置 Python 与 Agent 工具，那么商业 SaaS 可能是更省心的选择。
行动建议（按需求分档）
- 小白 / 体验优先：先去官方示例站点在线浏览并下载几份 .pptx，感受“原生可编辑”的质感，再决定是否投入时间配置环境。
- 有一定技术基础、想迅速跑通：按 README 的“Quick Start + Windows 安装指南”走通一次“从 PDF 到 PPTX”的完整链路；第一次建议用默认模式，让 AI 与你确认设计规格，理解 workflow 的节奏。
- 有固定模板与品牌规范的企业：尝试“Create Template + Fill Native PPTX”组合，把现有母版/模板转化为可复用的技能资产；后续只需喂材料，即可批量产出风格统一的稿件。
- 对输出质量要求较高：优先选用 Kimi K3 或 Claude 等大上下文模型，并搭配图像生成（如 gpt-image-2 或 gemini-3.1-flash-image）；模型上带来的质量提升通常远大于技巧调整。
