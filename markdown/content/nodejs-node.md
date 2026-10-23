# nodejs/node

[GitHub URL](https://github.com/nodejs/node)


## Node.js 深度评测：定义服务端 JavaScript 的开源巨头

> Node.js 是用事件循环重新定义服务端开发的 JavaScript 运行时，是生产环境的默认答案。

- **Tags**: Node.js, JavaScript, 运行时, 开源项目, 后端开发
- **Category**: 开发工具, 后端开发, 开源项目

## Details

# Node.js 深度评测：一个用 17 年时间定义「服务端 JavaScript」的开源巨头
> **一句话总结**：nodejs/node 是现代 Web 世界最底层的地基之一——它把浏览器里的 JavaScript 带到了服务器端，用「事件循环 + 非阻塞 I/O」这套组合拳，重新定义了过去 17 年里整个后端世界的玩法。即便 Bun、Deno 等后起之秀在性能上屡屡超越它，它依然是 90% 后端运行时的不二选择，也是任何开发者绕不开的基础设施。
---
## 一、背景与痛点：为什么要造 Node.js？
要理解 Node.js，得先回到 2009 年那个前 `async/await`、前 ES6 的时代。
当时的服务端开发被 **Apache + PHP**、**Ruby on Rails** 等把持。这些技术栈有一个共同的命门——**每个连接占用一个线程或进程**。当你访问一个数据库时，当前请求就会被"卡住"等待；为了同时服务更多用户，你就得堆线程或堆内存，堆到 500 个并发连接就已经喘不过气。
故事的主角 Ryan Dahl 当时是一名数学系博士生，中途辍学，揣着一张单程机票去南美旅行，靠教英语维生。他在写 Ruby on Rails 应用时被 Apache 的并发模型反复折磨，后来他意识到：**浏览器端的 JavaScript 天生就是单线程 + 事件回调的模型**——鼠标点击不会阻塞页面渲染，网络请求不会阻塞按钮响应。为什么服务端不能也这么干？
于是 2009 年 11 月的 JSConf EU 上，Dahl 现场演示了一个能把并发连接堆到**数万级别**的服务端 JavaScript 运行时，全场沸腾。这就是 Node.js。
> **一句大白话**：Apache 像一个银行柜台，每个客户配一个柜员，人多就雇不起；Node.js 像一个外卖小哥，一次接 100 个订单，哪单做好了送哪单——**用"事件驱动"替代"等待阻塞"**。
2011 年 npm 上线，PayPal、LinkedIn、Netflix 相继大规模投产，Node.js 从此一发不可收拾。
---
## 二、仓库速览与数据面板
打开 `github.com/nodejs/node`，你会看到一组令人瞠目的数字：
| 指标 | 数据 | 说明 |
|---|---|---|
| ⭐ Stars | **122.5k** | GitHub Top 20 级别 |
| 🍴 Forks | **39.8k** | 衍生生态极其庞大 |
| 📦 Commits | **49,155** | 主分支提交总量 |
| 📜 License | MIT | **可自由商用**，连闭源产品都能用 |
| 🗣️ 主语言 | JavaScript + C++ + Python | JS 是接口层，C++ 是引擎层 |
| 🏛️ 治理 | OpenJS Foundation | 中立基金会，不属于任何单一公司 |
| 📥 依赖仓库 | **110 万个** | 几乎所有 npm 项目都间接依赖它 |
数据来源：GitHub 仓库主页与 LFX Insights
版本节奏上，Node.js 一年一更，**每年 4 月发 Current、10 月转 LTS**，LTS 提供 **30 个月支持**，加上 Current 阶段共 36 个月生命周期。从 Node.js 27 开始官方调整了节奏——**所有大版本都会进入 LTS**，不再分奇偶。
截至本文撰写（2026 年 10 月），现役版本矩阵是：
| 版本 | 状态 | 代号 | 支持到 |
|---|---|---|---|
| Node.js 26.8.2 | Current | — | 短期 |
| **Node.js 24.21.0** | **Active LTS（推荐生产）** | Krypton | 2028 年 4 月 |
| Node.js 22.23.2 | Maintenance LTS | Jod | 维护期 |
| Node.js 27 | 即将发布（Alpha/Current） | — | — |
**生产环境请无脑选 24 LTS**——它在 2025 年 10 月成为 Active LTS，是官方认证的"稳"字招牌。
---
## 三、核心架构剖析：Node.js 到底是怎么跑起来的？
这是本评测的硬核部分。不理解这一节，后面所有的"优化"都是玄学。
### 3.1 三层架构：JS 是壳，C++ 是芯
打开仓库根目录，你会看到这样的结构：
| 目录 | 作用 | 语言 |
|---|---|---|
| `lib/` | Node.js 的 JS 层 API（http、fs、path…） | JavaScript |
| `src/` | 引擎胶水层（把 JS 调用桥接到 C++） | C++ |
| `deps/` | **第三方引擎**：V8、libuv、OpenSSL、c-ares、undici | C/C++ |
| `test/` | 数千个测试文件 | JS |
| `benchmark/` | 官方性能基准 | JS |
| `doc/` | 文档与贡献指南 | Markdown |
**用造车打个比方**：`deps/` 是发动机和变速箱（V8 引擎 + libuv I/O 库），`src/` 是底盘和车架，`lib/` 是方向盘、油门刹车这些驾驶接口。我们平时写的代码，全部是在踩油门——真正在燃烧的是底层 C++。
**V8** 是 Google 为 Chrome 开发的 JavaScript 引擎，负责把 JS 编译成机器码。**libuv** 是 Node.js 团队为跨平台异步 I/O 专门写的 C 库，负责事件循环、线程池、文件/网络 I/O 的所有脏活。
### 3.2 事件循环：单线程的"神技"
很多人误以为"Node.js 是单线程的，所以慢"。**真相是：JS 执行是单线程，但 I/O 调度是多线程的**。
libuv 默认会启动一个 **4 线程的线程池**（通过环境变量 `UV_THREADPOOL_SIZE` 可以调到最多 1024）。事件循环的工作流程是这样的：
```
     ┌────────────────────────┐
 ┌─> │        timers          │  ← setTimeout / setInterval
 │   └───────────┬────────────┘
 │   ┌───────────▼────────────┐
 │   │    pending callbacks   │  ← 系统级回调
 │   └───────────┬────────────┘
 │   ┌───────────▼────────────┐
 │   │       poll             │  ← 网络/文件 I/O
 │   └───────────┬────────────┘
 │   ┌───────────▼────────────┐
 │   │       check            │  ← setImmediate
 │   └───────────┬────────────┘
 └───┴───────────────────────┘
```
整个流程像是**一个高效的餐厅服务员**：他不站在一张桌子旁等客人吃完，而是穿梭于多张桌子之间——点单（发起 I/O）、传菜（回调）、结账（清理）。当主线程空闲时，就去 libuv 的"待办队列"里取活干。
> **避坑指南**：`fs.readFile`、`crypto.pbkdf2`、`dns.lookup` 都会占用线程池的 4 个默认槽位。如果你的服务是"文件 + 加密 + DNS 查询"混合型，**强烈建议把 `UV_THREADPOOL_SIZE` 调到 16 或 CPU 核数**，部分场景能翻倍。
### 3.3 一个最小的 HTTP 服务器（10 行代码）
```javascript
// server.mjs
import { createServer } from 'node:http';
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});
server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on http://127.0.0.1:3000');
});
```
运行：`node server.mjs`。没有框架、没有依赖、没有 build 步骤，10 行代码跑起一个 HTTP 服务。
### 3.4 内置测试运行器（Node 18+ 稳定）
这是近年来 Node.js 生态最被低估的功能——**不再需要 Jest/Mocha，原生就能写测试**：
```javascript
// test/math.test.mjs
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
describe('calculator', () => {
  test('adds numbers', () => {
    assert.equal(1 + 2, 3);
  });
  test('rejects negatives', async () => {
    await assert.rejects(
      async () => { throw new Error('negative!'); },
      /negative!/
    );
  });
});
```
运行：`node --test`。支持并行执行、TAP 输出、子测试、mock、fixture、自定义 reporter——**Jest 能做的 80% 它都做了，零依赖、零配置、秒启动**。
### 3.5 原生 TypeScript 支持（v24 已稳定）
这是 Node.js 24 最重磅的功能。**从 v24.12.0 开始，type stripping 已标记为稳定**，直接跑 `.ts` 文件不再是实验特性：
```bash
node app.ts        # 直接跑，不需要 ts-node、tsx、tsc
node --watch app.ts  # 文件变化自动重启
```
当然，目前只是**剥离类型**（type stripping），**不支持 `enum`、`namespace`、装饰器等需要转换的语法**。但对绝大多数纯类型标注的代码，这就够了。
### 3.6 权限模型（实验性）
```bash
# 限制脚本只能读 /tmp，禁用网络
node --permission \
     --allow-fs-read=/tmp \
     --disallow-net \
     app.js
```
**注意**：官方文档明确说这套模型**不防御恶意代码**，它只是一个"安全带"，防止可信代码意外破坏系统。相比 Deno 的权限模型还有相当差距。
---
## 四、竞品对比：Bun / Deno 到底超越 Node 了吗？
这是开发者最关心的问题。以下基于 RepoFlow 2026 年 2 月的实测数据（Node 25.6.1 vs Deno 2.6.9 vs Bun 1.3.9，M4 MacBook）：
| 维度 | Node.js | Bun | Deno |
|---|---|---|---|
| 发布年份 | 2009 | 2022 | 2020 |
| 作者 | Ryan Dahl → OpenJS 基金会 | Jarred Sumner | Ryan Dahl |
| 底座引擎 | V8（Google） | JavaScriptCore（WebKit） | V8 |
| 语言实现 | C++ | Zig | Rust |
| 微基准胜出项 | **1/14** | **8/14** | **5/14** |
| 强项 | SHA-256 等加密、生态 | HTTP 吞吐、JSON 大文件 | 异步调度、算术循环 |
| 后端使用率（2025） | **90%** | 21% | 11% |
| npm 包兼容性 | 原生 | 97%（node:http/fs/stream） | 兼容但有差异 |
| 原生 TS | ✅（v24 稳定） | ✅ | ✅ |
| 权限模型 | 实验性（opt-in） | ❌ | ✅（默认开启） |
| 企业支持 | Fastify、NestJS、Datadog、OpenTelemetry **全部原生支持** | **多数不官方支持** | 部分支持 |
| LTS 支持 | 30 个月 | 无 LTS | 6 个月 |
数据来源：RepoFlow 基准测试、State of JS 2025、Strapi 2026 迁移指南
**几个残酷真相**：
1. **Bun 的"4 倍性能"是营销数据**。在 vendor 自己的 benchmark 上 Bun 确实能跑到 48,243 req/s，但 2025 年的一项独立同行评审研究测出来 Bun 27,500 req/s、Node 28,200 req/s——**基本持平**。
2. **Fastify、NestJS、Datadog、New Relic、OpenTelemetry 都没有官方支持 Bun**。如果你的技术栈依赖这些核心组件，Bun 仍然不是选项。
3. **Deno 是 Ryan Dahl 的"忏悔之作"**，他在 2018 年的演讲《Node.js 令我后悔的 10 件事》里反思了 Node 的设计错误。Deno 解决了安全默认、原生 TS、Web API 对齐，但生态积累远不及 Node。
**一句话总结竞品格局**：**Bun 是工具链革命（快装快跑），Deno 是理念革命（安全 + 标准），Node.js 是生态革命**。工具链和理念可以慢慢追，但 20 万个 npm 包、无数教程、无数 Stack Overflow 答案积累起来的生态壁垒，短期内无法撼动。
---
## 五、目标人群与收益：谁最该研究这个仓库？
不同人群从这个仓库里"淘金"的方式完全不同：
### 🟢 前端工程师 / 全栈小白
**收益**：理解 Node.js 的事件循环后，你才能真正理解 `async/await`、`Promise`、微任务队列在浏览器里是怎么工作的——**这套心智模型两端通用**。配套阅读 `nodejs/learn` 仓库的 Event Loop 教程，是前端往全栈转型最平缓的路径。
### 🟡 后端工程师 / 架构师
**收益**：读懂 `libuv` 的线程池机制、`cluster` / `worker_threads` 的区别，你会知道：**CPU 密集用 worker_threads，多核扩展用 cluster，隔离/安全用 child_process**——这是把 Node 服务从"勉强能跑"推向"工业级"的关键。
### 🔵 开源贡献者 / 想进大厂的人
**收益**：nodejs/node 是全球最大、治理最规范的开源项目之一。从 `doc/contributing/first-contributions.md` 入手，有专门的 `good first issue` 标签。**给 Node.js 提交过 PR**，在简历上的分量远超 100 个个人项目。
### 🟣 DevOps / SRE
**收益**：关注仓库的 `SECURITY.md` 和安全 release（例如 2025 年 10 月的 v22.22.0 一次性修了 6 个 CVE）。订阅 security 告知邮件，比任何监控告警都更早发现风险。
---
## 六、局限与不足：客观地说，它并不完美
### ❌ 1. CPU 密集场景先天劣势
事件循环的本质是**一个线程来回切换**。一旦有 CPU 密集任务（图像压缩、大数据计算、密码哈希），整个进程都会被卡住。解决办法是 `worker_threads` 或 `cluster`，但都引入了额外的通信开销和心智负担——**这不是 Node 的强项**。
### ❌ 2. 宏大代码库的演进困境
49,000+ 提交、20 年累积，很多设计决策（如 `require` 的 CommonJS 规范、回调风格、Error first 模式）已经无法回头。**ESM（import/export）至今仍在与 CJS 缠斗**，第三方包双规范兼容是每个库作者都要踩的坑。
### ❌ 3. 安全模型落后于时代
对比 Deno 默认拒绝文件/网络访问，Node 的 `--permission` 是 opt-in 实验、且明确不防恶意代码。**供应链攻击**（npm 包恶意依赖）在 Node 生态是个比 Deno 严重得多的问题。
### ❌ 4. 微基准已落后 Bun
在 HTTP 吞吐、JSON 解析等纯性能维度，**Bun 确实领先**。如果你的服务是"极高 QPS + 极简逻辑"（如网关代理、静态资源服务），换 Bun 可能真的能省下不少机器。
### ❌ 5. N-API / Native Addon 的维护成本
如果你的项目有 C++ 插件（如 `sharp`、`bcrypt`），升级 Node 大版本时经常要等 addon 作者跟进——**这是 Node 生态独有的"版本焦虑"**。
---
## 七、结语与行动建议：终极评判
如果给 Node.js 打个分，我会这样评：
| 维度 | 评分（10 分制） | 评语 |
|---|---|---|
| 生态成熟度 | **10** | 210 万 npm 包，无出其右 |
| 文档质量 | **9.5** | nodejs.org/api 是业界标杆 |
| 社区活跃度 | **9** | TSC 治理透明， Contributors 数千 |
| 性能 | **7** | 微基准落后，综合依然能打 |
| 创新速度 | **6.5** | 原生 TS 是亮点，但整体偏保守 |
| 学习曲线 | **8** | 入门极简，精通很难 |
| **综合** | **8.5** | **生产环境的默认答案** |
### 三条具体的行动建议
1. **生产环境**：立刻把 Node.js 升到 **24 LTS（Krypton）**，支持到 2028 年 4 月，原生 TypeScript 稳定、内置测试运行器可用、安全默认加强。
2. **学习路径**：读完 [nodejs.org/learn](https://nodejs.org/learn) 的 Event Loop 章节 → 读完 `lib/` 里 `events.js` 和 `stream.js` 的源码 → 尝试用 `node:test` 替换你项目里的 Jest。**这三步走完，你对 Node 的理解会超过 80% 的从业者**。
3. **关注方向**：`node --watch`、`node:test`、原生 TS、`WebSocket` 客户端、`fetch` 全局——这些**不需要任何依赖**就能用的能力，正在悄悄把"Node 项目需要一堆 npm 包"这个刻板印象拆掉。
### 最后的定调
> **Node.js 不是一个"框架"，它是一整个时代的操作系统级基础设施。**
它可能不再是技术上最激进的选择，也不再是性能上最耀眼的明星。但它仍然是——**当你不知道选什么的时候，选它就一定不会错**的那个存在。对于全球超过 2000 万开发者而言，`nodejs/node` 这个仓库不只是一个开源项目，更是一种工程文化的标杆：**如何在 17 年里持续维护一个千万级依赖的项目，同时保持开源、中立、开放治理**——这本身就是一门值得所有工程师研读的学问。
**建议收藏该仓库**，并开启 Watch（关注 Releases Only 即可），你将第一时间收到每一条安全公告和 LTS 版本通知——对一个支撑你生产环境的地基工程来说，这是最低成本的"风险对冲"。
