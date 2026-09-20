# paperless-ngx/paperless-ngx

[GitHub URL](https://github.com/paperless-ngx/paperless-ngx)


## Paperless-ngx 深度评测：把纸质档案柜装进自托管服务器的开源文档管理系统

> 开源自托管文档管理系统，用 OCR + 自动分类 + 全文检索，把散乱文档变成可秒搜的私人数字档案馆

- **Tags**: 开源项目, 文档管理, OCR, Docker, 自托管
- **Category**: 开发工具, 生活效率, 自托管应用

## Details

# Paperless-ngx 深度评测：把纸质档案柜装进自托管服务器
> **一句话总结**：Paperless-ngx 是一款开箱即用、以 OCR + 全文检索为核心的开源自托管文档管理系统（DMS），它能把你散落在扫描仪、微信、邮箱里的 PDF、发票、合同、说明书，自动识别、打标、归档成可全文检索的"私人数字档案馆"，是 2026 年自托管（self-hosted）圈子里最被推崇的"无纸化"方案。
---
## 一、背景与痛点：为什么要造一个"电子档案柜"
想象一下你的打印机旁边堆积的账单、保险单、装修合同、设备说明书——多数人要么让它们继续吃灰，要么靠微信"文件传输助手"当临时仓库。等真要找一张 2019 年的租房发票时，翻箱倒柜的成本远高于"再拍一张"。
商业 SaaS 端有 DocuWare、M-Files、国内的"scan to cloud"等方案，但要么订阅费高昂、要么把敏感证件（身份证、税单、社保）上传到第三方服务器，隐私风险无法忽视。
Paperless-ngx 的底层逻辑是：**让文档管理回到你自己控制的机器上**。它是 `paperless` → `paperless-ng` → `paperless-ngx` 三代演进的最终形态，从个人项目转向"社区共治"的团队维护模式，是目前 GitHub 上该赛道热度最高的项目之一（Star 数已突破 44.8k）。它解决的核心问题只有一个：**把"一堆乱七八糟的扫描件"变成"一个可以 Ctrl+F 的档案柜"**。
---
## 二、核心亮点与功能剖析
### 2.1 技术栈与架构：一条精炼的 Django + Celery 流水线
Paperless-ngx 的后端是 Python 生态最成熟的组合：
- **Django** 承担 Web 服务、ORM 与权限体系
- **Celery + Redis** 做异步任务队列（OCR、索引重建、邮件拉取都是后台任务）
- **PostgreSQL** 持久化元数据（标题、标签、日期、对应人等）
- **Tika + Gotenberg** 两个伴生容器分别处理 Office 文档解析和 PDF 合成
- **Tesseract** 是默认 OCR 引擎
- **Whoosh** 提供全文索引
这种架构的精妙之处在于**任务解耦**：你扔 100 个 PDF 进去，Web 端立刻响应"已收到"，OCR 在后台慢慢跑，不会阻塞 UI。用直观的话说，它像一家餐厅——前台（Django）只负责接单，后厨（Celery）慢慢炒菜，两者互不干扰。
### 2.2 三种摄入方式：让文档"自己走进来"
这是 Paperless-ngx 最能体现"无纸化"哲学的设计，官方支持三条"自动喂食"管道：
1. **Consume 文件夹**：任何丢进指定目录的文件都会被自动识别、入库并归档
2. **Mail 邮箱消费**：配置一个 IMAP 邮箱，定期拉取带附件的邮件并入库——水电账单、电子发票可直接从邮箱流向档案库
3. **API 上传**：配合手机 App 或第三方扫描仪一键推送
这意味着你只需要维持一个习惯：**把新东西扔到固定位置**，剩下的分类、命名、归档全部自动完成。
### 2.3 智能 OCR 与"Auto"机器学习分类
Paperless-ngx 内置了一套基于机器学习的 **Auto 匹配算法**：当你为某类文档（如"电费发票"）手动指定几次标签、对应人和文档类型后，它会学习这些文档的文本特征，之后同类文档就能自动打上相同标签，不需要再手写正则表达式。
配合 Tika，它还能解析 Word/Excel/PPT/邮件等非 PDF 文档；配合条形码识别模块，可以自动按条码切分批量扫描的多页文件。
### 2.4 全文检索 + 灵活筛选
OCR 的所有文本都会进入 Whoosh 全文索引，你可以搜索**文档正文里出现的任何词**——包括扫描件里的手写备注。配合标签、对应人、文档类型、日期范围等多维过滤器，找一张 5 年前的收据变成"输入关键词 → 回车 → 1 秒出结果"的事。
### 2.5 Custom Fields 与 Workflow：2.x 版本的两记重拳
近期的版本引入了**自定义字段**（日期、URL、金额、下拉选择等）和**基于规则的工作流**（如"收到带'invoice'关键词的文档时，自动指派给财务标签并移动到 X 存储路径"），让原本面向个人用户的它开始具备小团队使用的结构化能力。
### 2.6 移动端与生态
官方 Wiki 维护了一份相关项目清单，其中两款移动端最值得关注：
- **Paperless Mobile**（Android，开源，上架 F-Droid）：支持拍照、批量扫描、离线缓存
- **Less Paper**（iOS 原生客户端）：直连自建服务器，不经过任何第三方
---
## 三、快速上手：一份可以直接抄的 docker-compose.yml
> Paperless-ngx 官方推荐的部署方式就是 Docker Compose，并提供了交互式安装脚本一行命令搞定环境变量问答。
以下是官方推荐组合的最小可用版本（含 Tika + Gotenberg，可处理 Office 文档）：
```yaml
version: "3.4"
services:
  broker:
    image: docker.io/library/redis:7
    restart: unless-stopped
    volumes:
      - redisdata:/data
  db:
    image: docker.io/library/postgres:15
    restart: unless-stopped
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: paperless
      POSTGRES_USER: paperless
      POSTGRES_PASSWORD: paperless  # 请改成强密码
  webserver:
    image: ghcr.io/paperless-ngx/paperless-ngx:latest
    restart: unless-stopped
    depends_on: [db, broker, gotenberg, tika]
    ports:
      - "8000:8000"
    volumes:
      - data:/usr/src/paperless/data
      - media:/usr/src/paperless/media
      - ./export:/usr/src/paperless/export
      - ./consume:/usr/src/paperless/consume   # 扫描仪/手机扔文件的位置
    environment:
      PAPERLESS_REDIS: redis://broker:6379
      PAPERLESS_DBHOST: db
      PAPERLESS_TIKA_ENABLED: 1
      PAPERLESS_TIKA_ENDPOINT: http://tika:9998
      PAPERLESS_TIKA_GOTENBERG_ENDPOINT: http://gotenberg:3000
      PAPERLESS_OCR_LANGUAGE: chi_sim+eng      # 中文+英文
      PAPERLESS_TIME_ZONE: Asia/Shanghai
      PAPERLESS_SECRET_KEY: change-me-to-random-string
  gotenberg:
    image: docker.io/gotenberg/gotenberg:7.10
    command: ["gotenberg", "--chromium-disable-javascript=true"]
  tika:
    image: ghcr.io/paperless-ngx/tika:latest
volumes:
  data:
  media:
  pgdata:
  redisdata:
```
**三条关键建议**：
1. **数据库密码务必改掉**：默认的 `paperless` 只适合内网测试。
2. **务必挂载 `consume` 目录到宿主机**：这是你手机、扫描仪自动投递的入口。
3. **官方提供一行安装脚本**：如果不想手写 YAML，直接执行：
   ```bash
   bash -c "$(curl -L https://raw.githubusercontent.com/paperless-ngx/paperless-ngx/main/install-paperless-ngx.sh)"
   ```
   它会以问答方式引导你生成完整配置。
想先体验再部署？官方提供了 Demo 站点：`demo.paperless-ngx.com`（账号/密码均为 `demo`）。
---
## 四、目标人群与收益
| 人群 | 典型场景 | 你能得到什么 |
|---|---|---|
| **个人/家庭用户** | 账单、合同、证件、说明书扫描 | 一劳永逸的私人档案馆，找 5 年前收据只需 1 秒 |
| **自由职业者/小微工作室** | 客户合同、发票、报销凭证 | 免 SaaS 订阅费，自动打标签分类，年终报税不抓瞎 |
| **Homelab 玩家** | 打造家庭数字化中枢 | 与 Nextcloud、Immich、Vaultwarden 组成完整自托管全家桶 |
| **中小团队** | 共享文档库、自动化归档规则 | Workflow 规则 + 多用户权限，替代昂贵的商业 DMS |
| **注重隐私的专业人士** | 律师、医生、会计处理敏感档案 | 数据 100% 本地，不经过第三方云 |
**核心收益**用一句话概括：**把碎片化的纸质/电子文档，转化为可检索、可自动化、可备份的结构化资产**。
---
## 五、竞品对比：它在开源 DMS 赛道里处于什么位置
| 项目 | 定位 | OCR | 自动分类 | 学习成本 | 适用人群 |
|---|---|---|---|---|---|
| **Paperless-ngx** | 个人/小团队无纸化档案 | Tesseract（可扩展） | ✅ 内置 ML Auto 算法 | ⭐ 低 | 家用、小微办公首选 |
| **Mayan EDMS** | 企业级 DMS，工作流为王 | Tesseract | 依赖规则 | ⭐⭐⭐ 高 | 需要复杂审批流的组织 |
| **Docspell** | 文档自动归类 | Tesseract + 可选 OCRmyPDF | ✅ 机器学习较强 | ⭐⭐ 中 | 想要更聪明的自动打标 |
| **Papermerge** | 轻量文档管理 | Tesseract | ❌ 基本无 | ⭐⭐ 中 | 极简主义者 |
| **Nextcloud** | 通用文件同步 + 协作 | 弱（依赖插件） | ❌ | ⭐⭐ 中 | 已在用 Nextcloud 生态 |
**关键判断**：如果你要的是"家/小办公室的无纸化收件箱"——**Paperless-ngx 几乎是唯一推荐**；如果你要"企业级文档审批流"——Mayan EDMS 更合适；如果你在 Nextcloud 生态里只想轻度管理文档——不必再多装一个。
---
## 六、局限与不足：这些坑你需要提前知道
任何评测如果只报喜不报忧都是耍流氓。以下是社区里被反复提及的真实问题：
### 6.1 中文 OCR 是老大难
Tesseract 对中文的识别质量**口碑较差**，不少用户反馈"要么输出乱码，要么直接识别成其他语言字符"，导致搜索功能失效。此外，语言包命名规则有一个反直觉的坑：`PAPERLESS_OCR_LANGUAGES` 与 `PAPERLESS_OCR_LANGUAGE` 使用**不同的连字符格式**（一个用 `-`，一个用 `_`），配置错误会直接启动失败。
**对策**：
- 必须显式安装 `tesseract-ocr-chi_sim`（简体）或 `chi_tra`（繁体）语言包
- 高要求的用户建议搭配外部 OCR（如 PaddleOCR、MYOCR）预处理后再入库
- 社区里已有把本地大模型/本地 AI 叠加到 Paperless-ngx 前端的实践
### 6.2 内置 ML 分类器"够用但不出彩"
Auto 算法对英文文档表现不错，但对中文文档的语义理解有限。有资深用户直言"Paperless-ngx 存储很强，分类很弱"，干脆关闭其分类器，改用本地 LLM 在 API 层做中转。
### 6.3 明文存储，安全完全依赖宿主机
官方 README 用了加粗警告：**文档以明文存储，没有内置加密，绝不应部署在不受信任的主机上**。最安全的做法是放在家里的本地服务器 + 定期备份。若必须暴露公网，请务必：
- 前置反向代理 + HTTPS（Caddy/NPM/Traefik）
- 启用双因素认证
- 不要复用默认 Secret Key
### 6.4 升级前必须备份
官方文档反复强调：跨大版本升级前，请务必备份 `data`、`media`、`pgdata` 等 Docker 卷，否则迁移脚本失败可能损坏数据。
### 6.5 资源占用不容小觑
Tika 和 Gotenberg 都是 Java/Chromium 系的"重量级选手"，**官方建议至少 2GB 内存**；如果机器配置紧张，可以去掉这两个容器，只处理纯 PDF。
### 6.6 移动端生态分散
官方不开发移动端，而是依靠社区项目。这意味着 iOS/Android 的功能完备度、更新节奏参差不齐，重度移动用户需要自行权衡。
---
## 七、结语与行动建议
**Paperless-ngx 是 2026 年开源 DMS 领域当之无愧的"性价比之王"**——它用一套成熟但朴素的 Django + Celery + Tesseract 组合，解决了 90% 个人与小微团队的"无纸化"需求，而剩下 10% 的痛点（中文 OCR、智能分类）恰恰也是所有同类方案的共同短板。
**给你的具体行动路径**：
- **如果你是 Homelab 玩家**：直接上 Docker Compose 全家桶（含 Tika + Gotenberg），把扫描仪的"扫描到文件夹"指向 `consume` 目录，一周后你会感谢自己。
- **如果你是普通用户**：先在 demo.paperless-ngx.com 上传几份样例文档感受检索体验，再决定是否部署。
- **如果你的文档以中文为主**：预留预算/时间做 OCR 调优，或考虑外挂 PaddleOCR 等方案。
- **如果涉及团队共享**：先小范围试用 Workflow 规则，再逐步开放给同事。
**最终评判**：它不是最炫酷的 AI 项目，也不是功能最全面的企业级 DMS，但它在你真正需要的那个场景——**"把一堆乱七八糟的文档变成可搜索的数字资产"——做得足够好、足够稳、足够便宜（免费）**。对于想告别纸质档案柜、又不愿把敏感文件交给云厂商的人来说，它几乎是目前能做出的最优选择。
---
### 附：进阶使用技巧速查
<details>
<summary>📌 点击展开常见问题与配置片段</summary>
**Q1：如何让扫描仪自动推送？**
将扫描仪的"扫描到 SMB/FTP/NFS"指向宿主机映射到 `consume` 目录的共享文件夹即可。大部分主流型号（Brother、Epson、Fujitsu）均支持。
**Q2：如何重命名已入库的文档？**
Paperless-ngx 支持基于模板的文件重命名规则，可在管理后台的 "File Naming" 配置中设置形如 `{created_year}/{correspondent}/{title}` 的路径模板。
**Q3：如何备份？**
备份四个 Docker 卷（`data`、`media`、`pgdata`、`redisdata`）+ `export` 目录即可。推荐使用 `restic` 或 `borgbackup` 做增量备份。
**Q4：能否与 Nextcloud 共存？**
可以。两者定位不同——Nextcloud 做文件同步协作，Paperless-ngx 做归档检索。常见做法是用 Nextcloud 的外部存储挂载 Paperless 的 `media` 目录做二次备份。
**Q5：遇到 OCR 识别不准怎么办？**
- 检查扫描 DPI（建议 ≥300）
- 确认安装了正确的语言包
- 在管理后台启用"OCR 重跑"功能对已入库文档重新识别
- 严重不准确的文档可外接 PaddleOCR/Azure Document Intelligence 预处理后再入库
</details>
