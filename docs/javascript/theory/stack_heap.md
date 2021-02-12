---
id: stack_heap
title: 引擎，运行时，调用堆栈概述
---

本章系列的第一章，本系列旨在深入 JavaScript 并理解它是如何运行的：我认为在了解 JavaScript 的构建模块和它们是如何捏合在一起工作之后你将会写出更好的代码和应用。

## 概述

了解 Javascript 的工作原理，以写出更好的、非阻塞的应用程序。

## V8 引擎

![引擎](https://ypyun.ywhoo.cn/assets/20210126220157.png)

引擎包括两部分：

* 动态内存管理 - 分配内存
* 调用栈 - 执行代码，即是你的堆栈结构

## 运行时

浏览器 API (如 setTimeout)是由浏览器，即宿主环境提供的，而不是 JS 引擎。

![运行时](https://ypyun.ywhoo.cn/assets/20210126220540.png)

## 调用栈

Javascript 是一个单线程语言，只有一个调用栈，一次只能做一件事情。

调用栈是一种数据结构，它会记录函数调用在程序中的对应位置。当执行一个函数时，就会为该函数生成一个作用域，并推入调用栈中；该函数执行完毕从栈顶推出。

> 注：既然是栈，就遵循后进先出的执行顺序。

查看如下代码：

```javascript
function multiply(x, y) {
  return x * y;
}

function printSquare(x) {
  var s = multiply(x, x);
  console.log(s);
}

printSquare(5);
```

调用栈的执行顺序如下：

![代码执行顺序](https://ypyun.ywhoo.cn/assets/20210126221809.png)

### 堆栈结构

调用栈的入口被称为堆栈结构，它描述了调用栈的状态，如代码发生异常，我们可以直观得追踪到异常所处的位置。看如下代码：

```javascript
function foo() {
  throw new Error('SessionStack will help you resolve crashes:)');
}

function bar() {
  foo();
}

function start() {
  bar();
}

start();
```

执行以上代码，控制台会输出如下信息，它包含了错误代码的堆栈结构：

![错误提示](https://ypyun.ywhoo.cn/assets/20210126222407.png)

### 堆栈溢出

当调用栈达到最大时，会出现堆栈溢出。一个简单的例子就是一个函数调用自身并且没有退出条件：

```javascript
function foo() {
  foo();
}

foo();
```

![堆栈溢出](https://ypyun.ywhoo.cn/assets/20210126222557.png)

![控制台](https://ypyun.ywhoo.cn/assets/20210126222617.png)

## 并发和事件循环

一个程序如果有非常繁重的任务在调用栈中执行，这时候浏览器无法做其它事情，包括用户的响应，需要等调用栈空闲时才能够响应其它操作。

这对用户非常不友好，很可能造成大量的用户流失。因此，编写一个不会阻塞程序的代码就尤为重要，在 Javascript 中有事件循环机制，我们可以把繁重的任务拆成一个个小的可执行单元，然后交给异步事件去处理；浏览器会在空闲的时候执行它。

详细地会在第二章进行阐述。