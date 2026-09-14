# peetzweg/opendisplay

[GitHub URL](https://github.com/peetzweg/opendisplay)


## OpenDisplay：把闲置苹果设备变副屏的开源方案

> 开源免费方案，将闲置苹果设备变为 macOS 低延迟扩展显示器，支持触控且无需订阅。

- **Tags**: 屏幕扩展, 效率工具, 开源, 苹果生态, 隐私保护
- **Category**: 实用工具, 开源项目, 效率软件

## Details

# OpenDisplay 深度评测：把闲置苹果设备变成第二块屏幕的开源“私房菜”
---
## 一句话总结
OpenDisplay 是一套将 iPhone/iPad（甚至旧 Mac）变为你 macOS 真正的扩展显示器的开源方案，支持 USB/Wi-Fi 低延迟、Retina 清晰度与触摸输入，且完全本地自托管、无需账号与订阅。适合希望避免订阅与硬件狗、同时在意可审计性与隐私的 Mac 用户尝试与贡献。
---
## 背景与痛点：为什么会有 OpenDisplay？
- 想把闲置的 iPhone/iPad 当第二屏幕用，却面临这些不完美：  
  - Apple 自带的 Sidecar：免费但要求两设备同 Apple ID，且只支持 iPad、不支持 iPhone，硬件兼容性列表也有限制。  
  - Duet Display：从买断转向订阅，长期使用成本高；还有隐私与云端依赖的顾虑。  
  - Luna Display：需要额外购买硬件“狗”，并占用端口。  
  - 其他“串流桌面类”方案：多数是镜像而非真正的扩展屏，或延迟/画质/隐私不尽如人意。
- 痛点很现实：  
  - 多设备协同需要“零门槛、低成本、足够稳”的方案；  
  - 希望画质像 Sidecar 一样 Retina、延迟像有线一样低；  
  - 并且不希望屏幕内容经过任何第三方服务器。
OpenDisplay 诞生的目标就是：成为那个“缺失的选项”——免费、开源、无账号、无硬件狗，直接利用你手里的苹果设备来实现真正的扩展显示器。
---
## 核心亮点与功能剖析
### 1. 真正的“扩展显示器”，不仅仅是镜像
- macOS 会把连入的 iPhone/iPad 当成一块真正的副显示器，支持系统设置中的排列与拖拽窗口。  
- 同时也提供镜像模式，可按需切换。  
- 对“小白”来说，这就和插了一台普通显示器一样，不需要改变使用习惯。
### 2. USB 有线与 Wi‑Fi 无线双模，低延迟优先
- USB：通过 Lightning/USB‑C 线，调用 macOS 自带的 usbmuxd 走本地链路，无网络抖动、无辅助工具，插上即用。  
- Wi‑Fi：使用 Bonjour 自动发现，从 Mac 端下拉选择手机即可连接，零配置。  
- 延迟优化关键点：  
  - 硬件 H.264 编码（VideoToolbox、实时模式、无 B‑帧）；  
  - TCP_NODELAY + 丢帧背压与关键帧恢复；  
  - 接收端用 AVSampleBufferDisplayLayer 解码渲染。
### 3. Retina / HiDPI 像素级对齐，文字清晰
- 虚拟显示器按设备面板物理像素 @2x 生成，macOS 侧以 half‑in‑points 呈现，做到 Retina 级清晰度。  
- 横竖屏旋转时，虚拟显示会按原生分辨率重建，无需手动设置。
### 4. 触摸与滚动输入，手机变触控板
- 点击即点击、拖拽即拖拽、双指滚动模拟触控板体验。  
- 说明中提到 Apple Pencil 支持在路线图上，目前暂未压感/倾斜，但触控基础能力已完整可用。
### 5. 旧 Mac 也能当副屏
- 安装 OpenDisplay Receiver（macOS 12+）后，任意一台旧 Mac 可被当作副显示器，支持 Wi‑Fi 与 Thunderbolt/以太网/USB‑C 线缆连接，同样 Retina。
### 6. 自托管、可审计的隐私设计
- 两个小 App、一条本地 TCP 直连，没有云端中转、没有账号与分析。  
- 官网隐私页进一步阐述数据仅存本地、Wi‑Fi 加密注意事项与日志机制。  
- 对隐私敏感的开发者/企业场景尤为友好。
### 7. 开源协议与社区扩展
- 许可证为 GPL‑3.0，可商用但需保持开源；早期 v0.4.x 及之前版本仍为 MIT。  
- 官方 App 覆盖 Mac 发送端与 iOS/iPadOS 16.4+ 接收端；社区已有 Android 接收端与 Linux 发送端（非官方），协议通过 PROTOCOL.md 公开，可据此编写自定义客户端。
---
## 技术栈与架构解析
- 语言与生态：Mac 端与 iOS 端主要使用 Swift + Apple 原生框架（CoreGraphics、ScreenCaptureKit、VideoToolbox、Network 等）。  
- 核心链路（技术“流水线”的比喻）：  
  - CGVirtualDisplay：让 macOS 相信接了一块显示器（私有 API，同类产品也用）。  
  - ScreenCaptureKit：抓取虚拟显示器内容。  
  - VideoToolbox：硬件编码为实时 H.264 码流（低延迟优先）。  
  - TCP 传输：[4 字节长度][Annex B 帧] 格式，端口 9000；通过 USB 的 usbmuxd 或局域网 Bonjour 路由。  
  - 接收端用 AVSampleBufferDisplayLayer 解码渲染；控制信令（hello/触摸/滚动）以 JSON 回传，Mac 端注入 CGEvent 实现输入。  
- 设计精妙之处：  
  - “手机监听、Mac 连接”的顺序统一了 USB 与 Wi‑Fi 两种传输路径，减少分支复杂度；  
  - 通过公开协议文档与兼容性文档，使第三方可独立开发客户端，无需逆向工程源码。
---
## 上手门槛与部署体验
### 系统要求与安装
- Mac：需要 macOS 14+（发送端）；若要 Mac 作为接收端（副屏），则需 macOS 12+。  
- iOS/iPadOS：16 或更新（包括 16.7.x 系列，覆盖 iPhone 8/X 与 iPad 5/Pro 1 等 2017 前后机型）。  
- 安装方式：  
  - Mac：从 Releases 下载 OpenDisplay.dmg（发送端）与 OpenDisplayReceiver.dmg（接收端），拖入 Applications 即可；已签名与公证，双击直接打开，无 Gatekeeper 警告。Sparkle 实现自更新机制（Appcast 来自官网托管）。  
  - iOS：推荐 TestFlight 公开测试；也可自行 Xcode 编译（需 Apple ID 用于签名）。  
  - 官方提供 Quick Start 文档链接与从源码构建的脚本示例。简要步骤如下：  
```bash
brew install xcodegen   # 项目生成依赖
git clone https://github.com/peetzweg/opendisplay.git
cd opendisplay
echo "DEVELOPMENT_TEAM=YOURTEAMID" > .env
./generate.sh  # 生成项目
# 在 Xcode 中打开 OpenSidecar.xcodeproj 并分别运行 Mac/iOS 目标
```
### USB 模式（推荐，最低延迟）
- 手机端安装并打开 OpenDisplay App（监听 9000）。  
- Mac 端运行 App 或执行 ./run.sh，将通过 usbmuxd 自动发现并直连，无需隧道工具。  
- 首次运行时按提示授予“屏幕录制”“辅助功能”权限各一次即可；USB 模式无需“本地网络”权限。
### Wi‑Fi 模式
- 确保两设备在同一局域网，并在 Mac 与 iPhone 上均允许“本地网络”权限（否则会“静默失败”）。  
- 保持手机 App 在前台，Mac 端从 Connection 菜单选择“iPhone (Wi‑Fi)”。
### 权限与排错
- Mac：屏幕录制（抓屏）、辅助功能（输入注入）、本地网络（Wi‑Fi 发现）。  
- iOS：本地网络（Wi‑Fi 发现）。  
- App 内置权限状态面板（Mac）与设置/帮助页面（iOS，可摇一唤出），可快速自助排障。
### 日志与问题反馈
- Mac：点击“Logs”按钮，会打开 ~/Library/Logs/OpenDisplay 目录。  
- iOS：通过设置/帮助或摇一唤出“Connection log”，可分享或复制文本。  
- 提 Issue 建议附上双端日志，便于社区快速定位问题。
---
## Demo / 最小可复现示例（快速体验）
### 以 USB 为例（最简单路线）
- 1) 确保数据线支持“充电+数据传输”，USB 2.0 即可（项目最高画质约 18 Mb/s，远低于 USB 2.0 带宽）。  
- 2) 在 iPhone 上加入 TestFlight 并安装 OpenDisplay，或自行编译安装。  
- 3) 在 Mac 上安装最新 OpenDisplay.dmg 并启动。  
- 4) 用数据线连接两设备，Mac 会自动识别并连接，状态显示“Cable”。  
- 5) 系统会弹出权限提示（屏幕录制、辅助功能），按提示勾选并重启 App。  
- 6) 将任意窗口拖入新的虚拟显示器，即可看到副屏呈现；点击、拖动、双指滚动均能同步回 Mac。
### 以 Wi‑Fi 为例（无电缆场景）
- 两设备连同一 Wi‑Fi；在系统设置中确保双方“本地网络”权限已开启。  
- 打开 iPhone App，在 Mac App 的 Connection 菜单中找到“iPhone (Wi‑Fi)”并连接。
---
## 目标人群与收益
- 经常移动办公、需要额外一块屏幕但不想买外接显示器的 MacBook 用户。  
- 手头有闲置 iPhone/iPad/旧 Mac，想以极低成本“变废为宝”的用户。  
- 希望彻底避免订阅制、不信任第三方云服务的隐私敏感用户或团队。  
- 想要了解虚拟显示器/屏幕捕获/硬件编码等端到端实时流媒体技术的开发者，可阅读 PROTOCOL.md 与源码进行学习/二次开发。  
**收益概括：**  
- 提升多任务处理效率与工作区面积；  
- 不额外掏钱订阅/买硬件狗；  
- 本地自托管、隐私与合规风险可控；  
- 开源可审计、社区可参与演进。
---
## 竞品/同类对比
- Apple Sidecar：  
  - 优点：系统集成度高、无需第三方；  
  - 缺点：同 Apple ID 限制、硬件白名单、仅支持 iPad，不支持 iPhone。  
- Duet Display：  
  - 优点：跨平台、功能成熟；  
  - 缺点：订阅制，存在长期成本；隐私与数据去向需评估。  
- Luna Display：  
  - 优点：生态成熟、支持多种平台组合；  
  - 缺点：必须购买硬件狗，成本高；无线传输受网络环境影响。  
- 其他 Spacedesk/Deskreen 等方案：  
  - 常基于通用桌面流的方案，延迟与画质体验不一，且通常需要浏览器/客户端配对，整合度不如原生扩展显示器顺畅。
OpenDisplay 的独特竞争力：  
- 免费 + 开源 + 无账号/无狗 + 本地直连；  
- 支持 iPhone/多台设备同时扩展、旧 Mac 复用；  
- 公开协议与社区生态扩展，为后续跨平台铺垫。
---
## 局限与不足（客观存在）
- 平台限制：目前官方仅支持 Mac 作为发送端、iOS/iPadOS/macOS（接收端）。Windows/Android/Linux 需依赖社区实现（非官方，维护不等）。  
- 依赖私有 API：使用 CGVirtualDisplay，存在未来 macOS 更新导致行为变化甚至失效的风险（同类产品亦有类似风险）。  
- 输入能力尚在打磨：目前缺少右键/多点手势、硬件键盘透传、Apple Pencil 压感/倾斜等；这些在路线图中但未落地。  
- 暂无音频转发：音频被明确标注为“暂不在范围内”。  
- 许可证变更影响：早期 v0.4.x 为 MIT，当前为 GPL‑3.0；若基于旧版本做闭源分发需注意版本归属与许可证合规。  
- Wi‑Fi 模式对网络环境敏感：如 AP 拥堵或信号不佳，会带来延迟/丢帧；项目文档也坦诚当前 Wi‑Fi 加密存在注意事项，未来规划配对加密传输。
---
## 社区活跃度与生命力
- Star 数约 3.4k；Fork 数 242；PR 34 open/97 closed；Issues 106（多 open）；近期的 v1.19.0 与 v1.18.0 均在 2026‑09‑01 发布，更新密度高且版本号稳定递进。  
- Roadmap 以 Issue 形式跟踪，涵盖配对加密、App Store 发布、输入增强、HEVC、分辨率与画质设置、音频转发、菜单栏自动连接、电池与生命周期感知、远程访问与新平台探索等方向，显示维护者有清晰的演进规划。  
- Issues 页面显示近期有“USB Failed”“设备改名导致连接频繁切换”等反馈，但整体讨论活跃，说明社区在使用中持续发现问题并迭代。
---
## 极简“避坑指南”
- 线缆必须是“充电+数据”，单纯充电线会导致 USB 连接失败；使用可靠的直连，避免不可靠的集线器/转接头。  
- 若 Wi‑Fi 下 Mac 菜单看不到设备，优先检查两端的“本地网络”权限与同网段，并确保 iOS App 保持在前台。  
- 升级 macOS 后若出现异常，优先更新到最新版 OpenDisplay，并查看 Issues 是否有已知兼容条目；必要时留存双端日志便于反馈。  
- 企业/生产环境部署前，务必评估私有 API 未来的稳定性与许可证（GPL‑3.0）对分发的影响。
---
## 结语与行动建议
- 若你正在寻找一套“不掏订阅费、不买硬件狗、隐私可控、并且还能亲自研究源码”的苹果生态副屏方案，OpenDisplay 是目前少数的可靠选项。它在延迟、清晰度、触控与本地化部署方面已经足够用于日常桌面扩展与轻量创作场景。  
- 行动建议：  
  - 先用手头 USB 数据线体验 USB 模式，感受延迟与稳定性；  
  - 再尝试 Wi‑FI 模式，评估在自家网络环境下的可用性；  
  - 有兴趣的开发者可阅读 PROTOCOL.md 与 Roadmap，选择感兴趣的方向参与 PR 或维护社区客户端。  
对个人用户而言，这几乎是“零成本把旧 iPhone/iPad 变副屏”的最轻量路径；对团队/企业而言，它也是可审计、可控、并可按需二次落地的优秀参考实现。
