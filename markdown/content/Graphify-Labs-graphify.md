# Graphify-Labs/graphify

[GitHub URL](https://github.com/Graphify-Labs/graphify)


## Graphify 深度评测：把代码库变成 AI 编码助手能“读懂”的知识图谱

> 一个开源 CLI 工具，把代码库解析成知识图谱，让 Claude Code、Cursor 等 AI 助手更懂你的项目、更省 token。

- **Tags**: 知识图谱, tree-sitter, AI 编码助手, 代码分析, Claude Code
- **Category**: 开发工具, AI 编程, 开源项目

## Details

# Graphify 深度评测：把你的代码库变成 AI 编码助手能"读懂"的知识图谱
> 评测对象：**Graphify-Labs/graphify**（https://github.com/Graphify-Labs/graphify）
> 项目类型：开源 CLI 工具 + AI 编码助手 Skill（兼顾"GitHub 开源项目"与"开发者工具"两类维度）
> 评测基线：v0.9.9（第 155 个 release）、Apache-2.0 协议、Y Combinator S26 批次
---
## 一句话总结
**Graphify 是把整个代码库（含文档、SQL、PDF、配置甚至视频）解析成一张可被 AI 助手直接查询的知识图谱的开源 CLI，它最大的卖点是"Code 用 tree-sitter 纯本地解析、零 token 成本、边都能解释"，最值得关心的问题是"在中小项目里 Claude 经常干脆绕过它直接 grep"。**
---
## 背景与痛点：为什么突然冒出来一堆"Code Knowledge Graph"
如果你用过 Claude Code、Cursor 或 Codex 处理过一个上百文件的真实项目，几乎一定会撞上同一个瓶颈：**AI 每次会话都从零开始**。你问"OAuth 是怎么连到数据库的"，它会发起一长串 `Grep`、`Glob`、`Read`，烧掉半个上下文窗口，最后给你一个漏掉关键工具函数的答案。Anthropic 自己的工程文章也指出，agent 的 token 消耗大约是普通对话的 4 倍，而 token 用量对最终效果的影响能解释 80% 的方差。
Grep 找得到字符串，却找不到"为什么这个函数重要""改了它会炸到谁"。这就是 Graphify 这类工具共同的赌注：**与其让 agent 每次现场重新推理架构，不如把代码结构预先算好，让 agent 拿着地图走路**。
之所以过去一个季度这个品类突然爆发，是因为大家同时被同一件事折磨：agent 烧钱。GitNexus、codebase-memory-mcp、CodeGraph、code-review-graph、Graphify 都在几个月内独立把同一个想法做成了产品。Graphify 在其中跑得最快——根据 Dealroom 报道，它是 YC 历史上第五个达成 10 万 star 的开源项目，也是 YC batch 期间第一家做到这件事的公司。
**Graphify Labs 由 Safi Shamsi 创立**，伯明翰大学数据科学硕士（2025 届），YC S26 批次成员，公司同时在做 Rust 写的企业级知识图谱 Penpax。也就是说，这个项目不是社区玩具，而是带着明确商业化路线（Graphify Cloud）的创业公司主力产品。
---
## 核心亮点与功能剖析
### 亮点 1：真正的图，不是"换皮向量库"
Graphify 在 README 里写得非常直白："**Not a vector index. No embeddings, no vector store: a real graph you traverse.**"
这意味着它不做把代码切成 chunk 然后算余弦相似度那套事，而是用 tree-sitter 把源码解析成 AST，再从 AST 里抽出真实的结构关系——`calls`、`imports`、`inherits`、`mixes_in`——跨文件连成一张有向图，支持约 36–40 种编程语言。
打个比方：**向量库像是把整本书撕成碎片按"意思相近"分堆，Graphify 像是给整本书画了一张人物关系图**——你能问"哪两个角色之间路径最短"，而不是"哪段文字和我的问题最像"。
在这张图之上，它跑 **Leiden 社区检测算法**，把代码自动聚成若干"子系统"（communities），同时识别出"**god nodes**"——连接数最高的枢纽概念，相当于一进项目就能立刻看到"所有请求都要路过 `Request` 这个节点"。
### 亮点 2：每条边都解释来源（EXTRACTED vs INFERRED）
这是 Graphify 区别于大多数"代码图谱"工具的差异化设计。每一条边都带标签：
- **EXTRACTED**：直接从源码里读出来的（如 `import` 语句）
- **INFERRED**：由 Graphify 自己解析推断出来的（如间接依赖）
在 FastAPI 代码库上的真实输出长这样：
```
$ graphify explain "APIRouter"
Node: APIRouter
  Source:    routing.py L2210
  Community: 2
  Degree:    47
Connections (47):
  --> RequestValidationError [uses] [INFERRED]
  --> Dependant [uses] [INFERRED]
  --> .get() [method] [EXTRACTED]
  <-- __init__.py [imports] [EXTRACTED]
```
**对工程师来说，这个设计等于把"图的置信度"也交给了你**——你不会把一个模型瞎猜的关系当成事实。这也是为什么 Graphify 的 README 特意强调"deterministic AST parsing"：**确定性**在这里是个卖点，因为 RAG 类工具的不稳定性主要就来自语义检索。
### 亮点 3：一次产出三件套，人机都好用
跑 `/graphify .` 会生成三个文件：
| 文件 | 给谁用 | 长什么样 |
|---|---|---|
| `graph.html` | 人 | 交互式可视化，可点击节点、过滤、搜索 |
| `GRAPH_REPORT.md` | 人 + AI | 关键概念、意外连接、建议提问 |
| `graph.json` | AI + 脚本 | 完整图数据，可反复查询不需重读源码 |
这个组合很聪明：**人在看 HTML 时理解架构，AI 在 query JSON 时省 token**。团队里一个人跑完把 `graphify-out/` 提交进仓库，所有人 pull 下来就共享同一张图。
### 亮点 4：不止代码，文档、PDF、SQL、视频都能进同一张图
这是 Graphify 相对同类工具最显著的功能广度。除了代码，它还能把：
- **SQL Schema**（含 Live PostgreSQL introspection，`--postgres DSN` 直接对接数据库）
- **Terraform / HCL**
- **PDF、Word、Excel**
- **图片**
- **视频 / 音频**（本地 faster-whisper 转写）
全部映射到同一张图里。意味着你问"这个 API 跟当年那张架构设计图对得上吗"，它能在一张图里回答。`graphify add <youtube-url>` 甚至能把一个视频转写后作为节点加进去。
### 亮点 5：25+ AI 助手的一次性 Skill 注册
`graphify install` 会自动检测你装了什么助手，把 skill 注册进去——Claude Code、Cursor、Codex、Gemini CLI、GitHub Copilot、Aider、OpenCode、Kimi Code、Devin、Kiro、Amp、Factory Droid 等都被官方列在支持表里。
它还会按平台特点区分接入方式：
- **Hook 平台**（Claude Code、Gemini CLI）：在每次 Grep / Glob 之前自动触发提醒，引导 agent 优先查图
- **Instruction 平台**（Codex、Cursor、OpenCode）：写入 `AGENTS.md` / `.cursor/rules/` 等持久指令文件
这是它真正"工程化"的部分——**不光建图，还负责让 agent 在正确的时候想起去看图**。
### 亮点 6：隐私设计相当坦诚
- 代码文件：tree-sitter 纯本地，**零 API 调用，零 token 成本**
- 视频/音频：本地 faster-whisper
- 文档/PDF/图片：需要 LLM，可通过 `--code-only` 跳过
- 数据驻留：可强制 `--backend ollama` 全本地，或按 `GEMINI_API_KEY → Kimi → Claude → OpenAI → DeepSeek → Azure → Bedrock → Ollama` 优先级自动选择
- **零遥测、零使用追踪、零 analytics**
对要做合规、安全审计的团队，这些细节都很关键。
---
## 上手指南：5 分钟看懂怎么用（H3）
### 安装
```bash
# 注意 PyPI 包名是 graphifyy（双 y），命令是 graphify
uv tool install graphifyy
# 或 pipx install graphifyy
graphify install   # 自动检测助手并注册 skill
```
需要 Python 3.10+。
### 三条最核心的命令
```bash
# 1. 在项目根目录建图（在 Claude Code 里输入 /graphify .）
/graphify .
# 2. 用自然语言查
graphify query "what connects auth to the database?"
# 3. 追溯两个概念之间的最短路径
graphify path "UserService" "DatabasePool"
graphify explain "RateLimiter"
```
第三条会输出 FastAPI 示例里那条著名的三跳路径：
```
FastAPI --uses--> DefaultPlaceholder <--references-- get_request_handler() --references--> ModelField
```
**零文件被打开**——这就是 Graphify 的效率论据。
### 团队工作流
```bash
graphify hook install   # git commit 自动重建，纯 AST，零 API 成本
graphify merge-graphs a.json b.json   # 多仓库合并
graphify prs            # PR 看板 + 影响面分析
```
它会自动设置 merge driver 防止两个人同时提交 `graph.json` 产生冲突。
### 常用可选项（extras）
```bash
uv tool install "graphifyy[pdf]"       # PDF
uv tool install "graphifyy[office]"    # docx / xlsx
uv tool install "graphifyy[video]"     # 视频转写
uv tool install "graphifyy[ollama]"    # 完全本地
uv tool install "graphifyy[mcp]"       # MCP stdio server
uv tool install "graphifyy[all]"       # 全家桶
```
还有一个很实用的小项：`graphifyy[chinese]`，加载 jieba 做中文分词，让中文 query 命中率更高。
---
## 目标人群与收益
| 人群 | 核心痛点 | Graphify 给你的收益 | 推荐度 |
|---|---|---|---|
| **接手陌生大型 monorepo 的工程师** | 几千个文件不知道从哪读起 | god nodes + 社区图，30 分钟摸清架构骨架 | ⭐⭐⭐⭐⭐ |
| **带 AI 助手做日常开发的独立开发者** | Claude 每次都重新摸文件、烧 token | 大型项目上确实省 token，中小项目收益有限 | ⭐⭐⭐ |
| **做 Code Review 的 Tech Lead** | 评估 PR 影响面要靠脑补 | `graphify prs` 提供图谱影响分析 + 合并顺序风险提示 | ⭐⭐⭐⭐ |
| **架构师 / Onboarding Mentor** | 反复讲同样的"为什么这样设计" | `--wiki` 生成 Markdown Wiki + `GRAPH_REPORT.md` 当 onboarding 文档 | ⭐⭐⭐⭐ |
| **合规/安全敏感团队** | 代码不能上云 | 纯本地 AST + Ollama 后端，零数据外泄 | ⭐⭐⭐⭐⭐ |
| **个人 side project（< 50 文件）** | 没有痛点 | 建图比 bug 本身还慢，性价比低 | ⭐ |
Towards AI 那篇对比文章里有一句很直白的提醒："**一个 40 文件的小项目，建图的时间比找 bug 本身还长**"。这跟你买数据库的逻辑一样——先问"我的团队有没有这个问题"，再问"省多少 token"。
---
## 竞品/同类对比
这是当前"code knowledge graph for AI agents"这个赛道的第一梯队名单：
| 维度 | **Graphify** | codebase-memory-mcp | CodeGraph | GitNexus | code-review-graph (CRG) |
|---|---|---|---|---|---|
| **输入广度** | 代码 + 文档 + PDF + 图片 + 视频 + SQL + Terraform | 仅代码 | 代码为主 | 浏览器端，代码为主 | 代码 |
| **解析方式** | tree-sitter AST（36+ 语言）| tree-sitter + LSP 混合 | tree-sitter | 浏览器内解析 | tree-sitter + SQLite |
| **是否向量库** | 否 | 否 | 否 | 否 | 部分功能有 embedding |
| **查询接口** | CLI + Skill + MCP + HTML 可视化 | 纯 MCP server | MCP tools | 浏览器 UI | MCP + SQLite 直查 |
| **主要受众** | 人 + agent 双用 | agent 为主 | agent 为主 | 单人浏览器场景 | agent + PR review |
| **可视化** | graph.html + wiki + Mermaid callflow | 弱 | 弱 | 强（浏览器原生）| 弱 |
| **商业化** | Graphify Cloud（14 天试用）| 开源 | 开源 | 开源 | 开源 |
| **Star 量级** | ~100K（最快纪录）| 中等 | 中等 | 中等 | 小 |
| **适合场景** | 大型 monorepo + 团队 + 文档混合 | 追求低延迟纯代码 agent | 重 agent 场景 | 不想装 server | 关心 PR 影响面 |
参考来源：
**一句话定位**：Graphify 是这个赛道里**功能广度最广、可视化最用心、对人类工程师最友好**的那个，代价是工程链路更重，在极端 monorepo 场景会遇到性能瓶颈（下文详述）。如果你只关心"agent 拿到代码结构就够了，不需要人类看图"，codebase-memory-mcp 这种窄而深的工具可能更精炼。
---
## 局限与不足（这部分信息量最大，请重点读）
### 1. 真实用户反馈：Claude 会"绕过"它
Alex Rusin 的评测里有一条致命观察：他在 blog app 项目上正确装好 Graphify 并跑了 `graphify claude install`，然后让 Claude 做一个真实 feature。完事后问 Claude "你刚才用了 Graphify 吗"，Claude 说**没用**——它觉得任务小、自己知道该读哪些文件，就跳过了图谱直接 grep。同样的情况在几个大项目里反复发生，最终他把 Graphify 从所有项目里卸载了。
Kevin Kinnett 的评测则指出了另一个具体 bug：**他跑出来的 `GRAPH_REPORT.md` 是空白的**，而整个 Claude Code 工作流恰恰建立在"agent 先读这个报告获得架构概览"的假设上。结果变成了一个自挫循环：
> Claude 被提醒去看图 → 去看 → 报告没内容 → 回到普通 grep → 但 hook 每次都触发
他在结论里写得比较公允："**Graphify feels like a real idea with an early-tool problem, not a bad idea with a marketing problem.**"
### 2. 大 monorepo 上的严重性能问题
GitHub issue #341 是一个值得所有想在大仓库里用它的人认真读的帖子：
- 语料规模：55,903 个文件，约 45 万节点、69 万边
- 服务器：96 核 Xeon 8163 @ 2.5GHz
- 现象：`graphify update` 跑了 **114 分钟仍未完成**，最后被手动 kill
- 根因：`analyze.py` 里的 `nx.betweenness_centrality(G)` 是 **O(V × E)**，对他们的图相当于 3100 亿次操作，单线程 Python 根本跑不动
作者给了 timeline：AST 提取 6 分钟（缓存命中）、图构建 5 分钟、Leiden 聚类 15 分钟——这些都还好，瓶颈在 `suggest_questions` 的介数中心性计算上。
**结论**：Graphify 自己 README 里也承认 Graphify Cloud 才是给 monorepo 用的方案，开源 CLI 在超大仓库上确实会卡。
### 3. Token 节省的数字要看场景
GitHub issue #985 是用户真实测出来的反例：
- 语料：1484 个文件，约 79 万词，10202 节点、17610 边
- 结论：对很多常见 query，**Claude Code 原生 grep + read 的 token 消耗等于甚至低于调 Graphify**
- 调用 3–4 次 `graphify query` 就吃掉 8K+ token，而同样的问题 Claude 自己 grep 反而更便宜
Towards AI 的对比文章也有同样的提醒："71x fewer tokens" 这个数字是真的，但它是对的场景下的数字——**对错场景它反而是负优化**。
### 4. 缓存与配置的隐形成本
README 里有一条容易被忽略的建议：把 `graphify-out/` 加进 `.claudeignore`，否则每次 Graphify 写文件都会让 Claude Code 的 prompt cache 失效，**下次会话强制全量重传**。
类似的小坑还有不少：issue #3941 抱怨 SKILL.md 从来没告诉用户版本控制相关事项；issue #3166 描述了后台子 agent 退出导致 build 被中断、没有任何 artifact 写出的情况。
### 5. PyPI 包名混乱
官方包是 `graphifyy`（双 y），命令是 `graphify`（单 y），README 特意警告 PyPI 上其他 `graphify*` 包都不相干。这是历史上曾经有命名冲突留下的痕迹，对新手来说是个小小的坑。
### 6. 商业化路线的双刃剑
Graphify Cloud 主打"always-on 图 + 跨仓库 + 形式化验证 + Sentry/Jira 连接器 + 80% token 节省"，但这是付费产品。开源 CLI 在跨仓库、持续更新这些高级场景上能力明显弱于云版，这意味着**重度用户最终会被推向付费墙**——对一个 YC S26 公司来说完全可以理解，但选型时要心里有数。
---
## Benchmark 简评：数字是真的，但要自己复跑
Graphify 的 `BENCHMARKS.md` 公布了几个数：
| 基准 | 指标 | Graphify | 对比 |
|---|---|---|---|
| LOCOMO (n=300) | recall@10 | **0.497** | mem0 0.048，supermemory 0.149 |
| LOCOMO (n=300) | QA 准确率 | 45.3% | supermemory 49.7%，mem0 27.3% |
| LongMemEval-S (n=50) | QA 准确率 | **76%** | 与 dense RAG 打平 |
| ERPNext 跨工具 (n=6) | 关键事实覆盖率 | **82.0%** | grep/read 基线 70.8% |
| 建图 LLM 成本 | token | **0** | 多数按 token 计费 |
亮点是**用了同一个 harness、盲评裁判（两位 judge 一致性 90.6%，Cohen's kappa 0.81）**，复现命令公开。Augmentcode 的分析提醒读者："这个 recall 差距大到值得问一句为什么——好在复现命令是公开的，你可以在自己的语料上跑一遍而不是只信它"。kubeblogs 也做过独立的 Claude Code 生产环境实测，结论总体上是大仓库有收益、小仓库负优化，与上面 issue 反馈一致。
---
## 结语与行动建议
### 终极评判
**Graphify 是目前"codebase knowledge graph for AI agents"这个赛道里最值得认真观察的项目**，不是因为它的 100K star，而是因为它做了三件同类工具没同时做到的事：
1. **把"图是真实的、边是可解释的"做成第一性设计**（EXTRACTED / INFERRED 标签）
2. **把"人 + agent 双受众"做成产品目标**（HTML 给人看，JSON 给 agent 查）
3. **把"接入 25 个助手"做成一行命令**（`graphify install`）
但它也是一个**典型的 early-stage 工具**：报告偶尔会空白、超大 monorepo 会卡死在 O(V×E) 算法上、Claude 在中小任务上经常绕过它、PyPI 命名有历史包袱。
### 给不同读者的行动建议
**如果你管理大型 monorepo（>500 文件）或团队 onboarding**：值得花一个下午试一下，但先用 `--exclude-hubs 99` 和 `.graphifyrc` 把 god node 噪音压下去，避开 `graphify update` 在超大仓库上的介数中心性瓶颈；记住把 `graphify-out/` 写进 `.claudeignore`。
**如果你是带 AI 助手的独立开发者，项目 < 100 文件**：暂缓。用原生 grep + Claude Code 的内置能力就够，装这个只会增加 hook 噪音。
**如果你关心合规和数据隐私**：Graphify 是这个赛道里**少见的"纯代码零 API"方案**——`uv tool install "graphifyy[ollama]"` + `--backend ollama` 可以做到全程不出内网，这点比 Cursor 的云端索引友好得多。
**如果你是研究者或想对比同类工具**：先读 `BENCHMARKS.md` 的复现命令，然后同时装 codebase-memory-mcp 跑一遍——两者分别代表"广而可视"和"窄而低延迟"两种哲学，跑完你会有自己的判断。
**一句话收尾**：这个项目把"AI 助手为什么每次都要从零理解我的代码"这个问题问得很好，答案也搭出了骨架——**剩下的要看你在自己的代码库里，能不能让它真的被你的 agent 想起来用**。
