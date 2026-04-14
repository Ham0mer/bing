# 必应每日一图

<div align="center">
<img src="https://img.shields.io/badge/Docker-Supported-blue?logo=docker&logoColor=white" alt="Docker Supported">
<img src="https://img.shields.io/badge/License-MIT-green" alt="License">
<img src="https://img.shields.io/badge/Demo-QWQ.GS-orange" alt="Demo">
</div>

<br>

<div align="center">
<p><b>沉舟侧畔千帆过，病树前头万木春。</b></p>
<p>每天自动同步必应搜索的高质量壁纸，带你领略世界之美。</p>
<a href="https://QWQ.GS"><strong>查看演示 (DEMO) »</strong></a>
</div>

-----

## ✨ 项目特点

  * **全自动更新**：每日定时同步必应搜索封面，让你的壁纸每天都有新心情。
  * **全栈支持**：自带精美的前后端实现，支持历史图片回溯查看。
  * **多维度处理**：
      * **画质丰富**：支持 **HD** 与 **UHD** 超清解析。
      * **特效接口**：支持实时生成 **缩略图**、**高斯模糊**、**灰度图**。
      * **极致优化**：专为 [Pmage](https://www.google.com/search?q=https://github.com/androidmumo/pmage) 优化，提供 Base64 极小缩略图。
  * **智能配色**：服务端自动提取图片 **主色调**，前端可根据颜色自动适配 UI，视觉更和谐。

-----

## 🚀 Docker 快速部署

使用 Docker 部署，你无需关心环境配置，只需一行命令即可拥有属于自己的镜像服务。

> **镜像地址**：`ghcr.io/ham0mer/bing:main`

### 1\. 环境准备

在 `/opt` 目录下创建项目文件夹并下载配置文件：

```bash
mkdir -p /opt/bing && cd /opt/bing

# 下载完整配置文件
wget -O config.js https://raw.githubusercontent.com/Ham0mer/bing/refs/heads/main/server/data/config-full.js
```

> [\!TIP]
> 请在启动前编辑 `config.js`，根据你的实际需求填写配置项。

### 2\. 编排与启动

下载 `docker-compose.yml` 并启动服务：

```bash
# 下载编排文件
wget -O docker-compose.yml https://raw.githubusercontent.com/Ham0mer/bing/refs/heads/main/docker-compose.yml

# 启动服务并查看日志
docker compose up -d && docker compose logs -f -t
```

> [\!NOTE]
> **首次启动提示**：程序启动时会自动拉取并处理当天图片。如果页面暂时空白，请稍等片刻，待处理完成后刷新即可。

-----

## 📖 更多文档

| 文档类型 | 链接地址 |
| :--- | :--- |
| **服务端 (Backend)** | [进入查看](./server/README.md) |
| **前端 (Frontend)** | [进入查看](./client/README.md) |

-----

<div align="center">
<sub>Built with ❤️ by Ham0mer</sub>
</div>