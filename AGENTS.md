# AGENTS.md

Astro 博客项目。新建文章统一用 `write_blog` 生成草稿，frontmatter 对齐 `src/content/config.ts`。

## 写文章

```bash
write_blog   # 在桌面生成 draft-YYYYMMDD-HHMMSS.md（带 frontmatter 模板）并打开
```

1. 编辑 frontmatter：填 title/description/tags/category；`draft: true` 为未发布，发布时改 `false`
2. 将文件移入 `src/content/blog/<年份>/<slug>.md`

## 脚本区分（都在 ~/iCloud/DF_LifeMaps/bin，已入 PATH）

- `write_blog`：公开博客草稿（桌面）
- `write_now`：私人日记（iCloud/DF_LifeMaps/Horizon/daily）

## 约定
- `series`/`seriesOrder` 按需填写，无则保持注释

