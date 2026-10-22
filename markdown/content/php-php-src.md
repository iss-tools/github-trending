# php/php-src

[GitHub URL](https://github.com/php/php-src)


## php-src 深度评测：驱动全球 78% 网站的 PHP 语言发动机源码全解析

> php-src 是 PHP 语言本体的官方 C 语言源码仓库，是真正在服务器上执行 PHP 代码的'发动机'，支撑着 WordPress、Wikipedia 等全球大量网站。

- **Tags**: PHP, 开源项目, C语言, 虚拟机, 源码解析
- **Category**: 开发工具, 开源项目, 编程语言

## Details

# php-src 深度评测：驱动全球 78% 网站的"发动机"究竟长什么样？
> **一句话总结**：`php/php-src` 是 PHP 语言本体的官方 C 语言源码仓库——它不是某个 PHP 框架或工具库，而是那个在你每次 `php index.php` 时真正在执行的"发动机"本身。它支撑着 Wikipedia、WordPress.com、Slack、Wikipedia 等重量级网站，仓库长期稳定在 **40,000+ Stars、8,000+ Forks**，是 GitHub 上最古老、最长寿、也最值得工程师解剖的项目之一。
如果你是一名 PHP 业务开发者，读这篇文章能帮你搞清楚"为什么 PHP 8 比 PHP 5 快几倍、JIT 到底做了什么、为什么这段代码跑得慢"；如果你是系统程序员或编译器爱好者，这里有一座免费、开放、持续迭代近三十年的"虚拟机考古现场"；如果你是技术管理者，了解 php-src 的治理模式（RFC + PHP Foundation）会让你重新评估 PHP 这门语言的长期生命力。
---
## 一、背景与痛点：它到底"是"什么？
### 1.1 别把它和 Composer 上的 PHP 包搞混了
很多开发者第一眼看到 `php-src` 会误以为这是某个 PHP 框架、类库或工具的仓库。**它不是**。
打个比方：
- 你在 Packagist / Composer 上看到的 Laravel、Symfony、 Guzzle，是"造好的汽车"；
- 你写的那一行行业务 PHP 代码，是"司机踩下的油门"；
- 而 `php-src`，是**发动机、变速箱、底盘的整套设计图纸和制造车间**。
它是用 C 语言写的，编译之后就是你服务器上那个 `php` 可执行文件本身。没有这个仓库，世界上就根本没有 PHP 这门语言。
### 1.2 它解决的痛点：让"为 Web 而生"变得极致务实
PHP 诞生于 1994 年 Rasmus Lerdorf 之手，最初只是用来追踪个人主页访问量的 CGI 脚本集合。到今天，它已经演化为一门成熟的通用脚本语言，核心设计哲学始终未变——**Fast, flexible and pragmatic（快、灵活、务实）**，这是仓库 README 的第一句话。
它在架构层面要同时解决几个近乎矛盾的难题：
- **部署友好**：没有 Node.js 的 npm install 地狱，也没有 Java 的 JVM 调优门槛，一份代码丢上去就能跑；
- **性能极致**：每秒要处理 WordPress 这种全球跑的 CMS 的海量请求；
- **向后兼容**：世界上有数以亿计行的存量 PHP 代码，不能像 Python 2→3 那样硬切换；
- **持续演进**：同时还要每年发布一个包含新语法特性的大版本（PHP 8.4 于 2024-11-21、PHP 8.5 于 2025-11-20 发布）。
理解了这四重矛盾，你才能体会 php-src 的设计为什么"长这样"。
---
## 二、核心亮点：解剖这台"发动机"
### 2.1 目录架构：一次说清 Zend / ext / sapi / main 各是干嘛的
打开仓库根目录，你不会看到一堆莫名其妙的 C 文件，而是被精心划分的几个大块。可以用"汽车厂"的比喻来记忆：
| 目录 | 作用 | 比喻 |
|---|---|---|
| **`Zend/`** | Zend Engine 核心：词法扫描器、语法分析器、编译器、虚拟机（Zend VM）、JIT | 汽车的**发动机本体** |
| **`ext/`** | 所有 PHP 内置扩展（PDO、curl、json、mbstring、mysqli…）以及扩展骨架生成器 | 汽车**可插拔的模块化配件** |
| **`sapi/`** | Server API：CLI、FPM、CGI、embed、litespeed 等与外部世界的"接口层" | 汽车的**不同驾驶模式与仪表盘** |
| **`main/`** | PHP 整体初始化、配置解析（php.ini）、请求生命周期管理 | 汽车的**点火系统和主控电路** |
| **`TSRM/`** | Thread-Safe Resource Manager，线程安全资源管理器 | 多个司机共用一辆车时的**方向盘隔离机制** |
资深 PHP 工程师 Sara Golemon 和 Nikita Popov 都曾总结过一条朴素的定位规律：**"如果你要找的功能出现在 PHP 手册的《语言参考》里，去 `Zend/` 找；如果出现在《函数参考》里，去 `ext/` 找。"**
这个分类之清晰，对于一门近三十年的 C 项目来说实属罕见——很多同期的开源项目目录早已经历过数次"考古地层"，而 php-src 的核心结构至今仍然让新人能在半小时内建立心智模型。
### 2.2 Zend Engine 的执行流水线：从 `.php` 文件到机器码
这是理解 php-src 的**核心认知钥匙**，用一张简图就能讲清楚：
```
你的 foo.php 文本
     ↓ 词法分析   →  变成一串 token
     ↓ 语法分析   →  变成 AST（抽象语法树）
     ↓ 编译       →  变成 opcode（类似 Java 字节码）
     ↓ OPcache    →  把 opcode 缓存到共享内存，下次跳过前三步
     ↓ Zend VM    →  逐条解释执行 opcode
     ↓ JIT (PHP 8+) →  把热点 opcode 编译成原生机器码，CPU 直接跑
```
打一个通俗的比方：
- **词法+语法分析**像把一篇英文文章切成单词和句子；
- **编译成 opcode**像把英文翻译成一种"通用简化语言"；
- **Zend VM**像拿着这本简化语言逐句朗读的"讲解员"；
- **OPcache**是把翻译稿复印一份贴墙上，下次不用再翻原文；
- **JIT**则是干脆把最常被朗读的那几页**直接背下来**，张口就来，连"翻译稿"都跳过。
几个关键源文件值得任何想深入内部的人收藏：
- `Zend/zend_language_scanner.l` —— re2c 语法的词法规则文件；
- `Zend/zend_language_parser.y` —— Bison 语法的语法规则文件；
- `Zend/zend_vm_def.h` —— VM 定义（人类可读版）；
- `Zend/zend_vm_execute.h` —— 由 `zend_vm_gen.php` 生成的最终 VM（巨大，别手改）；
- `Zend/zend_vm_opcodes.h` —— 所有 opcode 的编号，`ZEND_ADD`、`ZEND_MUL`、`ZEND_FETCH_DIM_R` 等等。
**一句行业实话**：JIT 自 PHP 8.0 引入，但社区实测中，**对 WordPress、Laravel 这类 IO 密集型 Web 应用，JIT 在 OPcache 之上带来的额外收益通常只有个位数百分比**。Tideways 的 8.2 → 8.3 → 8.4 对比显示，主流框架性能差异不大；真正受益于 JIT 的是**CPU 密集型**场景（数学计算、图像处理、机器学习推理）。
### 2.3 构建体验：对老牌 C 项目来说算是"友好"的
想从源码编一份 PHP 出来？仓库 README 把命令准备得清清楚楚：
```bash
# Ubuntu 一行装齐所有依赖
sudo apt install -y pkg-config build-essential autoconf bison re2c \
                    libxml2-dev libsqlite3-dev
# 克隆 & 编译
git clone https://github.com/php/php-src.git
cd php-src
./buildconf --force
./configure --enable-debug     # 开发模式推荐，含调试符号
make -j$(nproc)                # 按 CPU 核数并行编译
# 跑完内置测试套件（数万个 .phpt 用例）
make test
```
macOS 用 brew 装同款依赖，Fedora 用 dnf，都有官方命令。Windows 走独立分支 `windows.php.net` 提供 prebuilt 二进制。
几个**实战小贴士**：
- 第一次构建，加 `--enable-debug` 能让你用 gdb 单步跟踪 VM 行为，强烈推荐；
- 编译后可以用 `sapi/cli/php -v` 直接跑刚编出来的 CLI 版本，不必 `make install`；
- 想只跑某个子目录的测试：`make TESTS=tests/lang/ test`；
- 想并行跑测试：`make TEST_PHP_ARGS=-j4 test`。
对一个 C 项目来说，这套文档化程度已经超过绝大多数同体量开源项目——和 LLVM、V8 这种"读完 README 依然懵"的庞然大物相比，php-src 算得上"新手友好型 C 工程范本"。
### 2.4 写一个最小 PHP 扩展：感受一下"给发动机加一个配件"
想真正"上手"php-src，最友好的切入点是写一个 C 扩展。仓库自带骨架生成器：
```bash
# 用官方脚本生成一个叫 hello 的扩展骨架
php ext/ext_skel.php --ext hello --dir .
cd hello
ls
# config.m4   config.w32   hello.c   php_hello.h   tests/
```
然后在 `hello.c` 里写一个最简单的函数：
```c
#include "php.h"
PHP_FUNCTION(hello_world) {
    RETURN_STRING("Hello from C extension!");
}
static const zend_function_entry hello_functions[] = {
    PHP_FE(hello_world, NULL)
    PHP_FE_END
};
zend_module_entry hello_module_entry = {
    STANDARD_MODULE_HEADER,
    "hello",
    hello_functions,
    NULL, NULL, NULL, NULL, NULL,
    "0.1.0",
    STANDARD_MODULE_PROPERTIES
};
#ifdef COMPILE_DL_HELLO
ZEND_GET_MODULE(hello)
#endif
```
编译加载：
```bash
phpize
./configure --enable-hello
make
php -d extension=hello.so -r "var_dump(hello_world());"
// string(23) "Hello from C extension!"
```
这就是 PHP 生态的一个"魔法"——**你可以用 C 写一个函数，然后像原生 PHP 函数一样在业务代码里调用**。今天你用到的 `json_encode`、`curl_exec`、`PDO::query`、`str_contains`，全部都是这样来的。
### 2.5 PIE：PECL 的接班人，扩展安装体验的现代化
2024 年起，PHP 社区开始推动 **PIE（PHP Installer for Extensions）** 来替代老古董 PECL。从 php-src 的 README 你已经能看到它被放在 PECL 之前推荐，这是生态层面的一个明确信号：扩展安装正在从"phpize + make"走向 Composer 式的 `pie install vendor/extension` 体验。
如果你维护自定义扩展，这是一个值得现在就关注的方向。
### 2.6 治理模式与社区活跃度：不是"某大厂说了算"
这是 php-src 最容易被低估、却最值得中国工程师研究的一面。
- **RFC 流程**：任何新语法/新功能必须走 RFC（Request for Comments），在 wiki.php.net 公开讨论 + 邮件列表辩论 + 社区投票，通过才能进 master。你用的 `readonly`、`enum`、`property hooks`、`|>` pipe 操作符，都是这么一票一票投出来的。
- **Bug 修复不需要 RFC**，只要在 commit message 里写 `Fix GH-12345` 关联 GitHub issue 即可，流程相当敏捷。
- **PHP Foundation** 自 2021 年底成立以来，**通过 JetBrains、Symfony、Laravel 等公司和个人的捐赠，资助了 10 名核心开发者全职/兼职维护 php-src**。2023 年收到约 41.8 万美元捐款，这批受资助开发者贡献了当年一半以上的代码变更。
- **近况**：2026 年 5 月，PHP Foundation 还宣布资助"Ecosystem AI Security Engineer in Residence"，专门应对 AI 时代供应链与扩展安全问题。
这就回答了一个很多人担心的问题：**"PHP 会不会像 Flash 那样死掉？"** 至少从治理结构上，php-src 已经从早期 Zend 公司主导，成功过渡到基金会化 + 开源社区化，商业依赖被稀释，长期生命力反而更强。
---
## 三、目标人群：谁该打开这个仓库？
### 3.1 收益矩阵
| 你是谁 | 能从 php-src 拿到什么 | 投入产出比 |
|---|---|---|
| **业务 PHP 开发者**（Laravel/ThinkPHP 用户） | 理解 JIT、OPcache、引用计数，能写出"引擎友好"的代码，性能调优不再靠玄学 | ⭐⭐⭐⭐ |
| **扩展 / 中间件作者** | 必修课。不懂 php-src 等于不会写生产级扩展 | ⭐⭐⭐⭐⭐ |
| **SRE / DevOps** | 看懂 OPcache、FPM 进程模型、内存分配策略，能让 K8s 里的 PHP Pod 稳定翻倍 | ⭐⭐⭐⭐ |
| **编译器 / 虚拟机爱好者** | 一份工业级、活跃维护、代码量可控的 VM 实现样本，比啃 LLVM 友好得多 | ⭐⭐⭐⭐⭐ |
| **学生 / 转行者** | 通过读源码理解"解释型语言"到底是什么，含金量远高于再做几个 CRUD 项目 | ⭐⭐⭐⭐ |
| **纯前端 / Go / Java 开发者** | 收益有限，除非你所在团队有 PHP 遗留系统 | ⭐ |
### 3.2 深入路径建议
如果你属于前几类，**不要试图从 `git clone` 第一天就读懂所有代码**。推荐的阅读顺序：
1. 先读 [phpinternalsbook.com](https://www.phpinternalsbook.com)，这是社区公认的"官方之外最好的 internals 教程"；
2. 再读 Nikita Popov 的《PHP 7 Virtual Machine》——这是理解 Zend VM 最清晰的一篇博客；
3. 然后挑一个你感兴趣的扩展（比如 `ext/json`），从头到尾读完；
4. 最后再挑战 `Zend/` 核心执行器。
---
## 四、竞品对比：php-src 在"脚本语言实现"这个赛道的位置
为了让你对它的工程地位有直观感受，我们把它和另外几大主流语言的"官方解释器/运行时"放一起：
| 项目 | 语言本体 | 核心语言 | Stars 数量级 | JIT | 主要优势 | 主要短板 |
|---|---|---|---|---|---|---|
| **php/php-src** | PHP | C | ~40k | ✅（PHP 8+） | 部署极简、Web 生态最厚、向后兼容极佳 | 通用计算 / AI 场景弱 |
| **php/php-src 的老对手：nodejs/node** | JavaScript | C++ | ~110k | ✅（V8） | 事件驱动、全栈同构 | 回调地狱、内存占用高 |
| **python/cpython** | Python | C | ~65k | ❌（3.13 才有实验性） | AI / 科学计算霸主 | Web 并发弱、GIL 长期之痛 |
| **ruby/ruby** | Ruby | C | ~22k | ✅（YJIT，Ruby 3+） | DSL 与 Rails 生产力之王 | 性能仍弱于 PHP 8 |
| **lua/lua** | Lua | C | ~9k | ❌（LuaJIT 是独立分支） | 嵌入式、极小、极快 | 生态小、标准库贫瘠 |
**几点横向洞察**：
- **"Stars 不等于工程难度"**。php-src 的 40k 看似不如 Node.js 亮丽，但它的贡献门槛是 C 语言 + 虚拟机知识 + RFC 政治能力，比大多数 JS 仓库高一档。
- **"性能叙事"上，PHP 已经洗刷"慢"的污名**。phpbenchlab 在 2026 年对 PHP 8.5 vs Node.js vs Go vs Python 的 CPU 密集测试中，PHP 8.5 JIT 已经能在 Fibonacci 这类基准上与 Node.js 同台竞技，显著优于 CPython。
- **"Web 场景"上，PHP 依然是王**。W3Techs 数据显示 PHP 驱动 **78% 以上已知服务端语言的网站**，这个数字多年来稳如泰山。
### 关键里程碑时间线
php-src 的发展，几乎就是一部现代脚本语言演化史：
- **1995**：Rasmus Lerdorf 发布 PHP/FI；
- **1999**：Zeev Suraski & Andi Gutmans 重写引擎，Zend Engine 1.0 诞生，PHP 4 起飞；
- **2004**：PHP 5 引入完整的 OOP 模型；
- **2015**：**PHP 7**——基于 PHPNG 分支的重写，性能相对 PHP 5 翻倍，是 php-src 历史上最重要的单次重构；
- **2020**：**PHP 8** 引入 JIT、命名参数、union types、`match` 表达式；
- **2022**：PHP Foundation 正式落地，核心开发者从"用爱发电"转向"基金会资助"；
- **2024.11**：**PHP 8.4** 发布——property hooks、asymmetric visibility、lazy objects、新 DOM API；
- **2025.11**：**PHP 8.5** 发布——pipe 操作符 `|>`、内置 URI 扩展、`array_first()`/`array_last()`、fatal error backtrace、clone-with；
- **2026**：PHP 8.6 进入 active development，预计 2026 年底发布。
---
## 五、局限与不足：客观说说不方便的地方
任何严肃评测都必须敢于指出短板，php-src 也不例外。
### 5.1 入门曲线依旧陡峭
尽管 README 已较友好，但想"读懂"和"能跑"是两回事：
- 你需要**扎实的 C 语言功底**——尤其是指针、宏、内存管理；
- 你需要理解 PHP 特有的 **zval 结构**、**引用计数（refcount）**、**写时复制（COW）**；
- 大量代码用**宏**堆叠（如 `ZEND_FE`、`ZEND_HASH_FOREACH`），调试时跳转体验远不如现代 IDE 下的 JS/Go。
### 5.2 文档断层与"内部知识口口相传"
- **phpinternalsbook.com 很好，但仍不够完整**，很多章节停留在 PHP 7 时代；
- **Nikita Popov 离开 PHP 核心团队加入 LLVM 后**，像他那样持续输出 internals 深度博客的作者变少了；
- **很多真正"为什么这么设计"的知识**，只存在于 internals@lists.php.net 邮件列表的漫长讨论串里，检索体验糟糕。
### 5.3 RFC 流程的"双刃剑"
RFC 机制保证了**决策透明**，但代价是：
- **一个语法特性从提出到进 master，平均耗时 6-18 个月**；
- 邮件列表上的争论有时会变成"哲学之争"，例如近年关于 short closures、readonly、属性钩子语法的讨论都拉锯了很久；
- 对外部贡献者，**没有 5 票 RFC 通过权你几乎无法推动任何新功能**——这对快速演进是阻力。
### 5.4 Windows 是"二等公民"
Windows 支持一直是 php-src 的薄弱环节：
- 构建 Windows 二进制走独立的 `config.w32` 体系，很多 Linux 上的扩展在 Windows 上根本没编译产物；
- 路径分隔符、信号处理、fork 语义等差异让大量 PHP 代码在 Windows 上水土不服；
- 开发 php-src 本身，社区几乎默认你用 Linux / macOS。
### 5.5 生态"双头"问题：Zend 公司 vs PHP Foundation
虽然基金会化让项目更去中心化，但 **Zend（现为 Perforce 旗下）** 依然通过 Zend Engine、Zend Server、商业扩展等深度介入核心生态。这种商业与社区并存的结构在大多数时候是良性的，但**在关键 RFC 投票和 Roadmap 优先级上**，确实偶有利益博弈的痕迹。普通使用者不必担心，但深度贡献者需要了解这个背景。
### 5.6 JIT 的"高开低走"
JIT 在 PHP 8.0 发布时被宣传为革命性特性，但实际效果：
- **对典型 Web 业务（Laravel/WordPress）几乎无感**，因为瓶颈在数据库 IO 而非 CPU；
- **默认关闭**，要手动配置 `opcache.jit_buffer_size` 才生效；
- 8.4 引入了基于 IR Framework 的新 JIT 实现，但社区仍在观望收益。
---
## 六、行动建议：从"看过"到"用过"的三级跳
最后，给不同角色的读者一条可执行的路线：
### 🥉 初级（好奇 PHP 内部原理）
```bash
# 1. 装依赖，从源码编一份 debug 版 PHP
sudo apt install -y build-essential autoconf bison re2c libxml2-dev libsqlite3-dev
git clone https://github.com/php/php-src.git && cd php-src
./buildconf --force && ./configure --enable-debug && make -j$(nproc)
# 2. 跑你自己的第一个脚本
sapi/cli/php -r 'echo "Hello from my own PHP build!\n";'
```
### 🥈 中级（想让业务代码跑得更快）
在你生产服务器上验证三件事：
```ini
; php.ini
opcache.enable=1
opcache.jit_buffer_size=64M      ; 尝试开启 JIT
opcache.jit=tracing              ; tracing 模式对 Web 场景更友好
```
然后用 `ab` 或 `wrk` 做 A/B 压测，**用数据说话**，不要迷信"开了 JIT 就一定快"。
### 🥇 高级（想为 PHP 生态做贡献）
1. 挑一个 `GitHub` 上标着 `bug` 标签的小 issue；
2. 修完之后 commit message 写 `Fix GH-XXXXX: <一句话描述>`；
3. 提交 Pull Request 到 php-src；
4. 同时订阅 `internals@lists.php.net`，跟三个月讨论你就能摸清 RFC 节奏。
**一个小小的终极判断**：php-src 不是那种"让人惊艳的新星项目"，它是那种"你已经不知不觉依赖了二十年、却很少正眼看过一眼的基座工程"。下一次当你 `composer install` 或 `php-fpm reload` 的时候，不妨想一下：那份小小的 `php` 可执行文件背后，是 40k 星、8k fork、30 年迭代、10 位全职基金会开发者、以及无数 RFC 辩论，**在替你把一行行脚本变成 CPU 上的机器码**。
这种"沉默的伟大"，恰恰是开源世界最值得被认真评测和记录的部分。
