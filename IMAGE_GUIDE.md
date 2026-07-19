# 图片使用指南

本文档介绍本博客的图片使用方案，重点介绍如何搭配图床使用。

---

## 图片方案：图床 + Markdown

### 工作原理

```
你的本地图片
    ↓
上传到图床
    ↓
获得图片链接
    ↓
在 Markdown 中使用链接
```

### 目录结构

```
public/
└── favicon.svg          # 只保留网站图标在这里
```

其他所有图片都使用图床链接，**不放在项目仓库中**。

---

## 推荐图床

### 免费图床

| 图床 | 特点 | 地址 |
|------|------|------|
| **GitHub** | 免费、稳定、无流量限制 | 仓库 + JSDelivr 或 GH Pages |
| **Cloudinary** | 免费额度充足，有图片优化 | https://cloudinary.com/ |
| **Imgur** | 老牌图床，简单 | https://imgur.com/ |
| **Uptom** | 简单好用 | https://uptom.com/ |
| **SM.MS** | 国内访问好 | https://sm.ms/ |

### 自建图床

| 方案 | 说明 |
|------|------|
| **GitHub + JSDelivr** | 用 GitHub 存图，JSDelivr CDN 加速 |
| **Cloudflare R2** | 10GB 免费，配合 Cloudflare Pages |
| **Backblaze B2** | 10GB 免费，配合 Cloudflare |

---

## 使用方式

### 在 Markdown 文章中

```markdown
<!-- 基本用法 -->
![图片描述](https://example.com/your-image.jpg)

<!-- 添加 loading="lazy" 懒加载 -->
<img
  src="https://example.com/your-image.jpg"
  alt="图片描述"
  loading="lazy"
/>

<!-- 添加样式 -->
<img
  src="https://example.com/your-image.jpg"
  alt="图片描述"
  loading="lazy"
  class="rounded-lg shadow-md"
/>
```

### 添加说明文字（可选）

```markdown
<figure>
  <img
    src="https://example.com/your-image.jpg"
    alt="描述"
    loading="lazy"
    class="rounded-lg"
  />
  <figcaption class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
    图片说明文字
  </figcaption>
</figure>
```

### 在文章 Frontmatter 中使用封面图

```markdown
---
title: 文章标题
description: 描述
pubDate: 2026-07-20
category: 分类
tags: [标签1, 标签2]
image: https://example.com/cover.jpg  # 使用图床链接
---
```

---

## 方案一：GitHub + JSDelivr（推荐，完全免费）

### 步骤

1. **创建一个图片仓库**

   在 GitHub 创建仓库，比如名为 `blog-images`

2. **上传图片到仓库**

   推荐的目录结构：
   ```
   blog-images/
   ├── covers/
   │   ├── 2026-07-20-welcome.jpg
   │   └── 2026-07-21-astro.jpg
   └── posts/
       ├── 2026-07-20-getting-started/
       │   ├── 01-intro.jpg
       │   └── 02-diagram.png
       └── 2026-07-21-astro/
           └── screenshot.jpg
   ```

3. **获取 GitHub RAW 链接**

   点击图片文件，然后点击 "Raw"，复制链接：

   ```
   https://raw.githubusercontent.com/你的用户名/blog-images/main/covers/xxx.jpg
   ```

4. **使用 JSDelivr 加速**

   将链接转换为 JSDelivr 格式：

   ```
   # 格式
   https://cdn.jsdelivr.net/gh/你的用户名/仓库@分支/图片路径

   # 示例
   https://cdn.jsdelivr.net/gh/dongfanng/blog-images@main/covers/welcome.jpg
   ```

### 完整示例

```markdown
---
title: 欢迎来到我的博客
description: ...
pubDate: 2026-07-20
category: 个人随笔
tags: [博客, 公告]
image: https://cdn.jsdelivr.net/gh/dongfanng/blog-images@main/covers/welcome.jpg
---

## 文章内容

![描述](https://cdn.jsdelivr.net/gh/dongfanng/blog-images@main/posts/2026-07-20-welcome/01-intro.jpg)

![描述](https://cdn.jsdelivr.net/gh/dongfanng/blog-images@main/posts/2026-07-20-welcome/02-diagram.png)
```

---

## 方案二：Cloudinary（推荐，有优化功能）

### 优势

- 自动图片优化
- 自动格式转换（WebP/AVIF）
- 响应式图片支持
- 自动压缩
- 免费额度：25GB 存储，25GB 流量/月

### 使用步骤

1. **注册 Cloudinary 账号**

   https://cloudinary.com/

2. **上传图片**

   可以通过网页界面上传，或者使用工具批量上传

3. **获取图片链接**

   上传后获得链接，可以添加优化参数：

   ```
   # 基础链接
   https://res.cloudinary.com/你的ID/image/upload/图片名称.jpg

   # 优化后的链接
   https://res.cloudinary.com/你的ID/image/upload/w_800,q_auto,f_webp/图片名称.jpg
   ```

### URL 参数说明

| 参数 | 说明 | 示例 |
|------|------|------|
| `w_xxx` | 宽度 | `w_800` |
| `h_xxx` | 高度 | `h_600` |
| `q_auto` | 自动质量 | `q_auto` |
| `f_xxx` | 格式 | `f_webp` |
| `c_xxx` | 裁剪方式 | `c_limit` |

### 完整示例

```markdown
![描述](https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_webp/my-image.jpg)

<!-- 使用 HTML -->
<img
  src="https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_webp/my-image.jpg"
  alt="描述"
  loading="lazy"
/>
```

---

## 方案三：Cloudflare R2 + CDN（适合大量图片）

### 优势

- 10GB 免费存储
- 流出流量免费（如果使用 Cloudflare）
- 与 Cloudflare Pages 集成好
- 可以使用 Cloudflare Images 进行优化

### 配置步骤

1. **创建 R2 存储桶**

2. **上传图片到 R2**

3. **配置域名访问**

   使用自定义域名或 Cloudflare 提供的域名

4. **使用链接**

   ```markdown
   ![描述](https://images.your-domain.com/photo.jpg)
   ```

---

## 图床管理工具推荐

| 工具 | 说明 | 平台 |
|------|------|------|
| **PicGo** | 优秀的图床上传工具 | Windows / Mac / Linux |
| **uPic** | Mac 平台好用 | Mac |
| **ShareX** | Windows 功能强大 | Windows |
| **ImageX** | Mac 平台 | Mac |

### PicGo 配置示例

1. 下载安装：https://picgo.github.io/PicGo-Doc/
2. 配置 GitHub 图床
3. 配置自动添加链接到剪贴板
4. 拖拽上传，获得链接

---

## 图片最佳实践

### 1. 上传前优化

在上传到图床前，建议先优化图片：

| 任务 | 工具 |
|------|------|
| 调整尺寸 | https://squoosh.app/ |
| 压缩 | https://squoosh.app/ / https://tinypng.com/ |
| 格式转换 | https://squoosh.app/ |

### 2. 图片尺寸建议

- **封面图**: 1200×630px (1.91:1)
- **文章内图片**: 宽度 800-1200px
- **头像**: 512×512px (正方形)
- **截图**: 宽度不超过 1200px

### 3. 文件格式和大小建议

| 格式 | 适用场景 | 目标大小 |
|------|----------|----------|
| **WebP** | 照片、复杂图形 | < 100KB |
| **PNG** | 需要透明度的图形 | < 100KB |
| **JPEG** | 照片 | < 150KB |
| **SVG** | 图标、简单图形 | < 10KB |

### 4. 始终使用 `loading="lazy"`

对于非首屏图片，添加懒加载：

```markdown
<img
  src="https://example.com/image.jpg"
  alt="描述"
  loading="lazy"
/>
```

### 5. 图片命名规范

使用描述性的文件名，包含日期或文章标识：

```
good:
  2026-07-20-welcome-hero.jpg
  2026-07-21-astro-screenshot.png

bad:
  IMG_1234.JPG
  screenshot.png
  1.jpg
```

---

## 完整文章示例

```markdown
---
title: 欢迎来到我的博客
description: 这是博客的第一篇文章
pubDate: 2026-07-20
category: 个人随笔
tags: [博客, 公告]
image: https://cdn.jsdelivr.net/gh/dongfanng/blog-images@main/covers/2026-07-20-welcome.jpg
draft: false
sticky: 10
---

## 你好，世界！

![欢迎图片](https://cdn.jsdelivr.net/gh/dongfanng/blog-images@main/posts/2026-07-20-welcome/hero.jpg)

欢迎来到我的博客！这是博客的第一篇文章。

## 技术栈

<figure>
  <img
    src="https://cdn.jsdelivr.net/gh/dongfanng/blog-images@main/posts/2026-07-20-welcome/tech-stack.png"
    alt="技术栈架构图"
    loading="lazy"
    class="rounded-lg"
  />
  <figcaption class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
    技术栈架构图
  </figcaption>
</figure>

这个博客使用了以下技术构建：
```

---

## 从 `public/` 目录迁移

如果你之前把图片放在 `public/` 目录，想迁移到图床：

1. 上传所有图片到图床
2. 更新 Markdown 中的图片链接
3. 从 `public/` 目录删除已迁移的图片
4. 保留 `favicon.svg` 在 `public/`

---

## 总结

推荐方案：**GitHub + JSDelivr + PicGo**

✅ 完全免费  
✅ 稳定可靠  
✅ PicGo 上传方便  
✅ CDN 加速  
✅ 无流量限制  
✅ 有版本历史  

需要我帮你配置 GitHub 图床吗？
