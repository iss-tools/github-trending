# tile-ai/tilelang

[GitHub URL](https://github.com/tile-ai/tilelang)


## TileLang 深度评测：用 80 行 Python 写出匹敌 CUTLASS 的 GPU 高性能算子

> TileLang 是北大与微软联合开源的 GPU Kernel 编程语言，用 Python 语法写出接近 CUTLASS 手写性能的算子。

- **Tags**: GPU, Kernel 编程, TVM, 高性能计算, 编译器
- **Category**: 开发工具, AI 编程, 开源项目

## Details

# TileLang 深度评测：让 GPU Kernel 开发从"炼丹术"回归"工程学"
> **一句话总结**：TileLang 是一个由北大与微软研究院联合打造、基于 TVM 的高性能 Kernel 编程语言，它用 80 行 Python 写出了足以匹敌 CUTLASS 模板巨作的 FlashMLA，在 H100 上对 Triton 实现最高 **10 倍以上加速**——这是 Triton 与 CUDA C++ 之间，直到 2025 年才真正补齐的"中间甜蜜区"。
---
## 一、背景与痛点：Triton 的天花板，CUDA C++ 的地狱
在 TileLang 出现之前，写一个"快得能进生产"的 AI Kernel，开发者面前只有两条路：
**路线 A：OpenAI Triton**。你写 block 级伪 Python，编译器负责线程映射、shared memory 分配、Tensor Core 选择。极其好用，但代价是**抽象泄露的痛苦**：共享内存布局、bank conflict、warp 划分、WGMMA/TMA 这些关键优化全部被编译器"黑盒化"。当你的算子长成 DeepSeek MLA 这种"Q/K head_dim = 576、V head_dim = 512"的怪物时，Triton 生成的代码会因为寄存器溢出而性能崩塌——你想手动干预，却没有抓手。
**路线 B：NVIDIA CUTLASS / CuTe C++ 模板**。控制力拉满，但你要写的是叠加了几层模板元编程的 C++，动辄几百到上千行，调试报错像在解读天书。
而手写 CUDA C++ 更是双重地狱：既要懂 Hopper/Blackwell 的指令集细节（WGMMA 至少要 64×N、需要 128 线程一个 warpgroup；TMA 的 boxDim 不能超过 256），又要自己同步 mbarrier、自己算 swizzle、自己决定 warp specialization。
TileLang 的解法很直白：**保留 Triton 的 Pythonic 简洁，但把 Triton 藏起来的那一层控制权还给你**。它的论文名字就叫《Bridge Programmability and Performance in Modern Neural Network Operators》——直接对标这一痛点。
---
## 二、核心设计哲学：Tile 是一等公民，控制权是"可选注解"
TileLang 的心智模型可以用三句话概括，这三句话同时定义了它与 Triton 的本质区别：
1. **Tile 是一等公民**。一块形如 `block_M × block_K` 的数据由一个 thread block、一个 warp 或一个 thread 拥有。你不再是 Triton 那种"一个 program 处理一个 block"的单一视角，也不再是 CUDA 那种"亲手管每个线程"的颗粒度。
2. **数据住在哪一内存层级，由你亲口宣布**。`T.alloc_shared`（共享内存）、`T.alloc_fragment`（寄存器）、`T.alloc_local`，全靠显式声明——这是与 Triton 最大的分水岭。
3. **线程映射交给 Layout Inference 推导**。一旦你声明了"什么操作跑在哪个 tile 上"，编译器会自动推算出寄存器布局、共享内存布局和线程并行方式；需要极优化时再通过 `T.annotate_layout` 覆盖。
打个比方：Triton 像一台自动驾驶汽车，方向不可手动接管；CUDA 像手动挡 F1 赛车，全程肌肉记忆；TileLang 则像一台**带手动模式的高性能跑车**——默认自动挡开 90% 的路，弯道进赛道时你随时能切手动。
---
## 三、技术栈与架构解析
### 3.1 编译栈：站在 TVM 的肩膀上
```
Pythonic DSL (@T.prim_func)
        ↓ 降级
TVM TIR / TIRX 中间表示
        ↓ Layout Inference / Pipelining / Warp Specialization
        ↓ Z3 SMT 求解器参与的符号分析
Backend Registry（可插拔）
        ↓
CUDA / HIP / Metal / LLVM CPU / WebGPU / CuTe DSL ...
```
TileLang 没有重新发明编译器，而是把 TVM 成熟的 TIR 基础设施作为地基，再往上叠了一层"tile-level 编程模型"。2025 年起它进一步演进为多后端架构 **TileLang-X**，把静态 CUDA、ROCm、Metal 语义拆成独立 dialect，每个后端只暴露自己理解的 `T.Kernel` 关键字参数。
### 3.2 后端支持矩阵（截至 v0.1.13）
| 后端 | 支持等级 | 覆盖硬件 |
|---|---|---|
| NVIDIA CUDA | Primary | SM70 ~ SM120（Volta → Blackwell），含 TMA、WGMMA、TMEM |
| AMD ROCm/HIP | Supported | CDNA（MI300X）、RDNA（RDNA3/4） |
| Apple Metal | Supported | Apple Silicon，M5 已支持 Metal 4 cooperative tensor |
| LLVM CPU | Experimental | 主机 CPU，需 LLVM 15+ |
| NVIDIA CuTe DSL | Experimental | 通过 CUTLASS CuTe DSL 路径 |
| WebGPU | Experimental | 浏览器端代码生成 |
| 华为昇腾 / 摩尔线程 / 海光 / MetaX 等 | Ecosystem | 独立仓库维护 |
对国产算力生态的覆盖（昇腾、摩尔线程、海光、MetaX）是 TileLang 在国内 GPU 圈迅速走红的关键原因——这些平台通常没有官方 Triton 后端，而 TileLang 提供了一条相对统一的 DSL 通路。
### 3.3 Layout Inference：那个"扛大梁"的 Pass
这是 TileLang 最值得吹的技术亮点。以 DeepSeek MLA 为例：Hopper 上 WGMMA 最小 M=64，意味着一个 warpgroup 至少要持有 `64×512` 的 accumulator——必然寄存器溢出。唯一解法是把 `acc_o` 沿 dim 维切成两半给两个 warpgroup，但这又要求两个 warpgroup 都能拿到完整的 `acc_s`（需要在 shared memory 里做一次交换）。
在 CuTe 里，这一整套手工布局、swizzle、producer/consumer 同步要写数百行 C++。在 TileLang 里，你**只在 `T.gemm` 调用上加一个 `policy=T.GemmWarpPolicy.FullCol`**，编译器就会反向推导出：
- `acc_s` 每个 warpgroup 占 `[block_M, block_N/2]`
- 而 `P@V` 又需要完整 `acc_s` → 共享内存交换 buffer `S_shared` 必须是 `[block_M, block_N]`
- producer/consumer warp specialization、mbarrier 同步、bank conflict 消除的 swizzle layout——全部自动生成
这就是论文消融实验里 "+Partition 在 H100 上额外贡献 4.34×、+Alloc 在 MI300X 上贡献 6.56×" 的底层机制。
---
## 四、上手体验：80 行 FlashMLA 的震撼
### 4.1 安装：pip 一键起飞
```bash
conda create -n tilelang python=3.10 -y
conda activate tilelang
pip install tilelang              # Linux x86-64/AArch64、Windows、macOS arm64 均有预编译 wheel
```
AMD GPU 用户的 ROCm 版 PyTorch 装好后再 `pip install tilelang`，同一份 wheel 直接兼容。Nightly 版本通过 `--find-links https://tile-ai.github.io/whl/nightly` 获取。**唯一的坑**：从源码构建需要本地 LLVM + CUDA 工具链，且依赖 `pip install -r requirements-dev.txt` + `--no-build-isolation`，新手直接走预编译 wheel 即可。
### 4.2 第一个 GEMM + ReLU 融合 Kernel
这是最经典的一段代码，也是最能直观感受 TileLang"是什么"的样例：
```python
import torch, tilelang
import tilelang.language as T
@tilelang.jit
def matmul_relu(A, B, block_M=128, block_N=128, block_K=32):
    M, N, K = T.const("M, N, K")
    A: T.Tensor((M, K), T.float16)
    B: T.Tensor((K, N), T.float16)
    C = T.empty((M, N), T.float16)
    with T.Kernel(T.ceildiv(N, block_N), T.ceildiv(M, block_M), threads=128) as (bx, by):
        # 三层内存，显式声明 —— Triton 做不到的事
        A_shared = T.alloc_shared((block_M, block_K), T.float16)
        B_shared = T.alloc_shared((block_K, block_N), T.float16)
        C_local  = T.alloc_fragment((block_M, block_N), T.float32)
        T.clear(C_local)
        # 三级软件流水线，一行搞定 global→shared 异步拷贝
        for k in T.Pipelined(T.ceildiv(K, block_K), num_stages=3):
            T.copy(A[by*block_M, k*block_K], A_shared)
            T.copy(B[k*block_K, bx*block_N], B_shared)
            T.gemm(A_shared, B_shared, C_local)      # 自动分发到 Tensor Core
        for i, j in T.Parallel(block_M, block_N):
            C_local[i, j] = T.max(C_local[i, j], 0)  # 融合 ReLU
        T.copy(C_local, C[by*block_M, bx*block_N])
    return C
a = torch.randn(1024, 1024, device="cuda", dtype=torch.float16)
b = torch.randn(1024, 1024, device="cuda", dtype=torch.float16)
c = matmul_relu(a, b)
torch.testing.assert_close(c, torch.relu(a @ b), rtol=1e-2, atol=1e-2)
```
短小、可读、每一行都能映射到一条明确的硬件行为。这就是 TileLang 试图把"数据流"和"调度"分离的具象化表达。
### 4.3 性能到底有多强：硬核数字
综合官方 benchmark、ICLR 2026 论文与第三方复现：
| 算子 | 对手 | TileLang 收益 | 代码量对比 |
|---|---|---|---|
| FlashMLA (H100) | Triton | **4.06 ~ 10.59×** | 仅为 CUTLASS 版 FlashMLA 的 1/7 |
| FlashMLA (H100) | PyTorch | 841×（FlashMLA 手写版为 1040×） | — |
| FlashMLA (MI300X) | Triton | 最高 6× | — |
| GEMM FP16 | Triton | 1.08 ~ 1.43× | 比 ThunderKittens 少 77% 代码 |
| WINT4AFP16 反量化 GEMM | Marlin | 最高 1.55×，代码更简洁 | — |
| GEMM vs cuBLAS | — | RTX 4090 +11%，A100 -3%，H100 ≈持平，MI300X +4% | — |
| Chunk Gated Delta Net | Triton | 15.88 ~ 70.35× | 少 39% 代码 |
| Vertical Slash Sparse Attn | Triton | 108.55 ~ 280.41×（单一融合 kernel） | 一半代码 |
其中 MLA 这个案例最具说服力——**80 行 Python 拿到 FlashMLA（CUTLASS 手写版）同等的 H100 性能**，而 Triton 和 FlashInfer 的官方实现都被显著甩开。
### 4.4 自动调优：把网格搜索也写成装饰器
```python
@tilelang.autotune(configs=matmul_configs(M, N, K), warmup=3, rep=20)
@tilelang.jit
def matmul(A, B, block_M=128, block_N=128, block_K=64, num_stages=3, threads=128):
    ...
```
`@tilelang.autotune` 会并行编译所有候选配置、自动验证正确性、跑分并缓存最优结果。官方文档还提供 `AutoTuner.from_kernel(...)` 的命令式 API，适合复杂搜索空间。
### 4.5 开发者体验（DX）：2026 年的几项关键补强
- **TileLang LSP 已开源**（2026-08-04）：buffer 形状、dtype、scope、推断出的 layout 全部以 inlay hint 形式浮在代码上，hover 可见，还能精确诊断错误。
- **IR Lower Trace / Pass Diff / Pass Visualizer**：可以逐 pass 打印 IR 变化，定位编译优化哪一步"把你的 kernel 改坏了"。
- **`kernel.get_kernel_source()`** 一行打印生成的 CUDA/HIP 源码，配合 `T.print(buf)` 打印某个 tile 的实际内容，调试体感远好于 Triton 的"黑盒报错"。
- **TileLang Puzzles**：10 道递进式练习题，对新手极友好。
---
## 五、目标人群与收益
| 你是谁 | 用 TileLang 能得到什么 |
|---|---|
| **大模型推理框架开发者**（vLLM/SGLang/TensorRT-LLM 贡献者） | 用几十行代码补齐官方库没覆盖到的算子（如 DeepSeek V3.2 的 sparse MLA backward 已被 TileLang 实现并集成进 SGLang） |
| **AI 框架算子组** | 替代手写 CUDA + CUTLASS 的 monotonous 工作，交付速度提升一个量级 |
| **量化 / 反量化 Kernel 研究者** | W4A16、FP8、MXFP4、MXFP8 block-scaled GEMM 均有现成范例，比 Triton 写 inline asm 舒服得多 |
| **国产算力 / 非 NVIDIA 平台开发者** | 一套 DSL 同时出 CUDA/HIP/Metal/Ascend 代码，不用为每个平台维护一套手写 kernel |
| **HPC / 体系结构研究者** | Layout Inference 是一个值得深挖的研究方向，Z3 集成的符号分析也是新论文素材 |
| **只想用 PyTorch 跑通模型的应用工程师** | **不适用**。你该用 PyTorch 2.x / torch.compile，没必要碰这一层 |
---
## 六、竞品横向对比
| 维度 | Triton | TileLang | CUTLASS/CuTe | ThunderKittens | Torch Inductor |
|---|---|---|---|---|---|
| 主抽象 | Block-level program | **Tile-level dataflow** | Template metaprogramming | Micro-kernel primitives | Graph-level IR |
| 语言 | Python DSL | Python DSL | C++ 模板 | C++ DSL | Python（用户不可见） |
| Shared memory / Layout 控制 | 黑盒 | **显式 + 可注解** | 全显式 | 全显式 | 黑盒 |
| Pipelining | 编译参数 | 显式 `T.Pipelined(num_stages=)` | 手写 | 手写 | 编译器决定 |
| 多后端 | NVIDIA/AMD（CPU 开发中） | NVIDIA/AMD/Metal/CPU/WebGPU/昇腾等 | NVIDIA 为主 | NVIDIA 为主 | 跟 PyTorch |
| 生态成熟度 | ★★★★★ | ★★★☆ | ★★★★ | ★★ | ★★★★★ |
| 上手难度 | 低 | 中（需懂 GPU 内存层级） | 极高 | 极高 | 零 |
| 适合场景 | 轻量融合、原型 | **高性能定制算子** | 极致 vendor 库级别的 kernel | 极致性能的研究型 kernel | 训练/推理通用加速 |
一句话定位：**Triton 让你更容易写出"还行"的 kernel；TileLang 让你更可控地写出"很快"的 kernel；CUTLASS 让你手搓"最快"的 kernel 但代价是精神健康**。
---
## 七、局限与不足：一份诚实的避坑清单
评测必须客观，TileLang 并非银弹。
### 7.1 并非所有算子都拿手
2026 年发表的一篇实证研究《Correct but Slow》用 A100 和 GH200 实测了 22 个 Triton/TileLang kernel，得出一个反直觉结论：**TileLang 在归一化、reduction 这类"简单算子"上反而可能灾难性落后**——LayerNorm 和 RMSNorm 的默认写法相比 PyTorch 基线最高慢 1347× 和 1520×，而 Triton 在同样任务上能做到接近持平。原因在于 TileLang 的 cost model 针对的是 tile/GEMM/attention 型 workload，对 elementwise 优化反而没那么激进。**结论：算子越"像 GEMM/Attention"，TileLang 优势越大；越像 elementwise，越该用 Triton**。
### 7.2 编译时间与长尾 bug
- JIT 编译时间在复杂 kernel（如 W4A16 大 GEMM）上仍偏长，复杂流水线的 pass 链会产生数百秒的编译时间。
- 新架构长尾问题不少：例如 SM120（RTX PRO 6000 Blackwell）上出现过 JIT 卡死 12 小时无输出的 issue；SM70（V100）的 BF16 fallback 路径曾有编译失败 bug。
- 多 CUDA 版本混装、ROCm 版本不匹配时，pip 装出来的 wheel 可能找不到对应 stub。
### 7.3 学习曲线并非"零门槛"
官方 README 写得很谦虚："TileLang 显著降低了 Kernel 编程门槛，但用户仍需掌握一定的编程技巧"。具体来说：
- **必须懂 GPU 内存层级**：什么是 shared memory bank conflict、什么是 register spilling、什么是 producer-consumer warp specialization，否则你看不懂 `T.alloc_shared` vs `T.alloc_fragment` 的差别，更别提 `T.annotate_layout`。
- **必须懂 TVM 的报错语言**：虽然 2026 年加入了源码位置追踪，但底层报错仍时常露出 TIRX 表达式。
- **API 仍在剧烈演进**：v0.1.13 就"移除了若干 legacy API"，从 v0.1.0 到 v0.1.13 仅一年半，跨版本升级需要读 compatibility notes。
### 7.4 社区规模仍属"小众硬核"
截至 2026 年 10 月，GitHub 约 7900+ stars、155 位 contributors、799 forks。对比 Triton（5 万+）和 CUTLASS（1 万+）还差一个量级。Discord 活跃，但中文资料稀缺、Stack Overflow 上几乎搜不到答案——遇到 bug 经常只能啃 issue 区或源码。
### 7.5 许可证
TileLang 主仓采用的是自定义许可（NOASSERTION），并非标准 MIT/Apache 2.0，商业集成前建议法务过一眼 LICENSE 文件。
---
## 八、社区活跃度与项目生命力
- **发版节奏**：v0.1.0（2025-02）→ v0.1.13（2026-08），18 个月发了 13 个 minor 版本，几乎每月一个版本；v0.1.13 一个版本就有 138 commits。
- **贡献者背景**：核心开发来自北京大学（Prof. Zhi Yang 组）+ 微软研究院（Dr. Lingxiao Ma、Dr. Jilong Xue 等），学术根基扎实，相关论文已投中 ICLR 2026。
- **工业界落地**：SGLang 已在 MI300X/MI355X 上用 TileLang 后端跑 DeepSeek-V3.2 和 GLM-5 的 FP8 MLA 推理，并报告吞吐提升 5~10%；vLLM 生态也有 fork 在用。
- **多后端扩张**：从 2025 年只支持 CUDA，到今天覆盖 AMD、Apple Silicon、昇腾、摩尔线程、海光、MetaX，生态扩张速度惊人。
综合判断：这是一个**处于快速上升期、由强学术团队背书、已被头部推理框架采纳**的项目，5 年内消失的概率很低；但接口稳定性、文档完备度距离 Triton 仍有明显差距。
---
## 九、结语与行动建议：该不该上车？
**TileLang 是 2025-2026 年 GPU Kernel 编程领域最值得认真研究的新势力。** 它不是要替代 Triton，而是补上了 Triton 和 CUTLASS 之间那段长期空缺的"甜蜜区"——当你既嫌 Triton 的黑盒不够快、又不敢直接跳进 CUTLASS 的模板地狱时，TileLang 就是答案。
**行动建议**：
1. **如果你的工作流涉及定制 AI Kernel**（GEMM、Attention、反量化、稀疏算子）：立刻装一份 `pip install tilelang`，把官方 `examples/` 下的 GEMM 和 FlashMLA 例子跑一遍，体感会非常震撼。
2. **如果你在做国产算力/非 NVIDIA 平台的算子**：TileLang 可能是目前唯一一个"一份代码、多硬件后端"且性能不掉链子的 DSL，认真评估它。
3. **如果你只是想加速 PyTorch 模型**：请继续用 `torch.compile` + 默认 Triton 后端，TileLang 对你是过度工程。
4. **如果想快速入门**：直接啃 TileLang Puzzles + 官方 `programming_guides/language_basics.html`，一周内即可写出能用的 kernel；想深入 Layout Inference，去读 arXiv 2504.17577 这篇论文。
5. **生产集成前先在小范围做兼容性验证**：尤其关注 CUDA/ROCm 版本匹配、SM 架构覆盖、以及你用到的那几个 API 在未来 minor 版本中是否会被 deprecated。
**终极评判**：Triton 适合写"够用"的 kernel，CUTLASS 适合写"极致"的 kernel，而 TileLang 让一个懂 GPU 内存层级的 Python 程序员，用 Triton 级别的开发效率写出接近 CUTLASS 级别的性能——这件事本身，就值得它跻身 2026 年最值得关注的开源项目之列。
