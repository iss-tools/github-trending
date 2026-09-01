# iv-org/invidious

[GitHub URL](https://github.com/iv-org/invidious)


## Invidious 深度评测：去广告、无追踪的开源 YouTube 替代品

> 无需 Google 账号、无广告追踪的开源 YouTube 前端，支持 API 调用与自建服务。

- **Tags**: YouTube, 隐私保护, 开源, 自托管, API
- **Category**: 开源项目, 隐私工具, 视频工具

## Details

# Invidious（iv-org/invidious）深度评测：给你一个“干净”的 YouTube
---
## 一句话总结
Invidious 是一个不依赖官方 YouTube API、无广告、无跟踪、可自托管的 YouTube 替代前端（AGPLv3），既能让你在浏览器里“干净地看片”，又能通过 API 做第三方集成与自动化，但受制于 YouTube 频繁变更与公共实例的维护压力，更适合“自建+小众使用”。
---
## 背景与痛点：为什么需要另一个“YouTube”？
- 生态困境：YouTube 几乎垄断了长视频内容，但其页面大量脚本、广告、推荐算法和账号体系会带来隐私与干扰。即便登录谷歌账号，跨设备同步订阅也并不灵活。
- 技术路径：在官方 API 日趋严控的背景下，Invidious 选择完全“绕开官方 API”，通过解析 YouTube 的网页/内层协议获取数据，配合 PostgreSQL 存储订阅与配置，形成“前端+代理+数据库”的闭环。这种做法让它更难被封杀，但也导致每次 YouTube 改动都可能引发兼容性问题。
- 历史与治理：项目最早由 Omar Roth 创建并维护；2020 年作者宣布暂停开源维护后，项目移交至 iv-org 组织继续推进。这一转变让项目在“治理”层面更具组织化，社区也逐步形成文档体系和公共实例规范。
---
## 核心亮点与功能剖析
### 1) 零广告、零跟踪、零 JS（可选项）
- 无广告、无跟踪：默认页面不插入广告，不做行为跟踪，适合对隐私敏感的用户。
- 无 JavaScript 亦可播放：这是很多同类方案做不到的一点。即使你在浏览器中禁用 JS，依然可以播放视频（使用基础播放器界面）。
### 2) 订阅与“账号”体系完全独立于 Google
- 你不需要 Google 账号即可在 Invidious 上建立订阅列表、播放记录、偏好设置。
- 支持从 YouTube、NewPipe、FreeTube 导入订阅，也能导出给 NewPipe/FreeTube；还支持导入/导出用户数据，便于迁移与备份。
### 3) 隐私友好的高级播放与界面
- 音频-only 模式：在移动端可后台播放音频，适合“听播客”类使用。
- 主题与首页：支持明暗主题，可自定义首页布局；支持 Reddit 评论作为评论源的替代方案。
- 嵌入与参数：可嵌入到第三方网页，并提供丰富的 URL 参数（如画质、自动播放、循环等），便于自定义分享与控制。
### 4) 开发者 API 与生态集成
- REST 风格的 API：涵盖统计、视频、频道、搜索、字幕、趋势等，返回 JSON，非常适合做自动化、数据分析或第三方前端调用。
- “Companion”信号辅助服务：为了应对 YouTube 对签名/播放验证的升级，官方将“获取视频流”的职责拆分到 invidious-companion 这个独立服务，并用 Deno 实现；主服务通过配置指向 companion 即可。设计上便于“失效时不影响整体服务稳定”，只需升级或轮换 companion。
### 5) 公共实例规范与多样性
- 官方文档维护了一份“可信公共实例列表”，并有明确的准入与运营规则（如必须开启统计、90% 可用性、不能限区、不能插广告、必须开启 IP 轮换等），帮助用户选择可信节点，也提醒风险。
---
## 技术栈与架构解析（面向开发者）
- 后端语言：Crystal（性能接近 Go/Rust，开发体验像 Ruby，适合 IO 密集与高并发）。
- Web 框架：Kemal（Crystal 轻量级 HTTP 框架），代码组织清晰，便于扩展端点与中间件。（来自仓库与文档的使用习惯，未直接展示页内）
- 数据存储：PostgreSQL（存储用户、订阅、历史、配置等）。
- 代理/流获取：invidious-companion（Deno 实现）负责与 YouTube 交互获取播放流等敏感能力；主服务通过内部 HTTP 调用访问 companion。
- 不使用官方 API：通过解析/模拟请求方式获取数据，避免配额与账号限制，但也需要持续适配 YouTube 的变动。
架构就像“带私有代理的前端 + API 服务网关 + 会员数据库”，使得用户无需登录谷歌，也能享受订阅、历史和推荐（通过 API 获取 trending/popular）。
---
## 上手门槛与部署体验
### 资源需求
- 官方建议：至少 20GB 磁盘、2GB RAM（并需要定期重启）。公共实例建议至少 60GB 磁盘、4GB RAM、2 vCPU，并配备较好的出口带宽。
### Docker 一键部署（推荐）
- 官方 docker-compose 示例：使用 Quay 镜像（quay.io/invidious/invidious:latest），搭配 PostgreSQL 14 与 companion 服务；示例已给出内网端口映射与健康检查，适合生产环境反向代理场景。
最小化 docker-compose.yml 示例（基于官方文档节选）：
```yaml
services:
  invidious:
    image: quay.io/invidious/invidious:latest
    restart: unless-stopped
    ports:
      - "127.0.0.1:3000:3000"
    environment:
      INVIDIOUS_CONFIG: |
        db:
          dbname: invidious
          user: kemal
          password: kemal
          host: invidious-db
          port: 5432
        check_tables: true
        invidious_companion:
          - private_url: "http://companion:8282/companion"
        hmac_key: "CHANGE_ME!!"
        invidious_companion_key: "CHANGE_ME!!"
    depends_on:
      - invidious-db
  companion:
    image: quay.io/invidious/invidious-companion:latest
    restart: unless-stopped
    environment:
      - SERVER_SECRET_KEY=CHANGE_ME!!SAME_AS_INVIDIOUS_COMPANION_SECRET_KEY_FROM_INVIDIOUS_CONFIG
    volumes:
      - companioncache:/var/tmp/youtubei.js:rw
  invidious-db:
    image: docker.io/library/postgres:14
    restart: unless-stopped
    volumes:
      - postgresdata:/var/lib/postgresql/data
      - ./config/sql:/config/sql
      - ./docker/init-invidious-db.sh:/docker-entrypoint-initdb.d/init-invidious-db.sh
    environment:
      POSTGRES_DB: invidious
      POSTGRES_USER: kemal
      POSTGRES_PASSWORD: kemal
volumes:
  postgresdata:
  companioncache:
```
启动：
```bash
docker compose up -d
```
详见官方安装文档（含数据库初始化与后置配置）。
### 手动/源码部署（Linux）
- 依赖 Crystal（支持 1.14.x–1.19.x）、PostgreSQL、系统级字体、库文件等；文档给出了 Debian/Ubuntu、RHEL 系与 Arch 的包安装命令。
- 步骤包括：创建 invidious 用户、克隆仓库、make 编译、配置 config/config.yml、执行数据库迁移、配置 systemd 服务等。部署复杂度适中，但要求一定的 Linux 运维能力。
### 不推荐的部署场景
- 文档明确表示：Heroku、YunoHost 等 PaaS/SaaS“不支持且极易引发问题”，因为 Invidious 带宽占用大、本质是代理，容易被判定为滥用并封禁。不建议在这些平台托管。
---
## Demo / 代码示例：用起来、玩起来
### 使用公共实例（零部署体验）
- 从官方“公共实例列表”选择一个（如 invidious.nerdvpn.de），直接在浏览器访问即可观看，无需登录 Google。
- 体验建议：可配合浏览器扩展（如 Privacy Redirect）自动将 YouTube 链接重定向到指定实例，并替换嵌入视频为 Invidious 播放器。
### API 调用示例（以公共实例为例）
- 获取实例统计：
```bash
curl -s "https://invidious.nerdvpn.de/api/v1/stats" | jq .
```
- 获取视频元数据（视频 ID=dQw4w9WgXcQ）：
```bash
curl -s "https://invidious.nerdvpn.de/api/v1/videos/dQw4w9WgXcQ?region=US" | jq .
```
- 搜索（关键词=privacy）：
```bash
curl -s "https://invidious.nerdvpn.de/api/v1/search?q=privacy" | jq .
```
- 获取趋势（type=gaming）：
```bash
curl -s "https://invidious.nerdvpn.de/api/v1/trending?type=gaming" | jq .
```
API 文档提供了各端点的 Schema 与参数说明，支持多语言字段（hl 参数）等。
---
## 目标人群与收益：谁值得折腾？
### 隐私敏感型用户
- 收益：避免广告跟踪、拒绝推荐算法的操控、不必登录 Google 账号即可订阅与历史；配合公共实例或自建，实现“干净看片”。
### 开发者与第三方应用作者
- 收益：基于 Invidious API 可快速构建自定义前端、数据抓取管道或自动化工具；例如做个人化观看统计、生成 RSS、跨平台客户端后端等。
### 家庭/团队内部搭建
- 收益：家中有 NAS/服务器，给家人/团队内部统一提供一个“无广告、无跟踪、可订阅”的 YouTube 入口；配合 DNS 或 hosts 可将设备上的某些播放行为统一导向实例。
### 内容创作者与运营（轻度用法）
- 收益：用来无干扰地查看自己的视频在不同地区/语言下的呈现、标题/缩略图/描述效果，或嵌入到自己的站点做干净播放（注意合规）。
---
## 竞品/同类对比：在“替代前端”里的位置
### 与 Piped 对比（要点总结）
- 技术栈：Invidious 使用 Crystal + Kemal；Piped 后端为 Java、前端为 Vue.js。
- 特性差异：
  - SponsorBlock/Return YouTube Dislike：Piped 原生支持，Invidious 暂不支持。
  - JS 依赖：Invidious 可在“无 JS”下播放；Piped 需要 JS。
  - PWA：Piped 支持 PWA；Invidious 暂不支持。
- 生态与成熟度：Invidious 出现更早、公共实例与文档体系较完善；Piped 更注重现代前端体验与社区插件集成。
### 与 NewPipe/FreeTube 等本地客户端
- Invidious 是“服务器侧前端”，能多人共享一个实例并提供 Web 与 API；NewPipe/FreeTube 更偏“本地 App”，无需自建服务，更适合单机使用。
### 与 PeerTube
- PeerTube 是去中心化视频托管平台，自己存视频；Invidious 并不存储视频，只作为 YouTube 的前端与代理，两者定位互补。
---
## 局限与不足：要清醒看到的风险
### YouTube 变更带来的不稳定性
- 不使用官方 API = 对 YouTube 页面/协议的“逆向”。一旦 YouTube 调整签名机制、反爬策略，公共实例和自建服务都可能遇到播放失败、无法登录、CAPTCHA 等问题。官方文档专门有“YouTube 错误信息与解决方案”“播放问题排查”等章节，可见这一问题持续存在。
### 公共实例短缺与信任问题
- 近期官方在实例列表中提示：因 YouTube 问题导致列表缩短，“如果可以，请尽量在家自建，不要依赖公共实例”。
- 任何“未在官方列表”的实例都属于“不受信”，潜在风险包括运营者篡改流量、插广告或记录行为等。官方也明确对第三方实例不承担责任。
### 资源与运维成本不低
- 部署要求：内存、磁盘、带宽都有硬指标；编译还需要至少 2.5GB 可用 RAM（建议 4GB）。
- 不适合 PaaS/SaaS：文档明确不建议 Heroku 等平台，容易被视为滥用并封号。
### 功能缺口
- 不支持 SponsorBlock、Return YouTube Dislike 等社区增强功能（相比之下 Piped 支持）。
- 直播支持不稳定：存在历史 issue 提及多个公共实例无法播放直播流。
### 开源协议合规
- AGPLv3：若你对 Invidious 进行修改并提供网络服务，需向用户提供修改后的源代码。对闭源或商业产品集成有一定合规要求。
### 隐私与法律边界
- 官方明确声明不对任何第三方实例负责，并强调用户应遵守所在地区法规，禁止用于非法下载等用途。自建实例若公开对外，也可能收到版权/DMCA 通知，需要运营者自行处理。
---
## 结语与行动建议
### 终极评判
- 如果你是“普通观众”：建议先从官方“公共实例列表”选一个受信节点体验，配合浏览器自动跳转扩展即可获得“无广告+无跟踪+订阅独立”的收益，风险几乎为零。
- 如果你是“开发者/运维者”：具备一台 VPS 或家中的服务器/NAS，非常值得自建一个 Invidious 实例；Docker 部署路径成熟，官方文档详尽，适合作为“练手项目”和实际生产工具双重用途。
- 如果你是“第三方应用/工具作者”：Invidious 提供了一套功能完备的 API（视频、频道、搜索、字幕、趋势等），是构建自定义 YouTube 客户端或数据管道的理想后端之一，只需做好 YouTube 变更导致的“兼容性维护”心理准备。
### 行动建议（按人群）
- 想马上改善观看体验：选一个官方列表中的公共实例，装一个重定向扩展（如 Privacy Redirect），把 YouTube 流量“无声地”导入 Invidious。
- 准备自建：按“Docker Compose + PostgreSQL + companion”的路径从官方安装文档走一遍，先在本地/局域网跑通，再考虑对外公开（务必注意带宽、监控与合规）。
- 做 API 集成：从 /api/v1/videos、/api/v1/search、/api/v1/trending 三个端点开始，用你熟悉的语言（curl/Python/JS 等）做几个小 Demo，再逐步扩展到认证端点和频道管理。
---
## 参考与延伸阅读
- Invidious GitHub 仓库（特性、快速开始与扩展推荐）
- 官方文档站（安装、配置、API 与实例列表）
- Invidious companion 仓库（负责视频流获取的 Deno 服务）
- Invidious vs Piped 对比（功能与实现差异）
- Invidious 历史与 Wikidata 条目（作者变更与时间线）
