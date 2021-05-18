---
id: git-flow
title: 使用git-flow分支管理模型和Jenkins多分支流水线的应用
---

这篇文章主要分享两点：

1. 认识并使用 git-flow 分支管理策略。
2. 基于 git-flow，完善我们的 CI/CD 流程。

## 目前存在的问题

在开发过程中，团队中不同成员经常会同步开发不同的功能，可能会出现以下问题：

- 它们提交测试和部署到线上的时间往往不一样，如何清晰所属分支的职责？
- 不同功能可能会有相互依赖的代码，假设分属于不同的分支，如果其中一方想提交测试，必须先和另外一方合并，但另外一方还没到提交测试的时候，如果没有一个好的分支管理策略，就容易造成分支管理的混乱。
- 不同分支是否应该对应不同的环境，应该如何对应，jenkins 应该如何实现。

## 介绍 git-flow

遇到问题时去网上寻找解决方案，无意间看到阮大大写的[《Git 分支管理策略》](https://www.ruanyifeng.com/blog/2012/07/git.html)，介绍的就是 git-flow 分支模型，它可以解决目前所遇到的问题，接下来会结合理论和实践进行分享。

![git-flow](https://ypyun.ywhoo.cn/assets/20210517120006.png)

上图是 git-flow 的分支管理模型，它分为主分支和临时分支：

### 主分支

- master
- develop

master 对应着生产环境的代码。

develop 为开发分支，当 develop 的代码达到稳定点并准备发布时，需将其合并至 master，然后使用版本号标记该次合并。

### 临时分支

不同于主要分支，临时分支的生命周期有限，当使用完后需将其删除，临时分支可分为：

- feature
- release
- hotfix

这些分支中的每一个都有特定的用途，并受严格的规则约束，即哪些分支可能是其原始分支，哪些分支必须是其合并目标。

#### feature - 功能分支

![feature](https://ypyun.ywhoo.cn/assets/20210517152451.png)

从 develop 检出，必须合并回 develop。

当开发某一功能时，从 develop 中检出 feature 分支，feature 分支在开发未完成时一直存在，直到开发完后合并到 develop，然后删除该分支。

创建订单功能分支：

```shell
git checkout -b feature-order develop
```

完成订单功能后，切换到 develop，合并 feature-order:

```shell
# 切换到 develop
git checkout develop
# 合并
git merge --no-ff feature-order
# 删除 feature-order
git branch -d feature-order
# 推送 develop
git push origin develop
```

该--no-ff 标志使合并始终创建一个新的提交对象，即使合并可以通过快进来执行。这样可以避免丢失有关要素分支历史存在的信息，并将所有添加了要素的提交分组在一起。使用 --no-ff 和不使用的区别如下图说是：

![--no-ff](https://ypyun.ywhoo.cn/assets/20210517153129.png)

### release 预发布分支

从 develop 检出，必须合并到 develop 和 master。

预发布分支通常用于在发布到测试环境的代码，待测试完成后，合并到 develop 和 master。

测试过程中可能会用到 hotfix 分支，用于修复测试过程中遇到的 bug，修复完成合并到 release 并删除 hotfix。

创建 release 分支。从 develop 分支创建 release 分支。如当前 master 上的代码版本为 1.1.0，即将发布一个大版本，develop 已经准备就绪，创建一个带版本号的 release 分支：

```shell
# 创建 release-2.0.0 分支
git checkout -b release-2.0.0 develop
```

release-2.0.0 分支会存在一段时间，直到它可以发布时。不能在此分支上面开发新的功能，要开发新的功能，应该在 develop 分支上检出新的 featrue 分支，或者在 feature-\* 主功能分支上检出。

可以发布时，将 release-2.0.0 合并到 master，并标记该次提交，另外还需要将其合并到 develop，以同步在 release-2.0.0 上作的修改：

```shell
# 切换到 master
git checkout master
# 合并 release-2.0.0
git merge --no-ff release-2.0.0
# 标记版本号
git tag -a 2.0.0
# 切换到 develop
git checkout develop
# 合并
git merge --no-ff release-2.0.0
# 删除 release-2.0.0
git branch -d release-2.0.0
```

### hotfix 修复 bug 分支

![hotfix](https://ypyun.ywhoo.cn/assets/20210517155558.png)

从 master、release 中检出，必须合并回 master、release，如果没有 release，就直接合并回 develop。

如果在生产环境发现重大 bug，需要立即解决，可以创建 hotfix-2.0.1 分支，然后开始解决问题：

```shell
# 检出 hotfix-2.0.1
git checkout -b hotfix-2.0.1 master
```

完成修复后合并分支：

```shell
# 合并 master
git checkout master
git merge --no-ff hotfix-2.0.1
git tag -a 2.0.1
# 合并 develop
git checkout develop
git merge --no-ff hotfix-2.0.1
# 删除 hotfix-2.0.1
git branch -d hotfix-2.0.1
```

## git-flow 使用

上一小节已经介绍并示范了如何使用 git-flow，发现操作过程还是有些繁琐的，其实业内存在一个库 [gitflow](https://github.com/nvie/gitflow/)，它是 git-flow 模型的具体实践。

在它的 github README 中根据文档安装好 git-flow 和集成进 shell。- _查看 Installing git-flow & integration with your shell 小节_

安装好后执行 `git flow init -d` 初始化。

### 开发新功能

如要同步开发账单、订单等功能，先创建一个主功能分支，再创建副功能分支：

```shell
git flow feature start feature-1.0
git flow feature start feature-order
git flow feature start feature-bill
```

列出/开始/结束 feature 分支：

```shell
git flow feature
git flow feature start feature-1.0
git flow feature finish feature-1.0
```

开发完成后：

```shell
git flow feature finish feature-1.0
```

其它类型的分支类似。

## git-flow 在 CI/CD 中的应用

目标

## 参考

- [Git 分支管理策略](https://www.ruanyifeng.com/blog/2012/07/git.html)
- [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
- [gitflow](https://github.com/nvie/gitflow/)
