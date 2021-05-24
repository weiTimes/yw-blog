module.exports = {
  someSidebar: {
    关于我: ['about/me'],
    随笔: ['think/front-work'],
    Javascript: [
      {
        type: 'category',
        label: '基础',
        collapsed: false,
        items: [
          'javascript/prototype_extends',
          'javascript/this',
          'javascript/call-apply-bind',
        ],
      },
      {
        type: 'category',
        label: '原理',
        items: ['javascript/theory/stack_heap'],
      },
      {
        type: 'category',
        label: '异步编程',
        items: ['javascript/async/promise', 'javascript/async/generator'],
      },
      {
        type: 'category',
        label: '手写代码',
        items: ['handwritten/handwritten-javascript'],
      },
    ],
    框架: [
      {
        type: 'category',
        label: 'React',
        items: [
          'framework/react-interview',
          'framework/react-vue',
          'framework/react-mini',
          'framework/react-secret',
        ],
      },
    ],
    网络: ['network/perspective-network'],
    架构设计: ['structure/react-ssr'],
    Typescript: ['typescript/base'],
    CSS: ['css/tricks'],
    规范: ['styleguide/commit', 'styleguide/git-flow'],
    nodejs: ['nodejs/koa2-oldisland', 'nodejs/npm-module-install'],
    服务器: ['server/jwt', 'server/mysql-uninstall', 'server/http-auth'],
    工程化: [
      'engineering/webpack-play',
      'engineering/performance-monitoring',
      'engineering/docker-begin',
      'engineering/git-basic',
      'engineering/front-deep-in',
    ],
    性能优化: [
      'optimize/optimize-basic',
      'optimize/optimize-deep',
      'optimize/lighthouse',
    ],
    算法: ['algorithms/algorithms-topics'],
    设计模式: ['design-mode/origin-dev'],
    使用Storybook设计系统: ['storybook/introduce', 'storybook/start'],
    开发工具: ['tools/vim-100s', 'tools/five-ways-vscode'],
    问题: [
      'problem/not-access-github',
      'problem/brew-solve-slow',
      'problem/puppeteer-install',
    ],
    Docusaurus: ['doc1', 'doc2', 'doc3'],
    Features: ['mdx'],
  },
};
