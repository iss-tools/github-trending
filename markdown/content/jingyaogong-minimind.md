# jingyaogong/minimind

[GitHub URL](https://github.com/jingyaogong/minimind)


## MiniMind：从零训练的微型 LLM 全栈教程与框架

> 个人可从零训练的微型大模型，覆盖数据到部署全流程。

- **Tags**: LLM, 小模型, PyTorch, 教学, 大模型训练
- **Category**: 开源项目, AI 模型, 开发工具

## Details

# 一句话总结
MiniMind 是一个“从零训练小模型”的全栈开源工程——用约 64M 参数、在单张 RTX 3090 上 2 小时内、约 3 元电费即可完成训练，覆盖从 Tokenizer、预训练（Pretrain）、指令微调（SFT）、LoRA、DPO、RLAIF（PPO/GRPO/CISPO）到 Agentic RL 与 Tool Calling 的完整链路；既是可直接部署/二次开发的微型 LLM，更是“边做边学”的透明教程。 
---
## 背景与痛点
- “想训练模型，却难在第一步”：动辄百亿参数的模型让个人开发者无从下手，训练成本高、周期长、基础设施复杂。主流框架高度封装（transformers/trl/peft），会“跑起来”但看不透“里面发生了什么”。
- 教材割裂，缺乏端到端示例：很多课程只讲推理或只讲微调，很少有人把“数据—Tokenizer—预训练—SFT—对齐—部署”一整套串起来，且用原生 PyTorch 逐行实现。
- 小模型“缺失”：社区不乏 7B/13B 的开源模型，但真正轻量到在个人 GPU 上能“从零训练”的少之又少。MiniMind 以 64M（Dense）与 198M/64A（MoE）的极小体量，填补了“个人能动手训、能改、能懂”的空白。
---
## 核心亮点与功能剖析
### 1) 全栈式“从零到聊天”的透明实现
- 数据与 Tokenizer：项目配套开源自训练 Tokenizer（BPE+ByteLevel）与训练脚本，提供预训练/SFT/RLAIF 数据集（jsonl 格式，拿来即用），支持从数据清洗、去重到格式规范的完整处理流程。
- 训练管线：单脚本完成各阶段训练（train_pretrain.py / train_full_sft.py / train_dpo.py / train_agent.py 等），支持断点续训（--from_resume 1）、跨 GPU 数量恢复、wandb/SwanLab 可视化，适应单卡与多卡（DDP/DeepSpeed）。
- 不“黑箱”：核心算法全部用原生 PyTorch 手写，包括 LoRA、DPO、PPO/GRPO/CISPO、YaRN 长文本外推等，代码可读、可改、可教学。适合做课程、实验或内部培训素材。
### 2) 极简架构与对齐生态（MiniMind-3 / MiniMind-3-MoE）
- 结构：Dense 版采用 Transformer Decoder-only，Pre-Norm + RMSNorm + SwiGLU + RoPE（max_position_embeddings=32768，rope_theta=1e6）；GQA（q_heads=8、kv_heads=4）降低推理 KV Cache 占用。整体架构对齐 Qwen3，便于后续迁移到 transformers/llama.cpp/ollama/vllm。 
- MoE：minimind-3-moe 提供混合专家变体，默认 4 experts/top-1 路由，以更多参数换取更高容量。作者在 README 中坦诚了训练时的 kernel 开销现实与“4 experts/top-1 甜点配置”的取舍，保持原生 PyTorch 的普适性。 
- 自适应思考与 Tool Calling：支持“思考链”与工具调用标签（/ 等），并可开关思考输出；服务端与 demo 支持 reasoning_content/open_thinking 等字段，便于接入 UI 或业务系统。 
### 3) 即插即用的推理生态与兼容性
- HuggingFace Transformers 格式权重：可直接在 transformers 生态中加载与调用；官方提供模型转换脚本（torch2transformers）。
- 第三方引擎：兼容 vLLM（OpenAI 协议 API）、llama.cpp（转换到 GGUF、量化）、Ollama（一键运行）、SGLang 等，方便在生产/边缘设备做低延迟部署。 
- OpenAI API 服务：scripts/serve_openai_api.py 提供兼容 OpenAI 的聊天接口，可无缝接入 FastGPT、Open-WebUI、Dify 等上游 UI，支持流式与思考字段。 
- Web Demo：基于 Streamlit 的极简聊天 UI（scripts/web_demo.py），支持思考展示与多轮工具调用，适合快速交互与演示。 
### 4) 强化学习与 Agentic RL 的教学级实现
- RLAIF：原生实现 PPO、GRPO、SPO（以及 CISPO 等变体），并提供 rlaif-mini 数据集与训练曲线对比说明，帮助理解策略优化/奖励建模与 rollout 过程。
- Agentic RL：train_agent.py 支持多轮 Tool-Use 场景下的 GRPO/CISPO，且 rollout engine 解耦，可切换不同推理后端，做智能体式对话与工具编排的实验。 
- 学习价值：用小模型演练 RLHF/RLAIF 流程成本低、反馈快，非常适合作教学或个人研究“什么是偏好对齐”和“工具调用如何与策略学习结合”的实验台。
### 5) 多模态与家族扩展（生态联动）
- MiniMind-V（视觉语言模型）：同作者下提供视觉能力拓展（minimind-v 仓库），并在主 README 中给出入口，方便想做图文多模态的开发者延续学习路线。 
- MiniMind-O（Omni 模型）：文本/图像/语音输入、文本与流式语音输出的小规模端到端 Omni 模型项目（minimind-o），技术报告在 arXiv 可查，形成“小而全”的模型家族矩阵。 
---
## 目标人群与收益
- 想亲手“从零训练”的学生与工程师：在个人 GPU 上跑通 Pretrain→SFT→对齐→部署全链路，把抽象的论文/技术要点转化为可调试的代码，极大降低入门门槛。 
- 教学与培训组织：代码透明、注释清晰，提供从数据到评测的完整材料，可作为“LLM 实战课”的实验平台。 
- 需要在边缘/本地部署的团队：模型体量小（~0.5–1GB 显存），支持多种推理后端，便于内网离线部署与定制微调（私有领域知识注入、自我认知样例）。 
- 算法研究员/爱好者：小模型成本低，可快速验证想法（YaRN 外推、新 RL 算法、MoE 负载均衡、线性注意力等），项目仓库的 Discussions 中已有相关实验讨论。 
---
## 竞品/同类对比
- 与 Hugging Face Transformers + TRL+PEFT 流派：主流生态上手快、模型多，但封装厚，难以看清底层；MiniMind 强调“原生实现、每一行可见”，更适合教学与理解，同时仍可导出 HF 权重与生态互通。 
- 与 llm.c / nanoGPT 等纯极简实现：这些项目更“极客”，极度精简但缺少 SFT/RLHF/部署等完整链路；MiniMind 在保持简洁的前提下，补齐了“训练—对齐—服务”的完整工程视角。 
- 与 LoRA 微调大模型路线：LoRA 侧重“省钱做适配”，但仍是“站在大模型肩膀上”；MiniMind 提供的是“从零训基座”的完整体验，两者互补而非互斥。社区文章也常将两者对比讨论。 
- 与同量级教学型小模型：MiniMind 的全流程覆盖（含 MoE、RLAIF、Tool Calling、API 服务器与多后端兼容）在同类项目中非常突出，且更新频繁，已进入 v3（MiniMind-3）。 
---
## 局限与不足
- 能力边界：64M 量级的模型适合完成简单对话与有限域问答，但复杂推理、长上下文、专业领域知识的准确度有限。官方也建议将其作为学习/实验起点，生产环境更推荐结合检索或迁移到更大的基座。 
- 性能基准：社区测评表明，在 C-Eval 等榜单上 MiniMind 2-small（26M）SFT/RLHF 版本得分在 45–49% 区间，较“日常可用”有距离，但在该体量下属合理表现。 
- 硬件门槛：虽说“2 小时/3 元”的基准基于 RTX 3090，若在更低算力的设备上运行，训练时长与收敛情况需自行调参；对纯 CPU 或 Apple Silicon 用户则需要耐心与兼容性测试。 
- 生态整合成本：若想深度改造架构（如更换 Attention 实现/底层算子），需要一定的 CUDA/Triton 经验；MoE 训练时的 kernel 开销在原生 PyTorch 下仍需取舍。 
- 旧模型兼容性：2025-04-26 的重大更新为对齐主流推理生态调整了权重结构与词表，不再直接加载更早的 v1 模型，存量用户需迁移或重新训练。 
---
## 上手门槛与部署体验（含 Demo）
- 环境准备：需要 Python 3.10+、CUDA 12.x/PyTorch（按官方命令验证可用性）。仓库提供 requirements.txt，国内可用镜像加速安装。 
- 快速推理（示例）：以 HuggingFace Transformers 格式模型为例（已准备 minimind-3 目录）：
```bash
# 克隆与安装
git clone --depth 1 https://github.com/jingyaogong/minimind
cd minimind && pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple
# 下载模型（任选其一）
modelscope download --model gongjy/minimind-3 --local_dir ./minimind-3
# 或 git clone https://huggingface.co/jingjyao/minimind-3
# CLI 推理
python eval_llm.py --load_from ./minimind-3
```
- Web Demo（可选）：安装 streamlit 后，将模型目录复制到 scripts 下再启动。 
```bash
cp -r minimind-3 ./scripts/minimind-3
cd scripts && streamlit run web_demo.py
```
- 第三方引擎举例（vLLM）：
```bash
vllm serve /path/to/model --model-impl transformers --served-model-name "minimind" --port 8998
```
- API 服务示例：启动 OpenAI 兼容服务后，即可用 curl 或客户端调用：
```bash
cd scripts && python serve_openai_api.py
# 测试
curl http://localhost:8998/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "minimind-3",
    "messages": [{"role": "user", "content": "世界上最高的山是什么？"}],
    "temperature": 0.7,
    "max_tokens": 1024,
    "stream": true,
    "open_thinking": true
  }'
```
- 一键部署（社区方案）：社区提供基于 Docker 的一键部署（UI+API+MCP），适合不想折腾本地环境的快速体验者（需注意该仓库为第三方维护）。 
---
## 社区活跃度与生命力
- Star/Fork：GitHub 主仓库星标约 5.5 万级、Fork 约 7.2k，属于教学/小模型领域头部项目。 
- 更新节奏：README 与项目站点持续更新，v3（MiniMind-3/3-MoE）于 2026 年 4 月发布，更新涵盖架构对齐、RLAIF、Adaptive Thinking、API 与文档重写等，显示维护非常活跃。 
- 讨论与生态：GitHub Discussions 有 polls/实验分享等板块，HuggingFace 上提供模型集合与数据集，ModelScope 上也提供在线体验与模型托管，形成较完整的信息矩阵。 
- 第三方内容：社区博客与平台文章系统介绍了 MiniMind 的训练、测评与部署实践，包括 C-Eval/CMMLU 等基准评测与本地体验，进一步降低了上手难度。 
---
## 技术栈与架构解析
- 框架：原生 PyTorch（无高阶抽象），算法自实现；兼容 transformers、trl、peft 等主流库；训练支持单机单卡/多卡（DDP/DeepSpeed），支持 wandb/SwanLab 可视化。 
- 结构：Transformer Decoder-only（Dense/MoE），RMSNorm、SwiGLU、RoPE+YaRN、GQA；配置可调（层数、隐藏维度、头数等），适合做“教学沙盒”或架构实验。 
- 分词与数据：自训练 Tokenizer（BPE+ByteLevel），预留 buffer token 以扩展（工具/思考等）；数据集统一为 jsonl，提供多套推荐组合（mini/完整）。 
---
## 开发者体验（DX）与避坑指南
- DX：README 中更新日志、训练命令与模型列表清晰，提供多阶段数据与训练脚本组合建议，代码结构与变量命名趋向规范化。 
- 集成成本：模型权重已提供 HF 格式，可按需转换为 GGUF/部署到 vLLM/Ollama；官方脚本 serve_openai_api.py 让接入现有 UI 工具链成本很低。 
- 常见坑点（社区反馈）：初次训练若仅跑 1 epoch，效果会明显偏弱；建议按 README 推荐组合进行多阶段训练（pretrain_t2t + sft_t2t + rlaif/agent_rl）。旧模型在新版本下无法直接加载，需按迁移指引处理。 
---
## 开源协议与可用性
- 协议：Apache-2.0，可商用与二次开发。 
- 模型下载：官方在 HuggingFace 与 ModelScope 提供多系列模型权重与数据集，便于全球与国内用户镜像获取。 
---
## 结语与行动建议
- 如果你正在寻找一个“既能用、又能学、能改、能跑完全链路”的小模型框架，MiniMind 是目前极少数兼顾教学透明度与工程可用性的选择。无论你是学生、讲师、工程师还是研究员，都可以把它当作实验台与教材，用真实代码把 LLM 训练的抽象知识“捏在手里”。 
- 实操建议：先按 README 的“快速开始”跑通推理与 Web Demo，再走一遍预训练与 SFT；有余力则尝试 DPO/RLAIF 与 Tool Calling；最后按需求接入 vLLM/llama.cpp 或部署到内网 API。迭代中注意记录不同数据组合/超参对结果的影响，小成本试错、快速积累经验。 
- 理性预期：MiniMind 的定位是“小而全、学以致用”，在 64M 量级上做到“流畅对话 + 基础推理 + 可服务化”已属可贵；若追求极致精度或复杂任务能力，还需结合检索、蒸馏或迁移到更大基座。 
一句话收尾：想真正“看懂并亲手跑出”一个 LLM，从 MiniMind 开始是成本最低、路径最直的一条路。
