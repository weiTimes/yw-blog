---
id: optimize-deep
title: 性能优化
---

## React 性能优化

- 为了避免每次渲染时清除上一个 effect，和执行当前 effect，可在第二个参数传入一个数组，数组项是 effect 依赖的属性，当该属性发生变化时才会进行清除和执行操作。
- 使用 useCallback 和 useMemo。
- 避免向下传递回调函数。
- 为了避免向下传递 state，可以使用 useReducer，向下传递 dispatch，在需要的时候调用它，react 保证了 dispatch 不会发生改变，所以它是安全的。
