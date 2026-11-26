# Tasks

## 1. 桌面端导航与下拉面板调整

- [x] 1.1 在 [src/components/layout/SiteHeader.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/layout/SiteHeader.astro) 中，为 `<nav>`、桌面端 `siteConfig.nav` 分组容器（`hidden sm:flex h-full items-center gap-5 mr-2`）及系列包裹层（`group relative flex h-full items-center`）撑满顶栏高度，将 `desktopLinkClass` 的 `hidden sm:inline-flex` 简化为 `inline-flex`，并同步在 [src/components/search/VueSearch.vue](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/search/VueSearch.vue) 根容器补充 `h-full` 统一桌面浮层垂直基线
- [x] 1.2 移除桌面端「系列」`<a>` 上的 `gap-1` 及其内部的 `<Icon name="chevron-down" ... />`，保留 `href={item.href}`、`aria-current` 及激活态下划线样式（`desktopActiveClass`），并移除桌面端下拉框内重复的「全部系列」入口与分割线（`seriesList.length > 0` 时渲染）
- [x] 1.3 将桌面端系列下拉外层容器调整为 `left-0 top-full z-50 w-56 pt-2` 对齐「系列」左边缘，内层卡片补充 `-translate-y-1 transition-transform duration-150 group-hover:translate-y-0 group-focus-within:translate-y-0 motion-reduce:transition-none`，确认外层悬停桥保持静止
- [x] 1.4 核对移动端抽屉菜单（`#mobile-series-toggle`、`#mobile-series-chevron` 与「全部系列」子项）、[src/components/ui/icon-paths.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/ui/icon-paths.ts) 中 `chevron-down` 与 [src/config/site.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/config/site.ts) 未被修改（`git diff` 中不含上述文件与移动端代码块变更）

## 2. 构建与多视口验证

- [x] 2.1 运行 `npm run typecheck` 和 `npm run build`，确认 Astro 类型检查、静态构建与 Pagefind 索引构建全部通过
- [ ] 2.2 在桌面端（`sm` ~ `640px` 与 `lg` ~ `1280px`）检查 `/`、`/series`、`/series/<name>` 顶栏：确认四项导航纯文字对称呈现、无箭头、导航组与右侧工具区间距清晰、激活态下划线等宽，且 `lg` 聚焦搜索框展开至 `w-60` 时保持单行无溢出
- [ ] 2.3 验证桌面端指针悬停与键盘 Tab 聚焦「系列」：确认下拉面板以淡入+位移展开、指针移入面板不闪烁消失、点击「系列」直达 `/series`，浅色/深色主题视觉均正常
- [ ] 2.4 在移动端视口（`< 640px`）打开汉堡菜单，确认「系列」行仍带右侧箭头、点击可展开/收起并旋转 180°、点击子项可跳转并关闭菜单

## Workflow follow-up

- 实施与验证完成后，可使用 `openspec-archive-change` 归档本次变更。
