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

#### release 预发布分支

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

#### hotfix 修复 bug 分支

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

安装好后执行 `git flow init [-d]` 初始化，然后将刚创建的本地分支都推送到远程 `git push origin --all`。

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

下图是我的 git 分支工作流和 jenkins 多分支流水线的流程图：

![flow](https://ypyun.ywhoo.cn/assets/20210518155234.png)

假设接下来要开发版本为 v1.0.2，功能包含订单和财务模块，当前默认的分支只有 develop 和 master，首先创建 `feature-order` 和 `feature-finance`:

```shell
git flow feature start feature-order
git flow feature start feature-finance

# 推送到相应的 feature 分支
git flow feature publish feature-order
# 拉取相应的 feature 分支
git flow feature pull feature-order
```

当订单先开发完成，想先部署到测试环境给到测试人员，需执行以下步骤：

```shell
# 完成订单功能开发，自动合并到 develop 并删除 feature-order
git flow feature finish feature-order
# develop 中的订单功能准备就绪，检出预发布分支，推送时会触发 jenkins 的构建任务，自动部署到测试环境
git flow release start release-1.0.2.0-order
```

在测试的过程中，需要修复问题，可以直接在 release-1.0.2.0-order 上修改，修改后提交会自动触发构建任务。当测试完没有问题时，这时候就需要部署到线上了，执行以下步骤：

```shell
# 合并到 master，删除 release-1.0.2.0-order
git flow release finish release-1.0.2.0-order
```

部署到线上环境后，遇到需要紧急修复的 bug 时，在 master 上检出 hotfix 分支，用于修复 bug：

```shell
# 检出 hotfix-order
git flow hotfix start hotfix-order
# 合并到 master
git flow hotfix finish hotfix-order
```

如需要在线上版本增加新的小改动，需要用到 support 分支[还处于试验阶段，暂时不使用]：

```shell
# 检出 support-story
git flow support start support-story
# 合并到 master
git flow support finish support-story
```

到这里订单功能开发到线上可能涉及到的流程已经介绍完了，财务功能同上，至于 jenkins 如何配置就不在这里展开了，大致的思路就是配置多分支流水线，只匹配 `release-*,master` 的分支，Jenkinsfile 中对 replease-\* 分支走部署至测试环境的流水线，master 走部署至线上环境的流水线，当然需要支持参数化配置部署，及可选择部署到测试或是线上，如果不清楚如何搭建 jenkins 和配置多分支流水线，可以参考我之前写的一片文章[《使用 Jenkins 构建 CI/CD 之多分支流水线指北（实战）》](https://juejin.cn/post/6883769774564884488)。

## 总结

git-flow 的分支管理策略很好地解决了我目前关于分支管理混乱的问题，极大地提升了团队协作的效率，相应地对 CI/CD 流程作了一定的优化，希望能对大家有所启发。

## 参考

- [The gitflow workflow - in less than 5 mins.](https://www.youtube.com/watch?v=1SXpE08hvGs)
- [Git Flow Like a Pro!](https://www.youtube.com/watch?v=BYrt6luynCI)
- [Git 分支管理策略](https://www.ruanyifeng.com/blog/2012/07/git.html)
- [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
- [gitflow](https://github.com/nvie/gitflow/)
- [Manage Development and Delivery Workflow with JGit-Flow and Jenkins-Pipeline](https://www.fyber.com/engineering/manage-development-and-delivery-workflow-with-jgit-flow-and-jenkins-pipeline-part-i/)
