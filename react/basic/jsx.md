---
title: 认识 JSX
---

弄清楚 jsx ，方便学习掌握以下内容：

- 了解常用的元素会被 React 处理成什么，有利于后续理解 react fiber 类型；
- 理解 jsx 的编译过程，方便操纵 children、控制 React 渲染，有利于便捷使用 React 插槽组件。

一段 JSX 代码经过 babel 的转译会变成 React Element 的形式，先看 `React.createElement` 的用法：

```javascript
React.createElement(type, [props], [...children]);
```

:::note 参数解释

- `type`: 如果是组件类型，会传入组件对应的类或函数；如果是 dom 元素类型，传入 div 或 span 之类的字符串。
- `props`: 一个对象，在 dom 类型中为标签属性，在组件类型中为 props 组件属性。
- `其它参数`：子节点，按顺序排列。

:::

举个例子：

```jsx
<div>
  <TextComponent />
  <div>hello,world</div>
  let us learn React!
</div>
```

上述代码会被编译成：

```javascript
React.createElement(
  'div',
  null,
  React.createElement(TextComponent, null),
  React.createElement('div', null, 'hello,world'),
  'let us learn React!'
);
```

:::tip 老版本的 React 中，为什么写 jsx 的文件要默认引入 React?
因为 jsx 会被编译成 React.createElement 形式的代码，所以需要引入 React，防止找不到 React 而报错。
:::

## jsx 的转换规则

| `jsx` 元素类型  | `react.createElement` 类型转换            | `type` 属性              |
| --------------- | ----------------------------------------- | ------------------------ |
| element 元素    | react element 类型                        | 标签字符串，如 `'div'`   |
| fragment 类型   | react element 类型                        | Symbol 或 Fragement 类型 |
| 文本类型        | 直接字符串                                | 无                       |
| 数组类型        | 返回数组结构，数组项被 createElement 转换 | 无                       |
| 组件类型        | element 类型                              | 类组件或函数组件本身     |
| 三元运算/表达式 | 先执行三元运算，然后按照上述规则处理      | 看三元运算返回结果       |
| 函数执行        | 先执行函数，然后按照上述规则处理          | 看函数执行结果           |

## 调和阶段

经过 babel 编译的 jsx 代码，在调和阶段，每个节点都会形成一个对应的 `fiber` 对象，然后通过 `sibling`、`return`、`child` 将每个 `fiber` 对象联系起来。

### 不同种类的 fiber Tag

React 针对不同的 React Element 对象会产生不同 tag 的 fiber 对象。

```javascript title="tag 与 element 的对应关系"
export const FunctionComponent = 0; // 函数组件
export const ClassComponent = 1; // 类组件
export const IndeterminateComponent = 2; // 初始化的时候不知道是函数组件还是类组件
export const HostRoot = 3; // Root Fiber 可以理解为跟元素 ， 通过reactDom.render()产生的根元素
export const HostPortal = 4; // 对应  ReactDOM.createPortal 产生的 Portal
export const HostComponent = 5; // dom 元素 比如 <div>
export const HostText = 6; // 文本节点
export const Fragment = 7; // 对应 <React.Fragment>
export const Mode = 8; // 对应 <React.StrictMode>
export const ContextConsumer = 9; // 对应 <Context.Consumer>
export const ContextProvider = 10; // 对应 <Context.Provider>
export const ForwardRef = 11; // 对应 React.ForwardRef
export const Profiler = 12; // 对应 <Profiler/ >
export const SuspenseComponent = 13; // 对应 <Suspense>
export const MemoComponent = 14; // 对应 React.memo 返回的组件
```

看如下代码：

```jsx
const toLearn = ['react', 'vue', 'webpack', 'nodejs'];

const TextComponent = () => <div> hello , i am function component </div>;

class Index extends React.Component {
  status = false; /* 状态 */
  renderFoot = () => <div> i am foot</div>;

  render() {
    /* 以下都是常用的jsx元素节 */
    return (
      <div style={{ marginTop: '100px' }}>
        {/* element 元素类型 */}
        <div>hello,world</div>
        {/* fragment 类型 */}
        <React.Fragment>
          <div> 👽👽 </div>
        </React.Fragment>
        {/* text 文本类型 */}
        my name is alien
        {/* 数组节点类型 */}
        {toLearn.map((item) => (
          <div key={item}>let us learn {item} </div>
        ))}
        {/* 组件类型 */}
        <TextComponent />
        {/* 三元运算 */}
        {this.status ? <TextComponent /> : <div>三元运算</div>}
        {/* 函数执行 */}
        {this.renderFoot()}
        <button onClick={() => console.log(this.render())}>
          打印render后的内容
        </button>
      </div>
    );
  }
}
```

上述代码会先被编译成 createElement 的形式，然后在调和阶段形成一个 fiber 树，树结构如下图所示：

![fiber结构图](https://ypyun.ywhoo.cn/assets/20210805224837.png)

## 进阶实战-可控性 render

对上面 demo 进行改造，按照以下步骤：

1. 对元素的 children 进行扁平化处理；
2. 取出 children 中的文本节点；
3. 向 children 的最后插入 footer 元素；
4. 克隆新的元素节点并渲染。

```jsx
import React from 'react';

const toLearn = ['react', 'vue', 'webpack', 'nodejs'];

const TextComponent = () => <div> hello , i am function component </div>;

export default class Test extends React.Component {
  status = false; /* 状态 */
  renderFoot = () => <div> i am foot</div>;

  render() {
    const reactElement = (
      <div style={{ marginTop: '100px' }}>
        {/* element 元素类型 */}
        <div>hello,world</div>
        {/* fragment 类型 */}
        <React.Fragment>
          <div> 👽👽 </div>
        </React.Fragment>
        {/* text 文本类型 */}
        my name is alien
        {/* 数组节点类型 */}
        {toLearn.map((item) => (
          <div key={item}>let us learn {item} </div>
        ))}
        {/* 组件类型 */}
        <TextComponent />
        {/* 三元运算 */}
        {this.status ? <TextComponent /> : <div>三元运算</div>}
        {/* 函数执行 */}
        {this.renderFoot()}
        <button onClick={() => console.log(this.render())}>
          打印render后的内容
        </button>
      </div>
    );

    const { children } = reactElement.props;

    // 1. 扁平化 children
    const flatChildren = React.Children.toArray(children);

    const newArray = [];

    // 2. 取出文本节点
    React.Children.forEach(flatChildren, (item) => {
      if (React.isValidElement(item)) {
        newArray.push(item);
      }
    });

    // 3. 添加新的节点
    const lastElement = React.createElement(
      'footer',
      { className: 'last' },
      '我是底部的节点'
    );

    newArray.push(lastElement);

    // 修改容器节点
    const newReactElement = React.cloneElement(reactElement, {}, ...newArray);

    console.log(newReactElement);

    return newReactElement;
  }
}
```

### 扁平化处理 children

`React.Children.toArray` 可以对 children 扁平化处理。

### 去除文本节点

`React.isValidElement` 检测是否是 React Element。

`React.Children.forEach` 等价于 `React.Children.toArray` + `Array.prototype.forEach`。

### 插入新的元素

```javascript
React.createElement('footer', { className: 'last' }, '我是底部的节点');
```

等价于：

```jsx
<footer className='last'>我是底部的节点</footer>
```

### 通过 cloneElement 创建新的容器元素

```javascript
const newReactElement = React.cloneElement(reactElement, {}, ...newArray);
```

`cloneElement` 以 React Element 为样板克隆并返回新的 React Element 元素，第二个参数表示 props，最终会将 props 和克隆样板的 props 进行浅合并。

:::tip React.createElement 和 React.cloneElement 有什么区别？

前者是用来创建 Element，而后者是用来修改 Element，并返回一个新的 Element。

:::

## 总结

jsx 会先转换为 React.Element，在转换成 React fiber 对象。
