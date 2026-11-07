# mbillow/localthings

[GitHub URL](https://github.com/mbillow/localthings)


## LocalThings 深度评测：把三星家电从 SmartThings 云端拉回自家局域网

> 一个无需云端账号和订阅费、通过 OCF/CoAP-DTLS 协议在局域网内直连三星家电的开源 Home Assistant 集成。

- **Tags**: Home Assistant, 三星SmartThings, 本地控制, OCF协议, 智能家居
- **Category**: 开源项目, 智能家居, 开发工具

## Details

# LocalThings 深度评测：把三星家电从 SmartThings 云端拉回自家局域网
> 一句话总结：**LocalThings 是一个基于 OCF/CoAP-DTLS 协议、无需云端账号与订阅费，把三星 SmartThings 白色家电（洗衣机、烘干机、冰箱、空调、烤箱等）直连进 Home Assistant 的开源集成**——在 2026 年 10 月 Samsung 官方 SmartThings API 启动月费 4.99 美元收费之后，它几乎是目前唯一靠谱的"零订阅、零云端、可本地写控制"方案。
---
## 一、为什么它值得你现在就看
2026 年下半年，三星发布了一条让整个智能家居圈炸锅的公告：**SmartThings 云 API 的免费访问将于 2026 年 10 月后转入 4.99 美元/月的订阅制**。这意味着所有把三星洗衣机、冰箱、空调接进 Home Assistant 的用户，要么每个月掏钱包"续命"，要么眼睁睁看着这些设备在 HA 里变砖。
这正是 LocalThings 在 2026 年 6 月底横空出世的背景——它不是又一个"套壳官方 API"的集成，而是从协议层面绕开了 SmartThings 云，直接用 OCF + CoAP-DTLS 在局域网内跟家电对话。**它解决的问题不是"好不好用"，而是"你还要不要为已经在自己家里的设备每月付租金"**。截至 2026 年 11 月初，仓库已经积累 970 stars、102 forks、89 个 open issues，并保持在 HACS 默认集成列表内。
> 简单比喻：官方 SmartThings 集成像是"通过三星官方客服帮你转达指令"，而 LocalThings 是"拿到了对讲机，直接喊话家电本机"。
---
## 二、项目全貌与核心数据
| 维度 | 数据 |
|---|---|
| 仓库 | `mbillow/localthings` |
| 语言 / 许可证 | Python / MIT |
| 创建时间 | 2026-06-30 |
| 最近一次 push | 2026-11-07 |
| Stars / Forks / Open Issues | 970 / 102 / 89 |
| 当前版本 | v0.36.0 |
| 集成方式 | Home Assistant 自定义组件（已进入 HACS 默认列表） |
| 协议层依赖 | `smartthings-local`（PyPI 包，独立仓库 `QuiteYellow/SmartThings-Local`） |
短短 4 个多月从 0 到近千星、版本号从 0.x 一路迭代到 0.36，每周都有 release，贡献者名单里能看到 vmonkey、jjprz、roweboat123、BrawnyBravo、antiremy 等十几位名字——**这是一个社区驱动、节奏极快的活跃项目**，不是冷门玩具。
它支持的家电覆盖面也相当吓人：空调（含多联机）、空气护理机、空气净化器、除湿机、洗碗机、烘干机、洗衣机/洗烘一体机、冰箱（含韩国泡菜冰箱、酒柜）、烤箱、灶具与油烟机、微波炉、EHS 热泵、净水器、扫地机器人（早期支持）、Soundbar、吸尘基站……基本把三星白色家电能联网的都撸了一遍。
---
## 三、核心技术架构：它是怎么"绕过云"的
### 3.1 协议层：站在三星自己的开放标准上
LocalThings 没有自己发明私有协议，而是踩进了三星家电本就实现的 **OCF（Open Connectivity Foundation）标准**：
- **OCF 资源发现**：通过 `/oic/res` 探测可用资源，通过 `/oic/d` 读取设备类型（如 `oic.d.washer`），优先用标准 OCF 资源而不是三星私有扩展。
- **CoAP over DTLS**：用 RFC 7252 定义的 CoAP（受约束应用协议），套一层带 X.509 客户端证书的 DTLS 加密会话；推送更新走 RFC 7641 的 CoAP Observe，大响应走 RFC 7959 的 Block-wise Transfer。
**这意味着什么？** 三星家电在出厂时就在局域网里运行了一个本地的 CoAP-DTLS 服务端（UDP 49152–49160 端口段），并用三星自家签发的 AC14K_M 中间 CA 来授权特定的客户端身份——而 smartthings-local 库正是利用这一点，把一个"三星官方认证的客户端证书"自己签发出来，让 HA 装扮成"被授权设备"直接对话家电。这不是黑进去的漏洞，而是**三星自家设备身份体系的一个"未对外宣称但确实开放"的侧门**。
### 3.2 状态管理：分层轮询 + Observe 推送
协议层库 `smartthings-local` 把"如何高效知道家电此刻在干嘛"做成了一个很精致的设计：
- **StateCache**：所有状态数据的单一真值源；
- **PollScheduler**：分层自适应轮询，**热层（运行状态、门锁）**亚秒级刷新，**冷层**降频省资源——分层频率是按实测固件上限校准的（烘干机约 14 req/s、烤箱约 8 req/s）；
- **KeepaliveTask**：CoAP 空 CON ping 维持 DTLS 长连接活性；
- **Observe（RFC 7641）作为机会型加速器**：设备能推送就秒级感知，不能推送就退化为纯轮询，代码零改动兼容。
HA 集成层 LocalThings 在此之上做的是标准的 HA 数据更新协调器模式：推送 + 30 秒兜底轮询双通道，DHCP discovery 自动跟随 IP 漂移，设备诊断自动脱敏（抹掉邮箱、MAC、序列号、Wi-Fi 密码等），并支持 10 种语言的实体名翻译。
### 3.3 声明式家电映射：可扩展性的"杀手锏"
最聪明的一点是：**每种家电类型就是一张"资源 → HA 实体"的声明式映射表**，并用 90+ 真实设备抓包做测试覆盖。这意味着当一个新型号设备出现时，维护者通常只需要加一条表项，**完全不用碰协议代码**——这是项目能在 4 个月里高速扩展支持面、且社区贡献者能轻松提 PR 的根本原因。
> 类比一下：这就好比把"翻译三星家电方言"这件事拆成了"词典"（声明式映射）和"语法"（CoAP-DTLS 协议层），新增一个国家的语言只需要补词典，不用重写语法书。
---
## 四、Demo 与部署演示
### 4.1 普通用户：3 步上手
如果你已经有 HA + HACS，部署体验接近"零门槛"：
```text
1. HACS → Integrations → 搜索 "LocalThings" → Download（默认列表里就能搜到）
2. 重启 Home Assistant
3. Settings → Devices & Services → Add Integration → LocalThings → 填入家电 IP
```
**首次添加**时它会连一次三星服务器拿一个公共标识符（**不需要登录三星账号**），之后再添加其他设备就完全离线、只需填 IP 即可。Lucky 的话，到这一步设备就能自动识别类型、自动生成所有传感器和开关。
### 4.2 协议层开发者：直捣底层
如果你想绕开 HA 抽象层、自己写脚本玩协议，`smartthings-local` 在 PyPI 上直接可用：
```python
import cbor2
from smartthings_local.protocol.dtls_session import DtlsCoapSession
# 1. 建立带客户端证书的 DTLS-CoAP 会话
sess = DtlsCoapSession(
    "192.168.1.100", 49154,
    cert_path="certs/client_fullchain.pem",
    key_path="certs/client.key",
)
sess.connect()
sess.start_reader()
# 2. 读取设备状态（自动处理 Block2 大响应）
code, body = sess.get(["device", "0"])
# 3. 写入命令（如切换模式）
code, _ = sess.post(["mode", "vs", "0"], cbor2.dumps({}))
# 4. 订阅推送（CoAP Observe）
sess.subscribe(["operational", "state", "vs", "0"],
               on_notification=lambda href, payload: print(href, payload))
sess.close()
```
证书签发也有现成脚本 `setup_cert.py`，一条命令搞定：`TARGET_IP=192.168.1.32 python setup_cert.py --test`——脚本会自动拉 AC14K_M CA、连一次三星云网关读 UUID、本地生成密钥对、并实测一次 DTLS 握手验证可用。
### 4.3 兼容性预检：先确认你家设备能不能用
不是所有三星家电都开了这扇门。**2022 年之后的设备（Tizen RT 3.x / DAWIT 3.0+ 固件）走新协议，2018–2022 的部分型号走老协议（TCP 8888 token-based）**。最稳的预检方式是拿 nmap 扫一下 UDP 49152–49160：
```bash
nmap -Pn -sU -p 49152-49160 <家电IP>
```
只要看到某个端口处于 `open` 或 `open|filtered`，基本就能确认它跑的是新协议。
---
## 五、目标人群与收益
| 用户画像 | 核心收益 |
|---|---|
| **已有三星白色家电的 HA 重度玩家** | 一次性省下每年 60 美元的 SmartThings 订阅费，并且拿到**官方云 API 都不提供的部分写控制**（如烘干机课程选择、烤箱温度 setpoint，云集成里部分是只读的） |
| **隐私敏感党 / 局域网至上派** | 所有状态与指令全程不出家门，HA 与三星云之间零流量；虽然家电自身仍连着三星（这是设备本身的设计），但你的自动化逻辑完全离线运行 |
| **能源监控 / 自动化党** | 实时功率 + 累计 kWh 可直接接进 HA Energy Dashboard；配合"剩余时间/预计结束时间"传感器，可做"衣服洗完了推送到手机"、"洗碗机运行时电价高了自动延后启动"等自动化 |
| **多设备 / 多楼层家庭** | 多联机空调的每个内机、双腔烤箱的每个腔体，都能拆成独立设备与 climate 卡片 |
| **协议研究员 / 底层开发者** | `smartthings-local` 是个干净独立的 Python 库，不绑 HA；想接入 Homebridge、Homey、自定义脚本、其他平台都行（Homey 已经有人做了移植） |
---
## 六、竞品对比：它到底处在什么生态位
| 维度 | **LocalThings** | 官方 HA SmartThings 集成 | SmartThings App（三星官方） | smartthings-local 原生库 |
|---|---|---|---|---|
| 数据通路 | 局域网直连（CoAP-DTLS） | 云端（SmartThings Cloud API） | 云端 | 局域网直连 |
| 2026.10 后费用 | **0 元** | 4.99 美元/月（三星收费） | 0 元（但只能在三星 App 内用） | 0 元 |
| 离线可用 | ✅ | ❌ | ❌ | ✅ |
| 写控制（启动/暂停/切程序） | ✅ 大部分设备可用 | ✅ | ✅ | ✅ |
| 云集成独有的能力 | ❌ 少量场景缺失（如某些场景联动、设备远程重置） | ✅ 全部 | ✅ | ❌ |
| 部署难度 | HACS 一键（需 IP） | UI 配置流（需 OAuth） | 装个 App | 需自己签证书 |
| 适用人群 | HA 重度玩家 | 仍想用云且愿意付费的用户 | 普通消费者 | 协议开发者 |
| 维护活跃度 | ★★★★★（每周 release） | ★★★★（HA 官方维护） | ★★★★★ | ★★★（上游协议库） |
**结论一句话**：在"白电场景下不想给三星付月费"这个细分赛道上，LocalThings 几乎没有对手。它不像官方集成那样能覆盖所有场景（比如某些基于云的联动场景、远程重置），但它在**自己覆盖的范围内反而比云集成更彻底**——例如云集成里部分烤箱温度是只读的，LocalThings 这里却能写。
---
## 七、局限与避坑指南（看完再决定要不要上）
这部分是我作为一个"老智能家居玩家"给你的实战经验，比 README 里那些官话更重要：
### 7.1 三星家电的" stubborn"设计——你必须知道
- **设备必须保持在 SmartThings App 里注册**：哪怕你彻底断掉家电的外网访问，如果你在 SmartThings 里把它删除，**设备下次连上三星云时会主动重置 Wi-Fi**，掉线直到你重新在 App 里配网。这是设备自身固件的设计，LocalThings 无能为力。
- **部分洗衣机/烘干机的能耗统计依赖云**：DA_WM_TP2_20_COMMON 主板（如 WW80T654ALX、DV80T6220LX）在断云期间累计 kWh **停止计数**，重新连上云才恢复。所以"彻底 air-gap"这类设备，你的电量传感器就废了。
- **远程控制开关必须开启**：设备断电后 Remote Control 会自动关闭，HA 里的写指令会失败——这是家电自身的安全设计，不是 bug。
- **同一时刻设备只接受一个本地连接**：如果你有别的脚本、另一个平台也在跟它保持长连接，会相互挤掉。短暂掉线重连是正常现象，频繁掉线（每分钟几次）通常是 Wi-Fi 信号差。
### 7.2 老设备（2018–2022 TCP 8888 协议）的额外坑
- 这一类设备只支持 **TLS 1.0**，且证书无法验证——LocalThings 在这一条连接上放宽了 TLS，但这是唯一一处放宽，不是项目整体的回退。
- 获取 token 时要**确保家电能反向连到 HA 的 8889 端口**，且 **Remote Control 必须开启、门必须关好**。
- 特定型号（NZ36K7570R、NZ30K7570RS 灶具，NV51K777OS 烤箱，NQ70M6650DS 微波烤箱一体）**如果 Smart Connect 已经打开，就永远拿不到 token**——必须先关 Smart Connect，请求 token，再打开。
- 这些老设备的"选择循环/温度/转速"是**先暂存、再由 Start 按钮一起下发**的语义，跟新版设备不一样，写自动化时要特别注意。
### 7.3 证书与兼容性风险
- **少数设备会拒绝自动签发的证书**（Issue #435 还在跟进）。目前没有已知的可用 fallback，只能等社区进一步逆向。
- 这条协议路径**不是三星官方支持的方式**，本质上是利用三星自家 ACL 体系的"侧门"。**理论上**未来某次固件升级可能会关掉它——虽然过去几年这条 AC14K_M CA 一直没被收紧，但没有任何官方承诺。如果三星真要封路，你大概率还得回退到云集成或订阅。
- 仓库尚在 0.x 阶段，每次升级都有 entity ID 改名、状态值大小写变化、被移除实体等 breaking change（见 v0.35、v0.36 的 Upgrade Notes），**升级前先看 Release Notes**。
### 7.4 上手前的小建议
1. **先用 nmap 预检**你家设备跑的是新协议（UDP 49152–49160）还是老协议（TCP 8888），心里有数再装。
2. **加第一台设备时让 HA 能短暂联网**（拿一次公共标识符），之后的设备就完全离线可加。
3. **不要把家电从 SmartThings App 里删掉**，除非你想让它掉线。
4. **遇到"设备能连但功能缺"的情况**，去 Settings → System → Repairs 看提示，下载脱敏诊断文件发到 GitHub issue，社区通常几天内就能补一张映射表。
---
## 八、终极评判：装还是不装？
**强烈推荐给**：手里已经有 2022 年后三星白色家电、又在用 Home Assistant 的人。这不是"要不要装"的问题，而是"什么时候装"的问题——再过几个月官方云集成开始收费，你会感谢现在动手的自己。从协议优雅性、可扩展性、社区活跃度、文档质量四个维度看，它都属于近两年 Home Assistant 生态里最出色的第三方集成之一，是社区在"厂商关云"事件下自救的标杆之作。
**谨慎评估给**：手里只有 2018–2022 期间的老设备、或设备里包含 DA_WM_TP2_20_COMMON 这类能耗依赖云的主板——前者部署步骤多一些（token 流程繁琐），后者某些传感器会变哑。
**不建议折腾给**：① 仍在用三星 SmartThings App 主导全家自动化、且不介意付月费的"云原生"用户，LocalThings 反而会增加复杂度；② 用 Homey、Homebridge 等其他平台的用户——目前 Homey 已有移植（`moKorean/com.lomohome.localthings`），可以等对应平台的版本成熟。
一句话收尾：**LocalThings 是一个把"厂商如何用开放标准锁住自家设备"逆向得清清楚楚、又用极优雅的工程把答案还给你用的项目——它值得每一位 HA 用户花 30 分钟装上，也值得每一位协议爱好者把 `smartthings-local` 的源码翻一遍当教材读。**
