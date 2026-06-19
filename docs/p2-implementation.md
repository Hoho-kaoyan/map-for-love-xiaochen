# P2 实施计划

> 计划于 2026-06-19 制定
> 基于 `docs/mobile-web-optimization.md` 的 P2 需求章节 + `docs/p0-mobile-optimization-implementation.md` 的实施进度

---

## Context

P0 三件套（登录页重构 + 5 Tab + 纪念日 Tab）和 P1 全 5 项（纪念日设置入口 + Toast + 时光宝盒 lock/unlock + 相册导入入口 + 心情筛选 sticky）均已完成并推送 remote。现在进入 P2 阶段，共 3 个功能，全部是独立可并行开发的小型特性。

---

## P1 已开发完成总结

| 编号 | 功能 | 提交 | 状态 |
|---|---|---|---|
| P0-1~3 | 登录页重构 + 5 Tab + 纪念日 Tab | `2503310` | ✅ |
| P0 fix | 品牌名/默认日期/密码 dot/布局 | `2503310` | ✅ |
| P1 | Settings 纪念日设置入口 | `283750f` | ✅ |
| P1-2 | 统一 Toast 组件 | `0dee11e` | ✅ |
| P1-1 | 时光宝盒 lock/unlock | `25c4bd5` | ✅ |
| P1-3 | 相册导入照片入口 | `90c2dd3` | ✅ |
| P1-4 | 心情筛选 sticky | `90c2dd3` | ✅ |

---

## P2 待做：3 个功能

### P2-2：空态像素情侣插画（Commit 1，最简单，先做）

**需求**：4 个空态场景各放置对应像素情侣素材。

**改动文件**（3 处，纯视觉增量）：

#### 1. `components/memory/MemoryToolList.tsx`（行 365-371）

当前空态只有纯文字。改为根据 `config.kind` 显示对应的像素图 + 文案：

| kind | 图片 | 文案 |
|---|---|---|
| `favorite` | `couple-pointing.png` | "还没收藏任何地点，去地图上看看吧" |
| `anniversary` | `couple-sitting.png` | "我们的第一个纪念日从今天开始" |
| `trip` | `couple-standing.png` | "还没去过新城市，第一个目的地是哪里？" |
| `capsule` | `couple-sitting.png` | "往时光宝盒里存点什么吧" |

修改：import `Image` from next/image，将 `<div>` 纯文块替换为 `<Image>` + `<p>`。

#### 2. `components/memory/AnniversaryPage.tsx`（行 24-47，AnniversaryHeroCard 空态分支）

在 `CalendarDays` icon 和 `还没设置纪念日` 标题之间插入：

```tsx
<Image src="/sprites/characters/couple-sitting.png" width={120} height={120}
  className="pixelated mt-4 mb-2 mx-auto" unoptimized alt="" />
```

#### 3. `components/MemoryArchive.tsx`（行 335-372，空态卡片）

将 Heart/Search 图标盒子（行 338-343）替换为 `couple-pointing.png` 像素图。标题和文案保持不变。

---

### P2-1：Onboarding 新手引导（Commit 2）

**需求**：首次进入 `/map` 显示 5 步引导浮层，完成后写 `mapofus:onboarded` 到 localStorage。

**新文件**：`components/shared/OnboardingOverlay.tsx`

- 5 个步骤：点地图 → 点城市 → 看时间线 → 改密码 → 完成
- framer-motion `AnimatePresence` 切换步骤
- 每一步显示像素图 + 标题 + 描述 + 上一步/下一步按钮
- "跳过"按钮（非最后一步时显示）
- 最后一步"完成" → 写 `localStorage["mapofus:onboarded"]="1"` → 消失
- `useEffect` 检查 localStorage，已 onboarded 则不显示

**修改文件**：`app/map/page.tsx`

在 `<main>` 末尾添加：
```tsx
const OnboardingOverlay = dynamic(() => import("@/components/shared/OnboardingOverlay"), { ssr: false });
// ...
<OnboardingOverlay />
```

使用 `dynamic` + `ssr: false` 避免 localStorage 的 SSR hydration mismatch。

---

### P2-3：Landing Page（Commit 3，最大但最独立）

**需求**：`/landing` 路由，无需登录即可访问的展示页。

**新文件**：`app/landing/page.tsx`

- 静态配置（COUPLE_CONFIG）包含：纪念日、点亮城市数、示例回忆
- 复用 `login-paper` / `login-sun` / `login-cloud` / `login-grid` CSS 背景
- 页面结构：像素情侣头像 → 标题 → 统计卡片（3 列）→ 静态地图 → 回忆横滑 → CTA 跳 /map
- 统计卡片：`daysTogether()` 计算天数 + 手动计算下一个纪念日天数
- 静态地图用 `lib/geo.ts` 的 `chinaFeatures` + `makeProjection` + `makePath` 渲染可点亮省份 SVG（参考 `DemoExperience.tsx` 的实现）
- 回忆卡片横滑用 `snap-x snap-mandatory`
- 纯展示，不依赖 localStorage（用硬编码静态配置）

---

## 提交顺序

```
Commit 1: P2-2 空态像素插画       (3 个文件小改)
Commit 2: P2-1 Onboarding 引导    (1 个新文件 + 1 行插入)
Commit 3: P2-3 Landing Page       (1 个新文件，完全独立)
```

三个功能互不依赖，Commit 1 最简单，Commit 3 最大。

---

## 验证方法

### P2-2
- 清空数据 → `/favorites` 看到 `couple-pointing.png` + 收藏空文案
- `/anniversaries`（无纪念日日期）看到 `couple-sitting.png`
- `/time-capsule`（空）看到 `couple-sitting.png` + 宝盒空文案
- `/trips`（空）看到 `couple-standing.png` + 旅行空文案
- `/memories`（空）看到 `couple-pointing.png` 替代 Heart 图标
- `npm run build` 通过

### P2-1
- 清除 localStorage `mapofus:onboarded`
- 进 `/map` → 看到 Step 1 浮层
- 下一步/上一步正常切换
- 跳过 → 消失，刷新不重现
- 完成 Step 5 → 消失，刷新不重现
- `npm run build` 通过

### P2-3
- 无痕窗口 `/landing` → 完整渲染，无需登录
- 3 个统计卡片数字正确
- 静态地图有点亮省份
- 回忆卡片可横滑
- "打开地图"链接跳 `/map`
- 移动端/桌面端响应式正常
- `npm run build` 通过