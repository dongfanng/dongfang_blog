# 布局系统文档

记录项目当前的布局体系，作为修改时的参考基准。

## 1. 容器类

定义在 `src/styles/global.css` 末尾的 `@layer components` 块中：

```css
.container-prose {
  @apply max-w-4xl mx-auto px-4 sm:px-6 lg:px-8;
}
```

| 类名 | 最大宽度 | 水平 padding | 用途 |
|---|---|---|---|
| `.container-prose` | 56rem (896px) | px-4 sm:px-6 lg:px-8 | 全站标准容器，Header/Footer/正文统一使用 |

**设计原则**：容器类不包含垂直 padding，由使用方按需追加 `py-8` / `py-12`。

## 2. 各页面容器使用

| 页面/组件 | 文件 | 容器类 | 垂直 padding |
|---|---|---|---|
| Header | `src/components/layout/VueHeader.vue` | `container-prose` | 无（自身 h-16） |
| Footer | `src/components/layout/Footer.astro` | `container-prose` | `py-12` |
| 首页 | `src/pages/index.astro` | `container-prose` | `py-12` |
| 博客列表 | `src/pages/blog/index.astro` | `container-prose` | `py-12` |
| 分类页 | `src/pages/blog/categories/[category].astro` | `container-prose` | `py-12` |
| 标签页 | `src/pages/blog/tags/[tag].astro` | `container-prose` | `py-12` |
| 归档 | `src/pages/archive.astro` | `container-prose` | `py-12` |
| 关于 | `src/pages/about.astro` | `container-prose` | `py-12` |
| 文章页 | `src/layouts/PostLayout.astro` | `container-prose` | `py-8` |

## 3. 文章页 TOC 布局

文件：`src/layouts/PostLayout.astro`

### 结构

```astro
<BaseLayout>
  <!-- 正文：container-prose，与 Header/Footer 完全一致 -->
  <div class="container-prose py-8">
    <article>
      <header>...</header>
      <div class="prose">...</div>
      <nav>上一篇/下一篇</nav>
      <section>相关文章</section>
    </article>
  </div>

  <!-- TOC：fixed 定位，脱离正常流，不挤占正文 -->
  {headings.length > 0 && (
    <aside class="hidden xl:block fixed top-24 z-30 w-48"
           style="left: calc(50% + 30rem);">
      <div class="max-h-[calc(100vh-6rem)] overflow-y-auto">
        <TableOfContents headings={headings} />
      </div>
    </aside>
  )}
</BaseLayout>
```

### 空间计算

```
|<---------------- 视口 ---------------->|
|                                       |
|       [Header max-w-4xl 居中]         |
|                                       |
|       [----正文 max-w-4xl----][TOC]   |
|       [    56rem 居中      ][12rem]  |
|       ↑ 正文与 Header 严格对齐        |
|                                       |
|       [Footer max-w-4xl 居中]         |
|                                       |
```

- 正文：max-w-4xl = 56rem，居中
- 正文右边界：50% + 28rem
- TOC 左边界：`calc(50% + 30rem)` = 正文右边界 + 2rem gap
- TOC 宽度：w-48 = 12rem
- TOC 右边界：50% + 30rem + 12rem = 50% + 42rem

### 断点选择

TOC 显示断点为 `xl`（1280px），原因：

| 断点 | 视口宽度 | TOC 右边界 | 是否容纳 |
|---|---|---|---|
| lg | 1024px (64rem) | 50%+42rem = 74rem | 超出 10rem |
| xl | 1280px (80rem) | 50%+42rem = 82rem | 剩余 8rem |
| 2xl | 1536px (96rem) | 50%+42rem = 90rem | 剩余 6rem |

xl 断点能容纳正文(56rem) + gap(2rem) + TOC(12rem) + 左右边距。

### 更窄屏幕的 TOC 方案

如需在 lg 断点也显示 TOC，可以：
1. **继续缩小 TOC**：`w-48` 改 `w-40`（10rem）
2. **窄屏用浮动按钮**：在 xl 以下显示 TOC 按钮，点击弹出面板（需额外组件）
3. **调整正文宽度**：缩小 max-w-4xl，但会影响全站一致性

## 4. 主题色体系

定义在 `src/styles/global.css` 的 `@theme` 块中：

```css
@theme {
  --color-primary-50:  #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;  /* 暗色模式主色 */
  --color-primary-500: #3b82f6;  /* 浅色模式主色 */
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;
}
```

### 使用方式

| 场景 | 写法 | 示例 |
|---|---|---|
| HTML class | Tailwind 原生 class | `text-primary-500 dark:text-primary-400` |
| CSS 引用 | CSS 变量 | `color: var(--color-primary-500)` |
| JS 读取 | getPropertyValue | `getPropertyValue('--color-primary-500')` |

### 暗色模式

- 浅色模式：`primary-500` (#3b82f6)
- 暗色模式：`primary-400` (#60a5fa)

暗色模式通过 `dark:` 变体实现，定义在 `@custom-variant dark (&:where(.dark, .dark *));`。

### 设计原则

- **单一来源**：所有主题色由 `@theme` 单点驱动，不再维护独立的 `--theme-primary` 变量
- **换主题色**：只需修改 `@theme` 块的色板值，全站自动联动

## 5. 响应式断点

使用 Tailwind 默认断点：

| 断点 | 宽度 | 典型用途 |
|---|---|---|
| (默认) | <640px | 移动端 |
| `sm` | ≥640px | 大屏手机 |
| `md` | ≥768px | 平板 |
| `lg` | ≥1024px | 小屏桌面 |
| `xl` | ≥1280px | 标准桌面 |
| `2xl` | ≥1536px | 宽屏桌面（TOC 显示） |

## 6. 关键约束

### 容器一致性

- **Header / Footer / 正文必须使用相同的容器宽度**（max-w-4xl = 56rem）
- 文章页 TOC 不能挤占正文空间，必须用 `fixed` 定位脱离正常流
- 添加新页面时，优先使用 `container-prose`，保持全站对齐

### TOC 空间限制

- 正文 56rem + TOC 16rem + gap 2rem = 74rem 内容宽度
- 加上左右边距，需要约 92rem（1472px）视口才够
- 这就是 TOC 只在 2xl 断点显示的根本原因
- 若要降低断点，必须缩小 TOC 宽度或正文宽度

### 样式分层

| 层 | 用途 | 文件 |
|---|---|---|
| `@theme` | 设计 token（颜色、字体） | global.css 头部 |
| `@layer base` | 基础样式（prose、滚动条、代码块） | global.css |
| `@layer components` | 复用类（container-prose/wide） | global.css 末尾 |
| Tailwind utility | 一次性样式 | 组件内联 |

### 主题色统一

- 不再使用 `--theme-primary` / `--theme-primary-dark` 变量
- 不再使用 `.theme-primary` / `.theme-primary-bg` 自定义类
- 所有主题色引用统一为 `primary-500`（浅色）/ `primary-400`（暗色）
- CSS 中用 `var(--color-primary-500)` / `var(--color-primary-400)`

## 7. 技术栈

- Astro 4.15 + Vue 3.5
- Tailwind CSS v4.3（CSS-first 配置，无 tailwind.config.mjs）
- 集成方式：`@tailwindcss/vite` 插件（非 PostCSS）
- 暗色模式：class 切换（`<html class="dark">`）
