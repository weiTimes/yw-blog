---
id: react-cycle
title: React 生命周期
---

在 React17 中，react 团队弃用了一些生命周期钩子，因为它们一开始并不是为了即将到来的新特性而设计的，比如异步渲染。在进行异步渲染时，其中一些生命周期钩子会变得不安全。

被弃用的钩子：

- componentWillMount
- componentWillRecieveProps
- componentWillUpdate

在 React17 中，它们已经被完全弃用了，不过仍然可以加上 `UNSAFE_` 来使用它，如 `UNSAFE_componentWillMount`。

在异步渲染中，`componentWillMount` 会被多次调用，从而导致组件的多次渲染。如在同构开发中，在 `componentWillMount` 中发起请求，结果就是它会在服务端和客户端分别被调用一次，造成了多次渲染。
