# OpenCut-app/OpenCut

[GitHub URL](https://github.com/OpenCut-app/OpenCut)

- **Stars**: 87243
- **Language**: TypeScript

## OpenCut 深度评测：开源版的浏览器端剪映

> 开源版剪映，浏览器内多轨剪辑，本地隐私优先，支持自托管。

- **Tags**: 视频编辑, 开源, 隐私保护, 自托管, FFmpeg.wasm
- **Category**: 视频剪辑, 隐私安全, 开源项目

## Details

# OpenCut（OpenCut-app/OpenCut）深度评测
一句话总结：OpenCut 是一款“开源版剪映/CapCut”，在浏览器里就能完成多轨时间线剪辑与本地导出，且主打“隐私优先、本地处理、MIT 可商用”；目前主仓库处于从零重写阶段，想立刻上手应先试 opencut.app 的 Classic 版。
---
## 背景与痛点
- 开源剪辑器长期存在“体验老派”的问题。传统桌面型（如 OpenShot、Shotcut、Olive、Kdenlive）功能强大但学习成本高、UI 交互偏专业，难以满足短视频创作者“拖一拖、点一点”的模板化需求。
- 商业剪辑工具的“渐进式收费与数据焦虑”。CapCut/剪映将越来越多基础功能收进 Pro 订阅、导出分辨率受限或打水印；用户素材上传云端，带来合规与版权顾虑。
- 本地隐私需求在增长。企业内训、保密客户素材、个人隐私视频等场景迫切需要“素材不出设备”的编辑方案。
OpenCut 的切入：在“剪映式体验”与“开源+本地优先”的交叉点，把常用剪辑能力搬到浏览器里，用 MIT 协议保障任何人都能自托管与二次开发。
---
## 核心亮点与功能剖析
- 多轨时间线与实时预览
  - 支持多轨道视频、音频、覆盖层，以时间线方式编排，能做“轨道遮罩、关键帧曲线、变速、音量、字幕、音频波形、自定义画布、贴纸、MP4 导出”等基础剪辑。
  - 前端用 HTML/Canvas 做实时预览（架构文档说明正在重构为“binary rendering”，以提升预览与导出一致性）。
- 本地优先的隐私架构
  - 核心编辑流程在浏览器进行，使用 FFmpeg.wasm 做视频处理，默认不发起上传请求。
  - 云端能力（如自动字幕）为可选且需自行配置 R2/Modal 等后端，未配置就是“纯本地”。
- 技术栈与架构解析（开发者视角）
  - 前端与工程化：Next.js 16 + React 19 + TypeScript；Tailwind CSS 4 样式；Radix UI 组件；Zustand 做轻量状态管理；Turborepo 管理单体仓库；使用 Bun 作为 JS 运行时与包管理；Biome 负责格式化与 Lint。
  - 编辑器内核：EditorCore 单例+Manager 模式，管理时间线/播放/媒体等域；Actions 系统（快捷键与按钮触发的“触发层”）+Commands 系统（封装可撤销/重做的命令模式），保障操作可回滚。
  - 素材与处理：FFmpeg.wasm 在浏览器做视频处理；WaveSurfer.js 做音频波形可视化。
  - 后端（自托管场景）：PostgreSQL（主数据库）+ Redis（缓存与限流）+ Drizzle ORM；Better Auth 做鉴权。
  - 模块化结构：Turborepo monorepo，apps/ 下放置 web/desktop/mobile；lib/ 放领域逻辑与 actions/commands；services/ 放外部集成；core/ 放 EditorCore 单例与管理器系统。
- 自托管与可编程的未来
  - Docker Compose 支持一键启动 PostgreSQL/Redis/Serverless Redis HTTP，方便自托管生产环境；官方文档提供明确的“Self-hosting with Docker”条目。
  - 路线图明确提出：Editor API、插件优先架构、MCP Server（给 AI 调用）、无头批量渲染、编辑器内脚本环境，目标是把剪辑器变成可嵌入、可批处理的“视频引擎”。
- 社区与生态
  - GitHub 主仓库当前约 87.1k Stars、约 8.6k Forks、Issues 270+、PRs 100+，可见关注度极高。
  - 存在“Classic（已归档）”和“重写中的主仓库”两个仓库；线上 opencut.app 目前运行的是 Classic 版本，新版在 new.opencut.app（尚未全面接管）。
  - 项目在 PrivacyTools.io 被收录为“CapCut 的本地替代”，强调“素材不上云、无水印、无跟踪”。
- 授权与商业友好
  - MIT 协议，可商用与二次分发。官网条款明确“内容归你，编辑与处理在本地，支持个人与商业用途”。
---
## 目标人群与收益
- 小白/短视频创作者
  - 收益：在浏览器里开箱即用（Classic 版本），多轨剪辑与常用特效与“贴纸/字幕/变速”等，满足社交平台出片需求；无需安装与付费订阅。
- 企业/机构与隐私敏感场景
  - 收益：素材不离开本机或内网，避免合规风险；可自托管在内网服务器上，统一管理项目与权限。
- 开发者与厂商
  - 收益：MIT 协议允许将 OpenCut 作为嵌入式编辑组件、或用 MCP Server 与 Editor API 做自动化批量渲染与 AI 集成；未来可基于插件体系扩展滤镜/转场/工作流。
- 教育与内训环境
  - 收益：可低成本多机部署（实验室机房），统一环境与版本，不受第三方 SaaS 订阅与隐私策略影响。
---
## 竞品/同类对比
- CapCut / 剪映：生态与模板成熟，但基础功能逐渐付费、素材需上传云端、存在隐私与数据训练担忧。
- 传统桌面开源剪辑器（OpenShot、Shotcut、Kdenlive 等）：功能完备，但交互复杂，缺乏“模板化、拖拽即出片”的现代手感。
- OpenCut 当前位置：体验靠近 CapCut、本地优先且开源，适合“轻量多轨剪辑 + 隐私可控 + 可编程化”的场景；但专业能力（高级调色、运动跟踪、复杂特效）尚不及成熟桌面软件。
---
## 局限与不足
- “重写中”的不确定性：主仓库 README 明确“正从零重写”，Classic 已归档，新版功能仍在重建；桌面/移动端尚处在工程骨架阶段；项目当前暂不接受外部贡献，说明核心设计未稳定。
- 功能尚不完善：预览渲染正在从“HTML/Canvas”重构为“binary rendering”，预览/导出一致性有待优化；缺少高级调色/运动跟踪等深度能力。
- 学习与部署门槛：自托管需要 Docker、PostgreSQL、Redis 等基础设施知识；开发环境依赖 Bun/Node 与配置 `.env.local`，对非开发者有门槛。
- 社区互动与响应速度：尽管 Star/Fork 数高，但 Issues/PR 数量多，是否快速响应需实时观察；官方在重写期内优先核心功能，外围 bug 修复可能滞后。
- 性能依赖浏览器环境：FFmpeg.wasm 受限于单线程与内存，大工程/长视频表现不如原生桌面工具；新版计划引入 Rust + wgpu 的 GPU 合成与更精准的时间刻度，但尚未完全落地。
---
## 开发者视角：上手、部署与代码示例
- 最低门槛体验：直接访问 opencut.app（Classic 版），尝试拖入素材、轨道切割、导出；适合快速验证是否满足日常剪辑需求。
- 本地开发环境（简化示例）：
  - 前置：Bun（或 Node 18+）、Docker（用于 PostgreSQL/Redis）。
  - 克隆仓库并配置环境：
```bash
git clone https://github.com/OpenCut-app/OpenCut.git && cd OpenCut
cp apps/web/.env.example apps/web/.env.local
# 按 docs 编辑 .env.local（数据库、鉴权、可选云服务）
```
  - 启动数据库与缓存：
```bash
docker compose up -d db redis serverless-redis-http
```
  - 依赖与迁移：
```bash
bun install
cd apps/web && bun run db:migrate && cd ../..
```
  - 启动开发服务：
```bash
bun dev:web  # 默认在 http://localhost:3000
```
- Docker 自托管（生产导向）：官方文档提供“Self-hosting with Docker”指南，包含 compose 配置与生产注意事项（反向代理、HTTPS、备份与资源限制等），适合团队内部统一部署。
- 简单状态管理与命令调用示意（React 中）：
```bash
import { useEditor } from "@/hooks/use-editor"; // 假设路径
export const SplitButton = () => {
  const { invokeAction } = useEditor(); // useEditor 订阅 EditorCore 单例与状态变更
  return (
    <button onClick={() => invokeAction("split-selected")}>
      切割选中片段
    </button>
  );
};
```
- 非React 环境（工具函数或测试中）：
```bash
import { EditorCore } from "@/core";
const core = EditorCore.getInstance();
// 执行底层命令（慎用：不可撤销/无 UX 反馈）
core.timeline.splitAt(/* ... */);
```
---
## 结语与行动建议
- 想立刻体验“开源剪映”的小白/内容创作者：先用 opencut.app 的 Classic 版跑通“导入-多轨剪辑-导出”这条路径，看看功能边界是否满足你的日常出片需求。
- 企业/团队或对隐私敏感的用户：优先评估“本地优先 + 自托管”的方案是否匹配合规要求；按官方文档用 Docker Compose 在内网搭一个环境，做小规模试点。
- 开发者/厂商：把 OpenCut 视为“可编程的视频引擎”，关注即将到来的 Editor API 与 MCP Server；做插件或批量渲染集成时，先在 Classic 版验证原型，再跟进新版架构迁移。
- 当前风险提示：主仓库处于重写期，功能未完全回齐 Classic；请勿将“线上可用”等同于“未来架构已实现”，企业落地前务必做好版本锁定与回滚预案。
总体而言，OpenCut 在隐私与开源之间给出了一份颇具野心的答卷。尽管它在功能完备性与成熟度上仍需时间打磨，但 MIT 协议与“插件优先 + MCP + 无头批量”的路线，使其不仅是剪辑工具，更是面向 AI 与自动化时代的“视频基础设施”雏形。
