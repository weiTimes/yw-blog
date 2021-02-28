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
function checkStr(str) {
  if (!str) return;

  const map = {
    '[': ']',
    '{': '}',
    '(': ')',
  };

  let i = 0;
  const stack = [];

  while (i < str.length) {
    const keys = Object.keys(map);

    if (i === 0 && !keys.includes(str[i])) {
      return false;
    }

    if (keys.includes(str[i])) {
      stack.push(str[i]);
    } else {
      const topStr = stack.pop();

      if (map[topStr] !== str[i]) {
        return false;
      }
    }

    i++;
  }

  if (stack.length === 0) {
    return true;
  } else {
    return false;
  }
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