# actions/checkout

[GitHub URL](https://github.com/actions/checkout)

- **Stars**: 8754
- **Language**: TypeScript

## actions/checkout 深度评测：GitHub Actions 生态的核心基石

> 官方必备的代码检出 Action，为 CI/CD 提供安全、高效的代码拉取能力。

- **Tags**: GitHub Actions, CI/CD, Git, 自动化, DevOps
- **Category**: 开发工具, DevOps, 开源项目

## Details

<|assistant|>我继续向下滚动 Releases 页面，以查看 v7.0.0、v6.1.0、v5.1.0 等条目的发布日期与简要变更。</think>
# 一句话总结
actions/checkout 是 GitHub 官方提供的“检出仓库”必备 Action，几乎所有 GitHub Actions 工作流的第一步都是它；它把代码拉到 Runner 可操作的目录，并提供了分支/Tag/SHA 切换、稀疏检出、子模块、LFS、多仓库并行检出等丰富能力，同时持续加强安全与开发者体验。
---
## 背景与痛点：为什么需要它？
在 GitHub Actions 出现之前，CI/CD 通常需要在自己维护的机器上手动配置 Git 凭证、处理 SSH 密钥、管理工作区清理，极其琐碎且容易出错。GitHub Actions 推出后，需要一个开箱即用、官方维护的方式，把代码“搬”到 Runner 上，让后续的构建、测试、部署步骤能直接访问仓库内容。
痛点集中在：
- Runner 启动时工作目录是空的，没有代码没法跑任何脚本。
- 不同触发事件（push、pull_request、release、tag）需要正确检出对应的提交，否则会测错或发布错误版本。
- 大型仓库如果全量克隆，会显著拉长流水线时间；部分场景只需要部分目录或文件。
- 私有仓库、子模块、Git LFS、SSH 等场景，需要一致且安全的方式传递凭据并自动清理。
actions/checkout 应运而生：以一个 `uses: actions/checkout@v7` 步骤，把这些问题一次性打包解决。
---
## 核心亮点与功能剖析
### 1) 一行检出，智能选提交
- 最简用法：检出当前仓库、当前触发事件对应的提交（push/PR 都会正确对应到 SHA）。
  ```yaml
  - uses: actions/checkout@v7
  ```
- 默认行为：
  - 检出到 `$GITHUB_WORKSPACE`。
  - 只拉取触发事件的单个提交（fetch-depth 默认为 1），节省时间与带宽；如需全量历史，显式设为 `0`。
  - 当系统未找到 Git 2.18+ 时，会降级到 REST API 下载文件，提升兼容性。
### 2) 多仓库/私有仓库/检出指定路径与分支
- 检出不同仓库（公开或私有）：通过 `repository` 和 `token`（PAT）完成，还能用 `path` 放到指定子目录，避免覆盖；从而轻松实现“检出当前仓库+检出依赖库/公共库”的并行工作流。
- 检出指定分支/Tag/SHA：用 `ref` 实现，适合针对不同版本做兼容性测试或回归测试。
示例：检出其他仓库到子目录
```yaml
- name: Checkout other repo
  uses: actions/checkout@v7
  with:
    repository: my-org/my-other-repo
    token: ${{ secrets.PAT }}
    path: other-repo
```
### 3) 稀疏检出与部分克隆：为大仓库提速
- 支持 `sparse-checkout` 模式（可开启 `cone-mode`），仅检出指定路径，适合只跑文档或某子系统的流水线。
- 支持 `filter` 部分克隆，进一步减少网络与磁盘占用。
示例：仅检出根目录与指定文件夹（README Scenarios 描述）
```yaml
- uses: actions/checkout@v7
  with:
    sparse-checkout: |
      .github
      src
```
### 4) 子模块与 LFS 一体化支持
- `submodules: true` 或 `recursive` 会自动检出子模块；未提供 SSH 密钥时，会把 SSH 的 `git@github.com:` URL 自动转成 HTTPS，避免鉴权麻烦。
- `lfs: true` 会拉取 Git LFS 文件，满足游戏、设计资产等大文件的 CI 需求。
### 5) 凭证管理与安全：持续收紧
- 默认会把 token/SSH 密钥写入本地 git 配置，使后续 `git push` 等命令能“无感”完成；Job 结束后自动清理。也可以显式关闭 `persist-credentials`。
- v6 加强了凭证安全：`persist-credentials` 将凭证写到独立的临时文件，而不是直接进 `.git/config`，降低意外泄漏风险；同时要支持在 Docker 容器内执行带认证的 git 命令需要较新的 Runner 版本（v2.329.0+）。
- 新增“拒绝检出 fork PR 代码”的安全默认行为：在 `pull_request_target` 或 `workflow_run` 触发的高权限上下文中，默认不再直接检出来自 fork 的 PR 代码，以减少常见的“pwn request”攻击面；如确有需要且评估风险后，通过 `allow-unsafe-pr-checkout: true` 显式开启。
### 6) 权限建议与集成体验
- 官方建议的 `permissions`：仅授予 `contents: read`，除非你的流水线需要写入（例如自动推送标签）。
- 与 GitHub 生态无缝集成：默认使用 `${{ github.token }}`，无需手动维护 PAT；可直接配合 `actions/setup-node`、`actions/setup-python` 等构建链路。
---
## 目标人群与收益：谁能从中获得什么？
- 小白/初次使用者：只需要写一行 `uses: actions/checkout@v7`，不必理解 Git 凭证、SSH、Runner 工作目录，就能立刻跑起“构建+测试”的基础流水线。
- DevOps/SRE：用它可以快速编排多仓库检出、私有仓库拉取、子模块/LFS 管理等复杂流程，减少重复脚本。
- 大仓库/单体库团队：通过稀疏检出/部分克隆显著缩短流水线时间，降低 CI 成本。
- 安全敏感团队：利用 v6+ 的凭证安全改进和 fork PR 检出限制，降低供应链攻击风险。
---
## 竞品/同类对比：生态里的“标准答案”
- Graphite 的教程把 actions/checkout 作为“事实标准”讲解，覆盖从基础检出到分支、私有仓库、多路径检出等典型用法，充分说明了其在生态中的统治地位。
- 第三方替代（如 taiki-e/checkout-action）主打不依赖 Node.js、更轻量的替代方案，但功能仅覆盖一个子集，适合极简场景或对依赖敏感的环境。
- 综合对比：actions/checkout 官方维护、功能全面、安全更新及时，几乎总是首选；第三方方案更适合需要极简/特殊约束的场景。
---
## 局限与不足：需要注意的地方
- 运行时版本与自托管 Runner：v5/v6/v7 升级到 Node 20/24，要求 Runner 版本不低于指定值（如 v2.327.1、v2.329.0），老的自托管 Runner 可能需要先升级才能使用。
- 贡献模式：仓库 README 明确“暂不接受贡献”，仅支持安全更新与重大破坏性修复；功能需求需通过 Community Discussions 或 GitHub 支持渠道提出。这意味着用户不能通过 PR 直接贡献，但维护质量与兼容性由官方把控。
- 学习曲线：基础用法极简，但高级能力（稀疏检出、子模块、多仓库私有检出、`pull_request_target` 与安全边界等）仍需要一定 Git 与 Actions 知识储备。
- GHES 兼容细节：部分文档示例特别提示 GHES（GitHub Enterprise Server）上的差异（例如 bot 邮箱），需要对照企业版文档与测试验证。
---
## 上手门槛与部署体验（含 Demo）
- 上手门槛：极低。默认设置即可工作，无需额外配置。
- 文档质量：README 清晰列出所有输入项与默认值，并提供“Scenarios”示例；官方 Releases 页持续发布新版说明，生态中有大量第三方教程补充。
- 社区活跃度：Star 数、Fork 数、Issue/PR 数量都很高，官方持续发版（v7、v6、v5、v4 等都有维护），说明生命力旺盛；同时官方将问题引导至 Community Discussions，保持 Issue 列表聚焦。
### 简单可复制的 Demo 示例
#### 基础检出 + 测试（适配 PR 或 push）
```yaml
name: Run tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - run: make test
```
#### 检出指定 Tag 并全量拉取历史（适合版本发布流水线）
```yaml
- uses: actions/checkout@v7
  with:
    ref: v1.2.3
    fetch-depth: 0
```
#### 稀疏检出：仅检查 .github 与 src 目录（来自 README Scenarios）
```yaml
- uses: actions/checkout@v7
  with:
    sparse-checkout: |
      .github
      src
```
#### 在 PR 中自动生成并推送提交（需额外写权限）
```yaml
on: pull_request
permissions:
  contents: write
jobs:
  auto-commit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          ref: ${{ github.head_ref }}
      - run: |
          date > generated.txt
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add .
          git commit -m "generated"
          git push
```
#### 推荐的最小权限配置（只读）
```yaml
permissions:
  contents: read
```
---
## 技术栈与架构简述
- 语言与运行时：新版基于 Node.js（v5 使用 node24，v6、v7 逐步沿用了新的 Node 运行时），采用 TypeScript/JavaScript 编写；近期迁移到 ESM 以配合新版 `@actions/*` 包体系。
- 架构设计：作为复合/Action 入口，它在 Runner 启动的干净环境里执行 Git 命令或 REST API 降级，将目标仓库放入 `$GITHUB_WORKSPACE`，并设置必要的 Git 配置（凭证、安全目录等），随后清理敏感信息。
- 代码与发布：仓库以 MIT 许可证开源，README、Changelog 与 Releases 共同构成文档体系；功能集中在“检出”与“凭据管理”两个核心职责，保持 API 稳定。
---
## 结语与行动建议
终极评判：actions/checkout 是 GitHub Actions 生态的“基础设施级”项目，稳定、安全、功能齐全。几乎所有使用 GitHub Actions 的项目都应该以它为默认的检出方案，仅在极少数有特殊约束的场景下考虑第三方替代。
建议行动清单：
- 全局排查：把所有 `@v3` 或更老版本的引用升级到 `@v7`（至少 `@v4+`），以获得安全与运行时更新；注意自托管 Runner 的版本要求。
- 权限治理：流水线仅需读取内容时，显式加上 `permissions: contents: read`；需要写入的 Job 单独授予写权限，缩小最小权限范围。
- 大仓库优化：对文档站点或子系统流水线，评估稀疏检出与 `filter` 部分克隆，加速构建。
- 安全加固：在 `pull_request_target` / `workflow_run` 场景下，避免直接检出 fork 代码；如必须，显式设置 `allow-unsafe-pr-checkout: true` 并完成风险评估。
