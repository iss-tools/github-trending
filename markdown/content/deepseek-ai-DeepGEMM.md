# deepseek-ai/DeepGEMM

[GitHub URL](https://github.com/deepseek-ai/DeepGEMM)


## DeepGEMM 深度评测：DeepSeek 开源的 1550 TFLOPS FP8 矩阵乘法内核库

> DeepSeek 开源的高性能 FP8 矩阵乘法 GPU 内核库，H800 上实测 1550 TFLOPS，是大模型训练推理的底层加速神器。

- **Tags**: DeepSeek, FP8, GPU加速, CUDA, 开源项目
- **Category**: 开发工具, AI 基础设施, 深度学习

## Details

# DeepGEMM 深度评测：为什么 DeepSeek 愿意把这个"印钞机"级别的 GEMM 内核开源？
DeepGEMM 是 DeepSeek 在 2025 年开源周（Open Source Week）第三天发布、至今持续活跃维护的 **FP8/FP4/BF16 通用矩阵乘法（GEMM）内核库**，它用一套不到 300 行的核心 kernel 代码，在 Hopper H800 上跑出了 **1550 TFLOPS** 的实测成绩，是当前社区里极少数能同时兼顾"性能可打、代码可读、学术价值高"三者的 GPU 计算库。
如果你在做大模型推理/训练、研究 Hopper 架构、或者想搞懂"DeepSeek V3 到底靠什么把 671B MoE 跑得又快又便宜"，这个项目都值得一读——它不只是个工具，更像是一本**用真实生产级代码写的《Hopper GPU 调优教科书》**。
---
## 一、背景与痛点：DeepSeek 为什么非做它不可？
要理解 DeepGEMM 的价值，得先看它要解决的那个"卡脖子"问题。
### 1.1 大模型推理的真正瓶颈不在模型，而在矩阵乘法
无论是训练还是推理，Transformer 的大部分算力开销最终都汇到同一个算子上：**GEMM**——把矩阵 A 乘上矩阵 B。在 DeepSeek V4 Flash 的实测画像里，FP8/FP4 GEMM 内核能占到**总 GPU 时间约 61.9%**，也就是说你在算力账单上花的每两块钱，就有一块多是"在做矩阵乘法"。
这意味着：**GEMM 快 20%，整个推理成本就掉一大截**。这也是为什么 NVIDIA 自己的 CUTLASS、OpenAI Triton、以及各家手写 kernel 一直在卷。
### 1.2 DeepSeek-V3 的 FP8 精度方案，主流库"接不住"
更关键的是，DeepSeek-V3 论文里提出了 **fine-grained scaling（细粒度缩放）**的 FP8 量化方案：不再是把整个矩阵用一个 scale 因子粗放地量化，而是把 A 矩阵按 **1×128**、B 矩阵按 **128×128** 的小块做局部量化。
这样能大幅降低 FP8 相对 FP16 的精度损失，但代价是——**NVIDIA cuBLAS、CUTLASS、Triton 当时都没有现成的 kernel 直接支持这种缩放方式**。DeepSeek 团队只能自己动手写，写完顺手开源了，这就是 DeepGEMM 的由来。
> 一句话概括：**DeepGEMM 是 DeepSeek-V3 训练/推理栈里那块"被逼出来的自研拼图"，开源出来之后恰好填了社区 FP8 细粒度量化的空白。**
### 1.3 它在 DeepSeek 五件套里的位置
DeepSeek 开源周连发五个仓库，每个对应一个瓶颈：
| 仓库 | 解决的问题 | 关键数字 |
|------|-----------|---------|
| FlashMLA | MLA 注意力解码 kernel | H800 上 3000 GB/s / 580 TFLOPS |
| DeepEP | MoE 专家 all-to-all 通信 | 低延迟解码 kernel |
| **DeepGEMM** | **稠密 + MoE 的 FP8 矩阵乘** | **H800 上 1350→1550 TFLOPS** |
| DualPipe | 流水线并行的计算通信重叠 | 减少训练 bubble |
| 3FS | KV Cache 高性能分布式文件系统 | 大规模 KV 卸载 |
**DeepGEMM 是其中最"通用"的那一块**——FlashMLA 和 DeepEP 深度绑定 DeepSeek 自家架构，而 GEMM 是所有大模型都会用到的底座算子，普适性更强。
---
## 二、核心亮点与功能剖析：凭什么说它是"教科书级"实现？
### 2.1 亮点一：JIT 编译，装完即用，无需预编译 CUDA
传统高性能 CUDA 库（包括 CUTLASS）最大的痛是**编译慢**——每种矩阵形状、每种 block 配置都要提前编译成二进制，仓库动辄几个 GB。
DeepGEMM 采取了完全不同的思路：**所有 kernel 都在运行时通过 DeepJIT 按需编译**。安装阶段不需要 nvcc 编译，Python 调用时根据你传入的 shape、dtype、SM 数量现场生成 CUDA 代码再即时编译，并缓存到 `~/.dj` 目录。
这带来的好处有三层：
- **安装包极小**，git clone 完就能跑
- **任意矩阵形状都能覆盖**，不会出现"这个 shape 没预编译、fallback 到慢速路径"的尴尬
- **JIT 过程可调优**——通过 `DG_JIT_*` 环境变量能打印 PTX/SASS、检查寄存器溢出、调试 load time，对 kernel 工程师极其友好
### 2.2 亮点二：极简哲学——不依赖 CUTLASS 模板，核心代码 ~300 行
CUTLASS 功能强大但出了名的"模板地狱"，一个 GEMM 展开后的错误信息能让老手都怀疑人生。DeepGEMM 的选择非常清醒：**借鉴 CUTLASS 和 CuTe 的概念，但完全不用它们的模板和代数系统**。
核心 kernel 代码约 300 行，配合 Hopper 上的几大硬件特性：
- **TMA（Tensor Memory Accelerator）**：Hopper 新增的异步内存搬运单元，负责把数据从 HBM 批量搬到 Shared Memory，绕开 CPU
- **WGMMA（Warp Group Matrix Multiply-Accumulate）**：Hopper 新一代 Tensor Core 指令，支持跨 warp group 的异步矩阵乘
- **Warp specialization**：不同的 warp 各司其职——有的负责搬运、有的负责计算、有的负责累加 scale 因子，形成生产流水线
这种设计让代码**可读性和教学价值极高**，是少数真的能让你"从头读懂一个生产级 FP8 GEMM"的开源实现。
### 2.3 亮点三：API 设计紧凑，覆盖训练 + 推理 + MoE 全场景
DeepGEMM 的 API 命名约定是 `D = C + A @ B`，按使用场景分成三类：
**稠密 GEMM（非分组）**——用于普通线性层：
```python
import deep_gemm
# D = C + A @ B^T (NT 布局)
deep_gemm.fp8_gemm_nt((a, a_sf), (b, b_sf), out)
```
**Contiguous 分组 GEMM**——用于 MoE 训练 forward / 推理 prefill。所有 token 按 expert 分组拼成一个长张量，每个 expert 的 segment 对齐到 `get_mk_alignment_for_contiguous_layout()`：
```python
deep_gemm.m_grouped_fp8_gemm_nt_contiguous((a, a_sf), (b, b_sf), out, m_indices)
```
**Masked 分组 GEMM**——用于 MoE 推理 decode 阶段，配合 CUDA Graph 使用，传入 mask 张量只计算有效部分。**典型用法是把 DeepEP 低延迟 kernel 的输出直接喂进来**：
```python
deep_gemm.m_grouped_fp8_gemm_nt_masked((a, a_sf), (b, b_sf), out, masked_m, expected_m)
```
**2026 年新增的 Mega MoE** 更激进——把 EP dispatch、Linear1、Linear2、SwiGLU、EP combine **融合成一个 mega-kernel**，用对称内存做多进程启动，在 NVLink 通信和 Tensor Core 计算之间做重叠。
```python
buffer = deep_gemm.get_symm_buffer_for_mega_moe(
    group, num_experts, num_max_tokens_per_rank, num_topk, hidden, 
    intermediate_hidden, mma_type='fp8xfp4'
)
transformed_l1, transformed_l2 = deep_gemm.transform_weights_for_mega_moe(l1_weights, l2_weights)
deep_gemm.fp8_fp4_mega_moe(y, transformed_l1, transformed_l2, buffer)
```
### 2.4 亮点四：性能真的能打
**官方数字**：2025 年 4 月起，H800 上从最初的 1350 TFLOPS 提升到 **1550 TFLOPS**。
**第三方独立评测**（besthub.dev，覆盖 H20 和 H800 两张卡）：
| 对比项 | 小矩阵 (m ≤ 256) | 中矩阵 (512–2048) | 大矩阵 (≥ 4096) |
|--------|------------------|-------------------|-----------------|
| vs CUTLASS (H800) | CUTLASS 快 2–5× | CUTLASS 快 1.0–3.5× | **DeepGEMM 快 1.74×** |
| vs Triton (H800) | DeepGEMM 快 2–3× | DeepGEMM 快 2–3× | DeepGEMM 快 2–3× |
| vs Triton (H20) | DeepGEMM 快 1.38–1.95× | DeepGEMM 略快 | DeepGEMM 略快 |
**结论很清晰**：
- **大矩阵 / 大 batch 推理**：DeepGEMM 优势明显
- **小矩阵 / 小 batch**：CUTLASS 更强（这正好和它的细粒度量化定位吻合——MoE decode 场景每个 expert 上的 token 数其实不大）
- **Triton 全面落后**，H800 上能被拉开 2–3 倍
---
## 三、上手门槛与部署体验
### 3.1 硬件要求是"硬门槛"
DeepGEMM **只支持 NVIDIA SM90（Hopper）和 SM100（Blackwell）架构**，也就是 H100/H800/H20 和 B200/B100 系列的 Tensor Core。
- **A100、RTX 4090、RTX 3090 及更早的卡**：直接跑不起来，kernel 层用了 Hopper 专属的 TMA 和 WGMMA 指令
- **消费级 40 系显卡**：同样不支持，想要类似体验只能用 FlashAttention-2 + FP16 路径
### 3.2 软件环境
| 依赖 | 最低版本 |
|------|---------|
| Python | 3.8+ |
| CUDA Toolkit | **12.9+**（要求较高） |
| PyTorch | 2.3+ |
| CUTLASS | 4.0+（通过 git submodule 拉取） |
| C++ 编译器 | 需支持 C++20 `<format>` |
**安装流程**异常简单，因为不用预编译：
```bash
git clone --recursive git@github.com:deepseek-ai/DeepGEMM.git
cd DeepGEMM
./install.sh
```
之后 `import deep_gemm` 就能直接调用。**Mega MoE 功能需要 PyTorch ≥ 2.9**，这是相对新的依赖要求。
### 3.3 集成到现有推理栈
对绝大多数人来说，**手动调用 DeepGEMM 不是主路径，通过 SGLang / vLLM 间接使用才是**。
SGLang 已经原生集成 DeepGEMM，并且支持**预编译**（关键！）：
```bash
# 预编译 DeepGEMM kernel，避免启动时的 JIT 冷启动
python3 -m sglang.compile_deep_gemm \
    --model deepseek-ai/DeepSeek-R1 \
    --tp 8 --trust-remote-code
# 启动服务
python3 -m sglang.launch_server \
    --model-path deepseek-ai/DeepSeek-R1 \
    --tp 8
```
vLLM 也内置了 DeepGEMM 基准测试脚本，可以直接对比 DeepGEMM、Triton、CUTLASS 三者在你的 workload 下的表现。
### 3.4 内存布局陷阱（避坑必读）
这是新手最容易踩的坑：**SM90 实现只支持 NT 布局**（A 行主序、B 列主序），而 **SM100（Blackwell）支持全部四种 NT/TN/NN/TT**。
如果你的老代码把 TN 布局的张量直接喂给 H100 上的 DeepGEMM，结果要么是垃圾数据要么直接 crash。解决方案只有两条路：
1. 显式做转置
2. 迁移到 Blackwell 版本
另外，**scaling factor 的格式在两代卡上还不一样**：SM90 用 FP32，SM100 用 packed UE8M0（4 个 UE8M0 打包进一个 int32）。这是需要跨代迁移代码时特别要留意的地方。
---
## 四、目标人群与收益
### 🎯 强烈推荐关注的人群
**1. 大模型推理服务工程师（SRE / ML Infra）**
- 收益：用 SGLang 一行命令接入 DeepGEMM，DeepSeek-R1/V3 在 H100 集群上的 token 吞吐能有实打实的提升。根据 LMSYS 的测试，PD 分离部署 + DeepGEMM + MTP 组合下，每节点 8×H100 能跑到 **52.3k 输入 tokens/s / 22.3k 输出 tokens/s**
- 行动：升级 SGLang 到最新版本 → 预编译 DeepGEMM → 打开 MTP
**2. GPU Kernel 工程师 / CUDA 学习者**
- 收益：这是**公开可获取的最优 Hopper FP8 GEMM 教学实现之一**。300 行核心代码配上 TMA/WGMMA/warp specialization，读完你对 Hopper 的理解会上一个台阶
- 行动：从 `csrc/` 目录的 kernel 代码读起，配合 `DG_JIT_DUMP_SASS=1` 看 SASS 汇编，能学到很多"什么时候该用什么指令"的实战经验
**3. 自研大模型 / 做训练框架的团队**
- 收益：直接复用 DeepGEMM 的细粒度 FP8 量化方案，在 H800 集群上大幅降低训练成本，且 API 支持 forward、backward、weight gradient 全流程
**4. 学术研究者**
- 收益：研究 Hopper 架构特性、FP8 量化、MoE 优化时，这是绕不开的 baseline，也是写论文时最应该对比的对象
### ❌ 不适合的人群
- **手上只有 A100 / RTX 4090 / 消费级显卡的独立开发者**：硬件不支持，用不上，建议直接调用 DeepSeek API
- **不做大模型、只做 CV / 推荐 / 传统 ML 的团队**：这些场景 FP16/BF16 GEMM 已经够用，FP8 收益有限
- **期待"pip install 就能加速所有模型"的用户**：它不是 PyTorch 替代品，需要和推理框架（SGLang/vLLM）配合
---
## 五、竞品对比：它在 GEMM 生态里处于什么位置？
| 维度 | **DeepGEMM** | NVIDIA cuBLAS | CUTLASS | Triton |
|------|-------------|---------------|---------|--------|
| **FP8 细粒度 scaling** | ✅ 原生支持（1×128 / 128×128） | ❌ 不支持 | ⚠️ 需自行扩展 | ⚠️ 需手写 |
| **代码可读性** | ★★★★★ (~300 行核心) | ★ (闭源) | ★★ (模板地狱) | ★★★★ (Python DSL) |
| **H800 大矩阵性能** | ★★★★★ | ★★★★ | ★★★★★ | ★★ |
| **H800 小矩阵性能** | ★★★ | ★★★★ | ★★★★★ | ★★ |
| **跨代 GPU 支持** | ❌ 仅 SM90/SM100 | ✅ 全系列 | ✅ 全系列 | ✅ 全系列 |
| **JIT 编译** | ✅ 运行时 JIT | ❌ 预编译 | ❌ 预编译 | ✅ 运行时 JIT |
| **生态集成度** | SGLang / vLLM | 全生态 | 全生态 | PyTorch / vLLM |
| **学习曲线** | 中等 | 极低 | 高 | 低 |
| **许可证** | MIT（商用友好） | 闭源 | BSD-3 | MIT |
**三个关键判断**：
1. **对标 CUTLASS**：DeepGEMM 不是要"干掉" CUTLASS，而是**做了 CUTLASS 没做的那部分——细粒度 FP8 scaling 的一等公民支持**。在超大矩阵上 DeepGEMM 甚至反超 CUTLASS 达 1.74 倍，但小矩阵场景 CUTLASS 仍有 2–5 倍优势。实际项目里两者经常是"互补关系"。
2. **对标 Triton**：几乎全面碾压。Triton 的价值在于**开发效率和跨硬件可移植性**，而 DeepGEMM 的价值在于**极致性能**。如果目标是榨干 Hopper，DeepGEMM 是必选项。
3. **对标 cuBLAS**：cuBLAS 依然是"默认最稳"的选择，但 FP8 细粒度量化这条路上它没跟上节奏。DeepSeek 自己大规模部署 V3/R1 时用的就是 DeepGEMM，这本身就是最有力的生产级背书。
---
## 六、局限与不足：客观说，它不是万能药
### 6.1 硬件绑定过深，覆盖面窄
这是最致命的一条。**只支持 SM90/SM100 意味着整个 AMD ROCm 阵营、所有 Intel GPU、所有消费级显卡都被排除在外**。虽然社区有 DeepGEMM-Ascend 这样的非官方移植尝试，但都不是 DeepSeek 官方维护。
你的硬件选型一旦不在 Hopper/Blackwell 上，这个库就与你无关。
### 6.2 CUDA 版本要求苛刻
**CUDA Toolkit 12.9+** 这个门槛不小——很多企业内部环境还停留在 12.1/12.3，升级 CUDA 在生产集群里是个不小的工程。PyTorch 2.3+ 的要求也意味着一些老项目要先升级 PyTorch。
### 6.3 不是"即插即用"的加速库
DeepGEMM **只负责 GEMM 本身**，周围的"脏活"——FP8 casting、张量转置、scale factor 布局变换——都需要用户自己在前序 kernel 里完成或融合。官方 README 明确说了："输入转置或 FP8 casting 必须由用户单独处理……库提供的一些简单 PyTorch 工具函数可能导致性能较慢"。
对不了解 GPU kernel 的开发者来说，这套 API 的学习成本比"调一个 torch.matmul"高得多。
### 6.4 JIT 冷启动问题
虽然 JIT 避免了编译地狱，但**首次调用某个矩阵 shape 时仍然要现场编译**，可能有几秒到几十秒的延迟。这在生产服务里必须通过 `compile_deep_gemm` 这种预编译脚本提前处理，否则会污染 P99 延迟指标。
### 6.5 文档相对精简
README 写得极其克制，很多细节（比如 UE8M0 的 packing 规则、Mega MoE 的多进程对称内存机制）需要去 `tests/` 目录里读代码才能彻底搞懂。对非 DeepSeek 内部人员来说，阅读成本不低。
### 6.6 性能优势有边界
别忘了 besthub.dev 的测试结论：**小矩阵（m ≤ 256）CUTLASS 快 2–5 倍**。如果你的场景恰好是小 batch、小矩阵的 decode，硬上 DeepGEMM 反而会退化。正确做法是**按 shape 分流**——大矩阵走 DeepGEMM、小矩阵走 CUTLASS 或 cuBLAS。
---
## 七、结语与行动建议
DeepGEMM 的开源像一次"技术自信的展示"：**DeepSeek 不仅在模型层面做到了开源 SOTA，在底层 GPU kernel 上也敢于把自己的看家本领拿出来**。它证明了顶级 AI 公司的竞争力不只是算法和算力，更是**对硬件的极致理解和调优能力**。
### 给不同读者的终极建议
**如果你是推理服务工程师**：这不是"要不要了解"的问题，而是"多快接入"的问题。在 H100/H800 集群上跑 DeepSeek 系列模型的话，走 SGLang 路径接入是性价比最高的方案，30 分钟就能完成升级。
**如果你是 kernel 工程师 / 学生**：把 DeepGEMM 仓库的 `csrc/` 目录当作 Hopper 架构的"实战教材"来读，配合 NVIDIA 官方的 Hopper whitepaper一起看，比任何教程都扎实。
**如果你是研究者**：把它作为 FP8 GEMM 的 baseline，但要意识到 DeepGEMM 的性能优势集中在特定 shape 和特定量化方案下，做对比实验时务必覆盖多组矩阵尺寸。
**如果你手上的硬件不是 Hopper/Blackwell**：坦然跳过这个库，关注 FlashAttention-2、Triton、以及 AMD 阵营的替代方案即可。
### 未来展望
从 2025 年 4 月的 FP8xFP4、到 2025 年 7 月的 SM100 支持、到 2026 年 4 月的 Mega MoE + DeepJIT 重构、再到 2026 年 9 月的 Sparse Indexer 和 Mega Gate，DeepGEMM **保持着约每季度一次大版本更新的节奏**，可见 DeepSeek 是把它作为长期投入的基础设施来维护的，而非"开源周一次性放完就不管"的项目。
随着 Blackwell 架构逐步铺开、FP4 硬件原生支持成熟，DeepGEMM 很可能成为**下一代大模型训练/推理栈的事实标准之一**。现在入坑研究，时机刚好。
