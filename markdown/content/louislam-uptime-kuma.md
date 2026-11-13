# louislam/uptime-kuma

[GitHub URL](https://github.com/louislam/uptime-kuma)


## Uptime Kuma 深度评测：91k Star 的开源自托管监控神器

> 一个开源免费的自托管可用性监控工具，一条 Docker 命令就能拥有媲美 UptimeRobot 的监控面板与状态页。

- **Tags**: Uptime Kuma, 自托管, 开源监控, Docker, 可用性监控
- **Category**: 开发工具, 运维监控, 开源项目

## Details

# Uptime Kuma 深度评测：那只用「米色小土豆」 icon 闯出 91k Star 的自托管监控小怪兽
> **一句话总结**：Uptime Kuma 是一款用 Vue 3 + Node.js 写成的开源（MIT 协议）自托管可用性监控工具，凭借一个 Docker 命令就能让任何人在 15 分钟内拥有「UptimeRobot 级别」的监控面板和状态页——它在 GitHub 拿下约 9.1 万颗 Star、位列 GitHub 全站 Star 排名第 242 位，是「自托管监控」赛道当之无愧的顶流。
---
## 一、背景与痛点：监控这件事，为什么必须自己掌控？
想象一下你的网站、API、NAS、树莓派上的 Home Assistant、Docker 容器……它们就像你店里的一排货架，而 Uptime Kuma 的角色就是**店门口那个 7×24 小时盯着货架的看门大爷**——货架上少了一瓶酱油，他立刻掏出手机给你发 Telegram 消息。
在你决定要不要雇这位大爷之前，先看看行业里其他选手的报价：
- **UptimeRobot / Pingdom / Datadog**：开箱即用，但免费版只能监控 50 个目标、间隔 5 分钟；想加密频率、加成员、加状态页，钱像水一样流出去。
- **Statping**：曾经最接近理想的自托管方案，可惜作者弃坑、不再维护，bug 一堆。这正是作者 louislam 亲口承认的「动机」：*"I was looking for a self-hosted monitoring tool like 'Uptime Robot', but it is hard to find a suitable one. One of the closest ones is statping. Unfortunately, it is not stable and no longer maintained."*
- **Zabbix / Prometheus**：企业级王者，但配置文件厚得像字典，对个人开发者来说是「杀鸡用牛刀」。
**于是 louislam——一位来自香港的独立开发者——决定自己造一个**：用 Vue 3 + Vite 练手前端，用 WebSocket 替代 REST API 做实时刷新，顺手把自己第一张 Docker 镜像推上 Docker Hub。这是一个典型「为了学技术顺手解决自己痛点」的项目，却意外踩中了自托管社区最大的空白。
---
## 二、核心亮点：它凭什么能从万军丛中杀出来？
### 1. 监控协议覆盖广得离谱（31 种类型）
按  的横向对比，Uptime Kuma 一共支持 **31 种监控类型**，覆盖度在所有自托管工具里名列前茅。
| 监控类型 | 通俗理解 | 典型用途 |
|---|---|---|
| HTTP(s) | 网页能不能打开 | 网站、REST API |
| HTTP(s) - Keyword | 页面里有没有特定关键字 | 探测「服务是否真的在跑」而不是只看 200 |
| HTTP(s) - JSON Query | 解析 JSON 路径 | 监控某些返回 JSON 的接口状态字段 |
| TCP Port | 端口通不通 | 数据库、Redis、MQTT、游戏服务器 |
| Ping (ICMP) | 主机活没活 | 路由器、NAS、内网设备 |
| DNS Record | 域名解析对不对 | 检测 DNS 劫持、解析漂移 |
| Push（心跳） | 让被监控方主动汇报 | 监控 cron 任务、备份脚本是否按时跑 |
| Docker Container | 容器健康状态 | 监控同宿主机上的容器 |
| WebSocket / Steam / MQTT 等 | 特殊协议 | 边缘但 occasionally 必备 |
### 2. 90+ 通知渠道，几乎是「报警宇宙」的全集
底层靠 **Apprise** 这个通知聚合库，Uptime Kuma 一次接入就解锁了 Telegram、Discord、Slack、Gotify、Pushover、SMTP 邮件、Microsoft Teams、Webhook、AWS SNS、Signal、Line、飞书、钉钉……总共 90+ 个渠道。 这意味着你几乎不会遇到「这工具不支持我想用的 IM」的尴尬。
### 3. 全 WebSocket 驱动的「活的面板」
这是它最容易被忽视、也最体现作者设计哲学的地方。绝大多数监控面板是「轮询」——浏览器每几秒问一次服务器「有新数据吗？」。而 Uptime Kuma 用 **Socket.IO 把数据主动推到浏览器**，所以你看到的响应时间曲线是**实时跳动**的，不是每 5 秒刷新一次。Kalvad 博客的原话是 *"Fully websocket based, so some nice real-time feedback"*。
> **金句锚点**：把 UptimeRobot 想成「每小时给你拍一张照片」，Uptime Kuma 则是「给你装了一台直播摄像头」。
### 4. 默认 SQLite + 可切 MariaDB，部署即「零运维数据库」
v1 默认用 **SQLite（better-sqlite3）**——这是一个文件型数据库，数据就是一个 `.db` 文件，备份 = 拷贝这个文件，迁移 = 把文件搬到新机器。这对个人用户是巨大的福音。
到了 **v2**，作者加入了 **MariaDB 支持**，并提供了 rootless Docker 镜像，给了想要集群化、高可用的进阶用户一条升级路径。
### 5. 状态页 + 证书监控 + 2FA，一站式不阉割
- **多个状态页**：可以给不同的客户/项目挂不同的 status page，甚至把状态页映射到不同域名。
- **SSL 证书监控**：提前提醒证书要过期了。
- **2FA 双因素认证**：暴露到公网也安全。
- **代理支持**：监控可以走 socks/http 代理，方便穿透内网。
---
## 三、技术架构：一个「精简但克制」的全栈样本
从源码层面看，Uptime Kuma 是一个**经典的 7 组件全栈架构**：
```
┌────────────────────┐         ┌──────────────────────┐
│  Vue 3 + Vite      │◄─Socket─►  Node.js + Express   │
│  (Bootstrap 5 UI)  │   .IO   │  (调度 + 监控 worker) │
└────────────────────┘         └──────────┬───────────┘
                                          │
                            ┌─────────────▼─────────────┐
                            │  SQLite / MariaDB         │
                            │  + Apprise 通知适配层     │
                            └───────────────────────────┘
```
- **前端**：Vue 3 + Vite + Bootstrap 5，单页应用，所有 UI 状态通过 Socket.IO 同步。
- **后端**：Node.js + Express 充当「HTTP 门面」，Socket.IO 充当「实时数据总线」，每个 monitor 是一个独立 worker。
- **数据层**：v1 默认 SQLite（better-sqlite3 单连接）；v2 起可选 MariaDB。心跳数据在 v2 做了聚合优化，避免长期运行数据爆炸。
- **通知层**：基于 Apprise 抽象出统一的通知接口，新加渠道只要在 UI 里填 key 即可。
**架构取舍的精妙之处**：作者刻意**没有**用 Prometheus + Grafana 那套时序数据库 + exporter 的重型方案，而是「单文件数据库 + 单进程 Node.js」的极简路线。代价是**没法横向扩展、没法多副本**，好处是 **RAM 占用通常在 100–300 MB**，5 美元的 VPS 就能跑。
---
## 四、上手门槛与部署体验：一行命令的诱惑
### Docker 一键部署（最推荐）
```bash
mkdir uptime-kuma && cd uptime-kuma
curl -o compose.yaml https://raw.githubusercontent.com/louislam/uptime-kuma/master/compose.yaml
docker compose up -d
```
或者更短的 `docker run` 版本：
```bash
docker run -d --restart=always \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  --name uptime-kuma \
  louislam/uptime-kuma:2
```
打开 `http://localhost:3001`，注册账号 → 添加监控 → 选通知渠道 → 完成。**整个过程 5 分钟内能跑通**，从 GitHub README 的安装指南措辞也能看出作者对小白非常友好。
### 反向代理注意点（重点避坑）
Uptime Kuma **全靠 WebSocket**，所以挂 Nginx 反代时**必须额外加 Upgrade / Connection 头**，否则登录后会卡在无限刷新：
```nginx
location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```
### 添加一个监控项的最小配置（YAML 不存在，UI 操作）
Uptime Kuma **没有 YAML 配置文件**——一切都在 Web UI 里点击完成。它的「配置示例」实际上是 UI 截图，这一点和 Gatus（YAML-first）形成了鲜明对比。
添加一个 HTTP 监控只需填 5 个字段：
| 字段 | 示例值 |
|---|---|
| Friendly Name | 我的主页 |
| URL | https://example.com |
| Heartbeat Interval | 60（秒） |
| Retries | 3 |
| Accepted Status Codes | 200-299 |
---
## 五、社区活跃度与生命力：从「个人项目」长成「GitHub 顶流」
- **Star 数**：约 91k（2026 年），位居 GitHub 全站 Star 排名第 242 位，作者本人也因此跻身 GitHub 排名前 200。
- **版本节奏**：从 v1 到 v2 经历了一次大迁移（聚合心跳数据、引入 MariaDB、rootless 镜像），官方 wiki 用了相当「洁癖」的措辞强调 **"Backup your data directory. Again. And again."**——能看出维护者对数据安全的敬畏。
- **Issue 健康**：截至近期大约 **662 个 open issue**，其中不少是高赞的功能请求（如 REST API、多地域探测），反映社区旺盛但也反映出作者一个人扛不太动。
- **周边生态**：官方 wiki 维护了一份第三方 App 列表（手机客户端、Home Assistant 集成、Terraform provider 等都有社区贡献）。
- **赞助**：Atlas Cloud 每月赞助 400 美元，加上 GitHub Sponsors / Open Collective 的个人赞助，作者能把业余项目当半个主业养。
> **金句锚点**：Uptime Kuma 是那种「一个人 + 一个社区」抗衡商业 SaaS 的典范，但它同时也暴露了 bus factor = 1 的隐患。
---
## 六、目标人群与收益：它到底为谁解决什么痛点？
| 你的画像 | Uptime Kuma 能为你带来什么 | 不太适合你的信号 |
|---|---|---|
| **Homelab 玩家 / 自托管爱好者** | 用一台旧电脑或树莓派监控全家桶（NAS、Home Assistant、Pi-hole、Jellyfin） | 已经有完整 Prometheus + Grafana 栈 |
| **独立开发者 / 小团队** | 给自己的 SaaS、API、官网配一个体面的状态页，成本 ≈ 一台 5 美元 VPS | 需要 multi-region 探测、需要 SLO/SLA 报表 |
| **中小企业的运维** | 替代昂贵的 UptimeRobot 付费版，省下每月几十到几百美元 | 已经买了 Datadog / Better Stack |
| **外包/乙方公司** | 给每个客户开独立状态页、独立通知渠道，看起来「很专业」 | 需要把监控数据入仓做长期分析 |
| **企业级运维** | **不推荐**作为主力，可作为「外网拨测」的轻量补充 | 需要 Agent 内网监控、需要告警值班轮班 |
**最实在的收益**：以一个监控 20 个站点的团队为例，从 UptimeRobot Pro（约 $24/月）切到 Uptime Kuma + 一台 $5 VPS，**每年能省 230 美元左右**，而且数据完全在自己手里。
---
## 七、竞品对比：在监控光谱里，它站在哪个位置？
把「自托管 ↔ SaaS」「轻量 ↔ 重量」作为两根轴，Uptime Kuma 的位置非常清晰：**自托管 + 轻量**那一格的王者。
| 工具 | 部署方式 | 协议广度 | 多地域探测 | 配置方式 | 适合人群 |
|---|---|---|---|---|---|
| **Uptime Kuma** | 自托管（Docker） | 31 种 | ❌（单点） | Web UI | 个人、Homelab、小团队 |
| **Gatus** | 自托管 | 11 种 | ❌ | **YAML as Code** | DevOps、GitOps 派 |
| **UptimeRobot** | SaaS | HTTP/TCP/Keyword 等 | ✅ 多 region | Web UI | 想零运维的小团队 |
| **Better Stack** | SaaS | + 日志、RUM、遥测 | ✅ 多 region | Web UI + API | 中型团队、需要 On-call |
| **Zabbix** | 自托管 | Agent 内网 + SNMP | ✅ | Web UI（复杂） | 企业传统运维 |
| **Prometheus Blackbox** | 自托管 | HTTP/TCP/ICMP 等 | 需自建多实例 | prometheus.yml | 已有 Prometheus 栈 |
| **openstatus** | SaaS/自托管 | HTTP/TCP/DNS | ✅ 28 region | Terraform + UI | 想要「managed Kuma」的团队 |
数据综合自 、、。
**一句话定位**：
- 要 **UI 漂亮、零配置文件、开箱即用** → Uptime Kuma
- 要 **配置文件进 Git、DevOps 友好** → Gatus
- 要 **省心、多地域、有 SLA** → UptimeRobot / Better Stack
- 要 **跟 Prometheus 联动** → Blackbox Exporter
- 要 **企业内网 Agent 监控** → Zabbix
---
## 八、局限与不足：作者没告诉你的那些「但是」
### 1. 监控端本身是单点故障（最致命）
这是 openstatus 博客里一句话戳破的痛点：*"If the box running Uptime Kuma goes down, your monitoring goes down with it."* 监控器自己睡着了，谁来叫醒监控器？
**应对方案**：
- 用 **UptimeRobot 免费版** 反向监控你的 Uptime Kuma 本身（belt-and-braces 模式）。
- 或者用 **Gatus + 第二台异地域服务器** 做主备。
### 2. 只有单一探测点，无法区分「全局宕机」还是「你家网络抖动」
Kuma 的所有探测都来自**你那一台服务器所在的机房/家庭网络**。如果你的服务器在境外、但用户主要在国内，那「境外能访问 ≠ 国内能访问」。想要多地域探测，得手动部署多台 Kuma 实例再用主从同步，复杂度陡增。
### 3. **没有正式 REST API**
这是社区抱怨最多的一条。意味着你想做「监控 as Code」、用 Terraform 管理、或对接内部 CMDB，都要靠「配置快照导出 JSON」这种半官方手段。
### 4. SQLite 在生产环境的「成长的烦恼」
SQLite 没有托管服务，云上持久卷（如 EBS、云盘）配 SQLite 的写入性能会打折扣。Kalvad 博客专门写了用 **Litestream** 做实时备份才能上生产的方案。 v2 引入 MariaDB 缓解了这一点，但也意味着部署复杂度提升。
### 5. v1 → v2 迁移要小心
官方 Wiki 在迁移文档里把「备份」重复了三遍，并且警告：**迁移可能耗时几分钟到几小时**（20 个监控 + 90 天数据 ≈ 7 分钟），中途断掉必须从备份恢复重来。
### 6. 没有告警值班轮班
Uptime Kuma 的告警是「广播」式的——它会把通知同时推给所有渠道，但**不支持「先通知张三，10 分钟没人认领再通知李四」**的 on-call escalation。这是它和 Better Stack、PagerDuty 类产品的核心差距。
---
## 九、避坑指南：老用户的实战经验
1. **数据卷必须挂本地盘**，NFS 等网络文件系统官方明确不支持（README 红字警告）。
2. **必须做定期备份**：最简单的就是 `sqlite3 data/kuma.db ".backup '/backup/kuma-$(date +%F).db'"` 加一个 cron。
3. **挂公网务必配 HTTPS + 2FA**，并限制 `-p 127.0.0.1:3001:3001`，只让反代访问。
4. **Nginx 反代一定要加 WebSocket 头**（`Upgrade` + `Connection`），否则会一直转圈。
5. **心跳间隔别全设 20 秒**：监控目标多了之后，会显著增加数据库体积和目标服务器负担；一般网站 60 秒足够。
6. **想上生产前先在 GitHub Release 看 Beta 标签**，beta 镜像（`louislam/uptime-kuma:beta`）稳定性较差。
7. **Push 类型监控**记得让脚本设置合理超时，否则脚本 hang 住会触发假告警。
8. **升级前必看 Wiki 的 Migration Guide**，v1→v2 有 breaking change（如 badge 端点的 `:duration` 参数含义变了）。
---
## 十、结语与行动建议：终极评判
> **Uptime Kuma 是过去五年自托管社区最成功的「小而美」项目之一。** 它没有 Prometheus 的野心，没有 Zabbix 的复杂度，却精准切中了「个人开发者 & 小团队需要一个不丑、不贵、不烦人的可用性监控」这个空白生态位。
**给你的最终建议**：
- ✅ **如果你是个人开发者、Homelab 玩家、独立 SaaS 作者、小型乙方团队** → **现在就部署它**。一行 docker 命令，15 分钟见效，几乎零成本。
- ⚠️ **如果你是中型团队** → 用它做「外部拨测 + 状态页」，但告警值班和日志分析交给 Better Stack 或 PagerDuty。
- ❌ **如果你是大型企业** → 它可以作为补充，但绝不要作为唯一监控。
**三步上手路径**：
1. 在 VPS 上 `docker run` 拉起实例（5 分钟）。
2. 添加 5–10 个最重要的 HTTP 监控，配 Telegram 通知（5 分钟）。
3. 建一个公共状态页挂到 status.你的域名.com，再回 UptimeRobot 注册一个免费 monitor 反向监控 Kuma 本身（10 分钟）。
完成这三步，你就拥有了一套**比 90% 的同行更专业的可用性监控体系**，而总成本不到一杯奶茶/月。这，就是开源的魅力。
