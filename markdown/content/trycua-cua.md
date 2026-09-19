# trycua/cua

[GitHub URL](https://github.com/trycua/cua)


## Cua：AI 计算机操作基础设施栈

> 一套让 AI 控制真实/虚拟电脑的开源基础设施，打通驱动、沙箱与评测。

- **Tags**: Computer-Use, AI Agents, 开源, 自动化, 虚拟化
- **Category**: 开发工具, AI 基础设施, 自动化

## Details

# Cua（trycua/cua）深度评测
---
## 一句话总结
**Cua** 是一套「让 AI 拥有一台真实或虚拟电脑」的基础设施栈：包含「本机后台驱动」（Cua Driver）、「跨平台沙箱/机群」（Cua Sandbox / Fleets）、「电脑操作基准与RL环境」（Cua Bench）与「macOS 虚拟化」（Lume）。它统一了跨 OS 的自动化与评测能力，适合做电脑操作 Agent 的研发、训练与生产部署。**MIT 协议、高频迭代、已获 2 万+ Stars。**
---
## 背景与痛点：为什么需要「Computer-Use 2.0」基础设施工具？
- 从「只懂代码」到「懂 GUI」的需求爆发  
  早期的编码 Agent 只擅长读/写文件、调 API、跑 Shell；但当任务进入桌面应用、浏览器 GUI、跨系统协同时，能力直接撞墙。例如：打开某个原生软件、点菜单、上传文件、截图核对结果，这些很难用传统脚本低成本维护。
- 评测与训练数据极度匮乏  
  电脑操作任务缺少标准化、可复现的评测集。很多研究停留在单次 Demo 或视频，难以系统性评估与调优。模型训练所需的「多轮决策轨迹」更是难以规模化采集。
- 隔离性与安全难题  
  让 Agent 直接操作你的开发机很危险：误删文件、泄露凭证、弹窗打扰工作流程。我们需要「给 Agent 一台隔离的电脑」，并能在云与本地无缝切换。
- 跨系统一致性差  
  macOS/Windows/Linux 各自的 GUI 自动化栈（Accessibility/UI Automation/X11/Wayland）碎片化，成本极高。且大部分方案不支持「后台操作」（不抢鼠标、不抢焦点）。
Cua 的诞生正是要把这些痛点收束到一套统一、开源的基础设施中，并打通「Agent—沙箱—评测—训练」的闭环，让「Computer-Use 2.0」成为可复制的工程能力。
---
## 核心亮点与功能剖析
Cua 不只是单一仓库，而是一系列互相配合的包与工具链：
### 1) Cua Driver：本机后台驱动（macOS/Windows/Linux）
- 一键安装与跨平台统一 CLI：macOS/Linux 用 curl，Windows 用 PowerShell 即可安装，并按「Drive your first app（让 Agent 打开计算器并验证结果）」完成上手验证。
- 背景/无干扰操作：在 macOS 与 Windows 上，通过 UI Automation/Accessibility 等机制实现「不抢光标/不抢焦点」的点击、输入与验证；Linux 同时支持 X11 与特定合成器下的 Wayland 路由，并对原始后台输入设置明确边界。
- 多客户端接入：既可以用 CLI 直接控制，也提供 MCP 服务器与类型化 SDK，方便 Claude Code、Cursor、Codex、OpenClaw 等直接接入使用。
- 架构模块化：核心在 `libs/cua-driver/` 中有独立 README 与架构说明，便于理解各平台适配层与输入/观测流水线。
### 2) Cua Sandbox / Fleets：统一 API 的沙箱与机群（云+本地）
- 一套 API 覆盖多种运行时：Python SDK 中 `Sandbox.ephemeral(Image.linux()/macos()/windows()/android())`，让你用同一套异步接口控制容器、VM、本地/云端环境。
- 短生命周期与自动清理：`async with` 语义简化资源管理，有效防止泄漏。
- 云端机群（Fleets）：通过 `run.cua.ai` 可以按需拉起隔离云桌面并维持池化容量，适合并发的 Agent 任务、评测流水线等；支持任务完成后清理或保留付费容量（需按文档清理）。
- 原生 UI 交互能力：内置 `screenshot`/`mouse.click`/`keyboard.type`/`mobile.gesture` 等接口，同一套 API 既可以跑 Shell，也能操作 GUI 或移动端手势。
### 3) Cua Bench：电脑操作基准与 RL 环境
- 兼容主流评测集：支持 OSWorld、ScreenSpot、Windows Arena 与自定义任务，适合做对比与发表基准。
- 轨迹导出用于训练：能把 Agent 的执行过程导出为轨迹数据，为后续 RL 或行为克隆训练提供数据闭环。
- 容器化与并行运行：示例给出用 `uv` 安装并创建 Linux 基础镜像，再用 `cb run` 指定数据集、Agent、并行度来跑评测，流程清晰且易于 CI 化。
### 4) Lume：macOS/Linux 虚拟化管理（Apple Silicon）
- 基于苹果 Virtualization.Framework：官方文档明确其为在 Apple Silicon 上创建与管理 macOS/Linux VM 的工具，性能接近原生。
- 一键脚本安装：`curl ... install.sh` 快速安装 CLI。
- 无值守创建与预设：`--unattended` 模式可在离线状态下完成初始化，内置 `sequoia`/`tahoe` 预设（自动创建用户、启用 SSH、自动登录、关闭锁屏等），极大降低交互成本；默认账户为 `lume/lume`。注意 Sequoia 首次启动可能弹出设置向导中的辅助功能页面，已在 Issue 中注明。
- Docker 兼容接口：`lumier` 提供了 Docker 兼容接口，方便把 Lume 管理的 VM 当作「容器目标」使用。
### 5) 技术栈与架构概览
- 多语言生态：仓库内包含 Rust 与 Python 等不同语言的子模块，例如 `cua-driver-rs`（Rust 驱动）、Python SDK 与 Bench CLI 等。
- OCI 兼容与本地优先：官方强调「Local first，OCI 兼容，pure Rust」的原则，便于与既有云原生工具链集成。
- 依赖与第三方许可：明确列出了第三方组件许可证（Kasm/MIT、OmniParser/CC-BY-4.0 等），若使用 `cua-agent[omni]` 还需注意包含 AGPL-3.0 的 ultralytics，合规与商用需留意这些条款。
### 6) 安全与可靠性设计
- 隔离沙箱：Agent 在虚拟或容器环境中运行，减少对宿主机的影响。
- 签名与发布：`trycua-release[bot]` 等机器人参与版本发布，部分提交由 GitHub 验证签名，可见有规范的 CI/CD 与发布流程。
- 安全报告通道：在 README 与 Issues 页面提供了「Security」入口，用于隐私漏洞报告。
---
## Demo / 代码示例
### A) 在云沙箱中跑 Shell、截图与点击（Cua Sandbox，Python）
```python
# Requires Python 3.11 or later
from cua import Sandbox, Image
# 同一 API 无论运行在云端还是本地
async with Sandbox.ephemeral(Image.linux()) as sb:   # 或 .macos() / .windows() / .android()
    result = await sb.shell.run("echo hello")
    screenshot = await sb.screenshot()
    await sb.mouse.click(100, 200)
    await sb.keyboard.type("Hello from Cua!")
    await sb.mobile.gesture((100, 500), (100, 200))  # 多指触控手势
```
### B) 一键安装 Cua Driver（本机后台驱动）
- macOS / Linux：
```bash
/bin/bash -c "$(curl -fsSL https://cua.ai/driver/install.sh)"
```
- Windows (PowerShell)：
```powershell
irm https://cua.ai/driver/install.ps1 | iex
```
安装后即可按官方「Drive your first app」文档完成「让 Agent 打开计算器并验证结果」的首个任务。
### C) 创建本地 macOS VM（Lume，Apple Silicon）
```bash
# 安装
/bin/bash -c "$(curl -fsSL https://cua.ai/lume/install.sh)"
# 拉取并创建 VM
curl -L "$(lume ipsw | tail -n 1)" -o ~/Downloads/macos-tahoe.ipsw
lume create macos-tahoe --ipsw ~/Downloads/macos-tahoe.ipsw --unattended tahoe
lume run macos-tahoe
```
使用后记得按文档与 Issue 提示，注意 Sequoia 首次启动可能需要手动完成辅助功能设置。
### D) 运行 Cua Bench 评测（Python CLI）
```bash
git clone https://github.com/trycua/cua && cd cua/cua-bench
uv tool install -e . && cb image create linux-docker
cb run dataset datasets/cua-bench-basic --agent cua-agent --max-parallel 4
```
---
## 目标人群与收益：谁适合用、能得到什么？
- AI Agent 研究者 / 工程师  
  收益：  
  - 获得统一的「电脑操作沙箱」与「评测基准」，省去自建环境、编写评测脚本的大量重复工作。  
  - 直接导出训练轨迹，为强化学习或行为克隆提供可扩展数据来源。
- 企业/团队构建内部「数字员工」/RPA  
  收益：  
  - 用统一的 API 跨 macOS/Windows/Linux/Android 部署与执行桌面自动化任务，不再碎片化维护多套脚本。  
  - 后台驱动让 Agent 在不影响员工使用的情况下执行操作（如后台采集、验证、定时任务）。  
  - 云端机群支持弹性扩缩容，与现有 CI/CD 或调度系统易于集成。
- DevOps/SRE 与安全团队  
  收益：  
  - 在隔离环境中运行不可信的 Agent 操作或自动化脚本，保护生产与开发机安全。  
  - 通过「基准评测」衡量各类 Agent 的稳定性、成功率与可复现性。
- 工具与平台开发者  
  收益：  
  - 利用 Cua 的 MCP/SDK 接口快速为 Claude Code、Cursor、Codex、OpenClaw 等提供「电脑使用」能力，提高产品差异化。
---
## 竞品/同类对比：Cua 的独特定位
- 与 Anthropic 的「Computer Use（Claude）」、OpenAI 等云端 Agent 能力  
  Cua 是「基础设施与协议层」，不强制绑定某一家模型；它给任何 Agent 提供「电脑」与「工具」，可以与各家 LLM/Agent 集成。
- 与传统 GUI 自动化（如 Selenium、PyAutoGUI、Playwright）  
  Cua 更聚焦「Agent 使用」，提供更高层的「沙箱生命周期管理」「评测基准」与「后台无干扰操作」；同时统一跨 OS API，不必为每个平台维护一套底层逻辑。
- 与 OSWorld / ScreenSpot 等评测基准  
  Cua Bench 不仅兼容这些基准，还提供「执行引擎」与「轨迹导出」，把「评测」和「训练」直接打通。
- 与云端 VDI / Kasm 等  
  Cua Fleets 提供按需拉起的隔离桌面与 OCI 兼容能力，同时与本地 QEMU 等统一抽象，开发者可自由选择云端或本地运行时。
小结：Cua 的独特竞争力在于「Agent First 的统一抽象」——从驱动到沙箱、再到评测与训练，形成一体化栈；并以 MIT 协议开源，降低长期被厂商锁定的风险。
---
## 局限与不足：务必知晓的现实
- 上手门槛不低  
  需要理解异步 Python、容器/虚拟化基本概念；要跑通整套链路（尤其是 Fleets 与 Bench）可能需要云账号、Docker、QEMU、权限与安全组等运维知识。
- 不同平台的「后台操作」能力有边界  
  Linux 下对 Wayland 的后台输入依赖具体合成器支持；某些应用或系统控件可能无法在不抢焦点的情况下可靠操作。Issue 列表中出现了 Wayland 截图/输入稳定性相关工单，说明这一块仍在快速迭代与完善中。
- 云端资源与费用  
  Fleets 是云服务，按量与保留容量计费。评测与大规模并行需要注意账单；务必遵循文档中的清理步骤，避免资源泄漏。
- 某些组件使用强传染性许可  
  README 明确指出可选的 `cua-agent[omni]` 包含 AGPL-3.0 的 ultralytics；如果你的项目对协议敏感，需要谨慎组合或避免该额外组件。
- 文档与教程的碎片化风险  
  主 README 引导到各子模块的 README 与外部文档站，初次使用时需要多处跳转；整体文档仍在快速演进，部分细节（如 Sequoia 初始化弹窗）需参考 Issue 跟踪。
- 社区活跃度与 Bug 处理  
  从提交记录看，仓库高频更新（2026-09 月中旬几乎每天都有提交），Issues 与 PR 数量也不少（500+ Issues，1800+ 已合并 PR），说明维护投入较大；但同时一些平台兼容性问题仍处于 RFC 或工单状态，需要时间收敛。
---
## 上手门槛与部署体验（从实践角度）
- 一键脚本降低 Driver/Lume 安装成本  
  官方提供 curl/PowerShell 脚本，对常见平台「一行安装」。但仍需按「安装后步骤」配置权限（如 macOS 的辅助权限、Windows 的 UAC 等）。
- Python 生态与 uv 工具链  
  Bench、Sandbox 等模块推荐使用 uv 安装与依赖管理，对熟悉 Python 的团队非常友好，但对「不碰 Python」的用户略有门槛。
- 云沙箱需要账号与凭证  
  使用 Fleets 需要注册并获取凭证，配置环境或代码调用；本地 QEMU 则需要自行管理镜像与网络。
- 安全性与权限  
  在某些平台需要赋予辅助功能/输入权限给 Cua；在托管环境中需要合理配置防火墙/安全组，避免沙箱暴露到公网。
---
## 商业模式与性价比（开源与云服务结合）
- 核心仓库 MIT 协议  
  自身核心代码可商用与再分发，极大降低集成成本与合规顾虑。
- 云端 Fleets 属于托管服务  
  用于弹性扩容与团队协作；具体价格与套餐需在其官网 `run.cua.ai` 查看，适合需要高频、大规模评测/并发的团队。
- 总体评价  
  对研究与原型友好：开源部分已经可以支撑本地与私有云的闭环；对规模化生产：需要结合 Fleets，并根据用量评估成本。
---
## 社区活跃度与生命力
- 仓库热度：约 23.8k Stars，1.6k Forks，说明关注度较高且社区参与较广。
- 提交频率：2026-09 月中旬几乎每天都有合并，涵盖功能、修复、文档与依赖更新等。
- Issue 与 PR：Open Issues 数百，Closed PR 数千；标签涵盖 bug/feat/docs/test 等，维护团队与社区贡献者持续迭代。
- 外部资源：官方提供文档站、Blog、Discord 等社区渠道，便于获取支持与反馈。
综合来看，项目处于「高频迭代、社区活跃、快速演进」的阶段，适合愿意跟进最新版本与贡献反馈的团队。
---
## 结语与行动建议（终极评判）
**终极评判**：  
如果你在做「能用电脑的 Agent」——无论是研究、训练，还是落地自动化/数字员工——Cua 是当下开源界少有的「一体化栈」解决方案。它把「跨平台驱动 + 沙箱机群 + 评测 + 虚拟化」都串了起来，MIT 协议让集成更安心。但它并不「开箱即用到一个按键就能干完所有事」，你仍需投入工程与运维精力，并接受部分平台兼容性正在快速演进的事实。
**行动建议（按角色）**：
- 研究者  
  优先试用 Cua Bench 与本地沙箱，跑一轮 OSWorld/ScreenSpot 基准，评估其是否满足你的实验与论文复现需求；再根据结果决定是否接入 Fleets 以提升并行度。
- Agent/工具开发者  
  从 Cua Driver 与 MCP 入手，先把「电脑操作」能力接入到 Claude Code、Cursor 等工具；再用统一 API 考虑云端与本地切换策略。
- 企业团队  
  在隔离环境先跑完「首个 Demo」（如官方的计算器示例），验证权限与安全策略；再逐步把核心流程迁移到 Cua 统一栈中，并结合 Fleets 做容量规划。
- 个人/爱好者  
  用 Lume 在 Apple Silicon 上起一个 macOS VM，把本机环境隔离出来给 Agent 使用，是最快也最有趣的入门路径。
---
## 如何跟上更新
- 订阅 GitHub Releases/Watch 仓库，关注 `cua-driver`、`cua-sandbox`、`cua-bench` 与 `lume` 的版本变更。  
- 加入官方 Discord 以获取实时支持与讨论。  
- 定期查看 `libs/cua-driver/README.md` 与文档站，了解平台兼容性、后台输入边界与最佳实践。
