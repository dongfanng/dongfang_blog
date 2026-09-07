---
title: "图床搭建：GitHub + PicGo + jsdelivr 方案"
description: "记录一套免费可用的图床搭建方案：GitHub 仓库存图、PicGo 上传、jsdelivr 加速，并集成到 Typora 写作流程。后续会补充更多方案。"
pubDate: 2026-09-07
# updatedDate: 2026-09-07
category: 开发工具
tags: [图床, GitHub, PicGo, jsdelivr, Typora]
draft: false
sticky: 0
# image: ""
# series: ""
# seriesOrder: 1
---

## 写在前面

写作时经常需要在笔记和文章里插入图片，而本地图片无法直接在网页上展示。这套方案把图片托管到 GitHub 公开仓库，用 PicGo 一键上传，再通过 jsdelivr 全球 CDN 加速访问，最终能在 Typora 里无缝粘贴图片。

目前已收录一种方案，后续会持续补充（云存储 COS / OSS、GitHub Actions 自动上传、图床工具对比等）。

## 方法一：GitHub + PicGo 搭建图床

适合有 GitHub 账号、需要免费图床的用户；配合 jsdelivr 全球 CDN 加速。

### 1. 新建一个公开仓库

GitHub 新建仓库，用于存放图片。仓库必须是 **public**，否则图片外链无法访问。

### 2. 生成 token

进入 Settings > Developer settings > Personal access tokens > Tokens (classic)：

- Note 填个名字
- 勾选 `repo`（写仓库权限）

token 只显示一次，记得妥善保存。

### 3. 下载 PicGo

PicGo 是桌面端图床工具，支持多种图床。下载地址：

[Releases · Molunerfinn/PicGo (github.com)](https://github.com/Molunerfinn/PicGo/releases)

### 4. 配置 PicGo

在 PicGo 的 GitHub 图床设置中填入以下内容：

| 选项           | 参数                                                         |
| -------------- | ------------------------------------------------------------ |
| 设定仓库名     | `<your-github-username>`/image_for_picGo                     |
| 设定分支名     | main                                                         |
| 设定 token     | token                                                        |
| 设定存储路径   | img/                                                         |
| 设定自定义域名 | `https://raw.githubusercontent.com/<your-github-username>/image_for_picGo@main` |

### 5. 集成 Typora

在 Typora 的「偏好设置 → 图像」中，上传服务选择 PicGo，并确保 PicGo 监听端口为 **36677**，与 Typora 图片验证中的端口一致。

### 6. 使用 jsdelivr 加速

GitHub 原生图片域名（raw.githubusercontent.com）在国内访问有时较慢，可改用 jsdelivr 做全球 CDN 加速，把 PicGo 的“自定义域名”改为：

```
https://cdn.jsdelivr.net/gh/你的GitHub用户名/仓库名@分支名/
```

例子：

```
https://cdn.jsdelivr.net/gh/<your-github-username>/img_for_picGo@main

https://raw.githubusercontent.com/<your-github-username>/img_for_picGo@main
```

> jsdelivr 域名在国内访问通常比 raw.githubusercontent.com 更稳定；raw 域名适合作为备用。

