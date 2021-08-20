---
title: Javascript
---

## Promise

### Promise 解决了什么问题，业界有哪些实现？

产生**回调地狱**的原因主要是，多个异步请求嵌套调用：第一个异步请求的结果结果往往是第二个异步请求的输入。

在传统的异步编程中，如果多个异步请求之间存在依赖关系，就需要通过嵌套回调满足这种关系，如果嵌套层数过多，可读性和维护性都会变得很差，产生所谓的”回调地狱“，而 Promise 是以更线性的方式，即链式调用，增加了可读性和可维护性。所以 Promise 解决的是异步编程的编码风格的问题。

业界的实现主要有 bluebird、Q、es6-promise。

### 手写符合 Promise/A+ 规范的 Promise

> - [Promise/A+ 规范](https://github.com/promises-aplus/promises-spec)
> - [Promise/A+ 测试工具](https://github.com/promises-aplus/promises-tests)

#### 实现 Promise 的关键点

:::note

1. Promise 使用 new 关键词，它是一个类；
2. `new Promise()` 接收一个函数作为参数；
3. 传入的函数接收两个参数，分别是 resolve 和 reject，用来改变 Promise 的状态；
4. Promise 有三种状态，分别是 pending、fulfilled 和 rejected，调用 resolve 会将状态改成 fulfilled，调用 reject 会将状态改成 rejected；
5. Promise 实例化后可以调用 then 方法，并且支持链式调用，也就是 then 方法需要返回一个带 then 方法的对象，可以是 `this` 或 `promise` 的实例。
6. then 的**值穿透特性**。如果 then 未传入函数或传入的类型不是函数，则后面的 then 能够得到之前 then 的返回值。

:::

```javascript title="代码实现"
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class SuperPromise {
  status = PENDING;
  value = null;
  reason = null;
  onResolvedCallbacks = [];
  onRejectedCallback = [];

  static resolvePromise(promise, value, resolve, reject) {
    // value 为 Promise 对象
    if (value instanceof SuperPromise) {
      if (value === promise) {
        // 循环引用，抛出异常
        return reject(new TypeError('Cannot resolve promise with self'));
      } else {
        // 等 promise 执行完继续执行 resolvePromise
        value.then((val) => {
          SuperPromise.resolvePromise(promise, val, resolve, reject);
        }, reject);
      }
    } else {
      // 普通值
      resolve(value);
    }
  }

  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      // 捕获到错误 reject
      this.reject(error);
    }
  }

  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
      this.onResolvedCallbacks.forEach((callback) => callback());
    }
  };

  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
      this.onRejectedCallback.forEach((callback) => callback());
    }
  };

  then = (onFulfilled, onRjected) => {
    // 如果传入的不是函数，则构造一个返回传入参数的函数
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    onRjected =
      typeof onRjected === 'function' ? onRjected : (reason) => reason;

    const newPromise = new SuperPromise((resolve, reject) => {
      switch (this.status) {
        case PENDING:
          if (this.status === PENDING) {
            // 使用 try...catch 捕获错误
            this.onResolvedCallbacks.push(() => {
              setTimeout(() => {
                try {
                  const value = onFulfilled(this.value);

                  SuperPromise.resolvePromise(
                    newPromise,
                    value,
                    resolve,
                    reject
                  );
                } catch (error) {
                  reject(error);
                }
              }, 0);
            });
            this.onRejectedCallback.push(() => {
              setTimeout(() => {
                try {
                  const value = onRjected(this.reason);

                  SuperPromise.resolvePromise(
                    newPromise,
                    value,
                    resolve,
                    reject
                  );
                } catch (error) {
                  reject(error);
                }
              }, 0);
            });
          }
          break;
        case FULFILLED:
          setTimeout(() => {
            try {
              const value = onFulfilled(this.value);

              SuperPromise.resolvePromise(newPromise, value, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
          break;
        case REJECTED:
          setTimeout(() => {
            try {
              const value = onRjected(this.reason);

              SuperPromise.resolvePromise(newPromise, value, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
          break;
      }
    });

    return newPromise;
  };
}
```

#### 测试是否符合 **Promises/A+**

安装 `promises-aplus-tests`:

```shell
yarn global add promises-aplus-tests
```

在测试之前，还需要写一个简单的 adapter：

```javascript title="adapter"
SuperPromise.defer = SuperPromise.deferred = function () {
  let dfd = {};
  dfd.promise = new SuperPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
```

执行测试用例：

```shell
promises-aplus-tests ./promise.js
```

#### 参考

- [手写 Promise](https://zhuanlan.zhihu.com/p/183801144)
- [promiess-tests](https://github.com/promises-aplus/promises-tests)

### 手写 Promise.all

多个异步并行执行，返回最终的结果，如果有一个失败则立即失败。

:::note

1. 接收可迭代对象
2. 判断可迭代对象是否为空，如果为空，直接返回 Promise.resolve([])
3. 当所有 Promise 完成时，resolve 一个结果数组
4. 当其中有一个失败，立刻 reject

:::

```javascript title="代码实现"
const promiseAll = (iterators) => {
  return new Promise((resolve, reject) => {
    if (!iterators || iterators.length === 0) {
      return resolve([]);
    }

    let results = [];

    for (let i = 0; i < iterators.length; i++) {
      const item = iterators[i];

      // item 可能不是 Promise 对象，统一转换为 Promise 对象
      Promise.resolve(item)
        .then((res) => {
          results[i] = res; // 按顺序保存对应的结果

          // 当所有任务都执行完毕后，resolve一个结果数组
          if (results.length === iterators.length) {
            resolve(results);
          }
        })
        .catch((e) => {
          // 一旦有一个 Promise 失败，立刻 reject
          return reject(e);
        });
    }
  });
};
```

```javascript title="测试用例"
const timeout = (ms) =>
  new Promise((resolve, reject) => {
    if (!ms) {
      reject('未传入时间');
    } else {
      setTimeout(() => {
        resolve(ms);
      }, ms);
    }
  });

promiseAll([timeout(1000), timeout(2000), timeout(), timeout(3000)])
  .then((res) => {
    console.log(res, 'res');
  })
  .catch((e) => {
    console.log(e, 'e');
  });
```

### 手写 Promise.allSettled

多个异步并行执行，无论是成功还是失败都会返回对应的结果。

:::note
当所有 promise 都完成（解决或拒绝 - fulfilled 或 rejected）时，resolve 结果数组，**结果项包含成功或失败的对象**；
结果对象：{ status: 'fulfilled', value: {} } | { status: 'rejected', reason: {} }
:::

```javascript title="代码实现"
const promiseAllSettled = (promises) => {
  return new Promise((resolve, reject) => {
    if (!promises || promises.length === 0) {
      return resolve([]);
    }

    const results = [];

    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i];

      Promise.resolve(promise)
        .then((res) => {
          results[i] = { status: 'fulfilled', value: res };
        })
        .catch((e) => {
          results[i] = { status: 'rejected', reason: e };
        })
        .finally(() => {
          if (results.length === promises.length) {
            resolve(results);
          }
        });
    }
  });
};
```

```javascript title="测试用例"
const timeout = (ms) =>
  new Promise((resolve, reject) => {
    if (!ms) {
      reject('未传入时间');
    } else {
      setTimeout(() => {
        resolve(ms);
      }, ms);
    }
  });

promiseAllSettled([
  timeout(1000),
  timeout(2000),
  timeout(3000),
  timeout(),
]).then((res) => console.log(res)); // [ { status: 'fulfilled', value: 1000 }, ... ]
```

### 手写 Promise.race

多个异步并行执行，返回最快返回的结果。

:::note

1. 接收一个可迭代对象
2. 可迭代项统一使用 Promise.resolve 包装
3. 如果没有传入则一直处于 pending 状态
4. 迭代过程中一旦有个 Promise 对象 resolve 或 reject 就返回

:::

```javascript title="代码实现"
const promiseRace = (iterators) => {
  return new Promise((resolve, reject) => {
    if (iterators && iterators.length > 0) {
      for (const item of iterators) {
        Promise.resolve(item)
          .then((res) => {
            return resolve(res);
          })
          .catch((e) => {
            return reject(e);
          });
      }
    }
  });
};
```

### 手写 Promise.resolve

产生一个成功的 Promise，并且支持异步：

```javascript title="代码实现"
class SuperPromise {
  static resolve(value) {
    return new SuperPromise((resolve, reject) => {
      if (value instanceof SuperPromise) {
        // 如果是 Promise 对象，则继续等待
        return value.then(resolve, reject);
      }

      resolve(value);
    });
  }
}
```

```javascript title="测试用例"
SuperPromise.resolve(
  new SuperPromise((resolve) => {
    setTimeout(() => {
      resolve(4);
    }, 0);
  })
).then((res) => {
  console.log(res, 'resolve');
});
```

### 手写 Promise.reject

产生一个拒绝的 Promise。

```javascript title="代码实现"
class SuperPromise {
  static reject(reason) {
    return new SuperPromise((resolve, reject) => {
      reject(reason);
    });
  }
}
```

### 手写 Promise.prototype.catch

捕获异常。

```javascript
class SuperPromise {
  catch = (callback) => {
    return this.then(null, callback);
  };
}
```

### 手写 Promise.prototype.finally

无论返回的是成功还是拒绝，都会执行，回调如果返回的是一个 Promise，则会等待它执行完毕，如果是成功则将上一次返回的结果。

```javascript
class SuperPromise {
  finally = (callback) => {
    return this.then(
      (value) => {
        return SuperPromise.resolve(callback()).then(() => value);
      },
      (reason) => {
        return SuperPromise.resolve(callback()).then(() => {
          throw reason;
        });
      }
    );
  };
}
```

```javascript title="测试用例"
Promise.resolve(456)
  .finally(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(123);
      }, 3000);
    });
  })
  .then((data) => {
    console.log(data, 'success'); // 456 success
  })
  .catch((err) => {
    console.log(err, 'error');
  });
```

### 实现 promisify

:::note

将 nodejs 中的 api 转换成 promise 的写法。

nodejs 12.18 后支持 promisify: const fs = require('fs').promises;

:::

```javascript title="代码实现"
const promisify = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, (error, result) => {
        if (error) return reject(error);

        resolve(result);
      });
    });
  };
};
```

将 nodejs 的所有 api 都转换成 promise 的写法：

```javascript title="代码实现"
const promisifyAll = (target) => {
  Reflect.ownKeys(target).forEach((key) => {
    if (typeof target[key] === 'function') {
      // 默认会将原有的方法 全部增加一个 Async 后缀 变成 promise 写法
      target[`${key}Async`] = promisify(target[key]);
    }
  });

  return target;
};
```

## 实现并行请求，支持最大并发数控制

```javascript
const axios = require('axios');

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
      // 正在进行中的请求索引
      let current = count++;

      // 所有请求结束
      if (current >= len) {
        !results.includes(false) && resolve(results);

        return;
      }

      const url = urls[current];

      axios(url)
        .then((res) => {
          results[current] = res;

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

multiRequest(
  [
    'https://v1.alapi.cn/api/mryw',
    'https://v1.alapi.cn/api/joke',
    'https://v1.alapi.cn/api/mingyan',
  ],
  2
).then((res) => {
  const logs = res.map((r) => r.data);

  console.log(logs, 'res');
});
```

## 判断对象的数据类型

```javascript
const isType = (type) => (target) =>
  `[object ${type}]` === Object.prototype.toString.call(target);

const isArray = isType('Array');
console.log(isArray([])); // true
```

## 循环实现数组 map 方法

```javascript
const selfMap = function (fn, context) {
  let arr = Array.prototype.slice.call(this);
  let mappedArr = [];

  for (let i = 0; i < arr.length; i++) {
    // 判断稀疏数组的情况
    if (arr.hasOwnProperty(i)) {
      mappedArr[i] = fn.call(context, arr[i], i, this);
    }
  }

  return mappedArr;
};

Array.prototype.selfMap = selfMap;

const result = [1, 2, 3].selfMap((n) => n * 2); // [2,4,6]
```

map 的第二个参数为第一个参数回调中的 this 指向，如果第一个参数为箭头函数，那设置第二个 this 会因为箭头函数的词法绑定而失效。

`arr.hasOwnProperty(i)` 是为了判断稀疏数组的情况，当数组某个索引的数组值不存在时，跳过本次循环。

### 什么是稀疏数组

一般来说,JavaScript 中的数组是稀疏的,也就是说,数组中的元素之间可以有空隙。

创建稀疏数组：

```javascript
const a = new Array(3); // [, , ,]

// or
var a = [];
a[0] = 1;
a[3] = 3;
console.log(a); // [1, , , 3]
```

当调用 map 或 forEach 时，会跳过这些空隙，也就是不会执行有空隙的回调。

创建密集数组：

```javascript
const a = new Array(3).fill(undefined);
console.log(a); // [undefined, undefined, undefined]
```

## 使用 reduce 实现数组 map 方法

```javascript
function selfMap(fn, context) {
  const arr = Array.prototype.slice.call(this);

  return arr.reduce((pre, cur, i) => {
    return [...pre, fn.call(context, cur, i, this)];
  }, []);
}

Array.prototype.selfMap = selfMap;

const res = [1, 2, 3].selfMap((value, index, array) => value + 1);

console.log(res); // 2, 3, 4
```

## 循环实现数组 filter 方法

```javascript
function selfFilter(fn, context) {
  const arr = Array.prototype.slice.call(this);
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    if (!arr.hasOwnProperty(i)) continue;

    if (fn.call(context, arr[i], i, this)) {
      result.push(arr[i]);
    }
  }

  return result;
}

Array.prototype.selfFilter = selfFilter;

const res = [1, 2, 3].selfFilter((v, i) => v <= 2);

console.log(res); // [1, 2]
```

## 使用 reduce 实现数组 filter 方法

```javascript
function selfFilter(fn, context) {
  const arr = Array.prototype.slice.call(this);

  return arr.reduce((pre, cur, i) => {
    if (fn.call(context, cur, i, this)) {
      pre.push(cur);
    }

    return pre;
  }, []);
}

Array.prototype.selfFilter = selfFilter;

const res = [1, 2, 3].selfFilter((v, i, array) => v > 2);
console.log(res);
```

## 循环实现数组的 some 方法

some() 方法测试数组中是不是至少有 1 个元素通过了被提供的函数测试。它返回的是一个 Boolean 类型的值。

> 如果用一个空数组进行测试，在任何情况下它返回的都是 false。

```javascript
function selfSome(fn, context) {
  const arr = Array.prototype.slice.call(this);

  for (let i = 0; i < arr.length; i++) {
    if (!arr.hasOwnProperty(i)) continue;

    if (fn.call(context, arr[i], i, this)) {
      return true;
    }
  }

  return false;
}

Array.prototype.selfSome = selfSome;

const res = [1, 2, 3].selfSome((v, i, arr) => v > 2);
console.log(res); // true
```

## 实现数组的 reduce 方法

```javascript
if (!Array.prototype.selfReduce) {
  Object.defineProperty(Array.prototype, 'selfReduce', {
    value: function (callback, initialValue) {
      if (!this)
        throw new Error('Array.prototype.reduce called on null or undefined.');

      if (typeof callback !== 'function')
        throw new Error('callback is not  a function');

      var o = Object(this);

      var len = o.length >>> 0;

      var k = 0;
      var value;

      if (arguments.length >= 2) {
        value = arguments[1];
      } else {
        // 考虑是稀疏数组的情况，如果没有值，则索引 +1
        while (k < len && !(k in o)) {
          k++;
        }

        // 索引大于等于数组长度，数组为空的情况
        if (k >= len) {
          throw new TypeError('Reduce of empty array with no initialValue');
        }

        // 设置初始值
        value = o[k++];
      }

      while (k < len) {
        // 考虑稀疏数组的情况，有值才执行回调
        if (k in o) {
          // pre, cur, i, array
          value = callback(value, o[k], k, o);
        }

        k++;
      }

      return value;
    },
  });
}

const res = [1, , , 2, 3].selfReduce((v, i) => {
  return v + i;
});

console.log(res, 'res'); // 6
```
