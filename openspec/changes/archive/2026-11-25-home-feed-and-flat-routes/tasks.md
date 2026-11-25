# Tasks

## 1. 配置与路径/分页工具

- [x] 1.1 更新 [src/config/site.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/config/site.ts)：将 `home.recentPostsCount: 4` 替换为 `home.postsPerPage: 10`，将 `home.banner.height` 从 `'500px'` 改为 `'300px'`，从 `nav` 中移除 `{ title: '文章', href: '/blog' }` 并将「系列」`href` 改为 `'/series'`；通过 `npm run typecheck` 验证配置类型引用无误
- [x] 1.2 更新 [src/utils/series.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/utils/series.ts)：将 `getSeriesHref` 返回路径改为 `` `/series/${encodeURIComponent(series)}` ``，验证系列名称含中文/空格时编码与路由一致
- [x] 1.3 更新 [src/utils/posts.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/utils/posts.ts)：新增路径与分页辅助函数（`getPostHref`、`getCategoryHref`、`getTagHref`、`getHomePageHref` 及分页切片函数），确认 `getHomePageHref(1)` 返回 `'/'`、`getHomePageHref(n)`（`n >= 2`）返回 `` `/page/${n}` ``，且总页数计算正确

## 2. 扁平路由迁移与旧 `/blog` 清理

- [x] 2.1 将 `src/pages/blog/[...slug].astro` 迁移为 `src/pages/posts/[...slug].astro`，确认文章详情页构建后输出至 `dist/posts/<slug>/index.html`
- [x] 2.2 将 `src/pages/blog/categories/[...category].astro` 迁移为 `src/pages/categories/[...category].astro`，将顶部返回链接改为 `href="/"`（文案「← 返回首页」），确认各分类页正常输出至 `dist/categories/<category>/index.html`
- [x] 2.3 将 `src/pages/blog/tags/index.astro` 与 `src/pages/blog/tags/[...tag].astro` 迁移为 `src/pages/tags/index.astro` 与 `src/pages/tags/[...tag].astro`，将 `tags/index.astro` 返回链接改为 `href="/"`（文案「← 返回首页」）、标签链接改为 `/tags/${tag}`，将 `tags/[...tag].astro` 返回链接改为 `href="/tags"`
- [x] 2.4 将 `src/pages/blog/series/index.astro` 与 `src/pages/blog/series/[series].astro` 迁移为 `src/pages/series/index.astro` 与 `src/pages/series/[series].astro`，将 `[series].astro` 返回链接改为 `href="/series"`
- [x] 2.5 删除 `src/pages/blog/index.astro` 及整个 `src/pages/blog/` 目录，确认仓库与构建产物 `dist/` 中不再存在 `/blog` 或 `/blog/*` 页面且无重定向文件

## 3. 首页文章流、横幅与分页组件

- [x] 3.1 调整 [src/components/banner/HeroBanner.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/banner/HeroBanner.astro) 在 `300px` 高度下的头像、标题、副标题尺寸与垂直间距，验证桌面端与移动端均无裁切或文字贴边溢出
- [x] 3.2 新建 `src/components/article/CategoryBar.astro`，展示 `全部` 胶囊（链接 `/`）、所有已发布分类胶囊（链接 `/categories/<category>`）以及右侧 `浏览全部标签 →`（链接 `/tags`），验证列表胶囊与原 `/blog` 页筛选条视觉一致
- [x] 3.3 新建 `src/components/article/Pagination.astro`，实现 `totalPages <= 1` 时不渲染、第 1 页链接 `/`、第 `N` 页链接 `/page/N`、当前页标注 `aria-current="page"` 及首末页上一页/下一页禁用状态
- [x] 3.4 重写 [src/pages/index.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/pages/index.astro)：保留 `HeroBanner`，在文章列表上方渲染 `CategoryBar`，展示第 1 页（最多 `postsPerPage` 篇）`ArticleCard` 与 `Pagination`，移除「最新文章 / 查看全部 →」及底部重复的「分类 / 标签」区块
- [x] 3.5 新建 `src/pages/page/[page].astro`：`getStaticPaths()` 仅在 `totalPages >= 2` 时生成 `page = 2..totalPages`（不生成 `/page/1`），不渲染 `HeroBanner`，展示紧凑分页标题、`CategoryBar`、当前页 `ArticleCard` 列表与 `Pagination`

## 4. 全站组件、导航、RSS、搜索与文档同步

- [x] 4.1 更新 [src/components/layout/SiteHeader.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/layout/SiteHeader.astro)：当 `pathname === '/' || pathname.startsWith('/page/')` 时令 `activeHref` 为 `'/'` 并移除 `/blog/series` 特判；将桌面与移动端系列下拉菜单中的 `/blog/series` 全部更新为 `/series`，验证 `/page/2` 时「首页」高亮、`/series/*` 时「系列」及对应子项高亮
- [x] 4.2 更新站内文章与标签/分类/系列链接：[ArticleCard.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/article/ArticleCard.astro)、[SeriesNav.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/article/SeriesNav.astro)、[PostLayout.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/layouts/PostLayout.astro)（保持 L117 GitHub 编辑源码链接 `src/content/blog/${post.slug}.md` 不变）与 [archive.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/pages/archive.astro)，验证各入口跳转目标均为扁平新路径
- [x] 4.3 更新 [src/pages/rss.xml.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/pages/rss.xml.ts) 中条目 `link` 为 `/posts/${post.slug}/`，以及 [VueSearch.vue](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/search/VueSearch.vue) 中开发模式 `devPosts` 示例 URL 为 `/posts/2026/...`，验证开发与生产搜索均可直达 `/posts/...`
- [x] 4.4 更新 [LAYOUT.md](file:///Users/zhaoguanghua/CODE/dongfang_blog/LAYOUT.md) 与 [README.md](file:///Users/zhaoguanghua/CODE/dongfang_blog/README.md) 中的页面路由与目录结构说明（保持 `AGENTS.md` 与 `src/content/blog/` 说明不变），核对文档中已无过期 `/blog` 页面路径

## 5. 集成验证

- [x] 5.1 运行 `grep -rn "/blog" src/ LAYOUT.md README.md`，确认除 `PostLayout.astro` 中的 GitHub 源文件编辑路径 `src/content/blog/...` 及文章外链/注释外，已无站内 `/blog` 路由引用
- [x] 5.2 运行 `npm run typecheck && npm run build`，确认类型检查与生产构建通过，验证 `dist/blog/` 不存在、`dist/posts/`、`dist/categories/`、`dist/tags/`、`dist/series/` 正常生成，且 `dist/rss.xml` 与 `dist/sitemap-0.xml` 中的 URL 全部为新扁平路径
- [x] 5.3 临时将 `postsPerPage` 调小（如 `3`）执行构建与本地预览，验证 `/page/2`、`/page/3` 路由生成、第 2 页起无 Banner、分页器第 1 页返回 `/`、`/page/2` 顶栏「首页」高亮及 Pagefind 搜索跳转；验证完成后恢复 `postsPerPage: 10` 并重新执行 `npm run build` 确认当前 7 篇下不生成 `dist/page/`
- [x] 5.4 在浏览器检查浅色/深色主题及桌面/移动端视口：确认首页首屏（300px 横幅 + 分类筛选条 + 文章卡片）视觉比例协调、`/blog` 返回 404 终端页、各分类/标签/系列/归档/文章详情页访问正常

## Workflow follow-up

- 评审并实施完成后使用 `openspec-archive-change` 归档本次变更。
