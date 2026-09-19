# cloudflare/quiche

[GitHub URL](https://github.com/cloudflare/quiche)


## cloudflare/quiche：Rust 编写的高性能 QUIC/HTTP/3 协议库

> Cloudflare 出品的 QUIC/HTTP/3 协议栈，采用 Rust 和 Sans-IO 设计，兼顾安全性与高性能，支持跨平台嵌入。

- **Tags**: QUIC, HTTP/3, Rust, 网络编程, Cloudflare
- **Category**: 网络协议, 开发工具, 基础设施

## Details

# cloudflare/quiche 深度评测
- 作者：深度评测专栏
- 目标：cloudflare/quiche（GitHub）
- 类别：开源协议栈 / 开发者工具（QUIC 与 HTTP/3）
---
## 一句话总结
quiche 是 Cloudflare 用 Rust 编写的 QUIC 传输协议与 HTTP/3 实现，采用“Sans‑IO（无 I/O）”的低层设计，经受了 Cloudflare 边缘网络与大规模生产环境验证，可通过 FFI 方便地嵌入 C/C++，并为更高层的 tokio‑quiche 提供核心引擎；适合需要深度控制或定制化 QUIC/HTTP/3 的研发团队与基础设施开发者。
---
## 背景与痛点：它为什么诞生？
- QUIC/HTTP/3 的痛点：HTTP/2 依赖 TCP，一旦丢包会导致“队头阻塞（Head‑of‑Line Blocking）”，在弱网（移动、高时延、丢包）场景下体验明显下降。QUIC 基于 UDP，内置 TLS 1.3 与多路复用，能显著改善连接建立延迟与抗抖动能力，是 HTTP/3 的运输层基石。
- “协议成熟、工程落地难”：IETF 规范在演进，但要在自己的产品里把 QUIC/HTTP/3 做对、做好，并不容易。很多现有实现要么绑定特定语言生态，要么耦合了 I/O 模型，难以嵌入到既有基础设施（NGINX、Envoy、C/C++ 服务端、自定义网关等）。
- Cloudflare 的诉求：要在全球边缘网络大规模启用 HTTP/3，需要一个可移植、高性能、安全优先的实现；同时希望把内部经验回馈社区，降低全行业的接入门槛。quiche 因此诞生，并被用于 Cloudflare 边缘的 HTTP/3 支持，并提供给 NGINX（作为社区补丁）、curl 等生态集成。
---
## 核心亮点与功能剖析
### 1) Sans‑IO 设计：把“协议状态机”和“I/O 彻底解耦”
- quiche 不做 socket、也不提供事件循环；它只负责“来包就推进状态机，需要发包就吐出数据”，调用方负责读写 UDP 套接字、管理定时器与线程/协程调度。
- 好处：可以把 quiche 嵌到 Tokio、自己写的 epoll/kqueue、嵌入式、甚至用户态网络栈中，而不被特定 runtime 绑定。
### 2) IETF 规范对齐与更新节奏
- quiche 跟进 IETF QUIC 与 HTTP/3 规范，官方文档明确说明其目标是标准实现。
- Cloudflare 持续在产品中更新与优化（例如更新拥塞控制等），并通过 blog 宣布“将继续随着 IETF 标准推进而更新”。
### 3) Rust + BoringSSL：内存安全与密码学可靠
- 库本体是 Rust 编写，利用 Rust 的类型系统与借用检查规避常见的内存安全漏洞；TLS 握手层通过 BoringSSL（通过 boring‑sys 自动构建）完成，兼顾了安全性与密码学生态成熟度。
- 这对需要处理海量连接的基础设施尤为关键：在性能与安全间找到平衡。
### 4) HTTP/3 模块：从“传输”到“应用”的一站式
- quiche 提供 HTTP/3 模块，上层可在 QUIC 之上直接收发 HTTP 请求/响应，而无需自己从头实现 QPACK/帧解析等细节。examples 目录提供完整示例。
### 5) 生态与生产级背书
- Cloudflare 边缘网络的 HTTP/3 由 quiche 驱动；Android 的 DNS 解析器使用 quiche 实现 DNS over HTTP/3；curl 可集成 quiche 以提供 HTTP/3（被视为 EXPERIMENTAL）。
- Cloudflare 后续开源的 tokio‑quiche 以 quiche 为核心，面向 Rust Tokio 生态，据称在其隐私代理、Oxy 代理、iCloud Private Relay 等场景中处理“百万级 QPS 的 HTTP/3 请求”，进一步印证了其在大规模生产环境下的可靠性。
### 6) 工具与实验环境
- 内置 quiche‑client / quiche‑server 示例命令行工具，可快速抓包调试和互操作测试；还有 Docker 镜像（cloudflare/quiche、cloudflare/quiche‑qns）与 quic‑interop‑runner 集成，便于参与协议互操作活动。
### 7) 跨平台与跨语言接入
- 原生支持构建为 Linux/Android/iOS 等平台；启用 --features ffi 后编译出 libquiche.a，提供 C API 可在 C/C++ 以及其他支持 FFI 的语言中调用。
---
## 技术栈与架构解析
- 语言：Rust
- 传输协议：QUIC（IETF）
- 应用协议：HTTP/3（RFC 9114）
- 加密/TLS：BoringSSL（通过 boring‑sys）
- 设计模式：Sans‑IO（状态机与 I/O 解耦）
- 平台支持：Linux/Android/iOS 等（文档给出 NDK/iOS 构建指南）。
- 架构要点：
  - 核心：Config（连接级配置）、Connection（单个连接状态机）、recv/send（收/发包推进状态机）、stream_send/stream_recv（流级读写）。
  - 应用侧只需：
    - 创建 Config 与 Connection；
    - 在 UDP socket 上循环 recv，把数据喂给 conn.recv；
    - 调用 conn.send 把待发数据写回 socket；
    - 管理定时器，调用 conn.on_timeout；
    - 在握手完成后通过流 API 收发应用数据。
---
## 上手门槛与部署体验
### 构建依赖与步骤
- 需要 Rust（要求特定版本，见 README）与 cmake（BoringSSL 构建）；Windows 下还需 NASM。整体通过 cargo 构建；环境准备 OK 后，一键 cargo build --examples。注意 BoringSSL 会自动拉取构建，也支持用 BORING_BSSL_PATH 指向已有路径。
### 命令行工具体验（快速验证）
- 客户端：
  - cargo run --bin quiche-client -- https://cloudflare-quic.com/
- 服务端：
  - cargo run --bin quiche-server -- --cert apps/src/bin/cert.crt --key apps/src/bin/cert.key
  （注：证书为自签名，仅用于实验）
### Docker 部署
- 提供 Docker 镜像 cloudflare/quiche 与 cloudflare/quiche‑qns，latest 与 master 同步更新，便于在容器中运行测试与互操作。
### 文档与示例质量
- README 详尽覆盖“配置/连接建立/收发包/超时/发送接收流数据/HTTP/3/调用 C API/多平台构建/Docker”等关键环节；examples 提供更完整的示例（含 C/C++）。
- docs.rs 上有 API 文档，且 Cloudflare 运维 docs.quic.tech 作为文档站点，便于检索与查阅。
### 学习曲线
- 对非 Rust/非网络栈开发者：QUIC 本身复杂，但 quiche 的 Sans‑IO 设计和清晰的 API 文档可以显著降低理解成本。
- 对 C/C++ 团队：需要习惯 FFI 与 Rust 构建链，但静态库 libquiche.a 的存在让链接成本可控。
---
## Demo / 核心代码示例（可运行的最小骨架）
下面给出一个可理解的“最小示例骨架”，展示：配置、连接建立、收发 QUIC 包、发送/接收流数据、超时处理（伪代码风格便于理解）：
### 1) 创建配置
```rust
let mut config = quiche::Config::new(quiche::PROTOCOL_VERSION)?;
config.set_application_protos(&[b"h3"]);              // ALPN
config.set_initial_max_streams_bidi(100);
config.set_initial_max_data(10_000_000);
config.set_initial_max_stream_data_bidi_local(1_000_000);
config.set_initial_max_stream_data_bidi_remote(1_000_000);
// 还可根据需要配置拥控/空闲超时等
```
### 2) 建立连接
```rust
// 客户端
let conn = quiche::connect(Some(&server_name), &scid, local, peer, &mut config)?;
// 服务端
let conn = quiche::accept(&scid, None, local, peer, &mut config)?;
```
### 3) 收包循环（伪代码）
```rust
loop {
    let (read, from) = socket.recv_from(&mut buf)?;
    let recv_info = quiche::RecvInfo { from, to: socket.local_addr().unwrap() };
    let read = conn.recv(&mut buf[..read], recv_info)?;
    // 处理可读流（见下文）
}
```
### 4) 发包与超时
```rust
loop {
    let (write, send_info) = conn.send(&mut out)?;
    socket.send_to(&out[..write], &send_info.to)?;
}
// 定时器处理
let deadline = conn.timeout();
// ...等待到期...
conn.on_timeout();
// 再次调用 send 以发送可能的待发包
```
### 5) 流数据收发
```rust
if conn.is_established() {
    // 发送
    conn.stream_send(0, b"hello", true)?;
    // 接收
    for stream_id in conn.readable() {
        while let Ok((read, fin)) = conn.stream_recv(stream_id, &mut buf) {
            // 处理 buf[..read]
        }
    }
}
```
### 6) HTTP/3 模块（思路）
- 使用 quiche::h3 提供的更上层 API，把 QUIC 上的帧/流抽象成 HTTP 请求/响应流；examples 目录有完整例子（略）。
---
## 目标人群与收益：谁适合用 quiche？
- 适合人群
  - 想自研 HTTP/3 网关/代理/边缘服务的基础设施团队；
  - 需要把 QUIC/HTTP/3 嵌入 C/C++ 既有服务（如自研服务器、网关、媒体服务器）；
  - Rust 生态希望直接控制 QUIC 状态机（而非由框架完全托管）的开发者；
  - 做 QUIC 互操作测试、学术/工程研究、协议工具开发的团队。
- 核心收益
  - 性能与稳定性：Cloudflare 在边缘网络大规模运行，且 tokio‑quiche 据称在其隐私代理、Oxy、iCloud Private Relay 等场景支撑“百万级 HTTP/3 QPS”，可作为工程可靠性背书。
  - I/O 模型自由度：Sans‑IO 让你可以把协议栈嵌入任何事件循环、协程库或嵌入式环境，便于与现有架构深度集成。
  - 语言安全与可维护性：Rust 提供内存安全保证，减少内存相关漏洞，降低长期维护成本；FFI 使得 C/C++ 等生态也能受益。
  - 生态与互操作：可集成到 curl（便于客户端测试）、NGINX（作为补丁）、Android 系统组件等，利于端到端验证与快速落地。
---
## 竞品/同类对比：quiche 处于什么位置？
- 常见竞品（列举，不展开）：
  - msquic（微软，C，面向 Windows，内核/用户态）；
  - lsquic（C，注重性能与功能完备）；
  - quinn（Rust，偏向 Tokio/高层使用）；
  - aioquic（Python，异步模型）。
  （部分研究与比较见于 QUIC 性能评估与部署现状报告与学术 benchmarks。）
- quiche 的独特竞争力
  - Sans‑IO 设计 + Rust：在保证安全性的同时，提供极佳的集成灵活性，适合“嵌入型”场景。
  - Cloudflare 生态与生产级实践：直接支撑 Cloudflare 边缘 HTTP/3、Android 的 DNS over HTTP/3、curl 的 HTTP/3（实验性）等，证明其实战能力；且有 tokio‑quiche 这样面向 Rust 异步生态的封装，降低使用门槛。
  - 完善的跨平台与构建链（Docker、Android/iOS、FFI）以及文档与示例，降低了工程落地风险。
---
## 局限与不足
- Sans‑IO 的“自由度”也是学习成本：使用者必须自己搞定 UDP I/O、路由、连接路由与定时器；对于只想“开箱即用”的开发者，quiche 不是最高层封装。
- 性能调优需要投入精力：如发包节奏（pacing）、拥控算法选择、参数配平等，都需要结合具体场景测试；官方虽然给出 pacing hints（SendInfo.at），但要在生产把性能压到极致仍需经验。
- BoringSSL 依赖：构建链强依赖 BoringSSL，这在安全上合理，但对一些偏向 OpenSSL 的团队可能带来适配工作；Windows 还需要 NASM。
- HTTP/3 的高层封装仍在周边：tokio‑quiche 提供了更易用的异步 API，但如果你不使用 Rust Tokio，则需要自己在 quiche 之上封装更多东西。Cloudflare 也提到 tokio‑quiche 是“基础构建块”，未来会有更高级的抽象开放出来。
---
## 社区活跃度与生命力
- Stars/Forks/贡献者：第三方统计显示约 11.8k Stars、1.1k Forks、约 148 位贡献者，说明社区关注与参与度较高。
- 生产背书与持续投入：Cloudflare 在其官方文档与博客持续更新相关内容（包括 tokio‑quiche 的开源与用法），并将其用于 iCloud Private Relay、WARP、Oxy 等核心产品线，显示其处于持续维护与演进状态。
- 版本与发布：Homebrew 等第三方包管理收录了 cloudflare‑quiche，说明版本化与发布节奏较为稳定；Rust 文档站点 docs.rs 上也有对应的 API 文档版本。许可为 BSD‑2‑Clause，适合在商业与闭源产品中集成使用。
---
## 结语与行动建议
- 综合评价：quiche 是一个“专业级的 QUIC/HTTP/3 引擎”：设计上追求协议正确性、安全性与可移植性；工程上经过 Cloudflare 大规模实战打磨；生态上具备丰富的集成案例与周边（tokio‑quiche、NGINX 补丁、curl、Android 等）。如果你需要深入掌控传输层、或要在自己的基础设施中启用 HTTP/3，quiche 是值得优先考察的选项之一。
- 行动建议
  - 若你想“快速体验/互操作测试”：直接使用 Docker 镜像跑 client/server，或用 cloudflare‑quic.com 做端到端验证。
  - 若你在 C/C++ 现有服务中启用 HTTP/3：按文档启用 ffi，链接 libquiche.a，参考 examples 的 C 集成示例，逐步实现 UDP 收发与事件循环。
  - 若你在 Rust Tokio 生态：优先关注 tokio‑quiche，降低重复造轮子的成本，但需要时仍可直接用 quiche 做底层定制。
  - 若你是学术/研究或协议工具开发者：quiche 的 Sans‑IO 设计非常适合做实验性的拥控算法、协议扩展或互操作测试。
- 风险提示：任何 QUIC 实现都需跟上 IETF 更新节奏，并持续做互操作与安全测试；quiche 已有成熟的工程实践，但在引入前务必在仿真/灰度环境中做充分测试，尤其关注丢包/时延/重传/拥控与安全策略。
