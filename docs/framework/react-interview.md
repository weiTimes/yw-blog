---
id: react-interview
title: React Interview
---

通过分析题干 → 构建知识导图 → 横向技术对比与纵向原理解析 → 答题文案的方式，梳理 React 的知识体系。

## 组件基础

### 你真的了解 React 吗？

类似的问法：

- 如何解释 React 是什么。
- 谈一谈你对 React 的理解。

#### 破题

> 破题是一个思维发散的过程

既要重视知识本身，也要重视表达方法。对这类概念题，使用四字口诀“讲说理列”：

- 讲概念：用简洁的话说清楚该技术是什么。最好能用一句话描述。
- 说用途：描述该技术的用途。能够具体结合适合场景，拓展性的描述。
- 理思路：梳理该技术的核心思路或运作流程。这个地方可深可浅，如果对其有足够深入的了解，建议详细地展开说明。
- 优缺点，列一遍：对该技术栈的优缺点进行列举。列举优缺点肯定有与其他技术方案横向对比的过程，那么在这个过程中，切忌刻意地踩一捧一。

#### 承题

基于四字口诀，延伸出作答的大体框架：

- 讲概念：讲技术本质。
- 说用途：说使用场景。
- 理思路：理核心技术思路。
- 列优缺点：对比调研业界流行的技术方案，发掘 React 的独特优势，找出 React 的缺点。

![作答思路](https://ypyun.ywhoo.cn/assets/20210524161616.png)

##### 概念

> 从历史去寻找答案。

_Jquery:_ 为了解决兼容性问题，Jquery 封装了大量的基础函数，是一个工具函数库，它没有解决代码如何组织的问题。

_AngularJS:_ 提供了一揽子全家桶解决方案，从底层开始深度封装，向上提供了路由、双向绑定、指令、组件等框架特性，双向绑定这个特性在当时极大地提升了开发效率，缺点是需要写大量的面条代码。

![angularjs](https://ypyun.ywhoo.cn/assets/20210524162454.png)

_Backbone.js:_ 类 jQuery，不需要再学习一种语言；引入基础 MVC 的概念，同时提供集合与路由的封装。

到这里仍然有两个问题难以解决：

- 需要一个使组件复用的方案，过去常见的方案是拼装模板。
- 组件作为基本单位是应该可以通过编写单元测试来维持稳定性的。

_Reactjs:_ `View = Fn(props, state, context)`。这个公式表达了给定相同的输入状态，函数总是会生成一致的组件；只有做到输入与输出恒定，那么它才是可预测的。

- Fn 可能是类组件，也可能是函数组件，也可能在函数中产生副作用（直接操作 DOM，绑定事件，网络请求等），但最终 React 只关心两件事：**数据与组件**。
- React 的设计思想的核心在于“组合优于继承”，即在构建 UI 视图时，组件组合始终是最优的解决方案，所以 React 本质上是一个组件化框架。

##### 用途

构建视图。可用来开发 PC 端、移动端、小程序、App、VR 应用等。

##### 核心思路

React 的核心思路有三点：

- 声明式
  - 声明式编程的优势在于直观，可以做到一目了然，也便于组合。
- 组件化
  - 组件化可以降低系统间功能的耦合性，提高功能内部的聚合性（采用声明式的 jsx）。
- 通用性
  - React 将 DOM 抽象为虚拟 DOM，开发者并不会直接操作 DOM。有了一层封装，只要兼容虚拟 DOM，就能运行 React。

##### 优缺点

其实核心设计思路就是 React 的优点：声明式、组件化与通用性。

缺点：React 只提供了如何编写视图，像路由、状态管理等都交给了三方库来实现，所以在技术选型和学习使用上有较高的成本。

#### 回答

React 是一个 UI 库，通过组件化的方式解决视图层开发复用的问题，本质是一个组件库。

它的核心设计思路有三点，分别是声明式、组件化与通用性。

声明式的优势在于直观与组合。

组件化的优势在于视图的拆分与模块复用，可以更容易做到高内聚低耦合。

通用性在于一次学习，随处编写。比如 React Native，React 360 等， 这里主要靠虚拟 DOM 来保证实现。

这使得 React 的适用范围变得足够广，无论是 Web、Native、VR，甚至 Shell 应用都可以进行开发。这也是 React 的优势。

但作为一个视图层的库，React 的劣势也十分明显。它并没有提供完整的一揽子解决方案，在开发大型前端应用时，需要向社区寻找并整合解决方案。虽然一定程度上促进了社区的繁荣，但也为开发者在技术选型和学习使用上造成了一定的成本。

补充：

- 优势后：对 React 优化的看法、对虚拟 DOM 的看法。
- 谈谈 React 相关的工程架构和设计模式。

### 为什么 React 要用 JSX

> 相当于问 React 为什么不用 A、B、C。

考察：

- 技术广度，深挖知识面涉猎广度，对流行框架的模板方案是否知悉了解；
- 技术方案调研能力。

#### 承题

三步走：一句话解释、核心概念、方案对比：

- 一句话解释 jsx。首先能一句话解释清除 jsx 到底是什么。
- 核心概念。jsx 用于解决什么问题？如何使用？
- 方案对比。与其他的方案对比，说明 React 选用 jsx 的必要性。

![为什么使用 jsx](https://ypyun.ywhoo.cn/assets/20210525092433.png)

##### 一句话解释

JSX 是一个 JavaScript 的语法扩展，或者说是一个类似于 XML 的 ECMAScript 语法扩展。

##### 核心概念

- JSX 更像是一种**语法糖**，通过类似 XML 的描述方式，描写函数对象。
- React 需要将组件转化为虚拟 DOM 树，所以我们在编写代码时，实际上是在手写一棵结构树。而 **XML 在树结构的描述上天生具有可读性强的优势**。
- 运行的时候，Babel 会将 jsx 语法的代码转换成 React.createElement 的代码。

##### 方案对比

设计初衷：关注点分离，单个组件高内聚低耦合。

_模板：_ 分离了技术栈，还需要引入新的模板语法、模板指令等。

_模板字符串：_ 代码结构变得更复杂了，开发工具的代码提示也会变得很困难。

_JXON：_ 类似 jsx，只是大括号不能为元素在树中开始和结束的位置提供很好的语法提示。

#### 回答

在回答问题之前，我首先解释下什么是 JSX 吧。JSX 是一个 JavaScript 的语法扩展，结构类似 XML。

JSX 主要用于声明 React 元素，但 React 中并不强制使用 JSX。即使使用了 JSX，也会在构建过程中，通过 Babel 插件编译为 React.createElement。所以 JSX 更像是 React.createElement 的一种语法糖。

所以从这里可以看出，React 团队并不想引入 JavaScript 本身以外的开发体系。而是希望通过合理的关注点分离保持组件开发的纯粹性。

接下来与 JSX 以外的三种技术方案进行对比。

首先是模板，React 团队认为模板不应该是开发过程中的关注点，因为引入了模注板语法、模板指令等概念，是一种不佳的实现方案。

其次是模板字符串，模板字符串编写的结构会造成多次内部嵌套，使整个结构变得复杂，并且优化代码提示也会变得困难重重。

最后是 JXON，同样因为代码提示困难的原因而被放弃。

所以 React 最后选用了 JSX，因为 JSX 与其设计思想贴合，不需要引入过多新的概念，对编辑器的代码提示也极为友好。

### 如何避免生命周期中的坑

![生命周期](https://ypyun.ywhoo.cn/assets/20210609105453.png)

#### 破题

遇到的坑往往有两种：

- 在不恰当的时候调用了不合适的代码。
- 在需要调用时，忘记了调用。

通过梳理生命周期，明确周期函数职责，确认什么时候该做什么事儿，以此来避免坑。

#### 生命周期概念（周期梳理）

挂载 → 更新 → 卸载这一 react 组件的完成流程，就是完整的生命周期。

#### 挂载阶段

组件从初始化到完成加载的过程。

`constructor`:

是类的构造函数，常用于初始化 state 与绑定函数。

类属性的出现后，逐渐除去了 constructor。

`getDerivedStateFromProps`:

##### 触发时机

- 当 props 传入时；
- state 发生变化时；
- forceUpdate 被调用时。

##### 反模式的使用方式

- 直接复制 props 到 state；
- 在 props 变化后修改 state。

`UNSAFE_componentWillMount`:

已被弃用，react 的异步渲染机制下，该方法会被多次调用。

常见的错误是 `componentWillMount` 在同构渲染时，在该函数中发起网络请求，客户端和服务器端分别会执行一次，所以推荐在 `componentDidMount` 中发起网络请求。

当 `getDerivedStateFromProps` 存在时，该函数不会被执行。

`render`:

render 函数返回 jsx，用于描述具体的渲染内容。

不能调用 setState 或绑定事件。 setState 会造成死循环，因为每次渲染都会调用 render，setState 会触发渲染；同样的绑定事件会频繁地调用注册。

`componentDidMount`:

组件加载完成发起网络请求或绑定事件，接在 render 之后调用。

在浏览器端 componentDidMount 一定是在真实 DOM 绘制完成之后调用的，但是在其它场景下不一定，如 react native 场景下，会受限于机器的性能，视图可能还在绘制中。

##### 总结挂载阶段函数的调用顺序

constructor → getDerivedStateFromProps → render → componentDidMount。

如果有子组件，包含子组件挂载阶段的调用顺序：

constructor → getDerivedStateFromProps → render → child-constructor → child-getDerivedStateFromProps → child-render → child-componentDidMount → componentDidMount。

#### 更新阶段

如果接收到新的 `props` 或 `state`，就是更新阶段。

`UNSAFE_componentWillReceiveProps`:

已被弃用，其功能可被 getDerivedStateFromProps 代替。

当 getDerivedStateFromProps 存在时，该函数不会被执行。

`getDerivedStateFromProps`:

通挂载阶段表现一致。

`shouldComponentUpdate`:

通过返回一个布尔类型的值来确定是否要触发新的渲染，可用作性能优化，通过添加判断条件来阻断渲染。

PureComponent 默认实现了 shouldComponentUpdate 函数，在该函数中对 props 和 state 进行浅比较，根据比较结果判断是否触发更新。

```javascript
shouldComponentUpdate(nextProps, nextState) {
  // 浅比较仅比较值与引用，并不会对 Object 中的每一项值进行比较
  if (shadowEqual(nextProps, this.props) || shadowEqual(nextState, this.state) ) {
    return true
  }
  return false
}
```

`UNSAFE_componentWillUpdate`:

已被废弃。在异步渲染的场景中，可能会出现组件暂停更新渲染的情况。

`render`:

同挂载阶段一致。

`getSnapshotBeforeUpdate`:

配合 react 新的异步渲染机制，在 DOM 更新发生前被调用，返回值将作为 componentDidUpdate 的第三个参数。

`componentDidUpdate`:

可以使用 setState，会触发重新渲染，但要注意避免陷入死循环。

##### 总结更新阶段函数的调用顺序

getDerivedStateFromProps → shouldComponentUpdate → render → getSnapshotBeforeUpdate → componentDidUpdate

#### 卸载阶段

`componentWillUnmount`:

主要用于清理工作。如取消定时器、移除事件绑定。

#### 职责梳理

- 什么情况下会触发重新渲染。
- 渲染中发生报错后会怎样？如何处理报错？

下面三种情况下会发生重新渲染：

##### 函数组件

函数组件任何情况下都会重新渲染。它没有生命周期，可以使用 React.memo 进行优化。

React.memo 没有阻断渲染，而是跳过渲染组件的操作并直接复用最近一次渲染的结果。

##### React.Component

如果没有实现 shouldComponentUpdate，有两种情况会触发重新渲染：

- state 发生变化。
- 父组件传入 props 时，无论有没有变化，只要传入就会引发重新渲染。

##### React.PureComponent

默认实现了 shouldComponentUpdate，对 props 和 state 进行浅比较，确认有变更时触发更新。

#### 错误边界

可以捕获并打印发生在其子组件树任何位置的 javascript 错误，并渲染出备用 UI。

处理了错误边界，就不会在应用崩溃时页面白屏。

在做 _错误监控_ 时，可以通过 `componentDidCatch` 捕获渲染时的错误。

#### 答题

避免生命周期中的坑要做好两件事：

- 不在不恰当的时候调用不该调用的代码；
- 在需要调用时，不要忘了调用。

主要有 7 种情况容易造成生命周期的坑：

- `getDerivedStateFromProps` 容易编写反模式代码，使受控组件和非受控组件区分模糊。
- `componentWillMount` 已被弃用，主要原因是新的异步渲染架构会导致它被多次调用，所以网络请求和事件绑定应该移到 componentDidMount 中。
- `componentWillReceiveProps` 已被弃用，被 getDerivedStateFromProps 取代，主要是性能问题。
- `shouldComponentUpdate` 通过返回布尔类型的值来确定是否需要出发重新渲染，主要用于性能优化（要注意 PureComponent 默认实现了它， 但只是浅比较）。
- `componentWillUpdate` 已被弃用，同样是因为新的异步渲染的架构，可能会出现组件暂停更新的情况，原先的逻辑可以结合 getSnapshotBeforeUpdate 与 componentDidUpdate 改造使用。
- `componentWillUnmount` 中忘记清除定时器和移除事件绑定等操作，容易引发 bug。

如果没有添加错误边界处理，当渲染发生异常时，页面将会出现白屏。

#### React 的请求应该放在哪里，为什么？

对于异步请求，应该放在 componentDidMount 中，另外还可以有以下选择：

- constructor: 可以放，但从设计上而言不推荐。constructor 主要用于初始化 state 和事件绑定，并不承载业务逻辑，随着类属性的流行，它已经很少使用了。
- componentWillMount: 已被标记废弃，在新的异步渲染架构中，可能会触发多次渲染，容易引发 bug。

所以放在 componentDidMount 中是最好的选择。
