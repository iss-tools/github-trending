# coollabsio/coolify

[GitHub URL](https://github.com/coollabsio/coolify)


## Coolify 深度评测：60K Star 的开源自托管 PaaS，一台 VPS 拥有 Vercel 体验

> 开源自托管 PaaS 平台，一条命令在 VPS 上搭建属于自己的 Vercel/Heroku 平替，代码数据完全自主可控。

- **Tags**: 开源项目, PaaS, 自托管, Docker, 自动部署
- **Category**: 开发工具, 云服务与自托管, DevOps 运维

## Details

# Coolify 深度评测：60K Star 的"平民版 Heroku"，是自托管的答案还是新的坑？
> 它是一个运行在你自己 VPS 上的"图形化部署控制台"——你只需一条命令安装，之后就能像用 Vercel 那样 push 代码自动部署，却拥有完整的服务器控制权。**如果你正在为每月给 Heroku、Render、Railway 交的"智商税"心疼，又不想花三天手写 Traefik 配置和 Nginx 反代，Coolify 几乎就是为你准备的。**
---
## 一、一句话总结
**Coolify 是一个开源自托管的 PaaS（平台即服务）**，定位是 Vercel / Heroku / Netlify / Railway 的"平替"，让你用 Docker + 任意一台能 SSH 登录的服务器（哪怕是一台 5 美元的 VPS 或树莓派），通过图形化面板完成应用的 CI/CD、域名绑定、HTTPS、数据库、备份和监控。
截至 2026 年 10 月，它在 GitHub 上已收获 **约 6 万 Star、5.2K Fork**，是目前自托管 PaaS 赛道中热度最高的项目之一，同台竞技者包括 Dokploy（26K Star）和 CapRover。
---
## 二、背景与痛点：为什么需要它？
### 2.1 一个匈牙利开发者的"反 SaaS"执念
Coolify 由匈牙利开发者 **Andras Bacsai** 于 2021 年创立，公司 Coollabs 至今**没有拿过任何外部融资**，靠 GitHub Sponsors 赞助和 Coolify Cloud 订阅养活一个 5 人小团队。
Andras 的 GitHub 个人签名很能说明项目气质："**I build self-hostable alternatives to closed SaaS: tools you actually own.**"（我做可自托管的闭源 SaaS 替代品：让你真正拥有工具的所有权。）
### 2.2 它在解决什么痛点？
把开发者的真实痛苦排个序，Coolify 一一对位：
| 痛点 | 传统解法 | Coolify 的解法 |
|---|---|---|
| Heroku 一个 Postgres 就要 $50/月 | 上云、忍 | 装在 $5 VPS 上，数据库本地跑 |
| 手写 Nginx / Traefik / Certbot 太麻烦 | 请运维 | UI 一键绑域名，自动签 Let's Encrypt |
| Git push 后想自动部署 | 自己搭 GitHub Actions + SSH | 原生集成 GitHub / GitLab / Bitbucket / Gitea，push 即部署 |
| 想 "买一台服务器跑 N 个开源服务" | 一个一个 docker run | 300+ 一键服务模板（Uptime Kuma、N8n、Supabase、Plausible 等） |
> **一句话理解它的价值：Coolify 把"我有一台服务器"和"我能像用 Vercel 一样轻松部署"这两件事，第一次用图形界面焊在了一起。**
### 2.3 它的"灵魂"： removable / portable
README 里有一句话很关键："**Your configurations stay on your servers. If you stop using Coolify, your running resources continue to work.**"
意思是：Coolify 本身**只是一个"编排层"**，底层全是你服务器上跑的 Docker 容器和 Traefik。哪怕有一天你把 Coolify 面板删了，已经跑起来的应用照样工作。这与 Portainer、CapRover 等"强绑定"工具相比，给了用户极大的退出自由——这点后面在"局限"部分还会再谈。
---
## 三、核心亮点：为什么它火了？
### 3.1 ✨ 亮点一：一条命令，5 分钟拥有自己的 PaaS
整个安装过程真的只有一行：
```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```
官方最低配置是 **2 核 CPU / 2GB 内存 / 10GB 硬盘**，推荐 Ubuntu 22.04 LTS 或 Debian 12。装完后浏览器打开 `http://服务器IP:8000`，注册一个本地账号，就能开始部署——**没有云厂商账号、没有地域限制、没有数据出境焦虑**。
安装脚本会自动帮你装好 Docker、Coolify 本体、Traefik 反代，并在 `~/.coolify/` 目录下落一份完整的 docker-compose.yml，方便你随时搬迁或备份。
### 3.2 ✨ 亮点二：300+ 一键服务，覆盖自托管 99% 场景
这是 Coolify 最"惊艳"的部分之一。点开 "New Resource → One-click Services"，你会看到一个庞大的目录，常见的包括：
- **数据库类**：PostgreSQL、MySQL、MongoDB、Redis、ClickHouse、Supabase
- **开发工具**：Gitea、GitLab、NocoDB、Appsmith、n8n、Uptime Kuma
- **建站/分析**：WordPress、Ghost、Plausible、Umami、Matomo
- **协作办公**：Mattermost、Outline、Nextcloud、MinIO
每个服务都会**自动生成强密码、自动配置持久化存储、自动签 HTTPS**，几乎不用你写任何 YAML。
### 3.3 ✨ 亮点三：真·Git 工作流 + PR Preview
接入 GitHub 仓库后，Coolify 提供了和 Vercel 几乎一样的体验：
- **Push 即部署**：webhook 触发，自动 build & ship
- **PR Preview**：每个 Pull Request 自动生成一个独立预览域名（如 `pr-42.app.example.com`），合并后自动销毁
- **构建方式灵活**：支持 Nixpacks（零 Dockerfile 自动构建）、Railpack、Dockerfile、Docker Compose、预构建镜像，5 种任你挑
- **回滚**：保留历史镜像，点一下就能回滚到上一版
这直接打掉了"想用 Vercel 体验，又不想被收流费"的人群的最大心理障碍。
### 3.4 ✨ 亮点四：2026 年新杀器 —— 原生 MCP Server
Coolify 在 v4.2+ 中内置了 MCP（Model Context Protocol）端点，地址是 `https://your-coolify/mcp`。这意味着你可以把 Coolify 接入 Claude Desktop、Cursor 等 AI 客户端，让 AI 助手**直接帮你查日志、重启服务、部署应用、排查失败构建**——复用同一套 API Token 和团队权限体系。
这是目前同类自托管 PaaS 中**第一家原生内置 MCP 的产品**，对"用 AI 当运维副驾"的人群极有吸引力。
### 3.5 ✨ 亮点五：完善的多服务器与备份
- **多服务器管理**：一个 Coolify 面板可以管理 N 台 SSH 可达的远端服务器，按应用指定部署到哪台
- **S3 兼容备份**：内置对接任意 S3（AWS S3、Backblaze B2、MinIO、阿里 OSS 等）做数据库/卷的定时备份
- **通知集成**：Slack、Discord、Telegram、邮件，部署失败立即推送
- **Sentinel 监控**：内置轻量监控代理，能看到每个容器的 CPU/RAM/磁盘曲线
---
## 四、技术架构与上手体验
### 4.1 技术栈：一份"复古但聪明"的选型
有意思的是，Coolify 没有用流行的 Node.js / Go / Rust，而是选了 **Laravel 11 + PHP 8.4**。
| 层级 | 技术 |
|---|---|
| 后端 | **Laravel 11**（PHP 8.4） |
| 前端 | **Livewire + Alpine.js + Blade + Tailwind** |
| 数据库 | PostgreSQL 15 |
| 缓存/队列 | Redis 7 |
| 实时通信 | **Soketi**（WebSocket） |
| 容器编排 | **Docker & Docker Compose** |
| 反向代理 | **Traefik**（自动 HTTPS / Let's Encrypt） |
| 进程管理 | S6 Overlay |
| 终端模拟 | XTerm.js |
| 代码编辑 | Monaco Editor（就是 VSCode 同款） |
**为什么说这个选型聪明？**
1. **Livewire 全栈模式**意味着前后端是同一份 PHP 代码，**无需 API 层和独立前端构建**，开发者可以单人快速迭代——这正是 Andras 一个小团队能快速把功能堆起来的关键。
2. **Traefik 做反代**是 PaaS 的标配，Coolify 利用它的动态配置 API 实现"UI 里点一下域名，证书秒签"，用户体验上和 Vercel 没差别。
3. **PHP 生态的成熟度**让 Coolify 能用相对少的代码量实现 Nixpacks 构建器、多服务器 SSH 调度、复杂权限系统等核心能力。
**代价**是资源开销偏高：官方实测 Coolify 自身空闲时就吃 **500–700MB RAM、5–6% CPU**，比 Dokploy 的 350MB / 0.8% CPU 高一截。
### 4.2 部署一个 Node.js 应用的最短路径
**Step 1**：服务器上跑安装命令（见上文）。
**Step 2**：登录面板 → `New Project` → `New Resource` → 选 `GitHub` 作为源，授权 OAuth。
**Step 3**：选仓库 → 选分支 → 选构建方式：
- 如果你仓库根目录**没有 Dockerfile**，选 `Nixpacks`，Coolify 会自动识别 Node.js / Python / Go / PHP 等，零配置构建；
- 如果有 Dockerfile，选 `Dockerfile` 即可。
**Step 4**：填环境变量（支持 secret 单独加密存储）、绑定域名：
```
Domain: https://myapp.example.com
```
点 `Deploy`。**30 秒后**你的应用就跑在 `https://myapp.example.com`，HTTPS 自动签好。
**Step 5**：之后每次 `git push` 到 `main` 分支，Coolify 自动重新构建部署。
整个过程不需要你碰 SSH，不需要写 nginx.conf，不需要 certbot。**这就是 Coolify 的核心 DX 卖点。**
### 4.3 文档与社区体验
官方文档（coolify.io/docs）覆盖完整：从安装、应用部署、数据库、邮件、迁移，到 API/CLI/MCP 都有独立章节。**Discord 社区约 1.5 万成员，响应速度通常在几小时内。** GitHub Issues 数量在 600+，但有专门的核心团队 triage，关键 bug 通常 24–48 小时内修复。
---
## 五、目标人群与收益
### 5.1 🎯 谁最适合用？
| 人群 | 适配度 | 能拿到什么 |
|---|---|---|
| **独立开发者 / Indie Hacker** | ⭐⭐⭐⭐⭐ | 把 $50/月 Heroku 账单压到 $5/月，省下的钱够买一年 OpenAI 订阅 |
| **小团队 / 创业公司**（<10 人） | ⭐⭐⭐⭐⭐ | 一台 $40/月的 Hetzner 独服，能跑 10 个微服务 + 数据库 + 监控 |
| **想自托管 SaaS 的人** | ⭐⭐⭐⭐⭐ | 300+ 一键模板，相当于一个"自托管应用商店" |
| **Agency / 接外包的** | ⭐⭐⭐⭐ | 给每个客户单独一台服务器 + 单独的 Coolify，互不污染 |
| **想学 DevOps 的新手** | ⭐⭐⭐⭐ | 看它生成的 docker-compose / Traefik 配置，就是活教材 |
| **需要 K8s 级别编排的大厂** | ⭐⭐ | 不合适，去用 Qovery / Northflank |
### 5.2 💰 性价比对比（这是它最锋利的刀）
| 方案 | 跑 3 个 Web 应用 + 1 个 Postgres | 月成本 |
|---|---|---|
| **Heroku**（Eco + Mini PG） | Eco Dynos ×3 + Mini PG | ~$19 |
| **Railway**（Hobby） | 按用量，典型 | ~$10–20 |
| **Vercel Pro + Neon + Upstash** | Pro $20 + DB | ~$25+ |
| **Coolify 自托管（Hetzner CPX21）** | 3 vCPU / 4GB，**跑所有东西** | **~€7（约 $8）** |
| **Coolify Cloud** | 面板托管费 + 自己买 VPS | $5 + VPS 费 |
**Coolify Cloud 定价**：$5/月含 2 台服务器，每加一台 $3/月，年付打 8 折。它的逻辑是"你花钱买省心，但 VPS 还是你的"——和 Heroku 那种"平台抽成大头"的模型完全不同。
---
## 六、竞品对比：在自托管 PaaS 赛道，它的位置
2026 年，自托管 PaaS 已经打得火热，主要玩家是 **Coolify / Dokploy / CapRover / Dokku / Easypanel / Temps**。我们挑三个最强的横向拉一遍：
| 维度 | **Coolify** | **Dokploy** | **CapRover** |
|---|---|---|---|
| GitHub Stars | **~60K** | ~26K | ~14K |
| 首次发布 | 2021 | 2024 | 2017 |
| 许可证 | **Apache 2.0** | Apache 2.0 | Apache 2.0 |
| 最低内存 | 2 GB | 2 GB | 1 GB |
| 空闲 RAM 占用 | 500–700 MB | **~350 MB** | ~300 MB |
| 一键服务数 | **300+** | ~100 | ~100+ |
| Docker Compose | ✅ 完整支持 | ✅ 原生支持 | ⚠️ 有限 |
| 多节点集群 | ⚠️ 多服务器管理（非集群） | ✅ Docker Swarm | ✅ Docker Swarm |
| PR Preview | ✅ 原生 | ✅ 原生 | ❌ 需 GH Action |
| MCP Server | ✅ 原生内置 | ❌ | ❌ |
| UI 现代度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 中文资料 | 较多 | 少 | 多 |
**怎么选？**
- **要 UI 最精美、功能最齐全、社区最大** → **Coolify**
- **要资源占用最低、原生 Swarm 多节点** → **Dokploy**
- **要稳定的 1GB 小鸡部署 + 老牌一键模板** → **CapRover**
- **要纯命令行、CI/CD 优先** → **Dokku** 或 **Kamal**（37signals 出品）
**和 Vercel / Heroku / Netlify 比**：它们的核心差异是**控制平面归属权**。Vercel 帮你管全球 CDN 和边缘函数，你交钱买省心；Coolify 让你管一台机器，但代码、数据、流量都从你自己的服务器过——**对隐私敏感、成本敏感、或需要部署到内网的场景，Coolify 是唯一解**。
---
## 七、局限与不足：泼一盆冷水
任何深度评测如果只说好话都是耍流氓。Coolify 的暗面同样真实。
### 7.1 ⚠️ 安全事件频发，多租户场景慎用
这是 Coolify **最需要被严肃对待**的问题。近两年公开的高危漏洞不少：
- **CVE-2026-34592**：认证绕过（2026 年 7 月披露）
- **GHSA-h5xw-7xvp-xrxr**：**Docker Compose 注入 RCE**，CVSS 9.4（Critical）。一个低权限 member 用户只需提交恶意 docker-compose.yml（挂载宿主机 `/` 为 rw），就能**拿到宿主机 root 权限**，完全绕过容器隔离
- **CVE-2025-64419 / 64420 / 64424**：三个漏洞组合，其中一个是命令注入，可提权执行任意系统命令（2026 年 1 月）
- **PHP2Shell**（2026 年 10 月）：影响 v4.x 全线，需升级到 v4.4.7
**给读者的实用建议**：
1. **不要把 Coolify 当多租户平台卖给外人用**——它的多用户权限模型在 RCE 面前形同虚设；
2. **开启自动更新**（Settings → Update → Auto-update），或订阅官方 changelog 邮件；
3. **Coolify 服务器本身只暴露 22 和 8000（或反代后的 443）端口**，其余端口防火墙全部封死；
4. **重要数据库定期 S3 备份**，别把鸡蛋都放在 Coolify 一个篮子里。
### 7.2 ⚠️ 资源占用偏高
前面说过，Coolify 空闲时就吃 500–700MB RAM。如果你只有一台 1GB 的"小鸡"，**装上 Coolify 之后基本跑不了几个应用**。同等硬件下，Dokploy 和 CapRover 能塞的应用更多。
### 7.3 ⚠️ 多服务器是"管理"不是"编排"
Coolify 的多服务器能力本质是"**一个面板 SSH 到多台机器部署**"，而不是 K8s 那种**自动调度、自愈、横向伸缩**。如果你部署的应用挂了，Coolify 会重启它，但**不会自动把它调度到另一台健康服务器**。这是 Dokploy（用 Swarm）和 K8s 系产品（Qovery、Northflank）的强项。
### 7.4 ⚠️ 版本号长期挂着 "beta"
直到今天，Coolify 主线版本号仍是 `v4.0.0-beta.xxx`，官方虽然没有重大破坏性变更，但 **"beta" 这个词对一些企业合规部门就是劝退词**。如果你要往公司推，得先给 CTO 解释一下这个 beta 的含金量。
### 7.5 ⚠️ 复杂工作流不如手写 IaC
如果你已经在用 Terraform + Pulumi + ArgoCD 这套"基础设施即代码"的成熟工作流，Coolify 的 UI 优先设计反而会觉得**倒退**——它更适合"我用 UI 不丢人"的独立开发者，而不是追求一切可审计、可回放的平台团队。
### 7.6 ⚠️ 升级偶有翻车
由于迭代速度快，某些版本升级可能出现容器重启失败、Traefik 配置丢失等问题。**升级前务必给 `/data/coolify/` 目录打个快照**，Hetzner / Vultr 都支持一键 snapshot。
---
## 八、结语与行动建议
### 8.1 终极评判
> **Coolify 是 2026 年自托管 PaaS 赛道当之无愧的"人气王"和"功能王"，它把 Heroku 级别的 DX 平民化到了一台 5 美元 VPS 上，对独立开发者、小团队、自托管爱好者来说，是当下性价比最高的选择之一。**
但它不是没有代价：**安全补丁节奏快到让你必须跟进、资源占用偏高、多服务器无法自动调度、企业级功能（SOC2、SSO、审计日志）仍是空白。**
### 8.2 谁该立刻试？
✅ 每月为 Heroku / Railway / Render 交 $10 以上账单的独立开发者
✅ 想自托管 n8n / Supabase / Plausible 但被 Docker 命令劝退过的人
✅ 接外包要给客户单独部署环境的 Agency
✅ 想搞个"自家小云"练手的 DevOps 新手
### 8.3 谁应该绕路？
❌ 需要 SOC2 / HIPAA 合规的金融、医疗客户
❌ 多节点高可用、自动故障转移是硬需求的生产级 SaaS
❌ 团队已经在用 K8s / ArgoCD 工作流，不想多学一套 UI
❌ 服务器只有 1GB 内存的重度自托管玩家（请出门左转 Dokploy）
### 8.4 三步上手建议
1. **找个测试环境**：Hetzner CX22（€3.79/月）或 Racknerd 年付黑五套餐，10 分钟装好；
2. **从一键服务开始**：先部署一个 Uptime Kuma 或 Plausible，感受一下"图形化运维"的爽感，再切到自己的 Git 仓库部署应用；
3. **必做的三件事**：开启自动更新、配置 S3 备份、把 8000 端口从公网封掉只走反代域名。
### 8.5 一句话总结
> **Coolify 不完美，但它把"我的服务器我做主"这件事的门槛降到了普通人也能玩的高度。在云厂商不断涨价、开源精神被商业化的 2026 年，它本身的存在就是一种价值。**
