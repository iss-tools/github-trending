# dream-num/univer

[GitHub URL](https://github.com/dream-num/univer)


## Univer 深度评测：把 Excel 装进浏览器的全栈 Office SDK

> Luckysheet 团队打造的下一代开源 Office SDK，让 Web 应用一键嵌入类 Excel/Word/PPT 编辑器。

- **Tags**: Univer, 开源, 在线表格, Office SDK, AI Agent
- **Category**: 开发工具, 开源项目, 办公协作

## Details

# Univer 深度评测：把 Excel 装进浏览器的全栈 Office SDK
> 一句话总结：**Univer 是 Luckysheet 团队倾力打造的下一代开源全栈 Office SDK，它让开发者能在自己的 Web 应用里嵌入一套类 Excel、类 Word、类 PPT 的编辑器，且原生支持 AI Agent 与服务端 Headless 运行——如果你的产品需要"表格 + 协作 + AI"，它几乎是当下开源圈里最值得押注的答案。**
项目地址：[github.com/dream-num/univer](https://github.com/dream-num/univer)｜官方站点：[univer.ai](https://univer.ai)｜开源协议：Apache-2.0
---
## 一、背景与痛点：为什么会有 Univer？
### 1.1 它解决了什么"老大难"问题
在 Univer 出现之前，如果你是一家 SaaS、BI 或协同办公产品的开发者，想让用户在浏览器里编辑一张像样的表格，基本只有三条路，而每一条都不好走：
- **直接对接 Office**：需要接入 Microsoft Graph、WPS 开放平台，部署复杂、UI 不可控、还要绕过上传下载的尴尬流程。
- **用轻量 Data Grid**（如 Handsontable、Jspreadsheet）：本质是"数据网格组件"，长得像 Excel，但公式引擎、协作、文档排版能力都很薄弱，遇到真正的"财务报表"或"周报文档"就露馅了。
- **自己造轮子**：从 Canvas 渲染、公式解析、撤销重做到协作冲突解决，每一步都是技术深水区，中小团队几乎不可能搞定。
Univer 的出现，本质上是把"造一个在线 Office"这件重活打包成了一套 **SDK + 插件生态**，让开发者像拼乐高一样把"类 Excel/Word/PPT"能力塞进自己的产品里。
### 1.2 它的"前世今生"：Luckysheet 的正统续作
理解 Univer，绕不开它的前身 **Luckysheet**——那是一个 2020 年诞生、累计 1.6 万+ Star 的纯 JS 在线表格库。但 Luckysheet 存在明显天花板：纯 JavaScript、无类型、架构耦合、难以扩展到 Docs 和 Slides。
2023 年，原班人马（DreamNum 团队）正式把 Luckysheet **归档（EOL）**，并在官方 Issue 中明确写道："With the release of Univer, Luckysheet is EOL"——这不是放弃，而是一次彻底重写。
Univer 相比 Luckysheet 的根本跃迁在于：
| 维度 | Luckysheet | Univer |
|---|---|---|
| 语言 | JavaScript（无类型） | TypeScript（全链路类型） |
| 覆盖面 | 仅表格 | Sheets + Docs + Slides + Canvas + PDF |
| 运行环境 | 仅浏览器 | 浏览器 + Node.js（同构/Isomorphic） |
| 架构 | 单体 | 微内核 + 插件化 + 依赖注入 |
| AI 支持 | 无 | 原生 MCP + Facade API 面向 Agent |
这也是为什么在 2025 年的官方数据里，Univer 主仓库 + Luckysheet 存量 Star 加起来已突破 **3 万颗**，成为开源 Office 赛道最具生命力的项目之一。
---
## 二、核心亮点与架构剖析：它到底"强"在哪？
### 2.1 亮点一：微内核 + 插件化架构（比喻：乐高积木 vs 整块水泥）
把 Univer 想象成一套**乐高积木**：`@univerjs/core` 是那块中间的"底盘"，其余所有能力——渲染引擎、公式引擎、表格 UI、富文本、协作、导出——都是一块块独立"积木"（插件），通过**依赖注入 + 命令系统**拼装在一起。
这带来的直接好处：
- **按需加载**：不需要 Docs 就不打包 Docs 的代码，Bundle 体积可控。
- **能力可替换**：想自定义"条件格式"逻辑？直接替换那块积木即可，不用 fork 整个项目。
- **官方已沉淀 100+ 插件**，从图表、透视表到数据连接器都有现成方案。
### 2.2 亮点二：Canvas 渲染引擎 + 高性能公式引擎（比喻：GPU 渲染的电影帧）
传统 DOM 表格在数据量大时，页面就像**用纸片搭房子**——一多就塌。Univer 把整个表格"画"在 Canvas 上，相当于**用电影胶片播放**，滚动体验由渲染引擎统一调度。
官方基准测试给出的数字相当激进：
- 滚动 **600 万单元格**仍能保持 **50–60 FPS**；
- **100 万单元格**秒级加载；
- 服务端 Headless 模式下单 sheet 可计算 **200 万+ 公式**；
- 公式引擎内置 **500+ 函数**，支持数组公式、Lambda、命名范围、异步计算。
### 2.3 亮点三：同构架构，一套代码跑浏览器和 Node.js（比喻：油电混动）
这是 Univer 区别于几乎所有竞品的**杀手锏**。所谓"同构"：同一套 Univer SDK 既能挂在 DOM 上渲染成可交互的编辑器，也能在 Node.js 里**无 UI 运行**，只做数据读写和公式计算。
实际意义：
- **服务端报表生成**：定时任务里直接跑 Univer，把数据库数据填进模板，导出 XLSX/DOCX。
- **AI Agent 天然后端**：LLM 可以通过 Facade API 在服务器上"打开"一份表格做读写分析，然后把结果回传给浏览器端渲染——这正是 Univer 官方提出的 **"Office Harness for AI Agents"** 战略。
### 2.4 亮点四：AI 原生设计 + MCP 集成
Univer 是我目前看到的**把 AI 当作一等公民来设计的 Office SDK**，而不是事后打补丁：
- 独立开源了 `dream-num/univer-mcp` 仓库，提供 **MCP（Model Context Protocol）服务端**，让 Claude、Cursor、OpenCode 等 Agent 直接用自然语言驱动 Univer 表格。
- 发布了 **Univer CLI Skill**，开发者可用 `npx skills add dream-num/skills` 给自己的 Agent 装"Office 操作技能包"。
- 在 2025 年 12 月的 **SpreadsheetBench** 排行榜上，Univer 以 **68.86%** 的真实表格任务准确率位列第一，接近人类水平（71.3%），超过 Excel Copilot Agent Mode 的 57.2%。
### 2.5 亮点五：Facade API 的高层抽象
对业务开发者最友好的设计。相比底层那些 plugin、command、mutation 概念，Facade API 提供 `FUniver`、`FWorkbook`、`FRange` 这类**面向对象的高层接口**，读写单元格、设置样式、执行公式几行代码搞定，体验接近 VBA 或 Google Apps Script。
---
## 三、上手体验与代码示例：10 分钟跑通第一个 Demo
### 3.1 两种接入模式，按需选择
Univer 提供两条路径，官方文档把选择逻辑讲得很清楚：
| 模式 | 适用场景 | 心智模型 |
|---|---|---|
| **Preset 模式** | 快速集成、原型验证 | "开箱即用的全家桶" |
| **Plugin 模式** | 深度定制、极致包体积控制 | "自己挑积木" |
### 3.2 五分钟最小可运行示例（Preset 模式，强烈推荐入门）
```bash
pnpm add @univerjs/presets @univerjs/preset-sheets-core
```
```ts
import { createUniver, LocaleType, mergeLocales } from '@univerjs/presets'
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core'
import UniverPresetSheetsCoreEnUS from '@univerjs/preset-sheets-core/locales/en-US'
import '@univerjs/preset-sheets-core/lib/index.css'
const { univerAPI } = createUniver({
  locale: LocaleType.EN_US,
  locales: {
    [LocaleType.EN_US]: mergeLocales(UniverPresetSheetsCoreEnUS),
  },
  presets: [
    UniverSheetsCorePreset({ container: 'app' }),
  ],
})
// 创建一张空工作簿
univerAPI.createWorkbook({})
```
HTML 中放一个容器即可：
```html
<div id="app" style="height: 100vh"></div>
```
跑起来后浏览器里就是一张带完整工具栏、公式栏、右键菜单的 Excel 风格编辑器。
### 3.3 用 Facade API 操作数据（进阶）
```ts
const workbook = univerAPI.getActiveWorkbook()
const sheet = workbook.getActiveSheet()
// 写入 A1
sheet.getRange('A1').setValue('Hello Univer')
// 写公式
sheet.getRange('B1').setFormula('=SUM(A1:A10)')
// 批量读取
const values = sheet.getRange('A1:C10').getValues()
```
这段代码的体验**几乎与 VBA 一致**，对有 Excel 二次开发经验的工程师非常友好。
### 3.4 部署门槛
- **前端嵌入**：支持 React 18/19、Vue、Angular、Next.js、Web Components、原生 JS。
- **浏览器兼容**：Chrome/Edge ≥ 88，Firefox ≥ 90，Safari ≥ 14.1。
- **Node.js Headless**：≥ 18.17 即可运行。
- **协作服务端**：官方提供 Docker Compose 与 Kubernetes/Helm Charts 部署方案。
总体而言，**Preset 模式的上手难度约等于接入 Ant Design**；Plugin 模式则需要理解依赖注入与命令系统，建议先跑通 Preset 再深入。
---
## 四、目标人群与收益：它能帮到你什么？
| 用户画像 | 能解决的痛点 | 典型收益 |
|---|---|---|
| **SaaS 产品开发者** | 客户要在系统里直接编辑 Excel，不想上传下载 | 一周内嵌入类 Excel 编辑器，省去自研成本（自研至少 5 人年） |
| **BI / 报表平台团队** | 需要高性能网格 + 公式 + 透视表 | 600 万单元格 60 FPS，免采购 Handsontable（年省 $899/人） |
| **协同办公 / 知识库产品** | 需要多人文档/表格协作 | OT 算法原生支持，200 人并发编辑开箱即用 |
| **AI 应用开发者** | 让 Agent 操作 Office 文件 | 通过 MCP + Facade API，自然语言驱动表格，实现 Agent-native 工作流 |
| **企业内部工具团队** | 打通业务系统与 Office 文件 | 同构架构，服务端批量生成报表 + 浏览器端可视化编辑 |
| **开源爱好者 / 独立开发者** | 想深度定制自己的编辑器 | 微内核 + 100+ 插件，Apache-2.0 免费商用 |
---
## 五、竞品横向对比：Univer 处在什么位置？
### 5.1 主要对手一览
| 对比项 | **Univer** | **Luckysheet** | **Handsontable** | **Jspreadsheet CE** | **AG Grid** |
|---|---|---|---|---|---|
| 定位 | 全栈 Office SDK | 仅表格（已 EOL） | 数据网格组件 | 轻量表格 | 高性能数据网格 |
| 语言 | TypeScript | JavaScript | JavaScript | JavaScript | JavaScript |
| 公式引擎 | 500+ 函数，同构 | 基础公式 | 基础公式 | 基础公式 | 弱 |
| 文档/幻灯片 | ✅ Docs + Slides | ❌ | ❌ | ❌ | ❌ |
| 实时协作 | ✅ 原生 OT | ❌ | ❌（需自研） | ❌ | ❌ |
| 服务端运行 | ✅ Node.js Headless | ❌ | ❌ | ❌ | ❌（仅前端） |
| AI/MCP 支持 | ✅ 原生 | ❌ | ❌ | ❌ | ❌ |
| 协议 | Apache-2.0 | MIT | 商业双授权 | MIT（Pro 收费） | 商业双授权 |
| 商业授权费 | OSS 免费 / Pro 收费 | 免费 | **$899/人/年起** | 免费 / € 级 Pro | 数千欧/人/年 |
### 5.2 独特竞争力
- **对比 Handsontable**：Handsontable 胜在成熟稳定、文档扎实，但它是"网格组件"不是"Office 套件"，且商业授权不便宜。Univer 的优势是**文档 + 表格 + 幻灯片一体**、原生协作、Node.js Headless、开源协议宽松。
- **对比 Luckysheet**：Univer 是官方钦定的继任者，从语言、架构到生态全面超越，新项目没有理由再选 Luckysheet。
- **对比 AG Grid**：AG Grid 在超大数据网格（100 万行级）和丰富行分组/树形展示上仍是标杆，但它的公式引擎和文档能力很弱，不适合做"报表编辑器"。如果你的场景是"看数据"，选 AG Grid；如果是"编辑 + 计算 + 协作"，选 Univer。
- **对比 WPS WebOffice / Google Sheets API**：这类是**托管服务**而非 SDK，UI、数据、部署都绑死在第三方。Univer 完全自托管、白标、无水印，数据不出域，对金融、医疗、政企客户是刚需。
### 5.3 一句话定位
> **Univer 是目前唯一在"开源、全栈、AI 原生、同构、可自托管"五个维度同时达标的 Office SDK，是这个赛道的独苗，而非"又一个表格库"。**
---
## 六、局限与不足：客观存在的坑
评测必须泼几盆冷水，否则就是软文。
### 6.1 开源版与 Pro 版的"功能分水岭"
这是**最受社区诟病**的一点。官方将以下能力划入 Univer Pro（商业付费）：
- **实时协作**（免费版仅共享光标，最多 3 并发连接、5 份文档）
- **XLSX / DOCX / PPTX 导入导出**（免费版仅 1MB 导入、1 万单元格导出）
- **打印**（免费版仅 3 页）
- **透视表**（免费版每文档限 1 个）
- **图表**（免费版仅折线/柱状/饼/条形 4 种，Pro 版 20+ 种）
- **迷你图、编辑历史、服务端计算** 等
有 Luckysheet 老用户在 GitHub Issue 里直言："Univer 太贵了，想支持奈何实力有限，尤其是导入导出功能需要 Pro 才能用，有没有大佬 fork 一个继续开发？"
**应对策略**：如果你的核心需求只是"在网页上编辑一张结构化表格"，OSS 版够用；如果涉及"用户上传真实 Excel 文件并能完整导出"，要么上 Pro，要么自己接 SheetJS + xlsx 社区版做导入导出桥接。
### 6.2 学习曲线不算平缓
- 微内核 + 依赖注入 + Command/Mutation 三层命令体系，对没有 Angular/NestJS 经验的前端工程师有一定门槛。
- **Plugin 模式**下手写十几行 `registerPlugin` 是家常便饭，Preset 模式虽然简化了，但一旦要定制就要下沉到插件层。
- 架构文档（Architecture TLDRs）虽然齐全，但需要耐心啃。
### 6.3 Docs 和 Slides 的成熟度仍在追赶 Sheets
官方明确说明："Sheets are the most mature product surface today. Docs and Slides continue to evolve"。如果你的需求是 Word 或 PPT 编辑器，建议先做 POC 验证，不要默认三个模块能力等齐。
### 6.4 社区生态仍在爬坡
- 与 Handsontable、AG Grid 十余年沉淀相比，Univer 的第三方教程、StackOverflow 答案、中文深度实战文章还比较稀缺，遇到冷门问题常需要去 Discord 或 GitHub Discussions 直接求助。
- 幸运的是团队响应速度快，Issue 处理和版本迭代频率在开源 Office 类项目里名列前茅。
### 6.5 兼容性小坑
- 依赖 `Intl.Segmenter`，低版本浏览器需自行 polyfill。
- Webpack 4 因不支持 `exports` 字段，接入要额外做 path mapping。
- React 需 ≥ 16.9，推荐 18/19。
---
## 七、社区活跃度与生命力评估
- **GitHub 主仓库**：11.5k+ Star（截至 2025 年底），加上 Luckysheet 的 16.6k Star，团队累计影响力超 3 万。
- **发布节奏**：持续保持月级版本迭代，2025 年 11 月仍保持活跃 commit。
- **商业化路径清晰**：开源核心（Apache-2.0）+ Univer Pro 企业版 + Univer Platform 云服务三层模式，团队有稳定营收反哺 OSS，这是**长期生命力的关键保障**——相比纯用爱发电的项目，Univer 更不容易突然弃坑。
- **生态分支**：官方还维护 `univer-presets`（预置包）、`univer-mcp`（AI 集成）、`univer-sdk-skills`（Agent 技能包）、`obsidian-univer`（Obsidian 插件，可在笔记库里直接编辑 Excel/Word）等多个周边仓库。
---
## 八、结语与行动建议
### 8.1 终极评判
> **Univer 是当下开源 Office 赛道最值得关注的项目，没有之一。** 它完成了从 Luckysheet"网红表格库"到"企业级全栈 Office SDK"的惊险一跃，在架构设计、性能指标、AI 前瞻性上全面超越同类，唯一的代价是**你需要接受"开源核心 + 付费 Pro"的双轨现实**。
### 8.2 选型决策树
- ✅ **闭眼选 Univer**：你的产品要嵌入"可编辑 + 公式 + 协作 + AI"的 Office 体验，且接受 Pro 付费或自行桥接导入导出。
- ⚠️ **谨慎评估**：只需要纯展示型数据网格（选 AG Grid）或超轻量场景（选 x-spreadsheet）。
- ❌ **不建议**：指望 OSS 版本 100% 替代 Excel 文件的导入导出而不付费——这条路上没有免费午餐。
### 8.3 上手三步走
1. **5 分钟 Demo**：用 Preset 模式在 StackBlitz 或本地跑通 [Quick Start](https://docs.univer.ai)，直观感受 UI 与公式。
2. **跑通 MCP**： clone `dream-num/univer-mcp`，用 Claude Desktop 或 Cursor 用自然语言驱动一张表格，体验 Agent-native 工作流。
3. **读架构 TLDRs**：重点啃公式引擎、Web Worker、权限、选区四篇 Architecture Notes，为深度定制做准备。
如果你正踩在"自研在线表格 vs 采购商业组件"的十字路口，Univer 值得花一周时间做一次认真的 POC——**它可能不是最完美的，但它是目前唯一把"开源、全栈、AI、同构、自托管"同时做到位的那个。**
