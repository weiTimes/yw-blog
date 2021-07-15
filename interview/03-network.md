---
title: 网络协议
---

## 通信类

### 什么是同源策略及限制？

同源策略是浏览器的安全机制，一个源的文档不能操作另一个源的数据。

:::note 同源
协议、域名、端口号都相同
:::

限制：

- 无法读取 Cookie、Localstorage 和 IndexDBV 。
- 无法获取 DOM。
- 无法发起网络请求。

### 前后端如何通信

- ajax 有同源策略限制
- WebSocket 没有同源策略限制
- CORS（跨域资源共享）

#### 如何创建 Ajax

- XMLHttpRequest 对象的工作流程
- 兼容性处理
- 事件的触发条件
- 事件的触发顺序

### 跨域通信的几种方式

- JSONP
- CORS
- postMessage
- WebSocket
- Hash

#### JSONP

- 利用 script 的异步加载实现（script 是不受同源策略限制）
- 传递给后端一个回调函数，改回调函数需要在客户端有实现，用于获取后端塞入的数据
- 后端往该回调塞入响应数据，客户端拿到后执行

#### CORS

> 阮一峰

:::note
fetch 实现 CORS
:::

:::note 为什么 CORS 可以实现跨域通信
浏览器会拦截 ajax，如果发现是跨域的，就会在请求上加上 origin。
:::

#### postMessage

A 给 B 页面发送消息：

```javascript
window.postMessage('data', 'http://b.com');

window.addEventListener('message', (event) => {
  // event.origin 从哪儿发来的
  // event.source 源对象
  // event.data 接收到的数据
});
```

#### WebSocket

```javascript
// ws, wss 有加密
const ws = new WebSocket('wss://echo.we.org');

ws.onopen = function () {
  ws.send('hello');
};

ws.onmessage = function () {
  console.log('接收到');
};

ws.onclose = function () {
  console.log('连接关闭');
};
```

#### Hash

```javascript
const B = document.getElementByTagName('iframe');

B.src = `${B.src}#data`;

// 在 B 中代码实现：
window.onhashchange = function () {
  const data = window.location.hash;
};
```

## 安全类

- CSRF
- XSS

### CSRF

跨站请求伪造。

如果一个网站的登录验证方式使用 cookie，就有可能会被 CSRF 攻击，攻击者会在它们的网站给出一个指向要攻击的网站的 api，引诱用户点击，如果用户点击了，就会携带着 cookie 给到服务器，然后这样也能通过服务端的验证。

CSRF 的实现要求：

- 该网站的 api 存在**漏洞**
- 需要**用户登录**

如何防御：

- Token 验证
- Referer 验证（页面来源）
- 隐藏令牌（放在 header 中而不放在 URL 中）

### XSS

跨域脚本攻击。

原理：向页面注入脚本（如在输入框中）。

## 页面性能

### 提升页面性能的方法有哪些？

- webpack 构建优化，减少 HTTP 请求
- 非核心代码异步加载 → 异步加载的方式 → 异步加载的区别
- react 优化
- 缓存 → 缓存的分类 → 缓存的原理
- CDN
- 预解析 DNS

#### webpack 构建优化

- 资源压缩合并，减少 HTTP 请求

#### 异步加载

方式：

- 动态脚本加载（按需加载）
- defer
- async

区别（绿色表示 HTML 解析，蓝色表示请求网络资源，红色表示执行）：

![defer 和 async 的区别](https://ypyun.ywhoo.cn/assets/20210715221946.png)

- 没有 defer 和 async 的脚本会立即加载并执行该脚本。
- 有 defer 的脚本，加载过程和 HTML 解析并行执行，当 HTML 解析完成之后才执行。
  - 更接近我们的需求
  - 按照声明的俄顺序执行脚本
- 有 async 的脚本 加载和执行过程和 HTML 解析并行执行，加载完立即执行，不管声明的顺序。
  - 适用于不依赖脚本的脚本，如 **Google Analytics**。

#### 预解析 DNS

```html
<meta http-equiv="x-dns-prefetch-control" content="on" />
<link rel="dns-prefetch" href="//hot_name_to_prefetch.com" />
```

在 http 协议下，浏览器默认会对 a 标签链接进行 DNS 预解析；而 https 是默认关闭的，上面的 `meta` 可以打开 **DNS 预解析**。

#### 浏览器缓存

缓存的分类：

- **强缓存**（直接用缓存）
  - _Expires_ 过期时间（绝对时间），由服务器下发，然后用客户端的时间与它进行比较，有可能不一致。
  - _Cache-Control_ max-age=3600（相对时间，以客户端的为基准）
- **协商缓存**（发现有缓存，但不确定用不用，就向服务器询问）
  - _Last-Modified_（服务器下发的时间） _IF-Modified-Since_（浏览器带上给服务器的时间） 两个时间是一样的；缺点：时间变了，内容可能没变，应该继续利用缓存。
  - _Etag_（服务器下发的哈希值），当强缓存失效时，会在请求头上加 _If-None-Match_，值和 Etag 相同，询问是否可以继续使用缓存。

## 错误监控类

:::note
如何检测 js 错误？

如果保证产品的质量？
:::

- 前端错误的分类
- 错误的捕获方式
- 上报错误的基本原理

### 前端错误的分类

- 即时运行错误：代码错误
- 资源加载错误：图片等资源

### 错误捕获的方式

即时运行错误：

- `try...catch`
- `window.onerror`

资源加载错误：

- `img.onerror`
- `performance.getEntries` 获得所有已加载的资源，和需要加载的进行对比，判断未成功加载出来的资源
- Error 事件捕获 `window.addEventListener('error', (e) => {}, true)`

跨域脚本错误:

1. 在 script 标签增加 crossorigin 属性
2. 在服务端设置响应头：`Access-Control-Allow-Origin: *`

### 上报错误的基本原理

- 使用 ajax 通信上报
- 利用 Image 对象上报

```javascript
new Image().src = 'http://ywhoo.cn?data=hello';
```
