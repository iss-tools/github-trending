# corsairdev/corsair

[GitHub URL](https://github.com/corsairdev/corsair)


## Corsair: AI 应用的统一集成层

> 面向 AI 应用的第三方服务统一集成层，安全隔离凭证，支持多租户与 Agent 框架。

- **Tags**: AI Agent, 认证集成, 开源, MCP, 开发者工具
- **Category**: 开发工具, AI 编程

## Details

# 一句话总结
Corsair 是面向 AI 应用的「统一集成层」：它接管第三方服务（Slack/GitHub/Gmail/Linear 等）的认证与权限，把敏感凭证藏在加密库里，让 Agent 做事但拿不到密钥；你可以自建或托管，正迅速成为 Agent 生态里的通用“连接基建”。
---
## 背景与痛点：它为什么会出现？
- **现实痛点：**
  - 要把 Agent 接进 Gmail/Slack/GitHub，既要处理 OAuth 2.0 授权与刷新，又要安全存令牌，还要应对 API 变更与限流，重复性工作极高。
  - 多租户场景下，不同用户的凭证要严格隔离；否则一旦泄露，越权访问将成灾难。
  - 直接把 API Key 喂给 Agent，既不安全（可能被诱导输出），又难以控制能做什么、不能做什么。
- **Corsair 的解法：**
  - 把「集成 plumbing」抽象成一层：认证、令牌刷新、凭证加密存储、限流、Webhook 签名验证等都由它处理。
  - Agent 只见到方法名与结果，见不到凭证；权限模式（open/cautious/strict/readonly）让你决定哪些动作需要人先批准。
  - 多租户开箱即用：设 multiTenancy: true，各租户的凭证、数据与权限评估都会隔离。
---
## 核心亮点与功能剖析
### 1) 安全与凭证隔离
- 任何存储的凭证都用 Key Encryption Key（KEK）加密，KEK 由你自己持有；丢失即丢失，相当于根密码级别。
- 权限请求会写入一个 Agent 无权访问的数据库，直到记录被标记为 approved 才能继续执行，杜绝绕过。
- 托管模式（Corsair Hub）更以“中继”方式工作，不在自家数据库落用户凭证；即便被黑也不会泄露凭证与数据。
### 2) 一套 API 接入主流第三方服务
- 插件以 @corsair-dev/<name> 的 npm 包形式存在（如 @corsair-dev/slack、@corsair-dev/linear、@corsair-dev/github 等），覆盖 Slack、Linear、Gmail、GitHub、HubSpot、Stripe 等数百种集成，且生态仍在扩展。
### 3) 多租户与数据分区
- 支持多租户数据隔离与 Webhook/缓存分区；便于 SaaS/企业级场景安全地接入多个用户账号。
### 4) MCP 适配器与 Agent 框架兼容
- 官方提供了 MCP 适配器，兼容 Anthropic SDK、Claude Agent SDK、OpenAI Agents、Vercel AI SDK、Cursor 等主流 Agent/编码工具；你无需重构现有编排，只需将 Corsair 接入工具链即可。
### 5) 自托管与开源可控
- 项目以 TypeScript 为主（仓库约 98.8% TS），采用 Apache-2.0 许可证，可自由商用与二次开发。
- 想要的集成如果没有，可以 Fork 一条 PR，或者用脚手架自己写插件。
---
## 目标人群与收益：谁能从中获益？
- 正在构建/运营 AI Agent 的团队：  
  收益：把“接哪个服务就要写一套认证与凭证管理”的重复工作全部外包，节省工程时间，把精力集中在业务逻辑。
- SaaS/多租户产品：  
  收益：开箱的多租户隔离、权限审计与凭证加密，降低合规与安全风险。
- 开发者个人：  
  收益：学习一套高可复用的集成层模式，并在本地就能跑起端到端 Demo；npm 包与文档成熟，上手体验友好。
---
## 竞品/同类对比：Corsair 的位置与独特竞争力
- 相比封闭式集成平台：  
  - 开源意味着你不必等供应商排期；缺少的集成可以自己加或 Fork。
- 相比自己手工“vibe coding”一套集成：  
  - Corsair 把那 20% 的高维护成本（令牌刷新、API 变更、签名校验、多租户凭证隔离等）标准化，避免后期技术债累积。
- 相比其他 MCP 工具库：  
  - 除了“工具调用”，Corsair 自带凭证管理、权限审批与多租户；既为 Agent 提供“手”，也提供“锁”和“账本”。
---
## 技术栈与架构解析（GitHub 项目视角）
- 语言与生态：  
  - 仓库以 TypeScript 为主（98.8%），辅以少量 JS；用现代工具链（如 Turbo、Biome）管理 monorepo 与代码风格。
- 核心设计：  
  - 以插件化为核心：createCorsair({ plugins: [...] }) 注册插件；每个插件封装特定服务的 API/Webhook/数据库映射。
- 数据模型：  
  - Quick Start 提供了五大表的 schema：corsair_integrations（集成配置）、corsair_accounts（账号/凭证）、corsair_entities（实体/数据缓存）、corsair_events（事件与 webhook）；支持 SQLite 与 PostgreSQL，并给出 Drizzle schema 例子，方便集成现有 ORM。
---
## 上手门槛与部署体验：多快能跑起来？
- 安装与 KEK 生成：  
  - npm install corsair；生成 KEK 并环境变量传入；文档提供可视化“生成”按钮与命令行指引。
- 数据库迁移：  
  - 提供现成 migration.sql（SQLite/PostgreSQL）与 Drizzle schema；一条命令即可完成五张表的初始化，体验相当顺滑。
- 初始化实例：  
  - 只需三步：装驱动、跑迁移、把数据库与 KEK 注入 createCorsair；此后即可注册插件并调用。
---
## 社区活跃度与生命力
- 仓库数据：约 9.7k Stars、268 Forks、95 分支、1 个 Tag；显示较高的关注度与早期发展阶段。
- 提交与生态：近期有 plugin 相关的 commit 与 PR（如 add Apify plugin 等），npm 上 @corsair-dev/* 插件包发布频繁；说明插件生态在持续扩张。
- 讨论与支持：官方 Discord、X 账号与 GitHub Discussions 已就位，便于获取社区支持与反馈。
---
## Demo / 代码示例：怎么用最简单的方式试起来
### 安装与基础初始化
```bash
npm install corsair better-sqlite3
# 按官方 Quick Start 提供的 migration.sql 建表
sqlite3 corsair.db < migration.sql
```
### 创建实例
```ts
// corsair.ts
import { createCorsair, slack, github, gmail, linear } from 'corsair';
// 你的数据库适配器/连接，例如 SQLite / Postgres / Drizzle 等
import { db } from './db'; 
export const corsair = createCorsair({
  plugins: [slack(), github(), gmail(), linear()],
  database: db,
  kek: process.env.CORSAIR_KEK!, // 务必安全保管
});
```
---
## 局限与不足：需要理性看待的地方
- 仍处于快速演进的版本区间：Tag 数量较少，API/Schema 可能随版本迭代调整；需关注 CHANGELOG 与迁移成本。
- 自托管需要运维：安全地保管 KEK、维护数据库、处理 Webhook 入口与签名，需要一定 DevOps 能力。
- 学习与集成成本：尽管文档友好，但多租户、权限模式与 MCP 适配器的概念仍需花时间理解，尤其是从“手工调用 SDK”迁移而来的团队。
---
## 结语与行动建议
如果你正在打造 AI Agent 并需要安全、可控、可扩展的第三方服务接入，Corsair 是一个兼顾“开箱即用”与“开源掌控”的务实选择。  
- 建议按 Quick Start 先在本地搭一个最小 Demo，跑通 Slack/Gmail 等插件，验证权限与多租户模型；  
- 对权限与安全敏感的场景优先自托管；  
- 留意项目 Tag 发布与插件生态变化，选择合适的时机将其集成到生产链路。
