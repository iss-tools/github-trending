# tailscale/tailcat

[GitHub URL](https://github.com/tailscale/tailcat)

- **Stars**: 2395
- **Language**: Go

## Tailcat：一条命令构建的 Tailscale 安全管道

> 复用 Tailscale 技术栈的去控制面安全管道，无需账号和 root 即可实现一键内网穿透与加密传输。

- **Tags**: Tailscale, 内网穿透, WireGuard, Go, 开源工具
- **Category**: 开发工具, 网络安全, 内网穿透

## Details

# Tailcat 深度评测：一条命令，给 Netcat 装上“Tailscale 数据平面”
## 一句话总结
Tailcat 是“像 netcat 一样好用”的点对点加密管道与端口转发工具，复用了 Tailscale 的数据平面（WireGuard + magicsock + DERP），但去掉了控制平面与账号体系，不用 root、不用开端口，适合临时打通两台机器的安全通道，甚至直接以库的形式嵌入你的 Go 程序。
## 背景与痛点
日常里，我们经常遇到这几类麻烦：
- 临时远程：在咖啡馆要把本机服务短暂暴露给同事调试，却不想暴露到公网、也不想折腾 VPN。
- 内网穿透：家里/公司机器在 NAT 后面，老老实实打洞并不稳当；端口映射/FRP 搭起来又有额外运维成本和安全隐患。
- 被绑定的“重武器”：用上 Tailscale 等成熟方案，就得注册、登录、管理设备、跑控制面，对于“用一次就走”的场景显得“过重”。
- 权限与安全：很多云/CI 环境没有 sudo/root，常规 VPN 需要改路由、TUN/TAP，难以落地。
Tailscale 自己也意识到这类“短平快”需求，于是把自家的开源组件重混（remix）成 Tailcat：保留强大的数据平面与 NAT 穿透，砍掉控制面，只要一个“连接令牌（ConnBlob）”即可加密直连。
## 核心亮点与功能剖析
### 1) 去控制面、自管令牌
- Tailcat 把服务器身份与接入信息编码为一个短的“连接令牌”（通常以 tc 前缀 + Base64(CBOR)），里面包含：
  - 服务器的 WireGuard 公钥（Curve25519，32 字节）
  - DERP 区域/节点信息（可以用短 ID 引用默认 DERP，也可内嵌完整节点信息，避免客户端再查 DERP map）
- 你完全不需要 Tailscale 账号，元数据“带外交换”（复制粘贴、聊天、DNS TXT 都可），用法极其灵活。
### 2) 既是工具，也是 Go 库
- CLI：一条命令就能跑起 server/client，适合临时调试、安全 tunnel、端口暴露、甚至 quick SSH。
- 库：import github.com/tailscale/tailcat，你可以在自己的 Go 程序里直接嵌入完整的 Server/Client 能力，不用外挂进程。
### 3) 不需 root 的用户态网络栈
- 使用用户态 WireGuard，不走 TUN/TAP，不改路由、不碰 DNS，没有 root/Administrator 权限也能跑。
- gVisor 的 netstack（用户态 TCP/IP 栈）在两端把 TCP 连接终结，程序内处理连接，与操作系统网络配置解耦。
### 4) NAT 穿透与“先中继后直连”的连接升级
- 引导阶段：双方先连到同一个 DERP 节点（相当于加密中继站），完成“Meow/Meowed”握手，把彼此的公钥加到 WireGuard 对端列表，正式建立 WireGuard 隧道。
- 并行打洞：两边通过 DERP 互相发送 STUN 式的端点发现消息，尝试 UDP 打洞；成功后，流量自动从 DERP 升级到点对点直连路径；打洞失败则继续走 DERP 作为兜底。
- CLI 提供 ping 与 --until-direct，方便测试并等待“直连态”达成。
### 5) 一键暴露本地端口、自带“临时 SSH”模式
- 本地端口转发：服务端 tailcat --serve=8080，客户端 tailcat <token> 8080 即可访问本地端口；还可 --serve=all。
- 无认证 SSH（临时）：在 Linux/macOS 上，服务端 tailcat --serve=no-auth-ssh，客户端 tailcat ssh <token>，安全由 WireGuard 隧道完成，SSH 层不再认证，非常适合短命的调试会话。如需认证也可 --serve=22 代理到系统 SSH。
### 6) DNS TXT 作为“可发现层”
- 令牌可以发布为 DNS TXT，域名在任何 CLI 接受 token 的地方都能用（如 tailcat example.com 8080 或 tailcat ssh example.com）。这让“给每个机器一个名字、按名连接”变得很自然，也替代了繁琐的端口转发和敲门机制。
### 7) 密钥管理与“密钥即身份”
- 临时密钥（默认）：每次启动 server 在内存生成新密钥，进程退出密钥销毁，地址一次性有效；非常适合“秒开秒用、用完即焚”的场景。
- 保存密钥：tailcat genkey 生成持久化密钥并保存到 ~/.config/tailcat/keys/default.private.json，后续可反复复用。但任何你曾经分享过地址的人都可以继续连（除非用 --allow 做基于公钥的白名单）。
- CLI 启动时会明确告诉你用的是“new address”还是“saved key‘default’”，避免误用。可强制 --key=new 换回一次性地址。
### 8) 支持自建 DERP 与完全离线闭环
- 官方提供速率受限的公共 DERP（默认 DERP map：tailcat.dev/derpmap.json）。
- 不想依赖官方？自己跑 derper，然后 tailcat genkey --region=derp.example.com，令牌中内嵌你的 DERP 节点信息；客户端不需要额外 flag、也不接触 Tailscale 的 DERP map/relay，完全走你的基础设施和配额。也可以自建 DERP map JSON 并用 --derpmap-url 指定。
## Demo 与代码示例（CLI 与库）
### A. CLI 最简：像 netcat 一样传输数据
服务端（打印一个临时地址）：
```bash
tailcat
# 输出如：🐈 Server listening with new address: tcomFwWCCcjS5nKNqAod034nWoJZW0LZqDhhC8U_dKdnDRYQ8uNGFpGQEu
```
客户端（把消息发过去）：
```bash
echo hello | tailcat tcomFwWCCcjS5nKNqAod034nWoJZW0LZqDhhC8U_dKdnDRYQ8uNGFpGQEu
```
服务端（收到后打印）：
```bash
hello
```
【以上示例来自 README】
### B. CLI 端口转发（多端口）
服务端：
```bash
tailcat --serve=8080,8443
# 🐈 Server listening with new address: tcXXXXXXXXX
```
客户端：
```bash
tailcat tcXXXXXXXXX 8080
# (在本地 8080 上接收到服务器本地 8080 的流量)
```
### C. CLI 临时 SSH（无认证）
服务端：
```bash
tailcat --serve=no-auth-ssh
# 🐈 Server listening with new address: tcXXXXXXXXX
```
客户端：
```bash
tailcat ssh tcXXXXXXXXX ls -la
```
### D. Go 库：最简 server/client 直连
Server（服务端监听，并在任意 TCP 端口返回“hello from port %v”）：
```go
package main
import (
    "fmt"
    "log"
    "net"
    "github.com/tailscale/tailcat"
)
func main() {
    s := &tailcat.Server{
        OnTCP: func(port uint16) func(net.Conn) {
            return func(c net.Conn) {
                fmt.Fprintf(c, "hello from port %v\n", port)
                c.Close()
            }
        },
    }
    if err := s.Start(); err != nil {
        log.Fatal(err)
    }
    fmt.Println(s.ConnBlob())
    select {}
}
```
Client（连接并打印 80 端口返回）：
```go
package main
import (
    "context"
    "io"
    "log"
    "os"
    "github.com/tailscale/tailcat"
)
func main() {
    cl := tailcat.NewClient(tailcat.ConnBlob(os.Args[1]))
    defer cl.Close()
    c, err := cl.DialTCPPort(context.Background(), 80)
    if err != nil {
        log.Fatal(err)
    }
    io.Copy(os.Stdout, c)
}
```
执行：
```bash
./client tcomFwWCAWf933BLELdzd3RkHiOufJ...
# 输出：hello from port 80
```
【代码示例来自 README】
## 技术栈与架构解析
### 核心组件
- WireGuard（用户态）：负责加密隧道；不依赖内核模块。客户端对等密钥对建立后即开始加密传输。
- magicsock：Tailscale 的传输层，实现多路径、多源地址的 UDP 封装与 NAT 打洞（STUN + disco 协议）。
- gVisor netstack：在用户态终结 TCP 连接，这样可以在不修改系统路由的前提下接受/发起 TCP。
- DERP：加密中继与“见面”场所，作为 rendezvous 通道与最后的兜底路径。
### 连接流程（“Meow/Meowed”握手）
1. Server 启动，生成/加载 WireGuard 密钥对，连到 DERP，打印令牌，等待客户端。
2. Client 解析令牌，拿到服务器公钥与 DERP 区域，自己也生成临时密钥，连到同一 DERP。
3. Client 发送“Meow” ping（带自己的公钥）给 Server；Server 把 Client 加入 peer 列表并回“Meowed”。
4. WireGuard 握手通过 DERP 先完成，加密通道建立。
5. 两侧通过 disco 消息交换端点、尝试 UDP 打洞；成功则升级到直连，失败则继续走 DERP。
6. Client 在隧道内向具体端口发起 TCP 连接，两端 gVisor 栈处理连接建立与数据转发。
### 令牌与地址
- 令牌（ConnBlob）是“tc + Base64(CBOR)”：包含服务器公钥与 DERP 信息。短 token 仅有区域 ID，长 token 自含 DERP 节点信息。
- 目前内部对等端按公钥派生 IPv6 地址作为实现细节，不对外暴露，未来可能去掉这些冗余字节以优化 MTU。
## 目标人群与收益
### 开发者 / 运维 / 云原生玩家
- 临时端口暴露：本地服务一键让同事/测试环境访问，不再纠结云防火墙与公网 IP。
- CI/CD 与短暂环境：在 GitHub Actions、自托管 Runner 里为测试数据库或内部服务拉一个加密隧道，结束即销毁。
- 快速排查与调试：把线上/边缘节点的服务端口安全暴露到本地调试终端。
### 安全与合规敏感团队
- 加密与访问控制：先由 WireGuard 密钥认证，再决定是否暴露 TCP 服务；可以做基于公钥的 client allow-list（--allow）。
- 可自建 DERP：任何流量都不经过第三方，适合对数据出域有强控的场景。
### Go 开发者
- 嵌入式点对点通道：不依赖外部 VPN 进程，用库直接在程序内开/连隧道，适合 P2P 工具、远程调用、嵌入式控制等场景。
## 竞品/同类对比（简要）
| 维度 | Tailcat | Tailscale（完整版） | FRP/ngrok | SSH 隧道/端口转发 |
|---|---|---|---|---|
| 控制面 | 无（令牌带外交换） | 有（账号/设备/ACL） | 有（注册/鉴权） | 无（纯连接） |
| NAT 穿透 | DERP + magicsock 自动打洞 | DERP + magicsock 自动打洞 | 常依赖反向代理/中继 | 需配置或额外工具 |
| 加密 | WireGuard 端到端 | WireGuard 端到端 | 视配置/隧道 | 随 SSH |
| 是否需要 root | 否 | 否（通常用户态） | 视部署方式 | 视模式（-W 不需，转发需） |
| 自建中继 | 支持（自建 derper + DERP map） | 支持（官方 derper） | 需自建服务端 | 需额外跳板 |
| 学习/配置成本 | 低（一条命令） | 中（需要注册/设备加入） | 中（部署 server/配置） | 中（熟悉 SSH 参数） |
## 上手门槛与部署体验
### 安装方式
- Go 工具链：go install github.com/tailscale/tailcat/cmd/tailcat@latest。一步安装，无外部系统依赖。
- Nix flakes：nix run github:tailscale/tailcat 或 nix profile install github:tailscale/tailcat。对 Nix 生态非常友好。
### 文档与示例
- README 非常详实，涵盖：
  - 安装、基本用法（管道/端口转发/SSH）
  - 密钥管理（ephemeral vs saved）
  - DNS TXT 用法
  - 自建 DERP 与“Bring your own DERP relay”
  - Go 库的最小 Server/Client 示例与核心类型说明。
- pkg.go.dev 提供模块文档与 API 索引，方便了解库用法；标注 License 为 BSD-3-Clause，可自由再分发。
### 部署体验
- 无系统配置、不碰网络栈：适合受限环境（CI、容器、无权限主机）。
- 默认公共 DERP 即开即用；如需自建，需准备域名与 TLS（derper 可自己获取 Let’s Encrypt 证书）。
## 社区活跃度与生命力
- Star/Fork：当前约 2.3k Star、63 Fork，显示了在发布初期的强烈关注。
- 模块发布时间：pkg.go.dev 显示 Published Aug 27, 2026，模块版本带伪版本 c04c5af，说明是“发布即活跃”的状态。
- Issues/PR：页面显示 6 个 Issues、2 个 Pull Requests，数量不多但属于项目早期正常阶段；README 也提到了已知 TODO（如 DERP map 变更时客户端更健壮处理，issue #7），说明团队在持续迭代。
- 官方出品：由 Tailscale 团队维护，与主仓库保持模块依赖关系，降低了“半途而废”的风险。
## 局限与不足
- 稳定性承诺缺失：README 明确“无 API/CLI/线格稳定性保证”，可能影响在严肃产品中的长期依赖；如需 SLA，官方提示“联系 Sales”走向商业支持与合作。
- 公共 DERP 无 SLA/可撤销：免费公共 DERP 只有速率限制，无带宽或可用性承诺；生产环境建议自建 DERP 或与 Tailscale 商业合作。
- 未到达 v1：Go 模块版本仍然是 0.x，意味着 API/行为可能有较大调整；早期接入需要做好跟随更新的准备。
- 模式边界：Tailcat 是“点对点工具/库”，不做设备目录、策略、持久网络等。如果你需要集中管理、访问控制审计等，Tailscale 完整版更合适。
- 安全模型认知：
  - --allow 基于客户端公钥做白名单，确保懂配置；否则 saved key 一旦泄露，历史上任何拿过 token 的人都能再连。
  - no-auth-ssh 模式把安全完全寄托于 WireGuard 层，适用于临时调试；长期暴露请使用传统 SSH 认证或更精细的策略。
## 结语与行动建议
终极评判：
- Tailcat 是一个“极其精巧且工程完成度很高”的点对点加密隧道工具，把 Tailscale 的数据平面提炼成“一根随时能拉起的网线”。它非常适合临时打通、调试与嵌入式场景；如果你已经在用 Tailscale，可以用它作为轻量补充；如果你还没用 Tailscale，它也是一个低门槛体验其网络能力的“入门卡”。
- 对于严肃生产中的“长期、大规模、集中管理”场景，它不是完整 Tailscale 的替代；作为工具/库使用时，也要接受 API 尚未稳定、公共 DERP 无 SLA 的现实。
行动建议：
- 如果你是开发者/运维：现在就可以用 go install 或 nix 装一个，在两台机器上跑“管道 demo”和“端口转发 demo”，体验一条命令打通内网服务的快感。
- 如果你是 Go 工程师：尝试把 Server/Client 嵌入到你自己的工具中，做一个“带安全通道的 CLI”，比如远程日志采集、内网服务调试面板等。
- 如果你在为团队选型：把 Tailcat 当作“快速应急”或“单任务隧道”的备用工具；生产环境长期方案评估 Tailscale 完整版，并考虑自建 DERP 以满足合规/SLA 需求。
总体而言，Tailcat 的设计思路清晰、代码质量与文档扎实、短期收益明显；长期使用则需关注其演进与稳定性承诺的落地，但作为“精简版 Tailscale 数据平面”，它值得放进你的工具箱。
