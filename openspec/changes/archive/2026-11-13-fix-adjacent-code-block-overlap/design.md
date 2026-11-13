# Design

## Context

文章正文由 Astro Markdown 管线配合 `rehype-pretty-code` 生成。无标题代码块的服务端输出是裸 `<pre class="astro-code" data-language="...">`，**没有** `figure[data-rehype-pretty-code-figure]` 包裹（已核对 `dist/blog/2026/docker-multi-stage-build/index.html`）。

客户端的两种后处理会改变代码块的 DOM 形态：

- [post-enhancements.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/scripts/post-enhancements.ts#L103-L174)：为非 Mermaid 的 `pre` 套一层 `div.code-block-wrapper`，并在其上挂语言标签 `::before` 与复制按钮。
- [mermaid.ts](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/scripts/mermaid.ts#L105-L131)：把 `pre[data-language="mermaid"]` 替换为 `div.mermaid-container`。

[global.css](file:///Users/zhaoguanghua/CODE/dongfang_blog/src/styles/global.css#L197-L221) 只给 `figure[data-rehype-pretty-code-figure]` 设置了 `margin-top/bottom: 1.5rem`，而 `.code-block-wrapper`、`pre`、`.mermaid-container` 都没有垂直外边距；Tailwind Preflight 已将 `pre` 的默认 margin 归零，因此相邻代码块的间距为 0，视觉上首尾相接、彼此遮挡。

## Goals / Non-Goals

**Goals:**

- 相邻代码块之间、代码块与正文元素之间恢复一致（1.5rem）的垂直间距。
- 覆盖三种运行时形态：`.code-block-wrapper`、尚未被脚本包裹的 `.prose pre`、Mermaid 渲染后的 `.mermaid-container`。
- 纯 CSS 改动，不改渲染管线与脚本行为。

**Non-Goals:**

- 不改用 `figure` + `figcaption` 的标题式代码块（现有语言标签交互保持不变）。
- 不调整代码块内边距、圆角、配色、复制按钮与横向滚动。
- 不为不同语言或不同相邻元素设置差异化间距。

## Decisions

**1. 间距加在“外层容器”上，而非 `pre` 上。**
`.code-block-wrapper` 是 `pre` 的唯一子元素且自身无 padding/border，若给 `pre` 设 margin 会与父级发生外边距折叠，间距生效位置不确定，也容易与绝对定位的语言标签、复制按钮产生认知偏差。加在 wrapper 上，间距归属清晰，且与语言标签所在坐标系一致。
备选：给 `pre` 设 margin——被否决（折叠行为隐晦）；用 `.prose > * + *` 统一间距——被否决（会影响段落、表格等既有间距，超出本次范围）。

**2. 三种容器共用同一组数值。**
新增一组规则，统一 `margin-top/margin-bottom: 1.5rem`：

- `.prose .code-block-wrapper`
- `.prose > pre`（脚本未执行/被禁用，以及 Mermaid 尚未替换源码块的阶段）
- `.prose .mermaid-container`

这样无论 JS 是否执行、Mermaid 是否替换成功，间距都一致，不会出现布局跳动。数值沿用项目现有的 1.5rem 垂直节奏（与 `blockquote`、`figure` 一致）。

**3. 依赖相邻兄弟的外边距折叠，而不是 `:not(:first-child)` 之类选择器。**
相邻代码块各自贡献的 1.5rem 会折叠为 1.5rem，正好等于“代码块与段落相邻”时的观感，无需特判；保持选择器简单。

## Risks / Trade-offs

- [wrapper 若日后被加上 padding/border，`pre` 或 wrapper 的外边距折叠行为会变化] → 保持 wrapper 无 padding/border，仅承载定位上下文与间距。
- [Mermaid 替换前后容器不同（`pre` → `.mermaid-container`），可能出现字体加载期抖动] → 两者间距同为 1.5rem，替换前后占位一致。
- [首个/末个代码块与标题、正文之间间距比原先增大 1.5rem] → 与段落间距规则统一，属于预期修正，视觉上更一致。
- [View Transitions 下 wrapper 在 `astro:page-load` 后才插入] → 间距完全由 CSS 决定，不依赖脚本执行时机。
