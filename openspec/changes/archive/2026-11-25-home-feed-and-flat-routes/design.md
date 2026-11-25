# Design

## Context

变更动机与目标详见 [proposal.md](file:///Users/zhaoguanghua/CODE/dongfang_blog/openspec/changes/home-feed-and-flat-routes/proposal.md)。当前站点基于 Astro 4.15 静态构建（见 [astro.config.mjs](file:///Users/zhaoguanghua/CODE/dongfang_blog/astro.config.mjs) 与 [LAYOUT.md](file:///Users/zhaoguanghua/CODE/dongfang_blog/LAYOUT.md)）：

- 首页 [src/pages/index.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/pages/index.astro) 使用 `500px` 高度的 [HeroBanner.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/banner/HeroBanner.astro)，按 `siteConfig.home.recentPostsCount`（`4`）截取文章并在页面底部单独渲染「分类 / 标签」列表；同时存在功能几乎完全重合的 `/blog`（[src/pages/blog/index.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/pages/blog/index.astro)）。
- 顶栏 [SiteHeader.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/layout/SiteHeader.astro) 使用 `inSection('/blog/series')` 特判系列高亮，并与 [siteConfig.nav](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/config/site.ts#L41-L47) 及桌面/移动端下拉菜单绑定。
- 内容路由目前全部分散在 `src/pages/blog/` 下（文章 `[...slug]`、分类、标签、系列），全站卡片、归档、系列导航、RSS（[src/pages/rss.xml.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/pages/rss.xml.ts)）以及开发模式搜索示例（[VueSearch.vue](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/search/VueSearch.vue#L132-L145)）均硬编码了 `/blog/...`；生产构建的 Pagefind 索引与 `@astrojs/sitemap` 由 `dist/` 静态产物自动生成。
- 评论组件 [Comments.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/article/Comments.astro#L61-L62) 使用 Giscus `data-mapping="pathname"` + `data-strict="1"`；内容集合源码位于 `src/content/blog/`，写作规范见 [AGENTS.md](file:///Users/zhaoguanghua/CODE/dongfang_blog/AGENTS.md)。

## Goals / Non-Goals

**Goals:**

- 将首页合并为站内唯一主文章流入口，提供每页 10 篇的静态分页（`/` 与 `/page/[page]`）。
- 将首页首屏横幅高度压缩至 `300px` 并收紧内部排布，使首屏可直接露出分类筛选条与前几篇文章；分页第 2 页起隐藏横幅。
- 抽取分类筛选条与分页组件，消除首页与分类/标签/分页之间重复的模板与硬编码路径。
- 完成无 `/blog` 前缀的扁平路由迁移（`/posts/...`、`/categories/...`、`/tags/...`、`/series/...`），彻底移除 `src/pages/blog/` 并同步全站链接、RSS、搜索与项目文档。

**Non-Goals:**

- 不保留 `/blog` 或任何 `/blog/*` 旧路径的重定向（HTTP 301/302、Cloudflare `_redirects` 或 HTML meta refresh）。
- 不调整 `src/content/blog/` 源码目录名称、Astro Content Collection 名称（`blog`）、`write_blog` 脚本流程及 [PostLayout.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/layouts/PostLayout.astro#L117) 中的 GitHub 编辑文件链接。
- 不在首页实现客户端动态分类过滤（保持点击分类跳转独立静态分类页的简单模型与可分享 URL）。
- 不改造 [Comments.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/article/Comments.astro) 的 Giscus 映射策略。

## Decisions

### 1. 首页与分页拆分为 `index.astro` + `page/[page].astro`（手动切片，仅生成第 2 页起）

- **方案**：在 [src/utils/posts.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/utils/posts.ts) 中提供分页切片辅助函数与 `getHomePageHref(page)`（`page <= 1` 返回 `'/'`，否则返回 `'/page/' + page`）。[src/pages/index.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/pages/index.astro) 渲染第 1 页（包含 `HeroBanner`）；新建 `src/pages/page/[page].astro`，当总页数 `<= 1` 时 `getStaticPaths()` 返回 `[]`，当总页数 `>= 2` 时仅生成 `page = 2..totalPages`。
- **理由**：Astro 内置 `paginate()` 配合 `[...page].astro` 会生成 `/page/1`（或将首页与分页逻辑强耦合进同一个可选参数路由，使第 1 页是否展示 `HeroBanner` 只能靠条件分支混在同一个文件里）。拆为 `index.astro` + `page/[page].astro` 后，`/` 是第 1 页唯一规范 URL，第 2 页起没有额外路径污染，也不生成无意义的 `/page/1`。
- **备选**：使用客户端分页 / 「加载更多」——被否决，不利于静态预取、Pagefind 与直链分享。

### 2. 集中维护扁平路径辅助函数，替代分散的模板字符串

- **方案**：在 [src/utils/series.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/utils/series.ts) 将 `getSeriesHref` 更新为 `` `/series/${encodeURIComponent(series)}` ``；同时在 [src/utils/posts.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/utils/posts.ts) 增加 `getPostHref(slug)`、``getCategoryHref(category)``、``getTagHref(tag)``、``getHomePageHref(page)`` 并统一由组件与页面调用。
- **理由**：目前 `/blog/` 前缀散落在 10 余个 `.astro`/`.ts` 文件中；集中到纯函数后，全站链接（`ArticleCard`、`PostLayout`、`SeriesNav`、`archive`、`CategoryBar`、`Pagination`）只需引用一处，后续维护成本更低。需要注意：客户端组件或服务端共用逻辑应避免把 `astro:content` 拉入客户端 bundle（`series.ts` 保持独立，其他路径 helper 若仅用于 `.astro` / `.ts` 可放在 `posts.ts`）。

### 3. `HeroBanner` 压缩至 `300px` 且同步调整内部排版比例

- **方案**：将 [siteConfig.home.banner.height](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/config/site.ts#L36) 从 `'500px'` 改为 `'300px'`，同时调整 [HeroBanner.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/banner/HeroBanner.astro#L38-L50) 内部元素尺寸（例如头像由 `w-24 h-24 mb-6` 收紧为 `w-16 h-16 md:w-20 md:h-20 mb-3`，标题由 `text-4xl md:text-5xl mb-4` 收紧为 `text-3xl md:text-4xl mb-2`，描述收紧为 `text-base md:text-lg`）。
- **理由**：原有内容尺寸按 500px 高度居中设计，仅改容器高度会导致移动端或长副标题在 300px 容器内上下显得局促甚至贴边；同步微调排版可保持视觉呼吸感，并确保 1080p/768p 常见桌面首屏下能同时看到横幅、分类筛选条与前 1–2 篇文章卡片。

### 4. 配置字段与公共 UI 组件抽取

- **配置**：将 [siteConfig.home](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/config/site.ts#L24-L26) 中的 `recentPostsCount: 4` 替换为 `postsPerPage: 10`，使配置命名准确反映分页语义。
- **分类筛选条组件**：新建 `src/components/article/CategoryBar.astro`，包含 `全部`（链接 `/`）、所有分类胶囊（链接 `/categories/<category>`）以及右侧 `浏览全部标签 →`（链接 `/tags`），供首页与 `/page/[page]` 共用（延续原 `/blog` 页顶部筛选条的视觉样式，不新增复杂下拉）。
- **分页组件**：新建 `src/components/article/Pagination.astro`，接收 `currentPage` 与 `totalPages`，`totalPages <= 1` 时直接不输出 DOM；`currentPage === 1` 的页码指向 `/`，其余指向 `/page/${p}`，并处理上一页/下一页边界禁用状态及 `aria-current="page"`。

### 5. `SiteHeader.astro` 精简与激活态匹配规则

- **方案**：[siteConfig.nav](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/config/site.ts#L41-L47) 调整为 `首页 (/)`、`系列 (/series, dropdown: 'series')`、`归档 (/archive)`、`关于 (/about)`。在 [SiteHeader.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/layout/SiteHeader.astro#L13-L17) 中：
  - 将 `activeHref` 判定更新为：当 `pathname === '/' || pathname.startsWith('/page/')` 时返回 `'/'`；否则匹配 `siteConfig.nav.find((item) => inSection(item.href))?.href`。
  - 桌面与移动端系列下拉菜单中的 `/blog/series` 全部更新为 `/series`。
- **理由**：移除 `/blog/series` 特判后，`/series` 与 `/series/*` 可直接通过 `inSection('/series')` 自然命中；`/posts/*`、`/categories/*`、`/tags/*` 不额外点亮顶栏项，保持「首页」高亮语义仅表示处于主文章流（`/` 与 `/page/*`）。

### 6. 彻底去掉 `/blog` 前缀（路由层迁移、内容源保持 `blog`）

- **方案**：删除 `src/pages/blog/`，将路由文件迁移至：
  - `src/pages/posts/[...slug].astro`
  - `src/pages/categories/[...category].astro`（返回链接改为 `href="/"` / `← 返回首页`）
  - `src/pages/tags/index.astro`（返回链接改为 `href="/"` / `← 返回首页`）与 `src/pages/tags/[...tag].astro`（返回链接改为 `href="/tags"`）
  - `src/pages/series/index.astro` 与 `src/pages/series/[series].astro`（返回链接改为 `href="/series"`）
- **保留不变**：`src/content/blog/`、Collection 名称 `blog`、[PostLayout.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/layouts/PostLayout.astro#L117) 的 GitHub 编辑链接（`${siteConfig.social.github}/edit/main/src/content/blog/${post.slug}.md`）、以及 [AGENTS.md](file:///Users/zhaoguanghua/CODE/dongfang_blog/AGENTS.md)。

## Risks / Trade-offs

- **[Giscus 评论与旧 URL 脱钩]** [Comments.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/article/Comments.astro#L61-L62) 使用 `data-mapping="pathname"` + `data-strict="1"`，旧 `/blog/2026/...` 下的 GitHub Discussion 不会自动关联到 `/posts/2026/...` → 用户明确确认不需要路由兼容，接受该取舍；当前站点处于早期阶段，影响可控。
- **[RSS 订阅旧文重推]** [src/pages/rss.xml.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/pages/rss.xml.ts#L18) 输出的文章 `link` 变为 `/posts/.../`，已有 RSS 阅读器会把存量 7 篇文章视作新条目 → 属于无兼容迁移的预期副作用，发布后稳定。
- **[旧书签与外部链接 404]** 移除 `/blog` 与旧路径且不做重定向后，直接访问 `/blog*` 会进入 404 终端页 → 符合用户「不需要路由兼容」的明确要求。
- **[当前文章数不足 10 篇导致默认构建无法产出 `/page/2`]** 目前仓库仅 7 篇已发布文章，默认 `postsPerPage: 10` 时 `dist/page/` 不会生成 → 验证阶段需临时使用较小阈值（如 `3`）跑一次构建与预览来实测分页路由和第 2 页无 Banner 表现，随后恢复 `10` 并重新构建。

## Migration Plan

1. 按 `tasks.md` 完成配置、工具函数、组件与页面路由迁移，删除 `src/pages/blog/` 并更新 `LAYOUT.md` 与 `README.md`。
2. 执行静态检查与构建（`npm run typecheck && npm run build`），Pagefind 搜索索引（`dist/search-index`）与 `dist/sitemap-0.xml` 会在构建阶段自动按新 URL 重新生成，无需额外手工迁移脚本。
3. 验证多页分页路径后恢复 `postsPerPage: 10` 重新构建，再部署发布。
