---
id: origin-dev
title: Javascript 元编程
---

可以使用 `Reflect` 和 `Proxy` 进行元编程。

## 什么是元编程

`元编程  `是一种编程技术，编写出来的计算机程序能够将其他程序作为数据来处理。意味着可以编写出这样的程序：它能够读取、生成、分析或者转换其它程序，甚至在运行时修改程序自身。

* 可以生成代码
* 可以在运行时修改语言结构

:::tip

也被称为反射编程 或 反射

:::

## 什么是反射

反射  是元编程的一个分支。反射又有三个子分支：

1. **自省（Introspection）：**可以自我检查，访问内部属性。
2. **自我修改（Self-Modification）：**可以修改自身。
3. **调解（Intercession）：**类似于包装、捕获、拦截。

使用 Reflect 实现 自省，使用 Proxy 实现调解。

## ES6 之前的元编程

还记得  `eval`  吗？看看它的用法：

```javascript
const blog = {
    name: 'freeCodeCamp'
}
console.log('Before eval:', blog);

const key = 'author';
const value = 'Tapas';
testEval = () => eval(`blog.${key} = '${value}'`);

// 调用函数
testEval();

console.log('After eval magic:', blog);
```

`eval` 中执行的代码为 `blog` 新增了一个 `author` 属性，对 `blog` 进行了自我修改。

## 调解

元编程中的  `调解`  指的是改变其它对象的语义。可以用  Object.defineProperty()  方法来改变对象的语义：

```javascript
var sun = {};
Object.defineProperty(sun, 'rises', {
    value: true,
    configurable: false,
    writable: false,
    enumerable: false
});

console.log('sun rises', sun.rises);
sun.rises = false;
console.log('sun rises', sun.rises);
```

两次的输出均是 `sun rises true`。

## Reflect API

* 是一个 `全局对象`，提供了工具函数，都是自省方法。
* 不是构造函数，无法被实例化，所以提供的方法均是静态方法。

### 为什么要使用它

* 集中在一个命名空间
* 便于处理异常
比较 Object.defineProperty 和 Reflect API：

```javascript
Object.defineProperty
try {
    // 执行成功 
    Object.defineProperty(obj, name, desc);
} catch (e) {
    // 执行失败，处理异常
}

// Reflect API
if (Reflect.defineProperty(obj, name, desc)) {
  // 执行成功
} else {
 // 处理执行失败的情况。（这种处理方式好多了）
}
```

* 一等函数的魅力
```javascript
// es5
delete object[key];

// es6
Reflect.deleteProperty(obj, 'bar');
```

* 更可靠的方式来使用 apply
```javascript
Reflect.apply(func, obj, arr);
```
如果 func 是不可调用的对象，即 func 是一个有自定义 apply 方法的对象，会抛出异常。

## Proxy

可用于调解。

使用 Proxy 包含以下几个关键点：
* **target：**代理为其提供自定义行为的对象。
* **handler：**包含“捕获器”方法的对象。
* **trap：** 捕获器方法，通过 Reflect API 实现。
![Proxy](http://ypyun.ywhoo.cn/assets/20210119104157.png)

### 使用示例

```javascript
// 定义包含捕获器的对象
let handler = {
    get: function(target, fieldName) {        

        if(fieldName === 'fullName' ) {
            return `${target.firstName} ${target.lastName}`;
        }

        return fieldName in target ?
            target[fieldName] :
                `No such property as, '${fieldName}'!`

    }
};

// 创建 Proxy 对象
let proxy = new Proxy(employee, handler);

// 访问
console.log(proxy.firstName);
console.log(proxy.org);
```

如果访问不存在的属性，会提示 `No such property as, xx`。