---
id: start
title: 开始
---

在你的开发环境下使用 Storybook。

Storybook 是在开发模式下 与 您的应用程序一起运行的. 它可以帮助您构建 UI 组件,并与 应用程序的 业务逻辑和上下文 隔离开来. 本期"学习 Storybook"适用于 React。

## 创建一个React Storybook 项目

我们需要遵循几个步骤在您的环境中设置构建流程。首先，我们想要使用[Create React App](https://github.com/facebook/create-react-app) (CRA)来设置我们的构建系统，并在创建的App中启用Storybook和Jest测试。让我们运行以下命令:

```shell

# 创建应用
npx create-react-app storybook-in-taskbox

cd storybook-in-taskbox

# 添加 Storybook
npx -p @storybook/cli sb init

```

我们可以快速检查应用程序的各种环境是否正常运行：

```shell

# 运行测试环境 Jest
yarn test --watchAll

# 启动 storybook 服务
yarn storybook

# 启动项目
yarn start

```

:::tip

如遇到执行 `yarn storybook` 出错，错误提示是 `ERR! Error: Cannot find module 'babel-loader'`，可以执行 `yarn add babel-loader` 安装该依赖。

:::