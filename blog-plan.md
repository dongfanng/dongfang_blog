# 博客规划文档

> 创建日期：2026-07-18
> 最后更新：2026-07-18

## 一、博客概述

### 1.1 博客信息
- **博客名称**：东方的博客
- **博客副标题**：随便写点东西的地方
- **博客域名**：待定
- **GitHub 仓库**：https://github.com/dongfanng/df_blog

### 1.2 定位与目标
- **内容定位**：混合博客 - 技术文章 + 个人随笔
- **目标读者**：开发者、技术爱好者、关注个人成长的朋友
- **核心目标**：
  - 记录技术学习与实践经验
  - 分享个人思考与生活感悟
  - 建立个人技术品牌
  - 与志同道合的朋友交流

---

## 二、技术选型

### 2.1 核心框架
- **框架**：Astro
  - 理由：现代化静态站点生成器，性能优秀
  - 支持多种 UI 框架集成（React、Vue、Svelte 等）
  - 丰富的官方主题和社区资源
  - 优秀的开发体验和构建性能

### 2.2 技术栈详情

| 类别 | 技术选型 | 说明 |
|------|---------|------|
| 核心框架 | Astro | 静态站点生成器 |
| UI 组件 | 可选 React/Vue | 用于复杂交互组件 |
| 样式方案 | Tailwind CSS | 实用优先的 CSS 框架 |
| Markdown | Astro 内置 | MDX 支持（可选） |
| 部署 | GitHub Pages / Vercel | 自动化部署 |
| 评论系统 | Giscus | 基于 GitHub Discussions |

---

## 三、功能特性

### 3.1 核心功能

#### 内容管理
- [ ] Markdown/MDX 文章渲染
- [ ] 文章分类（Categories）
- [ ] 文章标签（Tags）
- [ ] 文章归档（按年份/月份）
- [ ] 草稿文章支持
- [ ] 文章置顶功能

#### 用户体验
- [ ] 响应式设计（移动端优先）
- [ ] 暗色/亮色主题切换
- [ ] 文章阅读进度条
- [ ] 目录导航（TOC）
- [ ] 代码语法高亮
- [ ] 代码复制按钮
- [ ] 图片懒加载与优化
- [ ] 回到顶部按钮

#### 搜索与导航
- [ ] 全文搜索（基于本地索引或 Algolia）
- [ ] 主导航栏
- [ ] 侧边栏（分类/标签/归档）
- [ ] 面包屑导航
- [ ] 相关文章推荐

#### 互动功能
- [ ] Giscus 评论系统
- [ ] 文章点赞/收藏（可选）
- [ ] 分享到社交媒体

#### 订阅与通知
- [ ] RSS Feed 订阅
- [ ] Sitemap 生成

#### 统计与分析
- [ ] 访问统计（PV/UV）
- [ ] 可选：Google Analytics / Umami

### 3.2 页面结构

```
首页
├──  Hero 区域（博客名称、简介、头像）
├──  最新文章列表
├──  分类/标签概览
└──  页脚

文章列表页
├──  分类筛选
├──  标签筛选
├──  文章卡片列表
└──  分页 / 无限加载

文章详情页
├──  文章标题与元信息（日期、分类、标签）
├──  文章内容
├──  文章目录（TOC）
├──  上/下一篇导航
├──  相关文章推荐
└──  评论区

分类页
├──  分类列表
└──  该分类下的文章

标签页
├──  标签云
└──  该标签下的文章

归档页
├──  按年份分组的文章列表

关于页
├──  个人介绍
├──  社交链接
└──  友情链接（可选）
```

---

## 四、内容规划

### 4.1 内容分类

#### 技术类
- **前端开发** - HTML/CSS/JavaScript/TypeScript/React/Vue 等
- **后端开发** - Node.js/Python/Go 等
- **工具与效率** - 开发工具、工作流、CLI 等
- **工程实践** - 架构设计、性能优化、测试等

#### 个人类
- **读书笔记** - 读书心得、好书推荐
- **生活随笔** - 生活感悟、旅行记录
- **个人成长** - 学习方法、思考方式、职业发展

### 4.2 文章元数据格式

每篇文章使用 Frontmatter 格式：

```markdown
---
title: 文章标题
description: 文章描述（用于 SEO 和预览）
pubDate: 2026-07-18
# 更新日期（可选）
updatedDate: 2026-07-19
# 分类（单分类）
category: 前端开发
# 标签（多标签）
tags: ["React", "TypeScript", "性能优化"]
# 是否草稿
draft: false
# 是否置顶（数字越大越靠前）
sticky: 0
# 封面图（可选）
image: /images/cover/article-cover.jpg
---

文章内容...
```

### 4.3 内容目录结构

```
src/
├── content/
│   ├── blog/
│   │   ├── 2024/
│   │   │   ├── article-1.md
│   │   │   └── article-2.md
│   │   ├── 2025/
│   │   └── 2026/
│   └── config.ts  # Content Collection 配置
└── ...
```

---

## 五、项目目录结构

```
df-blog/
├── public/
│   ├── images/          # 图片资源
│   │   ├── avatars/     # 头像
│   │   ├── covers/      # 文章封面
│   │   └── posts/       # 文章内图片
│   └── favicon.ico      # 网站图标
├── src/
│   ├── assets/          # 静态资源（CSS、字体等）
│   ├── components/      # Astro/React 组件
│   │   ├── BaseHead.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ArticleCard.astro
│   │   ├── TableOfContents.astro
│   │   ├── Comments.astro
│   │   └── ThemeToggle.astro
│   ├── content/         # 内容目录（Content Collections）
│   │   └── blog/
│   │       └── *.md
│   ├── layouts/         # 页面布局
│   │   ├── BaseLayout.astro
│   │   ├── BlogLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/           # 页面路由
│   │   ├── index.astro              # 首页
│   │   ├── blog/
│   │   │   ├── index.astro          # 文章列表
│   │   │   ├── [...slug].astro      # 文章详情
│   │   │   ├── categories/
│   │   │   │   └── [category].astro # 分类页
│   │   │   └── tags/
│   │   │       └── [tag].astro      # 标签页
│   │   ├── archive.astro            # 归档页
│   │   └── about.astro              # 关于页
│   └── utils/           # 工具函数
│       ├── date.ts
│       ├── posts.ts
│       └── seo.ts
├── astro.config.mjs     # Astro 配置
├── tailwind.config.mjs  # Tailwind 配置
├── package.json
├── tsconfig.json
└── README.md
```

---

## 六、设计规范

### 6.1 配色方案

#### 亮色主题
- 主色：#3b82f6（蓝色）
- 背景：#ffffff
- 文本：#1f2937
- 次要文本：#6b7280
- 边框：#e5e7eb
- 代码块背景：#f3f4f6

#### 暗色主题
- 主色：#60a5fa
- 背景：#111827
- 文本：#f9fafb
- 次要文本：#9ca3af
- 边框：#374151
- 代码块背景：#1f2937

### 6.2 排版

- **字体**：
  - 中文：系统默认无衬线字体
  - 英文：Inter 或系统默认
  - 代码：Fira Code、JetBrains Mono 等等宽字体

- **字号层级**：
  - H1: 2.25rem (36px)
  - H2: 1.875rem (30px)
  - H3: 1.5rem (24px)
  - H4: 1.25rem (20px)
  - 正文: 1rem (16px)
  - 小字: 0.875rem (14px)

### 6.3 响应式断点

- `sm`: 640px（手机横屏）
- `md`: 768px（平板）
- `lg`: 1024px（小屏笔记本）
- `xl`: 1280px（桌面）

---

## 七、开发与部署

### 7.1 开发步骤

#### 阶段一：项目初始化
1. 创建 Astro 项目
2. 配置 Tailwind CSS
3. 配置 TypeScript
4. 初始化 Git 仓库

#### 阶段二：基础架构
1. 创建基础布局组件
2. 配置 Content Collections
3. 实现主题切换（暗色/亮色）
4. 配置 SEO 元数据

#### 阶段三：核心页面
1. 首页
2. 文章列表页
3. 文章详情页
4. 分类/标签页
5. 归档页
6. 关于页

#### 阶段四：功能增强
1. 全文搜索
2. 目录导航（TOC）
3. 阅读进度条
4. 代码高亮与复制
5. 图片优化

#### 阶段五：互动功能
1. 集成 Giscus 评论系统
2. RSS Feed
3. Sitemap 生成

#### 阶段六：部署上线
1. 配置 GitHub Actions / Vercel
2. 配置自定义域名（可选）
3. 性能优化

### 7.2 部署方案

#### 方案 A：GitHub Pages + GitHub Actions
- 优点：免费、与 GitHub 集成好
- 缺点：构建速度稍慢

#### 方案 B：Vercel
- 优点：极速构建、CDN 全球加速、预览部署
- 缺点：私有仓库有配额限制（个人使用足够）

**推荐方案**：Vercel

### 7.3 Git 工作流

- `main` 分支：生产环境
- `dev` 分支：开发环境（可选）
- 功能分支：`feature/xxx`

提交信息规范：
```
feat: 新增功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
chore: 构建/工具相关
```

---

## 八、配置清单

### 8.1 Giscus 配置
- 仓库：`dongfanng/df_blog`
- 分类：`Announcements`（需在仓库设置中启用 Discussions）
- categoryId：从 Giscus 配置页面获取

### 8.2 环境变量（可选）

```env
# 如果使用 Algolia 搜索
PUBLIC_ALGOLIA_APP_ID=xxx
PUBLIC_ALGOLIA_SEARCH_KEY=xxx
PUBLIC_ALGOLIA_INDEX_NAME=xxx

# 如果使用 Analytics
PUBLIC_UMAMI_WEBSITE_ID=xxx
```

---

## 九、待办事项

### MVP 版本（第一阶段）
- [ ] Astro 项目初始化
- [ ] 基础布局与导航
- [ ] Markdown 文章渲染
- [ ] 文章列表与详情页
- [ ] 分类/标签功能
- [ ] 响应式设计
- [ ] 暗色/亮色主题
- [ ] 部署到 Vercel

### 增强版本（第二阶段）
- [ ] 全文搜索
- [ ] 目录导航（TOC）
- [ ] 阅读进度条
- [ ] 代码复制功能
- [ ] Giscus 评论系统
- [ ] RSS Feed

### 优化版本（第三阶段）
- [ ] 图片优化
- [ ] 性能优化
- [ ] SEO 优化
- [ ] 访问统计
- [ ] 相关文章推荐

---

## 十、参考资源

### 官方文档
- [Astro 文档](https://docs.astro.build/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Giscus 文档](https://giscus.app/)

### 主题参考
- [AstroPaper](https://github.com/satnaing/astro-paper)
- [Cactus](https://github.com/chrismwilliams/astro-theme-cactus)
- [Fuwari](https://github.com/saicaca/fuwari)

---

## 附录

### A. 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### B. 文章写作规范

1. **文件名**：使用 kebab-case，如 `my-first-article.md`
2. **标题层级**：H1 仅用于文章标题，正文从 H2 开始
3. **图片**：建议使用 WebP 格式，宽度不超过 1200px
4. **代码块**：指定语言类型以获得正确的语法高亮
5. **链接**：内部链接使用相对路径，外部链接添加 `target="_blank"`

---

*本规划文档会根据实际开发进度持续更新。*
