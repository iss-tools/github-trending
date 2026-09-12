# yuliskov/SmartTube

[GitHub URL](https://github.com/yuliskov/SmartTube)


## SmartTube：Android TV 端最强开源 YouTube 客户端

> 专为 Android TV 打造的开源 YouTube 客户端，无广告、支持 8K 播放与 SponsorBlock。

- **Tags**: YouTube, 去广告, 开源, Android TV, SponsorBlock
- **Category**: 媒体播放, 开源软件, Android TV

## Details

# SmartTube（yuliskov/SmartTube）深度评测
## 一句话总结
SmartTube 是一款专为 Android TV/盒子打造的开源媒体客户端，主打“无广告、登账号、 SponsorBlock 跳片头赞助、画中画、投屏与多格式支持”，在官方 YouTube 体验日益臃肿的当下，成为最有价值的替代之一。
---
## 背景与痛点：它为什么存在？
- 官方 YouTube for Android TV 的广告越来越长且不可跳过，内容区被大量推广占据，干扰观看。  
- 许多用户想要在电视上登录自己的账号、同步订阅与历史记录，但不希望被广告追踪与推荐打扰。  
- 部分设备（如 Fire TV、不带 GMS 的电视盒子）在官方体验上被限制或功能残缺。  
- 想要更干净的电视端界面、更好的播放控制（倍速、8K、HDR、PiP）以及跳过赞助/片头片尾的能力。
SmartTube 在这些需求下应运而生：不依赖 Google 服务、界面简洁、去广告、支持登录、支持 SponsorBlock、投屏和画中画等，以“按你自己的规则观看媒体内容”为定位。
---
## 核心亮点与功能剖析
- 无广告体验与 SponsorBlock：内置 SponsorBlock，可跳过赞助、片头、片尾、非音乐段落等；界面无广告 UI 元素，播放也无贴片广告。  
- 播放能力：支持最高 8K 分辨率、60 fps、HDR；可调节播放速度、画中画（PiP）背景播放等。  
- 账号与订阅：可登录 Google 账号，同步订阅、点赞、播放列表与历史，但使用“一次性连接码”而非原生 OAuth 流程，权限受控（如无法修改密码）。  
- 投屏与远程：支持从手机等设备“投屏”，但需先在电视打开 SmartTube 并获取配对码；亦支持电视遥控器与外接软件键盘。  
- 不依赖 GMS：可在没有 Google 服务框架的设备上使用，对国内定制与国际品牌电视盒子兼容性强。  
- 社区与安全透明：内置更新与更新日志；官方提供 APK、版本号与 VirusTotal 报告；发布中说明签名与安全事件处理流程。
### 技术原理与设计理念（通俗解读）
- **像是一个“遥控器友好”的浏览器插件**：它并非重新实现 YouTube 协议，而是通过官方网页/内嵌 API 渲染内容，再用 TV 布局与交互封装。  
- **SponsorBlock 是“大众标注的进度条”**：由社区用户共同提交片头赞助等时间段，服务端汇总后给客户端查询，播放时按时间轴自动跳过。  
- **一次性连接码的“一次性入场券”**：账号授权只给予有限权限的一次性令牌，不保存密码，降低账号泄露风险。  
- **架构与实现**：以 Android 原生开发为主，适配 Android 4.3+；提供多种 ABI 包（arm64-v8a、armeabi-v7a、x86、universal）；官方站点提供源代码入口与 Issue 跟踪。
---
## 目标人群与收益
- 最适合：Android TV/电视盒子（Sony、Philips、Chromecast with Google TV、Fire TV、NVIDIA Shield、小米盒子等）用户，希望无广告登录 YouTube、享受 SponsorBlock 与倍速/画中画等进阶体验的人群。  
- 明显收益：  
  - 提升效率：自动跳过赞助/片头，省去手动快进时间。  
  - 降低干扰：界面无广告 UI，减少注意力分散。  
  - 硬件利用更充分：支持 8K、HDR 与高帧率，发挥高端设备性能。  
  - 跨品牌兼容：在不带 GMS 的设备上也能观看 YouTube。  
  - 成本节省：无需购买 YouTube Premium 即可实现大部分“无广告与背景播放”需求（但请注意账号使用仍需遵守 ToS）。
---
## 竞品/同类对比（简要定位）
- 官方 YouTube for Android TV：体验原生态、更新最快、功能最全，但广告多、界面臃肿，且受推荐算法强干预。  
- NewPipe / LibreTube：手机端的第三方客户端，去广告、隐私友好，但并非为 TV 界面设计，需要额外的投屏/转换才能在电视上用。  
- SmartTubeNext（第三方站点）：与本项目名形似但不同源，下载需谨慎，务必以官方 GitHub/官网为来源。  
- SmartTube 的独特竞争力：  
  - 专为 TV 界面与遥控器优化，而非手机移植。  
  - 官方 APK + VirusTotal 报告 + F-Droid 渠道，透明度较高。  
  - 社区活跃（32.6k Star、约 2k Fork、Issue/PR 与 Discussions 均在活跃使用）。  
  - 内置更新与“桥应用”实现语音搜索（需卸载原 YouTube 应用）。
---
## 局限与不足
- 平台限制：仅限 Android TV/盒子；手机/平板未优化且不官方支持；不支持三星 Tizen、LG webOS、Apple TV 等非 Android 平台。  
- 功能短板：  
  - 评论功能不稳定。  
  - 语音搜索与投屏体验可能不如官方应用，视设备而定。  
  - 无法下载视频。  
  - 18+ 视频、会员限定内容、4K 流当前存在已知问题（发布页公告）。  
- 安全风险：  
  - 2025 年官方披露开发环境曾遭恶意软件侵入，少数构建受影响；随后全面重建环境并对构建进行 VirusTotal 扫描，F-Droid 版本也将额外验签；建议通过官网/官方 GitHub 获取安装包并留意版本公告。  
- 安装门槛：  
  - 不上架 Google Play/Amazon Appstore，需通过 Downloader（输入代码）、ADB 或 USB U 盘侧载；新 Chromecast 需先开启开发者选项与“未知来源”。  
  - 对“小白”用户有一定学习成本。  
- 新 Fire TV 限制：从 2025 年 10 月起，新款 Fire TV 设备改用自家 VegaOS，将不再兼容 SmartTube。
---
## 上手与部署体验（GitHub 项目向）
- 安装方式（三种）：  
  1) 最简单：在 Android TV 上安装 Downloader，输入代码 79015（Beta）或 28544（Stable）；按提示允许未知来源安装即可。  
  2) 文件传输：把 APK 下载到手机/电脑，通过 Send Files to TV 等应用传到电视。  
  3) USB U 盘：把 APK 放入 U 盘，用 FX File Explorer/X-plore 等文件管理器在电视上安装（不要用系统自带管理器）。  
- 更新：应用内置更新，会在启动几秒内提示更新与变更日志；也可在设置中关闭自动检查或手动更新。  
- 版本选择：推荐 Beta（更新快、修复多），追求极致稳定可选 Stable；官方站点与 Releases 页同时提供最新版与 VirusTotal 报告。  
- 文档与支持：官方站点提供功能手册；问题反馈可走 GitHub Issue 或 Telegram 国际社区。
---
## 社区活跃度与生命力
- GitHub 数据：约 32.6k Star、约 2k Fork，Issue 638、PR 32；有 Discussions 板块，社区互动活跃。  
- 发布节奏：Stable/Beta 双线并行，更新频繁（32.38 Stable 与 32.38 Beta 均于 2026-09-01 前后发布），发布说明包含修复要点与 VirusTotal 检测链接。  
- 沟通渠道：官方站点提供 Telegram 国际/俄乌社区、邮箱联系方式；代码与变更透明可见。
---
## Demo/使用示例（代码与配置片段）
- 最快上手：在 Android TV 上安装 Downloader 应用，打开后输入地址（或代码）进行安装。
```
- Downloader 代码（Stable）：28544
- Downloader 代码（Beta）：79015
```
- 投屏配对（简化版步骤）：  
  1) 电视打开 SmartTube → 设置 → Remote control（第二个选项）；  
  2) 手机端打开 YouTube → 设置 → 通用 → 在电视上观看 → 使用电视码连接；  
  3) 输入电视显示的配对码。
- 画中画（PiP）开启：设置 → General → Background playback → Picture in picture；播放时按 Home 键（或返回键，需设置）即可触发。
---
## 避坑指南（实战经验）
- 首次安装若崩溃：确保安装到“内置存储”而非 SD 卡/外置存储；检查磁盘空间是否充足。  
- 不支持设备：非 Android 系统的电视（如 Samsung Tizen、LG webOS、Apple TV），请改用电视盒子/电视棒。  
- 评论与会员内容：评论功能不稳定，18+/会员限定/4K 暂时存在问题，参考发布页公告以获取最新状态。  
- 安全与来源：只从官网或 GitHub Releases 下载，避免第三方 APK 站点；留意“关于当前应用状态”的通知公告。  
- 新款 Fire TV：2025 年 10 月后发布的新机型（Fire Stick 4K Select 等）采用 VegaOS，不再兼容；请确认设备型号与系统底座。
---
## 结语与行动建议
- 终极评判：SmartTube 是目前 Android TV 生态里最成熟、社区最活跃的第三方 YouTube 客户端之一，无广告、SponsorBlock、8K/HDR、PiP 等特性极具实用价值；但官方披露的安全事件提醒我们从可信渠道获取、保持更新并适度关注安全公告。  
- 行动建议：  
  - 如果你的设备是 Android TV/盒子且可侧载应用，建议优先尝试 SmartTube；新手建议先从 Stable 入门，再按需升级 Beta。  
  - 安装前务必阅读官网“重要公告”与 Releases 页的版本说明，确认 4K/会员内容等当前状态。  
  - 做好“来源把关”：始终以官方 GitHub/官网与 F-Droid 为准，避免从不明 APK 站点获取。  
  - 若设备为新款 Fire TV（VegaOS）或非 Android 系统，应认清限制，选择电视棒/盒子方案或官方 YouTube。
