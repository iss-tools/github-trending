# ggml-org/ggml

[GitHub URL](https://github.com/ggml-org/ggml)


## ggml：让大模型跑在笔记本上的零依赖推理引擎

> 纯 C/C++ 编写、零依赖的张量计算库，是 llama.cpp、Ollama、LM Studio 等本地大模型项目背后的共同引擎

- **Tags**: ggml, 本地大模型, llama.cpp, 量化, C/C++
- **Category**: 开发工具, AI 推理引擎, 开源库

## Details

工具调用已达上限，已收集到足够信息，现在为你输出深度评测文章。
---
# ggml：把大模型塞进掌心的幕后功臣
> **一句话总结**：ggml 是一个用纯 C/C++ 写成、零依赖、跨硬件的张量计算库——它是 llama.cpp、whisper.cpp、Ollama、LM Studio 这些"本地跑大模型"现象级项目的共同引擎，**让一个 7B 大模型能在没有 N 卡的笔记本上以 Q4 量化跑出每秒十几 token 的速度**，堪称"端侧 AI 时代的 C 标准库"。
如果你只关心"为什么我这台 MacBook 能本地跑 70B 模型"或者"为什么 Ollama 这么轻量"，那么答案的底层一定指向 ggml。这篇文章就带你把这台"神秘引擎"拆开看个清楚。
---
## 一、背景与痛点：它解决了一个根本没人解决的"非对称问题"
在大模型爆发的早期（2022–2023），整个生态都把宝押在 GPU 上：PyTorch 假设你有 CUDA，Hugging Face Transformers 假设你有至少 16G 显存，TensorFlow Lite 又过于偏手机端、跑不动 LLM。这中间存在一个尴尬的空白带——
- **CPU-only 用户**：没有 NVIDIA 显卡的人（比如 M 系列 Mac、老笔记本、企业内网服务器）几乎无解；
- **边缘设备**：树莓派、手机、车载芯片，内存动辄只有几 G；
- **隐私敏感场景**：医院、律所、政府，模型必须离线，不允许把数据丢到云端。
ggml 的作者 **Georgi Gerganov** 是一位保加利亚的物理学家出身的工程师，他敏锐地看到了这个"非对称空白"，并在 2022 年写下了一个反潮流的项目：**不依赖任何框架、单文件打包、CPU 优先**。后来他成立 ggml.ai 公司（获得 Nat Friedman 与 Daniel Gross 的种子投资），公司已于 2026 年被 Hugging Face 收购，但 ggml 本身仍以 MIT 协议在 ggml-org 下活跃开发。
它真正被"引爆"是因为 llama.cpp 项目——Georgi 用 ggml 实现了 LLaMA 推理，在 MacBook M1 上跑出了令人瞠目结舌的速度，一夜之间点燃了整个本地 LLM 生态。
**用一句话概括它解决的痛点**：让大模型推理像"加载一张 JPG"一样简单、像"打开一个 PDF"一样轻量，且不依赖任何昂贵的硬件。
---
## 二、核心亮点与架构剖析：为什么它是"端侧推理之王"
ggml 的设计哲学可以用三个字概括：**省、稳、稳**。具体拆解为以下几个层面的工程智慧。
### 1. 静态计算图 —— 一次定义，千次执行
如果 PyTorch 的动态图是"每次跑代码都重新搭一遍积木"，那 ggml 就是"先画好图纸，然后流水线生产"。所有算子在编译期就确定了执行顺序与内存布局，运行期**零动态分配**（Zero memory allocations during runtime），不存在内存碎片，这对嵌入式设备至关重要。
代价也很明显：你**无法在图里写 `for` 循环**，所有循环（比如逐 token 生成）必须在图外用 C 代码控制。这是一个典型的"用表达能力换性能"的取舍。
### 2. 块级量化 —— GGUF 格式的灵魂
ggml 最有魔力的部分是它的**块级量化**方案。它不把每个权重单独压成 4 bit，而是把 32 个或 256 个权重打包成一个"块"，每块存一个 fp16 的缩放因子——相当于"压缩饼干"外面再裹一层调料包，让精度损失远小于朴素的整数截断。
下面这张速查表帮你瞬间理清那堆看得眼花缭乱的命名：
| 类型 | 每 weight 位宽 | 是否需要 imatrix | 适用场景 |
|---|---|---|---|
| F16 / BF16 | 16.0 | 否 | 基线精度，显存富裕时用 |
| Q8_0 | 8.5 | 否 | 接近无损，调试用 |
| **Q4_K_M** | ~4.85 | 否 | **绝大多数笔记本的首选甜点位** |
| Q5_K_M | ~5.7 | 否 | 显存够但想更准 |
| Q2_K / IQ2_XXS | 2.6 / 2.06 | 是/否 | 极限压缩，质量下降明显 |
| MXFP4 / NVFP4 | 4.0 | 否 | 新的微缩放格式，硬件友好 |
> 💡 **口诀**：Q 后面的数字≈位宽，`_K` 表示用了分层缩放，`_M` 是该档位的"中庸甜点"，`_S/_L` 是小/大变体，`IQ` 系列是基于码本的 i-quant，压缩率更高但对温度参数更敏感。
### 3. 多后端架构 —— 一份代码跑遍所有硬件
ggml 把"算子实现"与"调度"完全解耦，理论上你只要写一份计算图，它就能自动选择最快的后端执行：
- **CPU**（x86 / ARM / RISC-V / LoongArch / PowerPC / s390x / WebAssembly），自带 SIMD 内核
- **Metal**（Apple Silicon 一等公民）
- **CUDA**（NVIDIA）
- **Vulkan / SYCL**（跨厂商 GPU）
- **WebGPU**（浏览器内跑）
- **NPU / CANN** 等异构加速器
其中 `ggml_backend_sched` 这个调度器可以在 **CPU 与 GPU 之间自动切分计算图**——显存不够的部分自动跑在 CPU 上，这就是为什么你在 8G 显存的老 1060 上也能"凑合"跑 13B 模型的原因。
### 4. 极简主义 —— 一个 C 文件夹就是全部依赖
整个库**没有任何第三方依赖**，纯 C/C++ 编写，MIT 协议。这意味着你可以：
- 直接把 `ggml` 源码目录扔进你的工程 `add_subdirectory`，编译出静态库
- 拷到树莓派、路由器、工控机上跑，不需要装任何环境
- 嵌入到任何语言（Rust、Go、Swift、Java）里做 FFI
---
## 三、Demo / 代码示例：30 行 C 代码完成矩阵乘
理解 ggml 最快的方式，是看官方 `examples/simple/simple-backend.cpp` 这个 153 行的最小示例。下面为你精简出核心流程，**一眼看懂它的"三板斧"**：
```cpp
#include "ggml.h"
#include "ggml-backend.h"
// ① 初始化后端：自动选最优（Metal / CUDA / CPU）
ggml_backend_load_all();
ggml_backend_t backend = ggml_backend_init_best();
// ② 构建计算图：声明 A × Bᵀ
struct ggml_init_params params0 = {
    /*.mem_size    =*/ buf_size,
    /*.mem_buffer  =*/ buf.data(),
    /*.no_alloc    =*/ true,   // 稍后再分配数据
};
struct ggml_context * ctx = ggml_init(params0);
struct ggml_cgraph * gf = ggml_new_graph(ctx);
struct ggml_tensor * a = ggml_new_tensor_2d(ctx, GGML_TYPE_F32, 2, 4);
struct ggml_tensor * b = ggml_new_tensor_2d(ctx, GGML_TYPE_F32, 2, 3);
struct ggml_tensor * result = ggml_mul_mat(ctx, a, b);
ggml_build_forward_expand(gf, result);
// ③ 把数据搬进后端、执行、取出结果
ggml_backend_tensor_set(a, matrix_A, 0, ggml_nbytes(a));
ggml_backend_tensor_set(b, matrix_B, 0, ggml_nbytes(b));
ggml_backend_sched_graph_compute(sched, gf);
ggml_backend_tensor_get(result, out_data, 0, ggml_nbytes(result));
```
完整示例来自官方仓库 `examples/simple/simple-backend.cpp`，社区还有 [likejazz/ggml-simple](https://github.com/likejazz/ggml-simple) 一键在 CPU / CUDA / Metal 之间切换跑同一个矩阵乘，方便你直观对比不同后端的性能。
**上手门槛实操路径**：
```bash
git clone https://github.com/ggml-org/ggml
cd ggml && mkdir build && cd build
cmake ..
cmake --build . --config Release -j 8
# 想跑 GPU？加上 -DGGML_CUDA=on 或 -DGGML_VULKAN=on
```
整个过程**没有任何 pip、没有任何 conda、没有任何环境变量**，CMake 一条命令跑通，开箱即用。
---
## 四、社区活跃度与生态生命力
| 维度 | 数据（截至 2026 年） | 评价 |
|---|---|---|
| Stars | **15.5k** | 远超大多数"小众库"，对纯 C 张量库而言已是现象级 |
| Forks | 1.9k | 高度活跃 |
| Commits | **4,866 次** | 平均每天 3–5 次，长期高频 |
| Open Issues | 314 | 维护者响应及时，但部分长尾 issue 积压 |
| Open PRs | 54 | PR 主要被引流到 llama.cpp 处理 |
| 协议 | MIT | **完全商用友好，零负担** |
需要特别指出的一个**独特现象**：ggml 与 llama.cpp 的关系并非"父项目 vs 子项目"，而是**"主战场 vs 镜像"**——核心 ggml 库的日常开发实际上发生在 `llama.cpp/ggml` 子目录里，再定期手动同步到独立的 `ggml-org/ggml` 仓库。这是个"双刃剑"：好处是开发节奏紧跟真实需求，坏处是如果你直接给 ggml 仓库提 PR，很可能被引导去 llama.cpp 那边重提。
**基于 ggml 构建的"神仙项目群"**（这是它生态影响力的真实体现）：
- **llama.cpp** —— LLM 推理的事实标准，Ollama / LM Studio / GPT4All / Jan 的共同引擎
- **whisper.cpp** —— OpenAI Whisper 的 CPU 友好版本，本地语音转文字首选
- **stable-diffusion.cpp** —— 在 CPU 上跑 Stable Diffusion 出图
- **piper** —— 超轻量级 TTS，树莓派上都能实时合成人声
- **moondream.cpp** —— 端侧多模态小模型
- 各种 fine-tuned whisper、VALL-E、Bark 衍生项目……
可以说，**今天的"本地 AI"这条赛道，几乎全部都跑在 ggml 的引擎上**。
---
## 五、目标人群与收益：谁该来"啃"这个库？
| 你的身份 | 用 ggml 的姿势 | 直接收益 |
|---|---|---|
| **应用层开发者**（做桌面 App、IDEA 插件） | 只用 Ollama / LM Studio，不必直接碰 ggml | 5 分钟让产品拥有"离线 LLM"能力 |
| **端侧/嵌入式工程师** | 直接用 ggml C API 部署小型模型 | 一个静态库跑遍 ARM/x86/RISC-V，没有 Python 运行时 |
| **算法研究者 / 模型压缩爱好者** | 用它的量化 API 做实验 | 理解 Q4_K_M / IQ 系列背后的工程取舍，对做 INT8/INT4 部署极有启发 |
| **推理性能优化工程师** | 把 ggml 当作优化"教科书" | 它的 SIMD 内核、内存对齐、CPU-GPU 混合调度是工业级最佳实践 |
| ** curious 的小白** | 直接看 README + examples/simple | 30 分钟内能跑起人生第一个矩阵乘，对"模型是怎么算的"祛魅 |
**它为你省下的真实成本**：一个 7B LLM 用 FP16 部署需要 ~14GB 显存，而 Q4_K_M 量化后只需 ~4GB，可以直接塞进一台普通商务笔记本——这就是 ggml 量化技术带来的**数倍硬件成本节约**。
---
## 六、竞品/同类对比：ggml 在推理库版图中的位置
直接横向对比一下主流推理方案，帮你定位：
| 维度 | **ggml** | PyTorch Mobile | ONNX Runtime | TensorRT | OpenVINO | MNN |
|---|---|---|---|---|---|---|
| 语言 | C/C++ | C++/Python | C++/多语言 | C++ | C++/Python | C++ |
| **依赖数** | **0** | 极多 | 中等 | 极多 | 较多 | 中等 |
| 二进制体积 | KB 级 | 数十 MB | 几 MB | GB 级 | 几十 MB | 几 MB |
| LLM 支持 | ⭐⭐⭐⭐⭐ | 一般 | 一般 | 好 | 好 | 一般 |
| **量化体系** | **独一档（K/i/MXFP4）** | 标准 | 标准 | 强 | 标准 | 标准 |
| 自定义算子 | 有限 | 容易 | 容易 | 容易 | 中等 | 容易 |
| 部署工具链 | 几乎没有 | 完善 | 完善 | 完善 | 完善 | 一般 |
| 训练支持 | 仅前向+简单反向 | ✅ 完整 | ✅ 部分 | ❌ 推理专用 | ❌ 推理专用 | ✅ 部分 |
| 推理加速 | 优 | 良 | 良 | 优 | 优 | 良 |
**几个关键差异点**：
1. **ONNX 是"格式"和"中转语言"，ggml 是"运行时引擎"**——ONNX 解决"模型在 A 框架训练、到 B 框架推理"的互操作问题，ggml 解决"在有限硬件上跑得动"的问题，二者其实并不完全竞争。
2. **PyTorch 训练+推理通吃，ggml 几乎只做推理**——把训练从 ggml 剥离是有意为之的设计选择，这让它的库体积和心智负担都降到了最低。
3. **TensorRT / OpenVINO 强在"绑定特定硬件后的极致优化"**——但你需要锁定 NVIDIA / Intel，迁移性差；ggml 的优势是"一套代码跑所有硬件"。
4. **生态独特性**：ggml 的 K-quant / i-quant 量化体系在所有竞品中**独一份**，这也是为什么 GGUF 能成为 HF Hub 上事实标准之一的原因。
> 💡 现在连 Hugging Face Transformers 都原生支持加载 GGUF 模型了，这一信号足以说明 ggml 生态在工业界的地位。
---
## 七、局限与不足：客观说说它的"丑"
一份合格的评测，必须把短板也摆到台面上。
**1. 文档极其稀薄，社区学习曲线陡峭**
官方 README 简短到只有一页，全靠"读源码 + 看 examples + 翻 issue"自学。对 C++ 不熟悉的人，光是理解 `ggml_context`、`ggml_backend_buffer`、`ggml_backend_sched` 这三层抽象就要掉一层皮。社区博客（如 ddh0 的 "A Brief Guide to GGML"）反而是更系统的入门材料。
**2. 写算子、扩展新模型的工作量大**
如果想把一个全新的 Transformer 架构接到 ggml 上，你需要用 C 手写 forward graph，每个算子还要为 CPU/CUDA/Metal/Vulkan 多个后端分别实现 kernel。对比 PyTorch 写个 Python 类就完事，工作量是数倍到数十倍。
**3. 不适合做训练**
虽然有 ADAM / L-BFGS 优化器，但 ggml 的核心场景就是推理。它的 autograd 是"静态图反向"，远不如 PyTorch 灵活，跑复杂训练几乎不可行。
**4. 主仓库的"漂移"问题**
真正的前沿开发在 `llama.cpp/ggml` 子目录里独立 repo 只是被定期同步。这意味着：
- 直接给 `ggml-org/ggml` 提 PR 会被礼貌地"打回"到 llama.cpp
- 这个独立仓库的 release 滞后于真实开发
- fork 出来二次开发时要小心选基线
**5. GGML（旧格式）已被 GGUF 取代**
如果你在网上看到旧的 `.ggml` 文件和旧的 `ggml` 格式文档，**那是另一个东西**（早期的模型序列化格式），已被更灵活的 **GGUF** 完全取代。这是搜索资料时最容易混淆的地方，务必注意"ggml（库）≠ ggml（旧格式）"。
**6. 多模态与动态形状支持有限**
静态计算图的代价就是处理变长序列、动态控制流会比较麻烦，llama.cpp 为此做了大量外层的补丁工作。如果你的模型有非常复杂的动态结构，ggml 会让你痛苦。
---
## 八、结语与行动建议：一个"重新定义端侧 AI"的种子项目
> **一句话总结定位**：ggml 之于本地大模型，相当于 SQLite 之于嵌入式数据库——它不是功能最强的，但它是**最便携、最轻量、最不容易让你出岔子**的那一个。
**如果你的目标是**：
- ✅ **跑本地 LLM**：直接用 Ollama / LM Studio（基于 ggml），不用直接碰这个库
- ✅ **做一个端侧 AI App**：用 whisper.cpp 或 llama.cpp 的 C API 嵌入你的产品
- ✅ **学习推理引擎底层**：ggml 是**最干净的入门教材**，比 TensorFlow / PyTorch 源码可读性高得多
- ✅ **部署到非 NVIDIA 硬件**：ggml 几乎是唯一务实的选择
- ❌ **做模型训练**：换 PyTorch，别为难自己
- ❌ **快速搭建研究 pipeline**：用 Transformers，ggml 不是干这事的
**给不同读者的下一步建议**：
1. **小白路径**：先装 Ollama 跑个 Qwen 模型感受"轻"，再回头看 ggml README 建立心理模型
2. **进阶路径**： clone `examples/simple` 编译跑通 → 读 `ddh0 的 A Brief Guide to GGML` → 自己写一个两层的 MLP forward
3. **硬核路径**：选一个感兴趣的后端，跟着 `ggml-cuda.cu` 或 `ggml-metal.m` 看一个算子（比如 `ggml_mul_mat`）的 kernel 实现——这会彻底改变你对"矩阵乘"的认知
最后用一句对极客们最贴切的话作为收尾：**ggml 不是最大的引擎，但它是把"大模型"从云端拽回你笔记本的那只手**。这只手值得每一位对本地 AI 有兴趣的开发者认真读一遍它的源码。
