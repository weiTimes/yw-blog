---
id: optimize-deep
title: 性能优化
---

## 优化白屏时间

- 使用 SSR

## React 性能优化

- 为了避免每次渲染时清除上一个 effect，和执行当前 effect，可在第二个参数传入一个数组，数组项是 effect 依赖的属性，当该属性发生变化时才会进行清除和执行操作。
- 使用 useCallback 和 useMemo。
- 避免向下传递回调函数。
- 为了避免向下传递 state，可以使用 useReducer，向下传递 dispatch，在需要的时候调用它，react 保证了 dispatch 不会发生改变，所以它是安全的。
- useEffect 依赖项，应该配置基本数据类型，引用类型会经常发生变化（堆地址），否则会出现不必要的渲染或者是无限渲染。如: `[array.length, array[0]]`
