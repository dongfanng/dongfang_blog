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

/**
 * 格式化日期时间（YYYY/MM/DD HH:mm:ss，固定为 Asia/Shanghai）
 * @param date 日期对象或字符串
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SITE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(d);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '00';

  return `${get('year')}/${get('month')}/${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`;
}
