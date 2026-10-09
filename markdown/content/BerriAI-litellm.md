# BerriAI/litellm

[GitHub URL](https://github.com/BerriAI/litellm)


## LiteLLM 深度评测：一个接口调用 100+ 大模型的万能网关

> 用一套 OpenAI 格式的统一接口，调用 OpenAI、Claude、Gemini 等 100+ 家大模型，还能管密钥、控预算、做故障切换的开源 AI 网关。

- **Tags**: LiteLLM, AI网关, 大模型, 开源, LLM
- **Category**: 开发工具, AI 网关, 开源项目

## Details

# LiteLLM 深度评测：把「百家争鸣」的大模型 API 装进一个插座
> **一句话总结：LiteLLM 是大模型世界里的「万能转接头」——用一套 OpenAI 格式的统一接口，把 OpenAI、Anthropic、Gemini、Bedrock、Ollama 等 100+ 家厂商、1,800+ 个模型全部接进来，让你写一次代码就能随意切换模型，顺便还能帮你管成本、控额度、做故障切换。**
对任何一个同时用过两家以上 LLM API 的开发者来说，这个项目的价值几乎不需要论证；而对还没踩过这坑的新手，这篇文章会告诉你为什么 55,000+ 位 GitHub 用户已经把它标星收藏。
---
## 一、项目档案速览
| 维度 | 信息 |
|---|---|
| 项目地址 | github.com/BerriAI/litellm |
| 维护方 | BerriAI（Y Combinator 孵化，2025 年完成 160 万美元种子轮） |
| Stars / 贡献者 | 约 55.6K stars，1,000+ 贡献者（触到 GitHub 统计上限），约 1.4K 次发布 |
| 许可证 | MIT（开源版可免费商用），企业版单独收费 |
| 技术形态 | ① Python SDK（库）② AI Gateway / Proxy Server（独立服务，已引入 Rust 核心） |
| 更新频率 | 每周一个 stable 版本（周二/周四 nightly → 周六 RC → 次周五/六 promote） |
| 标杆用户 | Netflix 等出现在官方 OSS Adopters 列表中 |
| 性能指标 | 官方基准：1k RPS 下 P95 延迟约 8ms |
---
## 二、背景与痛点：为什么需要一个「翻译官」
想象一下你接手一个 AI 应用项目： planning 用 Claude、轻量工具调用用 GPT-4o-mini、摘要任务用本地部署的 Llama。这意味着**三套 SDK、三种鉴权方式、三种响应格式、三种错误码、三张计费账单**。更糟的是，每当模型升级或换供应商，你就要重写大段代码。
这就是 LiteLLM 要解决的核心问题。2023 年由 BerriAI 的 Ishaan Jaffer 和 Krrish Dholakia 创立，最初只是让调用各家 LLM 像调用 OpenAI 一样简单，后来逐步演化为完整的 **AI Gateway**：不仅做协议翻译，还把密钥管理、成本追踪、限流、监控、合规审计这些"脏活累活"全部包圆。
用个比喻：**LiteLLM 就像电器世界里的「万国插座转换器」**——不管你用的是美标、欧标还是英标插头（OpenAI、Anthropic、Bedrock 的私有 API），只要插到这个转换器上，就能用统一的国标插座（OpenAI 格式）供电。电从哪来、多少钱一度，转换器都帮你记在账上。
---
## 三、核心亮点：四层能力逐层拆解
### 1. 统一 API 层：一套代码打天下
最基础也最核心的能力。无论后端是什么模型，调用方式都长这样：
```python
from litellm import completion
import os
os.environ["OPENAI_API_KEY"] = "sk-xxx"
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-xxx"
# 调 OpenAI
r1 = completion(model="openai/gpt-4o", 
                messages=[{"role": "user", "content": "你好"}])
# 调 Claude —— 唯一的区别就是 model 字符串
r2 = completion(model="anthropic/claude-sonnet-4-5", 
                messages=[{"role": "user", "content": "你好"}])
```
这段代码是官方 README 的示例。**真正的魔法在 `model` 字符串的 `provider/` 前缀**：LiteLLM 内部通过一层"路由表"把 `anthropic/claude-sonnet-4-5` 翻译成 Anthropic 的 `/v1/messages` 协议，把 `bedrock/us.anthropic.claude-sonnet-5` 翻译成 AWS SigV4 签名请求，把 `ollama/llama3` 翻译成本地 HTTP 调用——而这一切对你完全透明。
这意味着三件事：
- **换模型 = 改一个字符串**，不用读五份 SDK 文档
- **避免厂商锁定**，新模型上线第一天就能用（官方强调 "Day-zero support for new models"）
- **响应格式统一**，解析代码只写一次
### 2. Router 层：负载均衡 + 故障切换 + 成本调度
这是很多教程一笔带过、但生产环境里最值钱的能力。LiteLLM 的 `Router` 类可以把同一个"逻辑模型名"映射到多个真实部署上：
```python
from litellm import Router
router = Router(
    model_list=[
        {"model_name": "smart-model",
         "litellm_params": {"model": "azure/gpt-4o-eu", 
                            "api_key": "os.environ/AZURE_KEY_EU", "rpm": 6}},
        {"model_name": "smart-model",
         "litellm_params": {"model": "azure/gpt-4o-ca", 
                            "api_key": "os.environ/AZURE_KEY_CA", "rpm": 6}},
    ],
    fallbacks=[{"smart-model": ["budget-model"]}]  # 主力挂了自动切备用
)
```
这段配置的含义是：应用调用 `smart-model`，Router 会自动在欧盟、加拿大两个 Azure 端点之间做**负载均衡**（ respect 各自的 RPM 限制），如果某端点返回 429 限流或 5xx 错误，自动**冷却该部署并重试其他端点**；如果整组都挂了，再降级到 `budget-model`。
这一层把过去要自己写几百行的重试逻辑、异常处理、区域容灾，压缩成了几行 YAML。
### 3. Proxy Server 层：团队级 AI 网关
这是 LiteLLM 的"第二形态"，也是它能从个人工具升级为企业标配的关键。独立部署后（一条命令）：
```bash
uv tool install 'litellm[proxy]'
litellm --model gpt-4o   # 默认监听 http://0.0.0.0:4000
```
它就变成了一个**带管理后台的中央网关**。所有应用不再各自持有真实 API Key，而是统一指向 `http://gateway:4000`，网关负责：
- **虚拟密钥**：给每个开发者/每个项目发独立的 `sk-xxx`，可随时吊销，泄漏了也不影响主密钥
- **预算控制**：给实习生团队设 $50 上限、给生产应用设 $5,000 上限，超了自动停
- **成本追踪**：每次调用记录 token 数和美元成本，按团队/项目/模型聚合
- **审计日志**：所有 prompt 和响应可回溯（可对接 Langfuse、LangSmith 等可观测平台）
- **护栏**：敏感词过滤、PII 脱敏、输出格式校验
用 Netflix 这类企业都把它作为基础设施的事实来衡量，这一层已经不是玩具。
### 4. 生态扩展层：MCP、Agent、A2A 一网打尽
2026 年的 LiteLLM 早已不只是"LLM 代理"，它把 MCP 服务器、Agent Harness（Claude Code / Codex / OpenCode）、A2A 协议也纳入了同一套网关。一个实际的 Cursor IDE 配置就能说明它的定位野心：
```json
{
  "mcpServers": {
    "LiteLLM": {
      "url": "http://localhost:4000/mcp/",
      "headers": {"x-litellm-api-key": "Bearer <your-master-key>"}
    }
  }
}
```
也就是说，**模型、工具、Agent 三类 AI 资源都通过同一个入口进出**，这为未来"AI 资产统一治理"打下了架构基础。
---
## 四、上手实战：从 Docker 一键部署到第一个请求
### 部署体验：小白友好度 ★★★★☆
官方推荐的 Quick Start 只需三条命令：
```bash
curl -sSLO https://github.com/BerriAI/litellm/raw/main/docker/docker-compose.quickstart.yml
printf 'LITELLM_MASTER_KEY=sk-%s\nLITELLM_SALT_KEY=sk-%s\n' \
  "$(openssl rand -hex 32)" "$(openssl rand -hex 32)" > .env
docker compose -f docker-compose.quickstart.yml up -d
```
这条命令会同时拉起 LiteLLM 网关和 Postgres 数据库，然后你就可以在浏览器打开 `http://localhost:4000`，通过 Admin UI 点鼠标完成"接模型、发密钥、发测试请求"——**不需要写一行配置文件**。
### 进阶：用 config.yaml 做精细化路由
生产环境通常用 YAML 声明式配置：
```yaml
model_list:
  - model_name: smart-model            # 应用看到的别名
    litellm_params:
      model: azure/gpt-4o-eu           # 真实的后端模型
      api_key: "os.environ/AZURE_API_KEY_EU"
      rpm: 6
  - model_name: smart-model            # 同名出现两次 = 自动负载均衡
    litellm_params:
      model: anthropic/claude-sonnet-4-5
      api_key: "os.environ/ANTHROPIC_API_KEY"
  - model_name: local-llama
    litellm_params:
      model: ollama/llama3
      api_base: http://localhost:11434
litellm_settings:
  drop_params: true
  success_callback: ["langfuse"]       # 自动上报到 Langfuse
general_settings:
  master_key: os.environ/LITELLM_MASTER_KEY
```
启动：`litellm --config config.yaml`。之后所有 OpenAI SDK、LangChain、Cursor、Cline 都只需改一个 `base_url` 就能接入：
```python
import openai
client = openai.OpenAI(api_key="anything", base_url="http://0.0.0.0:4000")
r = client.chat.completions.create(
    model="smart-model",
    messages=[{"role": "user", "content": "hi"}]
)
```
**核心心智模型**：你的应用只认识"别名"，LiteLLM 在网关层决定真实路由——这正是"换模型不改代码"的底层机制。
### 生产部署的隐形门槛
文档里的 Production Checklist 提到，要跑稳这个网关你还需要：
- **Redis**：做分布式限流、缓存、多实例 Router 状态同步
- **PostgreSQL**：存虚拟密钥、预算、日志（每次调用都会写入）
- **合理的 worker 数量**：默认配置高并发下会顶不住
- **Kubernetes Helm Chart / Terraform**：官方有，但需要你会用
换句话说，**`pip install` 只要 10 秒，但把 HA 生产环境搭稳需要一位 DevOps**。
---
## 五、竞品对比：LiteLLM 在 AI 网关版图中处于什么位置
| 产品 | 形态 | 核心差异化 | 适合谁 |
|---|---|---|---|
| **LiteLLM** | 自托管开源（MIT）+ 企业版 | 覆盖 100+ 提供商、Python SDK + Proxy 双形态、可深度定制、数据不出内网 | 有 DevOps 能力、需要数据主权、多模型多团队的团队 |
| **OpenRouter** | 托管 SaaS | 无需运维、按量加价 5.5%、有免费模型池 | 个人开发者、快速原型、不想管基础设施 |
| **Portkey** | 开源网关 + 托管 | 语义缓存、护栏、可观测性更强；开源版支持 1600+ 模型 | 重视可观测性和缓存命中率的产品团队 |
| **OneAPI / NewAPI** | 自托管开源（国内流行） | Go 实现、部署轻、中文生态好、UI 简洁；但 Provider 覆盖和路由策略深度不如 LiteLLM | 国内中小团队、以 OpenAI 系为主、不需要复杂路由 |
| **Cloudflare AI Gateway** | 托管 | 借 Cloudflare 边缘网络做缓存/限流；Unified Billing 加价 5% | 已经在 CF 生态里的团队 |
| **Kong AI Gateway / Apigee** | 企业级 API 网关扩展 | 走传统 API 网关路线，AI 能力是插件 | 已有 Kong/Apigee 栈的企业 |
| **TrueFoundry / MLflow AI Gateway** | 托管/开源平台 | 不止做代理，还能自托管模型、做评估；MLflow 属 Linux 基金会治理 | 需要端到端 AI 平台、不想只做一层网关 |
**LiteLLM 的独特生态位**可以概括为一句话：**它是唯一一个同时提供"轻量 Python SDK"和"重型自托管网关"两条演进路径、且 MIT 许可、被 Netflix 等大厂背书的开源方案**。OneAPI 在国内好上手但企业级路由深度不够；OpenRouter 免运维但数据必须过第三方；Portkey 功能全但自托管版本较新；Kong 太重。LiteLLM 是"中间那条路"。
---
## 六、必须直面的局限与风险
这部分不是给项目泼冷水，而是帮你做正确的选型判断。
### 1. 2026 年 3 月的供应链投毒事件（重要）
这是 LiteLLM 历史上最严重的一次危机，也是任何选型者必须知道的背景：**PyPI 上的 `litellm==1.82.7` 和 `litellm==1.82.8` 两个版本被注入恶意代码**，能在用户环境里窃取云凭据、SSH 密钥、Kubernetes 配置，三阶段载荷包括凭据收割、横向移动和持久化后门。CloudSEK 披露约有 **2,500+ 家公司、434,000 条 CI/CD 流水线**受波及。
团队在 3 月 27 日发布官方安全公告，3 月 30 日上线全新的 CI/CD v2 流水线（隔离构建环境 + 强制安全门禁 + 发布 SHA-256 校验），并发布干净版本 `v1.83.0`。
这件事对选型的启示很直接：**任何被广泛依赖的 AI 中间件都是高价值攻击目标**。如果你使用 LiteLLM，必须：
- 锁定 stable 版本号，绝不直接 `pip install litellm`（不带版本号）
- 校验官方公布的 SHA-256 checksum
- 关注官方 Trust Center 和安全公告
### 2. 运维成本被严重低估
TrueFoundry 那篇流传较广的评论有一句话很扎心："对 DevOps 架构师来说，'免费开源'是个误称"。要跑一个生产级的 LiteLLM 网关，你需要自己管 Postgres 迁移、Redis 高可用、日志表膨胀、密钥轮换、版本升级——**所有这些都没有 SLA**，出了问题只能翻 GitHub Issue 或上 Discord。
### 3. 企业级功能是付费墙
开源版并非"全能"：
- **SSO/SAML**（Okta、Azure AD）：开源版限 5 用户以内
- **SCIM 自动化用户开通**：仅企业版
- **细粒度 RBAC**、高级审计留存：仅企业版
也就是说，当你的团队规模从 10 人长到 200 人，"在 Slack 里共享 master key"的模式会先撑不住，然后你就会走到"联系销售"那一步。
### 4. 社区问题的处理节奏有争议
有 Issue（如 #31416）公开抱怨维护者对生产关键 bug 的响应缓慢。配合每周一个 stable 的节奏可以看出：**新功能优先于老 bug 修复**是项目事实上的取舍。如果你踩到一个冷门 Provider 的边角 bug，可能要等好几周甚至自己提 PR。
### 5. Python Proxy 的性能天花板
虽然官方宣传 8ms P95 @ 1k RPS，并且 2026 年已在 README 里打上"Rust core"标签，但绝大多数用户跑的还是 Python 版 Proxy。在高并发、长流式响应的场景下，Python 的序列化开销和 GIL 会成为瓶颈，很多团队在 QPS 上千后开始寻找替代。Rust 核心的引入就是为了解决这个问题，但生态迁移仍需时间。
### 6. 多模态、复杂工具调用的兼容性长尾
100+ 提供商 × 1,800+ 模型的矩阵意味着巨大的兼容性测试面。视频理解、原生推理流（thinking blocks）、复杂 tool_use 在一些小众 Provider 上的转换并不完美，往往要读源码才知道某个参数是怎么被丢弃或改写的（好在 `drop_params: true` 默认帮你规避了大部分报错）。
---
## 七、目标人群与收益：谁该立刻上手
| 人群 | 推荐用法 | 核心收益 |
|---|---|---|
| **个人开发者 / 学生** | 只用 Python SDK，不部署 Proxy | 5 分钟跑通任意模型，省下读多份 API 文档的时间 |
| **AI 应用创业团队（< 20 人）** | Docker 起一个 Proxy，用虚拟密钥 + 预算 | 一处管所有模型的成本和权限，避免账单失控 |
| **企业平台组 / 中台** | K8s 部署多实例 + Redis + Postgres + SSO | 给全公司提供统一 AI 网关，数据不出内网 |
| **Agent / MCP 开发者** | 用它的 MCP Gateway / A2A 协议代理 | 模型 + 工具 + Agent 一套鉴权、一套日志 |
| **重度 Cursor / Cline 用户** | 把 base_url 指到自建 LiteLLM | 用 Claude Code 也走自己的计费池，可控可审计 |
---
## 八、结语与行动建议
LiteLLM 已经从"一个好用的 Python 库"成长为**事实上的开源 AI Gateway 标准**，55K stars、Netflix 背书、每周稳定发版、Y Combinator 投资方，这些都是实打实的护城河。它把"调用大模型"这件原本碎片化、脏乱差的工作，抽象成了一条干净的统一 API，这项基础性贡献值得每一个 AI 工程师记在心上。
但 2026 年的供应链事件也清晰地提醒我们：**越是成为基础设施，越是成为攻击靶心**；**越是开源免费，运维责任越落回自己肩上**。LiteLLM 不是"开箱即用的银弹"，而是一把需要你花心思保养的好刀。
**给你的三步行动建议**：
1. **今天就试**：`pip install litellm`，用 SDK 跑一个跨三家 Provider 的对比 Demo，感受统一 API 的爽感
2. **本周内试**：按 Quick Start 用 Docker 起一个本地 Proxy，体验 Admin UI、虚拟密钥和成本面板
3. **三思再上生产**：如果要部署到生产，请先读一遍官方 Production Checklist，把 Redis、Postgres、版本锁定（避开 1.82.7/1.82.8，至少用 1.83.0+）、密钥备份这四件事想清楚再动手
**终极评判：如果你正在做任何需要调用多个 LLM 的项目，LiteLLM 值得成为你技术栈里的默认选项；但把它当"免费无脑用"的基础设施，就会在运维和安全上摔跟头。理解它、锁定版本、配好外围，它会是你在 AI 时代最稳的"万国插座"。**
