# Tencent/teamai-cli

[GitHub URL](https://github.com/Tencent/teamai-cli)


## TeamAI-CLI：基于 Git 的团队 AI 能力管理平台

> 用一条 Git 仓库统一管理团队的 AI 技能、规则、钩子与知识库，自动同步到每位成员的本地 AI 工具。

- **Tags**: TeamAI, AI 协作, MCP, GitHub, 腾讯开源
- **Category**: 开发工具, AI 编程

## Details

# TeamAI-CLI 深度评测
---
## 一句话总结  
TeamAI-CLI（腾讯开源）是“团队 AI 动力总成”：用一条 Git 仓库统一管理团队的技能、规则、钩子、MCP 服务器与知识库，并通过 `teamai pull/push` 自动把这些能力同步到每位成员的本地 AI 工具（Claude Code、Cursor、Codex 等），让“每一条 AI 会话都按团队规范跑、并为团队积累可复用知识”。
## 背景与痛点：它解决了什么核心问题？  
痛点可以概括为“三个分散”：
- **经验分散**：每个开发把 Prompt、调试技巧、踩坑笔记散落在本地、聊天记录或 Wiki，检索难、复用难。
- **配置分散**：钩子（pre-commit、安全扫描）、MCP 服务器、插件、环境变量等配置各玩各的，新人成本高，版本漂移大。
- **改进分散**：团队不知道“AI 在哪儿帮了忙、在哪儿被怼、在哪儿重试了很多次”，无法从摩擦中沉淀体系化改进。
TeamAI-CLI 的核心思路：把这一切“抽象成 Git 可管理的能力”，并直接喂给你的 AI 工具，让大家共同“写”和“读”团队的 AI 能力与知识。
## 核心亮点与功能剖析
### 1) One Harness（一条动力总成）：跨 Agent 的统一能力分发  
团队只需维护一个 Git 仓库，TeamAI 把里面的 skills/rules/docs/hooks/mcp 等分发到各工具的目录：
- Skills：按角色/标签订阅；  
- Rules：对 AI 的行为约束与指引；  
- Hooks：在 Agent 工具生命周期中注入自定义脚本（例如 PreToolUse 时的敏感扫描）；  
- MCP 服务器：一次声明，自动写入各工具的 MCP 配置；
覆盖的 Agent 与矩阵：
- Claude Code、Codex、Cursor、CodeBuddy、WorkBuddy、OpenCode、OpenClaw、Hermes、DeepSeek Harness、Qoder 等；  
- 每个工具在“执行/上下文/改进”三层的支持情况 README 有详细对照表。
**比喻：** Git 仓库是“团队 AI 操作系统”的系统镜像，`teamai pull` 相当于 `apt upgrade`，一键把所有组件升级到团队最新版本。
### 2) Push → Review → Pull：可评审、可追溯的能力变更流  
工作流简洁有力：
- `teamai push`：开分支 + 提 MR，对 Skills/Rules/Docs/Hooks/MCP 等的修改先进入评审；  
- 复用同一 MR：未合并前再 `push` 会原位更新 MR，避免大量重复 PR；  
- MR 合并后：成员在下一次 SessionStart 的钩子触发 `teamai pull`，把最新资源同步到本地（如 `~/.claude/skills`、`~/.cursor/skills` 等目录）。
**收益：** 能力变更像代码变更一样可审计、可回滚、可合规审批，减少了“顺手改一个 Prompt 导致团队统一风格崩塌”的风险。
### 3) Team Hooks（团队钩子）：把“硬规则”直接注入 AI 工具  
在 `hooks/hooks.yaml` 中声明钩子，例如在 Bash 工具执行前跑一次密钥扫描：
```yaml
hooks:
  - id: block-secret
    description: Scan for secrets before commit
    event: PreToolUse
    matcher: Bash
    command: 'bash -lc "~/.teamai/team-scripts/scan-secret.sh" || true'
    tools: [claude, cursor]
```
配套 CLI 管理：`teamai hooks list/inject/remove`，让团队统一部署安全/合规/质量脚本，而不是每个人写自己的 pre-commit。
**比喻：** 相当于给 AI 工具装了一套“系统级干预器”，在其调用工具之前/之后自动执行团队脚本（如告警、审计、阻断）。
### 4) MCP 服务器一键配置与更新  
在 `mcp/mcp.yaml` 中一次性声明 MCP 服务器，支持 `stdio/http/sse`，并在 URL/头里用 `${VAR}` 引用环境变量：
```yaml
servers:
  - name: gpu-analysis
    transport: http
    url: https://example.com/api/mcp
    headers:
      Authorization: Bearer ${GPU_ANALYSIS_TOKEN}
```
管理命令：
- `teamai mcp list/inject/remove`  
- 修改后 `teamai push` 发起 MR，全员 `pull` 后自动写入各自的 MCP 配置。
**收益：** MCP 不再是每个人“自己改 JSON/配置”的手工活，统一配置、统一更新、安全可控。
### 5) 技能订阅来源（Source）：多团队、多组织的能力共享  
支持订阅外部或跨团队的技能库：
```bash
teamai source add https://github.com/other-team/teamai-public.git --name other-team
teamai source list
teamai source browse other-team
teamai source remove other-team
```
拉取时自动把订阅源的技能一并同步；`teamai push` 把 `teamai.yaml` 变更分享出去，让团队成员“看到同样的订阅”。
**比喻：** 就像为团队 AI 工具装上了“NPM 源”，可以复用其他团队的技能包，而不必重复造轮子。
### 6) Team Packages：统一管理团队的 npm 包与 Claude 插件声明  
语法简单直观：
```bash
teamai packages install typescript
teamai packages install typescript@5.9.2 --npm
teamai packages install code-review@claude-plugins-official
teamai push       # 把声明共享给团队
```
团队成员执行 `teamai packages`，即可按声明安装全量依赖。
**收益：** 将“依赖即代码”的思想延伸到 AI 工具生态，新人无需手动装依赖/插件。
### 7) Team Context：让 AI 自动“读懂团队”  
- **自动经验分享**：在会话结束的 Stop 钩子里，根据“摩擦信号”（中断、更正、工具调用失败/重试等）打分。如果分数足够高，提示是否把此次经验总结并推送回团队仓库，示例提示里给出具体摩擦信号数量与脱敏任务摘要。用户同意后，内置的 `/teamai-share-learnings` skill 会产出一条学习文档。
- **团队知识召回**：需要显式开启。开启后，`teamai pull` 会部署内置 `teamai-recall` 子代理到各工具的 `agents/` 目录。AI 在执行任务前会调用该子代理——先做相关性预检，若无关联则跳过；若有则提取关键词并搜索团队知识库，返回结构化摘要。用户也可手动 `teamai recall "关键词"` 进行检索。
- **代码知识图谱**：用 `teamai import` 解析仓库为结构图并存储在 `teamwiki/`，后续召回时进行图增强重排序。支持跨仓库依赖边（通过 WASM tree-sitter 的 AST 轨道或启发式正则轨道）识别 `DEPENDS_ON/REFERENCES/IMPLEMENTS` 等，并为检索结果列出源文件路径，让 Agent 直接定位代码修改起点。如果 WASM 不可用会自动回退到启发式轨道；也可通过 `TEAMAI_SKIP_AST=1` 强制仅用启发式。提供 `teamai codebase --extract /path/to/repo` 和 `teamai codebase --lint` 做本地提取与健康检查。
### 8) Team Improvement：让每一次会话都变成团队“燃料”  
- `teamai digest`：每周团队摘要——Token 用量、对话量、干预率等。  
- `teamai session save [--push]`：按月记录会话摘要（去敏的工具序列、提示轮次、干预次数等），用于生成周报/月报。  
- `teamai dashboard`：本地 Web 面板，展示成员实时会话状态、干预次数、Token 使用、知识库健康度（覆盖面、召回趋势、作者贡献、维护控制台）。
### 9) 细粒度分发控制：角色、标签与多源订阅  
- `teamai roles`：定义角色 → 命名空间映射，成员只同步自己角色的技能；  
- `teamai tags`：用标签来过滤订阅的技能/规则；  
- `teamai source`：管理订阅的其他团队/共享技能源。
**收益：** 避免“一股脑推送”，减少噪音与认知负担。
### 10) 安全与隐私友好设计  
- TeamAI-CLI 本身是 CLI 工具，核心数据（skills/rules/learnings）在你自己的 Git 仓库；  
- `teamai session save` 对会话摘要做隐私脱敏；  
- MCP 与环境敏感信息通过 `${VAR}` 引用，不在仓库明文存储；  
- 许可为 MIT，可自由使用与修改。
### 11) Demo：最简上手与配置示例（必读）  
以下为本地快速体验的“最小可行路径”，假设你在 GitHub 有一个团队仓库 `https://github.com/yourorg/yourrepo`。
- 安装：
```bash
npm install -g teamai-cli
```
- 初始化（项目级）：
```bash
cd /path/to/my-project
teamai init https://github.com/yourorg/yourrepo
```
如果想要用户级（安装到 `~/`），可加 `--scope user`。
- 拉取最新团队资源并注入到本地工具：
```bash
teamai pull
```
- 声明一个简单的 PreToolUse 钩子（bash 使用前扫描密钥）：在团队仓库的 `hooks/hooks.yaml` 写入：
```yaml
hooks:
  - id: block-secret
    description: Scan for secrets before commit
    event: PreToolUse
    matcher: Bash
    command: 'bash -lc "~/.teamai/team-scripts/scan-secret.sh" || true'
    tools: [claude, cursor]
```
提交并合并后，成员下一次 SessionStart 将自动执行 `teamai pull`，把钩子注入本地。
- MCP 服务器声明（示例）：在 `mcp/mcp.yaml` 写入：
```yaml
servers:
  - name: gpu-analysis
    transport: http
    url: https://example.com/api/mcp
    headers:
      Authorization: Bearer ${GPU_ANALYSIS_TOKEN}
```
- 日常推送变更到团队仓库：
```bash
teamai push
```
- 检查本地 vs 团队仓库差异：
```bash
teamai status
```
- 人工检索团队知识：
```bash
teamai recall "port conflict"
```
- 开启/关闭自动召回：
```bash
teamai recall enable
teamai recall disable
teamai recall status
```
- 导入仓库并构建知识图谱：
```bash
teamai import --from-repo https://github.com/org/repo
teamai codebase --extract /path/to/repo
teamai codebase --lint
```
- 生成周报与启动面板：
```bash
teamai digest
teamai dashboard
```
## 目标人群与收益：谁最值得用？  
- 软件工程团队（特别是大量使用 Claude Code / Cursor / Codex 等 Agent 工具的团队）；  
- 平台工程/DevOps/SRE：希望把合规、安全、质量脚本集中化并“自动投喂”到 AI 工具；  
- AI 效能负责人/架构师：需要从使用数据与摩擦中沉淀技能/规则/知识；  
- 小团队或独立开发者：即便一个人，也可用 Git 管理“未来的自己”的能力与知识。
具体收益：
- **降低新人上手门槛**：统一的技能/规则/包/MCP 在 `pull` 后就绪，新人不再需要“到处打听 Prompt 和插件怎么装”。  
- **提升一致性**：Code Review/安全扫描/规范检查以钩子形式自动前置，AI 输出与操作更符合团队标准。  
- **持续改进闭环**：从“摩擦信号 → 可选分享 → 知识入库 → 召回增强”形成闭环，避免同一坑反复踩。  
- **安全与可控**：敏感信息走环境变量，可审计的 MR 流，钩子与知识集中管理。  
- **跨工具复用**：同一套 harness 可以面向多种 Agent，无需为每种工具维护一份配置。
## 技术栈、架构与代码组织  
- 技术栈：Node.js（npm 全局安装）、Git（作为状态与分发的底层）、WASM tree-sitter（代码图谱解析，可选）、本地 CLI 工具 + Web Dashboard。  
- 架构分三层：Team Execution（执行与能力分发）、Team Context（知识与上下文）、Team Improvement（观察与改进）。
目录与数据流（基于 README 与使用指南推断）：
- CLI 核心在仓库的命令与逻辑模块；  
- 团队仓库中的关键目录与文件：`skills/`、`rules/`、`docs/`、`hooks/hooks.yaml`、`mcp/mcp.yaml`、`teamwiki/`、`teamai.yaml`；  
- 本地：`~/.teamai/` 存放脚本与配置；各工具有自己的资源目录（如 `~/.claude/skills` 等），`pull/inject` 写入这些目录；知识图谱存于项目级的 `teamwiki/`。
## 上手门槛与部署体验  
- 安装极简：`npm install -g teamai-cli`。  
- 文档：README 提供中文版“使用指南”（`docs/usage-guide.md`），并覆盖从创建团队到日常使用的流程。  
- 初始化引导：`teamai init` 提供 OAuth 登录、仓库绑定、成员注册与钩子注入，输出步骤清晰。  
- Docker：README 未提供一键容器化部署示例；若团队希望 CI/CD 环境（如 GitHub Actions/GitLab CI）里使用，需自行封装容器。
## 社区活跃度与生命力  
- 截至检索时，仓库近期有 Workflow 运行，说明 CI 活跃；同时 README 指出该工具自 2026 年 3 月起已在腾讯内部使用并开源，具备实战验证背景。  
- Issue/PR：需到仓库页面实时查看；但 README 明确欢迎 PR，并贡献指南与贡献者墙，显示积极运营迹象。  
- 许可 MIT：适合企业/个人二次开发与内部分发。
## 竞品/同类对比：它在赛道中的位置  
- vs “纯 Skill 仓库”/“Awesome 列表”：TeamAI 不是只放一堆 Markdown 技能的仓库，而是带分发、订阅、权限、注入、召回与改进的全套工具链。  
- vs “各家 Agent 官方插件体系”：官方插件通常局限于单一工具；TeamAI 提供跨工具的抽象层与统一配置，避免在多个生态重复维护。  
- vs “RAG/知识库平台”：TeamAI 的知识召回与图谱构建更偏轻量、以 Git 为中心，与“写代码/写技能”的日常工作流紧密耦合，而非独立的知识管理平台。
## 局限与不足：客观存在的坑与权衡  
- 学习曲线：要理解“技能/规则/钩子/MCP/召回图谱”整套概念和配置，对非技术同事仍有一定门槛。  
- 文档语言与生态：目前 README 中英双语，但部分深入文档可能以中英文混合呈现，英文读者需适应；示例多围绕 Web 开发与 JS/TS/Python/Go 等主流语言，其他语言支持主要依赖启发式轨道。  
- 绑定 Git 工作流：团队需习惯于“改 Prompt 也要走 MR”，对极小团队或追求极致自由的个人用户，可能略重。  
- 平台依赖：以 Node.js + npm 为主；对纯 Rust/Go 团队，需接纳在 CI/环境里维护 Node 运行时的成本。  
- Dashboard 与安全面：`teamai dashboard` 是本地 Web 面板，团队若希望集中式管控与权限细粒度控制，需自行部署与反向代理；当前未见到内建的多租户认证/访问控制。  
- 召回与图谱质量：召回基于 BM25+图增强，在缺乏良好标注或知识稀疏时效果可能一般，需要维护（`teamai recall maintenance` 做剪枝与健康度维护）。
## 结语与行动建议：什么时候该上手？什么时候该观望？  
- 强烈推荐上手的场景：  
  - 团队已经在用 Claude Code / Cursor / Codex 等多种 Agent 工具，痛点是“大家 Prompt/插件/MCP 各玩各的”；  
  - 希望把安全/合规/质量检查自动前置到 AI 工具调用链（如 PreToolUse 的密钥扫描）；  
  - 有成熟的 Git/MR 流程，习惯“一切皆代码”的管理方式。
- 可以观望或先试点的场景：  
  - 团队规模极小（1-2 人），且主要只使用一种 AI 工具；  
  - 暂无能力维护 MR/Code Review 流程；  
  - 对 Node.js 依赖敏感、且无法在 CI/环境中引入。
- 建议的试点路径：  
  1) 先在一个“影子仓库”做最小化试点：少数人使用 `teamai init` + `pull`，验证与现有 CI/CD 与本地工具的兼容性；  
  2) 重点测试 Hooks（安全扫描）与 MCP（数据源连通）；  
  3) 逐步引入知识图谱与召回，并观察 `teamai dashboard` 的知识库健康指标；  
  4) 收集团队反馈后，再扩展到全员与全仓库。
总之，TeamAI-CLI 把“团队 AI 管理这件事”从“零散 Prompt/脚本”升级为“可管理、可评审、可度量”的工程体系，是任何希望让“每个成员都像资深 AI 工程师一样工作”的团队都值得认真评估的基础设施型工具。
