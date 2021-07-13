---
title: Javascript 基础
---

## `['1', '2', '3'].map(parseInt)` 的运行结果是什么？为什么？

**答案：**[1, NaN, NaN]。

**解析：**

map 函数的第一个参数为当前处理的元素，第二个参数表示该元素的索引，最终返回一个新的数组。

parseInt 是将一个字符串解析成指定基数的整数。第一个参数表示要被处理的值，第二个参数表示解析时的基数：

1. 当解析的基数为 0 时，且处理的值不以"0x"(16 进制)或"0"（可能是 8 or 10 进制）开头，按照 10 为基数处理。
2. 基数的有效范围是 2-36。
3. 处理的值不是一个有效的进制数，返回 NaN。

**变题：**['10', '10', '10', '10', '10'].map(parseInt)。

**答案：**[10, NaN, 2, 3, 4]。

## 什么是防抖和节流？有什么区别？如何实现？

### 防抖

**原理：**你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件（**在指定间隔内触发会重新计时**）
。

**应用场景：**

- 表单值发生变化请求接口时，用防抖来节约请求资源。
- windows 触发 resize 时，resize 停止变化时触发逻辑，最终只请求一次。

```javascript
function debounce(fn, delay, immediate) {
  let timer = null;
  let result;

  function debounced(...params) {
    if (timer) clearTimeout(timer); // 清除延时器

    if (immediate) {
      // 3. 首先执行一次函数，然后停止触发n秒后重新执行
      // 立刻执行
      const callNow = !timer; // 第一次进来 timer = null，先保存下这个变量

      timer = setTimeout(() => {
        timer = null;
      }, delay);

      // timer 为 null 时才执行，也就是执行完一个延时器
      if (callNow) result = fn.apply(this, params);
    } else {
      timer = setTimeout(() => {
        fn.apply(this, params); // 1. this指向 2. 参数
      }, delay);
    }

    return result; // 4. 返回函数调用的结果
  }

  // 5. 当immediate 取消防抖，可立即再执行
  debounced.cancel = function () {
    timer = null;
  };

  return debounced;
}
```

Typescript 版本实现：

```typescript
// hooks.ts
export const useDebounce = (
  fn: TProcedure,
  delay: number,
  options?: TOptions
) => {
  return useCallback(debounce(fn, delay, options), []);
};

// utils/index.ts
export type TProcedure = (...args: any[]) => void;

export type TOptions = {
  isImmediate?: boolean;
};

export function debounce<F extends TProcedure>(
  fn: F,
  delay: number,
  options: TOptions = {}
) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  function debounced(this: ThisParameterType<F>, ...args: Parameters<F>) {
    if (timer) clearTimeout(timer);

    if (options.isImmediate) {
      // 立刻执行
      const callNow = !timer; // 第一次进来 timer = null，先保存下这个变量
      timer = setTimeout(() => {
        timer = null;
      }, delay);

      // timer 为 null 时才执行，也就是执行完一个延时器
      if (callNow) fn.apply(this, args); // 返回函数调用的结果
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    }
  }

  debounced.cancel = function () {
    timer = null;
  };

  return debounced;
}
```

### 节流

**原理：**高频事件触发，但在 n 秒内只会执行一次，所以节流会稀释函数的执行频率。

**思路：**每次触发事件时判断是否有正在执行的函数，使用 flag 标记是否有正在执行的函数。

**应用场景：**

- 鼠标不断点击，使用节流，单位时间内只触发一次。
- 监听滚动事件，是否滑动到底部，用节流提升性能。

```javascript
function throttle(fn, delay) {
  let isRunning = false; // 是否有正在运行的函数

  return function (...args) {
    if (isRunning) return;

    isRunning = true;

    setTimeout(() => {
      fn(...args);
      isRunning = false; // 函数运行完置为 false
    }, delay);
  };
}
```

### 总结

- 防抖：达到指定时间触发，如果在指定时间内再次触发，则重新计时。
- 节流：在单位时间间隔内只执行一次。（如射击时控制射速）
