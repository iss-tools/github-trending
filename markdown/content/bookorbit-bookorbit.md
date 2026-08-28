# bookorbit/bookorbit

[GitHub URL](https://github.com/bookorbit/bookorbit)

- **Stars**: 3391
- **Language**: TypeScript

## BookOrbit：全能型自托管电子书管理与阅读平台

> 自托管全能书库，支持多设备同步、划线管理及阅读统计的家庭阅读中枢。

- **Tags**: 电子书, 自托管, 阅读器, Calibre替代, Kobo同步
- **Category**: 生活效率, 知识管理, 开源工具

## Details

# 一句话总结
BookOrbit 是一个自托管、多格式、多设备同步的“家庭图书馆+阅读器”一体化平台：把书放在你自己的服务器上，用网页、Kobo 或 KOReader 随处读，进度/划线/状态全平台双向同步，并且自带多用户、权限控制、OIDC/SSO、OPDS、Send-to-Kindle、阅读统计与成就、14 家元数据抓取、自动入库等一整套能力。
---
## 背景与痛点
- 资源分散：电子书、PDF、漫画、有声书散落在本地文件夹、各设备与云端服务间，想要“一处入库，到处可读、进度同步”非常难。  
- 阅读碎片化：你在桌面用 A 阅读器、手机用 B、墨水屏用 C，每换一次设备就要手动找位置、找进度。  
- 隐私与锁定担忧：很多平台要上传书才能阅读，或依赖订阅制，且阅读数据不在自己掌控之中。  
- 多人共用图书馆场景：家庭或小团队希望每人有自己的书架、进度和权限，同时共享中央资源库。  
- 现有工具的局限：  
  - Calibre 是桌面级工具，原生 Web 服务偏弱，同步体验不算开箱即用。  
  - 各类“书库服务器”常缺少双向同步、统一划线归档、或在电子墨水屏上支持不佳。
BookOrbit 在这样的背景下诞生：用一个你控制的基础设施，把“所有书”和“所有阅读活动”统一起来，尤其打通了 Kobo 设备与 KOReader 的双向进度与注释同步，并提供多用户与 OIDC/SSO，适合家庭、团队和重度阅读者。
---
## 核心亮点与功能剖析
### 多格式 Web 阅读（无需插件）
- 支持格式：EPUB/KEPUB、MOBI/AZW3/AZW、FB2、PDF、漫画（CBZ/CBR/CB7）、有声书（M4B/MP3/M4A/OPUS/OGG/FLAC）。直接在浏览器里读，不装任何浏览器插件。  
- 用大白话说：就像浏览器自带了一个能读几乎所有常见书格式的“阅读器”。
### 三方同步：Kobo + KOReader + Web
- 双向进度同步：在 Web 读了一段，拿起 Kobo 或 KOReader 设备会自动跳到同处，反之亦然；高亮与删除也会合并归集。  
- KOReader 插件：设备端直接浏览目录、搜索、下载书籍、管理状态与评分，并同步进度与注释，无需离开设备。  
- 类比：类似于云端读书 App 在手机/平板间的同步体验，但这次全由你自己的服务器完成，且覆盖墨水屏设备。
### 划线与注释统一管理
- 来自 Web Reader、KOReader、Kobo 的划线合并到一个可搜索的中心，可以按颜色/样式/来源过滤，并导出为 Markdown、CSV、JSON。  
- 收益：把“读书笔记”变成可检索、可导出的资产，便于后续整理或导入其他工具。
### 多平台外推同步
- 支持与 Hardcover（阅读记录）、Readwise（高亮与笔记）、StoryGraph（状态与进度）等外推同步，可按触发条件推送；Hardcover 的阅读历史还能拉回以填补 BookOrbit 的空白条目。  
- 适合：已经重度使用上述服务的用户，可以把 BookOrbit 当作“中枢”，把本地书库与云端追踪服务打通。
### 统计、目标与成就
- 每日阅读时长、热力图、连续打卡、库健康度；年度目标、月度挑战、50+ 成就（五个类别）。“Reading DNA”基于实际会话历史为你的阅读风格画像。  
- 价值：把“阅读”可视化、游戏化，帮助持续保持阅读习惯。
### 图书馆管理
- 多图书馆：按文件夹隔离内容，每个库可自定义扫描规则与格式优先级。  
- 14 家元数据提供方：Google Books、Open Library、Amazon、Goodreads、Kobo、Hardcover、Audible/Audnexus、Libro.fm、iTunes，以及漫画的 ComicVine、轻小说 RanobeDB、韩文 Aladin、波兰 Lubimyczytać 等；封面还额外从 iTunes、DuckDuckGo、AudiobookCovers 获取。  
- Smart Scopes & Collections：既可建静态收藏列表，也可用“规则过滤”建立动态保存视图（类似“智能播放列表”）。
### 平台与交付
- 多用户与 SSO：按用户隔离阅读数据与权限；原生 OIDC 支持 Authentik、Keycloak、Authelia。  
- 多语言界面：社区在 Crowdin 管理翻译，翻译流程明确（只修改 en.json，其余由 Crowdin 同步）。  
- 内容交付：OPDS（可供 KOReader、Thorium、Moon+ 等使用）、Send-to-Kindle（邮件推送）、浏览器拖拽上传；Book Dock“停泊区”可配置自动摄入（丢入文件夹后自动处理入库）。
---
## 目标人群与收益
- 重度阅读者/收藏党：  
  - 收益：统一管理电子书/有声书/漫画/PDF，一处入库到处读，进度/划线不丢。  
- 墨水屏设备用户（Kobo、KOReader）：  
  - 收益：真正的设备↔服务双向同步，避免手动对进度，划线集中管理与导出。  
- 家庭/小团队共用书库：  
  - 收益：多用户与权限体系 + SSO，每个人有独立阅读数据，共享同一资源库。  
- 隐私敏感/自托管爱好者：  
  - 收益：AGPL-3.0 开源，Docker Compose 一键起，数据在你自己的硬件与数据库里，不受第三方订阅与锁定。  
- 已使用 Hardcover/Readwise/StoryGraph 的用户：  
  - 收益：把本地书库与这些服务无缝打通，无需重复记录，笔记也能自动外推。
---
## 竞品/同类对比
- Calibre / Calibre-Web：桌面强、生态广，但多设备同步与统一划线管理偏弱，需要额外插件或工作流。BookOrbit 更像一个“开箱即用、同步优先”的在线书库+阅读中枢。  
- Audiobookshelf：有声书强、UI 友好，BookOrbit 提供从 Audiobookshelf 的一站式迁移路径，但在电子墨水屏/KOReader 集成、多格式统一阅读与 OIDC 上更全面。  
- Komga（漫画）/ Kavita：漫画管理极强，但 BookOrbit 把漫画与电子书/有声书/PDF 统一到一个库，并增加了双向设备同步与阅读统计体系。  
- 各类商业云端阅读平台：通常要求上传才能阅读，并绑定订阅；BookOrbit 反其道而行，强调“文件在你自己的硬件上”，且可自建多用户体系，适合长期可控投入与隐私敏感用户。
---
## 技术栈与架构解析（面向开发者）
- 后端：Node.js（环境变量可配置 Node 堆内存上限，适合超大库），容器内 `read_only` 文件系统 + `tmpfs` 临时目录，安全加固（cap_drop ALL、仅保留必要的 CHOWN/DAC_OVERRIDE/FOWNER/SETGID/SETUID、no-new-privileges）。  
- 数据库：PostgreSQL 16 + pgvector（`.env.example` 与安装文档都提到需 uuid-ossp、pg_trgm、unaccent、vector 四类扩展），利于未来向量检索/语义搜索。  
- 前端：基于 Vue 与 Vue I18n（翻译规范为仅编辑 `client/src/locales/en.json`），社区翻译由 Crowdin 接入，说明项目有国际化架构。  
- 部署模型：单一 Docker Compose 起一套应用+数据库，`.env` 统一配置；外部数据库支持、OIDC、SMTP、迁移凭据加密等均可通过环境变量调整，架构清晰、便于运维。  
- 安全实践：  
  - 容器安全（只读文件系统、最小能力、健康检查）  
  - 邮件与迁移凭据可加密存储（通过 `EMAIL_ENCRYPTION_KEY`、`MIGRATION_ENCRYPTION_KEY`）  
  - 安全漏洞通过 GitHub Security Policy 私有报告渠道处理。
---
## 上手门槛与部署体验（含最简 Demo）
- 最低需求：Docker 与 Docker Compose v2+；OS 支持主流发行版/ macOS/ WSL2；建议 1 核 CPU、1GB+ 可用内存，磁盘除书籍外仅需约 50MB。  
- 安装流程非常平滑：官方给出“一键模板”式命令，下载 `.env.example` 与 `docker-compose.yml` 后只需修改若干必填项即可启动。  
- Docker 一键启动（最简示例）：
  - 在服务器新建目录并拉取配置模板：
    - `mkdir bookorbit && cd bookorbit`
    - `mkdir -p books data/app data/postgres`
    - `curl -fsSLo .env https://raw.githubusercontent.com/bookorbit/bookorbit/main/.env.example`
    - `curl -fsSLo docker-compose.yml https://raw.githubusercontent.com/bookorbit/bookorbit/main/docker-compose.yml`
  - 编辑 `.env`（必填项示例）：
    - `APP_URL=http://your-server-ip:3000`
    - `BOOKS_HOST_PATH=./books`
    - `POSTGRES_PASSWORD=（用 openssl rand -hex 24 生成）`
    - `JWT_SECRET=（用 openssl rand -hex 32 生成）`
    - `SETUP_BOOTSTRAP_TOKEN=（用 openssl rand -hex 16 生成）`
  - 启动：`docker compose up -d`（首次启动约 30 秒待数据库初始化完成）。  
  - 打开浏览器访问 `APP_URL`，按页面引导用 `SETUP_BOOTSTRAP_TOKEN` 完成初始管理员账号设置。  
- NAS/Unraid：官方给出 Unraid 模板（`bookorbit` + `bookorbit-db`），并解释网络与权限要点，降低非 Linux 专家的门槛。  
- 权限问题官方已预警：在 NAS 上若书籍目录归属非 1000:1000，需正确设置 `PUID/PGID`，否则会出现扫描无书、上传失败、Book Dock 无法 finalize 等现象。`.env.example` 与安装文档均给出诊断与修复指引。
---
## 社区活跃度与生命力
- 近期频繁发布：v2.6.0 版本增加可配置多行书架、九种新增界面语言、自注册开关、Kobo 购买书同步等，功能与体验持续迭代。  
- KOReader 与 Kobo 改进：v2.1.0 专门强化 KOReader 插件（批量选择/下载、离线跳过同步、设备移除与不匹配书籍追踪、Kobo 同步历史视图等），显示设备侧体验在持续打磨。  
- Issues 与 Discussions：近期仍可见 Bug（Smart Scope 加载失败、排序行为）与功能讨论（如支持 ePub 1.0 元数据查询）等活跃交互，社区在持续维护与反馈。说明项目并未停滞，问题处理与需求收集渠道通畅。  
- 翻译与社区协作：Crowdin 项目与明确的本地化/贡献指南显示其国际化与社区协作机制成熟。
---
## Demo / 代码示例（核心片段）
- `.env` 必填模板（可直接用于首次部署）：
  ```bash
  APP_IMAGE=ghcr.io/bookorbit/bookorbit:latest
  APP_URL=http://your-server-ip:3000
  BOOKS_HOST_PATH=./books
  POSTGRES_USER=bookorbit
  POSTGRES_PASSWORD=use-a-strong-random-password
  POSTGRES_DB=bookorbit
  JWT_SECRET=use-a-long-random-secret
  SETUP_BOOTSTRAP_TOKEN=use-a-random-setup-token
  ```
- Docker Compose 关键点解读（节选）：
  - 应用容器：只读根文件系统 + `/tmp` 临时目录 + 最小能力集，`restart: unless-stopped` 健康检查指向 `/api/v1/health`，依赖 postgres 健康后启动。  
  - Postgres：使用 `pgvector/pgvector:pg16` 镜像 + 持久化卷映射，健康检查用 `pg_isready`。  
  - 卷挂载：`BOOKS_HOST_PATH` 映射为容器内 `/books`，`./data/app` 映射为 `/data`，便于权限控制与备份。
- 这两份文件即为开发者评估迁移成本、安全配置、与现有容器编排集成的核心参考。
---
## 局限与不足
- 学习曲线：对完全没有 Docker/服务器经验的用户，仍需理解域名/端口/反向代理、文件权限、OIDC 等概念；官方文档详细，但门槛不可忽视。  
- 初始投入：需要一台稳定在线的服务器/NAS/云主机，并进行基础运维（更新、备份、HTTPS），相对于“开箱即用”的云服务有 upfront 成本。  
- 已知 Bug 与边缘问题：近期 Issues 显示 Smart Scope 在大量规则加载时出现“无法加载”现象、排序行为不符合预期等，说明部分高级功能仍需稳定化打磨。  
- 许可证是 AGPL-3.0：若你打算将其闭源集成到商业产品中，需要注意 AGPL 的网络服务开源义务与合规要求。  
- 功能丰富带来的配置复杂度：多用户、OIDC、外部数据库、SMTP 加密、迁移加密、Book Dock、智能过滤、多设备同步等选项众多，初次配置可能需要反复阅读文档与实践。
---
## 结语与行动建议
- 综合评判：  
  - 若你希望把“所有书”放在自己掌控的地方，并且需要真正的多端阅读/进度/划线同步（尤其是 Kobo/KOReader 生态），BookOrbit 是当前非常扎实且持续活跃的自托管方案之一。  
  - 对个人来说，它可以把阅读从“设备孤岛”变成统一、可追踪的“个人数字资产”；对家庭/团队，多用户与 SSO 能力使其成为可持续协作的书库平台。  
- 行动建议：  
  - 先用官方 Demo 快速体验 UI 与核心流程，直观感受其 Web 阅读器、管理与统计界面是否契合你的习惯。  
  - 若打算自托管，从 Docker Compose 模板开始，在低资源环境（如家用小服务器或 NAS）跑通最小示例；配置时优先确保 `APP_URL`、`BOOKS_HOST_PATH`、`PUID/PGID`、数据库凭据与 `SETUP_BOOTSTRAP_TOKEN` 正确。  
  - 重度墨水屏用户务必配置好 Kobo/KOReader 同步与 KOReader 插件，这是其差异化亮点；若你已有 Audiobookshelf 或 Calibre-Web Automated，不妨先在测试环境试用官方迁移流程，降低数据迁移风险。  
  - 对开发者：阅读 `docs/DEVELOPMENT.md` 与 `docs/CONTRIBUTING.md`，了解前后端分离与本地化流程；Docker 安全与外部数据库配置是不错的可借鉴实践。
---
## 参考资料
- BookOrbit 官方 GitHub 仓库（README、Quick Start、KOReader 插件说明、迁移指南、License）。  
- BookOrbit 官方站点（产品页与 Demo 入口）。  
- 官方安装文档（系统要求、Docker/Unraid 指南、环境变量表、权限与外部数据库说明）。  
- docker-compose.yml 与 .env.example 原始文件（容器配置与安全/扩展选项）。  
- 近期版本发布说明（v2.6.0、v2.1.0）展示功能迭代与设备侧增强。  
- GitHub Issues 与 Discussions（活跃问题与需求反馈）。
