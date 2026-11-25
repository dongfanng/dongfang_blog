# flat-blog-routes Specification

## Purpose

定义全站去除 `/blog` 路由前缀后的扁平化 URL 结构、旧 `/blog` 路径清理规则以及站内链接、RSS 与搜索索引的同步行为规范。

## Requirements

### Requirement: 移除 `/blog` 列表页且不保留旧路由兼容

站点 SHALL NOT 生成 `/blog` 列表页或任何 `/blog/*` 静态页面，也 SHALL NOT 为旧 `/blog*` 路径提供重定向或别名兼容；访问 `/blog` 或原 `/blog/*` 路径 SHALL 由站点 404 页面承接。

#### Scenario: 构建后检查旧路径产物

- **WHEN** 执行站点静态构建
- **THEN** 构建输出目录中不存在 `blog/` 目录或 `blog.html` 文件，且不生成指向新路径的 meta/HTTP 重定向规则

#### Scenario: 访问旧 `/blog` 路径

- **WHEN** 用户或客户端请求 `/blog` 或 `/blog/2026/getting-started`
- **THEN** 服务端返回未找到状态并呈现站点的 404 页面

### Requirement: 扁平化文章详情与分类/标签/系列路由

全站内容路由 SHALL 采用无 `/blog` 前缀的扁平路径：文章详情页位于 `/posts/[...slug]`，分类详情页位于 `/categories/[...category]`，标签索引与标签详情页分别位于 `/tags` 与 `/tags/[...tag]`，系列索引与系列详情页分别位于 `/series` 与 `/series/[series]`。分类详情页与标签索引页的返回链接 SHALL 指向 `/`（「← 返回首页」），标签详情页返回链接指向 `/tags`，系列详情页返回链接指向 `/series`。

#### Scenario: 访问扁平化后的各类内容页面

- **WHEN** 用户访问 `/posts/<slug>`、`/categories/<category>`、`/tags`、`/tags/<tag>`、`/series` 或 `/series/<series>`
- **THEN** 对应页面正常渲染且内容、分页/排序及返回链接与预期路径一致

#### Scenario: 从分类页或标签索引页返回

- **WHEN** 用户在 `/categories/<category>` 或 `/tags` 点击页面顶部的返回链接
- **THEN** 页面跳转回首页 `/`

### Requirement: 全站站内链接、RSS 与搜索索引同步至新路径

站内所有指向文章、分类、标签、系列的链接（包括文章卡片、文章详情页标签/分类/系列徽章与相关文章、系列目录组件、顶栏导航及下拉菜单、归档时间线）、RSS 订阅条目链接以及搜索索引结果 URL SHALL 全部指向新的扁平路径；同时 Markdown 源文件所在目录 `src/content/blog/` 与文章页「在 GitHub 上编辑此页」链接指向的源码路径 SHALL 保持不变。

#### Scenario: 从站内入口跳转至文章详情

- **WHEN** 用户从首页卡片、归档时间线、相关文章卡片、系列目录或 RSS 订阅源打开任意文章
- **THEN** 目标 URL 均为 `/posts/<slug>`（RSS 为 `/posts/<slug>/`）

#### Scenario: 校验文章页 GitHub 编辑链接与搜索结果

- **WHEN** 用户在文章页点击「在 GitHub 上编辑此页」或在站内搜索框点击搜索结果
- **THEN** GitHub 编辑链接仍指向仓库 `src/content/blog/<slug>.md`；生产构建的 Pagefind 搜索结果与开发模式搜索示例的跳转 URL 均为 `/posts/<slug>`
