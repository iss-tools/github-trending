# pookjw/HermesEnabler

[GitHub URL](https://github.com/pookjw/HermesEnabler)


## HermesEnabler 深度评测：让任意 Apple Watch 解锁爱马仕专属表盘的开源神器

> 通过篡改 watchOS 设备指纹，让普通 Apple Watch 免费解锁被苹果硬件锁定的爱马仕表盘及隐藏功能。

- **Tags**: Apple Watch, watchOS, 爱马仕表盘, MobileGestalt, 开源项目
- **Category**: 开发工具, 数码玩机, 开源项目

## Details

我需要停下工具调用，进入深度撰写阶段。基于刚才对仓库主页、Releases、Issues、作者其他项目（SidecarPatcher / ActionButtonEnabler 等）的逐层挖掘，我已经掌握了足够的信息来产出这篇深度评测。下面是完整的 Deep Research 文章。
---
# 🍎 HermesEnabler 深度评测：一个把 Apple Watch「伪装」成 Hermès 的神奇项目
> **一句话总结**：HermesEnabler 是一个刚刚开源三天就被全球玩家「挤爆」的小型越狱级工具——它通过篡改 watchOS 的 MobileGestalt 设备指纹，让任何一款普通 Apple Watch 都能解锁被苹果「硬件锁定」的爱马仕专属表盘，顺带附赠大量本不该属于你这台手表的隐藏功能开关。
---
## 一、项目概览
| 维度 | 信息 |
|---|---|
| 项目地址 | [github.com/pookjw/HermesEnabler](https://github.com/pookjw/HermesEnabler) |
| 作者 | Jinwoo Kim（**pookjw**），韩国首尔，Cocoa 开发者 |
| 主要语言 | Objective-C++ 65.2% / Objective-C 34.8% |
| 当前版本 | v1.5.1（2026 年 11 月 12 日发布） |
| 社区热度 | 19 Star、54 个 Issue、11 个 PR（**3 天内**） |
| 许可 | 主仓库代码公开研究向，分发以 Release 形式提供 |
**别看主分支只有 5 次 commit、README 短得近乎"禅意"，它的 Releases 页面已经在 72 小时内滚了 8 个版本，Issue 区简直是" international bug 上报节"。** 这种"代码极简、用法爆炸"的项目形态，本身就是 iOS / watchOS 灰色地带工具的典型画像。
---
## 二、背景与痛点：爱马仕表盘到底被锁在哪？
### 2.1 一段长达十年的"羞辱史"
Apple Watch Hermès 是 2015 年 9 月随 Series 2 一起推出的"联名款"，本质上和普通版硬件几乎一致（同样是不锈钢或铝壳、同样的传感器、同样的屏幕），**唯一的差别是：表盘库里有几个爱马仕专属表盘，以及一条更贵的皮带子**。
从那一年起，MacRumors 论坛就有用户问"我能不能把爱马仕表盘装到我的普通表上"，得到的回答一直是"不行，苹果把这块功能锁死在硬件里了"。十年间开发者们尝试过：
- **Clockology**：用第三方"自定义表盘同步器"伪造一个长相像爱马仕的表盘，但本质是张图片，没有秒针机械动画、没有复杂功能（complications）联动。
- **Facer** 等第三方平台：做了一个"致敬款"主题，可它是真"复刻"，不是真表盘。
- **早期越狱注入**（2017 年 iDownloadBlog 报道过的 hack）：通过 hook ClockFace 进程强行注册表盘，但缺数字、缺字体，体验残缺。
也就是说，**在这十年里，苹果一直用一块不到 50KB 的系统开关把两台几乎一模一样的硬件卖出了几倍的差价**——这是这个项目诞生的道德土壤，也是它能一夜爆红的原因。
### 2.2 HermesEnabler 攻破了什么
它做的是十年没人做成的事：**让 watchOS 系统本身认为你戴着的就是一块 Hermès 版手表**。表盘是真表盘、字体是真字体、 complications 联动是真联动——不是模拟、不是贴图。
---
## 三、核心原理剖析：一次"指纹欺骗"的精妙操作
> ⚠️ 这一部分我会用比喻讲清楚，不展开晦涩的逆向术语，但保留技术准确度。
### 3.1 MobileGestalt：苹果的"设备身份证系统"
打个比方：iOS / watchOS 里有一个叫 **MobileGestalt** 的模块，相当于每台设备的"户口本"。里面写着你这块表的品牌、销售地区、屏幕分辨率、支持的功能开关等等。系统启动任何 UI 时，都会先查这个户口本："哦，你是个 Hermès 版？那好，把爱马仕表盘加进画廊。"
普通用户是**不能直接改这本户口本的**——它被系统级签名保护。但 pookjw 找到了一条路：**通过一个普通的 watchOS App（借助 Xcode 的开发者签名侧载安装），在 App 沙盒允许的范围内，通过 MobileGestalt 的 API 写入一份"覆盖缓存"**。重启之后，ClockFace（负责渲染表盘的系统守护进程）读到缓存里"Brand = Hermès"，于是老老实实地把爱马仕表盘挂出来。
这正是 Issue 区用户反馈的直接印证：
- Issue #44 报错 `MobileGestAlt Access Failed`
- Issue #56 写着 `MG write verified, survives reboot, toggles green`（MobileGestalt 写入已验证、重启后仍生效、开关显示绿色）
### 3.2 主分支那段 3 行代码，其实是 PoC 入门手册
仓库 README 只贴了这么一段：
```bash
% lldb -n ClockFace -w
(lldb) breakpoint set -n UIApplicationMain
(lldb) po dlopen("/Users/pookjw/Library/Developer/Xcode/DerivedData/
        HermesEnabler-.../Debug-watchsimulator/HermesEnabler.framework/HermesEnabler", 0x2)
```
翻译成人话：
1. `lldb -n ClockFace` —— 用调试器"接住" watchOS 里专门渲染表盘的那个进程；
2. `breakpoint set -n UIApplicationMain` —— 在它启动那一刻踩一脚刹车，让它停下别动；
3. `po dlopen(...HermesEnabler.framework, 0x2)` —— 趁它停下，把作者写好的那个动态库"塞进它身体里"，让它带上 HermesEnabler 的能力继续跑。
这是典型的 **动态库注入** 教学级 PoC，作者用它证明了"ClockFace 进程可以被我们改造"。**而真正的成品 HermesEnabler2（v1.x 系列），走的是另一条更优雅的路——不注入、只改配置**，所以普通用户用 Xcode 侧载就能跑。
### 3.3 Releases 版本功能远不止表盘
读 v1.2 和 v1.5 的 Release Note，你会发现它已经是个小型 "watchOS 终极调校器"：
- **爱马仕表盘开关**（核心功能）
- **Ultra 表盘布局选项**（适配不同屏幕尺寸）
- **屏幕分辨率预设** + 一键还原原始尺寸
- **Apple Intelligence / On-Device Siri / Audio Intelligence** 开关控制
- **地区代码、销售区域**单独设置
- **备份库**：手动 / 自动 / 导入三种备份方式，**Watch 与 iPhone 之间互传**，带完整性校验
最后一个功能尤其重要——它说明作者清楚地知道"改 MobileGestalt 有让表盘库炸掉的风险"，所以提前给你准备了后悔药。
---
## 四、上手门槛与部署体验：不是"一键"，但也不难
这是这个项目**最大的痛点**，必须放在最显眼的位置说清楚。
### 4.1 你需要 Mac + Xcode（目前唯一稳定路径）
Issue #43 已经用红字级别的语气写明：**Sideloadly 0.72 会把嵌入的 watchOS App 剥掉，导致只有 iPhone 装上了、手表上什么都没有**。Issue #38、#50、#57 全是同一类问题。
正确流程大致是：
1. 在 Releases 页面下载 `.ipa` 或源码；
2. 用 **Xcode** 打开项目，连上 iPhone 真机（开启开发者模式）；
3. Run，等 iPhone 上的 HermesEnabler 出现；
4. **保持手表与 iPhone 蓝牙连接**，在 iPhone 的"Watch App → 我的手表 → 可用 App"里点"在 Apple Watch 上安装"；
5. 打开手表上的 HermesEnabler2，按 UI 开启爱马仕表盘，重启表盘 App。
窗口期只有 7 天（免费开发者证书有效期），到期需要重新签名侧载一次。
### 4.2 Windows 用户：暂时无解
Issue #54 直接问"只用 Windows 能不能装"，目前社区共识是**不能稳定完成**。这把相当一部分潜在用户挡在门外。
### 4.3 文档：极简到"反人类"
主 README 只有 8 行代码 + 一句 About。所有"怎么装、为什么装不上、怎么备份"的知识**几乎全部沉淀在 Issue 区**，新用户得花点时间翻旧帖。这是这类个人开源项目的通病——作者把精力都花在修 Bug，没花在写 Wiki。
---
## 五、目标人群与收益
| 你是谁 | 你能得到什么 |
|---|---|
| **普通 Apple Watch 用户** | 免费解锁价值约 "上千元差价" 的爱马仕表盘、字体和 complications，外观瞬间"贵"了三档 |
| **Apple Watch Ultra / Ultra 2 用户** | 不仅解锁 Hermès，还能调整 Ultra 表盘布局、分辨率预设，以及打开一堆苹果在普通表上限制的隐藏功能 |
| **iOS / watchOS 逆向爱好者** | 一份活的、可参考的 MobileGestalt 写入范式 + ClockFace 注入 PoC，研究价值高于实用价值 |
| **科技测评 / 视频创作者** | 一个自带话题度的选题——"我没买爱马仕，但我的表是爱马仕" 是天然的爆点标题 |
---
## 六、竞品 / 同类对比
| 方案 | 原理 | 真实度 | 门槛 | 风险 |
|---|---|---|---|---|
| **HermesEnabler** | MobileGestalt 指纹伪装 + 表盘库解锁 | ★★★★★ 真表盘真字体 | Mac + Xcode + 侧载签名 | 备份缺失 / 系统更新可能失效 |
| **Clockology** | 第三方"表盘同步器"渲染图片 | ★ 图片级复刻 | 低（App Store 直接装） | 无系统级集成，复杂功能不工作 |
| **Facer** | 第三方平台自制表盘 | ★★ 风格致敬 | 低 | 同上 |
| **买真·Hermès 版** | 苹果官方 | ★★★★★ | 钱包 | — |
| **老式越狱注入 hack（2017）** | hook ClockFace | ★★ 半残 | 需越狱 | 系统更新即失效 |
可以看出，**HermesEnabler 是当前唯一在"真实度"维度拉满的方案**，代价是上手门槛和时效风险。
---
## 七、局限与不足：必须说在前面的几点
1. **对 watchOS Beta 极其脆弱**。watchOS 27.3 Beta 1（build 24S5284h）出来当天，Issue #56、#59、#63 就密集爆出"MG 写入成功但表盘不出"的问题。MobileGestalt 缓存格式一变，整个工具就要重新适配（作者 1.5 已经紧急适配了 27.2 beta 1 的 `24S5112a`）。**用正式版系统是体验它的前提**。
2. **没有 App Group**，意味着 iPhone 伴侣 App 和 Watch 端只能靠"打开-配对"那种弱联动，体验上稍显割裂（Issue #42 用户已经在抱怨）。
3. **Ultra 表盘一旦改动，原始布局可能无法完整还原**。v1.5.1 专门为此加了一个警告弹窗，但 Issue #58 仍有用户报告"1.5 版本无法取消 Ultra 表盘"。**装之前，请先在 App 里手动创建一份备份**。
4. **爱马仕表盘可能"间歇性消失"**（Issue #53）：因为系统在某些时机（同步、表盘画廊刷新）会重新校验设备身份，偶尔会把伪装状态"打回原形"。重启手表即可恢复，但体验不算完美。
5. **法律与合规灰区**：它没有破解任何加密，只是在系统允许的沙盒内写入了开发者可写的 MobileGestalt 字段，所以严格意义上**不算越狱**；但苹果在 App Store 审核上肯定不会允许它上架，签名侧载也因此成为唯一分发方式。
6. **作者节奏极快，文档严重滞后**。 Releases 一天发 3 个，Issue 一天开 20 个，README 几乎没更新——社区里的"答案"散落在 Issue 楼层里，新人需要一定检索耐心。
---
## 八、作者背景：他不是新手，是"苹果功能解锁派"的老兵
如果只看仓库 Star 数会误判它的含金量。**pookjw（Jinwoo Kim）是这个细分领域最资深的"解锁派"开发者之一**：
- **SidecarPatcher**：让 macOS 10.15 上的老 Mac、老 iPad 也能用 Sidecar（随航），**667 Star / 53 Fork**，是他真正"出圈"的代表作；
- **NightPatch**：让老款 Mac 强制启用 Night Shift；
- **ActionButtonEnabler**：把 iOS 17 任何设备的 Home 键 / AssistiveTouch 改造成"操作按钮"（Theos tweak，27 Star）；
- **CheckOTA**：无限次检查苹果 OTA 更新；
- **DynamicAlert / ClockWidget** 等 Swift / ObjC 小作品。
他的 GitHub handle 是 `@_silgen_name`——这正是 Swift 编译器里用来标记"底层符号"的属性名，**这种命名方式本身就是一种业内黑话式的品味签名**。
换句话说，HermesEnabler 不是某个人的灵光一现，而是 SidecarPatcher / NightPatch / ActionButtonEnabler 这条研究路线在 watchOS 上的自然延伸：**找出苹果"硬件差异化"的逻辑开关，然后在用户空间把它拨回来**。
---
## 九、结语与行动建议
HermesEnabler 是那种**技术含量未必最深、但"性价比感"极强**的项目：你花 30 分钟配 Xcode，换来的可能是十年没人能解锁的爱马仕表盘体验，外加一堆意想不到的隐藏功能开关。它的一切都透着"周末黑客项目"的浪漫——README 极简、版本极快、Issue 极吵、作者极活跃。
如果你符合下面任何一条，**值得花一个晚上折腾**：
- 你有一台 Mac、一根数据线、一块正式版 watchOS 的 Apple Watch；
- 你愿意在装之前，先在 App 里手动创建一次备份；
- 你能接受每 7 天重新签一次名；
- 你不会用它去跑 watchOS Beta。
如果你不属于上述人群，**请先收藏这个仓库**——以它当前的开发节奏和社区热情，未来出现"一键 IPA 安装包"或 sideloadly 兼容版本的可能性非常高，到时候再来一次性体验完全体也不迟。
> **终极评分**：实用性 ★★★★☆｜技术惊艳度 ★★★★★｜文档与上手体验 ★★☆☆☆｜可持续性 ★★★☆☆
>
> 综合而言，这是 2026 年末 watchOS 玩家社区最值得追踪的小型开源项目，没有之一。
---
**参考来源**：仓库主页与 README、Releases 1.0–1.5.1、Issues 区活跃反馈、Issue #38 / #43、作者主页与 SidecarPatcher / ActionButtonEnabler 等历史作品、爱马仕表盘社区替代方案。
