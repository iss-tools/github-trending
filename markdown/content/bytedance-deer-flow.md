# bytedance/deer-flow

[GitHub URL](https://github.com/bytedance/deer-flow)


## 字节跳动 DeerFlow：开源 SuperAgent 运行底座

> 字节跳动开源的 SuperAgent 运行底座，集成沙箱、记忆与子智能体编排，让 AI 完成长程任务。

- **Tags**: SuperAgent, Workflow, ByteDance, Sandbox, 开源
- **Category**: AI 工具, 开发框架, 自动化

## Details

<|assistant|>我将点击仓库中的“Star History”链接，查看 Star 增长趋势，以辅助评估社区热度和成长性。</think>
# 一句话总结
- DeerFlow 2.0（鹿流）是字节跳动开源的“SuperAgent 运行底座（Harness）”：它不只聊天，更具备沙箱、记忆、技能与子智能体编排能力，能把“给目标→拆任务→调工具→执行并产出结果”的长程工作流端到端跑完。
---
## 背景与痛点
- 从“会说话”到“会干活”。大模型应用早期大多停留在“对话框返回文本/代码片段”的阶段，真正要落地做研究、写报告、改代码、画图甚至生成播客，仍需大量人工接力与脚本封装——导致“最后一公里”很难闭环。DeerFlow 最早以 Deep Research 课题切入，演进为 2.0 的“SuperAgent harness”，定位就是面向可执行、长程、需要工具与协作的任务。
- 作业粒度与协作复杂。真实世界任务是多步骤、多角色、带状态的：需要查阅资料、交叉验证、读写文件、生成图表与文案、保留上下文与偏好。传统的单一模型/单一工具调用难以稳定完成，且缺乏统一运行时与可观测性，部署与治理成本高。
- 安全与治理缺失。让 AI 真正“动刀”（运行命令、读写文件、调用外部 API），若没有隔离、审计与权限边界，会带来明显安全与合规风险。DeerFlow 把沙箱、技能策略与审计（Traces/Memory）做进运行时，把“能做什么”纳入治理框架。
## 核心亮点与功能剖析
### 1) 技术栈与架构
- 基于 LangGraph + LangChain 构建的多智能体图式执行。2.0 是推倒重写的 ground-up rewrite，与 1.x 无共用代码，采用 LangGraph 作为工作流编排，配合 LangChain 的工具与模型抽象，形成图式的可观测与可中断的执行流程。
- 部署形态与依赖：
  - 后端 Python（使用 uv 做依赖管理与虚拟环境），前端 Node.js（Next.js）。官方要求 Node.js 22+ 与 uv。
  - 模型无关（OpenAI 兼容 API），推荐长上下文（100k+）、强推理、强工具调用的模型；README 推荐搭配火山引擎的豆包系、DeepSeek、Kimi 等（编码、推理、长文场景各有所长）。
- 存储与状态：
  - LangGraph Checkpoint + RunStore 管理运行状态与恢复；2.0.0 对“运行再水合/中断/取消”做了重要改进，确保重启后可恢复、跨 Worker 取消安全。
  - DeerMem 长期记忆：以 SQLite + FTS5/BM25 做检索，支持分 Agent 的 facts 与全局 summaries；v2 迁移脚本与回写安全、增量重建等细节到位。
- 子智能体（Sub-Agents）与编排：主 Agent 做规划，按需拉起上下文隔离的子 Agent 并行执行，再汇总结果。任务分配与结果回传通过图式边与状态传递，并有“收据/溯源”机制用于验证与审计。
### 2) 沙箱与文件系统
- 多模式 Sandbox：
  - Local、Docker（含 AIO 一体化容器）、Kubernetes（通过 Provisioner）等多种执行模式，满足从本地开发到企业 K8s 集群的部署需求。AIO 容器内集成浏览器、Shell、文件系统、MCP Hub、VSCode Server、Jupyter 等，便于子智能体在“真实计算机环境”中操作。
- 文件系统边界：每个线程得到自己的 `/mnt/user-data` 视图（workspace、outputs、skills、uploads），并支持权限与安全策略（如路径阻断、SSRF 防护、网络隔离）。支持“浏览器 live 控制”，基于 Playwright，可在沙箱内导航、点击、填表、截图（可通过白名单/SSRF 策略加固）。
- 安全机制：
  - Docker 默认仅绑定 127.0.0.1；对外暴露需启用认证网关、IP 白名单与网络隔离。README 提醒“Gateway Admin ≈ 代码执行权限”。
### 3) 技能（Skills）与工具（Tools）
- 技能即 Markdown。每个技能目录下包含 `SKILL.md`，用于定义工作流、最佳实践与所需工具。支持按需/渐进式加载，避免一开始塞满上下文。可通过 `/skill-name` 显式触发单次技能启用；技能的 `allowed-tools` 策略生效于工具可见性与执行，把“能做什么”收拢到可治理范围。
- 内置技能与扩展：官方内置 deep-research、github-deep-research、data-analysis、slide-creation、image-generation 等技能；支持自定义技能与 `.skill` 安装包，并集成 SkillScan 进行安全扫描（离线静态分析 + LLM 审查）。
- MCP 集成与工具扩展：支持 HTTP/SSE 与 stdio MCP 服务器，可挂接第三方工具与数据源；支持 OAuth、超时与命名前缀策略。工具层可扩展、可审计、可限流。
### 4) 上下文工程与记忆
- 上下文精简与重放：支持手动上下文压缩与“Replay”模式（回放多轮对话与步骤），便于复现与教学。官网提供了多个可公开回放的历史会话案例（例如“埃菲尔铁塔与世界最高建筑对比”等）。
- 长期记忆（DeerMem）：支持 user/history summaries 与 per-agent facts 的分桶存储与检索；支持增量索引重建与冲突检测，可离线导入与清理。Memory 注入可配置为 middleware/tool 两种模式。支持中文分词（memory-zh extra）。
### 5) 集成与可观测性
- 多 Tracing 支持：LangSmith、Langfuse、Monocle（OpenTelemetry）三者可并行启用，支持将 trace_id、user_id、session_id 等透传，便于在监控平台聚合分析与回溯。官方 Demo 与文档中多次强调可观测性对“可治理 Agent”的重要性。
- 多渠道接入：支持 Slack、Telegram、Discord、Feishu/Lark、钉钉、微信、企业微信等 IM 通道，用户可在“聊天软件”中直接与 DeerFlow 交互并执行任务；支持命令（如 `/new`、`/agent use`）与流式响应。
### 6) 多入口形态
- Web UI（浏览器）、Terminal Workbench（TUI，基于 textual）、嵌入式 Python 客户端（`DeerFlowClient`），三者共用同一份 `config.yaml` 与技能/记忆/沙箱配置。适合不同习惯的开发者与运营人员。
## 上手门槛与部署体验
- 一键向导：运行 `make setup`（交互式向导），几分钟内生成 `config.yaml` 并将密钥写入 `.env`，后续可用 `make doctor` 诊断环境。新手友好。不过，依然需要准备至少一个 OpenAI 兼容的模型 API Key 与相关环境。
- Docker 一键部署（推荐）：
```bash
git clone https://github.com/bytedance/deer-flow.git && cd deer-flow
make setup    # 交互式向导生成 config.yaml/.env
make docker-init   # 预拉取沙箱镜像（只需一次）
make docker-start  # 启动服务
# 访问 http://localhost:2026
```
- 资源建议：官方明确给出“起步/推荐”配额：本地或 Docker Dev 场景建议 4 vCPU/8GB 起步、8 vCPU/16GB 推荐；长运行服务器建议 8–16 vCPU 与 32GB 起步。2 vCPU/4GB 基本不可用。
- 文档与帮助：README 非常详尽，涵盖快速开始、高级配置、Sandbox 模式、MCP、IM 渠道、Tracing、扩展（Extension）与安全须知，并给出 Deployment Sizing 与多个命令示例；官网还有 Why DeerFlow 等理念文档与 Demo。
## 社区活跃度与生命力
- GitHub Trending：官方 README 自述 2026-02-28 版本 2.0 发布后登上 GitHub Trending 第一位，第三方文章也给出 6–7 万量级的 Star 数据，说明短期爆发力强、社区关注度高。而 2.0.0 的 Release Notes 显示里程碑合并了 182 个 PR，且有 40 位贡献者参与，证明项目在持续迭代与维护。
- 2.0.0 重写后的持续优化：Release Notes 包含性能优化（索引化消除 O(n) 扫描、glob/grep 性能）、安全加固（symlink 上传防护、zip-bomb 防御、Docker socket 挂载策略等）、内存/子智能体/前端的 Bug 修复与功能增强，说明维护者在稳定性与安全性上投入很多。
- 周边生态：集成了 MCP、LangSmith/Langfuse/Monocle、以及飞书/钉钉/企微等国内常用 IM，并与 Claude Code、Codex 等 ACP/编码器有官方技能联通；官网也提供 LLM Space 作为配套桌面原型工具，扩展生态边界。
## Demo/代码示例
### 示例 1：Python 嵌入式客户端（最简调用）
```python
from deerflow.client import DeerFlowClient
client = DeerFlowClient()
# 非流式聊天（线程 ID 可自定义）
response = client.chat("Analyze this paper for me", thread_id="my-thread")
# 流式聊天（按事件逐条打印 AI 回复与工具结果）
for event in client.stream("hello"):
    if event.type == "messages-tuple":
        t = event.data.get("type")
        if t == "ai":
            print(event.data["content"])
        elif t == "tool" and "artifact" in event.data:
            print(event.data["artifact"])
```
### 示例 2：通过内置技能激活与目标管理（HTTP/Gateway 统一语义）
```python
# 设定会话目标（一次设置，多轮有效）
client.set_goal("thread-1", "finish the implementation and make all tests pass")
# 使用内置技能分析上传的数据集
client.stream("/data-analysis analyze uploads/sales.csv", thread_id="thread-1")
# 上传文件供后续处理
client.upload_files("thread-1", ["./report.pdf"])
```
### 示例 3：Docker 生产部署与停止
```bash
make up      # 构建镜像并启动所有生产服务
make down    # 停止并清理容器
```
服务会先等待 `/health` 就绪再返回成功；若健康检查超时会打印容器状态与日志。
## 目标人群与收益
- 研究与内容创作者（市场研究、技术报告、白皮书、图文/播客）：DeerFlow 内置 deep-research、github-deep-research 与报告生成技能，配合“人在回路”的交互与多步检索、交叉验证，能显著缩短资料搜集与初稿撰写时间。官网有完整“图文报告 + 播客生成”的视频演示。
- 数据与业务分析人员：可通过 `data-analysis` 等技能读取 CSV、数据清洗、生成图表与结论性文档，尤其适合需要“数据 → 图表 → 文字 → 可交付”的闭环任务。收益在于把“重复性清洗与作图”自动化，并把过程留痕可审计。
- 开发者与研发团队：DeerFlow 的 TUI、嵌入式 Client 与 Claude Code 技能，适合作为“研发自动化脚手架”：执行代码重构、测试、文档生成等，并利用沙箱避免破坏宿主环境。对于 Agent 开发者，它本身是一个可学习的 Harness 设计参考（基于 LangGraph 的多智能体、可扩展技能与策略边界）。
- 企业/团队：内置 RBAC、审计 Trace、IM 渠道、计划任务（cron/once）与企业级部署建议（隔离、认证网关、白名单），使其具备“企业内 Agent 平台中间层”的潜力，常见落地路径为：研究报告线、数据分析线、研发自动化线“三线先行”，小切口试点、稳边界推进。
## 竞品/同类对比（简要）
- 与“纯聊天/助人型 Agent 平台”（如通用问答/知识库问答系统）相比：DeerFlow 的定位不是 FAQ，而是“长任务、可执行、可治理”，重点在于沙箱、技能策略、子智能体编排与审计；若仅做问答，Dify、FastGPT、RAGFlow 等更轻量。
- 与“工作流引擎（Airflow、DolphinScheduler 等）”相比：DeerFlow 的“工作流”是 Agent 驱动、图式、可中断与动态规划（re-planning）的，而传统调度器偏静态 DAG。 DeerFlow 更适合“半结构化、需要推理与人机协作”的任务。
- 与“单 Agent 工具链（LangChain/LangGraph 直接使用）”相比：DeerFlow 提供了“电池自带”的运行时，内置 Memory、Sandbox、技能管理与 HTTP/TUI 等界面，降低从 0 到 1 的工程成本，但要求接受其约定与抽象。适合想要“开箱即用”且需要“治理与安全”的团队。
## 局限与不足
- 部署门槛与资源需求：需要 Docker（建议 4–8 vCPU、16GB 起步）和模型 API 配置；完全本地化运行需要自备推理服务（例如 vLLM），对个人开发者或小团队有门槛。Windows 支持相对有限（推荐使用 Git Bash）。
- 安全与治理复杂度：功能越多、越灵活，治理越复杂。沙箱、技能策略、RBAC 与审计机制虽完备，但需要 Ops/安全团队参与设计与维护。开放 IM 渠道与对外开放端口时，必须严格遵守安全建议（认证网关、白名单、VLAN 隔离等）。
- 学习曲线：概念层涉及 LangGraph、技能策略、记忆模式与 Tracing；配置层涉及 YAML/.env 与多个运行模式。官方文档全面但体量较大，新手最好从 Docker 快速开始与官方 Demo Replay 入手。
- 状态与生态变动风险：DeerFlow 仍在快速迭代（如 2.0.0 的 Breaking change 与大量修复），一些 API 与配置未来可能微调；企业在生产落地时应锁定版本并关注升级路径。
## 结语与行动建议
- 终极评判：DeerFlow 2.0 把“Agent 真正能干活”所需的几个关键件——沙箱、记忆、技能/工具、子智能体编排与可观测性——打包成一个可自托管、可治理的开源运行时，是目前少见的“面向长程任务”的 SuperAgent Harness。适合需要从“聊天→执行”跨越、并愿意投入工程治理能力的团队。MIT 协议也为商用与二次开发扫清了障碍。
- 行动建议：
  - 若你是个人开发者/研究者：先用 Docker 一键起一个本地实例，跟随 README Quick Start 与官网 Replay Demo 走一遍；试用 `deep-research` 与 `/skill-name` 等技能，感受“长程任务”闭环。再按需尝试嵌入式 Python 客户端接入你自己的脚本。
  - 若你是中小团队：选一条落地线（研究报告 / 数据分析 / 研发自动化）做 PoC，限制开放工具组（如先只开放 research 工具组，暂不开 bash），沉淀技能包与审核流程，再考虑扩大到 IM 渠道与多用户环境。
  - 若你是企业决策者：把 DeerFlow 视作“Agent 平台中间层”，重点投入“策略层（权限/审计）+ 沙箱池 + 模型与工具接入”，而不是包装成“万能员工”。以小切口试点推动工程与安全团队的共同治理。
