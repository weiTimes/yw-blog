---
id: prototype_extends
title: 原型链和继承
---

## 原型

* 每个函数都有 `prototype` 对象，`prototype.constructor` 指向函数自身。
* `__proto__` 是 `[[Prototype]]` 的 getter 和 setter。
* `F.prototype` 仅在实例化时调用，即 `new F()`，它为新对象的 `[[Prototype]]` 赋值。
* F.prototype 的值要么是一个对象，要么就是 null：其他值都不起作用。
* `__proto__` 不是一个对象的属性，只是 Object.prototype 的访问器属性（getter/setter）。
![__proto__](https://ypyun.ywhoo.cn/assets/20210227225140.png)

### 完整地拷贝对象

```javascript
function Person() {
  this.name = 'ywhoo';
}

const obj = {
  img: 'https://localhost:8080/'
}

Person.prototype = obj;

Person.prototype.getName = function() {
  return this.name;
}

var ywhoo = new Person();

var yw = Object.create(Object.getPrototypeOf(ywhoo), Object.getOwnPropertyDescriptor(ywhoo));
```

`Object.create(Object.getPrototypeOf(ywhoo), Object.getOwnPropertyDescriptor(ywhoo));`

此调用可以对 obj 进行真正准确地拷贝，包括所有的属性：可枚举和不可枚举的，数据属性和 setters/getters —— 包括所有内容，并带有正确的 [[Prototype]]。

## 继承

### 原型链继承

> 原型即实例原型，下文均用原型表示。

```javascript
function Man() {
  this.names = ['wu', 'ye'];
}

function Ywhoo() {}

// Ywhoo 的原型指向 Man 实例
Ywhoo.prototype = new Man();
// 在原型上增加 age 属性
Ywhoo.prototype.sex = 'male';

var ywhoo = new Ywhoo();
// 修改了原型上的 names 属性
ywhoo.names.push('ywhoo');

var cloneYwhoo = new Ywhoo();

console.log(ywhoo.names); // ['wu', 'ye', 'ywhoo']
console.log(cloneYwhoo.names); // ['wu', 'ye', 'ywhoo']
```

原型链继承有几个问题：

1. 无法通过原型判断是由 Ywhoo 创建的实例，因为 ywhoo 的 `__proto__` 指向的是 Person 原型。
2. 原型链上的属性会被所有实例共享。
3. 在创建 Ywhoo 的实例时，无法向 Person 传参

为了便于理解，以下是上面示例代码的原型关系图：

![原型关系图](https://ypyun.ywhoo.cn/assets/20210227111935.png)

### 借用构造函数

```javascript
function Man(sencondName = 'ye') {
  this.names = ['wu', sencondName];
}

function Ywhoo(sencondName) {
  Man.call(this, sencondName);
}

// 在原型上增加 age 属性
Ywhoo.prototype.age = 27;

var ywhoo = new Ywhoo('ycl');
// 修改了原型上的 names 属性
ywhoo.names.push('ywhoo');

var ywhoo2 = new Ywhoo('ycl');

console.log(ywhoo);
console.log(ywhoo2);
```

优点：

1. names 属性在实例对象上，没有共享属性问题，也不用到原型链上查找该属性。
2. 可以向 Man 传递参数
3. `ywhoo.__proto__.constructor` 指向 Ywhoo 本身，可以借此判断出是由谁创建的实例。

缺点：

1. 每次创建 Ywhoo 实例时都会执行一遍构造函数，即`Person.call(this);`。
2. 只能继承 Man 中的实例属性，无法继承其原型上的属性。

### 组合继承

> 常用的继承模式

```javascript
function Man(sencondName = 'ye') {
  this.names = ['wu', sencondName];
}
Man.prototype.getNames = function () {
  return names;
};

function Ywhoo(sencondName) {
  Man.call(this, sencondName);
}
Ywhoo.prototype = new Man();
Ywhoo.prototype.constructor = Ywhoo;
// 在原型上增加 age 属性
Ywhoo.prototype.age = 27;

var ywhoo = new Ywhoo('ycl');
// 修改了原型上的 names 属性
ywhoo.names.push('ywhoo');

var ywhoo2 = new Ywhoo('ycl');

console.log(ywhoo);
console.log(ywhoo2);
```

优点：

可以继承原型上的属性。

### 原型式继承

```javascript
// Object.create 模拟实现
function createObj(obj) {
  function F() {}

  F.prototype = obj;

  return new F();
}

var person = {
    name: 'kevin',
    friends: ['daisy', 'kelly']
}

var person1 = createObj(person);
var person2 = createObj(person);

person1.name = 'person1';
console.log(person2.name); // kevin

person1.firends.push('taylor');
console.log(person2.friends); // ["daisy", "kelly", "taylor"]
```

缺点：

包含引用类型的属性值始终都会共享相应的值，这点跟原型链继承一样。

注意：修改person1.name的值，person2.name的值并未发生改变，并不是因为person1和person2有独立的 name 值，而是因为 `person1.name = 'person1';`，给person1添加了 name 值，并非修改了原型上的 name 值。

### 寄生式继承

```javascript
function createObj(o) {
  var cloneObj = Object.create(o);

  cloneObj.addPower = function () {
    console.log('增强对象');
  };

  return cloneObj;
}

function F(name) {
  this.name = name;
}

console.log(createObj(new F('ywhoo')));
```

封装增强对象的方法。

缺点：

跟借用构造函数模式一样，每次创建对象都会创建一遍方法。

### 寄生组合式继承

> 最理想继承范式

```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.getName = function () {
  return `name: ${this.name}`;
};

function Ywhoo(name, age) {
  Person.call(this, name);

  this.age = age;
}

function F() {}
F.prototype = Person.prototype;

Ywhoo.prototype = new F();

var yw = new Ywhoo();
console.log(yw);
```

1. 只调用了一次 Person 构造函数
2. Person.prototype 上没有多余的属性
3. 原型链不变，可以使用 instanceof 和 isPrototypeOf

最后以一张寄生组合式继承的原型关系图收尾：

![原型关系图](https://ypyun.ywhoo.cn/assets/20210227143118.png)