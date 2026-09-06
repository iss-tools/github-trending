# aipoch/open-science

[GitHub URL](https://github.com/aipoch/open-science)


## Open Science：本地优先的 AI 科研工作台

> 本地优先、模型无关的开源 AI 科研工作台，集成聊天、代码执行、文献溯源等功能。

- **Tags**: 开源, AI 科研, 本地优先, 代码执行, 溯源
- **Category**: 科研工具, AI 应用, 开发工具

## Details

# 一句话总结
Open Science 是一个本地优先、模型无关的开源“AI 科研工作台”，它把聊天、代码执行、文献与数据库连接、远程计算、产物溯源与评审统一到一个桌面应用里，让“从提问到可追溯的图表/报告/代码”在一个窗口内闭环完成。
---
## 背景与痛点：为什么现在需要它？
- 科研工作流碎片化：读文献、写代码、跑实验、查数据库、写报告，常常分散在浏览器、Notebook、终端与各类网站之间，上下文在每次切换中丢失，事后“这张图怎么来的”很难说清楚。
- 复现性危机：学术论文提供完整代码与环境的比例不高，导致复现困难、协作成本高，缺乏一条把“提问—代码—产物—评审”串起来并保持溯源的链路。
- 闭源 AI 助手的局限：市面上的 AI 科研助手多属云端闭源产品，无法自定义模型、难以接自有数据、难以审计内部行为，且多带席位许可证（seat license），不适合团队与机构自托管、二次开发或审计合规。
- 工具爆炸但缺乏“统一控制台”：生信、化学、材料、环境等领域的数据源与脚本工具越来越多，研究者往往要在十几个标签页与 CLI 之间来回折腾，缺乏一个可统一编排的“科研桌面”。
Open Science 的出现，就是要用一个本地优先的桌面工作台，把这些碎片重新拼成一条“可执行、可审计、可分支”的科研流水线。
---
## 核心亮点与功能剖析
### 1) 本地优先 + 模型无关
- 本地优先：项目、会话、文件、设置、凭证均存在本地；API Key 使用操作系统安全凭证存储（keychain/credential store），不会自动上传日志；桌面后端可以开启 localhost Web 与 headless 模式，满足内网与远程访问需求。
- 模型无关：支持主流云供应商与自定义网关，当前内置支持的厂商包括 OpenAI、Anthropic（Claude）、Grok（xAI）、DeepSeek、智谱 GLM、Kimi（Moonshot）、MiniMax、StepFun、小米 MIMO、SenseNova、火山方舟、阿里百联、NVIDIA Build、腾讯 TokenHub、OpenRouter 等，并可复用已有的 Claude 或 Codex 订阅登录，避免重复买号。
- 多后端、可切换：Agent 运行时可选用 Claude Code、OpenCode、Codex 或 CodeBuddy 四种后端，可在设置中安装、切换与卸载；同一个会话支持中途切换兼容的模型/供应商而不必重连。
### 2) 项目与会话：科研过程的结构化“容器”
- 项目层面统一管理：每个项目包含会话、上传、生成文件与预览状态，避免文件散落与版本混淆；支持 Pin（置顶）、搜索、会话分组与草稿持久化。
- 会话与分支：编辑一条已发送的用户消息会创建“新分支”，原有后续对话不会丢失；可随时在不同分支间切换，用于对比不同假设与分析路径。
- @ 与 /：在消息中用 @ 引用项目内文件，用 / 调用已启用的技能（skill），让上下文与意图更明确。
### 3) 执行：Python/R Notebook、Shell、远程 HPC（SSH）
- 多内核：持久化的 Python/R/Shell 控制面；Notebook 支持应用自带环境，也支持“自带解释器”（BYO）；共享终端可在会话中与 Agent 共用，输入时还能从运行的内核获得“变量名补全”。
- 变量查看与包清单：运行时面板提供只读的“变量浏览”（名称、类型、形状、预览）和已安装包清单；Notebook 历史记录可渐进加载。
- 远程计算：内置“Remote Compute（SSH）”技能，可在设置中注册 HPC 集群，支持密钥或密码认证（含 Windows），异步提交任务并在任务完成后自动拉起分析回合，不需要手写轮询脚本。
### 4) 产物与溯源（Provenance）：每张图、每份报告都“有来历”
- 不可变产物：每个生成产物（图、表、报告、脚本等）都保存为带校验和的“版本”，后续编辑不会覆盖之前版本（v0.25.0 增强了文本类产物的可编辑与版本对比）。
- Provenance 视图：对任意产物的任一版本，可查看其生成证据——产生代码、执行历史、输入引用、环境清单、会话分支、以及评审证据（若启用）；对无法验证的证据会明确标记“不可用”，而非猜测。
- PDF 阅读上下文与标注：会话可链接最多 3 篇 PDF，Agent 可逐页阅读、检索；文本与区域选择会成为“证据标注”，并在源文件中点击显示；图片标注也可将选中区域注入对话上下文（v0.23.0 起）。
### 5) 技能（Skills）与连接器（Connectors）：可组合的“科研插件生态”
- 18 个精选内置技能：如 AlphaFold2、Boltz、Borzoi、Chai-1、DiffDock、ESM-2/ESMFold2、Evo 2、LigandMPNN、ProteinMPNN、scGPT/scvi-tools、Literature Review、OpenFold3、SolubleMPNN、Indication Dossier 等，覆盖结构预测与设计、单细胞组学、文献综述与远程计算等场景；技能可通过 @/ 加载，也支持从 GitHub 带鉴权预览与导入。
- 24 个内置科研连接器：包括 Literature Graph、PubMed、bioRxiv、Genes & Ontologies、Genomes、BioMart、Variants、Human Genetics、Clinical Genomics、Structures & Interactions、Protein Annotation、Expression、Omics Archives、CellGuide、Regulation、RNA、Chemistry、ChEMBL、ZINC、Molecule Viewer、Clinical Trials、Drug Regulatory、Cancer Models、Research Resources 等。
- MCP 生态支持：除内置连接器外，支持导入/导出标准 MCP（Model Context Protocol）客户端配置，接入更多本地/远程 MCP 服务；技能与连接器均受权限系统控制，并支持打标签与批量管理。
### 6) 安全与权限：人机协同的“审批流”
- 三级审批模式：Ask for approval（新建/敏感数据阶段推荐）、Auto-approve edits（可信文件编辑）、Full access（受限、完全可信、无人值守场景），并支持全局/项目/会话维度的持久性授权与撤销、Undo。
- 集中凭证管理与健康检查：GitHub Token、连接器密钥与登录统一管理，支持健康状态检测与引导式恢复；日志本地保存，默认不上传；提醒在公开 Issue/截图中避免泄露密钥与隐私数据。
- Notebook 网络隔离（v0.24.0 起）：macOS/Linux 默认开启，Windows 在管理员设置完成后生效；仅允许访问默认的科学与白名单域名，被阻止的目标会在对话中弹出审批，而非静默失败。
### 7) CLI、Headless 与 SDK：自动化与集成的利器
- 一键安装 CLI：在设置中安装命令行工具 open-science，无需额外 Node.js；CLI 可以启动后台服务、创建项目、提交任务并以 JSON/JSONL 导出结果、下载指定产物等，适合 CI/CD 与脚本化调用。
- Headless 与 Web 模式：桌面后端可仅提供 localhost Web（默认端口 44100，可由 OPEN_SCIENCE_WEB_PORT 修改）与 headless 模式（无 Electron 窗口），便于服务器部署与多终端访问；支持通过 Remote.It 在移动端安全访问桌面工作区（配对码、可撤销）。
- SDK：零依赖 Node.js SDK 复用同一本地守护进程与项目/会话/凭证，用于编写自定义自动化流程（文档见 CLI/SDK 指南）。
### 8) 评审与记忆：把“质量控制”嵌入闭环
- 可选“评审人（Reviewer）”：在完成后对单轮对话进行审计，基于其抄本、执行日志与产物给出 pass/warn/fail 结构化报告，并在受限工具环境下运行“有限修复循环”；可设置评审策略（跟随主模型或专用提供商/模型/推理档位）。
- 持久记忆（v0.22.0 起）：项目级记忆按类别组织，在会话间自动召回；管理界面可查看与清理。
---
## 目标人群与收益：谁能从中受益？
- 做数据密集型研究的科研生/博后/PI：把“提出假设→查文献→写代码→跑实验→写报告”集中在一处，避免上下文在多个工具间“反复搬运”；每张图/表都与代码、输入、环境、评审记录挂钩，大幅降低事后复盘与返工成本。
- 生信/化学/材料/环境等领域的计算研究者：内置连接器直达 PubMed/bioRxiv/ChEMBL/ZINC/Structures & Interactions 等；内置技能覆盖结构预测、蛋白设计、单细胞分析等常见流程，避免从零拼脚本与拼 API。
- AI4S/科研团队与实验室：Apache-2.0 协议允许商用与二次开发；模型无关与后端可切换，避免被单一供应商绑定；CLI/SDK/headless 模式适合接入已有数据流与算力平台；SSH 远程计算技能无缝衔接集群任务。
- 合规与审计敏感场景：本地优先与权限控制让“数据不出域/可审计”成为可能；产物溯源与评审记录为合规审计提供证据链；可选隔离登录（如 Claude 的 isolated setup-token）进一步减少隐私风险面。
---
## 竞品/同类对比：它处于什么位置？
| 维度 | Open Science | 通用聊天型（如 ChatGPT/Claude Web） | Notebook + 手工脚本（Jupyter/VSCode） | 其他 AI 科研助手（闭源工作台） |
|---|---|---|---|---|
| 本地优先与数据所有权 | 本地优先，项目/文件/凭证均在本地；日志不上传；可 headless/Web/CLI 多形态 | 云端为主，数据需发送至供应商 | 完全本地，但缺乏统一的“Agent 指挥”与溯源能力 | 多为云端闭源，难以自托管与审计 |
| 模型无关/供应商可换 | 是；支持多家内置 + 自定义网关 + 订阅登录，可在会话中热切换 | 否，被供应商绑定 | 需自行在代码中接不同 API | 通常绑定单一供应商/模型 |
| 执行能力 | 内置 Python/R Notebook、Shell、SSH 远程、文件读写、连接器调用，带权限控制与审批 | 仅靠生成代码，需自己复制粘贴 | 完全掌控，但缺乏“自动编排与建议” | 有一定执行能力，但不可见/不可审计 |
| 产物溯源与评审 | Provenance 视图展示代码/执行/输入/环境/分支/评审；不可变版本；可选择“评审人”自动审计 | 无 | 需自行管理 Git/环境/记录 | 溯源与审计能力不透明或受限 |
| 可扩展生态 | 内置技能/连接器；支持 MCP、从 GitHub 导入技能、创建个人技能； Specialists 市场；Apache-2.0 | 插件生态有限且多为云端 | 完全自由但缺乏统一“能力描述与发现”机制 | 插件能力与 API 有限且闭源 |
| 学习与维护成本 | 有学习曲线（权限模型、技能/连接器、分支/溯源）；但文档与 FAQ 较完整 | 入手门槛低 | 需维护环境/脚本/管道 | 易用但不可控，难以集成到自有设施 |
---
## 技术栈与架构解析（面向开发者）
- 桌面应用：基于 Electron + React + TypeScript 构建，使用 Prisma/SQLite 做本地持久化；开发需 Node.js 22 与 npm（.nvmrc 指定版本）。
- Agent 运行时：基于 ACP（Agent Client Protocol）封装，支持多种后端（Claude Code/OpenCode/Codex/CodeBuddy），后端可在设置中安装/切换/卸载；支持评审人、子代理委派（subagent delegation）与会话计划（review-gated session plans）等高级编排能力。
- 技能与连接器：技能是“能力单元”（含 SKILL.md 与脚本），遵循“Agent Skills”规范，支持懒加载与按需注入；连接器基于 MCP，可本地/远程部署，支持统一权限管理与导入/导出。
- CLI/SDK：使用同一本地守护进程与数据模型，CLI 一键安装并添加到 PATH，无额外 Node.js 依赖；适合脚本/流水线集成。
---
## Demo / 代码示例：极简上手
### 方式 A：直接安装桌面客户端
- 到 Releases 页下载对应平台的安装包（macOS DMG/Windows installer/Linux AppImage 或 deb）。
- 首次启动完成五步向导（Environment → Data location → Agent runtime → Model provider → Notebook runtime）。
- 新建项目，开始会话，@ 引用本地文件，/ 调用内置技能（例如 /literature-review 或 /remote-compute-ssh）。
### 方式 B：从源码启动开发环境
- 前置：Node.js 22（nvmrc 指定）与 npm，Python 3 仅在需要 Notebook 执行时必需。
- 命令：
```bash
git clone https://github.com/aipoch/open-science.git
cd open-science
npm install
npm run dev
```
- 开发数据位于 ~/.open-science-project；可用 npm run dev:web / dev:headless 启动 Web/headless 模式。
### 方式 C：CLI 示例（来自官方 README）
```bash
# 后台启动服务
open-science start --no-open
# 创建项目并运行任务
open-science project create "Systematic review"
open-science run --project "Systematic review" \
  --prompt-file ./task.md \
  --approval-profile auto \
  --skill literature-review \
  --wait --json
# 列出产物并下载
open-science artifacts list <session-id> --json
open-science artifacts download <artifact-id> --output ./report.md
```
---
## 社区活跃度与生命力
- 版本迭代：README 标注“Open Science v0.23.0 released（last updated August 2026）”，ROADMAP 明确列出 v0.22.0–v0.25.0 的关键改进与版本内容，说明在持续交付新功能。
- 功能成熟度：ROADMAP 明确这是一个“早期预览但可用”的状态；Horizon 1（科学连接）已可用，Horizon 2（Agent 可移植）正在推进，Horizon 4 的可追溯性已有基础实现；未来目标是“确定复现”，当前交付的是“可追溯”和“证据显式化”。
- 社区渠道：GitHub Issues/Discussions、Discord、X（@aipoch_ai）、官网等入口；鼓励贡献与反馈，具备活跃生态的基础设施。
- 生态联动：与 AIPOCH 组织下的 medical-research-skills（500+ 医学与科研技能）协同，技能可从 GitHub 直接导入与使用。
---
## 局限与不足：冷静看到边界
- 仍在“早期预览”：一些高级能力（如“确定复现”——完整重建环境与回放会话）仍在 Roadmap 中，尚未实现；未来可能存在不兼容变动。
- 学习门槛：权限模型（审批模式）、分支/溯源、技能与连接器的管理，对非技术背景的研究者需要一定上手时间；若仅把当“聊天框用”则浪费了其大部分价值。
- 模型成本与合规风险：模型调用仍需外部 API（或复用订阅），会产生费用；需自行评估数据出境/隐私政策与合规要求，尤其是敏感数据。
- 本地执行仍需谨慎：技能与连接器可执行代码或发送数据到外部，启用前务必审查其源码、许可与网络行为；权限控制只能降低风险，不能替代安全审计。
- 平台兼容细节：尽管提供 macOS/Windows/Linux 安装包，但部分能力（如 Notebook 网络沙箱）在 Windows 上需要管理员设置完成后才生效；需根据平台做必要配置。
- 不替代科学判断：官方 FAQ 明确“不替代科学审校”，输出仍需领域专家复核、统计验证与原始证据对照。
---
## 结语与行动建议
- 终极评判：Open Science 不是又一个“聊天框 AI”，而是一个为可复现科研量身打造的开源工作台。它把“聊天—代码—数据—远程计算—评审—溯源”整合在一个本地可控的桌面环境里，非常适合科研团队与 AI4S 从业者作为“日常指挥台”。当前虽处早期预览，但其设计与交付节奏显示“真实可用、方向清晰”，值得关注与早期试用。
- 行动建议：
  - 如果你是科研生/博后：建议先从桌面安装与内置技能/连接器体验一个完整闭环（如文献综述→小规模分析→可追溯图表）；熟悉分支与溯源视图，养成“用分支管理假设、用溯源回查结论”的习惯。
  - 如果你是团队/实验室技术负责人：可在隔离环境先做 PoC，评估与你常用数据库、HPC 与模型供应商的集成；结合 CLI/SDK 考虑如何接入现有流水线；关注 Apache-2.0 协议与安全/合规边界。
  - 如果你是开发者/生态贡献者：可从技能/连接器入手贡献（遵循 Agent Skills 规范），也可参与 Roadmap 中的“确定复现”与“开放科学生态”等长期目标；Source-first 与 MCP 是很好的扩展切入点。
**一句话收尾**：Open Science 把“AI+科研”从黑盒玩具变成白盒工具，适合愿意为“可复现、可审计、可控制”付出一点学习成本的人早点入局、慢慢上手。
