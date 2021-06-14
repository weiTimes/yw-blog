---
id: scaffold-degisn
title: 如何设计一个“万能”项目脚手架？
---

编程领域的脚手架主要为了和完成新项目的启动和搭建，能够帮助开发者提升效率开发体验。脚手架类型：

- Vue/React 框架类脚手架
- webpack 等构建配置类脚手架
- 混合脚手架，比如大家熟悉的 vue-cli 或 crete-react-app

## 命令行工具原理和实现

使用命令行快速启动一个脚手架，实现自动化和智能化。

开发命令行工具的关键依赖：

- `inquirer`、`enquirer`、`prompts`: 处理复杂的用户输入，完成命令行输入交互。
- `chalk`、`kleur`: 使终端输出彩色信息文案。
- `ora`：命让令行出现好看的 Spinner。
- `boxen`: 可以在命令行画出 Boxes 区块。
- `listr`: 可以在命令行画出进度列表。
- `meow`、`arg`: 进行基础的命令行参数解析。
- `commander`、`yargs`: 进行更加复杂的命令行参数解析。
- `shelljs`: 使用 javascript 编写 shell 命令。

目标是通过以下方式快速创建项目：

```shell
# yarn
yarn create km-project
# npm
npm init km-project
```

或全局安装后运行命令：

```shell
# yarn
yarn global add km-create
# npm
npm install km-create -g
```

安装成功就可以全局执行 `km-create` 命令。

## 创建命令行项目

```shell
mkdir km-scaffold && cd km-scaffold
yarn init -y
```

项目最终的目录结构如下：

![目录结构](https://ypyun.ywhoo.cn/assets/20210610161007.png)

首先编写命令行入口文件：

```javascript title="bin/create-project.js"
#!/usr/bin/env node
require = require('esm')(module);

require('../src/cli').cli(process.argv);
```

上述代码中使用了 `esm` 模块，这样就可以在其它引用的文件中使用 esmodule，`src/cli.js` 的代码如下:

```javascript
export function cli(args) {
  console.log(args);
}
```

在执行 `km-`
