# expo/skills

[GitHub URL](https://github.com/expo/skills)


## expo/skills 深度评测：让 AI 编程助手真正“懂”Expo 的官方知识包

> Expo 官方推出的 SKILL.md 知识包，把 Expo 最佳实践直接灌进 Claude Code、Cursor 等 AI 编程工具。

- **Tags**: Expo, React Native, AI 编程助手, Agent Skills, Claude Code
- **Category**: AI 编程, 开发工具, 开源项目

## Details

# expo/skills 深度评测：让 AI 编程助手真正"懂"Expo 的官方知识包
> **一句话总结**：`expo/skills` 是 Expo 官方推出的一组结构化 `SKILL.md` 知识包，用于把 Expo/React Native/EAS 的最佳实践直接"灌"进 Claude Code、Cursor、Codex 等 AI 编程智能体的上下文——它是目前做 Expo 开发时唯一值得装一份的官方 Skill 集合，也是理解 2026 年"Agent Skills"生态成型路径的最佳样本。
---
## 一、它到底是什么：把官方文档拆成 AI 能"挑食"的小菜碟
如果你最近用 Claude Code、Cursor 或 Codex 写过 Expo 应用，大概率经历过这种场景：AI 很自信地给你装了 `@gorhom/bottom-sheet`，又顺手拖进来一堆 Reanimated 的手势代码——但 Expo 官方文档早就明确说，SDK 56 之后 `@expo/ui` 已经内置了原生 SwiftUI/Compose 渲染的 `BottomSheet`，根本不需要第三方库。
**问题的根源不是 AI 笨，而是它"不知道自己不知道"。**
`expo/skills` 解决的就是这件事。它本质上是一个 GitHub 仓库，里面装着 20 多个 `SKILL.md` 文件。每个文件都是一份结构化的"小抄"：YAML 头部告诉 AI"我是什么、什么时候该调用我"，正文则是高度浓缩的 Expo 官方最佳实践——包括该用哪个 API、不该碰哪些已废弃模块、原生配置怎么写、常见坑在哪里。
如果你不熟悉"Skill"这个概念，可以打个比方：**MCP 像是给 AI 装上了可以伸手拿外部工具的"手臂"，而 Skill 是给它塞了一本可以随时翻的"内部手册"**。手册平时折叠在口袋里（不占用上下文 token），只在 AI 判断"这个问题需要这本手册"时才展开。
---
## 二、背景与痛点：为什么官方要下场做这件事
### 痛点一：AI 幻觉 + Expo 迭代过快，等于雪上加霜
Expo 一年发一个大版本，SDK 52 到 56 之间破坏性变更极多：`SafeAreaView` 被废弃、`expo-av` 拆成了 `expo-audio` 和 `expo-video`、`@react-navigation` 必须通过 `expo-router/react-navigation` 引入、New Architecture 成为强制要求……通用大模型的训练数据根本跟不上，AI 推荐的写法经常是两年前的"祖传代码"。
### 痛点二：Expo 的表面面积太宽，单靠一份 CLAUDE.md 装不下
Expo 涉及 Expo SDK、Expo Router、Expo Modules、原生 UI、EAS 云服务、CI/CD Workflows、App Store 提交……把这些规则全塞进一个 `CLAUDE.md`，要么超长、要么每次对话都被全量加载、浪费 token。
### 痛点三：社区方案各自为战
在 `expo/skills` 出现之前，Callstack 和 Software Mansion 等知名 React Native 服务商都推出了自家的 Agent Skills 仓库（下文会对比），但它们是"第三方建议"的视角。**官方下场意味着规则从"建议"升级为"契约"**——所有 API 取舍、平台差异、原生配置的判断，都直接来自 Expo 团队。
> **底层洞察**：`expo/skills` 的出现其实是一个信号——2026 年框架生态的竞争焦点已经从"谁的运行时更快"悄悄转向"**谁家的 AI Agent 用起来更顺手**"。Anthropic 在 2025 年 10 月推出 SKILL.md 格式之后，主流框架（Sentry、Convex、AWS、Expo）纷纷跟进打包自己的官方 Skills，"Skill 即 SDK 文档"正在成为一种新的发布标配。
---
## 三、核心亮点剖析：它凭什么值得一装
### 亮点 1：完整的 Skill 矩阵，按"免费/付费"边界清晰分组
这是仓库组织上最讲究的一点。所有 Skill 被分成四层：
| 分组 | 数量 | 代表 Skill | 解决什么 |
|---|---|---|---|
| **入口路由** | 1 | `expo-overview` | 任何 Expo/EAS 任务的第一跳，把模糊请求路由到具体 Skill |
| **Framework（开源 SDK）** | 16 | `expo-router`、`expo-native-ui`、`expo-animation`、`expo-module`、`expo-upgrade` | 路由、UI、动画、原生模块、SDK 升级 |
| **Services（EAS 付费）** | 7 | `eas-app-stores`、`eas-hosting`、`eas-workflows`、`eas-update`、`eas-simulator` | 构建、提交、OTA、CI/CD、远程模拟器 |
| **Experimental** | 1 | `expo-migrate-module` | 实验性 API 的迁移指引 |
每一份 EAS 相关 Skill 的开头都会标注**成本和套餐限制**，避免 AI 自作主张地把用户带进付费坑——这种"把商业边界写进文档"的细节在开源项目里非常少见。
### 亮点 2：`expo-overview` 这一道"总闸"，是整个仓库最值得学的设计
早期版本的 Expo Skills 遇到了一个尴尬问题：**装了 Skill，AI 却根本不去加载**。Expo 团队和 Georgian AI Lab 合作搭了一个评测系统（eval harness），跑出来的数据刺眼：在真实用户模糊提问（"帮我做个 iOS Todo 应用"）的场景下，**只有约 9% 的会话会主动加载任何 Expo Skill**。
他们的解决方案是引入一个 `expo-overview` 入口 Skill——它不做具体的事，只负责告诉 AI："只要是 Expo 相关任务，先从我这里进来，我会告诉你下一步该读哪份"。效果立竿见影：
- **任意 Skill 加载率：9% → 55%**
- **相关 Skill 命中率：2% → 18%**
这个数字背后是一个值得所有写 Skill 的人记住的设计原则：**当你的 Skill 超过 10 个，就必须有一个 Router Skill，否则 AI 会被"选择困难"直接劝退，干脆一个都不用。**
### 亮点 3：与 Expo MCP Server 联动，从"知识"升级到"行动"
`expo` 插件打包时自动捆绑了 Expo MCP Server 配置。两者分工清晰：
| 层级 | 角色 | 能做什么 |
|---|---|---|
| Skills | 教 AI **怎么想** | 提供 Expo 规则、API 取舍、避坑指南 |
| MCP Server | 让 AI **能动手** | 拉最新文档、跑 `npx expo install`、触发 EAS 构建、读 TestFlight 崩溃日志、截取模拟器画面 |
这意味着你可以说"帮我看看这个 EAS Update rollout 健康吗"，AI 不只是回你一段理论，而是真的去调 MCP 查数据。
### 亮点 4：内容质量本身就是一份"Expo 隐性规范手册"
翻开 `expo-native-ui/SKILL.md`，你能感受到这不是简单地复制文档，而是把 Expo 团队的"判断力"写进去：
- "任何 sheet/picker/slider/toggle 优先用 `@expo/ui`，不要先用社区库"
- "大列表用 FlatList/FlashList，`@expo/ui` 的 `List` 不做虚拟化"
- "iOS 用 Apple HIG，Android 用 Material 3，**绝不要给 iOS 穿 Android 的衣服**"
- "永远先试 Expo Go，再考虑自定义构建"
- 禁用已废弃的 `Picker`、`WebView`、`SafeAreaView`、`AsyncStorage`
- 用 `Color` from `expo-router` 而不是 `PlatformColor`（类型安全、自动适配深色模式）
这些判断如果靠 AI 自悟，可能要踩 10 次坑才能学会；装上 Skill 之后，第一次生成就是对的。
---
## 四、上手体验：一条命令装完
这是它作为"GitHub 开源项目"最让人惊喜的部分——**几乎零门槛**。
### 场景 A：Claude Code / Codex 用户（插件方式，推荐）
```bash
# Claude Code
claude plugin install expo@claude-plugins-official
# 或者进入 Claude Code 后执行
/plugin install expo@claude-plugins-official
# Codex
codex plugin add expo@openai-curated
```
插件方式走官方 Plugin Marketplace，更新自动推送。
### 场景 B：Cursor / OpenCode / Copilot / Windsurf / Gemini CLI / Cline 等其他智能体
```bash
npx skills@latest add expo/skills --skill '*'
# 想精确指定某个 agent：
npx skills@latest add expo/skills --skill '*' --agent cursor
# 更新单个 skill：
npx skills@latest update expo-router
```
### 安装后立刻能试的 Prompt
```
"Build a native-feeling Expo Router screen with tabs, modals, and animations."
"Create an EAS workflow that builds previews on pull requests."
"Help me upgrade this app to the latest Expo SDK."
"Check whether this EAS Update rollout is healthy."
```
整个过程没有 Docker、没有构建步骤、没有依赖冲突，因为是纯 Markdown 文件——这也是 SKILL.md 格式相比传统插件/插件市场的最大优势之一：**可读、可 diff、可 fork、可定制**。
---
## 五、真实案例演示：Skill 装上前后，AI 输出差多少
这是最关键的一节。Expo 官方博客记录了一个 React Web 开发者 Ishika Chakraborty 用一周时间从零做出 iOS 应用 Sun Buddy 的真实经历，里面有两个非常典型的"AI 行为变化"案例。
### 案例一：装 Skill 之前，AI 让你"瞎追半小时"
**用户输入**：
> "给 Sunny 这个太阳吉祥物加上动画"
**未装 Skill 时的 AI 输出（问题现场）**：
AI 直接装了 Reanimated，然后动画就崩了。于是 AI 开始在版本号、导入路径上反复横跳，建议用户"降级 Reanimated"、"检查 React Native 版本"……**半小时没解决**。
**装上 `expo-dev-client` Skill 之后的 AI 输出**：
> "检查 `babel.config.js` 中是否注册了 `react-native-reanimated/plugin`，并清空 Metro 缓存。"
两行配置 + 一个 `--clear` 标志，动画立刻正常。
> **为什么差距这么大？** 因为"Reanimated 必须在 babel 插件最后注册 + 改完必须清 Metro 缓存"是 Expo 圈子的"行规"，通用大模型训练数据里这条规则被大量过时帖淹没，而 Skill 把它置顶了。
### 案例二：装 Skill 之前，AI 让你在"该不该构建 dev client"上瞎猜
**用户输入**：
> "我想在 iOS 上测试这个 app"
**未装 Skill 时**：AI 可能直接说"跑 `npx expo run:ios`"，让你经历完整的 Xcode 签名、Pod install 流程，只为了跑一个本来在 Expo Go 里 30 秒就能扫二维码跑起来的项目。
**装上 Skill 后**：AI 会按 `expo-dev-client` Skill 里的决策树判断——"你没用本地 Expo 模块、没用 Apple targets、没用第三方 native 模块，先试 `npx expo start` + Expo Go"。
### 案例三：Expo 官方评测系统里的"链式调用"
评测 trace 显示，AI 在收到一个模糊任务后会自己 narrate 出这种推理链：
> "I'll start by loading the expo-overview skill, since this task involves building an Expo/React Native app... Now let's convert it to use Expo Router (needed for tabs navigation) and check the router skill for setup steps."
最终形成 `expo-overview` → `expo-project-structure` → `expo-router` → `expo-ui` 的完整调用链，**没有任何一个用户在 Prompt 里点过名**。这说明 Skill 的 `description` 字段写得足够精准，AI 能自主判断相关性。
---
## 六、目标人群与收益：谁最该立刻装上
| 人群 | 收益 |
|---|---|
| **用 Claude Code/Cursor 做 Expo 开发的工程师** | 把 AI 从"会写 React"升级到"懂 Expo"，直接少踩 80% 的版本适配坑 |
| **React Web 开发者想跨到 Native** | Ishika 的案例证明，配合 Skill，一周时间能从 Next.js 到 App Store  |
| **维护老 Expo 项目、需要 SDK 升级的团队** | `expo-upgrade` Skill 专门处理依赖冲突、废弃包、缓存清理 |
| **做 Brownfield 集成（在已有原生 App 里塞 Expo）** | `expo-brownfield` 是公开文档里都写得含糊的话题，Skill 给出了完整路径 |
| **正在做 EAS CI/CD 的 DevOps** | `eas-workflows` 能生成正确的 YAML，免掉 trial-and-error |
**不推荐谁装**：
- 完全不用 AI 编程助手的团队——这是为 Agent 时代准备的工具
- 项目已经停在 Expo SDK 50 以下、不打算升级的——Skill 主要针对 SDK 54+ 的新架构
---
## 七、竞品对比：Expo 官方 vs 社区三巨头
目前 React Native/Expo 场景下值得对比的 Skill 仓库有四个：
| 项目 | 出品方 | 定位 | 核心差异 | 适用场景 |
|---|---|---|---|---|
| **expo/skills** | Expo 官方 | 全链路 Expo/EAS 知识包 | 唯一官方来源；与 Expo MCP 深度集成；有 eval harness 保障质量  | 首选，覆盖最全 |
| **callstackincubator/agent-skills** | Callstack | RN 最佳实践 + 测试 + 迁移 | 在性能优化、TV、迁移到 RN 这几块比官方更深入  | 重点关注性能/测试 |
| **software-mansion-labs/skills** | Software Mansion | Reanimated/Gesture/音频/设备 AI | 这些库本来就是 SWM 写的，权威性极强  | 重度动画、手势、实时视频 |
| **uichemy/expo-design-system** 等社区单 Skill | 个人 | 单点主题 | 轻、聚焦 | 补漏 |
**它们不是互斥关系，而是可以叠加**。一个务实的组合是：
```
npx skills@latest add expo/skills --skill '*'              # 官方全套
npx skills@latest add software-mansion-labs/skills          # 补动画/手势深度
npx skills@latest add callstackincubator/agent-skills       # 补性能/测试
```
但是**装得越多越好是错的**——下文局限一节会讲为什么。
---
## 八、局限与不足：冷静看到的几个真实问题
### 1. Token 预算冲突是真实存在的坑
Expo 团队在评测中发现了一个让人头疼的事实：Codex CLI 给所有 Skill 的"目录清单"分配了**固定的 2% 上下文窗口**（272k 上下文对应约 5440 token）。当他们测试一个装了 175 个 Skill（其中 24 个来自 Expo）的环境时，发现：
- 超出预算 → Skill 的 description 被截断到只剩开头几个字
- 更严重 → description 整段消失，只剩 Skill 名字
- 再严重 → **整个 Skill 被直接踢出目录**
也就是说，**"装得越多越好"是反模式**。如果同时装 Expo、Callstack、Software Mansion、AWS Toolkit、Anthropic 官方 19 个 Skill……互相之间在打架。
**应对策略**：要么用 `--skill` 精确挑选，要么定期 `npx skills update` 并卸载用不到的。
### 2. 相关 Skill 命中率仍只有 18%
虽然 `expo-overview` 把加载率拉到了 55%，但**真正加载了"应该加载的所有 Skill"的比例只有 18%**。举例：AI 会加载 `expo-ui` 但跳过 `expo-native-ui`，结果代码里用了 `Dimensions.get()` 而不是 `useWindowDimensions`。Agent 把 overview 当成"读一次就完"的文档，而不是反复回来查的路由表。
**这是当前整个 Agent Skills 生态的通病，不是 Expo 一家的问题。**
### 3. 商业闭环偏 EAS，对纯开源用户有小部分噪音
Skill 把 EAS 相关的 7 个 Skill 和开源 SDK 的 16 个 Skill 明确分开了，**这个做法本身很良心**。但如果你想用 `eas-simulator`（云端模拟器）、`eas-observe`（指标监控）这些 Skill 的全部能力，背后对应的是付费 EAS 套餐——Skill 本身免费，但用起来是要掏钱的。
### 4. 强绑定 SKILL.md 生态，老牌"规则文件"玩家需要适配
如果你的团队已经写好了完善的 `.cursorrules` 或 `CLAUDE.md`，迁移到 Skill 体系需要重新组织内容。两者并不互斥（`CLAUDE.md` 装项目级上下文，`SKILL.md` 装任务级能力），但团队需要理解分层。
### 5. 当前主要针对 Expo SDK 54+ / 56
很多规则（比如"用 `@expo/ui`"、"SDK 56+ 不要直接 import `@react-navigation`"）只在新版才成立。**维护老版本 SDK 的项目装上 Skill 反而可能被误导**——目前 Skill 里没有针对"旧 SDK 项目"的开关。
### 6. 社区活跃度：活跃但不是"万人空巷"
截至撰稿，仓库仍在高频更新（CI 有 `check.yml` 工作流持续跑），Issue 由 Expo 团队亲自响应，但因为是相对垂类的官方仓库，**外部贡献者少、Star 数量级在千级别**，远不如 `expo/expo` 主仓热闹。这对稳定性是好事（不至于天天变），但也意味着**社区周边生态（教程、二次封装、Skill 生成器）还在早期**。
---
## 九、淘金摘优：这个仓库里最值得单独一提的 4 个 Skill
如果只装 4 个，我推荐这几个"含金量最高"的：
1. **`expo-overview`** — 必装入口，没有它整个体系都不会被触发
2. **`expo-router`** — Expo Router 是 Expo 区别于裸 React Native 的灵魂，Skill 把 file-based routes、native tabs、modals、headers 的取舍全写清了
3. **`expo-upgrade`** — SDK 升级是 Expo 圈最痛的事，这个 Skill 直接涵盖依赖冲突诊断、废弃包替换、缓存清理
4. **`eas-workflows`** — EAS Workflow YAML 是个新物种，文档散、教程少，这个 Skill 几乎是目前唯一靠谱的资料源
---
## 十、结语与行动建议
**expo/skills 是 2026 年 "Agent Skills 生态"里一个值得作为范本来研究的官方作品**：它不只是"把文档塞给 AI"，而是完成了一次系统性的工程化——入口路由、分组边界、与 MCP 的分工、eval harness 的质量反馈闭环、对 token 预算的现实应对——这些设计决策比内容本身更有参考价值。
**给你的行动建议，按场景：**
- **如果你今天就要写一个 Expo 应用**：直接执行 `claude plugin install expo@claude-plugins-official`，五分钟见效，**没有理由不装**。
- **如果你在维护已有 Expo 项目**：装上后重点用 `expo-upgrade` 和 `expo-brownfield`，能省下大量文档考古时间。
- **如果你是框架作者，在犹豫要不要给自己的库做官方 Skill**：Expo 的路径是最佳蓝本——先做 `xxx-overview` 入口，再做分层 Skill，最后用 eval 闭环验证触发率。
- **如果你研究 AI 工具生态**：把 `expo/skills` 和 Anthropic 的 `anthropics/skills` 对照阅读，能清晰看到"Skill 即新一代 SDK 文档"这一范式的成型路径。
一句话收尾：**在 AI 写代码的时代，一个框架的护城河不再是文档写得漂亮，而是 AI 装完之后能不能一次写对。`expo/skills` 已经做出了答卷，下一个跟进的会是谁？**
