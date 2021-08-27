---
id: user
title: 用户操作
---

> 系统：Ubuntu

## 修改 root 用户密码

系统刚安装时 root 用户是没有密码的，需要设置，执行如下命令：

```shell
sudo passwd root
# 输入当前登录用户的密码
# 输入要设置的 root 密码
# 再次输入
```

## 用户切换

shell 提示符：

- `$`: 普通用户
- `#`: root 用户

### 普通用户切换到 root

```shell
# 方式一（后跟要切换的用户名）
su [root]
# 方式二（用户和 shell 环境会同步切换）
su -
```

使用方式二，键入 `pwd` 可以看到当前的工作目录是 `/root`。

## 修改用户名

如我想修改 `parallels` 用户的用户名，先切换到 root（`su -`），然后执行：

```shell
# -l 后跟的是新用户名
# -d 后是新用户的工作目录
# -m 是老用户名
usermod -l ywhoo -d /home/ywhoo -m parallels
```

如果提示 `usermod: user parallels is currently used by process 8363`，需要先将该进程杀掉，然后再修改：

```shell
kill -9 8363
```

## 修改用户所在组

刚才只修改了用户名和工作目录，所在组还没修改。

将用户 ywhoo 加入 ywhoo 组：

```shell
gpasswd -a ywhoo ywhoo
```

如提示 ywhoo 组不存在，需要先创建：

```shell
groupadd ywhoo
```

## 查看当前登录用户和系统所有用户

当前用户：

```shell
whoami
```

所有用户：

```shell
compgen -u
# 或
getent passwd
```

## 删除用户及删除用户组

```shell
# 删除用户
userdel x
# 删除用户组
groupdel x
```
