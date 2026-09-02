# cloudflare/computer

[GitHub URL](https://github.com/cloudflare/computer)


## Cloudflare Computer 深度评测：给 AI Agent 的虚拟电脑

> Cloudflare 推出的开源项目，给 AI Agent 配了台“虚拟电脑”，文件与计算分离，大幅降低运行成本。

- **Tags**: Cloudflare, AI Agent, 开源项目, Serverless, DevOps
- **Category**: 开发工具, AI 编程, 云计算

## Details

# Cloudflare Computer（cloudflare/computer）深度评测与上手指南
## 一句话总结
Cloudflare Computer 给“AI Agent 一个虚拟电脑”：用一个持久化（SQLite 背后的）虚拟文件系统作为“唯一真相源”，并在同一 Workspace 下可插拔地调用“快速 Worker Shell、Worker JS 模块、Linux 容器”三种后端，实现小任务走轻量隔离、重任务按需抬升到容器，目标是把 Agent 的计算成本大幅压下来、并把“会话级的工作目录”做成一等公民。
---
## 背景与痛点：为什么不用“一个容器到底”
近一两年，做代码 Agent / 自动化流水线的常见做法是：给每个用户（或每个会话）起一个沙盒容器/微虚拟机，里面挂个文件系统，让模型读文件、改文件、跑测试、打包发布。这套模式简单直观，但明显“重”：每一步微小操作都要为容器的生命周期买单；一旦并发上规模，算力账单会爆炸。Cloudflare 官方博客直言：全球没有足够的 CPU/GPU 给“每个用户的 Agent”都长驻一个容器。
> 直观比喻：  
> - “容器到底”就像给每个工人配一间完整车间：哪怕只是拧一颗螺丝，也得把整间车间通电、开机。  
> - Cloudflare Computer 想做的是：车间是共享/按需租用的，但每个人有一个私有的“工具车（文件系统 + 作业本）”；拧螺丝时，只在工位上用一把电螺丝刀；真要用机床、焊机，再临时调度。
因此，核心痛点是：
- 算力成本与扩展性：为每个 Agent 长期持有一个容器，成本与并发瓶颈显而易见。
- 状态与执行被绑死：会话里只要有一两步需要 Linux，整个会话就被迫为容器付费。
- 安全与审计：容器与文件系统的变更难以细粒度管控，审计链条不清晰。
Cloudflare Computer 试图把“文件”和“计算”拆开：把文件系统持久化到 Durable Object（SQLite），执行则是可插拔的后端。这既保留了“电脑”的语义（有目录、有命令、有工具），又大幅降低默认开销。
---
## 核心亮点与功能剖析
### 1）架构精要：虚拟文件系统 + 可插拔执行后端
- Durable Object（DO）作为“会话/用户”的稳定身份与协调点，其内嵌 SQLite 是权威文件系统（VFS）。  
- 三个内置后端通过统一的 workspace.runtime.exec(source, { backend }) 入口路由：  
  - Container 后端：通过 FUSE 把 Workspace 挂载到容器内，由 computerd 守护进程负责同步；完整 Linux userland、真实二进制与网络。  
  - Worker Shell（just-bash）：在 Dynamic Worker 里用 JS 实现的 Bash-like 环境，直接对 DO 的权威文件系统执行，不搞第二副本与同步。  
  - Worker JavaScript：执行 ECMAScript 模块，有结构化输入/输出、workspace-backed 的 node:fs/promises、受限的 ws:git / ws:artifacts 等“可信模块”，网络默认关。
> 比喻：  
> - 文件系统是“账本”（真相）。  
> - Worker Shell/JS 就像“记账员在账本上直接写”，不需要再把账本复印。  
> - Container 就像“会计把账本同步到自己的 Excel 里干重活，然后再把改完的部分抄回来”。
### 2）“给 Agent 的一套电脑”：工具箱与审计
- 工具层面：@cloudflare/computer/tools 提供 AI SDK 风格的工具（read / write / edit / ls / grep / find / exec 等），可直接挂在 Vercel AI SDK 或各类 agent 框架的 getTools() 上；工具调用会被记录，形成清晰的“操作审计链路”。  
- 审计与权限：所有操作可被看门/观测/记录；你可以限定 agent 能不能执行、能访问哪些路径与后端，还能把 exec 限定在特定后端，实现细粒度的“能力边界”。
### 3）统一但灵活的运行时接口
- exec 的返回值既包含 result()（拿到 stdout/stderr/exitCode），又是一个 ReadableStream，适合作为 SSE 推送实时输出；适合构建“跑测试 / 跑构建”的实时日志体验。  
- 后端懒加载：Workspace 注册多个后端但并不会立刻初始化，等到真正使用时才按需拉起；降低常驻资源与冷启动开销。
### 4）面向 Agent 的具体能力
- 虚拟文件系统（workspace.fs）与 node:fs/promises 近似的 API，同时天然持久、跨 DO 重启不丢数据；大小约 10 GB 级别（与 DO 共享限额），适合“项目级/会话级工作集”，而非完整 monorepo。  
- Git/R2/Artifacts 等集成：支持 ws:git、R2 只读挂载、Artifacts 发布等；例子包括自动生成 Worker 工程并推送到 Artifacts，或把生成的图片上传到 R2 并返回可分享链接。
### 5）性能特点：元数据快，大 I/O 承压
- 官方基准：computerd 的 FUSE 挂载在“元数据密集”场景快于真实磁盘，但在大顺序读写场景则慢于原生磁盘。docs/19_performance.md 包含 fs-bench 数据与 npm install 对比，并有复现步骤。  
- Worker Shell/JS 不经 FUSE，直接在 DO 上操作，因此小文件/文本操作反而更快；大文件/大型 node_modules 安装更适合放容器“一次性干完”。
---
## 上手门槛与部署体验（开发者视角）
### 1）安装与最小可用 Demo（仅需文件系统，无执行）
- 安装：npm install @cloudflare/computer；Worker 需要 nodejs_compat 兼容性标记。  
- 最小例子（仅文件系统，无后端）：
```ts
import { withWorkspace, getWorkspace } from "@cloudflare/computer";
import { DurableObject } from "cloudflare:workers";
export class Agent extends withWorkspace(
  class extends DurableObject<Env> {},
  (self) => ({ storage: self.ctx.storage }),
) {}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const id = env.Agent.idFromName("user-123");
    using ws = await getWorkspace(env.Agent.get(id));
    await ws.fs.writeFile("/notes.md", "- [ ] ship it\n");
    const notes = await ws.fs.readFile("/notes.md", "utf8");
    return new Response(notes);
  },
} satisfies ExportedHandler<Env>;
```
- 说明：withWorkspace 帮你把“文件系统能力”注入到 Durable Object；getWorkspace 让你从 Worker 侧拿到该 DO 的 Workspace 句柄并操作文件；文件是持久化的。
### 2）添加执行后端（Worker Shell 为例）
- 配置（需 experimental 标记 + Worker Loader 绑定）：
```ts
import { withWorkspace, getWorkspace } from "@cloudflare/computer";
import { WorkerShellBackend } from "@cloudflare/computer/backends/worker-shell";
import curlModules from "@cloudflare/computer/shell/curl";
import { DurableObject } from "cloudflare:workers";
export class Agent extends withWorkspace(
  class extends DurableObject<Env> {},
  (self) => ({
    storage: self.ctx.storage,
    backends: [
      new WorkerShellBackend({
        loader: self.env.LOADER,
        workspace: { binding: "Agent", id: self.ctx.id.toString() },
        ctx: self.ctx,
        commands: [curlModules],
      }),
    ],
  }),
) {}
```
- 执行示例：
```ts
using ws = await getWorkspace(env.Agent.get(id));
await ws.fs.writeFile("/hello.txt", "world");
using run = await ws.runtime.exec("cat /hello.txt");
const { stdout, exitCode } = await run.result();
```
- Tips：Shell 按功能分“命令组”（curl / python / jq / yq / sqlite / js-exec / xan / file 等），按需导入即可控制 bundle 大小与能力；curl 使用 isolate 的全局 fetch，不走 undici，且受 Dynamic Worker 的 globalOutbound 限制。
### 3）集成到 AI Agent（示例：用 AI SDK 工具）
- 注册工具并指导 Agent 选择后端：
```ts
import { createAITools } from "@cloudflare/computer/tools";
const tools = createAITools({
  workspace,
  read: { maxBytes: 32 * 1024, maxLines: 800 },
  shell: {
    defaultBackend: "shell",
    backends: {
      shell: { description: "Fast Worker shell with built-in text commands." },
      container: { description: "Full Linux userland in a Cloudflare Container." },
    },
  },
});
```
- 说明：模型会根据后端描述自主选择“shell/container”，实现“快操作走 isolate、重操作才抬升到容器”。
### 4）真实示例： MCP 集成（examples/mcp）
- 部署命令（C3 模板）：
```bash
npm create cloudflare@latest computer-mcp -- --template=cloudflare/computer/examples/mcp
```
- 拉起后设置 MCP_TOKEN（Worker Secret），并在 MCP 客户端配置 HTTP 端点与 Bearer Token。MCP 工具统一到 code，内部由模型决定使用 worker-shell 或 container-shell。示例包含一段由模型自动生成的代码片段（新建 package.json 并运行 npm test）。
### 5）文档与示例的覆盖度
- packages/computer 的 README 提供了从“仅文件系统”到“多后端 + 工具集成”的渐进式 Quick Start，非常适合按需阅读；并附有 Choosing a backend 对照表与 backend 依赖说明。  
- examples 目录涵盖 container / worker-shell / worker-javascript / egress（出站策略）/ mcp / think（与 @cloudflare/think 的聊天 agent 示例）/ tutorial（step-by-step 教程）等；examples/tutorial 会用 pandoc 把 Markdown 转成 PDF，展示“轻量编辑 + 容器重工具”的分工。
### 6）本地开发体验
- 开本地需要 Docker（跑容器后端）与 Wrangler（配置 LOADER 绑定与 experimental 标志）。examples/think 提供了“npm run dev + npm run chat”的双终端开发体验，可以通过 TUI 直接与 Agent 交互。部署只需 wrangler deploy（需要 Workers AI + Worker Loaders 开启）。
---
## 社区活跃度与生命力
- 发布时间：2026 年 8 月初官宣（官方博客 + 开源仓库），目前处于“Early Preview”阶段；官方反复强调 API 不稳定，适合实验/原型，不适合生产。  
- 许可证：仓库为 MIT 开源，便于集成与试验。  
- 贡献模式：通过 Issue / Discussion 收集反馈，不接收未经邀请的 PR；Approved Collaborator 按 COLLABORATORS.md 规范参与。这种模式说明“当前阶段是意见征集 + 统一设计优先”，社区自由提交 PR 会被搁置。长期来看有助于 API 质量与一致性，但短期 PR 参与度会受限。
---
## 目标人群与收益
### 最适合的人群
- 正在 Cloudflare Workers 生态做“代码 Agent / 审查机器人 / 自动化流水线”的团队与个人。  
- 希望把“Agent 工作目录”持久化、可审计，并能按需调用容器但又不愿为每个会话长持容器的人。  
- 需要把 MCP / Claude Code Mode / AI SDK 工具与 Worker/Durable Object 深度绑定的开发者。
### 收益与痛点解决
- 成本与并发：多数小操作只在 Worker isolate 中完成，能显著降低容器 CPU 时长与账单；官方目标是“让小于 10% 的工作才需要抬升到容器”。  
- 开发体验：一套 Workspace API 同时面对多种后端，不需要自己封装“文件分发/同步”；有现成的 AI SDK 工具，省去反复造轮子。  
- 安全与审计：操作全部被记录、可看门；可把 exec 限定到特定后端；结合 DO 的权限与隔离，更适合多租户场景。  
- 可移植性与生态：与 Workers AI、Artifacts、R2 等深度结合；方便把 Agent 产出直接发布为可分享资产（如生成的文档/图/构建产物）。
---
## 竞品/同类对比（简要）
- E2B / other sandbox-as-a-service：通常是一个会话一个独立 Linux 环境，文件与执行绑死；好处是简单、调试容易，成本与并发瓶颈明显。Cloudflare Computer 把“文件”和“执行”拆开，成为“按需路由”的工作区。适合大量小任务夹杂偶尔重任务的场景。  
- Cloudflare Sandbox SDK：同样是容器 + 文件系统 + 终端，但更偏“交互式开发环境”；长期持有一个环境的场景仍有价值；但“多 Agent、高并发”时成本不低。Cloudflare Computer 可被视为“Agent 时代的新抽象”，可与 Sandbox SDK 并存或在未来收敛。
---
## 局限与不足（以及潜在风险）
### 1）Preview 阶段，API 不稳定
- 官方多处标注“PREVIEW ONLY”“NOT suitable for production”；API 与设计会变更，这意味着现在的代码可能需要跟随 breaking changes 迭代；适合原型与试验，生产慎用。
### 2）后端依赖与配置复杂度
- Worker Shell / Worker JavaScript 需要 experimental 标记与 Worker Loader 绑定；容器后端需要 Docker + 构建 computerd + capnweb RPC 连接；对不熟悉 Workers 生态的人门槛不低。
### 3）性能与容量边界
- 每个 Workspace 容量上限约 10 GB（与 DO 共享），不适合“整机开发盘”规模的 monorepo。  
- 容器 FUSE 挂载在“大顺序 I/O”（例如巨型 tarball 解压、大型 node_modules）场景慢于原生磁盘，建议将“重 I/O 放容器、少做频繁跨命令的大文件同步”。
### 4）同步语义与并发写
- 容器后端有“两个副本”的同步问题：执行前推（push）执行后拉（pull），协议为“最后写入胜出（LWW）”；不支持类似协作编辑的分布式语义。强烈建议在同一会话中避免对同一路径的并发写入，以免非预期覆盖。
### 5）资源管理与生命周期
- Workspace 与执行句柄需要手动 dispose，否则易泄漏；文档提到调试支持检测泄漏，但初期需要开发者自行重视。此外，容器后端的同步失败不会自动重试/调度 Alarm，应用方需自行处理重试与错误恢复。
### 6）多租户/安全模型
- 当前示例（如 MCP）多采用单 Bearer Token + 单 DO 模式；若面向多用户，需要自己改造为 OAuth/身份派生 DO 名，并加入每用户的执行/存储限额与权限隔离。这把复杂性留给了用户。
---
## 结语与行动建议
- 终极评判：Cloudflare Computer 是一次“把 Agent 计算抽象为持久 Workspace + 可插拔后端”的大胆实验；非常适合在 Workers 生态中做“轻量 Agent 工作区 + 按需容器”，但明确标注为 Preview，API 会变、生产尚早。  
- 值得做的尝试：  
  - 如果你已经在用 Workers + Workers AI 做代码/文档 Agent，强烈建议用 examples/think 跑通一次“终端聊天 + 工具调用”的闭环，体会“文件与执行解耦”的开发体验。  
  - 如果你的场景主要还是文本/小文件操作（代码审核、配置修改、生成文档），优先使用 Worker Shell / Worker JavaScript 后端，尽量减少容器抬升，以控制成本与延迟。  
  - 做需要 Linux 二进制/包管理的任务时（如 npm/pip install、pandoc 转文档、FFmpeg 处理媒体），再选择容器后端，并留意大 I/O 和同步边界。  
- 暂不建议的场景：  
  - 作为“通用开发机/远程桌面”替代品，或把大型 monorepo 完整丢进去；容量与 FUSE 性能都不太适合。  
  - 刚要上生产、且依赖 API 长期稳定的项目；建议关注其 roadmap 与 API 变更公告，等 Beta/GA 再落地生产。
总体来看，Cloudflare Computer 很可能在未来成为“Cloudflare 上做 Agent 的标准基座之一”；现在投入精力熟悉其抽象与示例，是在“Agent 时代”提前布局的一条务实路径。
