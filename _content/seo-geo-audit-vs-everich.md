# SEO / GEO 审查报告 — www.stwadd.com 对比 everich.com

> 审查日期：2026-10-27
> 对标站：https://everich.com（Everich and Tomic Housewares Co., Ltd.，宁波）
> 方法：curl 实抓两站首页 + robots.txt + llms.txt + sitemap 全部分片，逐项解析 DOM / meta / JSON-LD

---

## 一、总览对比

| 指标 | everich.com | stwadd.com（审查前） | stwadd.com（审查后） |
|---|---|---|---|
| 收录 URL 数 | 654（59 页 + 103 文 + 480 产品 + 11 分类 + 1 local） | **4596** | 4596 |
| 首页响应 | 4.52 s（WordPress） | **1.06 s** | 1.0 s |
| 首页体积 | 302 KB | 90 KB | 92 KB |
| title 长度 | 54 字符 ✓ | 82 字符 ✗（会被截断） | **58 字符 ✓** |
| description 长度 | 154 字符 ✓ | 229 字符 ✗（会被截断） | **157 字符 ✓** |
| canonical | ✓ | **✗ 首页完全没有** | ✓ 全站 1275 页 |
| og:site_name | ✓ | ✗ | ✓ |
| og:locale | ✓ | ✗ | ✓ |
| twitter:card | ✓ | ✗（0/600） | ✓ 全站 |
| og:image | 部分 | 250/600 | ✓ 全站 + 新做 1200×630 社交卡 |
| **JSON-LD 结构化数据** | **0 块** ❌ | 4 块 ✓ | 4 块 ✓ |
| llms.txt | 74 KB（纯索引型） | 31 KB（纯知识库型） | **84 KB（两者叠加）** |
| robots AI 爬虫 | 封 BLEXBot / SeekportBot / PetalBot | **21 个全放行** | 保持 |
| sitemap | sitemap_index.xml + 6 分片 | 单文件 4596 条 | 保持 |

---

## 二、everich 比我们强的地方（已抄）

### 1. 社交标签完整
everich 的 og:site_name / og:locale / twitter:card / twitter:title 全齐，我们原本只有 og:title / og:description / og:url。

**已做**：全站 1275 页批量补齐 `og:site_name`、`og:locale`、`twitter:card`；缺 og:image 的 796 页指向新做的默认社交卡。

### 2. 标题/描述长度克制
**已做**：首页 title 82 → **58 字符**，description 229 → **157 字符**（Google 展示上限约 160）。并把 og:title 从 "Custom Water Bottle Manufacturer"（自有工厂暗示 + 与正文口径不符）改为 **"Your Factory In Yongkang, China | STWADD Drinkware"**。

### 3. llms.txt 的"索引型"打法
everich 的 llms.txt 是纯索引：每个页面一条「URL + 一句话摘要」，AI 抓取时不用解析正文就知道每页讲什么。

**已做**：保留我们原有的**知识库型**内容（事实、口径、禁令、证书报告号），**新增 `## Page Index` 段**：
- 17 个核心页（目录 / 各分类 hub / OEM-ODM / 买办 / 证书 / 信任中心 / Press / 媒体包 / 展会 / 指南），每条一句话说明
- 234 篇买家指南文章，全部带标题列出
- 末尾指向 sitemap.xml 全量

llms.txt：31 KB → **84 KB**，已超过 everich 的 74 KB。

---

## 三、我们比 everich 强的地方（everich 的硬伤）

### 1. everich 完全没有结构化数据（0 块 JSON-LD）
我们每页 4 块：Organization / FAQPage（12 问）/ ItemList + Product / VideoObject。**AI 可以结构化引用我们的 MOQ、交期、模具费、证书报告号**，everich 只能靠读正文。

### 2. everich 的 llms.txt 是空壳
170 行、纯 URL 列表，**没有任何事实、没有"怎么描述我们"、没有口径禁令**。AI 读完不知道"圣瓦达 MOQ 多少、交期多久"。我们的 llms.txt 有完整 Key facts + 5 类三级分类法 + 禁令清单 + 5 份可下载报告号。

### 3. everich 封了部分爬虫
robots.txt 里封 BLEXBot / SeekportBot / PetalBot / Ahrefs / Semrush（防竞品抓取），我们**只封爬取工具、不封 AI**，21 个 AI 爬虫全部放行并带 `Sitemap:` 声明——这是明确的 GEO 策略选择。

### 4. everich 是 WordPress，4.5 秒
我们静态站 1.06 秒。**页面速度是排名的直接因素**，我们天然赢。

---

## 四、审查中发现并修复的合规问题（比 everich 更严格）

| 问题 | 规模 | 处理 |
|---|---|---|
| **logo 图里印着 "Unbelievable Price, Backed By 20 Years of Quality and Service"** | 1 个 logo 文件，挂在每页页头 + 283 处 JSON-LD logo 字段 | 裁出干净 wordmark → `images/stwadd-logo.png`（600×156），全站替换；旧文件保留备份 |
| **产品页 tagline "SINCE 2002"**（与 Established 2017 矛盾） | 25 个产品页 | 统一改 SINCE 2017 |
| **"our factory has invested in multiple automated lines operated by robots"** | 首页 why 区块 | 改为"Our production partners in Yongkang run automated lines…" |
| **og:title / og:description 含 "Manufacturer" / "Leading manufacturer"** | 首页 | 改为 "Your Factory In Yongkang" 口径 |
| **VideoObject 名称 "Custom Drinkware Manufacturer"** | 首页 | 改为 "Your Drinkware Supplier in Yongkang" |
| **JSON-LD certification 数组把 FDA 当认证** | 首页 | 改为 "US FDA 21 CFR food-contact tested" |
| **"certified by SGS, TUV, FDA, LFGB"** | 首页 FAQ ×2 | 改为 "tested by SGS and TUV to US FDA 21 CFR and EU LFGB" |
| **"SGS Certified" / "TUV Verified" 徽章** | 首页 | 改为 "SGS Tested" / "TUV Tested" |
| **裸 `&` 未转义**（HTML 规范） | 首页 description | 修正为 `&amp;` |
| **index-new.html 废页**（0 引用、标题含 Manufacturer、不在 sitemap） | 1 个文件 | 删除 |

---

## 五、另外接上了一直被浪费的资产：5 份真实检测报告

Codex 建的 `certifications.html` + 5 份 PDF 是**真证书**（已逐份渲染 PDF 首页核验）：

| 报告 | 出具方 | 持有人 | 关键内容 |
|---|---|---|---|
| NBHL2409019138CW（11 页，2024-09-14） | **SGS 宁波** | 申请方 + **Manufacturer 栏都是 YONGKANG STWADD HOUSEWARE CO., LTD** | 不锈钢盖杯，EN 1186，法国买家 POLECAPITOU NORD |
| STSGZ2305233038E（6 页，2023-06-15） | STSGZ 深圳 | YONGKANG STWADD HOUSEWARE CO.,LTD | 塑料水杯 PWB01，FDA 21 CFR 全项 PASS |
| STSGZ2307103097E | STSGZ 深圳 | STWADD | 塑料瓶+吸管嘴，FDA 177.1640 |
| MTZS24034047（2024-03-20） | MOST | Yongkang stwadd houseware co.,Ltd | 智能保温杯 STW-001~008，EMC 2014/30/EU，CE |
| MTEB24030184 | MOST | STWADD | 智能保温杯 EMC 测试报告 |

**问题**：这页原本是「孤儿」——不在 sitemap、0 个内链、0 个产品页挂链接、llms.txt 没提。等于真证书白放。

**已做**：
- `sitemap.xml` 收录 certifications.html（priority 0.9），URL 总数 4593 → **4596**
- 内链：index.html（新增"Original Test Reports Published"卡片）、reviews.html（新增 3b 节，三张卡直链 PDF）、oem-odm.html
- 产品页挂证书：智能保温杯页挂 EMC 证书+报告；塑料瓶/运动杯/不锈钢瓶三个分类页各挂对应报告
- `llms.txt` 新增 `## Downloadable Test Reports & Certificates (HIGHEST-CREDIBILITY EVIDENCE)` 段，列出 5 个报告号 + 申请方 + 页数 + PDF 路径，并写明"不要写 FDA certified"的禁令
- `media-kit.html` 新增 "Certificates & test reports (attach to your article)" 段 → 媒体可直接引用附件
- `certifications.html` 页脚 "Certifications listed are held by the factory" → 改为 "Every certificate above is issued to Yongkang STWADD Houseware Co., Ltd. - on the SGS report the Manufacturer field is STWADD itself."

**GEO 价值**：AI 引用时能给出**报告号 + 出具方 + 申请方**——这是它无法编造的东西。SGS 报告上 Manufacturer 栏写着 STWADD 本身，比任何文案都硬。

---

## 六、还剩什么（下一步可做）

1. **文章层数量差距**：everich 103 篇文章专攻"买家会搜的长尾问题"（关税、选址、贴牌案例、市场预测），我们 234 篇里很多是通用知识题。**建议把选题从"科普型"改成"买家提问型"**（如 "How to Avoid 25% US Tariff on Steel Bottles"）。
2. **everich 的海外产能叙事**：它在柬埔寨和泰国开了厂，用"海外工厂规避关税"做差异化。我们没有对等资产，但可以用"中国 + 12 品类买办 + 拼柜"做差异化叙事。
3. **Product schema 的 Offers**：全站产品页 `price: "0.00"`（占位）。Google 偶尔会显示 $0.00，建议改成不带 Offer 的 Product，或用 `priceSpecification` 不给具体值。**这需要一次全站改 192 个产品页**，本轮未做。
4. ** everich 的 title 全是同质化的 "Wholesale X Manufacturer In China"**——这类标题短期有效、长期被算法降权。我们没跟，这是对的。

---

## 七、一句话结论

**everich 是"内容量 + 索引覆盖"型打法，我们是"结构化 + 事实准确 + 口径干净"型打法。** 短期它靠 654 页 + 103 篇长尾文章吃长尾词；长期决定 AI 引不引用你的，是你能不能给出**可核查的原始证据**（我们刚把 5 份真报告接进全站）**和一致的事实口径**（MOQ、交期、模具费、认证全站统一）。这一轮把差距从"它有我们没有的 llms.txt 索引"拉平到"我们两者都有"，同时补上了它完全没有的结构化数据。
