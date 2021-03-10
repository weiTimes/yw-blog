---
id: not-access-github
title: 无法访问 Github
---

> 修改 Hosts

1. [打开 DNS 查询工具](http://tool.chinaz.com/dns)
2. 输入 github.com
3. 找到 TTL 值最低的 IP
[IP](https://ypyun.ywhoo.cn/assets/20210301115007.png)
4. 执行 `vim /etc/hosts`
5. 添加如下内容，即 IP 与 域名的映射

```hosts
52.192.72.89      www.github.com
```
