# Tasks

## 1. 通用折叠面板组件类（`ui-collapse-panel`）

- [x] 1.1 在 `src/styles/global.css` 的 `@layer components` 中定义 `.collapse-panel`、`.collapse-panel[data-open="true"]`、`.collapse-panel > *` 及 `prefers-reduced-motion: reduce` 降级规则，并附简明使用注释，确认 CSS 编译无报错
- [x] 1.2 重构 `src/components/layout/SiteHeader.astro` 中 `#mobile-menu` 使用 `.collapse-panel`（保留 `duration-200`、半透明顶部分割线显隐过渡、`aria-hidden` 与 `inert` 同步），检查源码确认无重复的长串 Grid 折叠类名

## 2. 移动端顶栏视觉与交互收口（`site-header-navigation`）

- [x] 2.1 移除 `src/components/layout/SiteHeader.astro` 中移动端汉堡菜单的「系列」二级折叠子菜单及相关脚本状态，改为与其他导航项一致的平铺链接直达 `/series`
- [x] 2.2 确认 `src/components/search/VueSearch.vue` 中移动端搜索面板具有 `mt-3`（桌面端 `lg:mt-2`）及柔和描边，消除圆角浮层与顶栏粘连
- [x] 2.3 确认 `src/components/layout/SiteHeader.astro` 的 `<script>` 通过 `AbortController` 绑定外部点击、超过 `10px` 滚动及 `Escape` 自动收起汉堡菜单逻辑，在 Astro View Transitions 切页后无重复监听

## 3. 整体校验

- [x] 3.1 运行 `npm run typecheck`、`npm run build` 与 `openspec validate "polish-mobile-header-and-collapse-panel"`，确认 0 错误且构建产物中 `.collapse-panel` 与移动端平铺导航结构正确渲染
