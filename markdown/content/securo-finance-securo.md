# securo-finance/securo

[GitHub URL](https://github.com/securo-finance/securo)

- **Stars**: 2478
- **Language**: Python

## Securo：隐私优先的自托管记账神器

> 支持 Docker 一键部署、多币种与 AI 助手的隐私优先自托管理财平台。

- **Tags**: 自托管, 个人理财, 隐私安全, Docker, AI
- **Category**: 生活效率, 开源项目, 开发工具

## Details

# 一句话总结
Securo 是一款“隐私优先、自托管”的个人记账与财富管理平台（Web 应用），以 Docker 一键部署、跨币种与多账户、可插拔银行同步、多用户/权限、以及可选的本地 AI 助手为核心卖点，适合想要完全掌控财务数据、具备基础运维能力的个人与家庭/小团队。
---
## 背景与痛点：为什么要再造一个“自托管记账”？
- “金融 SaaS 总是先要你的数据”：主流记账与资产管理类产品几乎都要求把账户流水甚至银行凭证上传到第三方服务。出于隐私与合规，很多用户（尤其是开发者与隐私敏感群体）并不接受这样的前提。
- 现有自托管方案大多在“功能完整性”与“易用性”上取舍失衡：
  - Firefly III 等老牌项目功能强但配置重、上手门槛高；
  - 很多简单自托管工具缺乏“多币种、银行同步、自动化分类与规则引擎”等现代刚需能力。
- 此外，“家庭/小团体协同”和“企业级 SSO（OIDC）接入”在自托管场景下并不容易找到开箱即用的方案。
Securo 的定位正是填补这些空白：在保持数据不出自己基础设施的前提下，提供接近主流商业产品的交互与功能集合，并预留银行同步、AI 助手等扩展接口。
---
## 技术栈与架构解析
- 后端：FastAPI + SQLAlchemy + Alembic（数据库迁移）+ Celery（异步任务与定时任务）。
- 前端：React + TypeScript + Vite + Tailwind CSS。
- 数据存储：PostgreSQL（主业务数据）、Redis（队列与缓存）。
- 部署模型：
  - Docker Compose 为主流路径，官方也提供了 Linux/macOS 一键安装脚本；容器内集成了 Nginx 反向代理。
  - 在 PR 中可以看到“可选的全合一容器”在推进，面向个人自托管进一步降低运维负担。
- 身份认证与授权：
  - 本地账户密码 + Passkeys（WebAuthn，默认开启）+ TOTP 二步验证与防暴力破解。
  - OIDC（支持 Authentik、Pocket ID 等标准提供商）可作为主登录源，并支持角色/组同步与现有账号映射。
- 银行同步（可选）：可插拔设计，现支持 Pluggy（巴西）、Enable Banking（欧洲 PSD2，~2500 家银行）、SimpleFIN（美国与国际，只读开放协议）。
- AI Agents（可选）：多模型支持（OpenAI、Anthropic、Ollama 与兼容 API），基于 MCP 的工具调用与 RAG（每 agent 独立知识库），提供全局快捷聊天面板（⌘J）。
**用一个比喻来理解其架构：**  
把 Securo 想象成一座“个人银行总部大楼”。PostgreSQL 是金库，Redis 是调度中心，FastAPI 是前台与后台的“总机”，React+Vite 是大厅里的“自助柜台”，Nginx 是门卫与迎宾；Celery 则是处理周期性账单、汇率更新与长时任务的“后勤部门”。你可以选择是否接通“外部专线”（银行同步），是否为大楼配上“智能顾问室”（AI Agents），是否安装“SSO 门禁系统”（OIDC）。
---
## 上手门槛与部署体验
- 一键安装（Linux/macOS）：
  ```bash
  curl -fsSL https://usesecuro.com/install.sh | bash
  ```
- Windows 上使用 Docker Desktop：
  ```bash
  git clone https://github.com/securo-finance/securo.git && cd securo
  docker compose up --build
  ```
  打开 http://localhost:3000 创建账户即可使用。
**Docker Compose 目录结构的关键信息（来自仓库）：**  
- backend/、frontend/ 分离，各自具备构建与测试流程；  
- docker-compose.yml 定义多容器协作（API、前端、PostgreSQL、Redis、Nginx、Worker、Beat 等）；  
- .env.example 提供环境变量模板，包括数据库连接、前端 URL、银行同步与 OIDC 等可选项。
**开发体验：**  
- 后端需要 Python 3.11+，提供 `pytest` 测试；支持使用 mise 来管理工具与依赖（mise backend:install/backend:test/frontend:lint/build）。  
- 提供开发者文档与 Discord 社区，维护者开放 15 分钟 1 对 1 咨询，降低贡献门槛。
**个人体验评估：**  
- 优点：Docker 路线非常平滑，一键脚本对 Linux/macOS 用户友好；多容器拆分合理，便于运维与监控；环境变量集中且命名清晰，避免“到处散落”配置。  
- 注意：如果对 Docker/反向代理（尤其是 HTTPS 与域名配置）不熟，启用 Passkeys 或银行同步需要额外学习（WebAuthn 要求 HTTPS，IP 地址不可用）；在容器编排环境（如 K8s）需要自行适配 ingress 与持久化存储。
---
## 核心亮点与功能剖析
### 1) 多账户、多币种与交易处理
- 多账户支持（银行账户、现金、投资账户等），实时余额与历史流水；  
- 文件导入格式齐全：OFX、QIF、CAMT、CSV，并支持规则引擎自动分类；  
- 多币种自动换算（集成 Open Exchange Rates），未配置时降级为 1:1 并给出视觉提示；  
- 支持分期（installments）、周期性账单（recurring）、预算与目标/储蓄进度追踪。
### 2) 报表与净值追踪
- 报表：净值与收支对比，并带分类迷你图；  
- 资产管理支持估值跟踪与增长规则；投资订单导入（支持 CSV，带预览与撤销）。
### 3) 银行同步与可插拔设计
- 支持多家银行聚合商，并通过 .env 自动注册；  
- SimpleFIN 为“只读开放协议”，无需长期 API 密钥，一次性 Token 认证；  
- 欧洲方向 Enable Banking 的免费层存在“预链接账户”限制，界面会在未满足条件时给出引导，减少“连接失败后的困惑”。
### 4) 多用户/多工作区与权限体系
- 内置多用户、管理员面板与注册控制；  
- 工作区级角色（owner/editor/viewer），可与 OIDC 的角色/组声明做映射，适合家庭或小团队共用。 
### 5) 安全与企业级登录
- TOTP 二步验证与防暴力破解；  
- Passkeys 默认开启，支持 Touch ID/Face ID/Windows Hello/安全密钥；  
- OIDC 可设为唯一登录方式（LOCAL_AUTH_ENABLED=false），并支持自动注册与现有账号链接（三种模式：disabled/verified_email/email）；  
- 支持 OIDC 角色同步，实现统一权限管理。 
### 6) AI Agents（可选、可关）
- 自托管 LLM 聊天面板，多模型支持，工具调用通过 MCP，数据不走外部；  
- per-agent RAG，每个“智能顾问”拥有独立知识库；  
- 通过环境变量 AGENTS_ENABLED 与 COMPOSE_PROFILES 开启；不开启时零额外成本。 
---
## Demo / 代码示例（最简配置与银行同步）
- 示例 1：基础 Docker Compose 启动（仅本地账户与手动记账）
  ```bash
  git clone https://github.com/securo-finance/securo.git && cd securo
  cp .env.example .env      # 按需修改 FRONTEND_URL 与数据库密码等
  docker compose up --build
  ```
- 示例 2：开启 SimpleFIN 银行同步（只读，适合美国/国际）
  在 .env 中添加：
  ```bash
  SIMPLEFIN_ENABLED=true
  SIMPLEFIN_API_URL=https://beta-bridge.simplefin.org  # 沙箱，生产请用 bridge.simplefin.org
  ```
  重启后，在 UI 中选择“Accounts → Connect Bank → SimpleFIN”，粘贴一次性 Setup Token 即可完成连接。
- 示例 3：开启 AI Agents（本地 Ollama 示例）
  在 .env 中添加：
  ```bash
  AGENTS_ENABLED=true
  COMPOSE_PROFILES=agents
  ```
  执行 `docker compose up -d`，然后在 Settings → AI Agents 添加 Ollama 连接，即可使用内置 MCP server 进行工具化问答（数据不离开你的环境）。
- 示例 4：OIDC 与 SSO（以 Pocket ID 为例）
  ```bash
  OIDC_ENABLED=true
  OIDC_PROVIDER_NAME=Pocket ID
  OIDC_DISCOVERY_URL=https://id.example.com/.well-known/openid-configuration
  OIDC_CLIENT_ID=securo
  OIDC_CLIENT_SECRET=your-client-secret
  FRONTEND_URL=https://securo.example.com
  ```
  将回调 URL https://securo.example.com/api/auth/oidc/callback 注册到 OIDC 提供商后，重启即可通过 SSO 登录。若需“仅 SSO 登录”，同时设置 LOCAL_AUTH_ENABLED=false。
---
## 目标人群与收益：谁适合用、能带来什么好处？
- 注重隐私与数据主权的个人/家庭记账用户：数据只存在自己的 PostgreSQL 实例中，银行同步为只读且可选；可导出 CSV 作为数据“出口”。
- 多币种、跨境资产持有者：自动汇率换算、多币种账户统一视图，无需手工折算。
- 希望统一家庭/小团队财务管理的用户：多工作区与角色权限控制，可与现有 SSO 打通（OIDC）实现统一登录与权限同步。
- 想要“本地智能顾问”的进阶用户：通过 AI Agents 在本地/私有 LLM 上做问答与统计，而不把流水发到外部 API；可自定义每 agent 的知识库以满足个性化分析需求。
- 开发者与自托管爱好者：清晰的 FastAPI+React+Postgres+Redis 技术栈、Docker Compose 一键起、文档与 Discord 社区、开放的贡献流程，便于二次开发与定制。
---
## 社区活跃度与生命力
- Stars/Forks：约 2.3k Stars、302 Forks，在自托管财务类项目中属于较活跃的量级。
- Issues/PRs：约 119 Issues、36 PRs；近期的 PR 涵盖发票/应收账（receivables ledger）与 PDF、分组相似交易、GoCardless 银行提供商、修复 payee 规模化列表可用性等，显示持续迭代与功能扩展。PR 标记有风险等级与尺寸，便于评审。
- Commits：最近提交持续到 2026-08-27（如 CI 迁移安全性修复等）。
- Releases：近期发布 v0.14.4、v0.14.3，功能与修复密集（投资订单导入、规则嵌套分组、带密码备份、删除确认、正则安全性加固、OIDC 文档完善等），并明确感谢贡献者与报告者，体现出“小步快跑”的节奏与社区参与度。
- 沟通与支持：官网提供 Demo、文档、Roadmap 与 Discord 入口；维护者开放 15 分钟预约沟通，鼓励讨论与反馈。
---
## 竞品/同类对比（简要）
- Firefly III：成熟但学习曲线陡，界面与交互偏传统；Securo 在现代 UI/UX、AI 集成、OIDC 一体化上更“开箱即用”。
- Actual：强自动同步与交互，但并不是完全自托管；Securo 强调“数据不出自己的基础设施”。
- 家庭共享方案如 YNAB 等：功能与移动端成熟，但数据云端，且 SSO/权限颗粒度不如 Securo 可控；Securo 更适合愿意自建服务、对隐私/合规有要求的小团队。
**独特竞争力：**
- 同时满足“现代 UI/体验 + 完全自托管 + 多币种 + 可选银行同步 + 多用户/OIDC + 可选本地 AI”这一长链路需求，单项目覆盖面较广且开箱即用程度高。
---
## 局限与不足（客观评估）
- 学习与运维门槛：至少需要掌握 Docker/反向代理基本操作；若要启用 Passkeys 或银行同步，还需准备域名与 HTTPS。  
- 银行同步的地域与可用性：目前三家提供商在不同区域覆盖不同，亚洲等地区用户可能需要依赖手动导入（CSV/OFX/QIF/CAMT）或自行扩展新的提供商。   
- 移动端与原生体验：当前主要形态为 Web 应用；虽支持响应式，但重度移动端用户可能会怀念原生 App 的通知与系统集成。  
- AI Agents 的配置复杂度：若选择非 Ollama 的云端模型，仍需自行处理 API Key 与合规策略；RAG 的知识库构建需要一定的内容组织能力。   
- 许可证为 AGPL-3.0：对“自用”无碍，但若打算将 Securo 作为 SaaS 对外提供服务，需注意修改与网络化使用时的开源义务（需以同样协议开源修改）。
---
## 结语与行动建议
- 如果你正为“把财务数据交给谁”而纠结，Securo 提供了一个务实的折中：既不必放弃现代记账体验，又能守住“不出自家基础设施”的底线。  
- 对开发者与自托管玩家而言，Securo 的技术栈清晰、Docker 一键起、PR 与 Issues 活跃、社区沟通渠道开放，是非常好的“练手+实用”项目。  
- 对于家庭或小团队，利用其多工作区与 OIDC 角色同步，可以低成本搭建一个统一、合规的财务看板。
**可落地的下一步：**
- 先跑 Demo：访问官方 Demo 体验交互与报表，确认是否满足你的使用习惯。  
- 本地一键起：在 Linux/macOS 上使用 `curl -fsSL https://usesecuro.com/install.sh | bash`，或 Windows 上用 `docker compose up --build`，从手动记账开始，逐步探索规则引擎与预算/目标。   
- 按需开启高级能力：需要自动流水时再配置 SimpleFIN 或当地可用提供商；需要统一登录时接入 OIDC；需要智能问答时再开启 AI Agents。  
- 若准备作为团队基础设施，建议先通读 Roadmap 与文档，确认长期路线与你组织的需求匹配，再规划备份策略、HTTPS 与灾备方案。
整体评判：Securo 在“自托管记账”这个细分赛道，已做到“可用、易用、可扩展”，并在持续迭代。只要你能接受一定的 Docker/运维门槛，它很值得成为你财务数据的“自管总部”。
