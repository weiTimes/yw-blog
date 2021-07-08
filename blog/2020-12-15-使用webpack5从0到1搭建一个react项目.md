---
slug: webpack5-start
title: 使用webpack5从0到1搭建一个react项目
author: 叶威
author_title: 前端攻城狮
author_url: https://github.com/weiTimes
author_image_url: https://avatars2.githubusercontent.com/u/21688593?s=460&u=09db1866a0350eb8c4dd0389b22a596d2b081b4b&v=4
tags: [前端工程化, webpack5]
description: ''
---

## 前言

在这之前，每开始一个新项目我都是使用现有的脚手架，这非常便于快速地启动一个新项目，而且通用的脚手架通常考虑地更加全面，也有利于项目的稳定开发；不过对于一个小项目，根据需求自己搭建可能会更好，一方面小项目不需要脚手架那么丰富的功能，另一方面可以提高对项目的掌控度以方便后期的扩展。

这篇文章是在实践中总结的，具有实操性，读者可跟着一步步进行搭建，中间我会穿插一些原理，当然因为笔者的能力有限，不会特别深入。

**预备知识**

- 熟悉 Javascript && HTML && CSS
- 熟悉 ES6+
- 有能力搭建 Nodejs 环境
- 会用命令行

<!--truncate-->

**目标**

- 学习使用 webpack5 和为什么使用它
- 用 webpack5 搭建开发环境
- 用 webpack5 搭建生产环境

## 什么是 webpack

这有点老生常谈了，不过为了新同学能够看下去，在这里简单介绍一下。一个现代化的 web 应用，已经不是单纯地优 html、css、javascript 组成的，它还需要对应用进行打包、压缩和编译成浏览器能够理解的代码，于是 webpack 就开始流行起来了。

webpack 是一个模块打包器，它可以打包任何东西。你可以在开发时使用最新的 Javascript 特性或 Typescirpt，webpack 会将它编译成浏览器支持的代码并压缩它；你还可以在 Javascript 中导入需要用到的静态资源。

在开发过程中，webpack 提供了开发服务器并支持 HMR，什么是 HMR 和怎么配置后面会详细介绍，现在我们只要知道当我们保存代码的时候 webpack 会帮我们自动重新编译和刷新浏览器。

webpack 的能做的远不止这些，这篇文章主要是帮助你熟悉基本概念和如何去配置自己的脚手架。

## 开始搭建

这篇文章算是一个较为完整的实战教程，目标是搭建一个可用的脚手架，在此基础上可以扩展出更多的功能。

**架构需要支持的特性**

\- [x] Webpack5

\- [x] 命令行友好提示

\- [x] es6+

\- [x] React

\- [x] Typescript

\- [x] PostCSS + cssnext

\- [x] HMR

### 安装 webpack

新建一个项目，进入项目根目录，创建默认的`package.json`

```shell
yarn init -y
```

安装`webpack`和`webpack-cli`

- `webpack` - 模块打包库
- `webpack-cli` - 命令行工具

```shell
yarn add webpack webpack-cli -D
```

### 基础配置

在根目录下新建一个`webpack.config.js`

**Entry**

入口文件，webpack 会首先从这里开始编译

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  entry: {
    app: './src/index.js',
  },
};
```

**Output**

定义了打包后输出的位置，以及对应的文件名。`[name]`是一个占位符，这里是根据我们在`entry`中定义的 key 值，即等价于 app

```javascript
module.exports = {
  /* ... */

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
};
```

确保 src 下有 index.js，然后现在可以使用我们的最小化配置进行打包。在`package.json`中加入以下代码

```json
"scripts": {
  "build": "webpack"
}
```

运行该命令

```shell
yarn run build
```

可以在命令行中看到打包的结果，并且在根目录下生成了一个 dist 目录，说明打包成功。

### Plugins

插件使 webpack 具备可扩展性，可以让我们支持更多的功能。

**模板文件**

当我们构建一个 web app 的时候，我们需要一个 HTML 页，然后再 HTML 中引入 Javascript，当我们配置了打包输出的 bundle 文件是随机字符串时，每次手动更新就特别麻烦，所以最好的方法是可以自动将 bundle 打包进 HTML 中。

- Html-webpack-plugin - 从模板生成一个 HTML 文件

安装

```shell
yarn add html-webpack-plugin -D
```

在根目录下新建一个文件`public/index.html`，内容如下

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>
```

其中 title 是读取`html-webpack-plugin`插件的配置，配置如下

```javascript
// webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  /* ... */

  plugins: [
    new HtmlWebpackPlugin({
      title: '铁木真大屏展示',
      template: path.resolve(__dirname, './public/index.html'),
      filename: 'index.html',
    }),
  ],
};
```

现在我们再次运行`yarn run build`，可以看到`dist`下多了一个`index.html`，其中自动插入了标题和 script，效果如下

![image-20201215104729535](https://i.loli.net/2020/12/15/mrtKCvD7qj9PnxG.png)

**打包前清除`dist`**

- `clean-webpack-plugin` - 打包前移除/清理 打包目录

安装

```shell
yarn add clean-webpack-plugin -D
```

配置

```javascript
const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  /* ... */

  plugins: [
    /* ... */
    new CleanWebpackPlugin(),
  ],
};
```

**命令行友好提示**

安装

```shell
yarn add friendly-errors-webpack-plugin -D
```

配置

```javascript
// webpack.config.js
const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  plugins: [new friendlyErrorsWebpackPlugin()],
};
```

### Loaders

webpack 使用 loaders 去解析模块，webpack 想要去如何理解 Javascript、静态资源（图片、字体、css）、转移 Typescript 和 Babel，都需要配置相应的 loader 规则。

在项目中只有一个 HTML 和一些 Javascript 是没什么用的，我们还需要 webpack 能够做一些事：

- 将最新的 Javascript 特性编译成浏览器理解的
- 模块化 CSS，将编译 SCSS、cssnext 编译成 CSS
- 导入图片、字体等静态资源
- 使用自己喜爱的框架，如 React

**Babel**

Babel 是一个 JavaScript 编译器，能将 ES6 代码转为 ES5 代码，让你使用最新的语言特性而不用担心兼容性问题，并且可以通过插件机制根据需求灵活的扩展，我们需要先安装以下库

```shell
yarn add babel-loader @babel/core -D
```

- `babel-loader` - 使用 Babel 和 webpack 转译文件
- `@babel/core` - 转译 ES2015+的代码

配置如下

```javascript
// webpack.config.js
module.exports = {
  /* ... */

  module: {
    rules: [
      // JavaScript
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
```

在 Babel 执行编译的过程中，会从项目根目录下的配置文件读取配置。在根目录下创建 Babel 的配置文件`babel.config.json`

```json
{
  "presets": ["@babel/preset-env"]
}
```

如果未安装`@babel/preset-env`需要先安装

```shell
yarn add @babel/preset-env -D
```

**图片和字体**

解析图片的 loader 配置

```javascript
module.exports = {
  /* ... */
  module: {
    rules: [
      // Images
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
```

解析字体文件的 loader 配置

```javascript
module.exports = {
  /* ... */
  module: {
    rules: [
      // Fonts and SVGs
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
    ],
  },
};
```

**样式**

现在我们希望能够在 Javascript 中导入 CSS，以及将 CSS 注入 DOM，另外还想使用 CSS 的高级特性，如 cssnext，需要依赖一下库

- `css-loader` - 解析 CSS 导入
- `style-loader` - 将 CSS 注入 DOM
- `postcss-loader` - 用 PostCSS 处理 CSS

  - `postcss-preset-env` - PostCSS 的默认配置

- `postcss` - PostCSS 是一个允许使用 JS 插件转换样式的工具。 这些插件可以检查（lint）你的 CSS，支持 CSS Variables 和 Mixins， 编译尚未被浏览器广泛支持的先进的 CSS 语法，内联图片，以及其它很多优秀的功能。

- `postcss-next` - PostCSS 的插件，可以使用 CSS 最新的语法

安装

```shell
yarn add css-loader style-loader postcss-loader postcss-preset-env postcss postcss-cssnext -D
```

新建 PostCSS 配置文件`postcss.config.js`，配置如下

```javascript
module.exports = {
  plugins: {
    'postcss-preset-env': {
      browsers: 'last 2 versions',
    },
  },
};
```

配置 loader

```javascript
// webpack.config.js

module.exports = {
  /* ... */
  module: {
    rules: [
      // CSS, PostCSS, and Sass
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
};
```

### 开发环境

让我们从设置配置为开发模式开始，表示当前的配置的配置为开发环境的配置

```javascript
// webpack.config.js

module.exports = {
  mode: 'development',
  // ...
};
```

**使用 source maps**

为了在报错的时候更好的追踪代码和给出错误代码出现的地方的提示，我们可以使用`source map`，配置如下

```javascript
// webpack.config.js

module.exports = {
  devtool: 'inline-source-map',
  // ...
};
```

**HMR**

当我们改动代码时，希望能自动重新编译代码，webpack 提供了三种不同的方式：

1. 监听模式
2. webpack-dev-server
3. webpack-dev-middleware

大多数情况，使用的是`webpack-dev-server`，本文也是使用这个，不过我会顺带介绍一下其它两种方式，大家各取所需。

- 使用监听模式：

```json
// package.json
{
  "watch": "webpack --watch"
}
```

执行以下命令

```shell
yarn run watch
```

现在当我们保存代码的时候会自动编译代码，刷新浏览器后即可看到效果；但是我们想要自动刷新浏览器怎么办，这时候就轮到`webpack-dev-server`商场了。

- webpack-dev-server

它为我们提供了一个服务器和`live relaoding`的能力，我们需要首先安装它

```shell
yarn add webpack-dev-server -D
```

然后配置如下

```javascript
// webpack.config.js
module.exports = {
  // ...
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, './dist'),
    open: false,
    hot: true,
    quiet: true,
    port: 8082,
  },
};
```

```json
// package.json
{
  "scripts": {
    "start": "webpack serve"
  }
}
```

我们在 8082 端口监听了一个服务，监听的目录是`dist`，并且支持 HMR，现在打开`http://localhost:8082`，可以看到我们的页面，然后改动代码，浏览器会自动刷新更新效果，是不是很酷！

上面提到了 HMR，它的全称是 Hot Module Replacement，翻译过来就是热模块替换，我认为它是 webpack 提供的最有用的一个特性，它允许我们只更新改动过的模块，而不需有全部更新，我们在上面已经开启了该功能，即`hot: true`。

- webpack-dev-middleware

这是一个 webpack 的中间件，可以让 webpack 把文件交给一个服务器处理，比如接下来要使用的`express`，这给了我们更多的控制权，接下来简单演示一下。

安装`express`和`webpack-dev-middleware`

```shell
yarn add express webpack-dev-middleware -D
```

更改配置

```javascript
module.exports = {
  //...
  output: {
    //...
    publicPath: '/',
  },
};
```

`publicPath`可以定义了 express`监听服务的路径，接下来就创建我们的`express`服务器

新建一个`server.js`

```javascript
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```

监听端口为 3000，执行以下命令启动服务

```javascript
node server.js
```

方便起见，可以将该命令加入`package.json`

```json
{
  //...
  "scripts": {
    "server": "node server.js"
  }
}
```

## 使用 Typescript

安装依赖

```shell
yarn add typescript ts-loader -D
```

在根目录下创建`typescript`的配置文件`tsconfig.json`，具体配置如下

```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    // "rootDir": "./src",
    "sourceMap": true, // 开启sourcemap
    "module": "commonjs",
    "target": "es5",
    "jsx": "react",
    "esModuleInterop": true,
    "allowJs": true,
    "strict": true
  }
}
```

```javascript
// webpack.config.js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
```

## 使用 React

在上面配置`typescript`中，已经开启了支持 react，现在只需安装 react 的依赖即可

```shell
yarn add react react-dom @types/react @types/react-dom
```

然后将入口文件改成`.tsx`后缀，内容如下

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

const App = () => {
  return <div>hello world2</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
```

## 代码规范

### Prettier

Prettier 是一个诞生于 2016 年就迅速流行起来的专注于代码格式化的工具。出道即巅峰啊-.-
`Prettier`只关注格式化，并不具有 lint 检查语法等能力。它通过解析代码并匹配自己的一套规则，来强制执行一致的代码展示格式。
它在美化代码方面有很大的优势，配合 ESLint 可以对 ESLint 格式化基础上做一个很好的补充。

**使用**

以 VSCode 为例，安装 Prettier 插件即可使用，如果想自定义配置，可以`cmd+,`快捷键进入 vscode 配置，搜索 Prettier 找到对应的配置项进行配置。

### Eslint

ESLint 是一个在 JavaScript 代码中通过规则模式匹配作代码识别和报告的插件化的检测工具，它的目的是保证代码规范的一致性和及时发现代码问题、提前避免错误发生。
ESLint 的关注点是代码质量，检查代码风格并且会提示不符合风格规范的代码。除此之外 ESLint 也具有一部分代码格式化的功能。

安装依赖，方便起见，直接使用已有的 Eslint 配置，这里使用的是`fabric`

```shell
yarn add @umijs/fabric -D
```

根目录下新建`.eslintrc.js`，配置如下

```javascript
module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {},
  plugins: ['react-hooks'],
  rules: {
    'no-restricted-syntax': 0,
    'no-param-reassign': 0,
    'no-unused-expressions': 0,
  },
};
```

重启编辑器，即可应用 Eslint 的配置。

## 总结

到目前为止，我们搭建了一个简易的 react 脚手架，并且它支持`typescript`、`cssnext`、HMR 等特性，对于一个小项目来说已经足够用了，大家可以在此基础上进行扩展；后面有时间的话会和大家一起讨论一下 webpack 稍底层的原理，是从源码的角度去看。

## 附录

[how-to-use-webpack](https://www.taniarascia.com/how-to-use-webpack/)

[webpack 官网](https://webpack.js.org/)
