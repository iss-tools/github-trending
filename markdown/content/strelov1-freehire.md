# strelov1/freehire

[GitHub URL](https://github.com/strelov1/freehire)


## freehire 深度评测：直连 ATS 的开源求职搜索引擎

> 一个用 Go 写的开源求职搜索引擎，绕过 LinkedIn/Indeed 中间商，直接从 114 个企业 ATS 系统聚合 486 万真实岗位，MIT 协议可自部署。

- **Tags**: 开源项目, 求职搜索, Go, AI简历, Agent
- **Category**: 开发工具, 求职效率, AI 工具

## Details

# freehire 深度评测：一个把"找工作"重新开源一遍的硬核项目
> **一句话总结**：freehire 是一个用 Go 写的开源求职搜索引擎，它绕过 Indeed、LinkedIn 这些"中间商"，直接从 387,000+ 公司自己的招聘系统（Workday、Greenhouse、Lever、Ashby、iCIMS 等 114 个 ATS 平台）里爬职位，目前已索引约 486 万条在招岗位，MIT 协议、可自部署、附带完整的"找岗 → 改简历 → 投递 → 追踪 → AI 助手"闭环，是 2026 年 GitHub Trending 上少见的、工程密度极高的求职类项目。
---
## 一、背景与痛点：为什么中间商越多，求职越难受
你可能有过这种体验：在某个聚合网站上看到心仪的岗位，点进去却是一条死链、一份三个月前的"僵尸 JD"，或者被一个猎头中介拦了一道。这不是你的错觉，而是整个招聘聚合行业的结构性问题——
- **招聘平台靠"职位数量"卖流量**，于是大量过期岗位被反复 repost，甚至出现"幽灵职位"（岗位长期挂着但根本没在招人）；
- **聚合层做了二次包装**，职位描述被裁剪、薪资被模糊、投递链路被劫持到第三方；
- **求职者的简历、行为数据被平台变现**，而求职者本身没有讨价还价的能力。
freehire 的作者 **Ilya Strelov** 是一位有十年以上全栈经验的 Tech Lead（Node.js、AWS、Kubernetes、React），也是 ADPList 上的导师。他的解法非常"程序员"——**把整条链路重新开源一遍**：你自己的 ATS 数据自己爬、自己的简历自己管、自己的投递自己追踪，所有数据归你自己。项目在 2026 年 7 月下旬首次进入 Trendshift Go 日榜第 3，8 月中旬登上 GitHub Trending 综合榜第 6 位，是目前求职赛道少有的、被工程师社区认可的开源作品。
---
## 二、核心亮点与功能剖析
### 🌟 亮点 1：直连 ATS，数据"从源头来"
这是 freehire 最核心、也是最容易被低估的设计。
打个比方：传统聚合网站像是"二手书商"，从各家出版社收书再转卖给你，中间会缺页、加价、夹私货。而 freehire 相当于**直接站在每家出版社的仓库门口，把每一本书第一时间搬走并登记造册**。它不爬 LinkedIn，也不爬 Indeed，而是逐家对接企业自用的招聘系统——Greenhouse、Lever、Workday、iCIMS、Ashby 这些 ATS 本身就提供公开的 JSON API，freehire 为每个平台写了一个适配器，目前覆盖 **114 个 ATS 平台、38.7 万家公司、256 个数据源**。
更关键的是**去重与标准化**：同一家公司把同一个岗位发到三个不同的 board，freehire 用稳定键 `jobs.UNIQUE (source, external_id)` 折叠成一条记录，所有岗位被归一化到同一个 schema，不存在"看起来像三条岗位、其实是一家公司"的噪音。
**你得到的实际收益**：搜索结果的链接直接指向公司原始 JD，投递不会被中间商劫持，也不会点到死链。
### 🌟 亮点 2："幽灵岗位"信号，专治僵尸 JD
这是我在同类产品里**第一次见到做成显式功能**的能力。
freehire 会在岗位详情旁边标一个"真实度信号"，基于可观察的行为——是否反复 repost、挂出时长、岗位在系统里的移动轨迹——给你一个"这个岗位可能不太真实"的提示，并且**把证据一起展示出来，而不是一个黑盒分数**。它自己也克制地强调：这是"信号"而非"对雇主的判决"，没什么可说的时候它就什么都不说。
对正在海投的同学来说，这个功能省下的时间难以估量——你终于能在投之前就看出"这个岗位三个月前就挂在那里没人动过"。
### 🌟 亮点 3：AI 反幻觉的简历定制，工程上很硬核
市面上 AI 改简历的工具一大把，但几乎都会"幻觉"——凭空给你加一段不存在的经历、编一个你没拿过的奖。freehire 用了一套相当聪明的架构来对抗这件事：
它内部有个**"经验银行"（experience bank）**，你把真实的工作经历、量化的成就（比如"把 p99 延迟从 20s 降到 1s"）作为一条条"证据原子"存进去，每条原子记录是谁断言的——是你本人，还是模型。**只有你本人断言的原子，才能被写进简历**，这个校验放在服务代码路径里，而不是放在 Prompt 里求模型别乱编。
打个比方：这不是一个"凭空发挥的小说家"，而是一个"只能从你抽屉里拿现成素材的编辑"。这让 AI 可以放心地做"无人值守自动投递"——因为它根本没机会编造事实。
### 🌟 亮点 4：端到端闭环，不只是"搜索"
很多开源求职项目只做搜索这一层。freehire 把整条链路都做完了：
| 阶段 | 能力 |
|------|------|
| **找** | 多面搜索、精选集合、订阅邮件/Telegram 推送、共享看板、市场分析 |
| **投** | 结构化简历 + Typst 渲染的 ATS 友好 PDF、确定性匹配分 + AI 匹配分析、简历定制、追踪链接、内推 |
| **追** | 投递看板（阶段流转）、招聘方邮件收件箱自动归联、append-only 事件账本、提醒 |
| **问** | 进程内 AI 助手，5 个预设：聊天 / 浏览目录 / 填写 profile / 改简历 / **模拟面试** |
| **玩** | 公共免鉴权 API、CLI、MCP server（Claude Desktop / Claude Code）、Chrome 侧边栏扩展（能读页面、打分、自动填表）、ChatGPT Actions |
特别说一下那个 Chrome 扩展：你打开**任意**招聘网站的 JD（不限于 freehire 收录的），它就能在侧边栏读页面、给你和你的简历打一个确定性的匹配分、然后帮你把申请表填了。这对经常需要在公司官网上反复填同样信息的求职者是真正的效率杀器。
### 🌟 亮点 5：为 Agent 时代原生设计
这是我认为 freehire 在设计理念上**最超前**的一点。它的 CLI、MCP server、ChatGPT Actions 都是"一等公民"，README 里甚至直接放了一段 **Claude Code 驱动 freehire CLI 真实搜索岗位的录像**。CLI 的命令设计完全是按 agent 的使用习惯来的：`freehire search "golang" --remote --region eu`、`freehire market-fit --skills go,docker,react`、`freehire ghost report <slug>`。
设想一下：让 Claude Code 每天早上跑一次 `freehire search`，筛出匹配度最高的 10 个岗位，自动改好简历，等你审核后一键投递。**这就是 freehire 的目标场景**——它不是给浏览器用的，是给 AI 助理用的。
---
## 三、技术栈与架构：一次教科书级别的"Go 工程示范"
如果你只是求职用户，可以跳过这一节；但如果你是 Go 工程师或想学架构设计，**这一节可能比产品本身更值钱**。
### 技术栈一览
| 层 | 技术 |
|-----|------|
| 后端 | Go + Fiber v2 |
| 数据库 | PostgreSQL + pgvector |
| 搜索 | Meilisearch |
| DB 访问 | sqlc（无 ORM） |
| LLM 接入 | langchaingo + Bifrost 网关 |
| 可观测 | Langfuse + Prometheus + Grafana |
| 前端 | SvelteKit 2 + Svelte 5 runes + Tailwind 4 |
| 缓存/限流 | Redis |
| PDF 渲染 | Typst |
| 部署 | Docker Compose |
### 架构上的三个精妙设计
**1. 单体 + 卫星 worker，所有协调走 Postgres**
freehire 是一个 Go 单体 HTTP 服务器，加一群**"跑一次就退出"的 cron worker**——`cmd/` 下约 60 个入口点，只有 `cmd/server` 和 `cmd/mail-ingest` 两个常驻进程。爬取、enrichment、embedding、索引重建全部是"启动 → 干活 → 退出"的一次性 worker。
为什么不搞一个长驻的消息队列守护进程？因为**既然所有 worker 都通过 Postgres 协调，那就把 Postgres 当作唯一的真理源**——所有写路径都用了**事务性 outbox 模式**：业务写入和队列入队在同一个事务里完成，之后由对应的 worker 来 drain。这消除了分布式系统里最常见的"业务成功但消息丢了"的问题，代价是 Postgres 要承载更多队列表，收益是整个系统没有 ZK、没有 Kafka、没有 Redis 集群这种额外依赖，单机 Docker Compose 就能起整套。
**2. Meilisearch 索引的"胖推送"教训**
架构文档里有一段特别难得的"踩坑实录"：他们早期是每个 board 独立推送索引（约 169 个独立推送者），结果发现 Meilisearch 每次推送都要对**全量活跃索引**做重新 merge——在 270 万文档规模下每次要 90–180 秒——导致宿主机磁盘 IO 直接被打满。后来改成 outbox 批量聚合：**把很多小推送折叠成少数几次"胖推送"**，整个问题就消失了。
这种"我知道它为什么慢、我知道我们怎么改的、我告诉你为什么这样改是对的"的写法，在开源文档里极其罕见。
**3. 严格分层的 11-block / 8-layer 架构**
`internal/` 下约 130 个 domain 包，每个包属于 11 个 block 之一，block 之间有 8 层的严格分层——下层的 block 不知道"职位"是什么，同层的 block 之间互相不可见，**用 depguard 在编译期强制执行**，违规直接 CI 挂掉。
这种把架构纪律工具化的做法，比"架构图挂在墙上"强多了。每个 block 和重要包都有自己的 `AGENTS.md`，既给人看，也给 AI 编码助手看——又一个为 Agent 时代做的设计。
**4. 前后端契约用代码生成器锁死**
`cmd/gen-contracts` 从 Go 的 wire struct 和封闭词表生成 `web/src/lib/generated/contracts.ts`，后端加了一个字段而 SPA 没更新对应映射？**直接 TypeScript 编译报错**，而不是上线后看到一个空白单元格。
### 部署体验
一键起整套：
```bash
make up        # 启动 api, web, postgres, meilisearch, redis, s3
curl localhost:8080/health
curl localhost:8080/api/v1/jobs
```
端口冲突可以换：`HIRE_HOST_PORT=8090 make up`。数据库迁移在首次 volume 初始化时自动应用，手动补跑用 `make migrate`。
需要配置 `JWT_SECRET` 才能启动；OAuth 和 LLM 凭据都是可选的，对应的 feature 在未配置时自动禁用，**不会导致启动失败**——这是个很贴心的降级设计。
### 免鉴权 API 是个宝藏
```bash
curl "https://freehire.me/api/v1/jobs?search=golang&remote=true"
```
不需要注册、不需要 API key、没有 quota handshake。所有响应遵循统一形状：`{"data": ...}`（单条）、`{"data": ..., "meta": {...}}`（列表）、`{"error": msg}`（失败）。**这意味着你 30 秒内就能用 curl 或 Python 把它接进自己的工作流**。
---
## 四、目标人群与收益
**你应该重点关注的场景**：
- **海外求职者 / 远程工作者**：freehire 的数据以欧美 ATS 为主，Remote United States 单一分类下就有 100 万+ 岗位。如果你想找海外远程，它可能是比 LinkedIn 更干净的信息源。
- **程序员 / 数据岗**：Software Engineering（10 万+）、Data Engineering（4.5 万+）、Data Analytics（1.5 万+）、Security（5.9 万+）都是头部分类。
- **AI Agent 重度用户**：如果你在用 Claude Code、Cursor、ChatGPT 做生产力工具，freehire 的 CLI + MCP 组合是目前**最完整的开源求职 Agent 后端**。
- **想要数据主权的求职者**：你的简历、投递记录、匹配分析都在自己手里（或自部署实例里），不喂给 LinkedIn 的推荐算法。
- **Go 工程师 / 架构学习者**：这个 repo 本身就是一份可运行的 Go 工程教材。
**性价比对比**：免费版每天 1 次简历编辑、1 次 fit 分析，够轻度体验；Pro **每月 5 美元**解锁所有上限 + 每天 3 次无人值守投递。对比市面上动辄 $30–$100/月的 AI 求职工具，这个价格几乎是象征性的。
---
## 五、竞品对比：它在求职工具光谱里的位置
| 工具 | 数据来源 | 开源 | 价格 | AI 能力 | Agent 友好 |
|------|---------|------|------|---------|-----------|
| **LinkedIn** | 平台内 UGC + 企业发布 | ❌ | 免费含广告 / Premium $30+ /月 | 中 | ❌ 封锁爬虫 |
| **Indeed** | 聚合 + 企业直发 | ❌ | 免费含广告 | 中 | ❌ |
| **Hiring Cafe / LayoffData** | 类似 ATS 直爬 | ❌ | 免费 | 弱 | ❌ |
| **Simplify** | 聚合 + 简历工具 | ❌ | 免费 / Pro $20/月 | 中 | 半 |
| **JobRight / Sonara** | 聚合 + AI 助手 | ❌ | $30–$100/月 | 强 | 半 |
| **freehire** | **387K 公司直连 ATS** | ✅ MIT | 免费 / **$5/月** | 强 | ✅ 原生 |
freehire 独特的竞争力可以概括成三点：**数据从源头来（比 Indeed 干净）+ 真正开源可自部署（比 Simplify 透明）+ Agent 原生（比所有闭源竞品都友好）**。
它被 awesome-job-boards 这样的精选列表单独点名："Open-source IT job aggregator that normalizes, deduplicates and AI-enriches vacancies from many ATS boards"，在同类开源项目里几乎找不到完整对标。
---
## 六、局限与不足：别把它当银弹
实事求是地说，freehire 有几个明显的短板，你需要带着预期使用它。
**1. 单点维护风险高。** Trendshift 上显示它只有 **3 位贡献者**。这意味着 bus factor 接近 1——一旦作者精力转移，这个项目可能停滞。虽然 MIT 协议允许任何人 fork 续命，但社区生态还没起来。
**2. 商业化极其早期。** 第三方数据平台 TrustMRR 显示 freehire 近 30 天收入仅 **155 美元**。$5/月的价格是"好意"但也是"豪赌"——如果付费用户上不去，长期靠爱发电很难维持。把它当成一个长期稳定的基础设施来规划求职策略，目前还有风险。
**3. 覆盖以欧美为主，中国用户收益有限。** 数据源几乎全是海外 ATS 平台（Workday、Greenhouse、Lever），Boss 直聘、拉勾、猎聘这些国内平台不在覆盖范围。如果你只在国内找工作，这个工具基本帮不上忙。
**4. 数据规模仍有差距。** 486 万岗位听起来吓人，但 LinkedIn 声称全球岗位池在 2000 万级别。小公司、非技术岗、发展中国家的岗位覆盖率明显更低。**它是"高质量子集"，不是"全集"**。
**5. 高级 AI 功能需要登录，部分有每日配额。** 无登录状态下，你只能搜索和查看；想改简历、跑匹配分析、用助手，需要注册。自部署要接自己的 LLM 端点，并且免费版对部分功能做了配额（HTTP 402 拒绝，而非降级回答）。
**6. 工程上仍有不成熟之处。** 架构文档里坦率记录了 Meilisearch 全量 merge 的性能瓶颈、早先语义搜索索引被下线等教训。这些是"工程演进的真实过程"，但也说明离"完美稳定"还有距离。
**7. 无人值守投递需要审核。** 即便是 Pro 版，无人值守投递也是每天 3 次且需你先 review-approve，**不会替你盲投**。这其实是好事（防滥用、防垃圾申请），但如果你期待"一键自动海投 500 家"，会失望。
---
## 七、上手路径与行动建议
**如果你是普通求职者，按这个顺序体验收益最高：**
1. **直接访问 [freehire.me](https://freehire.me)**，先在首页的分类磁贴里点几下感受数据规模；
2. **注册账号 + 上传简历**，试一下"确定性匹配分"——它不给 LLM 说情的空间，分数完全来自你简历里能被验证的事实；
3. **试一次 CV tailoring**（免费版每天 1 次），感受"AI 只能从你的经验银行里拿素材"是什么样的体验；
4. **装 Chrome 扩展**，去任意一家公司的招聘官网 JD 页面试试侧边栏，这是最能"惊艳"的入口；
5. 如果觉得好用，**$5/月值得买**——比一杯咖啡便宜，换每天不限量的匹配分析和简历定制。
**如果你是开发者 / Agent 玩家：**
```bash
# 装 CLI（单二进制，不需要 Go）
curl -fsSL https://freehire.me/install.sh | sh
# 浏览器 OAuth 登录一次
freehire auth login
# 让 Claude Code 帮你找岗
freehire search "golang" --remote --region eu
freehire market-fit --skills go,docker,k8s --category backend
freehire job <slug>
```
想接入自己的工具链，直接打免鉴权 API 就够了：
```bash
curl "https://freehire.me/api/v1/jobs?search=kubernetes&remote=true&limit=20"
```
想读源码学架构，按这个顺序：`docs/architecture.md` → `AGENTS.md` → `internal/ingest/pipeline` → `internal/ai/assistant`。**最后两个目录是整套系统里工程密度最高的两块**，事务性 outbox 和无 shell 的 in-process agent 都在里面。
---
## 结语：一次值得掌声的"重新发明"
freehire 最好的地方不是它有多少 star，而是它证明了**求职工具这个被商业平台垄断了十几年的赛道，仍然可以被人从工程第一性原理出发重做一遍**——而且做得更干净、更便宜、更尊重用户。
它不完美：单点维护、商业化悬而未决、对中文用户几乎无覆盖。但**它已经在做的事情——直连 ATS、反幻觉 AI、Agent 原生、事务性 outbox、严格分层——每一条单拿出来都值得同类项目学习**。如果你正在海外求职、或者在研究 Go 架构、或者在琢磨怎么给 AI Agent 找个真正有用的"求职技能"，这个仓库都值得你花一个下午。
给个 8.5/10 的综合评分：产品理念 9.5、工程质量 9、可持续性 6.5、对中文用户友好度 3。**这个分数的另一半，取决于接下来 12 个月它能不能活下来、长出社区**。值得Star，也值得持续观察。
