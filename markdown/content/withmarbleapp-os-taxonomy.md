# withmarbleapp/os-taxonomy

[GitHub URL](https://github.com/withmarbleapp/os-taxonomy)


## Marble os-taxonomy：小学教育界的开源知识图谱基础设施

> 把英美小学课程拆解成1590个微知识点和3221条先修关系的开放数据集，是AI教育产品的开源底层脚手架

- **Tags**: 知识图谱, 开源数据集, AI教育, 自适应学习, EdTech
- **Category**: 开源数据集, AI 教育, 开发工具

## Details

# 深度评测：Marble os-taxonomy，小学教育界的"开源知识图谱基础设施"
> 它把一个孩子从 4 岁到 15 岁要掌握的整个知识宇宙，压缩成了 1,590 个可教学的最小单元和 3,221 条"先学什么才能学什么"的依赖关系——并以 ODbL 1.0 协议，把这张图谱交给了全世界的开发者和 AI。
---
## 一句话总结
**`withmarbleapp/os-taxonomy` 是一套把英美小学课程拆解为"微知识点 + 先修关系 DAG + 掌握证据标准"的开放数据集，目前已成为 AI 教育类产品最可用的开源底层脚手架，短期冲到 4 千+ Stars，正在被社区改造成 MCP Server、知识图谱可视化、课程交叉对齐等多种形态。**
---
## 一、背景与痛点：为什么教育数据需要"开源操作系统"
要理解这个项目的价值，得先看清楚它试图打破的两大壁垒。
**第一道壁垒：课程数据天然是"扁平清单"**。各国教育部门发布的 Common Core、NGSS、UK National Curriculum 本质上是用表格和条款堆出来的文档——一个年级该学什么、学多深，写得清清楚楚，但**"必须先学会 X 才能学 Y"这条最关键的认知链路，从来不在任何官方文档里**。教师靠经验补全，学习者靠碰运气。
**第二道壁垒：完整的知识图谱被锁在商业产品里**。Knewton、Khan Academy、Duolingo 等产品内部都有类似的知识结构，但那是核心竞争资产，从不对外。AI 教育创业者想做一个自适应学习系统，第一件事就是被问"你的知识点图谱从哪来"——要么花数百万美元请教研团队手工梳理，要么用大模型现编（结果往往是幻觉连篇、依赖关系混乱）。
Marble（运营主体 Generative Spark, Inc.）的团队选择了第三条路：**先花力气把自己的"内部资产"做成行业标准，再用开源策略换取生态位**。他们的 AI Agent 先从 7 套课程框架中抽取知识点，再由人工教研团队审核校准，最终在 2026 年 7 月 8 日以 `v1` 的形式发布到 GitHub。
> 换句话说，**这是把"知识图谱"从产品的护城河，降维成了行业的公地**。它是知识图谱界的 OpenStreetMap，而不是 Google Maps。
Marble 自己的商业闭环仍然存在——他们的同名 iPad 应用是一个针对 6–12 岁孩子的"生成式学习世界"，底层就是这个 taxonomy 在驱动"孩子已掌握什么 → 下一步学什么最有价值"的实时决策。但地图本身免费，你可以站在上面盖自己的房子。
---
## 二、核心亮点与数据模型：一张"知识 DAG"到底长什么样
直接读官方数据模型，是这个项目最有说服力的部分。
### 1. 微知识点：最小可教学单元
每个"知识点"不是一个学科名词，而是一个**可以被观察、被验证是否掌握**的原子能力。官方 JSON 示例（节选）：
```json
{
  "id": "mt_N8CpN1EJrP",
  "type": "CONCEPTUAL",
  "subject": "English",
  "domain": "Grammar & Punctuation",
  "name": "Building sentences",
  "description": "Understand that words combine to make sentences — a sentence expresses a complete thought…",
  "ageRangeStart": 4,
  "ageRangeEnd": 6,
  "centrality": 0.257,
  "evidence": [
    "Distinguish between complete sentences and fragments",
    "Compose a complete sentence with a subject and verb"
  ],
  "assessmentPrompt": "If {{name}} says something like \"The dog\", can they tell you that's not a complete sentence…?",
  "standards": ["ccss-ela:L.K.1f", "uk-nc-2013:Eng.App2.Y1.Sent.1"]
}
```
几个字段特别值得划重点：
- **`evidence`（掌握证据）**：不是"孩子会造句了"，而是"能否区分完整句和残缺句"——这是可直接观察的行为描述，AI 评估器拿它就能打分。
- **`assessmentPrompt`（评估提示词）**：已经是一段父向口吻的自然语言 prompt，自带 `{{name}}` 占位符，喂给 LLM 就能用。
- **`centrality`（中心度）**：预计算好的图中心度指标，告诉你这个知识点在整张图上的"枢纽程度"，可以直接用来做学习路径排序。
- **`type`（类型学）**：CONCEPTUAL / PROCEDURAL / REPRESENTATIONAL / LANGUAGE / META——这是认知科学里的知识分类学，而不是随手打的标签。
### 2. 先修依赖：DAG 上的每条边都"讲道理"
依赖关系不是简单的 `A -> B`，每条边都带 `strength`（hard/soft）和一段**人工撰写的"为什么要先学它"的理由**：
```json
{
  "topicId": "mt__00ZSLnB7p",
  "prerequisiteId": "mt_VBl1T1sFCM",
  "strength": "hard",
  "reason": "Must understand vibrations make sound before finding volume patterns"
}
```
这是整个数据集里最"贵"的部分——机器能跑图算法找拓扑排序，但**"为什么要这样排序"的教学法理由，只能由懂儿童认知的教研人员写**。这也是为什么这个数据集很难被大模型一次性合成替代。
### 3. 学科覆盖：科学和数学是主战场
| 学科 | 微知识点数量 |
| --- | --- |
| Science | 547 |
| Mathematics | 503 |
| English | 286 |
| History | 90 |
| Personal & Social Development | 88 |
| Life Skills | 37 |
| Computing | 21 |
| Learning to Learn | 18 |
总计 **1,590 个微知识点 + 3,221 条先修关系 + 8 个学科 + 183 个"领域簇"（domain clusters，给家长读的摘要段落）**。值得注意的是 `Learning to Learn` 和 `Personal & Social Development` 的存在——他们把"元认知"和"社会情感能力"也纳入了同一张图，这在国内同类数据集里非常罕见。
### 4. 三层许可证设计：精细到"哪种用途需要做什么"
这是这个仓库最容易被忽略但极其重要的一节：
| 层 | 内容 | 许可证 | 关键约束 |
| --- | --- | --- | --- |
| 数据库整体 | 结构、ID、拓扑关系 | **ODbL 1.0** | 署名 + Share-Alike（衍生数据库必须继续开源） |
| 文本内容 | description/evidence/assessmentPrompt/reason | **CC BY-SA 4.0** | 署名 + Share-Alike |
| 课程标准源 | NGSS/CCSS/UK NC 原始条目 | 各自上游协议 | 不可由 Marble 再授权 |
**关键操作口径**：ODbL 区分"衍生数据库"（你扩展/修改了图谱本身 → 必须继续开放）和"生成作品"（把图谱用于你的产品、模型或 App → 产品保持私有）。所以，**做商业产品可以闭源，只要在产品里署名；但如果你反向贡献回图谱，社区会用 share-alike 保护这份公地**。这是类 OpenStreetMap 的设计哲学，比大多数 AI 数据集"随便抓"的做法文明得多。
---
## 三、上手体验：纯数据集，但工程化程度超出预期
这个仓库的语言分类是 JavaScript，但那只是因为 `scripts/validate.mjs` 用 Node 写的——**仓库本体是纯 JSON 数据，零运行时、零依赖**。官方给出的最简使用示例（来自 README）：
```javascript
import topics from './data/topics.json' with { type: 'json' };
import deps from './data/dependencies.json' with { type: 'json' };
const byId = new Map(topics.topics.map(t => [t.id, t]));
const prereqs = deps.dependencies
  .filter(d => d.topicId === 'mt_N8CpN1EJrP')
  .map(d => byId.get(d.prerequisiteId).name);
```
三行代码，你就能拿到"造句能力"的所有前置知识点。想验证完整性？跑一句：
```bash
node scripts/validate.mjs
```
它会校验 JSON Schema、引用完整性（每个 `topicId` 是否真实存在）、manifest 中的 SHA-256 checksums。这种"数据即代码"的工程化风格（带 schema、带 checksum、带 validation script），在开源教育数据集里是少数派。
### 生态：社区正在把它"长"成基础设施
短短几个月，仓库周边已经冒出一批衍生项目，这个速度值得注意：
- **`kylelynch/taxonomy-mcp`**：一个把整个 taxonomy 暴露为 9 个只读工具的 MCP Server，可以让 Claude、Cursor 等 AI Agent 直接调用 `search_topics` / `prerequisites_of` / `frontier_for` / `path_to` / `assess_topic` 等接口。这意味着你用自然语言就能问"孩子会 24+35 之后，下一步最该学什么？"——AI 返回的是拓扑排序后的真实学习路径，而不是模型幻觉。
- **DAIR.AI Academy 的"The Atlas of Learning"**：把这张 DAG 渲染成可旋转的 3D 知识宇宙。
- **社区 PR**：已经有人在提"加入澳大利亚课程 v9 对齐"、"加入法国课程 + 跨语言交叉引用"、"加入可复现的 embeddings 管道"等——图表的"国际化"正在由社区推进。
仓库自身的活跃度也不错：作为 2026 年 7 月发布的项目，截至 2026 年 10 月 18 日已积累约 5,500+ Stars 和 900+ Forks，13 个 Issue、8 个 PR 在持续流转。这个数据对于"数据集型仓库"来说属于头部水平——教育类数据集通常很难拿到这个量级的社区关注。
---
## 四、目标人群与收益
### 最适合的三类人
**① AI 教育 / EdTech 创业者** — 这是最大、最直接的受益者。你要做一个自适应学习产品、AI 家庭教师、或课程规划工具，这张图直接解决了冷启动问题：不用再自己画知识点图谱，不用再让大模型瞎编依赖关系，**用这套数据 + 自己的交互层，可以省下至少半年的教研成本**。MCP Server 的存在意味着你可以让一个 LLM Agent 直接"读"这张图，很快就能做出一个能对话的个性化学习助手的原型。
**② AI Agent / LLM 应用开发者（教育方向之外）** — 如果你在做任何涉及"知识依赖""能力评估""学习路径"的 Agent，这个数据集是一个**极佳的、带 ground truth 的评测基准**。它有明确的 DAG 拓扑、有可验证的掌握证据、有 centrality 排序——用来测试你 Agent 的规划能力、拓扑推理能力，比自己造数据靠谱得多。
**③ 教师 / 家长 / 教研人员** — 不是开发者也能直接受益：`data/clusters.json` 里的 183 个领域摘要就是给家长读的；官方的 3D 交互图谱允许你点开任何一个知识点，看它"从哪来、往哪去"——这对回答"为什么我家孩子学分数总卡住"这类问题，有直接的诊断价值。
### 不太适合谁
- 想找**学科题目、题库、练习题**的人——这里没有题目，只有知识点和评估框架。
- 需要**中文课程标准对齐**的人——v1 主要对齐 CCSS/NGSS/UK NC，中国课标需自己补建 crosswalk（社区已有类似方向 PR 可参考）。
- 想找**完整课程内容**（视频、讲解）的人——这是"骨架"，不是"肉"。
---
## 五、竞品对比：它到底处在什么位置
| 项目 | 性质 | 覆盖 | 开源程度 | 适合谁 |
| --- | --- | --- | --- | --- |
| **Marble os-taxonomy** | 微知识点 DAG + 掌握证据 | 4–15 岁，英美课标 | ODbL 1.0 + CC BY-SA | 商业产品、AI Agent |
| **K12-KGraph** (arXiv 论文配套) | 课程对齐知识图谱 | 中国人教版教材 | 研究用途为主 | 学术研究、中文场景 |
| **Common Core / NGSS 官方标准** | 扁平的条款清单 | 单国课标 | 公开文档 | 政策研究、合规检查 |
| **Khan Academy 知识地图** | 商业产品内部图谱 | K–12 广泛 | 闭源 | 仅能作为其产品用户 |
| **Knowledge Graph in Education 类学术项目** | 本体 + 教学资源 | 局部、研究级 | 多为论文配套 | 研究者 |
**Marble 的独特竞争力有三个**：一是**工程化程度最高**——带 JSON Schema、checksums、validation script、明确的 license 分层；二是**"evidence + assessmentPrompt"这个组合**——它不只是告诉你"有这个知识点"，还告诉你"怎么判断一个孩子掌握了"，这是自适应学习真正需要的；三是**它是用 AI Agent 抽取 + 人工教研校准**的混合流程产物，规模化效率远高于纯手工，又比纯 AI 幻觉可信得多。
---
## 六、局限与风险：冷静看待这份"开源大礼包"
**① v1 的数据规模对"完整小学教育"仍是子集**。1,590 个微知识点听起来多，但对应到 K–6 全学段、8 个学科，**平均每个知识点承载的内容其实相当粗糙**。Science 占了 547 个但 Computing 只有 21 个——明显是偏科的，编程类内容可能只是占位。对 STEM 创业者来说 Science/Math 很够用，对做编程教育的可能要大幅补建。
**② 依赖关系的质量高度依赖教研判断**。Hard/soft 边的划分、`reason` 字段的撰写，本质是主观的教研结论。Marble 团队用 AI 辅助 + 人工审核，但**审核的深度和覆盖度外界无法验证**。你拿来就用时，某些 `reason` 可能在教育学上站不住脚——尤其涉及特定教学法流派（如建构主义 vs. 直接教学法）的争议地带。
**③ 主要对齐英美课标**。对中文市场的应用，需要自己建"CCSS ↔ 义务教育课程标准"的 crosswalk，这是一项不小的工作。社区已有类似方向的 PR（如澳大利亚课程 v9 对齐），但中文课标对齐目前还没有人做。
**④ Share-Alike 的长期影响需要谨慎评估**。ODbL 的 share-alike 条款虽然对商业产品友好（"生成作品"不强制开源），但**如果你基于此图谱做衍生数据库（比如扩充了知识点），衍生数据库就必须继续开源**。对以数据资产为核心竞争力的公司来说，这可能是一个战略负担——值得在用法设计阶段就想清楚。
**⑤ 维护方的长期承诺是隐性风险**。这是 Marble 公司的产品附属品，他们的商业节奏决定了这个仓库的资源投入。虽然 ODbL 保证已经发布的数据永久开放，但**v2、v3 何时出、是否继续投入、是否改变开放策略，都由公司说了算**。目前来看方向积极（社区 PR 也在推动国际化），但 forks 的衍生版本值得提前 bookmark。
**⑥ 学科不平衡 + 语言单一**。Life Skills、Learning to Learn、Computing 这几个对"全面发展"至关重要的板块内容非常稀薄；数据集本身是英文的，虽然结构通用，但 text 内容不能直接用于中文产品。
---
## 七、结语与行动建议
**这可能是 2026 年开源教育领域最值得关注的一个数据集发布。** 它的价值不在于"多"（1,590 个知识点其实不算惊人），而在于**"形态对"**——它是少数以"图 + 证据 + 可执行 prompt"三件套完整发布的课程数据，直接可以被 AI Agent 消费。
**给不同读者的建议路径：**
- **EdTech 创业者**：本周就该 fork 这份仓库，跑一遍 validate.mjs，再用 kylelynch 的 MCP Server 在 Claude 里接上试试——你会在 30 分钟内判断它对你的产品有没有用。
- **AI Agent 开发者**：把它当成测试你 Agent 拓扑推理、路径规划能力的免费基准数据集，比造合成数据划算得多。
- **教研/家长**：先去 withmarble.com/curriculum 逛一下 3D 图谱，**如果你从未见过"一个孩子的全部学习路径被渲染成可探索的 DAG"，这个体验本身就会重塑你对"课程结构"的想象**。
- **研究者**：这份数据 + ODbL 许可 = 可以发论文、可以复现、可以对比 K12-KGraph 等学术版本——跨文化对比研究的基础材料已经摆在桌上。
**一个时代性的观察**：过去十年，教育科技公司的核心资产是"内容 + 图谱"的组合；未来十年，随着内容被生成式 AI 大幅平价化，**图谱和教学法本身可能成为新的差异化战场**。Marble 选择把战场"公地化"，既是一种防御，也是一次主动定义标准的尝试——**谁在别人还在纠结"要不要做知识图谱"时就把图谱做成公共基础设施，谁就占据了生态位**。
而这个项目的真正看点，也许不在 v1 有多完整，而在于它能否激活一个足够大的生态，让后续的 v2、v3、中文版、印度版……都长在同一张图上。
