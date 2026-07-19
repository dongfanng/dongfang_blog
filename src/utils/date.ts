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
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 格式化日期为 ISO 格式（用于 RSS 等）
 */
export function formatDateISO(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

/**
 * 获取年份
 */
export function getYear(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.getFullYear();
}
