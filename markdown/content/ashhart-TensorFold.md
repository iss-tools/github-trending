# ashhart/TensorFold

[GitHub URL](https://github.com/ashhart/TensorFold)


## TensorFold 深度评测：字节级精确投机解码的本地 LLM 推理引擎

> 一个用 Zig 写的本地大模型推理引擎，靠'开加速但输出逐字节不变'的精确投机解码，在 Mac 和 DGX Spark 上把推理速度做到竞品的 1.6~3.1 倍。

- **Tags**: 本地推理, 投机解码, Zig, Apple Silicon, 开源项目
- **Category**: 开发工具, AI 推理, AI 编程

## Details

# TensorFold 深度评测：把"投机解码"做到字节级确定性，本地 LLM 推理的黑马还是过度宣传？
> **一句话总结**：TensorFold 是 Ash Hart 于 2026 年 9 月开源的本地 LLM 推理引擎（Apache 2.0，Zig 编写），它用"字节级精确的投机解码"把 Apple Silicon 和 DGX Spark 上的推理速度做到了 vLLM 的 1.6~3.1 倍，且输出与不开投机时逐字节一致——这是它最锋利的差异化武器，但代价是模型支持面极窄、社区尚幼、官方 benchmark 全部自报。
---
## 一、为什么值得写它？
在 llama.cpp、Ollama、vLLM、MLX 已经被讲烂的 2026 年，本地推理引擎早就是一片红海。但 TensorFold 在不到两个月内从 328 星冲到 1.4k 星，并在 NVIDIA DGX Spark 官方论坛掀起热议，原因不是它"更全面"，而是它把一件被业内默认接受的小毛病——**投机解码会改变输出**——彻底修掉了。
这对绝大多数"跑个聊天机器人"的玩家没用，但对**写代码的 agent、做金融/医疗/法律等可复现性要求高的场景**，"同样 seed 同样输出"是刚需。TensorFold 押注的就是这一刀窄而深的市场。
---
## 二、背景与痛点：为什么"快"和"对"很难兼得
### 2.1 投机解码的物理直觉
传统 LLM 推理像**单车道高速**：一次只能让一辆车（一个 token）通过。投机解码像**车队调度**：让一辆便宜的"小车"（草稿模型）先猜出 3~5 个 token，再用"大车"（主模型）一次性并行校验，猜对了就能一次通过 3~5 个 token，吞吐量翻倍。
但这里有个隐藏 bug：**大车并行校验 5 行的算术结果，和串行校验 1 行的算术结果，浮点数最后一比特可能不一样**。这意味着即使你固定了 seed、固定了 prompt、固定了温度，**开了投机之后的输出可能和不开投机的不一样**——对聊天无所谓，对要写进生产代码库的 agent 是灾难。
### 2.2 TensorFold 的解法：Row-exact + Gumbel 噪声
TensorFold 的核心创新是把它**造出来的算术差抹平**：
- **Row-exact kernels**：每个 kernel 写成"批量校验中任意一行，逐位等于单行独立计算"——这是手写 Metal/CUDA kernel 的代价。
- **确定性采样**：每个 token 用 Gumbel 噪声做 argmax，噪声种子 = `seed + position + token_id`，所以"采样"变成了可重放的纯函数。
结果是：**开投机/关投机，输出逐字节一致**，速度却快 2~3 倍。一个字面意义上的"白嫖"。
> 这个字节级一致性已经被独立研究机构 **Volatile Markets** 复核过，所以不是王婆卖瓜——这一点在"自报 benchmark"遍地的当下，比速度本身更值钱。
---
## 三、技术架构与核心亮点剖析
### 3.1 技术栈：为什么用 Zig？
TensorFold 是用 **Zig 0.17** 写成的单一原生二进制 `tensorfold-native`，**不依赖 Python、不依赖 MLX、不依赖 PyTorch**。Zig 的选择很聪明：
- **零运行时依赖**：macOS Homebrew 装完即可跑，Linux 也能在 NVIDIA 容器里裸跑；
- **跨 Metal/CUDA 双后端**：同一份代码编译到 Apple GPU 和 NVIDIA GPU，这在 Rust/C++ 生态里要写一堆 unsafe，Zig 的 comptime 让 kernel 调度更优雅；
- **可控的算术**：Zig 允许精确控制浮点累加顺序，这是 row-exact 承诺的物理基础——Python/MLX 默认做不到这一点。
> 它的姊妹项目 **MCDMA**（Metal-CUDA Direct Memory Access，201 stars）实现了 Mac ↔ NVIDIA 主机的 RDMA，这也解释了为什么 TensorFold 能让两台 DGX Spark 通过直连链路做 tensor-parallel。
### 3.2 三个最值得称道的设计
| 亮点 | 一句话解释 | 给你带来什么 |
|---|---|---|
| **字节级精确投机解码** | 开/关投机，输出逐字节相同 | Agent 可复现、A/B 测试不漂移、CI 不挂 |
| **Living Weights（实验）** | 模型在运行时把"事实"直接写进 checkpoint 文件，重启还在 | 不用 RAG 也能让模型记住"我喜欢蓝色" |
| **Context Compaction** | 上下文超窗时，自动把旧轮次压缩成结构化"记忆笔记" | 8k 模型跑 30k 对话，不会丢系统提示词 |
| **Prompt Cache 持久化** | 系统提示词的 KV 缓存写到磁盘，跨重启复用 | Agent 二次提问 TTFT 从几秒降到 <100ms |
**Living Weights** 是最出格也最有趣的功能——它绕过了 RAG 和 LoRA，把"事实"当作可写回 checkpoint 的数据。原理像是某种"模型内自编辑"，在 `tensorfold serve --slide` 后调用 `/v1/slide/learn`，模型自己抽 features、写权重，还能在 3D 网页里看到每个事实占用了哪些神经元。这不是玩具——它改写文件、不可撤销，所以 README 反复提醒"always teach a copy"。
**Context Compaction** 解决的痛点几乎每个 agent 开发者都遇到过：当对话超出窗口时，OpenAI 兼容服务只会 `400` 报错。TensorFold 的做法是保留系统提示词 + 最近 N 轮逐字不删，更早的轮次自动归纳成"目标/约束/进展/决策/下一步"的结构化笔记，下次继续滚动更新这个笔记，且压缩本身也确定性可复现。
### 3.3 Demo：从 0 到第一个 200 tok/s
**Step 1 安装（macOS）**：
```bash
brew install ashhart/tensorfold/tensorfold
tensorfold --version
```
**Step 2 拉模型并启动**：
```bash
tensorfold pull TensorFold/NVIDIA-Nemotron-3.5-Living-30B-A3B-MLX-4bit
tensorfold serve "$HOME/models/nemotron-lightning" \
  --name local-model --parallel 1 --context 8192 \
  --temperature 0 --no-thinking
```
**Step 3 curl 调用（任意 OpenAI 客户端兼容）**：
```bash
curl -fsS http://127.0.0.1:8080/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"local-model","messages":[{"role":"user","content":"Say hello."}],"max_tokens":128,"temperature":0}'
```
**Step 4 在 Python 里验证字节级一致性（最杀手级的实验）**：
```python
from openai import OpenAI
client = OpenAI(base_url="http://127.0.0.1:8080/v1", api_key="dummy")
payload = dict(model="local-model",
               messages=[{"role":"user","content":"写一段快排"}],
               temperature=0, seed=42, max_tokens=512)
no_draft   = client.chat.completions.create(**payload, extra_body={"draft": False}).choices[0].message.content
with_draft = client.chat.completions.create(**payload).choices[0].message.content
print(no_draft == with_draft)   # True → 字节级一致
```
这一段能跑通，你就直接体验到了 llama.cpp/Ollama/vLLM 都给不了的"白嫖加速"。
---
## 四、性能实测：自报 vs 第三方
### 4.1 官方自报数据（仅供参考）
| 场景 | TensorFold | 对比对象 | 加速 |
|---|---|---|---|
| M5 Max 128GB · Nemotron 30B-A3B 4-bit decode | 188–206 tok/s | mlx_lm 138 tok/s | ~1.4x |
| M5 Max · Qwen3.8-27B + DFlash2（代码） | 189 tok/s | 无投机 26 tok/s | ~7x |
| DGX Spark · Qwen3.8-27B chat | 45.8 tok/s | vLLM 15.0 tok/s | 3.1x |
| 2× DGX Spark · Flash Next code | 103.8 tok/s | vLLM 46.4 tok/s | 2.2x |
| DGX Spark vs vLLM (MTP=3) 整体 | — | — | **1.6–3.1x** |
### 4.2 独立用户实测（NVIDIA 论坛，techguard，2026-10）
第三方用户跑 GLM-5.3-Flash 的对比更接地气：
| 任务 | vLLM | TensorFold | 加速 |
|---|---|---|---|
| 代码 | 43.9 tok/s | 58.7 | 1.34x |
| 散文 | 26.7 tok/s | 45.3 | 1.70x |
| JSON 输出 | 28.3 tok/s | 79.6 | **2.81x** |
| 文件编辑 | 25.5 tok/s | 81.6 | **3.20x** |
| Prefill | 1000–1500 tok/s | 1600–1850 | — |
| **冷启动加载** | **8–10 min** | **85 秒** | **~6x** |
注意**规律**：内容越"重复"（JSON、代码、文件编辑），投机解码命中率越高，加速越猛；纯散文只有 ~1.7x。如果你跑的是 agent（满屏 JSON 和 diff），这就是天选引擎。
也有用户反映 Qwen3.8 Flash Next 在多模态（带图）请求下 TTFT 抖到 5–10s，偶发输出劣化——说明模型-recipe 适配仍不成熟。
---
## 五、目标人群与收益
| 你是谁 | 该不该用 | 能拿到什么 |
|---|---|---|
| Apple Silicon (M1–M5) 用户 + 写 agent | ✅ 强烈推荐 | 比 Ollama/llama.cpp 快 1.5–3x，输出可复现 |
| 拥有 1–2 台 DGX Spark 的开发者 | ✅ 强烈推荐 | 几乎是当前 Spark 上最快的引擎，加载快 6 倍 |
| Mac Studio / RTX 3090/5090 工作站 | ✅ 值得试 | 性能显著高于 mlx_lm |
| 数据中心 A100/H100/TPU 生产部署 | ❌ 用 vLLM | TF 不支持 A100，且并发架构不如 vLLM |
| 想跑 Llama、Mistral、Gemma-2 等长尾模型 | ❌ 用 llama.cpp | TF 直接拒绝不支持的权重格式 |
| 要 AWQ/GPTQ 极致量化 | ❌ 用 vLLM | TF 拒绝这些格式 |
| 想做模型微调 / 研究 | ⚠️ 看需求 | TF 是推理引擎，不是训练工具 |
一句话：**这是为"agent 在本地跑"这种具体工作流量身定做的工具，不是通用 LLM 服务器**。
---
## 六、竞品对比
| 维度 | **TensorFold** | vLLM | llama.cpp | Ollama | MLX (mlx_lm) |
|---|---|---|---|---|---|
| 主要平台 | Apple Silicon + CUDA + Vulkan(实验) | NVIDIA/AMD/TPU 数据中心 | 全平台 | 全平台 | Apple Silicon |
| 模型广度 | 4–7 个 family，**白名单制** | 数十个架构 | 数十个 | 数十个 | 十余个 |
| 投机解码 | ✅ 字节级精确 | ✅ 标准随机 | ⚠️ 有限 | ❌ | ✅ |
| 并发能力 | 共享 lane rounds，单 stream 主推 | ✅ 强 | ✅ | 一般 | 一般 |
| 加载速度 | **秒级** | 分钟级 | 分钟级 | 分钟级 | 分钟级 |
| License | Apache-2.0 | Apache-2.0 | MIT | MIT | MIT |
| 成熟度 | <3 月 | 多年 | 多年 | 多年 | 多年 |
| 部署难度 | Homebrew 一行 | pip+GPU 驱动 | 编译/下载 | 一行 | pip |
核心取舍很清晰：**TensorFold 拿"模型广度"换"单模型深度"**。vLLM 是瑞士军刀，TensorFold 是手术刀——只在它支持的几个模型上，它跑得最快、最可复现。
---
## 七、局限与不足（必须直说）
1. **模型白名单极窄**：截至 1.0.7 只认证了 6 个模型族（Nemotron 3.5 Lightning、Qwen3.8 Flash Next、GLM-5.3-Flash、Qwen3.5-2B、Qwen3.8-27B、Qwen3.6-35B 等）。`tensorfold pull` 会直接拒绝下载不被支持的 repo。
2. **自报 benchmark 占多数**：DGX Spark 那 1.6–3.1x 是官方测的，独立第三方虽有技术guard 佐证，但规模远不及 MLPerf 级别的严格测试。
3. **单一主维护者 + bus factor**：Ash Hart 是核心作者，MiaAI-Lab 和 Volatile Markets 是后来加入的核心团队。项目 2 个月内发了 20+ 个版本（0.2.0 → 1.0.7 → 1.2.5），节奏激进也意味着 API 可能频繁变动。
4. **MLX 版本敏感**：在 M5 上，MLX 0.32.2 会让 Nemotron 的精确性检查失败，自动 fallback 到无投机模式（输出一致但变慢）。官方建议 pin 在 mlx 0.31.2。
5. **Prompt processing 比 mlx_lm 慢**：M3 Ultra 上从 8k 到 30k token 的 prefill 速度大约是 mlx_lm 的一半，对超长上下文 agent 场景这是个隐性税。
6. **Qwen3.8-27B 没有 --drafter 时反而比 mlx_lm 慢**：DFlash2 drafter 是 27B 的命根子，忘了带就翻车。
7. **Living Weights 不可逆**：会把"学到的事实"写回 checkpoint 文件，没有撤销命令，必须 copy 一份再教。
8. **Vulkan 仅在 roadmap**：README 标题写了 Vulkan，但目前实质可用的是 Metal 和 CUDA 两套。
---
## 八、结语与行动建议
TensorFold 是那种**让人眼前一亮的"窄而深"项目**：它没有去卷 llama.cpp 的"什么都跑"，也没有去卷 vLLM 的"什么都并发"，而是死磕一个所有人都默认接受的痛点——"投机解码会改变输出"——然后用 row-exact kernel + 确定性采样把这件事做到字节级。
**给你的判断框架**：
- **如果你的工作流是**"在 Mac 或 DGX Spark 上跑一个 agent 框架（Cline / aider / Claude Code / 自研 agent）写代码" → **立刻装上试**，它带来的速度提升和输出确定性是真正能改变你日常体验的。
- **如果你的需求是**"跑各种花式开源模型尝鲜" → **跳过**，llama.cpp/Ollama 的广度更适合你。
- **如果是生产环境** → 等 3~6 个月，看并发稳定性、生态和第三方 benchmark 是否成熟。
**三个立即可以做的动作**：
1. `brew install ashhart/tensorfold/tensorfold`，10 分钟跑通 Nemotron Lightning；
2. 用上面"Step 4"那段 Python 验证字节级一致性——这是最直观感受它差异化价值的方法；
3. 把你 agent 框架的 `base_url` 指向 `127.0.0.1:8080/v1`，对比原来 Ollama/vLLM 的速度和输出差异。
**最终评分（主观）**：创新性 9/10，工程质量 8/10，文档完整度 8/10，模型广度 4/10，社区成熟度 5/10，**综合 7.5/10**——一颗正在快速升起的、值得持续关注的新星。
> 仓库地址：<https://github.com/ashhart/TensorFold>｜作者主页：<https://github.com/ashhart>｜HuggingFace：<https://huggingface.co/TensorFold>
