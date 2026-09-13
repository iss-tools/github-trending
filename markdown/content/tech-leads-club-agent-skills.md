# tech-leads-club/agent-skills

[GitHub URL](https://github.com/tech-leads-club/agent-skills)


## Agent Skills：安全可复用的 AI 编程技能库

> 一套带安全审核机制的 AI 编程技能统一管理与安装工具，让 Claude、Cursor 等助手拥有专业、可控的扩展能力。

- **Tags**: GitHub, Agent, MCP, CLI, Skill-Management
- **Category**: 开发工具, AI 编程, 安全工具

## Details

# 一句话总结
Agent Skills 是一套“经过安全审核与人工筛选”的 AI 编码代理技能（Skill）注册中心与安装工具，让 Claude Code、Cursor、Windsurf、Cline 等各类 AI 助手通过统一的 CLI 与 MCP 机制，获得可验证、可审计、可升级的专业能力扩展。
---
## 背景与痛点：为什么我们需要“有护栏的技能包”？
- 生态碎片化：各家 IDE/客户端都有自己的“自定义指令/规则/Skills”目录，内容不互通、也缺少统一管理。Cursor 的 Skills 发现机制、Claude Code 的 Skills 体系、.cursorrules 等都在演进，但缺乏跨客户端的一站式“插件商店”。  
- 安全是新硬伤：第三方技能/插件容易包含恶意指令或泄露凭证等风险。Snyk 2026 年的研究指出，公开市场上约 13.4% 的技能存在至少一个“关键级别”的问题；因此“有人管、可审计”变得格外重要。  
- 上下文被浪费：大量“规则/Skills”一股脑塞进提示词，既造成上下文浪费，也增加了幻觉概率。更合理的方式是“按需渐进式暴露”——先搜索、再按需拉取。Agent Skills 的 MCP 服务器正是围绕这一设计提供工具。   
- 团队协作难维护：团队内部的 .cursorrules、Claude Skills 等分散在成员机器上，版本不可控、升级不可控，谁在用什么、更新了什么，往往成了一团浆糊。
Agent Skills 的诞生，就是要解决这些核心痛点：提供统一的技能目录、严苛的安全机制与可控的版本与供应链，把“技能”当成“可依赖的软件部件”来管理。
---
## 技术栈与架构解析：它是如何做到“安全+可组合”的？
- 整体语言与框架：
  - Node.js（要求 ≥22）与 npm 生态；CLI 与 MCP Server 均为 TypeScript/JavaScript。  
  - 构建与仓库管理采用 Nx，把 CLI、技能目录（skills-catalog）和 Marketplace（静态站）等包组织为 Monorepo。
- 核心组件：
  - CLI（@tech-leads-club/agent-skills）：交互式安装/卸载/更新/列出技能；支持全局或本地安装；支持 Copy 或 Symlink 两种放置方式；带缓存与审计日志。  
  - 技能目录（skills-catalog）：按分类（category）组织，每个技能为一个目录，核心是 SKILL.md，可附带 templates/、references/、scripts/。  
  - MCP Server（@tech-leads-club/agent-skills-mcp）：将“技能目录”以 MCP 工具的形式暴露给支持 Model Context Protocol 的客户端（Claude、Cursor 等），支持 list_skills、search_skills、read_skill、fetch_skill_files 等工具；采用“渐进式暴露”设计，避免一次性把目录全塞进上下文。
- 按需获取与缓存：
  - CLI 先从 CDN 获取约 45KB 的“目录清单”，供用户选择后按需下载具体技能，并缓存在 ~/.cache/agent-skills/，支持离线使用。  
  - 每个技能及其文件会计算 SHA-256 内容哈希，用于锁文件与篡改检测。
- 安全机制（深度防御）：
  - 输入清洗与路径校验：对技能名和路径做清洗，防止路径穿越与非法字符；使用 normalize/resolve 后校验是否在允许的 base 目录内，阻止恶意路径穿越。  
  - 符号链接防护：优先使用 lstat() 不跟随链接、验证目标路径、检测循环；在 Windows 上改用目录 junction 以提升系统级隔离。  
  - 锁文件与原子写：.agents/.skill-lock.json 作为单一事实来源，采用 Zod schema 校验、原子重命名写模式，防止异常中断导致损坏。记录各技能的内容哈希，支持后续篡改检测。  
  - 审计日志：~/.config/agent-skills/audit.log 以 JSON Lines 记录每次 install/update/remove，可用于事后审计与溯源。  
  - Snyk Agent Scan 集成：在 CI/CD 中对技能目录做增量扫描，仅变更内容会触发重扫；结果缓存在本地。扫描结果必须在发布前通过，以防止恶意或高风险技能进入仓库。  
  - 安全策略与漏洞披露流程：官方 SECURITY.md 明确威胁模型与上报流程，并承诺 48 小时内确认、14 天内修复已知漏洞。
- 开发者体验（DX）：
  - 贡献指南详细且工程化完备：提供本地开发命令（start:dev:cli、start:dev:mcp、generate:skill、validate、scan、test、lint、format 等）。  
  - Nx generator 创建新技能：一键生成符合目录与规范的新技能骨架（包含 SKILL.md、模板与可选目录），加快上手与保持一致性。
---
## 核心亮点与功能剖析
1) 跨代理的“一次定义，到处安装”
- 官方 README 列出对 Antigravity、Claude Code、Cursor、Copilot 等多款 AI 编码代理的支持，并支持一键或批量安装到指定目标，兼容不同客户端的技能放置路径（如 .cursor/skills、.claude 等）。  
- CLI 还支持 Global/Local 作用域，可选择为单个项目安装或对用户全局安装，灵活适配个人与团队场景。
2) MCP Server 的“渐进式暴露”
- 提供的工具包括：
  - list_skills：按类别浏览技能目录。
  - search_skills：模糊搜索技能。
  - read_skill：读取技能的 SKILL.md 主指令。
  - fetch_skill_files：按技能的 files[] 定义按需拉取参考文件等资源。  
- 设计上强调“先搜索、再按需加载”，避免把大量技能文本全量注入上下文。 MCP Server 是只读的、本地 stdio 通信、不接触本地文件系统，攻击面被刻意收窄。
3) 严格的安全与供应链完整性
- 明确以 Snyk 2026 年的 Agent Threat Report 为对照，提出“环境安全、上下文安全、信任安全”三大支柱：从 CLI 防御、锁文件与内容哈希、到人工审查的提示词内容（防止 prompt injection）。  
- 利用 Snyk Agent Scan 进行增量扫描；在 CI/CD 中设置必要的扫描步骤与放行策略；对误判用 YAML allowlist 管理并设置过期时间，强制定期复审。
4) Marketplace 与可浏览的技能目录
- 官方 Marketplace 站点展示当前技能数量（约 56）、分类数量（14）、最近 30 天下载数（4,704），每个技能带分类、描述与触发关键词示例，便于快速发现并决定是否安装。  
- Marketplace 本质是一个由 Next.js 驱动的静态站，使用 skills-registry.json 作为数据源；开发者在本地可通过 nx run marketplace:generate-data 生成数据并预览站点。
5) 丰富且分类清晰的技能样本
- README 中的“Featured Skills”展示了覆盖开发、云、自动化、安全等类别的技能，如 tlc-spec-driven（规范驱动的四阶段规划）、aws-advisor（AWS 架构与安全评审）、playwright-skill（浏览器自动化）、figma（设计到代码）、security-best-practices（安全审查）等。  
- tlc-spec-driven 作为典型示例，明确给出了“Specify → Design → Tasks → Execute”四阶段、自动根据范围跳过不必要阶段、.specs/ 目录结构与状态文件（STATE.md/LESSONS.md）以及“知识验证链”等工程化实践，展示了“技能”如何将团队的最佳实践固化并可重用。
---
## 上手门槛与部署体验
- 安装：不需要提前 clone 仓库。官方推荐直接使用 npx 即可，不需要手动配置全局路径。npm 全局安装可选。  
- 交互向导：首次运行 npx @tech-leads-club/agent-skills 会进入交互式向导，依次选择：
  - 操作类型（安装/更新）
  - 技能（按分类或搜索筛选）
  - 目标代理（可选多个）
  - 安装方式（Copy/Symlink）
  - 范围（Global/Local）  
- CLI 命令示例：
  - 列出技能：agent-skills list 或 ls
  - 安装单个技能：agent-skills install -s tlc-spec-driven
  - 批量安装：agent-skills install -s aws-advisor coding-guidelines docs-writer
  - 指定目标代理：agent-skills install -s my-skill -a cursor claude-code
  - 全局安装：agent-skills install -s my-skill -g
  - 使用 Symlink：agent-skills install -s my-skill --symlink
  - 更新：agent-skills update / 更新单个：agent-skills update -s my-skill
  - 卸载：agent-skills remove/rm -s my-skill
  - 缓存管理：agent-skills cache --clear / --clear-registry / --path
  - 查看审计日志：agent-skills audit / -n 20 / --path
  - 查看贡献者信息：agent-skills credits
- Docker 一键部署：项目当前更聚焦于 CLI 与 MCP Server 的 npm 包交付方式，暂未看到开箱即用的 Docker 部署方案。若需容器化运行 MCP Server，可自行基于 Node.js 官方镜像封装，但需要用户自建 Dockerfile。
---
## 社区活跃度与生命力
- 版本与发布：从 Releases 页面看，近期多次发布技能目录版本（如 v0.14.0–0.14.3），在 2026-03 至 2026-04 间持续新增技能与改进；CLI 本身也有 1.4.4–1.4.7 的维护性发布，节奏较为稳健。  
- 文档与工程化：CONTRIBUTING.md 详细描述本地环境搭建、命令、技能结构、Description 质量标准、安全扫描与发布流程，说明团队在“可贡献性”与“可维护性”上投入不少。  
- Marketplace 数据：公开页面显示约 56 个技能与 14 个分类，以及最近 30 天下载量，项目处于早期但不算停滞，说明有一定使用和迭代。  
- 生态可见性：Cursor 等社区的实践文章也将 Agent Skills 作为扩展 Agent 行为的首选方式之一，侧面印证该项目在实战场景中被采用与推荐。
---
## 目标人群与收益：谁最适合用，能解决什么问题？
- 个人开发者：
  - 痛点：每个项目都要写一遍“规则/Skills”，缺乏可移植、跨客户端复用的能力；担心从公开市场“复制粘贴”的安全风险。  
  - 收益：通过 Agent Skills，一次性把安全评审的 best-practices、安全审查技能、云架构评审等能力安装到 Cursor/Claude Code 等，每次换项目或换 IDE 都能复用；技能内容经过人工审核与扫描，大幅降低“恶意指令”的风险。
- 工程团队与 Tech Lead：
  - 痛点：团队编码风格不一、评审标准分散；新人需要长时间适应团队“潜规则”。  
  - 收益：用技能封装团队的 spec 驱动开发流程（如 tlc-spec-driven）与安全评审清单，统一工作流，降低上下文切换成本；通过锁定 skill 版本与锁文件，确保团队在相同基准上迭代。
- 安全与合规角色：
  - 痛点：担心 AI 技能会触发敏感操作、泄露凭证或发起未授权请求。  
  - 收益：依靠 CLI 的路径隔离、审计日志、内容哈希与 Snyk 扫描能力，形成可见的“安全层”，并能通过日志追溯与合规审查。
---
## Demo 与使用示例（最小可复现）
- 最快上手（交互式）：
  - 直接运行：
    - npx @tech-leads-club/agent-skills
  - 按向导选择“Install skills → 挑选技能（如 tlc-spec-driven）→ 选择目标 Agent（如 Cursor）→ 安装方式与作用域”即可。
- CLI 命令行示例（非交互式）：
  - 列出技能：
    - agent-skills list
  - 安装单个技能（如 tlc-spec-driven）：
    - agent-skills install -s tlc-spec-driven
  - 安装到指定 Agent（如 Cursor 和 Claude Code）：
    - agent-skills install -s aws-advisor nx-workspace -a cursor claude-code
  - 全局安装并使用 Symlink：
    - agent-skills install -s my-skill -g --symlink
  - 更新所有技能：
    - agent-skills update
  - 清除缓存：
    - agent-skills cache --clear
  - 查看审计日志（最近 20 条）：
    - agent-skills audit -n 20
- 技能示例：tlc-spec-driven 的“规范驱动开发”
  - 能力概述：四阶段（Specify → Design → Tasks → Execute）工作流，自动根据任务复杂度跳过不必要的阶段；通过 .specs/ 目录维护项目状态（STATE.md/LESSONS.md/各 feature 的 spec/design/tasks/validation.md）；支持子代理协调与“验证者”机制，并强调“知识验证链”避免凭空捏造。  
  - 典型用法：对项目说一句“Initialize project（初始化项目）”或“Map codebase（映射现有代码库）”，就会触发该技能的标准化流程与检查点，让 AI 在编码前先明确需求、架构、任务与验证标准。
---
## MCP Server 集成示例（任意 MCP 客户端）
在支持 MCP 的客户端配置（例如 Claude Desktop 或 Cursor MCP 设置）中，新增 server：
```json
{
  "mcpServers": {
    "agent-skills": {
      "command": "npx",
      "args": ["-y", "@tech-leads-club/agent-skills-mcp"]
    }
  }
}
```
随后，Agent 即可调用 list_skills、search_skills 等工具，按需发现并加载技能内容，而非一次性全量加载。
---
## 竞品/同类对比：它在生态中的位置
- awesome-agent-skills（VoltAgent 维护）：
  - 定位：庞大的“清单型”集合，主要收集各官方团队的技能（Anthropic、Vercel、Stripe、Firebase 等），与 MCP/各类客户端兼容。  
  - 差异：awesome-agent-skills 更像“目录/索引”，而非托管执行与安全扫描的“注册中心与发布渠道”。Agent Skills 则聚焦于：安全扫描、人工审查、统一安装与供应链完整性，两者可互补：前者用于发现“官方/厂商标注”的技能，后者用于“安全安装与管理”。
- 各客户端原生能力（Claude Code Skills、Cursor Skills/.cursorrules）：
  - Claude Code 与 Cursor 均支持在指定目录放置技能/规则；但各客户端的机制略有差异，有的偏向“静态规则”，有的支持动态技能。Agent Skills 把这些统一成“CLI + MCP Server”一套工作流，并提供了安全与版本治理能力。  
  - Cursor 的最佳实践文章也明确将 Skills 视为扩展 Agent 行为的首选方式，这与 Agent Skills 的定位高度契合。
- MCP Servers 聚合站（如 mcpservers.org）：
  - 这类站点聚焦于“可联网/本地运行的 MCP 工具与数据源”，如 GitHub、Playwright、Supabase、Cal.com 等官方 MCP 服务器，偏“工具与数据”层面。Agent Skills 的 MCP Server 则聚焦“技能目录（文本/模板/参考）”的按需检索与投喂，与“工具型 MCP”形成互补。
---
## 局限与不足
- 生态仍在早期：技能数量约 50+，与“成百上千”的通用清单相比尚在起步；部分垂直领域覆盖有限，可能需要团队自建技能或引入其它来源互补。  
- 贡献门槛：需要熟悉 Node.js 与 Nx；技能描述必须遵循较严格的“Use when / Do NOT use for”等质量标准，这对新手有一定学习成本。  
- 安全扫描依赖外部服务：Snyk Agent Scan 需 SNYK_TOKEN；对 Fork 的 PR 不在 CI 中自动扫描（GitHub 不暴露仓库 Secret），需要通过 Merge Queue 或本地扫描补充流程，团队需自行落地相应的合并策略。  
- 暂无官方 Docker/封装部署：当前主要以 npm 包与本地 CLI/MCP 的形态交付；如需容器化运行 MCP Server 或在 CI/CD 中直接拉取 CLI，需要自行编写镜像与流水线步骤。  
- 文案与触发语言的本地化：目前以英文为主；对非英文母语团队来说，可能需要对技能描述/触发词进行本地化翻译与适配。官方目前未明确提供多语言机制，需要团队自行 fork 维护。
---
## 结语与行动建议（通用版）
- 适合立刻上手的场景：
  - 你正在使用 Cursor、Claude Code、Windsurf 或 Cline 等支持 MCP/Skills 的 IDE/客户端，希望一键把“团队规范、安全评审、云架构评审、自动化测试”固化到 AI 助手里。  
  - 你所在的团队对安全敏感，不想从不明来源“复制粘贴”各类 Rules/Skills。
- 建议的起步路径：
  - 第一步：用 npx @tech-leads-club/agent-skills 体验交互式向导，先安装 1–2 个与当前工作流最相关的技能（如 tlc-spec-driven、best-practices、aws-advisor）。  
  - 第二步：在项目内验证效果：对比安装前后，AI 在评审/重构/规划类任务上的输出一致性与覆盖度。  
  - 第三步：评估是否纳入团队流程：定义团队所需的“最小技能集合”，并用 lockfile 与版本号固化，定期运行 agent-skills update 与 agent-skills audit，保证安全与可追溯。  
  - 第四步：根据团队需求，选择性地自建技能或把现有 .cursorrules/自定义指令迁移为 SKILL.md，并遵循贡献指南的质量标准与安全扫描流程，确保发布前通过扫描。
- 最终评判：
  - Agent Skills 的最大价值在于：把“技能”从零散文本升级为“可依赖的软件部件”，并用工程化的手段统一安装、版本、安全与审计。这在“野蛮生长”的 Agent 技能生态里，属于少见的“先把安全与治理做到位”的路线。对严肃的工程团队而言，值得作为“技能治理基座”来采纳。当然，在技能广度与多语言支持上仍有成长空间；但在安全第一的生产环境，它提供的“可控性”往往比“数量”更重要。
