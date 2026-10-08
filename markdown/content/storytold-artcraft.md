# storytold/artcraft

[GitHub URL](https://github.com/storytold/artcraft)


## ArtCraft 深度评测：用 Rust 打造的开源 AI 创作 IDE，让 AI 出图从'抽卡'变'导演'

> 一款用 Rust 打造的开源 AI 创作 IDE，让你像搭片场一样先构图再生成，聚合 62+ 主流 AI 模型。

- **Tags**: 开源项目, Rust, AI 生成, 影视创作, GitHub
- **Category**: 开发工具, AI 创作, 设计软件

## Details

# ArtCraft 深度评测：一个用 Rust 重写创意工业的"生成式作品流水线"
> **一句话总结**：ArtCraft 是一款以 Rust 打造、面向艺术家与电影人的开源 AI 创作 IDE——它不只是让你"生成图片"，而是让你像搭片场一样，在 2D/3D 空间里**先构图、再生成**，把大模型时代的"抽卡玄学"变成可复现的"导演式工作流"。如果你曾被 Midjourney / ComfyUI 反复折磨于"同一张脸的第七次重roll"，这个项目值得你立刻装一下。
---
## 背景与痛点：为什么"抽卡式 AI 生成"是伪工作流
过去两年，所有用过 Midjourney、即梦、可灵的人都被同一个问题折磨过——
- **角色一致性**：同一个角色换个镜头就"换脸"，做短剧、漫画分镜的人被迫用 LoRA + 无数次重 roll
- **构图不可控**：你想要"女主坐在窗边、光从左侧打进来、背景是雨天街景"，但 prompt 里写 10 遍，模型依然给你一个 45 度仰拍
- **成本黑洞**：每次不满意都要重新付费生成，点数烧起来像流水
- **工作流碎片化**：从 MJ 出图 → PS 抠图 → Runway 生视频 → PR 剪辑，工具链断裂、素材来回搬运
ArtCraft（由 `storytold` 团队开发，官网 [getartcraft.com](https://getartcraft.com)）的解法很刁钻：**把"AI 生成"从一个按钮，重构为一整条可复现的制作管线**。它的口号是 "Turn prompting into crafting"——把 prompt 的玄学，变成 craft 的手艺。
一个比较贴切的比喻：如果 Midjourney 是"街边快照"，ComfyUI 是"化学实验室的试管架"，那 ArtCraft 就是**一个电影片场**——你先立好绿幕、摆好机位、定好演员走位，然后才喊"Action"让 AI 帮你按下快门。
---
## 核心亮点：它到底强在哪？
### 1. "Show, Don't Tell"：先摆场景，再生成
这是 ArtCraft 最反直觉也最性感的设计理念。传统 AI 工具让你"用嘴描述画面"，ArtCraft 让你**用空间描述画面**。官方 README 里列出了 9 项核心"Crafting"能力：
| 能力 | 通俗解释 |
|---|---|
| **Image to Location** | 把一张图变成一个"房间"，多个角色可以站在同一空间里，换个镜头还在同一间房 |
| **3D Image Compositing** | 把背景、前景、道具分层摆在 3D 空间里，做出真实景深 |
| **Image to 3D Mesh** | 一张图 → 可旋转、可摆放的 3D 模型 |
| **Character Posing** | 像摆木偶一样给角色定姿势、定机位，再让 AI 上色 |
| **Scene Blocking with Kitbashing** | 拼装现成的 3D 资产包来"走位" |
| **Character Identity Transfer** | 用一个姿势参考人偶，把你的角色"贴"上去 |
| **Background Removal** | 一键抠图，抠出来的东西变成可复用道具 |
这套组合拳的杀伤力在于：**你终于能控制"构图"和"一致性"这两个 prompt 永远解决不了的变量**。
### 2. 62 个模型的"模型超市"——一次接入，全家桶通用
ArtCraft 最大的工程野心是做 **AI 生成界的"食客"而不是"厨师"**——它不训模型，而是把所有主流模型接进来：
- **图像**（16 个）：Nano Banana 2 / Pro、GPT Image 2.5、FLUX 1.1 Pro Ultra、Seedream 5.0 Pro Ultra
- **视频**（25 个）：Seedance 2.0、Kling 2.6/3.0、Veo 3.1、Sora 2 Pro、Vidu Q3、MiniMax H3
- **音乐/音效**（5 个）：Suno 全家桶、Seed Audio
- **3D 网格**（11 个）：Hunyuan 3D 3.1、Tripo3D、Meshy 6、Rodin 2.5
- **3D 世界/Gaussian Splatting**（5 个）：World Labs 的 Marble 系列
这种设计让你**不用再开 5 个浏览器 Tab 在 5 个平台之间搬运素材**，一个软件里完成"文本→图→3D→视频→配乐"的完整链路。Roadmap 显示未来还会接入 Runway、Luma、Kling，并尝试兼容 OpenArt、Freepik 的订阅聚合。
### 3. Rust + 本地优先：不是玩具，是工程作品
根据 AISignal 的技术拆解，ArtCraft 的核心架构非常硬核：
- **运行时**：Rust + Tokio 异步运行时（和 Discord、Cloudflare 同款技术栈）
- **执行模型**：基于 DAG 的模块化管线（类似 ComfyUI 的节点图，但更强调"预设"和"复用"）
- **资产存储**：本地文件系统 + SQLite 索引，**不上云、不锁定**
- **混合执行**：Rust 管底层管线性能，Python 绑定做模型适配
这也解释了为什么官方选 Rust：**内存安全 + 零运行时依赖 + 跨平台单二进制**，让一个几 GB 的创意软件跑起来像原生应用而不是 Electron 大象。
### 4. 姊妹项目生态：一家公司想用 Rust 重写整个 Adobe
这是最容易被忽视但最震撼的部分。打开 GitHub 组织页 `storytold`，你会发现 ArtCraft 不只是一个项目，而是一个 **"Crafting Apps" 全家桶**：
| 应用 | 对标产品 | Star 数 | 状态 |
|---|---|---|---|
| **PhotoCraft** | Photoshop | **17.1K** | Early Alpha |
| **FilmCraft** | Premiere Pro | 3.3K | 活跃开发 |
| **LightCraft** | Lightroom | 3.0K | 活跃开发 |
| **PdfCraft** | Acrobat | 2.4K | 活跃开发 |
| **VectorCraft** | Illustrator | 2.2K | 开发中 |
| **EffectCraft** | After Effects | — | 开发中 |
| **DesignCraft** | InDesign | 978 | 开发中 |
| **WordCraft / DeckCraft / GridCraft / SoundCraft** | Word / PPT / Excel / Pro Tools | 百级 | 早期 |
其中几个技术指标相当炸裂：
- PhotoCraft 通过了 **135 个 PSD 测试文件中的 134 个往返测试**，支持 CMYK、Lab、8/16/32 位，用 Metal/Vulkan/DX12/WebGPU 渲染
- FilmCraft **不依赖 FFmpeg**，自己用 Rust 实现了 H.264、HEVC、ProRes、VP9 编解码器
- VectorCraft 在 Retina 分辨率下 **27 毫秒画 2 万个形状**
- EffectCraft 内置 259 种特效，支持 JS 表达式和 32-bit EXR 导出
- 所有 Crafting Apps 都设计为**可通过 CLI、JSON、MCP Server 被 AI Agent 直接控制**——这是给"Agent 时代"埋的伏笔
<details>
<summary>📎 点开看：storytold 是个什么团队？</summary>
公开资料不多，但从几个线索可以拼出画像：
- **创始背景偏影视/特效**：libhunt 收录的一段团队自述明确说"Our founding team consists of **filmmakers, VFX engineers**..."
- **技术栈选型**：有团队成员的履历显示"使用 Tauri 和 React 转向构建 getartcraft.com，集成多种生成式 AI 模型到桌面创作工作流"
- **社区热度**：2026 年 10 月初 Crafting Apps 登上 Hacker News 头版，主仓库周增 143 star、月增长率 62%
- **商业模式清晰**：Crafting Apps 全部 Apache-2.0 开源免费，主 ArtCraft IDE 免费下载但 AI 生成按点数付费（因为底层调用的是按次计费的第三方模型 API）
简单说，这是一支**从影视行业跳出来的工程师团队**，对"创作者真正缺什么"有第一手体感，而不只是做技术 demo。
</details>
---
## 上手门槛与部署体验
### 部署难度：⭐⭐（5 星制，简单）
- **Windows / macOS**：官网直接下载安装包，双击即用
- **Linux**：需要从源码编译（Rust 环境熟悉的话无痛）
- **浏览器版本**：官方提供 Web 端，不用装也能体验核心功能
- **模型 API Key**：你需要自己准备 Nano Banana / FLUX / Kling 等模型的服务商 API Key，或购买 ArtCraft 的点数
### 学习成本：⭐⭐⭐（中等偏高）
如果你是 ComfyUI 重度用户，上手很快——节点图逻辑是相通的。但如果你习惯了 Midjourney 的"一框一句话"，需要适应"先搭场景再生成"的思维转变。好在官方 YouTube 有 2 分钟 Demo，概念介绍足够清晰。
### 核心工作流示例（伪代码）
```
1. 导入或生成一张"房间"参考图 → Image to Location
2. 在 3D 空间中摆入 2 个角色人偶，调整站位与镜头角度
3. 用 Character Posing 拖动手柄设定动作
4. 选择一个模型（如 Nano Banana Pro）+ 撰写风格 prompt
5. 一键生成 → 若不满意，调整机位或道具，仅重跑局部
6. 生成满意后 → 切到 Image to Video，接 Veo 3.1 加运动
7. 用 Suno 生成 BGM，FilmCraft 里拼成片
```
**对比传统的"prompt 掷骰子"**：一旦场景搭好，你可以**在同一个房间、同一组角色上无限换机位**，这才叫"做片子"，而不是"抽奖"。
---
## 竞品对比：它在生成式创作工具谱系里的位置
| 维度 | **ArtCraft** | ComfyUI | Runway ML | Krita + AI 插件 | Blender + Addon |
|---|---|---|---|---|---|
| **开源** | ✅（主仓库协议待明确，姊妹项目 Apache-2.0） | ✅ GPL | ❌ 闭源 | ✅ | ✅ |
| **本地运行** | ✅ 本地优先 | ✅ | ❌ 全云端 | ✅ | ✅ |
| **2D/3D/AI 视频** | ✅ 统一支持 | ⚠️ 主打 2D | ✅ | ❌ 仅 2D | ⚠️ 主打 3D |
| **学习曲线** | 中等 | 高（节点地狱） | 低 | 低 | 高 |
| **模型自由度** | 高（62+ 模型） | 极高（社区节点） | 低（锁定模型） | 中 | 低 |
| **适合人群** | 影视创作者 / 概念设计师 | AI 技术玩家 | 短视频博主 | 插画师 | 3D 美术 |
| **技术栈** | **Rust** | Python | — | C++ | C/C++ |
| **商业模式** | 工具免费 + 生成按点付费 | 完全免费 | 订阅制 | 免费 | 免费 |
**ArtCraft 的独特卡位**：它既不像 ComfyUI 那样纯技术极客向（要自己拼节点），也不像 Runway 那样锁死在云端（隐私 + 持续订阅成本），而是**"开箱即用 + 本地可控 + 工作流导向"**的中间路线。对专业影视/独立游戏团队来说，这条路线刚好填补了市场空白。
---
## 局限与不足：客观的阴暗面
写深度评测必须泼冷水，以下是 ArtCraft 现阶段真实存在的问题：
### 1. 主仓库许可证模糊
`storytold/artcraft` 主仓库在第三方聚合站显示 License 为 **NOASSERTION**，而姊妹项目（PhotoCraft 等）是标准的 Apache-2.0。这对想二次开发或商用的开发者是一个不确定性——**商用前务必去 LICENSE 文件确认**。
### 2. 生成点数是持续成本
虽然软件本身免费，但底层模型（Nano Banana、Sora 2、Veo 3.1）都是按次计费的第三方 API。重度使用时点数消耗可能不低，相当于"软件免费但汽油收费"。如果你想完全零成本，要么只用开源模型（FLUX schnell 等），要么直接转向 ComfyUI + 本地显卡。
### 3. 部分模型被锁定或禁用
官方模型目录里，Sora 2、Kling 3.0 Pro、Veo 2/3 等标注了 †（disabled）或 ‡（桌面版不可用），这些可能是 API 政策或授权问题，实际可用性以最新版本为准。
### 4. Crafting Apps 仍是"半成品"
PhotoCraft 和 PrintCraft 是 Early Alpha，VectorCraft / FilmCraft / EffectCraft / DesignCraft 是"In Development"。别指望现在就卸载 Adobe 全家桶——**它更像是"未来的 Photoshop"，而不是"今天的 Photoshop"**。
### 5. Linux 支持不完整
官方稳定版只发 Windows 和 macOS，Linux 用户只能自行编译，对开源社区的核心人群是个减分项。
### 6. 文档与社区仍在早期
虽然有 Development setup、Roadmap 等章节，但深度教程、第三方插件生态相比 ComfyUI 的社区狂热（数千个自定义节点）仍有数量级差距。
---
## 谁最适合用 ArtCraft？收益几何？
| 人群 | 能获得的具体收益 |
|---|---|
| **独立电影人 / 短剧导演** | 用 Scene Blocking 预演镜头、用 Image to Location 保持场景一致性，把分镜预演成本从数万降到几百 |
| **概念设计师 / 原画师** | 用 Kitbashing 快速搭建构图草案，再用 FLUX/Nano Banana 精修，省去反复推倒重来的时间 |
| **AI 短视频创作者** | 一个软件打通"图→视频→配乐→剪辑"，告别 5 个 Tab 来回搬运 |
| **游戏独立开发者** | 用 Hunyuan 3D / Meshy 从概念图直接生成可摆放的 3D 资产，再导入 Blender/Unity |
| **Rust 开发者** | 观察一套工业级 Rust 创意软件的架构设计（Tokio + Axum + SQLite + Tauri），学习价值拉满 |
| **Adobe 订阅反感者** | 等 Crafting Apps 成熟后，Photocraft + FilmCraft 组合可能每年省下数千美元订阅费 |
**不适合的人**：只想"一句话出图发朋友圈"的轻度用户——用 Midjourney 或即梦就够了，ArtCraft 的复杂性对你是负担。
---
## 结语与行动建议：终极评判
**ArtCraft 不是又一个"AI 出图工具"，而是一次对"AI 创作工作流"的重新设计。** 它的可贵之处在于三点：
1. **理念正确**：把生成式 AI 从"抽卡玩具"升级为"可控制作管线"，这是行业走向专业化的必经之路
2. **工程扎实**：Rust + 本地优先 + 多模型聚合，架构选择显示出长期主义的野心
3. **生态远大**：Crafting Apps 全家桶如果真做到位，可能是十年来对 Adobe 垄断最有力的挑战——而且它已经让 PhotoCraft 拿到了 17K star
但也要清醒看到：主仓库许可证待明确、模型 API 仍要花钱、Crafting Apps 尚未成熟、Linux 体验不完整——**它现在是一个"值得重仓关注"的项目，而非"立刻替换 Adobe"的项目**。
**给你的三条行动建议**：
- 🎬 **如果你做视频内容**：本周就去官网下载 macOS/Windows 版，用 2 分钟 Demo 跟一遍工作流，重点试一下 Image to Location 和 Character Posing——这两个功能一旦用顺手，就回不去了
- 💻 **如果你是开发者**：Star + Fork 一下仓库，重点读 `artcraft-services` 和姊妹项目的源码，Rust 创意软件的工程实践在开源界非常稀缺
- ⚠️ **如果你考虑商用**：先确认主仓库 LICENSE 的具体条款，以及所用模型的 API 服务商协议，不要直接假设"开源 = 免费商用"
**一句话收尾**：在 AI 创作工具这条赛道上，ArtCraft 是极少数**既懂技术、又懂创作、还懂商业**的玩家。它未必能跑完全程，但已经把"AI 时代创意软件应该长什么样"的蓝图画得很清楚了。这个项目，值得放进你的 Watch List 首位。
