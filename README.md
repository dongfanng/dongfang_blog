# 东方的博客

随便写点东西的地方，分享技术学习与生活感悟。

## 技术栈

- [Astro](https://astro.build) - 静态站点生成器
- [Tailwind CSS](https://tailwindcss.com) - CSS 框架
- [TypeScript](https://www.typescriptlang.org) - 类型安全
- [rehype-pretty-code](https://rehype-pretty-code.netlify.app) - 代码高亮

## 功能特性

- ✅ Markdown 文章渲染
- ✅ 文章分类与标签
- ✅ 文章归档（按年份）
- ✅ 置顶文章
- ✅ 响应式设计
- ✅ 暗色/亮色主题切换
- ✅ 代码语法高亮
- ✅ 代码复制按钮
- ✅ 阅读进度条
- ✅ 回到顶部按钮
- ✅ 相关文章推荐
- ✅ 上一篇/下一篇导航
- ✅ RSS Feed 订阅
- 📝 目录导航（预留接口）

## 开发

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

## 部署

### Cloudflare Pages

1. 推送到 GitHub 仓库
2. 在 Cloudflare Pages 导入仓库，构建命令 `npm run build`，输出目录 `dist`
3. 站点地址：https://dongfang-blog.pages.dev

## 项目结构

```
├── public/                  # 静态资源
│   └── favicon.svg          # 网站图标
├── src/
│   ├── components/          # 组件
│   │   ├── BaseHead.astro   # SEO 头部组件
│   │   ├── Header.astro     # 顶部导航栏
│   │   ├── Footer.astro     # 底部栏
│   │   ├── ArticleCard.astro # 文章卡片
│   │   ├── ThemeToggle.astro # 主题切换按钮
│   │   ├── TableOfContents.astro # 目录导航
│   │   ├── VueReadingProgress.vue # 阅读进度条
│   │   └── BackToTop.astro   # 回到顶部按钮
│   ├── content/             # 内容（文章）
│   │   ├── blog/            # 博客文章
│   │   │   └── 2026/       # 按年份组织
│   │   └── config.ts        # Content Collection 配置
│   ├── layouts/             # 布局
│   │   ├── BaseLayout.astro # 基础布局
│   │   └── PostLayout.astro # 文章详情页布局
│   ├── pages/               # 页面路由
│   │   ├── index.astro      # 首页
│   │   ├── about.astro      # 关于页
│   │   ├── archive.astro    # 归档页
│   │   ├── blog/
│   │   │   ├── index.astro  # 文章列表页
│   │   │   ├── [...slug].astro # 文章详情页
│   │   │   ├── categories/[category].astro # 分类页
│   │   │   └── tags/[tag].astro # 标签页
│   │   └── rss.xml.ts       # RSS Feed
│   ├── styles/              # 样式
│   │   └── global.css       # 全局样式
│   └── utils/               # 工具函数
│       ├── date.ts          # 日期处理
│       ├── last-modified.ts # git 最后修改时间
│       ├── posts.ts         # 文章处理
│       └── seo.ts           # SEO（基于 siteConfig）
├── astro.config.mjs         # Astro 配置
├── tailwind.config.mjs      # Tailwind 配置
├── tsconfig.json            # TypeScript 配置
└── package.json
```

## 文章格式

文章使用 Frontmatter 格式：

```markdown
---
title: 文章标题
description: 文章描述（用于 SEO 和预览）
pubDate: 2026-07-18
updatedDate: 2026-07-19  # 可选
category: 前端开发        # 单分类
tags: ["React", "TypeScript"]  # 多标签
draft: false              # 是否为草稿
sticky: 0                 # 是否置顶（数字越大越靠前）
image: /images/cover.jpg  # 封面图（可选）
---

文章内容...
```

## 许可证

MIT
