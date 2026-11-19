# Jakeschincariol/instagram-agent-skill

[GitHub URL](https://github.com/Jakeschincariol/instagram-agent-skill)


## Instagram Agent Skill 深度评测：13 个 Claude Skill 把 IG 内容流水线装进终端

> 13 个开源 Claude Skill 加 5 个本地 Python 评分工具，把 Instagram 内容生产全流程打包进 Claude Code，主打清洗 AI 味。

- **Tags**: Claude Skills, Instagram, 开源项目, 内容营销, AI 写作
- **Category**: AI 编程, 开发工具, 内容创作

## Details

# Instagram Agent Skill 深度评测：13 个 Claude Skill 能不能真的替你"跑"一个 Instagram 账号？
> **一句话总结**：这是一个 MIT 协议、完全本地化的 Claude Skill 套件——13 个 `/ig-*` 斜杠命令把 Instagram 内容生产从选题、钩子、脚本、文案、评论、DM 到复盘整条流水线打包进 Claude Code，配上五个真能跑起来的 Python 评分工具；它的核心价值不是"帮你出爆款"，而是把 AI 生成内容里那些一眼假的"slop"（机器水印）系统地清洗掉，再让你做发布决定。
## 一、背景与痛点：为什么"AI 做小红书/Instagram"这件事一直做不好
如果你用 ChatGPT 或 Claude 直接让"帮我写一个 Instagram Reel 脚本"，得到的多半是这种开头："Hey guys, today I wanted to talk about content strategy..."——恰恰是这个项目 `hookscore.py` 直接打 9.6 分（满 100）标记为 WEAK 的开场，dealbreaker 写得非常刻薄：**"Greeting. Nobody came to the feed to be greeted."**（没人是为了被问候才刷到这里的）
这背后是三个一直没被解决好的痛点：
1. **AI 痕迹肉眼可见**：em dash（—）、zero-width 字符、"delve / leverage / it's not just X, it's Y"这套句法指纹已经成了 IG 评论区公开嘲讽的对象。
2. **数值错位**：Instagram 在 2025 年 12 月 18 日把 hashtag 上限从 30 砍到 5，几乎所有还在教"打满 30 个标签"的教程都是过期信息，而这个项目内置了硬校验。
3. **生成和判断混在一起**：传统 prompt 是"模型自己写自己评"，闭环作弊。这个项目最大的设计哲学就是**"生成归 Claude、评分归本地 Python 脚本、发布决定归人"**，三者物理隔离。
至于为什么是 Claude Skills 这个形态——Anthropic 在 2025 年 12 月 18 日正式把 Agent Skills 开放成跨平台标准，每个 Skill 是一个文件夹（一份 SKILL.md + 可选脚本），Claude 在相关任务出现时按需加载，相当于给新员工塞一本"入职手册"。这个仓库正是踩在这条新赛道上最先把"运营垂类"做成的作品之一。
## 二、作者是谁：一个把"平台账号 Skill"做成产品矩阵的独立开发者
仓库所有者是 **Jake Schincariol**，GitHub 个人签名只有一句"Always vibes, never slop"，4.1k 粉丝。他把自己的仓库列表做成了一个非常清晰的"平台矩阵"：
| 仓库 | 定位 | Stars |
|---|---|---|
| replica-skill | 11 个 Skill，逆向工程任何 App、复刻、修 bug | 9.0k |
| day-trader-skill | 11 个 Skill，日交易：扫图、追新闻、复盘 | 7.2k |
| **instagram-agent-skill** | **本仓库** | **6.1k** |
| youtube-agent-skill | 11 个 Skill，YouTube 频道全流程 | 5.6k |
| linkedin-agent-skill | LinkedIn 内容工厂 | 3.5k |
| founder-skill | Hormozi/Thiel/Jobs 风格董事会测试生意 | 3.3k |
这不是一个蹭热度的"一个项目作者"，而是一个把"用 Claude Skill 重做 X"当作方法论、半年内孵化出 6 个千星仓库的高产独立开发者。这种"矩阵化"打法本身值得警惕——他不可能同时精通日交易、Instagram 运营、YouTube 增长和创业融资，每个 Skill 的领域深度需要单独审视——但也说明他在 Claude Skill 工程化这套范式上极其熟练，本仓库的代码组织和文档质量在他所有作品里属于中上水平。
## 三、核心亮点与功能剖析：13 个命令 + 5 个本地工具的双层架构
### 整体结构
仓库顶层是 `skills/`，下挂 13 个 `ig-*` 文件夹，每个文件夹里至少一份 `SKILL.md`（给 Claude 看的指令），部分还带 Python 脚本（真正在本地跑的代码）。**这种"指令层 + 工具层"的分层设计是这个仓库最值得借鉴的工程模式**：
- **指令层（SKILL.md）**：纯文本，承载领域 know-how（hook 公式库、IG 安全区像素坐标、125 字符折叠逻辑、voice.md 个性化文件读取规则），由 Claude 按需加载。
- **工具层（Python）**：完全离线，不联网、不调用外部 API、不上传任何东西。
- **个性化层（voice.md）**：一份用户填写的"声音档案"，所有 13 个 Skill 都会读它。这是它比一般"prompt 包"更持久化的关键——你不需要每次都重新告诉 Claude"我是谁、我说什么话"。
### 13 个命令速览
| 命令 | 做什么 | 适合频率 |
|---|---|---|
| `/ig-reel` | 一个想法 → Reel：3 个钩子候选（来自 26 种公式）+ 评分 + 口播脚本 + 屏幕文字 + 节拍表 | 高频 |
| `/ig-viral` | 扫垂类里实际在爆的 Reels，按"超出该账号自身中位数"的倍数排序 | 每周 1 次 |
| `/ig-caption` | 写文案并 lint，预览 feed 实际显示的 125 字符窗口 | 高频 |
| `/ig-carousel` | 轮播帖：封面 + 每页文案 + 1080x1350 文件名规范 | 中频 |
| `/ig-story` | 日更 Story 序列 + 贴纸分工 + DM 漏斗 | 中频 |
| `/ig-profile` | 12 项 rubric 给主页打分（满分 100），按修复优先级重写 | 一次性 |
| `/ig-plan` | 一周内容计划 + 10 个该互动的账号 | 每周 |
| `/ig-human` | **humanizer**，整套的"灵魂" | 每条必跑 |
| `/ig-comment` | 给别人帖写评论，9 种类型按帖子内容选，"绝不 🔥🔥🔥" | 高频 |
| `/ig-reply` | 把自己帖子下的评论分类（关键词/线索/实质/问题/客服/噪音）再分批回复 | 高频 |
| `/ig-dm` | 关键词触发自动回复 + 首条私信 + 合作 pitch + 2 次跟进 | 高频 |
| `/ig-repurpose` | 一支视频/播客/Newsletter 拆成一周的 Reels 和轮播 | 每周 |
| `/ig-audit` | 复盘已发内容，按离群倍数排序，按 reach 而不是 views 排名 | 每周 |
### 五个"真的能跑"的 Python 工具（这才是干货）
**hookscore.py** —— 五项启发式评分：LENGTH / SPECIFICITY / STAKES / FRONTLOAD / ADDRESS，加权方式是"平均分 × 60% + 最低一项 × 40% − dealbreaker × 15"，理论上最低那一项会被强行拉低总分。这种"短板封顶"的评分哲学和人类刷 Reel 的直觉高度一致——一秒钟的犹豫就足以划走。
**beats.py** —— 按 `voice.md` 里的 wpm（每个人 150–200）把脚本转成时间码表，自动标记四类"会杀死 Reel"的问题：钩子超 3 秒、单一 beat 超 4 秒（静止画面是观众流失的地方）、连续 beat 没有任何具体名词/数字、没有 loop（结尾不呼应开头，白白丢掉二次播放）。
**caption.py** —— 最实用的一个小细节是**把"feed 实际能看到的前 125 字符"以方框形式渲染出来**，让作者以一个陌生人刷到这条帖子的视角看到折叠点。还强制校验 hashtag ≤ 5 个。
**humanize.py + detect.py** —— 154 条 slop 词替换表 + 18 类不可见字符（zero-width joiner、BOM、Unicode tag chars 等）+ 11 类排版替换（em dash → comma、curly quotes → straight）+ 16 种结构性 tell（被标记但不自动改写，留给用户自己判断）。
**swipe.py** —— 这是整套里最反直觉、也最聪明的设计。它**不用原始 views 排序**，而是用每条 Reel **超出该账号自身中位数**的倍数来排——一个 200 万粉账号做 40 万播放只是"普通周二"，而一个 4000 粉账号做 40 万播放才是真的找到了什么。
### /ig-reel 工作流拆解（最有代表性的一个）
`/ig-reel` 的 SKILL.md 里写了一份七步循环，几乎每一步都对应一个外部工具或文件，这种"指令驱动工具、工具反向反馈指令"的闭环是它和其他 prompt 包最大的区别：
1. 读 `voice.md`（没有就要求用户给三条自己的 Reels，反推声音档案）
2. 读 `hooks.json`（26 个公式，每个带模板、填好的示例、屏幕版本、用途、破坏方式）
3. 如果想法太薄，**不硬写**，问一组打包的问题："发生了什么？对谁？损失或回报了什么？"
4. 如果 `~/.claude/instagram/swipe.md` 存在则读，覆盖默认权重
5. 选 3 个不同公式的钩子（不是同一公式的三个改写）→ 跑 hookscore
6. 写脚本 → 跑 beats.py → 跑 /ig-human → 输出"REEL READY"块
7. **永不发布**，用户说 "yes" 才把这条写入 `log.md`，留给 /ig-audit 用
第 3 步和第 7 步是两个"反 LLM 本能"的设计——模型天然倾向硬编故事，它强制打断；模型天然倾向一键发完，它强制停在草稿层。
## 四、Demo 与代码：上手体验到底什么样
### 安装：三种路径，几乎零门槛
最快的方式，直接把仓库 URL 喂给 Claude Code：
```
https://github.com/Jakeschincariol/instagram-agent-skill
Install this skill, then confirm /ig-reel works.
```
或者手动：`git clone` 后 `cp -r instagram-agent-skill/skills/ig-* ~/.claude/skills/`。或者 Claude Code 的 plugin marketplace：`/plugin marketplace add Jakeschincariol/instagram-agent-skill` → `/plugin install instagram-agent`。
**没有 Claude Code 也能用**：把任意一份 `SKILL.md` 直接粘到对话最顶部，它会作为"模式"运行——但会失去那五个 Python 工具，而这恰恰是 `/ig-reel` 和 `/ig-human` 的大部分价值所在。
### 真实输出对照（hookscore 实跑结果）
README 给了一段非常诚实的对照，四条钩子一起评分：
```
->  85.6 STRONG  Nobody tells you that your first 30 reels are supposed to f...
        weakest: SPECIFICITY (75)
    81.4 STRONG  I lost $18,000 because of one missing contract.
        weakest: ADDRESS (70)
    54.4 OK      Stop scrolling if you want to grow on Instagram in 2026 🔥
        dealbreaker: Opens with "stop scrolling". Asking for attention proves
                     you have not earned it.
     9.6 WEAK    Hey guys, today I wanted to talk about content strategy
        weakest: FRONTLOAD (0)
        dealbreaker: Greeting. Nobody came to the feed to be greeted.
```
最后一句打分说明写得非常 Claude 风格："Shoot the top one. If the top one is under 50, none of these are the hook."（低于 50 分说明你还没找到钩子，重写比改写有用）。
### caption.py 的方框预览
```
  WHAT THE FEED SHOWS
  +------------------------------------------------------+
  | I lost $18,000 because of one missing clause in a    |
  | contract, and the worst part is that I had read the  |
  | thing twice before I si                              |
  +-------------------------------------------- ... more +
  PASS  LENGTH            389 / 2200 characters
  WARN  FIRST LINE        133 characters, so it gets cut at 125 mid-thought
  PASS  HOOK IS CONCRETE  2 numbers or names in the visible window
  WARN  SEARCH TERMS      1/2 present. Missing: client contracts
```
这个方框的价值在于**视觉化折叠点**——你写完才知道第 133 个字符正好把一个完整句子剪成半截，这种反馈在常规编辑器里根本看不到。
### humanizer 的五维雷达
针对一段故意写得"AI 味十足"的文案，detect.py 输出：
```
BURSTINESS    ###################.....  78.4
SPECIFICITY   #############...........  53.6    3.4 concrete markers per 100 words
SLOP DENSITY  ........................   0.0    20 stock terms, 23.0 per 100 words
FINGERPRINT   ################........  68.7    1 em dash
VOICE         #################.......  70.0    9 structural tells
------------------------------------------------------------
HUMAN SCORE   ########................  32.5   FLAGGED
```
跑完 humanize.py 后总分变 79.7 PASS（+47.2）。但 SKILL.md 里写得很清楚：**结构性问题（"It's not just X, it's Y"、rule-of-three、三连大写词、hashtag 墙）不会自动改，只标记——这些需要人来重写**，否则就是 regex 把好句子也搞坏。
## 五、目标人群与收益
**最适配的人群**：
- **个人品牌创业者 / 知识型自由职业者**（讲 freelance、定价、客户管理这类"有真话可讲"的领域）——voice.md 里的"Proof I can use"区块只有在你有真实数字可填时才发挥全部威力，否则脚本里会大量出现 `{{your number}}` 占位符，反向证明这个 skill 不适合纯鸡汤博主。
- **代运营 / MCN 内部批量产出**——13 个命令覆盖了一整条内容流水线，配合 /ig-audit 的周复盘能形成闭环。
- **Claude Skill 重度用户**——这个仓库的 SKILL.md 写法本身就是一份非常值得抄的"垂类 Skill 工程范本"，尤其是"指令层 + 工具层 + 个性化层"的三明治结构。
**主要收益**：把"写一条 Reel"从 30 分钟的空白页恐惧压缩到 10 分钟的"评 hook → 跑 beats → 过 humanizer → 三选一"决策流程；把"AI 味"这个隐形成本从靠朋友挑刺变成可量化的分数；把"I forgot 30 个 hashtag 已经过时了"这种平台规则更新永久内化到工具里。
## 六、竞品对比：它在一众"Instagram AI 工具"里处在什么位置
**vs. sergebulaev/instagram-skills**：同类最直接的竞争者，9 个 Skill，自称是 linkedin-skills 家族（400+ 星）的一部分，支持 Claude Code 和 Codex 双平台，特色是**通过 Apify 读真实数据**（需要 API key 和付费 Apify 账号）。相比之下 Jake 这套**完全本地化、无 API、无依赖**，牺牲了"实时读你垂类数据"的能力（只能靠你手动收集 swipe 文件），换来了零运行成本和完全隐私。如果你已经有 Apify 订阅且想要"自动"，选 sergebulaev；如果你想"零依赖 + 可定制 + 评分机制更狠"，选这个。
**vs. Hook / ClickFunnels 这类 SaaS 短视频钩子工具**：那些产品是黑盒 SaaS、按月订阅、生成的内容仍然是 OpenAI API 直出。这个仓库的开源性质意味着你可以改 slop.json、改 hooks.json、加自己的公式，长期成本为零。代价是**你必须先会用 Claude Code**，否则连安装都过不去。
**vs. 直接用 ChatGPT / Claude 写 prompt**：不部署任何 Skill，靠手工写长 prompt 当然也能做到 70% 的效果。差异点在于：① voice.md 持久化避免了每次重申身份；② Python 工具评分避免了"模型自己夸自己"；③ 公式库、安全区坐标、125 字符规则这些"平台 know-how"沉淀在文件里而不是对话里。
**vs. 同作者的 youtube-agent-skill / linkedin-agent-skill**：架构完全相同（11–13 个 Skill + 几个 Python 工具 + voice.md 模板），如果你做 YouTube 为主，可以直接换仓库，学习成本接近零。
## 七、局限与不足：必须直面的几个问题
**1. 评分器对"预测爆款"几乎无用，作者自己承认了。** `hookscore.py` 的 docstring 写得非常克制：测试在 74 条真实 hook 上做，**区分"故意写烂"和"正常 hook"的 AUC 是 0.83，但区分同一创作者自己的爆款和普通款的 AUC 只有 0.56——接近抛硬币**。它实际上是一个"反模式检测器"，不是"爆款预测器"。中文社区对它的评价也精准命中这一点："评分能抓明显弱项，却不擅长预测赢家。适合当拍摄前的检查层，不是爆款裁判。"
**2. 合并 PR 为零，社区协作几乎不存在。** Trendshift 数据显示 29 天里 **merged PRs = 0**。Issues 开了 49 个（最新两个是 2026 年 11 月 18 日），但作者没有合并任何外部贡献——这是一个"高质量单人作品"，不是社区驱动的项目。一旦作者停止维护，修复速度会迅速下降。 Fork 数 159 但无人合 PR，意味着大量功能 fork 后各自演化。
**3. 真正的"联网研究"环节是缺失的。** `/ig-viral` 名义上是"研究你的垂类"，但它没有调用任何 Instagram API（这些 API 在 Graph API 之外早已名存实亡），实际工作方式是**你手动收集 reel 数据到 TSV 文件再喂给 swipe.py**。这意味着"/ig-viral 帮你找爆款"这句话有夸大——它做的是"对已经收集到的爆款做排序和公式命名"。竞品 sergebulaev 通过 Apify 真正实现了抓取，这一块 Jake 是落后于竞品的。
**4. 26 个 hook 公式是英文语境的。** 公式库、slop.json 的 154 条词汇表、IG 安全区像素坐标都基于英文 Reels。直接套用到中文小红书/抖音语境，公式概念可以借鉴，但具体模板需要全量重写。这限制了它在中文创作者圈的直接可用性，更多是"工程参考"而非"即装即用"。
**5. 强依赖 Claude Code 的本地环境。** 没装 Python 3、不熟悉命令行的纯小白，在失去 Python 工具后这套 Skill 的价值会大幅缩水——只剩 SKILL.md 的 prompt 价值，跟其他 prompt 包差不多。
**6. 不发布任何内容、不连任何 API 是把双刃剑。** 安全、合规、防封号；但代价是"运营自动化"只剩"内容草稿自动化"，发布、调度、互动追踪还得回到 Meta Business Suite 或 Buffer 这类工具。
## 八、结语与行动建议
这套仓库值得它的 6.1k 星。**它的真正价值不在于"AI 替你做 Instagram"，而在于它把"AI 内容生产"这件事拆成了三个清晰的层级**：模型负责生成、本地 Python 负责量化检查、人负责拍板——并在这三层之间架起了 voice.md、log.md、swipe.md 三份持久化文件做状态传递。这套架构范式比"13 个 Instagram Skill"本身更值得学习，可以平移到任何垂类（实际上 Jake 自己已经平移到了 YouTube、LinkedIn、日交易、创业融资）。
如果你是**个人品牌创业者**且已经在用 Claude Code，直接装，10 分钟填 voice.md 是性价比最高的投入。如果你是**工程型 AI 创业者**，把它当 Claude Skill 工程范本来读，重点看 `SKILL.md` 里的"何时触发 / 何时拒绝生成 / 何时调用哪个本地工具"三段式结构，以及"自动修 vs 标记不修"这条判断线怎么写。如果你**只想给短视频文案做个"AI 味检测"**，单独把 `slop.json` 和 `humanize.py / detect.py` 拎出来用就够了，不必装全套。
**最大风险是单人维护 + PR 不合并**——可以 star 收藏但不要把它当成"长期基础设施"来建工作流，做好随时 fork 自己维护的心理准备。
