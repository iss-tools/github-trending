# omacom/omarchy

[GitHub URL](https://github.com/omacom/omarchy)


## Omarchy 深度评测：Arch + Hyprland 的“主厨发办”式 Linux 发行版

> Omarchy 是一套基于 Arch 与 Hyprland 的 Linux 发行版，强调“主厨发办”理念，统一菜单、剪贴板、主题与工作流，追求既美观又高效的桌面开发体验。

- **Tags**: Arch Linux, Hyprland, Quickshell, DHH, Linux 发行版
- **Category**: 操作系统, 开发工具, 桌面环境

## Details

# Omarchy（omacom/omarchy）深度评测
---
## 一句话总结
Omarchy 是一套“把选择权交还给主厨”的 Linux 发行版/桌面环境：基于 Arch + Hyprland + Quickshell，以统一菜单、统一剪贴板、键盘优先和开箱即用的开发工具链为核心，追求既美观又高效的“omakase computing”体验。
---
## 背景与痛点
- 创作者与定位：Omarchy 由 DHH（Ruby on Rails、Basecamp 之父）发起，主打“主厨发办（omakase）”式理念——预选与调校好几乎一切，让用户直接享受成品而非反复拼装配置。当前仓库与文档由 omacom/Basecamp 组织维护，开源协议为 MIT。
- 痛点一：Arch 生态安装与维护成本高。Arch 系优秀但新手上手门槛高，Hyprland/Wayland 生态又需要持续调校，普通开发者很难兼顾“美感”与“稳定性”。
- 痛点二：桌面碎片化、配置管理难。hyprland.conf、waybar、主题、终端配色、快捷键、菜单等各自独立，一处改动往往会牵一发动全身，缺乏统一的“控制平面”。
- 痛点三：键盘与剪贴板不一致。不同应用的复制/粘贴快捷键互不相通，尤其是终端与 GUI；跨平台用户（Mac/Win/Linux）迁移成本高。
- 痛点四：开发者环境重复搭建。Neovim 配置、Git、语言工具链、Docker 等，每台新机都重复劳动；且不同开发者缺乏一份可复制的“最佳实践基线”。
---
## 核心亮点与功能剖析
### 1) 一套 ISO 级别的“安装即完成”
- 提供 ISO 安装，支持“整盘安装”与“空闲空间安装”，默认全盘加密；另有“为他人安装”模式（首屏 Ctrl+C）、无人值守安装（通过第二块盘提供配置）、以及无加密安装选项，满足个人、企业/ Fleet、与特殊场景的部署需求。
- 安装时间：在现代机器上可在 1 分钟左右完成，老旧机器一般不超过 5 分钟。
- BIOS 提示：需关闭 Secure Boot/TPM；蓝牙键盘在启动阶段无法输入加密密码，需使用有线或 2.4GHz 键盘。
### 2) 技术栈与架构精要
- 底层：基于 Arch Linux + Hyprland（Wayland 平铺窗口管理器）。
- 桌面层：单一长期运行的 Quickshell 实例承载 Omarchy 桌面——状态栏、面板、覆盖层、菜单、服务等都作为插件运行。Quickshell 使用 QML/QtQuick，具有热更新、LSP 支持，适合快速 UI 迭代。
- 配置层：config/ 存放默认配置，可刷新到 ~/.config/；模板化主题（default/themed/*.tpl）与颜色定义（themes/*/colors.toml）支持可换肤与自定义。
- 控制平面：
  - 菜单系统通过 JSONC 声明（default/omarchy/omarchy-menu.jsonc），并可由 ~/.config/omarchy/extensions/omarchy-menu.jsonc 叠加；解析与渲染在 shell/plugins/menu/Menu.qml，逻辑在 MenuModel.js（纯 JS，可被 Node 加载）。菜单支持守卫（when/checked/disabled）、提供者（provider，如 apps、fonts、power-profiles）、别名与搜索。
  - CLI 路由：bin/omarchy 作为主入口，bin/omarchy-* 为命令家族；命令命名有清晰前缀规范（cmd-、capture-、pkg-、hw-、refresh-、restart-、launch-、install-、setup-、toggle-、theme-、update-）。
- 开发者体验（DX）：
  - 统一环境变量 OMARCHY_PATH 由 uwsm 会话环境注入，所有脚本与 QML 依赖该变量定位资源。
  - 内置测试入口：./test/all、./test/cli、./test/shell；图形验收测试在一次性 VM 中运行。配置变更（尤其是涉及菜单和守卫）有自动化测试覆盖。
  - 风格指南与命名规范（Shebang 为 #!/bin/bash，使用 [[ ]] 与 (( ）、提交原子化等）降低协作与维护心智负担。
### 3) 统一菜单与系统控制中心
- omarchy.menu 插件集成了应用启动、系统设置、安装/移除软件、主题切换、默认应用等入口，统一入口带来一致心智模型。
- 驱动菜单的 CLI 示例：
  - omarchy menu（切换根菜单）
  - omarchy menu toggle system
  - omarchy menu summon style.theme
  - omarchy menu close
  - omarchy menu refresh
- 菜单也作为系统的 dmenu，提供 select/input 模式，用于各类选择器（omarchy-menu-select、omarchy-menu-input 等）。
### 4) 统一剪贴板与历史、提醒、通知等“桌面级能力”
- 统一剪贴板：Super + C/X/V 为复制/剪切/粘贴；Super + Ctrl + V 调出剪贴板历史（文本与图片），由 Walker 提供能力。
- 提醒：Super + Ctrl + R 设定倒计时提醒，Super + Ctrl + Alt + R 查看，Super + Ctrl + Shift + R 清空；CLI 亦可用：omarchy reminder 7 'Tea ready'。
- 通知与 Notices：日期/时间、天气、电池等可通过快捷键速览（Super + Ctrl + Alt + T/W/B）。
### 5) 键盘优先、可编程的工作流
- Super + Space 呼出应用启动器；Super + Alt + Space 打开 Omarchy 控制菜单；Super + Escape 打开系统菜单（休眠、重启等）。
- 核心热键：Super + Return（终端）、Super + Shift + Return（浏览器）、Super + J 切换平铺方向、Super + T 切换浮停、Super + F 全屏等，绝大部分操作无需鼠标。
- 将快捷键、菜单与 CLI 三者打通，便于用户选择交互方式；也可以把常用菜单项通过 CLI/脚本快速调用。
### 6) 统一主题与视觉效果
- 多主题体系：官方提供多种主题，可实时切换并统一样式到桌面、终端、Neovim、btop、通知、Waybar、启动器、锁屏等。
- 模板 + 颜色变量：default/themed/*.tpl 使用 {{ variable }} 占位符，themes/*/colors.toml 定义配色，便于维护与自定义。
### 7) 开箱即用的开发者工具链（手册章节覆盖）
- Terminal、Neovim、AI 能力、开发工具、Shell 工具、Shell 函数、TUIs、GUIs、浏览器、商业应用/服务、Web Apps、Gaming、PDF 填写、Windows VM、其他包管理、更新、Dotfiles、Shell 插件、显示器、键盘/鼠标/触控板、网络、系统休眠、硬件认证、字体、壁纸、提示符、品牌、常见调整、自制主题、Mac 支持、故障排查、FAQ、系统快照、安全、双引导安装、无人值守安装等均有对应手册章节。
- 这意味着开发环境不仅是“工具齐全”，而且有系统级的文档与配置管理覆盖。
### 8) 扩展与生态
- Awesome Omarchy 等社区站点聚合主题、资源和工具（如 omarchy-bar 相关插件与组件），表明围绕菜单与栏的生态正在形成。
- 项目存在 agents/skills/ 文档体系，面向参与代码库的人提供“如何修改命令/安装脚本/Shell/图标字体/验收测试/迁移”等指引，提升可协作性和外挂开发体验。
---
## Demo / 代码示例（给开发者）
### 示例 1：将默认配置刷新到用户配置（带备份）
```bash
omarchy-refresh-config hypr/hyprland.lua
```
说明：这会将 $OMARCHY_PATH/config/hypr/hyprland.lua 复制到 ~/.config/hypr/hyprland.lua，并在必要时自动备份。参数只做路径插值与存在性检查，传相对路径即可。
### 示例 2：通过 CLI 驱动菜单
```bash
omarchy menu                    # 切换根菜单
omarchy menu toggle system      # 路由到系统菜单
omarchy menu summon style.theme # 直接打开主题选择子菜单
omarchy menu close              # 关闭菜单
omarchy menu refresh            # 重新解析 JSONC 菜单文件
omarchy menu ping               # 健康检查/连接性验证
```
说明：路由逻辑在 bin/omarchy-menu，通过 IPC 与 Quickshell 的菜单插件通信；菜单入口与别名在 omarchy-menu.jsonc 中定义。
### 示例 3：从脚本进行选择输入（dmenu 模式）
```bash
# 选择模式：返回 label（或 label\tsubtext）
omarchy-menu-select <<'EOF'
  Terminal
  Browser\tOpen default browser
EOF
```
说明：omarchy-menu-select 使用 mode: select 调用菜单插件，通过临时文件握手拿到用户选择；适用于脚本中需要“从列表选一”的场景。
### 示例 4：使用 CLI 设定提醒（键盘/命令行两用）
```bash
omarchy reminder 7 'Tea ready'            # 7 分钟后提醒
omarchy reminder list                     # 查看所有提醒（若支持）
omarchy reminder clear                    # 清除提醒（若支持）
```
说明：对应的快捷键为 Super + Ctrl + R / Super + Ctrl + Alt + R / Super + Ctrl + Shift + R。
### 示例 5：菜单守卫（JSONC）示意
```jsonc
{
  "install.browser.chromium": {
    "icon": "",
    "label": "Chromium",
    "action": "omarchy-pkg-add chromium",
    "disabled": "omarchy-pkg-present chromium"
  },
  "defaults.browser": {
    "icon": "",
    "label": "Browser",
    "checked": "[[ $(omarchy-default-browser) == 'chromium' ]]"
  }
}
```
说明：守卫 when/checked/disabled 使用 bash 条件；菜单在加载与打开时批量执行守卫以获得状态，性能上做了“一次 pacman -Q 快照”和“命令结果复用”等优化。
---
## 目标人群与收益
- 追求“开箱即用 + 美观 + 高效”的开发者：不想把时间浪费在拼装配置，希望获得一套统一、可维护、可复制的工作环境。收益：减少重复配置成本，降低“环境漂移”，提高幸福感与专注度。
- 键盘重度用户：从 macOS/Windows 迁移过来的用户，希望统一剪贴板与快捷键、减少鼠标依赖。收益：统一键位、肌肉记忆跨应用、剪贴板历史提高复制粘贴效率。
- 小团队与统一基线：团队可在同一基线（ISO + dotfiles）上做差异化扩展，减少“每个人的配置都不一样”的运维与协作成本。收益：可复现环境、更顺畅的交接与排错。
- 对主题/美化有兴趣的用户：想要“改一行就改全身”的主题体系，而不是分别修改 N 个应用的配色。收益：快速换肤、降低审美疲劳。
- 希望参与扩展与插件开发的开发者：菜单、栏、提示符等都采用可插拔架构（QML + JS + bash），且有 agents/skills 文档指引，便于写出第一方/第三方插件。收益：在一个清晰的控制平面与数据结构上进行创作，而非与分散的配置文件缠斗。
---
## 竞品/同类对比
| 维度 | Omarchy | Arch + 自行配置（Hyprland + Waybar） | Pop!_OS / Fedora Workstation | 其他“即配即用”Hyprland 配置（如某 dotfiles） |
|---|---|---|---|---|
| 底层与窗口管理器 | Arch + Hyprland + Quickshell | Arch + Hyprland（以及各种栏/锁屏/菜单拼装） | Ubuntu/COSMIC 或 Fedora + GNOME | 通常为 Arch + Hyprland + 组件 |
| 统一菜单/控制平面 | 有（omarchy.menu JSONC + QML/JS 插件） | 无统一控制平面，依赖零散配置与脚本 | 系统设置 + 扩展；无命令式菜单驱动 | 有限，多为配置文件组合 |
| 剪贴板统一与历史 | Super + C/X/V；Super + Ctrl + V 历史 | 需自行安装与配置剪贴板管理器 | 默认不一致，需用户自行改善 | 视具体 dotfiles 而定 |
| 安装与部署 | ISO（整盘/空闲空间）、支持无人值守与无加密 | 需自行安装 Arch 并配置 | 图形安装器，面向大众 | 通常是“在现有 Arch 上跑脚本” |
| 文档与系统维护 | 手册覆盖从基础、导航、应用到配置、安全、双引导、无人值守安装等 | 分散在各项目 Wiki/文档，需自行整合 | 厂商文档与社区支持齐全 | 多为 README 级，维护依赖作者 |
| 定制深度 | 高（菜单、主题、Shell、命令体系均可扩展），但有强烈“主厨意见” | 最大自由度，最高成本 | 中等（扩展/主题） | 中等，但不具备系统级发行版的一致性 |
| 目标用户 | 想要“主厨发办”的开发者/键盘重度用户 | 愿意投入时间的 DIY 爱好者 | 普通桌面用户、开发者 | 想快速体验 Hyprland 的尝鲜者 |
---
## 局限与不足
- **强烈“主厨意见”**：Omarchy 强调 DHH 的个人偏好与默认配置；如果你的工作流、工具链或审美取向与主厨差异很大，可能需要“逆流而行”去做大量定制，反而不如从零开始配置。
- **上手门槛与 BIOS 要求**：需关闭 Secure Boot/TPM，使用有线或 2.4GHz 键盘输入加密密码，这对小白并不友好；双引导也建议双盘，单盘需手动 workaround。
- **桌面与硬件兼容性**：Wayland 与 Hyprland 在部分硬件（尤其部分笔记本、外接显示器/多屏、高刷屏）上可能存在兼容与调优问题；此外对 NVIDIA 的支持情况需参考具体版本与文档。
- **安全默认设置争议**：社区曾有讨论指出 Omarchy 的某些安全默认配置（如早期版本防火墙未实际开启、SSH 默认开启且保持不安全的默认值）不适合普通用户；需要理解其“面向开发者的 opinionated”取向，并按需加固。
- **学习曲线**：尽管有手册与统一入口，但首次接触 Hyprland + 键盘优先 + 菜单路由的新用户，仍需记忆一些关键快捷键与概念；尤其是从传统桌面环境迁移的用户，会经历一段适应期。
- **维护与依赖上游**：底层基于 Arch + Hyprland + Quickshell，Omarchy 自身的升级与迁移依赖上游生态的演进；若上游组件发生不兼容变更，Omarchy 也需要跟进迁移或适配。
- **并非 Docker/容器一键部署**：Omarchy 更接近“发行版 + 桌面环境体系”，而不是一个可随意丢进 Docker 的微环境。想要在容器内体验“Omarchy 风格”的工具链，更适合抽取其 dotfiles/配置进行组合，而非运行整个桌面。
---
## 结语与行动建议
- 如果你：
  - 是开发者或键盘重度用户，希望“安装即用，少折腾配置”；
  - 认同“主厨发办”理念，不想从头拼装 Hyprland + Waybar + Neovim + 剪贴板 + 主题等；
  - 需要为团队提供一个可复制的、美观且高效的 Linux 基线；
  那么 Omarchy 值得一试：下载 ISO、准备双盘或空盘、关闭 Secure Boot/TPM、使用有线键盘，按 Getting Started 进行安装。
- 如果你：
  - 对底层与配置细节有强掌控欲、追求最大自定义度；
  - 所在环境对 Secure Boot/TPM 有强制要求、或硬件与 Wayland/Hyprland 兼容性不佳；
  - 倾向于渐进式、模块化引入（比如只取用 Neovim 配置或菜单系统），而不希望全套替换；
  则建议从 Fork 与借鉴角度入手：参考其菜单设计、Shell/CLI 路由、主题模板与 agents/skills 文档，将你喜欢的组件嫁接到自己的 Arch 或其他发行版上。
- 无论如何，Omarchy 在“统一控制平面 + 菜单驱动 + 键盘优先 + 美观开箱”这一方向做出了非常系统的尝试，其经验与模式（尤其是 Quickshell + JSONC 菜单 + 守卫 + CLI 路由的组合）对桌面环境的“可编程化”具有启发意义，值得深入研究和二次创作。
