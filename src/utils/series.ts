/** 系列路径与轻量类型（可在客户端安全引用，勿依赖 astro:content） */

export type SeriesListItem = {
  name: string;
  count: number;
};

/** 系列详情页路径（编码中文 / 空格等） */
export function getSeriesHref(series: string): string {
  return `/blog/series/${encodeURIComponent(series)}`;
}
