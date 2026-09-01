# browser-use/video-use

[GitHub URL](https://github.com/browser-use/video-use)


## video-use：基于对话的 AI 自动视频剪辑技能

> 通过对话指令让 AI 自动完成视频剪辑，生成字幕与成品，专为开发者打造的高效工具。

- **Tags**: 视频剪辑, AI Agent, 自动化, ffmpeg, 开源
- **Category**: AI 编程, 视频工具, 开发者工具

## Details

<|assistant|>我将点击仓库中的 install.md 文档，以获取详细的安装步骤、依赖项与配置说明，用于评估上手门槛与部署体验。</think>
<|assistant|>我将点击仓库中的 install.md 文件，以获取详细的安装步骤、依赖项和配置说明，从而评估上手门槛与部署体验。</think>
<|assistant|>我将直接点击 README 中的 install.md 链接，以获取详细的安装步骤与依赖信息。</think>
<|assistant|>我将尝试点击仓库中的 install.md 文档，获取详细的安装步骤与依赖，用于评估上手门槛和部署体验。</think>
<|assistant|>我将尝试点击 README 中的 install.md 链接，以获取详细安装步骤与依赖信息，用于评估上手门槛与部署体验。</think>
<|assistant|>我将尝试点击仓库中的 install.md 链接，以获取详细的安装说明和依赖项。</think>
<|assistant|>我将尝试直接打开 install.md 文档，以获取详细安装步骤与依赖说明。</think>
# video-use 深度评测：把视频剪辑变成“对话”的 AI 技能
- **一句话总结：** video-use 是一个面向 Claude Code 等编码型 AI Agent 的“技能”（Skill），把视频剪辑变成一段对话——把原始素材丢进文件夹、告诉 AI“剪成一支发布视频”，它就会转录、去废话、自动调色、生成字幕与动画叠加，最终输出 `final.mp4`。核心亮点是不依赖复杂 GUI，而是用“文本 + 按需视觉”的方式让模型“读懂”视频并执行剪辑，对说话类内容（课程、播客、访谈）尤其友好。
## 背景与痛点
- 传统剪辑软件门槛高：DaVinci、Premiere 等界面复杂、参数繁多，需要专业学习。
- AI 视频剪辑产品往往走向“预设化”：花哨模板、固定效果，缺乏对多轮对话的灵活支持。
- 让 LLM“看视频”成本极高：一分钟的 30fps 视频约 1800 帧，如果全部转成视觉 token 再喂给模型，仅一分钟的上下文就可能达到数千万级 token，明显不可行；同时，说话内容的“剪辑线索”更多在文本（字幕/时间戳）上，而不是逐帧画面。
- 现有的“AI 剪辑”常是黑盒：自动化跑完全程，难以干预、难以重演与审查。
video-use 选择走“文本为主、按需视觉、可对话、可审计”的路线，解决上述问题：它依赖 ElevenLabs Scribe 的字级时间戳转录，把视频变成约 12KB 的“可读文本”，仅在需要决策的画面区间生成胶片条+波形图 PNG，让模型以合理成本“读”懂视频并进行操作。
## 核心亮点与功能剖析
### 亮点 1：把视频变成“可读文本”的两层机制
- Layer 1（音频转录）：使用 ElevenLabs Scribe，对每条原始素材做一次转录，返回含说话人分离（diarization）、字级时间戳、音频事件（如笑声、掌声、叹气）的结构化结果。所有片段打包成 `takes_packed.md`（约 12KB），这是 LLM 的“主视图”。
- Layer 2（按需视觉）：仅在必要决策点（如停顿是否太长、多版本镜头对比、切点校验）才调用 `timeline_view.py`，生成指定时间范围的电影胶片条+波形+文字标注的 PNG。避免“逐帧投喂”带来的天量 token 浪费。
“就像给浏览器 DOM 里的网页结构化解析，而不是用整页截图让模型猜。”——这让 LLM 有足够“结构信息”理解视频，又保持了可控成本。
### 亮点 2：对话式剪辑 + 策略确认
- 典型用法：在素材目录下启动 Agent（如 Claude Code），输入一句自然语言指令：
  - “edit these into a launch video”
  - 或“inventory these takes and propose a strategy”
- 工作流：Agent 先盘点素材 → 在 `project.md` 记忆 → 给出文字剪辑策略等待你确认 → 执行 → 渲染 → 自检 → 输出 `edit/final.mp4`。
- 每次会话追加记忆到 `project.md`，下周再聊时它记得你的“项目语境”。
### 亮点 3：生产级正确性的“12 条硬规则”
SKILL.md 明确列出 12 条“不可妥协的硬规则”，保证剪辑在技术层面不翻车：
- 字幕必须最后叠加（否则会被覆盖导致静默失败）。
- 采用“分段无损提取 + concat”，而非单次多 filter 图（避免重复编码）。
- 每段音频边界 30ms 淡入淡出，防止“爆音”。
- 叠加动画使用 `setpts=PTS-STARTPTS+T/TB`，确保起始帧对齐窗口。
- 字幕时间线使用“输出时间轴 offset”计算，避免 concat 后对齐错位。
- 切点必须咬在“词边界”（不斩词）。
- 切点前后要 30–200ms 垫片，缓解转录时间戳漂移。
- 仅使用字级精确 ASR，不使用 SRT/短语模式或标准化填充词（损失编辑信号）。
- 按源文件缓存转录，不重复转录。
- 多个动画采用并行子 Agent 生成，总耗时取决于最慢那条。
- 先给出策略、待你确认后再执行。
- 所有输出都放在 `<videos_dir>/edit/`，绝不污染 skill 仓库目录。
这些规则把“正确性问题”收拢为固定约束，让 LLM 在这些边界内自由发挥“审美”。
### 亮点 4：多样式叠加字幕、调色、动画生成
- 字幕：默认每 2 个词一组大写展示，完全可自定义；最终通过 `master.srt` 在 filter 链的末端“烧录”。
- 调色：每段自动上色（可选 warm cinematic / neutral punch，或自定义 ffmpeg 链）。
- 动画叠加：支持 HyperFrames、Remotion、Manim、PIL 等“动画引擎”，采用并行子 Agent 每槽位一个负责生成与渲染，避免串行等待。
### 亮点 5：自检与迭代
渲染完成后，它会在每个切点边界运行“视觉自检”（timeline_view on rendered output），检查画面跳变、音频爆音、字幕遮挡等，必要时自动修复并重渲染（最多 3 次）。
### 亮点 6：多 Agent 兼容 + 云端尝鲜
- 适配 Claude Code、Codex、Hermes、Openclaw 等具备 Shell 访问能力的编码型 Agent。安装时将 skill 目录通过 symlink 挂到对应 agent 的 `skills/` 即可。
- 提供 Browser Use Cloud 的试用入口，不必本地环境即可体验。作者鼓励“先把视频丢给 Cloud，喜欢再本地部署”。
## 目标人群与收益
- 谁最适合：
  - 已在用 Claude Code / Hermes / Cursor 等“编码型 AI Agent”的开发者或创作者。
  - 常制作说话类视频（教学、播客、访谈、开发者日志）但不想学传统剪辑软件的人。
  - 需要批量“清理口癖/静音/不良片段”的内容创作者，尤其视频产量高、剪辑重复劳动多的人。
- 能带来的收益：
  - **时间：** 剪辑门槛大幅降低，从“点拉滚放”变成“说一句话”，减少大量人工切词、去废话、对字幕。
  - **质量：** 12 条硬规则兜底技术正确性（不会剪爆音频/字幕错位），调色与淡入淡出让观感接近成品。
  - **可审计与重演：** 所有步骤记录在 `project.md` 与 `edl.json`、`takes_packed.md` 等文本中，任何一步都可以追溯、复盘甚至手动微调后重跑。
  - **可扩展：** 借助 Python + ffmpeg + 动画引擎，你可以持续扩展新的剪辑“技巧”而不必被 GUI 限制。
## 技术栈与架构解析（开发者视角）
- 核心依赖与工具：
  - Python 生态：`requests`、`librosa`、`matplotlib`、`pillow`、`numpy` 等；通过 `pyproject.toml` 声明，使用 `uv sync` 或 `pip install -e .` 安装。
  - ffmpeg/ffprobe：硬依赖，负责几乎所有剪辑、调色、字幕烧录与音频处理。
  - ElevenLabs Scribe API：用于高质量的字级时间戳转录（付费）。
  - Node.js/npm（按需）：用于 HyperFrames/Remotion 动画引擎；HyperFrames 当前要求 Node.js 22+。只在第一次用到时安装。
  - Manim（按需）：可在技能目录内 vendor 一个 `skills/manim-video/` 子技能来触发。安装逻辑同样是按需触发。
- 关键设计：
  - 数据流与管线：
    - Transcribe → Pack → LLM Reason → EDL（编辑决策列表）→ Render → Self-Eval。渲染后若自检发现问题，则修复+重渲染（最多 3 次）。
  - 目录布局（会话侧）：
    - 源文件不动，输出一律放在 `<videos_dir>/edit/`。其中包含：
      - `project.md`：会话记忆与策略记录。
      - `takes_packed.md`：打包后的语句级转录（LLM 主视图）。
      - `edl.json`：切点与决策记录。
      - `transcripts/*.json`：原始 Scribe JSON 缓存。
      - `animations/slot_<id>/`：每个动画的素材、渲染结果与推理过程。
      - `clips_graded/`：已调色、加淡入淡出的分段。
      - `master.srt`、`preview.mp4`、`final.mp4` 等。
  - Helpers 脚本：
    - `transcribe.py`、`transcribe_batch.py`：单/并行转录，带缓存。
    - `pack_transcripts.py`：把转录 JSON 打包成 `takes_packed.md`。
    - `timeline_view.py`：按需生成胶片条+波形+文字标注 PNG，用于视觉确认。
    - `render.py`：根据 EDL 执行 ffmpeg 渲染管线（含字幕、调色、叠加与淡入淡出）。
- 数据规模与成本控制：
  - README 将“逐帧转 token”的幼稚方案与本项目做了对比：假定 30,000 帧、每帧 1,500 token，则是约 45M token 噪音；video-use 仅需要约 12KB 文本 + 少量 PNG 即可完成剪辑推理。
## 上手门槛与部署体验（开发者视角）
- 环境准备：
  - 需要 Python（uv 或 pip）、ffmpeg、可选 yt-dlp；Node.js/npm 只在需要 HyperFrames/Remotion 时安装。
  - ElevenLabs API Key：通过 `.env` 写入仓库根目录；安装时有一次校验调用（`curl` 到 `/user` 端点检查 200）。
- 安装方式：
  - “Agent 自动安装”：把 README 中给出的 Setup prompt 直接粘贴给 Agent，由它完成克隆、依赖安装、skill 注册、API Key 配置等。
  - 手动安装：提供完整命令序列，包括 clone、symlink 到 Agent 技能目录、安装依赖与 ffmpeg、设置 `.env`。
- 验证：
  - 建议使用轻量命令验证而非立即转录（避免消耗 Scribe 配额），如运行 `timeline_view.py --help` 和 `ffprobe -version | head -1`。整套端到端测试可留待第一次真实素材。
- 文档清晰度：
  - `install.md` 职责明确：仅首次安装或重连时使用，详细列出依赖和各 Agent 的技能目录做法（Claude Code/Codex/Hermes/Openclaw）。
  - `SKILL.md` 聚焦日常使用流程、硬规则与目录布局；helpers 脚本作用一目了然。
## 简单上手 Demo（代码/命令示例）
- 1) 手动安装（macOS 示例）：
```bash
# 1. 克隆并建立技能目录
git clone https://github.com/browser-use/video-use ~/Developer/video-use
ln -sfn ~/Developer/video-use ~/.claude/skills/video-use
# 2. 安装依赖
cd ~/Developer/video-use
uv sync  # 或：pip install -e .
# 3. 安装 ffmpeg（必需）
brew install ffmpeg
# 可选：yt-dlp 用于从网络下载素材
brew install yt-dlp
# 4. 配置 ElevenLabs API Key
cp .env.example .env
# 编辑 .env，填入 ELEVENLABS_API_KEY=...
```
- 2) 第一次剪辑会话：
```bash
# 进入素材目录
cd /path/to/your/videos
# 启动 Agent（以 Claude Code 为例）
claude
# 在对话中输入（示例）
> edit these into a launch video
```
Agent 将：
- 盘点源文件并转录（使用 ElevenLabs Scribe）。
- 生成 `takes_packed.md` 与 `project.md`。
- 给出文字策略并等待你确认。
- 执行剪辑、调色、字幕与动画叠加。
- 自检并输出 `edit/final.mp4`。
## 社区活跃度与生命力
- Star 数与生态关联：项目所在的 browser-use 组织聚焦“让网站与工具对 AI Agent 可用”，本身在浏览器自动化、Agent 基础设施与插件（如 browser-harness、video-use 等）方面持续有更新和较高关注度（浏览器自动化相关仓库在 2026 年 8 月仍在活跃更新）。
- 开源与可扩展：video-use 完全开源，支持按需求定制 ffmpeg 链、字幕样式、动画槽位与“助手脚本”，社区可围绕 helpers 与 SKILL.md 进行二次开发。
注：受限于当前工具访问，本文不引用具体的 Star/Fork 数，仅以组织与项目形态做趋势判断。
## 竞品/同类对比
- 对比方向 1：GUI 剪辑软件（DaVinci、Premiere 等）
  - 优势：功能齐全、轨道/特效/调色/音频精细控制成熟。
  - 劣势：学习曲线陡峭、重复劳动高、难以脚本化与批量化；与 LLM“对话式”工作流难以结合。
- 对比方向 2：SaaS AI 剪辑（CapCut AI、剪映、某些“自动去口癖”工具）
  - 优势：开箱即用、模板丰富、适合快速发短视频。
  - 劣势：往往是黑盒，缺乏可审计的步骤和“策略确认”；对长内容/多镜头场景稳定性未知；难以自由接入自定义动画引擎或复杂 ffmpeg 链。
- 对比方向 3：其他“LLM + 视频”方案（多帧视觉密集、逐帧 VLM、多模态剪辑脚本生成器）
  - 优势：某些方案对视觉内容（镜头运动、物体识别）有更强理解。
  - 劣势：成本极高、依赖昂贵视觉模型；对说话内容的“文本线索”利用不足。
video-use 的差异化：选择“音频转录为主、视觉按需补位、策略可对话、规则可审计”的折中路线，配合 ElevenLabs Scribe 的字级时间戳，更贴合说话类内容的高效剪辑，并为有编程能力的人提供完全可定制的脚本化工作流。
## 局限与不足
- 上手仍需具备基本开发环境：
  - 需准备 Python、ffmpeg、配置 `.env` 与 ElevenLabs API Key；对不会命令行/不常用编码型 Agent 的内容创作者而言门槛较高。
- 强依赖 ElevenLabs Scribe（付费）：
  - 无 Key 则无法转录，意味着核心能力不可用。ElevenLabs 的计费采用按量付费模式（统一的信用额度体系），转录会消耗额度。频繁/大量剪辑需关注账单。
- 创意边界：规则约束保证“不犯错”，但审美偏好仍然需要通过对话与多次迭代达成；对高度依赖镜头节奏、快速蒙太奇、动作剪辑的视频，可能不如经验丰富的剪辑师。
- 硬件与时长限制：超长素材（如数小时的会议）在处理环节仍需本地算力与存储；虽然 Scribe 支持最多 10 小时的文件异步处理，但本地剪辑/调色/渲染依然需要硬件支撑。
- 调试与故障排除：遇到 ffmpeg 参数或动画引擎版本问题时，需要用户具备一定排查能力；错误信息不一定对所有非开发者友好。
## 结语与行动建议
- 终极评判：
  - video-use 把“剪辑”从点击操作变成“对话 + 脚本 + 规则”，为已经在使用编码型 AI Agent 的创作者提供了极高可定制性和可控性的 AI 剪辑工作流。它在说话类内容（教程、访谈、播客）上优势明显，同时通过 12 条硬规则与文本记忆设计，降低了“剪出技术事故”的风险。
- 行动建议：
  - 如果你是：
    - 已在用 Claude Code / Hermes / Cursor 等编码型 Agent → 强烈建议用 Agent 自动安装方式试玩（把 Setup prompt 粘贴给 Agent），先从几分钟的说话类素材开始，体验“对话→确认→final.mp4”的流程。
    - 对命令行和 ffmpeg 较熟悉 → 可以手动安装，按需接入自己的动画引擎与调色链，把 helpers 当作可扩展的脚本库。
    - 想先不折腾环境 → 可先尝试 Browser Use Cloud 上的 demo，确认产出风格与成本预期后再决定是否本地部署与深度定制。
  - 小白/非开发者建议：
    - 如果身边有技术伙伴，可以请他帮忙搭一次环境，把“口癖清理/自动字幕/批量初剪”等任务固定为“定式”，你负责审美与策略确认。
    - 将 video-use 视作“生产力的中间层工具”：用它把原始素材洗成可用的半成品，再在剪辑软件里做更细的包装。
- 风险提示：
  - 务必关注 ElevenLabs 的计费与用量，避免一次性转录过多超长素材导致意外账单。
  - 重要剪辑工作仍建议自检与备份，尤其是对字幕对齐、画面跳变等易错点做人工抽检。
整体而言，video-use 是一项将“LLM + ffmpeg + 字级时间戳”组合得当、方向清晰的工程化实践，尤其适合有脚本化、对话式剪辑需求的开发型创作者。它在 GUI 与纯手工之间走出了一条“可编程、可对话、可审计”的新路径。
