# Proposal

## Why

文章正文中两个连续的代码块（例如 Docker 文章里紧挨着的 `powershell` 与 `dockerfile` 块）首尾相接，视觉上像粘在一起、互相重叠，语言标签还压在上一个块的圆角上，影响可读性。

根因：`rehype-pretty-code` 对无标题代码块只输出裸 `<pre>`（没有 `figure[data-rehype-pretty-code-figure]` 包裹），而 [global.css](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/styles/global.css#L197-L221) 只给 `figure[data-rehype-pretty-code-figure]` 设置了上下外边距；`.code-block-wrapper` 与 `pre` 都没有垂直外边距，且 Tailwind Preflight 已把 `pre` 的默认 margin 归零，因此相邻代码块之间间距为 0。

## What Changes

- 为文章正文中的代码块容器补充统一的垂直外边距：客户端包裹层 `.code-block-wrapper`、未被包裹的 `pre`、以及 Mermaid 渲染后的 `.mermaid-container`，使相邻代码块之间保持与段落/引用块一致的垂直间距。
- 保持现有样式不变：圆角、语言标签、复制按钮、浅色/深色主题、横向滚动行为均不改动。
- 不调整 Markdown 内容或渲染管线（不引入 `figure` 包裹）。

## Capabilities

### New Capabilities

- `code-block-rendering`: 文章代码块的渲染与排版规则，包括相邻代码块之间的垂直间距、语言标签、复制按钮与横向滚动行为。

### Modified Capabilities

（无：当前项目尚无既有 specs。）

## Impact

- 样式：[src/styles/global.css](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/styles/global.css) 的代码块段落。
- 影响范围：所有包含代码块的文章页（含 Mermaid 图表块），纯样式变更，不改动组件、脚本与构建配置。
- 无 API、依赖或数据结构变更。
