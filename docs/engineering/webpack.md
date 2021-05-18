---
id: webpack
title: 玩转webpack
---

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
