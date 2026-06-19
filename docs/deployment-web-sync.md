# 网页端部署与多端同步方案

## 一、场景说明

### 你的需求

- 手机和电脑都通过**浏览器访问网页**使用
- 数据需要**多端同步**
- 不需要原生 App（Electron 桌面端、Capacitor 移动端）

### 架构图

```
                    ┌─────────────────────────────────────┐
                    │              Vercel                 │
                    │     Next.js 网页应用 (静态部署)       │
                    └─────────────────────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
    │   Supabase      │  │   阿里云 OSS     │  │   浏览器缓存     │
    │  (记忆数据 JSON) │  │   (照片存储)    │  │  (临时)         │
    └─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 存储分工

| 内容 | 存储位置 | 说明 |
|------|---------|------|
| 记忆数据（文字、日期、城市） | Supabase | JSON，免费 500MB 够用 |
| 照片（用户上传的图片） | 阿里云 OSS | 已在用，不变 |
| 网页应用 | Vercel | Next.js 静态部署 |

---

## 二、为什么这样设计？

### Q: 为什么不用本地存储（localStorage）？

localStorage 只能在浏览器本地存储，**无法跨设备同步**。手机和电脑是不同浏览器，数据不互通。

### Q: 为什么不用阿里云 OSS 存所有数据？

OSS 是**对象存储**，适合存文件（图片），不适合存结构化数据（记忆 JSON）：
- 无法按 key 高效查询
- 读写 JSON 文件需要每次完整下载/上传
- 没有数据库的原子性保证

### Q: 为什么选 Supabase 而不是传统数据库？

Supabase 是 **PostgreSQL + 便捷 API**，你项目已经有现成支持（`lib/server/supabase.ts`）：
- 免费额度够用（500MB 数据库）
- key-value 表正好存你的 memories JSON
- 配置简单，不需要写 SQL

---

## 三、部署步骤

### 第一步：注册 Supabase

1. 访问 [supabase.com](https://supabase.com)，注册账号
2. 点击 **New Project**，创建新项目
3. 记住以下信息（后面用到）：
   - `SUPABASE_URL`（项目设置 → API）
   - `SUPABASE_SERVICE_ROLE_KEY`（项目设置 → API → service_role）

### 第二步：创建数据库表

在 Supabase 后台 **SQL Editor** 中执行：

```sql
-- 创建存储表
CREATE TABLE IF NOT EXISTS map_of_us_store (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 开启 RLS（行级安全）
ALTER TABLE map_of_us_store ENABLE ROW LEVEL SECURITY;

-- 允许公开读取
CREATE POLICY "Allow public read" ON map_of_us_store
  FOR SELECT USING (true);

-- 允许服务角色写入
CREATE POLICY "Allow service role write" ON map_of_us_store
  FOR ALL USING (auth.role() = 'service_role');
```

### 第三步：配置 Vercel 环境变量

1. 登录 Vercel，进入你的项目
2. 点击 **Settings** → **Environment Variables**
3. 添加以下变量：

| 变量名 | 值 |
|--------|-----|
| `SUPABASE_URL` | 你的 Supabase URL |
| `SUPABASE_SERVICE_ROLE_KEY` | 你的 service_role key |
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase URL（公开，需要前缀 `NEXT_PUBLIC_`） |

### 第四步：保留阿里云 OSS 配置

确认你的 OSS 配置已正确（照片上传需要）：

| 变量名 | 说明 |
|--------|------|
| `OSS_ACCESS_KEY_ID` | 阿里云 AccessKey |
| `OSS_ACCESS_KEY_SECRET` | 阿里云 AccessKey Secret |
| `OSS_BUCKET` | OSS Bucket 名称 |
| `OSS_REGION` | OSS 区域（如 `oss-cn-beijing`） |
| `NEXT_PUBLIC_OSS_BUCKET` | Bucket 名称（公开） |
| `NEXT_PUBLIC_OSS_REGION` | 区域（公开） |
| `NEXT_PUBLIC_OSS_DOMAIN` | 自定义域名（可选） |

### 第五步：部署

```bash
git push
```

Vercel 会自动构建部署。

---

## 四、现有代码支持情况

### 已支持的功能

| 功能 | 状态 | 代码位置 |
|------|------|---------|
| 网页端上传图片 | ✅ 已实现 | `app/api/memories/route.ts` |
| 图片上传到 OSS | ✅ 已实现 | `uploadMemoryImages()` 函数 |
| 数据读写 Supabase | ✅ 已实现 | `lib/server/supabase.ts` |
| 多端同步 | ✅ 已实现 | 读写都走 Supabase |

### 代码逻辑

```
用户上传照片 (base64)
       │
       ▼
POST /api/memories
       │
       ▼
uploadMemoryImages()  ──→  上传到阿里云 OSS
       │
       ▼
writeMemoryStore()
       │
       ▼
Supabase 数据库 (JSON)
```

---

## 五、访问方式

部署完成后，所有设备访问同一个网址：

```
https://your-app.vercel.app
```

- 首次访问需要输入站点密码
- 管理功能需要输入管理员密码

---

## 六、注意事项

### 数据安全

- 站点密码和管理员密码控制访问，不是真实用户系统
- 所有用户共享同一套密码（你一个人用够用）
- Supabase 的 service_role key 有写入权限，**不要泄露**

### 免费额度

| 服务 | 免费额度 | 超出后 |
|------|---------|-------|
| Supabase 数据库 | 500MB | $25/月 |
| Supabase 带宽 | 50GB/月 | 按量计费 |
| 阿里云 OSS | 你已购买 | 按量计费 |
| Vercel | 100GB 带宽/月 | 按量计费 |

### 备份

建议定期导出 Supabase 数据备份：

```sql
-- 在 Supabase SQL Editor 执行
SELECT key, value, updated_at FROM map_of_us_store;
```

---

## 七、相关文档

- [architecture.md](./architecture.md) - 项目整体架构
- [supabase-schema.sql](./supabase-schema.sql) - Supabase 表结构
- [Vercel 部署文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
