---
title: 导航流程：从输入 URL 到页面展示这中间发生了什么
---

![从输入 URL 到页面展示完整流程示意图](https://ypyun.ywhoo.cn/assets/20210713234122.png)

浏览器进程、渲染进程和网络进程的主要职责：

- 浏览器进程主要负责用户交互、管理子进程和文件存储等功能。
- 网络进程是面向浏览器主进程和渲染进程提供网络下载功能。
- 渲染进程的职责是把从网络下载的 HTML、Javascript、CSS、图片等资源解析为可以显示和交互的界面。渲染进程运行在安全沙箱中，保证了系统的安全。

大致过程：

1. 浏览器接收到用户的 URL 请求，浏览器进程将该 URL 转发给网络进程。
2. 在网络进程中发起请求。
3. 网络进程中接收到了响应头数据，开始解析响应头数据，然后将数据转发给浏览器主进程。
4. 浏览器主进程接收到网络进程的响应头数据后，发送“提交导航”消息给渲染进程。
5. 渲染进程接收到“提交导航”消息，开始准备接收 HTML 数据，接收数据的方式是和网络进程建立数据管道。
6. 渲染进程向浏览器进程发送“确认提交”，告诉浏览器进程“准备好接收和解析页面数据”。
7. 浏览器进程接收到“确认提交”，移除旧的文档，更新浏览器进程中的页面状态。

从发出 URL 请求到页面开始解析的这个过程，叫做**导航**。

## 从输入 URL 到页面展示

### 1. 用户输入

地址栏会判断输入的是**搜索内容**还是**URL**：

- 如果是搜索内容，会合成新的带搜索关键字的 URL。
- 如果是 URL，会拼接成完整的 URL，如加上协议。

当用户回车后，判断当前页面是否监听了 `beforeunload` 事件（可以在该事件中执行取消导航），如果没有监听，则继续后续流程，页面标签页开始出现**加载中**的状态，不过此时页面依然是旧的内容，需要到**提交文档阶段**，页面内容才会被**替换**。

### 2. URL 请求过程

浏览器进程通过进程间通信（IPC）把 URL 发送给网络进程，在网络进程中发起请求，流程如下：

1. 网络进程先判断本地是否缓存了该资源，如果是直接返回该资源，没有找到，就进入网络请求流程；要发起请求，需要先进行 DNS 解析，获取请求域名的服务器 **IP**；如果请求协议是 `https`，还需要建立 `TLS` 连接。
2. 利用 IP 和服务器建立 **TCP 连接**。连接建立后，浏览器端构建请求行、请求头等信息，并把该域名下相关的 **Cookie** 等数据附加到请求中，然后向服务器发起请求。
3. 服务器接收到请求后，会返回响应信息，网络进程接收到响应行、响应头后，解析响应头的内容。

#### 重定向

解析响应头时，如果状态码是 301 或 302，网络进程会根据响应头的 Location 字段，再发起新的请求，流程从头开始。

如果状态码时是 200，继续处理该请求。

#### 响应类型数据处理

根据 `Content-Type` 判断响应体的数据类型：

- `text/html`，继续进行导航流程。
- `application/octet-stream`，该请求会被提交给下载管理器，导航流程结束。

### 3. 准备渲染进程

Chrome 默认为每个页面分配一个渲染进程，有一种情况例外，如果从一个页面打开了另一个页面，新页面与当前页面属于同一站点，新页面就会复用父页面的渲染进程。

:::note 什么是同一站点？
协议和根域名相同。如 https://blog.ywhoo.cn 和 https://www.ywhoo.cn 属于同一站点。
:::

渲染进程准备好后，还不能立即进入文档解析状态，因为此时的文档数据还在网络进程中，并没有提交给渲染进程，所以下一步是**提交文档**。

### 4. 提交文档

**提交文档：**浏览器进程将网络进程中接收到的 HTML 数据提交给渲染进程，具体流程：

1. 浏览器进程接收到网络进程的响应头数据，先是准备渲染进程，然后向渲染进程发起**“提交文档”**。
2. 渲染进程接收到“提交文档”消息，和网络进程建立传输数据的“管道”。
3. 文档数据传输完成后，渲染进程会发送“确认提交”的消息给浏览器主进程。
4. 浏览器接收到“确认提交”的消息，就开始更新浏览器界面，包括安全状态、地址栏的 URL、前进后退的历史状态和界面（在进入渲染流程之前是空白界面）。

![确认提交](https://ypyun.ywhoo.cn/assets/20210714211650.png)

到这里**导航流程**就走完了。

### 5. 渲染阶段

一旦“确认文档被提交”，也就是渲染进程发送“确认提交”消息给浏览器主进程，渲染进程就开始页面解析和子资源加载了。页面解析完成后，就会通知到浏览器主进程，然后停止标签图标上的加载动画。

下一小节详细介绍渲染流程。

### 总结

![导航流程图](https://ypyun.ywhoo.cn/assets/20210714215709.png)

- 服务器可以根据响应头来控制浏览器的行为，如跳转、网络数据类型判断。
- Chrome 默认采用每个标签对应一个渲染进程，如果两个页面属于同一站点，则通用一个渲染进程。
- 浏览器的导航流程涵盖了从用户发起请求到提交文档给渲染进程的中间所有阶段。
