---
id: data-structure
title: 数据结构
---

## 栈

### 栈的特性与使用

特性：先进后出，后进先出，示例代码：

```javascript
const array = [];

array.push('a'); // 压栈 a
array.push('b'); // 压栈 b
// array[array.length - 1] 拿到栈顶元素 b
array.pop(); // 出栈 b
array.pop(); // 出栈 b
```

### 判断字符串括号是否合法

输入："()"

输出：true

解释：()，()()，(())是合法的。)(，()(，(()是非法的。

请你实现一个函数，来判断给定的字符串是否合法：

```javascript
function isValid(s) {}
```

四部分析法：

1. 模拟：模拟题目的运行。
2. 规律：尝试总结题目的一般规律和特点。
3. 匹配：找到符合这些特点的数据结构和算法。
4. 边界：考虑特殊情况。

常规解法：

> 使用栈，遇到左括号进栈，遇到右括号出栈，最后栈为空时，为合法字符串。

实现：

```javascript
// 时间复杂度 O(n), 空间复杂度 O(n)
function isValid(s) {
  if (!s) return true;
  if (s % 2 === 1) return false;

  const stack = [];
  let point = 0;

  while (point < s.length) {
    if (s[point] === '(') {
      stack.push(s[point]);
    } else {
      if (stack.length === 0) {
        return false;
      }

      stack.pop();
    }

    point++;
  }

  return stack.length === 0;
}

console.log(isValid('()(())')); // true
```

##### 深度扩展

栈中元素都相同时，实际上没有必要使用栈，只需要记录栈中元素个数。

```javascript
// 时间复杂度 O(n)，空间复杂度O(1)
function isValid(s) {
  if (!s) return true;
  if (s % 2 === 1) return false;

  let count = 0;
  let point = 0;

  while (point < s.length) {
    if (s[point] === '(') {
      count++;
    } else {
      if (count === -1) {
        return false;
      }

      count--;
    }

    point++;
  }

  return count === 0;
}

console.log(isValid('()(())')); // true
```

小结：

配对&消除类的题目，使用栈实现，如果栈中的内容一样，可以使用计数器优化。

##### 广度扩展

存在不同类型的字符，如 '(', '[', '{'。

```javascript
// 时间复杂度 O(n)，空间复杂度O(n)
function isValid(s) {
  if (!s) return true;

  const validArray = ['(', '[', '{'];

  let stack = [];
  let i = 0;

  // 第一个就不是左括号
  if (!validArray.includes(s[i])) return false;

  while (i < s.length) {
    if (validArray.includes(s[i])) {
      stack.push(s[i]);
    } else {
      stack.pop();
    }

    i++;
  }

  return stack.length === 0;
}

console.log(isValid('{[(]]}'));
```

### 单调栈

单调栈就是指栈中的元素必须是按照升序排列的栈，或者是降序排列的栈。对于这两种排序方式的栈，还给它们各自取了小名。

- 递增栈
  - 消除 - 小数消除大数
  - 栈中元素递增
- 递减栈
  - 消除 - 大数消除小数
  - 栈中元素递减

### 找出数组中右边比我小的元素

```javascript
使用单调递增栈
当前值和栈顶的值比较
  比栈顶大，入栈
  比栈顶小，当前下标即为栈顶元素的右边最小的元素下标，栈顶出栈，当前下标入栈
最后将剩余的栈元素状态置为 -1

时间复杂度为 O(N)，而空间复杂度为 O(N)

const findSmallSeq = (nums) => {
  const res = [];
  const stack = [];

  const isEmpty = () => stack.length === 0;
  const peek = () => stack[stack.length - 1];

  for (let i = 0; i < nums.length; i++) {
    const cur = nums[i];

    while (!isEmpty() && nums[peek()] > cur) {
      // 栈顶的值比当前值大，记录下标，出栈
      res[peek()] = i;

      stack.pop();
    }

    stack.push(i);
  }

  while (!isEmpty()) {
    res[peek()] = -1;

    stack.pop();
  }

  return res;
};

// console.log(findSmallSeq([5, 2])); // [1, -1]
console.log(findSmallSeq([1, 2, 4, 9, 4, 0, 5])); // [5, 5, 5, 4, 5, -1, -1]
```

### 字典序最小的 k 个数的子序列

时间复杂度为 O(N)，而空间复杂度为 O(N)

```javascript
const findSmallSep = (nums, k) => {
  const res = [];
  const stack = [];

  const size = () => stack.length;
  const peek = () => stack[size() - 1];
  const isEmpty = () => size() === 0;

  for (let i = 0; i < nums.length; i++) {
    // 栈不为空 && 栈顶元素大于当前值 && (栈长度 + 剩余未遍历的数量) > k
    while (!isEmpty() && nums[i] < peek() && size() + (nums.length - i) > k) {
      stack.pop();
    }

    stack.push(nums[i]);
  }

  while (size() > k) {
    stack.pop();
  }

  for (let i = k - 1; i >= 0; i--) {
    res[i] = peek();
    stack.pop();
  }

  return res;
};

// [1, 2, 0]
console.log(findSmallSep([9, 2, 4, 5, 1, 2, 3, 0], 3));
```

### 数组-84-柱状图中最大的矩形

思路：

- 单调栈（递增） + 哨兵
- 看到元素的高度严格小于栈顶的高度时，出栈，计算面积，否则入栈

```javascript
var largestRectangleArea = function (heights) {
  let len = heights.length;

  if (len === 0) return 0;
  if (len === 1) return heights[0];

  // 前后加入哨兵，可以保证栈不为空
  const newHeight = [0, ...heights, 0];
  len = newHeight.length;

  let area = 0;

  const peek = () => stack[stack.length - 1];
  const stack = [0];

  // 遍历数组，下标从 1 开始
  for (let i = 1; i < len; i++) {
    const curHeight = newHeight[i];

    // 当前元素 < 栈顶元素 -> 出栈 -> 确认面积
    while (curHeight < newHeight[peek()]) {
      // 先出栈
      const topIndex = stack.pop();
      // 最后栈顶元素为哨兵元素，下标为0，即元素最左可以到达0，最右边是当前遍历到的最后一个元素下标
      const width = i - peek() - 1;
      area = Math.max(area, width * newHeight[topIndex]);
    }

    stack.push(i);
  }

  return area;
};

const result = largestRectangleArea([2, 1, 2]);
// const result = largestRectangleArea([2, 1, 5, 6, 2, 3]);
// const result = largestRectangleArea([1, 1]);
console.log(result, 'res');
```

#### 小结

- 较小的数消除掉较大的数的时候，使用递增栈。
- 要注意控制剩下的元素的个数。

![总结](https://ypyun.ywhoo.cn/assets/20210606112852.png)
