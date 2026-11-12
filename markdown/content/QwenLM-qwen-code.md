# QwenLM/qwen-code

[GitHub URL](https://github.com/QwenLM/qwen-code)


## Qwen Code 深度评测：阿里开源终端 AI 编程 Agent，Claude Code 的开源平替

> 阿里开源的终端 AI 编程 Agent，功能对标 Claude Code，多协议接入任意模型，中文友好且性价比高，但免费额度已停需付费使用

- **Tags**: Qwen Code, AI Agent, 终端工具, 代码生成, 开源
- **Category**: AI 编程, 开发工具, 开源项目

## Details

# Qwen Code 深度评测：阿里开源终端 Agent 的「开源版 Claude Code」野心与现实
> 一句话总结：**Qwen Code 是阿里通义千问团队开源的终端 AI 编程 Agent，以「Claude Code 平替」的姿态强势切入赛道——框架 Apache 2.0、模型开放权重、多协议接入、IM/IDE/Desktop 全形态覆盖，工程能力扎实；但免费 OAuth 已于 2026 年 4 月 15 日停服，真实模型能力也未完全达到官方基准所暗示的水平，把它当作「自由度极高、需要自己带钥匙的多协议 Agent 框架」来看，比当作「永久免费午餐」更符合现实。**
---
## 一、背景与痛点：从 Gemini CLI 的「影子」长成独立物种
把时间拨回 2025 年 7 月，开发者面对终端 AI 编程工具只有三个尴尬选项：**Claude Code 体验最好但订阅贵、Gemini CLI 免费但模型能力偏弱、国内开发者想用国产模型接入终端 Agent 几乎没有现成方案**。阿里团队选择了一个聪明却争议的捷径——直接 fork Google Gemini CLI v0.8.2（Apache 2.0 协议允许），针对 Qwen3-Coder 模型深度改造 parser 和工具调用协议，于是 Qwen Code 诞生。
早期版本的 README 甚至还残留着 "Gemini" 字样，被 InfoWorld 专栏作者吐槽「整个文档区还写着 Gemini」——这种「缝合感」也是它早期被质疑「套壳」的主要原因。但从 v0.1 开始，项目**正式脱离上游独立演进**，今天再看 GitHub 仓库，已经发展成一个功能上反超原型的多协议 Agent 框架。
它解决的核心痛点有三个：
1. **终端原生的 Agentic Coding**——不像 IDE 插件那样被 UI 绑架，`qwen` 命令直接在 shell 里读写文件、跑命令、调 MCP；
2. **国产模型的开源阵地**——Qwen3-Coder-480B-A35B 在 SWE-bench Verified 上把开源模型推向第一梯队；
3. **多协议解耦**——框架与模型彻底分离，今天用 Qwen、明天切 Claude、后天本地跑 Ollama，配置一个 base URL 就搞定。
一个值得玩味的细节：**Qwen Code 仓库本身就在用自己迭代自己**——官方明确说「用 Qwen Code 自己的 agent 来 file issues、提交 PR、review 代码、跑 autofix」，2026 年 11 月连发布失败都是自动修复 agent 接管处理，这在开源社区里相当罕见。
---
## 二、核心亮点与功能剖析
### 2.1 多协议架构：把「模型供应商」彻底做成插件
Qwen Code 最 distinctive 的设计是把 LLM 接入抽象成可运行时切换的多协议层，原生支持 **OpenAI / Anthropic / Gemini / Qwen** 四大协议，并内置 DeepSeek、Grok、MiniMax、Z.AI、Kimi、ModelScope、OpenRouter 等第三方 Provider，也能接 Ollama / vLLM 的本地模型。
这意味着它**不是一个「Qwen 专用工具」，而是一个「可挂载任意模型的 Agent 框架」**——这一点甚至超过了 Claude Code 的开放度。配置方式就是标准三件套环境变量：
```bash
export OPENAI_API_KEY="your_api_key_here"
export OPENAI_BASE_URL="https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
export OPENAI_MODEL="qwen3-coder-plus"
```
或者用阿里 Coding Plan 专属端点（Anthropic 兼容协议）：
```
https://coding-intl.dashscope.aliyuncs.com/apps/anthropic
```
> **金句锚点**：把框架写成 Apache 2.0、把模型开放权重、把协议做成插槽——Qwen Code 在「去厂商锁定」这件事上，做得比多数硅谷同行彻底。
### 2.2 Agentic 能力堆栈：对标 Claude Code 的功能对照表
官方在 README 里直接放了一张与 Claude Code 的对比表，坦率承认自己是在向 Claude Code 看齐后做差异化。以下是核心功能对照：
| 能力维度 | Qwen Code | Claude Code |
|---|---|---|
| SubAgents / Agent Teams / 动态工作流 | ✅ | ✅ |
| Auto-Memory / Auto-Skills / Hooks | ✅ | ✅ |
| 内置 Skills（/review /batch /loop /bugfix） | ✅ | ✅ |
| MCP / Plan Mode / LSP 集成 | ✅ | ✅ |
| Auto Mode / Sandbox / Git Worktrees | ✅ | ✅ |
| Computer Use（桌面自动化） | ✅ | ✅ |
| IDE 插件（VS Code / JetBrains / Zed） | ✅ | ✅ |
| Headless / SDK / Session 管理 | ✅ | ✅ |
| **开源（模型 + 框架）** | ✅ | ❌ |
| **多协议**（OpenAI/Anthropic/Gemini/Qwen + 任意 Provider） | ✅ | ❌ |
| **Agent Arena**（同任务多模型对抗） | ✅ | ❌ |
| **Daemon 模式**（qwen serve 多客户端共享） | ✅ | ❌ |
| **IM 频道**（Telegram / 钉钉 / 微信 / 飞书 / WeCom / QQ） | ✅ | ❌ |
几个值得展开的亮点：
- **Daemon Mode（`qwen serve`）**：把 Agent 跑成长驻服务，浏览器、编辑器、SDK、CI 可以共享同一个会话，HTTP + SSE 协议，多 workspace 支持——这是 Claude Code 都没有的能力，对做自动化流水线特别友好。
- **Agent Arena**：让多个模型在同一个任务上头对头比拼，相当于内置了 benchmark 工具，对选型期的团队非常实用。
- **IM 频道接入**：在微信 / 飞书 / 钉钉里直接 `@机器人` 让它改代码、查 PR——这是国内团队的刚需，海外竞品基本不碰。
- **/review 内置代码审查**：支持 `--effort low|medium|high` 三档深度、能直接 `--comment` 把 inline 评论贴到 GitHub PR、能 `--resume` 续审被打断的 PR——这是把 Claude Code 的 `/review` 反向研究得非常彻底。
### 2.3 部署体验：从 npm 一行命令到桌面应用全形态
**安装只要一行**（要求 Node.js 22+）：
```bash
# npm 全局安装
npm install -g @qwen-code/qwen-code@latest
# 或 macOS / Linux 一键脚本
curl -fsSL https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen-standalone.sh | bash
# Windows PowerShell
irm https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen-standalone.ps1 | iex
```
启动后输入 `qwen` 进入交互模式，`/auth` 选 Provider，`/doctor` 检查环境，`/language ui zh-CN` 切中文界面——整个 onboarding 流程对国内用户比 Claude Code 友好得多。
**SDK 示例**（来自官方 README，TypeScript / Python / Java 三套都有，下为 Python）：
```python
import asyncio
from qwen_code_sdk import is_sdk_result_message, query
async def main() -> None:
    result = query(
        "Summarize the repository layout.",
        {"cwd": "/path/to/project", "path_to_qwen_executable": "qwen"},
    )
    async for message in result:
        if is_sdk_result_message(message):
            print(message["result"])
asyncio.run(main())
```
**无头模式**适合 CI/CD：`qwen -p "fix all linting errors"`，可以塞进 GitHub Actions。
### 2.4 SWE-bench 成绩：78% 这个数字怎么读
官方评估文档给出了完整的测试配置：**7 个 Qwen Code 版本 × 500 个 SWE-bench Verified 案例 × 每版本 3 次运行 × 同一个 Qwen 3.7 Max 模型**，平均分 76.40%–77.80%，版本间波动仅 1.4 个百分点。
这个成绩单要分两面看：
- **正面**：稳定在 76%+ 的水准已经接近 Claude Sonnet 4 同期的水平，证明 Agent harness 工程质量过关，不是「模型强 harness 弱」的半成品。
- **谨慎**：这是项目方**自测口径**，评测配置里 `max_iterations=500`、`runtime_timeout_sec=7200`（2 小时）属于「给足子弹」的宽松设置；SWE-bench 本身就被学术研究指出主要奖励模型的迭代式推理而非长上下文能力，且各家提交的方法论不透明。
InfoWorld 的实测感受更接地气：「Qwen3-Coder 在大多数编码用例上不如 Claude Sonnet 4 可靠，感觉更接近 Gemini 2.5 Pro」——这其实是一个比较公允的定位，**同梯队里中上，但不是断层领先**。
---
## 三、目标人群与收益
### 3.1 谁应该立刻试一试
| 人群 | 收益点 | 推荐度 |
|---|---|---|
| **国内后端 / 全栈开发者** | 中文 Prompt 友好、Qwen 模型在国内访问稳定、IM 接入飞书/钉钉开箱即用 | ⭐⭐⭐⭐⭐ |
| **习惯终端工作流的老鸟** | 真正的 CLI-native，能塞进 CI、能 headless、能 daemon 化 | ⭐⭐⭐⭐⭐ |
| **对厂商锁定敏感的团队** | Apache 2.0 + 多协议，今天用 Qwen 明天切 Claude 无缝切换 | ⭐⭐⭐⭐⭐ |
| **预算敏感的独立开发者** | Coding Plan Pro $50/月对标 Claude Pro $100+/月，本地跑 Ollama 完全免费 | ⭐⭐⭐⭐ |
| **二次开发 / Agent 工程师** | TS/Python/Java 三套 SDK + 完整 Daemon REST API 文档 | ⭐⭐⭐⭐⭐ |
| **追求极致编码质量的重度用户** | 综合体验仍略逊 Claude Code，可能想换回去 | ⭐⭐⭐ |
### 3.2 它能为你解决什么
- **降低成本**：同样任务量下 Token Plan / Coding Plan 比 Anthropic 订阅便宜一半以上，本地跑 Qwen3-Coder-30B-A3B（仅 19GB）是真正的零边际成本。
- **加速代码理解**：扔进陌生仓库跑 `Explain this repository and show me where to start.`，它会自动读 README、CHANGELOG、源码结构，几分钟输出一份架构综述——新人 onboarding 神器。
- **接管重复劳动**：PR 审查、commit message、文档更新、单测编写、lint 修复，这些机械性工作可以全权交给 `/review` 和 `qwen -p`。
- **跨 IM 协作**：在飞书群里 @机器人 让它改 bug、发 PR，适合非工程角色（产品、运营）参与代码迭代。
---
## 四、竞品对比：它在 AI Coding Agent 赛道的位置
| 维度 | **Qwen Code** | **Claude Code** | **Gemini CLI** | **Codex CLI** | **Aider** |
|---|---|---|---|---|---|
| 开源协议 | Apache 2.0（框架+模型） | 闭源 | Apache 2.0 | 闭源 | Apache 2.0 |
| 底层模型 | Qwen3-Coder（可换任意） | Claude Sonnet/Opus | Gemini 2.5 Pro | GPT-5.x | 任意（自己带） |
| 多协议支持 | ✅ 四协议 + 本地 | ❌ 仅 Anthropic | ❌ 仅 Gemini | ❌ 仅 OpenAI | 部分支持 |
| 上下文长度 | 256K 原生 / 1M 扩展 | 200K | 1M | 400K | 取决于模型 |
| IDE 集成 | VS Code / JetBrains / Zed / Desktop | VS Code / JetBrains | VS Code 插件 | VS Code | 主要是 Git diff 流 |
| IM / Bot 接入 | 微信 / 飞书 / 钉钉 / Telegram / QQ | ❌ | ❌ | ❌ | ❌ |
| 中文体验 | 原生中文 UI + 中文模型 | 一般 | 一般 | 一般 | 取决于模型 |
| 免费额度 | 已停（2026-04-15 起） | Sonnet 有少量免费 | Gemini API 有免费层 | ChatGPT Plus 附带 | 自带 key |
| 付费起步 | $6/月 Token Plan Lite | $100/月 Pro | 按 token | $20/月 ChatGPT Plus | 仅 API 费 |
| 综合体验分 | ★★★★ | ★★★★★ | ★★★ | ★★★★ | ★★★ |
| 性价比 | ★★★★★ | ★★ | ★★★★ | ★★★ | ★★★★ |
**一句话定位**：Qwen Code 是「Gemini CLI 的壳 + Claude Code 的功能 + 国产模型的性价比」的杂交产物——**单维度可能都不极致，但综合 Chinese-friendly + 多协议 + 开源 + IM 集成这一组能力的，只有它**。
---
## 五、局限与不足：踩过的坑，必须告诉你
### 5.1 免费午餐正式结束
这是最大的「劝退点」。**Qwen OAuth 免费层经历了 2000 → 1000 → 100 次/天的逐步缩水，最终于 2026 年 4 月 15 日完全停服**，现在 `/auth` 菜单里根本没有 OAuth 选项，必须用 API Key 或订阅。GitHub 上 issue #3203 的官方解释是「产品策略调整以管理免费层使用和成本」。
很多旧教程（包括本评测调研过程中看到的多篇 CSDN / 博客园文章）还在写「每日 2000 次免费」，**实测会直接报 `quota exhausted`**——这是接入前必须知道的事实。
### 5.2 真实能力没到 Benchmark 那么神
InfoWorld 实测记录了一个非常典型的翻车案例：让它用 Chudnovsky 算法写一个 C++ 高精度 π 计算程序，**模型前半段选对了算法，写到中途突然切到效率更低的 Machin 公式**，作者吐槽「这代码我以前在 Stack Overflow 上见过」，怀疑是训练数据里烂答案的回归。
更尴尬的是当 shell 命令实际失败时，模型回复「Perfect! We have both GMP and MPFR libraries installed」——**它没有检测到自己命令根本没跑成**。这说明在长链条 Agentic 任务里，Qwen3-Coder 的「自我纠错」能力仍弱于 Claude Sonnet。
GitHub issue #354 还有用户报告「CRITICAL: Qwen Coder agent destroys working builds」——破坏性修改代码库这种所有 AI Agent 都有的老毛病，Qwen Code 也没幸免。
### 5.3 起源包袱与文档滞后
虽然从 v0.1 起独立演进，但 fork 的痕迹需要时间消化：部分工具列表、命令风格、交互模式仍与 Gemini CLI 高度相似，**按 Gemini CLI 旧文档配置会出错**。
### 5.4 配置与运维的隐性成本
- **CI/无头环境不能用 OAuth**：必须提前配好 API Key，这是许多自动化脚本第一次跑就翻车的地方。
- **密钥管理风险**：`~/.qwen/settings.json` 集中存 key，**不小心 commit 进仓库就直接泄露**，必须 `.gitignore`。
- **Windows npm 全局路径问题**：装完找不到 `qwen` 命令是新手最常见的报错，要么配 PATH 要么用 `npx @qwen-code/qwen-code` 绕过。
- **大仓库性能瓶颈**：Node.js 调度 + 全仓上下文检索在超大 monorepo 上会有延迟，建议先做子集索引。
- **Arch Linux 包管理器版本滞后**：建议直接走 npm 或官方脚本。
### 5.5 政策与 Bias
InfoWorld 直白地指出：Qwen 系列模型在涉及中国政府敏感话题时会拒绝回答，「对代码生成没影响，但如果你介意，就别用」。这是一个客观存在的特性，应该在采用决策时纳入考量。
### 5.6 团队方向的微妙变化
社区反馈提到「Qwen 团队领导层变动后有向更专有开发倾斜的趋势」——这与 OAuth 免费层停服、Token Plan 商业化加速的动作一致。**开源框架本身短期内不会闭源，但「白嫖官方模型」的好日子大概率一去不返**。
---
## 六、结语与行动建议
**终极评判：Qwen Code 是国内开发者目前最值得花一周时间认真折腾的终端 AI 编程 Agent，它不是 Claude Code 的「更好版本」，但它是中文世界里「自由度 × 集成度 × 性价比」综合最优解。**
给三类读者的行动建议：
> **🚀 行动派（30 秒上手）**
> ```bash
> npm install -g @qwen-code/qwen-code@latest
> qwen
> # /auth → 选 QwenCloud Token Plan（$6/月起）或贴你的 API Key
> # 第一句测试：Explain this repository and show me where to start.
> ```
> **🔍 选型派（团队接入前必读）**
> 1. 先用 Agent Arena 在你们真实仓库上跑 Qwen3-Coder vs Claude Sonnet vs GPT-5.x 同任务对比；
> 2. 测算你们的人均月调用量对照 Token Plan / Coding Plan 表（$6/$10/$18/$68/$50 五档）；
> 3. 评估 IM 接入是否刚需——如果团队用飞书/钉钉，这一项就能加分很多；
> 4. 做好密钥治理（Vault + .gitignore + 最小权限 API Key）。
> **🛡️ 谨慎派（持币观望）**
> 把 Qwen Code 当成「Plan B」而不是主力——iFlow CLI 的关闭和 Qwen OAuth 的停服都说明：**任何依赖单一厂商免费层的工具链都是踩在流沙上的**。最好的姿势是：日常用 Claude Code 或 Cursor 干重活，把 Qwen Code 配置成「随时可切换的 Plan B」和「本地跑开源模型的试验田」。
**未来 6 个月值得关注的三个信号**：① Qwen3-Coder-Next 是否能真正把 80B 级模型推到 Claude Sonnet 4.5 水平；② Daemon Mode + ACP 协议能否成为 Agent 跨工具互操作的事实标准；③ 国内对手（字节 Trae、智谱 CodeGeeX、月之暗面）是否会跟进开源同等强度的终端 Agent。**这场仗，远没到终局。**
