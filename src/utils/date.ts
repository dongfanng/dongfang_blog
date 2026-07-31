/** 站点展示时区（避免本地开发与 Cloudflare 构建机时区不一致） */
const SITE_TIME_ZONE = 'Asia/Shanghai';

/**
 * 格式化日期
 * @param date 日期对象或字符串
 * @param locale 语言环境，默认为 zh-CN
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | string,
  locale: string = 'zh-CN'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    timeZone: SITE_TIME_ZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
