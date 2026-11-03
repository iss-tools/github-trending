# floci-io/floci

[GitHub URL](https://github.com/floci-io/floci)


## Floci 深度评测：免费开源的 AWS 本地仿真器，LocalStack 停更后的最佳接棒者

> Floci 是一款 MIT 协议、完全免费的 AWS 本地仿真器，24 毫秒启动、90MB 镜像，用真 Docker 跑 RDS/EKS/Lambda，是 LocalStack Community 停更后的强力替代品。

- **Tags**: AWS, 本地仿真, 开源项目, 测试工具, LocalStack替代
- **Category**: 开发工具, 云原生, DevOps/测试

## Details

# Floci 深度评测：LocalStack 停更后，AWS 本地仿真的"接盘侠"真的能打吗？
> 一句话定位：**Floci 是一款 MIT 协议、完全免费、开箱即用的 AWS 本地仿真器（Local AWS Emulator），以"轻、快、不设卡点"的姿态，正面接棒 2026 年 3 月停更的 LocalStack Community 版本**。如果你被 LocalStack 的 token 登录墙、Pro 版收费墙逼到墙角，或者只是想要一个 20 毫秒就绪、不到 100 MB 的本地 AWS 环境，Floci 值得放进你的工具箱试一试。
---
## 一、背景与痛点：Floci 为什么会在这个时间点出现
要理解 Floci 的出现节奏，得先看清它瞄准的那块蛋糕——**"AWS 本地仿真"这个赛道此前几乎是 LocalStack 一家独大**。
开发者在本地或 CI 里测试一段涉及 S3、DynamoDB、SQS、Lambda 的代码，传统做法只有两条路：
1. **直接连真云**：慢、贵、有泄露风险，CI 流水线里拉一条跨地域网络就可能让你心态爆炸；
2. **用 LocalStack**：曾经是事实标准，但 Community 版在 2026 年 3 月正式"日落"——**强制要求 Auth Token、安全更新冻结、众多服务能力被划进 Pro 墙内**。
Floci 的 README 把这两点直接拍在台面上：它要解决的就是 **"本地跑 AWS 却被迫付费 / 被迫登录 / 被迫担心安全更新停摆"** 这三重痛点。更妙的是它的**命名哲学**——floci 取自 *floccus*，一种看起来像爆米花的云，恰好呼应"云 + 轻 + 蓬松"的产品意象，整个 Floci 家族还规划了 Azure（floci-az, 4577）、GCP（floci-gcp, 4588）、OCI（floci-oci, 4599）三兄弟，野心可见一斑。
**用一句比喻**：如果把真云比作"必须开饭馆才能吃一口"的重资产模式，LocalStack 像一家逐渐收起免费小菜的私房菜，那 Floci 就是把整套灶台直接搬进你厨房的自助机——你点什么火它就着什么火，不用办会员卡。
---
## 二、技术架构剖析：JVM 底座 + "虚实结合"的双层仿真
Floci 不是从零造轮子，它的技术路线相当务实。
### 2.1 底座：Quarkus + Vert.x + JAX-RS
从 README 中的架构图和 `QUARKUS_LOG_LEVEL` 环境变量可以判断，Floci 是用 **Quarkus 框架**（Java 生态为 GraalVM 原生编译优化的框架）+ **Vert.x / JAX-RS** 路由层构建的。这解释了它最硬的两张王牌：
- **~24 毫秒启动**：Quarkus 配合 GraalVM 原生镜像编译，把 JVM 应用冷启动压到毫秒级，对比 LocalStack 的 ~3.3 秒快了一个数量级；
- **~13 MiB 空闲内存**、**~90 MB 镜像体积**：对 CI 短命容器极友好。
它还发布了一个 **~40 MB 的原生二进制 `floci-aws`**，覆盖 Linux / macOS / Windows——没有 Docker 的环境也能跑。这个细节说明团队对"CI runner 内存紧张 / 不允许挂 Docker socket"这类真实痛点是有体感的。
### 2.2 灵魂设计：In-process + Real Docker 的"分层保真"
这是 Floci 最值得称道的架构决策。**它没有用"全部 Mock"或"全部真容器"这种一刀切，而是按服务特性分层**：
| 层级 | 仿真方式 | 覆盖服务 |
|---|---|---|
| **Stateless** | 进程内纯逻辑模拟 | SQS、SNS、IAM、STS、KMS、Secrets Manager、EventBridge、Step Functions、CloudFormation、API Gateway、Cognito、Route53… |
| **Stateful** | 进程内持久化模拟 | S3、DynamoDB、DynamoDB Streams |
| **Container** | 真实 Docker 拉起 | Lambda（用 AWS 官方 runtime 镜像）、RDS（真 PostgreSQL/MySQL/MariaDB）、ElastiCache（真 Valkey）、MSK（用 Redpanda）、Neptune（Gremlin Server 或 Neo4j）、DocumentDB（真 MongoDB 7.0）、OpenSearch、EKS（真 k3s）、MWAA（真 Airflow + Postgres）、Athena（DuckDB sidecar） |
**这个设计的精妙之处在于**：你跑一个 `aws sqs create-queue` 不需要真的拉一个 RabbitMQ 容器，毫秒级返回；但当你调用 `aws lambda invoke`，Floci 会真的起一个 `public.ecr.aws/lambda/<runtime>` 容器，让你的代码在原生 AWS 运行时里执行——这种"按需加热"的策略，在保真度和资源消耗之间做了正确的取舍。
**用比喻讲**：Stateless 层像是"用乐高搭个收银台模型"，够用就行；Container 层像是"真的请一位厨师在后厨现做"——只在真正需要味道的地方花真金白银。
### 2.3 存储可插拔：四种模式，对应四种使用场景
| 模式 | 行为 | 适用 |
|---|---|---|
| `memory` | 全内存，容器停即失 | CI 临时测试 |
| `persistent` | 每次写盘，强一致 | 需要立即落盘 |
| `hybrid` | 内存性能 + 5 秒异步刷盘 | **本地开发（推荐默认）** |
| `wal` | 写前日志，最高持久性 | 模拟真实生产 RPO |
用 `FLOCI_STORAGE_MODE` 一行环境变量切换，对 CI/CD 矩阵跑不同模式的场景非常友好。
### 2.4 多账户隔离：一个巧妙的小彩蛋
如果你的 `AWS_ACCESS_KEY_ID` 是 **12 位数字**（恰好等于真实 AWS 账户 ID 格式），Floci 会自动把它当作 account ID，做**资源级隔离**——同一台 Floci 里，账户 `111111111111` 和 `222222111111` 各自的 S3 bucket、SQS queue 互相看不见，连 STS AssumeRole 后的临时凭证也会路由到正确的账户。这意味着你可以在本地演练跨账户 IAM、 Organizations 嵌套 OU、Control Tower 这类原本只能在真云才能复现的场景。
---
## 三、DX（开发者体验）：从 Quick Start 到 Testcontainers
Floci 在开发者体验上做到了"三条命令进入正题"。
### 3.1 最小上手示例（可直接复制）
**Step 1：启动**
```yaml
# compose.yaml
services:
  floci:
    image: floci/floci:latest
    ports:
      - "4566:4566"
```
```bash
docker compose up -d
```
**Step 2：注入环境变量**
```bash
export AWS_ENDPOINT_URL=http://localhost:4566
export AWS_DEFAULT_REGION=us-east-1
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
```
**Step 3：用你熟悉的 AWS CLI 原样操作**
```bash
aws s3 mb s3://my-bucket
aws dynamodb create-table \
  --table-name demo-table \
  --attribute-definitions AttributeName=pk,AttributeType=S \
  --key-schema AttributeName=pk,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```
这里最值得点出的是 **`AWS_ENDPOINT_URL` 这个 AWS SDK 官方环境变量**——它意味着你**不需要在代码里写任何 `endpoint_url` 参数**，只要该 SDK 是较新版本，自动就会把请求打到 Floci。这是 IaC 和 SDK 集成最优雅的方式。
**Step 4：浏览器打开 `http://localhost:4566/_floci/ui`**，有一个 Web Console Sidecar 自动启动，可以可视化查看 bucket、queue、Lambda 等。
### 3.2 Java / Python / Node / Go / Rust 的一等公民支持
README 用近一页篇幅列出了五大语言 SDK 的端到端示例，下面这段是 **boto3** 的最小写法：
```python
import boto3
client = boto3.client(
    "ssm",
    endpoint_url="http://localhost:4566",
    region_name="us-east-1",
    aws_access_key_id="test",
    aws_secret_access_key="test",
)
client.put_parameter(
    Name="/demo/app/message",
    Value="hello from floci",
    Type="String",
    Overwrite=True,
)
```
Rust、Go、Node v3 SDK 的写法在 README 中也都有现成片段，几乎是"复制即用"。
### 3.3 Testcontainers 一等集成：CI 的真正杀手锏
Floci 为 **Java / Node / Python / .NET / Go（进行中）** 提供了官方 Testcontainers 模块，可以在测试启动时拉起一个**隔离的 Floci 实例**，避免共享状态、端口冲突。
Java 示例（Junit 5 + Testcontainers）：
```java
@Testcontainers
class S3IntegrationTest {
    @Container
    static FlociContainer floci = new FlociContainer();
    @Test
    void shouldCreateBucket() {
        S3Client s3 = S3Client.builder()
                .endpointOverride(URI.create(floci.getEndpoint()))
                .region(Region.of(floci.getRegion()))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(
                            floci.getAccessKey(), floci.getSecretKey())))
                .forcePathStyle(true)
                .build();
        s3.createBucket(b -> b.bucket("my-bucket"));
    }
}
```
### 3.4 用"自证清白"的方式回答"真的兼容吗"
这是 Floci 最有说服力的部分：它在 `compatibility-tests/` 目录下维护了一整套针对主流 SDK 与 IaC 工具的**自动化兼容性测试**，规模相当可观：
| 模块 | 语言 / 工具 | 测试数量 |
|---|---|---|
| sdk-test-java | Java 17 + AWS SDK v2 | **1,326** |
| sdk-test-node | Node + AWS SDK v3 | 449 |
| sdk-test-python | Python + boto3 | 311 |
| sdk-test-go | Go + AWS SDK v2 | 157 |
| sdk-test-awscli | Bash + AWS CLI v2 | 205 |
| compat-terraform | Terraform v1.10+ | 67 |
| compat-opentofu | OpenTofu v1.9+ | 41 |
| compat-cdk | AWS CDK v2+ | 20 |
合计 **2,576 个自动化兼容性测试** 跨 5 个 SDK 和 3 个 IaC 工具——这在开源 AWS 仿真器里是罕见的工程纪律。对使用者来说，这意味着"我踩到的坑，大概率 CI 已经帮我测过了"。
---
## 四、服务覆盖广度：一张足够长的"服务地图"
Floci 的服务覆盖广度非常激进，**按类别扫一遍就能感受它的野心**：
- **核心应用**：S3、SQS、SNS、DynamoDB、Lambda（含 MicroVMs 与 Web Functions）、IAM、STS、KMS、Secrets Manager、SSM
- **事件 / 编排**：EventBridge（含 Pipes、Scheduler）、Step Functions、SWF、CloudWatch（Logs/Metrics/OAM/RUM/AMP）
- **API / 身份**：API Gateway REST & v2、AppSync、Cognito、ACM、Route53、Global Accelerator
- **容器 / 计算**：ECS、EC2（真容器）、Lightsail、EKS（真 k3s）、ECR、CodeBuild、CodeDeploy、CodePipeline、AWS Batch、Elastic Beanstalk、ELB v2
- **数据 / 分析 / AI**：Athena（+ DuckDB）、Glue、Lake Formation、EMR、Redshift、Firehose、Managed Apache Flink、OpenSearch、S3 Tables、**S3 Vectors**（向量桶，含 cosine 相似度查询）、Textract/Transcribe/Comprehend/Rekognition/Translate（stub）、Bedrock / Bedrock Runtime / Bedrock AgentCore
- **数据库 / 缓存**：Aurora DSQL（真 PostgreSQL 16 + TLS + IAM token）、RDS（PostgreSQL/MySQL/MariaDB）、Neptune（Gremlin 或 Neo4j 后端）、DocumentDB（真 MongoDB 7.0）、MemoryDB、ElastiCache、Timestream for InfluxDB
- **消息 / 传输**：SES、Kinesis、MSK（真 Redpanda）、Amazon MQ（真 RabbitMQ）、Transfer Family、DataSync、IoT Core、Amazon Connect
- **安全 / 治理**：Network Firewall、RAM、WAF v2、GuardDuty、Inspector、CloudTrail、CloudFront、IAM Identity Center (SSO)、Macie、Detective、Security Hub、Verified Permissions（带 Cedar 4 sidecar 真解析）、Control Tower、Service Catalog
- **成本**：Budgets、Pricing、Cost Explorer、CUR 2.0、FOCUS 1.2
亮点有两个：
1. **API Gateway v2（HTTP API）和 Cognito 是免费的**——这两项在 LocalStack 里属于 Pro 付费能力；
2. **Bedrock Runtime 是 stub（假响应）**，这点下文会展开——它是覆盖列表中"看起来有但实际没用"的典型，**不要被列表长度迷惑**。
---
## 五、与 LocalStack 的正面对比：同一道菜的不同定价
Floci 的 README 直接放了一张硬碰硬的对照表，我们尊重原数据，加上一点解读：
| 维度 | **Floci** | **LocalStack Community** | 解读 |
|---|---|---|---|
| Auth Token | 不需要 | **强制要求** | LocalStack 2026.3 之后连 Community 都要 token，CI 里同步 token 成了新摩擦点 |
| 安全更新 | 持续 | **冻结** | 这是企业安全团队最在意的"红线" |
| 启动时间 | **~24 ms** | ~3.3 s | 对 CI 短命容器是 100 倍级别的体验差 |
| 空闲内存 | **~13 MiB** | ~143 MiB | 1/10 的占用 |
| 镜像大小 | **~90 MB** | ~1.0 GB | 拉镜像时间从分钟级到秒级 |
| License | **MIT** | 受限许可 | MIT 意味着可以自由分叉、商用、内嵌 |
| API Gateway v2 | ✅ | ❌（Pro） | 本地 HTTP API 测试无需付费 |
| Cognito | ✅ | ❌（Pro） | 本地用户池 + JWKS |
| RDS / ElastiCache / MSK | **真 Docker** | ❌（Pro） | 这是 Floci 反超的"反向 Pro 化" |
| Neptune | 真 Docker | ❌ | 图数据库本地仿真几乎空白 |
| DocumentDB | 真 MongoDB | ❌ | 同上 |
| ECS / EC2 / EKS | 真 Docker | ❌ | k3s 真集群 |
| CodeBuild | 真执行 | ❌ | buildspec 真跑 |
| 原生二进制 | ~40 MB | 无 | 无 Docker 环境可跑 |
**总结一句**：在 LocalStack 把大量能力"Pro 化"并要求 token 的同时，Floci 走了完全相反的路——**把那些原本需要 Pro 的能力（真 Docker 数据库、真 EKS、真 CodeBuild、API Gateway v2、Cognito）全部免费开放**。这是典型的"用开源社区的诚意对抗商业化围栏"。
### 其他同类工具一笔带过
- **Moto**：Python 生态的进程内 AWS mock，纯 Python 库形态，部署轻，但服务覆盖远不及 Floci，且没有"真 Docker"路线；
- **MinIO**：只解决 S3 兼容存储，不做全 AWS 仿真，两者是互补而非竞争；
- **ElasticMQ**：只做 SQS 兼容；
- **Testcontainers + 各服务原生镜像**：方案灵活但你要自己拼"假 IAM / 假 CloudFormation"的拼图，Floci 把这块统一协调了。
**Floci 的独特生态位**：唯一同时做到"MIT 免费 + 广服务覆盖 + 真 Docker 后端 + 原生二进制 + 2500+ 自动化兼容测试"的 AWS 仿真器。
---
## 六、目标人群与收益
不同角色从 Floci 拿到的收益差异挺大，挑重点说：
### 🎯 后端 / 云原生开发者
- **收益**：本地完整复现 "Lambda → SQS → DynamoDB → S3" 这类典型链路，单测反馈从分钟级降到秒级；不再为 S3 / DynamoDB 的测试花一分钱；
- **特别适合**：写 Serverless、事件驱动架构、CDK/Terraform 的工程师。
### 🎯 平台 / DevOps / CI 工程师
- **收益**：把 LocalStack 替换为 Floci 是真正的 **drop-in**——README 明确列出了环境变量映射（`LOCALSTACK_HOST` → `FLOCI_HOSTNAME`、`PERSISTENCE=1` → `FLOCI_STORAGE_MODE=persistent` 等），连 `/etc/localstack/init/` 下的初始化脚本都能原样运行，连日志末尾的 `Ready.` 字符串都保留了，Testcontainers 的 `LocalStackContainer` 等待策略直接通用；
- **镜像名替换一行**：`localstack/localstack` → `floci/floci:latest`，如果要跑 init 脚本里有 AWS CLI 或 boto3，用 `floci/floci:latest-compat`。
### 🎯 云成本敏感的初创 / 自由职业者
- **收益**：开发期间不烧一分钱 AWS 费用；本地演练跨账户 IAM、Organizations、Control Tower 这类"平时只敢在沙箱里玩"的场景。
### 🎯 AWS 学习者 / 备考 SAA / SAP 的同学
- **收益**：可以无门槛地摸到 Redshift、Kinesis、MSK、EKS、Aurora DSQL 这些平时只在视频里见过的服务；用 Web Console 可视化观察资源。
### 🎯 不太适合的人群
- 需要**真实模拟 Bedrock LLM 推理**的（它只是 stub）；
- 需要**无 Docker 环境**做深度数据服务测试的（虽然有 40 MB 原生二进制，但真 Docker 服务跑不了）；
- 公司**禁止挂载 docker.sock** 的高合规环境（Container 类服务会失效）。
---
## 七、局限与不足：别被列表长度骗了
评测必须客观，Floci 不是万能的，以下几个"坑点"必须摆在台面上：
### 7.1 Stub ≠ 真实，AI 类服务是"形似神不似"
README 自己写得很诚实：**Bedrock Runtime 是 "In-process stub"，返回 dummy Converse / InvokeModel 响应**；Textract、Transcribe、Comprehend、Rekognition、Translate 也是 stub。如果你需要本地测试"调 LLM 然后解析结果"的代码，Floci 只能帮你打通"调用链路"，但**模型输出是假的**，比如流式响应、Token 计费、模型延迟这些真实感完全不存在。
**怎么办**：把 endpoint 切到本地 Ollama / vLLM，或者用 LocalAI、LiteLLM 这类专门的 LLM 网关替代。
### 7.2 真 Docker 服务的资源代价
尽管 Floci 自身只有 13 MiB，但一旦你创建一个 RDS PostgreSQL 或 EKS 集群，**背后就是一个真容器**——内存压力立刻转移到宿主机。`docker.sock` 挂载是必备项，CI 的 runner 需要预留 Docker-in-Docker 或 docker socket 挂载权限。
### 7.3 IAM 授权语义是"宽松模式"
README 提到 "Credentials can be any non-empty values unless you explicitly enable stricter service-specific auth checks"——也就是说，**默认情况下 IAM policy 不会被严格校验**，你的策略写错了也照样能跑通。这对"测试业务逻辑"很友好，但**对"测试 IAM 边界"是陷阱**——如果你们团队在演练 S3 桶策略、KMS key policy 或 SCP 边界，必须显式开启严格模式，或者老老实实去真云验证。
### 7.4 项目年龄与成熟度风险
Floci 虽然功能列表非常激进，但作为一个相对新的项目（前身 `hectorvent/floci`，现已迁移到 `floci-io` 组织），**社区规模、第三方插件生态、长期维护承诺**都还在验证期。相比 LocalStack 多年沉淀的周边（ VS Code 插件、CI Action、社区 recipes），Floci 还在补课。
**缓解方案**：镜像用 pinned 版本（`floci/floci:x.y.z`）而非 `latest`，避免 nightly 破坏性变更；核心路径配真云或 LocalStack Pro 做交叉验证，关键 P0 测试别只押注 Floci。
### 7.5 复杂服务的"仿得像"不等于"一样"
CloudFormation 支持 StackSets（跨账户实例）是亮点，但 AWS 真实的 CloudFormation 有 drift detection、deletion policy、custom resource provider 等大量细节。**用 Floci 测试"模板语法对不对"没问题，但别期望它 100% 复现 CloudFormation 的所有角落案例**。同理，EMR、Redshift 这类重型服务在 Floci 里更多是控制面仿真的"骨架"，真正跑 Spark 作业还是得用真 EMR。
---
## 八、行动建议：从试用到落地的三步路径
如果你读到这里想动手试一下，给你一条最低摩擦的路径：
### 第一步：5 分钟冒烟测试（验证基本可用）
```bash
docker run -d --name floci -p 4566:4566 floci/floci:latest
export AWS_ENDPOINT_URL=http://localhost:4566
export AWS_DEFAULT_REGION=us-east-1
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
aws s3 mb s3://hello-floci && aws s3 ls
```
打开 `http://localhost:4566/_floci/ui`，看到你刚建的 bucket 出现在 Web Console 里，就算通了。
### 第二步：把 LocalStack 换掉（如果你已经是 LocalStack 用户）
```yaml
# compose.yaml 修改一行
services:
  floci:
    image: floci/floci:latest   # 或 latest-compat
    ports:
      - "4566:4566"
```
把原本的 `LOCALSTACK_*` 环境变量按 Floci 的映射表改一下，`/etc/localstack/init/` 下的脚本原样保留即可。这一步建议先在开发分支跑一轮完整 CI，观察 2,576 个官方兼容性测试中你关心的 SDK 是否有回归。
### 第三步：针对高保真场景解锁真 Docker 能力
```bash
docker run -d --name floci \
  -p 4566:4566 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -u root \
  floci/floci:latest
```
挂上 Docker socket 后，RDS、ElastiCache、Neptune、EKS、CodeBuild 这些"真容器"服务才会激活。注意 `-u root` 在某些受管 Docker 环境可能不被允许，这时候只能用 in-process 的子集。
### 关于"是否值得投入"的终极判断
**短期（2026 年内）**：Floci 是 LocalStack Community 用户最顺理成章的迁移目的地，迁移成本几乎为零，能力反而变多。
**中期（6–18 个月）**：能否长期胜出取决于它**社区能否形成 LocalStack 那样的 recipe 生态**，以及**团队对 100+ 服务的持续跟进能力**（AWS 每年都在发布新服务，仿真器追赶的成本非常高）。
**一个理性策略**：把 Floci 放在"本地开发 + 快速 CI 反馈"这一层，把关键路径的端到端测试、IAM 边界验证、AI 推理相关代码留在真云或更专业的工具（Bedrock 用 Ollama/vLLM，IAM 边界用 AWS Organizations 沙箱）。**Floci 是一把好用的瑞士军刀，不是要替你走进 AWS 数据中心的那把万能钥匙**。
---
如果它未来某一天真能撑起"Any Cloud. Locally"这个愿景——把 Azure、GCP、OCI 三兄弟都做出同等完成度——开源社区就真的多了一件值得写进 DevOps 教科书的工具。但目前，先享受它对 LocalStack 那记干脆利落的"接棒暴击"就好。
