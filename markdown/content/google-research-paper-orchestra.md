# google-research/paper-orchestra

[GitHub URL](https://github.com/google-research/paper-orchestra)


## PaperOrchestra 深度评测：Google 开源的多智能体论文写作框架

> Google 开源的多智能体论文写作框架，40 分钟把散乱实验日志变成带真实引用的会议级论文初稿

- **Tags**: Google开源, 多智能体Agent, 论文写作, 学术科研, PaperWritingBench
- **Category**: AI 工具, 开源项目, 学术科研

## Details

# PaperOrchestra 深度评测：当 Google 把"论文写作最后一公里"交给五个 Agent
> **一句话总结**：PaperOrchestra 是 Google Cloud AI Research 在 2026 年 4 月开源的多智能体框架，专门接管"实验做完之后、论文投出去之前"那段最折磨人的写作流程——你扔给它一个 idea 简述和一份散乱的实验日志，它 40 分钟内还你一份带 45+ 条真实可核验引用、含图表、能编译通过的目标会议 LaTeX 手稿。
---
## 背景与痛点：为什么"最后一公里"值得被自动化
写过论文的人都懂，科研最耗意志力的环节往往不是想 idea、跑实验，而是把已经做完的工作整理成能投出去的稿子。实验日志是散的、消融结果是乱的、related work 要补、引用要核、LaTeX 模板要对齐、图表要重画。Meta 的 LLaMA、OpenAI 的 GPT-4 Turbo 这类通用模型能帮你润色几段文字，但没人能端到端地替你完成这次"从散乱素材到 submission-ready PDF"的翻译。
而 Sakana AI 的 AI Scientist-v2 这类"全自动科学家"框架又走向另一个极端：它们必须自己跑完 idea → 实验 → 写作的全流程，如果你已经有实验结果、有自己的研究方向，这种端到端系统对你毫无帮助——它的写作模块和它自己的实验循环深度耦合，无法接收人类研究者提供的"外部素材"。
**PaperOrchestra 切的正是这条被两边都忽视的缝隙**：它假设你已经做完了所有"有趣的科学工作"，剩下的机械劳动——列提纲、画图、查文献、写段落、模拟同行评审——全部交给一支 Agent 编队。这是它在选题上比 AI Scientist 系列更"接地气"的地方：不是要替代科学家，而是要替代那台拖着你周末加班的 LaTeX 编辑器。
---
## 核心架构：一支"编辑部"而不是一个"超级写手"
理解 PaperOrchestra 的关键是**别把它当成一个会写论文的大模型，而要当成一个五人编辑部**：每个 Agent 只干一件事，但把它干到极致。
| Agent | 对应论文步骤 | LLM 调用量 | 核心职责 | 亮点机制 |
|---|---|---|---|---|
| **Outline Agent** | Step 1 | 1 次 | 把 idea + 实验日志 + 会议模板合成为结构化 JSON 大纲，包含可视化计划、文献检索策略、章节级 bullet | 一次规划，全局统筹 |
| **Plotting Agent** | Step 2 | 20–30 次 | 生成统计图和概念示意图（方法架构图） | 内嵌 **PaperBanana**（即 PaperVizAgent），用 VLM 评论员反复修订直到达到设计质量门槛 |
| **Literature Review Agent** | Step 3 | 20–30 次 | Web 搜索候选论文 → Semantic Scholar API 验证 → 生成 BibTeX → 写 Introduction 与 Related Work | **Levenshtein 模糊匹配 + 时间截止线 + 90% 引用整合率硬约束**，杜绝幻觉引用 |
| **Section Writing Agent** | Step 4 | 1 次 | 单次多模态调用完成剩余章节（摘要、方法、实验、结论），从实验日志直接抽数建表 | 一次调用避免风格漂移 |
| **Content Refinement Agent** | Step 5 | 5–7 次 | 模拟同行评审（基于 **AgentReview**），迭代修订 | 严格"接受/回滚"停机规则，分数不升则回退，防止"刷分" |
文献检索与画图两个 Agent 是**并行执行**的，这也是它能压到 40 分钟完成全流程的关键。
用一个比喻：传统单 Agent 写论文像是让一个实习生一个人干完整本期刊的活，结果每一段都平庸；PaperOrchestra 更像是把研究助理、绘图师、图书管理员、执笔人、审稿人分成五个岗位，各司其职、互相校对。
### 关键技术细节：为什么引用不会"编"出来
Literature Review Agent 是整个系统最有学术诚信意识的部分，它做了三层防御：
1. **候选发现**：用带 Web 搜索的 LLM 先撒网。
2. **API 验证**：每个候选都要过 Semantic Scholar API 的标题/摘要模糊匹配（Levenshtein 距离 > 70），同时根据目标会议的投稿截止时间做时间截止——你没法引用一篇"未来"的论文。
3. **硬约束整合**：写 Intro 和 Related Work 时强制要求 ≥90% 的文献池被实际引用，防止模型偷懒只挑三五条凑数。
实测结果是平均每篇生成 **45.73–47.98 条已验证引用**，而人类 Ground Truth 论文平均约 59 条——规模接近，且每条都真实可查。
---
## PaperWritingBench：给"AI 写论文"这件事第一次立规矩
评测一个"会写论文的 AI"过去非常困难，因为没有标准输入。PaperOrchestra 团队顺手解决了这件事，发布了 **PaperWritingBench**：
- 从 **CVPR 2025** 和 **ICLR 2025** 各随机抽 100 篇接收论文，共 200 篇。
- 用 LLM **逆向工程**出"作者当时可能拿到的原始素材"：稀疏 Idea Summary、实验日志（表格抽成数字、图转成事实陈述），并**剥离所有引用、URL、图表编号**，彻底匿名化，避免信息泄漏。
- 选这两个会议是有讲究的：CVPR 是双栏、ICLR 是单栏，格式差异极大，能逼出系统的模板适应能力。
这也是目前**第一个**针对"AI 研究论文写作"任务的标准化 Benchmark，对后续这个赛道的所有工作都是基础设施级的贡献。数据集目前托管在 HuggingFace（`yiwen-song/PaperWritingBench`），主仓库 README 明确说明数据将单独发布。
---
## 实测表现：人评和机评给出的两张面孔
| 评估方式 | 维度 | PaperOrchestra vs 基线 |
|---|---|---|
| **人类 SxS**（11 位 AI 研究者、180 对盲评） | 文献综述质量 | 绝对胜率优势 **50–68%** |
| **人类 SxS** | 整体稿件质量 | 绝对胜率优势 **14–38%** |
| **自动 SxS**（LLM 评审） | 文献综述质量 | 绝对胜率优势 **88–99%** |
| **自动 SxS** | 整体稿件 vs AI Scientist-v2 | **39–86%** |
| **ScholarPeer 模拟录用率** | CVPR | **84%**（GT 86%）|
| **ScholarPeer 模拟录用率** | ICLR | **81%**（GT 94%）|
| **运行时间** | 单篇全流程 | **39.6 分钟**、60–70 次 LLM 调用 |
| **运行时间** | AI Scientist-v2 对照 | 35.1 分钟（仅多 4.5 分钟）|
几个值得咀嚼的细节：
- **人类评分比机器评分苛刻得多**。机评动辄 88–99% 胜率，但人评只剩 50–68%。诚实地读法是：PaperOrchestra 确实显著赢过现有基线，但离"超过人类"还有距离——在 ICLR 上模拟录用率比人类真稿低 13 个百分点。
- **迭代精修环节贡献巨大**。消融实验显示，经过 Content Refinement 的稿子在 80% 配对中胜过未精修稿，模拟录用率提升 19–22%。
- **PaperBanana 自动生成的图**在与人类作者原图的对比中拿到 51–66% 的"平局或胜出"，对一个纯自动绘图模块来说已经非常能打。
- **和人类 Ground Truth 直接比**时，文献综述维度拿到 43% 的"平局或胜出"——这是最值得引用的数字，说明 AI 已经能写出接近人类水准的 related work。
---
## 上手实战：从安装到跑通一遍
作为 GitHub 开源项目，PaperOrchestra 的 DX（开发者体验）总体友好，但有几个值得提前知道的点。
### 环境与依赖
```bash
conda create -n paper_orchestra python=3.11
conda activate paper_orchestra
pip install -r requirements.txt
```
依赖栈以 Python 3.11 + 主流 LLM SDK 为主，无 GPU 要求——所有推理都通过 API 完成，**本地不需要显卡**，这是它和需要本地跑 7B 模型的开源 AI Scientist 最大的差别之一。
### API Key 配置（关键步骤）
在项目根目录创建 `.env`：
```bash
# 文献检索（必填，要做 Semantic Scholar 验证）
SEMANTIC_SCHOLAR_API_KEY=your_semantic_scholar_api_key
# 模型后端三选一
OPENAI_API_KEY=your_openai_api_key
# 或
GEMINI_API_KEY=your_gemini_api_key
# 或 Vertex AI（企业用户）
VERTEX_AI_PROJECT=your_vertex_ai_project
VERTEX_AI_LOCATION=your_vertex_ai_location
# 可选：开启 Streamlit Demo 的邮件通知
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_password
```
### 一条命令跑通
```bash
python paper_writing_cli.py \
  --raw_materials_dir /path/to/your/raw_materials/ \
  --latex_template_dir templates/cvpr2025 \
  --output_dir ./output/ \
  --use_plotting true \
  --writer_model_name gemini-2.5-pro \
  --reflection_model_name gemini-2.5-pro
```
### 输入格式约定
`--raw_materials_dir` 里你需要准备至少两个文件（这是社区版 Ar9av fork 文档里讲得最清楚的部分，原仓库把这种约定写在了论文附录里）：
```text
raw_materials/
├── idea.md              # 稀疏或稠密的 idea 简述
└── experimental_log.md  # 实验日志（含数据、消融、指标）
```
如果你一直用 Claude Code / Cursor / Antigravity 跑实验但没整理过日志，社区版 fork 的 `agent-research-aggregator` 技能可以从这些 agent 的缓存目录里自动抽取 idea 和实验日志，形成标准输入。
### 仓库结构导览
```text
paper-orchestra/
├── autoraters/    # 自动评估器（Citation F1、LitReview 6 轴、SxS 评估）
├── methods/       # 五个 Agent 的核心实现 + Pipeline 调度
├── templates/     # 目标会议 LaTeX 模板（可自己加子目录）
├── frontend/      # Streamlit 交互式 Demo
├── utils/         # API 调用、PDF 处理等工具函数
└── paper_writing_cli.py  # 主入口
```
### 项目当前状态
- **License**：Apache 2.0，可商用。
- **Star 数**：约 150+（HuggingFace 论文页显示 152），已被 Trendshift 收录，在 2026 年 4–5 月的 Agent 圈子里讨论度很高。
- **Disclaimer**：README 明确写着"**This is not an officially supported Google product**"，意味着它本质上是研究团队的开源输出，没有 Google 商业支持承诺。
- **姊妹项目**：绘图用的 **PaperBanana/PaperVizAgent**、模拟评审用的 **AgentReview** 和 **ScholarPeer** 都是同团队开源的独立仓库，PaperOrchestra 把它们编到一起。
---
## 竞品横向对比：它到底站在哪
| 系统 | 定位 | 是否接受外部素材 | 文献综述质量 | 是否生成概念图 | 适合谁 |
|---|---|---|---|---|---|
| **PaperOrchestra** | 独立写作流水线 | ✅ 任意非结构化素材 | ⭐⭐⭐⭐⭐（API 验证）| ✅ PaperBanana | 已有实验结果的研究者 |
| **AI Scientist-v2**（Sakana AI）| 端到端自动科研 | ❌ 必须走自己的实验循环 | ⭐⭐（浅引用）| ❌ 仅数据图 | 想做全自动 AI 科学家实验的人 |
| **CycleResearcher** | RL 优化写作 | ❌ 需要 BibTeX 输入 | ⭐⭐⭐ | ❌ | 已有完整参考文献的场景 |
| **AutoSurvey2 / LiRA** | 综述专用 | 部分 | ⭐⭐⭐⭐ | ❌ | 只写 survey 不写论文的人 |
| **data-to-paper** | 结构化数据→文本 | 部分（结构化）| — | ❌ | 数据分析报告写作 |
| **AI Co-Scientist**（Google）| 假设生成助手 | — | — | — | 生医领域早期探索 |
PaperOrchestra 的独特生态位是：**它是这个赛道里第一个真正意义上的"独立写作模块"**，不绑定任何实验循环，纯粹吃人类的散乱素材。AI Scientist-v2 不得不自己跑实验才能写论文，AutoSurvey2 只能写综述——只有 PaperOrchestra 是"你给我什么我就帮你写什么"。
---
## 目标人群与收益
### 谁最适合立刻用上
- **临近 DDL 的研究生和博后**：实验做完了、notes 一堆、deadline 三天后。PaperOrchestra 给你一份带 45+ 条真实引用的初稿，你只需要花半天精修——这是它最直接的"救命"场景。
- **需要在多个会议/期刊间调整格式的人**：内置 CVPR、ICLR 模板，也可以自己塞新模板进 `templates/`，从 CVPR 改投 ICLR 不用重排格式。
- **写 related work 写到怀疑人生的人**：50–68% 的人评胜率意味着它在这一项上几乎能写出接近人类水准的综述，而且引用全部可核验。
- **Agent 工程师和研究者**：五 Agent 协作、停机规则、评分回退机制、VLM 反馈环——这套架构本身是 2026 年多智能体设计的教科书级参考实现，比大多数 demo 项目更值得精读源码。
- **科研团队负责人**：可以拿它做"稿件预评审"，让 Content Refinement Agent 先替你把明显问题挑出来再送人审。
### 收益量化
- **时间**：从"数周手工整理"压到"40 分钟初稿 + 2–3 天人工精修"，相当于把最后一公里的机械劳动压缩一个数量级。
- **引用质量**：每篇 45–48 条 Semantic Scholar 验证引用，对比 GPT-4 直接生成动辄 30% 幻觉引用的现状，是质的飞跃。
- **格式合规**：LaTeX 模板对齐 + 表格从实验日志自动构建，省掉反复调整 `\\columnwidth` 和 `\toprule` 的悲剧时间。
---
## 局限与不足：不想让你踩的几个坑
客观说，PaperOrchestra 远不是"一键出 CVPR 论文"的银弹，下面这些问题值得清醒认识。
**1. 数据集和部分能力还没有完全开源。** 主仓库 README 明确写着 PaperWritingBench 的数据集"不在本仓库内，将单独发布"。截至当前，部分输入素材格式只能从论文附录 F 反推，新手要花时间摸索。社区版 fork（Ar9av/PaperOrchestra）反而提供了更细的 SKILL 文档作为补充。
**2. "Not an officially supported Google product" 不是客套话。** 没有官方支持意味着 Issue 响应依赖团队个人精力，遇到 API 改版、模型下线等问题可能要自己动手 patch。Apache 2.0 协议友好，但稳定性不及商业产品。
**3. ICLR 单栏格式上仍有明显差距。** ScholarPeer 模拟录用率 CVPR 84% vs GT 86%（基本追平），但 ICLR 只有 81% vs GT 94%（差 13 个百分点）。这说明在长篇、单栏、强调理论推导的格式下，PaperOrchestra 还有硬骨头没啃下来。
**4. 模拟录用率 ≠ 真实录用率。** ScholarPeer 本身就是同团队的 LLM 评审系统，"84% 录用率"是 Sim 而不是 CVPR 委员会的真实决定，引用这个数字时务必加上限定词。
**5. 学术诚信红线没有消失，只是被位移了。** API 验证杜绝了"引用不存在"的幻觉，但无法杜绝"引用不相关"、"叙事扭曲"、"数据被不合理编排"这类更深的问题。论文伦理声明里也明确：**人类研究者必须对事实准确性、原创性、有效性负全责**。CVPR、ICLR、NeurIPS 等会议对 AI 生成内容的政策仍在动态调整中，投稿前需要查清目标会议的最新条款。
**6. 强依赖外部 API。** 没有 OpenAI/Gemini Key + Semantic Scholar Key 就跑不起来。一次完整流程 60–70 次 LLM 调用，按 Gemini 2.5 Pro 计价大约几美元到十几美元一篇，写十篇就是一个 Bonfire 周末的饭钱——不算贵，但也不是免费的。
**7. 概念图质量有上限。** PaperBanana 生成的架构图能"过关"，但要达到人类设计师那种"一眼秒懂 + 审美在线"的水平还差一截。对图表要求苛刻的论文（比如系统类、可视化类）建议还是自己画关键 figure，让 AI 补次要图。
**8. 不解决"研究本身好不好"。** 这是它和 AI Scientist 的根本分野：PaperOrchestra **不会**替你判断 idea 是否新颖、实验是否充分、结论是否站得住脚。它解决的是"写出来"，不是"想出来"。如果你的实验本身就有硬伤，AI 帮你写得再漂亮也救不了它。
**9. 中文学术写作完全不在射程内。** 论文、模板、评审、基准全部围绕英文顶会体系，对中文期刊、中文论文写作者来说基本不可用，需要自己魔改。
---
## 结语与行动建议
**如果你只能记住一句话**：PaperOrchestra 不是又一个"AI 写论文"的营销 demo，它是 2026 年这个赛道第一份把**架构设计、Benchmark、自动评估器、API 验证机制**都老老实实做出来的严肃工作，**值得任何要做 Agent 工程或要写论文的人花一个下午精读源码**。
给你三条分场景的建议：
- **如果你想立刻用**：先把 `idea.md` 和 `experimental_log.md` 整理干净（这一步偷懒后面全是坑），用 Gemini 2.5 Pro 跑一篇生成看效果，再决定要不要批量接入工作流。CVPR 模板优先试，效果比 ICLR 模板稳。
- **如果你是 Agent 工程师**：别只把它当工具用，去扒 `methods/` 目录下五个 Agent 的 prompt 设计和 halt rules，那是论文附录 F 公开的核心资产，是目前最完整的"多 Agent 写作流水线"参考实现之一。
- **如果你是科研管理者或审稿人**：把它放进你的"必需了解"清单——不管你愿不愿意，未来两年的投稿里会出现越来越多类似工具生成的内容，理解它的能力边界比一味禁止更有意义。
仓库地址：`github.com/google-research/paper-orchestra`，论文：arXiv 2604.05018，项目主页：`yiwen-song.github.io/paper_orchestra`（含生成手稿画廊，可以先看看 CVPR/ICLR 真实生成样例再决定要不要上手）。
