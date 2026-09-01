# Imbad0202/academic-research-skills

[GitHub URL](https://github.com/Imbad0202/academic-research-skills)


## Academic Research Skills (ARS) 深度评测

> 面向 Claude 的学术研究全流程技能包，提供从选题、写作到审稿的结构化人机协作框架。

- **Tags**: Claude, 学术写作, 科研辅助, GitHub 开源, AI Agents
- **Category**: 科研工具, AI 编程, 效率提升

## Details

# Academic Research Skills (ARS) 深度评测
## 一句话总结
Academic Research Skills（ARS）是一套面向 Claude Code 的“学术研究全流程技能包”，把从选题、文献调研、写作、审稿到修订与定稿的完整科研流水线结构化为可重复、可验证的“人机协作框架”，尤其适合把 Claude 当作研究副驾驶的硕博与科研人员。
---
## 背景与痛点：它为什么出现？
### 学术场景里的“老大难”
- 引用幻觉与数据假造屡见不鲜。一项对 2.5M 篇论文、1.11 亿条参考文献的审计发现，2025 年至少 14.6 万条疑似“幻觉引用”，且 2024 年中后呈明显加速。
- 全自动“AI 科研”虽然炫酷，但经验证存在实现 bug、结果虚标、方法论伪造、引用虚构等系统性失效模式。
- 日常研究流程里，重复劳动占掉大量时间：找文献、做系统综述、核对引用、统一格式、检查逻辑与图表一致性，这些环节高度可结构化却极耗人力。
### ARS 的设计定位
- “人机协作”，而非“全自动代写”。AI 负责可重复的验证、综合与一致性检查；人保留研究方向、方法选择、数据解读与发表决策的完全主权。
- 在关键的 Stage 2.5 与 Stage 4.5 设置“完整性闸门（Integrity Gates）”，对引用存在性、主张—引用对齐、方法论报告、图表/表格一致性等进行机器验证，然后由人确认后再放行。
- 明确的边界：ARS 不验证“你真的做了实验”或“原始数据是否真实”，只验证你报告的内容与流程之间的一致性。
---
## 核心亮点与功能剖析
### 1) 四大核心技能（4 Skills）与多 Agent 编排
- Deep Research（深度研究）：13 Agent 研究团队，支持 PRISMA 系统综述、语义学者 API 验证、苏格拉底引导模式、对话健康监测与可选跨模型领域适配。
- Academic Paper（论文写作）：12 Agent 写作流水线，提供文风校准、写作质量检查（避免“机器味”）、LaTeX 加固、修订辅导、引用格式转换、防泄露协议，以及视觉大模型图表核验。
- Academic Paper Reviewer（论文审稿）：7 Agent 多视角同行评审（主编+3 动态评审员+魔鬼代言人 Devi’s Advocate），带 0–100 量化质量打分、让步阈值机制、R&R 可追溯矩阵与只读约束等。
- Academic Pipeline（全流程编排）：10 阶段编排器，包含自适应校验节点、主体验证、Material Passport（素材护照）与可选的成果复刻锁定、跨模型完整性核验、会话中途强化等。
### 2) 完整 Pipeline 与“完整性闸门”
- 10 阶段：RESEARCH（1）→ WRITE（2）→ 完整性闸门 2.5 → REVIEW（3）→ REVISE（4）→ 最终完整性闸门 4.5 → FINALIZE（5）→ PROCESS SUMMARY（6）。中途包含 Revision Coaching、Re-Review、Residual Coaching 等循环，确保问题收敛。
- Stage 2.5 / 4.5 闸门运行“7 模式阻断检查清单”，机器先跑完整性报告（引用存在性、主张—引用对齐、统计/数字是否可疑等），然后由人“确认/放行”后再推进。
- 每个阶段都以“用户确认检查点”收尾，把高权重的决策（比如大纲通过、主编决定、修订策略、格式选择）牢牢留给人。
### 3) 学术诚信与可信度机制
- 引用存在性与“主张—引用”对齐：每个引用携带三层锚点（trust-chain frontmatter + locator anchors），并可在启用 `ARS_CLAIM_AUDIT=1` 时拉回原文核对是否真正支持主张；对 claim-not-supported、negative-constraint-violation、fabricated-reference 等“高警”类别进行阻断。
- 跨模型验证（Cross-model）：可通过环境开关启用第二模型族来执行关键点的盲检与对抗性评审（如 Devil’s Advocate 与关键分歧点），减少单一模型的“相关性偏差”与系统化幻觉。
- 缓存与新鲜度控制：引用验证结果缓存在本地 SQLite 中，并提供“陈旧警告”与可选实时重新验证（`ARS_CACHE_REVALIDATE=1`），以平衡成本与时效。
- PDF 预检与读范围声明：新增 PDF 页数交叉检查避免“截断 PDF 被当作正常”，并支持在人工阅读账本上声明读范围（full_text / sections / abstract_only / toc_only）。
### 4) 多语言、多格式与输出质量
- 语言支持：英文与繁体中文开箱；苏格拉底/规划模式支持意图检测，可用其他语言交互。
- 引用格式：APA 7.0（默认）、Chicago、MLA、IEEE、Vancouver。
- 文档结构与输出：IMRaD、主题综述、理论分析、案例研究、政策简报、会议论文等；输出 Markdown 原生支持，按需可选 DOCX（需 Pandoc）、LaTeX/PDF（需 tectonic + 字体）。
- 真实 pipeline 产出示例：展示一篇完整论文的 10 阶段产出，包含终稿（中英文）、多轮评审意见、完整性报告（Stage 2.5 捕获 15 条伪造引用+3 处统计错误；Stage 4.5 确认零回退）、审稿回复与发表后独立审计（发现 68 项中的 21 项遗漏）。
### 5) 技术栈与架构精妙
- 主语言为 Python，但核心技能以“提示工程+协议化 prompt”为主；Python 主要用于适配器、校验脚本与工具（如引用验证缓存、修订 Token 一致性检查、PDF 预检等）。
- “Material Passport”作为统一的物料交接载体，可携带文献语料库（Zotero/Obsidian/本地 PDF）、实验来源与复刻锁等，确保阶段的输入/输出可溯源、可审计。
- 详细的架构文档：ARCHITECTURE.md 提供流程图、阶段矩阵、数据流、技能依赖图、质量门控等，是了解“哪一步在哪、谁看到什么”的最佳入口。
---
## 目标人群与收益：谁值得用、得到什么？
- 硕博研究生、高校科研人员：能大幅压缩文献梳理、初稿起草、格式整理和检查的时间，把精力放在研究问题设计与论证逻辑上。
- 系统综述/论文写作新手：提供 PRISMA 规范、结构化大纲、同行评审模拟等“脚手架”，减少盲区。
- 期刊审稿人/编辑：可用 Reviewer 模式进行多视角审稿并输出结构化评分与理由。
- 教学端：配合其姊妹“Teaching Skills”，可把课程设计—授课—评估—反思纳入同一方法论框架。
具体收益（可度量）
- 一篇约 1.5 万词论文的完整流水线，官方估算 Token 成本约 4–6 美元（会因模型选择与调用次数浮动）。
- 文献检索与引用校验自动化，减少查文献与对参考文献的人力成本。
- 一体化 Markdown/DOCX/LaTeX 输出，无需后端手动转格式与排版（仍建议人工复核）。
- 通过 Stage 2.5/4.5 完整性报告，明显降低“漏改引用”“数据口径前后不一”等低级错误风险。
---
## 竞品/同类对比：在学术 AI 助手里的位置
- 与“全自动 AI 科研管线”（例如 The AI Scientist 等）的对比：ARS 强调“人类始终在回路”，避免全自动化带来的方法伪造、结果虚构等风险。
- 与通用写作/润色工具相比：ARS 面向学术场景深度定制，包含 PRISMA 系统综述、引用验证、格式规范、审稿模拟与完整性闸门，不仅仅是“润色文字”。
- 与单一功能的文献/笔记工具相比：ARS 把研究—写作—审稿—修订串联成一条 pipeline，而非孤立工具。与之配合的外部“文献语料适配器”可把 Zotero/Obsidian/本地 PDF 预填充到 Material Passport，实现“语料优先”的检索。
差异化竞争力（简要）
- 将“科研方法论（PRISMA、IMRaD 等）”与“多 Agent 协作”融合，形成可复用的工作流协议。
- 内置可信度与审计机制：引用存在性、主张—引用对齐、图/表核验、PDF 预检、读范围声明、跨模型盲检等。
- 完善的文档与工程实践：ARCHITECTURE.md、SETUP.md、RISK_REGISTER.md、DATA_FLOWS.md 等。
---
## 局限与不足：这些坑要提前知道
- 门槛与前置：
  - 需要使用 Claude Code（CLI / VS Code / JetBrains），并设置 ANTHROPIC_API_KEY。
  - DOCX 与 PDF 输出需要额外工具（Pandoc、tectonic + 字体），配置不当会降级到“仅 Markdown + 转换指引”。
  - Windows 用户如需 write-scope guard（写作用域守卫）最好安装 Git Bash，否则仅会降级为“不启用”，但不影响核心技能。
- 成本与性能：
  - 完整流水线调用多 Agent，Token 消耗明显（官方示例给出 15k 词约 4–6 美元，量级可控但不可忽视）。
  - 跨模型验证会进一步增加 API 调用成本，需按需开启。
- 能力边界：
  - ARS 不执行实际实验（代码或人因研究），不验证“你真的做了实验”，只核验报告与声明之间的一致性；实验真实性仍由研究者负责。
  - 虽然有“模型分层（Model Tiering）”与“跨模型手封”，但判断类任务依然由模型完成，存在判别偏差的可能。
- 文档与学习曲线：
  - 仓库文件众多、概念密集（Material Passport、阶段、闸门、数据访问等级、任务类型标注等），初读会感觉“信息量爆炸”，建议从 QUICKSTART 与 ARCHITECTURE.md 入手。
- 许可与使用：
  - 开源协议为 CC BY-NC 4.0，仅允许署名—非商业使用；若需商业用途需另行取得授权。
---
## 上手门槛与部署体验：如何开始？
### 最小可用安装（Markdown + DOCX 转换指引）
- 安装 Claude Code（CLI），并配置 ANTHROPIC_API_KEY。
- 在仓库目录（或任何含 ARS 的项目目录）运行 `claude`，然后在会话中使用自然语言或 Slash 命令即可开始。
### 推荐：Plugin 一键安装（Claude Code v3.7.0+）
```
/plugin marketplace add Imbad0202/academic-research-skills
/plugin install academic-research-skills
```
- 验证：运行 `/ars-plan`，描述你的论文主题，ARS 会以苏格拉底对话的方式帮助你搭建论文结构；或使用 `/ars-lit-review "你的主题"` 做一次快速文献综述测试。
### 可选：增强输出
- DOCX：安装 Pandoc。
- PDF（APA 7.0）：安装 tectonic 与字体（Times New Roman、Source Han Serif TC VF / 思源宋体、Courier New）。
- 可选依赖：真实 Python（用于部分 opt-in 功能，如 revision-patch、提交包验证与部分命令）。
### 社区活跃度与生命力（客观指标）
- GitHub：约 4.4 万+ Stars、约 3.4k Forks，可见其在学术工具类目中的关注度。
- Release：近期版本如 v3.19.0/3.18.0/3.17.0 的更新日志详细、频繁，涵盖“修订轮次主张漂移防护”“PDF 读取完整性预检”“读范围声明”“跨模型手封标准化”等高价值改进。
- 文档体系完整：包含 ARCHITECTURE.md、SETUP.md、RISK_REGISTER.md、DATA_FLOWS.md 等，并持续更新。
---
## Demo / 代码示例（最简、核心、可运行）
### 示例 1：苏格拉底式规划论文结构
- 命令：`/ars-plan`
- 你接下来输入：`我想写一篇关于“生成式 AI 对大学教学质量评估的影响”的研究论文，IMRaD 结构，目标期刊偏好实证研究与政策简报。`
- ARS 会以多轮对话问你：
  - 研究问题（RQ）的精确定义
  - 研究范围（年级/学科/地区）
  - 数据来源与类型（问卷/行政数据/访谈）
  - 方法蓝图（量化/质性/混合）
- 最终产出：RQ Brief + Methodology Blueprint，作为 Stage 1 的交付物。
### 示例 2：快速文献综述测试
- 命令：`/ars-lit-review "生成式 AI 在高等教育中的伦理风险"`
- 典型流程：
  - 制定检索策略（关键词、数据库、时间窗）
  - 执行检索与初步筛选
  - 结构化摘要与对比
  - 生成带引用的综述草稿（支持 APA 7.0 等格式）。
### 示例 3：审稿人模式
- 命令：`Review this paper`，然后上传或粘贴待审稿的文本（配合 Material Passport 会更稳健）。
- 审稿面板（7 Agent）视角：
  - Journal-Fit Reviewer：评估与目标期刊的匹配度。
  - 3 位动态评审员：从不同方法论与写作角度评审。
  - Devil’s Advocate：刻意质疑薄弱环节与“过度平滑化”的论断。
- 输出：带 0–100 评分与“证据锚定”的评审意见，以及作者回复建议。
---
## 结语与行动建议
终极评判
- ARS 并不是一个“论文生成器”，而是一套让 AI 变成“靠谱研究副驾驶”的工作流协议与工程实现：把繁杂重复的工作交给多 Agent，把研究决策与最终把关留给人。
- 它在引用可信度、流程完整性、跨模型验证与材料溯源上的设计，明显超越了“提示词集合”或简单模板，是真正面向“学术诚信”的工程化方案。
- 但它也有清晰的能力边界：不替代你做实验、不替代你判断方法的合理性、也不能保证完全零幻觉。使用者仍需具备基本的学术训练与批判性思维。
行动建议（三类典型读者）
- 新手 / 小白：先从 `/ars-plan` 与 `/ars-lit-review` 两个命令开始，熟悉 ARS 的苏格拉底式引导与结构化输出；不必急于跑全流程，等舒适后再尝试 10 阶段 pipeline。
- 资深研究者 / 审稿人：优先使用 Academic Paper Reviewer 与 Stage 2.5/4.5 完整性闸门，把它们整合到投稿前的“自查清单”，并将 Material Passport 用于团队协作与可复现性管理。
- 开发者与工具制作者：精读 ARCHITECTURE.md、RISK_REGISTER.md 与 DATA_FLOWS.md，借鉴其“人机契约”“阶段化门控”与“数据访问等级”等模式，把这些思想迁移到垂直领域的 Agent/Skill 设计中。
如何开始第一步
- 确认你已安装 Claude Code 并准备好 ANTHROPIC_API_KEY。
- 用 Plugin 一键安装：
  - `/plugin marketplace add Imbad0202/academic-research-skills`
  - `/plugin install academic-research-skills`
- 跑一遍 `/ars-plan`，描述你正在构思或正在写的一篇论文，感受“苏格拉底式规划”的节奏——这通常是 ARS 给人的“第一印象”。
---
## 参考与延伸阅读
- 仓库 README 与 QUICKSTART、ARCHITECTURE.md、SETUP.md 等（安装、架构与配置）。
- Releases 与变更日志（v3.19.0/3.18.0/3.17.0 的闸门、跨模型手封、PDF 预检等更新细节）。
- 社区文章（如“学术写作不该是一个人的事”等完整流程 walkthrough）与 Showcase（真实 10 阶段产出示例）。
