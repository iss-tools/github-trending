# solidjs/solid

[GitHub URL](https://github.com/solidjs/solid)


## SolidJS 深度评测：连续 5 年满意度第一的反主流前端框架

> SolidJS 是一个用编译时优化替代 Virtual DOM、以细粒度响应式为核心的高性能前端框架。

- **Tags**: SolidJS, 前端框架, 响应式编程, JavaScript, 开源
- **Category**: 前端开发, 开源项目, 开发工具

## Details

# SolidJS 深度评测：那个"每次都拿满意度第一却始终不是顶流"的反主流信号框架
> **一句话总结**：SolidJS 是一个用编译时优化替代 Virtual DOM、以细粒度响应式为核心的前端 UI 库——它证明了框架完全可以做到"性能接近原生 JS、API 形似 React、心智模型又更简单"，并在 State of JS 中连续 5 年蝉联满意度榜首，是当下学新框架性价比最高的选择之一。
>
> **关键信息卡**：GitHub 35.4K★ / 周下载 1200 万 / 创始人 Ryan Carniato / 2026 年 11 月 16 日发布 Solid 2.0 稳定版 / MIT 协议
---
## 一、背景与痛点：把 React 的"调度税"彻底干掉
要理解 Solid 为什么诞生，需要先回到 2018 年之前的前端现状：React 用 Virtual DOM 让开发者"只管声明 UI，框架帮你算 diff"。这套心智模型好用，但代价是**每次状态变化都要重新跑组件函数、重建虚拟节点、做 diff、再打补丁**——这层"调度税"在大列表、高频更新场景下变得不可忽略。
Solid 的作者 **Ryan Carniato** 是一位从 Knockout.js 时代一路走过来的响应式老兵。他从 2016 年就开始思考一个问题：*既然响应式系统能精准知道"哪个数据变了"，为什么还要绕一圈虚拟 DOM 去"猜"哪个 UI 需要更新？*
这就引出了 Solid 的核心理念——
> **核心理念：与其让框架去"猜"哪个 UI 需要更新，不如让每个 DOM 节点自己盯着自己的信号，谁变了谁就更新，谁也别跑冤枉路。**
可以把 React 和 Solid 的差异类比为两种咖啡店服务方式：
- **React 像中央收银台**：你点了一杯美式，店员把整张订单重新打印一遍，然后 kitchen 对照新订单和旧订单找差异——哦，只有糖包从 1 个变成 2 个，那就只补一包糖。**多了一步"对照"**。
- **Solid 像节点化传菜**：糖包有自己的"小屏幕"，上面直接显示"当前数量=2"。后厨改数据那一刻，小屏幕就同步刷新，**没有对照、没有打印、没有 diff**。
这套思路直到 2021 年 Solid 1.0 发布时仍属"小众异端"，但今天 Angular、Svelte Runes、Vue Vapor、TC39 的 Signals 提案都已采用了类似的响应式模型——Solid 用 5 年时间把这件事从异见变成了共识。
---
## 二、技术架构与设计理念：编译器 + 细粒度响应式的"双引擎"
Solid 的精妙之处在于把两件事拼到了一起，缺一不可：
### 2.1 编译器：把 JSX 编译成"裸 DOM 操作"
很多人以为 Solid 只是"另一个用 Signals 的 React"。**真正的杀手锏在编译时**：Solid 通过 `babel-preset-solid` 把你写的 JSX 直接编译成原生的 DOM 创建和更新指令，运行时**根本没有 Virtual DOM，也没有组件函数反复执行**。
可以用一个比喻来理解：React 像是把一份"建筑图纸"（虚拟 DOM）反复重画再对比找出改动；Solid 像是**施工前就把图纸编译成了一本"维修手册"**——上面精确写着"如果编号为 X 的钢筋松了，去拧 X 处的螺丝"，运行时就是按手册办事。
### 2.2 细粒度响应式：Signals、Memo、Effect 三件套
Solid 的响应式系统由三类原语构成：
| 原语 | 作用 | React 类比 |
|---|---|---|
| `createSignal` | 可读写的基础状态单元 | `useState` |
| `createMemo` | 由其他响应式值派生的"计算值" | `useMemo` |
| `createEffect` | 副作用订阅 | `useEffect` |
但和 React 最大的不同是：**依赖追踪是自动且精确到"读取了哪个 signal"级别**，而不是"哪个组件调用了这个 hook"级别。所以当 `count()` 变化时，**只有那一段真正读了 `count()` 的代码会重新执行**，组件函数本身从头到尾只跑一次。
### 2.3 性能数据：用数字说话
在业界公认的 [js-framework-benchmark](https://krausest.github.io/js-framework-benchmark)（Chrome 150 跑分）中，Solid 1.9.12 的表现：
- 渲染 1000 行表格：**22.7 ms**，React 为 25.6 ms
- 传输体积：**9.4 kB**，React 为 143.4 kB
换句话说，Solid 包体积只有 React 的 **6.6%**，渲染性能还略胜——这正是"编译时优化 + 细粒度响应式"组合拳的成果。
---
## 三、Demo 与核心代码：5 分钟读懂 Solid 长什么样
### 3.1 Counter 组件（最直观的"心智差异"）
```jsx
import { createSignal } from "solid-js";
import { render } from "solid-js/web";
function Counter() {
  const [count, setCount] = createSignal(0);
  const doubleCount = () => count() * 2;
  // 注意：这行 console.log 在你点 1000 次按钮后
  // 也只会输出一次！组件函数只运行一次。
  console.log("The body of the function runs once...");
  return (
    <button onClick={() => setCount(c => c + 1)}>
      {doubleCount()}
    </button>
  );
}
render(Counter, document.getElementById("app")!);
```
**关键观察**：
1. `count()` 是函数调用——这是 Solid 刻意设计的"读写分离"语法糖，告诉编译器"我正在读这个 signal"。
2. `doubleCount` 是普通函数，不需要 `useMemo`，Solid 会自动把它当成 memo 处理。
3. 组件函数**只跑一次**——这是和 React 心智差异最大的一点。
### 3.2 编译产物（看一眼你就懂 Solid 在干嘛）
上面那段代码被 `babel-preset-solid` 编译后会变成类似：
```js
// 静态模板被抽离，编译期一次性创建
const _tmpl$ = /*#__PURE__*/_$template(`<button>Increment: `);
function Counter() {
  const [count, setCount] = createSignal(0);
  const doubleCount = () => count() * 2;
  return (() => {
    // _el$ 是真实的 DOM 节点！
    const _el$ = _tmpl$();
    _el$.$$click = () => setCount(c => c + 1);
    // 把 doubleCount 作为"响应式插入"——只有这段会更新
    _$insert(_el$, doubleCount);
    return _el$;
  })();
}
```
**你看，编译器把"哪里该响应"这件事变成了字面意义上的代码结构**——button 节点是死的，`$insert` 那一行是"活"的，counter 变化只触发这一行重新计算。这就是"细粒度"四个字的真相。
### 3.3 服务端函数（Solid 2.0 新增）
```ts
import { live } from "@solidjs/web/server-functions";
const stockPrice = live(async function* (symbol: string) {
  "use server";
  for await (const tick of subscribe(symbol)) yield tick.price;
});
// 在组件里像用普通响应式值一样用
const price = createMemo(() => stockPrice())
```
这是 2026 年 11 月刚发布的 Solid 2.0 把原 SolidStart 的 Server Functions 收编进核心后的样子——RPC + SSE 双支持，写法已经贴近"前后端同一种语言"。
---
## 四、目标人群与收益：谁该认真看看它？
| 你是谁 | 你能得到什么 | 上手难度 |
|---|---|---|
| **React 开发者** | 思维升级：理解"为什么 hooks 必须按顺序调用""为什么需要 useMemo/useCallback"——这些约束在 Solid 里都不存在，理解了 Solid 反过来更懂 React | ⭐⭐（语法像 React，心智要转换） |
| **追求极致性能的项目** | 体积小 6 倍、更新路径精确到 DOM 节点，对长列表、可视化、低配设备友好 | ⭐⭐⭐ |
| **全栈/独立开发者** | Solid 2.0 自带 Server Functions、流式 SSR、渐进式水合，可以一个框架打通端到端 | ⭐⭐⭐ |
| **AI Agent 编程使用者** | Solid 2.0 专门为 AI 编码加入了 `STRICT_READ_UNTRACKED` 等带错误码、源码位置、修复指引的诊断系统，是当下最"Agent-friendly"的框架 | ⭐⭐ |
| **前端学习者** | 理解响应式系统的本质（订阅、追踪、依赖图），这套知识迁移到 Vue Vapor、Svelte Runes、Angular Signals 都通用 | ⭐⭐⭐ |
**最被低估的收益**：用 Solid 学的是**响应式的底层逻辑**而非某个框架的 API。Ryan Carniato 自己就是 Signal 体系最优秀的"传道者"，他的直播和博客里把 React Compiler、Vue Vapor、Svelte Runes 都剖析过——看完再回头看任何框架都会有"打通任督二脉"的感觉。
---
## 五、竞品对比：在一众"新一代框架"里它究竟什么位置？
| 维度 | Solid 2.0 | React 19 | Vue Vapor | Svelte 5 | Qwik |
|---|---|---|---|---|---|
| **渲染模型** | 编译时 → 真实 DOM + 细粒度 | 运行时 VDOM | 编译时 VDOM→细粒度 | 编译时 Runes | Resumability 可恢复 |
| **组件函数执行** | 一次 | 多次 | 一次 | 一次 | 一次 |
| **包体积** | ~9.4 kB | ~143 kB | 中 | 小 | 极小 |
| **典型场景性能** | 顶级 | 中上 | 顶级 | 顶级 | 顶级 |
| **生态丰富度** | 中等 | 顶级 | 顶级 | 中上 | 较小 |
| **State of JS 满意度** | 连续 5 年第 1 | 中等 | 较高 | 较高 | 较高 |
| **使用率** | ~10% | ~80%+ | ~50% | ~25% | <5% |
| **TypeScript** | 一流 | 一流 | 一流 | 一流 | 一流 |
**独特竞争力**：
- **vs React**：性能与体积压倒性优势，但生态几乎没法比。React 的护城河是 13 年积累的"踩坑库 + 中间件 + 招聘市场"，Solid 短期内撼动不了。
- **vs Svelte**：心智模型接近，但 Svelte 5 Runes 才刚走 Solid 的老路，Solid 已经走了 5 年——在异步响应式（Async Graph）、Server Functions、AI 友好诊断上更成熟。
- **vs Vue**：Vue Vapor 仍在推进中，目前 Vue 的细粒度响应式还没下放到渲染层；Solid 是"响应式到渲染层"的纯血版本。
- **vs Qwik**：Qwik 主打"零水合"，思路激进；Solid 走的是"最朴素但最快的全功能框架"路线，更通用。
---
## 六、局限与不足：必须直面的事
任何吹爆 Solid 的文章如果不说清楚下面这些，都算不上客观。
### 6.1 生态广度仍是硬伤
React 生态里的 Framer Motion、Radix UI、Headless UI、TanStack 的一票全家桶、各类可视化/编辑器（Monaco、ProseMirror）——很多在 Solid 下需要找替代品或者干脆没有。已有第三方库如 **Kobalte**（参考 Radix 的无样式组件库）、**Modular Forms**、**solid-primitives** 在补，但仍然是"持续补"的状态。
### 6.2 React 开发者最容易踩的 3 个坑
这是 GitHub Discussion #1042 和大量迁移文章反复总结的高频踩坑点：
**坑 1：解构 props 等于"断线"**
```jsx
// ❌ 错误：解构会把 props.age 变成"一次性快照"，丢失响应性
function Child({ age }) {
  return <div>{age}</div>; // 父组件 age 再变，这里不更新
}
// ✅ 正确：始终用 props.age 访问
function Child(props) {
  return <div>{props.age}</div>;
}
// ✅ 也可以在需要"默认值"时用 mergeProps
import { mergeProps } from "solid-js";
const finalProps = mergeProps({ name: "default" }, props);
```
原理：`props` 是一个 Proxy，只有 `props.age` 这种**延迟求值**才能继续追踪；解构相当于"读一次然后缓存"，自然失去响应。
**坑 2：不要用 `if` 和 `.map()`，要用 `<Show>` 和 `<For>`**
```jsx
// ❌ 用 if 控制渲染 —— 编译器无法建立追踪关系
{isLoggedIn && <Dashboard />}
// ✅ 用 <Show> 让编译器知道这是一段条件渲染
<Show when={isLoggedIn()} fallback={<Login />}>
  <Dashboard />
</Show>
// ❌ 用 .map() —— 数组变化时整个列表会重建
{items().map(item => <Row item={item} />)}
// ✅ 用 <For> 做键控 diff
<For each={items()}>{(item) => <Row item={item} />}</For>
```
**坑 3：以为组件会"重新渲染"**
如果你在组件函数里写了 `console.log(props.foo)`，会发现它只打一次。这其实是设计而非 bug——**所有需要"响应"的逻辑都应该放在 JSX 表达式、`createMemo` 或 `createEffect` 的回调里**，而不是组件函数体顶层。
### 6.3 SolidStart 被废弃引发的"框架方向焦虑"
2026 年 9 月 SolidStart 2.0 刚发布稳定版，10 天后官方就宣布它进入维护模式，原因是 2.0 把 Server Functions、路由、文件路由全部下沉到核心 + Vite 插件。Hacker News 上对此议论纷纷，有人叫好"职责更清晰"，也有人担心"生态连续大迁移会让观望者更观望"。这是选 Solid 之前必须接受的"早期框架代价"。
### 6.4 社区规模与招聘市场
State of JS 2025 中 Solid 使用率仅 **10%** 左右，对比 React 的 80%+ 不在一个量级。这意味着：遇到问题时搜中文博客几乎搜不到，团队招聘时候选人池子小，第三方教程和视频少很多。
### 6.5 2.0 的 Breaking Changes
Solid 2.0 删掉了 `createResource`、`batch`、`startTransition`、`on`、`produce`、`createComputed`、`createMutable` 等一大票 1.x 原语，部分 API 改名。**老项目升级不是无痛的**，官方建议 1.x 项目先停留在 1.9.12，新项目再考虑直接 2.0。
---
## 七、结语与行动建议：终极评判
> **终极评判**：SolidJS 是过去 5 年里"理念最先进、工程最克制、满意度最高、但商业上最难做大"的前端框架。它不是 React 的"平替"，而是用 5 年时间**把"响应式 UI 该怎么做"这个问题的最优解写给了整个行业**——今天你看到的 Svelte Runes、Vue Vapor、Angular Signals、TC39 Signals 提案，多少都欠它一份人情。
**什么时候应该选它**：
- 个人/小团队的新项目，追求性能与开发爽感
- 想深度理解前端响应式系统底层
- 需要写"AI Agent 容易写对"的代码（Solid 2.0 的诊断系统就是为此设计）
- 长列表、可视化、低性能设备场景
**什么时候不应该选它**：
- 团队已经有深厚的 React 生态积累
- 招聘是首要约束（市场候选人少）
- 重度依赖某个只在 React 生态存在的库
**给你的 3 条行动建议**：
1. **先用 Playground 感受心智差异**：[solidjs.com/playground](https://www.solidjs.com/playground) 里写一个 Counter，看着编译产物，10 分钟就明白"细粒度"到底细在哪。
2. **新项目脚手架**：`npx degit solidjs/templates/ts my-app` 直接拉 Vite + TS 模板，5 分钟跑起来。
3. **学的是思想而非框架**：哪怕最后你在生产里写 React，也强烈建议读一遍 Solid 文档的 [Fine-grained Reactivity](https://docs.solidjs.com/advanced-concepts/fine-grained-reactivity) 章节——它会让你以后看 React Compiler、Vue Vapor、Svelte Runes 时不再云里雾里。
> 用 Ryan Carniato 在 2.0 发布博客里的话作为收尾：*"Solid 2.0 是从一个跟随者变成被跟随者的宣言。"* 这句话放在 2026 年 11 月，比过去任何时候都更有底气。
