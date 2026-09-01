# averygan/reclip

[GitHub URL](https://github.com/averygan/reclip)


## Reclip：极简自托管媒体下载器深度评测

> 一个基于 yt-dlp 的自托管媒体下载器，支持 1000+ 站点，提供极简 Web 界面，让下载完全可控。

- **Tags**: 开源, 媒体下载, 自托管, Docker, yt-dlp
- **Category**: 开发工具, 生活效率, 自托管服务

## Details

<|assistant|>我将进一步打开 GitHub 的 Issues 与 Pulls 页面，以了解项目的维护活跃度、已知问题和社区参与情况。</think>
现在，让我回答用户的问题。
# Reclip 深度评测：一款“可自己掌控”的极简自托管媒体下载器
## 一句话总结
Reclip 是一个极简、自托管的媒体下载器，背后靠 yt-dlp 驱动，提供干净 Web 界面，能把 YouTube、TikTok、Instagram、X/Twitter、Reddit、Facebook、Vimeo、Twitch 等 1000+ 站点的内容一键下载为 MP4 或 MP3，适合在意隐私、追求可控与稳定的人群。
---
## 背景与痛点
### 为什么你需要一个“自己掌控”的下载器？
- 在线下载站的混乱：广告、弹窗、倒计时、甚至捆绑恶意软件，页面充满了干扰与不确定性。
- 隐私风险：很多在线下载器会把你要下载的链接或目标资源经过第三方服务器，存在信息泄露或被追踪的风险。
- 工具碎片化：不同平台依赖不同 CLI 工具或扩展，维护成本高、学习曲线陡。
- 平台限制：某些平台的官方 API 或站内下载能力有限（如仅限部分内容、质量受限或仅限会员）。
Reclip 的诞生就是要把“下载”这件事收回到你自己的可控范围内——一个命令行、一个容器、一个浏览器就能搞定全部主流站点的媒体资源获取。
---
## 核心亮点与功能剖析
### 1) 一站式支持 1000+ 站点
直接复用 yt-dlp 的 extractor 能力，实现“只要是 yt-dlp 支持的站，Reclip 就能下”。典型支持：YouTube、TikTok、Instagram、Twitter/X、Reddit、Facebook、Vimeo、Twitch、Dailymotion、SoundCloud、Loom、Streamable、Pinterest、Tumblr、Threads、LinkedIn 等。这意味着你不必为每个平台寻找和安装不同的工具。
### 2) MP4/MP3 双模式与质量/分辨率选择
- 支持直接提取 MP3 音频，适合做播客/音源归档。
- 支持选择指定分辨率/质量的 MP4；后端会根据“同分辨率下码率最高”的规则过滤并返回可用的 format 列表，确保 UI 不冗余。
### 3) 批量下载与自动去重
- 支持一次性粘贴多条链接（以空格、逗号、换行分隔），系统会并行拉取元数据并展示为卡片列表。
- UI 层自动对 URL 做去重，避免重复下载。
### 4) 干净、无框架的前端体验
- 没有前端框架、没有打包构建链路，仅有单个 HTML 文件（Vanilla HTML/CSS/JS）。
- 响应式设计，对手机与桌面浏览器都友好。
### 5) 极简架构与代码组织
- 后端仅依赖 Flask + yt-dlp（requirements.txt 里只有这两行）。
- 核心业务逻辑集中在 app.py 单文件内，约 150 行，路由清晰、职责单一。
- 前端单文件 templates/index.html；整个项目的结构非常直观：
```
assets/          → 预览图片与演示视频
static/          → favicon.svg
templates/       → index.html
app.py           → 后端主文件
Dockerfile       → 容器镜像定义
docker-entrypoint.sh → 容器启动入口，自动更新 yt-dlp
docker-compose.yml → 编排与卷挂载定义
reclip.sh        → 本地启动脚本
requirements.txt → Python 依赖
```
### 6) 自动保持 yt-dlp 新鲜
容器每次启动时默认都会用 pip install --user -U yt-dlp 尝试更新，确保 extractors 能应对平台频繁变更的接口结构。这一策略显著提升了自托管方案的稳定性，无需频繁手动升级容器镜像。
---
## 技术栈与架构解析
- 后端：Python + Flask（微框架，路由简洁；少量线程处理下载任务）。
- 前端：Vanilla HTML/CSS/JS，单文件，无构建流程。
- 下载引擎：yt-dlp（负责媒体拉取、合并、转码）；ffmpeg 负责音视频合并与格式转换。
- 任务模型：内存中的 jobs 字典（job_id → 状态、文件路径、错误信息），配合线程异步执行下载；适合单机轻量使用。
- API 设计：
  - POST /api/info：拉取单个视频元数据与可选画质列表。
  - POST /api/playlist：拉取播放列表内各视频 URL（flat 模式）。
  - POST /api/download：创建下载任务并返回 job_id（异步线程执行 run_download）。
  - GET /api/status/<job_id>：查询任务状态与错误信息。
  - GET /api/file/<job_id>：完成后通过 send_file 返回文件作为附件下载。
- 部署形态：
  - 裸机脚本启动（./reclip.sh）。
  - Docker 单容器；支持 docker-compose 并用持久卷保存下载文件。
  - 容器默认监听 8899 端口，生产可用 gunicorn + 单进程多线程（ ENTRYPOINT 启动脚本先更新 yt-dlp，再启动 gunicorn）。
---
## 上手门槛与部署体验
### 系统依赖
- Python（镜像使用 3.12-slim）。
- ffmpeg 与 yt-dlp（脚本与 Dockerfile 内均会安装）。
### 快速上手（本地 macOS/Linux 脚本）
```bash
brew install yt-dlp ffmpeg   # 或 apt install ffmpeg && pip install yt-dlp
git clone https://github.com/averygan/reclip.git
cd reclip
./reclip.sh
# 浏览器访问 http://localhost:8899
```
### 快速上手（Docker）
```bash
docker build -t reclip .
docker run -p 8899:8899 reclip
# 浏览器访问 http://localhost:8899
```
### Docker Compose 持久化下载目录
```yaml
services:
  reclip:
    build: .
    image: reclip:latest
    container_name: reclip
    ports:
      - "8899:8899"
    volumes:
      - reclip-downloads:/app/downloads
    restart: unless-stopped
volumes:
  reclip-downloads:
```
执行 `docker compose up -d`，即可让下载文件保留到持久卷中，不随容器销毁而丢失。
### 一键更新 yt-dlp 与禁用更新
容器每次启动都会尝试 pip install --user -U yt-dlp。若内网环境或离线部署，可通过环境变量 `RECLIP_NO_UPDATE=1` 跳过。
---
## 社区活跃度与生命力（基于仓库数据）
- 收藏与使用规模：该仓库在 GitHub 获得数千 Star，说明关注度高且被广泛自用。
- Issues 与 Pull Requests：GitHub 上存在 Issues 与 PR 列表（页面入口可访问），表明社区有参与讨论与贡献。
- Release：存在 Release 页面，说明作者有做版本管理与发布节奏。
- 第三方平台引用：Cloudron 等应用平台社区出现 Reclip 的部署与讨论帖，显示其在自托管圈子中有一定知名度。
总体来看，项目架构极简且依赖可控，维护负担小，加之容器启动脚本内置了 yt-dlp 自动更新，生命周期与可用性具备较强韧性。
---
## Demo / 代码示例（最简单、最核心）
### 最小化运行（本地 Python）
```bash
pip install flask yt-dlp
# 确保系统中已安装 ffmpeg
python app.py
# 默认监听 http://127.0.0.1:8899（可通过环境变量 PORT 调整）
```
### API 调用示例（获取视频信息与可选画质）
```bash
curl -X POST http://localhost:8899/api/info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=..."}'
# 返回包含 title、thumbnail、duration、uploader、formats（含 id/label/height）的 JSON
```
### 启动下载任务
```bash
curl -X POST http://localhost:8899/api/download \
  -H "Content-Type: application/json" \
  -d '{"url":"...","format":"video","format_id":"137","title":"我的视频"}'
# 返回 job_id；随后轮询 /api/status/<job_id> 获取状态；完成后调用 /api/file/<job_id> 下载文件
```
---
## 目标人群与收益
- 适合人群
  - 在意隐私、不想把下载链接暴露给第三方的个人用户与小团队。
  - 运维/开发人员，希望把“媒体获取”集成到自己的流水线或内网服务。
  - 内容创作者，需要批量采集素材并归档到本地。
  - 自托管爱好者、NAS 用户，喜欢把常用服务部署在自己的机器上。
- 能带来的直接收益
  - 提升效率：批量粘贴链接、自动去重、一键下载；大幅减少重复操作和工具切换成本。
  - 节省成本：自托管无需订阅多平台会员或使用在线付费下载服务。
  - 隐私可控：所有请求与文件存储在自己控制的机器上，不经过第三方。
  - 可集成性：简单 JSON API 易于与其他自动化脚本（如 n8n、Airbyte、自建爬虫）组合。
---
## 竞品/同类对比
- 在线下载站/网页服务
  - 优点：零部署、即开即用。
  - 缺点：广告与弹窗、隐私风险、站点接口/反爬频繁失效、通常无法批量操作。
- 桌面客户端（如 4K Video Downloader）
  - 优点：图形界面友好，上手门槛低。
  - 缺点：闭源、跨平台与批量/自动化能力有限，有时与平台接口博弈导致功能不稳定。
- 命令行 yt-dlp 本身
  - 优点：能力最全、更新最快，非常适合脚本化。
  - 缺点：对非技术用户不友好，参数繁多，需要记忆或查阅文档。
- Reclip
  - 定位：把 yt-dlp 的能力包装成“开箱即用”的 Web UI，同时保留简单的 API 以供集成。
  - 竞争力：极简代码（150 行后端）、无框架前端、Docker 一键部署、自动更新 yt-dlp、批量与去重；适合“想省心但又要掌控”的用户。
---
## 局限与不足
- 任务状态在内存，重启或崩溃后丢失：当前 jobs 字典只在内存中维护，不支持持久化或断点续传。适合一次性任务，对需要长期可追溯与可靠调度的大型作业略显薄弱。
- 无用户系统与权限控制：系统没有认证与多用户隔离，更适合个人或可信内网使用。若暴露到公网，需要反向代理（如 Nginx）自行加 Basic Auth 或 OAuth 等保护。
- 无播放列表自动一键下载：UI 与 API 提供了 playlist 信息获取接口（/api/playlist），但“一键全选并下载全部条目”的 UX 需要前端改造或二次开发。
- 容器下载文件仅在卷内持久：需要映射 downloads 目录或使用 docker-compose 持久卷，否则重建容器会丢失已下载文件。
- 平台策略风险：部分平台明确限制下载行为，需注意遵守平台服务条款与当地版权法；项目 README 明确标注“仅供个人使用，开发者不对误用负责”。
---
## 结语与行动建议
- 综合评判
  - Reclip 做对了“减法”：把庞大的 yt-dlp 能力收敛到一个干净、易用的 Web 服务里，代码简洁、部署成本低，非常适合个人或小团队做“媒体归档与素材收集”的统一入口。
  - 它不是功能最全的媒体工作台，而是一个专注、稳定、可掌控的下载器。如果你希望“拿来就用，且必要时还能自己改”，Reclip 是个很好的起点。
- 行动建议
  - 如果你是“小白”：优先使用 Docker 或 Docker Compose 部署，把 `8899` 端口映射到本地即可快速上手；不要忘记映射 volumes，避免下载文件丢失。
  - 如果你是开发者：基于 app.py 和 index.html 做二次开发非常容易——例如添加“一键全选下载”、任务历史持久化、简单用户认证或与你的内部工作流整合。
  - 安全与合规：建议仅在私有网络或通过反向代理+认证访问，并严格遵循平台服务条款和版权要求。
---
## 附录：核心配置与命令速查
### requirements.txt
```txt
flask
yt-dlp
```
### Dockerfile（关键点：ffmpeg 安装与启动脚本）
```dockerfile
FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn
COPY . .
RUN useradd -m -u 1000 reclip && \
    mkdir -p /app/downloads && \
    chown -R reclip:reclip /app
USER reclip
ENV PATH=/home/reclip/.local/bin:$PATH
EXPOSE 8899
ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]
CMD ["gunicorn", "-b", "0.0.0.0:8899", "-w", "1", "--threads", "4", "--timeout", "600", "--access-logfile", "-", "app:app"]
```
### docker-entrypoint.sh（启动时更新 yt-dlp）
```sh
#!/bin/sh
if [ -z "$RECLIP_NO_UPDATE" ]; then
  echo "Updating yt-dlp..."
  pip install --user --no-cache-dir -q -U yt-dlp || \
    echo " (couldn't update yt-dlp — continuing with the installed version)"
fi
exec "$@"
```
### 本地脚本启动 reclip.sh（示例逻辑，参考 README）
```bash
#!/usr/bin/env bash
set -euo pipefail
pip install -q -r requirements.txt
export PORT=${PORT:-8899}
exec python app.py
```
---
**一句话再总结**  
如果你希望用“极简、可控、可定制”的方式把主流平台的媒体资源收归己有，Reclip 是一个非常值得尝试的自托管方案——简单到 5 分钟就能上线，又留有足够的可扩展空间。
