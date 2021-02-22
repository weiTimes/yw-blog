---
id: mysql-uninstall
title: 完全卸载mysql
---

创建数据库一直失败，应该是 mysql 坏了，所以将其完全卸载后再重新安装。

1. 打开终端
2. 使用 `mysqldump` 备份数据库
3. 查看 mysql 进程 `ps -ax | grep mysql`
4. 关闭 mysql 服务：打开系统偏好设置点击进 mysql 选择关闭
5. （选择）如果用 brew 安装的：`brew remove mysql`、`brew cleanup`
6. 删除文件
```shell
sudo rm /usr/local/mysql
sudo rm -rf /usr/local/var/mysql
sudo rm -rf /usr/local/mysql*
sudo rm ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist
sudo rm -rf /Library/StartupItems/MySQLCOM
sudo rm -rf /Library/PreferencePanes/My*
```
7. 移除 mysql 配置
```shell
# 编辑器打开
code /etc/hostconfig
# Remove the line MYSQLCOM=-YES-
```
* 移除 mysql 的偏好设置
```shell
rm -rf ~/Library/PreferencePanes/My*
sudo rm -rf /Library/Receipts/mysql*
sudo rm -rf /Library/Receipts/MySQL*
sudo rm -rf /private/var/db/receipts/*mysql*
```
8. 重启电脑确保所有服务都被关闭了
9. 尝试运行 mysql，现在不能正常工作了。

> 重装 mysql 后记得重启电脑。