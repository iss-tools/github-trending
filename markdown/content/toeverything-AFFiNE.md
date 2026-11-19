# toeverything/AFFiNE

[GitHub URL](https://github.com/toeverything/AFFiNE)


## AFFiNE 深度评测：开源界的 Notion+Miro 合体，本地优先知识库天花板

> AFFiNE 是一款开源 all-in-one 知识库，把 Notion 式文档、Miro 式无限画布、多视图数据库和 AI Copilot 融合在一个本地优先工作区里。

- **Tags**: 开源, Notion替代, 本地优先, 自托管, 知识库
- **Category**: 开发工具, 办公效率, 知识管理

## Details

> **一句话总结**：AFFiNE 是一款由 toeverything 团队打造的开源"all-in-one"知识库，把 Notion 的块式文档、Miro 的无边画布、Airtable 的多视图数据库和 AI Copilot 融合在一个本地优先（local-first）的工作区里——**如果你既想要 Notion 的结构化、又想要 Miro 的发散空间、还坚持"数据要握在自己手里"，AFFiNE 是目前最值得认真评估的开源方案。**
---
## 一、背景与痛点：为什么"又一个 Notion 替代品"值得关注
近几年 Notion 类工具的痛点已经非常清楚：
- **数据锁在云端**：导出格式残缺、断网就无法工作、公司数据出企业边界即合规风险；
- **文档与画布割裂**：写方案要切到 FigJam/Miro，做计划要切到 Trello，知识越散越乱；
- **开源替代品"长得像但用着糙"**：AppFlowy 偏重数据库、SiYuan 偏重大纲、Logseq 偏重双链，鲜有真正把"文档+画布+数据库"在同一个块模型下统一的产品。
AFFiNE 在 2022 年 8 月开源，上线第一周拿下 6,000 星、43 天破万、5 个月内 28 次登上 GitHub Trending，两年内累计 33,000+ Star——这个增长曲线在 Notion 替代品赛道里非常罕见。
项目官方对它的定位非常克制：**"An operating system for all the building blocks that assemble your knowledge base"**——它不是单一功能的笔记，而是想当"知识构建块的操作系统"。
---
## 二、技术栈与架构解析：AFFiNE 为什么敢说"块即一切"
理解 AFFiNE，关键不是看 UI 有多花哨，而是看它底层把"块（Block）"这个抽象做到了什么程度。整个项目由三层构成：
| 层级 | 项目名 | 角色 | 技术栈 |
|------|--------|------|--------|
| 编辑器层 | **BlockSuite** | 块编辑器框架，文档/画布/数据库共用同一套块模型 | TypeScript |
| 数据层 | **y-octo** | 原生高性能、线程安全的 YJS CRDT 实现 | Rust |
| 服务层 | **OctoBase** | 本地优先、可协作的轻量数据引擎 | Rust |
| 应用层 | AFFiNE Client | 桌面/Web/移动端 UI | React + Electron + Jotai + Vite |
> 一个形象的比喻：**BlockSuite 是乐高积木的设计图，OctoBase 是乐高工厂的库存系统，AFFiNE UI 是把积木拼成城堡的展示厅。** 文档页里的一段文字、画布里的一张便利贴、数据库里的一行记录，在底层都是同一种"Block"——这就是它能"一份数据、三种视图"的真正原因。
**为什么自研 y-octo 而不直接用 YJS？** 官方给出的理由是性能与线程安全：YJS 是为浏览器 JS 设计的，要在 Rust 服务端和移动端跑出"本地优先 + 多端实时协同"的速度，必须有一份 native 实现。y-octo 就是 AFFiNE 团队用 Rust 重写的 YJS 协议实现，让客户端和服务端共享同一套 CRDT 引擎。
这套设计的精妙之处：**CRDT（无冲突复制数据类型）允许多端离线修改，重新联网时自动合并、永不冲突**——就像多人同时编辑一份共享文档，谁先谁后、断网多久都不会丢失数据。这是 Notion 的"在线协同"、Obsidian 的"纯本地文件"、Logseq 的"双链"之外，真正难以同时做到的第三件事。
---
## 三、核心亮点：三个最值得称道的能力
### 1. 文档与画布真正合并
大多数"白板型"工具是把文档缩略图钉到画布上，AFFiNE 做到了**Page 模式与 Edgeless 模式之间一键切换**——同一份内容既能线性阅读，也能空间排布，文字、表格、嵌入网页、多视图数据库、链接页面、形状、幻灯片都能直接丢到无限画布上。
适合场景：头脑风暴时把碎片想法散到画布上 → 整理成型后切回 Page 模式写成正式文档 → 再一键变成演示幻灯片。这是 Notion + Miro + Precept 三件套才能完成的工作流。
### 2. 本地优先 ≠ 数据孤岛
桌面端可以**完全不登录、完全离线使用**，工作区数据落盘本地。需要协同或云备份时再挂到 AFFiNE Cloud 或自建服务器，CRDT 保证数据合并无损。这个"先本地、后同步"的哲学，恰好命中了 Notion 用户最大的焦虑。
### 3. AI Copilot 全链路嵌入
AFFiNE AI 不只是个聊天框，它能针对**选中的块**做 inline 改写、总结、翻译、行动项提取；能把大纲转成思维导图、把笔记转成演示文稿（Beta）；还支持 0.27 版本起的 **BYOK（自带 API Key）实验特性**和 **MCP 集成**，可以把工作区内容暴露给 Claude Code 之类的编码 Agent。
---
## 四、上手门槛与部署体验：Docker Compose 一键起
AFFiNE 官方主推 Docker Compose 自托管，整体体验对运维同学比较友好。**最低硬件门槛**非常克制：基础使用 2 GB RAM，文档超过 1 万字建议 4 GB。
### 最小可用 docker-compose.yml（精简版）
```yaml
name: affine
services:
  affine:
    image: ghcr.io/toeverything/affine:stable
    container_name: affine_server
    ports:
      - '3010:3010'
    depends_on:
      redis:
        condition: service_healthy
      postgres:
        condition: service_healthy
      affine_migration:
        condition: service_completed_successfully
    volumes:
      - ./data/storage:/root/.affine/storage
      - ./config:/root/.affine/config
    environment:
      - REDIS_SERVER_HOST=redis
      - DATABASE_URL=postgresql://affine@postgres:5432/affine
      - AFFINE_INDEXER_ENABLED=false
    restart: unless-stopped
  affine_migration:
    image: ghcr.io/toeverything/affine:stable
    command: ['sh', '-c', 'node ./scripts/self-host-predeploy.js']
    environment:
      - REDIS_SERVER_HOST=redis
      - DATABASE_URL=postgresql://affine@postgres:5432/affine
    depends_on:
      postgres: { condition: service_healthy }
      redis: { condition: service_healthy }
  postgres:
    image: postgres:16          # 启用 AI 需换 pgvector/pgvector:pg16
    environment:
      POSTGRES_USER: affine
      POSTGRES_DB: affine
    volumes:
      - ./data/pg:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD', 'pg_isready', '-U', 'affine']
      interval: 10s
  redis:
    image: redis
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
```
`docker compose up -d` 之后浏览器打开 `http://localhost:3010`，按提示注册首个账号即可。
> **避坑提示**：
> - 启用 AI 必须用带 pgvector 扩展的 Postgres 镜像（`pgvector/pgvector:pg16`），普通 postgres 跑不动 AI 索引；
> - Redis 不可省略，AFFiNE 把它用作缓存、后台任务和同步中心，没了 Redis 服务起不来；
> - 升级到 0.27 后，**只有 0.26 及以上版本的客户端才能连**，多端要同步升版本，否则会报版本不匹配。
> - 在 CasaOS、群晖等 NAS 环境里手动改 compose 文件容易踩环境变量/存储权限的坑，建议优先用官方 compose 文件而非社区模板。
---
## 五、商业模式与许可：开源但不是 100% 自由
这是 AFFiNE 最容易被误解的地方，也是社区讨论最激烈的点。
| 部分 | 许可证 | 自托管限制 |
|------|--------|-----------|
| 客户端、编辑器、UI | MIT | 无限制 |
| `packages/backend/server`（云服务端） | AFFiNE EE 自有许可 | **生产环境免费上限 10 席位 / 100 GB 存储**，超出需购买 Team 许可（$10/席位/月） |
| OctoBase（早期版本） | 曾为 AGPL-3.0，新版本已迁移 | — |
社区成员曾直接质疑："网站写 Open-Source Code，下面又写 Free for individuals, commercial and team usage fees apply，这是矛盾的。"官方回应：`packages/backend/server` 是 AFFiNE Cloud 专用代码，放同一仓库只是为了开发方便，**纯离线使用 AFFiNE 客户端可以完全不出这个仓库的 MIT 范围**；但要做多人协同自托管，就要受 EE 许可约束。
一句话理解：**个人自用基本无枷锁，团队规模化自托管需要付许可费。** 想完全规避许可限制的团队，可能更适合看 AppFlowy 或 Docmost。
云端订阅价格对比（个人版）：Notion Personal Pro 约 $8/月，Notion AI 加 $10/月；AFFiNE Pro $6.75/月、AI 附加包 $8.90/月——单独看略便宜，但 AI 是独立 SKU，叠加起来并不比 Notion 便宜多少。
---
## 六、目标人群与收益
| 用户类型 | 推荐度 | 能解决的具体痛点 |
|----------|--------|-----------------|
| **本地优先重度用户**（被 Notion 锁定数据困扰） | ★★★★★ | 桌面端可纯离线、数据落盘本地、CRDT 多端无损同步 |
| **文档+画布混合工作流**（产品经理、设计师、咨询师） | ★★★★★ | 同一块数据在 Page/Edgeless/Database 三种视图间自由切换，告别三软件接力 |
| **自托管爱好者 / 隐私敏感团队（≤10 人）** | ★★★★☆ | Docker 一键起，免费额度刚好覆盖小微团队 |
| **AI 写作 / 头脑风暴** | ★★★★☆ | 块级 inline AI、大纲转思维导图、笔记转幻灯片 |
| **重结构化数据库 / 项目管理团队** | ★★★☆☆ | 数据库能力可用，但权限颗粒度、自动化、视图丰富度不及 Notion/AppFlowy |
| **重度移动端用户** | ★★☆☆☆ | 移动端体验明显落后桌面端，重度同步时有卡顿 |
---
## 七、竞品对比：在开源 Notion 赛道里的坐标
| 产品 | 定位 | 协同模型 | 画布 | AI | 自托管 | 许可 |
|------|------|---------|------|-----|--------|------|
| **AFFiNE** | 文档+画布+数据库 all-in-one | 本地优先 + CRDT | ✅ 原生融合 | 内置 + BYOK + MCP | ✅ Docker | 客户端 MIT / 服务端 EE |
| **AppFlowy** | 企业向结构化协作 | 云优先 | 弱 | 内置 | ✅ | AGPL + 商业 |
| **SiYuan（思源）** | 大纲+双链 | 本地 | 弱 | 付费 | ✅ | AGPL |
| **Logseq** | 大纲+双链 | 本地文件 | 有白板 Beta | 有限 | ✅ | AGPL |
| **Obsidian** | 纯本地 Markdown | 本地文件 | 通过插件 | 第三方 | 文件夹即服务 | 闭源免费 |
| **Notion** | 托管 SaaS | 云优先 | 通过 FigJam 跳转 | 成熟 | ❌ | 闭源 |
**AFFiNE 的独特竞争力**只有两个：一是**块级统一模型**让 Page/Edgeless/Database 三种视图共享同一份数据，目前没有第二家开源产品做到这种深度融合；二是**CRDT 多端无损同步**，在"既想本地、又想协同"这条路上走得最远。
---
## 八、局限与不足：客观存在的几个硬伤
1. **成熟度短板**：社区反馈反复提到的痛点——全局搜索不够强、反向链接薄弱、导出格式不完整、标签体系初级、插件生态几乎空白。这是 22 条 Product Hunt 评测里被提得最密集的几个词。
2. **移动端拖后腿**：重度同步时移动端会明显卡顿，体验与桌面端差距较大，72 条用户评价中都有提及。
3. **AI 是"本地优先的例外"**：尽管编辑器是本地的，**官方 AI 服务目前必须经 AFFiNE Cloud 中转、需要登录**，BYOK 只是实验特性，完全本地推理仍在 roadmap 上。这跟"数据 100% 不出本地"的预期仍有距离。
4. **许可表达不够透明**：核心代码 MIT、服务端 EE、OctoBase 历史上还是 AGPL，三套许可交织让"我到底能不能拿来商用"变得需要仔细核对。
5. **从 Notion 迁移有摩擦**：复杂数据库、嵌套 embed、自定义布局在导入时可能丢失，需要小批量测试后再全量迁移。
6. **演示文稿生成仍标 Beta**，自动分类、自动打标签等大量"AI 亮点功能"还停留在 coming soon。
---
## 九、结语与行动建议
AFFiNE 是那种**"理念领先实现半步"**的产品——"Block 即一切 + 本地优先 CRDT + 文档画布融合"这套架构在开源 Notion 赛道里独一份，技术野心和工程能力都很扎实；但成熟度、移动端、AI 本地化这三件事还需要时间追赶。
**给你的具体行动建议**：
- **如果你是个人用户，对数据隐私敏感、爱折腾**：直接下载桌面版（含本地工作区）试用一周，体验 Edgeless 画布和块级 AI，这一步零成本零风险。
- **如果你是 10 人以下团队、想逃离 Notion**：用上面的 docker-compose.yml 在一台 4GB 内存的小服务器上跑起来，把最关键的 2~3 个项目工作区迁进去试运行两周；觉得顺再考虑是否上 Team 许可。
- **如果你是企业级需求、要 SSO/审计/规模化权限**：AFFiNE 的 Enterprise Edition 还未正式发布，目前更适合看 AppFlowy 或继续用 Notion Enterprise。
- **如果你重度依赖移动端**：再等 6~12 个月，移动端体验是 AFFiNE 团队明确 acknowledged 的短板。
- **如果你只想白嫖一个开源白板+文档工具**：AFFiNE 当前的免费额度（10 席位 + 100 GB）已经是同类里最慷慨的之一，可以直接上手。
GitHub 仓库传送门：`github.com/toeverything/AFFiNE`，社区主阵地是官方 Discord，Issue 响应速度普遍在 24 小时内——这是 AFFiNE 团队自己也在博客里反复强调的"信任信号"。
