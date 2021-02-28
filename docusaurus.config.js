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
  themeConfig: {
    algolia: {
      algoliaOptions: {},
      apiKey: 'UBSXNKMC9S',
      indexName: 'ywhoo',
    },
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
          href: 'https://github.com/weiTimes',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://juejin.im/user/78820566119278/posts',
          label: '掘金',
          position: 'right',
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
