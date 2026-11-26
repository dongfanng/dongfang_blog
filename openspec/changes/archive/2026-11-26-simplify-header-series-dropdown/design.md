# Design

## Context

当前 [SiteHeader.astro](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/layout/SiteHeader.astro#L19-L164) 的桌面端与移动端布局受以下现有实现约束（动机详见 [proposal.md](file:///Users/zhaoguanghua/CODE/dongfang_blog/openspec/changes/simplify-header-series-dropdown/proposal.md)）：

- **现有结构**：`<nav class="flex items-center gap-3">` 将桌面端 4 个导航项（`siteConfig.nav`）、[VueSearch.vue](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/search/VueSearch.vue) 搜索区、主题切换按钮 `#theme-toggle` 以及移动端汉堡按钮 `#mobile-menu-toggle` 扁平地放在同一个 `gap-3`（`12px`）Flex 容器中；其中桌面端「系列」项由 `<div class="group relative hidden sm:block">` 包裹，链接内包含 `<Icon name="chevron-down" />`。
- **视口宽度与搜索框约束**：顶栏容器 `.container-prose` 最大宽度为 `max-w-4xl`（`896px`），含左右内边距后可用内容宽度在 `sm`（`640px` 视口）下为 `592px`（`px-6`）、在 `lg`（`1024px` 视口）下为 `832px`（`px-8`）。[VueSearch.vue](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/search/VueSearch.vue#L4-L34) 在 `sm`–`md` 视口渲染 `44px` 图标按钮，在 `lg+` 视口渲染输入框并在聚焦展开时从 `w-40`（`160px`）变为 `w-60`（`240px`）。
- **无 JS 桌面下拉**：桌面端下拉面板完全通过 CSS `group-hover` 与 `group-focus-within` 控制，外层下拉容器通过 `pt-2` 形成链接与浮层卡片之间的鼠标悬停过渡桥。

## Goals / Non-Goals

**Goals:**

- 消除桌面端「系列」右侧箭头造成的间隔失衡与激活态下划线拉长问题，使四项两字导航保持绝对对称。
- 将桌面端 4 个文字导航项独立成组，增大项间距并拉大与右侧工具区（搜索 + 主题切换）的视觉区隔，同时确保全视口不折行溢出。
- 为桌面端系列下拉面板增加平滑的轻微位移展开动效，与搜索面板展开手感一致且不破坏悬停桥稳定性。

**Non-Goals:**

- 不改动移动端抽屉菜单（`#mobile-series-toggle`、`#mobile-series-chevron` 及相关交互脚本）。
- 不修改 [src/config/site.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/config/site.ts) 导航数据结构或 [src/components/ui/icon-paths.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/ui/icon-paths.ts) 图标定义（`chevron-down` 仍被移动端菜单使用）。
- 不为桌面端下拉引入客户端 JavaScript 状态控制。
- 不给文字导航项添加胶囊 hover 背景（保持现有极简纯文字 + 底部指示线风格）。

## Decisions

**1. 桌面端移除 `chevron-down` 图标与弹窗内冗余「全部系列」（采用方案 A）**

- 方案：从桌面端「系列」`<a>` 中删除 `<Icon name="chevron-down" />` 与 `gap-1`，保留 `{item.title}` 文本、点击跳转 `/series` 行为与悬停/聚焦下拉面板；同时移除桌面端下拉面板内重复的「全部系列」行与分割线，并用 `{seriesList.length > 0 && (...)}` 在无系列时隐藏空浮层（移动端抽屉仍保留「全部系列」，因其父级为展开按钮 `<button>`）。
- 理由：点击「系列」即可直达 `/series` 总览页，桌面端下拉面板本身定位为快捷直达具体系列的入口；去掉箭头与重复入口后，顶栏四项两字中文完全等宽对称，浮层主体更聚焦。
- 备选（未采纳）：
  - *方案 B（保留并缩小淡化箭头、`w-3 h-3` + 负边距微调）*：仍会在 4 个两字中文中留下一处不对称视觉尾巴。
  - *方案 C（给所有文字导航加 `rounded-lg` 胶囊热区）*：改变顶栏既有极简纯文字视觉语言，且需重设高亮样式。

**2. 桌面端文字导航项独立分组与宽度余量核算**

- 方案：在 `<nav class="flex items-center gap-3">` 内部，将桌面端 `siteConfig.nav` 渲染包裹在独立容器中：`<div class="hidden sm:flex items-center gap-5 mr-2">`。相应地，将 `desktopLinkClass` 中的 `hidden sm:inline-flex` 简化为 `inline-flex`，将系列外层 `<div class="group relative hidden sm:block">` 简化为 `<div class="group relative">`（可见性统一由外层分组容器控制）。
- 效果：四项文字之间间距从 `12px` 提升到 `20px`（`gap-5`），分组右侧 `mr-2` 与 `<nav>` 的 `gap-3` 叠加后，文字导航组与右侧搜索/主题区之间形成 `20px`（`8px + 12px`）的清晰区隔。
- 水平宽度校核（确保不溢出或折行）：
  - `sm`（`640px`，可用内宽 `592px`）：站点标题约 `100px` + 4 项导航（约 `32px × 4` + 3 个 `20px` 间隔 = `188px`）+ 右侧区隔 `20px` + 移动搜索按钮 `44px` + `12px` + 主题按钮 `44px` ≈ `408px`（余量约 `184px`）。
  - `lg`（`1024px`，可用内宽 `832px`）：即使搜索框聚焦展开至 `w-60`（`240px`），总占用约 `100 + 188 + 20 + 240 + 12 + 44 ≈ 604px`（余量约 `228px`）。

**3. 下拉面板基线对齐与垂直位移过渡**

- 方案：为 `<nav>`、桌面端文字导航组、`系列` 下拉包裹容器以及 [VueSearch.vue](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/search/VueSearch.vue#L2) 根容器补充 `h-full` 撑满 `h-16`（`64px`）顶栏高度，使 `top-full` 精确落在顶栏底边之下、`pt-2` / `lg:mt-2` 形成统一的 `8px` 悬停间隙（避免原先因 `h-11` 居中导致的顶部重叠 `2px`）；同时将系列下拉容器从居中 `left-1/2 -translate-x-1/2 w-64` 调整为 `left-0 w-56` 与「系列」文字左边缘对齐（`invisible absolute left-0 top-full z-50 w-56 pt-2 opacity-0 transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100`），并仅在内层白色/深色圆角卡片上增加 `-translate-y-1 transition-transform duration-150 group-hover:translate-y-0 group-focus-within:translate-y-0 motion-reduce:transition-none`。
- 理由：若把 `translate-y` 放在外层容器上，未展开前整个 `pt-2` 悬停桥也会向上偏移，且动画期间边界位置变化可能增加指针跨越间隙时触发 `hover` 丢失的风险；将位移限定在内层视觉卡片上、并将基线对齐顶栏底边与「系列」左边缘，既能让交互手感与 [VueSearch.vue](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/components/search/VueSearch.vue#L344-L353) 统一，又能保证悬停热区稳定不闪烁且视觉对齐精准，同时兼顾系统减弱动画偏好（`motion-reduce`）。

## Risks / Trade-offs

- [桌面端首次访客未必立即发现「系列」可悬停预览] → 点击「系列」本身即可直接进入 `/series` 总览页获取完整系列列表与篇数，悬停下拉作为快捷入口不影响核心发现路径。
- [键盘无障碍导航可达性] → 保留 `group-focus-within:visible`、`group-focus-within:opacity-100` 与 `group-focus-within:translate-y-0`，确保键盘 Tab 聚焦「系列」或进入子项时下拉面板同样正常展开。
- [未来扩展更多导航项时空间收紧] → 目前固定 4 项（约 `188px`），各断点均留有 `180px+` 余量；若日后增加导航项，可将 `gap-5` 微调为 `gap-4 md:gap-5`。
