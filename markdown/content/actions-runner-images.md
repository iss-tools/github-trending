# actions/runner-images

[GitHub URL](https://github.com/actions/runner-images)


## actions/runner-images 深度评测：GitHub Actions 官方 Runner 镜像的“藏宝图”

> GitHub Actions 官方托管 Runner 虚拟机镜像的开源构建仓库，是排查 CI 故障和优化构建环境的“真相之源”。

- **Tags**: GitHub Actions, CI/CD, 开源项目, DevOps, 自动化
- **Category**: 开发工具, DevOps, 云服务

## Details

# actions/runner-images 深度评测：GitHub Actions 官方 Runner 镜像的"藏宝图"
> **一句话总结**：它是 GitHub Actions 与 Azure Pipelines 所有官方托管 Runner 虚拟机镜像的源码仓库，13.1k Star、5900+ 已关闭 Issue 的庞大社区在背后维护它——读懂它，你就读懂了"我的 CI 为什么跑挂了"以及"我的 CI 为什么这么慢"这两件所有 DevOps 工程师早晚都会撞上的事。
---
## 一、背景与痛点：一个"看不见但天天在用"的仓库
每位写过 GitHub Actions workflow 的人，几乎都写过下面这行：
```yaml
runs-on: ubuntu-latest
```
但你有没有想过，这个 `ubuntu-latest` 背后究竟装了什么？为什么突然有一天它从 Ubuntu 22.04 变成了 24.04？为什么 `pip install` 突然报错？为什么 Docker 版本不一致？
这些问题的源头都在 **`actions/runner-images`** 仓库——它承载了 GitHub 托管 Runner（GitHub Actions）以及微软托管 Agent（Azure Pipelines）所使用的**全部虚拟机镜像的构建源码**，包括 Ubuntu、Windows、macOS 三大平台、x64 与 arm64 两种架构、十余种标签组合。
它的存在解决了一个朴素却极难的痛点：**如何让一个全球开发者共享的、每分钟被启动数百万次的"通用 CI 环境"，既保持足够的功能丰富度（开箱即用），又能持续滚动升级（不腐化）？** 这个仓库就是 GitHub 对这道题的答案——而且答案完全开源，你可以逐行审计自己 CI 跑在什么环境里。
---
## 二、技术栈与架构解析：Packer + Shell + Ansible 的工程组合拳
这个仓库本质上是一个**基础设施即代码**项目。它的构建链路大致是：
1. **Shell/PowerShell 安装脚本**：`images/ubuntu/scripts/build/` 目录下有上百个 `.sh` 脚本，每个脚本负责安装一项工具（如 `install-python.sh`、`install-docker.sh`）。
2. **Packer 模板**：把脚本串联成一个完整的镜像构建流程，分别面向 Azure（GitHub 托管 Runner 跑在 Azure 上）和 macOS Cloud。
3. **版本化镜像**：每个镜像有形如 `20260907.300.1` 的版本号，对应一次镜像快照，你可以在历史分支里精确找到那一次构建装了哪些版本。
**架构上的精妙之处**：
- **分层安装**：底层依赖 Ubuntu/Windows 官方仓库，上层工具用第三方包管理器统一调度——Ubuntu 走 APT + pipx，Windows 走 Chocolatey，macOS 走 Homebrew，这让工具升级有了清晰的"责任链"。
- **README 即真相**：每个镜像目录下都有一份自动生成的 `*-Readme.md`，逐行列出每个软件的具体版本号。例如 Ubuntu 24.04 当前快照中，Python 是 3.10/3.11/3.12/3.13/3.14 五版本并存，Node 是 22/24 双 LTS，Java 是 8/11/17/21/25 五代齐活，.NET SDK 覆盖 8/9/10。
- **环境变量约定**：预装工具暴露标准环境变量，如 `JAVA_HOME_17_X64`、`CHROMEWEBDRIVER`、`SELENIUM_JAR_PATH`，方便 workflow 中直接引用，这是 CI 兼容性的重要基石。
---
## 三、核心亮点与功能剖析
### 3.1 镜像矩阵：跨平台 × 跨架构的"全家桶"
当前仓库同时维护以下镜像（截至 2026 年 9 月）：
| 类别 | 镜像标签 | 说明 |
| --- | --- | --- |
| Linux | `ubuntu-latest` / `ubuntu-26.04` / `ubuntu-24.04` / `ubuntu-22.04` / `ubuntu-slim` | x64 与 arm64 双架构；`ubuntu-slim` 是 1 vCPU 轻量容器 |
| macOS | `macos-latest` / `macos-26` / `macos-15` / `macos-14` / `xcode-27` | Intel 与 Apple Silicon 双架构；`-xlarge` 后缀为付费大规格 |
| Windows | `windows-latest` / `windows-2025` / `windows-2025-vs2026` / `windows-2022` / `windows-11-arm` | 含 VS 2026 变体 |
### 3.2 硬件规格对照表（很多人不知道的"隐藏免费餐"）
很多人在选 Runner 时只看镜像名，其实**规格差异巨大**：
| 仓库类型 | 镜像 | CPU | 内存 | 磁盘 |
| --- | --- | --- | --- | --- |
| 公开仓库 | `ubuntu-latest` | 4 核 | 16 GB | 14 GB SSD |
| 私有仓库 | `ubuntu-latest` | 2 核 | 8 GB | 14 GB SSD |
| 公开仓库 | `macos-latest` (M1) | 3 核 | 7 GB | 14 GB SSD |
| 公开仓库 | `macos-26-intel` | 4 核 | 14 GB | 14 GB SSD |
| 公开/私有 | `ubuntu-slim` | 1 核 | 5 GB | 14 GB（容器，15 分钟超时） |
**关键洞察**：开源项目用 `ubuntu-latest` 是**完全免费不限时**的；私有仓库则是 2 核 8 GB。如果你只是做 lint、扫描或 issue 机器人，换到 `ubuntu-slim` 可以节省约 1/4 的分钟数。
### 3.3 预装软件的"良心程度"
以 Ubuntu 24.04 为例，预装清单涵盖：
- **语言运行时**：Python 3.10–3.14、Node 22/24、Go 1.24–1.26、Java 8/11/17/21/25、Ruby 3.2–4.0、.NET 8/9/10、Rust 1.98、Swift 6.3、PHP 8.3、GHC 9.14
- **容器/编排**：Docker 28、Buildx、Compose、Podman、Buildah、Skopeo、kubectl、Kind、Minikube、Helm、Kustomize
- **数据库**：PostgreSQL 16、MySQL 8、SQLite
- **浏览器与驱动**：Chrome/Edge/Firefox + 对应 WebDriver + Selenium Server，开箱就能跑 E2E 测试
- **移动端**：Android SDK 多版本 Platform + Build-tools（Linux 镜像甚至有 Android 硬件加速）
- **CLI**：AWS CLI、Azure CLI、gcloud、GitHub CLI、Pulumi、Terraform 系工具
这种"工具全在"的打包策略，意味着你 80% 的项目不需要写一行安装代码就能跑 CI。
### 3.4 透明而可预期的人类工程学
这是这个仓库最容易被低估的亮点：
- **每周滚动更新**，但每次默认版本变更前**至少提前 2 周公告**，危险变更延至 1 个月。
- **`-latest` 标签迁移走 1–2 个月灰度**，不会一刀切换 OS。
- **弃用流程是"公告 → 定期 Brownout（间歇性抖动）→ 彻底下线"**，不是某天早上突然消失。
---
## 四、Demo / 代码示例：最核心的用法
### 示例 1：最基础的 workflow（90% 的人这样用）
```yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest   # 实际映射到 ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      - run: python --version    # 3.12.3
      - run: docker --version    # 28.0.4
      - run: node --version      # 22.23.2
```
### 示例 2：显式锁定版本（强烈推荐的最佳实践）
```yaml
jobs:
  build:
    runs-on: ubuntu-24.04     # 显式版本，避免 latest 漂移
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: '24'  # Node 22 / 24 镜像内已缓存
      - uses: actions/setup-python@v5
        with:
          python-version: '3.13'
```
显式锁定到 `ubuntu-24.04` 而不是 `ubuntu-latest`，可以让你的构建环境在 `-latest` 切换时保持稳定——这是 2025 年 GitHub 强推 Ubuntu 24.04 时无数 CI 突然挂掉的根本解法。
### 示例 3：利用预装数据库（零安装开销）
```yaml
jobs:
  test:
    runs-on: ubuntu-24.04
    services:      # 也可以直接用预装的 PostgreSQL
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: root
    steps:
      - run: sudo systemctl start postgresql.service   # 或启动镜像内预装版
      - run: psql --version   # 16.15
```
### 示例 4：自己用这份源码构建一个私有镜像
```bash
git clone https://github.com/actions/runner-images.git
cd runner-images
# 用 Packer 在 Azure 订阅里复刻一个同款镜像
packer build images/ubuntu/templates/ubuntu-24.04.pkr.hcl
```
这是企业用户最常见的高端玩法——**把官方镜像"克隆到自己的 Azure 订阅"，加上内部工具后作为私有 Runner 池**。
---
## 五、目标人群与收益
| 人群 | 你能从中得到什么 |
| --- | --- |
| **CI 突然挂掉想找原因的工程师** | 直接对着当周镜像 README 逐项 diff 软件版本，10 分钟定位"哪个依赖升级了" |
| **写 GitHub Actions 的开发者** | 学会用 `ubuntu-24.04` 这类显式标签锁版本，避开 `-latest` 灰度期的意外迁移 |
| **DevOps 平台团队** | 借鉴其 Packer + 脚本分层架构，自建企业内部 Runner 镜像；或直接 fork 定制 |
| **开源维护者** | 知道哪些工具"白嫖"可用（Java 多版本、.NET 多 SDK、浏览器 WebDriver），精简 workflow |
| **学生 / 初学者** | 把仓库 README 当成"DevOps 工具全景图"阅读，一份文件胜过十篇博客 |
| **预算敏感的私有仓库用户** | 利用 `ubuntu-slim`（1 核 15 分钟上限）跑轻任务，节省 Actions 分钟数 |
---
## 六、竞品 / 同类对比
| 方案 | 定位 | 优势 | 劣势 |
| --- | --- | --- | --- |
| **actions/runner-images**（官方） | GitHub Actions 默认 | 零配置、每周更新、全平台覆盖 | 不可定制、版本被动升级 |
| **Self-hosted Runner** | 自定义硬件 | 完全控制、可装私有依赖、无分钟数限制 | 需自行维护、要管安全补丁 |
| **WarpBuild** 等第三方 Runner | 加速替代 | 更快的启动、原生 ARM64、更便宜的分钟单价 | 付费、需要信任第三方 |
| **GitLab Runner（托管）** | GitLab CI 平行宇宙 | 与 GitLab 深度集成 | 镜像透明度远不如 GitHub |
| **[myoung34/github-runner](https://github.com/myoung34/github-runner)**、**[some-natalie/felicity](https://some-natalie.dev)** 等社区项目 | 自建镜像参考 | 可学习、可魔改 | 无 SLA，需自己测试 |
**独特竞争力**：它是**唯一一个 GitHub 官方开源、可以逐行审计、可以通过 Issue 直接影响产品演进**的 CI 镜像项目。当你在这里提一个 Issue 请求加 Node 26（如 issue #14705），几周后它就会真的出现在镜像里——这种"用户可以直接改变 infra"的体验在商业 CI 里几乎绝无仅有。
---
## 七、社区活跃度与生命力
- **13.1k Star / 3.8k Fork**，开源 infra 项目中的顶流。
- **88 个开放 Issue、5,917 个已关闭 Issue**，关闭率超 98.5%，说明维护响应非常积极。
- **Issue 模板严格分类**：`Announcement`（官方通知）、`bug report`、`feature request`、`OS: macOS/Ubuntu/Windows`、`Area: Xcode/Docker/Node.js` 等，你可以按标签精准订阅自己关心的领域。
- **当前活跃话题**（2026 年 9 月）：Ubuntu 26.04 公测、Xcode 27 预览、Node 26 请求、Windows 11 ARM 切换 VS 2026、Git 2.54 回归修复、`apt update` 在 azure.archive.ubuntu.com 卡 20 分钟的 bug 报告。
- **关闭的 5,917 个 Issue 是一座金矿**——搜"`ubuntu-latest` 卡顿"、"Xcode 构建失败"、"Docker 版本变化"等关键词，几乎每个常见 CI 疑难杂症都有人踩过坑。
**一个诚实的观察**：Issue 创建被限制为必须走模板，且维护者并不总是第一时间响应——大型官方仓库普遍如此。但因为有 Announcement 标签，**关键变更一定会通过 Issue 提前公告**，订阅它相当于拥有了一份"官方 CI 变更预警"。
---
## 八、局限与不足：把丑话说在前面
### 8.1 `-latest` 标签的漂移陷阱
这是最大也最致命的痛点。**`ubuntu-latest` 不是契约，而是一个"目前指向 24.04"的指针**，GitHub 会在 1–2 个月内悄悄把它切到新版本。
近期正在发生的事就是例证：Ubuntu 22.04 镜像已于 2026 年 9 月 17 日开始弃用流程，2027 年 4 月 17 日彻底下线。如果你的 workflow 还写着 `ubuntu-22.04`，将面临 Brownout 期的间歇性失败。**应对方案**：现在就显式写成 `ubuntu-24.04`。
### 8.2 磁盘 14 GB 的硬上限
即使你是 16 GB 内存的 4 核公开仓库规格，SSD 也只有 14 GB。装完 Android SDK、跑完 Docker 镜像拉取，磁盘就紧张了。大项目要么精简依赖、要么上付费 Larger Runner（可扩容磁盘）。
### 8.3 macOS ARM 的几个隐形坑
- Apple Silicon Runner **不支持嵌套虚拟化**（受限于 Apple Virtualization Framework）。
- **没有静态 UDID**，签名 + 同机测试的场景必须用 Intel Runner。
- 部分**社区 Action 对 ARM 不兼容**，需要手动装运行时。
### 8.4 `ubuntu-slim` 是容器不是 VM
很多人把 `ubuntu-slim` 当成"便宜版 ubuntu-latest"用，结果踩坑：它是**运行在容器里的单核环境**，不支持 `sudo` 挂载文件系统、Docker-in-Docker、底层内核操作，且**作业超时 15 分钟**。只适合 lint、扫描、issue 机器人等轻任务。
### 8.5 工具策略的"无情剪枝"
任何 EOL 工具最多保留 6 个月就被移除；Xcode 只保留一个主版本；PyPy 只保留 3 个常用 minor。如果你锁死了某个老版本，**每次镜像周更都要重新审视**。
### 8.6 学习曲线与阅读成本
仓库内容庞杂，主要面向"知道自己在找什么"的工程师。**对新手不够友好**——README 是版本清单而非教程。想从零理解 Packer 流程，需要额外的 infra 知识储备。
---
## 九、结语与行动建议：三条立刻可用的 actionable
这个仓库的价值，不在于"你每天要打开它"，而在于**当 CI 出现问题时它是你唯一可查的权威真相来源**，以及**当你规划 workflow 时它是一份活的 DevOps 工具地图**。
给你三条可以直接照做的行动建议：
1. **今天就检查你的 workflow**：把所有 `runs-on: ubuntu-latest` 改为 `runs-on: ubuntu-24.04`（或对应的 `macos-26` / `windows-2025`）。这不是强迫症，而是在给未来的自己省一次深夜救火。
2. **订阅仓库的 Announcement Issue**：到 Issues 页按 `label:Announcement` 过滤，点 Watch。下次 `ubuntu-latest` 切版本、Docker 大版本升级、Xcode 更新时，你会比同事早一周知道。
3. **遇到 CI 疑难杂症先搜这里**：在仓库 Issues 里搜错误关键词，再对照当周 `ubuntu-24.04` README 的版本清单做 diff。多数"昨天还好好的今天挂了"的问题，根因都在这份清单里。
> **终极评判**：⭐⭐⭐⭐⭐。它不是"又一个开源项目"，而是 GitHub Actions 这个全球最大 CI 平台的**地基本身**——开源、活跃、透明、有求必应。把它加进你的书签，如同把产品文档加进书签一样自然。
