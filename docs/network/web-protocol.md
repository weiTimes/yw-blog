---
title: web 协议详解与抓包实战
---

## OSI 模型和 TCP-IP 模型

### OSI 模型

![OSI](https://ypyun.ywhoo.cn/assets/CleanShot%202021-09-06%20at%2022.27.41@2x.png)

- 应用层：解决的是业务问题
- 表示层：将数据转换成应用层能够理解的格式
- 会话层（概念化）：建立连接、维持连接、关闭连接
- 传输层：解决进程与进程之间的通信
  - TCP：报文的可达性、流量的控制
  - 负载均衡
- 网络层：把报文从一个主机发送到另一个主机上
- 数据链路层：通过 MAC 地址找到对应的主机
- 物理层：物理传输介质

### OSI 与 TCP/IP 模型对照

![对照](https://ypyun.ywhoo.cn/assets/CleanShot%202021-09-06%20at%2022.39.43@2x.png)

TCP/IP 模型从上往下分别是：

- 应用层
- 传输层
- 网际层
- 链接层

### 网络分层的优点与缺点

优点：上层只需要与邻近一层的交互，而不需要关心外层的实现细节。

缺点：每一层都需要对数据进行处理，增加了数据延迟。

### 各层所对应的传输单位（报文头部）

![报文头部](https://ypyun.ywhoo.cn/assets/CleanShot%202021-09-06%20at%2022.45.46@2x.png)

从下往上：

Bit（二进制） → Frame → Packet → Sequence/Datagram

## HTTP 解决了什么问题

URI: 统一资源标识符

![构成](https://ypyun.ywhoo.cn/assets/CleanShot%202021-09-06%20at%2022.04.38@2x.png)

解决 www 信息交互必须面对的需求：

- 低门槛
- 可扩展性：巨大的用户群体，超长的寿命
- 分布式系统下的 Hypermedia: 大粒度数据的网络传输
- Internet 规模
  - 无法控制的 scalebility
    - 不可预测的负载、非法格式的数据、恶意消息
    - 客户端不能保持所有服务器信息，服务器不能保持多个请求间的状态信息
  - 独立的组件部署：新老组件并存
- 向前兼容