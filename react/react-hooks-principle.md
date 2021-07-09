---
title: React Hooks 原理
---

## React Hooks 的使用限制

- 必须按顺序调用，不能在循环、条件语句中调用。
- 只能在函数组件或自定义 Hook 中使用。

## 实现简易的 `useState`

```javascript
let state;

function useState(initialValue) {
  state = state || initialValue;

  function setState(newState) {
    state = newState;
    render(); // 触发重新渲染
  }

  return [state, setState];
}
```

## 实现简易的 `useEffect`

`useEffect` 的特点：

1. 有两个参数 callback 和 dependencies 依赖数组。
2. 如果 dependencies 不存在，callback 每次 render 都会执行。
3. 如果 dependencies 存在，render 时判断是否发生了变化，发生了变化就执行 callback。

```javascript
let _deps; // _deps 记录 useEffect 上一次的 依赖

function useEffect(callback, depArray) {
  const hasNoDeps = !depArray; // 如果 dependencies 不存在
  const hasChangedDeps = _deps
    ? !depArray.every((el, i) => el === _deps[i]) // 两次的 dependencies 是否完全相等
    : true;

  /* 如果 dependencies 不存在，或者 dependencies 有变化*/
  if (hasNoDeps || hasChangedDeps) {
    callback(); // 执行回调
    _deps = depArray; // 更新依赖
  }
}
```

目前 `useState` 和 `useEffect` 都可以工作了，但是只能使用一次，因为只有一个 state 和一个 \_deps，如下使用多次就不行了：

```javascript
const [count, setCount] = useState(0);
const [username, setUsername] = useState('ywhoo');
```

使用数组解决多次使用的问题，思路：

1. 初次渲染的时候，按照 hooks 的调用顺序，将 state, deps 按照顺序塞到 `memoizedState` 数组中。
2. 再次渲染的时候，按照顺序，从 `memoizedState` 把上次记录的值拿出来。

```javascript
let memoizedState = []; // hooks 存放在这个数组
let cursor = 0; // 当前 memoizedState 下标

function useState(initialValue) {
  memoizedState[cursor] = memoizedState[cursor] || initialValue;
  const currentCursor = cursor;

  function setState(newState) {
    memoizedState[currentCursor] = newState;
    render();
  }
  return [memoizedState[cursor++], setState]; // 返回当前 state，并把 cursor 加 1
}

function useEffect(callback, depArray) {
  const hasNoDeps = !depArray;
  const deps = memoizedState[cursor];
  const hasChangedDeps = deps
    ? !depArray.every((el, i) => el === deps[i])
    : true;

  if (hasNoDeps || hasChangedDeps) {
    callback();
    memoizedState[cursor] = depArray;
  }
  cursor++;
}
```

## 问题与回答

### 为什么只能在函数最外层调用 Hook？为什么不要在循环、条件判断或者子函数中调用。

memoizedState 数组是按 hook 定义的顺序来放置数据的，如果 hook 顺序变化，memoizedState 并不会感知到。

### 自定义的 Hook 是如何影响使用它的函数组件的？

共享同一个 memoizedState，共享同一个顺序。

### “Capture Value” 特性是如何产生的？

每一次 ReRender 的时候，都是重新去执行函数组件了，对于之前已经执行过的函数组件，并不会做任何操作。

## React 的 hooks 实现

React 是通过单链表的形式实现的，通过 `next` 指针指向下一个 hook。

```javascript
type Hooks = {
  memoizedState: any, // 指向当前渲染节点 Fiber
  baseState: any, // 初始化 initialState， 已经每次 dispatch 之后 newState
  baseUpdate: Update<any> | null, // 当前需要更新的 Update ，每次更新完之后，会赋值上一个 update，方便 react 在渲染错误的边缘，数据回溯
  queue: UpdateQueue<any> | null, // UpdateQueue 通过
  next: Hook | null, // link 到下一个 hooks，通过 next 串联每一 hooks
};

type Effect = {
  tag: HookEffectTag, // effectTag 标记当前 hook 作用在 life-cycles 的哪一个阶段
  create: () => mixed, // 初始化 callback
  destroy: (() => mixed) | null, // 卸载 callback
  deps: Array<mixed> | null,
  next: Effect, // 同上
};
```

memoizedState，cursor 是存在哪里的？如何和每个函数组件一一对应的？

React 会生成一颗组件树，树中的每个 Fiber 节点对应了一个组件，hooks 的数据作为组件的属性存储在节点上，随着组件一起加载与卸载。

## 附录

- [React Hooks 原理](https://github.com/brickspert/blog/issues/26)
