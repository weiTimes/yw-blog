---
id: this
title: this 全面解析
---

## 五种 this 绑定

函数内部 this 的指向，取决于调用的位置，那么什么是调用位置呢？

调用位置就是函数在代码中被调用的位置（而不是声明的位置）。它在当前正在执行的函数的前一个调用中，也就是处于栈顶的下一个栈元素。

### 默认绑定

函数调用时，默认指向全局对象，window 或 global，如果是严格模式下，则指向 undefined。

严格模式只影响当前作用域 this 的默认绑定。

### 隐式绑定

当函数引用有上下文对象时，this 会被绑定到 `.` 前面的对象。

隐式绑定的函数如果传给其它变量，或是作为其它函数的形式参数传入，会丢失绑定，这叫隐式丢失。this 会被绑定到全局对象或是 undefined。

### 显示绑定

使用 `call` 和 `apply` 可以在函数调用时，将对象绑定到 this 上。

```javascript
function foo(greeting) {
  return this.name + greeting;
}

const obj = {
  name: 'ywhoo, ',
};

// 实现 bind，可以显示地绑定函数的 this 到指定的对象上。
function bind(fn, obj) {
  return function () {
    return fn.apply(obj, arguments);
  };
}

const greet = bind(foo, obj);

console.log(greet('hello'));
```

## new 绑定

使用 new 调用函数时，会自动执行以下操作：

1. 创建一个新对象
2. 该对象会被执行 `[[Prototype]]`，也就是原型会指向 构造函数的原型
3. 该对象会被绑定到 this
4. 如果构造函数返回的是对象，则返回该对象，否则返回新创建的对象。

```javascript
function crete2() {
  const obj = Object.create(null);
  const Con = [].shift.call(arguments);
  obj.__protot__ = Con.prototype;
  const ret = Con.apply(obj, arguments);
  return ret instanceof Object ? ret : obj;
}
```

## 优先级

new => 显示绑定 => 隐式绑定 => 默认绑定

在 new 中使用硬绑定函数的目的是预先设置函数的一些参数，这样在使用 new 进行初始化时就可以只传入其余的参数（**柯里化**）。

```javascript
function bar(p1, p2) {
  this.val = p1 + p2;
}

const yw = bar.bind(null, 1);

const res = new yw(3);

// res.val = 4;
```

## 绑定例外

### 被忽略的 this

把 null 或 undefined 作为绑定对象传入 call、apply 或 bind，这些值会被忽略，实际应用的是默认规则。

传入 null 的应用场景有以下两个：

1. 将传入的数组参数展开，并当做参数传给函数。
2. 对参数进行柯里化（预先设置一些参数）。

```javascript
function foo(a, b) {
  console.log(a, b);
}

// 把数组展开成一个个参数
foo.apply(null, [1, 2]); // 1, 2

// 使用 bind 进行柯里化
const yw = foo.bind(null, 1);
yw(2); // 1, 2
```

使用 null 来忽略指定 this 的绑定对象会有一些副作用，如果函数内部使用了 this，this 会指向全局对象。

最好的方法是指定 this 的绑定对象为一个 `plain object`，即纯的对象：

```javascript
function foo(a, b) {
  console.log(a, b);
}

// create plain object
const obj = Object.create(null);

foo.apply(obj, [1, 2]);
```

### 间接引用

间接引用下，函数应用的是默认绑定规则，如将函数作为参数传递或传递给其它变量或属性，在传递过程中丢失了绑定对象。

### 软绑定

使用硬绑定后可以将 this 绑定到某个对象，防止其应用默认绑定，但是会降低函数的灵活性，无法隐式或显式地更改 this 的绑定对象。

使用软绑定可以实现：

- 函数软绑定后，如果是默认绑定规则，this 将指向软绑定传入的对象。
- 如果是隐式绑定，则 this 指向 `.` 前面的对象。
- 如果是显示绑定，则 this 指向指定的对象。

代码实现：

```javascript
// 软绑定
if (!Function.prototype.softBind) {
  Function.prototype.softBind = function (obj) {
    let fn = this;

    const curried = [].slice.call(arguments, 1);
    const bound = function () {
      // 如果 this 为 undefined 或 指向 window/glboal，使用软绑定的对象，否则使用其它绑定规则的绑定对象。
      const _this = !this || this === global ? obj : this;

      // 返回的函数的原型和调用函数的原型一致
      bound.prototype = fn.prototype;
      fn.apply(_this, curried.concat(curried, arguments));
    };

    return bound;
  };
}

const obj = { name: 'obj' };
const obj2 = { name: 'obj2' };
const obj3 = { name: 'obj3' };

function yw() {
  console.log('name:' + this.name);
}

const ywBind = yw.softBind(obj);

// 默认绑定规则
ywBind(); // name: obj

// 隐式绑定规则
obj2.yw = yw.softBind(obj);
obj2.yw(); // name: obj2

// 显示绑定规则
ywBind.call(obj3); // name: obj3
```

## this 词法

箭头函数无法应用上述四条规则，而是根据外层作用域决定 this。

箭头函数的 this 指向无法被修改。

> 使用词法作用域替代 this 的使用。（通过一个变量保存当前 this，然后提供给其它作用域使用）

箭头函数 this 的总结：

- 箭头函数不绑定 this。
- 箭头函数中 this 的寻值行为和普通变量相同，沿着作用域逐级寻找，因为没有自身的 this，所以只能根据作用域链往上层查找，直到找到一个绑定了 this 的函数作用域，并指向调用该普通函数的对象。
- 箭头函数无法通过 call, apply, bind 来修改 this 的指向。
- 改变箭头函数所在的作用域可以改变箭头函数中的 this。

```javascript title="改变封包环境来改变箭头函数中的 this"
function closure() {
  return () => {
    console.log(`this: ${this}`);
  };
}

const obj = { name: 'yw' };

closure.bind(obj)();
```

## 附录

[this 全面解析](https://muyiy.cn/blog/3/3.1.html#_2-绑定规则)
