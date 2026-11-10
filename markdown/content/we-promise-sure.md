# we-promise/sure

[GitHub URL](https://github.com/we-promise/sure)


## Sure：Maybe Finance 停摆后的社区复活版，开源免费的全资产个人财务管理应用

> Maybe Finance 归档后由 293 位志愿者接管的社区 Fork，商业级开源 PFM，支持全资产追踪、AI 助手与自托管，完全免费。

- **Tags**: 开源项目, 个人理财, 自托管, Rails, AI助手
- **Category**: 生活效率, 开发工具, AI 应用

## Details

# Sure 评测：一个"起死回生"的开源财富管理应用，凭什么在 10 个月内冲到 8.4k Star
**一句话总结**：Sure 是 Maybe Finance 停摆后由社区志愿者接管的"复活版"，继承了原作近 100 万美元砸出来的商用级 Rails 代码库，主打"净值为王"的全资产追踪（银行 + 股票 + 加密 + 房产 + 贷款），并自带 AI 助手、MCP 端点和本地大模型推理能力——**它是目前开源世界里少数能与 YNAB / Monarch / Kubera 等商业产品正面刚的全功能 PFM（Personal Finance Management）应用**，而且完全自托管、零订阅费、AGPLv3 开源。
如果你正在被 YNAB 涨到 109 美元/年的订阅费劝退、被 Mint 关停后无处安放的交易数据困住，或者只是想要一个能完整掌控自己财务数据、同时又能用 Ollama 跑本地大模型来"聊天问钱"的自托管方案——Sure 值得你花一晚上时间试一下。
---
## 一、项目基本档案：先看看它"是什么货色"
| 维度 | 详情 |
|---|---|
| 项目定位 | 全功能个人财富管理应用（PFM + Net Worth Tracker） |
| 前身 | Maybe Finance（已归档）的社区 Fork |
| 开源协议 | AGPLv3（强制开源传染，禁用 "Maybe" 商标与 Logo） |
| 技术栈 | Ruby 3.4.9 + Rails 8.1 + Hotwire + PostgreSQL 16 + Redis/Sidekiq |
| Star / Fork / 贡献者 | 8.4k / 96 / **293 位贡献者** |
| 最新稳定版 | v0.7.6（2026-10-31 发布）；v0.7.7 起切换到 CalVer 版本号（如 v2026.11.3） |
| 部署方式 | Docker Compose（主力）、Kubernetes Helm、Render / PikaPods / Hostim 一键模板 |
| 多端支持 | Web（主）、Tauri 2 macOS 桌面壳、Flutter 移动端（iOS/Android）、HTTP REST API、MCP 端点（`/mcp`） |
| 资源占用 | 全家桶（Web+Worker+PG+Redis）约 1 GB 内存 |
| 界面语言 | 16 种，含中文 |
| 官方 Demo | app.sure.am（带示例数据，可登录试玩） |
光看这张表就能感受到它的诚意：**这不是一个"周末项目"，而是一个曾经按 SaaS 商业产品标准打磨、后被开源接管的成熟代码库**，UI/UX 水准远高于绝大多数"自托管记账工具"那股 DIY 味。
---
## 二、背景故事：100 万美元烧出来的"遗产"
理解 Sure 必须先理解 Maybe。这是个挺有戏剧性的故事：
**2021–2022**，Maybe Finance 团队拿融资做一款"个人财务 + 财富管理"的全功能 SaaS，甚至内置"Ask an Advisor"——用户订阅后能直接咨询真人 CFP/CFA 注册理财师。烧了将近 100 万美元（员工 + 外包 + 数据供应商 + 基础设施）之后，**商业模型没跑通，2023 年中团队宣布停摆，把整个代码库开源**，初衷是让用户自托管，之后再推付费托管版。
**托管版短暂上线，又再次失败**——B2C 这条路对独立小团队而言实在太烧钱。**2025 年 7 月**，原版 maybe-finance/maybe 仓库被官方归档，停在 v0.6.0。
就在同一个月，**we-promise 组织创建了这个社区 Fork——Sure**，由志愿者 + 捐赠驱动维持。10 个月里从零涨到 8.4k Star、293 位贡献者，最近 61 天新增 1,071 Star，节奏相当猛。
> 💡 **这里有个值得琢磨的点**：Sure 继承的不是"另一个记账 app"，而是**一套已经过真实付费用户检验的产品级架构**。这是它与 Firefly III、ezbookkeeping 等"纯社区出身"项目最本质的差异——前者是"商业级软件被开源接管"，后者是"开源项目慢慢长成产品"。
---
## 三、核心架构与设计理念：为什么是 Rails + 双 AI Pipeline + MCP
### 3.1 Rails + Hotwire：保守但正确的选择
Sure 用的是经典的 **Ruby on Rails 单体 + Hotwire（Turbo + Stimulus）**，配合 PostgreSQL 和 Sidekiq 异步队列。
很多人第一反应是"怎么不用 React/Next.js"，但仔细看它的功能面——**净值仪表盘、交易流水、预算、账单、贷款还款计划、投资持仓、多币种换算、家庭共享权限、报表分析**——这是一个**重业务逻辑、重表单交互、重后台任务**的应用，Rails 单体在这种场景下开发效率和可维护性远高于前后端分离的 SPA。Hotwire 又能让大部分交互保持"无刷新"的现代感，省去了 API 层 + 状态管理的复杂度。
### 3.2 双 AI Pipeline：把"聊天"和"分类"彻底解耦
这是 Sure 的 AI 架构里最值得点个赞的设计。**它把 AI 能力拆成两条完全独立的管线**：
- **Chat Assistant（对话式）**：用户在 UI 里直接问"我这个月吃了多少""我该不该买这只股票"——可以走内置 OpenAI 兼容接口、原生 Anthropic、也可以走 External Agent 模式（远程 Agent 通过 MCP 反向调用 Sure 的工具）。
- **Auto-Categorization / Merchant Detection（后台）**：每次同步新交易时，后台任务自动分类。**v0.7.6 引入了朴素贝叶斯分类器，完全本地、零 token 消耗**——只要家里有 20 条以上已分类交易、覆盖 2 个以上分类，Bayes 就会先冲一波，置信度 70% 以上的直接打标签，剩下的才会掉落到 LLM 那一步。
> **这个设计的现实意义**：家庭用户日常 90% 的交易分类，靠本地 Bayes 就能搞定，根本不用调 LLM API、不花一分钱 token。LLM 只处理真正难啃的"剩饭"。这种**"先本地规则、再大模型兜底"的分层策略**，比很多一上来就 All in LLM 的产品务实得多。
### 3.3 MCP 端点：把你的财务数据"喂给"Claude 等 Agent
Sure 在 `/mcp` 暴露了一个 **JSON-RPC 2.0 的 Model Context Protocol 端点**，支持 OAuth 2.0 动态客户端注册或静态 Bearer Token，能让 Claude Desktop、Cursor 等外部 AI Agent **直接读取你的账户、持仓、损益、预算**，甚至**写入分类、标签、转账、目标、预算**。
这条线让 Sure 不再只是一个"网页应用"，而是变成了一个**可以被任何 MCP 客户端操控的金融数据服务**——这是很多开源 PFM 还完全没意识到的方向。
---
## 四、上手与部署：Docker 一行命令跑起来
### 4.1 最简部署（10 分钟出活）
```bash
mkdir -p ~/docker-apps/sure && cd ~/docker-apps/sure
curl -o compose.yml https://raw.githubusercontent.com/we-promise/sure/main/compose.example.yml
docker compose up -d
# 浏览器打开 http://localhost:3000，注册第一个账号
```
默认镜像拉取的是 `ghcr.io/we-promise/sure:stable`（稳定版）或 `:latest`（最新 alpha），首次启动会自动跑数据库迁移。
### 4.2 生产环境必做的三件事
compose 文件默认**裸跑就能启动**，但只要放到公网，下面三步千万别省：
```bash
# 1. 生成 SECRET_KEY_BASE（64 位随机串）
head -c 64 /dev/urandom | od -An -tx1 | tr -d ' \n' && echo
# 2. 写入 .env
cat > .env <<EOF
SECRET_KEY_BASE="粘贴上面生成的密钥"
POSTGRES_PASSWORD="换个强密码"
EOF
# 3. 启用备份 profile（每日 02:00 UTC 自动备份到本地卷）
docker compose --profile backup up -d
```
备份服务默认保留 **7 份日备 + 4 份周备 + 6 份月备**，可通过 rclone 推到对象存储。
### 4.3 启用 AI（最小可用配置）
如果想让 AI 助手跑起来，最低只需三个环境变量：
```yaml
# 直接对接 OpenAI
OPENAI_ACCESS_TOKEN=sk-proj-xxxx
# 或者走 OpenRouter 中转
OPENAI_ACCESS_TOKEN=sk-or-xxxx
OPENAI_URI_BASE=https://openrouter.ai/api/v1
OPENAI_MODEL=google/gemini-2.5-flash
# 或者本地 Ollama（免费、隐私、不联网）
OPENAI_ACCESS_TOKEN=ollama-local
OPENAI_URI_BASE=http://ollama:11434/v1
OPENAI_MODEL=llama3.1:13b
```
**本地 Ollama 的硬件门槛**官方写得很清楚：
- **8 GB 显存**：能跑 `llama3.2:7b` / `gemma2:7b`，基础聊天够用
- **16 GB 显存**：`llama3.1:13b` / `qwen2.5:14b`，大部分财务问答都稳
- **24 GB+ 显存**：推荐 `qwen3-30b`，函数调用和复杂推理最强（量化后 14 GB 也能跑）
> **真实体验提醒**：默认 token 预算只有 2048 上下文 / 512 响应，是给小模型准备的保守值。如果你用 GPT-4.1 或 Claude Sonnet 4.5，记得去 **Settings → Self-Hosting → AI Provider → Token Budget** 把这几项调大，否则聊天体验会被严重截断。
### 4.4 也可以不部署，直接试 Demo
懒得自己跑 Docker？**直接访问 https://app.sure.am**，用示例账号（`user@example.com` / `Password1!`）登录，能完整体验仪表盘、净值曲线、分类规则、AI 聊天的全部功能，再决定要不要自托管。
---
## 五、功能深评：哪些是"杀手锏"，哪些还在打磨
### 5.1 真正拉开差距的几个功能
**🌐 全资产聚合 + 净值第一视角**
这是 Sure 的灵魂。它不是"记账 app"，而是把你的银行存款、信用卡、贷款、股票、加密货币、房产、车辆全部塞进一张净值曲线图里，按日刷新。这是 Kubera、Monarch 这种年费上百美元的产品才有的视角。
**🔗 银行/券商同步 Provider 矩阵**
 Sure 代码里集成了一长串数据源，**每一项都由用户自己注册账号、自己填 Key**，Sure 不碰你的密钥：
- **银行**：Plaid（北美）、SimpleFIN、Enable Banking、TrueLayer、Lunch Flow、Wise、Mercury、Brex
- **区域银行**：Akahu（新西兰）、Up（澳洲）、Monobank（乌克兰）、Fio banka（捷克）
- **券商**：SnapTrade、Interactive Brokers、Questrade、Trade Republic
- **加密**：Coinbase、Binance、Kraken、CoinSpot、链上钱包（Polkadot、Cosmos Hub 自 0.7.6 起）
**📊 交易规则引擎 + Bayes 自动分类**
规则编辑器支持 contains / starts with / regex / not equal 等多种条件，支持拖拽排序、`Stop processing` 标记做例外处理，**激活前还能预览命中数量**——这是 Firefly III 那套规则引擎都没做到的细腻。
**🏦 贷款与信用卡账单日视图**
v0.7.6 新增的 Loan Overview 能展示"当前余额 vs 原始还款计划"的对比、每期本息拆分、保险费、结清日期，甚至支持浮动利率贷款记录利率变化。信用卡账单周期视图能展示最近一次账单周期和还款到期日。
**👥 家庭多用户 + 账户级权限**
同一个实例可以邀请配偶/家人，**每个账户可以单独设置谁能看、谁能编辑**，支持"个人预算 vs 家庭预算"并存。这是 Actual Budget（单用户）做不到的。
**📥 现成的迁移工具**
YNAB、Mint、Actual Budget 的导出文件都有专门 importer，CSV / QIF 也直接吃，转账自动配对、可撤销导入。
### 5.2 仍在打磨的部分
- **Spending vs Normal**（v0.7.6 的新功能）：把你某段时间的开支和自己的历史均值做对比，目前还是 preview feature，UI 和算法还在迭代。
- **移动端**：Flutter 客户端目前功能很少，登录 + 看账户余额 + 预算只读，**真正的"完整客户端"还是 Web**；原生 Swift iOS 应用刚宣布，没发布。
- **macOS 桌面壳**：Tauri 2 包了一层 Web 应用，本质就是"网页套壳"，DMG 没签名，首次打开要去系统设置里手动允许。
---
## 六、适用人群：你到底适不适合用 Sure
| 你是谁 | 适不适合 | 为什么 |
|---|---|---|
| **海外用户（美/加/欧/澳）**，想摆脱 YNAB/Monarch 订阅 | ⭐⭐⭐⭐⭐ | Plaid/SimpleFIN/Enable Banking 生态成熟，自动同步体验完整 |
| **国内用户**，习惯支付宝/微信/银行流水 | ⭐⭐ | 没有任何中国银行/支付宝/微信的同步 Provider，**只能 CSV 导入或手动**；但界面已本地化为中文，自建家用记账没问题 |
| **加密货币重度持有者** | ⭐⭐⭐⭐⭐ | Coinbase/Binance/Kraken 原生对接，链上钱包直连，多币种换算完善 |
| **家庭共同记账** | ⭐⭐⭐⭐⭐ | 多用户 + 账户权限隔离，这是 Actual Budget 等竞品的硬伤 |
| **开发者 / 自托管爱好者** | ⭐⭐⭐⭐⭐ | Docker 一键起、Helm 可上 K8s、有完整 REST API + MCP 端点可玩 |
| **只想简单记一笔花钱的小白** | ⭐⭐ | 杀鸡用牛刀，ezbookkeeping 或 Firefly III 更轻量 |
| **中小企业记账 / 报税** | ❌ | 明确不支持双式记账、发票、报税，这是个人/家庭工具 |
**你能从中获得的具体收益**：
1. **省订阅费**——YNAB 一年 109 美元、Monarch 一年 99 美元，Sure 是 0 元（自托管服务器成本忽略不计）。
2. **数据主权**——所有交易、余额、持仓都在你自己的服务器上，没有第三方在中间转手，不会被"用来训练推荐模型"。
3. **AI 按需开/关**——完全不用 AI 就是个纯本地 PFM；用 AI 也能选 Ollama 本地推理，零 API 成本。
4. **进阶玩法**——通过 MCP 把自己的财务数据接入 Claude Desktop，让 Claude 帮你做月度财务复盘。
---
## 七、竞品对比：在开源 PFM 这个赛道里，Sure 处在什么位置
| 产品 | 技术栈 | 协议 | 核心特点 | 短板 |
|---|---|---|---|---|
| **Sure** | Ruby on Rails + Hotwire | AGPLv3 | 商业级 UI、全资产聚合、家庭多用户、双 AI pipeline、MCP、投资组合强 | 无应用层加密、Plaid 需自配、无官方托管版 |
| **Actual Budget** | React + Node + SQLite | MIT | 信封预算法神作、端到端加密同步、轻量 | **单用户**、不追踪投资持仓、UI 较朴素 |
| **Firefly III** | PHP + Laravel | AGPLv3 | 规则引擎强、双式记账、生态插件多 | 界面"工程师风"、上手门槛高、无净值视角 |
| **Finlynq** | React + TypeScript | AGPLv3 | 单团队主导有清晰路线图、应用层每用户加密、原生 iOS/Android | 社区与生态还小、品牌认知度低 |
| **ezbookkeeping** | Go | MIT | 单二进制、超轻量、移动端友好 | 仅记账，无投资/净值/预算 |
| **YNAB**（商业） | SaaS | 闭源 | 零基预算法 / 教育社区 / UI 打磨 | $109/年、数据在第三方服务器 |
| **Monarch**（商业） | SaaS | 闭源 | 替代 Mint 的主流选择、连接数多 | $99/年、闭源 |
数据综合自 Awesome Selfhosted、iThub、Finlynq 对比页等。
> **客观地讲**：Finlynq 那篇对比里有些说法偏自我宣传——比如说 Sure 没有 MCP，但实际上 Sure 的 `/mcp` 端点早已上线，且有官方文档。真正 Sure 短板的是：**应用层数据加密、原生 iOS、清晰的官方路线图**这三项。
---
## 八、避坑指南：真实使用中会踩到的几个坑
### 8.1 性能与导入
- **大数据量 CSV 导入可能爆内存**：单次导入历史过长（几年流水）会撑爆默认 512 MB 容器限制，**分批导入或临时调大内存**。
- **App 有公开性能监控面板**（基于 Skylight），开发团队自己也承认"重型应用难免有性能问题"，欢迎社区 PR 优化。
### 8.2 银行同步的现实
- **Plaid 是北美的事**：欧洲用户 Plaid 根本不服务，得用 Enable Banking / TrueLayer / Lunch Flow 替代。
- **中国用户基本告别自动同步**：所有 Provider 都不覆盖中国大陆银行/支付宝/微信，**只能 CSV 导入或手动记账**，且中文界面翻译偶有生硬。
- **每个 Provider 都要你自己注册账号、自己付 API 费（部分）**：Sure 只是个"壳"，不代收数据费。
### 8.3 AI 配置的常见坑
- **旧版本只支持 gpt-4.1**：v0.6.5-alpha 之前的版本别试图换模型，会直接报错。
- **自定义 provider 必须显式设置 `OPENAI_MODEL`**：留空会 fallback 到 gpt-4.1，在 Ollama 里直接报"模型不存在"。
- **聊天和分类是两条独立管线**：就算你把 chat 切到 external agent，**后台分类仍然走 OpenAI 兼容 provider**，记得 `OPENAI_ACCESS_TOKEN` 必须设。
### 8.4 升级与运维
- **不要用浮动 tag**：CalVer 切换期间 `latest` 和 `stable` 的语义会变，**强烈建议在 `SURE_IMAGE_TAG` 里钉死具体版本号**。
- **升级前必跑一次备份**：`docker compose run --rm backup create`，备份数据库 dump 用 PG 17 工具打包，**恢复时也要用同版本镜像**。
- **隐私注意**：v0.7.6 起默认加入 PostHog 匿名产品遥测，不爽就在 `.env` 里设 `POSTHOG_FEEDBACK_ENABLED=false`。
- **首次部署数据库角色错乱**：如果之前用别的默认值初始化过 Postgres，会遇到 `ActiveRecord::DatabaseConnectionError`，官方文档给了删卷重置的命令。
### 8.5 法务与协议
- **AGPLv3 的传染性**：如果你二开 Sure 并对外提供网络服务，**必须开源你的修改**。商用要慎重。
- **"Maybe" 这个名字不能再用**：包括 Logo 和品牌词，官方 Fork 指南写得很明白，这是为了避免商标纠纷。
---
## 九、结语与行动建议
**Sure 是 2025–2026 年开源个人财务赛道最值得关注的黑马**——不是因为技术多炫，而是因为它把"商业产品级的完整度"和"自托管 + 开源 + AI 可插拔"三个原本很难兼得的特质捏在了一起。
**给你的具体行动路线**：
1. **今天就做**：去 https://app.sure.am 用 demo 账号玩 15 分钟，重点看仪表盘和净值曲线是不是你想要的感觉。
2. **这个周末做**：本地 Docker 跑一份，导入你 YNAB / Mint / 银行导出的 CSV，跑两周看分类规则够不够顺手。
3. **如果决定长期用**：部署到一台 24x7 在线的小 VPS（1 GB 内存就够），启用每日备份 profile，把镜像 tag 钉死在 `stable`，AI 用本地 Ollama（qwen3-30b 最稳）零成本跑。
4. **如果你是开发者**：Clone 代码读一下 `app/models/transaction.rb` 和 `docs/hosting/ai.md`，看看 Rails 单体在 AI 时代的工程范本是怎么写的——**这个代码库本身就是一份高价值教材**。
**终极评分（个人向）**：
- 产品完整度 ⭐⭐⭐⭐⭐
- UI/UX 打磨 ⭐⭐⭐⭐⭐
- 部署友好度 ⭐⭐⭐⭐
- 中国用户适配 ⭐⭐
- 社区活跃度 ⭐⭐⭐⭐⭐
- 长期可持续性 ⭐⭐⭐⭐（志愿者驱动，存在路线图不确定的隐患）
一句话收尾：**如果你想要一个"用得放心、数据在自己手里、AI 想开就开想关就关"的全功能个人财务系统，2026 年的开源世界里，Sure 就是目前最好的答案。**
