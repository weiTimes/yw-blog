---
id: react-optim
title: React 性能优化
---

### 当父组件状态更新时，默认情况下子组件也会重新渲染。在类组件中，会调用 render 函数，在函数式组件中，会重新执行该函数，为避免不必要的重新渲染，类组件和函数式组件可以作以下优化：

#### 类组件使用 PureComponent

`PureComponent` 以浅比较 props 和 state 的方式实现了 `shouldComponentUpdate` 函数。

```javascript title="类组件"
import { PureComponent } from 'react';

class Clock extends PureComponent {}
```

#### 函数式组件使用 React.memo

React.memo 为高阶组件。

使用 React.memo 包裹的函数式组件，如果 props 未发生变化，React 将会跳过渲染组件的操作直接复用最近一次渲染的结果。

```javascript title="函数式组件"
import React from 'react';

const Clock = () => {};

export default React.memo(Clock);
```
