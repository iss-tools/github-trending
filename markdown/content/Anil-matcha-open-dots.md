# Anil-matcha/open-dots

[GitHub URL](https://github.com/Anil-matcha/open-dots)


## Open Dots 深度评测：4.5k Star 的开源 AI Agent 工作区，核心价值是一套可读的 Agent 治理网关

> 开源自托管的 AI Agent 工作区，用「默认拒绝网关+审批流+审计日志」对标 OpenAI Dots、Manus 等闭源产品，MIT 协议、数据全本地。

- **Tags**: AI Agent, 开源, 自托管, Agent 治理, 数据隐私
- **Category**: 开源项目, AI Agent, 开发工具

## Details

# Open Dots 深度评测：一个 4.5k Star 的开源 AI Agent 工作区，是精心设计的「治理网关」，还是又一场流量狂欢？
> **一句话总结**：Open Dots 是 Anil Matcha 在 2026 年 10 月初发布的开源自托管 AI Agent 工作区，号称对标 OpenAI Dots、Meta Muse、Grok Bot、Claude Cowork、Manus Cue、Instinct 等一票闭源产品，24 小时斩获约 4.5k Star——它真正有价值的不是「能聊天」，而是把 **「deny-by-default 的动作网关 + 审批流 + 审计日志」** 这一企业级 Agent 治理范式，第一次以极简的方式塞进了一个普通人能本地跑起来的应用里。
---
## 一、背景与痛点：为什么 2026 年秋天需要一个「开源版 Dots」
要理解 Open Dots 为什么出现，得先看它的「假想敌们」在 2026 年 9 月底掀起的那一波发布潮。
**2026 年 9 月 29 日，OpenAI 发布了 Dots**——一种"始终在线"的 Agent，拥有云端计算机、可连接的应用，并且能在你离线后继续工作。几乎同一时间，Meta 推出 Muse（带 Sentinel 权限服务 + 独立安全虚拟机），xAI 推出 Grok Bot（多个 Bot 共享一台云计算机），加上此前 Anthropic 在 Claude 内嵌的 Cowork、Manus 的桌面端、Instinct 等，一整条「个人 AI Agent 工作区」赛道在两周内被几大巨头同时点亮。
这些闭源产品有几个共同的痛点，恰好构成了 Open Dots 的切入点：
- **数据出境**：Agent 要替你工作，就必须读到你的邮件、日历、文档。闭源产品的隐私条款里写得很明白——Meta 甚至默认使用清洗后的 Muse 交互数据做训练。
- **黑盒审批**：每家都有自己的 Custom Rules / Auto Review / Sentinel，但权限规则写在你够不到的后端，审计导出格式各家文档都语焉不详。
- **不可自托管**：企业 IT 部门想让 Agent 跑在内网？没门。
Auth0 在 2026 年 6 月的一篇文章里点透了行业的核心难题——**"大多数生产级 Agent 系统目前处理审批的方式还是零散的定制流程、内部策略引擎或 Temporal 这类工作流系统，没有标准化的权限模型"**。Open Dots 就是冲着这个空白去的。
**作者背景同样值得多看一眼。** Anil Matcha 的 GitHub 主页自我介绍是"构建开源生成式 AI 工具和应用，大部分由 muapi.ai 驱动"。他旗下有 27.9k Star 的 Open-Generative-AI、4.9k Star 的 AI-Youtube-Shorts-Generator、3.2k Star 的 awesome-generative-ai-apps 等一串明星项目，同时也运营着 awesome-muse-connectors（1.3k Star）、awesome-uncensored-ai-agents 等明显在蹭热点词的 awesome-list。换句话说，**这是一位非常擅长捕捉 GitHub 流量窗口、并且把开源项目与自家 API 生态深度绑定的独立开发者**。理解这一点，对判断项目的真实定位很重要——Open Dots 本身是通用的、不带 MuAPI 硬绑定，但它诞生于一个「开源营销矩阵」的语境里。
---
## 二、核心亮点：真正值得抄的是那个「动作网关」
Open Dots 官方 README 的定位非常克制："这是一个早期原型，不是这些闭源产品的功能等价替代品"。但它有几处设计，比「能不能跑起来」更值得专业人士研究。
### 1. 架构：FastAPI + Next.js + SQLite 的极简组合
整个系统的骨架用一张官方架构图就能说清：
```
Next.js 客户端 ── HTTP + SSE ── FastAPI API
                                  ├── SQLite + 加密设置
                                  ├── 可配置的推理适配器
                                  ├── Composio 连接器适配器
                                  └── 动作网关 + 审批 + 审计
                                        ├── 受限的工作区工具
                                        └── fake / Docker / 远程计算机
```
**这是一个教科书级别的「小而美」架构**。后端 Python + FastAPI，前端 Next.js，状态存 SQLite，凭据用 Fernet 加密落盘——没有 Postgres、没有 Redis、没有消息队列。它把 Agent 系统里最容易过度设计的部分全部砍掉，只留下一条清晰的调用链路。对于想研究「一个最小可用 Agent 工作区长什么样」的人来说，这套代码结构（`client/`、`server/app/routers/`、`server/app/services/`、`runtime/`）几乎是现成的教学案例。
### 2. Deny-by-Default 网关：整个项目最值得引用的思想
Open Dots 把所有敏感操作——读工作区、写工作区、操作计算机、调外部连接器——**全部塞进一个统一网关**，网关的默认策略是**拒绝**。每次调用都会产生审计事件，高风险动作会暂停等待用户批准。
打个比方，这就像把 Agent 装进一栋**只有一扇门、且门卫只认白名单的写字楼**。Agent 自己很聪明、想干什么都行，但每一单业务都要通过前台盖章，盖不了章的事直接办不了。这跟 Manus 用「文件系统作为上下文」迭代循环的思路不同，跟 Meta Muse 把 Sentinel 独立成权限服务其实是同一个思想，只是 Open Dots 用了更轻量的方式实现，并且**代码完全可读**。
### 3. 推理适配器：兼容 OpenAI Responses API，但故意不做 Chat Completions
这是个非常有趣的设计取舍。Open Dots 的推理层只实现了 OpenAI Responses 协议和原始 prediction 协议，明确写着 **"Chat Completions 协议未实现"**。这意味着你不能直接填 OpenAI 的 `https://api.openai.com/v1` 就用——你需要一个支持 Responses 协议的推理服务（OpenRouter、各类兼容层、或作者自家生态）。
**这是门槛，也是过滤器。** 它迫使使用者去理解 Agent 时代「模型调用」的新契约长什么样，同时也让作者可以避免为海量 Chat Completions 兼容性问题买单。从工程洁癖角度看是加分项，从开箱即用角度看是硬伤。
### 4. Computer Runtime：默认 fake，Docker 沙箱可选
它提供三档计算机运行时：`fake`（本地开发用，确定性输出）、`docker`（基于 Playwright 的容器，**只读根文件系统 + 丢弃 capabilities + 资源限制**）、`remote`（接外部计算机服务）。
值得注意的是，作者在文档里非常坦诚地写了 **"这不是针对恶意网站的加固沙箱"**——这种反营销的诚实表述，在一个蹭热点词成风的项目里反而是稀缺品。
### 5. Demo：从零到能聊的最短路径
官方 Quick Start确实是两段命令能跑起来的水平：
```bash
# 终端 1：起后端
git clone https://github.com/Anil-matcha/open-dots.git
cd open-dots/server
python -m venv .venv && source .venv/bin/activate
python -m pip install -r requirements.txt
export MODEL_API_KEY="your_api_key"
export MODEL_API_BASE_URL="https://your-inference-host.example/api/v1"
python run.py          # FastAPI 起在 127.0.0.1:8000
# 终端 2：起前端
cd open-dots/client
npm install && npm run dev   # Next.js 起在 127.0.0.1:3000
```
首次启动时，服务端会在 `~/.open-dots/.auth-token` 生成一个 owner token，把这个 token 粘进登录框就能进主界面。然后你可以在聊天框里输入：
```
/search 2026 AI Agent 治理最新进展
```
这条命令会走同一个网关，以 `search.web`（风险等级 external）的身份注册、调用 You.com MCP 服务器（**无 key 时走免费免登录通道**，有 key 则走付费接口），把结果作为上下文喂给模型，并在审计日志里留痕。
### 6. 模型无关 + MIT 协议 + 数据全本地
模型 ID、默认模型、API Key、自定义 header 全部存在本地 SQLite 里且加密；协议层 MIT 协议、可商用。这在「Agent 框架一般都用 AGPL / Elastic License 防云厂商」的当下，是一份相当宽松的礼物。
---
## 三、目标人群与收益
**它能为你解决什么问题，取决于你是谁。**
| 你是谁 | 能拿到什么 | 拿不到什么 |
|---|---|---|
| 想学 Agent 架构的工程师 | 一个能跑通的最小工作区，含审批流、审计、网关三件套，代码可读 | 不是 LangChain/LlamaIndex 那种可复用 SDK，更像一个应用 |
| 隐私敏感的个人用户 | 聊天记录、凭据、审计全在本地 SQLite，不经过第三方 | 模型调用仍要走外部 API，输出内容依然出境 |
| 企业 IT / 合规岗 | 一个可白盒审计的「Agent 权限网关」参考实现，可魔改后内部落地 | 项目自己明说：**多用户和生产级隔离没做** |
| 想做一个自己产品原型的独立开发者 | MIT 协议 + 极简架构，可以 fork 后改造 | 没有插件市场，连接器生态要靠 Composio 或自己写 |
---
## 四、竞品/同类对比
把 Open Dots 放回 2026 年 10 月的 Agent 工作区战场，它的位置非常清晰。
| 产品 | 形态 | 开源/自托管 | 工作环境 | 审批与审计 | 适合谁 |
|---|---|---|---|---|---|
| **OpenAI Dots**（2026.9.29 发布） | 闭源 SaaS | ❌ | 主 Dot 一台云计算机，本地访问可选 | Custom Rules + Auto-review，Activity View | 已经在 ChatGPT 生态里的 Pro/Business 用户 |
| **Meta Muse** | 闭源 SaaS | ❌ | Muse Secure VM + Sentinel 权限服务 | 细粒度 connector 动作控制，审计 trail | Meta 生态用户，重视权限粒度 |
| **Grok Bot**（xAI） | 闭源 SaaS | ❌ | 每用户一台云计算机，多 Bot 共享 | 成员/团队 connector 授权 + Auto Review | SuperGrok / Cursor 订阅者 |
| **Claude Cowork**（Anthropic） | 闭源 SaaS | ❌ | 主要本地文件操作 | Claude 现有权限模型 | 本地文件整理、PDF 处理为主的重度 Claude 用户 |
| **Manus** | 闭源 SaaS | ❌ | 云端长时间自主运行 | 一气呵成、少有逐步审批 | 想丢一个任务走人的研究者/构建者 |
| **Hermes Agent**（Nous Research） | 开源、MIT | ✅ | 自托管服务器，Telegram 等IM 入口 | 自带记忆/技能系统 | 想要「随身 AI 助手」的高级玩家 |
| **Open Dots**（本项目） | 开源、MIT | ✅ | 本地 + 可选 Docker 计算机运行时 | **deny-by-default 网关 + 审批 + 全量审计** | 想研究/魔改 Agent 治理逻辑的工程师 |
**与 Hermes 相比**，Open Dots 少了记忆和 IM 入口这两个「长期陪伴」的关键件，但胜在**把治理这块写得更清楚**；**与 Manus 这类云端 Agent 相比**，它输在能力上限，赢在数据不出门。
**与 LangGraph、AutoGen 这类框架相比**，它不是同一物种——框架提供的是积木，Open Dots 提供的是一间已经搭好墙、装好门禁的小屋。
---
## 五、局限与不足：必须直说的几条
**这个项目自己列的"Current Limitations"清单，比大多数同类项目诚实得多，但有几条必须重点放大**：
1. **单用户，单机，单进程**。没有多用户、角色、权限分配，SQLite 不支持多实例协调，session 存储只服务于一个 API 进程。它现在**不是可以扔到公司内网给同事共用的产品**，是一个「个人实验台」。
2. **推理协议窄**。只支持 Responses API 和 prediction 协议，主流的 Chat Completions 生态（Ollama、vLLM 默认暴露、国内绝大多数服务）**接不进来**。想用本地 Llama 之类的模型，得自己搭一层兼容层。
3. **Docker 计算机运行时不是安全边界**。作者原话是"不是针对恶意网站的加固沙箱"——如果你让 Agent 浏览不可信网页，凭据暴露、网络出口、镜像来源都需要你自己审查。**这其实是所有做 computer use 的产品的通病**，但闭源产品不会主动告诉你。
4. **连接器生态非常薄**。只内置了通过 Composio 接入的、刻意做窄的 GitHub issue 查询/创建，远没有 LangChain Tool 或 MCP 生态那种丰富度。想要自定义工具得自己改代码。
5. **没有持久记忆、没有定时任务、没有移动端**。这意味着它做不到「每天早上帮我整理邮件」这种 Dots 主打的核心场景——这恰恰是闭源产品真正的护城河。
6. **项目极新、单人主导、生态依赖敏感**。从 Trendshift 显示"24 小时 4.5k Star"来看，它属于典型的「热点窗口爆发型」项目。能不能挺过 3 个月的活跃维护期，是一个真正的未知数。放在作者那种「多项目并行 + 大量 awesome-list 导流」的运营风格下，需要观察这是长期投入还是又一次流量捕捉。
---
## 六、结语与行动建议
**Open Dots 的真正价值，不在于它今天能不能替代 ChatGPT Agent，而在于它把一个复杂问题降维成了可读代码。**
Agent 治理、审批流、审计、动作网关——这些过去只存在于闭源产品的安全白皮书和 Auth0 那类博客里的概念，现在有一份 MIT 协议、两千行左右就能看完主干的 Python + TypeScript 实现可以拿来读、拿来改、拿来塞进你自己公司内网。
**给不同读者的行动建议：**
- **如果你是 Agent 工程师**：值得花一个下午克隆下来跑通，重点读 `server/app/services/` 下网关、审批、审计相关的代码，思考它跟你自己项目里的权限设计有何差距。这是它最大、最不依赖项目存活的价值。
- **如果你是隐私敏感的个人用户**：可以先观望，等推理适配器支持 Chat Completions 或本地 Ollama、等持久记忆上线再说。今天装它，体验会低于 ChatGPT 网页版。
- **如果你是企业 IT 决策者**：把它当成一份「开源参考实现」而不是「可部署产品」，在合规评审里引用它的 deny-by-default 思路没问题，直接上生产还得再包一层。
- **如果你只想蹭一个新 Star 的仓库**：没必要。它现在功能等价于一个「带审批的本地 ChatGPT 前端」，新鲜感大于实用价值。
判断这个项目未来 3 个月是走向「被社区接力」还是「被下一个热点覆盖」，看三件事就够了：Issue 的响应速度、是否补齐 Chat Completions 支持、是否出现第二位实质贡献者。在那之前，把它当作一份**思路新颖的参考代码 + 一场关于 Agent 治理的公开课**来看待，收益最大，风险最小。
