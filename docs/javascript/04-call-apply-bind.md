---
id: call-apply-bind
title: call, apply, bind 的原理、实现
---

call, apply 都可以指定函数的 this 指向。call 接受的是若干个参数列表，apply 接受一个包含多个参数的数组。

bind 有以下特性：

- 可以指定 this
- 返回一个函数
- 可以传入参数
- 柯里化

bind 实现细节：

- 指定 this
- 返回函数
- 合并两次函数的参数（柯里化）
- 可以应用其它 this 绑定规则
- 抛出异常

```javascript
// bind 实现
Function.prototype.bind2 = function (context) {
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.bind2 - not callable');
  }

  const fn = this;

  const curried = [].slice.call(arguments, 1);

  const bound = function () {
    const args = [].slice.call(arguments, 0);
    context = this instanceof bound ? this : context;

    return fn.apply(context, curried.concat(args));
  };

  const fNOP = function () {};

  // 借用中间函数传递调用函数的原型，实现了原型链继承，同时不会修改继承的原型，即 fn
  fNOP = fn.prototype;
  bound.prototype = new fNOP();

  return bound;
};
```
