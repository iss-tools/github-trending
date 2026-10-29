# Donchitos/Claude-Code-Game-Studios

[GitHub URL](https://github.com/Donchitos/Claude-Code-Game-Studios)


## Claude-Code-Game-Studios 深度评测：把 Claude Code 变成一家虚拟游戏工作室

> 一个开源 Claude Code 模板仓库，用 49 个分层 Agent、74 个 Skill 和 15 个 Hook 把 AI 对话升级为带创意总监、主程、QA 的完整游戏工作室流程。

- **Tags**: Claude Code, 游戏开发, AI Agent, 开源模板, 独立开发
- **Category**: AI 编程, 开发工具, 游戏开发

## Details

# 当 Claude Code 拥有了一家游戏工作室：Claude-Code-Game-Studios 深度评测
> 这不是又一个 Prompt 合集，而是把真实的 3A 游戏工作室组织架构、SOP 流程、质量闸门全部塞进 Claude Code 终端的一次硬核尝试。适合"一个人想当一支队伍"的独立开发者，但对 subprocess、token 消耗与上手门槛要有心理预期。
**一句话总结**：Claude-Code-Game-Studios（以下简称 CCGS）是一个 MIT 协议的开源 Claude Code 模板仓库，通过 49 个分层 Agent、74 个 Slash Skill、15 个自动化 Hook 和 14 条路径级编码规范，把一次普通的 Claude Code 会话升级为"创意总监 + 主程 + 主策 + 主美 + QA Lead"齐备的虚拟工作室，目前 GitHub Star 数已突破 2.5 万。
---
## 背景与痛点：为什么一个 Chat 窗口做不出好游戏
如果你用过 Claude Code 直接 vibe-code 一款小游戏，大概率经历过这几个"经典死亡时刻"：
- AI 一路火花带闪电地写了 800 行代码，但没人拦住它把角色跳跃高度硬编码成魔法数字 `23.7`；
- 没有 GDD（游戏设计文档），第 3 个功能上线时，AI 已经忘了第 1 个功能怎么设计的；
- 写完就跑，没有一个"QA 同事"追问"这个菜单是不是画到屏幕外去了？"
- 越写越像面条代码，但没人敢对它说"这不符合本作的设计愿景"。
这正是 CCGS 在 README 里点破的核心矛盾：**"单次对话没有结构"**——一个通用助手既不会主动做设计评审，也不会自己拦住自己写意大利面。CCGS 的解题思路不是去造一个更强的模型，而是把**真实游戏工作室的三层决策结构、跨部门协作规则、质量闸门**整套搬进 Claude Code 的 Agent 协议里，让你在终端里拥有一个"会提问、会催稿、会卡进度"的虚拟团队。
作者 Donchitos 的视角显然来自行业内部——文档里反复出现的"导演/部门负责人/专员"分层、生产/里程碑/复盘的节奏、甚至"有人在改玩家能看到的东西时必须截图存档"这种死规矩，都是传统游戏公司的日常 SOP，而不是典型的 LLM 工程话语。
---
## 核心亮点与功能剖析
### 1. 三层 Agent 架构：给 AI 一张"组织架构图"
CCGS 最巧妙的设计，是把 49 个子代理按真实工作室的层级组织起来：
```
Tier 1 — Directors（创意决策层）
  creative-director    technical-director    producer
Tier 2 — Department Leads（部门负责人）
  game-designer        lead-programmer       art-director
  audio-director       narrative-director    qa-lead
  release-manager      localization-lead
Tier 3 — Specialists（一线专员，26+ 人）
  gameplay-programmer  engine-programmer     ai-programmer
  network-programmer   tools-programmer      ui-programmer
  systems-designer     level-designer        economy-designer
  technical-artist     sound-designer        writer
  world-builder        ux-designer           prototyper
  ...
```
打一个通俗的比方：**这就像把 Claude Code 从"一个啥都干的外包程序员"升级成"一家有汇报线的工作室"**。当 `/dev-story` 跑到"实现跳跃手感"这种故事时，不是任意一个 Agent 上去乱写，而是按下面的链路走：
- **垂直委派**：总监 → 部门负责人 → 专员；
- **横向咨询**：同层 Agent 可以互相问，但**不能跨部门拍板**（主程不能替主策改玩法）；
- **冲突升级**：意见不合就升级到共同的父级（设计争议找 creative-director，技术争议找 technical-director）；
- **跨部门变更**由 producer 协调，避免一边改数值一边忘了通知平衡组；
- **领域边界**：Agent 默认不许越权改自己管辖外的文件。
每个 Agent 的 frontmatter 还声明了模型偏好：三位总监建议用 Opus，主程与 15 位核心专员点名 Sonnet，其余 30 位继承当前会话模型——这让你能按"角色重要性"分配算力，而不是全员开最贵的。
**引擎专家也是一等公民**：仓库内置 Godot 4、Unity、Unreal Engine 5 三套引擎专属 Agent 群，分别覆盖 GDScript/Shader/GDExtension、DOTS-ECS/Addressables/UI Toolkit、GAS/Blueprint/Replication 等真实业务难点。
### 2. 74 个 Slash Skill：把游戏全生命周期"命令化"
这是 CCGS 给你的"操作面板"。输入 `/` 即可唤出全部技能，按工作阶段分组：
| 阶段 | 代表性命令 |
|---|---|
| 启动/导航 | `/start` `/help` `/setup-engine` `/project-stage-detect` `/settings` |
| 游戏设计 | `/brainstorm` `/map-systems` `/design-system` `/review-all-gdds` |
| 美术/资产 | `/art-bible` `/asset-spec` `/asset-audit` |
| 架构 | `/create-architecture` `/architecture-decision` `/architecture-review` |
| 故事/迭代 | `/create-epics` `/create-stories` `/dev-story` `/story-done` `/estimate` |
| 评审/分析 | `/design-review` `/code-review` `/balance-check` `/scope-check` `/perf-profile` |
| QA/测试 | `/qa-plan` `/smoke-check` `/soak-test` `/regression-suite` `/test-flakiness` |
| 发行 | `/release-checklist` `/launch-checklist` `/patch-notes` `/hotfix` `/day-one-patch` |
| **团队编排** | `/team-combat` `/team-narrative` `/team-ui` `/team-release` `/team-polish` ... |
最后那一组 `/team-*` 是 CCGS 区别于普通"提示词合集"的杀手锏——**单条命令就能编排多个 Agent 并行协作一个系统**（比如 `/team-combat` 会同时调动战斗策划、gameplay-programmer、系统策划、QA、性能分析师围绕战斗系统协同工作），相当于"自动组会"。
### 3. 15 个 Hooks：让"自律"不再是靠 Prompt 求爷爷告奶奶
Prompt 只能"劝"，Hook 才能"拦"。CCGS 在 `.claude/settings.json` 里挂了 15 个 bash 钩子，**在每次 Claude 调用工具前后自动跑一遍**：
- `validate-commit.sh`：拦截 git commit，检查硬编码魔法数字、TODO 格式、JSON 合法性、设计文档必备小节；
- `validate-push.sh`：保护分支告警，对 `git tag` / `gh release` / Steam 构建等高危动作发出警告；
- `validate-read.sh`：**超过 40KB 的设计文档不允许一次全量读入**，自动返回标题让你分节读——这是很聪明的"上下文保护"机制；
- `validate-write.sh`：写入受保护文件、越界改配置、跨越 prototype 边界时告警（只警告不阻塞）；
- `validate-assets.sh`：对 `assets/` 下的 JSON 数据文件和资产命名做合法性校验；
- `log-agent.sh` / `log-agent-stop.sh`：所有子代理的启动/停止全程审计留痕；
- `detect-gaps.sh`：检测"代码已写但设计文档缺失"这种典型断档并主动提醒。
权限规则里还禁掉了 `git push -f`、`rm -rf`、读取 `.env`、`git reset --hard`、甚至 commit 信息里出现 "push + pull" 这类字符串也会被拒——这种"愿意为一条边界多写 30 行正则"的强迫症气质，在开源 AI 项目里非常少见。
### 4. 路径级规则：目录即规范
CCGS 不靠口头约定"请遵守编码规范"，而是把 14 条规则**绑定到目录路径**上，写到哪个文件夹就自动启用哪套标准：
```
src/gameplay/**    → 强制数据驱动数值、必须用 delta time、禁止引用 UI
src/core/**        → 热路径零内存分配、线程安全、API 稳定性
src/networking/**  → 服务器权威、消息带版本号、安全要求
src/ui/**          → 不持有游戏状态、本地化 ready、无障碍
prototypes/**      → 反向放宽，但必须写 README 和假设说明
```
这个设计的精髓在于**把"规范"从提示词（可被遗忘）变成结构（难以绕开）**——AI 想偷懒改 `src/core/` 下的代码时，路径触发的规则会自动挂上去，不依赖它"记得"。
### 5. `modes.rigor`：用"一个旋钮"控制"六个开关"
如果你只用过 BMAD 那种"一套流程走到底"的框架，CCGS 的这个设计会让你眼前一亮。它把 GDD 必填节数、文档密度、QA 等级、Story 粒度、评审强度、团队规模打包成三档严格度：
| Rigor | 首行代码前要写的文档 | 适用场景 |
|---|---|---|
| **minimal**（默认） | 1 份一页纸 brief | 48h 游戏 jam、快速原型 |
| **standard** | 30 份 | 认真做的独立项目 |
| **full** | 全部 8 节 GDD + 完整 QA 证据 | 有活人协作的正式团队 |
**这里有一个值得每一个 AI 工具作者学习的细节**：作者没有走"流程越重越专业"的路，而是真的做了一次测量——用同一个 brief 在不同 rigor 下各跑一局，结果 `standard` 产出了 30 份文档、耗时 58 分钟，但**在两位盲评者和一次人类试玩中排名垫底**。多出的 29 份文档换来的是可追溯性，不是更好的游戏。基于这个事实，作者把 `minimal` 设为默认，并允许用 `system_overrides` 给单一系统（如战斗）开小灶，`testing.strict` 按 5 种测试类型逐项决定"缺证据是阻塞还是告警"。
更贴心的是 `review_mode` 和 `team.size` 支持在 `project.local.yaml`（已 gitignore）里**按个人覆盖**，团队成员可以各自偏好严格流程，不用绑架整个仓库。一句 `/settings modes.rigor=full` 就能切档，调试成本极低。
### 6. 一个"务实到底"的哲学：必须"看一眼"才算完
CCGS 的 QA 哲学里有一条非常硬核的条款：**"任何改变玩家所见内容的 story，不跑一次游戏、不截一张图存到 `production/qa/evidence/`，就不算关闭"**——"语法检查通过"不等于"游戏能玩"。这条即使在 `minimal` 档也不豁免。这个细节告诉我们：作者真的被"AI 说 OK 但 UI 画到屏幕外"这种事坑过。
---
## 快速上手：5 分钟跑通第一个最小化项目
CCGS 是一个"模板仓库"——你要 clone 下来作为自己的项目起点，而不是像 npm 包那样全局安装。
### 环境要求
- Git
- Claude Code（原生安装器优先，或 `npm install -g @anthropic-ai/claude-code`，需要 Node.js 22+）
- **Python 3**（每次 Skill/Hook 都要读 `project.yaml`，缺了会静默回退到默认值）
- Bash（macOS/Linux 自带，Windows 走 Git for Windows）
- 推荐 `jq`（部分 Hook 验证用）
### 三步启动
```bash
# 1. Clone 模板作为你的新项目
git clone https://github.com/Donchitos/Claude-Code-Game-Studios.git my-game
cd my-game
# 2. 在项目根目录启动 Claude Code（不要 cd 进 src/ 子目录！）
#    在子目录启动会绕过 hooks、deny 规则和 ask-first 权限模式
claude
# 3. 在会话里输入
/start
```
`/start` 会先问你"现在处于哪个阶段"（完全没想法 / 有模糊概念 / 已有清晰设计 / 已有代码），然后按状态引导到正确的 Skill 流——**不做任何假设**。
### 一个典型的 `minimal` 工作流
```
/start                  # 问你处于什么阶段
  ↓
/setup-engine godot 4.7 # 锁定引擎
  ↓
/brainstorm             # 产出 1 页 brief（这是 minimal 档唯一的前置文档）
  ↓
/create-stories         # 把 brief 切成可执行 story
  ↓
/dev-story ↔ /story-done  # 实现一个 story，跑完就关
```
想直接体验核心能力，可以跳到单点命令，比如用官方推荐的"第一个任务"小试一把资产审计：
```
Use the asset-audit skill to audit the art assets under `assets/art/`.
Read the project's CLAUDE.md and relevant art or asset standards first,
then report naming, size, format, orphaned-reference, and missing-reference
issues with prioritized recommendations.
Keep this read-only and do not modify or delete any assets.
```
### 自定义 Skill 的自测闭环
CCGS 最"元"的设计是它连**自己都能被测试**：仓库里带了一套 `studio-tests/`，专门检验你改造过的 Skill/Agent 是否还符合规范：
```bash
/skill-test static [name]     # 结构 lint，7 项合规检查
/skill-test spec [name]       # 行为断言
/skill-test audit             # 全量覆盖率报告
/skill-improve [name]         # 测试-修复-重测循环，分数涨了保留，跌了回滚
```
---
## 目标人群与收益
| 人群 | 核心收益 | 推荐指数 |
|---|---|---|
| **独立游戏开发者**（有引擎基础） | 一个人模拟一支队伍，从 brainstorm 到 release 全流程都有"角色"兜底 | ★★★★★ |
| **Game Jam 参赛者** | 默认 `minimal` 档就是为 jam 设计的，几乎零文档负担 | ★★★★☆ |
| **想学游戏 SOP 的开发者** | 62 份文档模板本身就是一套免费教程，能看到真实工作室的 GDD/ADR/复盘长什么样 | ★★★★☆ |
| **小型 2-5 人团队** | `full` 档 + producer 协调 + gitignore 的本地覆盖，适合并行开发 | ★★★★☆ |
| **AI Agent 框架研究者** | 三层 Agent 协议、Hook 设计、路径规则、rigor 旋钮都是极好的参考实现 | ★★★★★ |
| **完全零编程经验的小白** | Claude Code 本身有学习曲线，加上引擎安装、Python 依赖，不建议作为第一个项目 | ★★☆☆☆ |
| **非游戏领域的开发者** | Skill 强耦合游戏术语（GDD、vertical slice、day-one patch），借鉴思想但无法直接套用 | ★★☆☆☆ |
---
## 竞品对比：CCGS 在 Claude Code 生态里的位置
目前 Claude Code 生态做"结构化开发流程"的头部方案主要有三条路：**BMAD-METHOD、Superpowers、CCGS**。它们各有明确取舍：
| 维度 | CCGS | BMAD-METHOD | Superpowers | 裸 Claude Code |
|---|---|---|---|---|
| **Star 数**（约） | 25K+ | 45K | 180K | — |
| **领域耦合** | 深度垂直游戏开发 | 通用软件 + 分片文档 | 通用工程实践 | 无 |
| **Agent 数量** | 49 | 21+ | 多角色 | 1 |
| **Skill 数量** | 74 | 较少 | 中等 | 无 |
| **Hook / 自动拦截** | 15 个 | 弱 | 弱 | 无 |
| **路径级规则** | ✅ 14 条 | ❌ | ❌ | ❌ |
| **严格度旋钮** | ✅ 3 档 + 6 个独立开关 | 固定流程 | 弱 | 无 |
| **引擎专家** | Godot / Unity / UE5 三套 | 通用 | 通用 | 通用 |
| **架构哲学** | 工作室层级 + 质量闸门 | 规范驱动开发（Spec-Driven） | 技能库 + 最佳实践 | 即兴对话 |
| **上手难度** | 中等偏高 | 中等 | 低 | 极低 |
| **Token 消耗** | 高（多 Agent 编排） | 高 | 中 | 最低 |
**怎么选？**
- 想做一款**真正的游戏**、愿意付 token 学一个流程：CCGS 是目前最对口的方案，没有之一；
- 想给**通用软件项目**找一套结构：BMAD 更通用，文档分片机制在长项目上更成熟；
- 只想给 Claude Code 加一些"通用好习惯"：Superpowers 更轻；
- 想做**独立 Godot 游戏**但嫌 CCGS 太重，社区已有简化版 `bgrenat/godot-game-dev-studio`（明确致谢 CCGS 的启发），以及专注 Unity 的衍生版。
社区生态也已有活跃迹象：FreedomPortal/ccgs-technica-edition 在原作 MIT 基础上扩展了发布套件，官方 Issue 区还有贡献者主动提交 Publishing Suite 扩展方案（针对 itch.io / Steam 上架流程）。
---
## 局限与不足：避坑指南
诚实地说，CCGS 不是"开箱即爽"的工具，它的重量是真实代价。
**1. Token 消耗是真实的痛。** 多 Agent 编排意味着每次 `/team-combat` 都要拉起多个子代理，每个都带独立上下文。Claude Pro 订阅很容易在半天内被耗完，按 API 计费则可能跑到每开发者每天几美元的区间（行业平均约 $13/开发者/月，重度使用会显著超出）。建议：从 `minimal` 档开始，非关键 Skill 用 Sonnet 跑，只让总监级决策走 Opus。
**2. 学习成本不低。** 74 个 Skill + 49 个 Agent + 15 个 Hook 的组合，光是把 README 读完就要 30 分钟。`modes.rigor` 六个底层旋钮 + 两个个人化覆盖 + 一个 automation 设置，配置空间偏大。第一次跑 `/start` 时老老实实跟着引导走，不要一上来就手改 `project.yaml`。
**3. 平台体验不均匀。** 主开发环境是 Windows 10 + Git Bash，macOS（含原生 bash 3.2 和 BSD 工具）和 Linux 有测试但不等于零 bug。`notify.sh` 的桌面通知只在 Windows 用 PowerShell 实现，macOS/Linux 是 no-op。如果你是 macOS 重度用户，部分 Hook 静默失效时不要慌，先看 `session-start.sh` 的输出。
**4. 强耦合 Claude Code。** 虽然 CCGS 的 Skill 文件用标准 SKILL.md 格式，理论上 Cursor、Windsurf、Codex、Gemini CLI 等支持此格式的工具也能读，但 Hook、Permission rules、`/slash` 命令路由都是 Claude Code 专属机制，**换工具后核心体验会大打折扣**。你实际上是在为 Anthropic 的生态投票。
**5. 上下文窗口管理有隐性压力。** `validate-read.sh` 对 40KB+ 设计文档的分节读取机制是聪明的设计，但多层 Agent 同时活跃时仍可能触发 Claude Code 的 compaction。`pre-compact.sh` + `session-start.sh` 的恢复机制能减轻但不能完全消除长会话的"记忆漂移"。
**6. 通用性反向受限。** CCGS 的 Skill 名字、路径规则、文档模板都深度绑定游戏术语——GDD、vertical slice、balance-check、playtest-report。想套用到 Web 应用或 CLI 工具上需要大量定制，此时不如直接用 BMAD。
**7. 游戏本体没有 demo 可以直接玩。** 仓库刻意不内置"作者已做好的游戏"，只给模板和文档，理由是"别人的游戏在我的仓库里是杂物不是证据"。这个哲学正确，但对想先看效果的用户不太友好——**你只能自己跑一次才有体感**。
**8. 极端依赖 Python 3 存在。** 没有 Python 时大多数 Hook 静默回退到默认值——这是"优雅失败"，但也意味着**你可能根本没意识到自己丢了验证**。装完 Claude Code 记得 `python3 --version` 确认一下。
---
## 结语与行动建议
CCGS 是那种**少见地"诚实的 AI 工具"**：它没把自己包装成"一句话生成 3A 大作"，反而在 README 里专门写了一节承认"标准流程产出的游戏在盲评中垫底"，并把 `minimal` 设为默认。这种用测量对抗直觉的工程品味，加上 15 个 Hook 的边界纪律、路径级规则的强制力、以及一套真正理解游戏工作室运作方式的 Agent 架构，让它不只是一个模板，更是一份**"AI 时代的游戏工作室运营手册"**。
**给你的具体行动路线：**
1. **第一步（今晚就能做）**：`git clone` 一份到本地，启动 Claude Code 后只跑 `/start` 和 `/brainstorm`，体验"有一个总监在问你问题"是什么感觉；
2. **第二步**：用 `minimal` 档完整跑一个 48h jam 级别的小项目（比如 HTML5 的贪吃蛇变体），感受 `/dev-story` ↔ `/story-done` 的循环节奏；
3. **第三步**：跑顺之后再考虑 `standard` 或 `full` 档，并根据项目需要启用 `/team-*` 编排；
4. **避坑提示**：全程监控 Token 消耗，重要节点前 `git commit`，不要在子目录启动会话，不要在没有 Python 的环境跑；
5. **进阶玩法**：读一遍 `.claude/docs/effects-map.md` 和 `workflow-catalog.yaml`，你会理解 CCGS 真正想解决的不是"AI 写代码"而是"AI 时代的工程纪律"问题。
如果你正处于"想做一款游戏但一个人扛不动"的临界点，CCGS 值得你花一个周末。如果你只想"让 AI 帮我写个贪吃蛇"，那么 Claude Code 原生会话就足够了——CCGS 的价值在于它把"做一款能上线的游戏"这个系统工程里所有该有人负责的环节，都安排上了人。
