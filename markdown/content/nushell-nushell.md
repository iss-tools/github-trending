# nushell/nushell

[GitHub URL](https://github.com/nushell/nushell)


## Nushell 深度评测：把 Shell 从文本处理工具重造为数据查询引擎

> 用 Rust 编写的现代 Shell，管道里流动的是结构化表格数据而非文本，让 JSON、CSV、日志处理变得像写人话一样简单。

- **Tags**: Nushell, Shell, Rust, 开源项目, 命令行
- **Category**: 开发工具, 命令行工具, 效率工具

## Details

# Nushell 深度评测：把 Shell 从"文本处理工具"重造为"数据查询引擎"
> **它不是更快更漂亮的 bash，而是一次对"Shell 到底是什么"的重新设计——如果你日常在命令行里解析日志、操作 JSON、调 REST API，Nushell 值得立刻放进你的工具箱；但如果你打算把它直接设成登录 Shell 去 `chsh`，请先冷静看完本文最后一段。**
---
## 一、一句话定调
Nushell（昵称 "Nu"）是一个用 Rust 编写、跨 Windows/macOS/Linux/BSD 的现代 Shell，它最激进的设计是：**让所有命令之间传递的不是字符文本流，而是结构化的表格数据**。换句话说，它把 Unix 那句 "everything is a file" 改写成了 "everything is structured data"，再用一套统一的查询动词（`where` / `select` / `sort-by` / `get`）去操作它们。
如果你曾为了从 JSON 里抠一个字段，而在 `jq` + `grep` + `awk` + `sed` 之间反复横跳，Nushell 的价值几乎是秒懂的。
---
## 二、诞生背景：为什么 2020 年代还需要一个新 Shell？
Nushell 由 **Sophia Turner（Jonathan Turner）** 和 **Yehuda Katz** 在 2019 年 8 月首次发布。这两位背景很有意思：
- **Yehuda Katz** 是 Ruby on Rails 核心团队前成员，也深度参与过 TypeScript 与 Rust 早期生态，对"语言设计"这件事有近乎执念的敏感度。
- **Sophia Turner** 长期从事系统与终端工具开发，曾在 Mozilla 参与 Rust 编译器错误信息打磨。
两人聊起 PowerShell 把"对象"引入管道这件事很惊艳，但 PowerShell 的动词-名词命名、.NET 重依赖、Windows 中心化又让人难受。于是他们提出了一个折中的、更函数化的思路：**借鉴 PowerShell 的"结构化管道"，但用更轻量、更接近 Unix 风格的"表格 + 不可变数据"来表达**，并用 Rust 实现，从而获得天然跨平台与安全保证。
传统 Shell 的根本痛点，作者在博客《The case for Nushell》里讲得非常直白：**Unix 管道锁死了"表示"和"呈现"** —— 因为 `ls` 必须输出文本，所以每个命令都要靠几十个 flag（macOS 的 `ls` 有 45 个 flag）来调整显示；下游 `grep`/`awk` 又必须用正则去"反向猜测"上游文本的形状。这种耦合让 Shell 脚本既难写又难读，`fi` 和 `esac` 这种残留语法更是被作者直接点名"是当年没开完的玩笑"。
Nushell 想解决的是这个 **底层架构问题**，而不是把 bash 渲染得更漂亮。
---
## 三、核心机制：把 Shell 变成 "SQL + Rust" 的混血儿
理解 Nushell 只需要抓住三条主线。
### 3.1 管道里流的不是字符，是"表格"
最经典的入门示例，写出来就像人话：
```nu
ls | where size > 10kb | sort-by modified
```
它不需要你记得 `ls -lS` 之类的 flag，也不需要 `awk '{if ($5 > 10240) print}'` 这种咒语——`ls` 直接返回一张带 `name / type / size / modified` 列的表格，`where` 直接消费结构化数据。
更妙的是，**同一套动词可以作用在任何结构化来源上**：
```nu
ps | where cpu > 40          # 进程表
open data.csv | where age > 30  # CSV 文件
open api.json | get users.items | where score > 90  # JSON
http get https://api.github.com/repos/nushell/nushell | get stargazers_count
```
Nushell 原生支持解析 JSON、YAML、TOML、CSV、XML、Excel（`.xlsx`）、甚至 SQLite——一个 `open` 命令搞定所有"打开"动作，这是它最被低估的能力。
### 3.2 它是一门真正的语言，不是 Shell 附加品
官方反复强调一点：Nushell 是 **"一门编程语言 + 一个 Shell"**，不是带脚本能力的 REPL。这意味着：
- **默认不可变变量**：避免了 bash 里 `$i` 被意外改写的灾难。
- **静态类型检查**：在脚本还没运行时，IDE（VSCode 的 Nushell 扩展）就能标红参数类型错误——这是从 TypeScript 学来的工程化思路。
- **模式匹配**：支持 `match $list { [$one] => {...}, [$head, ..$tail] => {...} }` 这种函数式语法。
- **作用域环境**：环境变量不再像 bash 一样全局污染，而是块级作用域。
### 3.3 用 Rust 实现，换来"开箱即用的跨平台"
Rust 在这里不是炫技：Yehuda 在访谈里说得很直白——**Rust 让 Nushell 一次编译即可在 Windows/macOS/Linux 表现一致**，没有 Cygwin/WSL 的别扭，没有 BSD 和 GNU 命令 flag 不一致的折磨，也没有内存安全问题。对长期被 Windows 终端生态折腾的开发者来说，这一点价值极大。
---
## 四、与主流 Shell 横向对比
| Shell | 管道传递内容 | 语言感 | 跨平台 | 学习成本 | 典型定位 |
|-------|-----------|--------|--------|----------|----------|
| **bash/zsh** | 字符文本 | 弱（语法古老） | 优秀（POSIX 王国） | 中（约定俗成） | 默认登录 Shell、运维脚本 |
| **fish** | 字符文本 | 中（语法更现代） | 良好 | 低 | 日常交互，开箱即用 |
| **PowerShell** | .NET 对象 | 强（但 verb-noun 别扭） | 中（Windows 优先） | 中高 | Windows 自动化、运维 |
| **Nushell** | **结构化表格** | **强（接近函数式语言）** | 优秀（Rust 单二进制） | **高**（需建立新心智模型） | 数据处理、DevOps 脚本、日志分析 |
| **xonsh** | Python 对象 | 强（就是 Python） | 良好 | 中 | Python 用户的 Shell |
横向看，Nushell 是唯一一个 **"既真心想替代 bash 做日常 Shell、又真把"管道即数据"这件事推到极致"** 的项目。PowerShell 走在前面，但它的语法与 .NET 紧耦合，让非 Windows 用户始终隔着一层；fish 美化了交互但没改变底层模型；xonsh 则干脆把 Shell 当 Python 来跑，丢掉了 Unix 命令生态。Nushell 在这些选项里，走出了一条独特的中间路线。
---
## 五、上手体验：安装、配置与第一条管线
### 安装（30 秒搞定）
```bash
# macOS / Linux
brew install nushell
# Windows
winget install nushell
```
也可以从 [Releases 页面](https://github.com/nushell/nushell/releases) 下载预编译二进制（当前最新为 0.115.x，2026 年 8 月发布，平均每月迭代一次）。Docker 镜像同样提供：`docker run -it nushell/nightly:latest`。
### 几条"开眼"示例
**① 浏览一个 JSON API，几行搞定：**
```nu
http get https://api.github.com/repos/nushell/nushell/contributors
| select login contributions
| first 10
```
输出直接是漂亮的表格，不需要 `curl | jq -c '.[]'` 那种拼接。
**② 统计 Nginx 访问日志里最频繁的 IP：**
```nu
open access.log
| lines
| split column " " ip
| group-by ip
| transpose ip hits
| sort-by hits --reverse
| first 5
```
在没有 Nushell 的世界，这是 awk 一行"天书"或者 grep+sort+uniq 组合拳。
**③ 直接读 Excel：**
```nu
open sales.xlsx | get Sheet1 | where revenue > 100000
```
对，不写 Python、不开 Excel，就能筛选 xlsx 里的行。
### 配置
配置文件路径用 `$nu.config-path` 查看，默认配置可以参考仓库的 `sample_config`，语法上更接近 Rust 而非 bash。
---
## 六、生态：插件系统是它真正的护城河
Nushell 内置命令已经覆盖 90% 的日常操作，但生态真正的精华在 **`nu_plugin_*`** 体系：插件以独立二进制形式存在，通过 JSON-RPC 与主进程通信，可以用 Rust、Python、Go 任何语言编写。
几个值得关注的插件：
- **`nu_plugin_polars`** —— 把 Polars（Rust 版 DataFrame）接进来，处理百万行级 CSV 也不会爆内存，这是 Nushell 在"个人数据分析"场景里的杀手锏。
- **`nu_plugin_query`** —— 解析 HTML/XML，做爬虫脚本非常顺。
- **`nu_plugin_explore`** —— 交互式探索嵌套 JSON，类似 `less` 的体验。
社区维护的 [awesome-nu](https://github.com/nushell/awesome-nu) 仓库（1.4k star）收集了大量周边工具。Discord 是官方主战场，月度发布节奏稳定，0.107、0.110、0.113、0.115 一路推进，说明项目在 2019 年立项 6 年后仍处于活跃建设期。
GitHub 数据可以佐证：**40.5k stars / 2.3k forks / 11,874 commits**，早已突破 2024 年 4 月庆祝 30k star 时的体量。
---
## 七、局限与坑：必须诚实说清楚的部分
### 7.1 不是 POSIX，也不是 bash 兼容
这是 Nushell 最大也最刻意的设计取舍。Yehuda 在访谈里的态度很坦率：**"如果你想在 nu 里跑 POSIX 脚本，调 `bash script.sh` 就行；强行兼容只会把 40 年的历史包袱全背进来"**。但现实是：
- **`source` 不通用**：很多工具（nvm、pyenv、conda）用 `source xxx.sh` 初始化环境变量，Nushell 读不懂 bash 语法。官方 Cookbook 里专门写了"Foreign Shell Scripts"一章教你怎么绕，但绕起来始终不如 bash 原生爽。
- **VSCode Remote SSH 会翻车**：如果远程机器把 Nushell 设为登录 Shell，VSCode 的 Remote-SSH 老版本直接连不上，这是 GitHub 上真实存在的 issue。
- **NixOS 等系统强烈建议保留 POSIX Shell 作为登录 Shell**，把 Nushell 当交互 Shell 启动即可。
### 7.2 学习曲线高于预期
看似简单，但有几个反直觉点容易劝退新手：
- 变量必须带 `$`（为了区分 `cd foo` 和 `cd $foo`）。
- 字符串插值用 `$"text ($var)"` 而不是 `"$var"`。
- 环境变量通过 `$env.PATH` 访问，不是 `$PATH`。
- 自定义命令和函数有区分，初学容易混。
### 7.3 仍在 0.x，破坏性变更存在
最近一次 0.107 版本就改了 `find` 的默认大小写行为，导致部分脚本要适配。官方也明示："Nu 的设计仍会随成熟度而调整"。如果你打算把生产脚本压在 Nushell 上，要准备好升级时改代码。
### 7.4 默认登录 Shell 还不是最佳实践
主流共识（包括 Nushell 社区自己）是：**不要 `chsh` 到 nu**，而是把它设置为终端的启动命令（GNOME Terminal/Kitty/iTerm 都能配），或者写一行 bash 启动 nu。这能避开 SSH、cron、系统初始化脚本等一票兼容性坑。
### 7.5 包管理器分发质量不一
有用户报告过用 apt 安装后插件缺失的问题，winget/brew/cargo 渠道相对可靠。
---
## 八、谁应该用它？谁应该观望？
### 强烈推荐立即上手的人群
- **DevOps / SRE**：日志分析、Kubectl 输出过滤、监控数据处理——结构化管道带来的效率提升是数量级级别的。
- **数据工程师 / 后端**：天天和 JSON、CSV、Parquet 打交道，Nushell 能替代掉 80% 的 jq/awk 场景。
- **跨平台开发者**：在 macOS / Linux / Windows 三边跑的人，一个工具统一所有终端体验。
- **Shell 脚本受害者**：被 bash 的引号嵌套和 `set -euo pipefail` 折磨过的人，会爱上 Nushell 的类型检查。
### 观望 / 不建议立刻切换的人群
- **运维主力环境是远程服务器**：远程依然是 bash 的天下，本地用 Nushell 体验极佳，远程 SSH 还是用 bash 稳。
- **重度依赖既有 bash/zsh 配置**：迁移成本不小，需要重写大量 alias 和函数。
- **追求极致稳定性**：脚本压在 0.x 版本上，要有心理准备。
### 折中方案：把 Nushell 当"瑞士军刀"用
最高性价比的接入方式是 **"保留 bash/zsh 作为登录 Shell，把 Nushell 当作数据处理工具来调用"**：
```bash
# 在 bash 里临时调用 Nu 做数据操作
nu -c "open data.csv | where revenue > 1000 | to json"
```
这样既享受 Nushell 的数据处理能力，又不动现有的 Shell 生态——也是社区里不少资深用户的真实用法。
---
## 九、终极评判
Nushell 是过去 5 年里 Shell 领域**最具原创性**的项目。它没有走"bash 加点语法糖"的老路，也没有照抄 PowerShell 的对象模型，而是从底层重写了数据流模型，把 Shell 从"字符处理 glue"升级成"结构化数据查询引擎"。这种敢于放弃 POSIX 兼容的勇气，来自作者对语言设计的深度积累——Yehuda Katz 参与 TypeScript 和 Rust 的经历，在 Nushell 的类型系统、错误信息、IDE 支持上都看得出影子。
它离"人人默认 Shell"还有距离，POSIX 生态的惯性也决定了它短期内不可能取代 bash 在服务器端的地位。**但作为个人生产力工具，它已经是同类项目里最完整、最跨平台、最值得投入学习的那一个。**
**给你的三步行动建议：**
1. **今天**：`brew install nushell`（或 `winget install nushell`），花 10 分钟在终端里跑一遍 `ls | where size > 1mb`、`http get https://api.github.com/repos/nushell/nushell` 这类示例。
2. **本周**：用 Nushell 重写一个你最烦的 bash 数据处理脚本（通常是日志分析或 JSON 清洗），感受一下"没有 awk"的世界。
3. **本月**：读一遍 [Nushell Book 的 "Thinking in Nu" 章节](https://www.nushell.sh/book/thinking_in_nu.html)，建立"一切皆表格"的心智模型，再决定要不要把它设为日常 Shell。
对于每天在命令行里和"数据"打交道的人，Nushell 是一项不投就亏的学习投资；对于只是写写 `ls` 和 `cd` 的人，它可能永远只是个新闻里的项目。判断标准很简单：**你日常脚本里出现 `awk` 或 `jq` 的频率，决定了 Nushell 对你的价值。**
