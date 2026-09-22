# agent-substrate/substrate

[GitHub URL](https://github.com/agent-substrate/substrate)


## Agent Substrate 深度评测：Google 开源的 Agent 执行运行时

> Google 开源的 Agent 执行运行时，用少量沙箱以 30 倍密度承载数百个有状态 Agent 会话，挂起恢复仅需亚秒级。

- **Tags**: Google开源, Agent沙箱, Kubernetes, gVisor, Serverless
- **Category**: 云原生基础设施, AI Agent, 开发工具

## Details

# Agent Substrate 深度评测：Google 把"Agent 基建"这件事想明白了
> 一句话总结：Agent Substrate（内部代号 ATE）是 Google 近期开源的一个"Agent 执行运行时"——它不帮你写 Agent，而是专门解决 Agent 在云端大规模、高密度、安全地"活着"这个最脏最累的基建问题。如果你在做 Agent 平台、多租户代码执行沙箱、或者想用 1/10 的机器跑出以前要 10 台的 Agent 并发量，这个项目就是为你准备的。
---
## 背景与痛点：为什么 Agent 需要一种新的"底座"
传统容器编排是给"常驻服务"设计的：你的 Web 服务器每一秒都在接请求，Kill 掉重启只是几百毫秒的抖动。但 Agent 的工作模式完全不一样——
- 一个 Claude Code 实例在等用户思考时，可能 **空闲了 90% 以上的 CPU 与内存**；
- 但一旦被唤醒，它需要 **带着上一轮的对话上下文、打开的文件、运行中的进程** 立即继续工作；
- 每个会话都要有 **强内核隔离**（Agent 跑的是不可信的 LLM 生成代码）。
如果按传统方式"一个 Agent 一个 Pod"，你会瞬间烧掉一台 Kubernetes 集群。而 Agent Substrate 的整个设计哲学就一句话：**"既然 Agent 大部分时间都在睡觉，就让一个'工人'轮流睡在几百张床上。"**
它由 Google 团队孵化（README 第一行就声明"非官方支持的 Google 产品"，避免触发 Google 的 OSS 漏洞赏金义务），同期发布的 **GKE Agent Sandbox** 就是它的托管版兄弟。GitHub 上目前 **2.7k stars / 366 forks / 322 open issues**，对一个 2026 年中才亮相的项目来说，热度已经非常可观。
---
## 核心亮点与架构剖析
### 1. Actor / Worker 模型：像"网吧机位"一样复用 Agent
这是整个项目最值得讲透的核心抽象。用个比喻：
> **Worker = 网吧里真实存在的电脑；Actor = 你买的那张"上网卡"**。你付钱拥有一个会话身份（含你的游戏进度、聊天记录、桌面），但你并不真的"拥有"一台机器。你登出（suspend）时，你的状态被快照到云端；下一个有人刷身份证坐下来（resume），网吧就把"任何一台空闲机器"恢复成"你上次离开时的样子"。
落到 Substrate 的实现里：
| 概念 | 是什么 | 对应传统 K8s 里的什么 |
|---|---|---|
| **Worker** | 一个真正在跑的 gVisor 沙箱 / microVM | 一个 Pod |
| **Actor** | 有状态的应用实例（一个 Agent 会话） | 逻辑上的"无 Pod"单元 |
| **atelet** | 节点上的 DaemonSet，负责真正做快照/恢复 | 类似 kubelet |
| **atenet-router** | 根据 `ate-target-actor` Header 把 HTTP 路由到正确的 Actor | 类似 Service/Ingress |
| **快照存储** | PostgreSQL（元数据）+ rustfs/GCS（内存与文件系统镜像） | PV + 对象存储 |
官方 Demo 展示了 **"8 个物理 Pod 承载 250 个有状态 Actor"（30× 超卖）**，挂起/恢复延迟 sub-500ms，吞吐超过 500 次/秒。这个数字的本质含义是：**Agent 会话的"冷启动"被压缩到人几乎感知不到的程度**。
### 2. 零信任内核隔离：gVisor + microVM 双轨
Agent 跑的是大模型生成的代码，不能信。Substrate 的隔离方案不绑定单一技术：
- **gVisor**（Google 自家的用户态内核）：拦截所有系统调用，把 Agent 代码和宿主内核隔开；
- **microVM**（Firecracker 风格）：每个 Actor 一个独立内核，适合对性能更敏感、对密度要求略低的场景。
关键是——Substrate 对这两种沙箱暴露 **完全一致的 API**（create / destroy / suspend / resume），你不用为切换沙箱改业务代码。这一点和 E2B 硬绑定 Firecracker、Modal 硬绑定自家微 VM 的做法明显不同。
### 3. 框架无关：这是它最"低姿态"的设计
README 里明确说它是 "low-opinion system"（低观点系统）。它不管你上面跑的是：
- **Google ADK**、**LangChain / LangGraph**、**CrewAI**；
- **Claude Code、CodeX、Antigravity** 这类有状态的编码 Agent；
- 甚至是 **MCP 服务器**——把每个 MCP 工具作为长驻 Actor 跑，天然解决了"无状态 MCP 容易冷启动慢"的痛点。
### 4. 深度绑定 Kubernetes，而非另起炉灶
Substrate 不是从零造一套调度系统，而是站在 K8s 肩膀上：
- Worker 就是 Pod，复用 K8s 的节点自动扩缩、HPA；
- 节点上通过 `ate.dev/substrate-version` 标签来钉住版本，保证数据面与控制面版本一致；
- 官方 Quickstart 一行脚本就可在 kind 集群跑通。
这种"补丁式创新"的好处是：你已有的 K8s 运维、监控、RBAC、GitOps 体系全部可以直接复用。这也是它和 Firecracker（裸 VM 抽象）、E2B（SaaS 形态）最大的架构差异。
---
## 上手门槛与部署体验
### 本地 kind 一键体验（开发场景）
```bash
# 1. 建 kind 集群 + 本地 registry
hack/create-kind-cluster.sh
# 2. 安装 ATE 控制面 + PostgreSQL + rustfs
hack/install-ate-kind.sh --deploy-ate-system
# 3. 安装 Counter Demo
hack/install-ate-kind.sh --deploy-demo-counter
# 4. 装 kubectl-ate 插件
go install ./cmd/kubectl-ate
```
然后创建一个 Actor 并打请求：
```bash
# 创建一个名叫 my-counter-1 的 Actor
kubectl ate create actor my-counter-1 -a ate-demo-counter --template counter
# 把 router 端口转发到本地
kubectl port-forward -n ate-system svc/atenet-router 8000:80
# 用一个 Header 指定 Actor，请求就会"魔法般"落到正确的沙箱
curl -X POST \
  -H "ate-target-actor: ate-demo-counter/my-counter-1" \
  -i http://localhost:8000/
```
这套 API 的精妙之处在于：**"路由到哪个 Actor"完全由一个 HTTP Header 决定**，你的业务代码不需要知道 Actor 当前在哪个 Pod、甚至有没有在跑。
### GKE 生产路径
官方提供了 `tools/setup-gcp` 脚手架，可以一条命令拉起 GKE + GCS 快照桶 + IAM Workload Identity，并支持 Cloud SQL 做 PostgreSQL 后端（IAM 认证、无密码）。这条路已经和 Google 内部 GKE Agent Sandbox 对齐。
### 上手门槛评估
| 维度 | 评级 | 说明 |
|---|---|---|
| 文档完备度 | ⭐⭐⭐☆ | README + Counter/Sandbox Demo 详实，但 API Reference 缺失 |
| 本地一键体验 | ⭐⭐⭐⭐ | kind 脚本非常顺滑 |
| 生产可用性 | ⭐⭐ | 官方明说"not ready for production，API 可能大改" |
| 学习曲线 | 偏陡 | 需要熟悉 K8s、Go 工具链、gVisor 概念 |
---
## 社区活跃度与生命力
- **节奏**：项目自称"VERY young"，早期重点在打磨核心与 Demo，对无关 PR 的合并会保守。
- **沟通渠道**：Google Group `ate-dev` + CNCF Slack（`#substrate-users` / `#substrate-dev`），每周四 PST 10-11 点固定社区会。
- **生态联动**：已被 **kagent**（CNCF Sandbox 项目，Istio 创始人打造）作为官方推荐运行时；与 **agentgateway**（Linux 基金会，Solo.io 捐赠）形成"运行时 + 网关"的黄金搭档。
- **第三方声音**：William Denniss（Google ADK/Agent Platform 产品经理）已专门撰文演示如何在 GKE 上把 Substrate 跑 ADK Agent；Sebastian Maniak、Solo.io 等基础设施圈知名作者也陆续跟进教程。
这种"Google 亲自下场 + CNCF 生态项目主动集成"的组合拳，意味着它大概率不会是"三个月热度就凉"的项目。
---
## 竞品对比：它到底独特在哪？
把 Agent Substrate 放到 2026 年"Agent 沙箱"赛道里看，竞争相当激烈：
| 项目 | 形态 | 隔离技术 | 密度/复用 | 部署门槛 | 适合谁 |
|---|---|---|---|---|---|
| **Agent Substrate** | 开源自托管 | gVisor + microVM | ★★★★★（30×） | 高（需 K8s） | 平台团队、Agent 基建 |
| **E2B** | SaaS / 开源版 | Firecracker microVM | ★★（一对一） | 极低 | 个人开发者、原型 |
| **Modal** | SaaS | 自家 microVM | ★★★ | 低 | 数据/AI 脚本团队 |
| **Daytona** | SaaS + OSS | 容器 | ★★ | 低 | 轻量代码执行 |
| **Fly Machines** | SaaS | Firecracker | ★★ | 低 | 已在 Fly 生态的团队 |
| **Blaxel** | SaaS | microVM（25ms resume） | ★★★★ | 低 | 商业 Agent 平台 |
| **K8s 原生 Pod** | 自托管 | Namespace/cgroup | ★（无复用） | 中 | 传统服务 |
> 数据综合自 E2B/Modal/Daytona 对比文章与 Substrate 官方说明
**Substrate 的独特位置**：它是这张表里 **唯一一个把"密度"作为第一性原理**、并且给你完整控制平面代码的自托管方案。E2B 好用但你永远看不到它的调度细节；Firecracker 只给你 VM，不给你"几百个 Agent 共享一台机"的编排。Substrate 填的正是这个空档——**"你要做 Agent 基建，但不想从零造 CRIU 调度器"**。
---
## 局限与不足（实话实说）
1. **明确声明不适合生产**：README 反复强调 API 会大变、无向后兼容承诺。ActorTemplate 这样的核心对象都已经在 2026 年 9 月被重构移除。**追新可以，上生产要慎重**。
2. **学习曲线陡**：你需要同时理解 Kubernetes、gVisor、CRIU 风格快照、Go 工具链。这不是"一条命令跑起来"的项目。
3. **依赖 Google 云的完整体验**：虽然 kind 本地能跑，但快照存储、IAM、GCS 集成的顺滑度显然是为 GKE 设计的，在 AWS/Azure 上要自己拼。
4. **社区资料少**：截至成文，中文社区几乎空白，能搜到的深度分析主要来自 Solo.io、kagent 文档和几个独立博客。
5. **监控/告警生态未成熟**：和 kagent、agentgateway 集成尚在推进，开箱即用的可观测性链路还不完整。
---
## 结语与行动建议
Agent Substrate 是一个 **"方向极度正确、但仍在快速演进"** 的项目。它的出现标志着行业共识：**Agent 不是又一个 Web 服务，它需要自己的"基建底座"**——就像 Docker 之于容器、Kubernetes 之于微服务。
### 不同角色该怎么对待它
- **平台 / 基建工程师**：现在就 fork 下来，在 kind 里跑通 Counter Demo，吃透 Actor/Worker 模型。等 v1 稳定时，你就是公司里最早吃透这套架构的人。
- **Agent 应用开发者**：暂时 **不用**直接学它，但你应该知道：当你说"我需要每个用户一个隔离的会话环境"时，未来对应的基建就叫 Substrate。
- **研究者 / 学生**：读源码的 `pkg/` 目录，重点看 Actor 生命周期状态机和快照恢复逻辑——这是近年 Cloud Native 领域少有的"全新抽象"。
- **正在选型 Agent 沙箱的团队**：如果目标是学习/POC，用 Substrate；如果目标是下个月上线，先用 E2B 或 GKE Agent Sandbox（托管版 Substrate），等开源版稳定再迁移。
### 建议的入坑三步
1. 看 YouTube 频道 `agent-substrate` 的 **"250 Actors on 8 Pods"** 演示，建立直觉；
2. 用 `hack/create-kind-cluster.sh` 在本地跑通 Counter Demo，体验 `ate-target-actor` Header 的路由魔法；
3. 读 `demos/sandbox` 里 Antigravity 的实现——它能让你看懂"文件系统状态如何在挂起/恢复间完美保留"，这是理解 Substrate 的钥匙。
一句话收束：**Agent Substrate 现在还不是"用"的时候，但绝对是"现在就要开始看"的时候。**
