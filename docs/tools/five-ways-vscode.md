---
id: five-ways-vscode
title: 五种方法助你打造一个令自己惊艳的vscode
---

工欲善其事必先利其器，vscode作为我们常用的编辑器，只有将其整好看了，工作才能舒心，效率才能倍增。接下来我将介绍五种自定义 vscode 的方法，让它看起来像你的女神一样令人赏心悦目。

### 主题

强烈推荐 [cobalt2](https://marketplace.visualstudio.com/items?itemName=wesbos.theme-cobalt2)  主题，作者是名声大噪的 Wes Bos，该主题的主色调是蓝色和黄色，快尝试吧。

以下是该主题推荐的编辑器配置：

```json
// setting.json
{
  "workbench.colorTheme": "Cobalt2",
  // The Cursive font is operator Mono, it's $200 and you need to buy it to get the cursive
  "editor.fontFamily": "Operator Mono, Menlo, Monaco, 'Courier New', monospace",
  "editor.fontSize": 17,
  "editor.lineHeight": 25,
  "editor.letterSpacing": 0.5,
  "files.trimTrailingWhitespace": true,
  "editor.fontWeight": "400",
  "prettier.eslintIntegration": true,
  "editor.cursorStyle": "line",
  "editor.cursorWidth": 5,
  "editor.cursorBlinking": "solid",
  "editor.renderWhitespace": "all",
}
```

配置完我的编辑器是这样的：

![my](https://ypyun.ywhoo.cn/assets/20210212192201.png)

### 字体

推荐使用 [Fira Code](https://github.com/tonsky/FiraCode)，它是等宽字体，被誉为最适合程序员用的字体，谁用谁知道。

点击上面链接，找到图中按钮下载 Fira Code 字体包：

![download](https://ypyun.ywhoo.cn/assets/20210212193254.png)

加压后，进入 TTF 文件夹，选中所有文件，然后右键打开，选择安装字体。

然后打开 `setting.json`，加入如下配置：

```json
{
     "editor.fontFamily": "Fira Code",
     "editor.fontLigatures": true
}
```

配置成功后可以看到如下效果：

![fira code 效果图](https://ypyun.ywhoo.cn/assets/20210212193106.png)

### 插件

以下列出了我常用的 vscode 插件，大家可以按需安装。

* Auto Close Tag
* Auto Import
* Auto Rename Tag
* Bookmarks
* Color Picker
* CSS Peek
* Debug Visualizer
* Docker
* Document This
* Git Blame
* Git History
* Git Project Manager
* GitLens
* LeetCode
* Markdown Preview Enhanced
* MDX
* Node.js Modules Intellisense
* npm
* npm Intellisense
* Path Intellinsense
* Prettier
* Project Manager
* Settings Sync
* TODO Highlight
* Typescript Hero
* VSCode Advanced New File

### vscode 基本配置

点击左下角的小齿轮，或者快捷键 `cmd + ,`，可以打开 vscode 的配置界面。

vscode 是使用 electron 进行构建的，所以对它的配置修改都可以实时地看到效果，我非常喜欢。

**去掉忽略文件**

vscode 默认会隐藏 `.git` 文件，我想完整地看到当前项目的所有文件，所以我把 `exclude` 配置项都清空了。

**自定义title**

搜索 `title`，将配置项改成 `${dirty} ${activeEditorMedium}${separator}${rootName}`，可以查看当前打开文件的项目及目录信息，以及文件保存状态。

![title](https://ypyun.ywhoo.cn/assets/20210212200218.png)

### 自定义快捷键

`VSCode Advanced New File` 插件用于快速地创建一个新文件，不必使用鼠标点击在哪个文件夹下创建，vscode 创建新文件默认的快捷键是 `cmd + N`，而该插件的快捷键是 `cmd + ctrl + N`，我想将两个快捷键反过来，接下来介绍如何自定义快捷键。

键入 `cmd + K + S` 进入快捷键配置界面，搜索 `new file`，点击某一项的编辑按钮即可编辑，以下是自定义后的快捷键：

![keybind](https://ypyun.ywhoo.cn/assets/20210212201333.png)

### 最后

当完成了这些配置后，当我们换一台电脑时，不会还得重新配置吧？放心，`Settings Sync` 插件可以帮助我们同步现有的 vscode 配置。

首先确保你已经安装了它，键入 `cmd + shift + P`打开控制面板，找到 `Sync: Update/Upload Settings`，回车后就将我们的配置上传了（当然你需要先进行配置，这里就不演示了）。

![sync](https://ypyun.ywhoo.cn/assets/20210212203113.png)

在新的电脑想同步该配置，同样安装该插件，然后选择 `Sync: Download Settings`，等待同步完成就可以啦。