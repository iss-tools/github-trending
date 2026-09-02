# fmtlib/fmt

[GitHub URL](https://github.com/fmtlib/fmt)


## C++ 通用格式化库 fmt 深度评测

> C++ 生态中性能最强、最安全的现代格式化库， printf 与 iostream 的完美替代者。

- **Tags**: C++, 格式化, 开源, 性能优化, std::format
- **Category**: 开发工具, C++库, 系统编程

## Details

# 一句话总结
**fmt（{fmt}）是 C/C++ 生态中性能最强、API 最现代、类型安全且可移植的通用格式化库，已经成为 C++20 std::format 的实现参考；如果你还在用 printf/iostream 做“字符串拼接”，值得立刻迁移。**
---
## 背景与痛点
在 C++ 里，把数据“变成字符串/打印出来”的典型路子有两条，但各有硬伤：
- printf 家族（stdio）  
  - 长处在性能与简单，短处在类型不安全（格式串和参数类型错位就 UB）、无法格式化自定义类型、也不支持跨平台 Unicode 一致性。
- iostreams（std::cout / std::ostringstream 等）  
  - 类型安全、可扩展，但语法冗长、性能弱（尤其是浮点格式化）、编译慢、二进制膨胀明显。
fmt 的诞生就是要同时解决这些痛点：它借鉴 Python 的格式化字符串语法，在类型安全、可扩展、性能和编译速度之间做到“几乎都想要”的均衡，并提供对 C++20 std::format 与 C++23 std::print 的实现参考。官方指出其设计目标是“快速、安全的 C stdio 与 C++ iostream 替代品”。
---
## 核心亮点与功能剖析
### 1) 类 Python 的格式串语法 + 强类型安全
- 使用 `{}` 做占位，支持位置参数、对齐/宽度/精度等丰富格式规格。
- 格式串在编译期可做校验：类型与格式符不匹配会在编译时报错，显著降低运行时 UB 与安全漏洞。例如官方示例中 `fmt::format("{:d}", "I am not a number");` 会在 C++20 模式下编译报错。
### 2) 性能极快且二进制可控
- 官方基准显示 fmt::print 在其测试中比 libc 的 printf 约快 50%，且远快于 IOStreams 与 Boost.Format 等同类。
- 对 IEEE 754 浮点格式化采用 Dragonbox 等先进算法，保证正确舍入与往返可还原；在某些场景下比 iostreams / sprintf 快 20–30 倍。
- 通过类型擦除与控制模板实例化，将编译时间与代码膨胀压到接近 printf 的水平；官方“膨胀测试”显示：在模拟 100 个翻译单元、每处调用 5 次的项目中，fmt 的编译时间和可执行体积与 printf 处于同一量级，远好于 iostreams 与 Boost.Format。
### 3) 现代 C++/C 标准贴合与向前兼容
- 作为 C++20 std::format 与 C++23 std::print 的实现参考，为迁移提供平滑路径。
- 最新版 12.2.0 新增 C11 API（fmt-c），用 `_Generic` 做类型分发，为纯 C 代码提供类型安全的高性能格式化，兼容性好且胜过 printf/sprintf。
- 支持 C++20 模块（CMake target fmt::fmt-module）与持续增强的 constexpr 能力。
### 4) 容器、时间与跨平台 Unicode 一站式支持
- 支持“开箱即用”的容器格式化（如 `fmt::print("{}", std::vector{1,2,3});` 输出 `[1, 2, 3]`）。
- 日期/时间通过 `<fmt/chrono.h>` 与 `<chrono>` 联动，使用类似 Python 的占位规格（如 `{:%H:%M}`）。
- 提供可移植的 Unicode 支持（以 UTF-8 与 char 为基础），确保输出在 Linux/macOS/Windows 控制台一致；默认 locale 无关，可按需本地化。
### 5) 扩展性与集成友好
- 可为自定义类型实现 formatter，并把格式串校验也带到自定义类型。
- 提供多个扩展头：`fmt/ranges.h`、`fmt/std.h`（含 `std::optional` 等）、`fmt/color.h`（终端颜色）、`fmt/os.h`（高速文件写入）等，方便组合使用。
---
## 技术栈与架构解析（面向 GitHub 开源项目）
### 核心依赖与标准最低要求
- 核心仅需 C++11 的一个子集即可，最低支持 GCC 4.9、Clang 3.6、MSVC 2017（19.10）及以后；新编译器可用特性会被自动探测以启用更多能力。
- 无外部第三方依赖，非常适合嵌入式或受限环境。
### 模块/文件组织
- 最新版本将核心极简为三个文件：`base.h`、`format.h`、`format-inl.h`，配合少量 `.cc` 实现，既保持头文件即用的灵活性，又控制二进制体积。
- 通过 `FMT_HEADER_ONLY` 宏可一键切换到 header-only 模式；但在项目规模增大时，官方建议使用“编译版库”以加快编译。
### 编译与测试基础设施
- CMake 作为主构建系统，支持静态/共享/头-only 多种形态；可通过 `FMT_TEST` 等选项控制是否构建测试。
- 有独立的 benchmarks 仓库与持续集成流水线，并持续 fuzzing 提升可靠性。
---
## 上手门槛与部署体验
### 安装与集成
- CMake 项目最简单：`FetchContent` 一条指令就能自动拉取并链接 `fmt::fmt`（已适配 CMake 3.11+）。
- 也支持经典 `find_package(fmt)` 或把源码树 `add_subdirectory(fmt)` 嵌入项目。
- 常用系统包：
  - Debian/Ubuntu：`apt install libfmt-dev`。
  - macOS（Homebrew）：`brew install fmt`。
  - Conda：`conda install -c conda-forge fmt`。
  - vcpkg：`./vcpkg install fmt`。
  - Conan：`conan install -r conancenter --requires="fmt/[*]" --build=missing`。
### 文档与示例
- 官方站点提供多维度文档与 Cheat Sheets，且支持在 Compiler Explorer 上在线运行示例代码，快速尝鲜。
- README 中提供了常见用例代码片段，便于复制粘贴起步。
### 踩坑小提示（经验向）
- 版本升级时头文件结构略有调整（例如 12.x 版本中 `<fmt/core.h>` 默认等同于 `<fmt/base.h>`，不再自动拉入完整 `<fmt/format.h>`；可通过 `FMT_DEPRECATED_HEAVY_CORE` 兼容旧行为）。升级时注意迁移说明与编译错误提示。
- Header-only 模式在大量翻译单元中会显著拖慢编译，建议在达到一定规模后切到编译版库（CMake 目标 `fmt::fmt`）。
---
## Demo / 代码示例（核心用法速览）
### 最简“打印到 stdout”
```cpp
#include <fmt/base.h>
int main() {
  fmt::print("Hello, world!\n");
}
```
这行与 `puts("Hello, world!");` 效果相当，但后续可无缝扩展到复杂格式化。
### 格式化字符串
```cpp
std::string s = fmt::format("The answer is {}.", 42);
// s == "The answer is 42."
```
### 位置参数（适合本地化/翻译）
```cpp
std::string s = fmt::format("I'd rather be {1} than {0}.", "right", "happy");
// s == "I'd rather be happy than right."
```
### 容器格式化
```cpp
#include <vector>
#include <fmt/ranges.h>
int main() {
  std::vector<int> v = {1, 2, 3};
  fmt::print("{}\n", v);  // 输出: [1, 2, 3]
}
```
### 日期/时间
```cpp
#include <fmt/chrono.h>
int main() {
  auto now = std::chrono::system_clock::now();
  fmt::print("Date and time: {}\n", now);
  fmt::print("Time: {:%H:%M}\n", now);
}
```
输出示例：
```
Date and time: 2023-12-26 19:10:31.557195597
Time: 19:10
```
### 终端颜色
```cpp
#include <fmt/color.h>
int main() {
  fmt::print(fg(fmt::color::crimson) | fmt::emphasis::bold,
             "Hello, {}!\n", "world");
}
```
---
## 目标人群与收益
- C++ 服务端/基础设施开发者：  
  - 在日志、监控、协议序列化等高频路径获得更高的吞吐与更低的延迟，同时代码更清晰安全。
- 嵌入式/系统级开发者：  
  - 在资源受限场景下，依然能享受可编译期检查的格式化与较小二进制体积；可按需禁用浮点组件进一步瘦身。
- 跨平台工具/CLI 开发者：  
  - 需要统一输出风格、支持 Unicode 和终端颜色的场景，fmt 能显著减少样板代码。
- C 开发者（新特性）：  
  - fmt-c 提供类型安全的 C API，尤其适合既想保持 C 代码库、又想要格式化安全性的团队。
---
## 竞品/同类对比
| 维度               | fmt ({fmt})                          | std::format/std::print（C++20/23） | iostreams             | printf/stdio        | Boost.Format     | Folly Format     |
|--------------------|--------------------------------------|------------------------------------|-----------------------|---------------------|------------------|------------------|
| 性能               | 最快/接近 printf                     | 依赖实现，常参考 fmt               | 较慢                 | 快，但风险高        | 慢               | 中等             |
| 类型安全           | 是（编译期校验）                     | 是                                 | 是                   | 否（易 UB）          | 是               | 是               |
| 语法               | 类 Python                            | 类 Python（与 fmt 高度相似）        | 操作符重载（冗长）    | C 格式串             | 类 Python 但较重 | 类 Python        |
| 编译速度           | 优于 iostreams/Boost；接近 printf    | 依赖于实现                         | 慢                   | 最快                 | 慢               | 中等             |
| 二进制膨胀         | 控制良好                             | 依赖于实现                         | 明显                 | 最低                 | 明显             | 中等             |
| 可扩展（自定义类型）| 完善                                 | 规范上支持，实取决于实现           | 是                   | 需自行包装           | 是               | 是               |
| 跨平台 Unicode     | 良好（UTF-8 一致）                   | 规范支持但实现差异                 | 平台依赖             | 平台依赖             | 平台依赖         | 平台依赖         |
| 生态与成熟度       | 顶级，被大量知名项目采用             | 标准但各厂商实现尚在推进中         | 标准备用             | 标准                 | 老牌但笨重       | Facebook 内部   |
总体来看，fmt 在性能、安全性和可用性三者上做到了当前最优的权衡，也是标准库实现的“事实样板”。
---
## 局限与不足
- 模板较重的库仍存在一定的编译时开销：尽管已通过类型擦除与精简核心头大幅优化，但在极极端编译时敏感场景下，依然不如直接用 stdio 快。
- 生态暂未完全统一到 C++ 标准：随着编译器厂商逐步实现 std::format/std::print，是否要长期维护两套 API（fmt vs std）会成为项目的决策点；不过官方提供兼容路径与迁移工具（如 clang-tidy 的 `modernize-use-std-print` 可将 printf/fprintf 转到 fmt::print）。
- 一些前沿/边缘类型仍在持续适配（例如与 `<stdfloat>` 的交互等）， Issue 中存在对新型别支持的讨论。
- 对“解析”（scanf 风格）并非主攻方向，社区讨论中尚缺统一且高性能的解析 API；有 Issue 提出 `fmt::scan` 的需求，但未落地。
---
## 社区活跃度与生命力
- Stars 数约 23.7k、Fork 数约 2.9k，处于顶级 C++ 开源项目的流行区间； Issues 开放数仅 10，Pull Requests 6，可见维护与响应状态良好。
- Release 版本迭代频繁且质量稳定：最新 12.2.0（2026-06-16）在性能与功能上继续增强（如默认启用完整的 Dragonbox 查找缓存以提升浮点格式化 ~10–25%；增强 C11 API、C++20 模块、`std::unexpected` 支持等）。
- 被大量知名项目依赖，包括 PyTorch、MongoDB、Apple 的 FoundationDB、Windows Terminal、Envoy、ClickHouse、MariaDB、ccache 等，说明其在生产环境中的可靠性与稳定性。
---
## 结语与行动建议
终极评判：  
如果你在今天要启动一个新的 C++ 项目，或者对现有 C++ 代码中的“输出/格式化”做一轮提质增效，fmt 基本是“首选、也是安全”的选择。它在性能、安全性与可用性上的综合表现，以及成为标准库实现的参考地位，使其足以长期陪伴你的项目演进。
行动建议：
- 新项目：直接引入 fmt（建议通过 CMake 的 FetchContent 或系统包/包管理器安装），统一使用其 API 替代 iostream/printf，快速获得安全性与性能双提升。
- 既有项目（优先级从高到低）：
  1) 把高频日志/监控路径中的格式化调用逐步迁移到 fmt（通常改动点不大，收益明显）。
  2) 集中式迁移 `printf`/`fprintf`，可借助 clang-tidy 的 `modernize-use-std-print` 并配置为转向 `fmt::print`。
  3) 视团队编译时压力，在项目达到一定规模时将 header-only 模式切换为编译版库（CMake 链接 `fmt::fmt`）。
- 长期视角：保持对标准库实现进度的关注；在目标平台提供稳定且完备的 `std::format/std::print` 后，可考虑逐步迁移到标准 API，而 fmt 将是你的“试金石与过渡桥梁”。
