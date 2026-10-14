# ntdevlabs/tiny11builder

[GitHub URL](https://github.com/ntdevlabs/tiny11builder)


## Tiny11Builder 深度评测：给 Windows 11 瘦身的开源瑞士刀

> 一款开源工具，能把正版 Windows 11 官方 ISO 重打包成无广告、无强制微软账户的轻量精简镜像

- **Tags**: Windows 11, 系统精简, 开源工具, PowerShell, 装机必备
- **Category**: 开发工具, 系统工具

## Details

# Tiny11Builder 深度评测：给 Windows 11 做一次"胃切除手术"的瑞士刀
> **一句话总结**：Tiny11Builder 是 GitHub 上约 19.9k Star 的开源工具，能把你手里的**正版 Windows 11 官方 ISO** 重新打包成一个"无广告、无强制账户、无 Copilot、无 Edge"的轻量化安装镜像——它不下载任何来路不明的系统，只做"裁缝"，这让它成为目前最值得信赖的 Win11 瘦身方案之一，但也有它啃不动的硬骨头。
---
## 一、背景与痛点：Windows 11 到底"胖"在哪
先说一个几乎所有 Windows 用户都经历过的场面：你花两千块买的新笔记本，开机第一眼不是桌面，而是「开始使用 Microsoft 账户登录」「了解 OneDrive 备份」「试试 Copilot」「Clipchamp 视频剪辑工具已就绪」……Windows 11 的官方安装镜像在近几个版本里塞进了 **Copilot、新版 Outlook、Teams、Clipchamp、新闻天气、Xbox、Solitaire 纸牌、Quick Assist 等 20 多个组件**，而且 OOBE（开箱体验）强制要求联网并登录 Microsoft 账户。
这种"塞得越满越好"的思路，被科技记者 Paul Thurrott 形容为 Windows 的 **Enshittification（劣质化）**——他把"去劣质化"作为长期追踪的选题，而 Tiny11Builder 正是他点名使用的核心工具。
**Tiny11Builder 的诞生逻辑**很直接：作者 NTDEV 是一位罗马尼亚的电子工程系学生，早年因为做一个"把 Windows 每一个版本都装一遍"的视频在 YouTube 上出名（这一期花了 400 小时）。他最初的方案是直接分发一个自己裁剪好的 tiny11 ISO，但用户得从他的云盘下载整个系统，既有信任问题，也没法选择版本和语言。于是他做了开源版的 Tiny11Builder——**把"裁剪权"交还给你自己**，你下载微软官方 ISO，脚本帮你完成瘦身。
用一句话概括它的产品哲学：**"我不卖你鱼，我教你切鱼"**。
---
## 二、核心亮点：它凭什么能做到 19.9k Star
### 1. 三种瘦身档位，丰俭由人
最新版本（2026 年 10 月已升级为 **WinUI 原生图形界面**）提供三种模式，官方 README 给的对照非常清晰：
| 模式 | 移除内容 | 保留内容 | 适用场景 |
|---|---|---|---|
| **Tiny11** | Clipchamp、News、Weather、Xbox、GetHelp、GetStarted、Office Hub、Solitaire、People、PowerAutomate、To Do、Alarms、Mail & Calendar、Feedback Hub、Maps、Sound Recorder、Your Phone、Media Player、Quick Assist、Tablet PC Math、**Edge、OneDrive、Copilot、新版 Outlook** | **Windows Update、Defender、恢复环境** | 日常主力机 |
| **Tiny11 Core** | 在 Tiny11 基础上**再砍掉系统服务、恢复支持，并禁用 Defender 和 Windows Update** | 几乎裸奔 | 虚拟机/一次性测试环境 |
| **Custom** | 你自己勾选每一个 App、组件、功能、服务 | 你保留的 | 进阶玩家 |
**一句话记忆法**：Tiny11 是"正常做饭少放辣"，Tiny11 Core 是"只吃白水煮鸡胸"，Custom 是"自己进厨房端勺"。
### 2. 技术洁癖：只用微软自家的手术刀
这是它和大部分"一键精简工具"最关键的区别。作者在 README 和采访中反复强调一条原则：**全程只调用 Microsoft 自带工具**，不引入任何第三方 EXE：
- **DISM**（Deployment Image Servicing and Management）：微软官方的镜像 servicing 工具，用来挂载、增删组件包
- **oscdimg.exe**（来自 Windows ADK）：微软官方的 ISO 制作工具，用于最后打包成可启动镜像
- **autounattend.xml**：微软官方的"无人值守应答文件"格式，用来跳过强制 Microsoft 账户登录
你可以把 Tiny11Builder 想象成一个**只使用医院自有器械的"术前准备助理"**——它不改病灶，只是精准地剪掉不该在场的组织。这个洁癖带来的最大好处是：**产物 ISO 仍然是正版微软系统的合法衍生物**，Windows Update 和激活机制都能正常工作。
### 3. 2026 年最新升级：WinUI 图形界面 + Turbo 模式
这是评测当下最重要的更新。10 月初 NTDEV 发布了完全重写的 WinUI 版本，官方博客这样描述：
- **图形化界面**：从"打开 PowerShell 敲命令"进化到"双击 Tiny11Builder.exe"，对小白的历史性减负
- **Turbo 模式**：并行批量处理 feature/capability 移除，吃满 CPU 与临时磁盘，大幅缩短构建时间
- **Custom 配置可保存**：你可以把"我喜欢砍掉的清单"存成配置文件，下次一键复用
- **断点续传**：构建中断后可从已提交或已压缩的进度恢复
- **x64 和 ARM64 双架构**：骁龙 X Elite 的 Copilot+ PC 也能用
### 4. 体积效果：实测数据说话
一位用户在 Issue #300 中给出了精确数字：
> 用 Windows 11 IoT Enterprise LTSC 2024 官方 ISO（4.79 GB）→ Tiny11 Core 构建后 **ISO 缩到 2.67 GB**；装完系统后磁盘占用 **7.97 GB**，空闲内存占用约 **1.2 GB**。
Tom's Hardware 也确认新版本采用了微软的 **LZMS 压缩**，让生成的镜像"明显更小"。如果你去搜 Tiny11 的极限数据，社区曾有记录称可以在 2 GB 内存的设备上跑起来，开机占用磁盘 12 GB 左右。
---
## 三、上手实战：五步搞定一个瘦身 ISO
这是老版本 PowerShell 脚本的经典流程，**新版 WinUI 只需把第 4 步换成"双击 Tiny11Builder.exe"**，其余完全一致：
**Step 1 — 下载正版官方 ISO**
去微软官网下载 Windows 11 ISO（务必是官方渠道，不要用任何论坛流传的"精简版"）。
**Step 2 — 挂载 ISO**
双击 ISO 文件，Windows 会自动挂载成一个虚拟光驱（比如盘符是 `E:`），记下盘符。
**Step 3 — 下载 Tiny11Builder**
到 GitHub 仓库点击 Releases 下载 ZIP，解压到本地任意目录。
**Step 4 — 以管理员身份运行**
如果是用图形版：直接右键 `Tiny11Builder.exe` → 以管理员身份运行，选版本、勾选要移除的东西、点 Build。
如果是用脚本版（仓库仍保留）：以管理员身份打开 PowerShell，然后：
```powershell
# 1. 临时放开脚本执行策略（用完记得改回来）
Set-ExecutionPolicy -Scope CurrentUser Unrestricted
# 2. 进入脚本目录后运行
.\tiny11maker.ps1
# 3. 按提示输入挂载的 ISO 盘符（例如 E）
# 4. 选择版本 index（例如 6 = Windows 11 Pro）
# 5. 等待 DISM 处理 + oscdimg 打包，得到 tiny11.iso
# 用完恢复默认执行策略
Set-ExecutionPolicy -Scope CurrentUser Restricted
```
**Step 5 — 用 Rufus 写入 U 盘，正常安装**
把生成的 tiny11.iso 用 Rufus 写到 U 盘，装系统流程和原版完全一样。装完后你会看到一个干净得有点"陌生"的开始菜单，OOBE 阶段也**不再强制要求登录 Microsoft 账户**（autounattend.xml 已经帮你搞定了）。
> ⚠️ **避坑提示**：Step 4 中那行 `Set-ExecutionPolicy Unrestricted` 是把系统脚本策略放开，本质上是允许运行任何未签名脚本。Thurrott 在评测中特别提醒过这一点——**用完一定要改回 Restricted**，不然任何人往你电脑塞一个 PS1 文件都能直接跑。
---
## 四、技术架构：一套 PowerShell 脚本如何"裁剪"操作系统
理解 Tiny11Builder 的底层逻辑，关键在于理解 Windows 镜像的**组件化**本质。可以把一个 Windows ISO 想象成**乐高成品**：它由几百个 `.cab`/`.appx` 组件包拼装而成，DISM 就是官方的"拆件工具"，让你在 servicing 状态下合法地拆掉某几块、重新拼装。
Tiny11Builder 的执行链路大致是：
```
挂载官方 install.wim 到临时目录
  ↓
DISM 移除 Appx Provisioned Packages（Clipchamp、Copilot 等 UWP 预装）
  ↓
DISM 移除 Optional Features / Capabilities（IE 内核、Tablet PC Math 等）
  ↓
DISM 移除特定 System Packages（Edge、OneDrive 等）
  ↓
注入 autounattend.xml 到镜像根目录（跳过 MS 账户）
  ↓
使用 LZMS 压缩重建 install.wim（缩小体积）
  ↓
oscdimg.exe 重新打包为可启动 ISO
```
整个流程**没有反编译、没有修改系统二进制**，只是调用了微软自己提供的"拆卸接口"。这也是它在法律上比"直接分发修改版 ISO"的工具干净得多的根本原因。
**仓库的代码组织也很清爽**：`tiny11maker.ps1`（标准版脚本）、`tiny11Coremaker.ps1`（极限版脚本）、`autounattend.xml`（应答文件）、`docs/`（文档），新版本在此基础上加入了 `src/`（WinUI C# 源代码）和 `tests/`（单元测试），可以看出工程化程度在提升。
---
## 五、谁最该用？能带来什么真实收益
| 用户类型 | 核心痛点 | Tiny11Builder 给你的收益 |
|---|---|---|
| **老电脑/低配机用户** | 8 GB 内存跑 Win11 卡顿 | 装完系统磁盘少 10 GB+，空闲内存占用可压到 1.2 GB 左右，相当于给老机器"续命" |
| **虚拟机/开发测试者** | 每次都要装一个几十 GB 的 Win11 环境 | Tiny11 Core 生成的镜像 2-3 GB，VMware/VirtualBox 里秒级快照、快速重建 |
| **隐私偏执党** | Copilot、遥测、强制 MS 账户 | 系统级移除 Copilot/Outlook/Teams，OOBE 不强制 MS 账户 |
| **IT 管理员/装机商** | 给客户装系统总被询问"这些是干嘛的" | Custom 模式定制统一镜像，批量部署 |
| **轻度办公用户** | 开始菜单里一堆用不上的 Xbox/Clipchamp | Tiny11 标准版就够了，保留 Defender 和 Update，安全无虞 |
**不建议使用的人**：
- 完全不懂电脑、不愿看任何报错信息的小白（虽然现在有 GUI，但出现兼容问题时你仍需读懂日志）
- 想要 100% 微软官方支持的企业用户（修改后的镜像不再受微软官方服务条款保护）
- 已经重度依赖 OneDrive、Copilot、Edge 全家桶的用户（你用了它会痛苦）
---
## 六、同类工具对比：Tiny11Builder 站在哪一格
Windows 瘦身生态里有好几条不同的路线，它们不是竞争关系，而是**不同攻击深度**的选择：
| 工具 | 工作方式 | 攻击深度 | 风险 | 适合谁 |
|---|---|---|---|---|
| **Tiny11Builder** | 重打包 ISO | 移除预装 App + 部分 System Packages | ★★ | 想要干净原版、还能正常更新的人 |
| **NTLite** | 商业 GUI 工具 | 同上，但颗粒度更细，可深度移除组件 | ★★ | 付费企业用户、专业装机商 |
| **Winhance** | 已装系统内调节 | 关闭功能、卸载 App | ★ | 已装好系统、不愿重装的人 |
| **Chris Titus Tech's WinUtil** | PowerShell 脚本 | 关服务、卸 App、改注册表 | ★★ | 已装系统、想后处理 |
| **Atlas OS / ReviOS / FoxOS** | 修改版 Playbook | 深度削服务、禁 Defender/系统还原 | ★★★★ | 游戏/低配极限优化者，能接受不完整功能 |
| **Tiny11 Core（Builder 的一种模式）** | 重打包 ISO | 把 servicing、Defender、Update 全砍 | ★★★★ | 虚拟机一次性测试，不要用于主力机 |
| **Windows 11 LTSC** | 微软官方版本 | 微软自己出的"企业长期支持版"，天生就少很多花哨功能 | ★ | 企业/懂行的人 |
**Tiny11Builder 的独特定位**：它是**唯一一个"完全开源 + 只用微软工具 + 从源头裁剪 + 保留正常更新能力"**的方案。Atlas OS 更激进但会破坏系统能力；Winhance/Chris Titus 工具属于"事后补救"；NTLite 是付费的封闭方案；微软官方 LTSC 虽好但拿不到授权也是问题。
**一个独门优势**：因为产物仍是合法微软镜像的衍生物，**Windows 激活机制完全不受影响**，你原有的数字许可证或产品密钥直接能用。
---
## 七、局限与不足：别把 Tiny11Builder 当神
这是评测里最该认真读的部分。以下是**真实存在的坑**，来自实测用户、评测者和仓库 Issue：
### 1. 砍掉 Edge 的"核弹副作用"
Tiny11 默认移除 Microsoft Edge，但 Edge Webview2 在 Windows 11 里已经不只是浏览器——它是 **Widgets、搜索高亮、Copilot、部分 UWP App 的运行时**。实测会出现：
- 小组件（Widgets）完全失效，报错提示安装 WebView2
- 部分 App（如 Clipchamp）无法启动，直到 WebView2 被重新装上
- 安装 Office 桌面版时会**悄悄把 Edge 拉回来**（Thurrott 亲测，甚至怀疑是点击网页搜索链接触发的），而且这个 Edge 还卸载不掉——"母#$%&er" 是他的原话。
### 2. 有了 OneDrive ≠ Word 不烦你
OneDrive 被移除了，但 Word 等办公软件的"建议保存到 OneDrive"弹窗仍在——**因为这是 Office 的行为，不是 OneDrive 的行为**。Thurrott 在"Enshittification Checklist"里给 Tiny11Builder 打的分并不高：
> "Tiny11 Builder 处理 Windows 劣质化的能力，比我想象中差。它对**强制遥测**、**频繁的功能更新**、**Edge 相关行为**、**Office 弹窗**几乎无能为力——它解决的主要是预装垃圾 App 和硬盘体积。"
**务实的期望值**：它是一个"**体积和预装管理工具**"，不是"**去劣质化全家桶**"。
### 3. Tiny11 Core 是真不能更新
Core 模式把 servicing（系统服务能力）整个砍掉了，这意味着**它无法安装任何累积更新，也无法修复任何系统组件**。Thurrott 明确建议普通用户**不要用 Core 模式**：
> "Tiny11coremaker 不仅把 Windows Defender 和 Windows Update 砍掉了，还让你后期无法重装任何 App、无法继续更新。因此我忽略它，也建议你也忽略。"
Core 模式的定位是**"快速肮脏的开发测试沙盒"**（Tom's Hardware 原话），装在 VM 里跑一次性测试可以，装在主力机上等于自废武功。
### 4. 社区反馈的已知 Bug
Issue #310 记录了用户在 24H2 上遇到的多个构建错误，有些和本地 PowerShell 版本、路径含空格、杀软拦截有关，需要一定的排错能力。Issue #300 里有用户发现某些特定 SKU（如 LTSC）下构建后占用反而比原版大，需要手动关闭 page file 和 hibernation file 才能体现优势。
### 5. 法律灰色区
这是所有 Windows 瘦身工具都绕不开的话题：
- **工具本身开源合法**：脚本代码是作者自己写的，用了微软公开的 DISM/oscdimg 工具
- **使用它修改自己的 ISO 通常被认为合法**：你拥有该 ISO 的使用许可
- **但修改后的产物 ISO 不能公开分发**：微软 Windows EULA 明确禁止 redistribute 衍生的安装介质（"You may not... share, publish, distribute, or lease the software, provide the software as a stand-alone offering"）。
- **微软不提供任何技术支持**：Thurrott 和 The Register 都强调过这点，出问题你只能求助社区。
NTDEV 最初的 tiny11 直接分发 ISO 就踩过这条线，后来改成只发"Builder 工具"让用户自己裁，就是这个考量。
### 6. 版本追赶压力
Windows 11 每年一个大版本（24H2 → 25H2 → 未来），每次都可能塞进新的"砖"（比如 Recall、Click to Do、AI Explorer）。NTDEV 需要持续跟进识别这些新组件，**最新版本刚适配 25H2**，但 Canary/Dev 预览通道用户可能会遇到新版组件未被脚本识别的情况。
---
## 八、结语：它值不值得用？
**客观评级：⭐⭐⭐⭐☆（4.5/5）**
Tiny11Builder 做到了一件很难的事——**在"够狠"和"够稳"之间找到了平衡点**。它不像 Atlas OS 那样激进到会毁掉系统更新能力，也不像 Winhance 那样温和到治标不治本；它像一个**有洁癖但讲道理的外科医生**，只切它确定能切的部分。
**给不同读者的终极建议**：
- 🟢 **如果你是虚拟机用户、老电脑用户、或想要"纯净 Win11"的极客**：直接上，用 Tiny11 标准模式 + GUI 版，几乎零风险。
- 🟡 **如果你想解决 Copilot/Edge 广告弹窗这类"劣质化"问题**：它**只能解决一半**，另一半需要配合 Chris Titus WinUtil、O&O ShutUp10++ 等工具在系统装完后继续处理。
- 🔴 **如果你想用 Tiny11 Core 装主力机**：**绝对不要**。Core 是 VM 专用，装了你就告别系统更新了。
- ⚪ **如果你是企业 IT**：优先考虑微软官方 LTSC 版本，Tiny11Builder 更适合个人和小规模部署。
**下一步行动建议**：
1. 先去 GitHub 仓库读一遍 README（10 分钟）
2. 下载最新的 WinUI 版（不要再用老的 PowerShell 脚本版，除非你想研究原理）
3. 准备一个 8 GB 以上的 U 盘和 Rufus
4. **务必先在虚拟机里试装一次**，确认你想要的功能都在，再装到真机
5. 保存你的 Custom 配置文件，下次重装一键复用
> Windows 11 的"劣质化"是个长期问题，Tiny11Builder 是**目前最干净的开源反击方案**——但它不是银弹，它是你工具箱里的第一把螺丝刀，不是全部工具。
