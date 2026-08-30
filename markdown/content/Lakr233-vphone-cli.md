# Lakr233/vphone-cli

[GitHub URL](https://github.com/Lakr233/vphone-cli)


## vphone-cli：在 Apple Silicon Mac 上运行虚拟化 iOS 的开源神器

> 利用 Apple Silicon 虚拟化框架在本地运行真实 iOS，支持一键越狱与自动化控制。

- **Tags**: iOS, 虚拟化, 越狱, Apple Silicon, 自动化
- **Category**: 开发工具, 安全工具, 虚拟化

## Details

**一句话总结**：vphone-cli 是一款能在 Apple Silicon Mac 上「用 Apple 自己的虚拟化框架真正引导 iOS」并完成从固件下载、打补丁、DFU 恢复到自定义固件安装全流程的 CLI 工具，它还暴露了一个可用于 AI 驱动 E2E 自动化（通过 MCP Server）的宿主控制 Socket。对安全研究、逆向与自动化测试玩家来说，这是一个把「研究型虚拟 iPhone」带到本地的里程碑式项目。
---
## 背景与痛点
在 vphone-cli 出现之前，要想在非真机环境里跑「真正的 iOS」，主要有这么几条路：
- **Xcode 模拟器**：跑的是为 x86/ARM 重新编译的派生环境，内核层面并不真实，很多需要硬件/内核级的测试和攻防都没法覆盖。
- **Corellium**：商业化的云端 iOS 虚拟化平台，能提供接近真机的虚拟 iPhone，但价格不菲且主要面向 B 端/团队。
- **传统越狱+物理机**：需要不断跟随越狱工具更新、维护设备成本高、难以快速克隆/重置，且无法在自动化流水线里「即用即弃」。
痛点很直观：研究者与测试工程师要么缺少「真实的内核与设备环境」，要么为此付出不菲的成本或运维负担。vphone-cli 诞生于这一空档，它利用 Apple 在 Private Cloud Compute (PCC) 研究中使用的 VM 基础设施，并通过 macOS 15 引入的 PV=3（paravirtualization level 3）能力，在本地完成 iOS 虚拟机的全生命周期管理。
## 核心亮点与功能剖析
### 一、基于 Apple Virtualization.framework 的 PV=3 引导
- 不再依赖 QEMU 等全模拟方案，而是直接用苹果官方的虚拟化框架，走 ARM-on-ARM 的半虚拟化路径。这意味着代码执行更接近真机行为，非常适合需要内核/硬件特性的测试与研究。
- 因为使用了 PV=3，所以不能嵌套虚拟化（在 macOS 虚拟机里再跑 vphone-cli 会报错），这一点 README 在 FAQ 里也给了明确提示。
### 二、五档「固件变体」，从轻补丁到全越狱
项目设计了 five variants（从 less 到 exp），用于控制对安全机制的绕过程度：
- less：4 处补丁 + 2 阶段 CFW，近乎「无补丁」，保留 iOS 的缓解措施。
- regular：42 处补丁 + 10 阶段 CFW，绕过 AMFI/SSV/Img4/TXM 等核心校验。
- dev：在 regular 上增加 11 处补丁，共 53 处，补充 entitlement/debug 相关绕过。
- jb：113 处补丁 + 14 阶段 CFW，完成完整越狱，首次启动会自动安装 Sileo、TrollStore 等。
- exp：141 处补丁 + 18 阶段 CFW，在 jb 之上叠加反 VM 检测等研究性补丁，面向深度研究。
这种分层设计非常实用：日常调试用 regular/dev，需要 root 与包管理时用 jb，做高级研究才上 exp，灵活性和可控性都很高。
### 三、一条命令完成「从零到可用 VM」
`vphone-cli vm create` 把整个管线串起来：下载 IPSW、合并、打补丁、DFU 恢复、安装 CFW（自定义固件）、首次启动。一条命令搞定全部，还可以选择变体：`vphone-cli vm create myphone -V jb`。
对于希望快速搭环境的同学，这比手动 DFU/串口/多终端操作要友好得多。
### 四、精细的 CLI 子命令，可分步执行
除了自动化的一键，vphone-cli 把每一步都拆成可独立执行的命令，方便重试与定制：
- 管理：vm list/info/new/config/clone/export/import/rename/delete
- 固件：fw prepare（下载/合并）、fw patch（打补丁）
- 恢复与 CFW：restore、cfw install
- 启停：vm launch/stop
这意味着你可以复用已有的 IPSW 缓存，只更新某一阶段，或在脚本里做更细的流水线控制。
### 五、宿主控制 Socket 与 vphone-mcp（面向 AI 自动化）
vphone-cli 在每个 VM 包内暴露 `vphone.sock`，支持通过 Socket 发送控制命令（截图、触摸、滑动、实体键、剪贴板等），并且每次操作都返回一张内联截图，非常适合用于 AI 驱动的 E2E 测试。README 也明确推荐搭配 vphone-mcp（一个封装 vphone-cli 的 MCP Server）来接入 MCP 客户端（如 Claude Desktop 等）。
简单理解：它把 iOS VM 做成了可以被程序/AI 操控的「屏幕机器人」，不依赖图形界面点击，自动化潜力非常大。
### 六、环境与路径管理清晰
所有数据统一放在 `~/.vphone/`，并提供环境变量（`VPHONE_ROOT`/`VPHONE_LIBRARY_ROOT`/`VPHONE_VENV_DIR`）覆盖，方便把 VM 库放在外置硬盘或共享存储。IPSW、工具链、debs 包都有独立目录，复用度高。
### 七、开发者视角的「一键 DFU 调试」与 FAQ 精细
像 `zsh: killed`、`Virtualization is not available on this hardware`、`Stuck on "Press home to continue"`、`System apps won't install` 等常见坑，README 都给了明确解决建议。特别是：第一次进 iOS 设定不要选日本或欧盟（会有额外监管检查），建议选美国等；以及 EXC_GUARD 崩溃时的 `--force-exc-guard` 补救方案。
这些细节体现出作者在真实使用中踩过坑并持续修补，对上手体验非常有帮助。
## 技术栈与架构解析
### 一、技术栈
- **宿主语言**：Swift（CLI 主程序）、Shell 脚本（构建与工具链准备）、Python（自动化与脚本辅助）。
- **核心依赖**：
  - Apple Virtualization.framework（iOS 虚拟化宿主）
  - Xcode + iOS SDK（交叉编译 guest 守护进程 vphoned）
  - Homebrew 生态的 python@3.13、aria2、wget、gnu-tar、openssl@3、ldid-procursus、sshpass、keystone、cmake、libusb、ipsw、zstd 等作为工具链支撑。其中的 `ldid-procursus` 用于签名处理，FAQ 里提到了其已知 bug 与 `--HEAD` 安装建议。
- **系统要求**：Apple Silicon + macOS 15+（Sequoia），且需要 SIP/AMFI 放宽（`allow-research-guests` + `amfi_get_out_of_my_way=1` 或使用 `amfidont` 白名单）。
### 二、架构设计（高层理解）
可以把 vphone-cli 看作一个「编排器 + 管线」：
- 固件层：负责从 Apple 官方服务器下载 iPhone/CloudOS IPSW，并按版本组合；工具链中包含各类 seal-volume 等工具，用于把 Apple 的研究型基础设施适配到普通环境。
- 打补丁层：按照变体配置对启动链进行二进制补丁，绕过各类签名与安全检查。README 提供了对比文档 `research/0_binary_patch_comparison.md` 说明各组件的补丁差异。
- 恢复层：模拟 DFU 模式进行 `restore`，通过 `usbmux` 等通路与 VM 交互，完成固件刷写；需要多终端配合（一个跑 DFU 启动服务器，另一个执行恢复操作）。
- 自定义固件（CFW）层：在 restore 后安装定制的 deb 包与系统改动，从而实现不同变体能力（从基础调试到完整越狱）。
- 运行时控制层：通过 Unix Domain Socket (`vphone.sock`) 暴露接口给外部，实现对运行中 VM 的输入/输出/状态控制；MCP Server（vphone-mcp）即基于此实现标准 MCP 工具集合，让 AI 客户端直接操控 iOS VM。
整体采用「脚本编排 + 二进制工具链」的组合，核心逻辑在 CLI 和脚本中体现，而真正执行虚拟化和补丁的，多是 Apple 框架与自研/社区工具（如 ldid-procursus、ipsw CLI 等）。
## 上手门槛与部署体验
### 一、前置门槛很高（不适合首次接触 macOS 的用户）
- 必须是 Apple Silicon 的 Mac。
- 必须 macOS 15+（Sequoia）。
- 必须会进入 Recovery 模式调整 SIP/AMFI（`csrutil`、`allow-research-guests`、`nvram boot-args` 等），且清楚这意味着系统安全边界被削弱。
- 需要 Homebrew 生态与命令行经验，尤其是执行多个脚本、解决依赖和路径。
### 二、安装方式多样
- **Homebrew 一键安装**：`brew install zqxwce/tap/vphone-cli`。适合想快速尝鲜的用户。
- **源码构建**：
  - `git clone --recurse-submodules`
  - `./scripts/setup_tools.sh`（安装依赖、构建工具链、创建 Python venv）
  - `./scripts/build.sh`（构建并签名 vphone-cli、打包 .app、交叉编译 vphoned）
### 三、Quick Start 示例（最简流程）
```bash
# 一键创建越狱 VM（含下载、打补丁、DFU 恢复、CFW 安装、首次启动）
vphone-cli vm create myphone -V jb
# 启动 VM
vphone-cli vm launch myphone
```
接下来可以通过 VNC/SSH 连接进入系统（见下文）。
## Demo/代码示例
### 一、手动分步构建 VM（便于理解各阶段）
```bash
# 1. 创建空 VM 包（可指定 CPU/内存）
vphone-cli vm new myphone
# 2. 下载并合并 IPSW
vphone-cli fw prepare myphone --iphone-version 26.1
# 3. 按变体打补丁
vphone-cli fw patch myphone --variant jb
# 4. 启动 DFU 模式（后台）
vphone-cli vm launch myphone --dfu &
# 5. 获取 SHSH 并执行 DFU 恢复
vphone-cli restore myphone --get-shsh
vphone-cli restore myphone
# 6. 停止 DFU 启动
vphone-cli vm stop myphone
# 7. 安装 CFW（需要 sudo，会做 host-mount）
vphone-cli cfw install myphone --variant jb
# 8. 首次启动
vphone-cli vm launch myphone
```
### 二、连接与交互
- **SSH（越狱变体 jb）**：
  ```bash
  ssh -p 22222 mobile@<vm-ip>  # 默认密码 alpine
  ```
- **SSH（regular/dev）**：
  ```bash
  ssh -p 22222 root@<vm-ip>
  ```
- **VNC**：
  ```bash
  vnc://<vm-ip>:5901
  ```
### 三、VM 管理与导出/导入
```bash
vphone-cli vm list
vphone-cli vm info myphone
vphone-cli vm config myphone --cpu 8 --memory 8192
vphone-cli vm clone myphone myphone-2
vphone-cli vm export myphone --out myphone.tzst
vphone-cli vm import myphone.tzst --name restored
vphone-cli vm delete iphone16
```
### 四、自动化控制（通过 vphone.sock 与 vphone-mcp）
- README 明确指出可通过宿主控制 Socket 完成截图、触摸、滑动、硬按键、剪贴板操作，并推荐使用 vphone-mcp 进行 MCP 封装。官方仓库已给出链接与说明。这使得在 AI 客户端（如 Claude Desktop）内直接操控 iOS VM 成为可能，尤其适合「用 Agent 做 E2E」的场景。
## 目标人群与收益
### 一、安全研究与逆向工程
- 痛点：真机成本高、越狱不稳定、难以做快速快照与回滚。
- 收益：本地可克隆、可快照的虚拟 iPhone；通过 jb/exp 变体直接拿到 root 与包管理；可以用 kernel 补丁绕过各类检测机制，加速漏洞复现与 PoC 验证。
### 二、自动化测试 / AI 驱动的 E2E
- 痛点：云平台贵、真机农场运维重、Mock 不覆盖真实行为。
- 收益：基于 vphone.sock/MCP，可把 iOS VM 作为「被控目标」接入自动化流水线，让测试脚本或 AI 自主执行点击/输入/截图校验，每步都有截图返回便于断言与调试。
### 三、应用兼容性与适配验证
- 痛点：新系统或特定地区/监管差异导致的安装失败、行为不一致难以复现。
- 收益：可快速建多个不同版本的 VM 环境，验证应用在不同 iOS 版本/变体上的表现，遇到问题还能直接进 VM 调试。
### 四、教育与演示
- 痧点：课堂/培训中缺乏可复现、可控的 iOS 越狱环境演示。
- 收益：讲师可提前准备好的 VM 镜像，现场 clone 出多台，学生也能在自己的 Mac 上复现，大大降低教学成本与难度。
## 竞品/同类对比
| 维度 | vphone-cli | Xcode iOS 模拟器 | Corellium |
|---|---|---|---|
| 真实性 | 真正的 iOS 内核与硬件虚拟化 | 重新编译的派生环境，非真实内核 | 虚拟化真实 iOS，内核层接近真机 |
| 越狱/Root | jb/exp 变体直接完成越狱与包管理 | 不支持越狱 | 提供即时 root 级访问，云端方案 |
| 成本 | 本地开源，免费（MIT） | 免费 | 按设备/核心订阅制，价格较高 |
| 平台要求 | Apple Silicon + macOS 15 + 放宽 SIP/AMFI | 任意 Mac/Xcode | 无本地要求，浏览器或 API 控制 |
| 自动化 | 提供 vphone.sock 与 MCP Server 可编程控制 | Xcode 命令行/instruments 支持，但无 socket 级别的屏幕控制 | 提供云端 API，但属付费服务 |
| 合规与风险 | 需要放宽系统保护、使用补丁，存在兼容/保修风险 | 官方支持，风险低 | 法院曾就版权与合理使用进行诉讼，判例认为其构成合理使用 |
**结论**：vphone-cli 填补了「本地的、具备越狱能力的、可编程控制的 iOS 虚拟化」空白，比模拟器更真实，比 Corellium 更本地/自由，但代价是更高的上手门槛和系统安全折衷。
## 局限与不足
- **系统要求严苛**：仅限 Apple Silicon + macOS 15+，且必须在 Recovery 模式放宽 SIP/AMFI。这直接排除了企业 MDM 机、主力生产机等环境。
- **嵌套虚拟化不支持**：若你的 Mac 本身就是一台虚拟机，则无法使用；务必使用「非嵌套」的 macOS 15+ 宿主。
- **DFU/恢复流程复杂且对时序敏感**：需要多终端配合，先启 DFU 再做 restore，否则容易失败。FAQ 提醒了这点，但对于新手仍有一定学习成本。
- **已知工具链 bug**：`cfw install` 在重签名某些系统二进制时可能因 `ldid-procursus` 的 UB bug 导致内存飙升与挂起，需要 `brew install --HEAD ldid-procursus && brew link --overwrite ldid-procursus` 并手动 kill 进程。
- **地区/监管限制**：初始化选择日本或 EU 会导致系统应用安装失败，建议选美国等。这是一个环境差异带来的「隐藏坑」，容易被忽略。
- **法律与合规风险**：虽然项目自身是 MIT 许可证，但绕过 Apple 的签名与安全机制涉及操作系统重打包和越狱，建议仅在研究与测试环境使用，且尊重 Apple 软件的使用条款。企业法务评估尤为重要。
## 社区活跃度与生命力（以当前页面可见数据为准）
- Stars/Forks：仓库在 Pulse 页面显示约 9.4k Stars、1.3k Forks，说明受关注度高。
- Issues/PR：当前显示约 18 个 Issues、4 个 Pull Requests，且页面中有「近期」的 Issue 标题（例如 2026 年 6 月与 5 月的讨论），表明社区互动在持续进行中。README FAQ 针对具体 Issue（#291）给出了 `EXC_GUARD` 的补丁建议，也体现出维护者对用户反馈的跟进。
- 趋势与引用：vphone-cli 曾登上 GitHub Trending 榜首，并且出现了基于它的生态项目（vphone-mcp）与第三方脚本（vphone-aio），说明影响力与衍生能力都不错。
## 避坑指南（经验型建议）
- **首次安装前，先在实验机/备机上完整走一遍流程**，包括 Recovery 中的 SIP/AMFI 调整，确认设备与系统符合要求。
- **DFU 恢复务必按顺序**：先在后台启动 DFU，再执行 `restore --get-shsh` 与 `restore`，完成后再 `vm stop`，不要跳步或颠倒顺序。
- **地区设置避开日本与 EU**：初始化选择美国/中国香港等，避免系统应用因额外监管校验无法安装。
- **遇到 `EXC_GUARD` 崩溃**：按 README FAQ 提示，重新执行 `fw patch` 并加上 `--force-exc-guard`，再 restore/install。
- **cfw install 卡住且内存飙升**：大概率是 `ldid-procursus` 的 UB bug，先 `sudo kill -9 <pid>` 杀掉 hung 进程，再用 `brew install --HEAD ldid-procursus && brew link --overwrite ldid-procursus` 重装后重试。
- **不要在主力生产机/受 MDM 管控的 Mac 上玩**：放宽 SIP/AMFI 会降低整体安全性，系统行为也可能出现异常，建议用独立的测试机。
## 结语与行动建议
vphone-cli 是一款将「研究型 iOS 虚拟化」带入本地 CLI 的强有力工具，它利用 Apple 自己的 PV=3 能力，提供了从固件准备到越狱 VM 的完整管线，并具备可编程控制接口，对安全研究、自动化测试与 AI 驱动 E2E 场景都有极高的实用价值。但它也有明确的门槛与风险：仅限 Apple Silicon + macOS 15、必须放宽 SIP/AMFI、流程复杂且涉及越狱与补丁操作，不适合对命令行不熟或不能承担系统风险的场景。
**行动建议**：
- 如果你是一名安全研究员/逆向工程师：在备机上按 README 走一遍 `vm create -V jb`，体验完整流程；后续尝试 `exp` 变体与 vphone-mcp，把 VM 接入你的自动化/AI 工作流。
- 如果你负责 iOS 自动化测试：评估 vphone.sock + vphone-mcp 是否可替代/补充现有的云平台方案，构建本地高频回归环境，降低成本并提升迭代速度。
- 如果你是教学/培训讲师：准备一个已配好的 VM 镜像，用于课堂演示「越狱环境与包管理」，让学生在本地 clone 后亲手操作。
- 如果你只是好奇的普通用户：在清楚 SIP/AMFI 放宽的风险前，不建议在主力机上尝试；可以先在虚拟机中部署 macOS 15（注意 PV=3 不支持嵌套），或者通过文章与视频了解其原理与玩法。
总体来看，vphone-cli 是一把「尖刀」——锋利且专业，适合需要真实、可控、可编程 iOS 虚拟环境的场景。只要你能接受前置门槛与系统折衷，它会成为你工具箱里极为独特的一部分。
