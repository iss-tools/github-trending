# docling-project/docling

[GitHub URL](https://github.com/docling-project/docling)


## Docling：全能型开源文档解析与 AI 数据管道

> 开源全能文档解析工具，将 PDF/Office/图片等高质量转换为结构化数据，专为本地 RAG 系统打造。

- **Tags**: 文档解析, RAG, 开源, IBM, 本地部署
- **Category**: 开发工具, 数据处理, AI 编程

## Details

# 一句话总结
Docling 是一个“文档→生成式 AI”的中间件：用一套统一、开源、可在本地运行的管线，把 PDF/Office/图片/音视频/XBRL/邮件/网页等“各种格式”高质量解析为结构化的 DoclingDocument，并导出为 Markdown/HTML/JSON，再无缝接入 LangChain、LlamaIndex、Haystack、MCP 等 RAG/Agent 框架。它由 IBM Research Zurich 发起、托管于 LF AI & Data 基金会，适合需要“把文档喂干净”给大模型的开发者与企业。
---
## 背景与痛点
**大模型吃的是“干净、结构化”的数据，但现实中的文档却是“乱糟糟”的：**
- PDF 的排版千奇百怪，多栏、浮动元素、页眉/页脚、页码会打乱阅读顺序；
- 表格不仅跨页、合并单元格，还经常被纯文本解析器拆散；
- 扫描件、截图需要 OCR（文字识别），而不同 OCR 的质量与语言支持差异很大；
- 多媒体（音频、视频）需要转录/抽帧，再与正文合并；
- 专业格式（XBRL 财报、专利 USPTO、期刊 JATS、邮件 EML/MSG）有严格的结构，传统工具往往只把文本“抠出来”，结构语义丢失；
- 合规/隐私场景要求文档不能出内网，很多云服务无法使用。
Docling 正是为解决这些问题而诞生：先把各种文档“统一解析+结构化”，再生成规范中间表示，从而让 RAG（检索增强生成）与 Agent 应用少踩坑、检索更准、下游代码更干净。
---
## 核心亮点与功能剖析
### 1）覆盖极广的格式“万花筒”
Docling 支持的输入/输出类型非常丰富，主要包括：
- 办公与出版：PDF、DOCX/XLSX/PPTX、DOC/XLS/PPT（需 LibreOffice）、RTF、ODT/ODS/ODP（OpenDocument）、HTML、EPUB、Apple Pages（.pages）、LaTeX、Markdown/AsciiDoc 及其超集（.qmd/.Rmd）等。
- 图片与扫描件：PNG/TIFF/JPEG 等常见位图，支持多款 OCR 引擎。
- 音视频与字幕：WAV/MP3、视频（MP4/AVI/MOV/MKV/WebM，含 ASR 转录与关键帧）、WebVTT 字幕。
- 邮件与专业报表：EML/MSG 邮件、XBRL 财务报表。
- 文本与自定义：纯文本、自定义 XML 等。
输出支持多种目标格式，方便按需选用：
- Markdown、HTML、WebVTT、DocTags、DocLang、无损 JSON；
- 面向特定场景的 XML 模式（USPTO 专利、JATS 文章、XBRL 财报）。
### 2）“懂得版面”的 PDF 理解
不同于很多库“从上到下暴力抓文本”，Docling 使用专门的版面分析模型（DocLayNet）与表格结构识别模型（TableFormer），能识别：
- 页面布局（标题、段落、列表、图片、表格、代码块、公式等）；
- 阅读顺序（避免多栏混排导致的乱序）；
- 表格结构（行列/合并单元格），方便导出结构化数据或代码；
- 代码块与公式的区域与边界。
### 3）统一的 DoclingDocument 中间表示（Pydantic）
Docling v2 引入了 DoclingDocument 作为统一文档模型，基于 Pydantic 定义，包含：
- 文本、表格、图片等元素；
- 文档层级（章节/分组）与“家具”（页眉/页脚等）的区分；
- 每个元素的布局边界框（可用于坐标定位/高亮）；
- 来源与置信度等 provenance 信息。
这样，你不再需要为每种格式写一套解析逻辑，直接在 DoclingDocument 上做序列化/分块/结构化抽取/向量注入等。
### 4）多模态管线：OCR/ASR/VLM 一体化
- OCR：支持多款引擎（如 Tesseract、RapidOCR、Surya），可根据语种与质量需求灵活选择。
- ASR：音频/视频通过 Whisper 等 ASR 模型做转录，并可抽取代表性关键帧用于图文结合理解。
- VLM（视觉语言模型）：如 Granite.Docling，可对图像/页面进行更深理解、问答或注释，CLI 可直接切换到 VLM 管道。
### 5）本地优先 + 敏感数据友好
Docling 强调本地执行能力，可在断网或隔离环境运行，配合 MCP server 与 Agent skills，让任何 Agent 框架都能安全地调用文档解析能力。
### 6）为 AI 生态而生的集成网
官方文档列出了丰富的“开箱即用”集成，包括：
- Agentic/AI 开发框架：LangChain、LlamaIndex、Haystack、CrewAI、Langflow、txtai、Bee Agent Framework、haiku.rag、Hector、Semantica 等；
- 数据/AI 工具链：NVIDIA、Data Prep Kit、Label Studio、InstructLab、spaCy、Apify 等；
- 更多生态：Milvus、Weaviate、Qdrant、Azure AI Search、MongoDB + VoyageAI 等向量库/检索组件的 RAG 示例。
这意味着你不必自己写 Loader/Parser，就可以在常用框架里直接把 Docling 当作文档解析标准件。
### 7）API 服务与 UI（docling-serve）
如果你不想在每台机器上都装 Python 环境，可以用配套的 docling-serve 把解析做成服务：提供 RESTful v1 API、OpenAPI 文档、UI playground，并有多容器镜像（CPU、CUDA 12.8/13.0 等），支持本地与 K8s/Docker Compose 部署，非常适合团队共享与生产集成。
---
## 目标人群与收益
### 谁最适合用
- 正在做/准备做 RAG、企业知识库、问答系统的后端与平台团队；
- 需要批量清洗与结构化异构文档的数据工程师/运营；
- 在金融/医疗/政务等合规行业，要求“数据不出域”的团队；
- 研究与 AI 工程师，需要可复现、可扩展的文档处理管线与模型组合。
### 能带来什么直接收益
- 提升检索与召回质量：版面/表格/图表/图片结构化，能显著减少“错位召回”与“表格断裂”等常见问题；
- 缩短工程链路：一套中间表示 + 多框架集成，避免为不同格式重复写 Loader/Parser；
- 降低运维成本：API 化后，多个业务系统共享同一解析服务，减少“散装脚本”的维护负担；
- 合规与隐私友好：本地/内网部署、可控的模型与 OCR 引擎，满足敏感数据处理需求；
- 提升开发体验：CLI + UI playground + 丰富示例，让你快速验证原型、再逐步扩展到生产。
---
## 竞品/同类对比
### 对比传统 OCR/文本抽取工具
- 传统工具多把文本“线性抠出”，缺乏对版面、表格、图表、代码/公式等结构理解；
- Docling 不仅做 OCR，更强调版面分析与表格结构识别，并把结果放进结构化的 DoclingDocument，更适合下游的 RAG/结构化提取。
### 对比云文档解析服务（如各类 OCR/解析 API）
- 云服务在弹性运维与企业特性（权限/审计/SLA）上有优势，但数据要出域，且功能锁定在厂商路线；
- Docling 可本地运行、代码完全开源可审计，格式覆盖与专业领域适配（XBRL/USPTO/JATS/邮件/视频等）非常广泛，但需要你自行运维与调优。
### 对比 RAG 框架自带 Loader
- 大多数框架的 Loader 只做基础文本/段块抽取；
- Docling 提供更深入的版面/表格/图表/音频理解与统一中间态，可被多个框架共享同一文档管道，避免重复建设，并方便做质量监控与性能调优。
---
## 局限与不足
- 初次部署需要关注 Python 版本（3.10+，3.9 已在 2.70.0 起不再支持）与平台兼容性（macOS/Linux/Windows，x86_64/arm64）；部分格式需额外依赖（如 LibreOffice 处理旧 Office、format-iwork 处理 Pages）。
- 容器镜像体积不小（CPU 版约 4.4 GB，通用 amd64 约 8.7 GB），首次运行需要下载模型权重；对环境与带宽有基本要求。
- 部分“高级功能”仍在 Coming soon/β（如元数据提取、复杂化学理解、部分图表理解），成熟度需根据具体版本验证；复杂排版仍可能需要后处理校验与规则补丁。
- 本地部署带来安全与隐私收益，也意味着你需要自己解决可用性、监控、扩容、权限控制、安全加固等运维问题，尤其是对外暴露 API 服务时要认真设计鉴权与配额等。
---
## 技术栈与架构解析（面向开发者）
### 核心技术栈
- 语言与框架：Python，使用 Pydantic 定义 DoclingDocument，保证类型安全与易序列化；
- 模型与算法：
  - 版面分析：DocLayNet（论文与模型用于 PDF 页面元素检测与分类）；
  - 表格结构：TableFormer（用于识别表格行列与合并关系）；
  - VLM：如 Granite.Docling，支持页面/图片的视觉问答与注释；
  - OCR：Tesseract、RapidOCR、Surya 等；
  - ASR：Whisper 等用于音频/视频转录。
### 管线设计
- 输入层：统一接收不同格式来源（本地路径、URL、内存流等）；
- 解析层：按格式分发到相应解析器（PDF/Office/图像/音视频/邮件/XBRL 等），OCR/ASR/VLM 插件按需启用；
- 中间表示层：生成 DoclingDocument，保留结构、布局与置信度；
- 输出层：根据目标格式（Markdown/HTML/JSON/特定 XML 等）导出；或进一步做序列化/分块/结构化抽取。
### 扩展与插件
- 支持自定义 Enrichments（如图/公式/表格增强）、Chunking（分块策略）以及插件式的 OCR 引擎切换；
- Pipeline 可配置 VLM/ASR 等多模态组件，方便做“图文对齐”“视频帧检索”等高级能力。
---
## 上手门槛与部署体验
### 安装与快速开始
- Python 环境：官方明确自 2.70.0 起不再支持 Python 3.9，建议使用 3.10+；支持 macOS/Linux/Windows 与 x86_64/arm64。
- 安装：
  - pip 即可安装核心包，官方文档有详细的 Installation/Quickstart，可按需选择 GPU 相关 extras；
- CLI 一把梭：
  - docling <URL 或本地路径> 即可在当前目录生成 .md 文件；适合快速体验与脚本化批处理。
### 文档与示例体验
- 文档结构清晰，包含 Getting Started/Usage/Concepts/Examples/Integrations/Reference 等，且“Examples”覆盖转换、序列化/分块、信息提取、RAG 样例、图片注释、GPU 优化等多维场景，便于按需取用。
- 集成页面给出了各框架的接入方式与示例代码，大幅降低 DX（开发者体验）。
### API 服务部署
- 安装与启动：
```bash
pip install "docling-serve[ui]"
docling-serve run --enable-ui
```
- 默认提供：
  - API 地址（http://127.0.0.1:5001）；
  - OpenAPI 文档（/docs）；
  - UI playground（/ui）用于在线调试。
- 容器化：提供 CPU、CUDA 12.8/13.0 等多版本镜像（ghcr.io 与 quay.io均有），可在 Docker/Podman 中直接拉取，并遵循 PyTorch 的 CUDA 支持生命周期策略（CUDA 镜像不使用 latest 标签，需显式指定版本），避免误用废弃版本。
---
## 社区活跃度与生命力
- 项目托管于 LF AI & Data 基金会，拥有中立、长期治理与社区基础设施支持；
- 文档中“Coming soon/What’s new”持续更新，新功能如新布局模型 Heron、MCP server、XBRL/视频/LaTeX/邮件等支持频繁加入，表明迭代节奏较快；
- 生态集成条目丰富，涵盖主流 RAG/Agent 框架与多家厂商/工具，示例覆盖从简单转换到多模态管线、结构化提取、RAG 与向量库集成等多维度应用场景，说明社区参与度与内容沉淀较深。
---
## Demo / 代码示例（核心用法）
### 1）CLI 快速转换（最简单）
```bash
docling https://arxiv.org/pdf/2408.09869
```
- 这将在当前目录生成对应的 .md 文件，包含结构化的文档内容（标题/段落/表格/图片说明等）。
### 2）Python 最小示例（推荐）
```python
from docling.document_converter import DocumentConverter
source = "https://arxiv.org/pdf/2408.09869"  # 支持本地路径或 URL
converter = DocumentConverter()
result = converter.convert(source)
print(result.document.export_to_markdown())  # 输出 Markdown 结构
```
- 你可以在此基础上替换成任何支持的本地文件/URL，并进一步把 result.document 用于向量注入、结构化抽取或分块处理。
### 3）CLI 启用 VLM（Granite.Docling）
```bash
docling --pipeline vlm --vlm-model granite_docling <URL_or_path>
```
- 适合需要更深层图文理解或页面级问答的场景。
### 4）使用 docling-serve 作为 API 服务
- 启动服务：
```bash
pip install "docling-serve[ui]"
docling-serve run --enable-ui
```
- 调用示例（curl）：
```bash
curl -X 'POST' \
  'http://localhost:5001/v1/convert/source' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "sources": [{"kind": "http", "url": "https://arxiv.org/pdf/2501.17887"}]
  }'
```
- 返回 JSON 包含结构化的文档内容，可直接在你的应用里使用；UI playground（/ui）非常适合调试与参数调优。
---
## 结语与行动建议
终极评判：Docling 在“文档→生成式 AI”的关键节点上，提供了一条“统一解析+结构化+多模态+生态集成”的本地优先管线。它把 PDF/Office/图像/音视频/邮件/XBRL 等复杂格式统一为 DoclingDocument，再输出到 Markdown/JSON/向量库，让 RAG/Agent 系统少踩坑、检索更准、工程更简洁。对于任何严肃对待“数据质量”与“合规/隐私”的团队，这都是一个值得长期投入的基础设施。
行动建议：
- 如果你刚起步：先用 CLI + Python Notebook 跑通“PDF→Markdown→向量库”的最小闭环，验证检索质量与解析效果是否符合你的预期；
- 若你在做企业/团队级服务：把 docling-serve 部署为内网 API，让多个业务共享同一文档解析能力，减少重复建设；
- 根据你实际的格式与场景，按需启用：
  - 旧 Office → 配置 LibreOffice；
  - 表格密集场景 → 重点验证 TableFormer 表格结构导出；
  - 扫描件多 → 选择合适的 OCR 引擎与语言；
  - 多媒体 → 考虑 ASR/关键帧管线；
  - 需要图文问答 → 启用 VLM（如 Granite.Docling）；
  - 合规/隐私 → 优先使用本地部署与 Docker/K8s 隔离策略。
如果你能分享你的具体格式组合（例如“以财报 XBRL + 扫描合同 PDF 为主”）和部署环境（CPU/GPU、K8s/单机），我可以给出一套更贴身的配置与命令清单。
