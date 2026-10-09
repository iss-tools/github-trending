# twostraws/SwiftUI-Agent-Skill

[GitHub URL](https://github.com/twostraws/SwiftUI-Agent-Skill)


## SwiftUI-Agent-Skill 深度评测：把 Paul Hudson 的 SwiftUI 专家经验装进 AI 编程助手

> Paul Hudson 开源的 SwiftUI Agent Skill，让 Claude Code、Cursor 等 AI 助手按 Swift 圈顶级最佳实践写代码。

- **Tags**: SwiftUI, Agent Skill, Claude Code, iOS 开发, Paul Hudson
- **Category**: AI 编程, 开发工具, 开源项目

## Details

# SwiftUI-Agent-Skill 深度评测：把 Paul Hudson 装进你的 AI 编程助手
> **一句话总结**：这是 Hacking with Swift 创始人 Paul Hudson 开源的 SwiftUI「Agent Skill」，一份能被 Claude Code、Codex、Cursor、Xcode 智能体等直接加载的"专家经验包"——它不是又一个 Prompt 模板，而是把一位 Swift 圈顶级 educator 数千小时实战踩坑的成果，压缩成 AI 写 SwiftUI 时实时对照的"行业黑话词典 + 错题集"。
---
## 一、背景与痛点：AI 写 SwiftUI 为什么总"差点意思"
如果你近一年用 Claude Code、Cursor 或 Codex 写过 iOS 应用，多半见过类似的"AI 味儿"代码：
- 死磕 `foregroundColor()` 和 `accentColor()`，而 Apple 早在 iOS 15/17 就推了 `foregroundStyle()` 和 `tint()`；
- 把按钮塞进 `Image(systemName:)` 却忘了加文本标签，导致 VoiceOver 用户听到的是"按钮"两个字，其它啥也没有；
- 在 `body` 里用 `Binding(get:set:)` 做副作用，让 SwiftUI 渲染性能雪崩；
- 用 `GeometryReader` 解决一切布局问题， resulting in 嵌套地狱；
- `Text("Hello") + Text("World")` 这种字符串拼接，悄悄把本地化 key 干掉了。
Paul Hudson 是 SwiftUI 圈最有话语权的人之一——他从 2019 年 6 月 SwiftUI 刚发布就开始教学，办过著名的 **"Kobayashi Maru"** 现场工作坊，专门帮开发者揪出那些 Xcode 不报警但实际坑人的反模式。他发现：**这些反模式不仅在人类手里代代相传，LLM 训练时也把它们当"标准姿势"学了进去**。
于是他先发布了 `AGENTS.md`，后来又注意到有社区成员几乎逐字抄袭了他的成果还要署自己的版权名——出于"我们要做得更好"的较劲，他干脆把它升级为标准 Agent Skill，开源、MIT 协议，并在 2026 年 3 月发布了 1.0.0，4 月迭代到 1.1.0（加了 Claude Code 插件市场支持和 `Label`/`LabeledContent` 指南），SKILL.md 元数据里当前版本已是 2.0.0。
**它的诞生瞄准的是一个非常具体、且目前无解的问题**：LLM 的训练数据永远滞后于 Apple 的 SDK 更新节奏，Apple 的"软弃用"（`deprecated: 100000.0`，Xcode 根本不告警）进一步让 AI 无知无觉。这个 Skill 本质上是给 LLM 外挂了一层**实时更新的 Swift 圈共识**。
---
## 二、核心亮点与功能剖析：它到底怎么工作
### 1. 它不是 Prompt，是"渐进式披露"的知识库
先用一个比喻帮非 AI 工具链读者理解：
> 把 AI 编程助手想象成一位刚入职的实习生。传统做法是给他塞一本 500 页的"新人手册"（一个巨大的 system prompt），每次对话都要全文重读，Token 消耗爆炸。而 **Agent Skills** 是 Anthropic 在 2025 年推出的开放标准——把知识拆成一堆抽屉文件夹，实习生只在需要时打开对应的抽屉。它用的是文件系统，按需加载，跨 Agent 通用。
SwiftUI-Agent-Skill 完全按这个理念设计。它的目录结构是这样的：
```
swiftui-pro/
├── SKILL.md                ← 入口：触发条件 + 11 步审查流程
└── references/
    ├── api.md              ← 现代 API 替换已弃用 API
    ├── views.md            ← 视图结构、组合、动画
    ├── data.md             ← 数据流、共享状态、属性包装器
    ├── navigation.md       ← NavigationStack/SplitView、sheet
    ├── design.md           ← 人机界面指南
    ├── resizability.md     ← iPad 分屏、iPhone Duo 折叠屏适配
    ├── accessibility.md    ← Dynamic Type、VoiceOver、Reduce Motion
    ├── localization.md     ← 本地化与格式化
    ├── performance.md      ← 性能优化
    ├── performance-plus.md ← 深度性能重构（按需加载）
    ├── swift.md            ← 现代 Swift + 并发
    └── hygiene.md          ← 代码卫生
```
**这种设计的精妙之处在于 Token 经济学**：SKILL.md 只有几百行流程索引，AI 默认只加载它；当你问"检查废弃 API"时，它才去读 `api.md`；只有主动要求"深度性能审查"时才会加载最重的 `performance-plus.md`。Paul 在 README 里还专门写了一条贡献守则："不要写 LLM 已经知道的事，那是在烧用户的 Token。" 这种自我约束在开源 Prompt 工程项目里相当少见。
### 2. 内容"火力"覆盖：11 个模块到底讲了什么
| 模块 | 核心内容 | 典型可修复错误 |
|------|----------|----------------|
| api.md | 软弃用 API 替换、iOS 26/27 新工具栏 API | `foregroundColor` → `foregroundStyle` |
| views.md | 视图拆分、修饰器顺序、动画写法 | 在 `body` 里做重计算 |
| data.md | `@Observable` vs `ObservableObject` | 仍然用 `ObservableObject` 写新代码 |
| navigation.md | NavigationStack、Sheet、Alert | 用已弃用的 `navigationBarLeading` |
| design.md | Apple HIG 合规 | 触控区域过小 |
| accessibility.md | Dynamic Type、VoiceOver、Reduce Motion | Image 缺少 `accessibilityLabel` |
| localization.md | 自动语法一致、Text 拼接 | `Text("a" + str)` 破坏本地化 key |
| performance.md | 视图依赖收窄、初始化器禁视图工作 | `Binding(get:set:)` 在 body 里触发副作用 |
| resizability.md | iPhone Duo 折叠屏、iPad 分屏 | 硬编码 leading/trailing |
| swift.md | Swift 6 严格并发、`@Entry` 宏 | `@Observable` 类漏标 `@MainActor` |
| hygiene.md | 文件拆分、目录结构 | 单文件堆 10 个 struct |
值得单独点赞的是，这个 Skill **已经跟上了 Apple 2026 年的最新生态**：SKILL.md 开头就明确"iOS 27 是默认部署目标""Xcode 27.1 已可用""iPhone Duo 是一台折叠 iPhone，有小外屏和大内屏"——这些规则直接写进了 AI 的世界观，让模型不再把折叠屏 API 当成"猜测中的 API"而不敢用。
### 3. 它有多"较真"：举几个具体规则
随手从 `api.md` 里抽几条，你会发现这不是"LLM 常识汇编"，而是"Swift 圈老炮儿的小抄"：
- **"软弃用"的揭露**：Apple 用 `deprecated: 100000.0` 标记的 API，Xcode 完全不告警。这个 Skill 直接告诉 AI：见到 `accentColor()` 就换成 `tint()`，不要被"编译通过"骗了。
- **`@Entry` 宏的坑**：默认值不能是每次读取都新建的对象（比如 `.now`、`UUID()`、`LibraryStore()`），否则读者会在无关的环境变化时被迫刷新。Xcode 27 能诊断出引用类型但漏掉变化值类型——Paul 把这些边缘情况都写进去了。
- **Text 拼接的本地化陷阱**：`Text("Hello") + Text("World")` 看似无害，实际会把前半段变成"非本地化"字符串。正确写法是把整个 Text 赋值再用插值：`Text("\(red)\(blue)")`。
- **iPhone Duo 折叠屏的语义化 toolbar**：禁用 `navigationBarLeading/Trailing`，改用 `.cancellationAction` / `.confirmationAction` / `.primaryAction` 这种按"角色"分位的 placement，因为折叠屏的垂直工具栏是按角色排序而不是左右位置。
这些规则属于"不写下来 LLM 就永远不知道"的那类知识，也是这个 Skill 真正的护城河。
---
## 三、真实上手：一条命令装进 Claude Code
### 安装（不到 30 秒）
通用安装（支持 Claude Code、Codex、Gemini、Cursor 等）：
```bash
npx skills add https://github.com/twostraws/swiftui-agent-skill --skill swiftui-pro
```
Claude Code 用户可以直接走插件市场：
```
/plugin marketplace add twostraws/SwiftUI-Agent-Skill
/plugin install swiftui-pro@swiftui-agent-skill
```
Xcode 用户需要在 Settings → Intelligence 里配置好内置的 Claude/Codex agent，再按官方 YouTube 视频步骤操作。安装时 npx 会让你选择：只装到当前项目（会写入 `.claude/skills/` 之类目录）还是全局可用。
### 触发方式
- Claude Code：`/swiftui-pro` 或 `/swiftui-pro Check for deprecated API`
- Codex：`$swiftui-pro` 或 `$swiftui-pro Focus on accessibility`
- 自然语言：直接说"Use the SwiftUI Pro skill to look for performance problems in this project."
### 真实演示：AI 输出的前后对比
这是官方 SKILL.md 里自带的示例输出格式，能最直观感受到它带来的变化。假设你让 Claude 帮你写一个"添加用户"的页面，传统 AI 输出可能是：
```swift
// ❌ AI 常见写法
TextField("Username", text: Binding(
    get: { model.username },
    set: { model.username = $0; model.save() }
))
Text("Hello").foregroundColor(.red)
Button(action: addUser) {
    Image(systemName: "plus")
}
```
装上 Skill 后，你只要敲一句 `/swiftui-pro`，AI 会按文件逐行输出这样的审查报告：
> **ContentView.swift**
>
> **Line 12: Use `foregroundStyle()` instead of `foregroundColor()`.**
> ```swift
> // Before
> Text("Hello").foregroundColor(.red)
> // After
> Text("Hello").foregroundStyle(.red)
> ```
>
> **Line 24: Give the button a descriptive label so VoiceOver explains its action.**
> ```swift
> // Before
> Button(action: addUser) {
>     Image(systemName: "plus")
> }
> // After
> Button("Add User", systemImage: "plus", action: addUser)
> ```
>
> **Line 31: Avoid `Binding(get:set:)` in view body – bind to the property directly and move the setter's side effect into `onChange()`.**
> ```swift
> // Before
> TextField("Username", text: Binding(
>     get: { model.username },
>     set: { model.username = $0; model.save() }
> ))
> // After
> TextField("Username", text: $model.username)
>     .onChange(of: model.username) {
>         model.save()
>     }
> ```
>
> **Summary**
> 1. **Accessibility (high):** 加号按钮需要 "Add User" 标签，图标默认的 label 解释不了要加什么。
> 2. **Deprecated API (medium):** `foregroundColor()` 应改为 `foregroundStyle()`。
> 3. **Data flow (medium):** 手动 Binding 脆弱且难维护。
这种**"按严重性分级 + before/after 代码片段 + 简短解释"**的输出结构是 SKILL.md 里硬性规定的格式，不是模型自由发挥，稳定性相当高。
---
## 四、目标人群与收益：谁该装、能省多少事
| 人群 | 能获得什么 | 收益强度 |
|------|-----------|----------|
| **用 Claude Code / Cursor 写 SwiftUI 的独立开发者** | 一次装好，所有新项目都享受"Paul 坐镇 code review"，省下反复 Google "SwiftUI deprecation" 的时间 | ⭐⭐⭐⭐⭐ |
| **接 AI 生成代码外包的团队 Lead** | 把 Skill 加进项目仓库，团队成员 AI 输出风格一致，PR review 量减半 | ⭐⭐⭐⭐⭐ |
| **SwiftUI 初学者** | 相当于把 Paul 的最佳实践当作 lint 实时反馈，边写边学，比读 10 篇博客更高效 | ⭐⭐⭐⭐ |
| **Xcode 26/27 智能体用户** | 弥补 Xcode 内置 agent 缺乏领域知识的短板 | ⭐⭐⭐⭐ |
| **非 Apple 平台开发者** | 基本无用，不建议安装 | — |
| **不使用 AI 编程助手的开发者** | 可以读源码当作免费 SwiftUI 最佳实践清单，但不一定能发挥全部价值 | ⭐⭐ |
**最直接的三个收益**：
1. **省时间**：Apple 一年一 SDK，"最新正确写法"的检索成本不低，Skill 直接把答案塞给 AI。
2. **提高代码可访问性**：这是 AI 写 UI 最薄弱的环节，Skill 强制要求 VoiceOver 标签、Dynamic Type 适配——直接关系 App 能否通过 App Review 和无障碍审计。
3. **避免"未来坑"**：软弃用的 API 今天能编译，明年可能突然报错。Skill 里的规则都是"预防性疫苗"。
---
## 五、竞品/同类对比：它在 Swift 圈 AI 工具生态里的位置
目前针对"让 AI 写好 Swift/SwiftUI"的方案大致有四类：
| 方案 | 代表 | 优势 | 劣势 | SwiftUI-Agent-Skill 对位 |
|------|------|------|------|--------------------------|
| **AGENTS.md / CLAUDE.md** | Paul 的《Teach your AI to write Swift the Hacking with Swift way》 | 简单，粘贴即用 | 每次都全量加载，Token 浪费；无结构化检索 | Skill 是它的"结构化进化版"，借鉴并超越了它 |
| **Cursor Rules / Cursor Rules 库** | awesome-cursorrules 等社区仓库 | Cursor 用户门槛极低 | 主要面向 Web 技术栈，Swift 内容稀薄；只对 Cursor 有效 | SwiftUI-Agent-Skill 跨 Agent，且深度远超社区规则 |
| **SwiftLint / SwiftFormat** | realm/SwiftLint | 强制执行，CI 集成成熟 | 只能查语法层面的规则，无法查"API 是否最新""HIG 是否合规" | Skill 覆盖语义级、设计级知识，与 SwiftLint 互补 |
| **付费课程/书籍** | Paul 自己的 Hacking with Swift | 系统深度 | 一次性学习，更新滞后；不能"运行时注入"到 AI | Skill 是"轻量订阅版" Paul 经验 |
** Paul Hudson 本人也意识到了生态位的问题**，所以在 SwiftUI-Agent-Skill 之后又连发了几个兄弟项目：SwiftData Pro、Swift Concurrency Pro、Swift Testing Pro，并专门开了个 `Swift-Agent-Skills` 仓库作为这些 Skill 的目录索引。换句话说，这个项目不是一个孤立的作品，而是他有意打造**"Swift 领域 Agent Skill 生态"**的第一块砖。
**它的独特竞争力**可以总结为三点：
- **作者背书**：Paul Hudson 在 Swift 圈的地位无需多言，规则的可信度有保障；
- **紧跟 WWDC 2026**：已经覆盖 iOS 27、iPhone Duo、Xcode 27.1，这是绝大多数社区项目做不到的时效性；
- **完全开源 + MIT**：可商用、可魔改、可 fork 到自己团队私有版本。
---
## 六、局限与不足：客观地泼几盆冷水
**1. 强绑定 AI Agent 工具链，入门有前提**
你得先用上 Claude Code、Codex、Cursor、Gemini CLI、Xcode 智能体之一，否则这个 Skill 就是几份 Markdown 文档，没有任何"自动生效"的魔法。对还没用上 AI 编程助手的开发者来说，价值打折。
**2. Token 成本不可忽视，规则有"主观色彩"**
虽然 Paul 刻意精简了内容，但每次触发 `/swiftui-pro` 依然要消耗不少上下文 Token。对于大型项目里几乎每 PR 都跑一遍的场景，长期累积的开销需要权衡。另外他有些规则是**强观点**的——比如"除非绝对必要否则别用 ObservableObject""不要随便引入第三方依赖"——这是 Paul 的风格，但未必符合你团队现状（例如维护一个重度依赖 Combine 老代码的项目）。装上之后最好先做一次 review，把不合团队风格的规则改掉或删掉。
**3. 更新依赖单一维护者**
虽然开源且接受 PR，但当前主要提交者是 Paul 本人。如果哪天他精力转移或不再活跃（这是开源世界的常态），SwiftUI-Agent-Skill 可能跟不上未来 WWDC 节奏。相比之下，Anthropic 官方 skills 仓库有公司资源背书，可持续性更强。
**4. 规则的"Apple 新 API 偏好"是一把双刃剑**
Skill 鼓励使用最新 API（如 iOS 26 原生 `WebView`、iOS 27 工具栏 API），这适合新项目；但**对于需要兼容 iOS 15/16 的项目**，照单全收会直接破坏兼容性。SKILL.md 里明确写了"检查部署目标再给版本相关建议"，但实际执行时 AI 仍可能给出需要 `#available` 包裹的复杂建议，需要你二次把关。
**5. 无法替代真正的代码审查与测试**
Skill 改善的是"AI 写的 SwiftUI 是否符合最佳实践"，但业务逻辑错误、内存泄漏、架构设计问题依然要靠人类 review 和单元测试。**把它当作"效率放大器"而不是"代码质量保险"**。
---
## 七、结语与行动建议
> *"I've been working with SwiftUI since June 2019, and as it evolved over time I started to see people adopt some coding patterns that were less than ideal – they sometimes made buttons invisible to VoiceOver, they used deprecated API without realizing, and they would accidentally write code that caused performance problems."*
>
> —— Paul Hudson，在 SwiftUI-Agent-Skill 发布公告里的话
这段话其实是这个项目最好的注脚：**它不是炫技的开源作品，而是一位 educator 看到 AI 时代的开发者正在重蹈覆辙后，做出的"系统性干预"**。它把一位专家十几年积累的"什么代码是好代码"的判断力，用 Agent Skills 这个新协议封装给了所有 AI 编程助手。
**综合评价**：在当前 Swift + AI 工具生态里，SwiftUI-Agent-Skill 是少有的"即装即用、收益明显、几乎零成本"的项目。**如果你在用任何主流 AI 编程助手写 SwiftUI，没有理由不装它。** 8.5/10。
**具体行动建议**：
1. **今天就可以做的事**：在你主力项目根目录跑一次 `npx skills add` 命令，然后触发 `/swiftui-pro` 让它扫一遍代码，看看它给出的 top 3 修改建议——这一刻你就能判断这个工具对你的价值。
2. **进阶玩法**：读一遍 `SKILL.md` 和 `references/api.md`，把自己团队约定（比如"必须用某路由库""必须用我们的 design system"）作为额外规则加进去，把它改造成**团队专属 Skill**。
3. **保持关注**：订阅 `twostraws/SwiftUI-Agent-Skill` 的 Releases，WWDC 之后往往一周内就会有新版本跟上新 API。同时也看看 Paul 的其他 Pro Skill（SwiftData、Concurrency、Testing），按需组合安装。
它的出现也预示着一个趋势：**未来的编程辅助不再是"通用大模型 + 巨型 system prompt"，而是"领域专家 × 标准化知识封装 × 跨 Agent 可移植"**。SwiftUI-Agent-Skill 是这条路上目前最成熟的一个样本，无论你是不是 Swift 开发者，它都值得作为"如何为一个领域写好一份 Agent Skill"的参考实现来研读。
