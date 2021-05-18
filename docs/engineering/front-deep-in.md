---
id: front-deep-in
title: 前端工程化由浅入深
---

## 开发效率

搭建基础开发设施。

目标：配置一个技术栈完整、辅助功能丰富、兼顾不同环境下构建优化目标的项目基础代码；根据不同的项目需求和团队情况使用不同的基础设施。

### 创建项目的流程

脚手架

1. 创建 package.json，管理项目基础信息和依赖。
2. 选择包管理器。npm 或 yarn，.lock 文件可以保证不同环境下安装依赖的稳定性。
3. 确定技术栈。团队习惯使用的框架，是否有 SEO、首屏渲染快的需求，是否需要 typescript，样式解决方法，状态管理，确定好之后再 src 目录下创建入口文件。
4. 选择构建工具。一般使用 webpack，区分开发环境/生产环境的配置，当然还有一个公共的配置。
5. 打通构建流程。配置 loader、插件和其它配置项，确保开发环境和生产环境能够正常构建代码和预览效果。
6. 优化构建流程。针对开发/生产环境的不同特点进行优化，开发环境注重构建效率和开发体验，生产环境注重访问性能等。
7. （开发辅助工具）Vscode 配置调试程序，配置文件在 .vscode 下，配合 Eslint、Prettier，分别用于代码检查和代码格式化。
8. 检查各个环境是否工作正常，编写 README，将不需要纳入版本管理的文件写入 .gitignore。

### 开启热更新

热更新又叫热模块替换（HMR），当我们代码有变动，浏览器不用刷新页面会自动更新内容。

webpack 的几种相关配置：

1. 手动执行构建

   每次代码有变动，均需手动执行命令进行构建。

2. watch 模式

   监听代码变动，会自动进行编译构建。

3. live relaod

   当监测到代码变动，会自动刷新浏览器页面，原理是开发服务器和浏览器页面使用 websocket 建立通信。

4. HRM

   当监测到代码变动，无需刷新页面即可更新变动的内容。

#### 热更新原理

主要包含三方面的技术：

- 使用 fs.watch 监听本地文件的变动
- 开发服务器和浏览器使用 websocket 进行通信
- 模块解析与替换

![webpack HMR 流程图](https://ypyun.ywhoo.cn/assets/20210408130600.png)

热模块替换插件（HotModuleReplacementPlugin）：module.hot.accept 接收依赖模块名称和回调函数，当依赖模块更新时，回调方法就会被执行；module.hot.dispose 传入回调，当模块的执行上下文被移除时，回调方法就会被执行。

#### webpack 打包思想

简化为 3 点：

1. 一切源文件都可以通过各种 loader 转换为 js 模块，模块之间可以相互引用。
2. 通过入口递归处理各模块引用关系，最后输出一个或多个产物（bunlde）。
3. 每个入口是一个块组，在未分包的情况下，一个 chunk group 中只有一个 chunk，该 chunk 包含递归分析后的所有模块。每个 chunk 对应一个 bundle。

从模块的角度看，webpack 的打包流程：

![打包流程](https://ypyun.ywhoo.cn/assets/20210408140616.png)

1. 为 entry 创建一个 chunk group，name 为 main。
2. 递归解析依赖。如遇到 style.css，找到匹配的 loader：css-loader，style-loader。
3. css-loader 将 style.css 转换为 Content 模块并打入 chunk 中。
4. style-loader 使用 API 模块将 Content 模块在运行时注入 style 标签中。
5. 处理完所有依赖的模块后，输出 main.js 的产物。
