---
title: React18 新特性
---

主要有 3 大新特性：

- Automatic batching.
- Concurrent APIS.
- SSR for Suspense.

## Automatic Batching

batching 是指将多个状态改变合并为一次进行修改。

```javascript
function handleClick() {
  setCount((c) => c + 1);
  setFlag((f) => !f);
}
```

上述代码修改了两个状态的值，但只会发生一次渲染。

如果不想使用 Automatic Batching，即想渲染多次，可以使用 `flushSync`：

```javascript
function handleClick() {
  fetch().then(() => {
    ReactDOM.flushSync(() => {
      setCount((c) => c + 1);
      setFlag((f) => !f);
    });
  });
}
```

## 新的 ReactDOM Render API

```javascript
const container = document.getElementById('app');

const root = ReactDOM.createRoot(container);

root.render(<App />);
```

## Concurrent APIS

Concurrent Mode 就是一种可中断渲染的设计架构。什么时候中断渲染呢？当一个更高优先级渲染到来时，通过放弃当前的渲染，立即执行更高优先级的渲染，换来视觉上更快的响应速度。

由于 React 将渲染 DOM 树机制改为两个双向链表，并且渲染树指针只有一个，指向其中一个链表，因此可以在更新完全发生后再切换指针指向，而在指针切换之前，随时可以放弃对另一颗树的修改。

新的 API:

- `startTransition`
- `useDeferredValue`

```javascript
import { startTransition } from 'react';

// 紧急更新：
setInputValue(input);

// 标记回调函数内的更新为非紧急更新：
startTransition(() => {
  setSearchQuery(input);
});
```

`startTransition` 回调包裹的 setState 触发的渲染 被标记为不紧急的渲染，这些渲染可能被其他紧急渲染所抢占。

`transition` 被打断的状态可以通过 `isPending` 访问到：

```javascript
import { useTransition } from 'react';

const [isPending, startTransition] = useTransition();
```

## SSR for Suspense

SSR for Suspense 解决三个主要问题：

- SSR 模式下，如果不同模块取数效率不同，会因为最慢的一个模块拖慢整体 HTML 吞吐时间，这可能导致体验还不如非 SSR 来的好。举一个极端情况，假设报表中一个组件依赖了慢查询，需要五分钟数据才能出来，那么 SSR 的后果就是白屏时间拉长到 5 分钟。
- 即便 SSR 内容打到了页面上，由于 JS 没有加载完毕，所以根本无法进行 hydration，整个页面处于无法交互状态。
- 即便 JS 加载完了，由于 React 18 之前只能进行整体 hydration，可能导致卡顿，导致首次交互响应不及时。

新版 SSR 性能提高的秘诀在于两个字：**按需**。

## 总结

以后提起前端性能优化，我们就多了一些应用侧的视角（而不仅仅是工程化视角），从以下两个应用优化视角有效提升交互反馈速度：

1. 随时中断的框架设计，第一优先级渲染用户最关注的 UI 交互模块。
2. 从后端到前端 “顺滑” 的管道式 SSR，并将 hydration 过程按需化，且支持被更高优先级用户交互行为打断，第一优先水合用户正在交互的部分。
