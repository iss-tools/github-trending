# rustfs/rustfs

[GitHub URL](https://github.com/rustfs/rustfs)


## RustFS：高性能 Rust 编写的 S3 兼容对象存储

> 基于 Rust 的 S3 对象存储，性能优于 MinIO 且无 AGPL 限制。

- **Tags**: Rust, S3存储, 开源项目, 高性能, 云原生
- **Category**: 开发工具, 基础设施, 数据存储

## Details

<|assistant|>打开 Star History 的具体仓库页面，以确认 star 数量和增长趋势。</think>
# RustFS 深度评测
---
## 一句话总结
RustFS 是一个用 Rust 编写的、**S3 兼容的分布式对象存储系统**，主打高性能、企业级功能完备、无遥测与 Apache-2.0 宽松许可，适合作为 MinIO/ Ceph 等存储的替代或互补方案。官方给出的指标显示：在 4KB 小对象场景下，可比 MinIO 快约 2.3 倍（同环境的对比见 README 顶部的“Stress Test Environment”说明与演示视频）。
---
## 背景与痛点：为什么又来一个对象存储？
- **对象存储已成基础设施**：无论是 AI 训练数据集、数据湖、日志归档，还是应用备份与静态资源分发，对象存储几乎无处不在。大家普遍希望用 S3 API 统一接入。
- **现有方案的隐形成本**：
  - 许可陷阱：部分主流开源对象存储采用 AGPL，商业分发和内部改造的法律风险较高；RustFS 明确采用 Apache 2.0，避免了这些“有毒条款”与知识产权污染风险。
  - 遥测与数据出境：很多产品自带远程遥测，合规上难以满足严格的数据主权要求；RustFS 强调无遥测、完全本地可控，并给出 GDPR、CCPA、APPI 等合规声明。
  - 内存安全与运行时开销：以 Go 或 C 编写的产品，可能面临 GC 暂停、内存泄漏等不确定因素；Rust 从语言层面保证内存安全，并倾向于零开销抽象，更贴近“硬件饱和”的性能目标。
- **兼容性割裂**：不同“兼容 S3”的产品往往行为不一致、子集也不完整，导致迁移与集成成本高；RustFS 把 S3 兼容矩阵持续公开追踪，承诺尽量与现有 S3 生态对齐。
---
## 核心亮点与功能剖析
### 1) 高性能与 Rust 赋能
- Rust 语言优势：内存安全 + 无 GC + 对并发与异步的原生支持，适合高吞吐、低延迟的存储服务。
- 官方宣称的小对象性能：README 标题直接给出“2.3x faster than MinIO for 4KB object payloads”的对比，并列出了测试环境参数（2 核 CPU、4GB 内存、15Gbps 网络、4x40GB 磁盘，IOPS 3800/盘）。
- “硬件饱和”设计哲学：官网强调零开销、硬件饱和式 IO，以及以内存安全运行为基础，直接面向数据中心的高压场景。
### 2) S3 与 OpenStack Swift 双协议兼容
- S3 核心与扩展能力完备：包括上传/下载、版本控制、对象锁（WORM）、服务端加密、生命周期管理（ILM）、Bucket/站点复制、S3 Select、事件通知、审计日志、IAM/策略、OIDC/SSO、S3 Tables（Iceberg REST，处于 Preview）等，均在“Feature & Status”表格中标为“Available”或“Preview”。
- OpenStack Swift/Keystone 原生支持：提供 Swift 协议与 Keystone 认证，方便既有 OpenStack 环境接入与迁移。
- 边缘协议支持：FTPS、WebDAV、SFTP 等（部分为可选 features），为边缘与混合云场景提供多种接入方式。
### 3) 分布式与企业级能力
- 分布式/单节点模式：在单节点单盘（SNSD）、单节点多盘、多节点多盘等多种拓扑下均能部署，具备 Erasure Set、Pool 扩容/退役、纠删码与位腐保护、自动修复与扫描等能力。
- 安全与治理：自带 KMS（支持 Vault、AWS KMS；Local/Static 仅用于开发）、服务端加密、对象锁（WORM）、审计日志、IAM/策略等。
- 身份与访问：OIDC/SSO（支持如 Microsoft Entra ID 的角色声明映射）、多租户、Web 控制台、细粒度策略条件（例如 jwt:roles/jwt:groups 的 IAM 条件示例）。
### 4) 生态与可观测性
- 与现有栈无缝对接：官方列出可与 Docker、Elastic、Grafana、Kafka、MySQL、Nginx、PostgreSQL、ClickHouse、Prometheus、Spark、TensorFlow 等集成，强调 S3 中心化的“兼容表层”。
- 可观测与编排：仓库提供 docker-compose.yml（含 Grafana、Prometheus、Jaeger）用于观测与追踪；Kubernetes 部署通过 Helm Chart 一键完成。
### 5) 丰富的部署形态与开发者体验（DX）
- 一键脚本、Docker、源码构建、Helm、Nix Flake、X-CMD：README 给出了六种入门方式，从新手到 DevOps/研发都能找到顺手的路径。
- NixOS 模块与 Nix 包：flake 导出 NixOS 模块与 rc 客户端，便于声明式部署与敏感信息管理（通过 sops-nix/agenix 注入密钥）。
---
## 目标人群与收益：谁最该关注？
| 角色/场景 | 痛点 | 使用 RustFS 的收益 |
|-----------|------|--------------------|
| 自建对象存储的运维/平台团队 | 需要替代 Ceph/MinIO，担心 AGPL 合规与遥测风险；追求更低延迟与更高吞吐 | 许可干净（Apache 2.0）、无遥测、可控性高；小对象性能更好，适合高频读写场景 |
| AI/大数据与数据湖工程 | 需要高性能 S3 兼容层对接 Spark/TF/Trino/Analytics 工具 | S3 兼容 + 大吞吐/大文件优化；S3 Tables（Iceberg REST）满足表格式与数据湖需求（Preview 态） |
| 边缘与 IoT 平台 | 需要在资源受限的边缘网关部署存储网关，需要轻量与多协议 | 支持边缘部署与 SFTP/FTPS/WebDAV 等协议，且更轻量、内存安全 |
| 对合规敏感的企业/政府 | 对数据出境、遥测、许可证条款有严格限制 | 明确声明无遥测、数据主权可控、Apache 2.0 许可；官方列出 GDPR/CCPA/APPI 等合规目标 |
| DevOps 与开发者 | 希望能在本地、Kubernetes、NixOS 上快速拉起一个 S3 兼容存储做 CI/CD 与开发测试 | Docker 一键、Compose、Helm、Nix、X-CMD、一键脚本等多路径上手，且附带可观测性栈示例 |
---
## 竞品/同类对比：它处在什么位置？
| 维度 | RustFS | MinIO | Ceph | 通用 S3 网关（如 s3proxy） |
|------|--------|-------|------|---------------------------|
| 语言与安全性 | Rust（内存安全） | Go（GC，需注意内存泄漏等） | C++（复杂、内存安全靠工程实践） | 多为 Java/Go |
| 许可证 | Apache 2.0（宽松） | AGPL v3（传染性较强） | LGPL v3（某些组件） | 依项目而异 |
| S3 兼容性 | 覆盖面广，并有兼容矩阵与 S3 Tables（Iceberg REST） | 成熟但不同版本行为差异 | 兼容性与网关实现复杂 | 多为网关映射，子集不一 |
| 部署与运维 | 提供脚本/Docker/Helm/Nix/X-CMD 等多种路径 | Docker/Helm/二进制成熟 | 部署门槛高，运维复杂 | 轻量但功能有限 |
| 企业特性 | ILM、复制、加密、KMS、IAM、OIDC、审计日志、WORM、位腐保护 | 功能丰富 | 功能极全 | 一般 |
| 边缘与多协议 | Swift、SFTP、FTPS、WebDAV 等 | 主打 S3，额外协议需其他手段 | RGW 支持 S3 与 Swift | 仅 S3 |
| 生态与工具链 | 侧重新兴 AI/云原生栈，明确支持 Spark/TF 等 | 生态庞大 | 生态庞大 | 依赖上游适配 |
差异化小结：RustFS 在“许可干净 + 内存安全 + S3 兼容 + 企业能力 + 边缘多协议”的组合上，形成与 MinIO 和 Ceph 的差异化，是更“合规与性能导向”的新兴选择。
---
## 局限与不足
- 项目仍相对年轻：官方博客显示 2023 年 12 月开始开发，2025 年 7 月开源，版本号仍在 1.0.0-rc/beta 阶段。虽然在短时间内获得大量关注，但长期稳定性与大规模生产案例仍在积累中。
- 部分高级功能处于 Preview：S3 Tables（Iceberg REST）与 MinIO On-Disk Compatibility 仍标记为 Preview，且默认不开启；采用前需评估兼容性与功能边界。
- 拓扑扩展规则较严格：Pool/Erasure Set 的扩容与变更遵循类似 MinIO 的拓扑规则，不合规的变更可能导致数据迁移复杂，需仔细阅读“Pool expansion notice”与文档。
- 社区与第三方集成尚在成长：尽管官方已提供 .NET Aspire 示例等项目（rustfs-dotnet-demo），但与 MinIO、Ceph 相比，第三方工具链与脚本的丰富度仍需时间沉淀。
- 文档语言与本地化：虽然文档站点有多语言入口（包括简体中文），但实际内容完整性、更新同步度与翻译质量需要结合各语言页逐一验证。
---
## 上手门槛与部署体验（Demo/示例）
### A) Docker 快速启动（最推荐的入门方式）
```bash
# 创建数据与日志目录并设置权限（容器内以 UID:GID=10001:10001 运行）
mkdir -p data logs
chown -R 10001:10001 data logs
# 使用 latest 启动
docker run -d -p 9000:9000 -p 9001:9001 \
  -v "$(pwd)/data:/data" \
  -v "$(pwd)/logs:/logs" \
  rustfs/rustfs:latest
# 使用指定版本示例
# docker run -d -p 9000:9000 -p 9001:9001 \
#   -v "$(pwd)/data:/data" \
#   -v "$(pwd)/logs:/logs" \
#   rustfs/rustfs:1.0.0-rc.5
```
访问控制台：http://localhost:9001，默认账号密码为 rustfsadmin / rustfsadmin。
### B) Docker Compose 快速启动（推荐用于含 Grafana/Prometheus/Jaeger 的可观测性栈）
```bash
docker compose -f docker-compose-simple.yml up -d
```
注意：若使用宿主机路径挂载，需确保这些路径对 10001:10001 可写。
### C) S3 兼容客户端基本使用示例（以 AWS CLI 为例）
```bash
# 设置别名与凭证
export AWS_ACCESS_KEY_ID=rustfsadmin
export AWS_SECRET_ACCESS_KEY=rustfsadmin
export AWS_ENDPOINT_URL=http://localhost:9000
# 创建 Bucket
aws s3 mb s3://demo-bucket --endpoint-url $AWS_ENDPOINT_URL
# 上传文件
echo "hello from RustFS" > hello.txt
aws s3 cp hello.txt s3://demo-bucket/ --endpoint-url $AWS_ENDPOINT_URL
# 列出对象
aws s3 ls s3://demo-bucket/ --endpoint-url $AWS_ENDPOINT_URL
```
### D) OIDC 与 IAM 条件示例（企业场景）
将 Microsoft Entra ID 应用角色映射到 IAM 策略（env 示例）：
```bash
RUSTFS_IDENTITY_OPENID_ENABLE=on
RUSTFS_IDENTITY_OPENID_CONFIG_URL="https://login.microsoftonline.com/<tenant-id>/v2.0/.well-known/openid-configuration"
RUSTFS_IDENTITY_OPENID_CLIENT_ID="<client-id>"
RUSTFS_IDENTITY_OPENID_CLIENT_SECRET="<client-secret>"
RUSTFS_IDENTITY_OPENID_SCOPES="openid,profile,email"
RUSTFS_IDENTITY_OPENID_GROUPS_CLAIM="groups"
RUSTFS_IDENTITY_OPENID_ROLES_CLAIM="roles"
```
对应 IAM 策略示例（jwt:roles 条件）：
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["admin:*"],
      "Resource": ["arn:aws:s3:::*"],
      "Condition": {
        "ForAnyValue:StringEquals": {
          "jwt:roles": ["RustFS.ConsoleAdmin"]
        }
      }
    }
  ]
}
```
---
## 代码组织与技术栈（基于仓库可见信息）
- 语言与核心：Rust 作为主体实现，确保内存安全与高性能。
- 特性门控：通过 Cargo features 精细控制能力开关（如 swift、sftp、full 等），默认构建启用 FTPS/WebDAV。
- 构建与发布：
  - 提供 docker-buildx.sh 支持 Linux/amd64/arm64 多架构构建与推送。
  - Make 目标便于常见 docker-buildx 相关操作。
  - Nix Flake 导出模块与客户端，提供 NixOS 一等公民体验。
- 可观测性：Compose 文件中集成了 Grafana、Prometheus、Jaeger，便于追踪与监控。
---
## 社区活跃度与生命力
- 许可证：Apache 2.0，鼓励社区贡献与商业使用。
- 发布节奏：官方博客持续发布 beta/rc 等里程碑版本与技术深度文章，显示团队在积极迭代。
- 讨论与问题反馈：提供 GitHub Discussions 与 Issues、官方 Discord，并有 FAQ、Changelog 等配套资料。
- 第三方社区讨论：在 Cloudron 等社区有人关注并指文档小问题，说明生态在生长。
---
## 结语与行动建议
- **终极评判**：RustFS 是一个在“许可、合规、性能与 S3 兼容”上强组合的新一代对象存储，尤其适合对 AGPL 敏感、追求内存安全与高性能、需要完整企业级能力的团队。在 AI/数据湖、云原生与边缘场景下，它与 MinIO/Ceph 形成互补而非简单重复。
- **何时选用 RustFS**：
  - 需要 Apache 2.0 许可、避免 AGPL/遥测的商业/合规场景。
  - 小对象性能与延迟对业务敏感，愿意尝试新一代 Rust 实现而非传统 Go/C++。
  - 需要 Swift/SFTP/FTPS/WebDAV 等多协议接入，或与 OpenStack Keystone 集成。
  - 想要借助 Nix/NixOS 等现代运维工具做声明式部署。
- **何时暂时观望**：
  - 需要极其成熟、久经大规模验证的方案，且已有稳定运维体系（Ceph/MinIO）。
  - 强依赖尚在 Preview 的特性（如 S3 Tables/MinIO 磁盘格式兼容），需评估成熟度后再入生产。
- **行动建议**：
  - 从 Docker / Compose 在本地或测试集群拉起一个最小可用实例，跑通业务常用的 S3 调用路径。
  - 使用 IAM/加密/生命周期等基础能力，模拟真实的数据分类与合规策略。
  - 如果已在用 MinIO，可尝试把部分只读或冷数据 bucket 以 S3 兼容方式接入 RustFS，逐步验证性能与运维成本。
---
### 参考与延伸阅读
- RustFS GitHub 仓库（README、Quickstart、Feature & Status、拓扑扩容说明、Docker/Compose/Nix 示例）
- 官方站与 Docs 门户（特性说明、生态集成与许可对比）
- 官方博客（版本发布节奏与技术演进时间线）
- 社区讨论与示例仓库（如 .NET Aspire 示例）
