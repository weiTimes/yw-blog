---
id: react-mini
title: 实现一个 mini 版本的 react
---

这篇文章将从以下几步从零开始编写一个 react，它遵循真实 react 的架构，但不包含优化和不重要的特性：

1. 实现 `createElement` 方法。
2. 实现 `render` 方法。
3. Concurrent Mode
4. Fibers
5. Render 和 Commit 阶段
6. Reconciliation 阶段
7. 函数式组件
8. Hooks

## 第 0 步

首先复习一些基础概念。如果你已经知道 react、JSX、DOM 元素是如何工作，可以跳过这一步。

以下三行代码实现了一个最简 react 应用：

```jsx
const element = <h1 title="foo">Hello</h1>
const container = document.getElementById("root")
ReactDOM.render(element, container)
```

当然它不能正常运行在，我们需要把它转换成用纯 javascript 编写的代码：

```javascript
// 根节点
const app = document.querySelector('#root');

// element => createElement => vitual dom
const element = {
  type: 'h1',
  props: {
    title: '实现一个 mini react 应用',
    children: 'Ywhoo~',
  },
};

// 根据虚拟 DOM 创建元素
const node = document.createElement(element.type);
node['title'] = element.props.title;

// 创建子节点，子节点是文本，所以创建的是文本节点
const text = document.createTextNode('');
text['nodeValue'] = element.props.children;

// 插入到 DOM 中
node.appendChild(text);
app.appendChild(node);
```

以上代码就使用纯 javascript 实现了 react 的最简应用（前面3行代码）。

## 1. createElement

看如下一段 jsx 代码：

```jsx
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)
```

以上代码的 js 实现:

```javascript
const element = React.createElement(
  "div",
  { id: "foo" },
  React.createElement("a", null, "bar"),
  React.createElement("b")
)
```

将这段 jsx 转换成 js，需要 createElement 函数，它需要传入元素的类型、属性及子节点作为函数的参数，以下是简单的实现：

```javascript
/**
 * @param {*} type 类型
 * @param {*} props 属性
 * @param {*} children 子节点
 * @returns
 */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}
```

由于子节点也可能是基本数据类型，如字符串或数字类型，需要将非对象类型的子节点使用 createTextElement 创建：

```javascript
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
```

修改 createElement:

```javascript
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // highlight-start
      children: children.map(child => {
          return typeof child ==='object' ? child : createTextElement(child)
      }),
      // highlight-end
    },
  };
}
```

为了区别 `React.createElement`，我将这个 mini react 取名为 Yreact，所以就有了如下代码：

```javascript
const Yreact = {
  createElement,
};

const result = Yreact.createElement(
  'div',
  { id: 'foo' },
  Yreact.createElement('a', null, 'bar'),
  Yreact.createElement('b')
);
```

到这里使用了我们实现了 `createElement` 和 `createTextElement` 方法用于将上述 jsx 转换成 js，转换后的结果应该如上所示。如果想让 babel 使用 Yreact 转译 jsx，可以在 jsx 代码上面加一行注释：

```javascript
// highlight-next-line
/** @jsx Yreact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)
```

## 2. render

这一步我们来实现 render 函数，只关心如何将前面 jsx 转 js 产生的 Yreact 元素 插入到真实 DOM 中。一个 render 函数的雏形应该是这样的：

```javascript
function render(element, container) {
  const node = document.createElement(element.type);
​
  container.appendChild(node);
}
```

以上代码实现了将一个元素插入到另一个元素中，接着使用递归对子元素执行相同的操作：

```javascript
function render(element, container) {
  const node = document.createElement(element.type);

  // highlight-start
  element.props.children.forEach(child =>
    render(child, node)
  );
 // highlight-end
  container.appendChild(node);
}
```

再来完善逻辑，对文本节点使用 createTextElement 调用：

```javascript
function render(element, container) {
  // 判断是否是文本节点
  // highlight-start
  const node =
    element.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(element.type);
      // highlight-end

  element.props.children.forEach(child =>
    render(child, node)
  );
  container.appendChild(node);
}
```

最后一步，将 props中非 children 的属性都传入到 dom 节点中：

```javascript
export default function render(element, container) {
  // 判断是否是文本节点
  const node =
    element.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(element.type);

  // 将 props中非 children 的属性都传入到 dom 节点中
  // highlight-start
  const isProperty = (key) => key !== 'children';
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((prop) => (node[prop] = element.props[prop]));
  // highlight-end

  element.props.children.forEach((child) => render(child, node));

  container.appendChild(node);
}
```

使用方式如下：

```javascript
const App = Yreact.createElement(
  'div',
  { id: 'foo' },
  Yreact.createElement('a', null, 'bar'),
  Yreact.createElement('b')
);

// highlight-next-line
Yreact.render(App, document.querySelector('#root'));
```

## 3. Concurrent Mode

递归调用有个问题，一旦开始执行，将不能中断，如果有一个非常巨大的 DOM 树，主线程会一直处于繁忙中。这个时候浏览器不能响应用户事件和流畅的动画，直到递归执行完毕。

所以需要将任务划分为更小的执行单元，如果浏览器有优先级更高的任务，可以中断当前任务，将控制权交还给浏览器。

可以使用 `requestIdleCallback` 实现，它在浏览器空闲的时候会自动执行任务。它会传递一个 deadline 参数，告诉我们浏览器还有多少空闲的时间，我们需要在这之前中断任务的执行。

```javascript
let nextUnitOfWork = null;

function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    // 剩余空闲时间 < 1
    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

// 利用浏览器的空闲时间执行任务
// 当空闲时间不足时，中断当前任务，将控制权交给浏览器
requestIdleCallback(workLoop);

// 执行任务，返回下一个执行单元的任务
function performUnitOfWork() {
  // TODO:
}
```

## 4. Fibers

为了组织工作单元，需要一种叫 fiber 树的数据结构。每个 react 元素对应一个 fiber，每个 fiber 都是一个工作单元。

在 render 中，为将要渲染的 DOM 树创建一个 root fiber，并赋值给 `nextUnitOfWork`，剩余的工作在 `performUnitOfWork` 中完成，它主要为每个 fiber 做三件事情：

1. 将 react element 插入到 DOM 中
2. 为 react element 的子元素创建 fibers
3. 返回下一个工作单元

![fiber tree](https://ypyun.ywhoo.cn/assets/20210311232459.png)

fiber 通过 child、sibings、return 指针分别指向子节点、兄弟节点和父节点，这样很容易通过指针找到下一个工作单元。

fiber 树执行流程：

1. 如果有 child，会先执行 child 对应的工作单元
2.  si如果没有 child，有bing，就执行 sibing 对应的工作单元
3. 既没有 child，也没有 sibing，就执行 return 对应的工作单元
4. 直到执行到 root，意味着整个 DOM 树渲染完毕

## 5. Render 和 Commit 阶段

当我们添加 node 到 DOM 时，浏览器将执行权夺走，此时我们的工作还未完成，于是用户就看到了未完成的 UI。

我们需要持续地追踪 fiber 树的 root，称它为 WorkInProgressRoot。

一旦完成了所有工作（没有下一个工作单元），就将整个 fiber 树提交到 DOM。它由 commitRoot 完成，这里递归地将节点添加到 DOM。

## 6. Reconciliation

前面完成了添加元素到 DOM 的工作，那么更新和删除操作呢？

首先需要比较在 render 中收到的元素和最后一次在 commit 阶段提交到 DOM 的元素。

我们使用 currentRoot 指向最后一次 commit 到 DOM 的 fiber tree。

每个 fiber 都有一个 alternate 属性，它指向 old fiber，也就是上一次 commit 阶段提交到 DOM 的 fiber。

### 比较 old fiber 和 elements(当前将要渲染到 dom 的元素)

有以下几个比较规则：

* 如果旧的 fiber 和 element 有相同的类型，那么就保留该 dom 节点，只更新 props 即可。
* 如果是类型不相同，旧的 fiber 没有该 element，那就意味着需要创建一个新的 dom 节点。
* 如果类型不相同，但有旧的 fiber，那就需要将其删除。

## 7. 函数式组件

函数式组件有几个不同的地方：

* 从函数式组件返回的 fiber 中没有 dom 节点。
* children 是从函数式组件中返回的，而不是 props。

实现：

* commit 阶段，一直找到有 parent 的 fiber。
* commit 阶段删除 old node 时，如果是函数式组件，需要通过 child 一直找到有 dom 的子 fiber。

## 8. Hooks

当在函数式组件中调用 useState，通过 alternate 检查是否有 old hook。如果有，取出里面的 state，没有则使用初始值，然后将新的 hook 加到 fiber，索引加1并返回 state。

```javascript
let wipFiber = null;
let hookIndex = null;

function useState(initValue) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];

  const hook = {
    state: oldHook ? oldHook.state : initValue,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action) => {
    hook.queue.push(action);

    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };

    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;

  return [hook.state, setState];
}
```

## 总结

到目前为止我们实现了一个简易版的 react，可以帮助我们更好地理解 react 是如何工作的。

我们没有包含很多 react 的特性和优化，例如：

* 在渲染阶段我们遍历整颗树，而 react 会跳过没有更新的子树。
* 我们在 commit 阶段遍历整颗树，react 则只访问变化的 fiber。
* 当我们在构建一个新的 work in progress tree，会为每个 fiber 创建新的对象，而 react 会从 old trees 中回收它们。
* 当我们在 render 阶段收到更新通知时，会重新从根开始，react 用过期时间来标记每次更新，并使用它来决定哪个更新有更高的优先级。
* 等等...

```jsx live
function Clock(props) {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    var timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setDate(new Date());
  }

  return (
    <div>
      <h2>It is {date.toLocaleTimeString()}.</h2>
    </div>
  );
}
```