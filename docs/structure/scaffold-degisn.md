---
id: react-ssr
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

目标是通过以下方式快速创建项目：

```shell
# npm
npm init @km/project
# yarn
yarn create @km/project
```

## 创建命令行项目
