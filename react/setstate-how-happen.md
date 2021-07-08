---
id: setstate-how-happen
title: setState 如何知道该做什么
---

调用 `setState` 然后触发更新 DOM，这到底是 React 本身负责的，还是 ReactDOM 负责的？

如果是 React 负责的操作并更新 DOM，那么它又怎么能在其它环境下使用呢，比如 React Native App 中也能调用 `setState`，但是它渲染的是安卓和 ios 原生的界面而不是 DOM。再比如 `TestingLibrary`、`React ART`都可以调用 `setState`，所以 React 是以某种未知的方式将处理状态更新的任务委托给了特定平台的代码。

## react 的包管理

React 只暴露了一些定义组件的 API，绝大多数的实现都存在于“渲染器（renderers）” 中。

常见的渲染器：

- react-dom
- react-dom/server
- react-native
- react-test-renderer
- react-art

React 导出的 React.Component、React.createElement、React.children 和 Hooks 都是独立于特定平台的，也就是说都可以被特定平台以同样的方式使用。

渲染器之间存在着一样的代码复制，被称为“协调器（reconciler）”。

**注意：**react 包只是能够使用 React 的特性，但是它不知道这些特性是如何实现的，而渲染器提供了 React 特性和平台特定逻辑的实现，其中有些代码是协调器实现的。

## setState 是如何与渲染器进行协作的

每个渲染器都会在创建完组件实例之后设置一个特殊的 `updater` 字段：

```javascript
// React DOM 内部
const inst = new YourComponent();
inst.props = props;
inst.updater = ReactDOMUpdater;

// React DOM Server 内部
const inst = new YourComponent();
inst.props = props;
inst.updater = ReactDOMServerUpdater;

// React Native 内部
const inst = new YourComponent();
inst.props = props;
inst.updater = ReactNativeUpdater;
```

setState 所做的事情就是委托渲染器安排并处理更新：

```javascript
// 适当简化的代码
setState(partialState, callback) {
  // 使用`updater`字段回应渲染器！
  this.updater.enqueueSetState(this, partialState, callback);
}
```

## useState 又是如何与渲染器进行协作的

useState 实际上做了和 setState 一样的事情，就是将调用转发给当前的渲染器。

Hooks 使用了 `dispatcher` 对象，它代替了 `updater` 对象，当调用 `useState`、`useEffect` 或其它内置 hooks，这些调用会被转发给了当前的 `dispatcher`。

```javascript
// React内部(适当简化)
const React = {
  // 真实属性隐藏的比较深，看你能不能找到它！
  __currentDispatcher: null,

  useState(initialState) {
    return React.__currentDispatcher.useState(initialState);
  },

  useEffect(initialState) {
    return React.__currentDispatcher.useEffect(initialState);
  },
  // ...
};
```

在渲染组件之前，会先设置 `dispatcher` 对象：

```javascript
// React DOM 内部
const prevDispatcher = React.__currentDispatcher;
React.__currentDispatcher = ReactDOMDispatcher;
let result;
try {
  result = YourComponent(props);
} finally {
  // 恢复原状
  React.__currentDispatcher = prevDispatcher;
}
```

## 最后

`updater` 和 `dispatcher` 是使用依赖注入的方式被渲染器注入到 react 组件中，这样使组件更具声明性。

## 附录

- [how-does-setstate-know-what-to-do](https://overreacted.io/zh-hans/how-does-setstate-know-what-to-do/)
