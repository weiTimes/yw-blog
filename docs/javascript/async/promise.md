---
id: promise
title: promise 原理及其相关实现
---

> MDN: Promise 对象用于表示一个异步操作的最终完成 (或失败)状态及其结果值。
>
> 面向对象：Promise 对象是一个可用于存储异步操作结果的状态和数据的容器。

关于 Promise，想必大家都不陌生，我们经常会用它来处理异步任务，但是它是如何实现的，使用它如何进行串行、并行的请求，并且如何控制并发数，可能还是有挺多人不知道的，我在这一块的学习也花了一段时间，接下来就将这段时间的学习分享给大家。

当然我不会一步步教大家如何实现，不过会简述核心思路，分享形式是应用场景 + 源码 + 注释的形式，主要涉及以下几点，如果你是大佬，肯定是走错片场了，出门左拐即可：

- 简单实现符合 promise/A+ 规范的 Promise
- 实现 promisify
- 实现 deferred
- 使用 Promise 实现取消请求
- 并发请求及 Promise 的相关题目

在进入正题之前，你最好：

- 熟悉 es6
- 了解 Promise

## 简单实现符合 promise/A+ 规范的 Promise

手写 Promise 的步骤：

- 以容器概念作为切入点，实现 Promise 对象的基本结构。
- 分析 Promise 容器和异步操作的关系，实现 Promise 的构造方法 constructor。
- 理清 Promise 容器中数据的写入方式，实现 Promise 的 resolve 和 reject 方法。
- 理清 Promise 容器中数据的读取方式，实现 Promise 的 then 方法。
  给 then 方法加个需求，支持链式调用，方便处理异步操作流。

```javascript
class Container {
  state = undefined;
  value = undefined;
  reason = undefined;
  onResolvedCallbacks = [];
  onRejectedCallbacks = [];

  constructor(executor) {
    try {
      this.state = Container.PENDING;
      executor(this.resolved, this.rejected);
    } catch (error) {
      this.rejected(error);
    }
  }

  resolved = (value) => {
    if (this.state !== Container.PENDING) return;

    this.state = Container.FULFILLED;
    this.value = value;
    this.onResolvedCallbacks.forEach((callback) => callback());
  };

  rejected = (reason) => {
    if (this.state !== Container.PENDING) return;

    this.state = Container.REJECTED;
    this.reason = reason;
    this.onRejectedCallbacks.forEach((callback) => callback());
  };

  then(onResolved, onRejected) {
    // 解决没有传参，或传递的参数不合法的问题
    onResolved =
      typeof onResolved === 'function' ? onResolved : (value) => value;
    // 抛出异常，后面 then 执行时 onRejected 就能捕获到了
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason;
          };

    // 每次 then 都会返回一个新的 Promise
    const newPromise = new Container((resolve, reject) => {
      switch (this.state) {
        case Container.PENDING:
          // 处理异步，将成功和失败回调都先暂存到数组中。
          // 发布订阅模式：收集依赖 => 触发通知 => 执行依赖
          this.onResolvedCallbacks.push(() => {
            setTimeout(() => {
              try {
                const value = onResolved(this.value); // 成功回调的返回值，可能是 Promise

                resolveContainer(newPromise, value, resolve, reject);
              } catch (error) {
                reject(error);
              }
            });
          });
          this.onRejectedCallbacks.push(() => {
            settimeout(() => {
              try {
                const value = onRejected(this.reason);

                resolveContainer(newPromise, value, resolve, reject);
              } catch (error) {
                // 捕获到抛出的异常
                reject(error);
              }
            });
          });
          break;
        case Container.FULFILLED:
          setTimeout(() => {
            try {
              const value = onResolved(this.value);

              resolveContainer(newPromise, value, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
          break;
        case Container.REJECTED:
          setTimeout(() => {
            try {
              const value = onResolved(this.reason);

              resolveContainer(newPromise, value, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
          break;
        default:
          break;
      }
    });

    return newPromise;
  }
}

Container.PENDING = 'pending';
Container.FULFILLED = 'fulfilled';
Container.REJECTED = 'rejected';

function resolveContainer(newPromise, value, resolve, reject) {
  if (value instanceof Container) {
    // 是一个 Promise
    if (value !== newPromise) {
      // 不是同一个对象，防止循环引用
      value.then(resolve, reject);
    } else {
      // 循环引用，抛出异常
      reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
    }
  } else {
    // 不是 Promise
    resolve(value);
  }
}

// 测试用例
const promise = new Container(function (resolve, reject) {
  setTimeout(() => {
    resolve('hello');
  }, 2000);
})
  .then(
    (value) => {
      console.log(value, 'resolve');
      return 'world';
    },
    (reason) => {
      console.log(reason, 'reject');
    }
  )
  .then(
    (value2) => {
      console.log(value2, 'resolve2');
    },
    (reason2) => {
      console.log(reason2, 'reject2');
    }
  );
```

## 实现 promisify

> nodejs 12.18 后支持 promisify: const fs = require('fs').promises.

将 nodejs api 转换成 promisify:

```javascript
const promisify = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, (error, data) => {
        if (error) reject(error);

        resolve(data);
      });
    });
  };
};
```

将 nodejs 中所有 api 转换成 promise 的写法:

```javascript
const promisifyAll = (target) => {
  Reflect.ownKeys(target).forEach((key) => {
    if (typeof key === 'function') {
      // // 默认会将原有的方法 全部增加一个 Async 后缀 变成 promise 写法
      target[`${key}Async`] = promisify(target[key]);
    }
  });

  return target;
};
```

使用 Reflect 取出目标对象中所有的函数属性，然后对其 promisify 化。

## 实现 deferred

deferred 是对 Promise 的进一步封装，使用时只需要实例化 Deferred，然后在需要的地方调用其 resolve 或 reject 方法即可，不需要像使用 new Promise 那样，需要将代码包裹在回调方法中，减少了嵌套的层级。

```javascript
function Deferred() {
  this.promise = new Promise(
    function (resolve, reject) {
      this._resolve = resolve;
      this._reject = reject;
    }.bind(this)
  );
}
Deferred.prototype.resolve = function (value) {
  this._resolve.call(this.promise, value);
};
Deferred.prototype.reject = function (reason) {
  this._reject.call(this.promise, reason);
};

function getUrl(url) {
  const deferred = new Deferred();
  const req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.onload = function () {
    if (req.status === 200) {
      deferred.resolve(req.responseText);
    } else {
      deferred.reject(req.status);
    }
  };
  req.onerror = function () {
    deferred.reject(req.responseText);
  };
  req.send();

  return deferred.promise;
}

// 测试用例
getUrl('http://localhost:3000/api/hello')
  .then((res) => console.log(JSON.parse(res), 'defer'))
  .catch((err) => console.error(err));
```

## 使用 Promise 实现取消请求

接下来我们来实现一个带超时提示的网络请求方法，先定义一个超时器，它在给定时间后会返回结果：

```javascript title="delayPromise"
// 超时器
function delayPromise(ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, ms);
  });
}
```

然后实现一个函数，它接收一个 Promise 对象和超时的时间，当 Promise 在超时时间到期前返回，则将该 Promise 的请求结果返回，否则提示超时的错误，内部使用 Promise.race 实现，该 api 当给定的 Promise 对象数组中有一个返回结果时，就会进入 FulFilled 状态，当然和 Promise.all 一样，也是并行执行：

```javascript title="timeoutPromise"
function timeoutPromise(promise, ms) {
  const timeout = delayPromise(ms).then(() => {
    return Promise.reject(new TimeoutError('超时发生在' + ms + 'ms'));
  });

  // promise 和超时器是竞争关系，只要有一个先完成就进入 FulFilled 状态
  return Promise.race([promise, timeout]);
}
```

接下来我们就需要实现请求函数了，它支持发起请求和中断请求，我们使用原生 api XMLHttpRequest 实现：

```javascript title="cancelableXHR"
function cancelableXHR(url) {
  const req = new XMLHttpRequest();

  const promise = new Promise(function (resolve, reject) {
    req.open('GET', url, true);
    req.onload = function () {
      if (req.status === 200) {
        resolve(req.responseText);
      } else {
        reject(new Error(req.statusText));
      }
    };
    req.onerror = function () {
      reject(new Error(req.statusText));
    };
    // 请求被中断时触发
    req.onabort = function () {
      console.log('request canceled...');

      reject(new Error('abort this request'));
    };
    req.send();
  });

  const abort = function () {
    // 如果 request 还没结束就执行 abort
    if (req.readyState !== XMLHttpRequest.UNSENT) {
      console.log('canceling...');

      req.abort();
    }
  };

  return {
    promise,
    abort,
  };
}
```

`cancelableXHR` 返回一个 Promise 和 abort 方法，最后我们来看一下如何使用它：

```javascript
const getHello = cancelableXHR('http://localhost:3000/api/hello');

timeoutPromise(getHello.promise, 0)
  .then((res) => console.log(res, '在规定时间在内'))
  .catch((e) => {
    if (e instanceof TimeoutError) {
      getHello.abort();
      return console.log(e);
    }

    console.log('XHR Error: ', e);
  });
```

上述代码中，我们将 `getHello.promise` 传给 `timeoutPromise`，当前者先返回，打印“在规定时间内”的提示；
如果超时，及我们给定的超时时间到期，超时异常会被捕获到，进入 `catch`，判断发生的错误是否是超时，如果是，就执行
`getHello.abort()` 中断请求。

相信你也注意到了 `TimeoutError`，这是一个自定义错误，它继承自 Error，表示超时错误，最后我们一起看看如何实现它：

```javascript title="TimeoutError"
function copyOwnFrom(target, source) {
  Object.getOwnPropertyNames(source).forEach(function (propName) {
    Object.defineProperty(
      target,
      propName,
      Object.getOwnPropertyDescriptor(source, propName)
    );
  });

  return target;
}

// 定义一个继承自 Error 的类
function TimeoutError() {
  // 借用构造函数实现属性继承
  const superInstance = Error.apply(null, arguments);

  // 将 Error 实例身上的属性及描述完整地拷贝到 TimeoutError 的实例上
  copyOwnFrom(this, superInstance);
}
// 原型继承
TimeoutError.prototype = Object.create(Error.prototype);
TimeoutError.prototype.constructor = TimeoutError;
```

## 并发请求及 Promise 的相关题目

### 按顺序发起请求，当所有请求结束后将结果返回

```javascript title="promiseSequence"
// 自定义请求函数，使用 XMLHttpRequest 实现
function fetch2(url) {
  return new Promise(function (resolve, reject) {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = function () {
      if (req.status === 200) {
        resolve(req.responseText);
      } else {
        reject(new Error(req.status));
      }
    };
    req.onerror = function () {
      reject(new Error(req.responseText));
    };
    req.send();
  });
}

function promiseSequence(promises) {
  function recordValue(arr, val) {
    arr.push(val);

    return arr;
  }

  const pushValue = recordValue.bind(null, []);

  return promises.reduce((promise, cur) => {
    return promise
      .then(() => cur)
      .then(JSON.parse)
      .then(pushValue);
  }, Promise.resolve());
}

// 测试用例
promiseSequence([
  fetch2('http://localhost:3000/api/hello'),
  fetch2('http://localhost:3000/api/info'),
])
  .then((res) => {
    console.log(res, '按顺序执行-sequence-res');
  })
  .catch((e) => console.log(e));
```

### 并行执行，当所有请求结束后将结果返回，如果其中有异常，则立即返回

```javascript title="proiseAll"
function proiseAll(promises) {
  return new Promise(function (resolve, reject) {
    const result = [];

    promises.forEach((promise, promiseIndex) => {
      promise
        .then((res) => {
          result[promiseIndex] = JSON.parse(res);

          if (promiseIndex === promises.length - 1) {
            resolve(result);
          }
        })
        .catch((e) => {
          reject(new Error(e));
        });
    });
  });
}

// 测试用例
proiseAll([
  fetch2('http://localhost:3000/api/hello'),
  fetch2('http://localhost:3000/api/info'),
])
  .then((res) => {
    console.log(res, '并行执行-Promise.all-res');
  })
  .catch((e) => console.log(e));
```

### 实现一个函数，可以控制并发数

使用 while 先达到最大并发数，然后请求完一个后判断是否还有请求，如果有，递归发起下一个请求，直到没有请求可发，将结果 resolve。

```javascript
function multiRequest(urls, maxNum) {
  if (!maxNum) return;

  const len = urls.length;
  const results = new Array(len).fill(false);
  let count = 0; // 已完成 成功 | 失败

  return new Promise((resolve, reject) => {
    // 最大并行请求数量
    while (count < maxNum) {
      request();
    }

    function request() {
      // 正在进行中的请求索引 先赋值，后自增
      let current = count++;

      // 所有请求结束
      if (current >= len) {
        !results.includes(false) && resolve(results);

        return;
      }

      const url = urls[current];

      fetch(url)
        .then(async (res) => {
          results[current] = await res.json();

          // 当前请求已结束，如果还有请求，进入下一次请求（递归调用）
          if (current < len) {
            request();
          }
        })
        .catch((err) => {
          results[current] = err;

          if (current < len) {
            request();
          }
        });
    }
  });
}

// 测试用例
multiRequest(
  [
    'http://localhost:3000/api/hello',
    'http://localhost:3000/api/hello',
    'http://localhost:3000/api/hello',
    'http://localhost:3000/api/hello',
    'http://localhost:3000/api/hello',
  ],
  2
).then((res) => {
  const logs = res.map((r) => r.data);

  console.log(res, 'res-请发请求，带并发数-promise');
});
```

### 页面上有一个输入框，两个按钮，A 按钮和 B 按钮，点击 A 或者 B 分别会发送一个异步请求，请求完成后，结果会显示在输入框中。

要求：用户随机点击 A 和 B 多次，要求输入框显示结果时，按照用户点击的顺序显示。

实现关键是保存一个 promise 实例，每次点击后将新的 promise 赋值给 promiseIns，这样能确保按点击的顺序执行。

```javascript
const pInput = document.querySelector('.promise-input');
const pa = document.querySelector('.promise-a');
const pb = document.querySelector('.promise-b');

let promiseIns = Promise.resolve();

pa.onclick = function () {
  promiseIns = promiseIns.then(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
        pInput.value = '我是 A';
      }, 2000);
    });
  });
};
pb.onclick = function () {
  promiseIns = promiseIns.then(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
        pInput.value = '我是 B';
      }, 1000);
    });
  });
};
```

### 实现 mergePromise 函数，把传进去的函数数组按顺序先后执行，并且把返回的数据先后放到数组 data 中。

```javascript
const mergePromise = (ajaxArray) => {
  // 在这里实现你的代码
  const result = [];

  return ajaxArray.reduce((promise, cur) => {
    return promise.then(cur).then((res) => {
      result.push(res);

      return result;
    });
  }, Promise.resolve());
};
// 工具函数
const timeout = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

const ajax1 = () =>
  timeout(5000).then(() => {
    console.log('1');
    return 1;
  });

const ajax2 = () =>
  timeout(1000).then(() => {
    console.log('2');
    return 2;
  });

const ajax3 = () =>
  timeout(2000).then(() => {
    console.log('3');
    return 3;
  });
mergePromise([ajax1, ajax2, ajax3]).then((data) => {
  console.log(data, 'done'); // data 为 [1, 2, 3]
});
```

### 实现并发地执行，按顺序输出

```javascript
const mergePromise2 = async (ajaxArray) => {
  const promises = [];
  const res = [];

  // 并发执行
  ajaxArray.forEach((ajax) => {
    promises.push(ajax());
  });

  // 按顺序放入结果数组
  for (let r of promises) {
    res.push(await r);
  }

  return res;
};

// 测试用例
mergePromise2([ajax1, ajax2, ajax3]).then((data) => {
  console.log(data, '并发执行，按顺序输出结果');
});
```

### 实现以下函数，可以批量请求数据，所有的 URL 地址在 urls 参数中，可以同时通过 max 参数控制请求的并发度

当所有请求结束之后，需要执行 callback 回调函数，发送的请求使用 fetch。

### 设计一个并发请求池

```javascript
function createRequest({ pool = 2 }) {
  const queue = []; // 并发池
  const waitQueue = []; // 等待队列，并发池满的情况下，放入等待队列
  const result = [];
  let index = 0;

  console.log('创建请求池');

  // 将请求推入请求池
  function setTask(url) {
    if (!url) return;

    const task = fetch(url)
      .then((res) => res.json())
      .then((res) => {
        console.log('当前并发数', queue.length);

        result[index++] = res;
        queue.splice(queue.indexOf(task), 1);

        if (waitQueue.length > 0) {
          setTask(waitQueue.shift());
        } else {
          console.log(result, 'res');
        }
      });

    queue.push(task);
  }

  function request(url) {
    if (queue.length < pool) {
      // 推入并发池
      setTask(url);
    } else {
      waitQueue.push(url);
    }
  }

  return request;
}

// 测试用例
const request = createRequest({ pool: 3 }); // 创建并发数为 3 的请求池
new Array(10).fill(1).forEach(() => request('http://localhost:3000/api/hello'));
```

## 附录

- [Javascript Promise 迷你书](http://liubin.org/promises-book/#race-delay-timeout)
- [看懂此文，手写十种 Promise！](https://mp.weixin.qq.com/s/yXOstYUDXldXJ4M-38q1xg)
