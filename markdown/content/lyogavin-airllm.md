# lyogavin/airllm

[GitHub URL](https://github.com/lyogavin/airllm)

- **Stars**: 32911
- **Language**: Jupyter Notebook

## AirLLM：让 2.8 万亿参数模型在 4GB 显存上运行的革命性工具

> AirLLM 是一个能突破显存瓶颈，在消费级显卡（甚至 4GB 显存）上运行超大模型的推理库。

- **Tags**: 大模型推理, 低显存, GitHub开源, MoE模型, 本地部署
- **Category**: 开发工具, 人工智能, 系统优化

## Details

# AirLLM 深度评测：让 2.8 万亿参数模型在 4GB 显存上跑起来的革命性工具
> 一行代码，让单张 4GB 显卡跑起 70B 大模型，甚至让 2.8 万亿参数的 Kimi K3 在 3.72GB 显存上运行——AirLLM 正在重写大模型推理的硬件规则。
## 一句话总结
AirLLM 是一个**开源的、突破性的 Python 库**，它通过创新的**层流式加载 (Layer-wise Streaming)** 和**专家级流式加载 (Expert-level Streaming)** 技术，让原本需要数十甚至数百 GB 显存的大型语言模型（LLM），能够在仅有 4GB 显存的消费级 GPU 上**以接近全精度**运行，而无需传统的模型量化、蒸馏或剪枝。它为预算有限的开发者、研究人员和学生打开了探索和实验最先进大模型的大门。
---
## 🧠 一、背景与痛点：大模型推理的“内存墙”
大模型时代，**显存（VRAM）** 成了最昂贵的资源，也成了绝大多数人探索先进模型的“拦路虎”。
-   **显存需求爆炸性增长**：一个参数为 FP16 精度的 70B 模型，其权重就需要约 **140GB** 的显存。这意味着你需要至少两块 NVIDIA A100 (80GB) 才能加载它，其硬件成本高达数十万元。
-   **传统方案的妥协**：为了在有限资源上运行大模型，常见的做法是**量化（Quantization）**（如将 FP16 压缩到 INT4）、**蒸馏（Distillation）**（用小模型模仿大模型）或**剪枝（Pruning）**（移除不重要的权重）。这些技术虽然有效，但通常会**不可逆地损失模型精度和性能**，并且需要复杂的调优。
-   **核心矛盾**：Transformer 模型的推理过程是**逐层串行**的。在计算第 N 层时，**并不需要同时将模型的所有层都加载到 GPU 显存中**。这个“常识”被 AirLLM 的作者 Gavin Li（也是链家 BELLE 团队的成员和 Anima 的创始人）重新审视并打破。
AirLLM 的诞生，正是为了解决这个核心矛盾：**它不压缩模型本身，而是改变模型加载和计算的方式，让显存瓶颈从“模型总大小”变成“单层权重大小”**。
---
## ⚙️ 二、核心亮点与功能剖析
AirLLM 的魔力源于一系列精妙的设计，其核心可以概括为“**按需加载，分而治之**”。
### 1. 🔄 层流式加载 (Layer-wise Streaming)：化整为零
AirLLM 的核心技术是**将整个大模型切分成独立的层（Layer）并保存到磁盘**。推理时，它不再是将整个模型加载到显存，而是**按顺序逐层加载**：
1.  **加载第1层**到显存 → **计算** → 将中间结果保存到系统内存 → **释放显存**中的第1层权重。
2.  **加载第2层**到显存 → **计算**（使用来自第1层的中间结果） → 保存 → 释放。
3.  ...重复此过程，直到最后一层。
**峰值显存占用**仅由**单层权重大小 + 激活值 + KV Cache** 决定。对于典型的 80 层 70B 模型，每层大小约 1.6-1.75GB，因此一张 4GB 显存的显卡就能轻松运行。
```mermaid
flowchart LR
    A[用户输入] --> B[加载第1层到GPU]
    B --> C[第1层计算]
    C --> D[将结果保存到CPU内存]
    D --> E[释放第1层显存]
    E --> F[加载第2层到GPU]
    F --> G[第2层计算<br>使用CPU内存中的结果]
    G --> H[保存结果到CPU内存]
    H --> I[释放第2层显存]
    I --> J[...]
    J --> K[输出结果]
    
    style B fill:#e3f2fd,stroke:#2196f3,color:#0d47a1
    style F fill:#e3f2fd,stroke:#2196f3,color:#0d47a1
    style D fill:#f3f9ff,stroke:#42a5f5,color:#0d47a1
    style H fill:#f3f9ff,stroke:#42a5f5,color:#0d47a1
```
### 2. 🚀 预取优化 (Prefetching)：让计算不等待
逐层加载的代价是**频繁的磁盘 I/O 和 PCIe 数据传输**，会形成“计算等待加载”的空转。AirLLM 通过**预取（Prefetching）** 技术巧妙地解决了这个问题：**在当前层计算的同时，后台线程会预先加载下一层的权重到 GPU**。这使得 CPU I/O 与 GPU 计算能够**流水线并行**，显著降低了数据传输带来的延迟。官方数据显示，此优化带来了约 **10% 的吞吐提升**。
### 3. 🧠 专家级流式加载 (Expert-level Streaming)：MoE 模型的神技
对于**混合专家（Mixture-of-Experts, MoE）** 架构的模型（如 Kimi K3, DeepSeek-V3, Qwen3-235B），AirLLM 的优化更进一步。MoE 模型的每一层包含多个“专家”，每个 token 只会通过其中的少数几个专家。
AirLLM 的洞察是：**不需要加载整个层的所有专家，而是只加载当前 token 路由到的那些专家**。如果一个层有 64 个专家，一个 token 只路由到其中 2 个，那么就只加载这 2 个专家的权重。这使得运行**万亿参数**的稀疏 MoE 模型成为可能，其显存需求几乎只与激活的专家数量相关，而非总参数量。
> 💡 **类比理解**：这就像一位图书管理员，他不需要把整个图书馆的书都搬到你面前。你只需要告诉他你想要看什么书（专家路由），他就会精准地把那几本书取给你。
### 4. ⚖️ 块级量化 (Block-wise Quantization)：可选的加速与压缩
AirLLM 还支持基于**块级量化（Block-wise Quantization）** 的模型压缩。与传统量化不同，AirLLM 的瓶颈在于磁盘 I/O 而非 GPU 计算，因此它**只量化权重而不量化激活值**。这样可以在保持模型精度的同时（Perplexity 仅提升约 0.3），将磁盘模型大小减小约 3-4 倍，从而**将推理速度提升最高 3 倍**。
启用非常简单，只需在初始化模型时传入 `compression` 参数：
```python
# 启用 4-bit 块级量化压缩
model = AutoModel.from_pretrained(
    "garage-bAInd/Platypus2-70B-instruct",
    compression='4bit'  # 或 '8bit'
)
```
### 5. 🌐 广泛的模型支持与自动识别
AirLLM 通过一个统一的 `AutoModel` 接口支持几乎所有主流开源模型，包括但不限于：
| 模型系列 | 支持情况 | 备注 |
| :--- | :--- | :--- |
| **Llama 系列** (1, 2, 3, 3.1, 3.2) | ✅ 全支持 | 70B 跑在 4GB, 405B 跑在 8GB |
| **Qwen 系列** (Qwen, Qwen2, Qwen2.5, Qwen3) | ✅ 全支持 | Qwen3-235B MoE 跑在 ~3GB |
| **DeepSeek 系列** (V2, V3) | ✅ 全支持 | DeepSeek-V3 (671B) 跑在 ~12GB |
| **Mistral / Mixtral** | ✅ 全支持 | |
| **ChatGLM 系列** | ✅ 全支持 | |
| **Baichuan 系列** | ✅ 全支持 | |
| **InternLM** | ✅ 全支持 | |
| **Phi 系列** | ✅ 全支持 | |
| **Gemma 系列** | ✅ 全支持 | |
| **Kimi K3 (2.8T MoE)** | ✅ 支持 | **跑在 ~3.72GB 显存** |
其 `AutoModel` 类会根据 HuggingFace 模型配置**自动检测模型类型**，用户无需手动指定模型类，极大降低了使用门槛。
### 6. 🍎 跨平台支持：CPU 与 macOS
-   **CPU 推理**：没有 NVIDIA GPU？AirLLM 同样支持**纯 CPU 推理**。虽然速度会更慢，但使得在任何有足够系统内存和磁盘空间的机器上运行大模型成为可能。
-   **macOS 支持**：AirLLM 原生支持 **Apple Silicon (M1/M2/M3/M4)** 芯片的 Mac，利用苹果的 MLX 框架。这意味着 MacBook Pro、Mac Studio 甚至 Mac mini 用户都可以运行 70B+ 的模型，利用其**统一的内存架构**，内存容量越高，体验越流畅。
---
## 👥 三、目标人群与收益：谁最需要它？
AirLLM 的价值在于**让不可能变为可能**，它特别适合以下人群：
| 目标人群 | 核心痛点 | 使用 AirLLM 的收益 |
| :--- | :--- | :--- |
| **👨‍💻 个人开发者 / 学生** | 没有高端 GPU，无法体验和实验 7B/13B 以上的大模型。 | **低成本学习与实验**：在现有 4GB/6GB 显卡上运行 70B 模型，体验最新技术，为论文或项目提供支持。 |
| **🔬 学术研究人员** | 研究经费有限，无法购买 A100/H100，需要实验超大模型。 | **突破硬件限制**：在有限预算下，对 405B、671B 甚至 2.8T 模型进行**离线推理和初步评估**，验证假设。 |
| **🏢 中小企业 & 初创团队** | 云端算力成本高昂，本地部署大模型不可行。 | **大幅降低硬件成本**：无需购买昂贵的高端服务器，利用普通工作站或游戏电脑即可部署和演示大模型能力。 |
| **🌍 资源受限地区的开发者** | 高端硬件获取困难且价格昂贵。 | **技术民主化**：让全球各地的开发者都能平等地访问和利用最先进的开源模型。 |
**核心收益**：
-   **📉 极低硬件成本**：无需购买专业级 GPU，现有设备即可运行。
-   **🧪 实验自由度**：可以尝试和对比不同规模、不同架构的大模型，找到最合适的。
-   **🚀 快速原型验证**：在本地快速验证大模型在特定任务上的效果，无需频繁提交云端任务。
-   **🔒 数据隐私与安全**：完全本地运行，无需将敏感数据上传至云端。
---
## ⚖️ 四、竞品/同类对比：它在哪儿？
AirLLM 并非唯一的内存优化方案，但它占据了非常独特的生态位。下表对比了常见方案的特点：
| 方案 | 最小显存需求 (70B 模型) | 推理速度 (tokens/s) | 主要优势 | 主要劣势 | 适用场景 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AirLLM (流式+可选量化)** | **4GB** | **0.1 - 0.5** | **极致低显存门槛**，无需修改模型 | **速度极慢**，依赖存储速度 | **资源极度受限**，能跑起来比快更重要 |
| **llama.cpp (CPU 推理)** | 0GB (纯 CPU) | 1 - 3 (高端CPU) | 无 GPU 依赖，社区生态成熟 | 无 GPU 加速，CPU 占用高 | 无 GPU 设备，需要最大兼容性 |
| **vLLM (PagedAttention)** | ~80GB | 30 - 50 | **高吞吐量**，专为服务设计 | 需要高端 GPU，不支持小显存 | **生产环境**部署，追求吞吐 |
| **ExLlamaV2 (GPU 量化)** | ~48GB | 20 - 40 | **速度快**，量化效果好 | 仍需较大显存，设置稍复杂 | 高端 GPU，追求速度和精度 |
| **DeepSpeed ZeRO-Offload** | ~8GB | 2 - 5 | 平衡速度与显存，集成于 HF | 配置复杂，CPU 内存占用大 | 拥有一定 GPU，想兼顾速度 |
**AirLLM 的独特竞争力**：
-   **绝对的低显存王者**：它是**唯一**能在 4GB 显存上运行 70B 模型的方案。
-   **无需模型修改**：不像 GPTQ/AWQ 等量化方法需要特定的量化模型文件，AirLLM 可以直接加载原始的 HuggingFace 模型。
-   **对 MoE 模型的极致优化**：其专家级流式加载技术是处理万亿参数 MoE 模型的最优解之一。
---
## ⚠️ 五、局限与不足：你需要付出的代价
没有银弹，AirLLM 的强大能力背后，也有其必然的代价和局限：
1.  **🐢 极慢的推理速度**：这是最核心的代价。由于频繁的磁盘 I/O 和 PCIe 数据传输，AirLLM 的推理速度比全量加载方案**慢几个数量级**。
    -   在 **4GB GTX 1650** + **DDR4 内存**的配置上，运行 4-bit 量化的 Llama-2-70B，速度仅约 **0.35 tokens/秒**。生成一个 100 词的回复可能需要近 5 分钟。
    -   **存储速度至关重要**：使用 NVMe SSD 会比 HDD 快很多，使用 CPU 内存作为缓存（如果够大）会更快。
2.  **💾 对磁盘空间和速度有要求**：
    -   **首次加载**：运行一个模型时，AirLLM 会先将其按层切分并保存到本地缓存目录。这意味着你需要**足够的磁盘空间**来存储这个切分后的模型（对于 70B 模型，约 130GB+）。
    -   **推理速度瓶颈**：推理速度很大程度上受限于**磁盘的顺序读取速度**。一块高速的 NVMe SSD 是必不可少的。
3.  **⚙️ 一些模型依赖项**：
    -   对于一些较新的模型（如 Kimi K3, Qwen3），可能需要安装额外的依赖，如 `compressed-tensors`, `flash-attn`，并确保 CUDA 版本匹配（例如 Kimi K3 需要 CUDA 12 的 torch）。
    -   macOS 用户需要安装 `mlx` 框架。
4.  **🎯 功能定位：离线实验与体验**：
    -   AirLLM **不适合用于需要实时响应的在线服务或生产环境**。它的定位是**个人实验、学术研究、离线评估和原型验证**。
5.  **📚 依赖网络和模型源**：
    -   模型权重从 HuggingFace Hub 下载。在某些网络环境下，访问和下载可能遇到困难，需要配置镜像或使用代理。
---
## 🚀 六、上手体验与代码示例
### 安装
```bash
# 创建虚拟环境（推荐）
python -m venv airllm-env
source airllm-env/bin/activate  # Linux/macOS
# 或 airllm-env\Scripts\activate  # Windows
# 安装 AirLLM
pip install airllm
# 如果需要使用量化加速，还需安装 bitsandbytes
pip install -U bitsandbytes
```
### 快速上手：运行 Qwen3-32B 模型
以下是最精简的示例，展示了 AirLLM 的简洁性：
```python
from airllm import AutoModel
MAX_LENGTH = 128
# 1. 一行代码加载模型（自动下载、检测、分层处理）
model = AutoModel.from_pretrained("Qwen/Qwen3-32B")  # 32B 模型，约需 ~4GB 显存
# 2. 准备输入文本
input_text = ["What is the capital of France?",]
input_tokens = model.tokenizer(
    input_text,
    return_tensors="pt", 
    return_attention_mask=False, 
    truncation=True, 
    max_length=MAX_LENGTH, 
    padding=False
)
# 3. 生成文本
generation_output = model.generate(
    input_tokens['input_ids'].cuda(),  # 将输入移动到 GPU
    max_new_tokens=20,
    use_cache=True,
    return_dict_in_generate=True
)
# 4. 解码输出
output = model.tokenizer.decode(generation_output.sequences[0])
print(output)
```
**预期输出**：
```
What is the capital of France? The capital of France is Paris.
```
### 运行超大模型：Kimi K3 (2.8T 参数)
这是 AirLLM 的终极炫技，在 ~3.72GB 显存上运行参数量达 2.8 万亿的模型：
```python
from airllm import AutoModel
# ⚠️ 注意：运行 Kimi K3 前需先安装特定依赖
# pip install compressed-tensors flash-attn
# 并确保使用 CUDA 12 版本的 torch
# 一行代码加载 2.8T 参数的 Kimi K3
model = AutoModel.from_pretrained("moonshot/Kimi-K3-2.8T")  # 实际模型路径请确认
# 其余推理步骤与上面相同
# ...
```
---
## 📊 七、性能基准测试与优化建议
### 速度基准测试 (参考官方数据)
| 配置 | 模型 | 量化 | 存储类型 | 速度 (tokens/s) | 峰值显存 | 首字延迟 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 4GB GTX 1650 + 32GB RAM | Llama-2-70B | 4-bit | DDR4 内存 | **~0.35** | 3.2 GB | ~12 秒 |
| 4GB GTX 1650 + 32GB RAM | Llama-2-70B | 4-bit | NVMe SSD | **~0.12** | 3.2 GB | ~45 秒 |
| 8GB RTX 3060 + 64GB RAM | Llama-3-405B | 无量化 | DDR4 内存 | **~0.5** (估计) | ~8 GB | >60 秒 |
| **A100 80GB (全量加载)** | Llama-2-70B | FP16 | - | **45** | 140 GB | 0.8 秒 |
*注：A100 数据作为基准参考，来自。AirLLM 的速度在不同硬件和存储配置下会有巨大差异。*
### 优化建议
1.  **优先使用 CPU 内存缓存**：如果系统内存足够大（远大于模型大小），AirLLM 可以将切分后的模型层缓存在内存中，这比从 SSD 读取快得多。这是提升速度最有效的方法。
2.  **启用块级量化压缩**：如前文所示，使用 `compression='4bit'` 可以在精度损失极小的情况下，将磁盘 I/O 开销降低，获得 2-3 倍的速度提升。
3.  **使用更快的存储**：**高速 NVMe SSD** 是 AirLLM 的最佳拍档。确保 SSD 的顺序读写速度足够高。
4.  **调整生成参数**：减少 `max_new_tokens`，使用更简单的提示词，可以减少总的计算量。
5.  **保持系统清洁**：关闭其他占用大量内存或 GPU 的程序，为 AirLLM 留出尽可能多的资源。
---
## 🏁 八、结语与终极评判
AirLLM 是一个**极具开创性和颠覆性的工具**。它用非常巧妙的工程解决方案，打破了“大模型必须大显存”的固有认知，真正实现了**大模型推理的硬件民主化**。
**✅ 它的终极价值在于**：
-   **让不可能变为可能**：让无数只有 4GB/6GB 显卡的开发者，第一次有机会在本地运行 70B、405B 甚至万亿参数的模型，这是真正的技术普惠。
-   **提供一种全新的可能性**：它为资源受限的研究、教育和实验打开了全新的通道，让更多人能够参与到最前沿的 AI 探索中。
-   **技术思路的启示**：其“层流式加载”和“专家流式加载”的思想，为未来大模型在边缘设备上的部署提供了重要的思路参考。
**❌ 但你必须清醒地认识到**：
-   **它不是一个追求速度的推理引擎**：它的设计目标是“能跑起来”，而不是“跑得快”。如果你需要高吞吐、低延迟的在线服务，请选择 vLLM、ExLlamaV2 或 TensorRT-LLM。
-   **它有显著的学习和使用成本**：你需要理解其原理，接受慢速，并准备好相应的硬件（高速 SSD、充足内存）。
**🎯 最终行动建议**：
-   **如果你是一名个人开发者、学生或研究者，只有一张 4GB/6GB 的显卡，但渴望体验和实验超大模型**：**强烈推荐你立即尝试 AirLLM**。这是目前唯一的选择，它能给你带来前所未有的体验。
-   **如果你是一名企业工程师，需要在生产环境部署大模型**：**AirLLM 可能不适合你**。请评估传统量化方案（GPTQ, AWQ）或专业推理引擎（vLLM, TensorRT-LLM）。
-   **如果你是一名 AI 爱好者，只是想玩一玩**：可以试试，但要有足够的耐心。或者，你也可以选择它来运行一些**较小的模型（如 7B/13B）**，即使在这些模型上，它的速度也足够日常使用了。
**总而言之，AirLLM 是一个** **“偏科”的天才**。它在“低显存”这个细分领域做到了极致，是当前**无与伦比的王者**。只要你的需求恰好落在它的领域内，它就能给你带来无与伦比的价值。**选择它，就意味着选择了一条“慢但能行”的道路，但对于许多探索者来说，这条道路本身就是通往未知领域的唯一桥梁。**
---
## 🔗 附录：资源与链接
-   **GitHub 仓库**: [lyogavin/airllm](https://github.com/lyogavin/airllm) 
-   **PyPI 包**: [airllm](https://pypi.org/project/airllm/)
-   **论文参考**: [Block-wise Quantization](https://arxiv.org/abs/2212.09720) 
-   **相关文章**:
    -   [AirLLM Enables 2.8T Parameter AI Inference on 4GB GPUs](https://aibreakingwire.com/news/airllm-enables-28t-parameter-ai-inference-on-4gb-gpus) 
    -   [AirLLM:4GB 显存跑 70B 大模型,无需量化](https://blog.mushroom.cv/blog/airllm-70b-inference-4gb-gpu-layer-streaming) 
    -   [AirLLM:一张 4GB 显卡,把 70B 模型"流"起来](https://juejin.cn/post/7675273747710541878)
