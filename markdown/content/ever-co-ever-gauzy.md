# ever-co/ever-gauzy

[GitHub URL](https://github.com/ever-co/ever-gauzy)


## Ever® Gauzy™ 深度评测

> 一套开源的、全功能企业经营管理平台，支持Docker/K8s一键部署与多端集成，适合希望自托管、低成本统一管理“人—项目—钱—流程”的团队与企业。

- **Tags**: ERP, CRM, 开源, 自托管, 工时管理
- **Category**: 企业管理, 开源工具, 开发框架

## Details

<|assistant|>我需要点击进入仓库详情页（Stars、Forks、更新时间、分支信息等），因为当前视图仅显示 README。</think>
<|assistant|>尝试向下滚动该 GitHub 页面以显示仓库顶部的 Star/Fork 等统计信息。</think>
# Ever® Gauzy™ 深度评测
## 一句话总结
Ever® Gauzy™ 是一套“开源的、全功能企业经营管理平台（ERP/CRM/HRM/ATS/PM）”，自带桌面计时器与多端 App，支持 Docker/K8s 一键部署与 headless API 集成，适合希望自托管、低成本统一管理“人—项目—钱—流程”的团队与企业；但在功能广度上也带来复杂度，学习曲线和运维成本不容小视。
## 背景与痛点
- 现代团队常需要在多个系统间割裂协作：HR 管“人”与考勤，项目管理管“任务与排期”，财务管“发票与账单”，销售管“线索与商机”。这不仅带来重复录入，还造成数据孤岛与流程断层。
- 远程/外包/按需经济的兴起，让“工时、活动与产出”的追踪成为刚需，但现有工具要么封闭生态（SaaS），要么定制成本高昂。
- 厂商锁定（Vendor Lock-in）和数据主权问题，使得大量企业开始寻求“可自托管、可二次开发”的开源替代方案。
Gauzy 正是在此背景下，以“Open Business Management Platform”的定位，把 ERP/CRM/HRM/ATS/PM、计时、财务、报表等能力整合为一套可自托管的平台，试图解决多系统割裂、数据无法打通、厂商锁定与成本攀升等痛点。
## 核心亮点与功能剖析
- 功能完备度极高（ERP/CRM/HRM/ATS/PM 一体化）：覆盖人事与考勤（入职、排班、请假、绩效）、客户/联系人管理、项目与任务、销售漏斗、提案、发票/账单、收支、库存与供应链、目标/KPI/OKR、多组织多部门、多币种多语言等模块，基本覆盖中小型企业经营管理的主要场景。
- 原生“工时/活动/生产力”追踪与桌面计时器：提供桌面应用（全功能）与桌面计时器 App（轻量），支持截图与活动监控，适合外包/远程团队进行精确工时与可审计的产出追踪。
- Headless API 与多形态部署（Web / Desktop / Server）：后端采用 NestJS/Node.js 提供 API；支持纯浏览器访问、桌面客户端（内置 UI+API+SQLite）、或部署 Gauzy Server（API+DB，多客户端访问）。这意味着你可以用它做纯后端平台，也可以全栈开箱即用。
- 一键 Docker/K8s 与丰富基础设施组件：提供 docker-compose 的 demo/production/build 三档编排，内置 OpenSearch、Redis、MinIO、Jitsu、Cube、Zipkin 等可选基础设施组件，支持搜索、缓存、对象存储、事件管道与分析报表。这显著降低了“在本地/私有云跑一整套中后台平台”的门槛。
- 多数据库兼容与扩展友好：基于 TypeORM/MikroORM/Knex，支持 SQLite（默认演示用）、PostgreSQL、MySQL、MariaDB、CockroachDB、MSSQL、Oracle、MongoDB 等，便于根据现有技术栈进行适配与迁移。
## 技术栈与架构解析（开源项目视角）
- 前端：Angular + RxJS + ngx-admin 模板，风格偏企业级仪表盘。UI 提供多主题（深色/浅色/企业/Material 等），具备 Dashboard、报表、多视图列表等交互组件。
- 后端：Node.js + NestJS（模块化、IoC/DI 体系），统一 API 网关层；可提供 REST 与 GraphQL 端点与 WebSocket，便于各类客户端与第三方系统对接。
- 多包与工程化：采用 Nx/Lerna 管理多包/monorepo，统一构建、测试与代码组织，有利于大型项目的协作与复用。
- 数据层与 ORM：TypeORM/MikroORM/Knex 组合，通过约定/配置实现实体定义与迁移； seeding 支持生成大量假数据用于演示/压测。
- 可观测与分析：Jitsu 做事件采集（类似 Segment 开源替代），Cube 做 BI 语义层/动态报表，Zipkin 做分布式追踪，便于生产环境的问题排查与数据洞察。
比喻：如果把企业运营比作“一座机场”，Gauzy 更像是一个“航站楼综合操作系统”——它既管理“航班（项目）”“机组（人）”“旅客（客户）”，也监控“跑道吞吐（工时/活动）”和“营收（发票/收支）”；同时通过多条登机口（API、桌面、Web）让不同角色与系统顺畅进出。
## 上手门槛与部署体验
- Docker 快速体验：一句命令即可起 demo（预构建镜像）：
  - `docker-compose -f docker-compose.demo.yml up`；访问 http://localhost:4200；默认管理员 admin@ever.co / admin；员工 employee@ever.co / 12345678。适合快速体验功能与交互。
- 本地开发：Node LTS + Yarn 1.22.x；执行 `yarn bootstrap` → `yarn start`；首次启动会自动做最小 seed；需要的话可用 `.env.local` 切换数据库等。上手对熟悉 Node 生态的开发者友好。
- 生产化部署：
  - docker-compose production 模式：需要先修改 `.env.compose`，设置强随机的 JWT/SESSION 密钥（否则 API 拒绝启动），再执行 `docker-compose up -d`；官方建议生产上以 Kubernetes 为主，Compose 更适合轻量/内网环境。
  - K8s/云部署：提供了 DigitalOcean K8s 配置、Helm Charts（charts.ever.co）、Pulumi（支持 AWS EKS/Fargate/RDS）等方案，覆盖从手动到“一键”上云的多种路径。
- 注意：完整构建（docker-compose.build.yml）非常耗时，适合需要深度定制/二次开发场景；多数用户可直接使用预构建镜像加速启动。
## 目标人群与收益
- 最适合：
  - 10–200 人的企业、代理公司、外包团队、自由职业集合体，希望把“人/事/钱/时间”在一套系统里打通，且在意数据主权与成本。
  - 有一定运维/开发能力的团队，愿意或已有能力跑 Docker/K8s，并能承担一定配置与维护工作。
  - 需要对外提供客户门户、公共组织页、或需要多租户管理的 SaaS/平台型团队。
- 收益：
  - 统一数据源，减少重复录入与多工具切换带来的“上下文切换”成本。
  - 自托管避免 SaaS 长期订阅费用与厂商锁定，数据完全可控。
  - Headless API 可接入现有/自有前端、移动端或第三方服务，避免“被 UI 绑死”。
  - 内置计时与审计能力，适合按工时计费、外包结算与合规审计场景。
- 小白收益：
  - 提供在线 Demo（demo.gauzy.co）与一键 Docker 演示，非技术背景也可直观评估系统适配度。
## 社区活跃度与生命力
- 星标与组织生态：仓库主页显示约 3.3k Stars、约 692 Forks；在 Ever Co. 组织内可见多个周边仓库（Gauzy Server、Desktop App、Desktop Timer、API Server、MCP Server、Helm Charts、Pulumi 等），表明产品线与周边生态较为完备。
- Issues 与 PR：主页显示约 409 Open Issues、5 Open Pull Requests。说明问题与需求反馈不少，社区参与讨论持续，但 PR 合并节奏与团队人力匹配情况需要按具体 Issue 观察。
- 更新节奏：组织列表显示 Ever® Gauzy™ 主仓库最近更新时间为 2026-08-09，多个相关仓库（如文档、Helm、Pulumi、Traduora、Demand 等）在 2026-07 至 2026-08 间持续更新，显示项目仍在持续迭代与维护中。
- 文档与 Demo：官方网站、在线 Demo、下载页与文档站（docs.gauzy.co）均提供，便于新人上手；文档标注为 WIP，部分内容尚在完善。
## 竞品/同类对比
- Odoo：模块化极强、生态非常成熟，但技术栈以 Python 为主，定制偏重于“模块开发”，且企业版授权费用较高。Gauzy 在“工时追踪、桌面端、现代前端体验”上有优势，但生态与模块广度尚不及 Odoo。
- ERPNext：功能覆盖广，自托管友好，但 UI/UX 与性能在不同场景下评价不一；Gauzy 前后端分离、API 优先，对多端集成更友好。
- 自建多系统组合（Jira + Harvest + HubSpot + 自研财务）：灵活度高但运维与集成成本极高。Gauzy 提供“一体化、可扩展”的折中方案，显著降低系统数量与集成点。
- 其他开源 HR/PM（Odoo HR、Taiga、Plane 等）：多专注某一领域，Gauzy 胜在覆盖面与“统一数据模型”，但若只需单一能力，可能显得“过重”。
## 局限与不足
- 功能广度导致复杂度不低：新用户在“组织/部门/角色/权限/多币种/多租户/报表/基础设施组件”之间容易迷失；需要一定的“建模思维”和配置成本。
- 文档与上手引导尚有提升空间：官方文档标注 WIP，部分细节和最佳实践需通过 Wiki、Issue 或源码补充，对完全新手不友好。
- 性能与运维要求：完整生产部署需要 PostgreSQL、Redis、OpenSearch、对象存储、Jitsu、Cube、Zipkin 等组件（虽然多数可选但影响功能），对运维资源与监控提出更高要求。
- 开源协议与商用合规：仓库采用 AGPL-3.0；这意味着若你在网络服务中部署并向用户提供访问，需向这些用户开放对应源代码。官方也提供 Small Business 与 Enterprise 授权（双重许可），商用与闭源部署前务必评估合规成本与授权条款。
- 并非“开箱即用”的轻量工具：对于只需要简单工时或轻量项目的团队，Gauzy 的学习与运维投入可能过高。
## Demo / 代码示例
- Docker 快速 Demo（推荐先试再看是否深入）：
  ```bash
  git clone https://github.com/ever-co/ever-gauzy.git
  cd ever-gauzy
  docker-compose -f docker-compose.demo.yml up
  ```
  访问 http://localhost:4200；管理员 admin@ever.co / admin；员工 employee@ever.co / 12345678。
- 本地开发（yarn）：
  ```bash
  # 前置：Node LTS，yarn 1.22.x
  yarn bootstrap
  # 可编辑 .env.local 或 .env（复制自 .env.sample）调整数据库等
  yarn start
  ```
  后端 API 默认在 http://localhost:3000/api，前端 UI 在 http://localhost:4200。
- 生产 docker-compose 最小配置（务必改密钥）：
  ```bash
  # 编辑 .env.compose，设置以下强随机密钥
  # JWT_SECRET, JWT_REFRESH_TOKEN_SECRET, JWT_VERIFICATION_TOKEN_SECRET, EXPRESS_SESSION_SECRET
  docker-compose up -d
  ```
  注意：生产建议用 Kubernetes 而非 Docker Compose。
- 本地 seed（重置数据）：
  ```bash
  yarn seed
  yarn seed:all  # 大量假数据，约 10 分钟
  ```
  适合测试与演示，但切记生产环境勿用。
## 风险与合规提示
- 安全实践：官方要求生产环境全链路使用 HTTPS/WSS/SSL；发现安全漏洞应通过 security@ever.co 私密披露。默认密钥不可用于生产（API 会拒绝启动）。
- 协议与商用：AGPL-3.0 在“网络服务提供”场景下有更强的“开源传染”要求，闭源或对外提供 SaaS 需要商业授权评估。请以 LICENSE 文件与官方说明为准。
## 结语与行动建议
- 终极评判：Ever Gauzy 是一个“覆盖面极广、可自托管、可扩展”的企业经营管理平台，非常适合希望统一“人/事/钱/时间”且有能力做一定运维/二次开发的中型团队与 SaaS 创业者；它不是“即插即用的轻量工具”，但其 headless 架构与多端形态为长期演进与集成提供了扎实底座。
- 行动建议：
  1. 先花 15 分钟跑一遍 Docker demo，确认核心功能与交互是否符合业务场景与团队习惯。
  2. 对照现有系统清单，列出“可替代/需保留/需集成”的模块与数据流，评估迁移与集成成本。
  3. 小规模试点：选择一个项目或团队，用 Gauzy 跑“项目管理+工时+财务”闭环，重点验证报表与导出、权限与审计、性能与稳定。
  4. 确认合规与授权：根据你的部署方式（内部/对外 SaaS）与开源政策，评估 AGPL 与商业授权的适用性。
  5. 决定部署形态：内网轻量可用 Docker Compose；上云/多环境强烈建议走 Helm/K8s 与 CI/CD 集成。
## 参考与延伸阅读
- GitHub 仓库（主文档与 Demo 说明）：https://github.com/ever-co/ever-gauzy
- 官方网站与在线 Demo：https://gauzy.co；demo.gauzy.co
- 官方文档（WIP）：https://docs.gauzy.co
- 下载与桌面/Server App：https://gauzy.co/downloads
- 周边生态（Helm/Pulumi/PM 集成等）：Ever Co. 组织仓库页（含 charts.ever.co、Pulumi、Gauzy PM 等）
- 开源协议与安全政策：仓库 LICENSE 与 Security 说明（AGPL-3.0、security@ever.co 披露路径）
