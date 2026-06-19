# Map for Love · 移动端 Web 优化需求文档

> 基于小陈体验报告（2026-06-18）整理
> 目标：将网页版手机端体验提升至与桌面端同等情感温度

---

## 一、现状总结

### 1.1 当前页面结构

```
app/page.tsx  →  EntryExperience.tsx（登录页）
                ↓ 密码验证成功
app/map/page.tsx  →  主地图页 + MobileBottomNav.tsx（移动端底部导航）
```

### 1.2 响应式实现原理

使用 Tailwind CSS 断点区分移动端/桌面端：

| 断点 | 屏幕宽度 | 设备 |
|---|---|---|
| 无前缀 | < 1024px | 手机、平板竖屏 |
| `lg:` 前缀 | ≥ 1024px | 平板横屏、桌面端 |

**重要**：屏幕宽度决定样式，而非设备类型。手机浏览器打开即显示移动端样式，两者互不影响。

### 1.3 当前移动端 vs 桌面端登录页对比

| 元素 | 桌面端（≥1024px） | 移动端（<1024px，现状） |
|---|---|---|
| 拍立得相册 | 右半屏大框，4秒轮播，hover弹性回正 | ❌ 左下角小按钮，默认收起 |
| 9个城市印戳 | 桌面端展示在拍立得下方 | ❌ 隐藏 |
| 背景云/太阳 | 视差跟随动效 | ❌ 几乎无背景 |
| 像素情侣头像 | 密码盘上方，小尺寸 | ❌ 仅一个像素小心形 |
| 纪念日倒数 | 无 | 无 |
| 整体氛围 | 手账感，温柔，高情感温度 | ❌ 像旅游App，缺乏私密感 |

### 1.4 当前移动端底部 Tab

仅 3 个：地图 / 相册 / 我的

以下功能需 3 次点击才能到达：
- 纪念日：我的 → 设置 → 纪念日
- 时光宝盒：我的 → 设置 → 时光宝盒
- 收藏、旅行倒数、地标、天气：同样埋在深处

---

## 二、优化目标

### 核心原则
**让用户"还没输密码就感觉被认出是『我们的』"**——手机打开网页，第一眼看到的应该是"我们"的元素，而不是一个空的密码盘。

### 目标效果
- 移动端登录页：情感温度与桌面端持平
- 移动端功能入口：从 3 次点击 → 1 次点击
- 移动端上传入口：从 3 次点击 → 可见可触达
- 网页端与 Android APK：共用同一套代码，数据互通（已实现）

---

## 三、详细优化需求

### 🔴 P0-1：移动端登录页重构

**涉及文件**：`components/EntryExperience.tsx`

**目标效果**：手机浏览器打开 `/` 时，看到的是一个带有强烈"我们"氛围的登录页，不需要输入密码就已经感受到这是专属的情侣回忆 App。

**具体改动**：

#### 3.1.1 页面顶部区域（从上到下）

```
┌────────────────────────────────────┐
│  [淡地图轮廓背景 + 云雾动效]         │
│                                    │
│     ♡ 我们的时光地图                 │  ← 品牌标题（中文）
│     [像素情侣双头像 logo，大尺寸]     │  ← avatar-us.png 放大显示
│                                    │
│     「今天是在一起的第 358 天」       │  ← 纪念日倒数，根据日期自动计算
│     「距离下一个纪念日还有 23 天」    │  ← 下一个纪念日名称 + 天数
└────────────────────────────────────┘
```

#### 3.1.2 城市印戳横滑区（替代原来的小按钮）

```
┌────────────────────────────────────┐
│  [城市照片全屏横滑卡片]              │
│  ← 左右滑动切换，每张带心情色光晕     │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 📷                           │  │
│  │      杭州 · 春日湖畔          │  │
│  │  「风从西湖边吹过来，像把那一天  │  │
│  │   重新翻开。」                │  │
│  └──────────────────────────────┘  │
│                                    │
│  ○ ○ ● ○ ○ ○ ○ ○ ○  （9个指示点）  │
└────────────────────────────────────┘
```

#### 3.1.3 城市印戳 Mini 横滑条

```
┌────────────────────────────────────┐
│  ○杭州  ○上海  ●澳门  ○武汉  ○香港  │  ← 可横滑，点击跳转对应省份
│    ○青岛  ○郑州  ○珠海  ○广州       │
└────────────────────────────────────┘
```

#### 3.1.4 密码盘区域

- 保留 4 位数字密码盘（不变）
- 密码输入错误时的抖动动画 + 暖红色描边（`box-shadow: 0 0 0 4px rgba(232,132,90,.25)`）
- 密码正确后的过渡动画：fade out 登录页 → fade in 主地图

#### 3.1.5 背景云雾动效

- 移动端同样保留淡色地图轮廓背景
- 加入 `lg:` 以下的云雾 CSS 动效（参考 `globals.css` 里 `map-mist-band` 的实现）
- 不要让背景是纯白——小陈的反馈是"我以为这是个旅游 App"，纯白背景是重要原因

#### 3.1.6 桌面端保持不变

桌面端（`lg:` 及以上）维持原有效果：
- 右半屏拍立得大框 + 9 个印戳
- 视差跟随动效
- 整体手账氛围

---

### 🔴 P0-2：移动端底部 Tab 从 3 个改为 5 个

**涉及文件**：`components/MobileBottomNav.tsx`

**目标**：重要功能一步触达

| 当前（3个） | 建议（5个） | 说明 |
|---|---|---|
| 地图 | 地图 | 不变 |
| 相册 | 相册 | 不变 |
| 我的 | **纪念日** | 新增独立 Tab |
| — | **时光宝盒** | 新增独立 Tab |
| — | 我的 | 从"我的"改名，保持功能不变 |

**合并到"我的"二级的内容**：
- 收藏地点
- 旅行倒数
- 地标管理
- 天气城市
- 登录照片
- 设置
- 修改密码

**Tab 图标建议**：

| Tab | 图标（lucide） | 说明 |
|---|---|---|
| 地图 | `Map` | 不变 |
| 相册 | `Image` | 不变 |
| 纪念日 | `Heart` 或 `Calendar` | 新增 |
| 时光宝盒 | `Archive` 或 `Package` | 新增 |
| 我的 | `User` | 不变 |

---

### 🔴 P0-3：纪念日独立 Tab 页面

**涉及文件**：`app/anniversaries/page.tsx` 或在 `components/memory/Anniversaries.tsx` 基础上改造

**目标**：打开"纪念日" Tab，直接看到所有纪念日和倒数

**页面布局**：

```
┌────────────────────────────────────┐
│  📅 纪念日                          │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ ❤️ 在一起      第 358 天       │  │  ← 主纪念日卡片（最大）
│  │ 2025.01.01                  │  │
│  │ 距离下一个纪念日还有 23 天      │  │
│  └──────────────────────────────┘  │
│                                    │
│  所有纪念日列表：                     │
│  ┌──────────────────────────────┐  │
│  │ 🎂 3 周年纪念    2025.01.01  │  │
│  │ 杭州见面        358天前       │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ 💮 100天        2024.10.08   │  │
│  │ 第一次旅行      23天前        │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ 📆 明天: 武汉之约  2024.03.15  │  │
│  │              倒计时1天 🔴      │  │
│  └──────────────────────────────┘  │
│                                    │
│  [ + 新增纪念日 ]                   │
└────────────────────────────────────┘
```

**关键数据来源**：
- `data/appSettings.ts` 中的 `anniversaryDate`（主纪念日）
- `data/progress.ts` 中的纪念日列表（如果有）
- 下一个纪念日的天数：计算 `anniversaryDate` 与当前日期的差值

---

### 🟡 P1-1：时光宝盒独立 Tab 页面

**涉及文件**：`app/time-capsule/page.tsx` 或在 `components/memory/TimeCapsule.tsx` 基础上改造

**目标**：一眼看到所有宝盒的锁/解锁状态

**页面布局**：

```
┌────────────────────────────────────┐
│  📦 时光宝盒                        │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 🔒 给三年后的我们              │  │  ← 锁定状态
│  │ 解锁日期: 2028.01.01          │  │
│  │ [还有 584 天]                 │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 🔓 第一次旅行的约定            │  │  ← 已解锁
│  │ 解锁日期: 2024.03.15          │  │
│  │ [已解锁 · 点击打开]   →        │  │
│  └──────────────────────────────┘  │
│                                    │
│  [ + 创建新宝盒 ]                   │
└────────────────────────────────────┘
```

**已解锁宝盒点击后的效果**（可选 P2）：
- framer-motion 3D 旋转开盒动画
- 像素情侣从盒子里探出头

---

### 🟡 P1-2：统一 Toast 反馈组件

**涉及文件**：新增 `components/shared/Toast.tsx` + `components/shared/ToastProvider.tsx`

**问题**：当前至少有 5 种错误反馈风格，包含原生 `alert()` 弹窗（严重破坏氛围）

**现状错误反馈位置**：
- `components/memory/Landmarks.tsx:50,65,74,85` — `alert("请先进入管理员模式")` 等
- `components/memory/Settings.tsx` — `setStatus()` 状态条
- `components/EntryExperience.tsx:325` — 密码抖动（这个是正确的）

**建议的 Toast 规范**：

| 类型 | 颜色 | 自动消失 | 适用场景 |
|---|---|---|---|
| `success` | 薄荷绿 `#A8C89A` | 3秒 | 保存成功、上传完成 |
| `error` | 暖红 `#E8845A` | 5秒 | 操作失败、网络错误 |
| `info` | 樱粉 `#E8B8C2` | 3秒 | 提示性信息 |

**实施步骤**：
1. 创建 `Toast` 组件
2. 创建 `ToastProvider`（全局状态管理）
3. 替换 `Landmarks.tsx` 里的 4 个 `alert()`
4. 统一 `Settings.tsx` 的 `setStatus()` 为 `toast.success()` / `toast.error()`

---

### 🟡 P1-3：相册 Tab 批量导入入口提前

**涉及文件**：`components/memory/Settings.tsx`（搬入位置）、`components/MemoryArchive.tsx`（新加入口）

**问题**：批量导入功能藏在「我的 → 设置 → 向下滚动」深处，用户不知道有这个功能

**建议**：
- 在「相册」Tab 页面顶部加一个「+ 导入照片」卡片
- 点击后跳转到 Settings 的批量导入界面（或直接展开批量导入组件）

```
┌────────────────────────────────────┐
│  相册                    [筛选心情▼] │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 📷 + 导入照片                │  │  ← 新增入口
│  │ 批量导入手机里的照片，自动整理  │  │
│  └──────────────────────────────┘  │
│                                    │
│  [照片网格，按时间倒序]              │
└────────────────────────────────────┘
```

---

### 🟡 P1-4：心情筛选器

**涉及文件**：`components/MemoryArchive.tsx`

**目标**：在相册页顶部加 6 个心情 chip，可按心情筛选回忆

**UI**：

```
[全部] [😁开心] [🌹浪漫] [🥰甜蜜] [😌平静] [🤩惊喜] [🥲悲伤]
```

点击某个心情 chip，只显示该心情的回忆（筛选条件：`memory.mood === selectedMood`）

**心情颜色来源**：`data/memories.ts` 中的 `moodConfig`

---

### 🟢 P2-1：Onboarding 新手引导

**涉及文件**：检测 `app/map/page.tsx`

**目标**：首次进入 `/map` 时显示 5 步引导浮层

**5 个引导步骤**（用 framer-motion AnimatePresence）：
1. 「点地图上任意省份开始」
2. 「点城市写第一条回忆」
3. 「按时间线看我们的故事」
4. 「试试修改密码，改成纪念日」
5. 「完成」按钮 → 写入 `localStorage["mapofus:onboarded"]` → 3秒后自动消失

**预计工作量**：0.5 天

---

### 🟢 P2-2：空态使用像素情侣素材

**涉及文件**：`components/memory/MemoryToolPage.tsx`、`components/MemoryArchive.tsx`

**已有素材**（`public/sprites/characters/`）：
- `avatar-us.png` — 双人头像素图
- `couple-sitting.png` — 坐着的情侣
- `couple-pointing.png` — 指着远方的情侣
- `couple-standing.png` — 站立的情侣

**4 个空态场景应用**：

| 场景 | 素材 | 文案 |
|---|---|---|
| 纪念日空 | `couple-sitting.png` | "我们的第一个纪念日从今天开始" |
| 收藏空 | `couple-pointing.png` | "还没收藏任何地点，去地图上看看吧" |
| 旅行空 | `couple-standing.png` | "还没去过新城市，第一个目的地是哪里？" |
| 时光宝盒空 | `couple-sitting.png` | "往时光宝盒里存点什么吧" |

---

### 🟢 P2-3：Landing Page（公开展示页）

**涉及文件**：新增 `app/landing/page.tsx`（独立路由，不在导航中暴露）

**目标**：分享给朋友时，对方无需登录即可看到"我们的"内容

**页面布局**：

```
┌────────────────────────────────────┐
│  [淡地图背景 + 城市光点动画]          │
│                                    │
│  ♡ 我们的时光地图                    │
│  「记录我们走过的每一座城市」          │
│                                    │
│  🗺️ 已点亮 12 个城市                 │
│  ❤️ 在一起 358 天                   │
│  📅 下一个纪念日：23天后             │
│                                    │
│  [城市地图预览（静态，不可交互）]       │
│  [最近 3 条回忆卡片横滑]            │
│                                    │
│  ————————————————                   │
│  一起来记录我们的故事 →              │
│  [跳转 /map 登录页]                │
└────────────────────────────────────┘
```

**特点**：
- 无需登录即可访问（`/landing`）
- 纯展示，数据从 `localStorage` 读取（对方必须已登录过、数据在浏览器里）
- 或者做成"邀请码"模式，需要输入一个分享码才能看

---

## 四、品牌和命名统一

### 4.1 当前问题

| 项目 | 当前值 | 建议 |
|---|---|---|
| package.json `name` | `"map"` | `"map-for-love"` |
| layout.tsx `<title>` | `"Map for Love"` | `"我们的时光地图"` |
| PWA `short_name` | `"Map for Love"` | `"时光地图"` |
| 登录页大标题 | 无 | 加"欢迎回来"或"输入我们的纪念日" |

### 4.2 建议的品牌体系

| 场景 | 名称 |
|---|---|
| 产品正式名称 | 我们的时光地图 |
| 暗色模式名称（如后续做） | 月光（呼应"月光下相识"） |
| 密码提示文案 | 输入纪念日（已有，保持） |
| 桌面端 Hero 文案 | "欢迎回来" |

---

## 五、技术实现说明

### 5.1 文件改动清单

| 优先级 | 文件 | 改动类型 |
|---|---|---|
| P0-1 | `components/EntryExperience.tsx` | 重构移动端 UI |
| P0-2 | `components/MobileBottomNav.tsx` | Tab 数量和内容调整 |
| P0-3 | `app/anniversaries/page.tsx` | 新建或改造纪念日 Tab 页面 |
| P1-1 | `app/time-capsule/page.tsx` | 新建或改造时光宝盒 Tab 页面 |
| P1-2 | `components/shared/Toast.tsx` | 新增文件 |
| P1-2 | `components/shared/ToastProvider.tsx` | 新增文件 |
| P1-2 | `components/memory/Landmarks.tsx` | 替换 alert() |
| P1-3 | `components/MemoryArchive.tsx` | 加导入入口、心情筛选器 |
| P1-4 | `components/memory/MemoryToolPage.tsx` | 空态插画 |
| P2-1 | `app/map/page.tsx` | 加 Onboarding 检测 |
| P2-3 | `app/landing/page.tsx` | 新增文件 |
| 贯穿 | `app/globals.css` | CSS 变量补充（error 色等） |
| 贯穿 | `data/appSettings.ts` | 纪念日相关数据读取 |

### 5.2 三端同步说明

当前架构：

```
网页版 (Next.js) ──┐
                   ├── 共用同一套代码
Android APK (Capacitor) ┘
         │
         ↓
   阿里云 OSS（图片存储）
   Supabase（可选云端数据库）
```

**网页端改动后，Android APK 更新流程**：
```bash
npm run build          # 构建网页
npx cap sync android   # 同步到 Android 工程
npx cap open android   # 打开 Android Studio 打包
```

不需要改任何 Android 原生代码。

### 5.3 纪念日天数计算公式

```typescript
// 计算在一起天数
const togetherDays = (dateString: string): number => {
  const [year, month, day] = dateString.split('.').map(Number);
  const start = new Date(year, month - 1, day);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

// 计算距离下一个纪念日天数
const daysToNextAnniversary = (dateString: string): number => {
  const [year, month, day] = dateString.split('.').map(Number);
  const thisYear = new Date(new Date().getFullYear(), month - 1, day);
  const nextYear = new Date(new Date().getFullYear() + 1, month - 1, day);
  const target = thisYear > new Date() ? thisYear : nextYear;
  return Math.ceil((target.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
};
```

---

## 六、工作量汇总

| 优先级 | 功能 | 预估工时 | 说明 |
|---|---|---|---|
| P0-1 | 移动端登录页重构 | 1.5 天 | EntryExperience.tsx 移动端部分 |
| P0-2 | 底部 5 Tab | 0.5 天 | MobileBottomNav.tsx |
| P0-3 | 纪念日独立 Tab | 1 天 | 新建 anniversaries/page.tsx |
| P1-1 | 时光宝盒独立 Tab | 1 天 | time-capsule/page.tsx |
| P1-2 | 统一 Toast 组件 | 0.5 天 | 新建 2 个文件 + 替换 alert |
| P1-3 | 相册导入入口提前 | 0.5 天 | MemoryArchive.tsx |
| P1-4 | 心情筛选器 | 0.5 天 | MemoryArchive.tsx |
| P2-1 | Onboarding 引导 | 0.5 天 | app/map/page.tsx |
| P2-2 | 空态插画 | 0.5 天 | MemoryToolPage.tsx |
| P2-3 | Landing Page | 1 天 | 新建 app/landing/page.tsx |
| **合计** | | **~7 天** | P0 + P1 约 4.5 天 |

---

## 七、执行顺序建议

```
第一阶段（立即可执行）
  1. P0-1 移动端登录页重构（最大影响，立即见效）
  2. P0-2 底部 5 Tab
  3. P0-3 纪念日独立 Tab

第二阶段（中期）
  4. P1-1 时光宝盒独立 Tab
  5. P1-2 统一 Toast 组件
  6. P1-3 相册导入入口提前
  7. P1-4 心情筛选器

第三阶段（可选）
  8. P2-1 Onboarding 引导
  9. P2-2 空态插画
 10. P2-3 Landing Page
```

---

## 八、关键参考文件

| 文件 | 作用 |
|---|---|
| `components/EntryExperience.tsx` | 登录页（桌面端完整，移动端需重构） |
| `components/MobileBottomNav.tsx` | 移动端底部 Tab（3个→5个） |
| `components/memory/Anniversaries.tsx` | 纪念日现有实现（需改造成 Tab 内容） |
| `components/memory/TimeCapsule.tsx` | 时光宝盒现有实现（需改造成 Tab 内容） |
| `components/memory/Landmarks.tsx` | 含 4 个原生 alert()（需替换） |
| `components/MemoryArchive.tsx` | 相册页（加导入入口、心情筛选） |
| `data/memories.ts` | 心情色配置（6 色，已完整） |
| `data/appSettings.ts` | 纪念日日期读取 |
| `public/sprites/characters/` | 像素情侣素材（4张，未被使用） |
| `app/globals.css` | 主题色 CSS 变量 |

---

> 本文档基于小陈体验报告（2026-06-18）整理
> 待执行
