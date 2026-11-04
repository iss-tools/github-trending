# Thysrael/Horizon

[GitHub URL](https://github.com/Thysrael/Horizon)


## Horizon 深度评测：自托管 AI 新闻雷达，把信息筛选的编辑权还给你

> 一个开源自托管工具，把 HN、Reddit、RSS 等多个信息源聚合成按你口味打分排序的中英双语每日简报。

- **Tags**: 开源项目, 信息聚合, 自托管, AI 评分, RSS
- **Category**: 开发工具, AI 应用, 效率工具

## Details

# 📡 Thysrael/Horizon 深度评测：把"AI 新闻雷达"装进你自己家的自托管方案
---
## 一句话总结
**Horizon 是一个把 Hacker News、Reddit、RSS、Telegram、Twitter/X、GitHub 等信息源揉成一份"中英双语、按你的口味打分排序"的每日 Markdown 简报的开源 Python 项目**——它不是又一个 RSS 阅读器，也不是又一个"AI 帮你刷信息流"的 SaaS，而是一台可以自己部署在自己服务器上、用你自己 API Key 跑、按你自己审美过滤的"私人新闻雷达站"。目前 GitHub 上约 1.1 万 Star，2026 年 5 月曾登顶 Python 类 Trendshift 日榜/周榜，作者来自上海交大 IPADS 实验室，MIT 协议，完全自托管。
如果你厌倦了 Feedly 的花哨订阅、Folo 的"信息咖啡厅"氛围，又不想把阅读品味交给推荐算法——这篇评测看完你就知道该不该入坑。
---
## 背景与痛点：作者在解决一个很"老派"的问题
### 痛点是真实的：好内容散落在 7 个地方
现代技术人的信息获取大致面临三重困境：
- **信息源碎片化**：HN Top 看"行业风向"，Reddit 看"实战反馈"，GitHub Trending 看"项目热度"，Telegram 看小圈子内幕，RSS 看深度博客——每处都要人工巡查，体力活；
- **AI 摘要工具的"平庸化"**：绝大多数 AI 新闻工具的逻辑是"把所有内容喂给大模型，让它总结"，结果就是所有输出都长成一个味儿——泛泛的"重要更新"；
- **SaaS 工具的黑盒与锁定**：你订阅了谁、它凭什么给你推这条、它的"价值排序"到底用了什么 prompt，你一概不知，还要交月费。
### 作者对这件事的回答很有性格
Horizon 的作者 **Thysrael**（本名 Sheng Qiang）是**上海交通大学 IPADS（并行与分布式系统研究所）的在读学生**——这是国内系统领域最硬核的实验室之一，常年出 SOSP / OSDI / FAST 顶会论文，代表作品包括 ChCore 操作系统、OS-Course-Lab 教学项目、以及 2025 年 SOSP Best Paper。
他在自己的 dev.to 长文里把产品哲学说得很明白：
> "我不想把我的品味外包给一个算法。"
所以 Horizon 的设计立场是：**人负责选信息源、定阈值、写评分标准；AI 负责抓取、清洗、去重、翻译、补充背景；最后那一层"要不要读"的判断权，仍然留在人手里。** 这套"AI 当助手，不当主编"的取舍，是它和一票 AI 摘要工具最本质的区别。
---
## 核心亮点与架构剖析：把"AI 评分"做成流水线，而不是一次 Prompt
### 🌟 亮点 1：Profile 系统——给不同类型的内容配不同的"主编人设"
这是 Horizon 最具原创性的设计。它引入了 **Profile（画像）** 这个概念：每一条新闻不会被用一个统一 prompt 处理，而是先被路由到一个具体的 profile，再用该 profile 自己的评分标准和 enrichment 模板来打分与生成。
官方内置三个 profile，定位非常清晰：
| 你订阅的内容 | Profile | AI 会输出什么 |
| --- | --- | --- |
| 科技新闻 | `tech-news` | 事件 + 背景，必要时补行业影响和社区讨论 |
| 工程深度博客 | `tech-blog` | 背景 + 解法 + "我能学到什么"的实操要点 |
| AI 创作者素材 | `ai-creator` | 摘要 + 热点钩子 + 可写的内容角度 |
**打个比方**：这就好比你雇了三位风格不同的主编——一位跑新闻、一位啃技术长文、一位琢磨爆款选题。同一条消息进来，先由"接待员"判断该交给谁，再由对应主编按自己的尺度打分、写出符合风格的小段。这就是为什么 Horizon 出来的日报读起来不像"AI 味"，而像有人真的在按栏目编辑。
### 🌟 亮点 2：透明可调的 0–10 评分机制
Horizon 把"AI 觉得这条有多重要"做成了一个**公开的、可配置的评分表**。内置 `tech-news` 的评分标准如下：
| 分数 | 档位 | 描述 |
| --- | --- | --- |
| 9–10 | Groundbreaking | 范式级突破、重大版本、改变行业的发布 |
| 7–8 | High value | 重要进展、技术深挖、有价值的新方法/工具 |
| 5–6 | Interesting | 渐进改进、有用教程、社区中等热度 |
| 3–4 | Low priority | 常规更新、浅层内容、软广 |
| 0–2 | Noise | 垃圾、跑题、纯推广 |
每条内容会被 AI 用这份 rubric 打分，再按你在 `config.json` 里设的 `threshold` 过滤。也就是说，**你可以直接说"低于 8 分的我都不想看"**，Horizon 会替你把噪音拦在门外。
### 🌟 亮点 3：跨源去重 + 社区讨论补充
同一个事件往往在 HN、Reddit、Twitter 同时炸开。Horizon 会按 URL 与话题相似度**合并重复报道**，并把原帖的 HN 评论区、Reddit 高赞讨论拉过来作为参考——这一点非常关键，因为**评论区经常比新闻本身更接近真相**，这是大部分 AI 摘要工具完全忽视的一层。
### 🌟 亮点 4：投递通道丰富，做成了"信息基建"而不是 App
生成的 Markdown 日报可以：
- 自动发到 **GitHub Pages**（自带 demo 站：[thysrael.github.io/Horizon](https://thysrael.github.io/Horizon/)）；
- 通过 **SMTP/IMAP** 做**邮件订阅 / 退订**；
- Webhook 推送到 **飞书 / 钉钉 / Slack / Discord / 自定义 endpoint**；
- 通过 iLink Bot 推送到 **微信**（扫码登录，注意微信有回复条数限制）；
- 作为 **MCP Server** 让 Claude Code、Codex 等 AI Agent 直接调用每一段流水线；
- 通过 **Agent Skill** 安装到你的 AI 助手：`npx skills add Thysrael/Horizon --skill horizon -g`，让 Claude 帮你配源、调 Profile、跑调度。
这是它最"基建感"的部分——Horizon 不强迫你打开它的 App，它跑到你已经习惯阅读的地方去找你。
---
## 上手门槛与部署体验：小白略陡，开发者极丝滑
### 三种部署姿势
**A. 本地安装（推荐给想折腾配置的开发者）**
```bash
git clone https://github.com/Thysrael/Horizon.git
cd Horizon
uv sync            # 推荐，速度极快
# 或 pip install -e .
```
**B. Docker 一键跑（推荐给只想用的人）**
```bash
git clone https://github.com/Thysrael/Horizon.git
cd Horizon
docker compose build --build-arg EXTRAS=openbb horizon
docker compose run --rm horizon
```
**C. AI 助手代装（最有 2026 年味的方式）**
```bash
npx skills add Thysrael/Horizon --skill horizon -g
```
装完后直接对 Claude 说"帮我装一个 Horizon 并配置 Hacker News 和 AI 新闻的日报"——它能用 Skill 调 MCP 工具自己完成。
### 配置：交互式向导 vs 手写 JSON
新版本提供了一个**交互式向导**，会问你"你关注什么领域（如 LLM 推理 / 嵌入式 / web 安全）"，自动生成 `data/config.json`。一个惊喜的细节：**ChatGPT Plus 订阅用户可以通过 `openai-chatgpt` provider 走 Sign in with ChatGPT，无需 OpenAI API Key**——这对不想单独买 API 的人是笔可观的开销节省。
手写配置的最小示例长这样（这是评测里最值得直接抄走的一段）：
```json
{
  "sources": {
    "hacker_news": { "profile": "tech-news" },
    "rss": [
      { "url": "https://someblog.dev/feed", "category": "ai-news", "profile": "auto" }
    ]
  },
  "ai": {
    "base_url": "${OPENAI_BASE_URL}",
    "api_key_env": "OPENAI_API_KEY",
    "languages": ["en", "zh"],
    "analysis_concurrency": 4
  },
  "processing": {
    "profile_settings": {
      "tech-news": { "threshold": 8.0 }
    }
  },
  "digest": {
    "max_items": 20,
    "category_groups": {
      "ai": { "limit": 5, "categories": ["ai-news", "ai-tools"] }
    },
    "default_group_limit": 3
  }
}
```
要把握几个关键点：
- `api_key_env` 必须是**环境变量的名字**，不是 key 本身，真实 key 写在 `.env` 里；
- `profile: "auto"` 会让 AI 自己判断该路由到哪个 profile，也可以写成数组 `["tech-news", "finance-news"]` 限制候选范围；
- 任何字符串都可以用 `${VAR_NAME}` 引用环境变量，方便管理私密的 RSS 链接或 webhook；
- `category_groups` 和 `max_items` 用来防止"某天 LLM 新闻井喷，把Finance 挤没了"的失衡。
### 资源占用非常轻
X-CMD 的仓库卡片显示：**磁盘占用 37 KB，内存 ~5 MB，单进程**，CPU 占用极低，对一台便宜 VPS 或家里吃灰的 NAS 都毫无压力。
---
## 社区活跃度与生命力：小而精，仍在高速迭代
- **Star**：约 1.1 万，曾登上 Trendshift 2026 年 5 月 7 日 Python 类日榜/周榜双第一；
- **贡献者**：37–39 人；
- **Issue / PR**：近 90 天 19 个 Issue（17 已关闭）、13 个 PR 全部合并，节奏健康；
- **代码规模**：约 3.4 万行，Python 占 99.2%，源码 954 KB，注释 3176 行——代码组织密度偏高但文档完整；
- **官方周边**：除了主仓库，还有独立的 Horizon-Site 站点仓库（`Thysrael/Horizon-Site`）和**面向社区的信息源分享站 [horizon1123.top](https://horizon1123.top)**——作者明确表示"source-sharing 是产品的核心，不是附属功能"，这是个很有意思的产品观。
- **路线图**：作者在 README 里写明暂未发布 PyPI 包、未打 tag release，新增 Discord 源在计划中。
赞助方包括 Modelflare、UCloud Compshare、OfoxAI 等多家 API 中转平台，说明项目已经有了一定的商业生态关注度。
---
## Demo：3 分钟跑出你的第一份日报
下面这段是**最短可跑通路径**，配合 GitHub Actions 模板，可以做到"每天早上 8 点飞书收到一份当天技术简报"：
```bash
# 1. 拉代码
git clone https://github.com/Thysrael/Horizon.git
cd Horizon
# 2. 填密钥
cp .env.example .env
echo "OPENAI_API_KEY=sk-xxx" >> .env
# 3. 交互式配置（推荐）
uv sync
uv run horizon init   # 按提示选源、填兴趣、选模型
# 4. 跑一次
uv run horizon run --hours 24
# 5. 看结果
open data/summaries/$(date +%F).md
```
输出是一份带 **AI 评分角标**的 Markdown，例如：
> **9.0｜Anthropic 发布 Claude 4.5 Opus，SWE-bench 提升到 78%**
> 背景：与 4.0 相比……社区讨论：HN Top 评论认为……
> **8.0｜开源项目 X 发布 2.0，把 Ollama 推理速度提升 2.3×**
> 背景：……
每一分角标都对应一段 AI 给出的"为什么这条值这个分数"的 reason，透明可追溯。
---
## 目标人群与收益：谁该认真考虑它
| 人群 | 你能拿到什么 |
| --- | --- |
| **独立开发者 / 极客** | 把握 GitHub Trending + HN + Reddit 一站式，不再每天切换 7 个 Tab |
| **AI 研究者 / 工程师** | 用 `tech-blog` profile 自动筛出"可落地的工程细节"，跳过营销噪音 |
| **内容创作者** | `ai-creator` profile 直接给"热点钩子 + 可写角度"，省 1 小时选题时间 |
| **投资人 / 行业分析师** | 启用 `OpenBB` 财务源 + 高阈值（8.0+），只看真正大事件 |
| **Newsletter 主理人** | 中英双语 + Markdown 输出，可以直接做二次编辑和发布 |
| **自托管爱好者** | 一份 JSON 控制，MIT 协议，部署在自己服务器，零订阅锁定 |
**最大收益**：把每天 2–3 小时的"刷信息流"压缩到 10 分钟读一份结构化日报，且阅读品味始终是自己的。
---
## 竞品对比：它站在哪一格
| 工具 | 形态 | AI 能力 | 自托管 | 中文友好 | 成本 |
| --- | --- | --- | --- | --- | --- |
| **Horizon** | 自托管 Python 流水线 | Profile 化评分 + 补充背景 + 去重 | ✅ | ✅（双语原生） | API 自付 |
| **Folo / Follow** | RSS 客户端 + 区块化分享 | 内置 AI 摘要 | ❌ | ✅ | 免费 + 订阅 |
| **Feedly / Inoreader** | 商业 RSS 服务 | AI 噪音过滤（Leo） | ❌ | 一般 | 月费 $8–15 |
| **NewsNow 类抓取脚本** | 纯爬虫 | 无 AI | ✅ | 部分 | 免费 |
| **各类 AI 摘要 SaaS** | Web App | 通用摘要 | ❌ | 一般 | 月费 $10–20 |
| **RAG 类自建方案** | 自写代码 | 任意 | ✅ | 自定义 | 开发成本 |
Horizon 占据的位置很清晰：**它是"自托管 + AI 评分 + Profile 化编辑"这三件事的交集里目前最完整的开源实现**。如果你想要的是"打开 App 滑一下"的体验，去用 Folo；如果你想要"我自己定义什么叫重要"，Horizon 几乎是当下唯一选项。
---
## 局限与不足：必须直说的几个坑
### ⚠️ 1. 学习曲线对非开发者偏高
虽然有了交互式向导，但要真正玩转 Profile（自己写 `analysis.md`、`enrichment.md`）、调优 `threshold`、配 webhook，你至少需要：会读 JSON、理解环境变量、能跑通 Docker 或 Python venv。**纯小白如果从来没碰过 GitHub，第一次部署会有明显的挫败感。**
### ⚠️ 2. AI 调用是真金白银的成本
每条内容至少 1 次分析调用 + 部分内容 1 次补充调用。如果订阅 20 个源、时间窗 24 小时，按 GPT-4o-mini 算大概每天几十美分到几美元。**用旗舰模型（Claude Opus / GPT-4o）做全量分析会贵到肉疼**——建议主力用便宜模型打分，补充背景才用旗舰。
### ⚠️ 3. 部分 source 的依赖并不"开箱即用"
- `Twitter/X` 源依赖 **Apify**（一个付费爬虫服务）和 **Playwright** 浏览器，**当前 Dockerfile 没自动装 Playwright 系统依赖**，需要手动补；
- `OpenBB` 财务源需要单独装 `openbb` extra，部分平台没有 wheel，需要 `uv pip install --only-binary=:all:` 强制二进制安装。
### ⚠️ 4. 版权与 ToS 的灰色地带
Horizon 抓取 RSS、HN 评论、Reddit 帖子、推文——**项目本身不解决"转载版权"和"摘要是否构成实质性替代"**，X-CMD 的评测也明确指出这一点。如果你把它用于商业 Newsletter，需要自己评估源站的 ToS 和法律边界。
### ⚠️ 5. 工作节奏是"批量"而非"实时"
Horizon 是按 `time_window_hours` 拉一次、跑一遍流水线、出一份日报——**它不是实时信息流**。如果你需要秒级监控（比如盯某个爆炸新闻），它不是工具。
### ⚠️ 6. Profile 生态还很早期
虽然有 `tech-news` / `tech-blog` / `ai-creator` 三个官方 Profile，但社区共享的 Profile 库还没成型，**大多数高质量 Profile 仍要自己写**，这是它未来最值得期待也最缺的一块。
---
## 结语与行动建议：一份"该不该用"的判断清单
> **Horizon 是 2026 年开源 AI 信息聚合赛道里少见的"立场鲜明"作品——它押注的是"人味 + AI 当助手"，而不是"AI 全权代劳"。**
**适合立刻入坑的人**：
- 有 VPS 或 NAS、会一点 Python/Docker；
- 每天真的需要跨 3 个以上信息源做技术追踪；
- 对阅读品味有执念，不想让推荐算法定义你"该看什么"；
- 想给团队做一个共享的技术日报 / Newsletter 后端。
**可以先观望的人**：
- 完全没有部署经验的纯小白（建议先用官方 demo 站感受输出风格）；
- 只想看 5 条以内精选，对源没要求的人（用 AI 摘要 SaaS 更省事）；
- 追求秒级实时监控的人（这不是 Horizon 的菜）。
**入坑建议**：
1. 先用 `uv sync` 本地跑一次 demo 模式，看一眼输出格式喜不喜欢；
2. 再决定要不要部署到服务器 + GitHub Actions 定时跑；
3. 把 `threshold` 设在 7.0–8.0 起步，跑两周再调；
4. 加入作者维护的 QQ 群 **1106121909**，可以抄到不少现成的源和 Profile 配置。
**一句话终评**：在 AI 把"信息筛选"越来越自动化的今天，Horizon 反其道而行之地把"编辑权"还给了你——这种反潮流的克制，让它成为目前开源领域最值得装进自家服务器的一份"新闻雷达"。
