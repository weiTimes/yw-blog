---
id: promise
title: promise
---

>MDN: Promise 对象用于表示一个异步操作的最终完成 (或失败)状态及其结果值。
> 面向对象：Promise 对象是一个可用于存储异步操作结果的状态和数据的容器。

![Promise UML类图](https://mmbiz.qpic.cn/mmbiz_png/5Xv0xlEBe9ibRXzmXI7IGvPwiaO4fIsGj9Dic4vrudjd7V2MzEnBEum01GlaMIhORabF7BhCNNjLhcZtLsGlJDrbQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

手写 Promise 的步骤：

* 以容器概念作为切入点，实现 Promise 对象的基本结构。
* 分析 Promise 容器和异步操作的关系，实现 Promise 的构造方法 constructor。
* 理清 Promise 容器中数据的写入方式，实现 Promise 的 resolve 和 reject 方法。
* 理清 Promise 容器中数据的读取方式，实现 Promise 的 then 方法。
给 then 方法加个需求，支持链式调用，方便处理异步操作流。


## 附录

* [看懂此文，手写十种Promise！](https://mp.weixin.qq.com/s/yXOstYUDXldXJ4M-38q1xg)