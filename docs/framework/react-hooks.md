---
id: react-hooks
title: React hooks
---

## useEffect

useEffect 的第二个参数表示依赖项数组，如果不传，组件每次渲染时都会调用该回调，如果传了，有以下两种情况：

- 当其为空数组时，useEffect 的回调只会在组件加载的时候执行一次，后续不会再执行。
- 当其不为空数组时，react 会先检查变量的引用地址是否一致，一致的话再对值进行浅比较，不一致就会触发回调执行。

在使用 useEffect 的时候，可能会遇到两个问题：

- 依赖项的引用地址总是发生变化，但是值实际上是没有变的，此时依然会执行回调。如果在回调中改变该引用，就会造成死循环。
- 依赖项的值是多层嵌套的对象，react 只会对值进行浅比较，深层次的值发生变化也不会触发回调。

要解决这两个问题，可以使用 [use-deep-compare-effect](https://github.com/kentcdodds/use-deep-compare-effect/blob/main/src/index.ts) 这个库来实现，它会深比较依赖项前后的值，有变化才会触发更新，以下是手写 `useDeepCompareEffect` 的代码实现：

TODO: useEffect 依赖项前后比较的算法具体是什么？

```javascript title="useDeepCompareEffect"

```
