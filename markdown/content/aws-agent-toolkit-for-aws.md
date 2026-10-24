# aws/agent-toolkit-for-aws

[GitHub URL](https://github.com/aws/agent-toolkit-for-aws)


## AWS Agent Toolkit for AWS 深度评测：让 AI 编码智能体按 AWS 最佳实践干活的官方工具链

> AWS 官方智能体工具箱，让 Claude Code、Cursor 等编码智能体不再瞎猜 AWS API，而是按官方最佳实践写代码

- **Tags**: AWS, MCP, AI Agent, Claude Code, 开源项目
- **Category**: AI 编程, 开发工具, 云服务

## Details

# AWS Agent Toolkit for AWS 深度评测：把 AI 编码智能体"焊"在 AWS 最佳实践上的官方工具链
## 一句话总结
**这是 AWS 官方在 2026 年 5 月 6 日 GA 的 AI 智能体工具箱，把"MCP Server + Skills + Plugins + Rules 文件"打包成一套开箱即用的组合拳，让 Claude Code、Codex、Cursor、Kiro、Devin 等编码智能体不再凭训练数据"瞎猜" AWS API，而是按 AWS 官方最佳实践行事。** 它也是 AWS Labs 那一堆分散的社区级 MCP 项目的"官方收编升级版"，如果你正在用任何 AI 编码智能体做 AWS 开发，这就是当前最值得装的官方工具链。†L8-L11】
---
## 背景与痛点：模型会"一本正经胡说八道"，AWS 受不了了
过去一年，开发者让 Claude Code、Cursor 之类的智能体写 AWS 代码时反复踩同一类坑：
- **知识过时**：模型训练截止日期早于新版服务发布，会自信地写出根本不存在的 `AWS::Bedrock::AgentCore` 资源类型，或使用已经弃用的 API。
- **架构选择凭直觉**：让智能体设计一个后端，它会把 Serverless、容器、Amplify 三个方案全部丢给你，再加一句"推荐方案 1"，但说不出为什么不用 REST API 而要用 HTTP API。
- **权限失控**：智能体用的是开发者本人的 IAM 凭证，一旦它在终端里"手滑"敲了个 `aws s3 rm --recursive`，CloudTrail 里看到的和真人操作完全一样，事后无法追溯是哪次会话、哪个智能体干的。
AWS 自己也早就意识到了这个问题，2025 年起在 **awslabs/mcp** 等仓库陆续发布了 40 多个独立的 MCP 服务器，但这些都属于社区级项目，没有官方 SLA、没有统一的安全护栏、没有端到端评估过的 Skill。于是 AWS 在 2025 年 11 月 30 日先放出了 **AWS MCP Server** 的预览版，半年后的 2026 年 5 月 6 日，把 MCP Server、Skills、Plugins、Rules 文件四件套整体打包，**以 AWS 官方支持的名义 GA**，命名为 Agent Toolkit for AWS。†L8-L11】
> **一个比喻**：如果说大模型是一个刚入职的"天才实习生"，那么 Agent Toolkit 就是 AWS 给它配的"工牌 + 操作手册 + 监控摄像头"。工牌是 IAM 条件键（限定它能做什么），操作手册是 Skills（告诉它最佳实践），监控摄像头是 CloudTrail（出事后能查到是谁干的）。
---
## 核心架构与四大组件剖析
整个 Toolkit 由四层组件构成，每层职责清晰、可独立使用。†L17-L18】
### 1. AWS MCP Server —— 总接线员
一个由 AWS 托管的远程 MCP 服务器，通过 Model Context Protocol 暴露 300+ AWS 服务的统一接入点。它包含 8 个左右的工具，可分为两类：†L18-L20】
| 工具 | 是否需 AWS 凭证 | 用途 |
|---|---|---|
| `aws___search_documentation` / `aws___read_documentation` | 否 | 实时检索最新 AWS 文档 |
| `aws___retrieve_skill` | 否 | 按需加载 Skill 文件 |
| `aws___list_regions` / `aws___get_regional_availability` | 否 | 查询服务区域可用性 |
| `aws___run_script` | 是 | 在沙箱里执行 Python 脚本调用 AWS API |
| `aws___get_presigned_url` / `aws___get_tasks` | 是 | S3 预签名 URL / 长任务状态 |
MCP Server 本身部署在 **us-east-1 和 eu-central-1** 两个区域，但可以访问所有商业区域的 AWS 服务。†L12-L13】注意，这是**托管服务**，意味着你不需要在自己机器上跑 Node 进程，只需通过一个 `mcp-proxy-for-aws` 代理转发即可。
### 2. Skills —— "AWS 最佳实践知识库"
Skill 本质是一个目录，里面放着 `SKILL.md` 主文档和可选的 `references/` 子目录，按需加载，**不会一次性塞满上下文**。截至 2026 年 9 月，官方公布数量已超过 40 个，分为两大类：†L18】
- **Core Skills**（随 `aws-core` 插件安装）：覆盖 SDK 使用（Python/JavaScript/Swift）、IaC（CDK/CloudFormation）、Serverless、容器、IAM、可观测性（CloudWatch/X-Ray/CloudTrail）、成本管理、Bedrock 等。
- **Specialized Skills**：按 AWS 服务分类（Analytics、Database、EC2、Migration、Networking、Operations、Security、Serverless、Storage、Web & Mobile），提供端到端操作流程，比如"创建数据湖表"、"按最佳实践启动 EC2"、"排查 EFS 连通性"。
每个 Skill 在发布前都经过 **端到端工作流评估**——这点比社区项目"作者写完就 push"要可靠得多。
### 3. Plugins —— 一键打包
Plugin = MCP Server 配置 + 一组 Skills，目前提供 5 个：
| Plugin | 适合谁 |
|---|---|
| **aws-core** | 所有 AWS 开发者，**建议从这里开始** |
| **aws-agents** | 在 AWS 上用 Bedrock/AgentCore 构建 AI Agent |
| **aws-data-analytics** | 数据湖、ETL（S3 Tables / Glue / Athena） |
| **aws-agents-for-devsecops** | 事故调查、代码扫描、渗透测试 |
| **aws-startup-advisor** | 初创公司 SA，提供最省钱的架构 + Azure/GCP/Heroku 迁移 |
Plugin 目前支持 **Claude Code、Codex、Cursor、Devin** 一键安装；Kiro 和 fx 则通过 MCP 配置 + 本地 Skill 目录的方式接入。
### 4. Rules 文件 —— "使用说明书"，但最容易忽略
这是评测中被反复点名的"隐藏关卡"。仓库 `rules/aws-agent-rules.md` 里的规则文件只有十几行，但决定了智能体**会不会主动**用前面三件套。核心规则包括：
> - 优先通过 AWS MCP Server 调用 AWS，不可用时退回 AWS CLI
> - 开始任务前先检查是否有相关 Skill，用 `retrieve_skill` 加载并优先于一般知识
> - 拿不准 API 参数/权限/限制时，**查文档而不是猜**
> - 创建基础设施时优先用 IaC（CDK/CloudFormation）而不是直接敲 CLI
> - 资源命名不要用 em dash（——），用连字符
一个真实案例：作者漏配了 Rules 文件，结果智能体对同一个 CRUD 需求给出了 3 个含糊方案；加上 Rules 后，直接给出"HTTP API + Cognito JWT authorizer + 一个函数一个路由"的明确架构，并主动标出 30 秒超时、10MB 载荷等约束。
---
## 上手体验：5 分钟跑通
### Claude Code（最简）
进入 Claude Code 终端输入一条命令：
```bash
/plugin install aws-core@claude-plugins-official
```
如果提示 `Plugin not found`，先执行 `/plugin marketplace update claude-plugins-official`。
### Kiro / fx / 其他 MCP 兼容智能体
需要两步：**配置 MCP Server** + **装 Skills**。
`.kiro/settings/mcp.json` 示例：
```json
{
  "mcpServers": {
    "aws": {
      "command": "uvx",
      "args": [
        "mcp-proxy-for-aws@1.6.4",
        "https://aws-mcp.us-east-1.api.aws/mcp",
        "--metadata",
        "AWS_REGION=us-west-2"
      ]
    }
  }
}
```
然后一条命令装所有 Skills：
```bash
npx skills add aws/agent-toolkit-for-aws/skills
```
Skill 会落到 `~/.kiro/skills/`（全局）或 `.kiro/skills/`（项目级）。
### AWS CLI 一键配置
如果你只想快速试水：
```bash
aws configure agent-toolkit
```
> **容易踩的坑**：Kiro 文档建议**锁定代理版本号**（如 `@1.6.4`）以避免供应链风险，不要长期跟随 `@latest`。
---
## 真实效果对比：加了 Toolkit 前后差在哪
来自 dev.to 上的公开实测，让智能体设计一个 Serverless CRUD 后端：
| 维度 | 不加 Toolkit | 加 Toolkit + Rules |
|---|---|---|
| 架构建议 | 3 个方案并列 + 模糊推荐 | 单一方案 + 决策表说明为什么 |
| API Gateway | 只说"API Gateway" | 明确说"HTTP API，因为 REST API 除非要 WAF 否则过度" |
| 鉴权方案 | "Cognito 或自写 Lambda + bcrypt" | "HTTP API 原生支持 JWT，直接用 Cognito authorizer，无需 Lambda authorizer" |
| 函数模式 | 未提及 | 主动建议"一个函数一个路由" |
| 约束提醒 | 无 | 主动标注 30 秒超时、10MB 限制、HTTP API 不支持 WAF、JWT scope 不匹配会静默 403 |
| 信息来源 | 模型训练数据 | AWS 文档 + `aws-serverless` Skill 决策表 |
简单 CRUD 场景下两者都能跑通，但 Toolkit 让答案**从"能跑"升级为"按 AWS 推荐姿势跑"**。在事件驱动、多模式混合架构等更复杂场景下差距会进一步放大。
---
## 竞品横向对比
| 方案 | 维护方 | 形态 | 安全护栏 | 是否官方支持 | 适用场景 |
|---|---|---|---|---|---|
| **Agent Toolkit for AWS** | AWS 官方 | MCP Server + Skills + Plugins + Rules | IAM 条件键 + CloudTrail + CloudWatch | ✅ 是 | 生产级 AWS 开发 |
| **awslabs/mcp** | AWS Labs（社区） | 40+ 个独立 MCP Server | 自管 IAM | ❌ 社区级 | 实验、学习、特定服务深度集成 |
| **Strands Agents SDK** | AWS 开源 | Agent 构建框架 | 自管 | ❌ 开源 | **构建自己的 Agent**（不是让编码智能体用 AWS） |
| **原生 Claude Code / Bedrock Agents** | Anthropic / AWS | 框架内置工具 | 自管 | ✅ 各自官方 | 通用编码、不绑定 AWS |
| **LangChain AWS Tools** | LangChain | Python 库 | 自管 | ❌ 社区 | 自己写 Python 调用 AWS |
需要厘清一点：**Strands Agents 是用来"造 Agent"的框架，Agent Toolkit 是给"编码 Agent"装备的"工具带"**，二者不是替代关系，可以叠加使用。
相比 awslabs/mcp 旧仓库，Agent Toolkit 的三个核心升级是：
1. **IAM 条件键 `aws:ViaAWSMCPService` 和 `aws:CalledViaAWSMCP`**：可以在 SCP/IAM 策略里精确区分"智能体调用"和"人类调用"，比如**即使开发者本人的 IAM 角色可以删资源，也强制智能体只读**。
2. **CloudWatch 指标 + CloudTrail 审计**：每次智能体调用都有记录，可追溯到具体会话。
3. **Skill 经过端到端评估**：跟着 Skill 走的步骤已被验证能跑通。
要注意的是，这两个条件键**只对走 AWS 托管 MCP Server 的调用生效**，如果智能体绕过 MCP Server 直接用 AWS SDK/CLI 调用，AWS 也无法在请求中标记"这是智能体"——这点在 hidekazu-konishi 的技术博客里有详细辨析。†L4-L5】
---
## 目标人群与收益
| 你是谁 | 收益 | 建议装的 Plugin |
|---|---|---|
| **用 Claude Code/Cursor/Kiro 写 AWS 后端的全栈工程师** | 不再踩"模型瞎编 API"的坑，架构建议对齐 Well-Architected | aws-core |
| **数据工程师 / 数据平台负责人** | 数据湖、Glue、Athena 工作流按 AWS 官方流程执行 | aws-data-analytics |
| **DevSecOps / SRE** | 事故调查、代码漏洞扫描、UAT 自动化 | aws-agents-for-devsecops |
| **初创公司技术负责人** | 最省钱的架构方案，能直接迁 Azure/GCP/Heroku，还能查 AWS Activate 抵扣券 | aws-startup-advisor |
| **构建 AI Agent 产品的工程师** | 用官方最佳实践接 Bedrock / AgentCore | aws-agents |
| **云平台安全治理负责人** | 通过 IAM 条件键给"智能体"设单独的策略边界 | aws-core + 自定义 IAM |
---
## 局限与不足（必须坦诚说清楚）
### 1. Skills 不会自动加载，要靠 Rules 文件"踢一脚"
这是评测中发现最多人踩的坑：装了 Skills 但没配 Rules 文件，智能体仍然凭训练数据回答，新装的"知识库"在架子上落灰。**装完 Toolkit 后必须把 `rules/aws-agent-rules.md` 复制到对应智能体的 Rules 位置**（如 Claude Code 的 `CLAUDE.md`、Kiro 的 `.kiro/steering/`）。
### 2. MCP Server 区域限制
Server 本身只在 us-east-1 和 eu-central-1 跑，国内或亚太区用户访问延迟会偏高，对延迟敏感的工作流可能要自行评估。†L13】
### 3. 锁版本是双刃剑
官方建议锁定 `mcp-proxy-for-aws@1.6.4` 避免供应链风险，但这也意味着**需要自己定期关注 PyPI 上的新版本并手动升级**，跟"自动获取最新 Skill"的体验有冲突。
### 4. 工具仍在快速演化，会废弃
`aws___call_aws` 工具在 2026 年 7 月 15 日标记废弃、8 月 31 日移除，被 `aws___run_script` 取代。如果你的工作流依赖某个具体工具名，需要跟紧官方 Changelog。†L18-L20】
### 5. 不解决"绕过 MCP"的问题
如果智能体直接在你本机执行 `aws` CLI 命令，AWS 是无法在 CloudTrail 里把它标记出来的，**安全边界只对走托管 MCP Server 的调用生效**。†L4-L5】
### 6. 上下文消耗可观
Skill 是按需加载的，但 `aws-core` 插件本身就包含 30+ 个 Skill，检索 + 加载的 token 消耗并不低。对 token 敏感的订阅计划（如 Claude Pro）要有心理准备。
### 7. 仓库活动指标
截至当前抓取，仓库 **40 个 open issues、24 个 PR**，没有 Release tag（AWS 走的是 What's New + 文档更新发布模式，不走 GitHub Release）。这种模式对跟进变更提出了更高要求。
---
## 结语与行动建议
**这是一套"AWS 想清楚了才做"的官方工具链，而不是赶 MCP 风口的跟风之作。** 它把过去散落在 awslabs/mcp 等仓库的能力整合、补全了企业最关心的安全护栏（IAM 条件键 + 审计）、加入了经过评估的 Skill 库，并且一上来就覆盖了 Claude Code、Codex、Cursor、Kiro、Devin、fx 等几乎所有主流编码智能体，诚意和完成度都明显高于社区阶段的 awslabs 项目。
如果你符合以下任一情况，**本周就值得装起来**：
- 用 AI 编码智能体做 AWS 后端/IaC/Serverless 开发，但常被模型"瞎编" API 烦到
- 团队对"让智能体操作生产 AWS 账号"心存顾虑，需要可审计、可限权的方案
- 数据/AI/DevSecOps 团队想用统一的 Skill 体系标准化智能体的 AWS 操作
**推荐的渐进式路径**：
1. **第一周**：在 Claude Code 或 Cursor 里装 `aws-core` 插件，**把 Rules 文件复制进项目**，先用一个非生产 AWS 账号跑一个 CRUD/Serverless 项目做试点。
2. **第二周**：根据团队方向加 `aws-data-analytics` / `aws-agents` / `aws-agents-for-devsecops` / `aws-startup-advisor` 中对应的一个。
3. **第三周**：在 IAM 里配置 `aws:ViaAWSMCPService` 条件键，**强制智能体走只读角色**，再观察 CloudTrail 里的调用记录，对照调整权限。
4. **长期**：订阅仓库 + AWS What's New，关注工具废弃公告（如 `aws___call_aws` 移除时间点），并保持 `mcp-proxy-for-aws` 代理版本的定期更新。
一句话收尾：**它不是让你"会写更多 AWS 代码"，而是让你"让智能体按 AWS 的方式写 AWS 代码"**——在 2026 年这个 AI 编码智能体大量进入生产环境的时点，这种"官方收编"的工具会越来越值钱。
