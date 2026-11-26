# Proposal

## Why

站点顶栏四项导航（「首页 / 系列 / 归档 / 关于」）原本为工整的两字中文，当前 [SiteHeader.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/layout/SiteHeader.astro#L43-L54) 仅在桌面端「系列」右侧放置了 `14px` 的 `chevron-down` 图标。该图标在 `24×24` 画布内左右各有 25% 透明留白，叠加 `gap-1` 与外层 `<nav>` 的 `gap-3`（12px），造成「系列」与「归档」之间的视觉间距明显大于其他相邻菜单，箭头权重偏强且显得悬空；进入 `/series` 或 `/series/*` 时 `border-b-2` 激活态下划线还会连同箭头一并加长，破坏对称感。鉴于点击「系列」即可直接访问 `/series` 总览页，桌面端下拉面板属于快捷预览，采用方案 A 去掉桌面端箭头，并顺手优化文字导航分组间距与下拉面板展开动效。

## What Changes

- 移除桌面端「系列」链接内的 `<Icon name="chevron-down" />` 与 `gap-1`，四项导航恢复纯文字两字对称结构，激活态下划线仅覆盖「系列」文字。
- 保留桌面端 `group-hover` / `group-focus-within` 下拉面板及点击跳转 `/series`，并移除桌面端下拉面板内重复的「全部系列」入口及分割线（无系列时不渲染空下拉框）；移动端抽屉菜单（`#mobile-series-toggle` / `#mobile-series-chevron` 及「全部系列」子项）和 [icon-paths.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/ui/icon-paths.ts#L14) 中的 `chevron-down` 图标定义保持不变。
- 将桌面端 4 个文字导航项独立包裹为一组（`hidden sm:flex h-full items-center gap-5 mr-2`），拉开文字导航项内部间距及与右侧搜索框、主题切换按钮的视觉区隔。
- 统一顶栏浮层基线与展开动效：为导航容器、桌面系列下拉包裹层及 [VueSearch.vue](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/search/VueSearch.vue#L2) 根容器补充 `h-full` 使其紧贴顶栏底边之下 `8px` 展开，桌面端系列下拉面板左对齐「系列」（`left-0 w-56`）并为内层卡片补充轻微垂直位移过渡（`-translate-y-1` → `translate-y-0`）。

## Capabilities

### New Capabilities

- `site-header-navigation`: 站点顶部导航栏桌面端与移动端的视觉呈现、导航项分组间距、系列快捷下拉面板交互及激活态高亮规则。

### Modified Capabilities

<!-- openspec/specs/ 当前仅含 code-block-rendering；待归档变更 home-feed-and-flat-routes 中的 home-article-feed 仅要求保留系列下拉菜单与激活态高亮，未要求桌面端箭头图标，无规范冲突。 -->

## Impact

- 修改 [src/components/layout/SiteHeader.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/layout/SiteHeader.astro) 与 [src/components/search/VueSearch.vue](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/search/VueSearch.vue)（仅根容器高度对齐）。
- [src/components/ui/icon-paths.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/ui/icon-paths.ts) 与 [src/config/site.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/config/site.ts) 无需修改。
- 无路由、API、依赖或数据结构变更。
