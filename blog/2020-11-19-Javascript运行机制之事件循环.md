---
slug: event-loop
title: Javascript运行机制之事件循环
author: 叶威
author_title: 前端攻城狮
author_url: https://github.com/weiTimes
author_image_url: https://avatars2.githubusercontent.com/u/21688593?s=460&u=09db1866a0350eb8c4dd0389b22a596d2b081b4b&v=4
tags: [Javascript, 事件循环]
description: ''
---

## 运行时的页面构建过程

在讨论事件循环机制之前，我们先来探索客户端Web应用的生命周期，在本小节将会了解到：

- 页面是如何从HTML代码建立的
- Javascript代码的执行
- 事件是如何被处理的

<!--truncate-->

### 生命周期概览

假设现在你在浏览器地址栏输入一串URL，会发生一系列肉眼看不到的事情，我们一起来简单看看：

1. 输入URL
1. 生成请求并发送至服务器
1. 执行某些动作或获取某些资源；将相应发送给客户端
1. 处理HTML、CSS、Javascript
1. 监控事件队列，一次只处理其中的一个事件
1. 与页面元素交互（交互时会向事件对了添加一个事件），回到步骤五的事件处理
1. 当我们关闭Web页面，应用的生命周期结束



#### 生命周期第一部分 页面构建阶段

我们从步骤4开始深入探讨Web应用的生命周期（虽然前三个步骤也值得深入，但不在这篇文章的探讨范围）。步骤4的目标是建立Web应用UI，主要包括两个步骤：

1. 解析HTML代码并构建文档对象模型（DOM）
1. 执行Javascript代码

步骤1会在浏览器处理HTML节点的过程中执行，步骤2会在HTML解析到`script`标签时执行，每当解析到脚本元素时(`script`标签)，浏览器会停止从HTML构建DOM。页面构建阶段中，这两个步骤会交替执行（只要还有没有处理完的HTML元素和没执行完的Javascript）。


#### 生命周期第二部分 事件处理


浏览器执行环境的核心思想基于：同一时刻只能执行一个代码片段，即所谓的单线程执行模型。事件的处理过程可以描述为一个简单的流程：

1. 浏览器检查事件队列头
1. 如果浏览器没有在队列中检测到事件，则继续检查
1. 如果检测到了事件，则取出该事件并执行相应的事件处理器，处理完再回到步骤1，如此往复循环



事件的类型主要包含浏览器事件、网络事件、用户事件、计时器事件这四种，在处理事件之前，我们需要先告知浏览器，即注册事件处理器。


## 事件循环

> 这一部分我们深入看看事件循环机制

我们之前简要讨论了Javascript单线程执行模型，并介绍了事件循环和事件队列，即事件的调度方法，不过这能算是个大概了解，我们还需要深入探讨。


**事件循环**它是一个在Javascript引擎等待任务，执行任务和进入休眠状态等待任务（几乎不消耗CPU资源）这几个状态之间转换的无线循环。
Javascript引擎会将多个任务按照先后顺序放入一个队列（先进先出），事件循环机制会不断地检测队列的队首是否有任务，如果有，则取出执行，如果没有，直到任务队列为空引擎进入休眠状态，如下图是一个简单的宏任务队列：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ac11c091be24ed785974bb03d681be8~tplv-k3u1fbpfcp-zoom-1.image)
事件循环有两个原则

- 一次处理一个任务
- 一个任务开始后知道运行完成，不会被其它任务打断



**宏任务和微任务**


事件循环通常至少需要两个任务队列：宏任务队列和微任务队列。
**
宏任务包括创建主文档对象、解析HTML、执行主线（或全局）Javascript代码、更改当前URL以及各种事件（如页面加载、输入、网络事件和定时器事件），运行完一个任务后，会在进行其它任务之前重新渲染页面UI或执行垃圾回收。


微任务是更小的任务。必须在继续执行其它任务之前执行，包括重新渲染的UI，微任务的类型包括`Promise`、DOM发生变化等；微任务使我们能够在重新渲染UI前执行指定的行为，避免不要的UI重绘，而UI重绘会使应用程序的状态不连续。


事件循环会首先检查宏任务队列，如果不为空，则取出一个宏任务执行，执行完毕后检查微任务队列，如果微任务不为空，则依次取出执行，知道微任务队列为空；微任务执行完后事件队列会检查是否需要更新UI渲染，如果是，则会重新渲染UI视图，到这里本次事件循环结束，会回到最初检查宏任务队列，开启新一轮的事件循环。


我们再来看一些细节：


- 宏任务队列和微任务队列都是独立于事件循环的，即队列的添加行为也发生在事件循环之外。
- 因为Javascript基于单线程模型，所以这两类任务都是逐个执行的。当一个任务执行的时候，不会被中断，除非执行时间过长或占用内存过大。
- 微任务是在下一次UI渲染前执行
- 浏览器会尝试以每秒60帧的速度渲染页面，即16ms内渲染一帧，想要实现平滑流畅的应用，单个任务和该任务附属的所有微任务，都应在16ms内完成



## 浏览器与Nodejs事件循环机制的异同

> 浏览器的事件循环机制是由v8引擎提供，而Nodejs事件循环机制是由libuv提供的的，libuv是一个异步处理的核心库。

| 宏任务       | 浏览器 | Nodejs |
| ------------ | ------ | ------ |
| I/O          | ✅      | ✅      |
| setTimeout   | ✅      | ✅      |
| setInterval  | ✅      | ✅      |
| setImmediate | ❌      | ✅      |




| 微任务                | 浏览器 | Nodejs |
| --------------------- | ------ | ------ |
| nextTick              | ❌      | ✅      |
| MutationObserver      | ✅      | ❌      |
| Promise               | ✅      | ✅      |
| requestAnimationFrame | ✅      | ❌      |

### setImmediate和setTimeout

setImmediate在一次事件循环结束后执行，setTimeout在给定的延时时间后执行。
让我们看以下代码：

```javascript
setTimeout((_) => console.log('setTimeout'));
setImmediate((_) => console.log('setImmediate'));
```

执行多次后发现，无法确定setImmediate和setTimeout执行的先后顺序，即都有可能先执行；我们再看以下代码，可以保证setTimeout先于setImmediate执行：

```javascript
setTimeout((_) => console.log('setTimeout'));
setImmediate((_) => console.log('setImmediate'));

var count = 1e9;

while(count--) {}
```

这段代码主线程的执行需要花费一段时间，此时`setTimeout`的回调执行时间到了先放入宏任务队列中，当`count === 0`时，主线程执行完毕，本次事件循环结束，`setImmediate`被加入队列，所以`setTimeout`会在`setImmediate`之前执行。

最后再看以下代码：

```javascript
setTimeout(() => {
  setTimeout((_) => console.log('setTimeout'));
  setImmediate((_) => console.log('setImmediate'));
});
```

`setTimeout`、`setImmediate`被放入一个宏任务中，此时一定是`setImmediate`先执行，从它的定义我们可以得到这个结果。

### nextTick

nextTick的优先级高于其它微任务。
在代码执行过程中随时可以插入nextTick，它会保证在下一个宏任务开始之前执行。

### requestAnimationFrame

需要注意的是，`requestAnimationFrame`会告诉浏览器你将要执行一个动画，这个并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。


所以如果在同一个宏任务中，有这么一行代码`element.setAttribute('data-random', Math.random())`目的是修改了某个元素的属性，这会导致浏览器的重绘，根据前面的定义，在重绘前会先执行`requestAnimationFrame` ，即使在其之前又创建了一个`setTimeout`的宏任务，`requestAnimationFrame`也会早于`setTimeout`执行。顺带说一下，如果有创建`MutationObserver`微任务，这个会在修改完DOM属性后触发，也说明了再下一次事件循环前，会先执行完微任务队列。


注：有的地方将`requestAnimationFrame`其归类于宏任务，但宏任务是在UI重绘之后执行的，而根据`requestAnimationFrame`的定义，它是在重绘之前执行的，当然是晚于其它微任务，如果真要归类的话，我更愿意将它归类为微任务，只是优先级较低。


### 细谈Nodejs事件循环机制

> Nodejs 的异步语法比浏览器更复杂，因为它可以跟内核对话，不得不搞了一个专门的库 [libuv](http://thlorenz.com/learnuv/book/history/history_1.html) 做这件事，这个库负责主要各种回调函数的执行时间。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16a998998af64e26aa959eac9f15ca05~tplv-k3u1fbpfcp-zoom-1.image)
Nodejs提供了四个定时器，让人物可以在指定的时间运行。

- setTimeout
- setInterval
- setImmediate
- process.nextTick



看看下面的代码极其运行结果，稍后我会解释为什么是这个结果：

```javascript
setTimeout(() => console.log(1)); // #1
setImmediate(() => console.log(2)); // #2
Promise.resolve().then(() => console.log(4)); // #3
process.nextTick(() => console.log(3)); // #4
(() => console.log(5))(); // #5

// 5 -> 3 -> 4 -> 1 -> 2;
```

1. #5是主线程任务，属于同步执行，所以最先执行
1. 主线程执行完，会先执行微任务，nextTick的优先级要高于其它异步任务，所以此时的微任务队列是#4、#3，所以执行顺序是#4先执行，接着是#3
1. 在执行#3、#4的过程中，setTimeout的回调执行时间应该到了（大约4ms），所以会先于setImmediate进入宏队列，此时宏任务队列中有#1、#2，执行顺序是#1、#2。



以上看起来和浏览器的事件循环机制基本一致，只是某些api的不一样，实际上Nodejs的事件循环机制还可以再深入一点，我们一起来看看：

在事件循环之前，会先进性事件循环的初始化：

- 同步任务
- 发出异步请求
- 规划定时器生效的时间
- 执行`process.nextTick()` 等等



事件循环初始化后，开始事件循环。其中libuv引擎中的事件循环分为 6 个阶段，它们会按照顺序反复运行。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段，如图所示：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69344f001ca24a6ca5fab95e428a7b1c~tplv-k3u1fbpfcp-zoom-1.image)
从图中可以看出nodejs事件循环的执行顺序：


1. times
   这个是定时器阶段，执行`setTimeout()`和`setInterval()`的回调函数。这个阶段是受poll阶段控制的。
1. I/O callback
   除了以下操作的回调函数，其他的回调函数都在这个阶段执行：
   a. `setTimeout()`和`setInterval()`的回调函数 -> timers
   b. `setImmediate()`的回调函数 -> check
   c. 用于关闭请求的回调函数，比如`socket.on('close', ...)` -> close callbacks
1. idle, prepare
   该阶段只供 libuv 内部调用，这里可以忽略
1. poll
   轮询，直到有回调到期，拿到结果往下执行
1. check
   该阶段执行setImmediate()的回调函数
1. close callbacks
   该阶段执行关闭请求的回调函数，比如`socket.on('close', ...)`

1. 回到步骤1，开始一轮新的循环



下面我们通过一个例子来看看这个过程：

```javascript
const fs = require('fs');

const timeoutScheduled = Date.now();

// 异步任务一：100ms 后执行的定时器
setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;
  console.log(`${delay}ms`);
}, 100);

// 异步任务二：文件读取后，有一个 200ms 的回调函数
fs.readFile('test.js', () => {
  const startCallback = Date.now();
  while (Date.now() - startCallback < 200) {
    // 什么也不做
  }
});
```

**结果：**

1. 脚本进入第一轮事件循环以后，没有到期的定时器，也没有已经可以执行的 I/O 回调函数，所以会进入 Poll 阶段，等待内核返回文件读取的结果。由于读取小文件一般不会超过 100ms，所以在定时器到期之前，Poll 阶段就会得到结果（push到I/O 队列），因此就会继续往下执行。
1. 第二轮事件循环，依然没有到期的定时器，但是已经有了可以执行的 I/O 回调函数，所以会进入 I/O callbacks 阶段，执行fs.readFile的回调函数。这个回调函数需要 200ms，也就是说，在它执行到一半的时候，100ms 的定时器就会到期。但是，必须等到这个回调函数执行完，才会离开这个阶段。前，Poll 阶段就会得到结果，因此就会继续往下执行。
1. 第三轮事件循环，已经有了到期的定时器，即timers队列不为空，所以会在 timers 阶段执行定时器。最后输出结果大概是200多毫秒。



再来一个例子：

```javascript
function test () {
   console.log('start')
    setTimeout(() => {
        console.log('children2')
        Promise.resolve().then(() => {console.log('children2-1')})
    }, 0)
    setTimeout(() => {
        console.log('children3')
        Promise.resolve().then(() => {console.log('children3-1')})
    }, 0)
    Promise.resolve().then(() => {console.log('children1')})
    console.log('end')
}

test();
```

**执行顺序：**
node v11 及以上：start -> end -> children1 -> children2 -> children2-1 -> children3 -> children3-1
这个结果和浏览器的表现一致。
nodev11以下：start -> end -> children1 -> children2 -> children3 -> children2-1 -> children3-1
会先执行完宏任务队列，再执行微任务队列。

## 其它示例

1. 浏览器中事件循环机制的表现，这里会稍不一样，加入了事件冒泡的影响

- 点击`inner`输出的结果：click -> promise -> observer -> click -> promise -> observer -> animationFrame -> animationFrame -> (重绘) -> timeout -> timeout -> （重绘）
- 点击`outer`输出的结果：click -> promise -> observer -> animationFrame -> (重绘) -> timeout -> （重绘）

注：上面重绘用括号括起来，是因为这一阶段不一定会发生重绘，浏览器会检测是否需要重绘，需要才重绘。

```javascript
/** html
<div id="outer">
  <div id="inner"></div>
</div>
**/

const $inner = document.querySelector('#inner')
const $outer = document.querySelector('#outer')

function handler () {
  console.log('click') // 直接输出

  Promise.resolve().then(_ => console.log('promise')) // 注册微任务

  setTimeout(_ => console.log('timeout')) // 注册宏任务

  requestAnimationFrame(_ => console.log('animationFrame')) // 注册微任务

  $outer.setAttribute('data-random', Math.random()) // DOM属性修改，触发微任务
}

new MutationObserver(_ => {
  console.log('observer')
}).observe($outer, {
  attributes: true
})

$inner.addEventListener('click', handler)
$outer.addEventListener('click', handler)

```

2. 拆分CPU过载任务，思路是将一项繁重的任务拆分成多个宏任务，因为每次宏任务的执行会先进入队列，不会阻塞线程，如下所示：

```javascript
let i = 0;

let start = Date.now();

function count() {

  // 将调度（scheduling）移动到开头，即使setTimeout设定的是0延时，但实际上要执行回调是大于0的，一般在4ms，所以放到前面可以先将其加入队列中，这样可以早些时候调用
  if (i < 1e9 - 1e6) {
    setTimeout(count); // 安排（schedule）新的调用
  }

  do {
    i++;
  } while (i % 1e6 != 0);

  if (i == 1e9) {
    alert("Done in " + (Date.now() - start) + 'ms');
  }

}

count();
```


## 附录

* Javascript 忍者秘籍
* [阮一峰-事件循环](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)
* [javascript.info](https://zh.javascript.info/event-loop)
* [宏任务、微任务和EventLoop](https://juejin.im/post/6844903657264136200)
* [Node定时器详解](http://www.ruanyifeng.com/blog/2018/02/node-event-loop.html)
* [浏览器与Node的事件循环(Event Loop)有何区别](https://juejin.im/post/6844903761949753352#heading-12)
* [浏览器和Node 事件循环的区别](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/26)

