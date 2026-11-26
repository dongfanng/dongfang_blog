# Proposal

## Why

移动端顶部导航与搜索交互存在四处体验与可维护性问题：移动端汉堡菜单内为「系列」嵌套二级折叠列表增加了点击层级与竖线/分割线视觉干扰、移动端圆角搜索浮层紧贴矩形顶栏底边缺少呼吸感、汉堡菜单在用户滑动或点击页面内容时不会自动收起，以及折叠面板过渡类名冗长不便复用。精简移动端汉堡菜单为平铺直达链接、收口移动端视觉与自动关闭体验，并将流式折叠过渡抽离为统一组件类，可同时提升移动端精致度与后续开发效率。

## What Changes

- **移动端「系列」简化为直达链接**：移除 `SiteHeader.astro` 中移动端汉堡菜单内的「系列」二级折叠子菜单（含展开箭头、竖线与分割线），改为与其他导航项一致的平铺链接，点击「系列」直接跳转 `/series` 并收起抽屉菜单。
- **移动端搜索浮层顶栏间距与描边**：为 `VueSearch.vue` 中移动端搜索面板增加顶部间距（`mt-3`，与左右 `left-3 right-3` 对称）及柔和描边，避免圆角卡片紧贴矩形顶栏底边。
- **移动端汉堡菜单自动收起**：在 `SiteHeader.astro` 中增加点击外部区域、页面滑动（位移超过 `10px`）及按 `Escape` 自动收起汉堡菜单的逻辑，并通过 `AbortController` 兼容 Astro View Transitions，避免事件监听泄漏。
- **统一可复用折叠面板类 `.collapse-panel`**：在 `src/styles/global.css` 的 `@layer components` 中定义 `.collapse-panel` 通用折叠过渡类（基于 CSS Grid `0fr ↔ 1fr` + `opacity` + `visibility` + `data-open="true"` + `motion-reduce`），在 `SiteHeader.astro` 的汉堡菜单中复用，同时保持无障碍属性（`aria-hidden`、`inert`）同步。

## Capabilities

### New Capabilities
- `ui-collapse-panel`: 定义全站通用的流式折叠面板样式类 `.collapse-panel` 的结构约定、展开/收起动效、减少动效降级与无障碍状态配合规范，供导航抽屉、目录折叠、归档分组等组件统一复用。

### Modified Capabilities
- `site-header-navigation`: 移除移动端「系列」二级折叠子菜单改为直达 `/series`，补充移动端汉堡菜单的轻快折叠过渡与自动收起规则（点击外部、滑动浏览、`Escape`），以及移动端搜索面板与顶栏之间的间距规范。

## Impact

- 样式基础层：`src/styles/global.css`（`@layer components` 新增 `.collapse-panel`）。
- 顶部导航组件：`src/components/layout/SiteHeader.astro`（模板结构与 `<script>` 交互逻辑）。
- 搜索组件：`src/components/search/VueSearch.vue`（移动端搜索浮层定位与描边）。
- 无破坏性变更，不引入额外第三方依赖。
