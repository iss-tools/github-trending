# oblien/openship

[GitHub URL](https://github.com/oblien/openship)


## Openship 深度评测：像 Vercel 一样一键部署，数据却握在自己手里

> 开源自托管部署平台，让你像用 Vercel 一样 git push 上线，却把服务器、数据和成本的控制权全部拿回自己手中。

- **Tags**: 自托管, PaaS, 部署平台, DevOps, 开源
- **Category**: 开发工具, 部署运维, 开源项目

## Details

# Openship 深度评测：把 Vercel 般的部署体验，装进你自己的 Mac 菜单栏
> **一句话总结**：Openship 是一个 2026 年 3 月才开源、却在半年内冲到 **11.7k Star** 的自托管部署平台——它同时提供了 **桌面 App、自托管控制面、以及托管云** 三种形态，用「本地构建 + SSH 直推 + OpenResty 边缘」的架构，让你像用 Vercel 一样 `git push`，却又像用 Docker 一样拿回所有数据与容器。它最锋利的差异点是：**市面上第一个真正做出「原生桌面 App」的 PaaS**，并且能**领养你服务器上已经跑着的容器**，而这一切都是 Apache-2.0 自由开源。
---
## 🎬 背景与痛点：为什么我们又需要一个新的部署平台？
### 痛点一：PaaS 太贵、太绑定，VPS 太糙、太折腾
任何写过 Node / Python 的人几乎都经历过这样的心路：
- **用 Vercel / Netlify / Railway**：`git push` 三秒上线，爽到飞起。但一算账——数据库、带宽、函数调用、日志全部按量计费，一个跑着 Postgres 的中型项目轻松飙到几十上百刀。更难受的是，**代码进了人家云里，你就再没见过"那一层"长什么样**。
- **用自托管的 Coolify / Dokploy / Dokku**：把一台 Hetzner 挂上就完事，便宜得感人。但你的部署体验，本质上仍然是在**浏览器里点一个**用 Webpack 写的仪表盘**，然后祈祷。** 没有原生体验、没有多态部署形态，而且——重点——**控制面板本身仍然跑在你那台生产机上，一旦面板挂了，你也跟着挂。**
### 痛点二：2026 年了，我们想用 AI 部署，但工具不让
Claude Code、Cursor 这类 AI 编程助手已经能写代码了，但**让 AI 帮你 `deploy` 一个应用到生产环境**，往往还是要人肉去 Web 面板点按钮。要打通这一步，需要的是**结构化、可鉴权、可权限收敛的 MCP/REST 工具面**——而大多数自托管平台根本没把它当一等公民。
### Openship 的诞生逻辑
Openship 由组织 `oblien` 维护，项目创建于 **2026-03-05**，主语言 **TypeScript**，Apache-2.0 协议，到 2026-08-25 已经累积 **11,744 Stars / 1,040 Forks / 206 open issues**——半年冲一万二的速度，在一类开源基础设施项目里属于现象级爆发。
它对以上两个痛点给出的回答是：
> **同一个引擎，三种形态**：桌面 App（solo 玩家）、自托管服务器（团队）、Openship Cloud（ Managed）。你想怎么部署都行，数据始终是你的。
---
## ⚡ 核心亮点：它真正值得写进个人工具箱的五个能力
### 1. **桌面 App：这是个"杀手锏"级的设计** 🔥
这是整篇评测我最想让你记住的一个点。
| | Openship Desktop | Vercel / Netlify | Coolify / Dokploy |
|---|---|---|---|
| 原生 Mac/Win/Linux App | ✅ | ❌ | ❌ |
| 控制面跑在哪 | **你自己的 Mac，App 打开时才运行** | 人家云里 | 需要一台一直开着的控制机 |
| 部署到 VPS 的方式 | **直接 SSH，服务器上不留任何东西** | 走他们云 | 装 agent/面板到目标机 |
**这意味着什么？** 你周末想把自己一个周末项目部署到一台 Hetzner 上，你不需要：
- 提前买一台"控制面服务器"
- 提前配置 Linux 用户、SSH Key、systemd
- 提前在服务器上装任何 agent / daemon
只需要：下载 `Openship-arm64.dmg`，打开，填一台 VPS 的 SSH 信息，拖一个本地文件夹或者 GitHub 仓库进去——**完事**。你的 Mac 关掉，网站还在跑（因为跑的是远端），控制面就暂时休眠。**对于一个独立开发者来说，这是把 Vercel 的"零心智负担"和自托管的"数据主权"同时拿到的唯一路径。**
用 Openship 自己的一句话概括这个设计哲学：
> *"A control plane runs on your machine only while the app is open — no extra box to keep alive just to deploy."*
### 2. **本地构建，SSH 直推——一个看似简单、却颠覆竞品的架构决策**
很多自托管 PaaS 的工作方式是：**把代码送到服务器上，服务器上跑 docker build**。这带来两个问题：
1. **生产机 CPU 打满**，正在跑的应用被拖慢
2. 服务器上需要大量磁盘来存构建缓存
Openship 反过来做：**构建发生在你的机器上（桌面 App 或控制面），产出一个 immutable 的版本化 artifact，然后像 `rsync` 一样通过 SSH 流式传到目标服务器**，以容器形式启动。生产服务器上**没有 agent，没有 daemon，没有面板，甚至不需要 Docker 以外的任何东西**。
**一个真实的对比场景**：你在 Hetzner 上有一台 2C2G 的小机器，跑着 5 个应用。用 Coolify 部署一个新版本，构建期间那台机器 CPU 飙到 100%，在线用户全部感到卡顿。用 Openship，**构建在你 Mac 上跑得飞快，传到服务器上只是 `docker start` 一个新容器**。这就是为什么 README 里写"production machines never build"。
### 3. **能"领养"已在运行的应用——迁移成本几乎为零**
这是所有同类工具都没做到、但迁移到 Openship 的用户最需要的能力：
> *"Point it at a server and it picks up the containers already running there. Nothing is rebuilt, nothing is restarted."*
举例：你之前用 `docker compose up` 起了一套东西，觉得运维太糙，想用图形面板。**Coolify / Dokploy / Heroku 的答案是"删了重来"**——它们必须接管端口、必须重建每个应用。**Openship 的答案是：指过去，把已经跑着的容器"认领"回来**，你既有的 nginx/Caddy/Traefik 也能继续共存，切换一步即可、随时可逆。甚至你哪天不用 Openship 了，`删除项目`也只是删掉它自己的记录——**容器、数据、配置继续在跑**，没有退出税。
**这是"零锁定"从一句口号，变成了一个可验证的工程行为。**
### 4. **42 个能力一把梭：数据库、邮件、CDN、边缘规则全部内建**
打开官网你能看到一整面墙的能力清单，我抽几个最实用、也是同类产品往往缺位或需要付费加购的：
- **内建 Postgres 14–17 / MySQL / MongoDB / Redis / S3 兼容对象存储**，PITR、每日备份、scheduled upgrades
- **真正的邮件服务器**（基于 iRedMail），一键配好 SPF / DKIM / DMARC / rDNS，发件走 SES 或自配 SMTP 中继 —— 你不再需要每月 20 刀给 SendGrid
- **OpenResty 边缘层**：每路由的 rate limit、国家/IP/UA 屏蔽、热链保护、Brotli、HTTP/3、CDN 缓存、即时 purge
- **内建访问日志与地理分布**（~1.4µs 每请求、零 DB 写入）—— 不用再装 Plausible 或 ELK
- **加密 Secrets Vault、审计日志、每资源粒度的权限**（默认 restricted-by-zero-permissions）
- **MCP Server**：Claude、Cursor 等 AI agent 可以直接作为工具调用部署能力
这个能力的密度，在 Apache-2.0 开源协议里是**罕见**的——通常你需要把 Coolify + Uptime Kuma + Grafana + Supabase + Postmark + Cloudflare 拼一整套才能对齐。
### 5. **DX（开发者体验）：从一行命令开始**
**部署一个新项目，就这么几行：**
```bash
# 1. 装 CLI（也提供桌面 App / 纯 docker-compose 两条路）
curl -fsSL https://get.openship.io | sh
# 2. 团队/服务器场景：交互式向导 + 装成 systemd 服务
openship                # 第一次运行，创建管理员 + 绑域名 + 装 boot service
openship up --public-url https://openship.example.com
# 3. 部署应用
cd your-project
openship init           # 关联这个目录
openship deploy         # 自动检测 stack、build、ship、route、issue TLS
```
如果你不想装任何东西，直接拉仓库跑裸 docker-compose 也行：
```bash
git clone https://github.com/oblien/openship.git && cd openship
cp .env.example .env && vim .env
docker compose --env-file .env -f docker/docker-compose.yml up -d
```
这条命令拉的是 `ghcr.io/oblien/*` 上**预构建好的镜像**，起来的是 `postgres + redis + api + dashboard + edge` 五个容器。**edge 是 OpenResty，以 `network_mode: host` 占据 :80/:443**，自动签 Let's Encrypt。
**部署配置也能"代码化"——`openship.json`**：
```json
{
  "name": "my-api",
  "build": { "command": "npm run build", "output": "dist" },
  "domains": ["api.mysite.com"],
  "services": {
    "postgres": { "version": 16, "backup": "daily" }
  },
  "env": { "NODE_ENV": "production" }
}
```
这个文件可以放进 repo、走 PR review——和 `vercel.json` / `netlify.toml` 是同一种理念，但在自托管世界里是少数。
---
## 🎯 目标人群与收益
**最适合的人**：
- **独立开发者 / Side-Project 党**：想要 Vercel 的爽感 + VPS 的价格 + 数据在你自己的机器上。**桌面 App 是为你量身定做的**。
- **小型创业团队**：需要在 Hetzner/DO/裸金属上跑东西，但不想养 DevOps。自托管 + Web 面板 + 团队/审计/权限全部免费。
- **AI Agent 工作者**：想让 Claude / Cursor 直接 `git push` 并 `deploy`。**MCP server + per-route 权限收敛**是首屈一指的。
- **从 Vercel/Railway 出逃的人**：邮件、数据库、CDN、监控、团队这些原来要叠加付费服务的能力，Openship 一次性给你了。
- **希望逐步迁移的存量玩家**：领养已运行容器的能力，让你可以一个应用一个应用地切，不用一把梭。
**不太适合的人**：
- 需要**全球化多区域边缘网络**（like Vercel Edge）的重型网站
- 需要**严格 SLA / 7×24 企业级支持**的严肃生产环境（可以买 Openship Cloud，但 $10/mo 定位仍偏早期）
- 团队只有非技术人员（目前**文档仍在填坑中**，README 原话："The docs are actively being filled out."）
---
## ⚔️ 竞品对比：Openship 到底站在哪一格？
这是最能体现其定位差异化的一张表（数据来自 Openship 官网 July 2026 对比 + 我交叉核实的信息）：
| 维度 | **Openship** | Vercel / Netlify | Coolify / Dokploy / Dokku | Heroku / Render |
|---|---|---|---|---|
| **协议** | Apache-2.0（内嵌 iRedMail 部分为 GPL） | 闭源 SaaS | AGPL/Apache 混合 | 闭源 |
| **部署形态** | **桌面 App / 自托管 / Cloud 三态** | 仅 Cloud | 仅自托管 | 仅 Cloud |
| **控制面跑哪** | 本地 Mac / 你的自托管机 / 他们的云 | 人家云 | **你自己一台"控制机"** | 人家云 |
| **生产机上装啥** | **Nothing（纯 SSH）** | N/A | agent / 面板 / Docker | buildpack |
| **构建在哪发生** | **本地 / 控制面（不在生产机）** | 他们云 | 生产机自己 | 他们云 |
| **能否领养已有容器** | ✅ **独有** | ❌ | ❌ | ❌ |
| **能否共存已有 nginx/Caddy** | ✅ 一步切换可逆 | N/A | ❌ 必须抢 :80/:443 | N/A |
| **删除项目后应用** | **继续运行，无退出税** | N/A | ❌ 一并拆除 | N/A |
| **内建邮件服务器** | ✅（iRedMail + SPF/DKIM/DMARC） | ❌ 需接 SendGrid | ❌ 需自装 | ❌ |
| **内建 CDN + 边缘规则** | ✅ | ✅（按量收费） | ❌ 手写 nginx | 部分 |
| **内建监控/访问分析** | ✅ 1.4µs/req | ✅（有配额） | ❌ 需接 Grafana | 部分 |
| **MCP / AI Agent 支持** | ✅ **一等公民** | ❌ | ❌ | ❌ |
| **配置即代码** | ✅ `openship.json` | ✅ `vercel.json` | 部分 | 部分 |
| **多节点集群** | 🔜 Coming Next | ✅ | 部分 | ✅ |
| **价格起点** | **自托管免费 / Cloud $10/月** | 免费层有限，数据库另计 | 免费 | $5/月起 dyno |
**我的三个判断**：
1. **对 Coolify / Dokploy 的威胁真实存在**。这两个项目的核心用户都是"想自托管但不想手写 nginx"的 VPS 党，Openship 在**部署体验、迁移成本、边缘能力**上都做到了压倒性优势，唯一没拿下的护城河是**社区规模和插件生态**——Coolify 目前有更大的 star 基数和中文社区。
2. **对 Vercel 不是替代，而是分流**。如果你的应用用到了 Vercel Edge Functions、Vercel AI SDK 的深度集成、ISR 等，别硬搬。Openship 更像"能自托管的 Railway + 更强的邮件/CDN 内建"。
3. **Desktop App 是"非线性"创新**。所有竞品都被困在"Web 面板 + 服务器"的框架里，没人想过"控制面可以装在开发者自己的电脑上"。这一点对独立开发者的吸引力，类似于 Cursor 之于 VS Code。
---
## ⚠️ 局限与不足：也要说实话
写完优点，必须把那些**官网不会主动告诉你、但会让你踩坑**的点摆在桌面上：
### 1. 项目太新，"production-ready"是官方自称，但坑还不少
206 个 open issue 对一个 11.7k Star 的项目来说**不算少**，官方 roadmap 里**多节点集群、负载均衡 UI、私有网络、高级监控、可视化 CI/CD 全部标记为 "Coming Next"**——这些都是团队级用户刚需，现在还没有。
### 2. Compose 模式的 edge 必须"独占" :80/:443（Linux）
`docker-compose.yml` 里的 `edge` 容器用了 `network_mode: host`，意味着**它会直接抢占宿主机的 80 和 443 端口**。如果你这台机器上已经跑着 Caddy / nginx / Traefik，必须先停掉，或者走"让 Openship 接管已有 proxy"的路径。而且这条路**只支持 Linux**，Mac / Windows 用 compose 会失败，得切到 `openship up --bare` 模式。
### 3. API 容器挂载 Docker Socket——安全模型要求你信任这台机器
README 原话："**run it only on a trusted host**"。因为 api 容器需要 Docker socket 来 build 和 run 应用，等于给了它宿主机的 root 级别能力。这在自托管 VPS 上是可接受的设计，但如果你习惯更严格的容器隔离（如 Kata、gVisor），需要重新评估。
### 4. 桌面 App 的"本地构建"模式依赖你的 Mac 开着
这是双刃剑的另一面：solo 场景下你不需额外服务器很爽，但**一旦你想走真正的 push-to-deploy（CI/CD、GitHub Webhook 触发），你必须有一台 always-on 的自托管服务器，或者用 Openship Cloud**。README 明确写了这一点。
### 5. 文档不完整，社区仍在早期
官方坦承："The docs are actively being filled out." 也就是说，**部分高级场景（多机部署、特殊 stack、监控告警）你可能需要读源码或进 Discord 问**。订阅者只有 30 人、贡献者集中——这意味着维护者响应快但 bus factor 偏低。
### 6. 许可证的"混搭"要留意
核心是 **Apache-2.0**（友好、可商用、闭源衍生也没问题），但**内嵌的 iRedMail 邮件引擎是 GPL**，被"打包进多个 control-plane 发行版"里。README 有专门一段解释"component and packaging inventory"和"outstanding upstream notice review"。**如果你是公司律师敏感型组织，发版前需要过一下法务。**
### 7. Cloud 版本太新，别把关键业务押上去
Openship Cloud 目前仅 **$10/月起步，含 Free tier**，作为产品还很稚嫩。把它当成"顺手用一用、做做 demo、跑跑内部工具"可以，当成"我这 SaaS 就靠它吃饭"为时尚早。
---
## 🎁 结语：我的终极评判与行动建议
**综合评价：★★★★☆（4.5 / 5）**
Openship 做了一件大多数开源基础设施项目都不敢做的事——**同时拿下"易用性"和"数据主权"两个常年对立的目标**，并且以 **Desktop App + 本地构建 + SSH 直推 + 零锁定** 这一套组合拳，在 Coolify / Dokploy / Vercel / Heroku 四方割据的市场里，切出了一块**此前没人认真服务过**的独立开发者/小团队阵地。
它不是完美的：文档还在填坑、多节点还在路上、edge 有端口强占、Cloud 太新。但它的**架构判断是对的**（本地构建、SSH 无 agent、领养式迁移、零退出税），**产品哲学是清晰的**（一个引擎、三种形态、AI-原生），**工程执行力在半年内得到了验证**（11.7k Star 就是市场投票）。
**分场景的行动建议**：
- 🧑‍💻 **你现在有一个 side project 想部署** → 直接下载桌面 App，买一台 Hetzner CX22（€4/月），15 分钟上线。
- 🏢 **你是 3–10 人技术团队** → 找一台 4C8G 的机器跑 `openship up --compose`，把团队/审计/权限功能用起来，慢慢迁。
- 🤖 **你想让 Claude Code / Cursor 帮你部署** → 开 MCP server，通过 per-route 权限限制 agent 只能操作特定 project——这是目前市面上最干净的"AI 运维"路径。
- 🚀 **你是 from Vercel/Railway 的重度逃亡者** → 先小项目试水，重点测试 Postgres 迁移和邮件（iRedMail）这套链路。
- ❌ **你想要 Vercel Edge Functions 级别的全球边缘计算** → 暂时别，等 roadmap 里的"multi-node clusters + load-balancing UI"落地再看。
> **如果 2026 年只关注一个开源 PaaS 项目，我会选 Openship。** 它不只是"另一个 Coolify"，它是一个**试图重新定义"部署这件事应该长什么样"的项目**——而这一点，值得你花一个周末亲自试一下。
---
*参考来源：[GitHub 仓库 oblien/openship](https://github.com/oblien/openship) · [GitHub API 仓库元数据](https://api.github.com/repos/oblien/openship) · [Openship 官网 & 能力/竞品对比页](https://openship.io) · [Hysen Labs 评测](https://hysenlabs.com)*
