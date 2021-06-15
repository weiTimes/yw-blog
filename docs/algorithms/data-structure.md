---
id: data-structure
title: 数据结构
---

## 栈：从简单栈到单调栈，解决经典栈问题

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

#### 判断字符串括号是否合法

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

#### 找出数组中右边比我小的元素

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

#### 字典序最小的 k 个数的子序列

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

#### 数组-84-柱状图中最大的矩形

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

### 小结

- 较小的数消除掉较大的数的时候，使用递增栈。
- 要注意控制剩下的元素的个数。

![总结](https://ypyun.ywhoo.cn/assets/20210606112852.png)

## FIFO 队列与单调队列的深挖与扩展

### 二叉树的层次遍历

#### 题目：[102. 二叉树的层序遍历](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)

![队列](https://ypyun.ywhoo.cn/assets/20210610091747.png)

思路：使用一个队列存放每一层的节点，每次遍历前先获取队列的长度，在遍历时用一个数组存放当层遍历的结果，如果有子节点，将其入队，遍历完后将数组存入结果数组，最后返回。

代码：

```javascript
var levelOrder = function (root) {
  if (!root) return [];

  const queue = [root];

  const size = () => queue.length;
  const isEmpty = () => size() === 0;

  const res = [];

  while (!isEmpty()) {
    const curArray = [];
    const length = size();

    for (let i = 0; i < length; i++) {
      const curNode = queue.shift();

      curArray.push(curNode.val);

      if (curNode.left) {
        queue.push(curNode.left);
      }

      if (curNode.right) {
        queue.push(curNode.right);
      }
    }

    res.push(curArray);
  }

  return res;
};
```

相关类似的题目：

- [637. 二叉树的平均值](https://leetcode-cn.com/problems/average-of-levels-in-binary-tree/)
- [429. N 叉树的层序遍历](https://leetcode-cn.com/problems/n-ary-tree-level-order-traversal/)
- [1302. 层数最深叶子节点的和](https://leetcode-cn.com/problems/deepest-leaves-sum/)
- [662. 二叉树最大宽度](https://leetcode-cn.com/problems/maximum-width-of-binary-tree/description/)
- [103. 二叉树的锯齿形层次遍历](https://leetcode-cn.com/problems/binary-tree-zigzag-level-order-traversal/description/)
- [107. 二叉树的层序遍历 II](https://leetcode-cn.com/problems/binary-tree-level-order-traversal-ii/description/)
- [559. N 叉树的最大深度](https://leetcode-cn.com/problems/maximum-depth-of-n-ary-tree/description/)
- [117. 填充每个节点的下一个右侧节点指针 II](https://leetcode-cn.com/problems/populating-next-right-pointers-in-each-node-ii/)

### 循环队列

循环队列的重点在于循环使用固定空间，难点在于控制好 front/rear 两个首尾指示器。

#### 方法一:

使用 front, rear, useed 来控制循环队列的使用。

![循环队列](https://ypyun.ywhoo.cn/assets/20210613160926.png)

计算前后索引：

- index = i 的后一个 (i + 1) % capacity;
- index = i 的前一个(i - 1 + capacity) % capacity。

**注意：所有的循环数组下标的处理都需要按照这个取模方法来。**

实现代码：

> [622. 设计循环队列](https://leetcode-cn.com/problems/design-circular-queue/)

```javascript
var MyCircularQueue = function (k) {
  this.queue = new Array(k);
  this.capacity = k;
  this.front = 0;
  this.rear = 0; // 可加入队列的位置
  this.used = 0;
};

/**
 * @param {number} value
 * @return {boolean}
 */
MyCircularQueue.prototype.enQueue = function (value) {
  if (this.isFull()) return false;

  this.queue[this.rear] = value;

  this.rear = (this.rear + 1) % this.capacity;
  this.used = this.used + 1;

  return true;
};

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.deQueue = function () {
  if (this.isEmpty()) return false;

  // 出队列
  const ret = this.queue[0];
  this.front = (this.front + 1) % this.capacity;
  this.used = this.used - 1;

  return true;
};

/**
 * @return {number}
 */
MyCircularQueue.prototype.Front = function () {
  if (this.isEmpty()) return -1;

  return this.queue[this.front];
};

/**
 * @return {number}
 */
MyCircularQueue.prototype.Rear = function () {
  if (this.isEmpty()) return -1;

  const tail = (this.rear - 1 + this.capacity) % this.capacity;

  return this.queue[tail];
};

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.isEmpty = function () {
  return this.used === 0;
};

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.isFull = function () {
  return this.used === this.capacity;
};
```

**复杂度分析：**入队操作与出队操作都是 O(1)。

![循环队列总结](https://ypyun.ywhoo.cn/assets/20210613162538.png)

#### 方法二：

- 在申请数组空间的时候，申请 k + 1 个空间；
- 在放满循环队列的时候，必须要保证 rear 与 front 之间有空隙。

![循环队列-方法二](https://ypyun.ywhoo.cn/assets/20210613163015.png)

实现代码：

```javascript
var MyCircularQueue = function (k) {
  this.capacity = k + 1;
  this.queue = new Array(this.capacity);
  this.front = 0;
  this.rear = 0;
};

/**
 * @param {number} value
 * @return {boolean}
 */
MyCircularQueue.prototype.enQueue = function (value) {
  if (this.isFull()) return false;

  this.queue[this.rear] = value;

  this.rear = (this.rear + 1) % this.capacity;

  return true;
};

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.deQueue = function () {
  if (this.isEmpty()) return false;

  this.front = (this.front + 1) % this.capacity;

  return true;
};

/**
 * @return {number}
 */
MyCircularQueue.prototype.Front = function () {
  if (this.isEmpty()) return -1;

  return this.queue[this.front];
};

/**
 * @return {number}
 */
MyCircularQueue.prototype.Rear = function () {
  if (this.isEmpty()) return -1;

  const tail = (this.rear - 1 + this.capacity) % this.capacity;

  return this.queue[tail];
};

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.isEmpty = function () {
  return this.front === this.rear;
};

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.isFull = function () {
  return (this.rear + 1) % this.capacity === this.front;
};
```

### 单调队列

单调队列属于双端队列的一种。双端队列与 FIFO 队列的区别在于：

- FIFO 队列只能从尾部添加元素，首部弹出元素；
- 双端队列可以从首尾两端 push/pop 元素。

#### 滑动窗口的最大值

使用单调递减队列。

```javascript
var maxSlidingWindow = function (nums, k) {
  if (!nums) return [];
  if (nums.length === 1) return [nums[0]];

  var deque = [];
  var result = [];

  function getDequeLastIndex() {
    return deque[deque.length - 1];
  }

  for (var i = 0; i < nums.length; i++) {
    // 单调队列，这里利用单调递减队里
    // 如果队尾小于等于当前的值，则弹出队尾
    while (deque.length > 0 && nums[i] >= nums[getDequeLastIndex()]) {
      deque.pop();
    }

    // 推入当前索引
    deque.push(i);

    // 队首不在当前滑动窗口内，弹出队首
    if (deque[0] <= i - k) {
      deque.shift();
    }

    // 达到滑动窗口的最小数量，也就是形成了滑动窗口，、每遍历一项，就将队首放入结果数组，即放入队列的最大值。
    if (i + 1 >= k) {
      result.push(nums[deque[0]]);
    }
  }

  return result;
};
```

**时间复杂度：**O(n)。

总结：

- 范围内的最大值，用单调递减队列
- 范围内的最小值，用单调递增队列

#### 捡金币游戏

> [1696. 跳跃游戏 VI](https://leetcode-cn.com/problems/jump-game-vi/)

实现：

```javascript
var maxResult = function (nums, k) {
  const len = nums.length;
  if (!nums || len === 0 || k <= 0) return 0;

  // 存放每个位置可以手机到的金币数
  const coins = [nums[0]];
  // 长度为 k 的滑动窗口，存放索引
  const queue = [0];

  const isEmpty = () => queue.length === 0;
  const peek = () => queue[0];
  const peekLast = () => queue[queue.length - 1];

  for (let i = 1; i < len; i++) {
    // 队首索引对应的值（最大） + 当前遍历的值
    coins[i] = coins[peek()] + nums[i];

    // 单调递减队列，如果队尾的值不大于当前值，就移出队列，只要移出队列 queue 的就行，即移出索引。
    while (!isEmpty() && coins[peekLast()] <= coins[i]) {
      queue.pop();
    }

    // 当队首的索引不在窗口内，就移出，给后面推入的索引留出空间
    // 如当前索引为 2, k = 2, 如果队首元素为 0，就将其移出队首
    while (!isEmpty() && peek() <= i - k) {
      queue.shift();
    }

    // 将当前索引推入队列
    queue.push(i);
  }

  return coins[len - 1];
};
```

## 优先级队列：堆与优先级队列，筛选最优元素

优先级队列都是基于堆（Heap）这种数据结构来实现的。

FIFO 队列每一层节点的先后顺序，遍历时就确定下来了。如果需要先进行排序，再决定优先级，就需要优先级队列。

### 堆的分类：大堆和小堆

根节点比左右子节点都大，称为大堆。

根节点比左右子节点都小，称为小堆。

堆的特点：大堆的根是最大值，小堆的根是最小值。

调整堆的时间复杂度是 O(lgn)，接下来介绍堆的表示方式、添加元素、移除元素（以大堆为例）。

### 堆的表示

使用数组表示：

- 数组的内存具有连续性，访问速度更快；
- 堆结构是一棵完全二叉树。

堆的规律特点（下标从 0 开始）：

- i 节点的父节点索引 parent = Math.floor((i - 1) / 2) || (i - 1) >> 1
- i 节点的左子节点 2 \* i + 1
- i 节点的右子节点 2 \* i + 2

![heap](https://ypyun.ywhoo.cn/assets/20210615150602.png)

### 堆的操作

![heap operate](https://ypyun.ywhoo.cn/assets/20210615150704.png)

初始化堆的大小：

```javascript
const heap = new Array(100); // 堆空间
const n = 0; // 堆中元素的个数
```

#### 下沉

引起下沉操作的原因：假设 a[i] 比它的子结点要小，那么除 a[i] 以外，其他子树都满足堆的性质。这个时候，就可以通过下沉操作，帮助 a[i] 找到正确的位置。

写下沉代码时，需要记住一个贪心原则：如果子结点大，那么子结点就要上移。

下沉的代码：

```javascript
class Heap {
  sink(i) {
    const temp = this.a[i];
    let j = 0; // 子节点的指针

    // 找到左子节点，并且在堆中元素长度范围内
    while ((j = (i << 1) + 1) < this.n) {
      // n - 1 为最后一个元素的索引，如果比它小，说明还有右节点
      // 有右节点，并且右节点大，将 j 指向右节点
      if (j < this.n - 1 && this.a[j] < this.a[j + 1]) {
        j = j + 1;
      }

      if (this.a[j] > temp) {
        this.a[i] = this.a[j];
        i = j;
      } else {
        break;
      }
    }

    this.a[i] = temp;
  }
}
```

**复杂度分析**：O(lgN)。

#### 上浮

上浮操作的条件：假设 a[i] 比它的父结点要大，并且除 a[i] 以外，其他子树都满足大堆的性质。

原则：如果父结点比“我”小，那么父结点就需要下移。

上浮代码：

```javascript
class Heap {
  swim(i) {
    const temp = this.a[i]; // 新 push 的元素
    let parent = 0;

    // 如果还存在父节点，下标从 0 开始，0 没有父节点
    while (i > 0) {
      parent = (i - 1) >> 1; // 父节点索引

      if (this.a[parent] < temp) {
        // 将父节点向下移动，更新 i 的位置
        this.a[i] = this.a[parent];
        i = parent;
      } else {
        break;
      }
    }

    this.a[i] = temp;
  }
}
```

**复杂度分析：**O(lgN)。

#### push 操作

1. 往堆的尾巴 a[n] 上添加新的元素。
2. 新来元素 a[n] 进行上浮操作。

实现代码：

```javascript
class Heap {
  push(val) {
    this.a[this.n] = val;

    this.swim(this.n);

    this.n++;
  }
}
```

**复杂度分析：**O(lgN)。

#### pop 操作

1. 取出 a[0] 的值作为返回值。
2. 将 a[n - 1] 存放至 a[0]。
3. 将 a[0] 进行下沉操作。

实现代码：

```javascript
class Heap {
  pop() {
    const ret = this.a[0];
    this.a[0] = this.a[this.n - 1];

    this.sink(0);

    this.n--;

    return ret;
  }
}
```

**复杂度分析：**O(lgN)。

#### 堆完整代码实现

```javascript
class Heap {
  n = 0; // 堆中元素的数量

  constructor(size) {
    this.a = new Array(size);
  }

  size() {
    return this.n;
  }

  /**
   * 向堆中加入元素
   * push是先把元素追加到数组尾巴上，然后再执行上浮操作
   * 假设 a[i] 比它的父结点要大，就进行上浮
   *
   * @param {*} val
   * @memberof Heap
   */
  push(val) {
    this.a[this.n] = val;

    this.swim(this.n);

    this.n++;
  }

  /**
   * 取出 a[0] 的值作为返回值
   * 将 a[n - 1] 存放至 a[0]
   * 将 a[0] 进行下沉操作
   *
   * @return {*}
   * @memberof Heap
   */
  pop() {
    const ret = this.a[0];
    this.a[0] = this.a[this.n - 1];

    this.sink(0);

    this.n--;

    return ret;
  }

  /**
   * 下沉
   * 假设 a[i] 比它的子结点要小，那么除 a[i] 以外，其他子树都满足堆的性质
   * 通过下沉操作，帮助 a[i] 找到正确的位置。
   *
   * @param {*} i
   * @memberof Heap
   */
  sink(i) {
    const temp = this.a[i];
    let j = 0; // 子节点的指针

    // 找到左子节点，并且在堆中元素长度范围内
    while ((j = (i << 1) + 1) < this.n) {
      // n - 1 为最后一个元素的索引，如果比它小，说明还有右节点
      // 有右节点，并且右节点大，将 j 指向右节点
      if (j < this.n - 1 && this.a[j] < this.a[j + 1]) {
        j = j + 1;
      }

      if (this.a[j] > temp) {
        this.a[i] = this.a[j];
        i = j;
      } else {
        break;
      }
    }

    this.a[i] = temp;
  }

  /**
   * 上浮
   * 在数组尾部加入元素，如果比父节点大，则上浮到对应的位置，父节点下沉。
   *
   * @param {*} i
   * @memberof Heap
   */
  swim(i) {
    const temp = this.a[i]; // 新 push 的元素
    let parent = 0;

    // 如果还存在父节点，下标从 0 开始，0 没有父节点
    while (i > 0) {
      parent = (i - 1) >> 1; // 父节点索引

      if (this.a[parent] < temp) {
        // 将父节点向下移动，更新 i 的位置
        this.a[i] = this.a[parent];
        i = parent;
      } else {
        break;
      }
    }

    this.a[i] = temp;
  }
}

const heap = new Heap(100);

heap.push(3);
heap.push(6);
heap.push(10);
heap.push(5);
heap.pop();

console.log(heap, 'heap');
```
