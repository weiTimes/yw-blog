---
id: handwritten-javascript
title: Javascript 手写代码
---

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

