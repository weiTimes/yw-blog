---
id: npm-module-install
title: npm模块安装机制
---

[npm](https://www.npmjs.com/)是nodejs的模块管理器，有了npm，安装模块就只需要执行`npm install`即可。

![npm](https://ypyun.ywhoo.cn/assets/20210219092535.png)

本文介绍npm模块安装机制的细节，解决安装速度慢的问题，以及介绍另一个模块管理器yarn。

## npm安装机制

先来认识一下 `package.json`，它是存储项目模块安装包名称和版本的地方，当然它还管理着项目名称、版本、执行命令等，执行 `npm init -y` 可初始化一个 `package.json` 文件。

想要安装 `package.json` 中存储的所有模块，执行 `npm install`。

执行`npm install [packageName]`，会先检查node_modules是否存在该模块，如果存在，就不再重新安装了，希望强制重新安装可以加 `-f`: `npm install [packageName] -f`。

如果node_modules中不存在该模块，则会从远程仓库进行下载，默认的仓库地址是 `https://registry.npmjs.org/`，后面跟上模块名，就能查询到该模块所有版本的信息，如 `https://registry.npmjs.org/react`。

返回的模块信息中，有一个 `dist.tarball` 属性，是该版本压缩包的地址。

```json
{
    "dist": {
        "shasum": "3cf0fbb146714879c0de7069e8cabb21f2cb523f",
        "tarball": "https://registry.npmjs.org/react/-/react-0.0.2.tgz"
    },
}
```

### dependencies和devDenpendencies

执行 `npm install [packageName]`，会将该模块的名称及版本放入 `dependencies` 管理；后面加 `-D` 参数，则放入 `devDenpendencies` 进行管理，下面谈谈它们之间的区别。

#### dependencies

该配置项用来放置一些项目中实际运行需要用到的代码，如果没有该模块，项目会运行出错，那就必须要安装在 dependencies 下面。

#### devDenpendencies

该配置项放置本地开发过程中需要使用到的编译、打包、测试、格式化模块等。

> 特别注意： npm publish 的时候不会安装该配置下的模块

### 模块的安装过程

1. 执行 npm install
2. npm 向 registry 查询模块压缩包的地址
3. 下载安装包，存储在 `~/.npm`
4. 解压压缩包到当前项目的 node_modules 目录

## 解决安装速度慢

查看仓库源：

```shell
npm config get registry
```

设置淘宝镜像：

```shell
npm config set registry https://registry.npm.taobao.org
```

还原：

```shell
npm config set registry https://registry.npmjs.org/
```

如遇到 `npm WARN invalid config Must be a full url with 'http://'`，通过清除代理解决：

```shell
npm config delete proxy
npm config delete https-proxy
```

## yarn简介

作为 npm 的替代品，有以下几个优点：

* 速度快
  * 并行安装
  * 离线模式：再次安装时可从缓存中获取
* 版本统一：yarn.lock管理了当前项目依赖的版本及缓存地址
* 更简洁地输出
* 更好的语义化

### 使用方式

#### 初始化配置文件

```shell
yarn init -y
```

#### 安装依赖

```shell
yarn # 安装 package.json 中的所有模块
yarn add <packageName> # 安装该模块
yarn global add <packageName> # 全局安装
```

#### 删除依赖

```shell
yarn remove <packageName>
```

## 技巧

* node-gyp-install：它可以加快安装一些需要 C++ 编译器编译的插件的安装速度。

## 附录

[npm 模块安装机制简介](https://www.ruanyifeng.com/blog/2016/01/npm-install.html)