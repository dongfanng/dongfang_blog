---
title: Astro 入门指南
description: 介绍 Astro 的基本概念和使用方法，帮助你快速上手这个优秀的静态站点生成器。
pubDate: 2026-07-19
category: 前端开发
tags: [Astro, JavaScript, 静态站点]
draft: false
sticky: 0
---

## 什么是 Astro？

Astro 是一个现代化的静态站点生成器，专注于内容网站的性能。

## 核心概念

### 群岛架构

Astro 的核心理念是「群岛架构」：

1. 默认发送零 JavaScript
2. 仅在需要时水化互动组件
3. 支持多种 UI 框架

### 组件语法

```astro
---
// 这里是组件脚本（服务端运行）
const title = 'Hello, Astro!';
---

<!-- 这里是组件模板 -->
<h1>{title}</h1>

<style>
  /* 组件样式，作用域化 */
</style>

<script>
  // 客户端脚本
</script>
```

## 为什么选择 Astro？

| 特性 | 说明 |
|------|------|
| 零 JS 默认 | 默认不发送 JavaScript |
| 框架无关 | 支持 React/Vue/Svelte |
| 优秀的 DX | 开发体验非常好 |
| 性能优秀 | 构建产物性能极佳 |

## 总结

Astro 是一个非常优秀的静态站点生成器，特别适合内容网站。
