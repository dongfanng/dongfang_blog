export const siteConfig = {
  /** 博客名称 */
  name: '东方的博客',

  /** 博客描述 */
  description: '随便写点东西的地方，分享技术学习与生活感悟',

  /** 作者名称 */
  author: '东方',

  /** 头像文字（首页 Banner、关于页等） */
  avatarText: '东',

  /** 博客起始日期（用于运行时间统计） */
  startDate: '2026-07-18T00:00:00',

  /** 站点 URL */
  url: 'https://blog.example.com',

  /** 社交链接 */
  social: {
    github: 'https://github.com/dongfanng/dongfang_blog',
    rss: '/rss.xml',
  },

  /** 首页配置 */
  home: {
    /** 首页显示的最新文章数量 */
    recentPostsCount: 6,
    /** 横幅壁纸配置 */
    banner: {
      /** 背景图片文件名（位于 src/assets/images/ 目录下） */
      image: 'blog-banner.jpg',
      /** 是否显示遮罩 */
      overlay: true,
      /** 遮罩透明度 (0-1) */
      overlayOpacity: 0.5,
      /** 横幅高度 */
      height: '500px',
    },
  },

  /** 导航链接 */
  nav: [
    { title: '首页', href: '/' },
    { title: '文章', href: '/blog' },
    { title: '归档', href: '/archive' },
    { title: '关于', href: '/about' },
  ],
} as const;

