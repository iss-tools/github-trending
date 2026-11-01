# ghostty-org/ghostty

[GitHub URL](https://github.com/ghostty-org/ghostty)


## Ghostty 深度评测：HashiCorp 创始人用 Zig 打造的 GPU 加速终端，快、功能、原生三者兼得

> 一款由 HashiCorp 联合创始人用 Zig 语言打造的开源终端模拟器，同时做到了速度快、功能全、原生感强，被誉为终端界的 WebKit。

- **Tags**: 终端模拟器, Zig语言, 开源项目, GPU渲染, macOS工具
- **Category**: 开发工具, 效率工具, 开源项目

## Details

# Ghostty 深度评测：一款让终端"消失"的现代化神器
> 评测对象：[ghostty-org/ghostty](https://github.com/ghostty-org/ghostty)
> 评测时间：2026 年 10 月
> 项目类型：开源终端模拟器（Zig / MIT 协议）
---
## 一句话总结
**Ghostty 是 HashiCorp 联合创始人 Mitchell Hashimoto 用 Zig 语言亲手打磨出的 GPU 加速终端模拟器，它同时做到了"快、功能丰富、原生感"三件业内长期互相排斥的事，是 2024 年底至今最值得关注的开源终端之一。** 如果你是 macOS 或 Linux 的重度命令行用户，它大概率会让你用上第一分钟就舍不得关掉。
---
## 背景与痛点：为什么一个亿万富翁要回来写终端？
### 一段不太一样的创业故事
Mitchell Hashimoto 这个名字在基础设施圈如雷贯耳——Vagrant、Packer、Consul、Terraform、Vault、Nomad、Waypoint，过去十年 DevOps 世界的半壁江山都出自他之手。2023 年离开 HashiCorp 之后，他没有再去折腾云原生，反而做了一个让人意外的决定：**回到桌面端，写一个终端模拟器**。
他在 Changelog 播客里说得很坦诚：写了 15 年 CLI 工具之后，他意识到自己**其实并不真正理解终端模拟器是怎么工作的**。于是 Ghostty 最初只是一个"做出来就扔掉"的练手项目，目的是让 vim 和编译器能跑起来。结果在 Discord 上给朋友看了 Demo，居然有人想继续用，于是私测两年、2024 年圣诞节正式开源发布。
### 它要解决的核心痛点：终端圈的"不可能三角"
在 Ghostty 出现之前，选终端就像在点外卖时三选一：
- **要快** → 选 Alacritty，但没标签页没分屏，功能少得像裸奔
- **要功能** → 选 iTerm2 或 Warp，但启动慢、内存吃得凶、长得也不够"本地"
- **要原生** → 选 GNOME Terminal / Terminal.app，但性能和可定制性都是上个时代的产物
Ghostty 的官方 README 直接把这个矛盾写在了标题里："别的终端逼你在快、功能、原生之间做选择，Ghostty 三个都要。"
---
## 核心亮点与功能剖析
### 1. 性能：Zig + GPU + 多线程的"硬核三件套"
**Zig 是一个聪明的赌注。** Hashimoto 自己说选 Zig 而不是 Rust 的原因之一是"Zig 写起来有意思"，但客观上 Zig 没有运行时、没有垃圾回收、没有虚拟机开销，对内存布局拥有完全控制权，这让 Ghostty 能做到接近 C 的性能而不牺牲现代语言的表达力。
**架构上是教科书级的多线程分工：** 每个终端有独立的读线程、写线程、渲染线程，避免锁竞争。渲染走 macOS 的 Metal、Linux 的 OpenGL（1.4 版本已部分切换到 EGL + DMABUF 三重缓冲），字体引擎用 CoreText。
**SIMD 加速的解析器是个隐藏彩蛋。** 1.4 版本把纯 ASCII 文本的解析从 128 MB/s 拉到 **725 MB/s（5.7 倍提速）**，CAT 一个 150 MB 文件从 1.5 秒缩到 **566 毫秒**。
把第三方实测数据放在一起感受一下（2023 款 MacBook Pro M3 Max，macOS 15.6）：
| 指标 | Ghostty | iTerm2 | Warp |
|---|---|---|---|
| 冷启动 | **0.08s** | 0.45s | 1.2s |
| 空闲内存 | **45MB** | 120MB | 280MB |
| 滚动帧率 | **120fps** | 60fps | 90fps |
| 输入延迟 | **1.8ms** | 6ms | 8ms |
| cat 10 万行大文件 | **0.6s** | 1.8s | 2.3s |
数据来源：DevToolReviews 2026 基准测试
**一个比喻帮你理解 GPU 渲染：** 传统终端像用 CPU 一笔一笔画毛笔字，而 GPU 终端相当于把整张画一次性交给显卡的"流水线印刷机"——你按住滚动键看 10 万行日志时，前者会掉帧，后者像刷视频一样丝滑。Ghostty 在此基础上做了更激进的优化：隐藏标签页会自动释放 GPU 资源，20 个隐藏标签页能把显存占用从 385 MiB 压到 18 MiB。
### 2. "原生感"哲学：不做跨平台的最小公分母
这是 Ghostty 最容易被忽视、但最能体现设计品味的部分。市面上大多数跨平台应用（尤其 Electron 系）在哪个平台都长得"不三不四"，Ghostty 反其道而行：
- **macOS 上**：用 Swift + SwiftUI + AppKit 构建，是真·SwiftUI 应用，支持原生标签栏、Quick Look、Force Touch、Apple Shortcuts、AppleScript，连设置界面都是真正的 macOS 设置 GUI
- **Linux 上**：用 GTK4 构建，在 GNOME 桌面里几乎能以假乱真到"截图都分不清哪个是 GNOME Terminal"；同时集成 systemd（cgroup 隔离、单实例）
- **Windows 上**：官方暂无版本，社区有 `shiweis/ghostty-windows` 分支在用 Win32 + OpenGL 4.6 移植，已声明"功能完整"但与上游的同步还需验证
**用一句话概括这个哲学：** 用户应该觉得"这个终端就是为我这个平台量身打造的"，而不是"这是个跨平台应用恰好能在我电脑上跑"。
### 3. libghostty：终端界的 WebKit，真正的野心所在
如果说 Ghostty GUI 是台前的演员，**libghostty 就是幕后真正的野心**。它是用 Zig 写的跨平台、零依赖 C-ABI 兼容库，任何第三方应用都可以嵌入它获得完整的终端能力。
Hashimoto 在 2025 年 9 月正式宣布 libghostty，并放话："**我预计到 2027 年年中，通过 libghostty 使用 Ghostty 的人数将远远超过直接使用 Ghostty GUI 的人数。**"
目前 awesome-libghostty 列表已经收录了 **137 个基于 libghostty 的项目**，包括：
- **cmux**（macOS + iOS）：为 AI Coding Agent 优化的终端，28k+ GitHub 星标
- **blink、Zentty、Forge**：macOS 上的 Agent 工作区
- **Echo、Geistty、Spectty**：iOS/iPadOS 的 SSH/Mosh 客户端
- **Umbra**：Android GPU 加速终端
- **OrbStack**：在其 Docker/Linux VM 应用内嵌入了 Ghostty 终端
- **vscode-bootty**：在 VS Code 里嵌入 libghostty
**这个思路非常像 Apple 当年把 WebKit 开源出来——** 一个核心引擎 + 无数上层应用。Hashimoto 的新公司 Superlogical（2026 年 7 月宣布）也正在 libghostty 之上构建一个终端多路复用器。
### 4. 零配置起步，但"想调多深都行"
Ghostty 践行"Zero Configuration Philosophy"：**默认值就足够好，开箱即用**。Nerd Fonts 字形、JetBrains Mono 默认字体、合理的配色、常用的快捷键全部预置好。
如果你想调，配置文件是 `~/.config/ghostty/config`，纯 key-value 格式，没有 YAML/JSON/TOML 的语法税：
```ini
# ~/.config/ghostty/config
font-family = JetBrains Mono
font-size = 14
theme = dark:catppuccin-frappe,light:catppuccin-latte
background-opacity = 0.95
# 分屏快捷键
keybind = super+d=>new_split:right
# 智能复制（有选中内容时 Ctrl+C 才复制，否则仍是中断信号）
keybind = performable:ctrl+c=copy_to_clipboard
# 隐藏光标
mouse-hide-while-typing = true
# Quick Terminal 全局下拉快捷键（1.2 新增）
keybind = global:ctrl+grave_accent=toggle_quick_terminal
```
**几个让人会心一笑的小细节：**
- 内置 100+ 主题，命令行输入 `ghostty +list-themes` 可以带实时预览地"逛"主题
- 支持根据系统深浅色模式自动切换主题
- 支持"触发序列"快捷键（类似 Vim 的 leader key），1.3 还加了 Key Overlay 可视化提示
- **Terminal Inspector**（Cmd+Option+I）：可以实时看到每个按键、渲染时间，相当于浏览器 DevTools 在终端里的等价物，调试 TUI 应用神器
- **自定义 Shader**：可以写 GLSL shader 给终端加辉光、CRT 滤镜等视觉效果
### 5. 1.4 版本的硬货（2026 年 10 月发布）
作为最新大版本，1.4 集中了 172 位贡献者、2,889 次提交的 7 个月工作：
- **100% 实现 Kitty Graphics 协议**（包括动画帧、相对定位），成为第一个在 Kitty 之外完整实现的终端
- **滚动回看内存压缩 70-90%**，默认 scrollback 从 10MB 提到 50MB
- **macOS I/O 吞吐量提升 25-55%**（绕过了 pty 每次 1KB 读取的内核限制）
- 修复了 9 个安全漏洞（含 3 个 macOS 特有的远程命令执行风险）
---
## 目标人群与收益
### 强烈推荐 switching 的朋友
- **macOS 上的重度终端用户**：尤其是从 Terminal.app 或 iTerm2 切过来的，性能提升肉眼可见
- **Neovim / tmux / CLI 工具重度用户**：GPU 渲染让 nvim 滚动、`tail -f`、`htop` 完全不卡
- **dotfiles 爱好者**：纯文本配置文件可以丢进 git 仓库，任何机器一条命令复刻整套环境
- **TUI 应用开发者**：Terminal Inspector 是其他终端都没有的调试利器
- **注重隐私的人**：零遥测、零崩溃上报、MIT 协议、无任何云端依赖
- **AI 时代的多终端用户**：libghostty 生态正在快速生长（cmux、blink 等），值得提前布局
### 你能获得的具体收益
1. **效率提升**：原生分屏/标签让你不需要 tmux 就能管理多任务，Quick Terminal 全局下拉快捷键让终端随手可得
2. **视觉减负**：连字支持让 `!=` 直接显示为 `≠`，代码可读性提升；Kitty Graphics 协议让 yazi 这类 TUI 工具能直接预览图片和 PDF
3. **零迁移成本**：zsh/bash/fish 的 shell integration 自动配置，Starship、oh-my-zsh 直接能用
4. **长期价值**：libghostty 的存在意味着你今天形成的配置习惯未来可以在更多场景复用
---
## 竞品对比：它在终端江湖中的位置
| 终端 | 语言 | 平台 | 标签/分屏 | 核心哲学 | 适合谁 |
|---|---|---|---|---|---|
| **Ghostty** | Zig | macOS / Linux | ✅ 原生 | 快 + 功能 + 原生三者兼得 | 想要"开箱即用的最快原生终端" |
| **Alacritty** | Rust | 全平台 | ❌ 无 | 极简主义，只把一件事做到极致 | 已配 tmux/Zellij 的极简主义者 |
| **Kitty** | C + Python | macOS / Linux | ✅ 原生 | 功能丰富 + GPU 渲染 | 想要 Kitty Graphics 原生体验 |
| **WezTerm** | Rust | 全平台 | ✅ 原生 | Lua 可编程 + 内置 multiplexing | 需要 Windows 或重度脚本化 |
| **Warp** | Rust | macOS / Linux | ✅ 原生 | AI + 块状输出 + 团队协作 | 愿意付订阅、要 AI 助手的人 |
| **iTerm2** | Objective-C | macOS | ✅ 原生 | 功能最全的 macOS 老牌终端 | 依赖 Python API 或 Arrangements 的老用户 |
| **Windows Terminal** | C++ | Windows | ✅ 原生 | Windows 官方出品 | Windows 用户 |
数据综合自多个对比文章
**几个关键判断：**
- **vs Alacritty**：性能在伯仲之间（差异在几个百分点内），但 Ghostty 有原生标签/分屏，不用再配 tmux；如果你就是爱极简，Alacritty 仍是首选
- **vs Kitty**：功能高度重叠，Ghostty 的差异化在原生感和 libghostty 生态；Kitty 的优势是更老的成熟度
- **vs WezTerm**：WezTerm 是唯一把 Windows 当一等公民的 GPU 终端，且 Lua 配置可编程性更强；Ghostty 的 macOS/Linux 原生感更强
- **vs Warp**：完全不同的产品。Warp 是订阅制的 AI IDE，Ghostty 是免费开源的纯终端。要 AI 去 Warp，要纯净去 Ghostty
---
## 局限与不足：不吹不黑，这些坑确实存在
### 1. Windows 没有官方版本
这是最明显的硬伤。社区有 `shiweis/ghostty-windows` 分支在努力，但属于第三方 fork，与上游 1.4 的同步还有大量 parity 工作要做（Kitty 剪贴板 MIME、分屏拖放、SSH terminfo 都还没完全对齐）。**Windows 用户短期内建议继续用 Windows Terminal 或 WezTerm。**
### 2. 没有 AI 功能、没有块状输出
如果你习惯了 Warp 的 AI 自动补全、命令块化输出，Ghostty 会让你觉得"怎么什么都没有"。这是有意为之的设计哲学——"Bring your own agent"。
### 3. 没有像 iTerm2 那样的会话管理
- 没有 iTerm2 的 **Arrangements**（重启后恢复窗口布局）
- 没有原生的 **持久化远程会话**（iTerm2 的 tmux integration 那种）
- 没有类似 Warp 的 **工作区保存**
如果你依赖这些工作流，迁移过来需要重新适配 tmux 或 Zellij。
### 4. 配置文件没有 GUI
对不熟 dotfiles 的用户，想改个字体都得自己找 key 名。虽然文档写得不错，但相比 iTerm2 的 GUI 设置面板还是更高的门槛。
### 5. 项目治理的特殊性
Ghostty 在 **2026 年 4 月正式离开 GitHub**，理由是对 GitHub 长期故障的不满（Hashimoto 在一次 Actions 故障中几小时无法 review PR）。**GitHub 仓库现在只是一个每日同步的只读镜像**，真正的开发在 ghostty.org 自己的基础设施上。Issue 和 PR 也不要往 GitHub 提了。
此外，CONTRIBUTING.md 有一条很严格的规定："**你必须理解你的代码**"——如果你无法不借助 AI 工具解释自己的改动，请不要贡献。这是在 AI slop 泛滥时代非常清醒但可能劝退部分贡献者的规则。
### 6. Zig 仍在 1.0 之前
从源码构建 Ghostty 需要跟随 Zig 版本（1.4 需要 Zig 0.16），每次 Zig 升级都可能带来 breaking change。对普通用户无感，但自己编译或打包的同学要做好心理准备。
---
## 结语与行动建议：一款值得放进工具箱的"隐形好工具"
> "好的工具是看不见的" —— GingerBill
Mitchell Hashimoto 在最近一次访谈里引用了这句话。终端大概是最符合这个描述的工具——它整天在你面前，但你几乎从不注意它。Ghostty 的目标不是成为"最能刷存在感的终端"，而是**成为你不再需要思考的那个终端**。
### 最终评分
- **性能**：9.5 / 10（macOS 上无可争议的第一梯队）
- **功能完整度**：8.5 / 10（基础功能全，但缺 AI 和会话管理）
- **开发者体验**：8.5 / 10（配置简单，文档详尽，但 Windows 用户缺位）
- **生态潜力**：9 / 10（libghostty 是终端界近年来最有想象力的设计）
- **社区活跃度**：9 / 10（172 位贡献者参与单个版本，节奏稳定）
- **综合**：**8.8 / 10**
### 三类读者的行动建议
**🎉 macOS 用户（强烈推荐）**
直接一条命令装上：
```bash
brew install --cask ghostty
```
花 5 分钟把主题和字体调好（`ghostty +list-themes`），把 Quick Terminal 快捷键设成 `Ctrl+``，从此体验"呼之即来挥之即去"的终端。如果一周后你不想回 iTerm2，说明它适合你。
**🐧 Linux 用户（分情况）**
- GNOME 桌面用户：`sudo pacman -Syu ghostty`（Arch）或下载 deb，体验接近原生 GNOME Terminal 但快一个数量级
- KDE / 其他 DE：能用但"原生感"稍弱，可以等等 libghostty 生态的 Kirigami / iced 客户端
**🪟 Windows 用户（观望）**
继续用 Windows Terminal 或 WezTerm。可以关注 `shiweis/ghostty-windows` fork 的进展，或者期待 libghostty 生态里出现更成熟的 Win32 客户端。
### 最后的终极评判
Ghostty 不是一款"颠覆终端"的革命性产品——它更像一位行业老将用业余时间交出的**一份"如何把一件普通事情做到极致"的标准答卷**。它没有引入从未有人想过的功能，但它把快、功能、原生这三件事同时做到了行业顶尖水准，并顺手把核心引擎开源成了 libghostty。
**对普通用户，它是一个"装上就不想卸载"的终端；对开发者，它是一份值得阅读的 Zig 工程范本；对整个终端生态，它可能是未来五年的"WebKit 时刻"。** 这三者加在一起，足以让它在 2026 年的开源工具榜上占据一个不可替代的位置。
