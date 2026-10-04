# michael-denyer/pstack-claude

[GitHub URL](https://github.com/michael-denyer/pstack-claude)


## pstack-claude 深度评测：把 Cursor 大神的 Agent 工程纪律搬到 Claude Code

> 把 Lauren Tan 的 Cursor『agent 作风规范包』pstack 移植到 Claude Code 等主流编程 Agent 的开源插件，让 AI 少写代码、写对代码。

- **Tags**: Claude Code, AI Agent, 代码质量, 开源插件, 工程效率
- **Category**: AI 编程, 开发工具, 开源项目

## Details

> **一句话总结**：pstack-claude 是 Lauren Tan（poteto）为 Cursor 打造的"agent 作风规范包" pstack 的跨平台移植版，把原本一套 24 个 Skill、以"少写代码、写对代码"为信条的 agent 工作流，搬运到了 Claude Code、Codex CLI、Pi、OpenCode、Gemini CLI 等几乎所有主流 agent harness 上——如果你正在用 AI 写代码，又总觉得"它写得太快、太杂、太不靠谱"，这套东西就是给 agent 装上的"团队纪律手册"。
---
## 一、背景与痛点：为什么"裸奔的 agent"越来越难用
过去一年里，AI Coding Agent 的瓶颈早就不在"模型够不够聪明"，而在**工程纪律**：
- 你让它改一个 bug，它顺手重构半个仓库；
- 你让它加一个功能，它给你写 800 行带三层抽象的"看起来很专业"的代码；
- 你并行开三个 agent，它们互相覆盖文件，最后你花在 review 上的时间比自己写还多；
- build 通过 ≠ 行为正确，但 agent 把绿灯当成完工证书。
**Lauren Tan 的原始动机说得很直白：她不想要一支"二十人的烂代码团队"。** 她在 Cursor 上开源了 pstack——一套包含 24 个 skill、21 个 procedure、23 条 engineering principles 的"作风栈"，核心思路是让 agent 先做深、做准，再谈速度，并且把"可并行"当作一等公民来设计——只有当单个 agent 的产出可信、可验证，你才敢放心同时开 5 个去干活。
问题在于：pstack 最初是 Cursor 插件，深度依赖 Cursor 的 subagent / plan-mode / hooks 等**平台原语**。如果你主战场是 Claude Code 或 Codex CLI，就只能眼馋。
**pstack-claude 就是来补这一块的。** 作者 Michael Denyer 是一位有 20 年经验的软件工程师 + 生物信息学家，主业做基因组学与数据工程工具（pyLocusZoom、memory-mcp 等），他把 poteto 的 Cursor 原语逐一翻译到其他 harness，并且用 `tools/forks.json` 显式声明所有"策略性分叉"，方便跟上游同步。项目上线后热度上涨很快，被多个 AI-agent 趋势站跟踪，截至撰写时约 524 stars，且仍在单日 +20~100+ 的量级增长。
---
## 二、它到底是什么：一套"作风包"，不是一套"工具集"
最容易误解的一点：**pstack-claude 不是另一个 agent 框架，也不是 MCP server**。它本质上是 20 多份精心打磨过的 Markdown 指令文件（SKILL.md），外加一段路由逻辑。装上之后，你的 Claude Code 就从"一个聪明的实习生"变成"一个按 SOP 办事的初级工程师"。
它没有服务器、没有遥测，所有脚本本地运行，PR 工具走你自己的 GitHub CLI 登录态；模型上下文里读到的所有东西（包括会话记录）都只发给你的模型供应商。
> 用一个比喻：模型是引擎，Claude Code 是底盘，**pstack 是给驾驶座上坐了一位老司机的"驾驶守则"**——什么时候该打灯、什么时候该刹车、什么时候该下车绕一圈看看路况。
---
## 三、核心能力剖析：那些真正值钱的 Skill
把 pstack 的 20 多个 skill 按任务阶段归类，你能看清它的设计哲学——**先看懂、再设计、再写、再验证，每一步都有对应工具**：
| 阶段 | 代表 Skill | 它解决什么问题 |
|---|---|---|
| **路由入口** | `poteto-mode` | 你只描述目标 + 验收方式，它自动匹配对应 playbook（bug 修复 / 功能 / 重构 / 性能 / 调查 / PR 维护 / 发版…） |
| **理解代码** | `/how` `/why` `/teach` `/recall` | 强制 agent 先解释"这段代码怎么跑的、为什么这么写"，再动手改 |
| **设计方案** | `/architect` `/arena` `/swarm` `/interrogate` | 跨函数边界的改动强制走 architect；`arena` 让多个模型并行竞标方案，`swarm` 用于可并行的批量任务 |
| **动手实现** | `/tdd` `/unslop` `/no-comments` | 先写测试再实现；`unslop` 主动清除 AI 味十足的抽象层和废话 |
| **验证收尾** | （playbook 内置） | 重跑失败用例、贴出 before/after 证据、再开 PR |
| **原则层** | 23 条命名原则 | 用一句话把 agent 拉回正轨 |
其中**三件事**最值得单独讲：
### 1. `poteto-mode`：一个真正的"意图路由器"
你不需要记住 20 多个 skill 的名字。只说一句：
```
Use poteto-mode to fix the search filter resetting when I change pages.
```
它会复现 bug → 调用 `how`/`why` 做归因 → 派发修复 → 重跑失败用例 → 给你一份"修复 + 失败证据 + 通过证据"的三件套。**这是从"prompt 工程"到"工作流工程"的分水岭**——你不再和模型博弈措辞，而是和它约定交付物。
### 2. `/arena` 与 `/swarm`：把并行从"敢不敢"变成"该不该"
`arena` 是 pstack 最有辨识度的设计之一：让多个模型（或同一个模型的多次采样）在隔离环境里同时解同一道题，再以可验证的标准选优。配合 `setup-pstack` 里给每个"角色"独立分配模型与 reasoning effort（例如 `arena runners: opus @xhigh, fable @max`），你在 Claude Code 里就获得了真正意义上的"模型组合拳"，而不是单押一家。
### 3. 23 条命名原则：把"作风"做成可调用的接口
像 `principle-laziness-protocol`（**偏向删除而非新增，最小 diff**）、`principle-exhaust-the-design-space`（**穷举设计空间再写代码**）这样的短语，可以在 agent 跑偏时直接敲进去纠偏——比重新描述一遍需求高效得多。这本质上是把"团队 code review 里那些口头禅"产品化了。
---
## 四、上手体验：DX 打几分
### 安装：三行命令，没有惊喜
**Claude Code**（在 Claude Code 里直接敲）：
```
/plugin marketplace add michael-denyer/pstack-claude
/plugin install pstack@pstack-claude
```
**Codex CLI**：
```
codex plugin marketplace add michael-denyer/pstack-claude
codex plugin add pstack@pstack-claude
```
**Pi**：
```
pi install git:github.com/michael-denyer/pstack-claude
```
对于 Prime Agent、OpenCode、Gemini CLI，还有 skills-only 的共享安装方式（任意 harness 只取 SKILL.md 不带运行时）。装完后在 Claude Code 里跑 `/pstack:setup-pstack` 就能配置每个角色的模型与 reasoning effort。
### 第一次用：只记一个命令就够了
```
Use poteto-mode to <你的目标>，并说明"我怎么知道做完了"。
```
这是官方 README 的 Getting Started 示例，也是最推荐的上手姿势。**先跑通一条完整 playbook，再去翻其他 20 个 skill 的细节，比一上来就全学一遍要省力得多。**
### 兼容性与侵入性
- 它是**插件**而非 fork——你不需要替换 Claude Code 的 CLAUDE.md，也不影响已有项目；
- 路由 hook 在 Claude Code 上自动注册；在 Codex 上需要你在 `/hooks` 里手动信任一次；
- Pi 版额外带了一个扩展，补齐 subagent / question / wake-up 工具和 `/loop`，因为 Pi 本身缺少 Cursor 那套原语；
- 对 Gemini CLI / OpenCode 则是"纯 skill 模式"，没有运行时增强，部分高级玩法（arena 并行调度）会受限。
---
## 五、和谁比：在"agent 作风包"赛道里的位置
这个细分赛道在 2026 年下半年才成型，能拿来对比的有几类：
**vs. 原版 pstack（Cursor only）**
原版是本源、最完整、维护者就是 poteto 本人。但它只能跑在 Cursor。pstack-claude 严格跟上游同步（forks.json 显式声明差异），并且补了 Cursor 没有的能力——比如给 Claude Code 提供 effort 分级 agent、TLA+/Lean 形式化验证插件（这是 Denyer 自己加的，处理"测试覆盖不到的并发 bug 和不变量"）。
**vs. 通用 skill 合集（awesome-claude-skills、skills 目录等）**
合集类仓库胜在广度，但质量参差，往往要自己淘金。pstack-claude 是**单一作者的单一哲学**，所有 skill 围绕"少写代码 + 可验证"这一条主线，互相之间有配合关系（`poteto-mode` 会串起其他 skill），这种内聚性是合集不具备的。
**vs. SuperClaude / 其他"Claude 增强框架"**
SuperClaude 类项目更偏"给 Claude 加人格 + 加命令面板"，偏向通用助手改造。pstack-claude 的定位更窄也更锋利：**专门治"agent 代码质量差、不可并行"这一个病**。如果你核心痛点是代码质量，pstack 的针对性远强于通用框架。
**vs. 自己手写 CLAUDE.md / AGENTS.md**
自写规则天花板有限——你没有 poteto 那 24 个 skill 的工程积淀，也没有"原则层 + playbook 层 + 路由层"的分层设计。pstack 的价值就是把这层认知外包。
> **它的独特竞争力一句话：把"小团队工程纪律"完整地翻译到了 Claude Code 的插件生态里，且是唯一一个同时覆盖 6+ 主流 harness 的 pstack 移植。**
---
## 六、局限与不足：值得诚实说的几点
**1. 它是移植，不是原创。**
poteto 才是这套方法论的作者，Denyer 做的是高质量搬运 + 平台适配。这意味着：一是上游节奏他追得再紧也会晚半拍；二是像 `make-bot-ui` 这类 Cursor 平台专属 skill 在移植里天然缺失，需要其他方案补位。
**2. 上手有认知成本，且教程以英文为主。**
23 条原则 + 21 个 procedure + 20 多个 skill，概念密度不低。目前社区已经有第三方读者指南（pstack.nishilfaldu.site）和一份非官方中文对照站（pstack.ganhai.cloud），但都不在官方仓库内，时效性依赖社区维护。
**3. Token 消耗会上升，这是结构性代价。**
`arena` 并行跑多个模型、`/why` 强制归因、playbook 强制跑测试——每一步都在用 token 换可信度。对订阅用户影响不大，对按量计费的 API 用户要有预算预期。
**4. 小任务会"杀鸡用牛刀"。**
改一个 typo 还要走 poteto-mode 的完整流程，纯属浪费。pstack 的 sweet spot 是**有明确验收标准的中大型改动**——bug 修复、跨文件重构、新功能、性能优化。一句话能搞定的小事直接说就好，不用路由。
**5. 生态还很年轻。**
2026 年 9 月底才上线，524 stars 在这个时间点上不算冷门但也谈不上成熟；issue 数量、第三方插件、视频教程都还稀少。Flavio Copes 这种头部开发博主 10 月初刚发了 deep dive，说明它正处于"被早期采用者发现"的阶段，距离"标配"还有距离。
**6. 形式化验证插件是另一条路，不是这个仓库的强项。**
README 里提到的 agent-formal-verify（TLA+ / Lean）是**独立插件**，不要以为装了 pstack 就自动获得了形式化验证能力。
---
## 七、目标人群与收益对照
| 你是谁 | 核心痛点 | 用它能拿到什么 |
|---|---|---|
| **Claude Code 重度用户** | 改一处动全身，review 成本爆炸 | 强制验证 + 最小 diff + architect 介入，PR 通过率显著提升 |
| **想并行开多个 agent 的人** | 不敢并行，怕互相污染 | arena + swarm + 可验证 playbook，把"敢开 3 个"变成"敢开 10 个" |
| **Codex CLI / Pi 用户** | 用不上 Cursor 的 pstack | 这是目前唯一覆盖这两个 harness 的移植版 |
| **独立开发者 / 一人公司** | 没有团队做 code review | 23 条原则相当于一份"老司机的口头禅清单"随时纠偏 |
| **ML / 数据工程背景的人** | 代码要长期维护、不能 vibe | Denyer 本人是生信工程师，skill 里对"长期可维护"的偏重契合科学计算场景 |
不太适合的人：**纯小白 vibe coder**（"帮我做个网页"这种需求，pstack 的纪律反而碍事）、**追求极简 token 消耗的人**、**已经形成了自己的 CLAUDE.md 体系且满意的人**。
---
## 八、行动建议：怎么开始
1. **先装再读。** 三行命令装完，直接用官方 README 那句 "Use poteto-mode to fix the search filter resetting when I change pages" 试一次，体感比看文档强。
2. **第二条命令跑 `/setup-pstack`。** 把 arena runner 设成强模型 + 高 reasoning effort，主路由模型保持快速，性价比最高。
3. **读 23 条原则，比读 24 个 skill 更值。** 原则是可以单独在你的日常 prompt 里直接引用的，迁移成本最低。
4. **进阶再装 agent-formal-verify**——如果你真的要做并发系统或分布式存储，TLA+/Lean 那条路才是终极解药。
5. **跟上游 poteto 的 Cursor 版对照读。** 原作者的发文（mindpattern 有过报道）和 Flavio Copes 的 deep dive 是两份最好的"为什么这么设计"的注解。
---
**终极评判**：pstack-claude 是 2026 年下半年 AI Coding 工具链里少见的"方向正确、执行克制"的项目——它没有试图造一个新 agent，而是承认了"模型已经很聪明，缺的是工程纪律"这个事实，然后用一套可安装、可配置、可跨平台的方式把纪律塞进 agent 手里。对于每天让 agent 写 500 行以上代码、并且真的要为这些代码负责的开发者，它值得花一个下午认真跑通；对于偶尔写点脚本的人，把它加入观察名单即可——等生态再成熟半年，回头装也来得及。
