# NVIDIA/SkillEvaluator

[GitHub URL](https://github.com/NVIDIA/SkillEvaluator)


## NVIDIA SkillEvaluator 深度评测：给 AI Agent Skill 装上"出厂质检机"

> NVIDIA 开源的 Agent Skill 三级质检流水线，用 Skill Lift 指标量化"装了 Skill 后 Agent 到底变强多少"。

- **Tags**: NVIDIA, Agent Skills, Skill Lift, 开源工具, AI 评测
- **Category**: 开发工具, AI 编程, 评测工具

## Details

# SkillEvaluator 深度评测：NVIDIA 给"Agent Skill"装上的第一台"出厂质检机"
> 评测对象：[NVIDIA/SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator)
> 项目定位：开源、Apache-2.0、Python 3.13+、实验性支持级别
> 评测日期：2026-11-15
---
## 一句话总结
**SkillEvaluator 是 NVIDIA 开源的"AI Agent Skill 三级质检流水线"——它用一个叫 Skill Lift（技能增益）的硬核指标，第一次把"装了这个 Skill 到底让 Agent 变强了多少"从主观感受变成了可复现的实验数字。**如果你正在写 Agent Skill、维护企业内部 Skill 仓库，或者做 Agent 评测研究，这是当前唯一一个把"结构校验 + 语义去重 + 真机 A/B 对比"打通到一份报告里的开源工具。
---
## 背景与痛点：当"Skill 满天飞"遇上"零质检门槛"
### 什么是 Agent Skill？
如果你还没用过 Skill，可以把它类比成**给 AI Agent 用的"插件说明书"**：一个文件夹，里面核心是 `SKILL.md`（YAML frontmatter + Markdown 正文），可选带脚本和参考资料。Agent 在遇到相关任务时，会动态加载这份说明书，从而掌握一项具体本领——比如"用我们公司品牌规范写 PPT""正确安装 cuOpt""调优 Jetson 内存"。
Anthropic 在 2025 年 10 月随 Claude Code 推出这套机制，并于 2025 年 12 月把它捐赠给 Agentic AI Foundation 成为**开放标准**。截至目前，已有 ChatGPT、Cursor、GitHub Copilot、VS Code 等超过 70 个平台接入，全网累计发布 Skill 数量突破 **100 万**。
### 痛点来了
但繁荣的背面是**几乎零门槛的发布流程**：
- **质量参差**：任何人都能往仓库扔一份 SKILL.md，结构错乱、描述含糊、甚至和已有 Skill 高度重复；
- **安全黑洞**：Skill 本质是 Agent 会主动读的指令文件，存在 prompt injection、Unicode 走私、密钥泄漏等真实攻击面；
- **玄学收益**：最致命的问题——"装了这个 Skill，Agent 真的变好了吗？"在 SkillEvaluator 之前，没人能给一个量化答案。一个写得漂亮但和 Agent 既有能力重叠的 Skill，反而可能浪费上下文窗口、增加 token 消耗。
NVIDIA 自己就站在风口浪尖：他们要在 Claude Code、Codex、Cursor 等平台发布针对自家 30+ 产品（CUDA、cuOpt、Jetson、NeMo…）的官方 Skill，**没有质检流水线根本不敢签名上架**。于是 SkillEvaluator 作为 NVIDIA Verified Skills pipeline 的核心组件诞生了。
---
## 核心亮点与功能剖析：三层漏斗 + 一个杀手级指标
SkillEvaluator 的设计像一条**工厂质检流水线**：每一个 Skill 都要从"外观、成分、上路实测"三个关卡依次通过，每层都能独立运行，不必跑完前一层。
### Tier 1：结构 & 安全门（"外观检查"）
回答的问题是：**"这个 Skill 安全吗、格式对吗？"**
- 静态 schema / frontmatter 校验，质量评分（0–100，对应 A–F 等级）；
- 集成 **SkillSpector** 做 prompt injection、数据外泄、Unicode 走私扫描；
- **Gitleaks** 检查密钥、**Semgrep** 做 script lint；
- 许可证合规检查、依赖检查；
- 配置 LLM 后可叠加"rubric 评分 + LLM 安全分析 + 发现项二次验证"。
> 类比：就像 API 网关的"入参 schema 校验 + WAF"，先把明显歪瓜裂枣挡在门外。
### Tier 2：语义去重（"成分检测"）
回答：**"这些指令是不是在重复自己 / 和别人重复？"**
用 embedding 余弦相似度找两件事：
- **Skill 内部**：同一份 SKILL.md 里写了两遍几乎一样的指导；
- **Skill 之间**：传一个 `--catalog ./skill-catalog.json`，就能和整个仓库里的 Skill 对比，找出"功能撞车"。
> 类比：像论文查重系统，但查的不是文本，而是指令的"语义指纹"。对一个有 300+ Skill 的企业仓库来说，这一层是上下文窗口节约的隐形守护者——重复 Skill 在 Agent 那里是无谓的认知负担。
### Tier 3：真机 A/B 实测（"路试"）
回答：**"装了它，Agent 真的更强吗？"**——这是整个项目最有原创性的部分。
工作机制：
1. 用 LLM 自动生成一份评测集（`evals.json`），包含显式、隐式、上下文相关和**负例**四种 case；
2. 借助 **Harbor**（Terminal-Bench 团队出品的开源 Agent 评测框架）把每个 case 跑两次——**一次装 Skill，一次不装**，各自在隔离 Docker sandbox 中，同一模型、同一 prompt、同一评分标准；
3. 评分维度共五个，并输出核心指标 **Skill Lift = with-skill 分数 − without-skill 分数**：
   - Security（安全性）
   - Correctness（正确性）
   - Discoverability（被正确加载/未被错误加载）
   - Effectiveness（达成用户目标）
   - Efficiency（少绕路、少浪费 token）
4. 同时报告 **pass@k**（多次尝试可靠性）和 token / 时间开销。
> 类比：临床医学里的 **随机对照试验（RCT）**——Agent 是病人，Skill 是新药，"装 vs 不装"就是安慰剂组 vs 试验组。
### 一份 Benchmark 数字，告诉你 Skill 到底值多少钱
NVIDIA 在 2026 年 8 月 12 日的 `benchmarks.json` 快照（commit 738d79e）上，对自家 300+ verified skills × Codex / Claude Code 两个 harness 做了统计，结果非常直观：
| 维度 | 不装 Skill 基线 | 装 Skill 后 | **Skill Lift** |
|---|---|---|---|
| Correctness | 46 | 87 | **+41** |
| Discoverability | 42 | 82 | **+40** |
| Effectiveness | 39 | 78 | **+39** |
| Efficiency | 43 | 78 | **+35** |
| Security | 97 | 98 | +1 |
| **总平均** | — | — | **+31**（剔除 Security 后 +39） |
更有趣的是两个反常识发现：
- **Token 节省并非自动发生**：`jetson-optimize-memory` 这个 Skill 把 token 从 617,306 砍到 142,540（−76.9%）；但 `cuopt-install` 反而让 token 从 25,227 涨到 55,582（+120.3%）。SkillEvaluator 把这种"反向优化"直接暴露出来，让你知道哪个 Skill 需要返工。
- **"产品比特定 Agent 更重要"**：同一 Skill 在 Claude Code 与 Codex 上的 Skill Lift 只差约 5 分，但跨 NVIDIA 产品的差异高达 +2 到 +46 分——说明 Skill 设计质量远比"用哪个 Agent harness"更影响收益。
---
## 上手门槛与部署体验：DX 评得很温和，但有几个"硬门槛"
### 安装：走 `uv`，干净且快
官方推荐的安装方式用 [Astral 的 uv](https://docs.astral.sh/uv/)，一行命令搞定：
```bash
uv tool install --python 3.13 \
  "skillevaluator[all] @ git+https://github.com/NVIDIA/SkillEvaluator.git"
```
**几条硬性门槛需要提前知道**：
| 项目 | 要求 |
|---|---|
| Python 版本 | **3.13+**（无回退路径，这是门槛之一） |
| Tier 1 完整能力 | 需要本机装 Semgrep、Gitleaks、SkillSpector |
| Tier 2 | 需要 embedding + chat 模型访问 |
| Tier 3 | 需要 LLM provider + 一个支持的 Agent（OpenCode/Codex/Claude Code）+ Docker |
### 配置 LLM Provider：每种最多两行
支持 NVIDIA Build（默认）、OpenAI、Anthropic、Bedrock 以及任何 OpenAI-compatible 网关。例如用 NVIDIA Build：
```bash
export SKILL_EVAL_LLM_PROVIDER=nv_build
export NVIDIA_API_KEY='nvapi-...'
```
或 OpenAI：
```bash
export SKILL_EVAL_LLM_PROVIDER=openai
export OPENAI_API_KEY='sk-...'
```
### CI 集成：官方有 GitHub Actions reusable workflow
官方文档提供了 reusable workflow，可在 PR 上直接出结果，这对维护企业 Skill 仓库的团队是个不可忽视的便利。
### 社区活跃度：早期但有 NVIDIA 背书
- **支持级别**：官方明确标注 **Experimental / best-effort**，**无 SLA**，bug 走 GitHub Issues。
- **Issue**：能看到具体的技术问题（如 plugin 场景下 hooks 和 bin/ 不被 Tier 1 扫描），说明已有真实用户在踩坑。
- **生态整合**：OpenClaw（ClawHub）已在试点把 Tier 3 结果直接展示到 Skill 详情页的 Evals tab；Nous Research 把 SkillSpector 接入了 Hermes Agent 的安装流程，每次扫描约 1.4–1.5 秒。
- **发布节奏**：CHANGELOG 和 GitHub Releases 维护良好，2026 年 11 月仍在活跃更新。
---
## Demo 与代码示例：从装到跑，最快 2 分钟
官方号称 **"Try it in two minutes"**——不带任何 API Key、Docker、外部扫描器，也能跑出质量分数。
### Step 1：免密快速体验 Tier 1
```bash
# 安装后，对你的 Skill 目录跑一次 keyless 质量检查
skillevaluator quality-check ./my-skill
```
输出是一份 0–100 分的评分报告 + A–F 等级。
### Step 2：单跑某一层
```bash
skillevaluator tier1 ./my-skill   # 结构 + 安全
skillevaluator tier2 ./my-skill   # 语义去重
skillevaluator tier3 ./my-skill   # 真机 A/B 实测
```
### Step 3：完整流水线（默认开启 autopilot）
```bash
skillevaluator validate ./my-skill
```
等价于 Tier 1（强制门禁）→ Tier 2（默认门禁）→ Tier 3（默认 advisory）。想跳过实测可用 `--tiers 1,2`。
### Step 4：手工生成更全面的评测集（推荐人工过一遍）
```bash
skillevaluator tier3 create-eval-dataset ./my-skill --full
```
会在 `evals/evals.json` 里生成包含显式、隐式、上下文相关和**负例**四种 case 的数据集。NVIDIA 在博客里明确建议**人工 review** 这份文件——评测集的质量直接决定 Skill Lift 的可信度。
### Step 5：跑指定 Agent 的 A/B 对比
```bash
skillevaluator tier3 evaluate ./my-skill \
  --agents codex \
  --env-mode docker
```
跑完后会产出一份含五维分数、Skill Lift、pass@k、token/时间开销的报告，支持 CLI / JSON / HTML / Markdown 四种格式输出。
### 环境自检
```bash
skillevaluator doctor --env-mode docker
```
像看医生一样告诉你缺哪些组件，DX 体验相当友好。
---
## 目标人群与收益：谁该立刻装它？
| 人群 | 痛点 | 用它能得到什么 |
|---|---|---|
| **Agent Skill 作者** | 不知道自己写的 SKILL.md 是否真的"有用"，只是凭感觉调 prompt | 量化 Skill Lift，知道是 +3 分还是 +41 分；同时拿到安全/重复问题清单 |
| **企业 Agent 平台运营团队** | 内部 Skill 仓库越长越大，重复、过期、含敏感信息的 Skill 无法治理 | 一条流水线接入 CI，把 Tier 1 当 PR 门禁、Tier 2 当查重、Tier 3 当上线验收 |
| **Skill 市场/应用商店方** | 想给上架 Skill 一个可信的"verified"标签 | OpenClaw、Nous Research 已经走出模板：在商店详情页直接展示 Evals tab |
| **评测研究者** | 通用 Agent benchmark（Terminal-Bench、SWE-bench）测的是 Agent 本身，不是某个"能力包"的贡献 | ACES 方法论 + Skill Lift 指标 + ATIF 轨迹格式，可直接引用其 arXiv 论文 |
| **普通 Claude Code / Codex 用户** | 不知道该不该装一个第三方 Skill | 至少跑一遍 Tier 1 + `quality-check`，避免装进去恶意或纯冗余的指令 |
---
## 竞品对比：目前几乎是"独苗"
直接对标 SkillEvaluator 的开源项目，目前**几乎不存在**——它的差异化是把"结构校验 + 去重 + RCT 实测"做成了**一条流水线**。但可以在相邻赛道对比：
| 工具 | 定位 | 与 SkillEvaluator 的差异 |
|---|---|---|
| **Harbor**（Terminal-Bench 团队） | 通用 Agent 评测框架，测 Agent 在 benchmark 上的表现 | SkillEvaluator Tier 3 直接复用 Harbor 做沙箱执行，二者是**上下游关系而非竞争** |
| **SkillSpector**（NVIDIA） | 专注 Skill 安全扫描 | SkillEvaluator Tier 1 内嵌它做安全部分，可单独使用 |
| **anthropics/skills** | Anthropic 官方 Skill 仓库（示范用） | 只是 Skill 内容集，没有质检流水线 |
| **传统 Agent benchmark**（SWE-bench、Terminal-Bench、GAIA） | 评测 Agent 本身的通用能力 | 不回答"某一个 Skill 包贡献了多少"这个问题 |
| **学术方法 ACES**（arXiv 2608.20614） | 论文层面的方法论 | SkillEvaluator Tier 3 是 ACES 的工程实现，理论-工程双向背书 |
独特竞争力：**"Skill Lift"作为一等指标** + **配对 A/B 严格的控制变量实验设计** + **NVIDIA 自家 300+ verified skills 的真实生产数据反馈**——这三点加起来，目前没有第二个开源项目同时做到。
---
## 局限与不足：别被"NVIDIA 出品"四个字晃了眼
客观看，这个项目处在**早期 + 高门槛**阶段，落地前有几个真实的坑：
1. **Experimental 级别，无 SLA**：官方自己在 SUPPORT.md 里写明是 best-effort 社区支持，企业生产环境慎用为核心基础设施。
2. **Python 3.13 强制**：没有降级路径，老项目若锁在 3.10/3.11 必须用 `uv` 单独装个隔离工具链。
3. **Tier 3 成本不可忽视**：每个 Skill 的实测都要在沙箱里跑若干次 LLM 调用（with/without × case 数 × Agent 数），官方自己都建议 "start with one agent and a small dataset"。
4. **评测集质量 = Skill Lift 上限**：Tier 3 默认 autopilot 只生成一个 starter case，NVIDIA 博客原文承认 "a skill can only be measured as precisely as its evaluation set describes the job"，意味着**你必须自己写好 EVAL.md**，否则 Skill Lift 数字仅供参考。
5. **已知盲区**：Issue 区已经发现 Tier 1 在 plugin 场景下只扫描 bundled skills，hooks 和 bin/ 不会被覆盖。
6. **单次 attempt 主导**：85% 的已发布 Skill 只跑了 1 次尝试，pass@k 数据还较稀薄，结果存在一定方差。
7. **Agent harness 支持有限**：Tier 3 默认 NVIDIA Build → OpenCode、OpenAI → Codex、Anthropic → Claude Code，要接其他 Agent 需自行适配。
---
## 结语与行动建议：终极评判
**综合评分（满分 10）**：
- 创新性 ★★★★★（10/10）：Skill Lift + 三层漏斗，业界首个把"Skill 是否真有用"变成可量化指标的工程化方案
- 工程成熟度 ★★★☆☆（6/10）：代码组织清晰、CLI 设计漂亮，但 Experimental 级别 + Python 3.13 锁定 + 部分场景扫描盲区
- 文档与 DX ★★★★☆（8/10）：NVIDIA Docs 站点非常完整，有 Quickstart、tier guides、CI、报告、性能面板
- 生态位价值 ★★★★★（10/10）：在一个 100 万 Skill、70+ 平台的标准生态里，它是**目前唯一**的"出厂质检机"
### 给你的可执行建议
- **如果你是 Skill 作者**：先跑 `skillevaluator quality-check ./your-skill`（keyless，2 分钟出结果），再视情况上 Tier 1/2。Tier 3 等你写好了 EVAL.md 再跑，否则数字意义有限。
- **如果你维护企业 Skill 仓库**：把 Tier 1 接入 PR 门禁（GitHub Actions reusable workflow），Tier 2 设为 advisory，Tier 3 只在 major 版本或新上架时跑。
- **如果你只是普通 Agent 用户**：装新 Skill 前用 SkillSpector 单独扫一遍安全问题就够，不必部署整套 SkillEvaluator。
- **如果你做研究**：直接读 arXiv 2608.20614（ACES 论文）+ 复刻 `benchmarks.json` 的实验设计，这是 2026 年最值得跟进的 Agent 评测方向之一。
一句话收尾：SkillEvaluator 解决的不是"Agent 怎么跑得更快"，而是"**你贴上去的那张说明书到底有没有让 Agent 变聪明**"——在 Agent Skill 生态爆炸式增长的当下，这个看似窄的问题，恰恰是决定整个生态能不能从"民俗集市"进化到"标准化供应链"的关键拼图。
