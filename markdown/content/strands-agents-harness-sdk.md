# strands-agents/harness-sdk

[GitHub URL](https://github.com/strands-agents/harness-sdk)


## Strands Agents（harness-sdk）深度评测：AWS 开源的模型驱动 Agent 框架，给模型工具就能自己跑

> AWS 开源的生产级 AI Agent 框架：你给模型工具和目标，它自己推理跑循环，你只握缰绳。

- **Tags**: Agent框架, AWS, 开源, AI Agent, Python
- **Category**: 开发工具, AI 编程, 开源框架

## Details

# Strands Agents（harness-sdk）深度评测：AWS 开源 Agent 框架里的一股清流，还是又一个玩具？
> **一句话总结**：Strands Agents 是 AWS 开源的、以「模型驱动」为核心理念的生产级 AI Agent SDK——你不用再手写 Agent Loop，只要给它模型、工具和一句目标，它自己会推理、调工具、纠错、收尾；如果你正被 LangGraph 那一堆节点和边搞得头昏，它是当下最值得上手对比的一股清流。
---
## 一、背景与痛点：AWS 为什么自己造了这个轮子？
在 2024 年之前，构建 AI Agent 的主流玩法是「工程师写死工作流」：你得在 LangGraph 里画节点、连边、定义状态机，或者在 AutoGen 里精心编排多轮对话角色。问题在于——**现代大模型（尤其是 Claude 3.5+、GPT-4o 这一档）的规划能力已经强到不需要你替它画图了**，那些冗长的编排代码反而成了枷锁。
Strands Agents 是 AWS **内部孵化的产物**：Amazon 内部团队在构建自己的 AI Agent 时，沉淀出了一套"让模型自己跑循环"的范式，后来直接开源出来。它最核心的设计哲学只有一句话——
> **你只需要提供三样东西：Prompt（目标）、Tools（工具）、Model（模型），剩下的推理循环由模型自己驱动。**
这种理念与 LangGraph 形成鲜明对照：LangGraph 说"你画图，模型执行"；Strands 说"你给工具，模型自己想怎么走"。社区甚至流传过一句形象的吐槽——"原来在 LangGraph 里要写 40 行的图定义，用 Strands 3 行就跑起来了"。
仓库地址是 `strands-agents/harness-sdk`，名字里的 **harness（背带/驾驭工具）** 才是点睛之笔：它不是让你"调教"模型，而是给你一套缰绳，让你**在模型自主推理的同时，仍然能端到端地掌控它的每一步**。
---
## 二、核心亮点与架构剖析：它到底"精"在哪？
### 2.1 Monorepo 结构：一次开源，三端全家桶
Strands 不是一个包，而是一个 monorepo，覆盖了从开发到文档到治理的完整链路：
| 目录 | 内容 | 发布渠道 |
|---|---|---|
| `strands-py/` | Python SDK：Agent Loop、Model Provider、Tools | PyPI |
| `strands-ts/` | TypeScript SDK：同等的 TS 实现 | npm |
| `site/` | 文档站 strandsagents.com（Astro/Starlight） | — |
| `team/` `designs/` | 治理文档、设计提案 | — |
这种结构传达了一个信号：**Python 和 TypeScript 是一等公民**，不是"先做 Python 再顺手移植"的二等 TS 版本——这点在同类开源框架里其实少见。
### 2.2 「Hand-rolled Loop 长成什么样，它就覆盖到哪一步」
README 里有一句非常精准的定位："Choose Strands when you would otherwise write your own agent loop"——**只要你正准备自己写一个 while 循环调用 LLM，就该看看它**。它把一个"手写 Agent Loop 会逐渐长出来的所有器官"都装进了一个 SDK：
- **生命周期控制**：turn 上限、token 预算、取消信号、stop_reason
- **工具 + 结构化输出**：原生支持 Pydantic（Python）/ Zod（TS）
- **MCP 原生支持**：直接接 MCP Server，不用自己写胶水
- **多 Agent 模式**：Swarm、Graph、A2A（Agent-to-Agent）等模式内置
- **Memory & Sessions**：会话状态管理开箱即用
- **Guardrails + Steering**：工具调用前先校验，Agent 走错了能"拨回来"而不是静默失败
- **Tracing & Evals**：默认打点，每一步决策都留痕
### 2.3 Hooks 机制：它的"缰绳"到底握在哪？
很多 Agent 框架的痛点是**一旦进入循环，你就失去了控制权**——模型想干嘛干嘛，你只能事后看日志骂娘。Strands 的 Hook 系统是这个项目最有工程价值的设计：
```
Hook 拦截点：
  before_model_call   → 改写 prompt / 切换模型 / 限流
  after_model_call    → 校验输出 / 记录成本
  before_tool_call    → 权限校验 / 参数审计 / 敏感操作拦截
  after_tool_call     → 结果过滤 / 异常降级
  on_agent_end        → 清理资源 / 上报指标
```
打个比方：**LangGraph 像是你给司机画好了一张路线图，司机照图开；Strands 像是你给司机一辆自动驾驶车，但方向盘上的每一颗按钮你都留着，随时可以接管**。这就是 "harness" 一词的本意。
### 2.4 模型可移植性：不是 Bedrock 专属
尽管是 AWS 出品，Strands 反而做得很开放：**Amazon Bedrock、Anthropic、OpenAI、Gemini、Ollama 等都是一等公民**，甚至允许你写自定义 Provider。代码层面切换模型，通常只需要改一行。
> 💡 小白理解：你可以把它想成"VLC 播放器"—— 不管你的视频文件是 MP4、MKV 还是 AVI，它都能放；而 Claude Agent SDK 只能放 .mov 一样。
---
## 三、Demo 时间：3 分钟跑起来到底有多简单？
### Python 版（最简 5 行）
```python
# pip install strands-agents strands-agents-tools
from strands import Agent
from strands_tools import calculator
agent = Agent(tools=[calculator])
agent("What is the square root of 1764")
# → Agent 会自动调用 calculator 工具 → 返回 42
```
### TypeScript 版（用 Zod 定义工具的类型安全示例）
```typescript
import { createHarness } from '@strands-agents/harness'
import { tool } from '@strands-agents/sdk'
import z from 'zod'
const classifyLead = tool({
  name: 'classify_lead',
  description: 'Score and classify a lead.',
  inputSchema: z.object({
    email: z.string(),
    company: z.string(),
  }),
  callback: ({ email, company }) => {
    const data = crm.lookup(company)
    return {
      leadId: crm.createLead(email, company),
      score: computeIcpScore(data),
      segment: data.industry,
    }
  },
})
```
**上手体验的真实感受**：Python 路径几乎零摩擦——`pip install` 之后 5 行代码就能跑。唯一的坎是**默认 Provider 是 Bedrock**，你需要提前配好 AWS Credentials 并开通 Claude Sonnet 的模型访问权限，否则第一次跑会直接报 403。建议新手把 `AWS_REGION` 也提前设一下，避免 region 不支持所选模型时白折腾。
---
## 四、竞品对比：它在 Agent 框架版图上的位置
| 维度 | **Strands Agents** | **LangGraph** | **CrewAI** | **AutoGen** | **Claude Agent SDK** |
|---|---|---|---|---|---|
| **核心理念** | Model-driven：模型自己跑 Loop | Graph-driven：你画状态机 | Role-based：角色分工 | Conversation：对话驱动 | Claude 专属，官方栈 |
| **上手难度** | ⭐⭐ 极低 | ⭐⭐⭐⭐ 高 | ⭐⭐ 低 | ⭐⭐⭐ 中 | ⭐⭐ 低 |
| **生产就绪度** | ⭐⭐⭐⭐（AWS 内部打磨） | ⭐⭐⭐⭐⭐ 最成熟 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **模型支持** | 任意模型（Bedrock/OpenAI/Anthropic/Gemini/Ollama…） | 任意模型 | 任意模型 | 任意模型 | **仅 Claude** |
| **MCP 原生** | ✅ | 需自行集成 | 部分支持 | 部分支持 | ✅ |
| **多 Agent 模式** | Swarm / Graph / A2A 内置 | 需自行组装 | 核心卖点 | 核心卖点 | 部分 |
| **可观测性** | 默认打点，原生 Tracing | 需 LangSmith | 需第三方 | 需第三方 | 自带 |
| **许可证** | Apache 2.0 | MIT | MIT | MIT | 专有 |
| **最佳场景** | **想让模型自主规划 + 保留强控制** | 复杂有状态工作流 | 角色协作模拟 | 学术研究、多 Agent 对话 | 全栈 Claude 用户 |
**一句话选型**：
- 想让模型自己想、自己跑，且你只想"握着缰绳"→ **Strands**
- 需要复杂的、有明确状态转移的业务流程 → **LangGraph**
- 想模拟"产品经理+程序员+测试"的团队协作 → **CrewAI / AutoGen**
- 你已经是 Claude 全家桶、不在乎被锁定 → **Claude Agent SDK**
---
## 五、目标人群与收益：谁该用它？能得到什么？
### 👤 适合人群
1. **生产环境 Agent 开发者**：你在写一个真实的 AI 产品，需要 Tracing、Guardrails、Token 预算控制，而不是 demo 玩具。
2. **被 LangGraph 折磨过的工程师**：你觉得画图、维护状态机的成本大于收益，希望"少写 30 行编排，多写 3 行业务"。
3. **AWS 生态深度用户**：已经有 Bedrock 配额和 IAM 体系，想要一个官方维护、长期兜底的框架。
4. **MCP 生态探索者**：你想把自家工具一键暴露给模型，又不想自己实现 MCP Client 逻辑。
### 🎯 具体能解决什么痛点
- **痛点 1：Agent Loop 写完烂尾**。手写的 while 循环会遇到 token 超限、死循环、工具调用失败重试——这些 Strands 都内置了。
- **痛点 2：排查 Agent "为什么这么做"像考古**。默认 Tracing 让每一步决策都有据可查（Braintrust、Temporal 等第三方也提供了一键接入）。
- **痛点 3：模型切换成本高**。今天用 Bedrock，明天老板说"换成 OpenAI 省钱"——改一行配置即可，业务代码零改动。
- **痛点 4：多 Agent 编排从零造轮子**。Swarm、Graph、A2A 模式开箱即用，不用再找 AutoGen 拼接。
---
## 六、局限与不足：不好听但必须说的话
### 6.1 默认 Provider 是 Bedrock，国内开发者要绕一道
首次运行必须配 AWS Credentials、开通 Claude Sonnet 访问权限、设置正确的 region。对于国内开发者，**要申请 AWS Global 账号或者用 Bedrock 的国内区**（如北京/宁夏），模型可用性还存在差异。第一次跑通的挫败感，可能比 OpenAI 直连要高。
### 6.2 项目年轻，生态还在追赶
相比 LangGraph 已经积累的大量教程、 Cookbook、企业案例，Strands 的社区生态仍在建设中。虽然它是 GitHub Trending 的常客，但你现在去搜"Strands Agents + [具体报错]"，结果数量明显少于"LangGraph + [同一个报错]"。**遇到冷门坑，可能得自己啃源码或去 Discord 问**。
### 6.3 「Model-driven」不是银弹
模型驱动的代价是**可控性换灵活性**：LangGraph 里你能精确地说"必须先调 A 再调 B"，而 Strands 里你要通过 Prompt、Guardrails、Hook 去"引导"而非"命令"模型。对于**强合规、强审计、有固定 SOP 的业务**（比如金融风控、医疗诊断），Graph-driven 的确定性仍然更香。
### 6.4 Monorepo 命名有点混乱
仓库叫 `harness-sdk`，但里面发布的包是 `strands-agents` / `@strands-agents/sdk`，文档站又叫 strandsagents.com，TS 侧还有一个独立的 `@strands-agents/harness` 包——新用户很容易被"harness"和"sdk"这两个词绕晕，第一次搜文档容易点错入口。
### 6.5 Python/TS 双语 поддерж but 不完全对等
虽然两个 SDK 都是"一等公民"，但新特性通常在 Python 侧先落地，TS 侧偶有滞后。如果你的团队主栈是 TS，升级前最好先看 release notes。
---
## 七、结语与行动建议：终极评判
**9/10 分（生产就绪度）**——Strands Agents 是目前开源 Agent 框架里少有的**"理念清晰、工程扎实、背靠巨头但保持开放"**的选手。它没有试图做一个"什么都能干"的巨无霸，而是把一个非常具体的痛点——**"手写 Agent Loop 会逐渐长出的那些烂代码"**——做成了标准件。
### 🎬 三步行动建议
1. **5 分钟体验派**：先跑通 README 里的 Python 5 行示例（记得先配好 Bedrock 权限，或者切换到 Ollama 本地模型避开 AWS 门槛）。
2. **对比评估派**：拿一个你手头的真实业务场景（比如"用 Agent 自动分析用户反馈"），同时用 LangGraph 和 Strands 各写一遍，**比较代码行数、调试体验、Tracing 易用性**，比看任何评测都有说服力。
3. **生产落地派**：从 `strands-agents/samples` 仓库挑一个贴近你业务的 Sample 起步，重点关注 Hooks（加权限拦截）和 Tracing（接 Langfuse 或 Braintrust）这两个生产必备件。
### ❓ 你可能还会问（FAQ）
- **Q：必须用 Bedrock 吗？** A：不是。OpenAI、Anthropic、Gemini、Ollama 都支持，默认只是 Bedrock。
- **Q：免费吗？** A：SDK 本身 Apache 2.0 完全免费商用，成本在模型调用侧。
- **Q：能和 LangGraph 一起用吗？** A：可以但通常没必要——它们解决的问题高度重叠。
- **Q：生产环境用什么部署？** A：它"runs in your process, no hosted control plane"，意思是直接跑在你自己的服务里（Lambda / ECS / K8s 都行），不依赖任何托管平台。
> **最后一句话**：在 Agent 框架这个红海里，Strands 不是"颠覆者"，但它是**第一个把 AWS 内部大规模生产经验开源出来的窗口**。如果你还在用 2024 年的方式写 Agent，它值得一试。
