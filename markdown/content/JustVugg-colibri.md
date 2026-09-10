# JustVugg/colibri

[GitHub URL](https://github.com/JustVugg/colibri)


## Colibrì：让消费级设备运行 744B 大模型的纯 C 推理引擎

> 纯 C 语言开发的开源推理引擎，通过分层存储技术，让普通电脑也能跑起 700B+ 的超大规模 AI 模型。

- **Tags**: 大模型, 推理引擎, 开源, C语言, 本地部署
- **Category**: 开发工具, AI

## Details

# Colibrì：用纯 C 和分层存储，把 744B～2.8T 模型“搬”到消费级硬件的开源推理引擎
## 一句话总结
Colibrì 是一套“把 744B～2.8T 参数的前沿 MoE 模型搬上消费级/异构硬件”的开源推理引擎：用纯 C 实现单文件引擎，将 NVMe/内存/显存当作统一分层内存，并按需流式读取所需专家权重；核心价值在于“不改变模型语义的前提下，用更少的硬件跑更大的模型”，并自带 OpenAI 兼容 API 与可视化 Dashboard。
---
## 背景与痛点：为什么要做一个“权重 JIT”？
- 大模型 MoE 化成主流。以 GLM-5.2 为例，744B 总参数但每 Token 只激活约 40B，极端的稀疏性让“全量驻留内存”变得不再经济，甚至不可行。  
- 传统部署思路要求海量显存或内存。多数框架要么把整个权重拉进内存/显存，要么依赖云端 API；私有部署成本高、硬件门槛高。  
- Colibrì 的回答是：把专家权重当成“可缓存的数据”，而不是必须驻留的状态；像编译器 JIT 只编译热路径一样，它只把“频繁用到的专家”热载到更快层级，其余从磁盘按需流式读取；并在多 GPU、CPU、Metal/Vulkan 等异构算力之间建立统一调度，形成“存储/内存/显存”的单一推理层次。
> 比喻：想象一座巨型图书馆（744B 专家），你只会在每一层书架上取几本（每 Token 激活的专家）。Colibrì 并不把整座图书馆搬进书房，而是记得你的阅读习惯、提前从地下书库把热门书搬到书桌，必要时亲自跑一趟地下书库；书房再小，也读得完这座图书馆，只是速度慢一点。
---
## 核心亮点与功能剖析
### 1) 单一内存层次（VRAM/RAM/NVMe）——“只影响速度，不影响语义”
- 同一组权重可以在 VRAM、RAM 或 NVMe 任意一层；引擎保证无论从哪一层取出，路由决策与数值精度完全一致，缺的只是快慢。这样低配机器“能跑但慢”，高配机器“跑得更快”。
### 2) “权重的 JIT”
- 持续记录每条对话实际路由到的专家（.coli_usage），据此做：
  - per-layer LRU；
  - 学习到的“钉住”（pinned）热集合；
  - 一层向前预取（router-lookahead）。
- 这样重复负载（比如同一代码风格、同一垂直领域）会越用越快；作者也强调这套策略仍是“假设”而非兜底承诺，鼓励社区用 A/B 实证。
### 3) I/O 也是引擎的一部分
- 批量专家去重（batch-union）、异步 I/O 池（PIPE=1）、O_DIRECT、加权双 SSD 条带等设计，把“读盘时间”与“算力计算时间”重叠，以隐藏磁盘延迟。双 SSD 模式下按带宽加权分发读取，可叠加带宽提速约 1/3；镜像与主盘会在启动时做字节级校验，部分镜像也可用。 
### 4) 多后端与异构执行
- CPU、CUDA、Metal、Vulkan、NUMA 共用同一运行时，可按硬件组合使用；例如：
  - macOS/Apple Silicon：Metal 后端；
  - NVIDIA：CUDA 后端（支持 Pascal/Turing/RTX 50 等）；
  - AMD/老旧显卡：Vulkan 后端（1.2+），含 RADV 选项。 
### 5) 压缩但不失真的 KV 状态
- GLM-5.2 的 MLA 注意力把每 Token 的 KV 压缩到 576 个浮点数（原始 32,768，约 57 倍压缩），并持久化到 .coli_kv；重启会话可“热恢复”，省去重新 Prefill，且数值与未中断会话字节级一致。
### 6) 诚实的投机解码
- 使用模型自带的 MTP 头做 Draft，但有“严格二策”：
  - MTP 头必须用 int8（int4 会导致 0–4% 接受率）；
  - Draft 与 Verify 必须在同一个内核家族（SPEC_PIN=1）。
- 投机是否有净收益取决于“缓存温度”，实测在特定命中率下也可能回退 32%，因而可按需关闭 DRAFT=0。实测在 6×RTX 5090 全驻留下约 2.2–2.8 tokens/forward。
### 7) 多模型家族与“单 C 文件”工程风格
- 八大模型家族（GLM-5.2/5.3、Inkling、Kimi K3、DeepSeek V4 Flash、Qwen3.8-Flash-Next、Qwen3.6、OLMoE）各有一个 C 文件引擎 + 统一的 coli chat/serve/web 前端；CLI 无需随模型切换而变化，只要 COLI_MODEL 指向不同目录即可。 
---
## 上手门槛与部署体验（开源项目视角）
### 安装方式
- 预编译（推荐）：Linux/macOS/Windows 提供压缩包，解压即用，无需本地编译；在目录里执行 python3 coli info 即可确认引擎就绪。   
- 从源码构建：需要 gcc 或 clang + OpenMP：
  - git clone https://github.com/JustVugg/colibri && cd colibri/c
  - ./setup.sh（自检+自测）；也可 pip install -e . 把 coli 注册到 PATH。 
### 模型获取与转换
- GLM-5.2 int4 官方推荐在 Hugging Face 使用预转换的“gs64 + int8 MTP 头”容器（约 372 GB）。旧版“per-row int4”质量约下降 9pp，易导致 EOS 饿死/不终止。   
- 自转换：./coli convert --model /nvme/glm52_i4，可“逐片下载+转换”，不必在盘上占用完整 FP8 原始文件。 
### 日常使用与子命令
- TUI 聊天：
  - COLI_MODEL=/nvme/glm52_i4 ./coli chat   
- 检查与调优：
  - ./coli plan —— 查看 VRAM/RAM/磁盘安置计划；
  - ./coli doctor / --deep —— 就绪与一致性检查；
  - ./coli tune —— 测量并保存该机器“最快且安全”的执行档案。   
- 服务与可视化：
  - ./coli serve --model /nvme/glm52_i4 —— 带 API+仪表盘，无浏览器；
  - ./coli web --model /nvme/glm52_i4 —— 自动打开浏览器，展示 Token 指标、各层级占比与“小大脑/专家星系”可视化。 
### 本地集群模式
- 由 coordinator 持有 Token 生成/路由/KV；worker 仅执行专家 FFN 并从本地磁盘读取权重；一层所有专家的 union 通过一条持久 TCP 请求下发，避免“每个专家一个往返”：
  - 启动注册服务：./coli cluster coordinator --host 0.0.0.0 --port 8765
  - 启动 worker：./coli cluster worker --model /nvme/glm52_i4 --port 9100 --coordinator http://COORDINATOR:8765 --advertise-host WORKER_IP
  - 启动服务：./coli serve --model /nvme/glm52_i4 --cluster-coordinator http://127.0.0.1:8765 
### 最低硬件需求（以 GLM-5.2 为例）
- 磁盘：约 372 GB（int4-gs64），建议 NVMe；  
- RAM：最少 16 GB、舒适 24 GB；  
- GPU：非必需，但有则显著加速（尤其是 prefill）。 
### Demo：最小可复现命令（TUI）
- 前置：下载预编译包并解压；从 Hugging Face 下载 GLM-5.2-colibri-int4-g64-with-int8-mtp 并解压到 /nvme/glm52_i4。  
- TUI 入门：
  - COLI_MODEL=/nvme/glm52_i4 ./coli chat 
- 带 Dashboard/OpenAI 风格 API：
  - ./coli web --model /nvme/glm52_i4 
---
## 技术栈与架构解析
### 语言与依赖
- 核心：纯 C，单文件（各模型一个 .c）+ 少量头文件；不依赖 BLAS，运行时不需要 Python（仅转换脚本与 HTTP 网关使用 Python）。   
- 并行：OpenMP；后端可选 CUDA/Metal/Vulkan。 
### 目录结构
- Makefile（顶层构建与检查入口）；  
- c/*.c（各模型家族引擎）；  
- c/*.h（safetensors/量化/tokenizer/专家存储/路由追踪/KV 复用等共享头）；  
- c/backend_*（GPU 后端实现）；  
- c/openai_server.py（OpenAI 兼容 HTTP 网关）；  
- web/、desktop/、docker/、docs/（前端/桌面/容器/文档）。 
### 设计理念
- “共享机制进头文件，个性逻辑进 C 文件”：修复会自动作用到所有引擎，避免“一处改、一家生效”的重复维护问题；  
- “只改布局不改语义”：所有优化都必须通过端到端（end-to-end）测量与“语义正确性”验证；宁可慢但不错。 
---
## 目标人群与收益
- 研究者/系统工程师：可拿来作为“推理系统研究平台”，试错并量化各种 I/O/调度/量化/投机策略，观察真实的端到端性能与质量。   
- 自托管/本地部署用户：在有限的 RAM/VRAM 下运行 744B～2.8T 模型，获得近乎 SOTA 的问答/编码/多语言能力；支持 OpenAI 风格 API，可直接接进现有业务链。   
- 资源受限团队：通过本地集群复用多台机器的磁盘与 CPU，降低对昂贵的集群级 GPU 资源依赖。   
- 隐私敏感场景：模型与推理全在本地，权重不走第三方；符合数据不出域的合规要求。
---
## 竞品/同类对比（简要）
| 维度 | Colibrì | llama.cpp / GGUF | vLLM | HuggingFace TGI（原 Text Generation Inference） |
|---|---|---|---|---|
| 模型规模定位 | 极端 MoE（744B～2.8T） | 中小～超大（但多为稠密） | 中大～超大（稠密为主） | 中大～超大（稠密） |
| 内存/分层策略 | VRAM/RAM/SSD 三级统一与显式 JIT | KV cache 页面与显存管理；不支持显式磁盘流 | 显存/内存两级，不依赖磁盘流式权重 | 显存为主 |
| 运行时依赖 | 纯 C；可选 CUDA/Metal/Vulkan | C/C++；多后端 | Python+C++；CUDA/ROCm 等 | Python+后端；强依赖容器与 GPU |
| 上手难度 | 需准备大容量磁盘与一定 RAM；命令行/脚本多 | 非常成熟生态，一键拉模型 | 需要较强 GPU 与容器环境 | 需要容器与较强 GPU |
| OpenAI 兼容 API | 自带 HTTP 网关与 Dashboard | 需搭配 server/第三方代理 | 自带 | 自带 |
一句话差异：Colibrì 更像“把大模型变成分布式文件系统+C 引擎”的系统级实验；而 llc/vLLM/TGI 更偏“跑起来就快”的生产框架，但很少直接做到磁盘流式专家级调度。
---
## 局限与不足
- 存储与带宽敏感：解码经常被磁盘带宽绑定；低速盘会 fractions token/s；双 SSD、VRAM 专家层、大容量 RAM 才能显著提升体验。   
- 初次体验成本高：模型动辄 300GB+，下载与迁移耗时漫长；错误配置（如用旧 per-row int4 容器）会导致质量/行为异常，需仔细阅读模型特定的文档。   
- 工程心智负荷：多线程/异步 I/O/O_DIRECT/NUMA/CUDA 等调优 knobs 较多（ENVIRONMENT.md），小白容易迷失；调错也可能导致速度回退或兼容问题。   
- 无 SLA 速度承诺：作者明确“没有速度 SLA”，任何优化都要靠实验证明；不适合对延迟/吞吐有严格 SLA 要求且不愿调优的场景。   
- 生态尚在早期：相比 llama.cpp 的丰富生态与广泛工具链，Colibrì 的周边（如集成应用、可视化、管理界面）仍在发展中；主要依赖作者与社区驱动。 
---
## 社区活跃度与生命力（基于 README 与公开统计）
- 趋势：该项目曾在 GitHub Trending 登场，且被趋势聚合站收录，显示受关注度较高。   
- 仓库信息显示星标与 fork 量可观（主页可见星标数与被 pin 标记），且明确号召用户提供基准数据与参与实验 Issue。   
- 文档与模型阵容持续扩展：已有 DeepSeek V4 Flash、Qwen3.8-Flash-Next、Qwen3.6 等新增家族，并开放多后端支持，显示维护者仍在推进模型覆盖与硬件适配。   
- 官方还维护 Discord 与文档（benchmarks/tuning/api/cuda/vulkan/metal/ENVIRONMENT 等），体现社区交流与沉淀。 
---
## 结语与行动建议
### 终极评判
Colibrì 不是“拿来即用、无脑快”的通用推理框架，而是一套面向 MoE 与极端规模模型的“系统级实验平台 + 生产可用引擎”。它在“用更少的硬件跑更大的模型”这条路上走得相当激进，同时又坚持“语义不妥协、优化看实证”的原则，非常适合愿意折腾、有本地自托管或系统研究需求的人群。
### 行动建议（按场景）
- 如果你想在单机/小集群跑 744B～2.8T MoE、且对隐私/成本敏感：  
  - 确保有 1～2 块 NVMe（尽可能一块快盘+一块镜像）；  
  - 准备 32GB 以上 RAM（大模型更舒适）；  
  - 从 OLMoE（7GB 磁盘）或 Qwen3.6（20GB 磁盘）练手，熟悉工作流再上 GLM-5.2/5.3 或 Kimi K3。 
- 如果你是推理系统研究者：  
  - 以 docs/benchmarks.md 与 docs/tuning.md 为起点，复现基准并叠加自己的 A/B；  
  - 用 .coli_usage/.coli_kv 与 web 可视化，验证“缓存命中率 → 带宽 → 吞吐”的因果链；  
  - 尝试 NUMA/Vulkan/Metal 等后端，产出面向不同硬件的调优参数。 
- 如果你是小白/想体验：  
  - 先从“小模型+CLI”开始（OLMoE 或 Qwen3.6），用 ./coli chat 感受一下；  
  - 不要一上来就拉 1TB+ 的 Kimi K3；阅读对应模型的 README（如 glm53-flash.md / deepseek-v4.md / kimi_k3.md），避免误踩“容器不匹配”的坑。 
---
## 补充：开源协议与贡献
- 项目在仓库页明确列出了 ACKNOWLEDGEMENTS 与贡献引导，支持通过 Issue 提供基准数据、参与 Discord 讨论、赞助开发或捐赠硬件等方式贡献。具体条款与许可证内容请以仓库根目录 LICENSE 文件为准（页面底部可见致谢与支持段落）。 
---
## 实战 Demo 代码片段（可直接抄）
- TUI 快速体验（Linux/macOS，预编译包）：
  - COLI_MODEL=/nvme/glm52_i4 ./coli chat 
- 看安置计划与做健康检查：
  - COLI_MODEL=/nvme/glm52_i4 ./coli plan
  - COLI_MODEL=/nvme/glm52_i4 ./coli doctor --deep 
- 启动 OpenAI 风格 API + Web 面板：
  - ./coli web --model /nvme/glm52_i4 
- 本地集群（多机联合）启动示例：
  - coordinator：./coli cluster coordinator --host 0.0.0.0 --port 8765
  - worker：./coli cluster worker --model /nvme/glm52_i4 --port 9100 --coordinator http://COORDINATOR:8765 --advertise-host WORKER_IP
  - serve：./coli serve --model /nvme/glm52_i4 --cluster-coordinator http://127.0.0.1:8765 
- 切换不同模型（同一 CLI）：
  - make -C c glm
  - make -C c inkling
  - make -C c kimi_k3
  - COLI_MODEL=/nvme/glm52_i4 ./coli chat
  - COLI_MODEL=/nvme/inkling_i4 ./coli chat
  - COLI_MODEL=/nvme/kimi_k3 ./coli chat 
以上命令与配置路径均以 README 与文档为依据，建议结合自身机器磁盘与内存情况，再按 docs/tuning.md 微调参数以获得最佳体验。
