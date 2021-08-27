---
title: 其它
---

## 说说你对 linux 用户管理的理解？相关的命令有哪些？

Linux 是一个所有操作都是基于文件的系统，而且允许不同的用户登录系统，这就涉及到了权限管理，不同的用户拥有着各自的权限。

用户管理包含用户与用户组的管理，关于文件的权限，可分为三种：

1. 文件所有者
2. 用户组成员
3. 其他成员

使用 `ls -al` 可以查看文件的详细信息，如下：

```shell
drwxr-xr-x  3 root root 4096 Jul 27 20:28 snap
```

- d: 第一个字符表示文件类型，d 指目录。
- rwxr-xr-x: 包含了所有者、所在用户组、其他用户的访问权限；rwx 分别表示读、写、执行权限。
- 两个 root 分别表示文件所有者和所在用户组。

相关的命令涉及对用户的增删改查，用户组的增删改查，切换用户等：

- useradd/userdel/usermod/whoami/`cat /etc/passwd`
- groupadd/groupdel/groupmod/`cat /etc/group`
- su [user]
