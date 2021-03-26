---
id: react-secret
title: react 技术揭秘
---

## react 理念

来自官网说的 react 理念：

> 我们认为，React 是用 JavaScript 构建快速响应的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。

核心是快速响应。

制约快速响应的场景：

* 当遇到大计算量的操作或者设备性能不足使页面掉帧，导致卡顿 - CPU 的瓶颈。
* 发送网络请求后，由于需要等待数据返回才能进一步操作导致不能快速响应 - IO 的瓶颈。

### CPU 瓶颈

通常屏幕的刷新频率是 60 Hzx，即每秒刷新 60 帧，渲染每一帧的时间大约是 16.66ms。

Javascript 可以操作 DOM，而 GUI 线程负责生成布局和绘制，Javascript 线程和 GUI 线程是互斥的，所以不能同时执行。

浏览器渲染每一帧（16.66ms），需要做以下工作：

js 脚本执行 → 生成布局 → 绘制到屏幕

如果 js 的执行时间过长，这一帧就没时间执行后面两个步骤，页面就会出现掉帧，我们肉眼就能看到卡顿的效果。

#### 如何解决

在每一帧的时间，预留出一些时间给 js 线程，react 利用这些时间更新组件（react 预留的时间是 5ms），剩余的时间留给浏览器执行**样式布局**和**样式绘制**。

时间分片：将长任务分拆到每一帧执行。实现时间分片的关键是将**同步更新****变为可中断的异步更新**。

### IO 瓶颈

网络延迟是前端开发者无法解决的。如何在网络延迟客观存在的情况下，减少用户对网络延迟的感知？

React给出的答案是将[人机交互研究的结果](https://zh-hans.reactjs.org/docs/concurrent-mode-intro.html#putting-research-into-production)整合到真实的 UI 中，例如：。

切换页面是，预先请求下一个页面需要的接口，停留**一小段时间**后再跳转，如果接口速度快，此时用户时感知不到当前页面是异步获取数据渲染的。当接口数据在一定时间内还未返回，再显示一个 loading 状态，这样可以避免了接口快速响应，出现loading 闪屏的效果，这个用户时能够感知到的。

基于人机交互研究的结果，react 实现了 [Suspense](https://zh-hans.reactjs.org/docs/concurrent-mode-suspense.html) 等功能。

## 老的 react 架构 - react15

react15 的架构主要分为两层：

* Reconciler（协调器） - 主要负责找出变化的组件
* Renderer（渲染器） - 负责将变化的组件渲染到页面上

### Reconciler

每当有更新发生时，Reconciler 会做以下工作：

* 调用函数组件或类组件的 render 方法，将返回的 jsx 转化为虚拟 DOM。
* 将虚拟 DOM 和上次更新时的虚拟 DOM 进行对比。
* 通过对比找出本次更新中变化的虚拟 DOM。
* 通知 Renderer 将变化的虚拟 DOM 渲染到页面上。

### Renderer

渲染器用于管理一棵 React 树，使其根据底层平台进行不同的调用。

react 支持跨平台，不同的平台有不同的渲染器：

* React DOM Renderer 将 react 组件渲染成 DOM。
* React Native Renderer 将 react 组件渲染成 Native 视图。
* React Test Renderer 将 react 组件渲染为 JSON 树，可用于 Jest 的快照测试。

### react15 架构的缺点

使用递归更新组件，一旦开始执行，就无法中断，当需要更新的组件树特别庞大时，超过16.66ms，就会有卡顿。

react15 不支持异步更新。

## 新的 react 架构 - react16

分为三层：

* Scheduler（调度器） - 调度任务的优先级，优先级高的任务优先进入 Reconciler。
* Reconciler（协调器） - 负责找出变化的组件。
* Renderer（渲染器） - 负责将变化的组件渲染到页面上。

### Scheduler

react 实现了功能更完备的 `requestIdleCallback` polyfill，这就是 Scheduler。它支持在浏览器空闲时触发回调，而且提供了多种调度优先级，以供任务设置。

### Reconciler

从递归变成了可中断的循环过程，使用 `shouldYield` 判断是否还有剩余时间。

当 Scheduler 中的任务进入 Reconciler 时，会为变化的虚拟 DOM 打上增加/更新/删除的标记。

当所有的组件都完成了 Reconciler 的工作，统一交给 Renderer。

Reconciler 的主要目标：

* 能够把可中断的任务切片处理。
* 能够调整优先级，重置并复用任务。
* 能够在父元素与子元素之间交错处理，以支持 React 中的布局。
* 能够在 render() 中返回多个元素。
* 更好地支持错误边界。

> Reconciler 内部采用 Fiber 的架构。

### Renderer

根据 Reconciler 为虚拟 DOM 打的标记，同步执行对应的 DOM 操作。

这三部分的执行流程：

1. Scheduler 找出优先级最高的任务，放入 Reconciler。
2. 为所有变化的虚拟 DOM 打上标记，通知 Renderer。
3. Renderer 对有标记的虚拟 DOM 执行操作，更具标记的不同执行不同的 DOM 操作。