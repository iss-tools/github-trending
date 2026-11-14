# martin-olivier/airgorah

[GitHub URL](https://github.com/martin-olivier/airgorah)


## Airgorah 深度评测：把 aircrack-ng 命令行装进现代 GUI 的 WiFi 安全审计工具

> 基于 Rust+GTK4 的开源 WiFi 安全审计图形化工具，让 aircrack-ng 的复杂命令行流程变成可视化点点鼠标就能完成的操作

- **Tags**: WiFi安全, 开源项目, aircrack-ng, 渗透测试, Linux
- **Category**: 开发工具, 网络安全, Linux 工具

## Details

# Airgorah 深度评测：把 aircrack-ng 那把"瑞士军刀"装进一个 GTK4 图形外壳
---
## 🎯 一句话总结
**Airgorah 是一款用 Rust + GTK4 编写、基于 aircrack-ng 工具套件构建的 WiFi 安全审计 GUI 软件**——它把原本散落在终端里的 airodump-ng、aireplay-ng、aircrack-ng、macchanger 等十几条命令串成了一张可视化仪表盘，让"自家路由器到底安不安全"这件事，从背诵命令行的苦差事，变成点点鼠标就能跑通的流程。
它值得你关注的核心原因只有一个：在 Linux 世界里，**它可能是目前把"WiFi 安全审计"这件事做得最顺手、最现代、最不像"黑客玩具"的图形工具**。
---
## 🛡️ 先把丑话说在前面（法律与伦理红线）
在继续往下讲之前，必须先板起脸说三句话：
> **Airgorah 是一把"双刃剑"**。它能对**你自己拥有或获得明确书面授权**的 WiFi 网络进行安全测试。对任何不属于你的网络执行 deauth 攻击、抓握手包、跑字典，在绝大多数国家都属于**违法行为**，轻则行政处罚，重则刑事责任。
>
> 项目作者 Martin Olivier 在 README 第一段就写得很明白：*"Airgorah is designed to be used in testing and discovering flaws in networks you are owner of. Performing attacks on WiFi networks you are not owner of is illegal in almost all countries."*
合法的使用场景只有这几类：
- **测试自己家的路由器**：看看家里那台 5 年没改过密码的 WPA2 路由器，撑不撑得住一次字典攻击。
- **甲方书面授权的渗透测试**：签订 Scope 与授权书之后的红队/安全评估工作。
- **CTF 竞赛或 Hack The Box / TryHackMe 的无线靶场**。
- **企业 WiFi 自查**：IT 部门排查自家办公网有没有还在用 WEP、WPA-TKIP 这类"祖传加密"。
下面进入正题。
---
## 🌅 背景与痛点：为什么要再造一个轮子？
### aircrack-ng 的"痛"
如果你用过 aircrack-ng，一定熟悉这条"流程图"：
```
airmon-ng start wlan0          # 开监听模式
airodump-ng wlan0mon           # 扫描附近 AP
aireplay-ng -0 5 -a XX:XX -c YY:YY wlan0mon   # deauth 抓握手
aircrack-ng -w wordlist.txt capture.cap       # 跑字典破解
```
任何一步参数写错，就得回过头重跑。更别提：
- **四条命令之间靠 `.cap` 文件名手工传状态**，新手极易踩坑；
- **终端输出五颜六色但读不懂**，哪些是 AP、哪些是客户端、握手包抓没抓到，要靠肉眼在滚动的日志里找；
- **想批量扫描 2.4G + 5G 双频**，还得自己拼 `--band abg` 这种参数。
### Fern、Wifite 这些"老前辈"也各有短板
| 工具 | 现状 | 痛点 |
|---|---|---|
| **Fern WiFi Cracker** | PyQt 写的，更新缓慢 | UI 老旧，Python 2 遗留问题不少，依赖容易装崩 |
| **Wifite2** | Python CLI 自动化 | 全自动一键，但**几乎无法手动控制细节**，适合"傻瓜式"，不适合学习 |
| **纯 aircrack-ng** | 终端工具，永远维护 | 学习曲线陡，参数组合复杂 |
Airgorah 的设计者显然看清了这片空白：**"要 GUI，但不要黑盒；要自动化，但保留每一步的可见性"**。
### 作者背景
Airgorah 的作者是 **Martin Olivier**（GitHub: martin-olivier），法国巴黎 EPITECH 出身，目前在 **6WIND** 担任软件工程师——这家公司做的是基于 Linux 的高性能网络数据平面（DPDK、VPP 那一挂），所以他对网络底层不是"业余爱好"级别的了解，而是**每天吃饭的活儿**。
他同时也是知名开源库 **dylib**（C++ 跨平台动态库加载封装，330+ stars）的作者，工程素养相当扎实。
---
## 🏗️ 技术栈与架构解析
### 技术选型为什么是 Rust + GTK4？
这套组合在 GUI 工具圈子里其实相当"冷门"，但用在这里非常合理：
| 选型 | 为什么合理 |
|---|---|
| **Rust** | 内存安全 + 零成本抽象。做网络抓包这种**高频 I/O + 复杂数据结构解析**的活儿，Rust 不像 Python 那样会卡帧，也不像 C++ 那样随时给你埋个段错误 |
| **GTK4** | 原生 Linux 体验，GNOME 体系下的现代 UI 框架，**同时兼容 X11 与 Wayland**——这点很关键，因为 Kali / Ubuntu 22.04+ 默认已经是 Wayland 了 |
| **aircrack-ng 作为后端** | 不重新造轮子，复用社区几十年打磨下来的抓包/注入/破解能力 |
| **polkit 提权** | 不要求整个程序以 root 运行，只在需要时弹一次认证框 |
### 架构设计的精妙之处：GUI 普通用户 + Agent 提权
这是 Airgorah 在**安全设计**上最值得点一个赞的地方。传统做法是把整个 GUI 用 `sudo` 跑，这意味着：
- 一个 UI 框架以 root 身份跑着，攻击面瞬间爆炸；
- 任何 GUI 库的 0-day 都可能直接被打成 root shell。
Airgorah 的做法是：
```
┌──────────────────────────┐         ┌──────────────────────────┐
│  airgorah (GUI)          │         │  airgorah-agent          │
│  以普通用户身份运行       │ ──────► │  小体量特权进程            │
│  跑在 X11 或 Wayland     │ polkit  │  只负责"必须 root"的事     │
│                          │ 一次认证 │  (切换监听模式、注入包)   │
└──────────────────────────┘         └──────────────────────────┘
```
**"权限最小化"** 这个在 Web 后端讲烂了的原则，被作者落到了一个桌面安全工具上。这是一个相当成熟的工程判断。
### 项目结构
仓库以 Rust workspace 组织，分成 `crates/` 下的多个子模块（GUI、后端逻辑、agent 等分离），`Cargo.toml` + `Cargo.lock` 标准管理，还提供了 `Dockerfile` 用于一键编译三平台的安装包。整体代码组织清晰，82 个 commit 就做到 3.1k star，说明**单次提交质量很高**，不是靠刷 commit 数的"绿墙项目"。
---
## 🚀 上手门槛与部署体验
### 前置条件（必须满足）
1. **Linux**（不支持 macOS / Windows，作者明确说明只在 Linux 上跑）
2. **支持监听模式 + 包注入的无线网卡**——这是最常见的"劝退点"，下面详细说
3. 系统里装好 `aircrack-ng`、`hcxtools`、`wireshark-cli`、`macchanger`、`crunch` 等依赖
### 推荐网卡（实测常见选择）
| 网卡型号 | 芯片 | 监听 | 注入 | 双频 | 价格区间 | 备注 |
|---|---|---|---|---|---|---|
| **Alfa AWUS036ACH** | RTL8812AU | ✅ | ✅ | 2.4G + 5G | ~¥250 | 经典"红天线"，强烈推荐 |
| **Alfa AWUS036ACS** | RTL8811AU | ✅ | ✅ | 双频 AC | ~¥200 | 体积更小 |
| **Panda PAU09 N600** | Ralink RT5572 | ✅ | ✅ | 双频 N | ~¥180 | 老牌稳定 |
| **TP-Link TL-WN722N v1** | Atheros AR9271 | ✅ | ✅ | 仅 2.4G | ~¥100 | **必须是 v1**，v2/v3 换了芯片不行 |
| 笔记本内置网卡 | Intel AX210 | ✅ | ⚠️ 部分 | 双频 WiFi 6E | 自带 | 监听 OK，注入偶尔抽风 |
> 💡 **避坑提示**：买之前先去 `aircrack-ng.org` 的 Compatible Cards 页面查一下芯片型号，淘宝上很多"仿 Alfa"实际上是改版芯片，监听模式能用但注入掉包严重。
### 三行命令完成安装（Debian 系，包括 Kali）
Airgorah 官方 Wiki 提供了三个主流发行版的预编译包，**x86_64 和 aarch64 都有**：
```bash
# Debian / Ubuntu / Kali / ParrotOS / PopOS / Linux Mint
wget https://github.com/martin-olivier/airgorah/releases/download/v0.7.3/airgorah_0.7.3_`arch`.deb && \
sudo apt update && \
sudo apt install ./airgorah_0.7.3_`arch`.deb
```
```bash
# Fedora / CentOS / Oracle Linux
wget https://github.com/martin-olivier/airgorah/releases/download/v0.7.3/airgorah_0.7.3_`arch`.rpm && \
sudo dnf update && \
sudo dnf install ./airgorah_0.7.3_`arch`.rpm
```
```bash
# Arch / Manjaro / EndeavourOS
wget https://github.com/martin-olivier/airgorah/releases/download/v0.7.3/airgorah_0.7.3_`arch`.pkg.tar.zst && \
sudo pacman -Syu && \
sudo pacman -U ./airgorah_0.7.3_`arch`.pkg.tar.zst
```
也可以直接从 crates.io 装（需要 Rust 工具链）：
```bash
cargo install airgorah
```
需要从源码构建的场景，项目自带 Dockerfile，**不用你本地装一堆 Rust 依赖**：
```bash
git clone https://github.com/martin-olivier/airgorah.git && cd airgorah
docker build . -t airgorah_builder
docker run --rm -v $PWD:/workspace airgorah_builder
# 编译完成后，目录下会出现 .deb / .rpm / .pkg.tar.zst 三个包
```
### 启动后的体验流程
装好后，应用列表里会多一个 `airgorah` 图标。打开后依次是：
1. **接口选择窗口**——列出系统上所有无线网卡，点一下选中的那张会被切到监听模式（这一步会弹 polkit 密码框，只需一次）；
2. 可选地，**自动关闭 NetworkManager**（避免干扰）+ **MAC 随机化**；
3. 进入**主界面**：左侧是实时刷新的 WiFi 列表（每秒更新一次），右侧是频段/信道筛选栏 + 扫描/停止/保存按钮；
4. 选中一个 AP，下方出现**客户端列表**（实时显示谁连着它）；
5. 选中客户端，按 `Deauth` 按钮 → 弹窗选择用 `aireplay-ng` 还是 `mdk4`，是否广播攻击；
6. 一旦客户端重连，握手包抓到后会出现在 WiFi 列表的 "Handshake" 列；
7. 按 `Decrypt` 按钮 → 选字典（如 `rockyou.txt`）或暴力破解参数 → 弹出独立终端跑 `aircrack-ng`，**关掉主程序也不影响破解继续跑**。
---
## ✨ 核心亮点与功能剖析
### 1. 实时扫描 + 双频支持
右侧栏的频段选择器同时支持 **2.4 GHz（信道 1–14）和 5 GHz（信道 36–165）**，可以勾选任意组合；信道栏还能手动填 `1,6,11` 这种定向扫描。这在很多老 GUI 工具（比如 Fern）里是缺失的。
### 2. 双引擎 Deauth
Airgorah 允许在 `aireplay-ng` 和 `mdk4` 之间切换 deauth 后端。这是个细节但很关键的工程选择：
- **aireplay-ng**：经典稳定，但单播 deauth 速度有限；
- **mdk4**：性能更暴力，支持更多攻击模式（如 Mickey Smurph、Beacon Flooding），对 stubborn 客户端更有效。
把选择权留给用户，而不是硬编码一个，这种"开放但不下结论"的设计哲学贯穿整个项目。
### 3. 握手包解密独立运行
按 `Decrypt` 后，破解任务会启动在一个**独立的终端窗口**，主程序可以关掉。这意味着你可以：
- 白天用 Airgorah 抓好握手包丢后台跑字典；
- 晚上关电脑前顺手把 GUI 关了，明天回来看结果。
这个"任务分离"的设计，是很多新手工具都忽略的。
### 4. 自动更新检测
头部栏有 Update 按钮，有新版本时会自动提示，**省去了手动 GitHub release 滚动更新的麻烦**。
### 5. MAC 随机化集成
在 settings 里勾选后，进入监听模式会自动用 `macchanger` 随机化 MAC。**对你自己测试用的设备做匿名化**，避免在公开场合扫描时把自家设备 MAC 暴露在 AP 日志里——这是一般新手根本想不到的细节。
### 6. Wayland 原生支持
这点对 Kali 2023+/Ubuntu 22.04+ 用户太友好了。很多老 GUI 安全工具（包括部分 Fern 版本）在 Wayland 下会闪退或输入异常，Airgorah 的 GTK4 后端则开箱即用。
---
## 👥 目标人群与收益
| 人群 | 能得到什么 | 推荐度 |
|---|---|---|
| **家庭用户** | 一键检查自家路由器密码强度，验证 WPA2/WPA3 是否真的安全 | ⭐⭐⭐⭐ |
| **安全初学者** | 把 aircrack-ng 的学习曲线从"背命令"变成"看界面理解流程" | ⭐⭐⭐⭐⭐ |
| **红队/渗透测试工程师** | 比纯 aircrack-ng 快得多的"扫-抓-破"闭环，适合做 Scope 内快速评估 | ⭐⭐⭐⭐ |
| **WiFi 课讲师/CTF 出题人** | 演示 deauth / handshake / cracking 全流程的可视化教具 | ⭐⭐⭐⭐ |
| **想深入理解 802.11 协议的开发者** | Rust + GTK4 的真实工程案例，可以读源码学习 | ⭐⭐⭐ |
| **只想"破解邻居 WiFi"的人** | ❌ 法律风险极高，本文不提供任何这类指导 | — |
---
## ⚔️ 竞品对比：它到底站在什么位置？
| 工具 | 语言/UI | 自动化程度 | 细节控制 | 学习曲线 | 维护状态 |
|---|---|---|---|---|---|
| **Airgorah** | Rust / GTK4 GUI | 中（每步可手动） | 高 | 中 | 🟢 活跃 |
| **Wifite2** | Python / CLI | 极高（一键全自动） | 低 | 低 | 🟡 偶尔更新 |
| **Fern WiFi Cracker** | Python / PyQt GUI | 中 | 中 | 低 | 🔴 维护缓慢 |
| **aircrack-ng 原生** | C / CLI | 低（全手动） | 极高 | 陡 | 🟢 长期维护 |
| **wifipumpkin3** | Python / CLI | 中（重点在 Evil Twin） | 高 | 中 | 🟢 活跃（定位不同） |
| **Kismet** | C++ / Web UI | 被动嗅探为主 | 高 | 中 | 🟢 活跃（不做攻击） |
**Airgorah 的差异化定位**：它在"GUI 易用"和"细节可控"之间找到了一个相对舒适的中间点——比 Fern 现代、比 Wifite 透明、比纯 aircrack-ng 亲和。**在"WiFi 安全审计 GUI"这个细分赛道上，目前没有一个项目同时在现代性、维护活跃度和权限设计上超过它。**
---
## 🚧 局限与不足（必须客观说）
1. **仅支持 Linux**。macOS 和 Windows 用户需要装虚拟机或双系统，这是硬性门槛。
2. **无 systemd 的发行版要手动清理干扰服务**（如 Alpine、Void、Artix），作者在文档里专门提醒过。
3. **依赖外部工具链**，不是单二进制。装好 `airgorah` 还得保证 aircrack-ng 等在 PATH 里，包管理器会处理，但如果你的发行版版本太老，可能遇到依赖冲突。
4. **只能利用 aircrack-ng 已有的攻击面**。像 Evil Twin、Karma Attack、WPS Pixie Dust 这种"进阶玩法"，需要靠 wifipumpkin3、Reaver 等其他工具，Airgorah 没有集成。
5. **对 WPA3 的破解支持有限**。WPA3-SAE 时代，传统的"抓握手-跑字典"思路要换成 Dragonfly 漏洞利用或 timing attack，这部分 Airgorah 没有做。
6. **社区规模尚小**。3.1k stars 在 Rust 工具里算不错，但相比 aircrack-ng 本身这种"工业级基础设施"，issue 响应速度、第三方教程生态都还在成长阶段。
7. **5 GHz 的 DFS 信道**（52–144）扫描可能因为法规静默机制而看不到，这不是 Airgorah 的锅，是射频法规本身的问题，但新手容易误以为"工具坏了"。
---
## 🎬 行动建议：怎么把这个工具真正用起来
如果你看到这里想试一试，下面是一条**合法且最小成本**的路径：
### Step 1：环境准备（一次性投入约 ¥200）
- 一台旧笔记本或迷你主机，装 **Kali Linux 2024+** 或 **Ubuntu 24.04 LTS**
- 一张 **Alfa AWUS036ACH**（或同等 RTL8812AU 芯片）USB 网卡
- 确认家里路由器是你自己名下的、密码你自己设的
### Step 2：安装与首次扫描
```bash
# 在 Kali / Ubuntu 上
wget https://github.com/martin-olivier/airgorah/releases/download/v0.7.3/airgorah_0.7.3_amd64.deb
sudo apt install ./airgorah_0.7.3_amd64.deb
# 从应用菜单启动，或者命令行
airgorah
```
选你的 Alfa 网卡 → 点确认进入监听模式（弹一次 polkit 密码） → 主界面就能看到周围所有 WiFi。
### Step 3：完整走一遍"扫-抓-破"闭环（只针对你家 AP）
1. 找到你家路由器的 SSID，选中它，看**客户端列表**里有几台设备；
2. 选一个客户端（比如你自己的手机），点 **Deauth**，勾选广播模式，等待它重连；
3. 重连后，WiFi 列表的 **Handshake** 列会出现 ✔；
4. 点 **Decrypt** → 选择一个字典（Kali 自带 `/usr/share/wordlists/rockyou.txt.gz`，先 `gunzip` 解压）；
5. 等待破解结果。如果你的密码在 rockyou 字典里，几分钟内就会出结果——**这就是一个明确的"该改密码了"的信号**。
### Step 4：进阶方向
- 想玩 **Evil Twin / 钓鱼热点** → 看 `wifipumpkin3`
- 想玩 **WPS Pixie Dust** → 看 `Reaver` / `OneShot`
- 想深入 **802.11 协议分析** → 看 `Wireshark` + `Kismet`
- 想读 Airgorah 源码学 Rust GUI 开发 → 直接 clone 仓库，重点看 `crates/` 下的模块划分
---
## 🏁 结语：终极评判
> **Airgorah 是一款工程素养明显高于同类、设计上克制而现代的 WiFi 安全审计 GUI 工具。它不是 aircrack-ng 的替代品，而是它的"最佳前端"。**
它的价值不在于"发明了什么新技术"——毕竟底层还是 aircrack-ng 那一套，而在于**把一个原本只有老手才能玩转的工具链，做成了普通人也能看懂、也能安全操作的图形化产品**。在 Rust 生态里，这也是一个值得当作 GUI + 系统编程双案例来研读的项目。
它不会让你一夜变成黑客，也不会替你写出 Checkmarx 报告，但如果你正想搞清楚"我家 WiFi 到底安不安全"，或者你是一个刚入坑无线安全的初学者想避开 aircrack-ng 那条陡峭的学习曲线——**给它一个下午的时间，它会给你一份比任何博客文章都直观的"WiFi 安全 101"体验**。
去 [github.com/martin-olivier/airgorah](https://github.com/martin-olivier/airgorah) 丢一颗 star，然后打开你的终端——下一个被你测试的，最好是你自己的路由器。
