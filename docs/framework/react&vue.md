---
id: react-vue
title: react17 vs vue3
---

> 大圣直播  -> 笔记

![全景地图](https://ypyun.ywhoo.cn/assets/20210305213345.png)

<center>全景地图</center>

## vue3 vs react17

### 变化

* vue3: options => composition
* ref api
* react: class => functional

#### options

* data 负责数据，method 负责方法。
* 业务变得越来越复杂时，这一块的代码会越来越长，难以维护（需上下反复查找代码）；如引入了mixin，有可能会导致命名冲突。
* 没有办法知道 this 里面包含什么。

#### composition

> reactive, ref, toRefs

* 支持tree-shaking（编译时优化） 删除无用的代码。如没有用到 computed，代码 build 的时候就会删掉 vue3 中的computed 代码。
* 方便组合，逻辑都是函数，组合优于继承。
* 组件可以任意拆分

#### hooks

* 对顺序有要求

#### 思考

> 响应式：数据变了通知你（vue1 是纯响应式 => defineProperty 太多导致卡顿）。
> virtual dom: 数据变了，通过 dom diff 计算变化（react 纯 vdom）。
> 响应式和 vdom 是如何配合的？根据组件划分，组件之间通过响应式通知，组件内部，通过vdom diff
> vdom 树太大了，diff 时间超过了 16.66ms（浏览器渲染一帧需要花费的时间），会导致卡顿，如何解决？

### 不同维度设计思想

![设计思想](https://ypyun.ywhoo.cn/assets/20210306133112.png)

### Vue3

> 编译时做的优化，灵感来自 prepack.io

![整体](https://ypyun.ywhoo.cn/assets/20210305222222.png)
<center>整体</center>

* 固化、有限制，容易做优化
* 编译时优化：作静态标记（跳过不变的属性），实现按需更新

> Vue3 Template Explorer: 查看编译后的结果
> 位运算，做组合权限的最佳实践

![vue1.x](https://ypyun.ywhoo.cn/assets/20210305231340.png)

![vue2.x](https://ypyun.ywhoo.cn/assets/20210305231529.png)

* 组件间使用响应式，组件内部使用 vdom
* 引入了 vdom，使用的是 snabbdom 的代码，双端预判（减少循环次数）

### React

> 单向数据流
> 运行时做的优化

* 自由、动态化，不容易做优化工作

> slot（antd 源码 ）

* react 15，dom diff: 横向平级对比，时间复杂度为O(n)
![react15](https://ypyun.ywhoo.cn/assets/20210305231412.png)

* fiber：树结构 => 链表
1. 任务可以切片，利用空闲时间计算
2. diff 可以中断，等执行完优先级更高的任务后再回来继续执行
![fiber](https://ypyun.ywhoo.cn/assets/20210305231852.png)

* 浏览器帧

![帧](https://ypyun.ywhoo.cn/assets/20210305233654.png)

每一个 Frame 是一帧，一帧是16.66ms，react 利用空闲时间进行 dom diff。

requestIdleCallback 在浏览器空闲时间调用，可以会执行低优先级工作，而不会影响关键事件：如动画和输入响应。该 api 有兼容性问题，react 自己实现了该 api。

#### redux

![redux](https://ypyun.ywhoo.cn/assets/20210307140130.png)

store 存储数据，component 通过 dispatch 将 action 提交到 store，再通过 reducer 处理数据，store再将处理完的数据返回给 component。

> 函数式编程：中间件、compose、reduce

### SSR

![SSR](https://ypyun.ywhoo.cn/assets/20210307142717.png)

> 同构解决方案

数据、路由、组件构成一个完整的应用，应用的运行有两个入口，分别负责服务端和客户端的渲染。当首次运行时，使用服务端渲染，页面直出，所以首屏渲染快，后续的渲染走客户端渲染，可以不刷新页面进行不同页面的渲染。

### 虚拟 DOM

> DOM 操作成本高，应尽可能少操作 DOM。
> 虚拟 DOM 在真正 DOM 操作之前，先进行 DOM diff。

* 用对象来描述 DOM 节点，支持跨端

## 性能优化手段

* 宏观看性能
* 编译时优化 Compiler
* vdom
* 工程化

## 编译原理

![编译](https://ypyun.ywhoo.cn/assets/20210305235453.png)

vue3: template ==compiler=> AST ==静态标记=> Transform ==Generate=> code

* the-super-tiny-compiler 编译原理库

## 前端框架中的算法和数据结构

![算法](https://ypyun.ywhoo.cn/assets/20210307145421.png)

vue2: 双端比较算法
vue3: 最长递增子序列（贪心 + 二分）

keep-alive 等缓存场景 LRU

双向链表

## TODO

## 框架中的规范

* 代码规范
* mono repo
* git commit 规范
* 开源规范

- [ ] 一灯源码系列