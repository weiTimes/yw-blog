---
id: http-auth
title: HTTP 身份验证
---

## 通用的 HTTP 认证框架

HTTP 提供一个用于权限控制和认证的通用框架。最常用的HTTP认证方案是HTTP Basic authentication。本页介绍了通用的HTTP认证框架以及展示如何通过HTTP Basic authentication来限制权限访问您的服务器。

RFC 7235 定义了一个 HTTP 身份验证框架，服务器可以用来针对客户端的请求发送 challenge （质询信息），客户端则可以用来提供身份验证凭证。质询与应答的工作流程如下：服务器端向客户端返回 401（Unauthorized，未被授权的） 状态码，并在  WWW-Authenticate 首部提供如何进行验证的信息，其中至少包含有一种质询方式。之后有意向证明自己身份的客户端可以在新的请求中添加 Authorization 首部字段进行验证，字段值为身份验证凭证信息。通常客户端会弹出一个密码框让用户填写，然后发送包含有恰当的 Authorization 首部的请求。

![http auth](https://ypyun.ywhoo.cn/assets/20210222223947.png)

在上图所示的基本身份验证过程中，信息交换须通过 HTTPS(TLS) 连接来保证安全。

## 验证方案

最常见的验证方案是"Basic Auth"，该方案会在下面进行详细阐述。 IANA 维护了一系列的验证方案，除此之外还有其他类型的验证方案由虚拟主机服务提供，例如 Amazon AWS 。常见的验证方案包括：

* Basic Auth
* Bearer
* Digest
* HOBA
* Mutual
* AWS4-HMAC-SHA256

## Basic Auth

使用用户的 ID/密码作为凭证信息，并且使用 base64 算法进行编码。

### 安全性

由于用户 ID 与密码是是以明文的形式在网络中进行传输的（尽管采用了 base64 编码，但是 base64 算法是可逆的），所以基本验证方案并不安全。基本验证方案应与 HTTPS / TLS 协议搭配使用。假如没有这些安全方面的增强，那么基本验证方案不应该被来用保护敏感或者极具价值的信息。