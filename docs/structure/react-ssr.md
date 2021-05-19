---
id: react-ssr
title: 客户端渲染和服务端渲染
---

## 客户端渲染和服务端渲染

### 客户端渲染

优势：

- 节省后端资源
- 局部刷新（路由跳转不需要请求服务器，由前端接管路由）
- 前后端分离
- 可见即可操作（见到了就说明 js 已经加载完成）
- 页面操作流程自然

缺点：

- 首屏渲染时间长
  - SSR: 首屏直出
- SEO 不友好
  - 解决：无头浏览器

### 服务端渲染

优点：

- 首屏直出（只要有 html，解析完成后直接可以看到内容，不需要等待 js 加载完）
- SEO 友好

缺点：

- 页面体验不友好（切页需要等待）
- 可见不一定可操作（js 可能还未加载完）
- 服务器压力大

### React 同构架构

优点：

- SEO 友好（首屏直出）
- 首屏时间快（首屏直出）
- 页面切换自然 SPA（切页有前端控制，不需要请求服务器）

缺点：

- 配置复杂
- 服务器压力大，但相对传统的服务器压力小
- 部分开发受限，有些 api 在服务端没有需要处理

> tip: nrm 管理 npm 镜像

## 实现 react 同构架构

![目录结构](https://ypyun.ywhoo.cn/assets/20210519111224.png)

- `server` 服务端代码
- `client` 客户端代码
- `shared` 公共代码
- `config` webpack 配置

### 服务端实现

需安装的依赖：

- koa
- koa-static 静态服务
- @koa-router 路由
- react
- react-dom
- @types/koa-static
- @types/koa\_\_router

思路：

引入想要渲染的客户端组件，使用 ReactDOMServer 提供的 renderToString 方法，将组件转换成字符串，然后插入模板中的 root 节点内，这样就服务端就完成了首屏直出的功能。

代码：

```javascript title="server/app.tsx"
import Koa from 'koa';
import Router from '@koa/router';
import serve from 'koa-static';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../shared/App';

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
  const app = renderToString(<App />);

  ctx.body = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>react 同构架构</title>
        </head>
        <body>
            <div id="root">${app}</div>
            <script src="bundle.js"></script>
        </body>
    </html>
`;
});

// 静态服务目录 assets，直接可以访问打包出来的 bundle.js
app.use(serve('assets'));
app.use(router.routes()).use(router.allowedMethods());

app.listen(3034, () => {
  console.log('server is listening on http://localhost:3034');
});
```

> 注意：服务端直出的代码只包含静态的代码，不包含 js，还需要将客户端的代码通过 script 的方式引入，如 `<script src="bundle.js"></script>`。

### 公共组件代码实现

导出一个简单的 react 组件

```javascript title="shared/App.tsx"
import React from 'react';

const App = () => {
  return <div>Hi, I'm client react App22~</div>;
};

export default App;
```

### 客户端代码实现

将组件渲染到 root 节点中：

```javascript title="client/index.tsx"
import React from 'react';
import ReactDOM from 'react-dom';

import App from '../shared/App';

ReactDOM.render(<App />, document.getElementById('root'));
```

### 配置客户端和服务端打包

共同的特性：

- 支持 typescript，使用 babel-loader

客户端构建输出到 `assets/bundle.js`，服务端构建输出到 `dist/app.js`。

依赖：

- webpack
- webpack-cil
- webpack-node-externals 在打包时将 node 的环境依赖包排除，运行时会自动引入。

```javascript title="webpack.client.js"
const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    app: path.join(__dirname, '../client/index.tsx'),
  },
  output: {
    filename: 'assets/bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts(x)$/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
};
```

```javascript title="webpack.severjs"
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  entry: {
    app: path.join(__dirname, '../server/app.tsx'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts(x)$/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
};
```

### 执行打包任务和启动服务

配置 scripts:

```json title="package.json"
{
  "scripts": {
    "start": "cd dist && nodemon app.js",
    "build": "npm-run-all --parallel build:*",
    "build:client": "webpack --config config/webpack.client.js",
    "build:server": "webpack --config config/webpack.server.js"
  }
}
```

- 需要并行的执行客户端和服务端的构建任务，需安装 npm-run-all。
- 使用 nodemon 可以在每次构建完，自动监听到文件改动并重启 node 服务。

运行命令：

```shell
# 执行打包任务
yarn build
# 启动服务
yarn start
```

### 配置客户端路由
