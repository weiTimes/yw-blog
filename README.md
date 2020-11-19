# 我的博客

[我的博客](https://blog.ywhoo.cn)是使用[Docusaurus 2](https://v2.docusaurus.io/)搭建的，它是一个现代化的静态站点生成器。

## TODO

- [x] 部署
- [x] 子域名
- [x] https
- [x] 支持Typescript
- [ ] travis 自动部署
- [ ] 持续更新前端进阶和博客内容

## Installation

```console
yarn install
```

## Local Development

```console
yarn start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

## Build

```console
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

```console
GIT_USER=<Your GitHub username> USE_SSH=true yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.


## travis

script:
  - git config --global user.name "${GH_NAME}"
  - git config --global user.email "${GH_EMAIL}"
  - echo "machine github.com login ${GH_NAME} password ${GH_TOKEN}" > ~/.netrc
  - yarn && GIT_USER="${GH_NAME}" yarn build