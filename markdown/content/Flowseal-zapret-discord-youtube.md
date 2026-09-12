# Flowseal/zapret-discord-youtube

[GitHub URL](https://github.com/Flowseal/zapret-discord-youtube)


## Discord/YouTube 网络修复神器：zapret-discord-youtube

> 基于 zapret 的 Windows 工具，通过本地 DPI 绕过技术一键恢复 Discord 和 YouTube 访问。

- **Tags**: DPI 绕过, 网络加速, Discord, YouTube, WinDivert
- **Category**: 网络工具, 系统工具, 开源项目

## Details

# zapret-discord-youtube 深度评测
## 一句话总结
它是基于 DPI 绕过核心引擎 zapret 的“懒人友好型”Windows 套件，主打为 Discord、YouTube 等常用服务在 DPI 审查环境下提供“本地直连式”的可用性恢复与提升；虽不是一键通用的魔法棒，但凭借策略多样、图形化菜单和诊断/测试一体化，显著降低了上手门槛。
## 背景与痛点
在很多地区，网络运营商（ISP）会在传输链路部署 DPI（深度包检测）设备，识别并干预特定协议或域名（如 TLS SNI、HTTP Host、UDP/TCP 特征等），导致 YouTube、Discord、Telegram 等服务被“隐形限速”或直接打不开。传统的 VPN/代理方案会带来成本、速度和隐私取舍，也存在“杀鸡用牛刀”的问题。zapret 项目（作者：bol-van）通过在本地对数据包做“外科手术式”修改，让 DPI 识别失效，从而在不引入远端代理的情况下恢复访问。其 Windows 版本依赖 WinDivert 进行包拦截与修改。zapret-win-bundle 本身偏“工程型”，需要用户理解并自行组合策略，上手门槛较高。zapret-discord-youtube 则在 zapret-win-bundle 的基础上，用一系列封装脚本（general*.bat、service.bat）、配置清单与诊断工具，把“打磨到能跑”的过程自动化，降低小白的学习成本。
## 核心亮点与功能剖析
- 基于成熟引擎的二次封装：本质是对 zapret-win-bundle 的定制化打包与前端封装；核心 DPI 绕过引擎为 winws/winws2，底层使用 WinDivert 在 Windows 内核层拦截并修改数据包（例如对 TLS Client Hello 分片、修改 SNI 等），这与 Linux 下使用 nftables/NFQUEUE 的方案等价。
- 策略“多重保险”与快速试错：提供多种 general*.bat 手动运行策略（如 ALT、FAKE 等），让用户可以逐个尝试并在当前网络环境下找到“生效”的那一款；策略失效时可快速切换，适应 ISP 的规则变动。
- service.bat 一站式管理（DX 友好）：通过友好的文本菜单完成“安装/卸载服务、状态检查、Game Filter 切换、IPSet Filter 切换、自动更新检查、替换 fake、更新 ipset-all.txt、更新 hosts 文件、诊断与测试”等。它把复杂的命令行操作统一到一个入口，大幅改善开发者/运维体验（DX）。
- 内置诊断与自检（Run Diagnostics / Run Tests）：可对常见问题进行初步诊断；支持“标准测试”（校验 targets.txt 中的站点）和“DPI checkers”（对多家云厂商的环境做 DPI 规则探测），便于用户判定是策略失效还是环境配置问题。
- Game Filter 与 IPSet Filter（针对游戏/非网站场景）：提供针对高端口（UDP/TCP > 1023）的“游戏过滤”模式，并可基于 ipset-all.txt 做 IP 列表匹配（none/loaded/any 三档），让绕过更精确，减少对其他流量的误伤；但同时提醒“any 模式会影响常见网站，不建议长期开启”，这种“既要/又要”的权衡很实用。
- Secure DNS 与 hosts 修复的组合拳：明确建议开启系统/浏览器的 Secure DNS（DoH），并给出 Chrome/Firefox/Windows 11 的设置路径；针对 Telegram 网页版与 Discord 语音连接异常，提供通过“更新 hosts 文件”来修复的自动化流程（必要时提示手动编辑 hosts）。这表明作者把 DNS 劫持/污染与 DPI 绕放在一起考虑，形成整体方案。
## 技术栈与架构解析
- 平台与依赖：面向 Windows（7 x64 及以上），依赖 WinDivert 驱动与 DLL（位于 bin 目录），并封装 zapret 的 winws/winws2 作为 DPI 绕过引擎；采用 BAT 脚本作为编排层，外加若干清单文件（域名、IP、排除列表、目标测试列表等）。整体没有复杂的编译/构建过程，用户解压即用。
- 架构分层：
  1) 用户交互层：general*.bat（手动策略）、service.bat（菜单化管理）。
  2) 清单与配置层：list-general-user.txt（域名）、ipset-all.txt（IP/子网）、list-exclude-user.txt 与 ipset-exclude-user.txt（排除列表）等。
  3) 核心引擎层：winws/winws2 执行具体 DPI 绕过策略。
  4) 内核拦截层：WinDivert 驱动在内核层抓包、修改、重注入。
- 设计理念：“尽量不引入远端代理，本地透明修改特征”；策略“可组合、可替换”；重视“可维护性”，提供清理与重装路径。
## 上手门槛与部署体验
- 最低门槛：需要以管理员身份运行 BAT、关闭或排除杀毒软件（部分杀毒会将 WinDivert 标记为风险工具）、理解“Secure DNS”设置；整体比 zapret-win-bundle 的原始体验更友好，但仍需一定的命令行/系统操作常识。
- 典型部署步骤（小白版）：
  1) 开启 Secure DNS（Chrome/Firefox/Windows 11 任选其一）。
  2) 到仓库 Releases 页下载最新压缩包。
  3) 右键属性勾选“解除锁定”，解压到不含特殊字符的路径（如 C:\zdy）。
  4) 管理员运行一个 general*.bat，看任务栏是否出现“锁”图标（winws.exe）；先测 YouTube/Discord 是否恢复。
  5) 确定有效策略后，管理员运行 service.bat → Install Service，实现开机自启与服务化运行。
- 文档与引导：README 提供完整的“常见问题/故障排除/重装步骤/游戏问题/YouTube 与 Discord 专用修复”，覆盖面较全。
## 社区活跃度与生命力
- Star/Fork：页面显示约 32.9k Star、2.5k Fork，Issues 639、PR 30，说明社区关注度高、有人实际使用与反馈。
- 问题类型：从 Issues 列表来看，多数为特定网络环境下“某个服务不生效”或“杀软/反作弊误报”，作者与社区提供诊断步骤与策略建议，整体是“活水”生态。
- 上游联动：作者在 README 明确致谢 zapret 作者 bol-van，并与 zapret-win-bundle 保持兼容（如 Win7 环境的驱动替换等），未来可随上游演进。
## Demo / 代码示例（配置与运行）
- 示例 1：手动试运行策略（适合快速验证）
  - 下载并解压后，以管理员运行：
    - `general_alt.bat`（或其他 general*.bat）
  - 观察任务栏是否出现“锁”图标；测试 YouTube 是否能正常播放、Discord 能否连上语音。
- 示例 2：将有效策略设为开机服务（以 service.bat 交互式菜单完成）
  - 管理员运行 `service.bat`
  - 依次选择：Install Service → 选择对应策略。
- 示例 3：为更多域名/IP 做定制（文本编辑）
  - 编辑 `list-general-user.txt`，每行一个域名（子域名会自动匹配）。
  - 编辑 `ipset-all.txt`，按仓库说明格式加入 IP/网段；排除项写入 `list-exclude-user.txt`/`ipset-exclude-user.txt`。
  - 注意：首次运行会自动生成 `*-user.txt` 空文件。
## 目标人群与收益
- 受益人群：
  - 被 DPI 限制影响，又希望“不挂 VPN/不付费”恢复 Discord/YouTube/TG 等常用服务的普通用户（需一定动手意愿）。
  - 需要为特定区域/网络环境快速提供“可落地方案”的运维与个人技术爱好者。
- 可得收益：
  - 恢复/提升特定服务的可用性与稳定性，无须远端代理中转（通常更稳定、更低额外延迟）。
  - 通过“本地透明修改”实现绕过，不会像 VPN 那样影响整机流量（可通过 IPSet/排除列表做细粒度控制）。
  - 掌握“DPI 绕过与包修改”的基本原理，为进一步学习网络安全/网络测量打下感性认知。
## 竞品/同类对比（简要）
- 与通用 VPN/代理：本方案“点到点”修复、无额外中转、可控范围小；但适用范围有限、不保证长期有效。
- 与 zapret-win-bundle：本方案是“预配置与自动化封装”，大幅降低学习成本；zapret-win-bundle 更适合需要自定义、深度调优的高级用户。
- 与其他 DPI 绕过工具（如 GoodbyeDPI、ByeDPI 等）：各类工具在策略、实现与适用场景各有侧重，一些对比文章认为 zapret 在技术复杂度与覆盖面上更具“工程化”和灵活性。
## 局限与不足
- 策略会“过期”：ISP 的 DPI 规则会升级，某策略随时可能失效；用户需切换或组合策略，有时需要自己“改参数做新策略”。
- 平台单一：仅面向 Windows；Linux/macOS 用户需要回到 zapret 原版或使用其它方案。
- 杀软与反作弊风险：WinDivert 容易被杀软标记，也可能被部分游戏的反作弊拦截（作者给出了 windivert-hide 的参考文档）。
- 游戏等非网站场景覆盖有限：官方明确表示无法逐个研究所有游戏的兼容问题，建议使用 Game Filter 与 IPSet Filter 做针对性调试；IPSet “any” 模式会影响网站可用性，不适合长期开着。
- 无 Docker/容器化一键部署：面向单机 Windows 场景；若需在路由/OpenWrt 上统一部署，需回到上游 zapret 的多平台适配。
## 安全与法律注意事项（重要）
- WinDivert 是“抓包/修改/注入”的通用内核工具，本身不是恶意软件，但属于“双用途”技术；不少杀软会以 PUA/RiskTool 形式报警。请将本仓库的解压目录加入排除项，并确保来源可信。
- 使用本工具应遵守当地法律法规；有些司法管辖区对“规避审查/技术限制”有明确法律后果。建议在合规范畴内使用，并避免将其用于非法用途。
## 结语与行动建议
- 终极评判：zapret-discord-youtube 是“把成熟的 DPI 绕过引擎变成普通人可用”的出色封装之一，尤其适合在 Windows 上为 Discord/YouTube 等高频服务做“点对点”恢复；它不是万能钥匙，但在适合的场景里，能以较低的综合成本换取显著的可用性提升。
- 行动建议（给你的优先路径）：
  1) 先在安全的测试环境中按 README 开启 Secure DNS 并解压运行某个 general*.bat，验证有效性。
  2) 通过 service.bat 的 Diagnostics 与 Tests 快速排查环境问题（DNS/杀软/缓存等）。
  3) 确定稳定策略后再考虑服务化与开机自启。
  4) 若只服务于少数域名/IP，优先用 user 定制列表与排除列表做“最小化干预”，避免不必要的全局包修改。
