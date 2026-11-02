# D4Vinci/Scrapling

[GitHub URL](https://github.com/D4Vinci/Scrapling)


## Scrapling 深度评测：一个会自我修复的 Python 爬虫框架

> 一个自适应、能自我修复、可绕过反爬的 Python 全能爬虫框架，还内置 AI 接口。

- **Tags**: Python, 爬虫, 开源项目, 反反爬, MCP
- **Category**: 开发工具, 数据采集, AI 编程

## Details

# Scrapling 深度评测：一个会"自我修复"的 Python 爬虫框架
> **一句话总结**：Scrapling 是由安全研究员 Karim Shoair（D4Vinci）打造的自适应 Web Scraping 框架，把 HTTP 请求、反反爬浏览器、智能解析、分布式爬虫和 MCP 服务器打包进一个库——它最杀手锏的能力，是当目标网站改版后，你的爬虫**不用改一行代码就能继续跑**。截至 2026 年，GitHub 已斩获 87.5k Star、1.6k+ commits，是 Python 爬虫圈近年增长最快的现象级项目。
---
## 一、背景与痛点：为什么需要 Scrapling
### 1.1 传统爬虫的"三国杀"困境
做过爬虫的人都知道 Python 爬虫生态的碎片化有多严重：
- **解析 HTML** 用 BeautifulSoup 或 Parsel；
- **发 HTTP 请求** 用 requests 或 httpx；
- **渲染 JS 动态页** 用 Playwright 或 Selenium；
- **过 Cloudflare** 还得另外叠 undetected-chromedriver 或 curl_cffi；
- **大规模并发** 才轮到 Scrapy。
这意味着你要维护至少 3~5 个依赖、拼装它们之间的胶水代码，而且任何一个网站前端改版，你的 CSS 选择器立刻变成"昂贵的定时炸弹"。
### 1.2 两个让爬虫工程师头疼的"经典绝症"
**绝症一：网站一改版，脚本就趴窝。**
你辛苦写的 `.product-price` 选择器，对方前端一重构改成 `.css-1k9xjs3-v2`，整条管道瞬间崩掉，返回满屏 `NoneType` 异常。传统方案只能定期人工维护选择器，时间成本巨大。
**绝症二：反爬系统越来越"精"。**
Cloudflare Turnstile、DataDome、Akamai 检测的不是 UA 字符串，而是 TLS 指纹、Canvas 渲染、WebGL 行为、鼠标轨迹等上百个维度。普通 Playwright 一启动就被识别为机器人。
Scrapling 的设计哲学就是**用一套统一 API 同时解决这两件事**——并且全部开源免费，BSD-3 协议可商用。
---
## 二、核心能力剖析：三大支柱
### 2.1 🔄 Adaptive Scraping：会"自我修复"的选择器
这是 Scrapling 最具原创性的功能，作者专门写过一篇《Creating self-healing spiders with Scrapling in Python without AI》来阐释其原理。
**底层逻辑（用大白话讲）**：
想象你在商场找一个老朋友。传统爬虫就像只记住了"他在三楼穿红色 T 恤"——只要换件衣服就认不出来了。Scrapling 给每个目标元素生成一份**多维指纹**（包含属性、HTML 标签密度、在 DOM 树中的相对深度、周边文本语料），存进本地 SQLite。下次找不到时，它把这份指纹和新 DOM 树做**相似度评分**，返回最高置信度的匹配——就像通过"身高、口音、走路姿势"认人，衣服换了也能认出。
**代码示例（这是核心用法，看一眼就懂）**：
```python
from scrapling.fetchers import StealthyFetcher
# 第一次运行：用 auto_save=True 留下元素指纹
page = StealthyFetcher.fetch('https://example.com/products', headless=True)
products = page.css('.product', auto_save=True)   # 📸 拍照存档
# 一个月后，网站改版了，class 全换了
page = StealthyFetcher.fetch('https://example.com/products', headless=True)
products = page.css('.product', adaptive=True)    # 🔮 自动找回！
```
注意它是**确定性算法**，不是套个 LLM 包装——零 API 调用、低延迟、行为可复现，这点在工程上非常重要。
### 2.2 🌐 三种 Fetcher：一个 API 应对从"老实网站"到"Cloudflare 大魔王"
Scrapling 把所有抓取场景抽象为三种 Fetcher，**它们共享同一个 Response 接口**，可以无缝切换：
| Fetcher | 底层引擎 | 适用场景 | 性能特征 |
|---------|---------|---------|---------|
| **Fetcher** | httpx + TLS 指纹伪装 | 静态页面、API 接口 | 最快，~40MB 内存，支持 HTTP/3 |
| **DynamicFetcher** | Playwright (Chromium) | JS 渲染页、需要交互 | 中等，~500MB 内存 |
| **StealthyFetcher** | Camoufox（基于 Firefox 的反检测浏览器） | Cloudflare Turnstile、强反爬站点 | 最强穿透力，~800MB+ 内存 |
**关键区别**：StealthyFetcher 用的是 **Camoufox**——一个把指纹伪装直接写在 Firefox C++ 层的反检测浏览器，而不是靠 JS 注入打补丁。因为 JS 注入的方式（如 `Object.getOwnPropertyDescriptor` 检查）很容易被反爬系统识别，Camoufox 这种"从浏览器内部原生报告"的指纹一致性是质的飞跃。
```python
# 一行代码硬刚 Cloudflare Turnstile
from scrapling.fetchers import StealthyFetcher
page = StealthyFetcher.fetch(
    'https://nopecha.com/demo/cloudflare',
    headless=True,
    solve_cloudflare=True   # 自动解 Turnstile，无需第三方打码 API
)
data = page.css('#padded_content a').getall()
```
进阶亮点：**`capture_xhr` 参数**可以一边加载页面一边自动捕获背后的 XHR/fetch 请求——很多 SaaS 网站页面上没数据但 API 调用拉得很欢，这个功能让你不用逆向抓包就能拿到干净的结构化数据。
### 2.3 🕷️ Spider 框架：Scrapy 的精神续作 + 现代化增强
如果你用过 Scrapy，下面这段代码会非常眼熟：
```python
from scrapling.spiders import Spider, Response
class QuotesSpider(Spider):
    name = "quotes"
    start_urls = ["https://quotes.toscrape.com/"]
    concurrent_requests = 10
    async def parse(self, response: Response):
        for quote in response.css('.quote'):
            yield {
                "text": quote.css('.text::text').get(),
                "author": quote.css('.author::text').get(),
            }
        next_page = response.css('.next a')
        if next_page:
            yield response.follow(next_page[0].attrib['href'])
result = QuotesSpider().start()
result.items.to_json("quotes.json")
```
但它做了几件 Scrapy 没有开箱即用的事：
- **Multi-Session**：一个爬虫里同时用 HTTP Session 跑普通页面、StealthySession 跑被保护页面（通过 `sid` 路由）；
- **Pause/Resume**：传一个 `crawldir` 路径，Ctrl+C 优雅暂停，下次启动自动续爬——长任务抓被限流的站点神器；
- **AutoThrottle**：根据每个域名的响应速度自动调节延迟，被封时按 `Retry-After` 指令翻倍等待，过会儿再自动提速；
- **Streaming Mode**：`async for item in spider.stream()` 实时流出 item，对接下游 pipeline；
- **ShopifySpider 等模板**：一行代码拉爆整个 Shopify 商店的商品目录。
### 2.4 🤖 MCP Server：把 Scrapling 接进 Claude/Cursor（AI 时代的杀手锏）
这是 v0.4 版本的最大增量，也是让 Scrapling 在 AI Agent 浪潮中出圈的关键。
**安装配置（超简单）**：
```bash
pip install "scrapling[ai]"
scrapling install  # 下载浏览器依赖
```
然后在 Claude Desktop 的 `claude_desktop_config.json` 中加一行：
```json
{
  "mcpServers": {
    "ScraplingServer": {
      "command": "scrapling-mcp"
    }
  }
}
```
重启 Claude 后，你就可以直接对话："帮我抓一下 `example.com/products` 里的 `.product-title`，绕过 Cloudflare"——Claude 会自动调用 Scrapling MCP 工具完成任务。
**为什么它比其他 Scraping MCP 强？**核心在于** surgical extraction（精准提取）**：其他 MCP 服务器把整页 HTML 塞给 LLM 让它自己找字段，Token 消耗巨大。Scrapling 允许在 Prompt 里带 CSS 选择器，**先在本地用选择器裁剪好内容再交给 AI**——一页 10000 token 的页面可能只传 200 token 给模型，成本和延迟降一个数量级。
此外它内置了**Prompt 注入防护**（自动清理 CSS 隐藏元素、aria-hidden、零宽字符等可能劫持 LLM 的内容），这是很多同类工具忽略的安全细节。
### 2.5 ⚡ 性能基准：作者放的数据 vs 第三方实测
作者官方 Benchmark（100+ 次平均值）：
| 库 | 文本提取耗时 | 相对速度 |
|----|------------|---------|
| **Scrapling** | 1.99 ms | 1.0x |
| Parsel/Scrapy | 2.06 ms | 1.035x |
| Raw lxml | 2.56 ms | 1.29x |
| PyQuery | 23.98 ms | ~12x |
| BS4 + lxml | 1562 ms | **~785x** |
| BS4 + html5lib | 3412 ms | ~1714x |
自适应元素查找上，Scrapling 2.3ms vs AutoScraper 12.58ms（约 5.5 倍）。
需要指出，**Zenrows 的独立第三方实测**给 Scrapling 的反爬成功率评了约 58%，并未宣称"百战百胜"——这更接近真实情况。所以反爬不是银弹，强对抗站点仍然需要配合住宅代理。
---
## 三、目标人群与收益：谁最该用？
| 人群 | 你能拿到什么 | 推荐优先级 |
|------|-------------|-----------|
| **AI Agent 开发者** | 一个开箱即用的 MCP 服务器，让 Claude/Cursor 能稳定绕过 Cloudflare 抓真实数据 | ⭐⭐⭐⭐⭐ 必装 |
| **长期维护爬虫的工程师** | `adaptive=True` 让选择器自动修复，网站小幅改版不用凌晨起床救火 | ⭐⭐⭐⭐⭐ |
| **数据工程师 / RAG 构建者** | `page.markdown()` 一行代码出 LLM 友好的干净 Markdown，配合 `SiteToMarkdownSpider` 整站建语料 | ⭐⭐⭐⭐⭐ |
| **小型爬虫项目 / 个人脚本** | 替代 BeautifulSoup + requests 的拼装组合，一个库搞定 | ⭐⭐⭐⭐ |
| **企业级分布式爬虫团队** | 单机 Spider 可用，但大规模分布式部署仍建议 Scrapy + Scrapling 解析层 | ⭐⭐⭐ |
| **完全零基础小白** | CLI 直接 `scrapling extract` 不写代码就能用，但读懂选择器仍要学 | ⭐⭐⭐ |
---
## 四、横向对比：它在 Python 爬虫版图中的位置
| 维度 | **Scrapling** | BeautifulSoup | Scrapy | Playwright | Crawlee (Apify) |
|------|---------------|---------------|--------|------------|-----------------|
| **定位** | 全栈自适应框架 | 纯 HTML 解析器 | 分布式爬虫框架 | 浏览器自动化 | Serverless 爬虫平台 |
| **JS 渲染** | ✅ 内置 | ❌ | 需中间件 | ✅ 原生 | ✅ |
| **反反爬（CF/Cloudflare）** | ✅ 原生 Camoufox | ❌ | ❌ | ❌ | 部分支持 |
| **自适应选择器** | ✅ 独家 | ❌ | ❌ | ❌ | ❌ |
| **并发爬虫** | ✅ Spider API | ❌ | ✅ 最强 | ❌ | ✅ |
| **MCP Server** | ✅ 内置 13 个工具 | ❌ | ❌ | ✅ Playwright MCP | ❌ |
| **解析速度** | 1.99ms（顶级） | 1562ms（慢） | 2.06ms（顶级） | N/A | N/A |
| **学习成本** | 中等 | 低 | 高 | 中等 | 中等 |
| **生态成熟度** | 新秀（2024 起） | 老牌 | 成熟 | 成熟 | 成熟 |
| **最适合** | 单库解决全流程 | 简单静态解析 | 大规模分布式 | 复杂浏览器自动化 | Serverless 部署 |
**选型口诀**： scrapedata 工程师的一句总结很精辟——**"用 Scrapy 做批量多域名发现，用 Scrapling 做高摩擦、强对抗域名的精准提取"**。两者并不互斥，Scrapling 还提供了 `@scrapling_response` 装饰器让你在 Scrapy 项目里无痛混用其解析器。
---
## 五、局限与不足：该泼的冷水必须泼
### 5.1 自适应不是"永动机"
**相似度算法的盲区**：
- **彻底重构的页面**：从 SSR 切到 React SPA、数据从 HTML 搬到 WebSocket——指纹比对彻底失效，必须人工重写；
- **"相似但不正确"**：如果网站把原价和折扣价的元素换了位置，相似度仍然很高，但抓到的数据已经错了。Proxycove 的分析特别提醒：**"自适应搜索不能替代监控"，要配上取值范围校验、空值比例告警**；
- **指纹会过期**：每次大改版后要重新跑一次 `auto_save=True` 更新基线，否则下一次改版时匹配精度骤降。
### 5.2 部署与运维的几个坑
- **浏览器二进制体积巨大**：`scrapling install` 要下载 Chromium 和 Camoufox 的完整浏览器，Disk 占用不小；在 Serverless/Lambda 这种容器瞬时环境里，SQLite 指纹库如果不挂持久化卷，每次冷启动都被清零，adaptive 功能形同虚设；
- **StealthyFetcher 内存杀手**：每个并发 session 约占 800MB 内存，8GB VPS 上并发超过 10 个会 OOM；
- **依赖树偏重**：完整安装会拉入 Playwright、Camoufox 等一大堆东西，建议按需用 `pip install "scrapling[fetchers]"` 或 `[ai]` 这类 extras 控制。
### 5.3 项目治理的隐忧
尽管 87.5k Star、1.6k+ commits，**核心贡献者只有约 5 人**，绝大多数代码由 Karim Shoair 一人维护。这是典型的"天才单兵项目"模式——迭代快、视野统一，但 Bus Factor 低，企业用户需评估长期依赖风险。
### 5.4 反爬绕过的法律灰色地带
StealthyFetcher 能绕 Cloudflare 在技术上很漂亮，但**法律和 ToS 层面仍属灰色**。项目自带免责声明，使用者需自行评估目标站点条款和所在司法辖区合规要求。**强烈建议同时遵守 robots.txt**——Scrapling 已经内置了 `robots_txt_obey` 开关。
### 5.5 还不是"全场景最速"
Zenrows 第三方测试显示，**Camoufox 这类"重型反检测"在低延迟高吞吐场景下反而吃亏**——多开 Firefox 实例成本高。纯静态、无反爬的场景，requests + lxml 仍是性能之王。
---
## 六、结语与行动建议
**Scrapling 是 2025-2026 年 Python 爬虫圈最具创新性的项目，没有之一。**它不是另一个 BeautifulSoup 也不是另一个 Scrapy，而是用一套统一 API 重新定义了"现代爬虫该长什么样"——自适应、反反爬、AI 友好，每一项都精准踩在时代痛点上。
**给你的行动建议**：
1. **如果你在做 AI Agent** → 立刻 `pip install "scrapling[ai]"` + `scrapling install`，10 分钟接入 Claude/Cursor，体验"对话即爬取"的丝滑；
2. **如果你的爬虫总是被改版搞崩** → 在关键选择器上加 `auto_save=True` + `adaptive=True`，维护成本立刻下降一个台阶，但**务必配上数据校验和告警**，避免静默抓错；
3. **如果目标站点有 Cloudflare Turnstile** → 用 `StealthyFetcher(solve_cloudflare=True)`，配合住宅代理和 Camoufox 指纹，是目前开源方案里最优雅的解法；
4. **如果做 RAG 语料构建** → 直接上 `SiteToMarkdownSpider` + `page.markdown()`，不用写一行 LLM 调用代码就能把整站转成干净 Markdown；
5. **如果是 Scrapy 老用户** → 别急着迁移，先用 `@scrapling_response` 装饰器把 Scrapling 解析器嫁接进现有项目，**渐进式尝鲜**最稳妥。
**避坑三件套**：① 上线前 `scrapling install` 确认浏览器装好；② Serverless 部署务必挂持久卷存 SQLite 指纹库；③ 并发 StealthyFetcher 时算好内存预算，8GB 机器建议并发 ≤ 5。
**一句话总结你的预期收益**：把原来 3~5 个库拼成的"弗兰肯斯坦爬虫"压缩成一个库，把每次网站改版后 2 小时的人工修复压缩到几秒钟的自动重定位，把给 AI Agent 灌原始 HTML 的 token 成本砍掉 90%。**如果你未来的工作是"和 AI 一起爬数据"，Scrapling 值得现在就装进你的工具箱。**
---
**仓库地址**：[github.com/D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling) ｜ **文档**：[scrapling.readthedocs.io](https://scrapling.readthedocs.io) ｜ **协议**：BSD-3-Clause（可商用）
