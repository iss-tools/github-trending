# prometheus/prometheus

[GitHub URL](https://github.com/prometheus/prometheus)


## Prometheus 深度评测：云原生监控界的“事实标准”，凭什么独占鳌头？

> CNCF 毕业的开源监控告警系统，用 Pull 模型 + 多维标签 + PromQL 三件套成为云原生监控事实标准。

- **Tags**: Prometheus, 监控告警, 时序数据库, 云原生, CNCF
- **Category**: 开发工具, 运维监控, 开源项目

## Details

I have enough comprehensive information now. Let me compose the deep research article.
# Prometheus 深度评测：云原生监控界的"事实标准"，凭什么独占鳌头？
> 评测对象：[prometheus/prometheus](https://github.com/prometheus/prometheus)
> 项目类型：开源监控与告警系统 + 时序数据库（CNCF 毕业项目）
> 当前版本：v3.15.0（2026 年 9 月 24 日发布）
> 仓库热度：约 66.5k Stars / 10.9k Forks，60+ 官方子仓库
---
## 一句话总结
**Prometheus 是云原生时代的"监控事实标准"——它用 Pull 模型 + 多维标签 + PromQL 三件套，把过去只有在 SaaS APM 平台上才能享受到的指标采集、存储、查询、告警能力，装进了一个不到 100MB 的单一 Go 二进制里，并且免费开源、Apache 2.0 协议随便商用。**
如果你在跑 Kubernetes、微服务或者任何形式的云原生基础设施，几乎绕不开它——CNCF 2025 年度调查显示，**Prometheus 的生产环境使用率高达 77%**，是所有 CNCF 项目里覆盖面最广的那一个。
---
## 背景与痛点：为什么会有 Prometheus？
### 老一代监控的"阿喀琉斯之踵"
在 2012 年之前，监控领域的主流是 Zabbix、Nagios、Graphite 这类工具。它们有几个共同的痛点：
- **数据模型扁平**：指标往往只有名字和一个值，没有"维度"概念。比如想统计"订单服务在华东 2 区 5 号实例的 QPS"，你只能靠命名约定硬拼字符串，查询起来极其痛苦。
- **Push 模型难自治**：被监控节点把数据推到中心，如果中心挂了，或者某个节点报告"我很好"其实早死了，监控自己都不知道。
- **紧耦合**：部署、存储、告警、可视化全绑在一起，难以拆分。
Prometheus 由 SoundCloud 的工程师 Matt T. Proud 和 Julius Volz 在 2012 年发起，借鉴了 Google 内部监控系统 Borgmon 的设计思路。2016 年它成为 **CNCF 接纳的第二个毕业项目**（仅次于 Kubernetes 本身），从此和 K8s 形成了"共生进化"的黄金组合。
### 它解决了什么核心问题？
一句话：**给动态、易变、横向扩展的微服务架构，配上一套同样"原生云"思维的指标监控系统。** Pods 今天来明天走，那监控就不能靠手工配置 IP 列表，要靠 Service Discovery 自动跟上；服务有几百个维度组合，那查询语言就必须天然支持多维切片。
---
## 核心架构与设计理念：Pull 模型 + TSDB + PromQL
### 1. Pull 模型：监控界的"主动体检"
大多数监控系统是 Push 模式——应用程序主动把数据"寄"给监控中心。Prometheus 反其道而行：**由 Prometheus 服务器定期去每个目标拉取 `/metrics` 端点**。
把这件事想象成体检：Push 模型像是每个员工自己填表汇报"我今天身体很好"，员工可能撒谎、可能忘了填、可能根本已经晕倒在工位上。Pull 模型则是**HR 主动到工位看一眼**——人没在，就是没在，做不了假。
这种设计带来三个直接好处：
- **自动故障检测**：目标宕机 → 抓取失败 → `up == 0` 告警，监控自己不会"被蒙在鼓里"。
- **简化架构**：被监控方只需暴露一个 HTTP 端点，无需安装 Agent、无需打开反向连接、无需中心被动接收海量数据。
- **健康状态与数据天然绑定**：抓到的样本就证明对方"活着"，没有数据就是有问题。
当然，Pull 不是万能钥匙——对于脚本型、生命周期只有几秒的短任务（如 Cron Job），Prometheus 还没来得及拉就结束了，这时需要**Pushgateway 作为中转站**。但 Pushgateway 也因此成为社区公认的"反模式重灾区"，后面会讲。
### 2. 多维数据模型 + TSDB：标签是一等公民
Prometheus 把每个指标表示为：
```
<metric_name>{<label_name>=<label_value>, ...}  <value>  <timestamp>
```
例如：
```
http_requests_total{service="order", region="cn-north-1", status="500"}  1024  1762425600000
```
这里的 `service`、`region`、`status` 就叫 **labels**。同样的指标名，不同 label 组合就是不同的时间序列。这相当于在数据库里"每一行数据都自带一个动态 schema"，查询时可以任意切片、聚合。
底层的 **TSDB（时序数据库）** 是 Prometheus 自己写的，专为时序场景优化，采用 **XOR 浮点压缩**（v3 已升级到 XOR2）。每个 Prometheus Server 都是自治的——**不依赖任何分布式存储**，单机二进制就能跑，这就是它在故障场景下依然可靠的底气。
### 3. PromQL：把维度查询变成"Excel 透视表"
PromQL 是 Prometheus 的灵魂。它不基于 SQL，而是一门为时序聚合专门设计的函数式语言。看几个例子感受一下：
```promql
# 过去 1 分钟每个实例的 CPU 使用率
100 * (1 - rate(node_cpu_seconds_total{mode="idle"}[1m]))
# 按服务聚合 5xx 错误率
sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
  /
sum(rate(http_requests_total[5m])) by (service)
# 过去 1 小时 P99 延迟
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[1h])) by (le))
# 预测磁盘 4 小时后写满
predict_linear(node_filesystem_avail_bytes[1h], 4 * 3600) < 0
```
维度的"加/减/聚合/除以"都对应 PromQL 里一行表达式，灵活度远超传统监控的"配置界面点点点"。
### 4. 生态组件：六边形战士
| 组件 | 角色 |
|------|------|
| Prometheus Server | 抓取 + 存储 + 查询 + 规则评估（核心） |
| Alertmanager | 接收告警，做去重、分组、路由、静默、通知 |
| Exporters | 把第三方系统的指标翻译成 `/metrics` 格式（node_exporter、mysqld_exporter、blackbox_exporter…） |
| Client Libraries | Go / Java / Python / Ruby 等语言 SDK，在代码里埋点 |
| Pushgateway | 短任务的中转站 |
| Grafana / Perses | 可视化前端（Grafana 几乎是为 Prometheus 长大的） |
---
## 上手体验：从 0 到出图，三步搞定
### 安装部署：一条 Docker 命令即可
```bash
docker run --name prometheus -d -p 9090:9090 prom/prometheus
```
启动后访问 `http://localhost:9090` 就能看到 UI。整个 Docker 镜像不到 100MB。
如果想跑得稍微"像生产"，下面这份 `docker-compose.yml` 是最简实战版（Prometheus + Node Exporter + Grafana）：
```yaml
version: "3.8"
services:
  prometheus:
    image: prom/prometheus:v3.15.0
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prom-data:/prometheus
    ports: ["9090:9090"]
  node-exporter:
    image: prom/node-exporter:v1.9.0
    ports: ["9100:9100"]
  grafana:
    image: grafana/grafana:latest
    ports: ["3000:3000"]
volumes:
  prom-data:
```
### 核心配置文件 `prometheus.yml`
这是 Prometheus 唯一需要你写的配置文件，格式非常直观：
```yaml
global:
  scrape_interval: 15s        # 默认每 15 秒抓一次
  evaluation_interval: 15s    # 规则评估频率
scrape_configs:
  - job_name: "node"
    static_configs:
      - targets: ['node-exporter:9100']
  # K8s 环境下用服务发现，自动找到所有带特定注解的 Pod
  - job_name: "kubernetes-pods"
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
rule_files:
  - "/etc/prometheus/rules/*.yml"
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']
```
### 一个最小告警规则
```yaml
groups:
  - name: example
    rules:
      - alert: InstanceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "实例 {{ $labels.instance }} 已宕机"
          description: "超过 1 分钟无法抓取，请排查。"
```
### Demo：用 PromQL 查出点东西
启动后访问 `http://localhost:9090/graph`，在表达式框里粘贴：
```promql
rate(node_cpu_seconds_total{mode="system"}[1m])
```
立即能看到系统态 CPU 时间的曲线；换成 `node_filesystem_avail_bytes` 就能看到磁盘剩余空间。**没有繁琐的 schema 配置，没有 ETL，目标起来了，数据就来了——这就是 Pull 模型的 DX（开发者体验）红利。**
---
## 社区活跃度与生命力
- **版本节奏**：进入 v3 时代后基本每两周一个 minor，每个 minor 后跟一两个 patch。仅 2026 年 9 月就发布了 v3.13.4 和 v3.15.0 两个版本，Release Notes 里塞满了 PromQL、TSDB、Remote Write、服务发现的优化。
- **生态矩阵**：`prometheus/prometheus` 之外，还有 `prometheus-community` 下的 **40+ 官方周边仓库**（各种 exporter、snmp exporter 等），加上 `prometheus-operator/kube-prometheus` 让 K8s 部署 Prometheus 也变成声明式。
- **行业地位**：CNCF 2025 年度报告显示 CNCF 已有 230+ 项目、30 万贡献者，而 Prometheus 的 77% 生产使用率依然在所有项目中排在最前列。
- **可观测性的事实规范**：Prometheus 的 `/metrics` 文本格式已经成为 **OpenMetrics 标准**，OpenTelemetry、Datadog Agent、VictoriaMetrics、Cortex 等几乎所有可观测性工具都兼容或对接它。v3 还引入了 **Native Histograms** 和 OTLP 原生接入，进一步收编了 OpenTelemetry 阵营。
---
## 竞品对比：在监控江湖中的坐标
| 维度 | Prometheus | InfluxDB | VictoriaMetrics | Grafana Mimir/Thanos | Datadog (SaaS) |
|------|-----------|----------|-----------------|----------------------|----------------|
| 数据模型 | 多维标签时序 | 多模型（SQL/时序/文档） | 多维标签时序 | 兼容 Prometheus | 多维标签时序 |
| 数据获取 | Pull 为主，Push 通过网关 | Push 为主 | Pull + Push 都支持 | 继承 Prometheus | Push 为主 |
| 单机自治 | ✅（单二进制） | ✅ | ✅ | ❌ 需要分布式组件 | - |
| 水平扩展 | 原生不支持，需 Mimir/Thanos/VM | 企业版支持 | 原生支持，单节点可达 1 亿活跃序列 | 原生支持 | - |
| 查询语言 | PromQL | InfluxQL / Flux / SQL | MetricsQL（PromQL 超集） | PromQL | Datadog Query |
| 学习成本 | 中 | 中 | 低（兼容 Prometheus） | 高 | 低（但被厂商锁定） |
| 商业模式 | Apache 2.0 完全免费 | 开源版限制 + 商业版 | Apache 2.0 完全免费 | AGPL / 企业版 | 按数据量计费，容易"账单爆炸" |
| 适合场景 | K8s / 微服务 / 中等规模指标 | IoT / 边缘 / 混合负载 | 超大规模、长期存储 | 大规模集群 | 不想自运维的团队 |
### 几个关键观察
1. **Prometheus 是"单机架构 + 生态扩展"路线**：核心保持简单可靠，扩展性交给 Thanos / Mimir / Cortex / VictoriaMetrics 这些"远方亲戚"去做。这是它的设计哲学，也是被诟病"原生不支持 HA"的根源。
2. **VictoriaMetrics 是事实上的"更强替代品"**：API 兼容 PromQL，但官方实测在 1000+ 抓取目标时 CPU/内存/磁盘 IO 都比 Prometheus 低。很多团队的做法是：**用 Prometheus 做规范和生态入口，用 VictoriaMetrics 做存储后端**。
3. **InfluxDB 是不同物种**：它更想做"通用时序数据库"，支持事件、日志、甚至 SQL 查询；Prometheus 只专注指标监控。两者目标场景有交集但侧重不同。
4. **Datadog 是"钞能力方案"**：开箱即用、UI 漂亮，但每月账单可能比一个工程师的工资还高。Prometheus + Grafana 几乎是它的开源对照组。
---
## 局限与不足：也得泼几盆冷水
Prometheus 不是银弹，官方文档自己就明确写了"什么时候不适用"。以下是真实使用中会撞到的坑：
### 1. 高基数是致命陷阱
**High Cardinality** 是 Prometheus 社区讨论最多的话题。每个独特的 label 组合都是一条独立时间序列，例如把 `user_id`、`request_id`、`trace_id` 当成 label，序列数会瞬间爆炸，导致：
- 内存飙升（每条序列在 head block 都要占内存）
- 查询越来越慢
- 磁盘占用爆炸
- 抓取性能恶化
**经验法则**：单个 Prometheus 实例的活跃序列数建议控制在 200–500 万以内，单条指标的 label value 不要包含无限集合（用户 ID、订单号、URL 全路径都是反例）。
### 2. 原生不支持分布式存储和长期存储
Prometheus 自带的 TSDB 默认只保留 15 天（可调），且单机本地磁盘。想跨地域聚合、想保留一年数据，必须上：
- **Thanos**：在每个 Prometheus 旁边跑 sidecar，把数据上传到对象存储（S3/GCS）。优点是兼容性好，缺点是每个 Prometheus 都得跟一个 sidecar，运维复杂。
- **Cortex / Mimir**：把 Prometheus remote_write 到一个分布式集群，原生多租户，但依赖 Consul/Cassandra/DynamoDB 等一堆第三方组件。
- **VictoriaMetrics**：remote_write 进去，单机或集群都行，资源消耗最低。
无论选哪条路，**额外复杂度都是真实存在的**——这一点官方默认部署不会替你解决。
### 3. 精度承诺有限
官方明确说：**如果需要 100% 精确的每笔计费数据，Prometheus 不合适**。Pull 模型有抓取间隔（默认 15s），重试、超时、目标抖动都会让数据有"抽样感"。把它当成"运营监控"和"告警依据"是OK的，当成"财务对账系统"就跑偏了。
### 4. Pull 模型天然不能覆盖所有场景
- **短生命周期任务**：Cron Job 跑 5 秒就结束，Prometheus 根本来不及拉。Pushgateway 是补丁，但官方文档里反复提醒 Pushgateway 不是"通用 Push 方案"，使用不当会留下"幽灵指标"。
- **防火墙后的目标**：Prometheus 必须能主动访问目标，这在严格隔离的网络里会很折腾。
- **移动端 / IoT 设备**：根本无法被"拉"，得换思路。
### 5. PromQL 学习曲线陡峭
虽然比 SQL 表达力强，但 PromQL 的"range vector vs instant vector"、"subquery"、"histogram_quantile 必须按 le 聚合"这些概念对新手很不友好。错误提示有时也偏 cryptic，新人常写出"跑得通但结果错"的查询。
### 6. UI 仅适合临时查询
Prometheus 自带 UI 只够画个曲线、调个表达式，**生产环境基本都需要配 Grafana**。这本身不是缺陷，但意味着"完整监控方案"至少是两个组件、两份配置。
---
## 目标人群与收益
### 强烈推荐使用的人
- **Kubernetes 运维 / SRE**：Prometheus 已经是 K8s 的事实监控标准，社区方案（kube-prometheus-stack Helm chart）一键部署，几乎所有 K8s 组件都自带 `/metrics` 端点。
- **微服务开发者**：用 client_golang / client_java 埋几行业务指标，比对接任何 APM SDK 都轻。
- **想摆脱 SaaS 监控账单的团队**：开源版 Prometheus + Grafana 几乎零成本，把 Datadog 那种"按数据点计费"的成本结构彻底消灭。
- **数据工程师**：把 Prometheus 当成"监控领域的 SQL"，几乎所有中间件都有现成 exporter。
### 可以不选它的人
- **需要长期保存海量历史指标**（一年以上、数十亿序列）→ 直接选 VictoriaMetrics 或 Mimir，或者把 Prometheus 当 agent、把数据 remote_write 出去。
- **需要日志 + Trace + 指标三合一的统一平台** → 上一套 OpenTelemetry + Loki + Tempo + Grafana，或者干脆 Datadog。
- **团队没人懂运维、想完全托管** → SaaS 类监控产品更合适。
---
## 避坑指南（一线经验之谈）
1. **label 设计要克制**：先想清楚"我以后会不会按这个维度查询？"想不清楚就别加。`user_id`、`request_id` 这种高基数字段用日志或 Trace 承载，不要塞进指标。
2. **scrape_interval 不要激进调低**：15s 已经够告警用了，调到 5s 会让内存翻倍、查询变慢，收益却有限。
3. **Pushgateway 用完即删**：用它收集完短任务后，最好用 `pushgateway` 的 delete API 清理掉旧样本，否则会留下僵尸数据。
4. **长期存储别死磕原生**：尽早规划 remote_write 到 Mimir / Thanos / VictoriaMetrics，**数据一旦丢失就是不可逆的**。
5. **告警要"human-tuned"**：Alertmanager 默认会把每条告警单独发送，配置 `group_by`、`group_wait`、`repeat_interval` 才不会凌晨 3 点被 100 条同一类告警轰炸。
6. **升级 2.x → 3.x 注意**：v3 对某些实验性 feature flag 做了合并（如 `--enable-feature=st-storage` 现在会自动启用 XOR2 编码），依赖旧 flag 的脚本要相应调整。
7. **监控 Prometheus 自己**：Prometheus 的 `/metrics` 也暴露自身指标，务必把 `prometheus_` 前缀的指标也抓起来，head series 数量、WAL 重放时间、查询延迟都值得关注。
---
## 结语与行动建议
**Prometheus 的地位不是"一款监控工具"，而是一个生态的命名规范。** 它用十年时间证明了一件事：在云原生时代，监控的胜负手不在 UI 多炫，而在数据模型够不够灵活、告警链路够不够可靠、生态够不够开放。Pull 模型、多维标签、PromQL 这三件套，如今已经成为整个可观测性领域默认的"通用语"——连它的"挑战者们"（VictoriaMetrics、Mimir、OpenTelemetry）也必须在 PromQL 兼容性上作出承诺，才能获得市场通行证。
**给三类读者的行动建议**：
- **新手**：从 `docker run` 一行命令起步，跑通 Node Exporter + Grafana 三件套，再用 PromQL 查一次 CPU 使用率，**动手 30 分钟胜过读 10 篇教程**。
- **开发者**：在你的下一个服务里，用 client_golang 埋 3 个业务指标（如订单创建数、处理时延、失败数），体验"把业务可观测化"的爽感。
- **架构师**：如果你的指标规模已经在千万级序列，认真评估 **Prometheus（前端采集）+ VictoriaMetrics 或 Mimir（长期存储）+ Grafana（可视化）+ Alertmanager（告警）** 这套组合，这是 2026 年社区里最稳的"金字塔"。
一句话收尾：**监控领域如果只能记住一个名字，那就是 Prometheus——它定义了现代监控的语法，剩下的所有工具，要么是它的扩展，要么是它的兼容者。**
