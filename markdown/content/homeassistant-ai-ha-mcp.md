# homeassistant-ai/ha-mcp

[GitHub URL](https://github.com/homeassistant-ai/ha-mcp)


## ha-mcp 深度评测：87 个工具把 Claude 变成你的智能家居 AI 管家

> ha-mcp 是一个开源 MCP 服务器，让 Claude 等 AI 客户端全面接管 Home Assistant 的控制、配置与调试，告别手写 YAML。

- **Tags**: Home Assistant, MCP, 智能家居, AI Agent, 开源项目
- **Category**: 智能家居, AI 工具, 开发工具

## Details

# ha-mcp 深度评测：当 Claude 遇上 Home Assistant，智能家居终于有了"AI 管家"
> **一句话总结**：ha-mcp 是一个为 Home Assistant 打造的"非官方但极其 Awesome"的 MCP 服务器，用 **87 个细粒度工具**把 Claude / ChatGPT / Cursor 等 AI 客户端变成你智能家居的"资深运维工程师"——不仅能开关灯，还能**创建自动化、改仪表盘、看执行 trace 调 Bug、管理备份和 HACS**。如果你已经受够了在 YAML 里一行行折腾，这是 2026 年最值得折腾一次的项目。
---
## 一、背景与痛点：为什么是 ha-mcp？
**Home Assistant 的"最后一公里"问题，是配置本身。**
任何一个把 HA 玩到一定深度的人都会遇到同一个坎：你知道"我想让玄关灯在日落且有人经过时亮起"，但你要把它翻译成 trigger / condition / action 的 YAML 结构、去搜索 `binary_sensor.motion_xxx` 这种随机字符串 entity_id、处理 `mode: restart` 和 `single` 的区别、再决定是否要用 helper……这一套流程，新手要学一两周，老手每次写也要来回查文档。
HA 内置的语音助手 Assist 只能"操控"已暴露的设备（开灯、关空调），本质上是个意图识别的语音入口，**它没法"创建"或"修改"任何东西**。换句话说，HA 的官方 AI 战略到目前为止只覆盖了"用"，没覆盖"建"和"维护"。
ha-mcp 项目由 **@julienld** 发起，**@sergeykad、@kingpanther13、@Patch76** 作为核心维护者，从 2025 年下半年开始活跃迭代，目前 issue 编号已经超过 **#1811**，到 2026 年 11 月仍在持续发版（最新 9.2.0 development pre-release 在两天前刚推出来）。这个节奏对于一个 MCP Server 项目来说，可以称得上" industriously active"。
---
## 二、技术原理：MCP 是什么，ha-mcp 又把"工具"做成了什么？
### 2.1 一句话讲清 MCP
MCP（Model Context Protocol）可以理解成 **"AI 世界的 USB-C 接口"**：以前你要让 AI 操作家里的设备，得为每个客户端（Claude Desktop、ChatGPT、Cursor）写一套专属对接；有了 MCP 之后，AI 客户端只要支持这个协议，就能"即插即用"地调用任何 MCP 服务器暴露出来的工具。
打个比方：
- **没有 MCP** = 你给每个客人配一把不同的钥匙、教一遍不同的开门方式；
- **有 MCP** = 你装了一个通用门禁，所有人刷一下就行。
### 2.2 ha-mcp 的架构：FastMCP + WebSocket + 87 个工具
ha-mcp 基于 **FastMCP** 框架（README 致谢里明确提到），底层通过 Home Assistant 的 **WebSocket API** 与 HA 通信，部分高级操作（文件读写、YAML 编辑）通过一个 **HACS 自定义组件（ha_mcp_tools）** 走特权通道。
它的核心资产是一张 **87 个工具的工具清单**，按能力分成六大类：
| 分类 | 能力举例 |
|---|---|
| 🔍 **Search** | 模糊 entity 搜索、深度配置搜索、系统全景 |
| 🏠 **Control** | 任意 service 调用、批量设备控制、实时状态读取 |
| 🔧 **Manage** | 自动化 / 脚本 / helper / dashboard / 区域 / 楼层 / 分组 / 日历 / 蓝图的增删改 |
| 📊 **Monitor** | 历史数据、统计、摄像头快照、**自动化执行 trace**、ZHA 设备 |
| 💾 **System** | 备份恢复、更新管理、Apps(add-on) 管理、设备注册表 |
| 🔒 **Safety** | 只读模式开关、按工具启停、tool 安全策略、**自动编辑前备份** |
工具完整清单里有几个特别值得划重点的：
- **`ha_get_automation_traces`** —— 这是 ha-mcp 真正区别于其他"AI 控家居"项目的杀器。AI 不再瞎猜"为什么我的自动化没触发"，而是直接读到 HA 的执行 trace，看到每一步 condition 的真值、action 的耗时、报错位置。这相当于把 HA 开发者工具直接塞给 Claude。
- **`ha_search_tools`（BM25 搜索式发现）** —— 项目很聪明地解决了"87 个工具塞爆小模型上下文"的问题。对 Claude Haiku、Gemini、本地 Ollama 这类不支持"延迟加载工具"的客户端，开启 `ENABLE_TOOL_SEARCH=true` 后，工具列表会变成一个 BM25 搜索接口，模型按需"用搜索拉工具"，而不是一次吞下 87 个 schema。
- **`ha_eval_template` + Agent Skills 体系** —— 项目内置了一套捆绑的"HA 最佳实践 skill"，通过 `skill://` URI 以 MCP 资源形式提供，教 AI 不要过度用 Jinja2 模板硬凑、要选对 helper 类型、要走安全的重构流程。这是项目作者对自己"AI 写出来的自动化难维护"这个痛点的正面回应。
### 2.3 一段可以直接复制的配置示例
如果你用的是 Claude Desktop / Claude Code，最简单的方式是项目提供的一键安装脚本（macOS 为例）：
```bash
curl -LsSf https://raw.githubusercontent.com/homeassistant-ai/ha-mcp/master/scripts/install-macos.sh | sh
```
或者更通用地在 MCP 客户端配置 JSON 里写一个 stdio 入口：
```json
{
  "mcpServers": {
    "home-assistant": {
      "command": "uvx",
      "args": ["ha-mcp@latest"],
      "env": {
        "HOMEASSISTANT_URL": "http://homeassistant.local:8123",
        "HOMEASSISTANT_TOKEN": "eyJhbGc..."
      }
    }
  }
}
```
> ⚠️ 但项目 README 自己也承认：**stdio 通道存在已知传输问题（issue #1713）**，正式使用建议走 streamable HTTP —— 也就是用 HACS 安装 Custom Component 或 Docker/PyPI 的 HTTP 模式。
---
## 三、上手部署体验： 五条路线，按"折腾度"排序
这是 ha-mcp 在 DX（开发者体验）上做得最用心的地方，几乎没有之一。作者给出了 **5 种安装方式** + **Setup Wizard** 自动生成 15+ 客户端的精确配置 + **Demo Server**（连自家 HA 都不用，先在官方演示环境玩一把）。
| 安装方式 | 适用人群 | 难度 | 备注 |
|---|---|---|---|
| **HA-MCP Custom Component (HACS)** | 绝大多数人 | ⭐⭐ | 在 HA 内 in-process 运行，全功能，**官方首选** |
| **Home Assistant App (Add-on)** | HAOS / Supervised 用户 | ⭐⭐ | 无需管理 token，体验流畅 |
| **Docker HTTP Server** | Container / Core 安装 | ⭐⭐⭐ | 适合独立主机跑 |
| **PyPI / uvx (HTTP)** | 想要轻量、临时跑一下 | ⭐⭐⭐ | 一行命令，但需要自己管 token |
| **Local stdio** | 试玩 / 调试 | ⭐ | 已知传输问题，不推荐生产 |
**最推荐的路径是 HACS Custom Component**：装完后 HA 侧栏会多一个 HA-MCP 设置面板，可以管理工具开关、feature flag、备份、主题；连接 URL 直接走 HA 自身的 webhook（可借助 Nabu Casa / 反向代理穿透外网），安全模型比"裸暴露端口"干净得多。
**一个真实可用的对话示例**（来自 README）：
| 你对 Claude 说 | 实际发生的事 |
|---|---|
| "Create an automation that turns on the porch light at sunset" | AI 调用 `ha_search` 找到你的 porch light entity，自动生成带 trigger/action 的 YAML，写入 HA |
| "The motion sensor automation isn't working, debug it" | AI 调用 `ha_get_automation_traces` 拉最近执行记录，定位到 condition 失败或 entity 改名 |
| "Make my morning routine automation also turn on the coffee maker" | 先 `ha_config_get_automation` 读出原 YAML，追加 action，再 `ha_config_set_automation` 写回 |
---
## 四、目标人群与收益：谁该冲？
| 人群 | 收益 | 推荐度 |
|---|---|---|
| **HA 重度玩家 / 自托管爱好者** | 把"写 YAML"变成"说人话"，调试时间下降一个数量级 | 🌟🌟🌟🌟🌟 |
| **刚入门 HA 的新手** | 不用先啃 automation 语法，先"用出来"再"看懂它" | 🌟🌟🌟🌟 |
| **智能家居内容创作者 / 折腾党** | 视频素材、博客内容、邻居惊艳值拉满 | 🌟🌟🌟🌟 |
| **只是想用语音开灯的普通用户** | HA 内置 Assist 已经够用，ha-mcp 杀鸡用牛刀 | 🌟 |
| **企业 / 大型部署运维** | 安全模型较复杂，需要仔细评估只读模式 + OIDC | 🌟🌟🌟 |
**收益的具体颗粒度：**
- **省时间**：一份自动化从"查 entity id → 写 YAML → 保存 → 看日志 → 改 bug"的 15 分钟循环，压缩到一两分钟自然语言对话。
- **降门槛**：彻底告别"我要先学 Jinja2 模板才能写自动化"的恐惧。
- **增强视野**：AI 会主动建议你"这场景其实用 helper 更优雅"或"你这个 trigger 可以合并"，相当于一个免费的 HA 架构顾问。
---
## 五、竞品对比：ha-mcp 在生态里站在哪里？
这是评测这类项目时最容易糊弄的部分。我把它和三个最相关对手放在一起比：
| 维度 | **HA 内置 MCP Server** | **ha-mcp（本项目）** | **zorak1103/ha-mcp 分支** | **HA NOVA（新晋 skill-based 方案）** |
|---|---|---|---|---|
| 工具数 | ~15 基础 | **87 综合** | 40 精选 | 极少（relay 仅暴露底层能力） |
| 能否创建/编辑自动化 | ❌ 只能控制 | ✅ | ✅ | ✅（通过 skill 流程） |
| Dashboard 编辑 | ❌ | ✅ | ❌ | ❌ |
| Trace 调试 | ❌ | ✅ | ✅ | ✅（skill 引导） |
| 文件 / YAML 直改 | ❌ | ✅ (beta) | ❌ | ✅ (relay) |
| 智能消耗（context 占用） | 低 | **高（可开 tool search 缓解）** | 中 | 极低 |
| 安全模型 | 简单（Assist 暴露） | 复杂（token + secret URL + OIDC + readonly suffix） | 简单 | 干净（HA 侧 token 不出网） |
| 维护活跃度 | 跟 HA 主线走 | **极活跃（4 维护者 + 30 贡献者）** | 单人分支 | 早期，单人 |
| 安装难度 | 内置开关 | 多选项，HACS 推荐 | uvx | macOS only（暂） |
**简单结论：**
- 想"说句话开个灯" → 用 HA 内置的就够了；
- 想"让 AI 帮我把整套 HA 折腾好" → **ha-mcp 是当前功能最全的选择**；
- 想要"更轻量、更聚焦自动化生成"的方案 → 看一眼 zorak1103 分支或 HA NOVA，它们反映了一种"反 87 工具"的极简思路。
---
## 六、局限与不足：必须挑明的事
客观地说，ha-mcp 不是"神项目"，它有几个实打实的坑：
### 6.1 复杂度本身就是一种负担
HA NOVA 作者 Markus 在社区帖子中直言：把"发现 entity → 检查冲突 → 预览 → 应用 → 复盘"这种业务逻辑全塞进 MCP server，会让项目本身变成一个**难以维护的庞然大物**，并且 context 消耗对 agent 也不友好。这不是黑 ha-mcp，而是这条技术路线的天生 trade-off：**功能广度 vs 上下文成本**。ha-mcp 用"tool search 模式"缓解，但这是治标。
### 6.2 87 个工具对小模型是灾难
Claude Haiku、本地 Ollama、Gemini Flash 这类模型，被塞 87 个工具 schema 后经常"看不见"或"选错工具"。项目自己承认这一点，并提供 `ENABLE_TOOL_SEARCH` 缓解，**但你需要知道自己跑的是什么模型、什么客户端，再做对应配置**。
### 6.3 配置客户端时容易踩"多副本并存"的坑
README 用大字警告：**不要在同一个客户端里同时配置两种安装方式**（比如既写了 stdio 又写了 HTTP URL），这是社区报告"连接卡死"的高频原因。另外切换设置后，**AI 客户端的工具列表是缓存的**，需要手动重连；ChatGPT 甚至有时候要"删除 connector 重新建一个用新名字"才能刷出来。
### 6.4 安全模型需要认真对待
ha-mcp 默认要的是 **Administrator 权限的 Long-lived Access Token**。虽然项目提供了只读模式、`/readonly` URL 后缀、OIDC、Per-tool enable/disable、自动编辑前备份等多层防护，但你本质上是把"整个家"的钥匙交给了一个 AI 进程。一旦你的 MCP URL（特别是 webhook URL）泄漏，攻击者能直接操控你的家。**如果是公网暴露，建议至少做三件事：专用 HA 账户（不是自己主账户）+ 只读 endpoint 给非关键 agent + Nabu Casa 而不是裸暴露端口**。
### 6.5 写入类工具仍然是 beta
`ha_config_set_yaml`、`ha_read_file`、`ha_write_file` 这些**最高危**的能力，目前都在 beta 标记下，需要 `ENABLE_BETA_FEATURES` 显式开启。这其实是个好设计——但也意味着如果你想要"AI 帮我改 configuration.yaml"，要明白自己正在使用一个项目作者都不太敢全量推荐的 feature。
### 6.6 HowToGeek 实测的痛点
HowToGeek 在 2026 年 6 月的实测文章里明确指出："HA-MCP 虽然强大，但仍有它做不到的事"——比如某些高度定制的 dashboard 模块、特定品牌的私有协议设备控制等。它不是一个"什么都能干"的银弹，而是一个"大部分 HA 标准场景都能干"的工具。
---
## 七、结语与行动建议
**终评：⭐⭐⭐⭐☆（4.5 / 5）**
这是一份**功能上限、工程完成度、文档质量、社区活跃度都明显高于同类平均水准**的项目。它把"AI 助手管智能家居"这件事从概念验证做到了可以日常使用的状态，并且难得地在安全、上下文管理、最佳实践 skill 这三件"容易被忽视"的事上都下了功夫。
但它同时也是一个**复杂度不低、需要用户理解自己客户端和模型特性**的工具。如果你只是想试试"AI 能不能开灯"，内置 MCP 更省心；如果你想把 HA 当成自己的"居家 OS"长期经营，ha-mcp 是目前性价比最高的杠杆。
**给不同读者的三步行动建议：**
1. **纯粹想尝鲜** → 在 macOS / Windows 上跑 README 提供的 **Demo Server** 一键脚本，连到官方演示环境，5 分钟内问 Claude "Can you see my Home Assistant?"，体验完再决定。
2. **认真要接入自家 HA** → **直接走 HACS Custom Component 路线**，跳过 stdio；先开只读模式让它"看懂"你的家一两周，再逐步放开写入权限。
3. **追求极致安全的极客** → 启用 **OIDC 认证** + `/readonly` 后缀给非关键 agent 用，把高危工具（YAML 写入、文件删除、系统重启）在 per-tool 层面手动 disable。
> 项目的隐私声明也值得点赞：目前 **无遥测、无个人数据收集**，bug 上报也是用户主动触发的——这在同类 AI 网关类项目里算是个加分项。
如果你还在犹豫要不要折腾，问自己一个问题：**你愿意每周花 1 小时学 YAML，还是花 30 分钟部署一次、之后用自然语言改配置？** ha-mcp 给的是后者这个选项——这本身就是它存在的全部意义。
