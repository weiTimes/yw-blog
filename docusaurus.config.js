module.exports = {
  title: "Ywhoo's blog",
  tagline: '欢迎光临，这里主要记录了web前端开发相关的一些文章 🚀',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  url: 'https://blog.ywhoo.cn',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docblog', // Usually your repo name.
  themes: ['@docusaurus/theme-live-codeblock'],
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'browser',
        path: './browser',
        sidebarPath: require.resolve('./sidebars.js'),
        routeBasePath: 'browser',
        include: ['**/*.md', '**/*.mdx'],
        showLastUpdateTime: true,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'react',
        path: './react',
        sidebarPath: require.resolve('./sidebars.js'),
        routeBasePath: 'react',
        include: ['**/*.md', '**/*.mdx'],
        showLastUpdateTime: true,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'interview',
        path: './interview',
        sidebarPath: require.resolve('./sidebars.js'),
        routeBasePath: 'interview',
        include: ['**/*.md', '**/*.mdx'],
        showLastUpdateTime: true,
      },
    ],
    [
      // 搜索
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        language: ['en', 'zh'],
        docsRouteBasePath: ['/docs', '/browser'],
        blogRouteBasePath: ['/blog'],
        docsDir: ['docs', 'browser'],
        blogDir: ['blog'],
      },
    ],
  ],
  themeConfig: {
    colorMode: {
      switchConfig: {
        lightIconStyle: { marginRight: '4px' },
        darkIconStyle: { marginRight: '4px' },
      },
    },

    liveCodeBlock: {
      playgroundPosition: 'bottom',
    },
    // algolia: {
    //   algoliaOptions: {},
    //   apiKey: 'UBSXNKMC9S',
    //   indexName: 'ywhoo',
    // },
    navbar: {
      title: 'Ywhoo',
      logo: {
        alt: 'Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: '前端进阶',
          position: 'left',
        },
        { to: 'blog/', label: '博客', position: 'left' },
        {
          to: 'browser/macro-view/navigator-proecess',
          label: '浏览器工作原理',
          position: 'left',
          items: [
            {
              label: '概览',
              to: 'browser/macro-view/navigator-proecess',
            },
          ],
        },
        {
          to: 'react/setstate-how-happen',
          label: 'React深入系列',
          position: 'left',
          items: [
            {
              label: 'React 基础篇',
              to: 'react/basic/jsx',
            },
            {
              label: 'setState做了什么',
              to: 'react/setstate-how-happen',
            },
          ],
        },
        {
          to: 'interview/js-basic',
          label: '前端面试',
          position: 'left',
          items: [
            {
              label: 'Javascript 手写代码题',
              to: 'interview/hardcode/js',
            },
          ],
        },
        {
          label: '技术社区',
          position: 'right',
          items: [
            {
              label: 'Github',
              href: 'https://github.com/weiTimes',
            },
            {
              label: '掘金',
              href: 'https://juejin.im/user/78820566119278/posts',
            },
          ],
        },
      ],
    },
    // footer: {
    //   style: 'dark',
    //   links: [],
    //   copyright: `232323`,
    // },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: 'docs',
          include: ['**/*.md', '**/*.mdx'],
          showLastUpdateTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/weiTimes/yw-blog/edit/master',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/weiTimes/yw-blog/edit/master',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
