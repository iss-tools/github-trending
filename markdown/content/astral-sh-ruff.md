# astral-sh/ruff

[GitHub URL](https://github.com/astral-sh/ruff)


## Ruff 深度评测：Rust 打造的 Python 代码质量神器

> 用 Rust 编写的 Python 代码检查 + 格式化二合一工具，比传统方案快 10-1000 倍，一个工具顶十几个。

- **Tags**: Python, Rust, Linter, 代码格式化, 开源项目
- **Category**: 开发工具, 编程效率, 代码质量

## Details

# Ruff 深度评测：一柄 Rust 锻造的 Python 代码质量"瑞士军刀"
> 一句话总结：**Ruff 是一个用 Rust 重写的 Python Linter + Formatter 二合一工具，比传统工具快 10-1000 倍，能用一个二进制替代 Flake8 + Black + isort + pyupgrade + autoflake 等十几件套，已经是 2025 年 Python 生态事实上的新基础设施。**
---
## 一、项目背景与诞生契机
要理解 Ruff 为什么出现，得先看 Python 代码质量工具的"老大难"现状。
在 Ruff 出现之前，一个"成熟"的 Python 项目通常会挂着这样一串工具链：**Flake8**（风格检查）+ **Black**（格式化）+ **isort**（import 排序）+ **pydocstyle**（docstring 检查）+ **pyupgrade**（语法升级）+ **autoflake**（清理无用 import）+ 一堆 `flake8-*` 插件。每个工具有自己的配置文件、自己的安装依赖、自己的运行耗时，加起来动辄几十秒的 CI 时间，本地开发更是让人忍无可忍。
更致命的是**性能瓶颈**。Python 写的 linter 在解析大型代码库时慢得离谱——Pylint 在 Dagster 这种 25 万行代码的项目上要跑 2.5 分钟，Flake8 也要 20 秒上下。
2022 年，Charlie Marsh（前 Khan Academy 工程师）创立了 **Astral**，启动了 Ruff 项目，核心理念非常激进：**用 Rust 重写整个工具链，做一个"瑞士军刀"式的统一入口**。2024 年，Astral 又顺势推出了 Python 包管理器 **uv** 和类型检查器 **ty**，三位一体构成了 Python 开发体验的整套新底座。
到了 2026 年 3 月，**OpenAI 宣布收购 Astral**，团队并入 Codex 团队。Charlie Marsh 承诺"继续开源、继续在公开环境构建"，但 Simon Willison 等社区观察者仍然担心：单个公司持有 Python 关键基础设施的战略风险已经从"VC 支持的创业公司"升级为"AI 巨头"。所幸 MIT 协议保证了 fork 出路——Astral 团队成员 Douglas Creager 在 HN 上明确表态："工具是宽松许可证的，最坏情况是 fork 后继续前进，而不是软件消失"。
---
## 二、核心亮点剖析
### 2.1 极致性能：数字背后的工程哲学
Ruff 的速度不是营销话术，是可复现的 benchmark。在一份 47,000 行、180 个文件的真实 FastAPI 生产项目上：
| 工具 | 耗时 | 相对 Ruff |
|------|------|-----------|
| **Ruff** | **0.18 s** | 1× |
| Flake8 | 8.34 s | ~46× |
| Pylint | 47.21 s | ~262× |
Astral 官方收录的 testimonial 更夸张：Dagster 创始人 Nick Schrock 在 25 万行代码上测出 **Pylint 2.5 分钟 vs Ruff 0.4 秒**，接近 1000 倍差距。
速度的本质来自三层设计：
1. **Rust 写的"原生二进制"**——没有 Python 解释器启动开销，没有 GIL；
2. **原生并行**——从第一行代码就按多线程设计，自动利用全部 CPU 核心；而传统 Python linter 大多是单文件串行；
3. **手写递归下降 parser**——v0.4.0 把 LALRPOP 生成的 parser 替换为手写版本，单 parser 快 2.2-2.4 倍，整体 lint/format 流程再提速 20-40%。
**这个速度改变了使用范式。** 当 linter 只要 0.2 秒时，你敢把它放进 pre-commit、敢放进编辑器实时保存触发、敢让 AI Agent 在每次生成代码后调用一次；当 linter 要 47 秒时，它只配躺在 CI 里被绕过。FastAPI 作者 Sebastián Ramírez 的调侃一针见血："Ruff 快到我有时故意写个 bug，只为确认它真的在跑"。
### 2.2 一站式替代：从"工具链"到"单二进制"
Ruff 内置了 **900+ 条 lint 规则**，把以下工具的能力原生重写进了 Rust：
- **Flake8 + 50+ 插件**：bugbear、bandit、comprehensions、pydocstyle、pyupgrade、return、simplify、use-pathlib、django、pytest-style……（完整清单见 README）
- **Black**：作为 formatter，目标是 drop-in 替换
- **isort**：import 排序（规则前缀 `I`）
- **autoflake / eradicate / flynt / mccabe / pep8-naming** 等
意味着你的项目依赖从 8 个减到 1 个，CI 时间从 60 秒降到 0.5 秒，配置文件从 3 个收敛到 1 个 `pyproject.toml`。
### 2.3 架构精妙之处：editor-first 的设计哲学
Ruff 的架构有几个值得技术读者细品的地方：
**手写 parser 换来"错误恢复"能力。** 传统 parser 一遇到语法错误就崩，编辑器里写到一半的代码会无法 lint。Ruff 的手写 parser 为"部分正确的代码继续分析"打了地基——这对 VS Code 实时诊断至关重要。
**Formatter 基于 Rome 的 `rome_formatter` fork**，借鉴了 Prettier 的"幂等 + 良好注释保留"思路，同时保持与 Black 的高度兼容。
**Import 解析算法借鉴 Pyright**，让 `F821`（未定义名）这类需要跨文件感知的规则有了基础——但这也是后面要讲的"重灾区"。
**缓存机制内置**，未变更文件不会被重复分析，第二次运行基本是瞬时返回。
### 2.4 配置与 DX：开发者体验拉满
Ruff 的 DX 设计有几点很讨喜：
- **零配置可用**：默认规则集覆盖 `F`/`E`/`B`/`UP`/`RUF`，自动避开与 formatter 冲突的风格规则，开箱即用不打架；
- **三选一配置文件**：`pyproject.toml` / `ruff.toml` / `.ruff.toml`，monorepo 支持层级覆盖与级联；
- **安装方式多到离谱**：`pip`、`uv`、`pipx`、`brew`、`conda`、独立 install.sh，还有 `uvx ruff@latest check` 这种一次性运行方式；
- **生态接驳齐全**：pre-commit hook、GitHub Action（`astral-sh/ruff-action`）、VS Code 官方扩展应有尽有。
---
## 三、快速上手与实战示例
### 3.1 三分钟接入
```bash
# 推荐用 uv
uv add --dev ruff
# 或经典 pip
pip install ruff
```
### 3.2 最小可用的 `pyproject.toml` 配置
```toml
[tool.ruff]
line-length = 88
target-version = "py311"
exclude = [".venv", "migrations", "build"]
[tool.ruff.lint]
# 推荐的进阶规则组合
select = [
    "E",   # pycodestyle errors
    "W",   # pycodestyle warnings  
    "F",   # pyflakes
    "I",   # isort
    "B",   # flake8-bugbear（常见 bug）
    "C4",  # flake8-comprehensions
    "UP",  # pyupgrade（现代化语法）
    "S",   # flake8-bandit（安全）
    "SIM", # flake8-simplify
    "RUF", # ruff 专属规则
]
ignore = ["E501", "B008", "S101"]
[tool.ruff.lint.per-file-ignores]
"__init__.py" = ["F401"]       # 允许 re-export
"tests/*" = ["S101", "S105"]   # 测试里允许 assert
[tool.ruff.format]
quote-style = "double"
indent-style = "space"
```
### 3.3 日常工作流
```bash
ruff check .            # 跑 linter
ruff check . --fix      # 自动修复可修复问题
ruff format .           # 跑 formatter
ruff format --check .   # CI 里检查格式
```
### 3.4 pre-commit 接入
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.17.3
    hooks:
      - id: ruff-check
        args: [--fix]
      - id: ruff-format
```
### 3.5 一个直观的"能力对比"案例
考虑这段典型遗留代码：
```python
def get_user(user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        return user.name
    # 没有 else，隐式返回 None
```
三家工具的反应截然不同：
- **Flake8**：完全静默，什么问题也发现不了；
- **Ruff**：触发 `RET504`（不必要的中间变量 / 隐式 None 返回），给出修复建议；
- **Pylint**：进一步提示函数返回类型不一致（一会儿 `str`，一会儿 `None`），可能引发下游 NPE。
这个案例完美诠释了 Ruff 的定位——**比 Flake8 深入，但比 Pylint 浅一层**。
---
## 四、竞品对比：Ruff 在生态中的真实位置
为您梳理 2025-2026 年这个赛道上的核心玩家：
| 工具 | 语言 | 速度 | 规则数 | 自定义插件 | 类型检查 | 替代 Ruff？ |
|------|------|------|--------|-----------|----------|-------------|
| **Ruff** | Rust | ⚡⚡⚡⚡⚡ | 900+ | ❌ 不支持 | ❌（ty 在做） | — |
| Flake8 | Python | 慢 | 视插件 | ✅ 强 | ❌ | Ruff 可替代 |
| Pylint | Python | 很慢 | 400+ | ✅ 强 | ❌ | 部分（深分析不替代） |
| Black | Python | 中 | （仅 format） | — | — | Ruff format 可替代 |
| isort | Python | 中 | （仅 import） | — | — | Ruff I 规则可替代 |
| mypy | Python | 慢 | — | ✅ | ✅ | ❌ 完全不冲突 |
| ty | Rust | ⚡⚡⚡⚡ | — | — | ✅ | Astral 亲儿子，互补 |
| Pyright | TS | 快 | — | — | ✅ | 同上，类型检查专用 |
**一句话定位：Ruff 不是用来替代 Pylint 的"深度 bug 探测器"，更不是 mypy 的对手——它是把"风格 + 常见 bug + 现代化"这一层做成了基础设施，把"深度分析 + 类型"留给了专门的工具。**
---
## 五、适用场景与目标人群
### 强烈推荐接入
- **个人开发者**：把 5 个工具换成 1 个，本地体验直接起飞；
- **中小型团队**：pre-commit + CI 双闸门，0.2 秒的反馈让规则真正被执行；
- **Monorepo / 大型代码库**：层级配置 + 缓存 + 并行，专为这种场景设计；
- **开源项目**：Apache Airflow、Superset、FastAPI、Hugging Face、Pandas、SciPy、Zulip 都在用，社区惯例已成；
- **AI Coding Agent 场景**：Agent 生成的代码量极大，需要快速、廉价、可重复的质量反馈循环，Ruff 是 Codex、Claude Code 等工具的理想 lint 后端。
### 暂时不适合
- **依赖大量自定义 Flake8 插件**的存量项目（Ruff 不支持第三方规则，迁移前要评估）；
- **需要 Pylint 级深度的静态分析**（如复杂条件下的未定义变量、返回类型推断）的关键业务系统——可以 Ruff + Pylint 共存；
- **强依赖 mypy/Pyright 做类型保障**的项目——Ruff 不做类型检查，搭配 Astral 自家的 **ty**（也在快速演进）或 Pyright 更合适。
---
## 六、局限性与避坑指南
诚实地说，Ruff 也有它的"暗面"。下面几条是真实用户最容易踩的坑：
### 6.1 不支持第三方/自定义规则
这是 Ruff 与 Flake8 / Pylint 最本质的差异。Flake8 的插件生态是它的灵魂，Pylint 的 checker 体系也是，但 Ruff 为了保持"纯 Rust 原生实现"的极致性能，**主动放弃了插件机制**，所有 900+ 规则都是官方内置。
如果你的团队有定制化 lint 需求（比如"禁止调用内部某个 deprecated API"），目前只能靠 `per-file-ignores` 硬扛或长期保留 Flake8。社区有讨论把"code quality beyond linting"（架构强制、耦合度指标等）留给 import-linter、tach、radon 等专门工具。
### 6.2 F821（undefined-name）误报重灾区
Ruff 的 import 解析借鉴 Pyright，但它是**单文件 + 项目级配置**的轻量感知，没有完整的类型推断和虚拟环境感知。结果就是：
- 动态导入（`__import__`、`importlib`）经常被误判；
- C 扩展模块、未在配置中声明的 stub 包会触发大量 F821；
- Django ORM 的 `objects`、SQLAlchemy 的隐式属性等"魔法属性"也容易中招。
**避坑动作**：善用 `lint.dummy-variable-rgx`、`per-file-ignores` 和 `lint.typing-modules` 这几个配置；必要时在文件头用 `# noqa: F821` 精准抑制，而不是全局关掉规则。
### 6.3 Formatter 与 Black 并非 100% 兼容
Astral 官方维护了一份《Known Deviations from Black》文档，列举了**有意为之**的差异，常见的有：
- **行尾注释处理**：Black 会把多行表达式折叠成单行、把注释挪到行末；Ruff 像 prettier 一样保留展开形式，以维持注释语义；
- **pragma 注释（`# noqa`、`# type`）**：Ruff 计算行宽时忽略 pragma 注释，避免折叠后 `# noqa` 失效；
- **f-string 内表达式格式化**：Ruff 会重排 f-string 内部的空格和引号，Black 不动；
- **长嵌套表达式的括号化**：Black 24+ 会加括号，Ruff 倾向于保留 Black 23 的样式；
- **代码块开头的空行**：Ruff 强制移除，Black 24 允许保留。
**避坑动作**：存量项目从 Black 切到 Ruff format 时，先在分支上跑 `ruff format` 看 diff，确认团队和 CI 能接受这些差异再合入。混用 `black` 和 `ruff format` 会反复改写代码，必须二选一。
### 6.4 一次性开全规则 = 噪音海啸
老项目直接 `select = ["ALL"]` 会瞬间冒出几千条警告，团队会直接崩溃然后放弃 Ruff。
**正确的渐进式迁移路径**：
1. 先用默认规则集跑一遍 `ruff check . --statistics` 看分布；
2. 优先 `--fix` 掉自动可修复项；
3. 把无法立即修复的规则先 `ignore`，记入 issue；
4. 每个迭代解锁一批规则，逐步收紧。
### 6.5 版本节奏激进，preview 模式慎用
Ruff 至今仍是 0.x 版本（当前 v0.17.3），意味着小版本之间可能有不兼容变化、新规则默认开启等。官方提供了 `preview = true` 的 unstable 通道，**生产项目建议锁定版本 + 关闭 preview**，避免升级后 CI 突然爆红。
### 6.6 治理风险：从 Astral 到 OpenAI
2026 年 3 月 OpenAI 收购 Astral 后，ruff/uv/ty 进入 OpenAI Codex 团队。Charlie Marsh 承诺继续开源，但**战略方向是否会被重新对齐到 Codex 而非 Python 社区整体**，仍有不确定性。Simon Willison 的判断比较中肯：MIT 协议 + 工程质量保证了"最坏情况是 fork"，但社区仍需观察 OpenAI 是否会把资源倾斜到 agent 集成而非纯粹的工具改进上。
---
## 七、结语与行动建议
**Ruff 已经跨过了"新工具"和"基础设施"的分水岭。** 它做的事听起来平平无奇——把 linter 写快一点、把工具链合并一下——但它改变了 Python 开发者对"代码质量检查"的心理预期：从一个"偶尔跑一次、拖慢 CI 的繁琐流程"，变成"每次保存都跑、快到无感的呼吸动作"。
它不是完美的：不支持插件、深度分析不如 Pylint、与 Black 有微小差异、还有 OpenAI 收购带来的治理悬念。但在它的能力边界内，**几乎没有竞品能在 DX、性能、规则覆盖的三角里同时接近它**。
### 给不同读者的行动清单
- **个人开发者**：今晚就在一个 side project 里 `pip install ruff` 跑一下，体会 0.2 秒 lint 整个仓库的快感；
- **团队 Tech Lead**：列一个迁移 PR，把 flake8 + black + isort 三件套干掉，用上面那份最小配置起步；
- **存量遗留项目**：按"渐进式迁移路径"分阶段解锁规则，不要试图一夜翻身；
- **关心 Python 基础设施的人**：把 OpenAI 收购 Astral 这条线标记进 radar，观察 6-12 个月后 ruff/uv/ty 的演进方向是否偏离社区预期——如果偏离，MIT 协议会让 fork 之路比想象中好走。
> **终极评判**：在 2026 年的 Python 生态，新项目不上 Ruff 几乎没有理由，存量项目迁移 Ruff 的 ROI 也高到不需要论证。它值得你立刻花 10 分钟试一下——这种评价，对一个开发工具来说已经是顶格了。
