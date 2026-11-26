# Design

## Context

See `proposal.md` for motivation and scope.

当前项目基于 Astro 4 + Tailwind CSS v4（CSS-first 配置，位于 `src/styles/global.css`）+ Vue 3，全站启用 Astro `<ViewTransitions />`。`src/styles/global.css` 已在 `@layer components` 中维护极简复用类（如 `.container-prose`）。`SiteHeader.astro` 中移动端汉堡菜单与「系列」子菜单此前通过内联一长串 Tailwind 工具类实现 CSS Grid 折叠动画，且移动端搜索面板与系列分割线分别位于 `VueSearch.vue` 和 `SiteHeader.astro`。

## Goals / Non-Goals

**Goals:**
- 在 `src/styles/global.css` 的 `@layer components` 中封装通用的 `.collapse-panel` 折叠过渡类，支持任意高度内容平滑展开/收起。
- 让 `SiteHeader.astro` 中的 `#mobile-menu` 复用 `.collapse-panel` 并平铺四项一级导航链接（点击「系列」直达 `/series`，移除移动端二级折叠子菜单）。
- 保证移动端汉堡菜单在滑动、外部点击、`Escape` 及 Astro View Transitions 切页后行为稳定且无事件泄漏。
- 收口移动端搜索浮层顶栏间距与描边。

**Non-Goals:**
- 不将「浮动弹层」（如桌面端系列下拉、`VueSearch` 面板）强行并入 `.collapse-panel`，两者动画机制（`translate/scale` vs `grid-template-rows`）不同，各自保持清晰职责。
- 不改变桌面端导航结构与交互逻辑（已由 `site-header-navigation` 既有规格覆盖）。

## Decisions

### 1. `.collapse-panel` 采用 CSS Grid `0fr ↔ 1fr` + `data-open="true"`

- **选择**：在 `src/styles/global.css` 的 `@layer components` 定义 `.collapse-panel` 及其直接子元素 `.collapse-panel > * { overflow: hidden; }`：
  - 默认态：`display: grid; grid-template-rows: 0fr; opacity: 0; visibility: hidden; pointer-events: none; transition: grid-template-rows 150ms ease-out, opacity 150ms ease-out, visibility 150ms ease-out;`
  - 展开态 `.collapse-panel[data-open="true"]`：`grid-template-rows: 1fr; opacity: 1; visibility: visible; pointer-events: auto;`
  - 降级：`@media (prefers-reduced-motion: reduce) { .collapse-panel { transition: none; } }`
- **理由**：
  - 相比 `max-height`，`grid-template-rows: 0fr ↔ 1fr` 无需猜测内容高度，内层再展开「系列」子菜单时外层高度自动跟随。
  - 放在 `@layer components` 中，Tailwind v4 的 `@layer utilities`（如 `duration-200`、`sm:hidden`、`transition-[grid-template-rows,opacity,visibility,border-color]`）自然具有更高层叠优先级，调用方按需覆写无障碍。
  - 用 `data-open="true"` 替代增删多组 Tailwind 类，JS 控制逻辑单一直观，后续任意 Astro / Vue 组件都可直接复用。
- **备选方案**：
  - 方案 B：继续在各组件中复制粘贴 10+ 个 Tailwind 类 → 可维护性差、容易遗漏 `motion-reduce` 或 `pointer-events-none`。
  - 方案 C：引入 JS 动画或第三方折叠库 → 对静态博客过重。

### 2. 移动端汉堡菜单自动收起使用模块级 `AbortController` 管理全局监听

- **选择**：在 `SiteHeader.astro` 的 `<script>` 模块作用域维护 `headerAbortController`，每次 `bindHeader()` 在 `astro:page-load` 重新绑定新 DOM 时先调用 `headerAbortController?.abort()`，再将 `document` 的 `click`/`keydown` 与 `window` 的 `scroll`（`passive: true`）绑定到新的 `signal`。
- **理由**：Astro View Transitions 切页会替换 `<header>` DOM，若直接重复注册 `window`/`document` 监听器会造成内存泄漏与旧 DOM 引用错乱；`AbortController` 一次 `abort()` 即可干净卸载全部旧监听。
- **滚动阈值**：打开菜单时记录 `openScrollY = window.scrollY`，仅当 `Math.abs(window.scrollY - openScrollY) > 10` 时自动收起，防止移动端轻触菜单项时的微幅抖动误关。

### 3. 移动端搜索浮层顶部留白与左右边距保持视觉对称

- **选择**：`VueSearch.vue` 中 `#search-panel` 使用 `top-16 mt-3 lg:top-full lg:mt-2 left-3 right-3` 并增加 `border border-gray-200/80 dark:border-gray-700/80`。
- **理由**：移动端浮层左右距屏幕边缘为 `12px`（`left-3 right-3`），顶部加 `mt-3`（`12px`）形成三边等距留白，彻底消除圆角浮层顶到矩形顶栏底边的视觉粘连；桌面端保持 `lg:mt-2`（`8px`）与系列下拉基线一致。

## Risks / Trade-offs

- **[`.collapse-panel` 直接子元素结构约束]** → 使用 `.collapse-panel` 时必须保证内容包裹在一个直接子容器内（内边距 `py-*` 写在更内层而非该直接子容器上），否则收起态会残留内边距高度。通过在 `global.css` 注释及 `ui-collapse-panel` 规格中明确约定规避。
- **[`#mobile-menu` 顶部分割线过渡]** → `.collapse-panel` 默认过渡属性不含 `border-color`，`#mobile-menu` 如需同步淡入顶部分割线，可在元素上通过 Tailwind 工具类追加 `transition-[grid-template-rows,opacity,visibility,border-color]` 覆写。
