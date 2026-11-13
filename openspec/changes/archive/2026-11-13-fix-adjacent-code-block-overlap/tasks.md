# Tasks

## 1. 样式修复

- [x] 1.1 在 [global.css](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/styles/global.css#L197-L221) 的代码块段落中，为 `.prose .code-block-wrapper`、`.prose > pre`、`.prose .mermaid-container` 统一补充 `margin-top: 1.5rem; margin-bottom: 1.5rem;`，验证三处规则均命中且无重复覆盖
- [x] 1.2 确认 `.code-block-wrapper` 仍无 padding/border（仅保持 `position: relative; max-width: 100%; min-width: 0`），验证相邻代码块的 1.5rem 外边距可正常折叠为单一间距

## 2. 验证

- [x] 2.1 运行 `npm run build`，确认构建通过且产物中 `dist/blog/2026/docker-multi-stage-build/index.html` 仍为裸 `pre` 结构（未引入 figure）
- [x] 2.2 打开 `/blog/2026/docker-multi-stage-build` 页面，确认紧邻的 `powershell` 与 `dockerfile` 代码块之间出现可见空白、语言标签与圆角互不遮挡
- [x] 2.3 检查浅色/深色两种主题下的代码块：语言标签位置、复制按钮、块内横向滚动均与修改前一致
- [x] 2.4 打开含 Mermaid 图表的文章（如 `/blog/2026/ann-vector-search`），确认图表渲染后与相邻代码块/段落之间仍保留相同间距

## Workflow follow-up

- 评审通过后使用 `openspec-archive-change` 归档本次变更。
