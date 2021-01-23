---
slug: storybook
title: 我是如何在 Nextjs 项目中使用Storybook驱动组件开发的？
author: 叶威
author_title: 前端攻城狮
author_url: https://github.com/weiTimes
author_image_url: https://avatars2.githubusercontent.com/u/21688593?s=460&u=09db1866a0350eb8c4dd0389b22a596d2b081b4b&v=4
tags: [React, storybook]
description: 
---

在使用 `React`开发组件时经常会有一些苦恼，比如当一个组件的复杂度逐步上升时，它所拥有的状态不容易追溯；当需要查看某种状态的组件时，可能需要手动更改组件的属性或是更改接口返回的数据（数据驱动的组件）等等。于是我就去了解并学习 `Storybook`，然后组织了一次分享会，这也是我们团队的第一次技术分享。

关于 `Storybook`，我在一两年前有接触并尝试使用，当时对组件化开发的理解可能有限，只是为了用而用，并未感受到它的实用之处；加上经过多次的迭代，`Storybook`已经到了 6.0 版本，可以说是更易用、更优雅了。

![image-20210112094407173](https://raw.githubusercontent.com/weiTimes/PicGo/main/image-20210112094407173.png)

上图是分享会 ppt 的封面，感兴趣的同学可以私信我，接下来进入正题。

## 动机

- 新项目的 UI 系统需要重新设计
- 项目迭代，组件复杂度逐步变高，组件状态不容易追溯
- 追求更优雅、更具维护性的编码方式

## 目标

这篇文章主要给大家分享一下几点：

* 介绍 Storybook
* 通过一个小例子展示如何在 `Next.js` 中使用 Storybook
* 我的代码编写习惯

<!--truncate-->

## 要求

因为包含了实践，可能有以下几点要求，不过不用担心，只要你能看懂就行：

* 示例是基于 `Next.js` 的，这个我在上一篇文章中有讲到如何搭建 `Next.js` 项目，[可以点击这里](https://github.com/weiTimes/nextapp-startup)把我搭建的脚手架克隆到本地，以便可以跟着动手。
* 因为是基于上一篇文章所搭建的脚手架，所以它所拥有的特性也需要了解，比如 `Typescript`、`styled-component`。

## 介绍 Storybook

storybook是一个开源工具，为React、Vue、Angular等框架提供一个沙箱环境，可独立地开发UI组件；它更有组织和高效地构建出令人惊叹的 UIs。



![](https://raw.githubusercontent.com/weiTimes/PicGo/main/63501763-88dbf600-c4cc-11e9-96cd-94adadc2fd72.png)



### 提供强大的 UIs

* 独立构建组件
  创建组件时不需要竖起屏幕，不需要处理数据，也不需要构建业务逻辑。
  ![](https://raw.githubusercontent.com/weiTimes/PicGo/main/build-canvas.png)

* 模拟难以达到的用例
  在一个应用中渲染关键状态是不容易的
  ![](https://raw.githubusercontent.com/weiTimes/PicGo/main/build-cases.png)

* 用例作为一个故事
  将用例保存为 Javascript 中的故事，以便在开发、测试和QA期间重新访问。
  ![](https://storybook.js.org/images/home/build-sidebar.png)

* 使用插件减少工作流程
  使用插件可以更快地构建UI，组件文档化，并简化工作流程。

![](https://raw.githubusercontent.com/weiTimes/PicGo/main/build-addons.png)

### 组件更具可靠性

* 确保一致的用户体验
  每当写一个故事，就得到一种状态的视觉效果。快速地浏览故事，检查最贱 UI 的正确性。
  ![](https://raw.githubusercontent.com/weiTimes/PicGo/main/test-visual-20210112102804789.png)

* 自动回归测试代码
  使用官方插件 Storyshots 启动代码快照。
  ![](https://raw.githubusercontent.com/weiTimes/PicGo/main/test-snapshot.png)

* 单元测试组件
  对组件进行单元测试确保组件能正常工作。
  ![](https://raw.githubusercontent.com/weiTimes/PicGo/main/test-unit.png)

* 基于每次提交像素级地捕获UI变化
  用视觉测试工具查明UI的变化。
  ![](https://raw.githubusercontent.com/weiTimes/PicGo/main/test-visual-regression.png)

### 分享和重用所有东西

* 在项目中查找任何组件
  Storybook 可搜索编写的任何组件，为你的UI组件提供真实信息的单一来源。
  ![](https://raw.githubusercontent.com/weiTimes/PicGo/main/share-search.png)

* 开发过程中获得及时反馈
  通过 Storybook 部署到云端，与团队协作实现UI。
  ![](https://storybook.js.org/images/home/share-collaborate.png)

* 跨端跨应用共享组件
  每个故事都是一个用例，团队成员可以找到它并决定是否重用。
  ![](https://storybook.js.org/images/home/share-reuse.png)

* 生成文档
  编写 markdown/MDX，为组件库和设计系统生成可定制化的文档。
  ![](https://raw.githubusercontent.com/weiTimes/PicGo/main/share-document.png)

## 使用 Storybook

下面我会通过一个示例想大家展示 Storybook 是如何工作的，期间也能看到我是如何使用结合 Typescript、styled-components以及我的编码习惯。



### 安装

假设你已经克隆了[这个仓库](https://github.com/weiTimes/nextapp-startup)，首先在项目中安装 `storybook`：

```shell
# 安装 storybook
yarn add storybook
# 初始化 storybook 项目，会根据项目类型自动地进行配置
npx sb init
# 启动 storybook 服务
yarn storybook
```

以上几部没问题之后，现在就可以在 http://localhost:6006/ 访问 Storybook 提供的 UIs 了：

![image-20210112104704363](https://raw.githubusercontent.com/weiTimes/PicGo/main/image-20210112104704363.png)

它默认提供了几个例子，如 `Button`、`Header`等，例子代码在 `src/pages/stories` 中：

![image-20210112104917297](https://raw.githubusercontent.com/weiTimes/PicGo/main/image-20210112104917297.png)

后缀名为 `stories.tsx` 的文件就是一个故事，它定义了我们想要定义的组件的表现状态；大家可能不是很理解一个故事是什么，后面大家看了示例之后就会理解了，我先打个比方，一个人就好比一个故事，当他有不同的心情时，就会表现出不同的表情，同一时间只能看到它的一种表情，但我现在用照片记录他所表现的一个个不同的表情，这有利于我去分析这个人的性格；Storybook 就像是照相机，可以记录组件的不同状态，便于我们去追溯。

### 设计 `ProductOptimCard` 组件

接下来设计并实现 `ProductOptimCard` 组件，这个组件是数据驱动的，也就是内容是根据数据的变化而变化的，为了方便，我只定义了标题、是否必做、是否完成这三个属性，它们的变化会展示不同状态下的视图，默认的效果如下：

![image-20210112110100542](https://raw.githubusercontent.com/weiTimes/PicGo/main/image-20210112110100542.png)

以下是组件实现代码：

```tsx
// src/components/towone/ProductOptim/ProductOptimCard/index.tsx
import React from 'react';
import styled from 'styled-components';

interface IProductOptimCardProps {
  data: {
    isMustDo: boolean;
    isFinish: boolean;
    title: string;
  };
}

const Container = styled.div`
  width: 452px;
  height: 276px;
  background: #fefeff;
  border: 1px solid #edf0fa;
  box-shadow: 0px 4px 14px 0px rgba(0, 10, 71, 0.07);
`;
const Content = styled.div`
  height: 225px;
  background: #fff;
  padding-top: 21px;
  padding-left: 20px;
  position: relative;
`;
const Footer = styled.div`
  height: 50px;
  background: #f7f8fa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 10px;
  padding-left: 20px;
`;
const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 14px;
`;
const Badge = styled.div<{ isMustDo: boolean }>`
  width: 37px;
  height: 21px;
  background: ${({ isMustDo }) => (isMustDo ? '#0af' : '#999999')};
  font-weight: bold;
  color: #fefeff;
  font-size: 12px;
  border-radius: 11px 2px 11px 11px;
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Text = styled.div`
  font-size: 14px;
  color: #666666;
  margin-bottom: 14px;
`;
const MoreText = styled.a`
  font-size: 14px;
  color: #333333;
`;
const FinishButton = styled.div<{ isFinish: boolean }>`
  width: 60px;
  height: 28px;
  background: ${({ isFinish }) => (isFinish ? '#999' : '#046eff')};
  color: #fefeff;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ProductOptimCard: React.FC<IProductOptimCardProps> = ({ data }) => {
  const { isMustDo, isFinish, title } = data;

  return (
    <Container>
      <Content>
        <Title>{title}</Title>
        <Text>1、尺寸：800 x 800px</Text>
        <Text>2、卖点提炼文字展示（针对同款多、标品类目）</Text>
        <Text>3、产品占图片三分之二</Text>
        <Text>4、参考五家淘宝以及阿里优秀类似款主图（按成交金额排序）</Text>
        <Badge isMustDo={isMustDo}>必做</Badge>
      </Content>
      <Footer>
        <MoreText>更多教程</MoreText>
        <FinishButton isFinish={isFinish}>完成了</FinishButton>
      </Footer>
    </Container>
  );
};

export default ProductOptimCard;
```

然后在首页引入它：

```tsx
// src/pages/index.tsx

//...

export default function Home() {
  return (
    <Conotainer>
       <ProductOptimCard
          data={{ isMustDo: false, isFinish: false, title: '单品标题优化' }}
        />
    </Conotainer>
  );
}
```

执行 `yarn dev` 启动项目，然后打开 http://localhost:3000/ 查看：

![image-20210112110624993](https://raw.githubusercontent.com/weiTimes/PicGo/main/image-20210112110624993.png)

图中红框中的组件就是 `ProductOptimCard` 的默认样式，组件本身已经实现了不同状态：如必做、不必做、已完成、未完成；但我想查看某个状态，将不得不更改 `src/pages/index.tsx` 中传给 `ProductOptimCard` 的 `data` 属性，而这个通常是根据接口返回的数据，要去该代码就显得麻烦不优雅了，不过不用担心，我们现在有 `Storybook了`，请往下看。

在同级目录新建一个 `ProductOptimCard.stories.tsx` 文件，为 `ProductOptimCard` 编写故事，代码如下：

```tsx
import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import ProductOptimCard from './';

export default {
  title: 'TWOONE/ProductOptim/ProductOptimCard',
  component: ProductOptimCard,
} as Meta;

const Template: Story<ComponentProps<typeof ProductOptimCard>> = (args) => (
  <ProductOptimCard {...args} />
);

export const DefaultCard = Template.bind({});
DefaultCard.args = {
  data: {
    isMustDo: false,
    isFinish: false,
    title: '单品标题优化',
  },
};

export const MustDoCard = Template.bind({});
MustDoCard.args = {
  data: {
    isMustDo: true,
    isFinish: false,
    title: '单品标题优化',
  },
};

export const FinishCard = Template.bind({});
FinishCard.args = {
  data: {
    isMustDo: false,
    isFinish: true,
    title: '单品标题优化',
  },
};

export const UnFinishCard = Template.bind({});
UnFinishCard.args = {
  data: {
    isMustDo: false,
    isFinish: false,
    title: '单品标题优化',
  },
};
```

我们引入了 `ProductOptimCard`，并为其编写了四种状态，分别是 `DefaultCard`、`MustDoCard`、`FinishCard`、`UnFinishCard`，传入不同的`data`，自然会表现出不同的状态。然后打开 http://localhost:6006/：

![image-20210112111538746](https://raw.githubusercontent.com/weiTimes/PicGo/main/image-20210112111538746.png)

红框是我们为 `ProductOptimCard` 编写的故事，点击不同状态以查看 UI 效果：

![e52aa33d-5cfb-4be7-a703-5aa22e07d80c](https://raw.githubusercontent.com/weiTimes/PicGo/main/e52aa33d-5cfb-4be7-a703-5aa22e07d80c.gif)

可以看到，我们很容易就知道并查看这个组件的不同状态，是不是有点跃跃欲试了呢，点击 `Docs` 可查看文档，其它操作就大家课后自己尝试：

![image-20210112112953810](https://raw.githubusercontent.com/weiTimes/PicGo/main/image-20210112112953810.png)

> 项目中如有使用 alias 为文件夹设置别名，导入形式是这样 `import { Box } from '@/styles/common';`，这通常是在我们的 `tsconfig.json` 中已经配置了，但是 storybook 不认识，也需要配置一下，它支持我们自定义 webpack 配置，打开 `.storybook/main.js`，添加如下代码：

```javascript
// .storybook/main.js
const path = require('path');

module.exports = {
  // ...
  webpackFinal: async (config, { configType }) => {
    config.resolve.alias['@'] = path.resolve(__dirname, '../src');
    
    return config;
  },
};
```

到这里我们已经通过一个示例来了解如何使用 Storybook 了，接下来会简单聊聊我的一些编码心得。

### 我的编码习惯与心得

#### 分类

从数据获取的层面看，我将组件分为容器组件和内容组件：

**容器组件：**从接口获取数据。

**内容组件：**接收 props 数据、可编写 story 组件驱动开发。

#### story组件编写的大致顺序

* Typescript 定义组件接收的参数
* 为可选的类型设置默认值
* 编写 story 描述不同状态的组件

#### 组件编写顺序

通常一个组件引入的三方库在最顶部，其次是自定义组件，所以我这里的顺序值得是组件中变量定义的位置，以下是我所习惯的定义顺序（从上往下），每个区域隔一行：

* 三方库

* 自定义组件

* 图片常量

* Typescript 接口

* 样式组件

* 组件区

一个最小化的示例代码：

```tsx
import React from 'react';
import styled from 'styled-components';

import { MySelfComp } from '@/components';

import ICON_LOGO from '@/assets/images/icon.logo.png';

interface IProps {}

const Container = styled.div``;

const DemoComp: React.FC<IProps> = () => {
  return <Container></Container>
}

export default DemoComp;
```

## 总结

目前带大家认识了 Storybook，并且介绍了如何使用，当然这只是基础用法，在项目中大家可能也会遇到不同的场景，如遇到问题可以查看官方文档，还是写的挺详细的；本来想将测试流程也写进去，不过感觉会有不小的篇幅，以后可以另起一篇文章，我可以先简单介绍一个我觉得比较理想的组件开发流程：组件设计并编写 -> 编写 story -> Jest 测试 -> Enzyme 测试，对于后面两个测试库，确实进一步地提升了组件的健壮性，但是会增加很多的工作量，一般的小公司确实用不着，感兴趣的可以课下自行研究。

## 附录

[Storybook 6.0](https://medium.com/storybookjs/storybook-6-0-1e14a2071000)

[examples](https://storybook.js.org/docs/react/get-started/examples)

[Marketing and docs](https://master--5be26744d2f6250024a9117d.chromatic.com/)

[BBC Psammead](https://bbc.github.io/psammead/?path=/story/components-brand--without-brand-link)👏

[GitLab UI](https://gitlab-org.gitlab.io/gitlab-ui)👏