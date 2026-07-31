---
title: 数学公式与流程图测试
description: 验证 KaTeX 数学公式与 Mermaid 流程图渲染。
pubDate: 2026-07-31
updatedDate: 2026-07-31
category: 前端开发
tags: [测试, KaTeX, Mermaid]
draft: false
sticky: 0
---

这是一篇用于验证 KaTeX 与 Mermaid 渲染的临时文章，验证后会删除。

## 行内公式

质能方程 $E = mc^2$ 是物理学最著名的公式。欧拉公式 $e^{i\pi} + 1 = 0$ 被称为「最美丽的数学公式」。

## 块级公式

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

$$
\frac{\partial u}{\partial t} = \alpha \nabla^2 u
$$

## 流程图

```mermaid
flowchart TD
    A[开始] --> B{是否已登录?}
    B -- 否 --> C[跳转登录页]
    B -- 是 --> D[加载文章]
    D --> E[渲染 Markdown]
    E --> F[结束]
    C --> F
```

## 时序图

```mermaid
sequenceDiagram
    participant U as 用户
    participant B as 浏览器
    participant S as 服务器
    U->>B: 输入关键词
    B->>S: GET /search?q=xxx
    S-->>B: 返回结果
    B->>U: 渲染搜索列表
```

## 甘特图

```mermaid
gantt
    title 博客开发计划
    dateFormat YYYY-MM-DD
    section 基础
    静态站点搭建    :done, a1, 2026-07-01, 3d
    文章系统        :done, a2, 2026-07-04, 5d
    section 增强
    搜索与评论      :active, b1, 2026-07-10, 5d
    PWA 支持       :b2, 2026-07-15, 3d
```

## 普通代码块不受影响

```js
const greeting = (name) => `Hello, ${name}!`;
console.log(greeting('world'));
```
