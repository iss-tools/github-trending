# Leonxlnx/taste-skill

[GitHub URL](https://github.com/Leonxlnx/taste-skill)


## Taste-Skill 深度评测：把设计师审美塞进 AI 编程助手的 9 万 Star 开源神器

> 一套让 Claude Code、Codex、Cursor 等 AI 编程工具告别'一眼假模板页'的开源 Agent Skill 合集，用可执行的规则和脚本把审美变成工程。

- **Tags**: Claude Code, Agent Skill, UI 设计, 反 AI 味, 开源工具
- **Category**: 开源项目, AI 编程, 前端开发

## Details

# Taste-Skill 深度评测：把"设计师审美"塞进 AI 编程助手的开源神器
## 一句话总结
**Taste-Skill 是一套面向 Claude Code / Codex / Cursor 等 AI 编程助手的开源 Agent Skill 合集，用一份 28KB 的 SKILL.md 加四个可执行脚本，硬性约束 AI 在做前端时"别再生成那种一眼假模板页"，是目前这个赛道最系统、最可验证的方案之一。** 截至 2026 年 10 月，仓库已突破 9.4 万 Star，并在 10 月 18 日发布 v2.1.0，开始把版图从落地页扩展到仪表盘和应用界面。
---
## 背景与痛点：为什么"AI 生成的页面"总是长一个样
如果你让任何一家主流模型（GPT、Claude、Gemini）裸跑写一个落地页，几乎百分之百会得到同一张脸：居中标题、紫色到蓝色渐变 Hero、三个等宽图标卡片、"Trusted by 10,000+ teams"、底部四栏 Footer。这套视觉组合在国内被戏称为"AI 味"，在英文圈则有一个更刻薄的词——**AI Slop（AI 饲料）**。
**这并不是模型"笨"，而是概率分布的必然结果。** 一个模型在生成 UI 时，本质上是在预测"下一个最有可能出现的 token"，而训练数据里最常见的就是这种模板页。它满足了你 prompt 里所有字面要求——有 hero、有 features、有 CTA——却没有做出任何一个"决定"。一位开发者评论说得更狠：AI 编程助手"逻辑很强、审美为盲，它们优化的是完成度，不是工艺"。
传统的应对方式有两类：要么给一坨零散的 prompt（"别用渐变""布局要有创意"），要么换一个更大的模型。前者效果随 session 随机波动，后者贵且治标不治本。
**真正的破局点是 Anthropic 在 2025 年 12 月把 Agent Skills 推成了跨平台开放标准**：一个 skill 就是一个文件夹，里面有 `SKILL.md` 描述文件 + 可选的脚本、参考资料和资产，Claude Code、Codex、Gemini CLI、Cursor 等 20+ 平台都能识别。Taste-Skill 正是踩着这个标准，把"前端审美"从模型权重里抽出来，封装成可版本管理、可 fork、可迁移的纯文本资产。专业媒体的评价很精准：这波 trending 项目的共同信号是——**"团队正在把'审美的判断力'变成可运行的基础设施"**。
---
## 它是什么？13 个技能组成的"前端武器库"
### 仓库身份速览
| 维度 | 信息 |
| --- | --- |
| 作者 | Leon Lin（GitHub: Leonxlnx，活跃于 X，同时在做一款叫 TasteCode 的本地桌面工作区，定位是 Codex / Claude Code / Grok 的设计智能体） |
| 首次开源 | 2026 年 3 月（从单文件拆分为 taste / output / redesign 三个技能） |
| 当前版本 | v2.1.0（2026 年 10 月 18 日） |
| Star | 约 94.4k（部分第三方站统计到 98k+） |
| License | MIT |
| 安装 | `npx skills add https://github.com/Leonxlnx/taste-skill` |
| 运行时依赖 | Node 22+、Chrome / Edge / Chromium，无任何 API Key |
### 13 个技能的地图
它不是"一个大 prompt"，而是 11 个代码技能 + 3 个图像生成技能的组合拳，每个技能只干一件事：****
| 技能名 | Install name | 适用场景 |
| --- | --- | --- |
| taste-skill（默认 v2） | `design-taste-frontend` | 全能型默认，做营销页、作品集、产品页 |
| taste-skill-v2-experimental | `…-v2-experimental` | 旧版旋钮驱动的实验版 |
| taste-skill-v1 | `…-v1` | 原始版本，已冻结 |
| gpt-tasteskill | `gpt-taste` | 针对 GPT / Codex 的更严格变体 |
| image-to-code-skill | `image-to-code` | 先生成设计稿 → 分析 → 再实现代码 |
| redesign-skill | `redesign-existing-projects` | 给已有项目做 UI 审计 + 改造 |
| soft-skill | `high-end-visual-design` | 高端克制风，柔和对比、留白、spring 动画 |
| output-skill | `full-output-enforcement` | 强制 AI 不输出半成品、不留 placeholder |
| minimalist-skill | `minimalist-ui` | Notion / Linear 式编辑器风格 |
| brutalist-skill | `industrial-brutalist-ui` | 瑞士字体、硬核工业风 |
| stitch-skill | `stitch-design-taste` | 兼容 Google Stitch，可导出 DESIGN.md |
| imagegen-frontend-web / mobile / brandkit | 同名 | 只产图不产码，喂给 ChatGPT Images 用 |
### 核心机制：三步把"审美"变成可执行的工程
打个比方：如果说裸 prompt 是"给厨子递一张写有'好吃'的纸条"，那 Taste-Skill 就是**给厨子递一本菜单 + 一套油温计 + 一面让他随时能看到菜品的镜子**。它的精妙之处，是把审美拆成了"发牌—查表—照镜"三个可验证环节。
#### ① 发牌机：从 247 个获奖站点中抽取"设计方向"
v2 的方法论建立在一项对 **247 个精选画廊站点**（One Page Love、Awwwards Sites of the Day）的研究之上。作者把这批站点的共性拆解成一个资产库：**20 个方向 × 48 种 Hero × 172 种 Section 布局 × 44 套字体系统 × 56 套配色**。
为什么"发牌"而不是"让 AI 自己想"？因为模型自己想方向时，几乎每次都选"类别均值"。`scripts/draw.mjs` 脚本会随机从库里抽 3 个方向给你挑，**这相当于把"随机性"从模型的概率分布里独立出来**，逼 agent 走出舒适区。每次发牌还带一个 `--seed`，可以复盘和复现。
```bash
node <skill>/scripts/draw.mjs --sector saas --brief "为一家温州独立精酿酒吧做官网" \
  --sections features,menu,location,contact --tone bold --options 3
```
#### ② "从主体本身找创意"：竞品测试法
SKILL.md 里最精彩的一段不是任何 CSS 规则，而是**一个把"创意"操作化的方法论**——作者要求 agent 在动手前，先给主体列一份"8 到 12 项独占资产"的清单：它的名字由来、它所在的街道和街砖、它的独门约束（"每月只出一批""冬季闭店"）、它使用的材料、它的仪式（"烤箱五点点火""末班船七点启航"）、它世界里的印刷品（票根、价签、菜单）。
然后填一句话模板：**"在这个页面上，[属于主体独有的某物] 变成 [方向要求的某个设计装置]"**。最后做"竞品测试"——把离你最近的竞品名字塞进这句话，如果句子依然成立，说明你的创意还属于"品类"，而不属于"这家"。Blind 测试显示，每张赢的页面都来自清单上的一项；输的页面都有好看的构图，但创意只停留在品类层面。
这套思路和教创意写作用的"细节写作"完全是同构的，但把它变成了 AI 可执行的检查清单——这是整份 skill 里最值钱的部分。
#### ③ 14 条 House Rules + 真实浏览器检查器：审美也可以 lint
最硬核的发明是 `scripts/inspect.mjs`。它启动一个真实的 Chrome，在 **1440 / 768 / 390** 三档宽度下打开页面，测量：标题行数、字号、实际加载的字体、颜色、分割线、阴影、渐变、对比度、溢出，然后输出 FAIL / WARN 报告和截图。
被测量的 14 条"反 Slop 法则"包括：
| 禁止项 | 替代方案 |
| --- | --- |
| 渐变背景 / 渐变按钮 / 渐变文字 | 平色，或真照片 |
| 静止元素带阴影、发光 | 用色阶变化或实色形状 |
| 01 / 02 / 03 编号、Eyebrow 小标签 | 用位置、字号、语序表达顺序 |
| Monospace 字体做装饰 | 主字体 + tabular figures |
| 细分割线、1px 描边框 | 留白 / 背景色阶 / 尺寸跳变 |
| 奶油色底 + 赭石色 / 紫色 / 靛蓝（所谓"assistant palette"） | 严格按发牌结果 |
| 玻璃拟态、backdrop-blur 面板、浮动 pill 导航 | 一条普通导航栏：字标 + 几个链接 + 一个按钮 |
| Emoji、渐变 blob、灰色条假仪表盘 | 真图片 / 真界面片段 / 留白 |
| 图标堆叠的 feature 卡片 | 按 Section 蓝图走 |
| 标题超过两行 | 删字 → 加宽测量 → 最后才缩字号 |
**这是这件事最关键的一步：把"我觉得这个页面很 AI"这种主观感受，转换成十几条可机测的几何与色彩约束。** 一旦规则可测，就能进 CI，就能进 PR Gate，就能拒绝 merge——审美终于从"玄学"变成了"工程"。
#### ④ 找图脚本：从大都会博物馆、维基共享给你找真图
AI 不爱放图的根本原因是"找图麻烦"，于是页面只剩灰底和色块。`scripts/assets.mjs` 直接封装了 **Openverse、Wikimedia Commons、Art Institute of Chicago、Met** 四个开放图库的搜索，只返回允许商用的素材，下载后自动记 license 并生成 credits 列表。
SKILL.md 明确规定页面最少 4 张真实图片（建议 6–12 张），还强制加一个动态图（muted loop 或慢缩放）作为"活的元素"——**"AI 跳过找图是因为找图费事；没图的页面直接 FAIL"**，这是 SKILL.md 里写得最锋利的一句原话。
#### ⑤ 完整的十步工作流
整体流程是一段自洽的闭环：**读 brief → 清单主体 → 写"论证" → 发牌方向 → 提炼创意 → 写 copy deck → 静态搭建 → 跑 lint/inspect → 截图自审（最多三轮）→ 加动效层 → 输出报告**。每一步都有对应的 reference 文档（type.md / colour.md / layout.md / copy.md / imagery.md / motion.md / critique.md）撑腰，整个 skill 文件夹 SKILL.md 本体 414 行、28.6KB，加上参考资料可能塞进去上万 token。
---
## 真实使用示例：一行命令就能装
### 通用安装（Claude Code / Codex / Cursor / Gemini CLI）
```bash
# 一次装齐 13 个
npx skills add https://github.com/Leonxlnx/taste-skill
# 只装 v2 默认技能
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
# Codex 专用
npx skills add Leonxlnx/taste-skill -a codex
```
### Claude Code 插件方式（推荐，带命名空间避免冲突）
在 Claude Code 内执行：
```
/plugin marketplace add Leonxlnx/taste-skill
/plugin install taste-skill@taste-skill
```
之后所有技能都挂在 `taste-skill:` 命名空间下，比如 `/taste-skill:imagegen-frontend-web`，不会跟你已有的其他 skill 撞名。
### 一个完整 prompt 示例
装好后，你只需要像平常一样描述需求，agent 会自动在合适时机加载 skill：
> 帮我给一家位于大理的独立胶片冲扫工作室做一个单页官网，要看起来"自己动手做的"，不要 SaaS 模板感。
Agent 会自动触发 taste-skill 的整个 pipeline：先盘"独占资产"（工作室的暗房红灯、显影罐序列、大理的午后光线、店主写的冲扫参数卡），然后发牌方向，写出创意句"**显影罐的旋转变成 hero 区的滚动装置**"，去找真实的大理街景与胶片暗房的历史照片（带 credits），写完 copy deck 再写代码，最后跑 inspect 直到没有 FAIL。你收到的不是一个"看起来还行"的页面，而是一份带方向说明、创意依据、图片来源和自审截图的完整交付包。
### 用 ChatGPT / Codex 做图
把 `imagegen-frontend-web` 的 SKILL.md 整个粘贴到 ChatGPT 对话里，说"按 skill 生成 3 张网站 hero 设计稿"，再把图喂给 Cursor 或 Claude Code 用 `image-to-code-skill` 实现——**这是"图像先行"工作流的完整闭环**。
---
## 目标人群与真实收益
| 你是谁 | 能拿到什么 |
| --- | --- |
| **独立开发者 / 独立创业者** | 不请设计师也能拿到"非模板脸"的官网，省下 1–3 万的设计费 |
| **AI 编程工具重度用户** | 让 Claude Code / Codex / Cursor 输出从"AI 味"跳到"杂志级"，一次安装全局生效 |
| **前端工程师** | 把 taste-skill 当成设计 lint，把主观审美变成可机测的工程约束，进 CI 自动卡 PR |
| **自由职业设计师** | 把自己的设计规则 fork 进 skill 库，相当于把"品味"产品化交付给客户 |
| **想做个人品牌 / 作品集的人** | `soft-skill` / `minimalist-skill` 直接生成 Linear、Notion 同款气质 |
**它最实在的价值不是"做出获奖页"，而是把"AI 做得很丑"这件事，从你每天抱怨的问题变成一个不存在的问题。**
---
## 竞品对比：Taste-Skill 在赛道里的位置
| 项目 | 核心思路 | Star | 与 Taste-Skill 的差异 |
| --- | --- | --- | --- |
| **Leonxlnx/taste-skill** | 发牌 + 真浏览器 lint + 真图源 | ~94k | 系统化、可验证、有 13 个分支变体 |
| **Nutlope/hallmark**（usehallmark.com） | 21 种宏观结构 + 22 主题 + 65 道 slop gate + study 提取设计 DNA | ~36.8k | 更重、更耗 token，主要面向落地页，不能进 dashboard |
| **anthropics/skills**（官方） | Anthropic 官方技能库，含通用设计指导 | — | 通用性强但更保守，没有反 slop 的"狠劲" |
| **EveryInc/compound-engineering-plugin** | 把 brainstorm/plan/review 等工程流程做成 skill | — | 不是 UI 专用，是工程方法论 |
| **hardikpandya/stop-slop** | 针对文字（散文）的反 slop 评分 | — | 解决另一半问题：文案层面的 AI 腔 |
| **裸 prompt / DESIGN.md** | 自定义一份 markdown 给 agent | — | 没有 lint，没有脚本，没有可复现的发牌机制 |
可以这么理解赛道格局：**Hallmark 是"给 AI 一套主题让它挑"，Taste-Skill 是"教 AI 学会设计师思考方式再让它动手"。** 前者立竿见影，后者上限更高、但更依赖宿主模型的执行力。
至于这条赛道本身的意义，专业媒体的判断是："它不是另一个 prompt 库，而是把'审查'这件事提前、写下来、再复用。这正是 AI agent 时代的 lint 之种。"
---
## 局限与不足：别神化它
说实话，这个项目虽然质量很高，但它有几个真实的短板，使用前值得心里有数。
**第一，规则的"品味"本身就是有争议的。** 禁渐变、禁玻璃拟态、禁奶油赭石、禁紫色——这些规则确实精准打击了 AI Slop，但**换个角度说，它们其实只是在反对"当前这一波 AI 默认风格"**。当全世界都在用 taste-skill 时，它自己又会变成新的"AI 味"。Hallmark 的评测作者也点到了这一点："它极富主见的审美本身可能变成一种新的 AI slop。"
**第二，Token 开销不小。** 默认 skill 的 SKILL.md 就有 28.6KB，加上 7 份 reference 文档，每次触发都是一大段上下文注入。对长会话或限额订阅（Claude Pro）来说，跑一次完整的十步流程可能相当烧额度。Daily.dev 对 Hallmark 的同类批评在这里同样适用。
**第三，强依赖宿主模型的执行力。** 官方 FAQ 也承认，**skill 本质是 prompt，效果取决于宿主模型**——GPT-5 / Claude Opus 能稳定跟进整个 checklist，小模型（Haiku、4o-mini 级别）会大面积跳步。
**第四，安装是全局的，没有 per-project 开关。** 一旦装进 Codex / Claude Code，本会话所有 prompt 都被它影响。如果你想只为某个项目启用，需要按项目目录做安装/卸载协调。
**第五，需要 Node 22+ 和 Chrome。** 检查器要起真实浏览器，意味着在某些受限环境（公司统一镜像、容器）里部署会麻烦一点；脚本会临时起一个本地 HTTP server 服务静态文件。
**第六，v2 主战场是营销页，不是产品内界面。** v2 的 SKILL.md 顶部明确写着 **"Not for dashboards or app screens"**，这是它和 Hallmark 一样的通病。好在这一条在 10 月的 v2.1 里已经补上——"app screen"有了自己的 deal 路径，但成熟度还需观察。
**第七，图片检索有环境依赖。** `assets.mjs` 需要访问 Openverse、Wikimedia、Art Institute、Met 的公开接口，在国内网络环境下需要代理；它不内置任何 image-gen 调用，所以"自己画"那条路还是要靠你自己接上图像生成工具。
---
## 结语与行动建议
**Taste-Skill 是 2026 年 Agent Skill 生态里，目前把"前端审美工程化"做得最彻底、最具可复用性的开源项目。** 它不是把一个很棒的 prompt 塞给你，而是把"发牌—找创意—查表—照镜—修图"的完整设计工作流，压成了一组可执行、可版本管理、可跨 agent 迁移的文本资产。它证明了"审美"这件事，至少部分可以变成 lint 和 CI。
给三类读者的具体行动建议：
- **想立刻试一下**：先在 Claude Code 里跑 `/plugin marketplace add Leonxlnx/taste-skill` + `/plugin install taste-skill@taste-skill`，然后丢一个真实的小项目（比如给朋友的小店做主页）进去，全程观察 agent 的十步工作流——这一趟下来的收获比看十篇教程都多。
- **想深入 fork**：从 `skills/taste-skill/references/` 入手，重点读 `critique.md` 和 `copy.md`，这两份是把"主观判断"翻译成"可检查条目"的范本，比 SKILL.md 主体还值得学。
- **想搞自己的 skill**：把这个仓库的目录结构（SKILL.md + scripts + references + assets）当成模板，比 abstract 论文式的 agent design guide 实用得多。它对 Skill 设计的最大贡献是——**"一份 skill 里最好同时有'软指令'和'硬检查'，光靠 markdown 描述规则，AI 永远会跳步"**。
它有边界、有 token 代价、有审美取向的争议，但作为开源项目，它把一个模糊问题（AI 生成的页面很丑）拆解到了可安装、可执行、可复现的层面——这件事本身就值得所有做 AI 工具的人读一遍源码。
