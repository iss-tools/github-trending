# openai/plugins

[GitHub URL](https://github.com/openai/plugins)


## OpenAI Plugins 官方示例与规范指南

> OpenAI 官方插件开发指南，包含 Figma、Notion 等集成示例。

- **Tags**: OpenAI, ChatGPT, Plugin, MCP, Codex
- **Category**: AI 编程, 开发工具, 开源项目

## Details

# 一句话总结
openai/plugins 是 OpenAI 官方维护的“Codex 插件示例合集与市场清单”，既是插件开发的参考模板，也是 Codex/ChatGPT 桌面与 CLI 环境中可用插件的市场来源；对开发者而言，它是学会如何把外部系统“装”进 AI 工作流的最权威“活教材”。
---
## 背景与痛点：它为什么会出现？
在 2023 年 3 月 ChatGPT Plugins 上线后，开发者面临两个现实难题：
- **如何定义插件？** 
  - 每个插件都需要清晰的能力边界、入口（manifest）、认证、调用协议。如果各自为战，就会造成生态碎片化，用户与平台都难以治理。
- **如何确保质量与安全性？** 
  - 插件涉及外部系统读写、OAuth 等敏感能力；需要可验证的规范与评审流程。
随着 OpenAI 推出 Codex（更偏“代码/产品构建”的工作空间）与 MCP（Model Context Protocol，一种让模型调用外部工具的协议），插件也被进一步升级为“可打包技能+连接器+MCP 服务器”的组合，用于在 Codex 与 ChatGPT Desktop 中统一呈现和复用。openai/plugins 就是在这个背景下诞生的官方示例与 curated marketplaces（精选市场清单）。
---
## 核心亮点与功能剖析
### 1) 插件的“大一统”打包方式
- 每个插件必须包含：`.codex-plugin/plugin.json`（必选的 manifest），并可选择包含：
  - `skills/`：技能提示与模板
  - `.app.json`：插件层级的“应用依赖”（如连接到 Notion/Figma 的应用集成）
  - `.mcp.json`：MCP 服务声明
  - `agents/`：插件级 Agent 元数据
  - `commands/`、`hooks.json`、`assets/`、`scripts/`、`ui/` 等配套资源
- 这样一个目录就变成了“可安装、可验证”的插件包，既能跑在 Codex，也能在 ChatGPT 桌面/CLI 上统一分发与加载。该仓库 README 清晰说明了这些结构。
### 2) 精选市场清单（Marketplaces）的治理思路
- 默认市场：`.agents/plugins/marketplace.json` 指向 `plugins/` 目录，为“公共市场”。
- API 登录用户的独立市场：`.agents/plugins/api_marketplace.json`，便于企业/个人定制化插件列表。
- 提交与上架采用“受控 PR”：Issues 创建受限、Pull Request 也被限制（PR creation is restricted）；从最近的提交记录看，新插件加入以官方与合作伙伴账号为主，说明是 curated 而非完全开放的投稿。
### 3) 官方示例覆盖高频场景
README 中重点列出的几个插件都指向“工程实践中最常见、最易吃力不讨好的地方”：
- `plugins/figma`：设计到代码的转化、Code Connect 模板、设计系统规则生成。
- `plugins/notion`：文档/规格说明书→实现计划、会议纪要与知识沉淀。
- `plugins/build-ios-apps`、`plugins/build-macos-apps`：Apple 平台 SwiftUI/AppKit 工作流、构建/运行/调试循环。
- `plugins/build-web-apps`：前端构建、部署、UI、支付、数据库工作流。
- `plugins/expo`：Expo/React Native 应用、SDK 升级、EAS 工作流。
- `plugins/netlify`、`plugins/remotion`、`plugins/google-slides`：常见 SaaS 工具的插件化集成与技能集合。
### 4) 高质量示例目录结构（以 Figma/Notion 为例）
- `plugins/figma`：设计到代码的完整工作流
  - 技能：`figma-implement-design`、`figma-code-connect`、`figma-create-design-system-rules` 等。
  - 能力：将 Figma 帧/组件转为生产 UI 代码、生成 Code Connect 模板、创建/更新设计库与文件等。
  - 目录形状：
    - `.codex-plugin/plugin.json`（必选 manifest）
    - `.app.json`（插件级 Figma 应用依赖声明）
    - `agents/`（插件级 Agent 元数据，含 `agents/openai.yaml`）
    - `skills/`（技能主体，每个技能包含 `SKILL.md` 与可选 `agents/`、`assets/`、`scripts/`）
    - `assets/`（图标等资源）
    - `commands/`、`hooks.json`、`scripts/`、`ui/`（约定目录与 scaffolding）
- `plugins/notion`：文档与会议流程集成
  - 技能：`notion-spec-to-implementation`、`notion-research-documentation`、`notion-meeting-intelligence`、`notion-knowledge-capture`。
  - 能力：将规格说明书转为任务计划、跨文档研究、会议议程与纪要沉淀等。
  - 目录形状同样包含 `.codex-plugin/plugin.json`、`.app.json`、`agents/`、`skills/`、`assets/`、`plugin.lock.json` 等。
### 5) 持续更新与生态扩展
从提交记录看，仓库在 2026 年 6–8 月仍在频繁迭代，包括：
- 新增插件（如 DigitalOcean、Replay.io、Boltz API CLI、CrowdStrike Foundry/Fusion 等）。
- MCP OAuth 声明、市场清单维护、图标/资源更新、技能版本迭代等。这意味着它不是“历史存档”，而是与 Codex/ChatGPT 产品功能同步演进的“活仓库”。
---
## 目标人群与收益
- **适合谁：**
  - 想把自家 SaaS/内部系统接入 Codex 或 ChatGPT Desktop 的产品/工程团队。
  - 做工具链集成、DevOps 自动化、知识管理与设计系统的技术负责人。
  - 希望从 Prompt 技能升级到“可复用、可分发”的插件包的独立开发者。
  - 从事 AI Agent / MCP 生态建设的研究者与架构师。
- **你能获得的具体收益：**
  - 开发范式清晰：通过 manifest + skills + app/mcp 的规范结构，用最小试错成本学会“怎样写插件、怎样打包技能”。
  - 上手即用的模板：直接 fork 或复制插件目录结构，替换为你的业务逻辑，大幅降低初始搭建成本。
  - 质量与安全参考：官方示例对权限边界、OAuth、MCP 声明、图标与 UI 的处理，是合规与用户体验的最佳实践范本。
  - 市场/分发认知：理解 curated marketplace 与 API marketplace 的区分，有助于规划插件如何上架与企业内分发。
---
## 竞品/同类对比与定位
| 维度 | openai/plugins | openai/plugins-quickstart（历史） | 社区 Awesome 列表（如 awesome-codex-plugins） | 官方文档 / 平台内市场 |
|---|---|---|---|---|
| 主要用途 | 官方示例与 curated 市场清单 | 快速启动一个 ChatGPT 插件本地服务器 | 聚合社区插件、工具与扫描/质检等工具链 | 产品内插件市场入口 |
| 结构规范 | Codex 插件（manifest+skills+app/mcp 等） | 早期 ChatGPT Plugins（manifest + OpenAPI） | 各类实现范式不一，部分遵循 Codex 规范 | 以 UI 为中心，隐藏技术细节 |
| 维护者 | OpenAI 官方 | OpenAI（历史项目） | 社区维护（如 hashgraph-online/awesome-codex-plugins） | OpenAI 产品团队 |
| 适用范围 | Codex / ChatGPT Desktop / CLI 等多表面 | 早期 ChatGPT 网页版插件 | 社区探索与工具链集成 | 最终用户侧发现与启用 |
| 学习价值 | 高（官方权威、结构清晰） | 对旧体系仍有参考价值 | 适合发现社区创新与扫描工具 | 使用导向，非开发向 |
结论：若你是开发者，openai/plugins 是当前最权威的“起点”；若你是最终用户，平台内市场才是你日常浏览的地方。两者是“开发者端 vs 用户端”的互补关系。
---
## 技术栈与架构解析
- **核心配置格式：**
  - `.codex-plugin/plugin.json`：插件元数据与内容索引（必选）。
  - `.app.json`：插件对外部 App 的依赖声明（如 Notion/Figma 连接）。
  - `.mcp.json`：声明与 MCP 服务器的绑定，使模型可通过标准协议调用工具。
- **技能结构：**
  - `SKILL.md`：技能的提示/说明书，定义能力边界、输入输出风格与约束。
  - 可选 `agents/`、`assets/`、`scripts/`：为技能提供专用 Agent、资源与可执行脚本。
- **打包与分发：**
  - 一个目录就是插件包；manifest 指向技能目录与资源，市场清单（marketplace.json）控制可见性。
- **平台覆盖：**
  - Codex 工作区、ChatGPT Desktop、CLI 等表面能识别并加载该仓库定义的插件与市场清单。
**设计理念的“一句话比喻”：**
> 插件就像是一把“多功能刀头”；Codex/ChatGPT 是手柄。这个仓库定义了“刀头的卡口标准（manifest）、刀刃形状（skills）、以及它适配哪些工具机床（app/mcp）”，从而保证你换任何刀头都能稳定用。
---
## 上手门槛与部署体验
- **门槛：**
  - 需要基本了解 JSON、Markdown，以及你要集成的 API/OAuth 流程。
  - 若要动到 MCP 或自定义 Agent，需具备一定的后端/脚本能力。
- **部署：**
  - 不需要自行启动 HTTP 服务，多数示例依赖“连接的 App/连接器”而非本地服务器。
  - 企业场景下，通常将仓库克隆后修改/新增插件目录，然后通过内部的 marketplace.json 配置为私有市场。
- **文档：**
  - README 简短但信息密度高，并配合各插件子目录 README 做进一步说明；适合有一定经验的开发者查阅，对完全小白可能需要结合官方文档与社区教程一起看。
---
## 社区活跃度与生命力
- **数据点：**
  - Stars：约 5.5k；Forks：约 790；PR 列表显示 39 个 Open、352 个 Closed；最新提交在 2026-08-28，且 6–8 月有多条合并记录。
  - 提交主体包含官方与合作伙伴账号，注释可见插件技能版本迭代、图标修复、MCP OAuth 声明、市场清单维护等。
- **开放性：**
  - Issue 创建被禁、PR 创建受限，说明这是“curated”的官方仓库；社区主要通过 PR（由 maintainer 控制合入）参与，而非自由提交 Issue/PR。
---
## Demo / 核心代码示例
### 1) 最小插件骨架（来自 README 与插件子目录结构说明）
```json
// .codex-plugin/plugin.json
{
  "id": "my-plugin-id",
  "version": "0.1.0",
  "name": "My Plugin",
  "description": "一句话描述插件用途",
  "skills": ["./skills/example-skill"],
  "icon": "./assets/icon.png"
}
```
配合一个简单技能：
```markdown
# skills/example-skill/SKILL.md
你是一个帮助用户格式化 Markdown 的助手。
- 将用户文本转换为规范的 GFM Markdown
- 保持原有标题层级与列表结构
- 不输出额外说明，只返回结果
```
一个最小可用插件包就此完成：插件根目录包含 `.codex-plugin/plugin.json` 与上述技能目录。在 Codex/ChatGPT 中加载市场清单后即可被发现和调用。
### 2) 包含外部 App 依赖的插件（Notion 示例）
- 结构关键点：`.app.json` 明确插件依赖的 Notion 应用，`skills/` 包含多个技能（如 `notion-spec-to-implementation`），并可在 `agents/openai.yaml` 做表面特定的 Agent 行为配置。详见 Notion 插件 README 的“Plugin Structure”说明。
### 3) 市场清单配置
```json
// .agents/plugins/marketplace.json
{
  "plugins": [
    "../plugins/notion",
    "../plugins/figma",
    "../plugins/build-web-apps"
  ]
}
```
该清单指向仓库内 `plugins/` 下的具体目录，决定了 Codex/ChatGPT 能看到哪些插件。API key 用户可维护独立的 `api_marketplace.json` 做个性化/企业内插件集合。
---
## 局限与不足
- ** Issue 反馈受限：** 仓库 Issues 被禁，普通用户无法直接在此提 Bug 或 Feature Request，反馈通道需依赖官方论坛或其他渠道，社区自修难度更高。
- ** 入门曲线对小白并不友好：** README 没有给出从零到一的图文式教程，更多是对已有规范的结构说明；完全不懂 MCP/manifest 的人需结合外部资料学习。
- ** PR 与治理偏“官方主导”：** 提交记录和 PR 列表显示大量官方与合作伙伴账号参与；社区想让自己的插件被收录，需要较强的沟通与协作成本。
- ** 样例更多偏“场景/模板”，而非完整服务端实现：** 它聚焦于 manifest/技能/市场清单，如果要架起带有认证、授权的后端服务，还需参考其他文档或项目（如早期 plugins-quickstart、openai/chatgpt-retrieval-plugin 等）。
---
## 结语与行动建议
**终极评判：** openai/plugins 是当前“把外部系统接入 OpenAI 智能体工作流”的最权威参考合集。它不是一个“一键启用的服务端框架”，而是一份“插件结构的语言与范例库”。如果你打算为 Codex/ChatGPT 做第一方或第三方插件，这份仓库应该成为你的“首站”。
**行动建议（可按需执行）：**
- 如果你是开发者：
  - 1) 克隆仓库，通读根 README 与 1–2 个你熟悉的插件（如 Figma/Notion/build-web-apps）的 README。
  - 2) 复制一个简单插件目录，修改 `plugin.json` 与 `SKILL.md`，跑通“最小可用插件”。
  - 3) 研读 `.app.json` 与 `.mcp.json` 的字段，理解如何声明 OAuth 与 MCP 工具。
  - 4) 在本地/内网创建一个 `marketplace.json`，把你的插件加入，验证在 Codex/ChatGPT 中的可见性。
- 如果你是技术负责人：
  - 评估团队已有 SaaS/内部系统，挑选 1–2 个高价值场景，基于仓库示例做 POC，形成“插件化接入标准”与评审流程（可结合社区提到的 plugin-scanner 做质量门禁）。
- 如果你是 AI 生态的研究者/爱好者：
  - 观察仓库中插件技能的结构演变（如 MCP OAuth 声明、技能版本化、多表面支持），提炼出“插件化智能体”的通用模式，用于你自己的项目或论文。
**一句话收尾：** 把 openai/plugins 当作“插件方言词典”与“最佳实践图鉴”，会少走很多弯路。它不是终点，而是你把现实世界接入 AI 工作流的可靠起点。
