---
id: perspective-network
title: 透视 HTTP 协议
---

## 破冰篇

### 时势与英雄：HTTP 的前世今生

#### 史前时期

基于 ARPA 网的实践与思考，研究人员发明出了著名的 TCP/IP 协议。

#### 创世纪

蒂姆·伯纳斯 - 李提出了在互联网上构建超链接文档系统的构想，其中确立了三项技术：

- URI: 统一资源标识符，作为互联网资源的唯一身份。
- HTML: 超文本标记语言，描述超文本文档。
- HTTP: 超文本传输协议，用来传输超文本。

由这三种系统组成的系统成为万维网。

#### HTTP/0.9

- 采用纯文本格式。
- 只允许使用 GET 从服务器获取 HTML 文档。
- 响应请求后立即关闭连接。

#### HTTP/1.0

- 增加了 HEAD、POST 等新方法。
- 增加了响应状态吗、标记可能的错误原因。
- 引入了协议版本号概念。
- 引入了 HTTP Header 的概念，让 HTTP 处理请求和相应更加灵活。
- 传输的数据不再仅限于文本。

只是一份参考文档。

#### HTTP/1.1

是一个标准。

- 增加了 PUT、DELETE 等新的方法。
- 增加了缓存管理和控制。
- 明确了连接管理，允许持久连接。
- 允许响应数据分块，利于传输大文件。
- 强制要求 Host 头，让互联网主机托管成为可能。

#### HTTP/2

HTTP 连接慢，只能通过其它手段来优化资源的访问，如使用雪碧图、合并 js 文件等网页优化手段。

Google 先推出了新的 SPDY 协议，目前的全球占有率超过了 60%。

以 SPDY 为基础指定了 HTTP/2：

### 动手搭建 HTTP 实验环境

> Linux/Mac 实验环境搭建

最小化环境用到的软件：

- Wireshark
- Chrome/Firefox
- Telnet
- OpenResty

使用 homebrew 安装 OpenResty：

```shell
brew install openresty/brew/openresty
```

安装过程中可能会报以下错误：

```txt
curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused
```

原因是该源是在国外，国内访问速度特别慢，我们知道域名解析的大致流程是先按照浏览器缓存 -> 系统缓存 -> 本地 hosts -> DNS 系统顺序进行解析，可以在本地加 hosts 来加快 `raw.githubusercontent.com` 域名的解析。

访问 `https://githubusercontent.com.ipaddress.com/raw.githubusercontent.com`，获取到该域名对应的 ip 地址，然后打开 hosts 文件，我本地安装了 vscode，执行 `code /ect/hosts` 打开，然后加入如下代码：

```txt
185.199.108.133 raw.githubusercontent.com
```

验证是否安装成功：

```shell
resty -v
```

有了 OpenResty，克隆 http_study 项目：

```shell
git clone https://github.com/chronolaw/http_study
```

在项目的 `www` 目录下有一个 shelle 脚本 `run.sh`，作用和 windows 下的 start.bat/stop.bat 差不多，可以简单地启停实验环境，后面可以接命令行参数 start/stop/reload/list:

```shell
# 脚本必须在www目录下运行，才能找到 nginx.conf
cd http_study/www/
# 启动实验环境
./run.sh start
# 列出实验环境的 nginx 进程
./run.sh list
# 重启实验环境
./run.sh reload
# 停止实验环境
./run.sh stop
```

启动 OpenResty 后，可以使用浏览器或 curl 来验证测试 URI，记得添加域名解析，如：

```shell
curl -v "http://127.0.0.1/"
curl -v "http://www.chrono.com/09-1"
curl -k "https://www.chrono.com/24-1?key=1234"
curl -v "http://www.chrono.com/41-1"
```

访问 `curl -v "http://127.0.0.1/` 的结果如下：

![curl](https://ypyun.ywhoo.cn/assets/20210531234613.png)

浏览器访问 `http://127.0.0.1/` 的结果如下：

![浏览器](https://ypyun.ywhoo.cn/assets/20210531234709.png)
