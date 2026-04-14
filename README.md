<div align="center">
  <h1>必应每日一图</h1>
  <p>每天更新一张图片（来源：必应）。诗曰：沉舟侧畔千帆过。一起来领略世界之美吧！</p>
  <p>DEMO: https://QWQ.GS</p>
</div>



## 1.特点

 - 必应搜索每天会更新一张高质量的图片，用来做壁纸再好不过了，每天都有新心情。
 - 这本项目有前后端，支持回溯，可以获取这几种处理后的图：缩略图、高斯模糊、灰度，同时有HD、UHD。
 - 为了配合[Pmage](https://github.com/androidmumo/pmage)使用，接口还会返回base64格式的极小缩略图。
 - 服务端还会提取图片的主要颜色，以使前端使用这些主要颜色渲染漂亮的页面。

## 2.Docker部署

本项目提供了Docker版本。现在，您无需关注前后端如何部署。只需要简单的启动Docker镜像，即可拥有完全由您自己控制的服务。
docker镜像: `ghcr.io/ham0mer/bing:main`

### 2.1创建目录&下载配置

 `/opt`目录下创建`bing`目录。用于存储项目数据。
 根目录执行以下命令：
  ```bash
  mkdir -p /opt/bing
  cd /opt/bing
  wget -O config.js https://raw.githubusercontent.com/Ham0mer/bing/refs/heads/main/server/data/config-full.js
  ```
  将`config.js`文件中的配置项填写好，保存。
 

### 2.2下载Docker Compose文件

 `/opt/bing`目录下执行以下命令：
  ```bash
  wget -O docker-compose.yml https://raw.githubusercontent.com/Ham0mer/bing/refs/heads/main/docker-compose.yml
  ```
  启动Docker Compose服务：
  ```bash
  docker compose up -d && docker compose logs -f -t
  ```
 在容器启动时，程序会自动拉取当天图片并进行处理，这时您看到的页面可能是空的。别急，只要稍等片刻(依据您的服务器性能而定)，图片便会处理完毕，刷新页面即可看到当天图片。



## 3.其他文档

### 3.1.[服务端文档](./server/README.md)

### 3.2.[前端文档](./client/README.md)

