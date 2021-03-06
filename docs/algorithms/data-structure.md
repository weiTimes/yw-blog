---
id: data-structure
title: 数据结构
---

> 算法这一部分包含数据结构和算法题，关于算法题这里可能不是很完整，完整的代码实现可以到[我的仓库中](https://github.com/weiTimes/front-source-code/tree/master/algorithms)查看。

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
    while (i > 0 && (parent = (i - 1) >> 1) !== i) {
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
    while (i > 0 && (parent = (i - 1) >> 1) !== i) {
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

### 例 1：最小的 k 个数

#### 解法一：先排序后取前三个数

时间复杂度：O(nlgn)。

#### 解法二：使用大堆

维护堆的长度为 n，不断的进行 push 操作，一旦长度超过 k，就进行 pop 操作，最后去堆长度的值作为返回值。

时间复杂度：O(nlgk)，因为所有数都需要入堆，堆 push 的时间复杂度未 O(lgk)。

空间复杂度：O(k)。

```javascript
var getLeastNumbers = function (arr, k) {
  if (!arr || k <= 0) return [];

  const len = arr.length;

  if (len <= k) return arr;

  const heap = new Heap(k + 1);

  for (let i = 0; i < len; i++) {
    heap.push(arr[i]);

    if (heap.n > k) {
      // 超出了，需要 pop
      heap.pop();
    }
  }

  return heap.array.slice(0, heap.n);
};
```

#### 练习题 1：347. 前 K 个高频元素

实现：先使用 hashmap，建立元素与次数的映射关系，然后使用最小堆，堆的大小为 `k + 1`，通过 `push` 和 `pop` 操作维持堆的长度为 `k`，最终将堆中元素返回。

实现：

```javascript
// 最小堆
class MinHeap {
  constructor(k) {
    this.a = new Array(k);
    this.n = 0;
  }

  size() {
    return this.n;
  }

  push(val) {
    this.a[this.n] = val;

    this.swim(this.n);

    this.n += 1;
  }

  pop() {
    const ret = this.a[0];

    this.a[0] = this.a[this.n - 1];

    this.sink(0);

    this.n -= 1;

    return ret;
  }

  swim(i) {
    const temp = this.a[i];
    let parent = 0;

    while (i > 0 && (parent = (i - 1) >> 1) !== i) {
      if (this.a[parent][1] > temp[1]) {
        this.a[i] = this.a[parent];
        i = parent;
      } else {
        break;
      }
    }

    this.a[i] = temp;
  }

  sink(i) {
    const temp = this.a[i];

    let j = 0;

    while ((j = (i << 1) + 1) < this.n) {
      if (j + 1 < this.n && this.a[j + 1][1] < this.a[j][1]) {
        j = j + 1;
      }

      if (this.a[j][1] < temp[1]) {
        this.a[i] = this.a[j];
        i = j;
      } else {
        break;
      }
    }

    this.a[i] = temp;
  }
}

var topKFrequent = function (nums, k) {
  if (!nums || k <= 0) return [];

  let len = nums.length;

  const heap = new MinHeap(k + 1);
  const map = new Map();

  for (let i = 0; i < len; i++) {
    const count = map.has(nums[i]) ? map.get(nums[i]) : 0;
    map.set(nums[i], count + 1);
  }

  for (const item of map) {
    heap.push(item);

    if (heap.n > k) {
      heap.pop();
    }
  }

  return heap.a.map((item) => item[0]).slice(0, k);
};
```

习题：

- [[347] 前 K 个高频元素](https://leetcode-cn.com/problems/top-k-frequent-elements/description/)
- [[692] 前 K 个高频单词](https://leetcode-cn.com/problems/top-k-frequent-words/description/)
- [[973] 最接近原点的 K 个点](https://leetcode-cn.com/problems/k-closest-points-to-origin/)
- [[373] 查找和最小的 K 对数字](https://leetcode-cn.com/problems/find-k-pairs-with-smallest-sums/)

### 优先级队列

![queue](https://ypyun.ywhoo.cn/assets/20210702223453.png)

#### 例题：跳跃游戏

> [1642. 可以到达的最远建筑](https://leetcode-cn.com/problems/furthest-building-you-can-reach/)

**思路：**初始位置在下标 0，如果下一个高度小于等于当前高度，则直接移动记录索引。当大于当前高度，就需要用到砖头和梯子，记录高度差，然后入堆（大顶堆），再记录总的高度差，一旦大于砖头的数量并且有梯子，执行堆 pop 操作，总的高度差减去取出的最大值并梯子减 1；经过以上操作，如果总高度差小于等于砖头数量，就移动记录索引，否则就退出循环。

##### 实现

```javascript
class Heap {
  constructor(k) {
    this.a = new Array(k);
    this.n = 0;
  }

  push(val) {
    this.a[this.n++] = val;

    this.swim(this.n - 1);
  }

  pop() {
    const ret = this.a[0];

    this.a[0] = this.a[--this.n];

    this.sink(0);

    return ret;
  }

  swim(i) {
    while (i > 0) {
      const temp = this.a[i];
      const parentIndex = (i - 1) >> 1;

      if (this.isMorePriority(temp, this.a[parentIndex])) {
        this.a[i] = this.a[parentIndex];
        this.a[parentIndex] = temp;
        i = parentIndex;
      } else {
        break;
      }
    }
  }

  sink(i) {
    while (i < this.n) {
      const temp = this.a[i];
      let j = 2 * i + 1;

      if (j + 1 < this.n && this.isMorePriority(this.a[j + 1], this.a[j])) {
        j = j + 1;
      }

      if (j < this.n && this.isMorePriority(this.a[j], temp)) {
        this.a[i] = this.a[j];
        this.a[j] = temp;
        i = j;
      } else {
        break;
      }
    }
  }

  isMorePriority(a, b) {
    return a > b;
  }
}

var furthestBuilding = function (heights, bricks, ladders) {
  if (!heights || heights.length <= 0) return -1;

  const len = heights.length;
  const heap = new Heap(len + 1);
  let prevHeight = heights[0];
  let needHeight = 0;
  let pos = 0;

  for (let i = 1; i < len; i++) {
    const cur = heights[i];

    if (cur <= prevHeight) {
      pos = i;
    } else {
      const delta = cur - prevHeight;

      heap.push(delta);
      needHeight += delta;

      // 只有在砖头不够用的情况下用梯子
      while (needHeight > bricks && ladders > 0) {
        ladders -= 1;
        const topHeight = heap.pop();
        needHeight -= topHeight;
      }

      if (needHeight <= bricks) {
        pos = i;
      } else {
        break;
      }
    }

    prevHeight = cur;
  }

  return pos;
};

const re = furthestBuilding([4, 2, 7, 6, 9, 14, 12], 5, 1); // 4
```

**复杂度分析：**最坏的情况下需要将所有高度入堆，堆的操作是 O(lgN)，所有总的时间复杂度是 O(NlgN)，空间复杂度是 O(N)。

#### 练习题

- [x] [871. 最低加油次数](https://leetcode-cn.com/problems/minimum-number-of-refueling-stops/)

### 总结

![总结](https://ypyun.ywhoo.cn/assets/20210703185007.png)

## 链表：如何利用“假头、新链表、双指针”解决链表题？

解决链表问题的“三板斧”：假头、新链表、双指针。

### 三板斧的第一斧：假头

**假头又叫做 Dummy Head。**就是在链表前面，加上一个额外的节点，存放了 N 个数据的带假头的链表，算上假头一共有 N+1 个结点。

添加了假头，可以省掉很多空指针的判断，使链表的各种操作变得更加的简洁。链表有 6 种基本的操作：

- 初始化
- 追加节点
- 头部插入节点
- 查找节点
- 插入指定位置之前
- 删除节点

[707. 设计链表](https://leetcode-cn.com/problems/design-linked-list/)

#### 初始化

初始化假头链表，首先，我们需要 new 出一个链表结点，并且让链表的 dummy 和 tail 指针都指向它。

```javascript
class LinkNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

class MyLinkedList {
  constructor() {
    const node = new LinkNode();
    this.dummy = node;
    this.tail = node;
    this.size = 0;
  }
}
```

初始化完成后，链表已经有了一个结点，但是此时，整个链表中还没有任何数据。

#### 追加节点

```javascript
// 在尾部添加新节点
addAtTail(val) {
  this.tail.next = new LinkNode(val);
  this.tail = this.tail.next;

  this.size += 1;
}
```

带假头的链表初始化之后，可以保证 tail 指针永远非空，因此，也就可以直接去修改 tail.next 指针，省略掉了关于 tail 指针是否为空的判断。

#### 头部插入结点

需要插入的新结点为 p，插入之后，新结点 p 会成为第一个有意义的数据结点。通过以下 3 步可以完成头部插入：

1. 新结点 p.next 指向 dummy.next；
2. dummy.next 指向 p；
3. 如果原来的 tail 指向 dummy，那么将 tail 指向 p。

```javascript
// 在头部添加新节点
addAtHead(val) {
  const node = new LinkNode(val);

  node.next = this.dummy.next;
  this.dummy.next = node;

  if (this.tail === this.dummy) {
    this.tail = node;
  }

  this.size += 1;
}
```

#### 查找节点

在查找索引值为 index（假设 index 从 0 开始）的结点时，你需要注意，大多数情况下，返回指定结点前面的一个结点 prev 更加有用。

好处有以下两个方面：

1. 通过 prev.next 就可以访问到你想要找到的结点，如果没有找到，那么 prev.next 为 null；
2. 通过 prev 可以方便完成后续操作，比如在 target 前面 insert 一个新结点，或者将 target 结点从链表中移出去。

先首先获取目标节点的上一个节点：

```javascript
  getPrevNode(index) {
    let front = this.dummy.next; // 前指针
    let back = this.dummy; // 后指针

    for (let i = 0; i < index && front !== null; i++) {
      back = front;
      front = back.next;
    }

    return back;
  }
```

有了假头的帮助，这段查找代码就非常健壮了，可以处理以下 2 种情况：

- 如果 target 在链表中不存在，此时 prev 返回链表的最后一个结点；
- 如果为空链表（空链表指只有一个假头的链表），此时 prev 指向 dummy。也就是说，返回的 prev 指针总是有效的。

接下来实现 get 方法，即获取目标节点：

```javascript
  // 获取链表中 index 节点的值，如果索引无效，则返回 -1
  get(index) {
    if (index < 0 || index >= this.size) {
      return -1;
    }

   // 因为getPrevNode总是返回有效的结点，所以可以直接取值。
    return this.getPrevNode(index).next.val;
  }
```

#### 插入指定位置之前

插入指定位置的前面，有 4 个需求。

1. 如果 index 大于链表长度，则不会插入结点。
2. 如果 index 等于链表的长度，则该结点将附加到链表的末尾。
3. 如果 index 小于 0，则在头部插入结点。
4. 否则在指定位置前面插入结点。

实现：

```javascript
  addAtIndex(index, val) {
    if (index > this.size) {
      return;
    } else if (index === this.size) {
      this.addAtTail(val);
    } else if (index <= 0) {
      this.addAtHead(val);
    } else {
      const node = new LinkNode(val);
      const prevNode = this.getPrevNode(index);

      node.next = prevNode.next;
      prevNode.next = node;

      this.size += 1;
    }
  }
```

#### 删除节点

删除结点操作是给定要删除的下标 index（下标从 0 开始），删除的情况分 2 种：

1. 如果 index 无效，那么什么也不做；
2. 如果 index 有效，那么将这个结点删除。

```javascript
  deleteAtIndex(index) {
    if (index < 0 || index >= this.size) {
      return;
    } else {
      const prevNode = this.getPrevNode(index);

      // 删除的是最后一个节点，改变 tail 指针
      if (prevNode.next === this.tail) {
        this.tail = prevNode;
      }

      prevNode.next = prevNode.next.next;
      this.size -= 1;
    }
  }
```

### 三板斧的第二斧：新链表

做链表的反转、交换等操作时，不建议直接在原来的链表上进行操作。一种可取的思路是，把这些操作想象成要生成新的链表，然后借助这些新的链表，完成原本比较复杂的操作。

#### 链表翻转

[206. 翻转链表](https://leetcode-cn.com/problems/reverse-linked-list/)

思路：

- 建立一个新的带假头的空链表；
- 遍历旧链表，依次取出旧链表中的每个节点；
- 采用头部插入的方法放到新链表中；
- 返回 `dummy.next`;

实现：

```javascript
var reverseList = function (head) {
  let prev = null;
  let cur = head;

  while (cur !== null) {
    const temp = cur.next;
    cur.next = prev;
    prev = cur;
    cur = temp;
  }

  return prev;
};
```

复杂度分析：时间复杂度 O(n)，空间复杂度 O(1)。

#### 删除节点

[83. 删除排序链表中的重复元素](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list/)

思路：

1. 建立一个新的带假头的空链表；
2. 遍历旧链表，依次取出旧链表中的每个点，如果不删除这个结点，那么就采用尾部插入方法接到新链表中。

可以发现，在这里没有出现结点交换的操作。采用新链表的思路，避免了在原链表上不停地做结点的删除。

```javascript
var removeElements = function (head, val) {
  let dummy = new ListNode();
  let tail = dummy;

  while (head !== null) {
    if (head.val !== val) {
      tail.next = head;
      tail = head;
    }

    head = head.next;
  }

  tail.next = null;

  return dummy.next;
};
```

#### 给定一个排序链表，删除重复出现的元素，使得每个元素只出现一次。

[83. 删除排序链表中的重复元素](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list/)

```javascript
var deleteDuplicates = function (head) {
  const dummy = new ListNode();
  let tail = dummy;

  while (head !== null) {
    const temp = head.next;

    if (dummy === tail || tail.val !== head.val) {
      tail.next = head;
      tail = head;
    }

    head = temp;
  }

  tail.next = null;

  return dummy.next;
};
```

#### 给定一个排序链表，删除重复出现的元素，只留下没有重复出现的元素。

[82. 删除排序链表中的重复元素 II](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list-ii/)

```javascript
var deleteDuplicates = function (head) {
  if (!head) return null;

  const dummy = new ListNode();
  let tail = dummy;

  while (head !== null) {
    let cur = head;

    while (cur.next !== null && cur.val === cur.next.val) {
      cur = cur.next;
    }

    if (head === cur) {
      tail.next = cur;
      tail = cur;
    }

    head = cur.next;
  }

  tail.next = null;

  return dummy.next;
};
```

#### 合并

##### [21. 合并两个有序链表](https://leetcode-cn.com/problems/merge-two-sorted-lists/)

思路：使用一个指针指向较小的链表节点，不断地更新 tail 指针，最后判断哪个链表不为空，将不为空的链表加到 tail 后面。

```javascript
var mergeTwoLists = function (l1, l2) {
  if (l1 === null && l2 === null) return null;
  if (l1 === null) return l2;
  if (l2 === null) return l1;

  const dummy = new ListNode();
  let tail = dummy;

  while (l1 !== null && l2 !== null) {
    const isL1Smaller = l1.val <= l2.val;
    let cur = isL1Smaller ? l1 : l2;

    tail.next = cur;
    tail = cur;

    if (isL1Smaller) {
      l1 = l1.next;
    } else {
      l2 = l2.next;
    }
  }

  tail.next = l1 === null ? l2 : l1;
  tail = tail.next;

  return dummy.next;
};
```

##### [23. 合并 k 个升序链表]

**思路：**先使用小顶堆存储所有的链表节点，然后定义一个带假头的空链表，当堆的长度不为 0，就执行 pop 操作，往新的链表中追加节点，最后返回 dummy.next。

实现：

```javascript
class MinHeap {
  constructor() {
    this.a = [];
    this.n = 0;
  }

  push(val) {
    this.a[this.n++] = val;

    this.swim(this.n - 1);
  }

  pop() {
    const ret = this.a[0];

    this.a[0] = this.a[--this.n];

    this.sink(0);

    return ret;
  }

  swim(i) {
    while (i > 0) {
      const temp = this.a[i];
      const parentIndex = (i - 1) >> 1;
      const parentNode = this.a[parentIndex];

      if (this.isLessPriority(temp, parentNode)) {
        this.a[i] = parentNode;
        this.a[parentIndex] = temp;
        i = parentIndex;
      } else {
        break;
      }
    }
  }

  sink(i) {
    while (i < this.n) {
      const temp = this.a[i];
      let j = 2 * i + 1;

      if (j + 1 < this.n && this.isLessPriority(this.a[j + 1], this.a[j])) {
        j += 1;
      }

      if (j < this.n && this.isLessPriority(this.a[j], temp)) {
        this.a[i] = this.a[j];
        this.a[j] = temp;
        i = j;
      } else {
        break;
      }
    }
  }

  isLessPriority(nodeA, nodeB) {
    if (!nodeA || !nodeB) return false;

    return nodeA.val <= nodeB.val;
  }
}

var mergeKLists = function (lists) {
  const linkedLength = lists.length;

  if (!lists || linkedLength <= 0) return null;

  if (linkedLength === 1) return lists[0];

  const heap = new MinHeap(100);

  for (let i = 0; i < linkedLength; i++) {
    let curLinkedList = lists[i];

    while (curLinkedList !== null) {
      heap.push(curLinkedList);

      curLinkedList = curLinkedList.next;
    }
  }

  const dummy = new ListNode();
  let tail = dummy;

  while (heap.n > 0) {
    const node = heap.pop();

    tail.next = node;
    tail = tail.next;
  }

  tail.next = null;

  return dummy.next;
};
```

#### 交换链表的节点

[24. 两两交换链表中的节点](https://leetcode-cn.com/problems/swap-nodes-in-pairs/)

考点：

- 拆分链表
- 新链表的思路
- 合并链表的操作

**思路：**将原链表按奇数偶数区分为两条链表，新建一个假头链表用来承载交换后的值，按照与原先相反的奇偶顺序进行插入（使用 count 标志），最后将 dummy.next 返回。

注意：在使用奇偶链表时，是使用 dummy.next，这样除去了假头节点；遍历奇偶链表的终止条件是两个都不为空，遍历完后还需要分别判断不为空的链表，然后将新链表的 tail 指向非空链表的 tail。

实现：

```javascript
var swapPairs = function (head) {
  if (!head) return null;

  const evenDummy = new ListNode();
  const oddDummy = new ListNode();
  let evenTail = evenDummy;
  let oddTail = oddDummy;
  let count = 0;

  while (head !== null) {
    const isEven = count % 2 == 0; // 偶数
    count += 1;

    if (isEven) {
      evenTail.next = head;
      evenTail = head;
    } else {
      oddTail.next = head;
      oddTail = head;
    }

    head = head.next;
  }

  evenTail.next = null;
  oddTail.next = null;

  evenTail = evenDummy.next;
  oddTail = oddDummy.next;

  const dummy = new ListNode();
  let tail = dummy;
  count = 1; // 奇数先加入新链表

  //   // 两个新链表均不为空
  while (evenTail !== null && oddTail !== null) {
    const isEven = count % 2 === 0;
    count += 1;

    if (isEven) {
      tail.next = evenTail;
      tail = evenTail;
      evenTail = evenTail.next;
    } else {
      tail.next = oddTail;
      tail = oddTail;
      oddTail = oddTail.next;
    }
  }

  if (evenTail !== null) {
    tail.next = evenTail;
  }
  if (oddTail !== null) {
    tail.next = oddTail;
  }

  return dummy.next;
};
```

**时间复杂度分析：**每个节点都会访问两次，拆分一次，合并一次，时间复杂度为 O(N)，空间复杂度为 O(1)。

### 三板斧的第三斧：双指针

双指针，顾名思义就是两个指针在链表上移动。实际上，我们在前面链表的查找中已经使用过双指针了：比如链表中指定位置插入一个新结点，就使用了两个指针，一前一后两个指针在链表上前进。

1. 间隔指针：前面的指针先走一步，然后后面的指针再一起走；前面的指针先走 k 步，后面的指针再一起走。
2. 快慢指针：两个指针的速度一快一慢前进，比如一个每次走一步，一个每次走两步。

#### 删除链表的倒数第 k 个结点

[19. 删除链表的倒数第 N 个结点](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)

思路：

1. 在原链表前面加上 dummy，变成带假头的链表
2. front 指针从 dummy 开始，走 k 步，然后停下来
3. back 指针指向 dummy，然后两个指针一起走
4. 当 front 指向最后一个节点时，back 指针刚好指向倒数第 k 个节点的前驱节点

细节：

1. 链表长度 < k，此时什么也不做；
2. 链表长度 == k，此时删除原来的链表头结点；
3. 链表长度 > k，此时找到倒数第 k 个结点的前驱，然后删除倒数第 k 个结点。

实现：

```javascript
var removeNthFromEnd = function (head, n) {
  if (!head) return null;

  const dummy = new ListNode(0, head);
  let front = dummy;
  let back = dummy;
  let len = 0; // front 先走的 n 步

  while (len < n && front !== null && front.next !== null) {
    front = front.next;
    len += 1;
  }

  while (front !== null && front.next !== null) {
    back = back.next;
    front = front.next;
  }

  if (len === n) {
    back.next = back.next.next;
  }

  return dummy.next;
};
```
