# Map for Love 项目架构文档

## 一、项目概述

**Map for Love** 是一个**本地优先的情侣记忆地图应用**，基于 Map of Us 进行深度二次创作。主要功能是在中国地图上记录和展示情侣去过的地方、照片和回忆。

### 核心特点

- 数据可完全存储在本地（JSON 文件），也可选择阿里云 OSS 云端存储
- 支持多端打包：桌面应用（Electron）、Android 应用（Capacitor）、网页版
- 密码保护入口，支持管理员模式

---

## 二、技术栈

| 类别 | 技术 |
|------|------|
| **框架** | Next.js 16 App Router (页面和 API) |
| **UI 库** | React 19, Tailwind CSS 4, Framer Motion (动画) |
| **桌面端** | Electron 42 |
| **移动端** | Capacitor 8 (Android APK) |
| **地图渲染** | D3-Geo (地理数据可视化) |
| **云存储** | 阿里云 OSS (ali-oss), Supabase (可选) |
| **图片处理** | Sharp (压缩), exifr (EXIF 解析) |
| **图标** | Lucide React |
| **语言** | TypeScript |

---

## 三、目录结构

```
map-for-love/
├── app/                    # Next.js 16 App Router 页面和 API
│   ├── api/               # API 路由
│   │   ├── auth/          # 认证 API (login, password)
│   │   ├── memories/      # 回忆 CRUD API
│   │   ├── login-photos/  # 登录页照片 API
│   │   ├── city-assets/  # 城市地标 API
│   │   ├── settings/      # 设置 API
│   │   └── city-assets/oss/  # OSS 相关
│   ├── map/              # 主地图页面
│   ├── memories/          # 回忆管理页面
│   ├── landmarks/         # 地标管理
│   ├── anniversaries/    # 纪念日
│   ├── favorites/         # 收藏地点
│   ├── time-capsule/     # 时光宝盒
│   ├── weather/          # 天气城市
│   ├── settings/         # 设置页
│   ├── demo/             # 演示页面
│   └── login-photos/     # 登录照片页
├── components/            # React 组件
│   ├── ChinaMap.tsx      # 中国地图主组件
│   ├── ProvinceMap.tsx   # 省份地图
│   ├── EntryExperience.tsx  # 登录入口体验
│   ├── HomeProgress.tsx  # 主页进度组件
│   ├── TimelineOverlay.tsx  # 时间线覆盖层
│   ├── MemoryArchive.tsx  # 回忆存档
│   ├── memory/           # 回忆相关组件 (CityPanel, MemoryImage)
│   ├── province/         # 省份组件 (CitySearchSelect, Lightbox)
│   └── shared/           # 共享组件
├── lib/                   # 工具库
│   ├── client/           # 客户端工具
│   │   ├── auth.ts       # 客户端认证
│   │   ├── oss.ts        # 客户端 OSS
│   │   └── storage.ts    # 存储抽象
│   └── server/           # 服务端工具
│       ├── auth.ts       # 服务端认证 (HMAC token)
│       ├── oss.ts        # OSS 上传 (ali-oss)
│       ├── supabase.ts   # Supabase 集成
│       └── dataDir.ts    # 数据目录管理
├── data/                  # 静态数据和配置
│   ├── memories.ts        # 回忆类型定义
│   ├── provinces.ts      # 中国省份数据
│   ├── cities.ts         # 城市数据
│   ├── loginPhotoStore.ts  # 登录照片存储
│   ├── appSettings.ts    # 应用设置
│   ├── china-geo.json   # 中国地理 JSON (d3-geo)
│   └── *.private.json    # 私有数据文件 (gitignore)
├── electron/              # Electron 桌面端
│   └── main.js           # 主进程入口
├── android/               # Capacitor Android 工程
├── public/               # 静态资源
├── docs/                  # 文档
│   └── supabase-schema.sql  # Supabase 数据库 Schema
└── scripts/              # 构建脚本
```

---

## 四、核心功能模块

### 4.1 记忆系统 (Memories)

- 按城市记录回忆，包含日期、照片、文字描述
- 支持心情标签（开心、浪漫、甜蜜、悲伤、惊喜、平静）
- 每种心情有专属颜色，会影响地图标记点和轨迹光效
- EXIF 批量导入：自动解析照片的拍摄时间和 GPS 信息

### 4.2 地图展示

- **中国地图**：使用 D3-Geo 渲染，显示各省份
- **省份详情**：点击省份进入查看该省城市回忆
- **时间线模式**：电影播放模式，按时间顺序展示旅行轨迹
- **拍立得气泡**：时间线播放时弹出复古风格照片

### 4.3 认证系统

- 双重密码：站点密码（进入应用）+ 管理员密码（修改设置）
- HMAC-SHA256 签名 Token，存储在 HttpOnly Cookie
- 桌面版首次启动自动生成 `auth.local.json`

### 4.4 存储架构

- **本地优先**：所有数据以 `.json` 存储在 `data/` 目录
- **云端可选**：配置阿里云 OSS 后自动上传图片
- **优雅降级**：未配置 OSS 时自动回退到本地 Base64 存储
- 备份导出/导入功能（JSON 格式）

### 4.5 设置系统

- 纪念日管理（支持自动倒计时）
- 天气城市配置
- 登录页照片和文案自定义
- 情侣 Logo 设置
- OSS 配置面板

---

## 五、API 路由

| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/auth/login` | POST | 登录验证 |
| `/api/auth/password` | POST/PUT | 修改密码 |
| `/api/memories` | GET/POST/PUT/DELETE | 回忆 CRUD |
| `/api/login-photos` | GET/POST/PUT/DELETE | 登录照片管理 |
| `/api/city-assets` | GET/POST/PUT/DELETE | 城市地标管理 |
| `/api/settings/oss` | GET/POST/DELETE | OSS 配置 |

---

## 六、数据模型

```typescript
// 回忆 (Memory)
interface Memory {
  id: string;
  cityId: string;
  city: string;
  cityEn: string;
  date: string;           // YYYY.MM.DD 格式
  image: string;          // 主图
  photos?: string[];      // 多张照片
  text: string;           // 回忆文字
  createdAt?: string;
  draft?: boolean;
  mood?: 'happy' | 'romantic' | 'sweet' | 'sad' | 'surprised' | 'calm';
}

// 省份 (Province)
interface Province {
  id: string;
  adcode: number;
  name: string;
  nameEn: string;
  lit: boolean;           // 是否"点亮"
}
```

---

## 七、私有数据文件

以下文件被 `.gitignore` 忽略，不会提交到 Git：

```
data/localMemories.private.json   # 回忆数据
data/cityAssets.private.json      # 城市地标
data/loginPhotos.private.json     # 登录页照片
data/ossConfig.private.json       # OSS 密钥
```

---

## 八、构建与部署

### 构建脚本

| 命令 | 功能 |
|------|------|
| `npm run dev` | 开发模式（端口 3002） |
| `npm run build` | 生产构建 |
| `npm run desktop:prepare` | 打包桌面版准备 |
| `npm run dist:win` / `dist:mac` | 生成安装包 |
| `npm run cap:open` | 打开 Android 项目 |

### 部署目标

- **网页开发**：直接 `npm run dev`
- **桌面应用**：Electron + Next.js standalone
- **Android 应用**：Capacitor + `npm run cap:open`

---

## 九、初始配置

- 初始进入密码：`1234`
- 初始管理员密码：`1234`
- 数据目录：`data/`
- 中国地理数据：`data/china-geo.json`

---

## 十、相关文档

- [README.md](../README.md) - 详细使用说明和功能介绍
- [AGENTS.md](../AGENTS.md) - Next.js Agent 规则
- [supabase-schema.sql](./supabase-schema.sql) - Supabase 数据库 Schema（可选云端方案）
