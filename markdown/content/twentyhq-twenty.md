# twentyhq/twenty

[GitHub URL](https://github.com/twentyhq/twenty)


## Twenty CRM 深度评测：58k Star 的开源 Salesforce 替代品

> GitHub 58.5k Star 的开源 CRM，可自托管、代码级定制、AI 原生，自托管全功能免费，是 Salesforce 的高性价比替代方案。

- **Tags**: 开源CRM, Salesforce替代, 自托管, TypeScript, AI原生
- **Category**: 开发工具, 企业服务, AI 工具

## Details

# Twenty CRM 深度评测：能把 Salesforce 拉下神坛的开源"挑战者"吗？
> **一句话总结**：Twenty 是一个基于 AGPL-3.0 协议的开源 CRM，用 TypeScript 全栈构建、以"对象即代码"为核心理念、当前 GitHub 58.5k Star 排名第一的开源 CRM 项目，它瞄准的是被 Salesforce 和 HubSpot 高价订阅与数据锁定折磨的技术型团队——**如果你的团队会写代码、又受够了"按人头付费"，那它值得一试；如果你想要的是开箱即用的全套营销工具，它还很年轻**。
---
## 一、背景与痛点：为什么 2023 年还要再造一个 CRM？
CRM 是一个被巨头统治了几十年的赛道：Salesforce 占据全球 20.7% 的市场份额，年营收约 415 亿美元，企业版价格高达 **175 美元/人/月**；HubSpot Sales Hub Professional 也要 **90 美元/人/月**，外加一笔强制性的 1,500 美元 Onboarding 费用。一个 10 人团队用 Salesforce Enterprise 一年就要烧掉 2.1 万美元，还没算定制开发和 AppExchange 插件。
更让人难受的是**数据锁定**——你辛辛苦苦沉淀的客户数据、字段结构、自动化流程，全部长在对方的 SaaS 上，想搬走时才发现无数字段映射和 API 限制。
Twenty 就诞生在这个背景下。**三位创始人 Félix Malfait（CEO）、Charles Bochet、Thomas Colas des Francs** 此前都在各自的公司里亲手造过内部 CRM，深刻体会过"买来的太贵、攒出来的太乱"的痛苦。他们在 2023 年通过 **Y Combinator** 孵化，2024 年 11 月拿到 **500 万美元种子轮**，由 OpenDNS 创始人 David Ulevitch 领投，General Catalyst 参与，HubSpot、Front、Pipedrive 的高管也跟投。团队目前约 10 人，总部在旧金山，但开源社区已有 **280+ 活跃贡献者**。
他们的产品哲学很清晰，CEO Félix 的一句话概括得很好：
> "现在的标准化软件让公司变得越来越像。要真正脱颖而出，企业需要的不是现成方案，而是能自己塑造并完整拥有的东西。" 
---
## 二、核心亮点：四个真正打动人的设计
### 🟦 1. "对象即代码"——把 CRM 当成你的技术栈
这是 Twenty 最锋利的一把刀。传统 CRM 的自定义字段要在 UI 里点来点去、导出导入，而 Twenty 推出了 **Twenty SDK**，让你像定义数据库表一样用代码声明业务对象，并且纳入 Git 版本控制：
```typescript
import { defineObject, FieldType } from 'twenty-sdk/define';
export default defineObject({
  nameSingular: 'deal',
  namePlural: 'deals',
  labelSingular: 'Deal',
  labelPlural: 'Deals',
  fields: [
    { name: 'name',       label: 'Name',       type: FieldType.TEXT       },
    { name: 'amount',     label: 'Amount',     type: FieldType.CURRENCY   },
    { name: 'closeDate',  label: 'Close Date', type: FieldType.DATE_TIME  },
  ],
});
```
然后一行命令发布到你的工作区：
```bash
npx create-twenty-app my-app          # 脚手架
npx twenty app:publish --private      # 发布为私有应用
```
打个比方：**Salesforce 像是一间精装修好的房子，家具能换但承重墙不能动；Twenty 则是一份施工图纸，你可以把整栋房子推倒重盖**。对于需要把 CRM 沉淀为公司"数字资产"的技术团队，这是质变。
### 🟦 2. 现代技术栈 + Monorepo 工程化
 Twenty 是一个非常"舒服"的 TypeScript 项目：
- **后端**：NestJS + BullMQ + PostgreSQL 16 + Redis
- **前端**：React + Jotai（原子化状态）+ Linaria（CSS-in-JS）+ Lingui（国际化）
- **工程化**：Nx 管理 monorepo，CI 用 GitHub Actions，代码审查用 Greptile，错误监控用 Sentry
截至 2026 年 10 月，仓库累计 **17,008 次提交**，主分支每天都在动，Issue 响应也相当及时（核心成员会亲自在 Discussion 里回复 webhook 等具体问题）。UI 风格明显借鉴了 Notion 和 Linear——干净、键盘友好、操作顺滑，学习曲线远低于 Salesforce Lightning。
### 🟦 3. AI 原生设计：CRM 即 Agent 的控制平面
项目 2026 年的最新 Slogan 已经从 "open alternative to Salesforce" 升级为 **"designed for AI"**。它的 AI 思路和大多数"在 CRM 里塞个 Chatbot"的做法完全不同——Twenty 把 **AI Agent 当作一等公民嵌入对象模型和自动化工作流**，CRM 数据库反过来成为 Agent 的"工作记忆"和"行动手册"。
更妙的是他们与 AI Coding Agent 生态的打通：
```bash
# 给 Claude Code / Codex / Cursor 安装 Twenty 官方技能包
npx skills add twentyhq/twenty --list
```
这意味着你可以在 Cursor 里说一句"给我加一个 Customer Success Health Score 字段，关联到 Account 对象"，Coding Agent 就能直接基于官方 SDK 写代码、跑测试、提交 PR。这是把"CRM 自定义"彻底交给了 AI 协作的时代。
### 🟦 4. 极简但诚实的商业模式：AGPL + 自托管全功能免费
Twenty 的商业化路径非常清晰：
| 版本 | 价格 | 权限 |
|------|------|------|
| **Self-Hosted** | **0 元** | 包含所有 Pro 功能（这是他们最厚道的一点） |
| Cloud Pro | **$9 / 人 / 月**（年付） | 托管云端、自动升级 |
| Cloud Organization | **$19 / 人 / 月** | + SSO、行级权限（适合中大型团队） |
这一点是真正**口碑级的关键**：不同于 GitLab 之类"开源版阉割核心功能"的策略，Twenty 让你 self-host 时也能享受完整功能，只是要自己运维。他们靠云订阅和企业服务赚钱，开源版作为社区弹药。数据层面也做了承诺——**永远不会用你的数据训练 AI 模型**。
---
## 三、竞品对比：它在 CRM 生态里的真实位置
| 维度 | **Twenty** | Salesforce | HubSpot | Attio | EspoCRM | SuiteCRM |
|------|-----------|-----------|---------|-------|---------|----------|
| **开源** | ✅ AGPL-3.0 | ❌ | ❌ | ❌ | ✅ GPL | ✅ GPL |
| **起售价** | $0（自托管） | ~$175/人/月 | $90/人/月 + $1500 | $35/人/月 | 免费 | 免费 |
| **10 人团队年成本** | **~$240 VPS** | ~$21,000 | ~$12,300 | ~$4,200 | ~$240 | ~$240 |
| **技术栈** | TS 全栈（现代） | Apex（封闭） | 闭源 | 闭源 | PHP（较旧） | PHP（老旧） |
| **API** | REST + GraphQL + Webhooks + SDK | REST（强但复杂） | REST | REST | REST | REST（弱） |
| **自定义** | 代码级 + SDK + Agent | Apex + Flow（学习成本高） | No-Code 有限 | 数据模型灵活 | UI 自定义 | UI 自定义 |
| **营销套件** | ❌ 无 | ✅ 完整 | ✅ 完整 | 部分 | 部分 | 弱 |
| **UI 现代度** | ⭐⭐⭐⭐⭐ Notion 风 | ⭐⭐⭐ 复杂 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **生态成熟度** | 较年轻 | ⭐⭐⭐⭐⭐ 5000+ 应用 | ⭐⭐⭐⭐⭐ 1500+ 集成 | 中等 | 中等 | 中等 |
**Marmelab 2026 年 1 月的开源 CRM 横评**给出的结论很中肯：**如果团队有开发能力并希望深度定制，Twenty 是最佳选择；如果你要一个"功能已长齐、自动化成熟"的成品，EspoCRM 更稳；如果你想一鱼多吃连 ERP 一起搞定，去 Odoo**。
---
## 四、自托管部署实战：一行命令 + 三条避坑指南
### 🚀 最小部署示例
Twenty 的 self-host 已经相当精简——**4 个容器搞定一切**：`server`、`worker`、`db`（PostgreSQL 16）、`redis`。没有独立的前端容器（旧的 `twenty-front` 镜像已废弃，**千万别用**）。
```yaml
# docker-compose.yml 核心片段（精简版）
services:
  server:
    image: twentycrm/twenty:latest
    ports: ["3000:3000"]
    environment:
      - PG_DATABASE_URL=postgres://twenty:password@db:5432/default
      - REDIS_URL=redis://redis:6379
      - SERVER_URL=https://your-domain.com
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}   # 唯一必填的密钥
    depends_on: [db, redis]
  worker:
    image: twentycrm/twenty:latest
    command: ["yarn", "worker:prod"]
    environment: *同上
  db:
    image: postgres:16
    volumes: ["db_data:/var/lib/postgresql/data"]
  redis:
    image: redis
volumes:
  db_data:
```
生成必需的密钥：
```bash
openssl rand -base64 32   # 粘贴到 .env 的 ENCRYPTION_KEY
docker compose up -d      # 启动时自动跑数据库迁移
```
官方还有一条**一行脚本安装**：
```bash
# 拉起最新稳定版
VERSION=v2.x.x curl -sSL https://twenty.com/install.sh | bash
```
### ⚠️ 踩坑指南（来自真实 Issue 和社区反馈）
1. **最低内存 2GB**——低于这个值 BullMQ worker 会 OOM 崩溃，建议生产环境 4GB 起步。
2. **v1.0 升级时的 migration 陷阱**——有用户报告从旧版本升级时 `core.keyValuePair` 表不存在导致启动失败，处理方式一般是先确认数据库连接串指向正确实例，或按官方 Upgrade Guide 清理升级。
3. **Redis Enterprise / Azure Redis 的 CROSSSLOT 报错**——必须在所有 server/worker/upgrade 命令上设置 `REDIS_CACHE_PREFIX={twenty-cache}`，**花括号必须保留**（用于 Redis Cluster hash slot 计算）。
4. **PostgreSQL 不要随便换版本**——官方锁定 PG 16，跨大版本升级要手动 pg_dump + pg_restore。
5. **不要再用 `twenty-front` 镜像**——Docker Hub 上已标注 "Deprecated - DO NOT USE"，旧教程里的 4 个 token secrets 也已合并简化为 1 个 `ENCRYPTION_KEY`。
---
## 五、适合谁？不适合谁？
### ✅ 五类人应该立刻把它加书签
- **技术型创业团队**：10 人以下、需要完整 CRM 但预算紧缩，自托管一年只要 $240 VPS 费用。
- **需要深度定制数据的公司**：比如 SaaS 公司要追踪 Subscription、Churn Score、Feature Usage 等特殊对象——Twenty 让你像建表一样定义。
- **重视数据主权的企业**：金融、医疗、政企，数据必须留在内网或私有云。
- **想给 AI Agent 找"工作台"的开发者**：把 Twenty 当作 Agent 的记忆库和行动引擎，是这个赛道里目前最完整的开源实现之一。
- **受够了 HubSpot/Salesforce 涨价的用户**：从 2026 年起 HubSpot 又一轮调价，社区里哀鸿遍野。
### ❌ 四类人建议绕行
- **非技术团队**：没有运维、没有前端/后端工程师的团队，建议直接买 Twenty Cloud 或 HubSpot 免费版。
- **营销驱动型公司**：Twenty **没有**内置邮件序列、营销自动化、Lead Scoring、广告归因等工具。
- **需要大量预置集成的团队**：生态比 HubSpot（1500+ 集成）和 Salesforce AppExchange（5000+ 应用）年轻得多，小众 SaaS 工具可能没有官方连接器。
- **想要完整报表和 BI 的销售总监**：高级预测、漏斗分析、销售管道 forecast 的开箱能力还不如成熟商业产品。
---
## 六、局限与潜在风险：说点不好听的
1. **AGPL-3.0 不是"随便用"的许可证**——如果你把 Twenty（或基于它的衍生版本）作为 SaaS 对外提供，**必须开源你的修改**。二次商用前务必请法务把关，这是与 MIT/Apache 项目最关键的区别。
2. **营销自动化是空白**——这让它更像是"Sales"层的开源替代，而不是完整的"HubSpot 全家桶"替代。短期不会补上，官方优先级在数据模型和 AI 上。
3. **生态尚年轻**——官方 Marketplace 的第三方 App 数量少，遇到小众集成需求基本要自己写。
4. **企业级高级功能还在追赶**——行级权限、审计日志、复杂工作流版本管理，相比 Salesforce 的成熟度仍有差距。
5. **重大版本升级偶发 breaking change**——从社区 Issue 看，v1.0 前后出现过迁移失败案例，**生产环境务必先在 staging 跑一遍升级**。
6. **团队仅 10 人**——500 万美元融资对于对抗 Salesforce 这种年入 415 亿的巨头只是杯水车薪，长期命运取决于开源社区能否形成飞轮（好消息是贡献者增长曲线很健康）。
---
## 七、结语与行动建议：终极评分
综合来看，我会给 Twenty 打 **8.5 / 10**：
> **它是过去五年里，开源 CRM 赛道第一次出现的"真正可能动摇 SaaS 巨头"的产品**——不是因为功能最全，而是因为它把 CRM 从"一个买来的工具"重新定义成"一份能写代码、能提交 Git、能让 AI 协作的建筑蓝图"。这种范式上的差异化，比单纯卷功能更可怕。
**给你的行动建议，按场景对号入座：**
| 你的情况 | 建议动作 |
|---------|---------|
| 只想先体验一下 | 直接上 [twenty.com](https://twenty.com) 注册 Cloud 免费版，5 分钟搞定 |
| 个人/小团队试水自托管 | 用 Hostinger / Racknerd 一台 $5 VPS，跑 docker-compose 一行脚本 |
| 想深度定制 | 先读 [Twenty SDK 文档](https://docs.twenty.com)，本地 `npx create-twenty-app` 起个项目 |
| 想让 AI 协作 | 在 Cursor/Claude Code 里装 `npx skills add twentyhq/twenty` |
| 想二次开发并商业化 | 先研究 AGPL-3.0 条款，联系官方谈商业授权 |
**一句话收束**：Twenty 现在还打不死 Salesforce，但它是第一条让"开源 + AI 原生 + 开发者主权"在 CRM 领域真正能跑通的路径。对于技术型团队，2026 年不把它纳入选型对比，可能就等于 2010 年没看一眼 Docker。
