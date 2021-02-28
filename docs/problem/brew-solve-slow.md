---
id: brew-solve-slow
title: 解决 brew 安装包慢的问题
---

本文使用清华镜像的方法解决。

1. 用浏览器打开 [install.sh](https://raw.githubusercontent.com/Homebrew/install/master/install.sh)
2. 在本地新建一个 `install.sh`，将内容复制到该文件中
3. 搜索 `HOMEBREW_BREW_GIT_REMOTE=`，并将它的值改成 `https://mirrors.ustc.edu.cn/brew.git`
4. 执行该脚本 `/bin/bash ./install.sh`(bash后面跟的是 install.sh 的路径)
5. 进入 homebrew 目录: `cd /usr/local/Homebrew/Library/Taps/homebrew`
6. 执行 `git clone https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git`
7. 切换清华镜像
```shell
cd "$(brew --repo)"

git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git

cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"

git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git

brew update
```