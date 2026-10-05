# Gaurav-Gosain/tuios

[GitHub URL](https://github.com/Gaurav-Gosain/tuios)


## TUIOS 深度评测：把桌面级窗口管理器搬进终端的野心之作

> 用 Go 打造的终端窗口管理器兼复用器，融合 tmux 的会话持久化与 i3 的平铺理念，号称 tmux meets modern window manager。

- **Tags**: 终端复用器, Go开源项目, 窗口管理器, tmux替代, TUI
- **Category**: 开发工具, 效率工具, 终端工具

## Details

I have gathered enough information about TUIOS. Let me now compose the comprehensive deep-research evaluation article based on the data collected.
# TUIOS 深度评测：把"桌面级窗口管理器"搬进终端的野心之作
> **项目地址**：https://github.com/Gaurav-Gosain/tuios
> **作者**：Gaurav Gosain（阿联酋阿布扎比的 BSc 计算机科学学生，专攻 AI）
> **技术栈**：Go + Charm 生态（Bubble Tea v2 / Lipgloss v2 / Wish v2 / go-pty / Ultraviolet）
> **开源协议**：MIT
> **当前版本**：v0.7.x（Bubble Tea v2.0.2、Lipgloss v2.0.2 等稳定依赖）
---
## 一句话总结
**TUIOS 是一款用 Go 写的"终端窗口管理器 + 终端复用器"，把 i3 的平铺理念、vim 的模态交互、tmux 的会话持久化和 Kitty 的图形能力塞进了一个二进制文件里，号称 "tmux meets a modern window manager"。** 它不是又一款 tmux clone，而是用现代 TUI 框架重写了"终端内多窗口"这件事——如果你已经受够了 tmux 那套古早的 prefix 键盘玄学，又不想被迫去学 i3/Sway，它值得一试。
---
## 一、背景与痛点：为什么 2026 年还有人要重写 tmux？
在 TUIOS 出现之前，终端复用这条赛道一直被几个"活化石"把持：**tmux 老而弥坚但 UI 粗糙、配置反人类**；**Zellij 体验现代但 Rust 生态偏保守**；**WezTerm / Ghostty 强大但更像"终端模拟器"而非"窗口管理器"**。它们之间存在一个明显的空白地带——
> "我想要一个**能用鼠标拖窗口、有工作区概念、有命令面板、还能在终端里看图片**的多路复用器，而不是一个需要背 300 个快捷键的 1980 年代遗产软件。"
TUIOS 的作者 Gaurav Gosain 是一位在阿布扎比读书的 CS 本科生（专攻 AI），此前已经写过 gollama（终端版 Ollama 对话工具，148★）和 ollamanager，对 Charm 生态相当熟稔。他把 i3/Sway 的"平铺 + 工作区 + 模态"哲学、tmux 的 daemon 会话模型、以及 Vim 的 hjkl 直觉一起打包，在 Charm Bubble Tea v2 这个尚未大量投产的新框架上，做了一次"如果能重来"式的重造。
**核心解决的痛点**可以归纳为三条：
1. **终端内没有"真窗口管理"**：tmux 的 pane 是分割矩形，不能拖、不能最小化、不能任意摆放。
2. **模态割裂**：tmux 的 prefix 键和 shell 输入混在一起，新手极易误触发。
3. **图形能力缺失**：tmux 对 Kitty Graphics / Sixel 几乎无支持，想 `mpv --vo=kitty` 基本没戏。
---
## 二、核心亮点与功能剖析
### 2.1 真正的"窗口"，不是"分屏"
这是 TUIOS 最反传统的卖点。它把每个终端会话当作一个**可独立拖动、缩放、最小化、全屏**的"窗口"，底部有一条 dockbar 显示所有窗口，右上角还有时钟——**体验上非常接近一个简化版桌面环境**。
```bash
# 拖动窗口到屏幕边缘 = 自动 snap 到半屏 / 全屏 / 四分之一
# 鼠标点击 dockbar = 切换焦点
# 最小化后窗口收纳进 dock，随时恢复
```
### 2.2 模态设计：像 Vim 一样管理终端
TUIOS 默认启动在 **Window Management Mode**（窗口管理模式），此时所有按键都用于操作窗口（`n` 新建、`h/l` 左右 snap、`t` 切平铺、`Alt+1~9` 切工作区）；按 `i` 或 `Enter` 进入 **Terminal Mode**（终端模式），输入直通 shell。
这个设计带来的最大红利是：**几乎所有单键快捷键都可以用，且不会和 shell 冲突**——这是 tmux 用 20 年也没解决的问题。
### 2.3 三种平铺布局 + 自由浮动
- **BSP Tiling**：二叉空间分割树，支持 spiral / smart-split（按宽高比智能分割）
- **Master-Stack**：经典 DWM 风格，一个主窗 + 侧边堆叠
- **Scrolling Layout**：niri 风格的横向无限条带列布局（这个在终端复用器里非常罕见）
可以随时用 `Prefix+Space` 在"完全平铺"与"自由浮动"之间切换，**共享边框模式**（`--shared-borders`）可以画出 tmux 风格的细分隔线。
### 2.4 Tape Scripting：终端工作流的可执行文档
这是笔者个人认为**最被低估的功能**。TUIOS 自带一个 DSL（`.tape` 文件），可以把"打开三个窗口、分别跑 vim / go build / go test"这种操作写成脚本回放：
```tape
# dev-setup.tape
WindowManagementMode
EnableTiling
Sleep 300ms
NewWindow
Sleep 500ms
TerminalMode
Type "vim main.go"
Enter
WindowManagementMode
NewWindow
Sleep 500ms
TerminalMode
Type "go run ."
Enter
WindowManagementMode
NewWindow
Sleep 500ms
TerminalMode
Type "go test -v ./..."
Enter
```
```bash
# 交互式回放（看动画）
tuios tape play dev-setup.tape
# CI/CD 无头执行
tuios tape run dev-setup.tape
# 对已运行的 daemon 会话远程注入
tuios tape exec -s dev dev-setup.tape
```
更妙的是它支持 `WaitUntilRegex "completed" 60000` 这种**条件等待**，可以精确卡在长任务结束后再执行下一步，比 asciinema 的纯录播实用得多。
### 2.5 Kitty 图形协议：终端里的"真·视频"
TUIOS 在 v0.7.0 里做了 Kitty Graphics 的 flicker-free 优化（复用 image ID），官方直接宣称 `mpv --vo=kitty` 可以跑，还支持 shm 透传和六位图协议。这意味着你可以在一个 pane 里看视频、另一个 pane 里写代码，全程不需要退出终端。配合 Ghostty / Kitty / WezTerm 这类现代终端模拟器使用，效果最佳。
### 2.6 会话持久化 + 多客户端
Daemon 模式完整继承了 tmux 的精髓：`tuios new mysession` 创建、`tuios attach` 重连、`Ctrl+B d` 分离。**v0.7.0 还加入了 Session Resurrection**——daemon 重启或系统重启后，窗口结构和工作目录能自动恢复。此外支持**多客户端同时 attach 同一个 session**，这对结对编程和远程协助很友好。
### 2.7 其他值得一说的细节
- **命令面板**：`Ctrl+P` 模糊搜索 30+ 个动作，类似 VS Code 的 Ctrl+Shift+P
- **Aggregate View**：跨所有工作区搜索所有窗口，带预览
- **Multifocus**：按住 Ctrl 点击多个 pane，可以同时向它们广播键盘输入（运维神器）
- **Showkeys Overlay**：把按键投影到屏幕上，直播和录课友好
- **10,000 行 scrollback + Vim 式 Copy Mode**（`/`、`?`、`v`、`y` 全套）
- **交互式滚动条**：可以鼠标点右边的 border 拖动跳转
- **SSH Server Mode**：跑成 SSH 服务器远程复用
- **Web Terminal**：独立的 `tuios-web` 二进制，浏览器访问
---
## 三、架构解析：MVU + 事件驱动 + 内存池
TUIOS 的架构文档写得相当扎实，代码组织清晰，这是一个 Go 新手也能从源码学到东西的项目。
### 3.1 技术栈（全是 Charm 家族）
| 组件 | 作用 |
|---|---|
| **Bubble Tea v2** | MVU（Model-View-Update）TUI 框架，事件驱动 |
| **Lipgloss v2** | 终端样式、border、Canvas 分层合成 |
| **Wish v2** | SSH server 框架（基于 Bubble Tea） |
| **go-pty (xpty)** | 跨平台 PTY（Unix `/dev/ptmx` + Windows ConPTY） |
| **Ultraviolet** | Charm 的 VT100/ANSI 终端模拟库 |
| **内部 vendored VT emulator** | 完整的 ANSI 解析 + 10,000 行 scrollback |
### 3.2 目录结构（干净得不像个人项目）
```
internal/
├── app/         # 窗口管理器、渲染、样式缓存、动画
├── terminal/    # Window 结构体 + 各平台 PTY
├── vt/          # ANSI 解析器、CSI 处理、scrollback
├── input/       # 模态路由、键盘/鼠标分发、40+ action
├── config/      # TOML 配置加载
├── layout/      # BSP 平铺算法
├── pool/        # 内存池
└── theme/       # 主题管理
```
### 3.3 性能优化是下过真功夫的
v0.7.0 的 changelog 里有几条非常硬核的优化：
- **事件驱动渲染**：不再用固定频率 tick，PTY 数据到达才渲染——**空闲时 CPU 接近 0%**
- **样式 LRU 缓存**：以 sequence 检测变更，**减少 40-60% 的内存分配**
- **视口裁剪**：屏幕外/最小化的窗口完全跳过渲染
- **热路径清理**：从每帧 ~2 万次的样式对比里移除 `defer/recover`
- **Kitty 图形 ID 复用**：视频帧原地替换，彻底消除闪烁
- **Mode 2026 同步输出**：所有图形输出包裹在 sync 区，无撕裂
### 3.4 MVU 核心代码一眼看懂
```go
type OS struct {
    Windows         []*terminal.Window
    FocusedWindow   int
    Mode            Mode    // WindowManagementMode | TerminalMode
    CurrentWorkspace int    // 1-9
    AutoTiling      bool
    // ... 50+ more fields
}
func (m *OS) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    switch msg := msg.(type) {
    case tea.KeyPressMsg:  return input.HandleKeyPress(msg, m)
    case tea.MouseClickMsg: return input.HandleMouseClick(msg, m)
    case TickerMsg:        // 动画、窗口变化检测
    }
    return m, nil
}
```
对熟悉 Elm / Redux 的朋友来说，这套模式几乎是"终端界的 React Hooks"——状态变化完全可预测，测试起来极其舒服。
---
## 四、上手门槛与部署体验
### 4.1 安装路径非常友好
```bash
# Homebrew（macOS / Linux）
brew install tuios
# Arch Linux (AUR)
yay -S tuios
# Nix
nix run github:Gaurav-Gosain/tuios#tuios
# 通用脚本
curl -fsSL https://raw.githubusercontent.com/Gaurav-Gosain/tuios/main/install.sh | bash
# Go install
go install github.com/Gaurav-Gosain/tuios/cmd/tuios@latest
# Docker（想白嫖体验一下最方便）
docker run -it --rm ghcr.io/gaurav-gosain/tuios:latest
```
**硬性要求**：终端需支持 true color。要完整体验 Kitty Graphics，推荐 Ghostty / Kitty / WezTerm。
### 4.2 5 分钟上手路径
官方 Quick Start 写得非常好，给你省个跳转：基本流程就是：
```
1. 输入 tuios 启动，默认在 Window Management Mode
2. 按 n 创建第二个窗口
3. 按 i 进入 Terminal Mode，正常敲 shell
4. Ctrl+B, d 回到 WM 模式
5. 按 t 开启平铺，Alt+1~9 切工作区
6. Ctrl+B, [ 进 copy mode 用 hjkl 翻滚 scrollback
```
**文档完整度**是个人项目里少见的"企业级"水平——Mintlify 托管、自带 `llms.txt` 方便 LLM 阅读、架构文档带 Mermaid 图和源码行号引用。这对二次开发贡献者非常友好。
### 4.3 配置系统
TOML 配置 + 100+ 可自定义键绑定，支持自定义 leader key、主题、border 风格：
```bash
tuios config edit       # 在 $EDITOR 中打开配置
tuios keybinds list     # 列出所有快捷键
tuios config path       # 查看配置文件路径
```
---
## 五、竞品对比：TUIOS 在赛道里的位置
| 维度 | **TUIOS** | **tmux** | **Zellij** | **WezTerm** | **Ghostty** |
|---|---|---|---|---|---|
| 语言 | Go | C | Rust | Rust | Zig |
| 定位 | 窗口管理器 + 复用器 | 纯复用器 | 复用器（带 UI） | 终端模拟器 + 复用 | 终端模拟器 |
| 模态设计 | ✅ 双模式 | ❌ prefix 混杂 | ⚠️ 部分模态 | ❌ | ❌ |
| 鼠标拖拽窗口 | ✅ | ❌ | ⚠️ 有限 | ⚠️ | ❌ |
| 工作区 | ✅ 9 个 | ⚠️ window 概念 | ⚠️ tabs | ⚠️ tabs | ⚠️ tabs |
| 命令面板 | ✅ Ctrl+P | ❌ | ✅ | ❌ | ❌ |
| Kitty Graphics | ✅ 完整支持 | ❌ | ⚠️ 部分 | ✅ | ✅ |
| Session 持久化 | ✅ daemon + 复活 | ✅ | ✅ | ⚠️ | ❌ |
| Tape 脚本自动化 | ✅ 独有 DSL | ❌ | ❌ | ❌ | ❌ |
| 成熟度 | 🌱 早期（v0.7） | 🏆 极稳定 | 🟡 成熟 | 🟡 成熟 | 🌱 快速演进 |
| 生态位 | "下一代候选者" | "默认选择" | "tmux 现代版" | "全合一" | "性能标杆" |
**TUIOS 的独特竞争力**在于它**同时**做到了"模态 + 真窗口管理 + 图形协议 + 脚本自动化"这四件事。Zellij 有 UI 但没有真正的窗口拖拽；WezTerm 功能强但本质是"终端模拟器 + 内置复用器"；tmux 则完全属于另一个时代。
当然，**tmux 的生态位依然是"SSH 到任何一台服务器都能找到"的默认选择**——TUIOS 目前更多是"本机/自控服务器上的主力工具"。
---
## 六、目标人群与收益
### 🎯 强烈推荐
1. **重度 Vim 用户**：模态设计让 hjkl 直觉延伸到窗口管理，学习曲线几乎为零。
2. **i3 / Sway / DWM 用户**：把平铺哲学从桌面带到 SSH 会话和远程服务器上，工作区 + BSP 完美对应。
3. **DevOps / SRE**：Multifocus 广播输入 + 9 工作区隔离 prod/staging + daemon 复活，运维场景命中精准。
4. **内容创作者**：Showkeys Overlay + 录制 Tape 脚本，做终端演示视频极其方便。
5. **想学 Go + TUI 开发的工程师**：架构文档 + 源码注释 + MVU 模式，是学习 Charm 生态的绝佳样本。
### 🤔 可以试试
6. **终端美学爱好者**：命令面板、动画、dockbar、时钟这些细节能满足你的"精神洁癖"。
7. **被 tmux prefix 键搞崩溃的新手**：模态设计比 prefix 学习成本低很多。
### ⚠️ 暂时不建议
- **服务器环境经常 SSH 到陌生机器**：远程机器大概率没装 TUIOS，还是得靠 tmux。
- **对稳定性要求极高、不想折腾**：v0.7 还在快速迭代，API 可能破坏性变更。
- **Windows 主力用户**：虽然 ConPTY 支持，但生态重心明显在 Unix-like。
---
## 七、局限与不足（客观说）
尽管亮点满满，TUIOS 目前确实有几个真实存在的问题：
1. **项目还年轻**：目前约 764 star，作者是一名在校学生。相比 tmux 30k+ star 和 Zellij 的 20k+ star，社区规模、插件生态、第三方主题都还很小。
2. **Kitty Animation 协议未支持**：官方 README 明确标注 `a=f, a=a, a=c` 不支持。
3. **Sixel 仍标为 experimental**：没有像素级裁剪，可能与某些窗口有边缘 bug。
4. **Kitty Text Sizing (OSC 66) 已知问题**：在 scrollback 和窗口重新定位时有 bug。
5. **Bubble Tea v2 刚稳定**：依赖栈相对新，某些极端场景下的兼容性仍需观察。
6. **强制要求 true color 终端**：老旧终端（比如某些 SSH 工具默认的 xterm-256 色以下）直接劝退。
7. **Windows 体验是二等公民**：ConPTY 虽然支持，但主题/动画/图形协议基本是 Unix 优先。
8. **社区内容少**：中文教程、深度踩坑文章几乎空白，遇到问题主要靠 Issue 和源码。
> **一句话判断**：把它当"值得押注的新势力"用，别把它当"明天就要上生产"的工具。
---
## 八、结语与行动建议
TUIOS 是那种**让你看完 README 就想立刻 `brew install` 试试**的项目——不是因为炒作，而是因为它精准踩中了"现代终端用户"的几个真实痛点：**模态交互、真窗口管理、图形协议、可脚本化**。它把 Charm 生态最新一代框架（Bubble Tea v2 / Lipgloss v2）的能力发挥得淋漓尽致，架构清晰、文档详实、性能优化下过真功夫，这些"基本功"在个人项目里相当罕见。
**给你的行动建议**，按投入度排序：
| 投入度 | 建议动作 |
|---|---|
| 🟢 5 分钟 | `docker run -it --rm ghcr.io/gaurav-gosain/tuios:latest` 白嫖体验 |
| 🟡 30 分钟 | `brew install tuios` 后跟着官方 Quick Start 走一遍模态流程 |
| 🟠 1 小时 | 把日常工作流写成 `.tape` 脚本，体会 Tape DSL 的爽点 |
| 🔴 深度参与 | 去看 `internal/app/render.go` 和 `internal/vt/emulator.go` 的源码，可以顺便给 Charm 生态提 PR |
**终评**：**⭐⭐⭐⭐（4/5）**
- 它不是一个"已经能完全替代 tmux"的工具，但它是一个**方向值得所有人关注**的工具。如果 Charm 生态持续成熟、作者能熬过毕业季，TUIOS 有潜力成为"下一代终端复用器"这个话题里的重要名字。在此之前，把它放进你的 `~/bin`，作为本机开发环境的主力工具，是性价比最高的用法——**让你的远程服务器继续交给 tmux，把本机的多窗口美学交给 TUIOS**，也许是目前最优雅的搭配。
