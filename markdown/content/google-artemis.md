# google/artemis

[GitHub URL](https://github.com/google/artemis)


## Google ARTEMIS 深度评测：用自然语言操控真机的 Android AI 自动化智能体

> Google 开源的 Android 真机 AI 自动化框架，用一句自然语言替代传统 UI 自动化脚本。

- **Tags**: Google开源, Android自动化, AI Agent, MCP, Gemini
- **Category**: 开发工具, AI 编程, 自动化测试

## Details

# Google ARTEMIS 深度评测：当 AI 学会用真手指划屏幕
> **一句话总结**：ARTEMIS 是 Google 在 2026 年 8 月开源的 Android 真机自动化智能体，把"打开设置看看电量"这种自然语言指令直接翻译成 ADB 层面的真实点击、滑动、输入，并通过 MCP 协议把真机塞进 Claude Code、Antigravity、Codex 等 AI IDE——**它可能是当下把"AI 助手 + 真机"这条链路打通最完整的开源框架**，但 99% 的 Benchmark 数字与一场尚未完全落幕的署名争议，都值得你带着审视的眼光再看一遍。
---
## 一、背景与痛点：移动自动化为什么一直很痛
写过 Espresso 或 Appium 脚本的人都有过那种绝望感：资源 ID 一改脚本全红、一个广告弹窗让整条用例崩溃、一次 UI 微调让回归测试集体扑街。传统的 UI 自动化本质上是"**人类把每一步都预先写死，机器去执行**"，一旦现实偏离剧本，测试就报废。
Google Research 在 2024 年发布的 **AndroidWorld 基准**（116 个跨 20 款真实 App 的多步任务）让业界第一次有了统一标尺去衡量"AI 能不能像人一样用手机"，而 ARTEMIS 则是 Pixel Test Engineering Fusion 团队给出的一个"产品级"答案——**与其让人类维护脆弱的选择器，不如让一个 VLM 智能体实时看屏幕、想步骤、动手操作、自我校验**。
值得点破的是，ARTEMIS 的源代码结构里明文写着：**部分代码派生自法国初创公司 Minitap 开源的 mobile-use 项目（Apache 2.0）**——这条线索后文会展开，它是评测这个项目绕不开的背景。
---
## 二、它到底是什么：一句话类比 + 四张面孔
如果把传统 Appium 比作"**导演写好分镜脚本，演员照本宣科**"，那 ARTEMIS 更像是"**给了一位有经验的 QA 工程师一部真机，你只对他说'帮我测一下登录'**"。它不是模型、不是聊天机器人包装，而是一个 **Python 3.12+ 的控制中台**，夹在视觉-语言模型（VLM）和真实手机之间。
同一套引擎对外暴露**四张面孔**，这也是它工程上最聪明的一点：
| 形态 | 入口 | 典型场景 |
|------|------|---------|
| **Web 控制台** | `uv run artemis ui` → localhost:8000 | 可视化调试，看实时投屏 + 推理流 + 回放 |
| **MCP Server** | `uv run artemis mcp --install all` | 接入 Claude Code / Antigravity / Cursor 等智能 IDE |
| **开发者 CLI** | `uv run artemis run "..." --profile flash` | 终端跑用例、跑稳定性巡检、跑 AndroidWorld |
| **Python SDK** | `artemis-client` 包 | 嵌入 pytest / CI/CD，返回 Pydantic 强类型断言 |
四张脸共用一套引擎，意味着你可以先用 Web 控制台探索任务怎么走、再用 MCP 让 IDE 里的智能体自己复现 Bug、最后用 SDK 把它固化成回归用例——这条链路是连续的，不需要中途换工具。
---
## 三、核心技术剖析：Flash 与 Pro 是两个智能体，不是两档速度
这是评测这个项目**最容易踩的认知误区**：`--profile flash` 和 `--profile pro` 不是同一个 agent 的快慢开关，而是**架构完全不同的两个智能体**。
### Flash 模式：一镜到底的反应式循环
- **架构**：单个 LLM 跑"观察 → 思考 → 执行"循环，无图编排
- **速度**：单步约 **3–5 秒**，省 token
- **历史管理**：不截断而是**压缩**——老截图被折成"视觉摘要"，已完成的步骤被打包成可检索的"历史分块"，通过 `search_history` / `replay_steps` 按需召回
- **瞬态控件**：对会自动消失的控制栏、toast，用 `click_sequence` 把多次点击串成一个原子动作连发
- **能力边界**：没有计划、没有执行前校验、没有 checkpoint、没有 ADB shell
它适合**确定性 UI 操作**——点按钮、输文本、走表单，追求快和便宜。
### Pro 模式：三角色的多智能体图编排
- **架构**：Planner（维护 Markdown 任务计划，含 `verify` / `assert` 检查点）+ Operator（执行者，带全套工具）+ Checker（只读，校验检查点并做终审）
- **速度**：单步约 **15–40 秒**，5–10 倍于 Flash
- **Safety Net**：每个动作执行前都要用实时 UI 树（XML 优先）和像素（兜底）做一次"打之前先看清目标"
- **执行事故机制**：被拦截或失败的动作会以 "execution incident" 形式留在 Operator 上下文里，直到后续动作成功为止，没有独立的"修复 agent"
- **verification-level**：`off` / `final` / `checkpoints` / `strict` 四档可调
- **能力**：可跑 100+ 步的长程复杂业务流、`[Loop:continuous]` 持续监控、可选书面测试报告
**一句话总结这个对比**：Flash 像一个手脚麻利的初级测试员，Pro 像一个会写测试计划、会写总结报告的高级测试工程师——**用 Flash 做冒烟测试，用 Pro 做探索式回归**，是这个框架的隐含用法。
### 真正的核心资产：`rules.md`
一个容易被忽略但极有价值的细节：ARTEMIS 在代码之外，还提供了一份 **68 行的 `mcp_server/rules.md`**，自动挂载到你的 IDE 全局规则里。内容本质上是"**资深移动测试工程师的行为守则**"：
1. **别凭猜测写测试**——必须先用 ARTEMIS 工具碰一次真机，确认屏幕流转
2. **延迟补偿公式**——Flash 单步约 5 秒，要等 30 秒就指令"等 25"；Pro 单步 30 秒，自然填满无需显式 wait
3. **动态优先、坐标兜底**——先试 ID/文本/OCR，失败时 try-catch 落到探索阶段确认过的绝对坐标
4. **报错先 `mobile_diagnose`**——禁止无脑重试
> 这是典型的"**Prompt 即产品**"思路：代码可以被模仿，但被实战打磨出来的行为准则资产很难复制。哪怕你不用 ARTEMIS，这份 rules.md 单独拿出来当"用 AI 做移动测试的最佳实践"也值得一读。
---
## 四、代码示例：30 秒看懂怎么用
**部署一条命令**（自动装 ADB / scrcpy / FFmpeg / uv / MCP）：
```bash
git clone https://github.com/google/artemis.git && cd artemis
./start.sh   # Windows 用 .\start.bat，注意 PowerShell 必须带 .\ 前缀
```
**CLI 跑一个任务**：
```bash
uv run artemis run "打开系统设置，找到电池选项并告诉我当前电量" --profile flash
```
**Python SDK 嵌入 pytest**：
```python
import asyncio
from artemis_client import ArtemisClient
async def main():
    client = ArtemisClient(
        "http://artemis-host:8000",
        device_serial="emulator-5554",       # 不传则自动选空闲设备
        default_profile="flash",             # "flash" 极速 / "pro" 深度
    )
    result = await client.run(
        "打开系统设置，进入『电池』页面，验证电量百分比正常显示，"
        "确认页面无异常报错弹窗。",
    )
    assert result.succeeded, f"测试失败: {result.error or result.status}"
    print(f"✅ 通过! 设备: {result.device_serial} | Trace: {result.trace_id}")
asyncio.run(main())
```
**MCP 配置（以 Claude Desktop 为例）**：
```json
{
  "mcpServers": {
    "artemis": {
      "command": "/path/to/artemis/.venv/bin/python",
      "args": ["-m", "mcp_server"],
      "cwd": "/path/to/artemis"
    }
  }
}
```
配置完成后，你在 IDE 里说一句 *"把刚改的代码编译成 APK 装到手机，打开登录页输测试账号，验证登录后有没有异常弹窗，截图回传"* ——智能体就能自动调用 `mobile_run_task`、`mobile_diagnose` 等工具完成全链路。
---
## 五、部署体验与上手门槛
**好的一面**：
- `./start.sh` 一键脚本会自动检测并安装 ADB、scrcpy、FFmpeg、Python uv 运行时，对小白极其友好
- 支持真机（开 USB 调试即可）和模拟器，无 Docker 强制依赖
- Web 控制台的 Live Agent Stream 会实时显示 tap 坐标（如 `[[381, 430]]`）、每步耗时、token 消耗，**调试可见性在同类工具里属于第一梯队**
- MCP 一键 `--install all` 自动挂到 Antigravity / Cursor / Claude Code / Codex / Windsurf / VS Code / Cline 等 8+ 个 IDE
**门槛所在**：
- **Python 3.12+** 是硬要求，老环境的团队需要先升级
- **需要一个 Google AI Studio 的 Gemini API Key**——特别是 `gemini-robotics-er-2-preview`（下文有详细说明）
- 首次启动会往手机上**安装一个 Accessibility Helper APK**（官方解释仅监听本机回环、不外发数据，可用 `ARTEMIS_HELPER_AUTO_INSTALL=false` 关闭）——个人手机或共享测试机上，这个行为**应该提前告知团队**
- 官方文档（README、MCP 文档、rules.md）质量很高，中文文档同步齐全，这点值得点赞
---
## 六、竞品对比：它在移动自动化光谱里的位置
| 维度 | **ARTEMIS** | **Minitap mobile-use** | **Mobilerun / mobile-harness** | **Appium** | **Maestro** |
|------|------------|----------------------|-------------------------------|-----------|------------|
| **定位** | 自然语言 AI 智能体 | 自然语言 AI 智能体 | 编码智能体的移动 harness | 传统脚本框架 | 声明式 YAML 测试 |
| **测试编写** | 自然语言 | 自然语言 | 自然语言 | Java/Python/JS 等代码 | YAML 流程 |
| **AndroidWorld 官方分** | 99.1%（自报，**未在官方表**） | 91.4%（官方表） | **100%（官方分）** | 不适用 | 不适用 |
| **维护方式** | UI 改动基本不用改脚本 | 同左 | 同左 | UI 改动要改脚本 | UI 改动要改 YAML |
| **跨平台** | 仅 Android（iOS 在路线图） | 仅 Android | Android + iOS | Android + iOS + Windows | Android + iOS |
| **开源协议** | Apache 2.0 | Apache 2.0 | 开源 | Apache 2.0 (OpenJS) | Apache 2.0 |
| **适合谁** | 想把真机接入 AI IDE 的开发者 | 研究型/早期采用者 | 用 Claude Code/Codex 做移动 QA | 大型跨平台测试体系 | 想快速起步的移动团队 |
几个值得点破的事实：
1. **AndroidWorld 官方排行榜是自报制**——榜单开头明文写着"社区提交、未做独立验证"。截至 2026 年 9 月 14 日，**ARTEMIS 那行根本不在官方 Sheet 里**，官方榜首是 AGI-0 / MobileUseAgent / Finalrun 并列 97.4%，而 Mobilerun 后来跑出了官方验证的 100%
2. **Minitap 的 mobile-use 自称也拿到过 100%**（2026 年 1 月提交）但邮件石沉大海，官方表停留在 91.4%——**两边都宣称自己是第一，两边都没有第三方背书**
3. ARTEMIS README 里那张对比图**恰好漏掉了同分的 mobile-use**，却保留了同分的 DroidRun——这个细节让独立观察者很难不去多想
4. 与 Appium / Maestro 这类"写脚本"的工具**不是替代关系而是互补关系**：脚本适合回归确定性用例（快、便宜、稳定），ARTEMIS 适合探索式测试、Bug 复现、跨 App 长流程（智能但慢且贵）
---
## 七、一个绕不开的争议：署名危机与开源伦理
这部分必须**毫不避讳地讲清楚**，因为它直接关系到你是否要在生产环境引入这个项目。
**Minitap（法国初创公司）在 2026 年 9 月 11 日发布的博文《I expected better from Google》指出**：
- ARTEMIS 中的 Android 设备连接代码与 mobile-use 的实现**完全一致**
- Hopper agent（mobile-use 的智能体，名字源自一位 Minecraft 迷工程师的随口命名）的指令在 ARTEMIS 里**逐字相同**
- 一个"在 WhatsApp 里给 Alice、Bob、Charlie 发新年祝福"的示例，**连注释和清理步骤都一样**
- 两边还曾共享同一个"helper 写结果文件、下次读自己输出会失败"的 Bug——**同源 Bug 是代码同源的铁证**
- 更严重的是：**早期的 package 文件里明确列了 Minitap 三位作者的名字（Pierre-Louis Favreau、Jean-Pierre Lo、Nicolas Dehandschoewercker），但被一次 force push 替换掉了**，只换了作者行，其他内容没动
**Google 方面的回应**（通过 9 月 12 日的 commit 体现）：`fix: complete README and relevant file headers per Apache 2.0 requirements`——把 Apache 2.0 要求的归属声明**补齐了**，当前版本代码头里确实标明"Portions derived from mobile-use, Copyright 2025-2026 Minitap, Inc."。
**这件事的客观评价**：
- 从**法律层面**，Apache 2.0 允许商用派生，目前补齐了署名，**合规底线是达到了**
- 从**工程伦理层面**，"先删除原作者再开源"这个操作顺序，对一家长期把 Kubernetes、TensorFlow 开源当招牌的公司来说是显著的口碑损耗，Minitap CEO 的失望是有依据的
- 从**实用层面**，这对使用者的影响有限——代码本身 Apache 2.0，商用无虞；但它提醒我们，**开源项目的"信誉背书"本身也是需要审视的资产**
---
## 八、局限与避坑指南（基于真实 Issue 和文档）
### 坑 1：坐标检测强依赖 Google ER 系列模型，不是"随便接个 LLM 就行"
`config/artemis.jsonc` 的注释里明文写着：**标准 LLM（含 Gemini Flash、GPT-4o、Claude 3.7）都没针对亚像素级坐标估计做调优，非 ER 系列模型会让空间坐标检测直接失败**。默认值是 `gemini-robotics-er-2-preview`，主控模型默认 `gemini-3.8-flash`。
虽然它也接受 OpenAI / Anthropic / OpenRouter / xAI 的 Key，但**核心定位能力是 Google 系独占的**。这意味着：
- **不能完全摆脱 Google 云的依赖**
- **API 调用成本不可忽视**——Gemini Robotics ER 1.6 级别模型定价约 $1.00/1M 输入 + $5.00/1M 输出，跑长任务+多截图，账单会比想象的高
- Pro 模式单步 15–40 秒，100 步任务一次跑下来大约 30–60 分钟，token 消耗不容小觑
### 坑 2：`batch` 命令会忽略 device_serial（截至 2026 年 9 月仍是 Open Issue）
Issue #135 指出，`artemis batch` 没有 `--device-serial` 参数，`ADB_DEVICE_SERIAL` / `ARTEMIS_DEVICE_ID` 环境变量会被静默丢弃，**可能导致任务跑在错误的目标手机上**。多设备团队在修复合入前，建议避开 batch 模式或做好设备隔离。
### 坑 3：Flash 模式对非 Gemini 兼容提供商会失败
Issue #138：Flash profile 的 step summarizer 和 memory chunker **硬编码了 Gemini API**，导致 OpenAI 兼容（非 Gemini）本地或第三方 LLM 跑不起来。本地 Ollama 预设目前也是坏的（Issue #131）。
### 坑 4：手机上会常驻一个 Accessibility Helper APK
它只在设备本机监听、不外发数据、可以随时 `artemis helper uninstall` 移除，但**在个人手机或客户的测试机上装这个，应该提前打招呼**。
### 坑 5：文件提取仍需手动 `adb pull`
rules.md 明确说，要把日志或测试产物从设备拉到 PC，最终还是要自己执行 `adb pull`，agent 的能力边界被有意限制在"设备内部自洽"。
### 坑 6：仅支持 Android，iOS 在路线图但未落地
路线图里的 Android Studio 深度集成、iOS 支持、端侧轻量化 VLM、语音双工交互——**四项全部未勾选**，属于"画饼阶段"。
### 坑 7：Windows 下 PowerShell 与 CMD 启动命令不同
PowerShell 默认不搜当前目录，必须 `.\start.bat` 且末尾**不能带反斜杠**；CMD 用 `start.bat` 即可。这个看似琐碎的细节让不少 Windows 用户在第一分钟就卡住。
### 坑 8：99.1% 这个数字别直接当选购依据
如前文所述，这个数字**未在官方 leaderboard 上、未独立验证、对比图漏掉了同分项目**。真正理性的做法是：**用 Flash 在你自家 App 的真实页面上跑 10 个任务，看失败 trace 的质量**——那才是最诚实的答案。
---
## 九、目标人群与实际收益
**强烈推荐上手的人**：
- **Android QA 工程师**：可以把 ARTEMIS 当成"探索式测试加速器"，把探索性测试、Bug 复现这类**最难脚本化**的工作交给它，自己专注写核心回归用例
- **AI IDE 重度用户**（Claude Code / Cursor / Antigravity / Windsurf）：MCP 集成让你在写代码的同时让另一个智能体在真机上验证改动，**"改完代码 → 装到真机 → 自动化验证 → 截图回传"这条链路零脚本**
- **独立开发者 / 小团队**：没有专职 QA，ARTEMIS 能以自然语言写"测试用例"，显著降低维护成本
- **移动端 Agent 研究者**：源码架构（Planner/Operator/Checker 三角色 + Safety Net + 执行事故机制）本身就是一份优秀的多智能体工程参考，`rules.md` 更是可直接复用的资产
**收益概括**：
- **省时间**：从"写 500 行 Appium 脚本"到"说一句话"
- **抗变更**：UI 改版不用改脚本，动态定位 + 视觉兜底天然耐造
- **提质量**：Pro 模式的 Safety Net 和 Checker 能发现脚本测试容易漏的异常弹窗、Crash 对话框
- **开眼界**：`rules.md` 和 Flash/Pro 分层设计展示了"如何把实战经验工程化为 Prompt 资产"
---
## 十、结语与行动建议
**ARTEMIS 值得你的下午时光去试一试，但不值得你直接把生产 CI 压在它身上。**
它的工程完成度——四张面孔共用一个引擎、Flash/Pro 双 profile 的差异化设计、MCP 一键集成 8+ 个 IDE、可实时回放的调试面板——在开源移动 Agent 里确实处于第一梯队，Google 的工程能力是实打实的。
但作为一个负责任的评测，必须把三件事放在同等权重上：**Benchmark 数字的自报属性、Minitap 的署名风波、以及 ER 系列模型带来的隐性 Google 锁定**。这三件事决定了它目前更适合被定位为"**强大的原型工具 + 架构参考实现**"，而非"**可托付的回归测试基础设施**"。
**给你的三步行动建议**：
1. **周末折腾一晚**：找一个 Android 模拟器 + 你自己的 App，用 `--profile flash` 跑 10 个真实场景，看 `mobile_inspect_trace` 里的失败原因分布——**这一步的回答比任何评测文章都准**
2. **读 `mcp_server/rules.md`**：无论你是否用它，这份文件都值得抄进你的团队 AI 行为规范里
3. **观察 3–6 个月再决定生产化**：关注它对 iOS 的落地、对非 Gemini 模型的真正解耦（Issue #138 / #131 的修复）、以及 `batch` 多设备的 bug 修复——这三件事完成后，它才有资格被写进 CI/CD 流水线
> **一个理性的收尾**：移动自动化正在从"**写脚本**"时代滑向"**说人话**"时代，ARTEMIS 不是终点，但它把"终点长什么样"画得比大多数人清楚。带着好奇心去用，带着怀疑精神去看数字，你会得到最大的价值。
---
**参考与延伸阅读**：项目仓库 [google/artemis](https://github.com/google/artemis)、Minitap 的公开回应 [I expected better from Google](https://www.minitap.ai/blog/i-expected-better-from-google)、独立分析 [A Thorough Analysis of Google's ARTEMIS](https://note.com/ai_driven/n/nc9dd0070c812)、AndroidWorld 官方仓库 [google-research/android_world](https://github.com/google-research/android_world)、Mobilerun 的 100% 实测报告
