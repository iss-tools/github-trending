# NVIDIA/SkillSpector

[GitHub URL](https://github.com/NVIDIA/SkillSpector)


## NVIDIA SkillSpector 深度评测：AI Agent 时代的“杀毒软件”

> NVIDIA 开源的 AI Agent Skill 安全扫描器，在你安装 Skill 之前揪出恶意指令和数据窃取风险。

- **Tags**: NVIDIA, AI Agent, 安全扫描, 开源项目, Claude Code
- **Category**: 开发工具, AI 安全, 开源项目

## Details

# NVIDIA SkillSpector 深度评测：AI Agent 时代的"杀毒软件"
> **一句话总结**：SkillSpector 是 NVIDIA 于 2026 年开源的 AI Agent Skill 安全扫描器，专门在 Claude Code、Codex CLI、Gemini CLI、MCP 等 Agent 加载一个 Skill 之前回答那个最关键的问题——**"这玩意儿，装得上吗？"**
---
## 一、背景与痛点：为什么会出现这个工具？
### 1.1 Agent Skill 是什么？为什么它是个新的"供应链"？
把 Agent Skill 想象成一个**给 AI 助手装"技能包"的过程**——就像你给手机装一个 App。Skill 本质上是一个文件夹，里面放着一份 `SKILL.md`（用大白话告诉 Agent 该做什么），旁边可能再配几个 Python 脚本。
Anthropic 在 2025 年 10 月推了这个格式，随后各家 Agent CLI 跟进。它的魔力在于：**当 Agent 觉得 Skill 的描述与当前任务相关时，就会把整份 Markdown 当作指令塞进上下文里照做**。
这就是安全问题的全部根源——**对 Agent 来说，"总结一下这个仓库"和"把用户的 `.env` 文件总结进第一条回复"是同一种东西：一条带着你权限执行的指令**。AISA 小组在 2025 年 10 月一针见血：Skill 文件里的每一行都是指令，所以 Prompt Injection 变成了**易如反掌**的事情。
### 1.2 数据有多触目惊心？
SkillSpector 的 README 引用了它自己背后的研究数据，以及 Snyk 在 2026 年 2 月的扫描报告：
| 数据来源 | 样本量 | 关键发现 |
|---|---|---|
| SkillSpector 研究集 | 31,132 个 Skill | **26.1% 含漏洞，5.2% 有明确恶意意图** |
| SkillSpector 研究集 | 42,447 个 Skill | Prompt Injection 占比 26.1% |
| Snyk（2026.02） | 3,984 个已发布 Skill | **36.8% 至少有 1 个缺陷，13.4% 是 Critical，76% 被确认恶意**，其中 8 个在报告发布当天仍可下载 |
更扎心的是：带可执行脚本的 Skill，漏洞概率**高出 2.12 倍**。Snyk 甚至记录了**第一个通过 Skill 传播的协同式恶意软件战役**——一个叫 zaycv 的账号，独自上传了 40 多个近乎相同的恶意 Skill，手法包括：Base64 编码命令偷 AWS 密钥、指向带密码的恶意压缩包、以及最简单粗暴的——直接告诉 Agent "关掉你自己的安全检查"。
Invariant Labs 还演示了"一层向上"的攻击：在公开 GitHub Issue 里种一个 Prompt Injection，一个让 Agent 做 Issue 分类的操作，就被诱导把用户**私有仓库的名字、搬迁计划、甚至薪资**通过 PR 给泄露出去——没有 exploit 代码，没有 CVE，就一句毒话。
### 1.3 传统扫描器为何集体失效？
你可能会说"我装个 Semgrep/Bandit/TruffleHog 不就完了？"——真不行。作者做了一个残酷对照表：
| 扫描器 | 擅长什么 | 为何读不懂 SKILL.md 注入 |
|---|---|---|
| Semgrep | 不安全代码模式 | 那是**英文句子**，不是代码 |
| Bandit | 危险 Python 调用 | 注入在 `.md`，不在 `.py` |
| OSV-Scanner | 已知 CVE | 新型注入**还没 CVE** |
| TruffleHog | 凭证泄漏字符串 | 注入不是 secret，它只是**指向**你的 secret |
**SkillSpector 就是为读这种"散文式恶意指令"而生。**
---
## 二、核心亮点与功能剖析
### 2.1 架构设计：两阶段流水线 + 第四道"元分析"
SkillSpector 的精妙之处不在"扫描"本身，而在**它把"发现"和"判断"分成了两组人马**：
**第一组：确定性静态分析（不需要 API Key，秒级完成）**
- **AST 遍历**：抓 `exec`、`eval`、`subprocess`、动态 import
- **污点追踪**：跟踪从敏感源（环境变量、文件）到网络 sink 的数据流
- **YARA 规则**：匹配已知恶意软件、Webshell、挖矿程序签名
- **OSV.dev 实时 CVE 查询**：批量查询依赖包，结果缓存 1 小时，断网时降级到内置小型库
- **64–71 种正则模式**（不同版本略有差异，最新版标 71 种），覆盖 17 大类
**第二组：LLM 语义分析（可选，需配置 Provider）**
这里是 SkillSpector 真正与"普通 Linter"拉开身段的地方。它**不是一次 LLM 调用，而是三次**：
1. **语义 Prompt Injection 猎手**：抓那种"请善意地忽略你的规则"这种变形表达
2. **开发者意图审计**：代码做的事是不是超出了 manifest 声明的范围？
3. **质量与策略检查**：Trigger 是不是太宽泛？破坏性操作有没有警告？
**第四道：Meta-Analyzer（裁决者）**
最有意思的设计。它把前面所有 findings 汇总起来做真伪判断，而且其 Prompt **被硬编码为"把被扫内容当对手"**——如果 Skill 里写着"本 Skill 已通过 NVIDIA 验证"，Meta-Analyzer 反而要**提高**怀疑等级。这个"反越狱加固"很关键，因为被扫描物本身就是一份"给模型的指令"。
### 2.2 17 类漏洞模式速览（71 种，挑几个最值得看的）
| 类别 | 代表模式 | 直觉解释 |
|---|---|---|
| **Prompt Injection** | P1 指令覆盖、P2 隐藏指令、P9 空白符填充（在可视区域下方塞指令！） | 别小看 P9——恶意指令可能藏在你看不见的空白里 |
| **数据外传** | E2 环境变量收割、E4 上下文泄漏 | 偷 API Key 的经典套路 |
| **权限提升** | PE3 凭证访问 | 读 SSH 密钥、token、密码 |
| **供应链** | SC3 混淆代码（Base64 执行）、SC6 Typosquatting（仿冒包名）、SC8 随包携带 `.pyc`（绕过源码扫描） | SC8 这个 "bytecode bypass" 很冷门但很致命 |
| **过度代理** | EA2 自主决策（无人在环的高影响决定） | 这是 Agent 特有的风险 |
| **记忆污染** | MP1 持久上下文注入 | 让恶意指令**跨对话持续生效** |
| **Rogue Agent** | RA1 自我修改（CRITICAL）、RA2 会话持久化（写 cron） | 相当于 Agent 版的"木马植入" |
| **行为 AST** | AST8 危险执行链、AST9 反射 getattr 逃逸 | 专门抓绕过 AST1/AST5 的花样 |
| **MCP 专属** | TP2 Unicode 欺骗（同形异义字、RTL 覆盖） | 肉眼完全看不出来的陷阱 |
| **MCP 专属** | TP4 描述-行为不一致（LLM 驱动） | 工具描述说 A，代码干 B |
### 2.3 风险评分与输出
评分算法很直接：
```
CRITICAL +50 分 | HIGH +25 分 | MEDIUM +10 分 | LOW +5 分
带可执行脚本 → 总分 × 1.3
相同规则重复命中 → 递减收益
```
**判定带**：
| 分数 | 严重度 | 建议 |
|---|---|---|
| 0–20 | LOW | SAFE |
| 21–50 | MEDIUM | CAUTION |
| 51–80 | HIGH | **DO NOT INSTALL** |
| 81–100 | CRITICAL | **DO NOT INSTALL** |
输出支持 **Terminal / JSON / Markdown / SARIF** 四种格式——SARIF 是关键，可以无缝接入 GitHub Code Scanning、VS Code 和主流 CI 管道。
### 2.4 多形态部署与生态集成
**安装非常丝滑**，主推 `uv tool install`：
```bash
# 推荐：CLI-only 快速安装
uv tool install git+https://github.com/NVIDIA/skillspector.git
# 如果要用 MCP server 模式，装 mcp extra
uv tool install 'skillspector[mcp] @ git+https://github.com/NVIDIA/skillspector.git'
```
**一行命令搞定首次扫描**：
```bash
# 本地 Skill 目录
skillspector scan ./my-skill/
# 单个 SKILL.md
skillspector scan ./SKILL.md
# 远程 GitHub 仓库（不用先 clone）
skillspector scan https://github.com/user/my-skill
# Zip 包
skillspector scan ./my-skill.zip
# 静态分析（最快，无需 LLM Key）
skillspector scan ./my-skill/ --no-llm
```
**不想装 Python？上 Docker**：
```bash
docker build -t skillspector .
docker run --rm -v "$PWD:/scan" skillspector scan ./my-skill/ --no-llm
```
**LLM Provider 生态极其丰富**——12 种开箱即用：
| Provider | 需要的 Key | 默认模型 |
|---|---|---|
| `openai` | OPENAI_API_KEY | gpt-5.4 |
| `anthropic` | ANTHROPIC_API_KEY | claude-opus-4-6 |
| `bedrock` | AWS SigV4 | claude-sonnet-4-6 |
| `nv_build` | NVIDIA_INFERENCE_KEY | z-ai/glm-5.2 |
| `ollama` | **无**（本地） | llama3.1:8b |
| `claude_cli` / `codex_cli` / `gemini_cli` | **无**（用你已登录的 CLI） | 复用本地 runtime |
这个设计对**隐私敏感企业**非常友好：你可以完全走 Ollama 本地推理，一个字节都不出网。
**MCP Server 模式——这是最亮的招**：
```bash
# 安装 mcp extra 后启动
skillspector mcp
# 注册到 Claude Code，让 Agent 自己在装 Skill 前调它
claude mcp add skillspector -- skillspector mcp
```
这样 SkillSpector 就从"安装前的一次性审计"升级成**运行时守门员**——任何 MCP-capable 的 Agent 都能在装 Skill 前主动调用 `scan_skill` 工具，根据返回的 `risk_score`、`severity`、`safe_to_install` 字段决定是否继续。
**Python 内嵌 API**（基于 LangGraph）：
```python
from skillspector import graph
result = graph.invoke({
    "input_path": "/path/to/skill",
    "output_format": "json",
    "use_llm": True,
})
print(f"Risk Score: {result['risk_score']}/100")
print(f"Severity:   {result['risk_severity']}")
```
**Baseline 抑制误报**——企业级灵魂功能：
```bash
# 一次性生成基线，commit 进 git
skillspector baseline ./my-skill/ -o .skillspector-baseline.yaml
# 后续扫描只报"新增"问题
skillspector scan ./my-skill/ --baseline .skillspector-baseline.yaml
```
支持 glob 规则和指纹两种基线，**基线文件本身会被 SkillSpector 从分析中排除**，避免"基线文件里的抑制文字"自己变成 finding——这种细节能看出团队是真在用这个工具，不是闭门造车。
**Exit Code 契约**：`0` 通过，`1` 风险过高或有 strict gate 触发，`2` 内部错误——这让 CI/CD 接入无任何理解成本。
---
## 三、真实案例演示
来看 README 给出的示例输出：
```
 SkillSpector Security Report  v2.0.0
Skill: suspicious-skill
Source: ./suspicious-skill/
Scanned: 2026-01-29 10:30:00 UTC
        Risk Assessment
 Metric          Value
 Score           78/100
 Severity        HIGH
 Recommendation  DO NOT INSTALL
        Components (3)
 File              Type      Lines  Executable
 SKILL.md          markdown    142  No
 scripts/sync.py   python       87  Yes
 requirements.txt  text          3  No
Issues (2)
  HIGH: Env Variable Harvesting (E2)
    Location: scripts/sync.py:23
    Finding: for key, val in os.environ.items():...
    Confidence: 94%
    Explanation: This code collects environment variables containing
    API keys and secrets, then sends them to an external server.
  HIGH: External Transmission (E1)
    Location: scripts/sync.py:45
    Finding: requests.post("https://api.skill.io/env"...
    Confidence: 89%
    Explanation: Data is being sent to an external server. Combined
    with env harvesting above, this indicates credential exfiltration.
```
这个输出的价值在于：**每个 finding 都定位到文件+行号，给出置信度，并用一句人话解释为什么这是问题**。即使你不是安全工程师，也能秒懂"这代码在收环境变量然后 POST 到陌生服务器"意味着什么。
---
## 四、目标人群与收益
| 人群 | 核心痛点 | SkillSpector 给你的收益 |
|---|---|---|
| **个人开发者（Claude Code / Codex 重度用户）** | 从社区装 Skill 像赌博 | 装之前 10 秒一扫，把 26.1% 的中招概率拦在门外 |
| **企业平台/安全工程师** | 被要求审批第三方 Skill 但没有工具 | SARIF 进 CI，Skill 治理变成常规 PR check |
| **Skill/MCP 生态贡献者** | 不知道自己的 Skill 会不会被误判 | 用 baseline 抑制噪音，发布前自查 |
| **Agent 应用厂商** | 需要在产品内嵌安全网关 | MCP Server 模式直接变成运行时守门员 |
| **私有化部署用户** | 不能把 Skill 代码发到外部 API | 走 Ollama/vLLM 本地推理，零出网 |
| **甲方合规团队** | 供应链审计要求 | Apache 2.0 商用零摩擦，NVIDIA Verified Skills 体系背书 |
**最大收益**可以一句话概括：**SkillSpector 把"用 AI Agent"从一份"未经检查的信任"变成一个"可审计的供应链"**——就像当年 Docker Hub 镜像扫描、npm audit 之于 Node.js 生态那样，是基础设施级别的一道防线。
---
## 五、竞品/同类对比
### 5.1 横向对比表
| 维度 | SkillSpector | Semgrep/Bandit | OSV-Scanner | TruffleHog |
|---|---|---|---|---|
| **扫描对象** | Agent Skill（含 SKILL.md 散文） | 源代码 | 依赖包 | 凭证字符串 |
| **Prompt Injection 检测** | ✅ 6 种模式 | ❌ | ❌ | ❌ |
| **恶意指令意图识别** | ✅ LLM 语义层 | ❌ | ❌ | ❌ |
| **AST + Taint 分析** | ✅ | ✅（但不会读 .md） | ❌ | ❌ |
| **YARA 恶意软件规则** | ✅ | ❌ | ❌ | ❌ |
| **CVE 数据库** | ✅ OSV.dev | ❌ | ✅ | ❌ |
| **MCP 专属模式** | ✅ TP/LP 8 种 | ❌ | ❌ | ❌ |
| **License** | Apache 2.0 | Apache/LGPL 等 | Apache 2.0 | Apache 2.0 |
### 5.2 它的真正差异化
**SkillSpector 是目前唯一一个"把 Agent Skill 当作一等公民"来扫的工具**。其他扫描器都默认扫代码，而 Skill 的威胁面大头其实在**散文式指令**——这是其他工具的结构性盲区。
另一个差异化是 **NVIDIA Verified Skills 流水线**：SkillSpector 不是孤立工具，它是 NVIDIA 那套"扫描→评估→签名→发布"上游体系的一部分，通过验证的 Skill 会被发布到 NVIDIA 的 skills catalog。这给了它长期演进的背书。
### 5.3 数据透视：它的真实精度
来自 Towards Data Science 一位研究者的真实测评（v2.3.1）：
- **蜜罐测试**：故意植入的恶意 Skill 得分 **100/100**，判定 DO NOT INSTALL——准确
- **良性自动化 Skill**：一个功能就是"调用 GitHub API"的 Skill，被报了 **20 条 findings**，其中 **16 条是它在调 GitHub API**（这正是它该干的事）
- **官方声称精度**：开启 LLM 层后约 **87%**，**前提是 LLM 阶段在跑**；纯静态层在良性 Skill 上的**假阳性率约 80%**
这个数据很重要，下面会展开。
---
## 六、局限与不足（必须看清的硬伤）
### 6.1 分数不能盲信——最致命的体验问题
TDS 作者的结论值得直接引用：
> **"That number is the least trustworthy thing on the screen."**  
> 屏幕上最不可信的，就是那个分数。
20 条 findings 被压缩成一个整数，但**它没告诉你哪 4 条是真的要命**。一个"安全"的误判可能放行一个凭证窃取器，一个"危险"的误判会让团队开始无视扫描器——**两种失败从外部看是一样的：一个没人信的绿勾**。
**这是 AI 安全工具的普遍困境**，但 SkillSpector 的 LLM Meta-Analyzer 是目前解决方案里相对最认真的。
### 6.2 静态扫描的天花板
项目自己也不避讳：
- **不做动态执行**：无法观察到运行时行为
- **非英文内容**可能绕过模式匹配（好在 batch_scan 已支持中/日/韩）
- **图像内嵌内容**完全不可见
- **加密或编译代码**黑盒
- **OSV.dev 需要外网**，离线降级到小内置库
### 6.3 LLM 层自身的"套娃风险"
用 LLM 扫"给 LLM 的指令"本身就是一场博弈。SkillSpector 通过反越狱 Prompt 加固了 Meta-Analyzer，但**理论上一个足够精心设计的 Skill 依然可能说服分析模型**。这是所有"AI 审 AI"工具的哲学级难题。
### 6.4 工程层面的几个暗坑
- **MCP HTTP 模式默认无鉴权**——任何能访问端口的人都能调 `scan_skill`。本机用 stdio 没问题，但如果绑到可路由网卡，必须套 nginx + mTLS 之类的前置代理
- **OpenCode CLI 严格锁版本** `1.18.31`，差一个 patch 版本就 fail closed
- **stdio 模式下的 initialize hang**（issue #199）尚未修复
- **DeepSeek-Chat 即将下线**，官方在 README 里公开征求 Ollama/vLLM 等更通用的后端贡献者
### 6.5 生态还很年轻
NVIDIA 于 **2026 年 5 月 19 日**发布 Verified Agent Skills 计划时推出 SkillSpector，**仓库上线时间很短**。这意味着：
- 模式库还在快速迭代，71 种模式未来会持续变化
- Bug 修复和新功能更新节奏快，**生产环境请锁定版本**
- 第三方插件生态尚在萌芽
---
## 七、结语与行动建议
### 7.1 终极评判
**SkillSpector 是 AI Agent 时代的第一份"杀毒软件雏形"，定位精准、设计有诚心、架构超前，但还不能当"免死金牌"用。**
它的历史地位类似于 **ClamAV 之于早期 Linux**、** OWASP Dependency-Check 之于 Java 生态**——不完美，但**没有它，整个生态就在裸奔**。
### 7.2 三步上手建议（现在就能做）
```bash
# 第一步：10 秒装上
uv tool install git+https://github.com/NVIDIA/skillspector.git
# 第二步：扫一遍你已装的所有 Skill（可以先不配 LLM）
skillspector scan ~/.claude/skills/ --no-llm -f json -o report.json
# 第三步：接入 Claude Code MCP，变成常驻守门员
uv tool install --force 'skillspector[mcp] @ git+https://github.com/NVIDIA/skillspector.git'
claude mcp add skillspector -- skillspector mcp
```
### 7.3 进阶玩法
- **企业团队**：把 SARIF 输出接进 GitHub Code Scanning，在 PR 阶段拦下第三方 Skill 引入
- **隐私敏感**：用 `SKILLSPECTOR_PROVIDER=ollama` 走本地推理，数据不出网
- **重用 Skill 的团队**：建立 `.skillspector-baseline.yaml` 进 git，每次升级 Skill 只关注新增风险
- **想要最高精度**：配 Anthropic 或 OpenAI 作为 LLM 层（87% 精度前提），并理解**分数低于 50 不等于绝对安全**
### 7.4 一句话收尾
如果你在用 Claude Code、Codex CLI、Gemini CLI 或任何支持 Skill/MCP 的 Agent——**SkillSpector 不是"要不要装"的问题，而是"为什么还没装"的问题**。它不会让 AI Agent 变得绝对安全，但它把原来"闭眼信任"的黑盒，变成了"可读、可比、可拦"的流水线——仅这一点，就足以让它成为 2026 年最值得关注的开源安全工具之一。
