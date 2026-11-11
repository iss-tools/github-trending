# GoogleChrome/modern-web-guidance-src

[GitHub URL](https://github.com/GoogleChrome/modern-web-guidance-src)


## Chrome 官方出品：让 AI 编码代理写出 2026 年现代 Web 代码的技能包深度评测

> Chrome 团队开源的 Agent Skills 工具包，让 Claude Code、Gemini CLI 等 AI 编码代理自动写出符合最新 Web 最佳实践的现代化前端代码。

- **Tags**: Chrome, AI 编码代理, Web 最佳实践, 开源项目, Agent Skills
- **Category**: 开发工具, AI 编程, 前端开发

## Details

> **一句话总结**：`GoogleChrome/modern-web-guidance-src` 是 Chrome 团队开源（Apache 2.0）的"AI 编程代理补课包"——通过一组 Agent Skills + 离线 CLI 检索器，把 Web 平台最新的最佳实践和浏览器兼容性数据直接喂给 Claude Code、Gemini CLI、Copilot CLI 等编码代理，让它们别再写出"能跑但老气横秋"的前端代码。
这是一份对 AI 编码代理的"现代化改造工程"，也是 2026 年 Google I/O 上 Chrome 团队对外宣称的"最佳实践遵循度提升 37 个百分点"的数据来源项目。它的源仓库（`-src`）是工程指挥中心，发布仓库才是开发者的安装入口——理解这条双仓结构，是读懂这套体系的第一步。
---
## 一、背景与痛点：为什么 AI 写的代码总是"五年前"
请您先回想一个常见场景：让 Claude Code 或 Cursor 写一个"可关闭的模态框"，它大概率会给你一段 80 行的 JS——手动监听 Escape、自己写焦点陷阱（focus trap）、用 `position: fixed` 叠一层遮罩、再用 `setTimeout` 同步退出动画。功能没问题，测试也通过，但 2026 年的浏览器早就有 `<dialog>` + `showModal()` + `closedby="any"`，8 行就能搞定同样的事，还自带焦点管理和顶部层渲染。
这不是模型"傻"，而是结构性问题。Chrome 团队和多个独立分析给出的解释是：
- **训练语料的"均值回归"**。LLM 的训练集里 2010–2022 年的代码远多于 2024–2026 年的新模式，模型的"中间写法"自然被拉向几年前。
- **知识截止日 + 检索不等于判断**。即便接了 RAG、把 MDN 喂进去，模型依然回答不出"在我这个项目里、在我声明的浏览器支持范围内，能不能用这个特性？"——这是规范知识与工程决策之间的鸿沟。
- **打包成依赖的肌肉记忆**。AI 习惯把 UI 复杂度翻译成"再装一个库"——tooltip 上 Floating UI、模态上 Headless UI、动效上 Framer Motion，包体积和认知负担悄悄膨胀。
Chrome 的 VP Parisa Tabriz 在 I/O 上的表态很直白：是时候停止让 AI 代理在 2026 年还在写 `window.open` + jQuery polyfill 了，因为 `<dialog>`、Popover API、CSS Anchor Positioning 都已经在那儿了。
**Modern Web Guidance 的核心定位不是"再写一份文档"，而是"在模型选 API 之前，先把判断依据塞进它的上下文"。**
---
## 二、双仓架构：`-src` 与发布仓库各管什么
这是评测这个项目时最容易被忽略、但最能体现工程成熟度的地方。
| 仓库 | 角色 | 主要内容 |
|---|---|---|
| `GoogleChrome/modern-web-guidance` | **分发仓（Dist Repo）** | 给最终用户安装用的精简 Skills、CLI 入口、各代理插件清单 |
| `GoogleChrome/modern-web-guidance-src` | **源仓** | 指南源文件、评测 harness、Playwright grader、构建脚本、CLI 实现、RAG 索引、Dashboard |
`-src` 仓的关键目录结构（来源自 `docs/CONTEXT.md`）：
```
modern-web-guidance-src/
  AGENTS.md          # 给 AI 代理的入口路由
  guides/            # 所有指南内容，按领域分类
    performance/  ui-components/  css/  accessibility/  security/ ...
  features/          # 特性定义与代码片段（用于 transclusion）
  skills-src/        # 独立 Agent Skill 的源文件
  src/
    authoring/       # gd dev 流水线编排
    cli/             # Skills CLI 实现 + 遥测
    rag/             # 离线语义检索（TensorFlow.js 向量库）
    grading/         # 基于 Playwright 的 grader 引擎
    harness/         # 评测 harness、agent runner、基础 App
    dashboard/       # 评测可视化
  harness/base-apps/ # daily-grind、devtools-times 等被改造的样板项目
  nightly/           # 每夜评测脚本
```
**每个指南目录里的工程化设计是这个项目的"灵魂"**。一个完整指南不止是 `guide.md`，还包括：
- `guide.md` —— 由领域专家（SME）撰写，可嵌入宏指令（`BASELINE_STATUS`、`INCLUDE`、`FEATURE_FALLBACKS` 等）
- `demo.html` —— "金标准"独立实现，作为参考答案
- `expectations.md` —— 自然语言描述的可观测断言，用于生成 grader
- `targets/<base_app>/patches/` —— 多个不同代理（Antigravity、Claude、Codex、Jetski）的解决方案 patch，以及一个空的 `zero-passrate.patch` 作为基线
- `targets/<base_app>/grader.ts` —— 自动生成的 Playwright 测试，**校准目标是：金标准 patch 必须全过，未改造的 base app 必须全不过**
换句话说，每条指南都不是"贴一段代码完事"，而是被一套"双盲校准"的自动化测试锁住了效果。这是它跟普通 Awesome List 或 Prompt Collection 最本质的区别。
---
## 三、核心亮点：把"判断依据"做成可检索、可校准、可量化的资产
### 1. 不是"文档集合"，而是"搜索工具"
这是官方反复强调、却又常被误解的设计。Skill 本体只占用 **约 234 token**（`chrome-extensions` 是 181 token），常驻在上下文里，作用等同于一张"调用说明书"，明确告诉模型：凡是 HTML/CSS/客户端 JS 任务，**先调用 `modern-web-guidance` CLI 检索，再动手写码**。
真正的"知识库"通过按需检索进入上下文：
```bash
# 语义检索（离线 TensorFlow.js 模型，无网络调用、无 API key）
npx modern-web-guidance@latest search "animate a dialog modal backdrop"
# 按 ID 取出完整指南
npx modern-web-guidance@latest retrieve "animate-to-from-top-layer"
```
返回的 JSON 自带 `tokenCount` 字段，模型在决定要不要"读"这条指南前，就能评估上下文预算。
```json
{
  "id": "optimize-image-priority",
  "description": "Optimize the loading priority of LCP candidate images.",
  "category": "performance",
  "featuresUsed": ["Fetch priority"],
  "tokenCount": 985,
  "similarity": 0.7289
}
```
这是个"用 token 换正确性"的精妙折中：常驻极小，单条指南 1085–4317 token，按需取用。把 132 个用例全部塞进 system prompt 会瞬间吃掉几十万 token——这种"按需检索"才是技能包可持续的形态。
### 2. 内容覆盖：104 个特性 + 131 个真实用例
数量与分布（来源仓库 README 和官方文档）：
| 维度 | 数量 | 代表内容 |
|---|---|---|
| CSS & Layout | 51 | `:has()`、Container Queries、`@starting-style`、Anchor Positioning、`text-wrap: balance`、`light-dark()`、View Transitions |
| HTML & DOM | 20 | `<dialog>`、Popover API、`popover="hint"`、`Invoker commands`、`<link rel="expect">`、`blocking="render"` |
| JavaScript & APIs | 33 | `scheduler.yield()`、`fetchLater`、Speculation Rules、Temporal、WebAuthn、内置 AI API（Translator/Summarizer/Prompt API） |
| **用例分布** | **131** | ui-behaviors 29、performance 23、visual-design 16、forms 15、css 13、ui-atoms 10、js 8、security 6、built-in-ai 4、webmcp 2 |
可以看出 Chrome 团队对"AI 最容易写错"的地方有精准洞察：**ui-behaviors 和 performance 两块占了近 40%**，因为这两块恰好是 AI 最喜欢"自己造轮子"的领域。
### 3. 与 Baseline 的深度集成：让"能不能用"成为可计算的判断
Baseline 是 WebDX Community Group 主导的浏览器特性成熟度分级（Limited / Newly / Widely available）。Modern Web Guidance 把它做成了"项目级开关"——在 `AGENTS.md`、`CLAUDE.md` 或 `.gemini/GEMINI.md` 里写一句：就够让模型对每个 API 做出精确取舍。
```markdown
# Browser support target
This project's Baseline target is Baseline 2024.
Prefer native browser APIs when they meet this target.
Use progressive enhancement for newer or limited-availability features.
```
这是本项目**最被低估、却最决定性的能力**。没有它，模型要么激进使用 `@starting-style` 导致 Safari 老版本崩盘，要么保守地给一切加 polyfill；有了它，"加法增强 vs 关键行为"被区分对待——前者可以优雅降级，后者必须带 fallback。
### 4. 内置 RAG：离线语义检索，不联网、不留痕
`src/rag/` 实现了一套基于 TensorFlow.js 的向量检索，**全程本地推理、零 API key、零网络请求**。这意味着：延迟稳定（几十毫秒级）、不依赖云端、不会把代码上下文外发——在合规敏感的企业场景里，这是一个加分项。
### 5. 评测 harness：用工程方法"证明"指南有用
`-src` 仓库的灵魂不是 guides/ 而是 harness/。每个指南的 grader 都经过"金标准 patch 全过、基线 app 全不过"的双向校准，评测输出形如：
```
Agent test results:
Base app (pre): 1/9 checks passed (11%)
Unguided:      3/9 checks passed (33%)
Guided:        8/9 checks passed (89%)
Guide impact:  +56% (vs unguided)
```
外部第三方评测也给出了显著数据：内部基准上最佳实践遵循度提升 **37 个百分点**，INP 平均降低 **18%**、LCP 提升 **12%**、长任务 (>50ms) 减少 **30%**；日本 LY Corporation（LINE/Yahoo Japan 母公司）声称把 Lighthouse 人工审计分析减少了 **96–98%**。
---
## 四、AI 输入 / AI 输出对照：同一 Prompt，两种代码世界
下面这三组对比来自 LogRocket 的实战评测，由同一位作者、同一个 Gemini CLI、同一个 Prompt，分别在不带/带 Modern Web Guidance 的环境下生成，最具"眼见为实"的说服力。
**Prompt**（两个环境完全相同）：
```
Build a Task Manager app. It should have:
- A modal for adding tasks with smooth entrance and exit animations.
- Task cards that stack vertically in a sidebar but show full details in the main area.
- A search bar that filters 2,000 tasks without lagging the UI.
- A Help tooltip tethered to the Status icon that flips if it hits the viewport edge.
```
### 对照一：Tooltip 定位
| 维度 | 无 Guidance | 有 Guidance |
|---|---|---|
| 方案 | 安装 `@floating-ui/react` + hook | CSS Anchor Positioning |
| 包体积 | + 一个依赖 | 0 依赖 |
| 代码层级 | JS 计算位置 | CSS 声明位置 |
无 Guidance 版本：
```tsx
import { useFloating, flip, shift, offset } from '@floating-ui/react';
export function StatusTooltip({ children }) {
  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    middleware: [offset(10), flip(), shift()],
  });
  return (
    <>
      <div ref={refs.setReference} className="status-icon">i</div>
      <div ref={refs.setFloating} style={floatingStyles} className="tooltip">{children}</div>
    </>
  );
}
```
有 Guidance 版本：
```css
.status-icon { anchor-name: --status-icon; }
.tooltip {
  position: absolute;
  position-anchor: --status-icon;
  position-area: top;
  position-try-fallbacks: flip-block;
  margin-bottom: 10px;
}
```
Floating UI 本身没做错什么，但对一个简单 tooltip 来说，它就是"用火箭筒打蚊子"。
### 对照二：模态动画
无 Guidance 版本的脆弱点在于那个 `300` 毫秒的 `setTimeout`——它必须和 CSS transition 时长**人工同步**，任何一边改动都会让退出动画断裂。
有 Guidance 版本用原生 `<dialog>` + `transition-behavior: allow-discrete` + `@starting-style`：
```css
dialog {
  opacity: 0;
  transform: scale(0.96);
  transition: display 0.4s, overlay 0.4s, opacity 0.4s ease, transform 0.4s ease;
  transition-behavior: allow-discrete;
}
dialog[open] { opacity: 1; transform: scale(1); }
@starting-style {
  dialog[open] { opacity: 0; transform: scale(0.96); }
}
dialog::backdrop { background: rgb(0 0 0 / 40%); }
```
焦点管理、Escape 关闭、顶部层渲染、backdrop，浏览器全包了。
### 对照三：2000 条数据搜索过滤
无 Guidance 版本用 `useMemo` 包 filter——但 `useMemo` 只避免无谓的重算，**过滤本身依然是同步阻塞主线程的**。这是 React 项目里最常见的"安静性能杀手"。
有 Guidance 版本改用 `scheduler.yield()` 把循环切块，每段之间让浏览器有机会响应输入和重绘：
```ts
useEffect(() => {
  let cancelled = false;
  const filterTasks = async () => {
    setIsFiltering(true);
    const results: Task[] = [];
    for (let index = 0; index < tasks.length; index++) {
      if (cancelled) return;
      // ... match logic
      if (index % 100 === 0) await scheduler.yield(); // 让出主线程
    }
    setFiltered(results);
    setIsFiltering(false);
  };
  filterTasks();
  return () => { cancelled = true; };
}, [searchQuery]);
```
这不是算法优化，而是把"主线程长任务"这一类 INP 问题一次性消灭掉。
---
## 五、上手体验与安装：CLI 的"开箱即用度"相当高
通用安装（Node.js ≥ 20）：
```bash
npx modern-web-guidance@latest install
```
也可以按代理分端口安装，覆盖度异常广：Claude Code、Gemini CLI、GitHub Copilot CLI、Google Antigravity、Goose、Grok Build、OpenAI Codex、Kimi Code、Vercel Skills、GitHub CLI、Cursor 插件市场，几乎一网打尽当前主流的编码代理。
```bash
# Claude Code
/plugin marketplace add GoogleChrome/modern-web-guidance
/plugin install modern-web-guidance@googlechrome
/reload-plugins
# Gemini CLI
gemini extensions install https://github.com/GoogleChrome/modern-web-guidance --auto-update
# Antigravity
agy plugin install https://github.com/GoogleChrome/modern-web-guidance
# Vercel Skills 通用
npx skills add GoogleChrome/modern-web-guidance
```
**社区活跃度数据**（截至本评测时）：源仓库 994 stars / 75 forks / 897 commits / 299 open issues / 51 PR；分发仓 1.8k stars / 202 commits；按周级节奏持续发版。 Issue 和 PR 数量较大属于"早期阶段+开放贡献模式"的合理表现，问题并非停滞。
---
## 六、竞品对比：它站在什么位置
| 方案 | 解决什么 | 局限 |
|---|---|---|
| **Modern Web Guidance（Chrome 官方）** | 离线语义检索 + Baseline 决策 + Playwright 评分校准，专攻 Web 平台最佳实践 | 仅 Web 前端；覆盖仍有空白（WebGPU、可安装 PWA 等尚不全） |
| **Context7** | 通用 RAG 文档检索，覆盖各类库 | 没有工程判断——把 MDN 喂进去也回答不了"这个项目该不该用" |
| **各模型自带的 Web Search** | 抓最新文档 | 取决于搜索引擎与上下文预算，质量不稳；且每次都付网络成本 |
| **手写 team prompt / CLAUDE.md** | 项目规范 | 维护成本高，需要自己跟 Web 平台演化 |
| **ESLint / Stylelint / browserslist** | 静态检查 | 是事后检查而非生成时引导；需要团队自己写规则 |
| **Chrome DevTools MCP** | 让 Agent 看到控制台/网络/无障碍树 | 与本方案互补，不冲突（LY Corp. 就是两者组合使用） |
**它的独特竞争力在于三件事的乘积：专家撰写 × Baseline 兼容性决策 × Playwright 评测闭环。** 这三点单独看都不稀奇，组合在一起才是护城河。
---
## 七、局限与不足：不要把它当 linter 用
客观讲，这份" preview 阶段"的项目还有几处值得警觉：
1. **覆盖不全**。WebGPU、可安装 PWA、高级 WAAPI 动画等方向覆盖薄弱或缺失，仓库 roadmap 上有大量公开 issue 跟踪这些空缺。
2. **Baseline 目标是双刃剑**。声明 `Baseline 2024` 或更激进的目标后，模型会大胆使用新 API——在 Safari 6 个月前的版本上就可能出 bug。**配置错误会放大而不是减少兼容性问题**。
3. **Token 成本不是零**。常驻 234 token 不算什么，但每条指南 1000–4000+ token，一个复杂任务可能检索 3–5 条指南，累计上下文压力不可忽视，在窄上下文模型上尤其如此。
4. **专家撰写 ≠ 安全审计**。指南教你怎么用 `autocomplete` 属性，但不替你做服务端校验；认证、CSP、Passkey 这些"关键行为"仍然要走完整的安全 review 流程。
5. **不是 Linter**。它影响"生成时"的决策，不会扫描存量代码给你报告（尽管配套的扫描器思路已在社区讨论中）。
6. **跨代理体验不完全一致**。同一个 skill 在 Claude Code、Gemini CLI、Antigravity 里的"是否主动调用"取决于各家的 skill 路由实现，需要在自己的工作流里实测。
---
## 八、谁最应该立刻装上？
| 人群 | 收益 |
|---|---|
| **前端工程师 + AI 编码代理重度用户**（Claude Code / Gemini CLI / Antigravity / Cursor） | 直接降低依赖膨胀，代码体积、INP、可访问性显著改善 |
| **Vue / React / Next.js 项目维护者** | 让 Agent 生成的代码更接近"原生优先"原则，减少后续技术债 |
| **企业前端团队** | 把 Baseline 目标写进 AGENTS.md 即可统一团队"现代化标准"，免去口口相传 |
| **独立开发者 / Vibe Coder** | 不需要精通 2026 年所有 CSS 新特性，也能让 AI 替你写出"像 2026 年人写的代码" |
| **设计系统 / 组件库作者** | Popover、Anchor Positioning、`<dialog>` 这些现代原语能直接替代大量自定义组件 |
**不太适合**：纯后端 / 数据工程 / DevOps 项目（skill 的触发逻辑本身就把这些场景排除了）；严格锁定老浏览器（IE/老 Safari）的项目——这里的"现代化"反而会成为负担。
---
## 九、结语与行动建议
**这是一份"用工程方法对抗模型均值回归"的代表作。** 它不炫技、不堆 prompt，而是用 SME 撰写 + Playwright 双盲校准 + 离线 RAG + Baseline 决策这条流水线，把"AI 写现代化前端"这件事从"祈祷模型懂"变成了"可量化、可复现、可校准"的工程问题。
**给三类读者的行动建议**：
- **如果你已经在用 AI 编码代理写前端**：现在就在项目根目录跑 `npx modern-web-guidance@latest install`，再在 `AGENTS.md` 里写清楚 Baseline 目标——这是收益/成本比最高的两步。
- **如果你想先观望**：`npx modern-web-guidance@latest search "<你的场景>"` 可以完全离线试用，不用安装，先看看它给出的指南是否比你的现状更好。
- **如果你在维护团队规范**：把它看作一份"Chrome 官方维护的 Web 平台 best-practice 单一来源"，让团队的 prompt 模板、Review checklist、CI 静态规则围绕它对齐，避免每个人各写一份过时的标准。
唯一要记住的忠告是：**它解决的是"代码风格现代化"，不是"代码质量保证"**。安全审计、测试覆盖、架构 review，依然得走你原有的工程流程。把它当成一位 Chrome 团队派驻到你的编码代理旁边的"懂 2026 年 Web 平台的资深顾问"——而不是替你签字的 code owner。
