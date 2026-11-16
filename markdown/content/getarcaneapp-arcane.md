# getarcaneapp/arcane

[GitHub URL](https://github.com/getarcaneapp/arcane)


## Arcane 深度评测：免费开源的现代 Docker 管理面板，Portainer 平替首选

> 一个用 Go + SvelteKit 打造的开源 Docker 管理面板，把 Portainer 付费版才有的 RBAC、OIDC、Trivy 扫描等功能全部免费开放。

- **Tags**: Docker, Portainer替代, 自托管, Homelab, 开源面板
- **Category**: 开发工具, 运维部署, 开源项目

## Details

# Arcane 深度评测：那个让 Portainer 用户"深夜逃逸"的现代 Docker 管理面板
> 调研截至 2026 年 11 月，基于 GitHub 主仓、官方文档、第三方评测与社区口碑的横向分析。
## 📌 一句话总结
**Arcane 是一个用 Go + SvelteKit 写的开源 Docker 管理面板，把 Portainer、Watchtower、Dockge、Diun 这几件事用一套统一 UI 干完了，并且把 RBAC、OIDC、Trivy 扫描、GitOps、Agent 远程管控这些 Portainer 要"订阅 Business Edition"才有的能力全部免费开放，是 2026 年 Homelab / 自托管圈最值得迁移的 Docker UI 之一。**
---
## 🌌 背景与痛点：Docker UI 的"三国志"
在 Arcane 出现之前，自托管圈子里 Docker 管理面板基本是"三国杀"格局：
- **Portainer CE**：功能最全、最成熟，但 UI 沉重（Angular 系老架构），并且这两年加速把 RBAC、OIDC、审计日志等关键能力关进 Business Edition 的付费墙，CE 用户在享受"卡点 3 节点免费"的边缘反复试探；
- **Dockge**：UI 干净，但只是个 Compose Stack 管理器，对 images / volumes / networks / 多主机基本"失明"，并且项目活跃度已经大不如前；
- **Komodo / Coolify**：偏 CI/CD 平台化，概念重，对只是想"看看容器、点点按钮、推个镜像"的 Homelab 用户来说有"用高射炮打蚊子"的感觉。
运维真实痛点是：**容器一多、主机一多，你就被迫在多个 SSH 终端、多个 Compose 文件、Watchtower 日志、Diun 通知、Portainer 慢 UI 之间反复横跳**——还得分心提防 Portainer 哪天又把某个功能划进付费区。
Arcane 的定位非常精准：**"UI 坐在 Docker Engine 之上"**，不做编排平台，不重新发明 Docker，只把你每天真的在做的事做得漂亮、轻、快。它恰好填补了"太重（Portainer）"和"太窄（Dockge）"之间的中间地带。
---
## ✨ 核心亮点：真正让用户"逃离 Portainer"的 6 件事
### 1. 一站式资源管理，不再是"半残 UI"
容器、镜像、卷、网络、Compose 项目、Swarm Stack、Build Workspace（直接在 UI 里 build 镜像）、卷备份——全部原生覆盖。这一点是 Dockge 用户切过来的最大原因，因为 Dockge 看不到 volume，看不到 network，看不到 image。
> 用户 u/BigB_117 在 r/selfhosted 上原话："修复了我对 Dockge 的两个主要抱怨（狭窄的 Compose 编辑器、看不到 networks / images / volumes）"。
### 2. 内置"Watchtower 杀手"——带依赖检查的 Cron 更新
Arcane 的容器更新机制是社区吹爆的功能：可以按 cron 调度自动拉取新镜像、重启容器，并且**支持依赖检查**（dependent services 自动跟着重启）、支持 lifecycle labels 钩子（pre-update / post-update）。
> 用户 u/zuus："cron job 容器更新带依赖检查是 chef's kiss，**再也不需要 Watchtower 了**"。
### 3. 免费 + 无节点数上限的 RBAC 与 OIDC
v2.0.0（2026 年 6 月）正式落地了完整 RBAC：
- **6 个内置角色**（Admin / Editor / No-Shell Editor / Deployer / Monitor / Viewer）
- 可克隆出**自定义角色**，权限粒度做到 `<resource>:<action>`（如 `containers:start`）
- 角色可**按环境分配**（同一用户在不同主机不同权限）
- **OIDC group claim 自动同步角色**——企业用户用 Keycloak / Authentik 接入即用，免费
这套东西在 Portainer 那里属于 Business Edition 的付费墙，而 Arcane 全开源送出，无节点数上限。
### 4. 真正可用的 GitOps
- 项目可直接挂 Git 仓库，**push 即自动 redeploy**
- Webhook 端点可被 Jenkins / Gitea Actions / GitHub Actions 触发，**构建完成后自动拉新镜像并重启**
- webhook 还能选择动作类型：`Update / Start / Stop / Redeploy / Restart`
> 用户 u/Prudent-Let-3959："他们暴露的 REST API 我已经用它给 homelab 搭了基于 gitea 的 CI/CD"。
### 5. 极轻的资源占用 + 真正的移动端体验
来自真实部署对比：Portainer 空闲 ~150 MB RAM，Arcane **~67 MB RAM**。同时它的 UI 是原生响应式设计，手机上看容器日志、点重启、看拓扑图，体验不打折——这在 Homelab 用户里是"睡前查一下服务挂没挂"的刚需。
### 6. 安全意识领先：从 Trivy 扫描到后量子签名
- 内置 **Trivy 镜像漏洞扫描**，cron 调度，按镜像存储结果，`trivyIgnoreUnfixed` 自动过滤无修复方案的 CVE
- 支持 **Docker Socket Proxy** 模式，避免裸挂 `/var/run/docker.sock`
- v2.10.0（2026 年 8 月）引入 **ML-DSA-87（NIST FIPS 204）后量子签名算法**，用于 session token、passkey、edge agent mTLS 证书——这在容器 UI 领域非常超前
- 镜像签名（cosign 公钥入库）、SBOM 公开可查、Cod Security policy / security scanning workflow 全套齐备
---
## 🏗️ 技术架构：为什么"快且轻"不是噱头
### 技术栈选型
| 层 | 选型 | 含义 |
|---|---|---|
| 后端 | **Go** + gorm + Huma REST API + SQLite (libtnb/sqlite，可切 Postgres) | 编译型语言，单二进制，启动 < 1 秒 |
| 前端 | **SvelteKit** + TypeScript + shadcn-svelte + CodeMirror 6 | 对比 Portainer 的 Angular 老架构，bundle 更小、响应更顺 |
| CLI | Go + Bubbletea / Lipgloss TUI | 可脱离浏览器做镜像更新检查、健康检查 |
| 部署 | 单容器（Manager）+ 可选轻量 Agent（远程主机） | Manager 监听 3552，Agent 监听 3553 |
| 架构支持 | amd64 / arm64 / **arm/v7 / riscv64** | 树莓派老款和 RISC-V 板子都能跑 |
四大镜像仓库同时发布到 ghcr.io、quay.io、Docker Hub。
### 架构示意（伪代码）
```
┌──────────────────────────────┐
│   Manager（中央 UI + API）    │
│  ┌────────────────────────┐  │
│  │ SvelteKit Frontend     │  │
│  │  ↓ REST/WS             │  │
│  │ Go Backend (Huma)      │  │
│  │  ↓ docker.sock / proxy │  │
│  │ Local Docker Engine    │  │
│  └────────────────────────┘  │
│  ENCRYPTION_KEY: 加密存储    │
│  ML-DSA-87: 签 session/cert  │
└────────────┬─────────────────┘
             │ mTLS（Agent 模式）
   ┌─────────┴─────────┐
   │   Agent 容器       │  ← 远程主机 1
   └───────────────────┘
   ┌───────────────────┐
   │   Agent 容器       │  ← 远程主机 2
   └───────────────────┘
```
> **比喻一下**：Manager 像是"机场塔台"，本地 Docker 像是"主跑道"，而每台远程主机上跑一个 Agent 相当于"分机场塔台"，通过加密频道向主塔台汇报；UI 就是你手里的"航显大屏"，所有跑道状态一屏看清。
---
## 🚀 Demo：3 分钟上手（可直接复制）
### 最小可用 Compose（单机版）
```yaml
services:
  arcane:
    image: ghcr.io/getarcaneapp/manager:latest
    container_name: arcane
    ports:
      - '3552:3552'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock   # 必挂：让 Arcane 控制 Docker
      - arcane-data:/app/data                        # 持久化数据库
      - /opt/docker:/opt/docker                      # 你的 Compose 项目根目录
    environment:
      - APP_URL=http://your-server-ip:3552
      - ENCRYPTION_KEY=<32 字节密钥>
      - PROJECTS_DIRECTORY=/opt/docker               # 路径必须 1:1 映射
      - PUID=1000
      - PGID=1000
    cgroup: host
    restart: unless-stopped
volumes:
  arcane-data:
```
### 生成密钥（一行命令）
```bash
echo "ENCRYPTION_KEY=$(openssl rand -hex 32)"
```
### 启动 & 默认凭据
```bash
docker compose up -d
# 访问 http://your-server-ip:3552
# 默认账号：arcane / arcane-admin（首次登录强制改密）
```
### 添加远程主机（Agent 模式）
在 UI 进入 `Environments → Add Environment`，填名字 + `http://remote-host:3553`，点 "Generate Agent Configuration"，UI 会给你三段可直接粘贴的 `docker run` / compose 配置和一次性 API Key（**只能复制一次**）。
官方还提供了 **Compose Generator** 可视化工具，勾选你要的功能，自动生成完整 compose.yaml。
---
## 🎯 目标人群与收益
| 你是谁 | 痛点 | Arcane 给你什么 |
|---|---|---|
| **Homelab 党**（Raspberry Pi / TrueNAS / 多台小主机） | 多主机 Compose 散落、Watchtower 黑盒更新、Portainer 卡 3 节点付费墙 | 一个面板管 N 台主机，Cron 更新带依赖检查，全部免费 |
| **自托管爱好者**（NAS / Homelab subreddit 用户） | 想要好看的 UI + 不浪费资源 | 67 MB RAM + 原生 dark theme + 移动端可用 |
| **中小团队运维** | CE 没有 OIDC/RBAC，BE 又贵 | 免费 RBAC（6 角色 + 自定义）+ OIDC 群组映射 + 审计 |
| **CI/CD 工程师** | 构建完成后要手动 redeploy | Webhook + GitOps 自动同步，把 Jenkins / Gitea Actions 直接接上 |
| **安全敏感用户** | 想知道自家镜像有没有 CVE | 内置 Trivy 周期扫描，UI 直接看漏洞列表 |
| **不用 Dockge 但嫌 Portainer 重** | 想要"刚好够用"的中间态 | Arcane 正好是这个 sweet spot |
---
## ⚔️ 竞品对比：横向硬碰硬
| 维度 | **Arcane** | **Portainer CE / BE** | **Dockge** | **Komodo** |
|---|---|---|---|---|
| 技术栈 | Go + SvelteKit | Go + Angular | Node.js + EJS | Go + TypeScript |
| Compose 管理 | ✅ 完整 + lint | ✅ 完整 | ✅ 核心 | ✅ 完整 |
| Images / Volumes / Networks | ✅ 完整 | ✅ 完整 | ❌ 有限 | ✅ |
| Docker Swarm | ✅ | ✅ | ❌ | ❌ |
| RBAC | ✅ **免费不限节点**（6 角色+自定义） | ❌ CE 仅基础 / ✅ BE 付费 | ❌ | ✅ |
| OIDC SSO | ✅ 免费 | ❌ CE 无 / ✅ BE | ❌ | ✅ |
| Agent 远程主机 | ✅ 免费 | ✅ BE | ❌ | ✅ |
| Trivy 漏洞扫描 | ✅ 内置 | ❌ | ❌ | 部分 |
| GitOps 自动部署 | ✅ | ✅（BE 高级版） | ❌ | ✅ |
| Watchtower 替代（带依赖检查） | ✅ 内置 | 部分 | ❌ | ✅ |
| Webhook 触发 redeploy | ✅ | 部分 | ❌ | ✅ |
| 内存占用（空闲） | ~67 MB | ~150 MB | ~50 MB | 中等 |
| 许可证 | **BSD-3-Clause（无节点墙）** | CE: Zlib / BE: 商业 | MIT | AGPL |
| 成熟度 | ⭐⭐⭐ 8.2k stars，2025 末快速崛起 | ⭐⭐⭐⭐⭐ 老牌王者 | ⭐⭐⭐ | ⭐⭐⭐ |
| 最适合 | Homelab + 中小团队 | 企业 / 多编排（K8s） | 纯 Compose 极简党 | CI/CD 平台化团队 |
参考来源。
**核心判断**：如果你的 Docker 节点 ≥ 4，Portainer BE 开始收费，Arcane 几乎是免费 + 功能完整度的最优解；如果节点 ≤ 3 且不打算付钱，Portainer BE "Take 3" 免费版其实更成熟，Arcane 的"免费优势"就没那么绝对。
---
## ⚠️ 局限与风险：年轻项目的代价
写评测不能只唱赞歌，下面是 2026 年公开记录里 Arcane 真实踩过的坑——**这也是它的年轻的一面**：
### 1. 安全事故史（值得拉响警报）
- **CVE-2026-23520（Critical，2026-01 修复）**：updater service 的 lifecycle labels 未过滤直接 `sh -c` 执行，**任何已认证用户**可注入恶意命令，等管理员触发更新时升级到特权 RCE，1.13.0 修复。
- **CVE-2026-42461（2026-05）**：`/api/templates*` 四个 GET 端点未做鉴权，**未认证攻击者可读取所有自定义模板里的真实 .env 内容**（包括数据库密码、API key）。
- **GHSA-7h26-hg47-p9hx（2026-05）**：Git 模板 / 变量相关 9 个 REST 端点缺少管理员授权。
> **结论**：三个月内连发三条安全公告，说明**快速迭代挤压了代码审计时间**。**强烈建议关闭公网访问、放在 reverse proxy 后面、紧跟版本升级**。
### 2. 稳定性事故
- **GitOps 磁盘耗尽 bug（v2.8.0 / v2.9.0）**：GitOps sync 泄漏 clone 目录，每天堆积 ~1000 个 / ~9 GB，6 天吃掉 40 GB 后 SQLite 写入失败、manager 进入 389 次重启循环，v2.10.0 修复。
- **v2.7.0 改变了 Compose 变量解析作用域**：旧部署如果依赖"从 Manager 容器环境变量继承"的隐式行为，**升级后会静默失效**，要提前审计。
### 3. 功能缺口
- **LDAP 不支持**（仅 OIDC）
- **Portainer 栈无直接迁移工具**：v2.10.0 加了实验性 "Convert to Compose"，但官方社区明确说"先备份、再删容器、再重建"，本质是手工迁移
- 企业级 audit log / Syslog export 没有
### 4. 心智负担
- **功能更新太频繁**：v2.9 → v2.10 不到 2 周，feature 列表几乎每月变，第三方教程还没发出来就已经过时
- **术语陷阱**：Portainer 叫 Stack，Arcane 叫 Project，迁移文档容易搞混
- **`ENCRYPTION_KEY` 仍带 dev 默认值**，忘了改等于裸奔
### 5. 一个隐性的现实
**核心贡献者极其集中**：翻 2026 年 v2.3 → v2.4 的 changelog，几乎每个 commit 都署名 `@kmendell`。Bus Factor = 1 的项目再火，也存在"作者不维护了怎么办"的潜在风险。
---
## 💡 行动建议：怎么用它最划算
### 推荐指数：⭐⭐⭐⭐（4/5）
**扣一星是因为它还很年轻**——feature 完整度已经是 Homelab 顶配，但安全 patch 节奏和稳定性还没经过足够时间的洗礼。
### 三种典型用法
1. **🟢 安全尝鲜（推荐所有 Homelab 用户）**
   在内网 / VPN 后面跑起来，导入 1-2 个非关键服务（如 Homepage、Grafana），跑两周观察资源占用、UI 体验、更新 cron 是否稳定。  
   *必做*：改默认密码、把 `ENCRYPTION_KEY` 设为 32 字节随机值、`APP_URL` 写成实际访问的 HTTPS 域名。
2. **🟡 平替迁移（Portainer 用户）**
   **建议等至少 2-3 个 minor 版本稳定再迁**。迁移前：备份卷 → 在 Arcane 中先重建一个"小副本"验证 → 再切主流量。  
   *踩坑预警*：v2.7+ 的 Compose 变量作用域变化、Portainer Stack → Arcane Project 术语换算、要写 `PUID/PGID`。
3. **🔴 企业生产（暂缓）**
   等 audit log、LDAP、更长的安全记录沉淀。如果你硬要上，至少做到：socket proxy 模式 + 不暴露公网 + **订阅 release 通知**（CVE 一出就要立即升级）。
### 上手最佳路径
1. **先看官方 Compose Generator**（https://getarcane.app）——别自己手写，配置完点"Generate"直接拿到 yaml
2. **跑通单机** → 体验 Cron 更新 + Trivy 扫描 → 加一台远程 Agent 体验多主机 → 最后再上 GitOps / Webhook
3. **订阅 GitHub Release 通知**，每个 minor 升级前看一眼 changelog（特别关注 `Bug fixes` 区块）
<details>
<summary><b>📖 FAQ：几个常被问到的问题</b></summary>
- **Q：能替代 Kubernetes 管理吗？** 不能，Arcane 只管 Docker 和 Docker Swarm，不碰 K8s。
- **Q：Watchtower 能下岗吗？** 大概率可以——Cron 更新 + 依赖检查 + lifecycle labels 已经覆盖 Watchtower 的核心场景。
- **Q：跑在 Windows / macOS？** 官方镜像只支持 Linux 容器（amd64/arm64/armv7/riscv64），但 Docker Desktop for Win/Mac 也能跑 Linux 容器。
- **Q：商用？** BSD-3-Clause，可以商用，没有 Portainer 那种节点墙。
- **Q：要不要挂 docker.sock？** 推荐用 **Socket Proxy**（tecnativa/docker-socket-proxy）替代直接挂载，SELinux 主机尤其推荐。
</details>
---
## 🎬 结语
Arcane 不是"另一个 Docker UI"，它是对 2026 年 Docker 用户体验的一次**精准反思**：把 Portainer 因商业逻辑被锁进付费墙的能力（RBAC / OIDC / Trivy / GitOps / Agent）重新还给社区，把 Watchtower、Diun、Dockge 这些"小工具"整合到一个有品味的 UI 里，并且用 Go + SvelteKit 把性能做轻到 67 MB RAM。
它最大的敌人不是 Portainer，而是**自己的年轻**：三个月三条 CVE、GitOps 磁盘泄漏事故、bus factor = 1——每一项都提示你：**用，但别盲信**。
如果你是 Homelab 党，**今晚就可以挂到 reverse proxy 后面试试**；如果你是企业运维，把它放进观察名单，半年后再回来看安全记录。
