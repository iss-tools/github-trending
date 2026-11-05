# microsoft/VibeVoice

[GitHub URL](https://github.com/microsoft/VibeVoice)


## Microsoft VibeVoice 深度评测：从开源顶流到“被自己下架”的语音 AI 传奇

> 微软开源的语音全栈模型家族，TTS 因滥用风险被官方撤码、靠社区续命，ASR 仍在活跃迭代，至今是开源长对话语音的唯一孤本。

- **Tags**: TTS 语音合成, ASR 语音识别, 微软研究院, ICLR 2026 Oral, 长对话语音
- **Category**: 开源项目, AI 语音, 开发工具

## Details

# Microsoft VibeVoice 深度评测：从开源顶流到"被自己下架"的语音 AI 传奇
> **一句话总结**：VibeVoice 是微软研究院开源的"语音全栈"模型家族，用一套 7.5 Hz 连续语音 Tokenizer + Next-Token Diffusion 架构，把 90 分钟多人对话级 TTS 和 60 分钟单遍长音频 ASR 一次性塞进了开源世界——它至今仍是开源语音赛道在"长对话"维度上唯一的孤本，但其 TTS 主仓库已因滥用风险被微软主动撤码，如今是一个"官方只剩 ASR、TTS 靠社区续命"的奇特生态。
---
## 一、背景与痛点：为什么"长对话"是语音 AI 的珠峰
在 VibeVoice 出现之前，开源语音模型有一个几乎无人攻克的死穴——**长度**。
传统 TTS 的困境可以用一个比喻来理解：想象你让一个配音演员朗读一本小说，但他每次只能记住 30 秒的台词，念完一段就失忆。结果就是：
- **拼接式方案**：把 90 分钟脚本切成 180 段，每段独立合成再缝合——音色漂移、语调断裂、没有真实的对话节奏。
- **长上下文方案**：硬塞进模型——显存爆炸、算力不可承受、生成到第 5 分钟就开始"幽灵音节"。
Whisper 时代的 ASR 也有镜像问题：它把音频切成 30 秒的碎片，结果一小时的会议录音里，"Speaker A"在第 13 分钟被识别成"Speaker B"，说话人分离和全局语义全乱套。
**VibeVoice 的诞生就是冲着这两个"不可能"来的**：2025 年 8 月 25 日，微软研究院放出 VibeVoice-TTS，宣称能在 64K 上下文里一次性合成 90 分钟、最多 4 个说话人的播客级音频。这个项目后来被 **ICLR 2026 接收为 Oral**——机器学习顶会最严苛的档位之一。
---
## 二、技术剖析：7.5 Hz 是什么魔法？
VibeVoice 的全部魔法，浓缩在两个数字里：**7.5 Hz** 和 **Next-Token Diffusion**。
### 1. 超低帧率连续语音 Tokenizer：把音频"压"进 LLM 的世界
一句话理解：**它是把音频从"每秒 24000 个采样点"压缩到"每秒 7.5 个 token"的翻译官。**
VibeVoice 用了两套并行的 VAE Tokenizer：
| 组件 | 作用 | 关键设计 |
|------|------|----------|
| **Acoustic Tokenizer** | 保留音色、语调、情感细节 | σ-VAE 架构 + 7 层层级编解码器 + 1D 因果卷积，约 340M 参数 |
| **Semantic Tokenizer** | 保留"说了什么"的语义 | 用 ASR 任务做代理训练，保证压缩后语义不丢失 |
为什么是 7.5 Hz？这是 **3200 倍压缩率**的产物——相比传统语音编解码器 Encodec 还能再压 **80 倍**。在 7.5 Hz 帧率下，1 小时音频 ≈ 27,000 个 token，刚好塞进 64K 上下文；而且"语音 token : 文本 token ≈ 2:1"，这意味着 LLM 可以用读文字的方式"读"音频。
### 2. Next-Token Diffusion：让 LLM 既会写诗又会唱歌
如果 7.5 Hz 是"翻译官"，Next-Token Diffusion 就是"指挥家"。
VibeVoice 用 **Qwen2.5 作为 LLM 骨干**，负责理解文本、对话节奏、说话人轮转；当模型决定"该发声了"，它不再输出离散 token，而是通过一个 **4 层扩散头**在连续潜空间里"去噪"生成语音向量。整个流程像这样：
```
Text + 参考音色 → Qwen2.5 LLM → Diffusion Head → Acoustic Decoder → 语音
                     ↑                                ↓
                     └── Semantic Encoder 反馈闭环 ──┘
```
这个**反馈闭环**是 VibeVoice 能保持 90 分钟一致性的关键——每生成一段音频，就编码回 LLM 作为下一轮上下文，相当于"配音演员边演边回听自己之前说了什么"。
### 3. 训练策略：从 4K 到 64K 的" curriculum learning"
VibeVoice 采用课程式训练（4K → 64K token 渐进增长），Tokenizer 冻结，**LLM 和扩散头端到端联合训练**——这让扩散头能学到专门适配 Qwen 隐空间表征的条件策略，而不是两个模块各自为政。
### 4. 性能账本：把 commercial 模型按在地上摩擦
技术报告给出的对比数据（24 位人类标注员、8 段长对话）：
| 模型 | 综合主观分 /5 | WER | 最长生成 |
|------|--------------|-----|---------|
| **VibeVoice-7B** | **3.76** | **1.29%** | **5000+ 秒** |
| Gemini 2.5 Pro TTS | 3.66 | 1.73% | <100 秒 |
| ElevenLabs V3 Alpha | 3.40 | — | <100 秒 |
| SesameAILabs-CSM | 2.89 | — | — |
注意最后一列——**竞品只能生成不到 100 秒，VibeVoice 能生成 5000+ 秒（约 83 分钟）**，并且分数还最高。
---
## 三、模型家族全景：从 TTS 灾难退场到 ASR 接棒
VibeVoice 这个 GitHub 仓库历经戏剧性变迁，如今是一个"三代同堂"的家族。为您梳理完整的模型矩阵：
| 模型 | 参数量 | 能力 | 状态 | 显存需求 |
|------|--------|------|------|----------|
| **VibeVoice-TTS-1.5B** | 1.5B (LLM 骨干) / 3B (全模型) | 90 分钟、4 说话人、64K 上下文 | ✅ 官方 HF 在线（75K+ 月下载） | ~6GB（8GB 卡可跑） |
| **VibeVoice-TTS-Large (7B)** | 7B / 9B | 45 分钟、4 说话人、32K 上下文、音质更强 | ⚠️ 官方已撤，靠社区镜像（aoi-ot/VibeVoice-Large 等） | ~20GB（Q8 ~12GB / Q4 ~8GB） |
| **VibeVoice-Realtime-0.5B** | 0.5B | 流式 TTS、首包延迟 ~300ms、单说话人、~10 分钟 | ✅ 官方在 | 消费级 GPU 即可 |
| **VibeVoice-ASR-7B** | ~9B | 60 分钟单遍、Who/When/What、50+ 语言、自定义热词 | ✅ 官方 + HF Transformers + vLLM | 类比 7B TTS |
| **VibeVoice-ASR-Streaming-1.5B** | 1.5B | 流式识别，音频边到边转写 | ✅ 官方（2026.09） | ~6GB |
| **VibeVoice-ASR-BitNet** | 量化版 | CPU 实时推理、1.58GB、3 线程 RTF<1、比 Whisper.cpp 快 1.6-2.3× | ✅ 官方（2026.07） | **纯 CPU，无 GPU** |
*（数据综合自官方 README、Hugging Face 模型卡、ComfyUI 节点文档）*
### 那场著名的"下架事件"
2025 年 9 月 5 日，VibeVoice 仓库 README 突然多了一段：
> "After release, we discovered instances where the tool was used in ways inconsistent with the stated intent. Since responsible use of AI is one of Microsoft's guiding principles, we have removed the VibeVoice-TTS code from this repository."
原因是有人用它做 deepfake 和未授权声音克隆。微软**只撤了 TTS 的代码和 7B 权重**，但 MIT 协议没改，所以社区 fork `vibevoice-community/VibeVoice` 完整保留了代码与 Git 历史，HF 镜像也接住了权重。
这个事件的后果是：**今天你打开 microsoft/VibeVoice，看到的是 ASR + Realtime TTS 的故事；而"最初的传奇"——90 分钟多人播客合成，要去 community fork 里找。**
---
## 四、上手指南：三行代码跑通 ASR，十分钟跑通 TTS
### 路径 A：ASR（最简单，直接用官方 Transformers）
2026 年 3 月起，VibeVoice-ASR 已合入 HuggingFace Transformers 主线，pip 装完就能用：
```python
from transformers import AutoProcessor, VibeVoiceAsrForConditionalGeneration
model_id = "microsoft/VibeVoice-ASR-HF"
processor = AutoProcessor.from_pretrained(model_id)
model = VibeVoiceAsrForConditionalGeneration.from_pretrained(
    model_id, device_map="auto"
)
# 一行传入音频（支持本地路径或 URL）
inputs = processor.apply_transcription_request(
    audio="your_meeting.wav",
    # context="本项目代号 Aurora，团队成员：张三、李四、Alice"  # ← 自定义热词
).to(model.device, model.dtype)
output_ids = model.generate(**inputs)
transcription = processor.decode(output_ids[:, inputs["input_ids"].shape[1]:])[0]
print(transcription)
```
输出的就是结构化的 `Speaker / Timestamp / Content` 三元组，可以直接喂给下游做会议纪要。
**冷知识**：`context` 参数就是那个杀手级功能 **Customized Hotwords**——把产品代号、人名、行业术语直接塞进去，无需微调就能显著提升识别准确率，对法律、医疗、技术团队尤其关键。
### 路径 B：TTS（需要走社区 fork）
```bash
# 1. 装社区 fork（官方 TTS 代码已撤）
git clone https://github.com/vibevoice-community/VibeVoice.git
cd VibeVoice && pip install -e .
# 2. 一行命令生成双人播客
python demo/inference_from_file.py \
  --model_path vibevoice/VibeVoice-1.5B \
  --txt_path demo/text_examples/2p_music.txt \
  --speaker_names Alice Frank
```
脚本格式就是纯文本，一行一个说话人：
```
Speaker 1: Hey, remember "See You Again"?
Speaker 2: Yeah… from Furious 7, right? That song always hits deep.
```
**三个能救命的小贴士**（来自官方 FAQ）：
- **没有 text normalization**——"$25"老老实实写成 "twenty-five dollars"。
- **标点就是导演指令**——省略号、破折号、感叹号会真实影响节奏。
- **参考音色会"污染"输出**——克隆音频里有 BGM，生成结果大概率也带 BGM。
### 路径 C：ComfyUI（最舒服的可视化路线）
装 `Enemyx-net/VibeVoice-ComfyUI` 节点（1520+ stars，2026 年 2 月仍在更新），把模型丢进 `ComfyUI/models/vibevoice/`，拖节点就能玩。
### 路径 D：纯 CPU 推理（VibeVoice-ASR-BitNet / vibevoice.cpp）
2026 年 7 月发布的 BitNet 版把 ASR 压到 **1.58GB**，3 个 CPU 线程就能跑实时（RTF<1），比 Whisper.cpp 快 1.6-2.3 倍。社区还有 `localai-org/vibevoice.cpp` 在 ggml 上同时支持 TTS 和 ASR 的 C++ 推理。
---
## 五、目标人群：谁该马上关注，谁该绕路
**强烈建议入坑：**
| 人群 | 收益 |
|------|------|
| **播客 / 有声书创作者** | 90 分钟 4 人对话一次成型，省掉传统拼接工作流；1.5B 一张 8GB 卡就能本地跑，零 API 成本 |
| **做会议纪要 / 访谈研究的团队** | ASR 单遍 60 分钟 + 说话人分离 + 时间戳 + 热词，对法律、医疗、技术访谈是降维打击 |
| **AI Agent / 实时语音助手开发者** | Realtime-0.5B 首包 300ms、流式文本输入，专为对话式 AI 设计 |
| **边缘设备 / 本地化部署工程师** | BitNet 版 1.58GB 纯 CPU 实时，ARM NEON 都支持 |
| **语音研究者** | ICLR 2026 Oral 的工程化实现 + LoRA 微调代码 + vLLM 推理，是研究 next-token diffusion 在语音上应用的最好样本 |
**建议绕路或谨慎评估：**
- 想要"开箱即用商用产品"——微软自己都写在 model card 里："**We do not recommend using VibeVoice in commercial or real-world applications without further testing and development**"
- 主要做非中英语种——README 写"多语言"，但真实主力只有中英，跨语言是"涌现的不稳定能力"
- 没有版权合规意识——TTS 滥用就是它被下架的原因
---
## 六、竞品对比：开源语音赛道的"生态位战争"
| 模型 | 长对话多说话人 | 单音色叙事 | 零样本克隆 | 实时性 | 显存门槛 | 适用场景 |
|------|--------------|----------|-----------|--------|---------|---------|
| **VibeVoice-1.5B/7B** | ⭐⭐⭐⭐⭐ 唯一 | ⭐⭐⭐ | ⭐⭐⭐ | ❌ 离线 | 6-20GB | 播客、有声剧 |
| **Kokoro (82M)** | ❌ | ⭐⭐⭐⭐⭐ | ❌ | ✅ 极快 | 几乎无 | 旁白、视频配音 |
| **Chatterbox (Resemble AI)** | ❌ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ | 低 | 短语音克隆 |
| **F5-TTS** | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ RTF<0.15 | 中 | 中英双语克隆 |
| **CosyVoice 2 (0.5B)** | 部分 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ TTFT 150ms | 低 | 流式助手 |
| **ElevenLabs V3** | 部分 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ 商用 API | 云端 | 商业级 |
**核心结论**：**VibeVoice 不是"最好的 TTS"，它是"这个细分品类里唯一的选择"**。一年过去，开源世界依然没有第二个能做 90 分钟多人一致对话的模型。如果你的需求就是"播客级长对话合成"，它无可替代；如果是"短克隆、快旁白"，Kokoro 和 F5-TTS 性价比更高。
---
## 七、局限与风险：把它当"研究样例"而不是"生产工具"
这部分必须写得毫不避讳，因为 VibeVoice 的"坑"非常具体：
### 1. 供应链风险：7B 模型住在"借来的地基"上
微软已经撤码，7B 权重靠 `aoi-ot/VibeVoice-Large`、`vibevoice/VibeVoice-7B` 等社区镜像分发。**镜像随时可能消失**——如果你认真要用 7B，第一件事是下载并本地归档。
### 2. 自发的背景音乐：模型自己"加戏"
官方 FAQ 直言：**你无法控制它给安静段落自动配 BGM**。1.5B 尤其严重，7B 相对稳定。这对"我要纯净人声"的播客用户是真问题。
### 3. 内嵌 AI 披露音 + 不可感知水印
官方 model card 明确：生成音频包含可听见的"本段由 AI 生成"声明 + 隐形水印。这是合规特性但也是限制——**别指望拿它做无标记的商用配音**。
### 4. 唱歌是"涌现"的，且跑调
训练数据没音乐，让模型唱 "See You Again" 是它的招牌 demo，但作为功能是不合格的。
### 5. 语言支持有限
英文/中文是真主力，其他语言靠涌现，跨语言生成不稳定。
### 6. 不实时、不快
1.5B/7B 是**离线批处理**——你提交脚本、等 GPU 跑完、拿 WAV。要实时请用 Realtime-0.5B，但它是单说话人 + 约 10 分钟上限的另一个产品。
### 7. 微软的"官方警告"悬在头顶
MIT 允许商用，官方不建议商用。**这两件事同时为真**——意味着一旦出问题（尤其是克隆声音的伦理/法律问题），你没有"微软背书"这条退路。
### 8. 仓库本身的"叙事分裂"
打开 microsoft/VibeVoice 你看到的是 ASR 故事，但社区和大多数教程讲的是 TTS。**新人很容易走错门**——README 的 News 区从 2025 年 9 月之后就再没回到 TTS 主线上。
---
## 八、结语与行动建议：一个值得"考古"的开源活化石
VibeVoice 的故事在开源 AI 史上会是独特的一笔：
- **技术上**，它用 7.5 Hz 连续 Tokenizer + Next-Token Diffusion 这套组合拳，第一次真正解决了"长对话一致性"这个语音 AI 圣杯问题，并通过 ICLR 2026 Oral 完成了学术认证。
- **生态上**，它经历了一场罕见的"官方主动放弃 + 社区接棒续命"——既暴露了大厂在滥用风险面前的两难，也证明了 MIT 协议下开源韧性的真实力量。
- **实用上**，它至今仍是开源长对话语音的孤本，同时它的 ASR 分支正在 Azure AI Foundry Labs 落地，成为企业级会议转录的严肃选项。
**给你的行动清单：**
1. **想本地玩播客合成** → 装 `vibevoice-community/VibeVoice` fork + 1.5B 权重（8GB 卡），或 Q4 量化的 7B（8GB 卡勉强）。
2. **想本地跑 7B 完整版** → 立刻从社区镜像下载并归档，别等它消失。
3. **要长会议/访谈转写** → 直接用官方 `microsoft/VibeVoice-ASR-HF`，重点用 Hotwords 注入领域术语。
4. **做实时语音助手** → `VibeVoice-Realtime-0.5B` + 流式推理 demo，300ms 首包延迟够用。
5. **做边缘设备 / 无 GPU 部署** → `VibeVoice-ASR-BitNet`，1.58GB 纯 CPU 跑。
6. **想可视化折腾** → `Enemyx-net/VibeVoice-ComfyUI` 节点。
**最后一句忠告**：把 VibeVoice 当成一个**技术里程碑 + 研究工具**，而不是个拿来即用的商用产品。它证明了"开源 frontier 语音"是可能的，但要用它去生成真实署名的商业内容——请先把合规、水印、克隆授权这三件事想清楚。这既是它被下架的教训，也是它留给整个行业的思考。
