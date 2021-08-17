---
title: css
---

## css 居中

让元素水平垂直居中：

```html
<div class="parent">
  <div class="child">hello world</div>
</div>
```

```css title="方法1：flex"
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

```css title="方法2：grid"
.parent {
  display: grid;
  place-items: center;
}
```

```css title="方法3：flex + marign auto"
.parent {
  display: grid;
  place-items: center;
}
```

```css title="方法4：绝对定位"
.parent {
  position: relative;
}

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

```css title="方法5：table"
.parent {
  display: table;
}

.child {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
```
