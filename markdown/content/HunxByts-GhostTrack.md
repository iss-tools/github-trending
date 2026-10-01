# HunxByts/GhostTrack

[GitHub URL](https://github.com/HunxByts/GhostTrack)


## GhostTrack 深度评测：8 个月狂揽 16k Star 的 OSINT 入门神器

> 一款把 IP 定位、手机号解析、社媒用户名嗅探三合一的 Python 命令行 OSINT 入门工具。

- **Tags**: OSINT, 开源项目, 网络安全, Python, 信息收集
- **Category**: 开发工具, 网络安全

## Details

# GhostTrack 深度评测：一款被"过度包装"的 OSINT 入门神器
> **一句话总结**：GhostTrack 是一款由印尼开发者 HunxByts 打造的 Python 命令行 OSINT 工具，用极简的菜单式交互把 IP 地理定位、手机号归属解析、社媒用户名嗅探三大"公开信息查询"整合在一起——**它不是电影里的实时定位器，但它确实是小白进入 OSINT 世界最友好的一扇门，也是教学演示和 CTF 侦察的轻量利器**。
---
## 一、背景与痛点：为什么它能在 8 个月内狂揽 16k Star
在 GhostTrack 出现之前，做一次"IP 是谁、手机号是哪家运营商、这个用户名在哪些平台注册过"的基础侦察，通常需要分别调用 ipinfo.io、phonenumbers 文档、Sherlock 等多个工具或 API——对刚入门 OSINT 的新手而言门槛极高。
**GhostTrack 的设计哲学就是"把碎片化的公开查询装进一个终端菜单"**：
- 仓库目前 16.1k Star、2.2k Fork、171 Watchers，Star 增长曲线在 2025 年下半年多次冲进 GitHub Trending Python 榜前列。
- 整个仓库只有 **4 个文件**：`GhostTR.py`（核心脚本）、`requirements.txt`（依赖）、`README.md`、`asset/`（banner 图片），23 次提交、仅 2 位贡献者，版本停留在 **v2.2**。
- 值得玩味的是，社区中有人对其 Star 增速提出"是否存在刷星嫌疑"的质疑（heathdutton 的 gist 曾把该项目列入疑似 lockstep star 列表），但官方未确认，读者需自行判断热度与实际工程价值的差距。
> 💡 **划重点**：Star 数 ≠ 工程价值。GhostTrack 的高热度很大程度上来自"黑客工具"标签的传播效应，而非其技术复杂度。
---
## 二、核心亮点与功能剖析：三根柱子撑起一切
### 2.1 极简架构：一个装饰器 + 三个函数
GhostTrack 的源码不足 300 行 Python，整体架构可以用"**瑞士军刀**"来比喻——每一片刀刃都独立但共享同一个刀柄（终端菜单）：
```python
# 核心装饰器：每次进入菜单前重绘 banner
def is_option(func):
    def wrapper(*args, **kwargs):
        run_banner()
        func(*args, **kwargs)
    return wrapper
@is_option
def IP_Track():
    ip = input("Enter IP target : ")
    req_api = requests.get(f"http://ipwho.is/{ip}")   # 调用 ipwho.is 公共 API
    ip_data = json.loads(req_api.text)
    # 解析并打印国家、城市、经纬度、ISP、ASN、Google Maps 链接...
```
依赖只有两个：**requests** 和 Google 官方的 **phonenumbers** 库，开箱即用零配置。
### 2.2 三大功能模块拆解
| 模块 | 技术栈 | 数据来源 | 输出内容 |
|---|---|---|---|
| **IP Tracker** | requests + JSON 解析 | ipwho.is 公共 API | 国家/城市/经纬度/ISP/ASN/时区/Google Maps 链接 |
| **Phone Tracker** | phonenumbers 库 | 本地号段数据库 | 归属地/运营商/号码类型/E.164 格式/时区 |
| **Username Tracker** | HTTP GET + 状态码判断 | 25+ 社媒平台公开 URL | 命中平台列表及个人主页链接 |
**特别值得称赞的细节**：
- **Phone Tracker** 默认区域设置为 `"ID"`（印尼），这源于作者背景，但换用国际格式（如 `+86138xxxxxxxx`）依然可正常解析全球号段。
- **Username Tracker** 覆盖 Facebook、Instagram、LinkedIn、GitHub、TikTok、Telegram、Medium、Twitch 等 25+ 主流平台，一次性批量探测。
- ANSI 彩色终端输出 + ASCII banner，对新手来说"看起来就很黑客"，实际是一种精心设计的**心理仪式感**——降低了命令行工具的枯燥感。
### 2.3 与 Seeker 的"组合技"
GhostTrack 官方 README 明确推荐与 **Seeker**（thewhiteh4t 开发）联动：Seeker 通过托管伪装页面捕获目标点击时的真实 IP 和精确 GPS（50–100 米），把结果喂给 GhostTrack 做 IP 深度解析。这是它在pentest圈内真正被实战使用的方式。
---
## 三、真实使用演示：5 分钟上手全流程
### 安装（Linux / Termux 通用）
```bash
sudo apt-get install git python3        # Termux 用 pkg install
git clone https://github.com/HunxByts/GhostTrack.git
cd GhostTrack
pip3 install -r requirements.txt
python3 GhostTR.py
```
### 启动后你会看到
```
[ 1 ] IP Tracker
[ 2 ] Show Your IP
[ 3 ] Phone Number Tracker
[ 4 ] Username Tracker
[ 0 ] Exit
[ + ] Select Option :
```
### 实测案例 1：查询一个 IP
输入 `8.8.8.8`，2 秒后返回：
```
IP target : 8.8.8.8
Type IP : IPv4
Country : United States
City : Mountain View
Latitude : 37.4223 / Longitude : -122.085
Maps : https://www.google.com/maps/@37,-122,8z
ASN : AS15169
ISP : Google LLC
Timezone : America/Los_Angeles
```
### 实测案例 2：解析一个手机号
输入 `+8613800138000`，返回：
```
Location : Beijing
Region Code : CN
Operator : China Mobile
Valid number : True
Number type : MOBILE
E.164 : +8613800138000
```
> ⚠️ **关键认知纠偏**：这里的"Location"是**号段归属地**（运营商注册地），不是手机当前物理位置。想定位真实位置，需要走基站、恶意链接配合 Seeker 等更复杂的路径。
---
## 四、目标人群与收益：谁该用、谁别用
| 用户画像 | 是否推荐 | 能拿到什么 |
|---|---|---|
| OSINT 初学者 | ✅ 强烈推荐 | 一晚学会 IP 定位、号段解析、社媒嗅探的基本套路 |
| CTF 选手 / 红队入门 | ✅ 推荐 | 快速做侦察 footprint，做 Link 前置情报收集 |
| 安全意识培训讲师 | ✅ 推荐 | 现场演示"你的手机号能暴露什么"，冲击力极强 |
| 企业安全运营中心（SOC） | ⚠️ 不推荐 | 缺少 API Key 管理、日志审计、批量能力 |
| 专业情报调查员 | ❌ 不推荐 | 应改用 Maltego、SpiderFoot、PhoneInfoga |
| 想窥探他人隐私的人 | ❌ 法律风险极高 | 见第七节 |
**核心收益**：把"OSINT 侦察三件套"的学习曲线从一周压缩到 10 分钟，这是它真正的价值锚点。
---
## 五、竞品横向对比：它在 OSINT 工具谱系中的位置
| 工具 | 主打能力 | 平台覆盖 | 上手难度 | 适用场景 |
|---|---|---|---|---|
| **GhostTrack** | IP+Phone+Username 三合一菜单 | 25+ 社媒 | ⭐ 极简 | 教学、快速 demo |
| **Sherlock** | 纯 Username 嗅探 | 400+ 平台 | ⭐⭐ | 深度用户名侦察 |
| **Maigret** | 用户名 + 递归身份图谱 | 3100+ 平台 | ⭐⭐⭐ | 专业 OSINT |
| **PhoneInfoga** | 电话号深度侦察（VOIP 判定、号码池） | 全球号段 | ⭐⭐⭐ | 反欺诈、信安 |
| **Seeker** | 伪装链接捕获精确 GPS | — | ⭐⭐ | 红队社工 |
| **Maltego** | 可视化情报关联分析 | 100+ 数据源 | ⭐⭐⭐⭐⭐ | 企业级调查 |
| **SpiderFoot** | 自动化被动情报聚合 | 200+ 模块 | ⭐⭐⭐⭐ | 自动化侦察 |
**GhostTrack 的独特竞争力**：**唯一一款把"小白最常问的三件事"塞进同一个菜单的工具**。Sherlock 专注度更高，PhoneInfoga 专业性更强，Maltego 更全面，但它们都需要读者去查文档；GhostTrack 的"傻瓜式菜单"本身就是护城河。
**技术上的真实定位**：它更像一个"**API 包装器**"（wrapper），真正的智能来自 ipwho.is 和 phonenumbers 这些上游项目。把它当成"瑞士军刀"没问题，但别把它当成"工业级机床"。
---
## 六、局限与不足：把它拉回现实的五个真相
### 1. 能力天花板极低，与"追踪"二字严重不符
Hongkiat 的实测文章直言不讳：**"The pitch oversells what it does"（宣传远远夸大了它的实际能力）**。你拿到的永远是"号段归属地"和"IP 注册地"，不是实时坐标。
### 2. Username Tracker 的判断逻辑过于粗糙
源码中判断"账号存在"的标准是 **HTTP 200 状态码**：
```python
response = requests.get(url)
if response.status_code == 200:
    results[site['name']] = url
```
问题在于：Instagram 对未登录请求、LinkedIn 对关闭主页、TikTok 对地区屏蔽都可能返回 200 但实际内容为空，**误报率（false positive）非常高**。Sherlock 之所以专业，就在于它用正则匹配页面内容而非单纯看状态码。
### 3. 默认区域硬编码为印尼（ID）
```python
default_region = "ID"  # DEFAULT NEGARA INDONESIA
```
对印尼用户友好，对其他地区用户需要在输入时强制带国家码，否则解析可能出错。这是一个**新手最容易踩的坑**。
### 4. 无许可证文件，商用存在法律模糊
仓库根目录**没有 LICENSE 文件**。代码注释里作者甚至用《古兰经》的诗句呼吁"重编码请先征得同意"（印尼语：*MAU RECODE ??? IZIN DULU LAH*），这既是一种文化趣味，也意味着：**严格来说，在未获作者授权的情况下 fork 改写商用存在法律风险**。
### 5. 文档极简，社区几乎无沉淀
README 仅 39 行，没有 FAQ、没有错误码说明、没有贡献指南。93 个 Issue 的解决速度偏慢，Pull Request 31 个长期未合并。**遇到 bug 基本只能自己读源码**。
---
## 七、法律与伦理红线：必须先说清楚的事
GhostTrack 本身**只调用公开 API 和公开页面**，技术上是合法的。但**使用场景决定合法性**，以下是硬红线：
- ✅ **合法**：企业安全自查、CTF 竞赛、授权红队渗透测试、安全教学演示、找回自己的账号。
- ❌ **违法**：跟踪骚扰、人肉搜索、配偶出轨调查、未经授权的雇主背调、绕过 GDPR/CCPA/《个人信息保护法》的数据采集。
在中国大陆，《刑法》第 253 条之一（侵犯公民个人信息罪）的入罪门槛极低——**非法获取、出售 50 条以上个人信息即可入刑**。GhostTrack 输出的归属地+运营商+社媒链接组合，在司法实践中可能被认定为"公民个人信息"。工具无罪，但使用它的那一刻，责任完全在使用者身上。
---
## 八、结语与行动建议：终极评判
> ** GhostTrack 是一款"教科书级"的 OSINT 入门玩具，也是一面照妖镜——照出你对"追踪"二字的幻想，也照出你数字足迹的脆弱。**
### 评分卡
| 维度 | 评分（满分 5） | 点评 |
|---|---|---|
| 上手难度 | ⭐⭐⭐⭐⭐ | 5 分钟装好跑通 |
| 功能深度 | ⭐⭐ | API 包装器水平 |
| 代码质量 | ⭐⭐⭐ | 简洁可读但无测试 |
| 社区生态 | ⭐⭐ | Star 高但沉淀少 |
| 实战价值 | ⭐⭐⭐ | 教学满分，生产环境不足 |
| **综合** | **⭐⭐⭐** | **入门神器，进阶跳板** |
### 行动建议
1. **如果你是 OSINT 新手**：立刻 clone 下来跑一遍，把它的源码当作"OSINT 三件套"的活教材，一周内你会比 90% 的同龄人更懂信息暴露面。
2. **如果你要做正经渗透测试**：把它和 Seeker、PhoneInfoga、Sherlock 组成工具链，让 GhostTrack 承担"第一层快速侦察"的角色。
3. **如果你打算二次开发**：先给作者发 Issue 请求授权，再把 Username Tracker 的判断逻辑改成内容正则匹配，把 Phone Tracker 的默认区域做成参数——这两处改完，项目价值翻倍。
4. **如果你只是好奇心驱动的普通用户**：把它当作一面镜子，跑一次自己的 IP 和手机号，你会震惊于自己暴露了多少信息——然后去关掉手机号归属地显示、清理社媒旧账号。
GitHub 链接：`https://github.com/HunxByts/GhostTrack`
**最后一句忠告**：这个工具最厉害的地方，不是它能查出别人什么，而是它能让第一次使用它的你，意识到自己在互联网上有多么"透明"。
