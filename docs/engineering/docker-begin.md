---
id: docker-begin
title: 七步学习 docker
---

> 使用 docker 将 node.js 应用容器化，来展示如何使用docker。

### 什么是 docker

docker 是一种打包方式，通过 docker 打包的应用可以运行在任何操作系统或硬件上。

要知道 docker 是如何工作的，需要知道三个东西，分别是 DockerFile、Image、Container：

* DockerFile 用于构建 Docker Image
* Docker Image 是运行应用的模板
* Contaienr 是正在运行的进程实例

在接下来的示例中，node.js 应用，它是运行在一个具有特定 nodejs 版本的服务器中，并且安装了相应的依赖，但是如果想要在其它机器访问，很难保证一致的 nodejs 版本，docker 通过复制 node.js 应用的环境来解决这类问题。

使用 DockerFile 定义开发环境，然后任何开发人员就可以通过 DockerFile 构建出具有相同环境的不可变镜像，可以将镜像上传到云或自己的服务器，其它开发人员将镜像拉到本地并运行一个容器来运行 node.js 应用。

### 安装 docker

点击[docker官网](https://www.docker.com/get-started)，选择下载对应平台的 docker 桌面应用，它提供了 GUI 和命令行，推荐安装，如下是我安装好的 docker，很方便的查看正在运行的容器，在终端输入 `docker ps`也可以查看当前正在运行的 docker 容器列表。

![](https://ypyun.ywhoo.cn/assets/20210212133548.png)

如果你使用 vscode 进行日常开发，推荐安装 docker 插件，当编写 DockerFile 时，它可以智能地链接到远程注册表：

![docker plugin](https://ypyun.ywhoo.cn/assets/20210212133943.png)

### 编写 DockerFile

首先需要准备一个简易的 node.js 应用，我这里用的是 express。

新建 `nodejs-with-docker` 目录、`index.js`，在终端执行：

```shell
yarn init -y
yarn add express -D
```

编写 `index.js`

```javascript
const app = require('express')();

app.get('/', (req, res) => {
  res.json({ message: 'Docker is easy!' });
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`app listening on http//localhost:${port}`));
```

在`package.json`加入如下代码：

```json
{
    "scripts": {
        "start": "node index.js"
    }
}
```

现在我们已经准了一个 node.js 应用，当执行 `yarn run start` 时，它默认监听 8080 端口，当访问跟路由时，会返回一个 json 格式的数据。

新建 `DockerFile`，内容如下：

```DockerFile
FROM node:12

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

ENV PORT=8080

EXPOSE 8080

CMD ["yarn", "start"]
```

由于安装了 docker 插件，在编辑 DockerFile 的时候，当鼠标移动到关键词上，会有其解释，或可跳转到对应的地址：

![](https://ypyun.ywhoo.cn/assets/20210212135144.png)

接下来逐个解释上述 DockerFile 中指令的作用：

* `FROM`: 基础镜像，即将要构建的镜像是基于，[node.js v12](https://hub.docker.com/_/node/)。
* `WORKDIR`: 工作目录。
* `COPY`: 将源文件复制到目标路径中。为了能够缓存安装的依赖，我将 package.json 和 yarn.lock 都复制到工作目录，这样就不必每次都重新安装；`COPY . .` 将当前项目所有文件都复制到 docker 的工作目录，但是需要忽略 node_modules，新建 `.dockerignore`，写入 `node_modules`，这样镜像中就有了我们的源代码。
* `RUN`: 执行 shell 命令，这里是使用 `yarn` 安装依赖。
* `ENV`: 设置环境变量。
* `EXPOSE`: 定义 docker 容器在运行时监听的端口。
* `CMD`: 告诉 docker 如何启动应用，它不会启动一个 shell session，也就是说当终端退出，该应用仍然在运行中。

### 构建镜像

有了 DockerFile，就可以构建镜像了：

```shell
docker build -t yehoo/demoapp:1.0 .
```

* `-t` 后面跟的是镜像名称，这个由我们自定义，建议使用 DockerHub 的用户名为开头，然后是斜杠、镜像名，后面跟`:1.0`表示的是版本号。
* 最后一个 `.` 表示的使用当前路径下的 DockerFile 进行构建镜像。

### 运行容器

构建完镜像后，可以拿到镜像 id，然后执行以下命令运行容器：

```shell
docker run 587d4f94eeca
```

运行成功后，监听的8080端口是在容器内可访问，但是作为宿主机仍无法访问，所以要定义宿主机和docker容器端口的映射关系：

```shell
docker run -p 8080:8080 587d4f94eeca
```

### 持久化容器数据

到目前为止，如果将容器关闭，那么它运行时产生的数据就是消失，这时候就需要用到卷，它用来存储我们的容器数据，使得多个容器之间也可以共享数据。

运行如下命令创建卷：

```shell
docker volume create shared-stuff
```

### Docker Compose

通常一个容器对应一个进程，使用 docker compose 可以同时运行多个不同的容器

新建 `docker-compose.yml`，代码如下：

```yml
version: '3'
services:
  web:
    build: .
    ports:
      - '8080:8080'
  db:
    image: 'mysql'
    environment:
      MYSQL_ROOT_PASSWORD: password
    volumes:
      - db-data:/foo
```

执行 `docker-compose up`，如果运行成功，则同时运行了两个容器，一个是 node.js 应用，一个是 mysql 服务。

### TODO

- [ ] docker 工作原理
- [ ] 卷
 - [ ] pm2