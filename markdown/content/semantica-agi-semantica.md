# semantica-agi/semantica

[GitHub URL](https://github.com/semantica-agi/semantica)


## Semantica：可审计的图原生 AI 基础设施与决策智能平台

> 用知识图谱构建 AI 的可审计“记忆层”，让每一次决策都有据可查。

- **Tags**: RAG, 知识图谱, 决策智能, 可审计 AI, 多代理协作
- **Category**: AI 编程, 开发工具, 数据治理

## Details

# 一句话总结
Semantica 是一个“图原生的语境层与可审计 AI 基础设施”：它把多源数据变成可查询的知识图谱与决策链，具备溯源、规则推理与冲突检测，主打在受监管行业让 AI 的每一次决定都能被解释与审计。
---
## 背景与痛点
### 1) 生成式 AI 的“黑盒”困局
传统 RAG 与向量检索能回答“相似吗”，但回答不了“为什么”和“源于哪里”。在高合规行业（金融、医疗、政务），一旦模型给出错误或偏颇结论，就难以追溯到事实出处、推理路径或决策链条。合规部门与监管机构需要的是一份“可提交的审计线索”，而不仅是一个相似度分数。
### 2) 企业数据散落且来源冲突
企业数据栖息在数据仓库、对象存储、SaaS、文本文档、流式事件等不同地方；实体同名异义、异名同义、相互矛盾的现象十分常见。用纯向量/检索进行简单召回，往往会发生“噪音被放大、冲突被覆盖”的情况，且难以做到点对点的时间旅行与版本回溯。
### 3) 多代理/多会话的“记忆孤岛”
每个 Agent 各自维护记忆或上下文窗口，缺乏共享的“长期记忆与决策簿”，导致跨会话先例无法复用，跨 Agent 的协作难以一致审计。当你要问“历史上类似条件是怎么处理的”时，往往只能去翻日志甚至人工溯源。
---
## 核心亮点与功能剖析
### 决策智能（Decision Intelligence）
Semantica 把“AI 决策”作为图的一等公民节点，记录类别、场景、推理、结果与置信度，并可添加因果链与先例关联。以下是最小可用示例：
```python
from semantica.context import ContextGraph
graph = ContextGraph(advanced_analytics=True)
# 记录决策
d_id = graph.record_decision(
    category="vendor_selection",
    scenario="Choose cloud provider for HIPAA workload",
    reasoning="AWS offers BAA, mature HIPAA tooling, and existing team expertise",
    outcome="selected_aws",
    confidence=0.93,
)
# 因果链
# graph.add_causal_relationship(upstream_id, downstream_id, relationship_type="CAUSED")
# 溯源与先例
chain   = graph.trace_decision_chain(d_id)                     # 完整因果祖先
similar = graph.find_similar_decisions("cloud vendor", max_results=5)
impact  = graph.analyze_decision_impact(d_id)
ok      = graph.check_decision_rules({"category": "vendor_selection"})
```
- 输出都是结构化数据，便于自动化审计与人眼阅读。记录可导出为 W3C PROV-O、JSON 或 CSV，以满足合规归档。
### 语境图（Context Graphs）
不同于纯 RAG，它用“图”把实体、关系、决策与事实连起来：
```python
from semantica.context import ContextGraph, AgentContext
from semantica.vector_store import VectorStore
graph = ContextGraph(advanced_analytics=True)
graph.add_node("acme_corp", "Organization", name="Acme Corp", industry="SaaS")
graph.add_node("alice_chen", "Person", name="Alice Chen", role="CTO")
graph.add_node("contract_001", "Contract", value=2_400_000, currency="USD")
graph.add_edge("alice_chen", "acme_corp", edge_type="works_for", since="2019-03-01")
graph.add_edge("acme_corp",  "contract_001", edge_type="party_to", signed="2024-01-15")
# 多跳查询
neighbors = graph.get_neighbors("acme_corp", hops=2)
# 时间旅行：某时刻的图快照
snapshot = graph.state_at("2024-01-01")
# 与 Agent 上下文结合
vs   = VectorStore(backend="faiss")
ctx  = AgentContext(vector_store=vs, knowledge_graph=graph)
ctx.store("Alice approved the Acme renewal in Q1 2024", conversation_id="conv_001")
retrieved = ctx.retrieve("who approved the Acme contract?")
```
- “图遍历 + 语义检索”的组合，能发现向量相似度找不到的“跳三跳关系”。
### 全流程管道（Pipeline）与多模态摄取
Semantica 的架构覆盖从摄取到导出的完整流水线：
- 摄取：文件、Web、数据库、数据平台（Databricks、Snowflake）、云盘、流（Kafka/Kinesis）、Git、邮箱、MCP 等
- 解析/归一化/切分：文档解析、文本/实体/日期归一化、GraphRAG 友好的“实体感知分块”
- 抽取/冲突检测/去重：NER、关系抽取、事件抽取、三元组；冲突会被标记并解决，而非静默覆盖
- 知识图谱：GraphBuilder 构造图；双时态事实与图分析（中心性、社区、链路预测）
- 智能层：Ontology（SHACL/OWL/SKOS）、Reasoning（Rete/Datalog/SPARQL）、Provenance（W3C PROV-O）、Decisions
- 存储：多语种图存储（RDF：Oxigraph/Blazegraph/Jena/RDF4J；LPG：Neo4j/FalkorDB/Apache AGE/Neptune）与向量存储；后端可热插拔而不改代码
- 输出：RDF/OWL/Parquet/Cypher/JSON-LD 导出；交互式可视化；REST/MCP/CLI 访问
### 规则引擎与可解释推理
它提供前向链、Rete 网络、Datalog 与 SPARQL，推理路径可解释，避免“黑盒推理”。结合 SHACL 与 OWL，可进行本体治理与策略合规检查，相当于给知识图谱安上“规则护栏”。
### 可审计与溯源（Provenance）
ProvenanceManager 与 RDFExporter 支持把每个事实的来源（文档、算法、实体提取器）与决策链条以 W3C PROV-O 格式导出，可直接用于监管提交或内部风控审计。
### 多代理共享上下文
Agno、CrewAI 与 LangChain 有原生集成，通过“共享的 ContextGraph + DecisionKit”让多代理在同一知识层协作，决策先例与证据链全局共享，避免重复记忆与不一致风险。
### CLI 与可视化/Explorer
内置 CLI 与 Knowledge Explorer 仪表盘，可在浏览器中以交互方式查看图谱、时间线、决策因果、审计日志、实体合并、本体与 PROV-O 溯源等。示例：
```bash
pip install "semantica[explorer]"
semantica-explorer --graph my_graph.json
# 浏览器打开 http://127.0.0.1:8000
```
### MCP 服务器与编辑器集成
提供标准 MCP 服务器，工具包括 NER、关系抽取、决策记录/查询/先例/因果链、图谱增删与图分析等；可在 Claude Desktop、VS Code、Windsurf、Cline 等环境中一键接入。
---
## 目标人群与收益
### 受众与价值收益
- AI/ML 平台团队：为 Agent 提供结构化、可治理的“长期记忆层”，决策与调用链可追踪，便于调试与合规汇报。
- 数据平台团队（Databricks/Snowflake）：直接把现有表转化为图谱与血缘，无需再导入第三方 SaaS，并支持点对点的溯源与治理。
- 合规/风控/审计：拿到可递交的 PROV-O/结构化审计线索，能回答“为什么这么做、涉及哪些证据与策略”，减少监管沟通成本。
- 受监管企业（金融/医疗/法律/政府/国防）：自托管、无供应商锁定、数据不出域，满足数据安全与合规要求。
- 平台与基础架构工程师：图存储与向量存储可插拔更换，推理与本体层统一管理，避免被单一后端锁定。
- 数据/知识工程师：从多源数据自动抽取实体/关系并合并去重，冲突被标记而非默默吞掉；双时态事实支持时间旅行，历史版本随时回放。
---
## 技术栈与架构解析（开发者视角）
### 语言与包
- 语言：Python 3.8–3.12（CI 覆盖 3.9–3.12）。
- 许可证：MIT，可商用与二次开发。
- 安装方式：
  - 核心：pip install semantica
  - 全家桶：pip install semantica[all]
  - 按需 extras：agno/crewai/langchain/llm-litellm/graph-neo4j/graph-falkordb/graph-apache-age/graph-amazon-neptune/tripletstore-oxigraph/vectorstore-qdrant/vectorstore-pinecone/db-snowflake/db-databricks/ingest-parquet/ingest-arrow/viz/watch/explorer 等。
### 核心依赖与生态
- 数值计算与数据：numpy、pandas、scipy、scikit-learn、umap-learn。
- NLP 与模型：spaCy、transformers、torch、sentence-transformers 等。
- 图存储：
  - RDF：内置 Oxigraph；外部 Blazegraph/Apache Jena/Eclipse RDF4J 通过 SPARQL HTTP。
  - LPG：Neo4j/FalkorDB/Apache AGE/AWS Neptune（需安装对应 extras）。
- 向量存储：FAISS（核心）、Qdrant、Pinecone、PgVector、Weaviate、Milvus 等。
- 企业连接器：Databricks（Unity Catalog + Delta Lake）、Snowflake、SAP OData 等。
### CLI 与服务入口
pyproject.toml 定义了多入口：
- semantica（启动面板与命令组）
- semantica-server（REST 服务）
- semantica-worker（后台任务）
- semantica-explorer（可视化仪表盘）
- semantica-mcp（MCP 服务器）
### 测试与 CI
- pytest 测试套件，带有 integration 标记区分需要外部服务的测试。
- GitHub Actions 提供可复用的 setup-semantica 复合动作，方便在自建 CI 中复用；官方提供 GitHub Actions/GitLab CI/CircleCI 模板。安装矩阵每周验证 Ubuntu/macOS/Windows 与 Python 3.9–3.12 的安装兼容性。
### 模块化结构
每个模块可独立导入与组合，例如：
- semantica.ingest
- semantica.semantic_extract
- semantica.kg
- semantica.reasoning
- semantica.vector_store
- semantica.split（实体感知/关系感知/本体感知分块）
- semantica.provenance
- semantica.ontology
- semantica.conflicts
- semantica.deduplication
- semantica.normalize
- semantica.pipeline
- semantica.export
- semantica.visualization
### 版本与演进（v0.6.7 截面）
- 首等 LangChain 集成、SAP OData 摄取器（SSRF 防护）、ContextGraph 的 Markdown 持久化、推理层的结构化 Action（Assert/Retract/Call/EmitEvent）、run_shacl_validation 公开 API 与大量 RDF/本体导出正确性修复等。
---
## 上手门槛与部署体验
### 从 0 到 1 的最低路径
```bash
# 安装核心
pip install semantica
# 健康检查
semantica doctor
```
若需向量存储与可视化，可：
```bash
pip install "semantica[viz,explorer,tripletstore-oxigraph]"
semantica-explorer --graph my_graph.json
```
### Docker/K8s 与生产化建议
README 提倡生产使用 Docker/K8s，配置持久化图存储、向量后端与环境变量（SEMANTICA_SECRET_KEY）；部署配置（AWS/GCP/Azure/Fly.io/Railway/Render/K8s/Helm）位于 deploy/ 目录。
### 文档与学习路径
- README 覆盖 Quick Start、架构、What You Get、Decision Intelligence、Context Graphs、Audit Trail 食谱、模块参考、集成、CLI、性能与 Install。
- 文档站点：docs.getsemantica.ai；Cookbook 提供可运行的 Jupyter 笔记本。
---
## 社区活跃度与生命力（基于公开信息）
- Star：约 11.7k；Fork：约 1.3k；Issues：56；Pull Requests：70（页面侧边栏数据，为时点快照）。
- Trendshift 记录显示该项目曾登上 GitHub Trending 并在 2026-08-10 达到日榜第一。
- 安装与 CI 矩阵每周验证多平台与多 Python 版本；具备较完善的质量与安全门控（如 SSRF 修复）。
- 官方提供 Discord、GitHub Discussions、Issues、文档与 Cookbook 等多种支持渠道，社区维护与贡献路径明确。
---
## 竞品/同类对比
| 维度 | 传统向量 RAG | 纯知识图谱方案 | 通用 Agent 框架（内置记忆） | Semantica |
|---|---|---|---|---|
| 召回方式 | 嵌入相似度 | 图遍历/SPARQL | 上下文窗口（通常为向量+KV） | 图遍历 + 语义检索（向量图混合） |
| 决策历史 | 不存储 | 不天然作为一等公民 | 通常为日志/内存状态，结构化有限 | 决策节点可查询、可溯源、可导出 PROV-O |
| 溯源/审计 | 无/弱 | 有，但需自建 | 弱 | W3C PROV-O、时间旅行、导出合规格式 |
| 推理 | 无/LLM 外包 | 规则/推理引擎 | 主要靠 LLM | 确定性推理（Rete/Datalog/SPARQL）+ LLM 辅助 |
| 冲突检测 | 静默覆盖 | 需自定义 | 通常无 | 内置冲突检测与解决机制 |
| 多代理共享上下文 | 通常各自索引 | 需自行协调 | 有限共享 | ContextGraph + DecisionKit 统一共享层 |
| 多后端插拔 | 受限 | 需适配 | 受限 | 图/向量后端可插拔，代码不改 |
---
## 局限与不足
- 学习与运维门槛：需要理解知识图谱、本体（OWL/SHACL）、图存储与 SPARQL/Cypher，运维侧需要管理图与向量两套后端（可在嵌入式 Oxigraph + FAISS 上起步）。
- 性能与规模：尽管 README 提到在 118,000 节点生产图上的去重与候选生成加速，但对于超大规模图（千万/亿级节点），仍需精心选择后端（如 Neo4j/Neptune）并进行索引/分区与容量规划。
- 非模型内部解释：Semantica 提供的是“系统级解释”（上下文、证据、决策链、策略、执行轨迹），而非模型内部权重或 CoT。对于“模型本身为何这样想”的诉求仍无法满足。
- 安装依赖较重：涉及多种重型依赖（PyTorch、spaCy、向量与图相关库），按需安装 extras 非常必要；在受限网络环境与无 GPU 环境需提前规划。
- 项目仍较年轻：作为 2026 年快速崛起的项目，API 和模块结构可能持续演进；企业落地需关注版本锁定与升级路径，避免频繁跟进上游变更。
---
## Demo / 代码示例（可复制）
- 1) 记录决策并查询（最简版）：
```python
from semantica.context import ContextGraph
graph = ContextGraph(advanced_analytics=True)
did = graph.record_decision(
    category="vendor_selection",
    scenario="Choose cloud provider for HIPAA workload",
    reasoning="AWS offers BAA, mature HIPAA tooling, and existing team expertise",
    outcome="selected_aws",
    confidence=0.93,
)
print(graph.trace_decision_chain(did))
print(graph.find_similar_decisions("cloud vendor", max_results=5))
print(graph.analyze_decision_impact(did))
print(graph.check_decision_rules({"category": "vendor_selection"}))
```
- 2) 摄取与图构建（端到端迷你流程）：
```python
from semantica.ingest import FileIngestor
from semantica.split import TextSplitter
from semantica.semantic_extract import NamedEntityRecognizer, RelationExtractor
from semantica.kg import GraphBuilder
docs = FileIngestor().ingest_directory("./contracts/", recursive=True)
chunks = []
for doc in docs:
    chunks.extend(TextSplitter().split(doc.text, meta={"source": doc.uri}))
ner = NamedEntityRecognizer()
re  = RelationExtractor()
triplets = []
for chunk in chunks:
    entities = ner.extract(chunk.text)
    rels     = re.extract(chunk.text, entities)
    triplets.extend([(e1, r, e2, {"chunk": chunk.text}) for e1, r, e2 in rels])
gb = GraphBuilder()
for s, p, o, ctx in triplets:
    gb.add_triple(s, p, o, **ctx)
kg = gb.build()
```
- 3) 摄取企业数据平台表（Databricks 示例）：
```bash
pip install "semantica[db-databricks]"
```
```python
from semantica.ingest import DatabricksIngestor
databricks = DatabricksIngestor(
    host="https://adb-xxx.azuredatabricks.net",
    token="YOUR_TOKEN",  # 生产中建议用环境变量或密钥管理
    http_path="/sql/1.0/warehouses/xxxxxxxx",
    catalog="main",
)
customers = databricks.ingest_table("customers", limit=10_000)
lineage   = databricks.get_table_lineage("customers", catalog="main", schema="default")
```
---
## 结语与行动建议
### 适用性判断（你该不该现在动手）
- 强烈建议落地：你的产品/系统处在受监管行业，要求可解释与审计线索；同时有意愿投入团队学习图谱与本体。Semantica 能显著降低“合规沟通”与“故障溯源”的成本。
- 建议先试点：你有强“上下文管理与决策追溯”需求，但团队尚缺图与本体经验。可先用内置 Oxigraph+FAISS，在单个业务线（如信贷审批/客户工单/供应链事件链）跑通一条端到端流水线，再扩展。
- 再观望：你的场景是纯 Q&A/内容生成，暂不涉及决策链或监管审计；或团队当前人手紧张、难以承接新栈。此时可以持续关注其生态与文档成熟度，择机评估。
### 最小落地路径推荐
- 本地验证：pip install semantica；跑 README 的 Quick Start 与 Audit Trail 食谱；用 semantica-explorer 看图谱与决策链。
- 单业务线试点：选择“决策节点清晰、证据链有据”的场景（例如供应商准入、贷款审批、合同评审）；定义本体与 SHACL 规则；接通现有数据源（文件/DB/数据平台）；导出 PROV-O 审计线索与合规/法务团队确认。
- 生产路径：迁移到 Docker/K8s，配置持久化图与向量后端，接入 CI/CD 与监控；逐步扩展到多业务线与多 Agent 协同。
### 资源与下一步
- 仓库：https://github.com/semantica-agi/semantica
- 文档：docs.getsemantica.ai
- 官方站点：https://getsemantica.ai（了解企业方案与定价）
---
总体评判：Semantica 把“知识图谱 + 决策溯源 + 规则推理”做成了一套可插拔、可自托管的 AI 基础设施层，填补了 RAG 与 Agent 框架在“可解释、可审计、可治理”上的空白。它更适合对合规性与决策可追溯性要求高的团队；若能接受适度学习与运维成本，它能带来明显的风控与运营效率提升，并为多 Agent 与长期知识积累打下坚实基础。
