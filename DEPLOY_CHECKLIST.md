# 部署检查清单

部署你的博客前，请检查以下项目：

- [ ] 所有 Markdown 文件格式正确
- [ ] `astro.config.mjs` 中的 `site` 已配置为正确的 URL
- [ ] 构建成功：`npm run build`
- [ ] 没有 TypeScript 错误
- [ ] 所有链接正常工作
- [ ] 所有图片加载正常
- [ ] 404 页面正常（可选）
- [ ] RSS Feed 正常
- [ ] 网站图标已配置
- [ ] SEO 元数据正确

---

## 部署到 Cloudflare Pages 检查清单

- [ ] 代码已推送到 GitHub/GitLab
- [ ] 有 Cloudflare 账号
- [ ] `astro.config.mjs` 已配置正确的 `site`
- [ ] 使用正确的构建命令：`npm run build`
- [ ] 输出目录设置为：`dist`
- [ ] 部署成功后验证网站正常

---

## 部署到 GitHub Pages 检查清单

- [ ] 代码已推送到 GitHub 仓库
- [ ] `astro.config.mjs` 已配置正确的 `site`
- [ ] `astro.config.mjs` 已配置 `trailingSlash: 'always'`
- [ ] GitHub Action 工作流已创建
- [ ] GitHub Pages 设置已配置为使用 Actions
- [ ] 部署成功后验证网站正常

---

## 部署到 Vercel 检查清单

- [ ] 代码已推送到 GitHub/GitLab/Bitbucket
- [ ] 有 Vercel 账号
- [ ] `astro.config.mjs` 已配置正确的 `site`
- [ ] Vercel 会自动检测 Astro 项目
- [ ] 使用默认构建设置即可
- [ ] 部署成功后更新 `site` 配置为分配的域名

---

## 部署后的检查

- [ ] 网站可正常访问
- [ ] 所有链接可跳转
- [ ] 图片正常加载
- [ ] 暗色主题切换正常
- [ ] RSS Feed 可访问
- [ ] 分类和标签页面正常
- [ ] 代码块正确显示
- [ ] 分享按钮（如配置）正常

---

## 配置自定义域名检查清单

- [ ] 域名已购买
- [ ] 在部署平台添加了自定义域名
- [ ] DNS 记录已正确配置
- [ ] SSL/HTTPS 已启用
- [ ] 更新了 `astro.config.mjs` 中的 `site` 为新域名
- [ ] 重新部署生效
