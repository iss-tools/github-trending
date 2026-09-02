# vercel-labs/portless

[GitHub URL](https://github.com/vercel-labs/portless)


## Portless：告别端口冲突的本地开发神器

> 用稳定命名的 HTTPS 域名替代随机端口，解决本地多项目管理痛点。

- **Tags**: Vercel, 本地开发, 端口管理, HTTPS, 开源项目
- **Category**: 开发工具, DevOps

## Details

# 一句话总结
Portless 是一个由 Vercel Labs 打造的本地开发工具，它用一个稳定的、命名的 .localhost HTTPS 代理把你的多个服务都收拢到“443 端口 + 固定域名”，不再需要记和抢端口号；它对人类友好，对 AI 代理也同样友好，尤其适合多项目/微服务/多分支并行开发的场景。
---
## 背景与痛点：为什么我们需要“不再用端口号”？
在日常开发中，我们几乎都遇过这几件事：
- 前端在 localhost:3000，后端在 localhost:8080，文档站是 3001 还是 3002？一个下午切来切去，浏览器 tab 上都是 localhost，分不清谁是谁。
- 换电脑或团队协作时，大家约定 3000 端口，结果有人被占，被迫改到 3001，接着本地配置、环境变量、测试脚本要跟着改一轮。
- 开多个服务或多分支（git worktree）时，端口冲突 EADDRINUSE 不断出现，要么到处改配置，要么到处加 --force。
这些“低频、重复、容易被放大”的小问题，会让人分心，也会让 AI 编码代理更难理解你的本地开发环境——因为 AI 不容易分辨 3000 与 3001 哪个是当前要动的服务。
Portless 的解法很直接：用一个本地反向代理（默认 443 端口），把你的服务按“命名域名”来路由，比如 https://myapp.localhost、https://api.myapp.localhost，真正的后端进程依然跑在一个随机的 4000–4999 端口，但你再也不用记住或改这个数字。
---
## 核心亮点与功能剖析
### 1) 命名本地 URL + 自动端口分配
- 安装后只需一条命令：
  - 全局：npm install -g portless
  - 使用：portless myapp next dev → https://myapp.localhost
- 代理会自动给后端进程分配一个空闲端口（4000–4999），并通过 PORT 环境变量传给进程。主流框架（Next.js、Express、Nuxt 等）尊重 PORT，就不需要再手动设置。若框架不读 PORT（Vite、Astro、Angular 等），Portless 会在命令行里帮你补上正确的 --port/--host（仅对 dev/serve/start 等服务命令生效，不会误伤 build/test）。
收益：你再也看不到“端口冲突”，再也不用把端口号写死在 README 或环境变量里。
### 2) HTTPS + HTTP/2 默认开箱
- 首次运行时，Portless 会在本地生成一个 CA，并自动把它加入系统信任库（Linux 支持主流发行版；Windows 用 certutil；WSL 会同时更新 Linux 与 Windows 当前用户的信任库），不再出现浏览器证书警告，也不需要你自己去跑 mkcert。
- 默认使用 HTTP/2。浏览器对 HTTP/1.1 单 host 限制 6 连接，这对 Vite/Nuxt 这种“大量小文件”的 dev server 来说很容易变成瓶颈；HTTP/2 多路复用能把请求压在单连接上，加载更顺滑。HMR/WebSocket 在两种协议下都能正常工作。
收益：开发体验与生产更接近（HTTPS、HTTP/2），且对性能有明显改善。
### 3) 一份配置，支持 monorepo 与子域名
- 在仓库根目录放一个 portless.json，可统一配置各包的命名与脚本。Portless 能从 pnpm-workspace.yaml / package.json 的 workspaces 字段发现包。示例：
  - 根 portless.json：
    ```json
    {
      "apps": {
        "apps/web": { "name": "myapp" },
        "apps/api": { "name": "api.myapp" }
      }
    }
    ```
- 在根目录执行 portless 会启动所有含 dev 脚本的工作区包；cd apps/web && portless 只启动当前包。
- 若未提供 apps 映射，命名会自动遵循 <package>.<project>.localhost 的约定，避免重复（当 package 名与项目名相同时会自动去重）。
收益：多包多服务只需要一个配置文件；子域名自然地分层（前端 myapp、后端 api.myapp），易于理解与维护。
### 4) Git Worktree 自动子域名
- portless run 能自动检测 git worktree，并在分支名作为子域名前缀。比如主分支为 https://myapp.localhost，而 fix-ui 分支的 worktree 会变成 https://fix-ui.myapp.localhost，无需改配置。
收益：多分支并行开发/审阅时，各自有独立 URL，不会端口冲突，也不必改来改去。
### 5) 自定义 TLD 与 OAuth、Cookie 场景兼容
- 默认 .localhost 即可。你也可以改成 .test（IANA 保留，冲突风险低），甚至用你拥有的域名作为“TLD”，例如 dev.example.com，从而让本地环境的域名结构与生产对齐。Proxy 会自动同步 /etc/hosts，把这些域名指到 127.0.0.1。
- 一些 OAuth 提供商（如 Google、Apple）不接受 .localhost/.test 的回调地址，但接受真实域名。此时你可以在本地使用 https://myapp.dev.example.com 这类地址来完成回调，无需再改生产域名。
收益：本地与生产环境“域名结构一致”，使基于 host 的路由、跨子域 cookie、OAuth 回调等配置能直接复用，减少差异。
### 6) 共享与协作：LAN / Tailscale / ngrok
- LAN 模式：portless proxy start --lan 会把代理绑定到 0.0.0.0/::，并使用 mDNS 把服务以 <name>.local 暴露给同网络设备（macOS 自带 dns-sd，Linux 需 avahi-utils）。适合在真机上预览。
- Tailscale 共享：--tailscale 会把本地服务也挂载到你的 Tailscale 网络上（如 https://devbox.yourteam.ts.net）。--funnel 可继续把 Tailnet 上的服务公网暴露。使用前需要 Tailscale CLI 与 HTTPS/Funnel 配置已开启。
- ngrok 集成：--ngrok 一键生成公网可访问的临时 URL，并随进程退出自动清理。
收益：同事/真机/演示环境都能快速访问你的本地服务；安全可控（通过 Tailscale 等可信隧道），而不需要到处手动启动隧道、改配置。
### 7) 与 AI 代理/“Agent Skills”生态的天然契合
- Portless 明确把自己定位为“for humans and agents”：稳定的 .localhost 域名更利于 AI 代理理解并调用本地服务，而不必猜端口号。Vercel 的 Skills 市场也有对应的 Portless skill，供代理直接使用。
收益：让 AI 编码/自动化脚本更稳定地访问你的本地开发环境；如果公司打算在 CI 或自动化测试里引入 AI 代理，Portless 可减少“端口不可预测”带来的不确定性。
### 8) 代理命令与运维友好
- 提供了一组运维向子命令：portless list（列出当前路由）、portless doctor（诊断配置与状态）、portless trust（手动信任本地 CA）、portless clean（清除状态、CA 与 /etc/hosts 条目）、portless hosts sync/clean（修复 Safari 等 DNS 问题）、portless service install/uninstall/status（开机自启代理服务）。
- 支持环境变量统一配置（如 PORTLESS_TLD、PORTLESS_LAN、PORTLESS_TAILSCALE、PORTLESS_NGROK 等），也支持在子进程里注入 PORT/PORTLESS_URL/NODE_EXTRA_CA_CERTS 等，便于框架或脚本使用。
收益：团队可以把配置沉淀到 .env 或文档，一键复现；出现问题时用 doctor 快速定位。
---
## 目标人群与收益
- 前端/全栈工程师（Next.js、Vite、Nuxt、Astro、Remix、SvelteKit 等）：多项目并行、常遇端口冲突或 HMR 慢。
- 后端/微服务开发者（Node.js/Express/Nest 等）：本地跑多个服务，希望用域名区分而不是一堆端口。
- Monorepo 与多工作区团队（Turborepo/pnpm/yarn/npm/bun workspaces）：希望用一个配置就能统一命名、一键启动多包。
- 使用 git worktree 的开发者：同一仓库多分支并行开发/审阅，各自需要独立 URL。
- 做 OAuth/SSO、跨子域 cookie、基于 host 的路由的人：需要本地与生产域名结构对齐。
- 计划把 AI 代理纳入开发流程/测试/自动化的团队：需要给代理一个“稳定的本地入口”。
具体收益：
- 消除 EADDRINUSE 和到处改端口的“琐税”。
- 提升多服务并发开发的体验：HMR 更顺畅（HTTP/2），不再误开旧服务。
- 对新同事/新人友好：一句命令就能得到 https://<name>.localhost，上手门槛低。
- 为 AI 代理/脚本提供稳定的访问入口，减少“猜端口”带来的脆弱。
---
## 竞品/同类对比
- 传统方式（自己改端口）：零工具成本，但容易冲突、难以在团队间统一；端口随机器而变，难以给 AI 代理一个稳定约定。
- 域名 + hosts 文件 + 反向代理（Nginx/Caddy）：功能强大，但需手动配置与维护，不适合每个人频繁改动。
- dev-sidecar 类工具（本地 DNS/代理）：侧重翻墙或公司内网，不一定解决“每个服务都要占一个不同端口”的问题。
- browser-sync / 代理式 dev server：通常是对单个项目做代理，解决注入脚本与跨域，但不能统一管理多个服务的命名与端口分配。
Portless 的独特竞争力：
- 与 npm/pnpm/yarn/bun 脚本深度集成，自动化注入端口参数，基本“零配置”。
- 开箱即用 HTTPS + HTTP/2，并自动管理本地 CA。
- 针对 Monorepo/git worktree/OAuth/AI 代理场景有明确的设计与命令支持。
- 与 Tailscale/ngrok 等现代协作/隧道工具直接集成，让本地服务“一键可分享”。
---
## 局限与不足
- 操作系统权限与信任库变更：首次启动 HTTPS 默认绑定 443 端口、安装本地 CA，可能触发 sudo/管理员权限与系统提示，在管控严格的公司环境需提前沟通。
- pre-1.0 稳定性：README 明确标注“pre-1.0”，状态目录格式未来可能变化，升级时或许需要重新运行 portless trust，且不同成员用不同版本时可能出现兼容问题（建议作为项目 devDependency 锁版本或全局统一版本）。
- 平台差异：LAN 模式依赖系统 mDNS 工具（Linux 需 avahi-utils），缺失时会报错退出；Safari 对 .localhost 子域的解析行为依赖系统 DNS，有时需要手动 portless hosts sync。Windows、WSL、macOS 在信任库与 hosts 的处理略有差异。
- 与其它网络栈工具的潜在冲突：若本地已有其它服务占用 80/443 或自定义端口，需要通过 --port 或 PORTLESS_PORT 改为其它端口；同时启动多个代理可能需要先停旧实例，否则会提示冲突。
- 团队协作需要约定：Portless 不解决“团队成员之间如何统一使用同一工具”的问题，这需要在团队文档/脚本中明确安装方式与配置；否则会出现“有人用、有人不用、端口混着写”的混乱。
---
## 技术栈与架构（开发者视角）
- 语言与运行时：README 中的 Development 章节标注 Node.js 24+，pnpm 11。仓库是 pnpm workspace monorepo，使用 Turborepo 构建；发布包在 packages/portless。
- 架构示意：
  - 浏览器请求 https://myapp.localhost → 本地 Portless 代理（443 或自定义端口）→ 请求被转发到后端进程实际监听的随机端口（如 :4123）。
- 状态管理：在 ~/.portless 存放状态、CA 与密钥等；在 sudo 启动时，会根据调用用户的 home 解析路径，确保代理与子进程共享同一份路由注册。
- 集成方式：
  - 全局安装后，直接在命令行执行 portless。
  - 或在 package.json scripts 里写成 "dev": "portless run next dev" / "dev": "portless" 并配合 portless.json 或 "portless" 字段使用。
  - 也支持环境变量 PORTLESS=0 直接绕过代理，方便临时调试。
---
## 上手门槛与部署体验（Demo/代码示例）
最简示例（从零到可访问）：
1) 安装
```bash
npm install -g portless
```
2) 在项目目录运行（假设 package.json 的 scripts.dev 为 next dev）
```bash
portless myapp next dev
# 浏览器访问 https://myapp.localhost
```
Monorepo + 多服务示例：
1) 根目录 portless.json
```json
{
  "apps": {
    "apps/web": { "name": "myapp" },
    "apps/api": { "name": "api.myapp" }
  }
}
```
2) 根目录一键启动两服务
```bash
portless
# 浏览器访问 https://myapp.localhost 与 https://api.myapp.localhost
```
前端代理后端（避免 508 Loop Detected）的 Vite 配置示例：
```ts
// vite.config.ts
export default {
  server: {
    proxy: {
      "/api": {
        target: "https://api.myapp.localhost",
        changeOrigin: true,
        ws: true,
      },
    },
  },
};
```
---
## 社区活跃度与生命力
- Star 数约 10.7k、Fork 353，显示出较高的关注度。
- 仓库显示 156 次提交，内置测试、e2e、CI（GitHub Workflows）与 pnpm workspace 架构，代表工程化较完备。
- Issues 与 PR 数量在数十量级，README 中有 Troubleshooting、doctor 命令、proxy between apps、Safari DNS 等“常见问题”指引，说明作者对反馈有持续跟进与文档沉淀。
- Vercel 官方站点 portless.sh 与社区文章（BetterStack、Grizzly Peak Software 等）发布了入门与最佳实践，对生态有正向推动。
整体判断：作为 Vercel Labs 的项目，成熟度与关注度处于良好状态；但版本仍 pre-1.0，适合在非关键路径的个人/团队开发环境中先试用、积累经验，再逐步推广到更多场景。
---
## 结语与行动建议
Portless 把“端口管理”这件事抽象成了“命名域名 + HTTPS 代理”，是开发者日常用得上、几乎无负担的“小工具，大改善”。它尤其适合多项目、多分支、微服务、以及想要让 AI 代理稳定访问本地环境的团队。
行动建议：
- 个人开发者：先全局安装试用一两个项目，体验 https://<name>.localhost 的便利，把常用项目改用 portless run 启动。
- 团队：在 README 或开发环境文档中加入 portless 的安装与基础配置（尤其是 monorepo 与 portless.json），把“端口冲突”从新人引导中剔除。
- 有 AI 代理/自动化流程的团队：把本地服务访问方式从“端口号”切换为 Portless 域名，并利用 --tailscale/--ngrok 做受控的外网暴露，让自动化更稳定、可观测。
---
## 附：简要命令速查
```bash
# 安装
npm install -g portless
# 启动单个服务
portless myapp next dev
# 启动当前项目（使用 dev 脚本，名称由项目推断）
portless
# Monorepo 根目录一键启动多包
portless
# 子域名
portless api.myapp pnpm start
portless docs.myapp next dev
# 自定义 TLD
portless proxy start --tld test
portless myapp next dev    # https://myapp.test
# LAN 模式（同网络设备访问）
portless proxy start --lan
portless myapp next dev    # https://myapp.local
# Tailscale 共享
portless myapp --tailscale next dev
# ngrok 公网暴露
portless myapp --ngrok next dev
# 运维命令
portless list
portless doctor
portless trust
portless clean
portless hosts sync
portless hosts clean
portless proxy stop
portless service install
portless service status
portless service uninstall
```
资料与出处（进一步阅读）：
- GitHub 仓库（README 与命令/配置/限制/要求等）：https://github.com/vercel-labs/portless
- 官方站点：https://portless.sh
- 社区入门与最佳实践指南（BetterStack 与 Grizzly Peak Software）：
