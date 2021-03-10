---
id: base
title: 实践经验
---

* 添加注释，会给更智能的提示

![注释](https://ypyun.ywhoo.cn/assets/20210304102550.png)

```typescript {3}
export interface ITaskGroupDetail {
  /** 1 文字排版 2 图文排版 */
  type: 1 | 2;
}
```

* 使用 interface 某个成员的类型

```typescript
interface ITaskGroupDetail {
  type: 1 | 2;
}
// highlight-start
interface ITest {
  type: type: ITaskGroupDetail['type']
}
// highlight-end
```
