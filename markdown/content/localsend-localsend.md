# localsend/localsend

[GitHub URL](https://github.com/localsend/localsend)


## LocalSend: 开源跨平台局域网文件快传工具

> 开源免费的跨平台局域网文件快传工具，AirDrop的完美替代。

- **Tags**: 开源, 跨平台, 文件传输, 局域网, 隐私安全
- **Category**: 生活效率, 开发工具

## Details

# LocalSend 深度评测：开源、跨平台、局域网“快传”的完全体
---
## 一句话总结
- **LocalSend 是一个完全离线、加密、跨平台的局域网文件/文本快传工具，AirDrop 的“全民替代版”；无需账号、无需云、无需服务器，几分钟内就能在手机、电脑、平板之间用 Wi‑Fi 高速互传。**
---
## 背景与痛点
- **跨系统互传长期是个痛点：** Apple 有 AirDrop、Windows 有“附近共享/Quick Share”、Android 有“快速分享”，但跨品牌/跨系统（比如 Windows↔iPhone、Linux↔Android）几乎只能靠“云盘/微信/邮件”绕一圈，既慢又存隐私风险。
- **局域网能力普遍被浪费：** 绝大多数场景下你的设备都连着同一个 Wi‑Fi，但操作系统并没有提供一个通用、易用、安全的“发现-握手-传输”通道，导致大家不得不注册第三方服务或登录云账号。
- **数据主权与隐私焦虑：** 把照片、合同、源码等传到云端再下载到另一台设备，等于多一次“被留存”的风险；企业/团队内也往往不允许使用公网云盘来传机密材料。
- **开源、跨平台方案长期缺席：** 之前虽然有一些方案（如 PairDrop/Snapdrop 等基于 Web 的），但在安装、系统集成和体验上不如原生应用；而 LocalSend 正式在 2022 年底启动，填补了“真正的 AirDrop 全平台替代”这一空白。
---
## 核心亮点与功能剖析
### 1) 完全离线、无账号、无云
- 不注册、不登录、不加好友，打开即可在局域网发现附近设备并传输；仅依赖本地的 Wi‑Fi/有线网络，无须外网。
- 数据不出局域网，把“云”换成“你的路由器”。比喻：就像把 U 盘变成“空气盘”，点对点直达。
### 2) 真正的全平台覆盖
- 官方支持 Windows、macOS、Linux、Android、iOS、Fire OS/TV。
- 各平台主流包管理器/商店几乎齐备：
  - Windows：Winget、Scoop、Chocolatey、EXE 安装包、便携 ZIP、还有签名的二进制。
  - macOS：App Store、Homebrew、DMG 安装包。
  - Linux：Flathub、Snap、AUR、DEB/TAR/AppImage 等。
  - 移动端：Play Store、App Store、F‑Droid、Amazon 商店、APK。
### 3) 安全性与协议设计
- 采用自定义 LocalSend Protocol + HTTPS/TLS 传输；每个设备在本地生成 TLS/SSL 证书，加密完成后再传输。
- 默认使用 53317 端口（TCP/UDP），需要防火墙放行；官方文档给出了 `ufw`/`firewalld` 的命令示例。
- 提示：当启用 VPN 或 AP 隔离时，可能会无法发现设备，这是因为一些 VPN 会阻断 LAN 流量。
### 4) 多类型内容与工作流
- 支持文件、文本消息、以及“目录”（CLI 支持递归发送，但内部以“文件条目”传输）。
- 支持多接收方、历史记录、Quick Save（在设定前自动接受）、重命名接收文件等能力，覆盖日常“把手机照片批量传电脑”或“把脚本推到多台机器”等场景。
- CLI（命令行）工具 `localsend-cli` 支持：
  - `localsend-cli send 文件1 文件2 目录/`（交互式选择目标）。
  - `localsend-cli send --to "设备别名" report.pdf`（非交互直达）。
  - `localsend-cli send --to 192.168.x.x report.pdf`（按 IP 直达）。
### 5) 体验细节与运维友好
- 提供“便携模式”（在可执行文件同目录下放一个空的 `settings.json`，即把配置随身走）。
- 支持开机仅托盘运行（`--hidden`）。
- 最低版本要求明确（Android 5.0、iOS 12.0、macOS 11、Windows 10）。
- 提供详尽的 Troubleshooting 表格，针对“设备不可见”和“速度太慢”给出平台级诊断步骤。
---
## 技术栈与架构解析（GitHub 项目视角）
### 技术栈
- 主要语言：Dart（Flutter 应用层）。
- 构建/跨平台依赖：Flutter（用 fvm 管理特定版本，避免版本漂移）。
- 底层部分：构建步骤中要求安装 Rust，推测用于 CLI 或某些本地处理模块。
- 网络协议：自研 LocalSend Protocol v2，REST API over HTTPS，使用自签名 TLS 证书，默认端口 53317。
### 架构设计要点
- “节点即服务”的局域网 P2P 模型：每台设备运行本地 HTTP 服务器（REST + HTTPS），负责文件接收与状态暴露；发送端通过广播/发现（UDP）或 IP 直连（TCP + HTTPS）与目标交互。
- 传输层以 HTTPS 为基线，规避明文传输风险；证书自生成，尽管会有浏览器/客户端的“证书不受信”提示，但在应用层被信任即可。
- CLI 与 GUI 协议同源：CLI 使用 LocalSend Protocol v2，与桌面/移动端互通；对脚本/CI 场景非常友好。
### 代码组织与开发者体验（DX）
- 仓库提供清晰的“Getting Started”与“Building”指引：
  - 安装 Flutter（指定版本）与 Rust；
  - `flutter pub get` → `flutter run` 即可本地启动。
- 文档对常见坑（如 AP 隔离、VPN 影响发现、Windows 将网络设为公开/私有的影响）均给出了应对步骤。
- 缺少自动化内联更新机制：官方提示应用不支持自动更新，建议通过商店/包管理器安装。这对桌面端/手动安装的用户有一点运维成本。
---
## 上手门槛与部署体验
### 极简路线（小白）
- 路径 1（移动端）：各应用商店搜索“LocalSend”安装即可；打开后授予必要权限，同一 Wi‑Fi 下的设备即刻互相发现并传输。
- 路径 2（桌面端）：
  - Windows：用 Winget 一条命令安装，或下载 EXE 安装包；首次启动建议在防火墙放行 53317。
  - macOS：App Store 一键安装，或 Homebrew；注意在“隐私-本地网络”权限中开启。
  - Linux：Flathub/Snap/AUR/DEB/AppImage 多选一；通常发行版仓库或社区仓库已提供。
### Docker/容器化
- 官方仓库页未提供开箱即用的 Docker Compose/镜像，但其网络模型简单（开放 53317 TCP/UDP），有心人可以自行封装。这不是当前官方主推的部署方式。
### 典型配置示例（放行端口）
- UFW（Ubuntu/Debian 系）：
  - `sudo ufw allow 53317`
- firewalld（RHEL/CentOS 系）：
  - `sudo firewall-cmd --permanent --add-port=53317/tcp`
  - `sudo firewall-cmd --permanent --add-port=53317/udp`
  - `sudo firewall-cmd --reload`
### 便携与托盘（适合企业/多机场景）
- 便携模式：在 EXE 同目录创建一个空文件 `settings.json` 即可开启。
- 开机隐藏到托盘：使用 `localsend_app.exe --hidden`（新版）。
---
## Demo / 代码示例（最直观上手）
### 1) 发送单个文件（交互式）
- 命令：
  - `localsend-cli send report.pdf`
- 行为：打开已发现设备列表，选择目标后回车即开始传输。
### 2) 按设备别名/IP 直发（非交互）
- 命令（别名）：
  - `localsend-cli send --to "Cute Tomato" report.pdf`
- 命令（IP）：
  - `localsend-cli send --to 192.168.27.26 report.pdf`
### 3) 发送多个文件和目录
- 命令：
  - `localsend-cli send report.pdf photo.jpg ./project-backup`
- 行为：目录会递归收集，保持结构；根目录名与嵌套路径在接收端保留；空目录不被发送（因为发送的是文件条目而非目录条目）。
### 4) 简易 GUI 工作流（无代码）
- 步骤：
  1) 所有设备连到同一 Wi‑Fi；
  2) 打开 LocalSend，必要时授予“本地网络”权限；
  3) 在发送端选择文件/文本，点击目标设备即可接收。
---
## 目标人群与收益
### 适合谁
- 混合设备持有者：同时用 Windows/macOS + Android/iOS 的个人或家庭用户。
- 开发者/运维：在桌面与服务器（Linux）、手机与工作站之间频繁传输脚本、日志、APK/包的人。
- 隐私敏感人士：不希望文件经过云端、不注册账号、拒绝广告与跟踪的用户。
- 企业/团队：希望在内网快速分发材料、降低云端依赖与合规风险。
### 能获得什么
- 时间效率：无需“上传→下载”的云链路，同一局域网内直接以 Wi‑Fi 极速传输，接近物理带宽上限。
- 隐私与安全：端到端加密（HTTPS）、数据不落地于第三方服务器。
- 成本与自由：开源免费（Apache‑2.0），无订阅、无广告、无账号，个人与企业都可自行部署/分发。
- 可控的运维：支持 CLI 与自动化，适合集成到脚本或流水线中。
---
## 竞品/同类对比
| 维度 | LocalSend | AirDrop | KDE Connect | Quick Share（Android/Windows） | PairDrop / Snapdrop |
|---|---:|---|---|---|---|
| 跨平台 | Windows/macOS/Linux/Android/iOS/Fire OS | 仅 Apple 生态 | 桌面（Linux/Win/mac）↔ Android | Android ↔ Windows（部分） | 浏览器 ↔ 浏览器 |
| 是否需要账号 | 否 | 否 | 否（通常需要配对） | 需 Google 登录（部分场景） | 否 |
| 是否离线 | 是（局域网） | 是（蓝牙+Wi‑Fi 直连） | 是（局域网） | 视具体版本 | 是（浏览器 P2P） |
| 安全 | HTTPS/TLS（自签名证书） | Apple 生态加密 | 加密通道 | 取决于 Google 实现 | HTTPS |
| 部署便利 | 多包管理/商店；无自动更新（桌面端需手动更新） | 系统内置 | 需安装客户端 | 系统部分内置或需安装应用 | 打开网页即可 |
| 开源与控制 | Apache‑2.0，完全可控 | 闭源 | GPL | 闭源 | 开源 |
**差异化总结：**
- 对 Apple 生态用户来说，AirDrop 依然更快、系统集成更深，但一旦跨出 Apple 生态就立刻失效。
- 对 Linux/Windows/Android 混合环境，KDE Connect 更偏向“设备同步/遥控”而不仅是“快传”。
- Quick Share 虽然快，但依赖 Google 账号与部分厂商支持，且隐私与策略不可控。
- LocalSend 是唯一在“跨平台 + 离线 + 开源 + 零账号 + CLI 可编程”上全部拉满的方案。
---
## 局限与不足
### 1) 网络环境要求较高
- 必须在同一局域网，且路由未开启“AP 隔离”；很多公共 Wi‑Fi/酒店 Guest 网络会隔离设备，导致无法发现。
- VPN 常常阻断局域网流量，需要在 VPN 设置中允许 LAN 流量或临时关闭。
### 2) 没有统一的自动更新机制（桌面端）
- 官方说明应用不支持自动更新，建议通过应用商店或包管理器安装来降低更新负担。这意味着：
  - 从 EXE/DMG/TAR/DEB 手动安装的用户需要定期关注 Release。
  - 企业内部可能需要自行构建/分发渠道。
### 3) 发现与速度的偶发问题
- 在部分设备/网络环境下，设备发现可能不稳定（解决办法包括 IP 直达、加入“收藏”以便直接探测）。
- 官方已知 Android 平台在特定场景下存在速度问题（与 `flutter-cavalry/saf_stream#4` 相关）。
### 4) 某些 UX/能力待完善
- 暂不支持在 GUI 中直接发送整个“文件夹”（但 CLI 支持目录递归）。
- 初次使用需要理解“防火墙放行端口”和“AP 隔离”的概念，对小白存在一定学习成本。
### 5) 开源协议与商业使用
- 使用 Apache‑2.0，可商用、可修改、可再分发，但需要保留版权声明与 NOTICE 文件。这对大多数企业是友好协议，但在闭源产品中集成仍需合规审查。
---
## 社区活跃度与生命力
- Stars 与生态指标：截至 2026‑09‑13，GitHub Star 约 9.1 万、Fork 约 5k， Discussions 开启；官网自称 5M+ 下载、100+ 贡献者。
- 版本节奏：最新 Release v1.18.2 发布于 2026‑08‑21（时间戳显示为 2026‑08‑21T14:02:01Z），说明更新节奏紧凑且持续。
- Issue/PR 情况：仓库 Open Issues 数量较多（1116）。高活跃项目常见“大量 Bug 报告 + 功能请求”并存，需结合近期 Release 与 PR 合并情况综合判断；从 Release 推进频率看项目仍处于活跃维护期。
---
## 结语与行动建议
- **终极评判：** 如果你要在多台设备之间频繁、安全、快速地传文件/文本，但又不想用云盘、不想受厂商生态限制，那么 LocalSend 是目前综合体验最佳的开源方案之一。它把“局域网 P2P + HTTPS + 跨平台 GUI + CLI 自动化”融为一体，在隐私与效率之间找到了很好的平衡。
- **行动建议：**
  - **小白用户：** 直接从各应用商店安装 LocalSend，确保设备在同一 Wi‑Fi、关闭 AP 隔离，按提示放行端口 53317，即刻开用。
  - **开发者/运维：** 尽早把 CLI 加入工具链，用“别名/IP 直达”做脚本化传输；考虑在公司内部构建/分发一份定制版，方便团队统一版本。
  - **企业/组织：** 将 LocalSend 纳入内网软件白名单，统一通过包管理/商店部署，定期跟随官方 Release 更新；对高安全需求场景，可结合内部防火墙策略限制局域网访问范围。
---
## 补充：核心参考
- GitHub 仓库（主页、协议、构建、CLI 文档）
- GitHub API（仓库元数据、License、最新 Release）
- 官方站点（下载、特性说明、FAQ）
- 技术媒体与社区评测（协议与使用细节）
