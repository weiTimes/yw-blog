---
id: koa2-oldisland
title: 纯正商业级应用Koa2开发微信小程序服务端
---

## 导学

### node.js的能力

* 脱离浏览器运行 Javascript
* node.js Stream(前端工程化基础)
* 服务端 API
* 中间层
三层结构：前端 + 后端 + 服务端。服务端只负责管理数据，操作数据库，返回和业务无关联的接口，由后端处理，后端将接口聚合成自己想要的接口然后返回给前端。

> 业务知识为了承载知识，在开发项目的时候应该尽可能地把关注点放到知识本身，比如这个项目的关注点是node.js、koa2以及编程思维，在实践中学习并巩固这些知识。

### 深入理解koa

#### 环境准备

* node.js（版本可通过 `nvm` 或 `n` 进行管理）
* koa2
* MySQL - 数据库
* 微信开发者工具 - 运行微信小程序
* VSCode - 开发
* PostMan - 测试接口
* Navicat - 可视化数据库管理
* nodemon - 当 node.js 应用改动时自动重启服务
* pm2 - node.js 应用守护进程

**安装 nodemon**

```shell
yarn add nodemon -D
```

修改 `package.json`:

```json
{
  "scripts": {
    "start": "nodemon app.js"
  },
}
```

执行 `yarn start`启动服务，当有代码发生修改时，会自动重启服务。

vscode 调试配置：

```json
// .vscode/launch.json
"version": "0.2.0",
  "configurations": [
    {
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "name": "old-island-nodemon",
      "program": "${workspaceFolder}/app.js",
      "request": "launch",
      "restart": true,
      "runtimeExecutable": "nodemon",
      "skipFiles": ["<node_internals>/**"],
      "type": "pwa-node"
    },
    {
      "type": "pwa-node",
      "request": "launch",
      "name": "old-island-launch",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/app.js"
    },
    {
      "type": "pwa-node",
      "request": "launch",
      "name": "当前文件",
      "program": "${file}"
    }
  ]
}
```

上述代码包含了三个配置项：

* nodemon 调试程序（文件修改，会自动重启服务和断点）
* 应用默认调试（app.js）
* 当前文件

**安装 MySQL**

我的电脑已经安装 mysql 了，执行以下命令可以找到 mysql 服务进程：

```shell
ps -ef|grep mysql
```

使用 navicat 连接 mysql 时，由于忘记密码没法连接，所以我将 mysql 卸载了再重新安装。

到官网下载安装包安装。

安装完成后配置环境变量，在终端中可用快捷命令启动或关闭 mysql 服务。

```.zshrc
# .zshrc
export PATH=${PATH}:/usr/local/mysql/bin
alias mysqlstart='sudo /usr/local/mysql/support-files/mysql.server start'
alias mysqlstop='sudo /usr/local/mysql/support-files/mysql.server stop'
```

进入 mysql 环境：

```shell
mysql -u root -p
```

> 使用 navicat 连接时报 `2003 - Can't connect to MySQL server on '127.0.0.1' (61 "Connection refused")`，解决方法是点击高级，然后选中 `Use socket file`，点击 `Test Connection` 可以显示成功连接了。

#### Koa的特点

* 精简 => 定制能力强 => 二次开发
* 洋葱模型

#### 模块规范类型

* amd
* commonjs
* es6

> 如果想使用最新的 es6+ 特性，可以使用 babel 进行转译，或者是集成 typescript。

#### Koa中间件

**注册在应用程序对象**

```javascript
// 注册中间件
app.use(async (ctx, next) => {
  // ctx 上下文
  // next 下一个中间件
  console.log('say hello.');
  await next();
});
```

按照洋葱模型，执行到当前 next 后面的代码，说明该中间件后面的中间件都已经执行完了。所以为了保证能够得到洋葱模型的执行结果，需要在 next 前 加 await。

**async 和 await**

> 在使用中间件的时候最好加 async 和 await，保证能够得到期望的执行结果。

async:

* 在函数前面的 “async” 这个单词表达了一个简单的事情：即这个函数总是返回一个 promise。其他值将自动被包装在一个 resolved 的 promise 中。
* await 只在 async 函数内工作。

await:

* await 实际上会暂停函数的执行，直到 promise 状态变为 settled，然后以 promise 的结果继续执行。这个行为不会耗费任何 CPU 资源，因为 JavaScript 引擎可以同时处理其他任务：执行其他脚本，处理事件等。
* 相比于 promise.then，它只是获取 promise 的结果的一个更优雅的语法，同时也更易于读写。

**洋葱模型**

### 路由系统

安装 `koa-router`:

```shell
yarn add koa-router
```

使用：

```javascript
const Router = require('koa-router');

router.get('/', (ctx, next) => {
  ctx.body = 'hello world';
});

app.use(router.routes()).use(router.allowedMethods());
```

**拆分路由**

为了客户端的兼容性，通常会支持多个版本的 api，当有新的业务需求的时候，只需要新增对应版本的 api，而不用修改原先的代码（闭合原则: 尽量不修改代码，而是扩展代码）；客户端在新的迭代中只需要替换新版本的 api即可。

版本号的携带策略：

* 路径
* 查询参数
* header

实现：

在项目根目录下新建 `api/v1` 文件夹、`api/v1/book.js`，`book.js` 代码如下：

```javascript
const Router = require('koa-router');

const router = new Router();

router.get('/v1/book', (ctx, next) => {
  ctx.body = {
    text: 'book',
  };
});

module.exports = router;
```

在 app.js 中导入路由模块：

```javascript
// ...
const book = require('./api/v1/book');

app.use(book.routes()).use(book.allowedMethods());
// ...
```

**路由自动注册**

`require-directory`可以遍历指定的目录，并返回其中的模块，首先安装它:

```shell
yarn add require-directory
```

使用：

```javascript
// app.js
// ...
const requireDirectory = require('require-directory');

requireDirectory(module, './api', {
  visit: (module) => {
    if (module instanceof Router) {
      app.use(module.routes()).use(module.allowedMethods());
    }
  },
});

// ...
```

**初始化管理器**

> app.js 中的代码应该尽可能地精简，所以抽象出一个管理类来初始化应用，下面将路由的初始化放入了管理器类中。

新建 `core/init.js`，代码如下：

```javascript
const Router = require('koa-router');
const requireDirectory = require('require-directory');

class InitManager {
  static initCore(app) {
    InitManager.app = app;
    InitManager.initLoadRouters();
  }

  // 初始化路由
  static initLoadRouters() {
    // 使用绝对路径，即使管理类的位置变了，代码也不会出错
    const path = `${process.cwd()}/app/api`;

    requireDirectory(module, path, {
      visit: (module) => {
        if (module instanceof Router) {
          InitManager.app.use(module.routes()).use(module.allowedMethods());
        }
      },
    });
  }
}

module.exports = InitManager;
```

在 app.js 中使用：

```javascript
// ...
const InitManager = require('./core/init');

// 初始化管理器
InitManager.initCore(app);

// ...
```

### 异常处理

#### 参数获取

前端传递参数的几种方式：

* 路径
* 查询参数
* body
* header

node.js 获取参数：

```javascript
router.post('/v1/classic/:id', (ctx, next) => {
  const params = ctx.params; // 路径参数
  const query = ctx.request.query; // 查询参数
  const body = ctx.request.body; // body
  const header = ctx.request.header; // headers
});
// 想要在 body 中拿到正确的值，需要先安装 koa-bodyparser，然后将它注册到 app:
// app.js
const bodyParser = require('koa-bodyparser');

app.use(bodyParser());
```

#### 参数校验

在开发中需要对参数进行校验，比如校验参数是否为空、类型是否符合要求、是否符合合法参数的规则等，由于 koa 非常的精简，并没有提供这样的校验器，所以需要自己写，这部分源码在 `/core/validator.js` 中，感兴趣的自行查看。

#### 全局异常处理

> 在全局监听捕获到任何异常

**为什么需要处理异常**

* 便于调试
* 告诉用户

**异常处理方案**

* try...catch... - 适用于同步代码
* 如果希望try... catch... 捕获到异步的异常，需要配合 Promise:

```javascript
f1();

// try...catch... 可以捕获到函数 checkNumber 中的异常
async function f1() {
  try {
    const number = await checkNumber();
    console.log(number, 'number');
  } catch (error) {
    console.log(error.message, 'error');
  }
}

// 返回一个 Promise, 当随机数小于0.5抛出异常，否则，返回该随机数
function checkNumber() {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      const num = Math.random();

      if (num < 0.5) {
        reject(new Error('Invalid number'));
      } else {
        resolve(num);
      }
    }, 1000);
  });
}
```

**全局处理异常的关键点**

> 编写 exception 中间件

* 监听错误
* 给出有意义的提示信息

新建 `middleware/exception.js`

```javascript
const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.body = '服务器有点问题~';
  }
};

module.exports = catchError;
```

通常错误包含了错误堆栈调用信息、而前端是不需要的，需要将清晰明了的信息返回给前端：

* http 状态码
* error_code 业务状态码，开发者自定义
* message 错误信息
* request_url 当前请求的路由

错误可分为已知错误（可以判断的，如用户传递的参数错误）和未知错误（程序的潜在错误，如连接数据库出错），需要在 `exception.js` 中分别进行处理。

首先定义异常类，用于简化抛出标准信息异常的代码：

```javascript
// core/http-exception.js
class HttpException extends Error {
  constructor(message, errorCode, status) {
    super();
    this.message = message;
    this.errorCode = errorCode;
    this.status = status;
  }
}

module.exports = { HttpException };
```

在某个接口中使用：

```javascript
// app/api/v1/classic
router.post('/v1/classic/:id', (ctx, next) => {
  const error = new HttpException('Invalid number', 20001, 400);

  throw error;
});
```

修改中间件 `exception.js`:

```javascript
// middlewares/exception.js
// ...
const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HttpException) {
      // 已知错误
      ctx.body = {
        message: error.message,
        error_code: error.errorCode,
        requestUrl: `${ctx.method} ${ctx.path}`,
      };
      ctx.status = error.status;
    } else {
      // 未知错误
      ctx.body = {
        message: '未知错误',
        error_code: 999,
        requestUrl: `${ctx.method} ${ctx.path}`,
      };
      ctx.staus = 500;
    }
  }
};
// ...
```

异常的类型可能有很多，可以在基类 `HttpException` 的基础上进行扩展，例如增加一个参数异常类：

```javascript
// core/http-exception.js
class ParameterException extends HttpException {
  constructor(message = '参数错误', errorCode = '20000') {
    super();
    this.message = message;
    this.errorCode = errorCode;
    this.status = 400;
  }
}

// 使用
const error = ParameterException('用户名参数错误', 20001);
```

### LinValidator校验器和Sequelize

#### 验证路径参数是正整数

```javascript
// app/validators/validator.js
const { LinValidator, Rule } = require('../../core/validator');

class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super();

    this.id = [new Rule('isInt', '需要是正整数', { min: 1 })];
  }
}

module.exports = {
  PositiveIntegerValidator,
};

// 使用
// app/api/v1/classic.js
// ...
router.post('/v1/classic/:id', (ctx, next) => {
  const validate = new PositiveIntegerValidator().validate(ctx);
});
// ...
```

**优化开发环境错误提示**

如果是开发环境发生了错误，终端应该有提示，在 `exception` 中间件中应该将错误抛出：

定义一个配置文件，包含了标识开发环境还是生产环境的环境变量：

```javascript
// config/index.js
module.exports = {
  env: 'dev', // 上线时需要将 env 修改成 prod
};

// core/init.js
// ...
class InitManager {
  static initCore(app) {
    InitManager.initLoadConfig();
  }

  static initLoadConfig(path = '') {
    global.config = require(path || `${process.cwd()}/config`);
  }
}
// ...

// 使用
global.config.env === 'dev'
```

#### 用户模型

![登录注册流程图](https://ypyun.ywhoo.cn/assets/20210215220107.png)

* 关系型数据库：MySQL、PostgressSQL、Oracle
* 非关系型数据库：Redis(key-value)、MongoDB(文档型数据库)
* Redis 是用作数据缓存，其它数据库是作持久化存储

#### Sequelize初始化配置

首先安装 sequelize 及 mysql 的驱动：

```shell
yarn add sequelize mysql2
```

配置：

```javascript
// core/db.js
const Sequelize = require('sequelize');
const { dbName, host, port, user, password } = require('../config').database;

const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql', // 连接的数据库类型，想要连接mysql，就需要安装它的驱动程序 `mysql2`
  host,
  port,
  logging: true, // 在控制台显示操作数据库的sql
  timezone: '+8:00', // 北京时间
  define: {}
});

sequelize.sync();

module.exports = sequelize;
```

#### 用户唯一标识

新建用户模型 `models/user.js`:

```javascript
const { Sequelize, Model } = require('sequelize');
const db = require('../core/db');

class User extends Model {}

User.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  // 每个小程序对应一个openid，如果需要知道多个小程序货公众号的同一个用户，可以获取他的unionId
  openid: {
    type: Sequelize.STRING(64),
    unique: true,
  },
});
```

id 作为用户模型的主键，需注意以下几点：

* id用数字类型，不用随机字符串，这样查询效率更高
* 主键不能为空、具有唯一性

生成编号系统可有有两种方式：

* id自增
* 自己设计
  * 6001, 6002... 这种方式存在两个弊端：新增用户时，不知道上一个用户的id是多少，需要先查询一遍数据库，效率很低；在并发量大的情况下，可能会导致id计算重复。
  * 使用随机字符串，这种方式查询效率很低。

其实不管怎么设计，有一定规律的编号都可能猜到用户的id；所以最好的方式是通过设置接口权限来对用户的信息进行保护。

#### Sequelize个性化配置

包含自动生成时间字段、重命名字段、使用下划线命名规范。

```javascript
const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql', // 连接的数据库类型，想要连接mysql，就需要安装它的驱动程序 `mysql2`
  host,
  port,
  logging: true, // 在控制台显示操作数据库的sql
  timezone: '+8:00', // 北京时间
  define: {
    timestamps: true, // 自动生成时间字段 create_time, update_time
    paranoid: true, // delete_time
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true, // 使用下划线命名规范
  },
});

sequelize.sync({
  force: true, // 强制先删除数据库，仅用在开发环境；或者可以使用数据迁移（成本高、有风险）
});
```

> 完善 exception 中间件：当开发环境并且异常不是 HttpException 的实例时，才抛出异常到控制台。

```javascript
// middlewares/exception.js
// ...
const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    const isDev = global.config.env === 'dev';
    const isNotHttpException = error instanceof HttpException;

    if (isDev && !isNotHttpException) {
      throw error;
    }
    // ...
};
```

### 构建用户身份系统

#### 用户注册与Sequelize新增数据

实现用户注册接口:

```javascript
// api/v1/user.js
// ...
const User = require('../../../models/user');

const router = new Router({
  prefix: '/v1/user',
});

router.post('/register', async (ctx) => {
  const val = new RegisterValidator().validate(ctx);
  const user = {
    username: val.get('body.username'),
    email: val.get('body.email'),
    password: val.get('body.password1'),
  };

  const res = await User.create(user);
});

module.exports = router;
```

在 User 模型中，email为不能重复的表字段，所以在执行 User.create 的时候有时候会报异常，并且返回的类型是 Promsie，但是上述代码没有对抛出的异常作处理，用户在请求接口时，就会报 `Internal Server Error`。

解决思路有两个，一个是在对 `User.create` 语句块 `try...catch...`，但是一旦捕获到的异常，我们不知道该异常是什么异常；第二个是在进行参数校验的时候将验证email在数据库中是否已存在，如果已经存在则验证不通过，推荐第二种方法。

修改以下代码:

```javascript
// /app/validators/validator.js
const { LinValidator, Rule } = require('../../core/validator2');

class RegisterValidator extends LinValidator
{
  // ...
  async validateEmail(vals) {
    const email = vals.body.email;
    const user = await User.findOne({ where: { email } });

    if (user) {
      throw new Error('该邮箱已存在');
    }
  }
}
```

校验器中包含了异步处理，validator2 中增加了对自定义校验器异步的处理，`validate.js` 中引入的是 `validator2`。

在 `api/user.js` 中也需要进行异步处理：`const val = await new RegisterValidator().validate(ctx); // 由于对email的验证涉及到异步处理，所以需要等待其返回结果`；到目前为止，使用了校验器的接口，都需要进行异步处理。

#### 盐与密码加密

密码存储到数据库中不能以明文的形式存在，而且即使是相同的密码加密后的结果也需要不同（通过盐实现），可防范彩虹攻击。

修改 `models/user.js`，在写入数据库之前，对密码进行加密：

```javascript:
// ...
const bcrypt = require('bcryptjs');

User.init({
  password: {
      type: Sequelize.STRING,
      // 观察者模式
      set(val) {
        // 生成盐时传入的值越大，所耗费计算机的资源就越多，这里使用默认值 10
        const salt = bcrypt.genSaltSync(10);
        const cryptPwd = bcrypt.hashSync(val, salt);

        this.setDataValue('password', cryptPwd);
      },
    }
})
// ...
```

#### 接口操作成功响应

目前接口响应成功没有返回任何信息给客户端，所以客户端拿到的结果是 `Not Found`，接下来以抛出异常的形式将成功信息返回给客户端：

```javascript
// api/v1/user.js
// ...
throw new global.errors.Success();
```

Success 是 HttpException 的子类：

```javascript
// http-exception.js
class Success extends HttpException {
  constructor(message = '', errorCode) {
    super();
    this.status = 201; // 查询成功200，操作成功201
    this.message = message || 'ok';
    this.errorCode = errorCode || 0;
  }
}
```

将异常类暴露到 global:

```javascript
// core/init.js
class InitManager {
  // ...
  constructor() {
    super();

    // ...
    InitManager.loadHttpExceptions();
  }

  static loadHttpExceptions() {
    const errors = require('./http-exception');

    global.errors = errors;
  }
}
```

#### 生成 jwt token

使用 `jsonwebtoken` 生成令牌：

```javascript
const jwt = require('jsonwebtoken');

// uid: 用户id，scope: 用来实现权限
const generateToken = function (uid, scope) {
  const secretKey = global.config.security.secretKey;
  const expiresIn = global.config.security.expiresIn;

  // sign => 生成令牌 params: 自定义信息、私钥、可选配置项
  const token = jwt.sign(
    {
      uid,
      scope,
    },
    secretKey,
    {
      expiresIn,
    }
  );

  return token;
};
```

由于服务器不保存状态，所以就无法在使用过程中废止某个 token，或者更改 token 的权限。也就是说，一旦 token 签发，在到期之前始终有效，所以过期时间应该设置得比较短。

#### 对路由进行权限验证

api 可分为公共api和私有api，私有api需要携带 token ，验证通过后才能返回正常的数据。

编写 `auth-token` 中间件：

```javascript
// middlewares/auth-token.js
const basicAuth = require('basic-auth');

class AuthToekn {
  constructor() {}

  get m() {
    return async function (ctx, next) {
      // 检测token
      const token = basicAuth(ctx.req); // ctx.req 是node.js原生的对象; ctx.request 是 koa 的对象

      ctx.body = token;
    };
  }
}

module.exports = AuthToekn;
```

这里有几个注意点：

* http 自带的有多种校验方式，这里使用 `Http Basic Auth`，在使用 postmane 时，它自动地为我们做了处理(base64加密)，模拟发送请求只需要选择 `Basic Auth` 的验证方式，Username 表单中填入 token 即可。
* 服务端解析 token：可以安装 `basic-auth`，然后传入 node.js 的原生对象 `ctx.req`。
* 定义的 m 是访问器属性，使用时不需要作为函数调用。

在 `classic.js` 中使用该中间件：

```javascript
router.get('/latest', new AuthToken().m, async (ctx, next) => {
  // ...
})
```

#### 验证 jwt

```javascript
// middlewares/auth-token.js
const basicAuth = require('basic-auth');

class AuthToekn {
  constructor() {}

  get m() {
    return async function (ctx, next) {
      // userToken: {name: 'token', pass: ''}
      const userToken = basicAuth(ctx.req); // ctx.req 是node.js原生的对象; ctx.request 是 koa 的对象
      let errMsg = 'token不合法';
      let decode;

      if (!userToken || !userToken.name) {
        throw new global.errors.Forbbiden(errMsg);
      }

      try {
        decode = jwt.verify(userToken.name, global.config.security.secretKey);
      } catch (error) {
        // 1. token 不合法 2. token 已过期
        if (error.name === 'TokenExpiredError') {
          errMsg = 'token已过期';
        }

        throw new global.errors.Forbbiden(errMsg);
      }

      // 将用户数据保存在上下文中
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope,
      };

      await next();
    };
  }
}

module.exports = AuthToekn;
```

#### 权限分级控制

权限验证：

* token 合法并且未过期
* 角色：普通用户、管理员...

对权限进行分级。在生成 token 的时候会传入 scope，类型为数字，数字越高代表着权限越大；可以在 `UserAuth` 中定义角色对应的值，如：

```javascript
// auth-token.js
class AuthToken {
  constructor(level = 1) {
    this.level = level;
    // 通过数字定义角色的权限
    AuthToken.USER = 8;
    AuthToken.ADMIN = 16;
    AuthToken.SUPER_ADMIN = 32;
  }
}
```

在生成 token 传入的 scope 值为上述定义的角色：

```javascript
// api/v1/token.js
async function emailLogin(account, secret) {
  const user = await User.verifyEmailPassword(account, secret);

  // email 登陆的是普通用户
  return generateToken(user.id, AuthToken.USER);
}
```

在路由中使用 `AuthToken` 中间件时，可以传入一个数字，表示该路由的权限值，然后在 `AuthToken` 中间件中根据客户端传递的验证信息中得到的自定义数据 `{ uid: 'xxx', scope: 8 }.scope` 和 `this.level` 进行比较，如果用户的角色权限小于当前路由的权限，则抛出 `权限不足` 的异常：

```javascript
// api/v1/classic.js
// ...
router.get('/latest', new AuthToken(9).m, async (ctx, next) => {
  ctx.body = ctx.auth.uid;
});

// auth-token
class AuthToken {
  get m() {
    return async (ctx, next) => {
      // ...
      if (decode.scope < this.level) {
        errMsg = '权限不足';
        throw new global.errors.Forbbiden(errMsg);
      }
    }
  }
}
```

