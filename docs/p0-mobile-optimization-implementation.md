# Map for Love · 移动端 Web 优化 P0 实施计划

> 本文档是 `docs/mobile-web-optimization.md`（2026-06-18 小陈体验报告）的 **P0 三件套** 实施计划。
> 计划于 2026-06-18 制定并获用户批准。
> 本轮只做 P0 三件套（登录页重构 + 5 Tab + 纪念日独立 Tab），P1/P2 留给下一轮。

---

## Context

当前网页版手机端与桌面端情感温度差距大：小陈反馈"手机打开像旅游 App，没有私密感"。根因有三条：

1. 移动端登录页缺少桌面端的拍立得相册、城市印戳、像素情侣头像、视差云雾动效，背景接近纯白。
2. 移动端底部 Tab 仅 3 个（地图/相册/我的），纪念日和时光宝盒藏在二级菜单，3 次点击才能到达。
3. 纪念日 Tab 入口虽已在侧栏，但 `/anniversaries` 页面只渲染通用 `MemoryToolPage` 列表，没有"主纪念日大卡片 + 在一起第 N 天"这种一眼可见的情感化展示。

P0 三件套要解决的就是这三点。预计 ~3 天工作量（拆组件 1.5 天 + 5 Tab 0.5 天 + 纪念日 Tab 1 天）。

---

## 与需求文档假设不同的关键事实（代码探索发现）

| 文档假设 | 实际 | 影响 |
|---|---|---|
| "新建 `app/anniversaries/page.tsx`" | 该文件已存在，渲染 `@/components/MemoryTools` 聚合文件 | P0-3 不新建 page，只换 import |
| `public/sprites/characters/avatar-us.png` | 存在（17.6 KB），但代码里**未引用** | P0-1 可直接拿来用 |
| `MemoryToolPage` 是裸页面 | 第 91 行已包 `<MemoryPageShell active={config.active}>` | P0-3 必须先抽 `MemoryToolShell` + `MemoryToolList` 才能避免嵌套 shell |
| `daysTogether` 需要新写 | 已在 `components/HomeProgress.tsx:82-97` | 抽出共用即可 |
| `daysUntil` 需要新写 | 已在 `components/memory/Shared.ts:144-152` | 直接 import 复用 |
| `moodConfig` 心情色 | 已在 `data/memories.ts:1-10`，相册页 line 278-306 已有按钮组 | 本轮不动（属 P1-4） |
| `anniversaryDate` 数据源 | 字段在 `data/appSettings.ts:7`，仅 `HomeProgress.tsx:430` 使用 | 登录页和纪念日 Tab 直接调 `readAppSettings()` 即可 |
| `lucide-react@1.16.0` | 版本号异常（实际 lucide-react 是 0.x 系列），但项目里 `MemoryNav.tsx:6-21` 已大量使用 `Archive / CalendarDays / Heart / MapPin / Map`，可认为包含所需图标 | 直接复用既有命名 |
| `app/page.tsx` 是 RSC | 5 行 RSC，渲染 `<EntryExperience />`，本身不动 | 拆分只动 EntryExperience 内部 |

---

## 关键文件

| 文件 | 改动类型 | 涉及 P0 |
|---|---|---|
| `lib/dateUtils.ts` | 新建（提取 `daysTogether`） | 全部 |
| `components/EntryExperience.tsx` | 重写为 ~15 行根组件 | P0-1 |
| `components/entry/LoginStageShell.tsx` | 新建 | P0-1 |
| `components/entry/MobileEntryExperience.tsx` | 新建 | P0-1 |
| `components/entry/DesktopEntryExperience.tsx` | 新建 | P0-1 |
| `components/entry/EntryPreviewOverlay.tsx` | 新建 | P0-1 |
| `hooks/useEntryExperienceState.ts` | 新建 | P0-1 |
| `hooks/useLoginSubmit.ts` | 新建 | P0-1 |
| `components/MobileBottomNav.tsx` | 5 Tab 重写 | P0-2 |
| `components/memory/MemoryToolPage.tsx` | 拆成 `MemoryToolShell` + `MemoryToolList` | P0-3 前置 |
| `components/memory/MemoryToolShell.tsx` | 新建 | P0-3 |
| `components/memory/MemoryToolList.tsx` | 新建 | P0-3 |
| `components/memory/AnniversaryPage.tsx` | 新建（hero card + list） | P0-3 |
| `app/anniversaries/page.tsx` | 换 import | P0-3 |
| `components/HomeProgress.tsx` | 改 `daysTogether` 引用 | 前置 |

---

## 可复用资源（不要重写）

| 资源 | 位置 |
|---|---|
| `daysUntil(date?: string): number \| null` | `components/memory/Shared.ts:144-152`，P0-3 直接 import |
| `moodConfig` 6 色配置 | `data/memories.ts:1-10`，P0 暂不动 |
| `readAppSettings()` + `appSettingsUpdatedEvent` | `data/appSettings.ts`，登录页和纪念日页都直接用 |
| `validateSitePassword` 客户端降级校验 | `lib/client/auth.ts`，`EntryExperience.tsx:18` 已引，拆组件时直接 import |
| `LocalPrivacyBadge / LocalPrivacyImage` | `@/components/LocalPrivacyImage`，背景层包装 |
| `LoginPhoto` 子组件 | `EntryExperience.tsx:122-153`，相册卡片内复用 |
| `PixelHeart` SVG | `EntryExperience.tsx:100-114`，登录页顶部品牌区 |
| 共享 CSS：`login-stage / login-paper / login-sun / login-cloud-a / login-cloud-b / login-grid / login-stamp-ring` | `app/globals.css` 全已存在 |
| 主题色：`cream / mist / sky / mint / leaf / sakura / bloom / ink / dim` | `app/globals.css` `@theme` 块 |
| 像素情侣头像：`public/sprites/characters/avatar-us.png`（17.6KB）、`couple-sitting.png`（52KB） | 移动端登录页右上用 avatar-us |
| 城市照片：9 张 `/photos/login/{city}.jpg` + `loginPhotoPath(fileName)` helper | `EntryExperience.tsx:21-22`，沿用 |
| `configs.anniversary` / `configs.capsule` 配置 | `components/memory/Shared.ts:24-57`，P0-3 复用 |
| `<Image unoptimized>` + `pixelated` class | `app/map/page.tsx:32-41` 已有 `pixelated` 用法 |

---

## 实施步骤（按 4 个 commit 推进）

### Commit 1：基础工具提取（小、纯函数，风险最低）
- 新建 `lib/dateUtils.ts`，把 `daysTogether` 从 `components/HomeProgress.tsx:82-97` 提取为命名导出。
- `HomeProgress.tsx` 改为 `import { daysTogether } from "@/lib/dateUtils"`，函数签名保持 `{ days, isFuture } | null`。
- **验收**：`npm run build` 通过，地图页"在一起第 N 天"显示不变。

### Commit 2：P0-2 5 Tab 改造（独立、低风险）
- 改 `components/MobileBottomNav.tsx`：
  - `navItems` 改为 5 项：`/map` `/memories` `/anniversaries` `/time-capsule` `/settings`
  - 图标：`MapIcon / ImageIcon / CalendarDays / Archive / User`（全部已在 `MemoryNav.tsx` 用过，命名沿用）
  - label：`地图 / 相册 / 纪念日 / 时光宝盒 / 我的`
  - 容器 `flex justify-around` → `grid grid-cols-5`，每个 cell `flex flex-col items-center justify-center gap-1`
  - icon 从 `h-5 w-5` 缩到 `h-[18px] w-[18px]`，label `text-[10px]` 不变
  - 保持 `pathname === item.href` 严格等 active 判定
  - label 加 `truncate` 防"时光宝盒"溢出
- 桌面端 `MemoryNav` **不动**，继续 9 项侧栏
- **验收**：
  - Chrome DevTools 切到 iPhone 13 (390×844) 和 iPhone SE (320pt)：5 个 tab 等宽显示，"时光宝盒"不截断
  - 移动端访问 5 个路径都正确高亮
  - 桌面端访问 `/landmarks`（底栏无对应项）时不会出现错误高亮

### Commit 3：P0-1 登录页拆组件（最大改动）
**前置抽离**（先做，让 commit 内部自洽）：
- 新建 `hooks/useEntryExperienceState.ts`：聚合 `settings / loginPhotos / loginPhotoTexts / activeId` + 6 个 motion value + `loginStamps` `useMemo` + 自动轮播 `setInterval` + 两个 `useEffect` 事件订阅。返回 `{ settings, activeId, setActiveId, activeStamp, loginStamps, driftX, driftY, reverseX }`。
- 新建 `hooks/useLoginSubmit.ts`：抽 `submitCode` + `pressKey`（`EntryExperience.tsx:222-275`）。行为必须**完全一致**（fetch 降级、setTimeout 720ms 跳 /map、560ms 清空、抖动 framer-motion `x: [-8, 8, -6, 6, 0]`）。
- 新建 `components/entry/LoginStageShell.tsx`：渲染共享背景层（`login-paper / login-sun / login-cloud-a / login-cloud-b / login-grid`）+ `LocalPrivacyBadge`，绑 `onPointerMove` 到 `pointerX/Y`（在 shell 内部监听，不要下放）。props：`{ motionX, reverseX, children }`。
- 新建 `components/entry/EntryPreviewOverlay.tsx`：全屏图片预览（`EntryExperience.tsx:579-623` 平移）。

**拆组件**：
- 新建 `components/entry/DesktopEntryExperience.tsx`：把 `EntryExperience.tsx:292-575`（grid 双列 + 右侧暗色面板 + 拍立得 + 印戳）整段搬过来。**额外**在右侧暗色面板左上角叠 `<img src="/sprites/characters/avatar-us.png" width={120} height={120} className="pixelated" />`。
- 新建 `components/entry/MobileEntryExperience.tsx`：自己持有 `code / status / collapsed`。布局自顶向下：
  1. **顶部品牌区**（pt-10）：`<PixelHeart>` + "Map for Love" + 右上角徽章（Heart/LockKeyhole 跟 `status`）
  2. **主文案 + 头像区**（flex items-end justify-between）：
     - 左：大标题"输入 / 纪念日" + 副标题（沿用 `EntryExperience.tsx:313-321`）
     - 右：`<img src="/sprites/characters/avatar-us.png" alt="" width={88} height={88} className="pixelated pointer-events-none select-none" />`
  3. **主纪念日天数条**（mt-4，独立小卡片）：读 `settings.anniversaryDate` + `settings.anniversaryLabel`，调 `daysTogether`（新 `lib/dateUtils`）。显示 `在一起第 N 天 · 2025.01.01`，无值显示空状态。无图标用 `<Heart className="h-4 w-4 fill-[#F5DCE0] text-[#E8B8C2]" />`
  4. **密码面板**（复用 `EntryExperience.tsx:323-374`，原样搬，只改外层 className）
  5. **城市印戳横滑区 + Mini 横滑条**（新增，原本桌面端独占）：放进密码卡片内部 mt-3 位置，宽度受卡片限制，避免和左下相册抢空间。`overflow-x-auto snap-x snap-mandatory`，每张 mini thumb ~80px
  6. **底部拖拽相册**（沿用 `EntryExperience.tsx:378-454`，加 `lg:hidden`）

**根组件重写**：
- `components/EntryExperience.tsx` 改为 ~15 行：
  - `"use client"`，import 所有 hook + 子组件
  - `const { ...motions, activeId, setActiveId, activeStamp, loginStamps } = useEntryExperienceState()`
  - `const [previewStamp, setPreviewStamp] = useState<Stamp | null>(null)`
  - 渲染：
    ```
    <LoginStageShell motionX={driftX} reverseX={reverseX}>
      <EntryPreviewOverlay previewStamp={previewStamp} onClose={() => setPreviewStamp(null)} />
      <div className="lg:hidden"><MobileEntryExperience setPreviewStamp={setPreviewStamp} ...shared /></div>
      <div className="hidden lg:block"><DesktopEntryExperience setPreviewStamp={setPreviewStamp} ...shared /></div>
    </LoginStageShell>
    ```
  - **不**用 `useMediaQuery`（避免 SSR hydration mismatch），纯 Tailwind 断点切换
- **验收**：
  - 移动端 375×812 视口：登录页有 pixel avatar + 主纪念日条 + 城市印戳横滑区，背景有云雾浮动（视差跟随鼠标 / 触摸）
  - 桌面端 1440×900：原样不变
  - 移动端双击相册卡片触发全屏预览；桌面端双击 polaroid 触发全屏预览
  - 4 位密码可输入，错时抖动，720ms 后跳 /map
  - 1366×768（lg 临界 ±10px）切换无"双渲染"问题

### Commit 4：P0-3 纪念日 Tab 改造
**前置抽离**（必须先做，否则嵌套 shell）：
- 拆 `components/memory/MemoryToolPage.tsx`：
  - 抽出 `MemoryToolShell`（含 `<MemoryPageShell active={config.active}>` + 顶部 header "图标+标题+副标题+计数胶囊+新增按钮"）
  - 抽出 `MemoryToolList`（含 `useState` items、`useEffect` 读 `readItems`、`daysUntil` 计算、卡片网格、分页、新增/编辑 modal）—— **纯内容，不带 shell**
  - `MemoryToolPage` 保留为 `<MemoryToolShell config><MemoryToolList config /></MemoryToolShell>` 组合，向后兼容
- `app/favorites/page.tsx` / `app/time-capsule/page.tsx` / `app/trips/page.tsx` / `app/landmarks/page.tsx` **不动**（仍走原 `MemoryToolPage` 组合）

**新增**：
- 新建 `components/memory/AnniversaryPage.tsx`（client component）：
  ```
  <MemoryToolShell config={configs.anniversary}>
    <AnniversaryHeroCard />            // 顶部主纪念日大卡片
    <hr className="my-6 border-[#D8DDD8]/60" />
    <MemoryToolList config={{ ...configs.anniversary, kind: 'anniversary-list' }} />
  </MemoryToolShell>
  ```
  其中 `AnniversaryHeroCard` 自己实现：
  - `useEffect` 订阅 `appSettingsUpdatedEvent`，设 `settings = readAppSettings()`
  - 调 `daysTogether(settings.anniversaryDate)` + `daysUntil(settings.anniversaryDate)`
  - 显示：图标（CalendarDays）+ 标题"纪念日"（小字）+ 主标题"我们在一起 第 N 天"（text-4xl）+ 副标题"2025.01.01 · 距离下一个纪念日还有 N 天"
  - 无 `anniversaryDate` 显示空状态卡片："设置 → 纪念日 填一个日期，这里会显示天数"，按钮跳 `/settings`
- 改 `app/anniversaries/page.tsx`：import 从 `@/components/MemoryTools` 改为 `@/components/memory/AnniversaryPage`。
- 桌面端 `/anniversaries` 仍走 `MemoryPageShell`（来自 `MemoryToolShell`），提供左侧 sidebar
- 移动端 `/anniversaries` 进入后：顶部主纪念日大卡片 + 下方所有纪念日列表 + 底部 5 Tab
- **过滤逻辑**：列表里若某项 `date === settings.anniversaryDate`，跳过渲染（避免和 hero card 重复）
- **验收**：
  - 移动端 `/anniversaries`：首屏看见主纪念日大卡片，向下滑看见"其它纪念日"列表，"新增纪念日"按钮可用
  - 设置里没填日期：显示空状态，点击按钮跳 `/settings`
  - 桌面端 `/anniversaries`：左侧 sidebar 仍正常显示，hero card 在内容区顶部
  - "距离下一个纪念日还有 N 天"：今天填"明天"日期应为 1，已过去的日期应为负数绝对值（实际展示"已经过去"语义由 `MemoryToolList` 处理）

---

## 验证方法（端到端）

### 桌面浏览器
- Chrome DevTools → 设备工具栏 → iPhone 13 (390×844) / iPhone SE (375×667) / Pixel 5 (393×851) 三个尺寸
- 断点边界：1360 / 1370 各看一次，确认 lg 切换无"双渲染"

### 真机（如有）
- `npm run cap:open` → Android Studio Wi-Fi ADB → 装到手机 → 验证移动端登录页 + 5 Tab + /anniversaries

### 关键交互验证清单

| 路径 | 验证点 |
|---|---|
| `/` (375px) | 看见 avatar-us.png + 主纪念日条 + 城市印戳横滑 + 密码盘，背景有云雾浮动 |
| `/` (375px) | 输入错密码：抖动，密码清空 |
| `/` (375px) | 输入对密码：720ms 后跳 /map |
| `/` (1440px) | 桌面布局原样不变 |
| `/memories` (375px) | 底栏"相册"高亮 |
| `/anniversaries` (375px) | 底栏"纪念日"高亮；首屏 hero card 显示"在一起第 N 天" |
| `/anniversaries` (375px) | 设置里改日期后，hero card 自动更新（事件订阅） |
| `/time-capsule` (375px) | 底栏"时光宝盒"高亮（页面仍是原 MemoryToolPage） |
| `/landmarks` (375px) | 底栏无高亮（不在 5 项内），符合预期 |

### 兼容性
- `npm run build` 通过
- `npm run lint` 通过
- Next 16 文档：`node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` 已确认 `image-rendering: pixelated`、`<Image unoptimized>` 等模式不变

---

## 风险点

| 风险 | 概率 | 缓解 |
|---|---|---|
| `useEntryExperienceState` 的 `pointerX/Y` 在 SSR 阶段被读导致 hydration mismatch | 中 | `useMotionValue(0)` 默认 + `useEffect` 不在 SSR 注册 `pointermove`（沿用现有模式） |
| 移动端 `LoginPhoto` 容器位置改变后 `sizes` 属性失效 | 低 | 仍用 `sizes="170px"` 沿用 `EntryExperience.tsx:437` |
| 5 Tab 在 iPhone SE (320pt) "时光宝盒" label 溢出 | 中 | `truncate` + 实测 320 宽度 |
| `daysTogether` 提取后 `HomeProgress.tsx:432` 显示不一致 | 低 | Commit 1 单独跑地图页验收 |
| `MemoryToolPage` 抽离后 4 种其他 kind 的页面行为变化 | 低 | `MemoryToolPage` 保留为组合层，向后兼容 |
| `app/anniversaries/page.tsx` 切换 import 后桌面端 sidebar active 不对 | 低 | `AnniversaryPage` → `MemoryToolShell` → `MemoryPageShell active={config.active}` 链路一致 |
| `lucide-react@1.16.0` 实际没有 `CalendarDays` 或 `Archive` | 低 | 项目内已在 `MemoryNav.tsx:6-21` 用过，确认有 |
| 移动端 5 Tab 把 `/landmarks /login-photos /favorites /trips /weather` 排除，移动端用户进这些页面无 5 Tab 高亮 | 中 | `MemoryPageShell` 顶部汉堡按钮（`MemoryNav.tsx:208-216`）可打开 9 项侧边栏，本轮**不**优化 |
| Capacitor APK 静态导出 motion value 序列化 | 低 | motion value 是运行时，不入 localStorage，无影响 |
| `Next 16` RSC 边界：`app/page.tsx` 已是 RSC，新拆组件必须保持 client 边界 | 低 | `EntryExperience.tsx` 顶层 `"use client"` 不删；新拆子组件继承 |

---

## 不做清单（本轮范围外）

P1/P2 全部不做：
- P1-1 时光宝盒 lock/unlock 机制
- P1-2 统一 Toast 组件（项目无 toast 库，需自建）
- P1-3 替换 `Landmarks.tsx:50,65,74,85` 的 4 个 `alert()`
- P1-4 相册页顶部"导入照片"卡片 + 心情筛选 sticky
- P2-1 Onboarding 引导
- P2-2 空态使用像素情侣素材
- P2-3 Landing Page
- 桌面端 `MemorySidebar` 精简到 5 项
- `package.json` `lucide-react` 版本号"异常"复核与可能的升级
- 桌面端 `EntryExperience` 视觉升级（avatar-us 已经在桌面端右上角）
- 移动端 `/landmarks /login-photos /favorites /trips /weather` 页面适配（5 Tab 砍掉了直达入口，可通过汉堡菜单打开，本轮不优化）
- `globals.css` 新增 `shake / wiggle` keyframe（密码错时沿用 framer-motion 内联抖动）
- 单测 / E2E（项目无测试基础设施，手测即可）

---

## 提交顺序（建议）

```
Commit 1: lib/dateUtils.ts + HomeProgress.tsx 引用切换          (~10 行 diff)
Commit 2: MobileBottomNav.tsx 5 Tab 重写                        (~40 行 diff)
Commit 3: P0-1 登录页拆组件（5 个新文件 + 重写 1 个）           (~600 行新增/替换)
Commit 4: P0-3 纪念日 Tab（2 个新文件 + 抽离 + 1 个 page 切换） (~250 行新增)
```

每个 commit 单独 review + 验收，降低合入风险。

---

## 进度跟踪

实施时按上述 4 个 commit 顺序推进。每个 commit 完成后更新本节。

| Commit | 状态 | 完成时间 | 备注 |
|---|---|---|---|
| Commit 1: daysTogether 提取 | ✅ 完成 | 2026-06-18 | `lib/dateUtils.ts` 新建；`HomeProgress.tsx` 改 import；build 49 静态页通过 |
| Commit 2: 5 Tab 改造 | ✅ 完成 | 2026-06-18 | `MobileBottomNav.tsx` 改为 5 项 + grid-cols-5；build 49 静态页通过 |
| Commit 3: 登录页拆组件 | ✅ 完成 | 2026-06-18 | 7 个新文件 + 重写根 `EntryExperience.tsx`；build 49 静态页通过 |
| Commit 4: 纪念日 Tab | ✅ 完成 | 2026-06-18 | `MemoryToolShell` + `MemoryToolList` + `AnniversaryPage`；`app/anniversaries/page.tsx` 换 import；build 49 静态页通过 |
| Commit A: 品牌名替换 + 默认日期 | ✅ 完成 | 2026-06-19 | 7 个 UI 文件"Map for Love"→"我们的时光地图"；`defaultAnniversaryDate` → 2025.08.16 |
| Commit B: 密码 dot 增强 | ✅ 完成 | 2026-06-19 | dot 尺寸增大+粉色 ring 外圈+scale 弹入动画 |
| Commit C: 移动端布局修法 | ✅ 完成 | 2026-06-19 | PasswordPanel z-30+pb-32；相册 z-20+bottom-10 |

### Commit 4 实施时的小调整（与原计划差异）

- **MemoryToolShell** 改为只渲染 `<MemoryPageShell active>{children}</MemoryPageShell>`，header（含标题/计数/新增按钮）放在 MemoryToolList 内。
  - 原计划把 header 放在 Shell 里，但这样 AnniversaryHeroCard 必须夹在 Shell header 和 MemoryToolList 中间，header 会和 hero 重复。
  - 改为"Shell 只包 sidebar，header 跟随 children"后，AnniversaryPage 可以自由组合 MemoryToolShell + AnniversaryHeroCard + MemoryToolList。
- **MemoryToolList** 增加 `excludeDate?: string` prop，AnniversaryPage 传 `settings.anniversaryDate` 过滤掉与主纪念日同日期的项，避免与 hero card 视觉重复。
- **favorites/time-capsule/trips/landmarks 4 个原页面** 完全不动：仍走 `MemoryToolPage` 薄包装（`<MemoryToolShell><MemoryToolList /></MemoryToolShell>`），行为 100% 保持。

### 验收建议

- **桌面浏览器**：Chrome DevTools → 设备工具栏 → iPhone 13 (390×844) / iPhone SE (375×667) / Pixel 5 (393×851) 三个尺寸
- **断点边界**：1360 / 1370 各看一次，确认 `lg:` 切换无"双渲染"
- **关键交互**（按计划"验证方法"小节完整清单）：
  - `/` (375px)：头像 + 主纪念日条 + 城市印戳横滑 + 密码盘 + 拖拽相册 + 背景云雾
  - `/anniversaries` (375px)：首屏 hero card 显示"我们在一起第 N 天"，下方"其它纪念日"列表，"新增记录"按钮可用
  - `/landmarks` (375px)：底栏无高亮（不在 5 项内），符合预期
- **回归验证**：原 `/favorites /time-capsule /trips /landmarks` 4 个页面的列表/编辑/删除/分页/admin 校验行为应与改动前完全一致（因为 `MemoryToolPage` 薄包装保持原行为）

---

## P0 实施后体验反馈调整（2026-06-19 实施）

> 用户在 P0 三件套合入后实测，提出 4 项微调。已全部实施完成并推送 remote。

### 反馈清单（用户已确认方案）

| # | 反馈 | 方案 |
|---|---|---|
| 1 | "Map for Love" → "我们的时光地图" | 仅 UI 可见部分（7 个文件） |
| 2 | 纪念日默认值 2025.01.01 → 2025.08.16 | 直接改 `data/appSettings.ts:20` |
| 3 | 密码 dot 无输入进度反馈 | 方案 B：尺寸增大 + 粉色 ring 外圈 + scale 弹入动画 |
| 4 | 移动端相册卡片挡住解锁按钮 | 方案 2：PasswordPanel z-30 + pb-32；相册 z-20 + bottom-10 |

### 改动文件清单

| # | 文件 | 行 | 改动 |
|---|---|---|---|
| 1 | `app/layout.tsx` | 17,23 | title + appleWebApp.title → "我们的时光地图" |
| 2 | `app/map/page.tsx` | 89 | h1 → "我们的时光地图" |
| 3 | `components/HomeProgress.tsx` | 478 | 底部副标题 → "我们的时光地图" |
| 4 | `components/entry/MobileEntryExperience.tsx` | 63 | 品牌区 → "我们的时光地图" |
| 5 | `components/entry/DesktopEntryExperience.tsx` | 56 | 同上 |
| 6 | `public/manifest.json` | 2,3 | name → "我们的时光地图"，short_name → "时光地图" |
| 7 | `data/appSettings.ts` | 20 | `defaultAnniversaryDate = "2025.08.16"` |
| 8 | `components/entry/PasswordPanel.tsx` | 75-90 | dot 增大到 h-4 w-4 + ring 外圈 + motion scale 动画 |
| 9 | `components/entry/PasswordPanel.tsx` | 42 | pb-3 → pb-32，z-10 → z-30 |
| 10 | `components/entry/MobileEntryExperience.tsx` | 180 | 相册 bottom-6 → bottom-10，z-30 → z-20 |

### 提交记录

```
2503310 feat: P0移动端优化三件套 + 体验反馈调整
```

**Remote**: `origin/main` ✅ 已推送