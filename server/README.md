# bing-serve

### 使用 node.js 构建的必应每日一图服务端



### 环境准备

- 本项目基于 `Node.js 14` 开发，建议运行环境的Node版本大于此版本
- MySql



### 配置

#### 用户配置

用户配置文件在 `data/config.js` 。

这个配置文件中的配置项可以由用户自定义。

请复制完整配置文件 `data/config-full.js` 中的内容并创建 `data/config.js` 。用户配置文件中包含了基础配置和数据库配置。

```javascript
// 用户配置文件 config.js

// 基础配置
const baseConfig = {
  port: 3000, // 服务启动端口号
  updateTime: "00:01:00", // 每天更新时间 (开始从必应官方服务器下载图片的时间)
  DelayTime: 5, // 延迟时间（分钟） 即每天00:05：00的时候才显示当天的图片。性能较差的实例应适当调大此值 (仅针对'/api/getImage'接口)
  surviveDays: 90, // 图片存活天数（即图片保存多少天，到期即清理） 0为不清理
  retryTimeout: 10000, // 错误重试间隔。共重试10次，每次间隔时间递增，这里指的是首次间隔时间 (单位:ms)
  key: 'abcdefgh', // 鉴权密钥。用于需要鉴权才能访问的接口
};

// 数据库配置 (注意：除数据库连接池大小外，以下配置项提及的内容需在安装前准备好并填入)
const databaseConfig = {
  host: "127.0.0.1", // 数据库链接地址
  port: "3306", // 数据库连接端口
  database: "bing", // 数据库名
  user: "bing", // 数据库用户名
  password: "bing", // 数据库密码
  connectionLimit: 100, // 数据库连接池大小
};

// 网站信息配置
const infoConfig = {
  link: [
    {
      label: "必应每日一图", // 链接名称
      url: "https://bing.com/" // 链接地址
    },
    {
      label: "必应每日一图",
      url: "https://bing.com/"
    }
  ],
  copyright: `Copyright © 2020-2026`, // 版权信息
  htmlSlot: {
    beforeFooter: ``, // 页脚上方HTML插槽
    afterFooter: `` // 页脚下方HTML插槽
  }
}

module.exports = {
  baseConfig,
  databaseConfig,
  infoConfig,
};
```



#### 内部配置

用户配置文件在 `config/config.js` 。

这个配置文件中的配置项是默认的，无法在docker版本中由用户自定义。

内部配置文件中包含了安装配置、API基础配置、API接口路径配置。

```javascript
// 内部配置文件 config.js

// 安装配置
const installConfig = {
  databaseVersion: 1,
  dir: "data/resources", // 图片在服务端的真实保存路径 (相对于根目录、首尾不能为'/'')
  databaseTable: "bing", // 数据库表名-数据 (可在安装前更改)
  databaseTableInfo: "info", // 数据库表名-信息 (可在安装前更改)
}

// API基础配置
const apiBaseConfig = {
  static: "img", // 图片静态托管路径 (url访问图片时的路径、首尾不能为'/'')
}

// API接口后缀配置(接口url后缀、首尾不能为'/'')
const apiConfig = {
  UPDATE: "api/update", // 手动更新图片（需要key）
  DELETE: "api/delete", // 手动清理图片（需要key）
  GET_IMAGE: "api/getImage", // 获取当天图片
  GET_LIST: "api/getList", // 获取图片列表
  GET_INFO: "api/getInfo", // 获取图片详情
  GET_WEBINFO: "api/getWebInfo", // 获取网站信息
  GET_BING: "api/getBing", // 获取随机图片
  GET_RANDOM_INFO: "api/getRandomInfo", // 获取随机数据信息
};

module.exports = {
  installConfig,
  apiBaseConfig,
  apiConfig,
};

```



### 安装

##### 安装依赖

```
npm install
```



### 启动

#### 生产环境

```
npm run serve
```

#### 开发环境

```
npm run dev
```



# 🖼️ QWQ 图片 API 接口文档

**Base URL:** `https://qwq.gs/api`

---

## 1. 获取今日图片
直接重定向或返回当天的图片资源。可直接用于 `<img>` 标签的 `src` 属性。

- **请求地址**: `/getImage`
- **请求方法**: `GET`
- **请求参数**: 无
- **示例**: 
  `https://qwq.gs/api/getImage`

---

## 2. 获取图片列表
支持分页查询历史图片数据。

- **请求地址**: `/getList`
- **请求方法**: `GET`
- **请求参数**:

| 参数名 | 类型 | 说明 | 示例 |
| :--- | :--- | :--- | :--- |
| `pageSize` | Number | 每页数据条数 | 10 |
| `currentPage` | Number | 当前目标页码 | 1 |

- **返回示例**:
```json
{
    "totle": 10,
    "list": [
        {
            "id": 7,
            "title": "亚伯拉罕湖中的树 (© Getty Images)",
            "date": "2021-04-15",
            "url": {
                "hd": "https://qwq.gs/img/...",
                "uhd": "https://qwq.gs/img/...",
                "thumbnail": "https://qwq.gs/img/..."
            },
            "color": {
                "Vibrant": "#24a3c8",
                "Muted": "#5182ac"
            },
            "timestamp": "2021-04-15T08:34:50.000Z"
        }
    ]
}
```

---

## 3. 获取图片详情
通过图片 ID 获取指定图片的详细元数据。

- **请求地址**: `/getInfo`
- **请求方法**: `GET`
- **请求参数**:

| 参数名 | 类型 | 说明 | 示例 |
| :--- | :--- | :--- | :--- |
| `id` | Number | 数据唯一 ID | 1 |

- **返回示例**:
```json
{
    "info": {
        "id": 1,
        "title": "塞勒斯堡的玉米迷宫 (© Getty Images)",
        "date": "2023-10-23",
        "base64": "data:image/jpeg;base64,...",
        "url": {
            "hd": "/img/2023/10/23/2023-10-23_hd.jpg",
            "uhd": "/img/2023/10/23/2023-10-23_uhd.jpg",
            "thumbnail": "/img/2023/10/23/2023-10-23_hd_thumbnail.jpg"
        }
    }
}
```

---

### 📝 说明
1. **图片地址**: 详情接口返回的 `url` 若为相对路径（如 `/img/...`），需自行拼接前缀 `https://qwq.gs`。
2. **颜色提取**: `color` 字段包含了图片调色板信息，可用于 UI 适配。
3. **Base64**: `base64` 字段可用于在图片加载完成前的占位展示。