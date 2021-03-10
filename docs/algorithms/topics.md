---
id: algorithms-topics
title: 算法题
---

### 1-两数之和

#### 两层遍历

```javascript
var twoSum = function (nums, target) {
  var array = [];

  for (var i = 0; i < nums.length; i++) {
    for (var j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        array[0] = i;
        array[1] = j;
      }
    }
  }

  return array;
};
```

#### 哈希表

```javascript
var twoSum = function (nums, target) {
  var hashMap = {}; // value和key的映射关系

  for (var i = 0; i < nums.length; i++) {
    var num = target - nums[i];

    if (hashMap[num] !== undefined) {
      // 找到了
      return [hashMap[num], i];
    }

    hashMap[nums[i]] = i; // 保存当前value: key
  }
};
```

### 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效

有效字符串需满足：
    1.左括号必须用相同类型的右括号闭合。
    2.左括号必须以正确的顺序闭合。

```javascript
function isValid(str) {
  if (!str) return false;

  var stack = [];
  var map = {
    '[': ']',
    '{': '}',
    '(': ')',
  };

  for (var i = 0; i < str.length; i++) {
    var cur = str[i];

    if (cur in map) {
      stack.push(cur);
    } else {
      var top = stack.pop();
      if (cur !== map[top]) {
        return false;
      }
    }
  }

  return !stack.length;
}

const res = checkStr('{([])}');
console.log(res); // true
```

### 给定两个字符串形式的非负整数 num1 和num2 ，计算它们的和

你不能使用任何內建 BigInteger 库， 也不能直接将输入的字符串转换为整数形式。

```javascript
function sum(num1, num2) {
  if (num1.length === 0 || num2.length === 0) return 0;

  var i = 0;
  var j = 0;
  var res1 = 0;
  var res2 = 0;

  while (i < num1.length) {
    var currentNum1 = num1[i] >>> 0;

    if (i === 0) {
      res1 = currentNum1;
    } else {
      res1 = res1 * 10 + currentNum1;
    }

    i++;
  }

  while (j < num2.length) {
    var currentNum2 = num2[j] >>> 0;

    if (j === 0) {
      res2 = currentNum2;
    } else {
      res2 = res2 * 10 + currentNum2;
    }

    j++;
  }

  return res1 + res2;
}

console.log(sum('12', '18')); // 30
```

### 剑指 Offer 58 - I. 翻转单词顺序

#### 双指针法

```javascript
var reverseWords = function(s) {
  if(!s) return '';

  s = s.trim();
  var len = s.length;
  var i = len - 1;
  var j = len - 1;
  var res = [];

  while(i >= 0) {
    while(i >= 0 && s[i] !== ' ') {
      i--;
    }

    res.push(s.substring(i + 1, j + 1));

    while(s[i] === ' ') {
      i--;
    }

    j = i;
  }

  return res.join(' ');
};
```

#### 使用库函数

```javascript
var reverseWords = function (s) {
  if (!s) return '';

  s = s.trim();
  s = s
    .split(' ')
    .filter((s) => !!s)
    .reverse()
    .join(' ');

  return s;
};
```

### 104-二叉树的最大深度

DFS，深度优先搜索

```javascript
var maxDepth = function(root) {
  if(!root) return 0;

  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
};
```

### 141. 环形链表

```javascript
var hasCycle = function(head) {
    if(!head) return false;

    var slow = head;
    var fast = head;

    while(fast && fast.next) {
      fast = fast.next.next;
      slow = slow.next;

      if(fast === slow) {
        return true;
      }
    }

    return false;
};
```

### 300. 最长递增子序列

#### 动态规划

```javascript
var lengthOfLIS = function(nums) {
  if(nums.length < 2) return nums.length;

  var len = nums.length;

  var dp = new Array(len).fill(1);

  for(var i = 0; i < len; i++) {
    for(var j = 0; j < i; j++) {
      if(nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }

  return Math.max(...dp);
};
```

#### 贪心 + 二分查找

```javascript
var lengthOfLIS = function(nums) {
  if(nums.length < 2) return nums.length;

  var len = nums.length;
  var res = [nums[0]];

  for(var i = 1; i < len; i++) {
    var cur = nums[i];
    // 贪心
    if(cur > res[res.length - 1]) {
      res.push(cur);
    } else {
      // 二分查找，找到正好比某个元素大的位置
      var left = 0;
      var right = res.length - 1;

      while(left < right) {
        var middle = left + right >> 1;
        if(cur > res[middle]) {
          left += 1;
        } else {
          right = middle;
        }
      }

      res[left] = cur;
    }
  }

  return res.length;
};
```