# Astro 框架完整指南

本文档旨在帮助你了解 Astro 框架的起源、特性、使用方法以及部署流程，适用于刚接触 Astro 的开发者。

## 目录

- [框架介绍](#框架介绍)
  - [起源与背景](#起源与背景)
  - [核心理念](#核心理念)
  - [主要特性](#主要特性)
  - [用户活跃度与更新频率](#用户活跃度与更新频率)
- [项目结构解析](#项目结构解析)
- [核心概念](#核心概念)
  - [群岛架构](#群岛架构)
  - [Content Collections](#content-collections)
  - [Astro 组件](#astro-组件)
  - [Layouts](#layouts)
- [常用操作指南](#常用操作指南)
  - [创建新文章](#创建新文章)
  - [添加新页面](#添加新页面)
  - [使用集成](#使用集成)
- [部署指南](#部署指南)
  - [部署到 Cloudflare Pages](#部署到-cloudflare-pages)
  - [部署到 GitHub Pages](#部署到-github-pages)
  - [部署到 Vercel](#部署到-vercel)

---

## 框架介绍

### 起源与背景

Astro 是由 Nate Moore 等人于 2021 年创建的现代化静态站点生成器。它最初由 the Astro Software Foundation 维护，现在是一个活跃的开源项目。

Astro 的设计目标是解决传统静态站点生成器和现代 JavaScript 框架之间的权衡问题：传统 SSG 生成的网站速度快但交互能力有限，而像 React、Vue 这样的框架交互丰富但 JavaScript 包体积大，影响性能。

### 核心理念

Astro 的核心理念是"**默认零 JavaScript**"（Zero JS by default）。这意味着除非你明确告诉 Astro 需要使用 JavaScript，否则它不会向最终用户的浏览器发送任何 JavaScript 代码。

### 主要特性

1. **群岛架构（Islands Architecture）**
   - 将页面分解为独立、可交互的"岛屿"组件
   - 只有真正需要交互的组件才会发送 JavaScript
   - 每个岛屿独立水合（hydration）

2. **UI 框架无关**
   - 支持 React、Vue、Svelte、Preact、Solid 等主流框架
   - 可以在同一个项目中混合使用不同框架
   - 可以按需选择最适合的工具

3. **服务端优先渲染**
   - 默认在构建时渲染 HTML
   - 减少客户端 JavaScript
   - 提供优秀的 Lighthouse 性能评分

4. **内容聚焦**
   - 内置 Markdown 和 MDX 支持
   - Content Collections 提供类型安全的内容管理
   - 优秀的内容创作体验

5. **开发者体验优秀**
   - 热重载速度快
   - TypeScript 支持
   - 丰富的官方集成
   - 简单直观的组件语法

### 用户活跃度与更新频率

- **GitHub**: 拥有大量的 Stars，是最受欢迎的静态站点生成器之一
- **npm 下载量**: 月下载量持续增长，表明用户活跃度很高
- **发布频率**: 保持活跃的开发，定期发布小版本和功能更新
- **社区**: 拥有活跃的 Discord 社区，提供支持和讨论
- **生态**: 丰富的官方集成和第三方主题

---

## 项目结构解析

让我们看看你的博客项目的结构：

```
dongfang_blog/
├── public/                     # 静态资源
│   └── favicon.svg            # 网站图标
├── src/
│   ├── components/             # 组件
│   │   ├── BaseHead.astro     # SEO 头部组件
│   │   ├── Header.astro       # 顶部导航栏
│   │   ├── Footer.astro       # 底部栏
│   │   ├── ArticleCard.astro  # 文章卡片
│   │   ├── ThemeToggle.astro  # 主题切换按钮
│   │   ├── TableOfContents.astro  # 目录导航
│   │   ├── ReadingProgress.astro  # 阅读进度条
│   │   ├── BackToTop.astro    # 回到顶部按钮
│   │   └── Comments.astro     # 评论组件
│   ├── content/               # 内容（文章）
│   │   ├── blog/              # 博客文章
│   │   │   └── 2026/          # 按年份组织
│   │   └── config.ts          # Content Collection 配置
│   ├── layouts/               # 布局
│   │   ├── BaseLayout.astro   # 基础布局
│   │   └── PostLayout.astro   # 文章详情页布局
│   ├── pages/                 # 页面路由
│   │   ├── index.astro        # 首页
│   │   ├── about.astro        # 关于页
│   │   ├── archive.astro      # 归档页
│   │   ├── rss.xml.ts         # RSS Feed
│   │   └── blog/
│   │       ├── index.astro    # 文章列表
│   │       ├── [...slug].astro  # 文章详情
│   │       ├── categories/[category].astro  # 分类页
│   │       └── tags/[tag].astro  # 标签页
│   ├── styles/                # 样式
│   │   └── global.css         # 全局样式
│   └── utils/                 # 工具函数
│       ├── date.ts            # 日期处理
│       ├── posts.ts           # 文章处理
│       └── seo.ts             # SEO 相关
├── dist/                      # 构建输出
├── astro.config.mjs           # Astro 配置
├── tailwind.config.mjs        # Tailwind 配置
├── tsconfig.json              # TypeScript 配置
└── package.json               # 项目配置
```

---

## 核心概念

### 群岛架构

群岛架构是 Astro 最有特色的设计之一。

**传统方式的问题：**
- 使用 React/Vue 时，整个页面会被打包成一个大的 JavaScript 包
- 即使大部分内容是静态的，用户也需要下载和运行所有代码
- 影响页面加载速度和性能

**群岛架构的优势：**
- 将页面分解为独立的"岛屿"（交互组件）
- 静态内容直接作为 HTML 渲染
- 只有岛屿需要 JavaScript
- 每个岛屿可以独立水合

```astro
---
// 你的页面组件
---
<!-- 静态内容 - 零 JavaScript -->
<header>
  <h1>我的博客</h1>
</header>

<!-- 交互岛屿 - 按需发送 JavaScript -->
<ThemeToggle client:load />
<Search client:idle />
```

**客户端指令（Client Directives）：**

| 指令 | 说明 |
|------|------|
| `client:load` | 页面加载时立即水合 |
| `client:idle` | 浏览器空闲时水合 |
| `client:visible` | 组件进入视口时水合 |
| `client:media={query}` | 匹配媒体查询时水合 |
| `client:only={framework}` | 只在客户端渲染（跳过 SSR） |

### Content Collections

Content Collections 是 Astro 管理内容的方式，它提供：

1. **类型安全**
   - 定义内容的 schema
   - TypeScript 类型检查
   - 自动补全支持

2. **统一的数据访问**
   - 从 Markdown/MDX 中读取数据
   - 统一的 API 访问内容

你的项目中的 `src/content/config.ts` 是这样定义的：

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    sticky: z.number().default(0),
    image: z.string().optional(),
  }),
});

export const collections = { blog };
```

如何使用 Content Collections：

```astro
---
import { getCollection } from 'astro:content';

// 获取所有文章
const allPosts = await getCollection('blog');

// 获取并过滤（只显示非草稿文章）
const publishedPosts = await getCollection('blog', ({ data }) => {
  return !data.draft;
});
---
```

### Astro 组件

Astro 组件使用 `.astro` 文件扩展名，文件结构分为三个部分：

```astro
---
// 1. 组件脚本（Component Script）
// 这里写 TypeScript/JavaScript 代码
// 在服务器端运行，不在浏览器执行
import { formatDate } from '@/utils/date';

interface Props {
  title: string;
  date: Date;
}

const { title, date } = Astro.props;
const formattedDate = formatDate(date);
---

<!-- 2. 组件模板（Component Template） -->
<!-- 类似 JSX，但更接近 HTML -->
<article>
  <h1>{title}</h1>
  <time>{formattedDate}</time>
  <!-- 插槽 slot - 用于渲染子内容 -->
  <slot />
</article>

<!-- 3. 可选样式 -->
<style>
  /* 组件作用域样式 */
  article {
    padding: 1rem;
    border: 1px solid #ccc;
  }
</style>

<!-- 4. 可选客户端脚本 -->
<script>
  // 这里的代码在浏览器中运行
  console.log('Hello from the client!');
</script>
```

**注意：**
- 使用 `<slot />` 而不是 `{children}` 来渲染子内容
- 样式默认是组件作用域的（不会污染全局）
- 在组件脚本中可以直接使用 `await`（Top-level await）

### Layouts

Layouts 是特殊的组件，用于提供页面的整体结构。

你的项目中有两个布局：

1. **BaseLayout** - 所有页面的基础布局
   - 包含 header、main、footer
   - 引入全局样式

2. **PostLayout** - 文章详情页的专用布局
   - 继承 BaseLayout
   - 添加阅读进度条
   - 添加相关文章
   - 添加回到顶部按钮

使用布局：

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout title="页面标题">
  <p>页面内容放在这里</p>
</BaseLayout>
```

---

## 常用操作指南

### 创建新文章

1. **在 `src/content/blog/` 目录下创建新的 Markdown 文件**

   可以按年份组织：`src/content/blog/2026/my-new-post.md`

2. **使用正确的 Frontmatter 格式**

   ```markdown
   ---
   title: 你的文章标题
   description: 文章的简短描述（用于 SEO 和预览）
   pubDate: 2026-07-20
   category: 分类名称（如：前端开发 / 个人随笔）
   tags: [标签1, 标签2, 标签3]
   draft: false  # 设置为 true 则不显示
   sticky: 0     # 数字越大越靠前显示（置顶）
   image: /images/cover.jpg  # 可选：封面图
   ---

   这里开始写文章内容...
   ```

3. **使用 Markdown 语法**

   ```markdown
   # 一级标题

   这是一段文字。

   ## 二级标题

   - 列表项1
   - 列表项2

   ```typescript
   // 代码块
   const hello = 'world';
   ```

   > 引用文本
   ```

### 添加新页面

1. **在 `src/pages/` 目录下创建 `.astro` 文件**

   文件路径决定了路由路径：
   - `src/pages/about.astro` → `/about`
   - `src/pages/contact.astro` → `/contact`
   - `src/pages/archive/2026.astro` → `/archive/2026`

2. **基本页面模板**

   ```astro
   ---
   import BaseLayout from '@/layouts/BaseLayout.astro';
   ---

   <BaseLayout title="页面标题">
     <div class="max-w-4xl mx-auto px-4 py-12">
       <h1 class="text-3xl font-bold">页面标题</h1>
       <p>页面内容</p>
     </div>
   </BaseLayout>
   ```

3. **动态路由**

   使用 `[...slug].astro` 或 `[param].astro` 创建动态路由：

   ```astro
   ---
   import type { APIRoute } from 'astro';

   export async function getStaticPaths() {
     return [
       { params: { slug: 'first' } },
       { params: { slug: 'second' } },
     ];
   }

   const { slug } = Astro.params;
   ---

   <BaseLayout>
     <h1>动态页面：{slug}</h1>
   </BaseLayout>
   ```

### 使用集成

1. **添加官方集成**

   比如添加 Sitemap：

   ```bash
   npx astro add sitemap
   ```

2. **在 `astro.config.mjs` 中配置**

   ```javascript
   import { defineConfig } from 'astro/config';
   import sitemap from '@astrojs/sitemap';

   export default defineConfig({
     site: 'https://your-domain.com',
     integrations: [sitemap()],
   });
   ```

3. **可用的官方集成**

   - `@astrojs/react` - React 支持
   - `@astrojs/vue` - Vue 支持
   - `@astrojs/svelte` - Svelte 支持
   - `@astrojs/mdx` - MDX 支持
   - `@astrojs/sitemap` - 自动生成 sitemap
   - `@astrojs/rss` - RSS Feed 支持
   - `@astrojs/tailwind` - Tailwind CSS
   - `@astrojs/partytown` - 第三方脚本优化

### 修改配置

主要配置文件是 `astro.config.mjs`：

```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import rehypePrettyCode from 'rehype-pretty-code';

// 代码高亮配置
const prettyCodeOptions = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
};

export default defineConfig({
  // 网站地址（用于 RSS 和 sitemap）
  site: 'https://your-domain.com',

  // 集成配置
  integrations: [mdx(), tailwind()],

  // Markdown 配置
  markdown: {
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  },

  // 构建输出目录
  outDir: 'dist',
});
```

---

## 部署指南

### 部署到 Cloudflare Pages

Cloudflare Pages 是一个优秀的部署平台，提供免费额度、全球 CDN 和优秀的性能。

#### 方法一：通过 Git 仓库自动部署（推荐）

1. **推送代码到 GitHub/GitLab**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-name/your-repo.git
   git push -u origin main
   ```

2. **登录 Cloudflare Pages 控制台**

   - 访问 https://dash.cloudflare.com
   - 进入 "Workers & Pages"
   - 点击 "Create application"
   - 选择 "Pages" 标签

3. **连接到 Git 仓库**

   - 点击 "Connect to Git"
   - 选择你的博客仓库
   - 选择分支（通常是 `main`）

4. **配置构建设置**

   ```bash
   # 构建设置
   Framework preset: Astro
   Build command: npm run build
   Build output directory: dist

   # 环境变量（如需要）
   - 不需要额外的环境变量
   ```

5. **点击 "Save and Deploy"**

6. **配置自定义域名（可选）**

   - 在部署成功后，进入项目设置
   - 点击 "Custom domains"
   - 添加你的域名并遵循 DNS 配置说明

#### 方法二：使用 Wrangler CLI 手动部署

1. **安装 Wrangler CLI**

   ```bash
   npm install -g wrangler
   ```

2. **登录**

   ```bash
   wrangler login
   ```

3. **构建项目**

   ```bash
   npm run build
   ```

4. **部署**

   ```bash
   wrangler pages deploy dist
   ```

#### Cloudflare Pages 优势

- ✅ 免费额度足够个人使用
- ✅ 全球 CDN，访问速度快
- ✅ 自动 HTTPS
- ✅ 支持 Preview Deployments
- ✅ 支持 Functions（Serverless）
- ✅ 与 Cloudflare 的其他服务集成好

---

### 部署到 GitHub Pages

GitHub Pages 提供免费的静态网站托管，适合开源项目和个人博客。

#### 方法一：使用 GitHub Actions 自动部署（推荐）

1. **推送代码到 GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-name/your-repo.git
   git push -u origin main
   ```

2. **修改 `astro.config.mjs`**

   添加 `trailingSlash` 配置，并确保 `site` 正确：

   ```javascript
   export default defineConfig({
     site: 'https://your-name.github.io',  // 或者 https://your-name.github.io/your-repo
     trailingSlash: 'always',
     // ...其他配置
   });
   ```

   - 如果是个人/组织网站：`https://your-name.github.io`
   - 如果是项目网站：`https://your-name.github.io/your-repo`

3. **创建 GitHub Action 工作流**

   在项目根目录创建 `.github/workflows/deploy.yml`：

   ```yaml
   name: Deploy to GitHub Pages

   on:
     # 当推送到 main 分支时触发
     push:
       branches: [main]
     # 允许手动触发
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: "pages"
     cancel-in-progress: true

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4

         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: 'npm'

         - name: Install dependencies
           run: npm ci

         - name: Build
           run: npm run build

         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: ./dist

     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       needs: build
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

4. **配置 GitHub Pages 源**

   - 进入仓库设置
   - 点击 "Pages"
   - 在 "Source" 中选择 "GitHub Actions"
   - 保存设置

5. **推送 Action 文件**

   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add deploy workflow"
   git push
   ```

6. **触发部署**

   - 每次推送到 main 分支都会自动部署
   - 也可以在 Actions 标签中手动触发

#### 方法二：手动部署到 `gh-pages` 分支

1. **修改 `astro.config.mjs`**

   ```javascript
   export default defineConfig({
     site: 'https://your-name.github.io',
     outDir: 'dist',
     trailingSlash: 'always',
   });
   ```

2. **构建项目**

   ```bash
   npm run build
   ```

3. **部署到 gh-pages 分支**

   可以使用 `gh-pages` 工具：

   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```

   或者手动操作：

   ```bash
   # 创建临时目录
   cp -r dist /tmp/gh-pages-deploy

   # 切换到 gh-pages 分支
   git checkout --orphan gh-pages
   git rm -rf .

   # 复制文件并提交
   cp -r /tmp/gh-pages-deploy/* .
   git add .
   git commit -m "Deploy"
   git push origin gh-pages

   # 切回 main
   git checkout main
   ```

4. **配置 GitHub Pages 源**

   - 进入仓库设置
   - 点击 "Pages"
   - 在 "Source" 中选择 "Deploy from a branch"
   - 分支选择 "gh-pages" 并保存

#### GitHub Pages 优势

- ✅ 完全免费
- ✅ 与 GitHub 集成良好
- ✅ 支持自定义域名
- ✅ 自动 HTTPS

#### 注意事项

- 如果是项目页面（非用户/组织页面），路径可能包含仓库名，需要正确配置 `site`
- 可能有内容更新延迟（几分钟到几十分钟）
- 仓库需要公开（除非使用 Pro 账户）

---

### 部署到 Vercel

Vercel 是 Astro 官方推荐的部署平台之一，对 Astro 有特别的优化。

#### 方法一：通过 Git 仓库自动部署

1. **推送代码到 GitHub/GitLab/Bitbucket**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-name/your-repo.git
   git push -u origin main
   ```

2. **访问 Vercel 并导入项目**

   - 访问 https://vercel.com/new
   - 导入你的博客仓库
   - Vercel 会自动检测到这是 Astro 项目
   - 使用默认的构建设置

3. **配置 `site`（可选但推荐）**

   在 `astro.config.mjs` 中设置：

   ```javascript
   export default defineConfig({
     site: 'https://your-site.vercel.app',  // 或者你的自定义域名
     // ...
   });
   ```

4. **点击 "Deploy"**

5. **更新仓库中的 `site` 配置**

   - 部署成功后，你会获得一个 vercel.app 域名
   - 更新 `astro.config.mjs` 中的 `site` 配置
   - 再次推送以生效

#### 方法二：使用 Vercel CLI

1. **安装 Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **部署**

   ```bash
   vercel
   ```

3. **部署到生产环境**

   ```bash
   vercel --prod
   ```

#### Vercel 优势

- ✅ 对 Astro 有特别优化
- ✅ 构建速度快
- ✅ 自动检测 Astro 项目
- ✅ Preview Deployments 功能出色
- ✅ Edge Functions 支持
- ✅ 优秀的分析工具

---

## 部署后配置

### 配置 Giscus 评论系统

1. **确保仓库满足条件**

   - 仓库是公开的
   - 已安装 Giscus App：https://github.com/apps/giscus
   - 已启用 Discussions

2. **配置 Giscus**

   - 访问 https://giscus.app/
   - 填写仓库信息
   - 获取配置参数

3. **在项目中启用**

   在 `src/layouts/PostLayout.astro` 中，取消注释 Comments 组件并填入参数：

   ```astro
   <Comments
     repo="your-name/your-repo"
     repoId="your-repo-id"
     category="Announcements"
     categoryId="your-category-id"
   />
   ```

### 添加自定义域名

无论选择哪个平台，都推荐配置自定义域名：

1. **购买域名**

   推荐域名注册商：
   - Cloudflare Registrar
   - Namecheap
   - GoDaddy
   - 国内：阿里云、腾讯云

2. **在部署平台添加域名**

   - 根据平台提示添加域名
   - 平台会提供 DNS 配置说明

3. **配置 DNS**

   - 通常是添加 CNAME 记录
   - 或者使用 Cloudflare 作为 DNS 提供商（推荐）

4. **更新 Astro 配置**

   更新 `astro.config.mjs` 中的 `site` 为你的新域名：

   ```javascript
   export default defineConfig({
     site: 'https://your-domain.com',
     // ...
   });
   ```

---

## 扩展功能建议

### 添加搜索功能

1. **使用 Pagefind（推荐，免费，不需要后端）**

   ```bash
   npm install pagefind
   ```

   在 `astro.config.mjs` 中添加集成：

   ```bash
   npx astro add pagefind
   ```

2. **或者使用 Algolia（功能更强，但需要后端/服务器）**

### 添加分析工具

- **Umami** - 开源，自托管，隐私友好
- **Plausible** - 类似，但也有托管版本
- **Cloudflare Web Analytics** - 免费，配合 Cloudflare Pages 使用方便
- **Google Analytics** - 功能丰富，但隐私方面有争议

### 图片优化

使用 Astro 内置的图片优化功能：

```astro
---
import { Image } from 'astro:assets';
import myImage from './my-image.jpg';
---

<Image src={myImage} alt="描述" />
```

### 持续改进

- 关注 Astro 官方博客和更新
- 加入 Astro Discord 社区
- 学习更多 Astro 高级功能

---

## 参考资源

- [Astro 官方文档](https://docs.astro.build/)
- [Astro GitHub 仓库](https://github.com/withastro/astro)
- [Astro Discord 社区](https://astro.build/chat)
- [Astro 主题展示](https://astro.build/themes)
- [Astro 博客模板列表](https://astro.build/themes?filter=blog)

---

## 常见问题

**Q: 我想修改配色方案，应该怎么做？**

A: 修改 `tailwind.config.mjs` 和 `src/styles/global.css`。

**Q: 如何添加新的分类？**

A: 直接在文章的 Frontmatter 中使用新的分类名，系统会自动检测并显示。

**Q: 我想换用 React/Vue 写组件，怎么办？**

A: 使用 `npx astro add react` 或 `npx astro add vue` 安装对应集成，然后就可以使用了。

**Q: 构建失败怎么办？**

A: 检查：
1. `node_modules` 是否正确安装（删除重新 `npm install`）
2. Markdown 文件的 Frontmatter 格式是否正确
3. Astro 和其他依赖的版本兼容性

---

希望这份指南能帮助你更好地理解和使用 Astro！如果有任何问题，欢迎查阅官方文档或在社区寻求帮助。
