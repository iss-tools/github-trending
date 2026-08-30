# mvanhorn/last30days-skill

[GitHub URL](https://github.com/mvanhorn/last30days-skill)


## last30days-skill：跨平台近30天热点聚合与AI简报工具

> 一个聚合全网近30天高赞内容，并由AI生成深度简报的跨平台研究工具。

- **Tags**: GitHub, AI Agent, 舆情分析, 信息搜集, Claude Skill
- **Category**: AI工具, 信息聚合, 效率工具

## Details

# last30days-skill 深度评测
## 一句话总结
一个“把全网最近30天的声音搜到一起、按点赞/评论/真钱投票排序，再用AI写成带引用简报”的开源Agent Skill；适合把 Claude Code、Codex、Cursor、Copilot、Claude Desktop、Grok 等变成“社群研究”的超级助手。
## 背景与痛点：为什么要再做一个“搜索引擎”？
- 信息分散在各座围墙花园。Google 搜索不进 Reddit 评论与 X 帖子；ChatGPT 有 Reddit 却不搜 X/TikTok；Gemini 有 YouTube 但缺 Reddit；Claude 原生都不碰这些平台。每个平台有自己的 API、认证与数据格式，想一网打尽非常费劲。
- “编辑 SEO” vs “人用脚投票”。传统搜索引擎强于长文的索引与链接排序，但很难呈现“一条 Reddit 评论 1500 赞”“一条 X 引文被转发上千”这类活信号。决策与创作更需要的是“大家在讨论什么、在笑什么、在骂什么”，而不是哪篇博文 SEO 最好。
- AI 训练数据总有滞后。社区已经用 Prompt 模板、工具链、参数经验迭代了几轮，文档与教程却还停留在半年前；开发者需要一个能直接拉取“最近30天共识”的通道。
### 它解决的核心问题
- 跨平台实时聚合：一次触发，并行拉取 Reddit、X、YouTube、TikTok、Instagram Reels、Hacker News、Polymarket、GitHub、Digg、arXiv、Techmeme、LinkedIn、StockTwits、Threads、Pinterest、Xiaohongshu、Bluesky、Perplexity、Web 等近 20 个来源，并只保留最近30天窗口。
- 以“真实的参与度”重排：基于点赞、评论、转发、预测市场交易量等信号打分，避免被标题党与 SEO 垃圾占据心智。
## 技术栈与架构解析（给开发者的速写）
- 语言与核心：Python 3.12+ 是引擎的运行时依赖，关键脚本为 `skills/last30days/scripts/last30days.py`。项目还内建测试套件（约 2700+ 用例）、多语言 README 与安全 CI。初次运行可借助 uv 自动准备好 Python 3.12 环境。
- 周边工具与链路：
  - YouTube 抓取：yt-dlp（可选）。
  - X/Twitter 搜索：内嵌 Node.js 的 Bird 客户端。也可以用 Grok CLI 做 X 搜索的后端与失败回退。
  - 付费/受限源的抓取：ScrapeCreators API（TikTok、Instagram、Threads、Pinterest、LinkedIn 与 YouTube 评论 等）。
  - Web 搜索后端：默认优先 Brave Search API，也支持 Exa、Serper 等；Brave 提供 2000 次免费/月额度。
  - 预测市场：Polymarket（无需额外 Key）。
- 管道式架构（以 Python 引擎为中心）：
  1) Pre-Research Intelligence（预研究智能）在真正搜索前，先解析人名/公司/项目对应的 X 帐号、子版块、GitHub 用户/仓库、TikTok/IG 创作者等“目标实体”。
  2) 查询计划（`--plan`）将原始主题拆为 2–4 个子查询，提升召回与召回质量；当宿主平台不具备 WebSearch 时，可启用 `--auto-resolve` 让引擎自调用后端完成解析。
  3) 多源并行拉取：按主题并行爬取各平台内容，包含 YouTube 全文转录、Reddit 顶评、TikTok/IG 标题与评论、Polymarket 赔率等结构化信号。
  4) 聚类与打分：将来自不同平台但指向同一事件/点的条目做聚类合并，再依据参与度/时效打分。
  5) AI Judge 合成：由宿主大模型（如 Claude、Codex 等）读取引擎给出的结构化“证据块”，输出带引用的简报。技能规范（SKILL.md）包含严格的输出合约（如必须包含 engine footer、不拼接 Sources 列表等），以稳定生成体验。
  6) 存储与复用：默认将 JSON/HTML/原始存档写入 `~/Documents/Last30Days`，并可通过 `--corpus` 做本地文件检索；支持“library”搜索（离线索引已有简报）。
- 集成形态：
  - Agent Skill（优先推荐）：通过 Claude Code 市场或 Agent Skills CLI `npx skills` 安装，由宿主调用 `scripts/last30days.py` 并传递参数（`--emit=compact`/`--emit=json`/`--emit=html`、`--plan`、`--save-dir` 等）。
  - MCP 服务器：Claude Desktop 拖入 `.mcpb` 包即以 MCP 模式运行，本地 Python 3.12 解析执行，API Key 存入系统 Keychain。
  - Grok CLI/OpenClaw：分别以原生插件/插件市场方式接入，同步从同一仓库获取技能包与清单。
## 上手门槛与部署体验
- 零配置起步：Reddit、HN、Polymarket、GitHub 四个来源无需任何 Key 即可使用；首次运行后，设置向导会引导你解锁 X、YouTube、TikTok、arXiv、Techmeme 等更多源（大约 30 秒内完成）。
- 推荐安装路径（Claude Code）：
  - 命令：
    ```bash
    /plugin marketplace add mvanhorn/last30days-skill
    /plugin install last30days
    ```
  - 优点：自动更新、版本缓存与热刷新，体验最顺滑。
- Agent Skills CLI（兼容 Codex、Cursor、Copilot、Gemini CLI 等 50+ 宿主）：
  - 命令：
    ```bash
    npx skills add mvanhorn/last30days-skill -g
    ```
  - 更新：
    ```bash
    npx skills update last30days -g
    ```
  说明：`-g` 装到用户目录，跨项目可用；缺 `-g` 则为项目级安装。
- Claude Desktop（MCP）：
  - 从 Releases 下载对应平台的 `.mcpb`，拖入“设置 > 扩展”；需本地 Python 3.12+；Key 存入 OS Keychain，与 Code 技能的凭证存储相互独立。
- 手动/开发模式：
  ```bash
  git clone https://github.com/mvanhorn/last30days-skill.git
  ln -s "$(pwd)/last30days-skill/skills/last30days" ~/.claude/skills/last30days
  ```
  然后在宿主里运行引擎脚本。构建 `.skill` 包的命令：
  ```bash
  bash skills/last30days/scripts/build-skill.sh
  ```
  产物在 `dist/last30days.skill`，可直接上传至 claude.ai Web 使用。
- 平台兼容性：macOS、Linux 优先支持；Windows 部分功能仍在推进（MCP 的 .mcpb Windows 入口点待落地）。
- Docker 一键部署：官方未提供现成的 Dockerfile 或 Compose，也未在 README/SKILL.md 提供容器化步骤；若需容器化需自行编写镜像与挂载配置（例如打包 Python 3.12 与依赖、映射 `~/.config/last30days/.env` 与 `~/Documents/Last30Days` 等）。
- 凭证管理：支持 `~/.config/last30days/.env`、环境变量、macOS Keychain；项目提供了 `setup-keychain.sh` 脚本来交互式写入/列出/删除 Keychain 中的凭证。
## Demo / 代码示例（最简调用）
- 在 Claude Code 中使用（最简洁）：
  ```bash
  /last30days Nano Banana Pro prompting
  ```
  输出是一份带“我学到了什么”“关键模式”“统计数据与页脚”的简报，并将原始存档与聚类数据写入 `LAST30DAYS_MEMORY_DIR`。
- 调用引擎脚本（更底层、可定制）：
  ```bash
  SKILL_DIR="<绝对路径>"  # 替换为 SKILL.md 所在目录
  LAST30DAYS_MEMORY_DIR="${LAST30DAYS_MEMORY_DIR:-$HOME/Documents/Last30Days}"
  "${LAST30DAYS_PYTHON:-python3}" "${SKILL_DIR}/scripts/last30days.py" \
      "Nano Banana Pro prompting" \
      --emit=compact \
      --save-dir="${LAST30DAYS_MEMORY_DIR}" \
      --save-suffix=v3
  ```
  此命令行适合在 CI 或自定义脚本里使用；宿主 Agent 通常会在内部自动组织这样的调用。
- 诊断与健康检查：
  ```bash
  "${LAST30DAYS_PYTHON:-python3}" "${SKILL_DIR}/scripts/last30days.py" --diagnose
  ```
  输出包含 `available_sources` 等字段，帮助你快速发现哪个源缺失 Key 或 CLI。
## 核心亮点与功能剖析
- 以“参与度”为权重的多源聚合：
  - Reddit 顶评（带真实 upvote）、X 帖/转评、YouTube 转录“5句精华”、TikTok/IG Reels 的口语转录、Polymarket 真钱赔率、GitHub PR 速度与 Star 数等，全部纳入打分体系。同一件事跨平台讨论会被合并为单个“证据簇”。
- 智能预解析与目标实体定位：
  - Pre-Research 步骤会自动识别主题对应的 X handle、子版块、Hashtag、创作者账号、GitHub 仓库等，避免“搜到了但不知道搜的是谁”。
- 灵活输出与多档深度：
  - `--quick`：更快但源数与每源采样减少；适合高频“轻扫”。
  - 默认：平衡深度（约 20–30 条/源）。
  - `--deep`：深度模式（约 50–70 Reddit，40–60 X），适合写长文/做决策。
  - `--emit=compact`/`md`/`json`/`html`：兼顾人读、调试与自动化集成。HTML 简报可分享。Agent 模式可直接使用 JSON 并在 `--json-profile` 切换 `agent` 与 `raw` 两种 schema。`json-export` 文档说明字段与版本策略。
- 主动“发现”与“招聘信号”等特殊模式：
  - Discovery 模式：当主题是“什么在爆发？/AI agents 最近的热点是什么？”等泛问，技能会进入三段式流程（sweep → judge → finalize），基于 Reddit 分类、HN 首页、Digg AI 1000 等“提名”，由 AI Judge 筛选与排序，再按主题产出带势能标签的简报，便于选题与内容规划。支持 `--discover-shallow` 做快速扫描，且整套协议具备失败降级与手续文件过期的处理规则。
  - Hiring Signals 模式：`--hiring-signals` 会抓取公司与招聘页面，把“职位发布”变成证据，推断业务方向（如企业安全、客户成功、基础设施等）的变化，避免把职位直接当成路线图。如果需要综合社群声音，需要显式使用 `--search=reddit,x,jobs`。该模式下不需要复杂的多子查询计划。
  - “ELI5”与多 Register：通过 `--register={default,exec,dev,creator,eli5}` 控制叙述语气与受众视角；ELI5 会严格使用短句、类比、零行话解释。旧版 `ELI5_MODE=true` 会被映射到 `eli5` Register。宿主可用“eli5 on”等自然语言切换并持久化到配置。
- 本地文件搜索与隐私可控：
  - 支持配置 `LAST30DAYS_CORPUS_DIRS`，从你自己的 PDF/文档/本地文本做离线检索，与在线源统一打分；用 `--corpus-all-time` 可放宽时间窗口。默认本地证据不出现在 `--publish-html` / agent JSON 中，除非显式开启 `LAST30DAYS_CORPUS_IN_EXPORT=1`。
- 安全与工程质量：
  - MIT 许可、无追踪/无分析、所有研究内容默认留在本地。测试覆盖一度提升到 84%，依赖审查（Dependabot/Dependency Review）、安全扫描（Semgrep/OSV-Scanner）、构建来源证明（provenance）、OpenSSF Scorecard 等均已集成到 CI，社区贡献了大量补丁与改进。
  - Releases 页面显示持续的小版本迭代与 bug 修复，包括对 golang.org/x/text 的 CVE 升级、SessionStart 相关的 RCE 防护、安全相关的修复（.env 与 cookie 临时文件安全）等。
## 目标人群与收益
- 谁最合适用：
  - 需要快速了解“最近 30 天发生了什么”的内容创作者、投资人、产品经理、开源维护者与销售/BD。
  - 需要撰写技术选型比较、竞品分析、采购论证的开发者与架构师。
  - 希望将“社群共识”喂给 LLM 作为提示/证据的研究型团队与Agent编排者。
- 能得到什么具体的收益：
  - 效率提升：一次命令替代手动在多个平台搜索与筛选，作者反馈“消除了 90 分钟的手动搜集步骤”。
  - 决策质量：看到参与度高的真实评论与赔率，而不是被 SEO 或公关稿左右；用于选型、择时、舆情研判。
  - 创作选题：通过 Discovery 模式快速抓取跨平台热点与交叉印证，规避“编热点”或跟风滞后。
  - 集成自动化：Agent 模式、JSON 输出与 library 搜索，可将研究结果喂给下游自动化（周报生成、邮件摘要、CRM 录入等）。
## 竞品/同类对比（简要）
- 与传统搜索引擎：侧重“网页索引”而非“参与度”；last30days 强调投票、评论、交易等“真实行为”作为权重，并可限定最近30天。
- 与通用 AI 搜索/摘要：各家 LLM 平台各自与部分平台合作，难以同时覆盖 Reddit + X + TikTok + Polymarket + arXiv/Techmeme/Digg 等多源；last30days 通过“BYO Key + 浏览器会话”把它们缝合到同一 Agent 中。
- 与垂直内容监测工具（舆情/社媒监听）：last30days 更偏向“研究与写作辅助”，强调为 LLM 提供带引文的结构化证据而非仪表盘与告警。
## 局限与不足（客观）
- 上手仍需一些环境准备：
  - 需要准备 Node.js 与 Python 3.12+（.mcpb 包不会自带 Python 运行时）。
  - Windows 支持尚不完整（MCP .mcpb Windows 入口在 README 标注“deferred”），涉及跨浏览器 cookie 提取的部分也较复杂。
- 对外部依赖与 Key 的敏感度：
  - ScrapeCreators 等付费/受限源有配额与计费，需要注意用量与成本控制；部分平台反爬策略可能导致偶发降级。Issue 区有 YouTube/Instagram/X 后端的相关 open 问题，说明“墙花园”的不稳定性客观存在。
- 学习曲线：
  - SKILL.md 非常长（>2000 行），包含宿主适配细节与多模式逻辑；初学者可能会被参数丰富度吓到。建议先从宿主提供的 `/last30days` 一键命令开始，再按需切换 `--quick/--deep/--emit`。
- 不做全局 Web 索引：项目的“Web 搜索”依赖第三方 API（Brave/Exa/Serper），无独立爬虫，故无法覆盖全部长尾站点。
## 结语与行动建议（终极评判）
- 综合来看，last30days-skill 是设计思路清晰、工程质量高、生态活跃的“跨平台社群研究引擎”。它把“Google 搜不到的评论区与社交媒体真信号”变成可检索、可引用、可机读的证据，再交由 LLM 合成，非常适合内容、投资、产品和技术选型等场景。
- 行动建议：
  - 如果你使用 Claude Code，优先走“市场插件”路线，一步到位并享受自动更新；在首次运行后，按向导解锁更多源（X、YouTube、TikTok 等）。
  - 若需要跨多平台对比或自动化输出，善用 `--emit=json`、`--discover`、`--hiring-signals` 与“library 搜索”，将其纳入周报/线索/CRM 等流水线。
  - 对隐私敏感的用户，把研究内容留在本地，避免上传任何云端；善用 `--corpus` 做本地证据增强，并按需开启导出选项。
- 简而言之：如果你希望让手中的 Claude/Codex/Cursor/Copilot/Grok “看清最近30天人们在说些什么”，last30days-skill 是当前少见的、工程成熟且开箱可用的强力选择。
