# Proposal

## Why

当前博客的首页（[src/pages/index.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/pages/index.astro)）与文章列表页 `/blog`（[src/pages/blog/index.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/pages/blog/index.astro)）均使用相同的 `ArticleCard` 展示文章与分类/标签入口，定位高度重合；同时首页 500px 横幅与 `recentPostsCount: 4` 的截断限制导致首屏信息密度偏低，访问者几乎只看首页、很少再点进 `/blog`。此外，站点已有 `/archive`、`/about` 位于根路径，而文章、分类、标签、系列却挂载在 `/blog/` 前缀下；借合并首页文章流之机一并去掉 `/blog` 前缀，可以一次性理顺全站信息架构与 URL 体系。

## What Changes

- **合并文章列表页到首页并支持静态分页**：首页直接承载完整文章流，默认每页展示 `10` 篇（通过 `siteConfig.home.postsPerPage` 配置）；文章超过单页上限时生成 `/page/2`、`/page/3` 等静态分页页面，移除原先首页底部的重复「分类 / 标签」区块以及「最新文章 / 查看全部 →」标题栏。
- **压低首屏横幅并优化分页首部**：首页 `/` 保留壁纸横幅并将高度从 `500px` 压缩至 `300px`，同步收紧横幅内头像、标题与描述的排布比例以露出分类栏与前几篇文章；第 2 页起（`/page/2`…）隐藏横幅，直接展示分页标题与文章流。
- **前置分类筛选条与标签入口**：将原 `/blog` 页顶部的分类胶囊筛选栏（`全部` + 各分类）与 `浏览全部标签 →` 入口移至首页及分页文章流上方，点击分类跳转独立分类页。
- **精简顶部导航栏**：移除「文章」一级入口，导航精简为 `首页 | 系列 ▾ | 归档 | 关于`，并在 `/` 与 `/page/*` 下保持「首页」高亮，在 `/series` 与 `/series/*` 下保持「系列」高亮。
- **BREAKING 移除 `/blog` 前缀并扁平化全站路由（不做旧路由兼容）**：删除 `src/pages/blog/` 目录（不保留 `/blog` 列表页，也不做 `/blog*` 重定向）；文章详情迁至 `/posts/[...slug]`，分类迁至 `/categories/[...category]`，标签迁至 `/tags` 与 `/tags/[...tag]`，系列迁至 `/series` 与 `/series/[series]`，同步更新全站组件链接、RSS 订阅链接与开发模式搜索数据。
- **保持内容源目录不变**：Astro Content Collection 源码目录 `src/content/blog/`、写作工作流（[AGENTS.md](file:///Users/zhaoguanghua/CODE/dongfang_blog/AGENTS.md)）及文章页的 GitHub 编辑源码链接保持不变。

## Capabilities

### New Capabilities

- `home-article-feed`: 首页文章流、压缩横幅、顶部与分页布局、分类筛选栏、每页 10 篇静态分页以及顶栏导航精简与高亮规则。
- `flat-blog-routes`: 无 `/blog` 前缀的扁平路由体系（`/posts/[...slug]`、`/categories/[...category]`、`/tags`、`/tags/[...tag]`、`/series`、`/series/[series]`）、删除 `/blog` 入口且不做兼容跳转、以及站内链接/RSS/搜索索引同步规则。

### Modified Capabilities

<!-- 当前已有 spec 仅 code-block-rendering，本次不涉及代码块排版需求变更。 -->

## Impact

- **配置与工具**：[src/config/site.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/config/site.ts)、[src/utils/series.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/utils/series.ts)、[src/utils/posts.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/utils/posts.ts)
- **组件与布局**：[src/components/banner/HeroBanner.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/banner/HeroBanner.astro)、[src/components/layout/SiteHeader.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/layout/SiteHeader.astro)、[src/components/article/ArticleCard.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/article/ArticleCard.astro)、[src/components/article/SeriesNav.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/article/SeriesNav.astro)、[src/components/search/VueSearch.vue](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/search/VueSearch.vue)、[src/layouts/PostLayout.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/layouts/PostLayout.astro)，以及新增分类筛选条组件与分页组件
- **页面与路由**：重写 [src/pages/index.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/pages/index.astro)，新增 `src/pages/page/[page].astro`，删除 `src/pages/blog/` 并迁移至 `src/pages/posts/`、`src/pages/categories/`、`src/pages/tags/`、`src/pages/series/`，更新 [src/pages/archive.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/pages/archive.astro)、[src/pages/rss.xml.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/pages/rss.xml.ts)
- **文档**：[LAYOUT.md](file:///Users/zhaoguanghua/CODE/dongfang_blog/LAYOUT.md)、[README.md](file:///Users/zhaoguanghua/CODE/dongfang_blog/README.md)
- **外部与兼容性影响**：因明确不做路由兼容，既有 `/blog*` 外链将返回 404；[Comments.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/article/Comments.astro) 采用 `data-mapping="pathname"` + `data-strict="1"`，旧文章路径下的 Giscus Discussion 不会自动迁移到 `/posts/...`；RSS 订阅器会将路径变更后的既有文章识别为新条目。
