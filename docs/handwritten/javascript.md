---
id: handwritten-javascript
title: Javascript 手写代码
---

### 实现并行请求，支持最大并发数控制

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

### 判断对象的数据类型

```javascript
const isType = (type) => (target) =>
  `[object ${type}]` === Object.prototype.toString.call(target);

const isArray = isType('Array');
console.log(isArray([])); // true
```

### 循环实现数组 map 方法

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

#### 什么是稀疏数组

一般来说,JavaScript中的数组是稀疏的,也就是说,数组中的元素之间可以有空隙。

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

### 使用 reduce 实现数组 map 方法

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

### 循环实现数组 filter 方法

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

### 使用 reduce 实现数组 filter 方法

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

### 循环实现数组的 some 方法

some() 方法测试数组中是不是至少有1个元素通过了被提供的函数测试。它返回的是一个Boolean类型的值。

> 如果用一个空数组进行测试，在任何情况下它返回的都是false。

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

### 实现数组的 reduce 方法

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
