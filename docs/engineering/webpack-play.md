---
id: webpack-play
title: 玩转webpack
---

> 我将源码放在我的仓库中，可以对照着文档阅读。源码地址：[玩转 webpack](https://github.com/weiTimes/source-code-realize/tree/master/play-webpack)

## 前言

本篇长文是学习程柳峰老师开设的《玩转 webpack》专栏的实践笔记，和专栏不一样的是，我的实战源码是基于 webpack5，它的配置和源码实现上与 webpack4 有许多不同的地方，感兴趣的同学可以结合我在上面放出的源码仓库进行学习，相信会有不小的收获。

## 初识 webpack

配置文件：`webpack.config.js`

webpack 配置组成：

![webpack 配置组成](https://ypyun.ywhoo.cn/assets/20210507112149.png)

安装 webpack：

```shell
yarn add webpack webpack-cli -D
```

通过命令行执行 webpack：

```shell
./node_modules/.bin/webpack
```

通过 npm script 运行 webpack：

> 原理：在 `node_modules/.bin` 目录中创建软连接

```shell
yarn run build
```

## webpack 基础用法

### 核心概念之 entry

> 指定 webpack 打包的入口。

![依赖图](https://ypyun.ywhoo.cn/assets/20210507114135.png)

依赖图(构建机制)：webpack 会将所有的资源都当成是模块处理，从入口文件开始，递归地解析依赖模块，形成一颗依赖树，递归完成后，输出构建后的资源。

使用方法

单入口：entry 的值是字符串

```javascript
module.exports = {
  entry: './src/index.js',
};
```

多入口：entry 的值是对象

```javascript
module.exports = {
  entry: {
    main: './src/index.js',
  },
};
```

### 核心概念之 output

> 告诉 webpack 将构建后的资源存放在磁盘的什么地方

使用方法

单入口：

```javascript
module.exports = {
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '/dist'),
  },
};
```

多入口：

通过占位符确保文件名称的唯一

```javascript
module.exports = {
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '/dist'),
  },
};
```

### 核心概念之 loader

webpack 默认只支持 js 和 json 两种文件类型，通过 loader 可以配置其它文件类型的解析规则，从而让 webpack 将其它文件的类型加到依赖图中。

本身是一个函数，接收源文件作为参数，返回转换的结果

![常用loader](https://ypyun.ywhoo.cn/assets/20210507125459.png)

使用方法

```javascript
module.exports = {
  module: {
    rules: [{ test: /\.txt/, use: 'raw-loader' }],
  },
};

// 配置项
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt/,
        use: {
          loader: 'raw-loader',
          options: {},
        },
      },
    ],
  },
};
```

### 核心概念之 plugin

plugin 用于 bundle 文件的优化，资源管理和环境变量注入，作用于整个构建过程。

![常用 plugin](https://ypyun.ywhoo.cn/assets/20210507130705.png)

### 核心概念之 mode

mode 指定构建环境：production/development/none。

![内置函数](https://ypyun.ywhoo.cn/assets/20210507134339.png)

### 解析 es6 和 jsx

#### 解析 es6

使用 babel-loader，babel 的配置文件是 `babel.config.json`

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": ["@babel/proposal-class-properties"]
}
```

`presets` 是一系列 plugin 的集合，表示预设项，`plugin` 特定某一项功能。

安装依赖

```shell
yarn add @babel/core @babel/preset-env babel-loader -D
```

配置 loader

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
```

### 解析 jsx

安装依赖

```shell
yarn add react react-dom @babel/preset-react
```

```json title="babel.config.json"
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

### 解析 css/less/sass

#### 解析 css

css-loader 用于加载 .css 文件，将其转换成 commonjs 对象

style-loader 将样式通过 `<style>` 标签注入到 head 中

```javascript title="webpack.config.js"
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

loader 的解析规则是从右往左，也就是先使用 css-loader 解析文件，然后把处理结果交给 style-loader。

#### 解析 less

安装依赖

```shell
yarn add less less-loader -D
```

```javascript title="webpack.config.js"
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
};
```

### 解析图片和字体资源

#### 使用 file-loader

安装 file-loader

```shell
yarn add file-loader
```

```javascript title="webpack.config.js"
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf)$/,
        use: ['file-loader'],
      },
    ],
  },
};
```

#### 使用 url-loader

可以设置小资源自动 base64

```javascript title="webpack.config.js"
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf)$/,
        use: [{ loader: 'file-loader', options: { limit: 10240 } }],
      },
    ],
  },
};
```

#### 使用 webpack5 的内置 asset

在 webpack5 之前的版本中，常用的 loader 如下：

- raw-loader 将模块处理成字符串
- url-loader 可以设置指定的资源大小，如果小于设置的大小则内联进 bundle。
- file-loader 将文件发送到输出目录

在 webpack5 中，asset modules 替换了上述的 loader，添加了 4 中内置类型：

- asset/resource 之前由 file-loader 实现
- asset/inline 之前由 url-loader 实现
- asset/source 导出资源的源码（字符串类型），之前由 raw-loader 实现
- asset 可以自动选择导出为 data URI 还是直接发送文件，之前由 url-loader 实现。

解析图片和字体资源时，希望在限制的大小内将资源导出为 data URI，而超过的资源直接将文件发送到输出目录，所以使用 `asset`：

```javascript title="webpack.dev.js"
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10kb
          },
        },
      },
    ],
  },
};
```

### 监听文件和热更新

#### watch

> 监听文件的改动，自动构建

```json title="package.json"
{
  "scripts": {
    "watch": "webpack --watch"
  }
}
```

文件监听原理解析：

- 轮询判断文件的最后编辑时间是否变化
- 某个文件发生了变化并不会立刻告诉监听者，而是先缓存起来，等 `aggregateTimeout` 到期再执行构建任务

```javascript title="webpack.config.js"
module.exports = {
  watch: true, // 开启监听
  watchOptions: {
    // 默认为空，忽略监听的文件夹，可以提升一定性能
    ignored: /node_modules/,
    // 判断文件变化是通过不停地询问系统指定文件有没有变化实现的，每秒询问 1 次
    poll: 1000,
    // 监听到变化后的 300ms 后再去执行
    aggregateTimeout: 300,
  },
};
```

#### 热更新-WDS

webpack-dev-server:

- 不刷新浏览器
- 不输出文件，而是放在内存中（构建速度有更大的优势）
- 使用 HotModuleReplacementPlugin

安装依赖：

```shell
yarn add webpack-dev-server -D
```

```javascript title="webpack.config.js"
module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    hot: true,
    open: true,
    quiet: true,
    port: 8082,
  },
};
```

```json title="package.json"
{
  "scripts": {
    "serve": "webpack serve"
  }
}
```

> 注意：如果有多个入口，但只配置了一个 HtmlWebpackPlugin，多个 chunk 都会被插入到生成的 html 中，此时热更新无法正常使用。

#### 热更新-WDM

webpack-dev-middleware：这是一个 express 的中间件，可以让 webpack 把文件交给一个服务器处理，比如接下来要使用的 express，这给了我们更多的控制权。

安装依赖

```shell
yarn add express webpack-dev-middleware -D
```

```javascript title="webpack.config.js"
module.exports = {
  output: {
    publicPath: '/',
  },
};
```

```javascript title="server.js"
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config');
const compiler = webpack(config);

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

app.listen(8081, function () {
  console.log('server is running on port 8081');
});
```

启动服务 `node server.js`

#### 热更新原理

![原理分析](https://ypyun.ywhoo.cn/assets/20210507165203.png)

概念：

- webpack compiler: 将 js 编译成 bundle
- bundle server: 提供一个服务，使文件在浏览器中访问
- HMR Server: 将热更新的文件输出给 HMR runtime
- HMR runtime: 会被注入到 bundle 中，用于更新文件（使用 websocket 和服务端通信）
- bundle.js 构建产物

1. 启动阶段：首先源代码通过 webpack compiler 被编译成 bundle.js，然后提交到 bundle server，浏览器就可以在该服务下访问文件。
2. 变化阶段：WDS 每隔一段时间会去检测文件最后编辑的时间是否发生变化，一旦发现有，就将其加入到缓存列表，等到 `aggregateTimeout` 到期时，将缓存列表发送给 webpack compiler 编译，编译后的代码交给 HMR server，HRM server 再通知 HMR runtime 变化的文件（以 json 格式传输），HMR runtime 再去更新响应的模块代码。

### 文件指纹策略：chunkhash/contenthash/hash

> 文件指纹：打包后输出文件的文件名，通常用作版本管理，只更新修改的文件内容，未更新的文件指纹不会改变，仍然可以使用浏览器的缓存。

常见的文件指纹：

- hash: 和整个项目的构建相关，只要项目文件有改动，整个项目构建的 hash 值就会变化。
  - 打包阶段有 compile 和 compilation，webpack 启动时会创建一个 compile 对象，只要文件发生变化，compilation 就会发生变化，对应地， hash 值就会发生变化。
  - A 页面发生变化，B 页面未发生变化，但是 hash 也发生了变化。
- chunkhash：和 webpack 打包的 chunk（入口） 有关，不同的 entry 会生成不同的 chunkhash。
  - js 一般采用 chunkhash。
- contenthash: 根据内容来定义 hash，文件内容不变，contenthash 则不变。
  - css 一般使用 contenthash。

#### 文件指纹的设置

> 只能在生产环境下使用

js 文件的文件指纹设置

```javascript
module.exports = {
  output: {
    filename: '[name]_[chunkhash:8].bundle.js',
  },
};
```

css 的文件指纹设置：使用 `mini-css-extract-plugin` 将 css 提取成一个文件，然后设置 filename，使用 `[contenthash]`。

> 如果使用 style-loader，css 会被注入的页面的 head 中，就无法设置文件指纹。

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name][contenthash:8].css',
    }),
  ],
};
```

图片等静态资源文件指纹设置：file-loader 的 name，使用 hash。

![占位符](https://ypyun.ywhoo.cn/assets/20210507173551.png)

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name][hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
};
```

### 分离配置文件

安装 `webpack-merge`：

```shell
yarn add webpack-merge -D
```

分离成三个文件，并放在 `config` 目录下：

- webpack.common.js
- webpack.dev.js
- webpack.prod.js

配置如下：

```javascript title="webpack.common.js"
const path = require('path');

module.exports = {
  entry: {
    main: './src/index.js',
    worker: './src/worker',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../', 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
```

```javascript title="webpack.dev.js"
const { merge } = require('webpack-merge');
const path = require('path');

const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    historyApiFallback: true,
    hot: true,
    open: false,
    quiet: true,
    port: 8082,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[ext]',
            },
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader'],
          },
        ],
      },
    ],
  },
});
```

```javascript title="webpack.prod.js"
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name]_[chunkhash:8].bundle.js',
    path: path.resolve(__dirname, '../', 'dist'),
    // publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name]_[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
  ],
});
```

### HTML、CSS 和 Javascript 代码压缩

webpack 默认开启了对 Javascript 代码的压缩。

#### 压缩 CSS

> 使用 `css-minimizer-webpack-plugin`， 相比 optimize-css-assets-webpack-plugin，在 source maps 和 assets 中更精确，允许缓存和使用并行模式。

安装依赖：

```shell
yarn add css-minimizer-webpack-plugin -D
```

配置：

```javascript title="webpack.prod.js"
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    // '...' 可以继承默认的压缩配置
    minimizer: [new CssMinimizerPlugin(), '...'],
  },
};
```

#### 压缩 html

安装依赖 `html-webpack-plugin`，生产环境下会默认开启压缩 html。会自动将构建的产物，如 bundle.js, xx.css 等插入到生成的 html 中；如果有多个入口，只指定了一个 HtmlWebpackPlugin，则都会插入到该 html 中。

```shell
yarn add html-webpack-plugin -D
```

```javascript title="webpack.common.js"
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../', 'public/index.html'),
    }),
  ],
};
```

## webpack 进阶用法

### 自动清理构建产物

1. 使用 npm scripts 清理构建目录：

`rm -rf ./dist && webpack`

2. 在 webpack5 中， output 配置提供了 clean 参数，它是一个 boolean 类型，如果为 true，它会在构建前清除上一次的构建产物。

### 使用 PostCSS 的插件 autoprefixer 自动补齐浏览器厂商前缀

安装依赖：

```shell
yarn add postcss-loader autoprefixer -D
```

```javascript title="webpack.common.js"
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('autoprefixer')],
              },
            },
          },
        ],
      },
    ],
  },
};
```

在 `package.json` 中配置 autoprefixer：

```json title="package.json"
{
  "browserslist": ["> 1%", "last 2 versions", "not ie <= 10"]
}
```

### px 自动转换成 rem

使用 px2rem-loader 自动将 px 转换成 rem，配合手淘的 lib-flexible 库，可以在渲染时计算根元素的 font-size，这样就可以实现移动端的自适应。

安装依赖：

```shell
yarn add px2rem-loader -D
yarn add lib-flexible -S
```

```javascript title="webpack.prod.js"
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('autoprefixer')],
              },
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecision: 8,
            },
          },
        ],
      },
    ],
  },
};
```

由于目前的配置还不支持静态资源内联，lib-flexible 的使用在下一小节中介绍。

### 静态资源内联

#### 资源内联的意义

代码层面：

- 页面框架的初始化脚本
- 上报相关打点（css 加载完成、js 加载完成）
- css 内联可以避免页面的闪动，在首屏加载时体验更好（跟随 html 一起回来）

请求层面：

> 减少 HTTP 网络请求数

- 小图片或者字体内联（url-loader | `type: "asset"`）

接下来实现 meta.html 和 lib-flexible 的资源内联，首先将 public/index.html 改为 public.index.ejs，因为使用了 html-webpack-plugin，默认使用的 ejs 模板引擎。

修改 webpack 配置：

```javascript title="webpack.common.js"
module.exports = {
  module: {
    rules: [
      {
        resourceQuery: /raw/,
        type: 'asset/source',
      },
    ],
  },
};
```

将资源内联进 index.ejs:

```html title="index.ejs"
<!DOCTYPE html>
<html lang="en">
  <head>
    <%= require('./meta.html?raw') %>
    <title>玩转 webpack</title>
    <script>
      <%= require('../node_modules/lib-flexible/flexible?raw') %>
    </script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

### 多页应用打包通用方案

安装依赖：

```shell
yarn add glob -D
```

```javascript
// 设置多页打包，思路是使用 glob 解析出对应的入口文件，然后设置对应的 entry 和 HtmlWebpackPlugin
function setMpa() {
  const entry = {};
  const htmlWebpackPlugins = [];

  const pagePaths = glob.sync(path.join(__dirname, '../src/mpa/**/index.js'));

  pagePaths.forEach((pagePath) => {
    const name = pagePath.match(/src\/mpa\/(.*)\/index\.js/)[1];

    entry[name] = pagePath;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        filename: `${name}.html`,
        chunks: [name],
        template: path.join(__dirname, '../', `src/mpa/${name}/index.html`),
      })
    );

    return name;
  });
}
```

### 使用 source map

关键字：

- eval: 使用 eval 包裹模块代码
- source map: 产生 .map 文件（和源代码文件分离）
- cheap: 不包含列信息
- inline: 将 .map 作为 DataURI 嵌入，不单独生成 .map 文件（会造成源文件特别大）
- module: 包含 loader 的 source map

![source map 类型](https://ypyun.ywhoo.cn/assets/20210510230828.png)

注意点

- 出于对性能的考虑，在生产环境推荐不使用 source map，这样有最好的打包性能。
- 开发环境开启，线上环境关闭
  - 如果想使用，可以使用分析不出来业务逻辑的 source map 类型。
  - 线上排查问题的时候可以将 source map 上传到错误监控系统。
  - 生产环境：`devtool: source-map;` 拥有高质量的 source map
  - 开发环境推荐使用：`devtool: eval-cheap-module-source-map`

### 提取页面公共资源

思路：将 react, react-dom 基础包通过 cdn 引入，不打入 bundle。

- 使用 html-webpack-externals-plugin 分离基础库。
- 使用 SplitChunkPlugin，webpack4 之后已经内置。

### 分离 react/react-dom 基础库

安装依赖：

```shell
yarn add html-webpack-externals-plugin -D
```

```javascript title="webpack-prod.js"
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://now8.gtimg.com/now/lib/16.8.6/react.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js',
          global: 'ReactDOM',
        },
      ],
    }),
  ],
};
```

entry 使用 cdn 的地址，然后再 `index.ejs` 中将 react/react-dom 的库引入：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <%= require('./meta.html?raw') %>
    <title>玩转 webpack</title>
    <script>
      <%= require('../node_modules/lib-flexible/flexible?raw') %>
    </script>
  </head>
  <body>
    <div id="root"></div>

    <script src="https://now8.gtimg.com/now/lib/16.8.6/react.min.js"></script>
    <script src="https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js"></script>
  </body>
</html>
```

#### chunk 参数说明

- async 对异步引入的库进行分离（默认）
- initial 对同步引入的库进行分离
- all 对所有引入的库进行分离（推荐）

例如：

```javascript
modulex.exports = {
  optimization: {
    splitChunks: {
      chunk: 'async', // 只会分析异步导入的库，如果达到设置的条件，就会将其抽成单独的一个包，即分包
    },
  },
};
```

#### 使用 SplitChunksPlugin 分离基础包

test: 匹配出要分离的包。将 react 和 react-dom 分离为 vendors 包。

minChunks: 设置最小引用次数为 2 次。

minSize: 分离的包体积的大小。

```javascript
module.exports = {
  optimization: {
    cacheGroups: {
      minSize: 0,
      commons: {
        test: /(react|react-dom)/,
        name: 'vendors',
        chunks: 'all',
        minChunks: 2, // 有两个及以上的页面引用的库，将其抽离
      },
    },
  },
};
```

然后在 HtmlWebpackPlugin 中将 vendors chunk 引入：

```javascript
modulex.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['vendors'],
      template: path.join(__dirname, '../', 'public/index.ejs'),
    }),
  ],
};
```

### Tree Shaking 的使用和原理分析

> 摇树优化：擦除无用的代码

- 代码必须是 es6 的写法
- 如果有副作用，tree shaking 会失效

#### DCE（Elimination）

`mode: production` 默认开启 tree shaking

- 代码不会被执行，不可到达
- 代码执行的结果不会被用到
- 代码只影响死变量（只写不读）

```javascript
if (false) {
  // 不可达
}

function getSex() {
  return 'male';
}

getSex(); // 代码的执行结果不会被用到

var name = 'ywhoo'; // 只写不读
```

#### 原理

利用 es6 模块的特点：

- 只能在模块顶层出现 import
- import 的模块名只能是字符串常量
- import binding 是 immutable 的，即不可变

在编译阶段（静态分析）确定用到的代码，对没用到的代码进行标记，然后在 uglify 阶段删除被标记的代码。

### Scope Hoisting 原理分析

现象：构建后的代码存在大量闭包代码

问题：

- bundle 体积增大
- 函数作用域变多，内存开销变大

原理：将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突。

实现：通过 scope hoisting 可以减少函数声明代码和内存开销

使用： mode 为 production 默认开启

- 必须是 es6 语法。

### 代码分割和动态 import

> 代码分割之前介绍过一点，就是使用 splitChunks 将基础包和公共的函数分离。

代码分割的意义：对于大的 web 应用来讲，将所有的代码都放在一个文件中显然是不够有效的，特别是当某些代码块是在某些特殊的时候才会被使用到。webpack 有一个功能就是将你的代码库分割成 chunks，当需要的时候再进行加载，而不是一次性加载所有的。

使用的场景：

- 抽离相同的代码块到一个共享块
- 脚本懒加载（按需加载），使得初始下载的代码更小

懒加载 js 脚本的方式：

- CommonJS: require.ensure
- ES6: 动态 import（需要 babel 转换）

原理：在加载的时候使用 jsonp 的方式，创建一个 script 标签，动态地引入脚本。

实现按需导入组件，当点击按钮的时候，会将 getComponent 所包含的代码异步加载进来：

```javascript
btn.addEventListener('click', function () {
  getComponent().then((comp) => {
    document.body.appendChild(comp);
  });
});

async function getComponent() {
  const { default: _ } = await import('lodash');

  const ele = document.createElement('div');
  ele.innerHTML = _.join(
    ['hello', 'webpack', '我是动态 import 生成的代码'],
    ' '
  );

  return ele;
}
```

#### 遇到的问题

> 在使用 async 的时候，运行时报错，配置 `.babelrc` 即可解决:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "esmodules": true
        }
      }
    ]
  ]
}
```

> 有个坑会导致 HMR 失效，折腾了好久没发现原因，玩玩没想到是在 package.json 中加入了 browserslist 的配置，这在配置 postcss 的 autoprefixer 时用到，配置了该字段 HMR 就不能正常使用：

```json
{
  "browserslist": ["> 1%", "last 2 versions", "not ie <= 10"]
}
```

解决办法是在 webpack 配置中添加 target 配置：

```javascript
modulex.exports = {
  target: 'web',
};
```

### 在 webpack 中使用 eslint

行业里面优秀的 eslint 规范实践：

- [Airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb): eslint-config-airbnb、eslint-config-airbnb-base
- alloyteam: eslint-config-alloy
- ivweb: eslint-config-ivweb
- umijs: fabric

指定团队的 eslint 规范：

- 不重复造轮子，基于 eslint:recommend 配置并改进
- 能够帮助发现代码错误的规则，全部开启
- 帮助保持团队的代码风格统一，而不是限制开发体验（eslint 通常检查可能存在的问题，而代码风格一般交给 prettier 进行统一规范）

### eslint 落地

- 和 CI/CD 系统集成
- 和 webpack 集成（eslint 不通过构建不成功）

安装 eslint 及 airbnb 的规范实践：

```shell
yarn add eslint eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-config-airbnb -D
```

安装 eslint-loader:

```shell
yarn add eslint-loader babel-eslint -D
```

#### 方案一：webpack 和 CI/CD 集成

在 CI 环节中的 build 之前增加 lint，lint 通过后才允许执行后面的流程。

![CI/CD流水线](https://ypyun.ywhoo.cn/assets/20210517002950.png)

本地开发阶段增加 precommit 钩子

安装 husky

```
yarn add husky -D
```

增加 npm script，通过 lint-staged 增量检查修改的文件：

```json
{
  "scripts": {
    "precommit": "lint-staged"
  },
  "lint-staged": {
    "*.{js}": ["eslint --fix", "git add"]
  }
}
```

为避免绕过 git precommit 钩子，在 CI 步骤需要增加 lint 步骤。

#### 方案二：webpack 与 eslint 集成

使用 eslint-loader，构建时检查 js 规范，适合新项目，默认会检查所有的 js 文件。

```javascript
module.exports = {
  rules: [
    {
      test: /\.jsx?$/,
      use: ['babel-loader', 'eslint-loader'],
    },
  ],
};
```

```js title=".eslintrc"
module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'comma-dangle': 'off',
    'no-console': 'off',
    'jsx-quotes': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
  },
};
```

### webpack 打包组件和基础库

> rollup 更适合打包组件和库，它更加纯粹。

webpack 除了可以用来打包应用，也可以用来打包 js 库。

实现一个大整数加法库的打包：

- 需要打包压缩版和非压缩版
- 支持 AMD/CJS/ESM 模块引入

将库暴露出去：

- library: 指定库的全局变量
- libraryTarget: 支持库的引入方式

以下是具体实现，源码我放在了这个[仓库](https://github.com/weiTimes/source-code-realize/tree/master/play-webpack)的 `lib/big-number` 下：

```javascript title="src/index.js"
// 大整数加法
/**
 * 从个位开始加，注意进位
 *
 * @export
 * @param {*} a string
 * @param {*} b string
 */
export default function add(a, b) {
  let i = a.length - 1;
  let j = b.length - 1;
  let res = '';
  let carry = 0; // 进位

  while (i >= 0 || j >= 0) {
    let x = 0;
    let y = 0;
    let sum = 0;

    if (i >= 0) {
      x = +a[i];
      i -= 1;
    }

    if (j >= 0) {
      y = +b[j];
      j -= 1;
    }

    sum = x + y + carry;

    if (sum >= 10) {
      carry = 1;
      sum -= 10;
    } else {
      carry = 0;
    }

    res = sum + res;
  }

  if (carry) {
    res = carry + res;
  }

  return res;
}
```

webpack 配置：

```javascript
const path = require('path');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'big-number': path.join(__dirname, './src/index.js'),
    'big-number.min': path.join(__dirname, './src/index.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    library: 'bigNumber',
    libraryTarget: 'umd',
    clean: true,
  },
  optimization: {
    //   minimize: false,
    // webpack5 默认使用 terser-webpack-plugin 插件压缩代码，此处使用它自定义
    minimizer: [
      // 只压缩 .min.js 结尾的文件
      new TerserWebpackPlugin({
        test: /\.min\.js$/i,
      }),
    ],
  },
};
```

打包完后，编写组件库的入口文件，在 `package.json` 中指定，如 `main.js`，这里根据不同的环境变量指定使用不同的版本：

```javascript
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/big-number.min.js');
} else {
  module.exports = require('./dist/big-number.js');
}
```

到这里大整数加法库已经开发完成了，接下来将它发布到 npm 仓库，假设已经执行 `npm login` 登录了 npm 账户，然后执行 `npm publish` 发布。

注意：如果使用的是淘宝镜像，需要切换回官方镜像。

发布成功后可以安装并使用它：

```javascript
import bigNumber from 'yw-big-number';

console.log(bigNumber('999', '1')); // 1000
```

### webpack 实现 SSR 打包

#### 为什么需要服务端渲染，它有什么优势？

客户端渲染在页面加载时，需要先获取并解析 html，在解析 html 的过程中，如果遇到外部的 js, css，需要等拿到之后再往后解析，当然浏览器会对资源进行预请求，而且非关键性资源不会阻塞 html 的解析，在解析过程中页面处于白屏，解析完成后页面开始展现，此时可能只有 loading，js 脚本正在请求接口数据并等待返回，拿到数据后才开始展示真正的内容，如果有图片资源，此时图片还是不可见的，需要等待加载完成，到这里页面才是可交互的。

可以发现，页面在加载的时候经历了一系列步骤，才真正展现在用户面前，而服务端渲染的优势是，静态资源和数据是随着 html 一起拿到的，浏览器拿到 html 后直接解析，等 js 脚本执行完成后就完全可交互，它主要以下几点优势：

- 减少白屏时间
  - 所有模板等静态资源都存储在服务端
  - 内网机器拉取数据更快
  - 一个 html 返回所有数据
- 对 SEO 友好

总结：服务端渲染的核心是减少请求。

![服务端渲染流程](https://ypyun.ywhoo.cn/assets/20210518204002.png)

![CSR vs SSR](https://ypyun.ywhoo.cn/assets/20210518204348.png)

#### 代码实现思路

1. 配置 `webpack.ssr.js`，将客户端代码以 umd 规范导出
2. 服务端代码使用 express 实现，将导出的客户端代码引入，通过 ReactDOMServer 的 renderToString 方法将其转换成字符串，放入模板中的 root 节点，然后注册路由，开启监听端口服务。

#### 问题

1. 执行 `node server/index.js` 时，报 `self is not defined`，由于服务端没有 self 全局变量，在执行的最顶部加入如下判断：

```javascript
if (typeof self === 'undefined') {
  global.self = {};
}
```

2. 打包出的组件需要兼容写法，如服务端模块使用的是 commonjs 写法，客户端编写组价你的时候也需要遵循 commonjs 规范。

3. 将 fetch 或 ajax 请求方法改成 isomorphic-fetch 或 axios。

4. 样式问题（nodejs 无法解析 css）
   1. 服务端打包通过 ignore-loader 忽略掉 css 的解析
   2. 将 style-loader 替换成 isomorphic-style-loader（css module 的写法，不能直接引入）

使用打包出来的浏览器端 html 为模板，设置占位符，动态地插入组件：

```javascript title="server/index.js"
const template = fs.readFileSync(
  path.join(__dirname, '../dist/index.html'),
  'utf-8'
);

const useTemplate = (html) => template.replace('<!--HTML_PLACEHOLDER-->', html);

app.get('/app', (req, res) => {
  const html = useTemplate(renderToString(App));

  res.status(200).send(html);
});
```

实现后会有白屏的问题。

5. 首屏数据如何处理？

服务端获取数据后，替换占位符。

### 优化构建时命令的显示日志

使用 `friendly-errors-webpack-plugin` 提供友好的构建信息提示。

### 构建异常和中断处理

主动捕获并处理构建错误：

- compiler 在每次构建结束后会触发 done 这个 hook
- process.exit 主动处理构建报错

```javascript
module.exports = {
  plugins: [
    function () {
      // this 指向 compiler
      this.hooks.done.tap('done', (stats) => {
        if (
          stats.compilation.errors &&
          stats.compilation.errors.length &&
          process.argv.indexOf('--watch') === -1
        ) {
          process.exit(1); // 抛出异常，终端就知道构建失败了
        }
      });
    },
  ],
};
```

## 编写可维护的 webpack 构建配置

这一章节会根据之前的配置，编写一个可维护的 webpack 构建配置库，它遵循完整库的编写规范，包含开发规范、冒烟测试、单元测试、持续集成等，最后发布到 npm 社区。

### 构建配置抽离成 npm 包的意义

- 通用性
  - 开发人员无需关注构建配置
  - 统一团队构建脚本
- 可维护性
  - 构建配置合理的拆分
  - README 文档、ChangeLog 文档等
- 质量
  - 冒烟测试、单元测试、测试覆盖率
  - 持续集成

### 构建配置管理的可选方案

- 通过多个配置文件管理不同环境的构建，webpack --config 参数进行控制
  - 基础配置 webpack.common.js
  - 开发环境 webpack.dev.js
  - 生产环境 webpack.prod.js
  - SSR 环境 webpack.ssr.js
- 将构建配置设计成一个库统一管理
  - 规范：git commit 日志，README，Eslint 规范
  - 质量：冒烟测试、单元测试、测试覆盖率和 CI

使用 `webpack-merge` 合并配置。

### 功能模块设计和目录结构

![功能模块设计](https://ypyun.ywhoo.cn/assets/20210519235209.png)

![目录结构设计](https://ypyun.ywhoo.cn/assets/20210519235439.png)

### 使用 eslint 规范开发

由于是基础库的开发，只需要用到 airbnb 的 `eslint-config-airbnb-base` 版本。

安装依赖:

```shell
yarn add eslint babel-eslint eslint-config-airbnb-base -D
```

配置 `.eslintrc.js`:

```javascript
module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb-base',
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'comma-dangle': 'off',
    'no-console': 'off',
    'jsx-quotes': 'off',
    'global-require': 'off',
    'import/extensions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'no-restricted-globals': 'off',
  },
};
```

将 eslint 检查加入 scripts:

```json title="package.json"
{
  "scripts": {
    "eslint": "eslint config --fix"
  }
}
```

### 冒烟测试介绍和实际运用

冒烟测试时指对提交测试的软件在进行详细深入的测试之前进行的测试，这种预测试的目的是暴露导致软件需重新发布的基本功能失效等严重问题。

冒烟测试执行：

- 判断构建是否成功
- 构建产物是否有内容
  - 是否有 js, css 等静态资源文件
  - 是否有 html 文件

安装需要的依赖:

```shell
yarn add rimraf webpack mocha assert glob-all
```

编写判断构建是否成功的测试用例：

```javascript title="test/smoke/index.js"
const rimraf = require('rimraf');
const webpack = require('webpack');
const Mocha = require('mocha');
const path = require('path');

const mocha = new Mocha({
  timeout: '10000',
});

// 删除旧的构建产物
// process.chdir(); // 改变工作目录

rimraf('../../dist', () => {
  const prodConfig = require('../../config/webpack.prod');

  webpack(prodConfig, (err, stats) => {
    if (err) {
      console.error(err);
      process.exit(2);
    }
    console.log(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
      })
    );

    console.log('webpack build succeeded, begin to test.');

    mocha.addFile(path.join(__dirname, './html-test.js'));
    mocha.addFile(path.join(__dirname, './js-css-test.js'));

    mocha.run();
  });
});
```

需要注意的是路径是否正确，html,js,css 的测试用例就不贴代码了，感兴趣的可以到我的仓库代码中查看，最终运行成功的结果如下：

![冒烟测试结果](https://ypyun.ywhoo.cn/assets/20210523132416.png)

### 单元测试和测试覆盖率

单纯的测试框架：Mocha/AVA，需要安装额外的断言库：chai/should.js/expect/better-assert
集成框架，开箱即用：Jasmine/Jest（React）

使用 Mocha + Chai，主要的测试 api:

- describe 描述需要测试的文件
- it 一个文件中多个测试用例
- expect 断言

执行测试命令：

```shell
mocha add.test.js
```

#### 单元测试

编写单元测试用例：

> mocha 默认会查找 test/index.js。

```javascript title="test/index.js"
describe('webpack config test.', () => {
  require('./unit/webpack-base.test');
});
```

```javascript title="test/unit/webpack-base.test.js"
const assert = require('assert');

describe('webpack.common.js test case.', () => {
  const baseConfig = require('../../config/webpack.common');

  it('entry', () => {
    // 测试入口的文件路径是否正确
    assert.strictEqual(
      baseConfig.entry.main,
      '/Users/yewei/Project/source-code-realize/play-webpack/lib/yw-build-webpack/src/index.jsx'
    );
  });
});
```

测试通过后如下：

![单元测试结果](https://ypyun.ywhoo.cn/assets/20210523134659.png)

#### 测试覆盖率

安装 `istanbul`。

安装好之后修改 `test:unit` 命令：

```json
{
  "scripts": {
    "test:unit": "istanbul cover mocha"
  }
}
```

> 注意：测试的目标代码中不能有 es6+ 语法的代码，否则无法收集到测试覆盖率数据。

执行 `yarn test:unit` 的结果如下，并且会在根目录下生成 coverage 的目录，用来存放代码覆盖率的结果：

![测试覆盖率](https://ypyun.ywhoo.cn/assets/20210523135726.png)

### 持续集成和 Travis CI

持续集成的作用：

- 快速发现错误
- 防止分支大幅偏离主干

核心思路：代码集成到主干前，必须通过自动化测试。只要有一个错误，就不能集成。

Github 最流行的 CI:

![CI](https://ypyun.ywhoo.cn/assets/20210523145303.png)

接入 Travis CI:

1. [Travis](https://travis-ci.org/) 点击登录
2. 激活需要持续集成的项目
3. 项目根目录下新增 .travis.yml

在 github 创建件新项目，然后执行以下步骤将 `yw-build-webpack` 下的代码上传到该仓库：

```shell
# 进入yw-build-webpack，初始化 git
git init
git add .
git commit -m "xxx"
# 将远程仓库添加进来
git remote add origin https://github.com/weiTimes/yw-build-webpack.git
# 推送代码
git push -u origin master
```

添加 `.travis.yml`:

```yml
language: node_js # 语言

sudo: false

node_js:
  - 12.16.1

cache: # 保存缓存
  - npm
  - yarn

before_install: # 安装依赖
  - npm install -g yarn
  - yarn

scripts: # 执行测试
  - yarn test
```

当代码提价时，会走动触发构建任务。

### 发布构建包到 npm 社区

#### 发布 npm

添加用户：npm adduser

升级版本

- 升级补丁版本号：npm version patch
- 升级小版本号：npm version minor
- 升级大版本号：npm version major

发布版本：npm publish

进入要发布的项目根目录，然后登陆 npm 并执行发布操作：

```shell
npm login
npm publish
```

当要发布补丁时，执行以下步骤：

```shell
git add .
git commit -m "doc: udpate reamde"
npm version patch
git push -u origin master
npm publish
```

### Git commit 规范和 changelog 生成

良好的 git commit 规范优势：

- 加快 code review 的流程
- 根据 git commit 的元数据生成 changelog
- 方便后续维护者维护

angular git commit 规范：

![提交格式](https://ypyun.ywhoo.cn/assets/20210523162414.png)

![commit 规范](https://ypyun.ywhoo.cn/assets/20210523162218.png)

#### 本地开发阶段增加 precommit 钩子

添加依赖：

```shell
yarn add conventional-changelog-cli @commitlint/{config-conventional,cli}
```

[参考 Git 提交规范](https://blog.ywhoo.cn/docs/styleguide/commit)

#### changlog 生成

按照规范 commit 之后，可以很方便地生成 changelog

![changelog](https://ypyun.ywhoo.cn/assets/20210523162610.png)

### 语义化版本

开源项目版本信息安利

- 通常由三位组成：x.y.z
- 版本严格递增：16.2.0 -> 16.3.0 -> 16.3.1
- 发布重要版本时，可以发布 alpha（内部）, beta（外部小范围）, rc（公测） 等先行版本 16.2.0-rc.123

遵循 semver 规范：

- 避免出现循环依赖
- 减少依赖冲突

规范格式：

- 主版本号：做了不兼容的 api 修改
- 次版本号：新增向下兼容的功能
- 修订版本号：向下兼容的问题修正

## webpack 构建速度和体积优化策略

### 初级分析：使用 stats

> 在 webpack5 中可以得到构建各个阶段的处理过程、耗费时间以及缓存使用的情况。

```javascript title="webpack.prod.js"
module.exports = {
  stats: 'verbose', // 输出所有信息 normal: 标准信息; errors-only: 只有错误的时候才输出信息
};
```

在根目录下生成 stats.json，包含了构建的信息。

```json title="package.json"
{
  "scripts": {
    "analyze:stats": "webpack --config config/webpack.prod.js --json stats.json"
  }
}
```

### 速度分析：使用 `speed-measure-webpack-plugin`

> 这个插件在 webpack5 中已经用不到了，可以使用内置的 stats 替代。

作用：

- 分析整个打包总耗时
- 每个插件和 loader 的耗时情况

```shell
yarn add speed-measure-webpack-plugin -D
```

```javascript
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin();

const webpackConfig = smp.wrap({
  plugins: [new MyPlugin(), new MyOtherPlugin()],
});
```

### 体积分析：webpack-bundle-analyzer

分析：

- 依赖的大小
- 业务组件代码的大小

```shell
yarn add webpack-bundle-analyzer
```

```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [new BundleAnalyzerPlugin()],
};
```

执行完成后会自动打开 `http://127.0.0.1:8888/`，如下图所示:

![分析](https://ypyun.ywhoo.cn/assets/20210524211355.png)

### 使用更高版本的 webpack 和 nodejs

webpack4 和 nodejs 高版本较之前所做的优化：

- V8 带来的优化：for of 替代 forEach; Map/Set 替代 Object; includes 替代 indexOf。
- md5 → md4 算法。
- 使用字符串方法替代正则表达式。

webpack5 的主要优化及特性：

- 持久化缓存。可以设置基于内存的临时缓存和基于文件系统的持久化缓存。
  - 一旦开启，会忽略其它插件的缓存设置。
- Tree Shaking
  - 增加了对嵌套模块的导出跟踪功能，能够找到那些嵌套在最内层而未被使用的模块属性。
  - 增加了对 cjs 模块代码的静态分析功能。
- Webpack 5 构建输出的日志要丰富完整得多，通过这些日志能够很好地反映构建各阶段的处理过程、耗费时间，以及缓存使用的情况。
- 新增了改变微前端构建运行流程的 Module Federation。
- 对产物代码进行优化处理 Runtime Modules。
- 优化了处理模块的工作队列。
- 在生命周期中增加了 stage 选项。

### 多进程/多实例构建

可选方案：

- thread-loader
- parallel-webpack
- 一些插件内置的 parallel 参数（如 TerserWebpackPlugin, CssMinimizerWebpackPlugin, HtmlMinimizerWebpackPlugin）
- HappyPack（作者已经不维护）

#### thread-loader

原理：每次 webpack 解析一个模块，thread-loader 会将它及它的依赖分配给 worker 线程中。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workder: 3,
            },
          },
          'babel-loader',
          'eslint-loader',
        ],
      },
    ],
  },
};
```

### 并行压缩

可以配置并行压缩的插件：

- terser-webpack-plugin
- css-minimizer-webpack-plugin
- html-minimizer-webpack-plugin

```javascript
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({ parallel: 2 }),
      '...',
    ],
  },
};
```

### 进一步分包：预编译资源模块（DLL）

回顾之前分包的思路：

使用 SplitChunkPlugin 将 react, react-dom 等基础库分离成单独的 chunk。

缺点是每次打包时仍然会对基础包进行解析编译，更好的方式是进行预编译资源模块，通过 DLLPlugin, DllReferencePlugin 实现。

#### 预编译资源模块

思路：将 react, react-dom, redux, react-redux 基础包和业务基础包打包成一个文件，可以提供给其它项目使用。

方法：使用 DLLPlugin 进行分包，DllReferencePlugin 对 manifest.json 引用。

首先定义一个 `config/webpack.dll.js`, 用于将基础库进行分离：

```javascript
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    library: ['react', 'react-dom'],
  },
  output: {
    filename: '[name]_[chunkhash].dll.js',
    path: path.resolve(__dirname, '../build/library'),
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      context: __dirname,
      name: '[name]_[hash]',
      path: path.join(__dirname, '../build/library/[name].json'),
    }),
  ],
};
```

然后在 `webpack.common.js` 中将预编译资源模块引入：

```javascript
module.exports = {
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../build/library/library.json'),
      scope: 'xyz',
      sourceType: 'commonjs2',
    }),
  ],
};
```

### 充分利用缓存提升二次构建速度

目的：提升二次构建速度。

缓存思路：

- webpack5 内置的基于内存的临时缓存和基于文件系统的持久化缓存。
- cache-loader。
- terser-webpack-plugin 开启缓存。

基于文件系统的持久化缓存，在 node_modules 下会生成 .cache 目录：

```javascript title="webpack.common.js"
module.exports = {
  cache: {
    type: 'filesystem', // memory 基于内存的临时缓存
    // cacheDirectory: path.resolve(__dirname, '.temp_cache'),
  },
};
```

### 缩小构建目标

目的：减少需要解析的模块。

- babel-loader 不解析 node_modules

减少文件搜索范围：

- resolve.modules 减少模块搜索层级，指定当前 node_modules。
- resovle.mainFields 指定入口文件。
- resolve.extension 对于没有指定后缀的引用，指定解析的文件后缀算法。
- 合理使用 alias，引用三方依赖的生成版本。

```javascript
module.exports = {
  resolve: {
    alias: {
      react: path.resolve(__dirname, './node_modules/react/dist/react.min.js'),
    },
    modules: [path.resolve(__dirname, './node_modules')],
    extensions: ['.js', '.jsx', '.json'],
    mainFields: ['main'],
  },
};
```

### Tree Shaking 擦除无用的 css

前面已经介绍了使用 Tree Shaking 擦除无用的 js，这在 webpack5 中已经内置了，这一小节介绍如何擦除无用的 css。

- PurifyCSS: 遍历代码，识别已经用到的 css class。
- uncss: html 需要通过 jsdom 加载，所有的样式通过 PostCSS 解析，通过 document.querySelector 识别 html 文件中不存在的选择器。

在 webpack 中使用 PurifyCSS:

- 使用 purgecss-webpack-plugin
- 和 mini-css-extract-plugin 配合使用

```javascript
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const glob = require('glob');

const PATHS = { src: path.resolve('../src') };

module.exports = {
  plugins: [
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
  ],
};
```

### 图片压缩

```shell
yarn add image-minimizer-webpack-plugin
```

无损压缩推荐使用下面依赖：

```shell
yarn add imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo
```

```javascript
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  plugins: [
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [['jpegtran', { progressive: true }]],
      },
    }),
  ],
};
```

### 使用动态 Polyfill 服务

用于体积优化。

polyfill-service: 只给用户返回需要的 polyfill，国内部分浏览器可能无法识别 User Agent，可以采用优雅降级的方案。

polyfill-service 原理：识别 User Agent，下发不同的 polyfill，做到按需加载需要的 polyfill。

![polyfill](https://ypyun.ywhoo.cn/assets/20210525213102.png)

[polyfill.io](https://polyfill.io/v3/polyfill.min.js)

### 体积优化策略总结

- Scope Hoisting
- Tree Shaking
- 公共资源分离
  - SplitChunks
  - 预编译资源模块
- 图片压缩
- 动态 Polyfill

## 通过源代码掌握 webpack 打包原理

### webpack 启动过程分析

开始：从 webpack 命令行说起。

- 通过 npm scripts 运行 webpack
  - 开发环境： npm run dev
  - 生产环境： npm run build
- 通过 webpack 直接运行
  - webpack entry.js bundle.js

这个过程发生了什么？

执行上述命令之后，npm 会让命令行进入 `node_modules/.bin` 目录下查找 `webpack.js`，如果存在就执行，不存在就抛出错误。

`.bin` 目录下的文件实际上是软链接，`webpack.js` 真正指向的文件是 `node_modules/webpack/bin/webpack.js`。

#### 分析 webpack 的入口文件：webpack.js

认识几个关键函数：

- runCommand -> 运行命令
- isInstalled -> 判断某个包是否安装
- runCli -> 执行 webpack-cli

执行流程：

1. 判断 webpack-cli 是否存在。
2. 不存在则抛出异常，存在则直接到第 6 步。
3. 判断当前使用的包管理器是 yarn/npm/pnpm 中的哪一种。
4. 使用包管理器自动安装 webpack-cil（runCommand -> `yarn webpack-cli -D`）
5. 安装成功后执行 runCli
6. 执行 runCli（执行 `webpack-cli/bin/cli.js`）

总结：webpack 最终会找到 webpack-cli 这个包，并且执行 webpack-cli。

### webpack-cli 源码阅读

webpack-cli 做的事情：

- 引入 [`Commander.js`](https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md)，对命令行进行定制。
- 分析命令行参数，对各个参数进行转换，组成编译配置项。
- 引用 webpack，根据生成的配置项进行编译和构建。

#### 命令行工具包 `Commander.js` 介绍

> 完成的 `nodejs` 命令行解决方案。

- 提供命令和分组参数。
- 动态生成 help 帮助信息。

#### 具体的执行流程：

1. 接着上面一小节的执行 webpack-cli，也就是执行 `node_modules/webpack-cli/bin/cli.js`。
2. 检查是否有 `webpack`，有的话执行 `runCli`，它主要做的是实例化 `node_modules/webpack-cli/webpack-cli.js`，然后调用它的 `run` 方法。
3. 使用 `Commander.js` 定制命令行参数。
4. 解析命令行的参数，如果是内置参数，则调用 `createCompiler`，主要做的事是想将得到的参数传递给 `webpack`，生成实例化对象 `compiler`。

总结：webpack-cli 对命令行参数进行转换，最终生成配置项参数 options，将 options 传递给 webpack 对象，执行构建流程（最后会判断是否有监听参数，如果有，就执行监听的动作）。

### Tapable 插件架构与 Hooks 设计

webpack 的本质：webpack 可以将其理解成是一种基于事件流（发布订阅模式）的编程范例，一系列的插件运行。

Compiler 和 Compilation 都是继承 Tapable，那么 Tapable 是什么呢？

Tapable 是一个类似于 nodejs 的 EventEmitter 的库，主要是控制钩子函数的发布与订阅，控制着 webpack 的插件系统。

- Tapable 暴露了很多 Hook 类，为插件提供挂载的钩子。

Tapable hooks 类型：

![hooks](https://ypyun.ywhoo.cn/assets/20210526235407.png)

Tapable 提供了同步和异步绑定钩子的方法，并且都有绑定事件和执行事件对应的方法。

![tapable use](https://ypyun.ywhoo.cn/assets/20210526235622.png)

实现一个 `Car` 类，其中有个 hooks 对象，包含了加速、刹车、计算路径等 hook，对其分别注册事件和触发事件：

```javascript
console.time('cost');

class Car {
  constructor() {
    this.hooks = {
      acclerate: new SyncHook(['newspped']), // 加速
      brake: new SyncHook(), // 刹车
      calculateRoutes: new AsyncSeriesHook(['source', 'target', 'routes']), // 计算路径
    };
  }
}

const myCar = new Car();

// 绑定同步钩子
myCar.hooks.brake.tap('WarningLmapPlugin', () => {
  console.log('WarningLmapPlugin');
});

// 绑定同步钩子并传参
myCar.hooks.acclerate.tap('LoggerPlugin', (newSpeed) => {
  console.log(`accelerating spped to ${newSpeed}`);
});

// 绑定一个异步的 promise
myCar.hooks.calculateRoutes.tapPromise(
  'calculateRoutes tabPromise',
  (params) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(`tapPromise to ${params}`);
        resolve();
      }, 1000);
    });
  }
);

// 触发同步钩子
myCar.hooks.brake.call();
// 触发同步钩子并传入参数
myCar.hooks.acclerate.call(120);
// 触发异步钩子
myCar.hooks.calculateRoutes
  .promise(['Async', 'hook', 'demo'])
  .then(() => {
    console.timeEnd('cost');
  })
  .catch((err) => {
    console.error(err);
    console.timeEnd('cost');
  });
```

### Tapable 是如何和 webpack 进行关联起来的

上面说到 `webpack-cli.js` 中执行 `createCompiler` 的时候，将转换后得到的 `options` 传递给 webpack 方法然后生成 `compiler` 对象，接下来说说 `webpack.js` 中做的事情，我将 `createCompiler` 的源码贴出，便于理解：

```javascript
const createCompiler = (rawOptions) => {
  const options = getNormalizedWebpackOptions(rawOptions);
  applyWebpackOptionsBaseDefaults(options);
  const compiler = new Compiler(options.context); // 实例化 compiler
  compiler.options = options;
  new NodeEnvironmentPlugin({
    infrastructureLogging: options.infrastructureLogging,
  }).apply(compiler);
  if (Array.isArray(options.plugins)) {
    // 遍历并调用插件
    for (const plugin of options.plugins) {
      if (typeof plugin === 'function') {
        plugin.call(compiler, compiler);
      } else {
        plugin.apply(compiler);
      }
    }
  }
  applyWebpackOptionsDefaults(options);
  // 触发监听的 hooks
  compiler.hooks.environment.call();
  compiler.hooks.afterEnvironment.call();
  new WebpackOptionsApply().process(options, compiler); // 注入内部插件
  compiler.hooks.initialize.call();
  return compiler; // 将实例返回
};
```

通过上述代码可以得到两个关于插件的结论：

- 插件就是监听 compiler 对象上的 hooks。
- 执行插件需要调用插件的 apply 方法，并将 compiler 对象作为参数传入。

`webpack.js`:

- webpack 中也有 createCompiler 方法，它会先实例化 `Compiler` 对象，生成 compiler 实例。
- Compiler 中的核心在于挂载了许多继承自 Tapable 的 hooks，其它地方可以使用 compiler 实例注册和触发事件，在 webpack 构建的不同阶段，会触发不同的 hook。
- `options.plugins` 即配置的一系列插件，在 createCompiler 中，生成 compiler 实例后，如果 `options.plugins` 是数组类型，则会遍历调用它，并传入 compiler，形如 `plugin.apply(compiler)`，内部绑定 compiler 上的一些 hooks 事件。

简易模拟 Compiler 和插件的实现：

```javascript title="compiler.js"
// Compiler 对象，挂载了一些 hook
const { SyncHook, AsyncSeriesHook } = require('tapable');

module.exports = class Compiler {
  constructor() {
    this.hooks = {
      acclerate: new SyncHook(['newspped']),
      brake: new SyncHook(),
      calculateRoutes: new AsyncSeriesHook(['source', 'target', 'routesList']),
    };
  }

  run() {
    this.acclerate(100);
    this.brake();
    this.calculateRoutes('Async', 'hook', 'demo');
  }

  acclerate(speed) {
    this.hooks.acclerate.call(speed);
  }

  brake() {
    this.hooks.brake.call();
  }

  calculateRoutes(...params) {
    this.hooks.calculateRoutes.promise(...params).then(
      () => {},
      (err) => {
        console.log(err);
      }
    );
  }
};
```

webpack 插件，根据传入的 compiler 对象，选择性监听了一些 hook:

```javascript title="my-plugin.js"
const Compiler = require('./compiler');

class MyPlugin {
  apply(compiler) {
    // 绑定事件
    compiler.hooks.acclerate.tap('打印速度', (newSpeed) =>
      console.log(`speed acclerating to ${newSpeed}`)
    );
    compiler.hooks.brake.tap('刹车警告', () => console.log('正在刹车'));
    compiler.hooks.calculateRoutes.tapPromise(
      '计算路径',
      (source, target, routesList) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log(`计算路径: ${source} ${target} ${routesList}`);
            resolve();
          }, 1000);
        })
    );
  }
}

// 模拟插件执行
const compiler = new Compiler();
const myPlugin = new MyPlugin();

// 模拟 webpack.config.js 的 plugins 配置
const options = { plugins: [myPlugin] };

for (const plugin of options.plugins) {
  if (typeof plugin === 'function') {
    plugin.call(compiler, compiler);
  } else {
    plugin.apply(compiler); // 绑定事件
  }
}

compiler.run(); // 触发事件
```

### webpack 流程篇：准备阶段

> webpack 的打包流程可以分为三个阶段：
>
> 1. 准备：初始化参数，为对应的参数注入插件
> 2. 模块编译和打包
> 3. 模块优化、代码生成和输出到磁盘。

webpack 的编译按照下面钩子的调用顺序进行：

![编译流程图](https://ypyun.ywhoo.cn/assets/20210530165755.png)

1. entry-option: 初始化 option。
2. run: 开始编译。
3. make: 从 entry 开始递归地分析依赖，对每个依赖模块进行 build。
4. before-resolve: 对模块位置进行解析。
5. build-module: 开始构建某个模块。
6. normal-module-loader: 将 loader 加载完成的 module 进行编译，生成 AST 树。
7. program: 遍历 AST，当遇到 require 等一些调用表达式，收集依赖。
8. seal: 所有依赖 build 完成，开始优化。
9. emit: 输出到 dist 目录。

#### entry-option

首先第一步，在目录下查询 `entryOption` 字符串的位置：

```shell
grep "\.entryOption\." -rn ./node_modules/webpack
```

得到如下结果：

![entryOption](https://ypyun.ywhoo.cn/assets/20210530174533.png)

可以看到，在 `EntryOptionPlugin` 和 `DllPlugin` 中有绑定该 hook，在 `WebpackOptionsApply` 中触发该 hook。

##### WebpackOptionsApply

1. 将所有的配置 options 参数转换成 webpack 内部插件。

如：

- options.externals 对应 ExternalsPlugin。
- options.output.clean 对应 CleanPlugin。
- options.experiments.syncWebAssembly 对应 WebAssemblyModulesPlugin。

2. 绑定 entryOption hook 并触发它。

最后准备阶段以一张较为完整的流程图结束：

![准备阶段](https://ypyun.ywhoo.cn/assets/20210530213711.png)

### webpack 流程篇：模块构建和 chunk 生成阶段

#### 相关的 hook

流程相关：

- (before-)run
- (before-/after-)compile
- make
- (after-)emit
- done

监听相关：

- watch-run
- watch-close

#### Compilation

Compiler 调用 Compilation 生命周期方法：

- addEntry -> addModuleChain
- finish（上报模块错误）
- seal

#### ModuleFactory

Compiler 会创建两个工厂函数，分别是 NormalModuleFactory 和 ContextModuleFactory，均继承 ModuleFactory。

- NormalModuleFactory: 普通模块名导入。
- ContextModuleFactory: 以路径形式导入的模块。

![Module](https://ypyun.ywhoo.cn/assets/20210530214635.png)

#### NormalModule

Build-构建阶段:

- 使用 loader-runner 运行 loaders
  解析模块生成 js 代码。
- 通过 Parser 解析（内部使用 acron）
  解析依赖，
- ParserPugins 添加依赖
  所有依赖解析完成后，make 阶段就结束了。

#### 具体构建流程

- compiler.compile: hooks.compile -> hooks.make（开始构建） -> compilation.addEntry（添加入口文件）。

查看绑定和触发 hooks.make 的地方：

![hooks.make](https://ypyun.ywhoo.cn/assets/20210530221421.png)

- 模块构建完成后，触发 hook.finishMake -> compilation.finish -> compilation.seal -> hooks.afterCompile，最终得到经过 loaders（loader-runner） 解析生成的代码。

- 以 NormalModule 的构建为例，说说它的过程：

1. 构建，通过 loader 解析：build -> doBuild -> runLoaders。
2. 分析及添加依赖：parser.parse（将 loader 编译过得代码使用 acron 解析并添加依赖）。
3. 将最终得到的结果存储到 compilation.modules。
4. hook.finishMake 完成构建。

#### chunk 生成算法

1. webpack 先将 entry 中对应的 module 都生成一个新的 chunk。
2. 遍历 module 的依赖列表，将依赖的 module 也加入到 chunk 中。
3. 如果一个依赖 module 是动态引入的模块，那么就会根据这个 module 创建一个新的 chunk，继续遍历依赖。
4. 重复上面的过程，知道生成所有的 chunk。

### webpack 流程篇：文件生成

完成构建后，执行 hooks.seal、hooks.optimize 对构建结果进行优化，优化完成后出触发 hooks.emit，将构建结果输出到磁盘上。
