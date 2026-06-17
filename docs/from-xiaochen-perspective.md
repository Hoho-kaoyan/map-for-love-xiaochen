---
title: 小陈的第一份体验报告
subtitle: Map for Love · 从一个真实用户的视角
author: 小陈（项目目标用户视角）
date: 2026-06-18
---

# 给昊宇哥的一封信：第一次看到「Map for Love」的感觉

> 写在前面：这份文档不是技术 review，是一个小陈视角的"使用日记"。我是这个项目的目标用户——你做这个应用给的那个人。我决定把我第一次打开它、第一次玩它、第一次想"啊这"、第一次"哇"的瞬间，老老实实写下来。

---

## 一、开场白：第一次打开

收到你的消息说"给你做了个东西，你打开看看"，我点开链接的第一秒，浏览器是空白的——大概 1.5 秒，我以为网不好，正准备刷新。

然后整张地图淡入。

**我的第一反应是：等等，这是手账吗？**

不是那种"程序员做的 demo"，是那种——我高中时期会花一个下午裁纸、贴胶带、画小房子、做小角标的那种手账。奶白色的纸做底，浅蓝和樱粉的低饱和色块在上面漂，背景里隐约有一层雾，远处的山是手绘风的轮廓。整张图完全不是数据可视化，是"想让人靠近的"那种。

我立刻把手机亮度调低了一格——怕我眼睛太快适应这种温柔的色，怕错过细节。

然后我看到一个像素风的小心形 logo，底下 4 个小圆点，旁边写着「输入**纪念日**」。

**我整个人愣了一下。**

密码不是密码。是纪念日。

——这就是你和别的程序员不一样的地方。别人做 App，第一屏是「Welcome to XXX」；你做 App，第一屏是「告诉我，我们是哪一天开始的」。

我没输入密码。我先去逛了一圈 UI。

---

## 二、第一眼的"哇"时刻（9 个让我心动的细节）

以下是我一个一个"啊原来如此"的瞬间。

### 1. 密码 = 纪念日（最浪漫的反转）
**位置**：[components/EntryExperience.tsx:313-336](components/EntryExperience.tsx#L313-L336)

打开登录页，标题是「输入**纪念日**」，不是「请输入密码」。4 位数字键盘，输错时不是"密码错误"，是"再想想"——整个码盘横向弹簧抖动 (`x: [-8, 8, -6, 6, 0]`)，像在撒娇。

这意味着：**进站密码就是我们的纪念日月日**（比如 12 月 23 日就是 `1223`）。我每次输密码，都是在心里默念一次那个日期。

这不是 UX 设计，这是把"鉴权机制"变成了"日常仪式"。

### 2. 登录页会动的拍立得相册
**位置**：[components/EntryExperience.tsx:504-555](components/EntryExperience.tsx#L504-L555)

桌面端右半屏是一个倾斜 ±1.5° / ±3° 的拍立得相框，**每 4 秒换一张**城市照片。底下还有 9 个 mini 印戳，鼠标 hover 就停在那里。

城市名字 + 一句话小标签，比如「春日湖畔」「外滩傍晚」「见面那天」。

**我挪鼠标过去，相框跟着 spring 弹性回正。** 我动一下，它动一下——它在跟我玩。

下面那排 9 个印戳，对应你们一起去过的 9 个城市。每个印戳带极淡的阴影，是手账里盖的那种"到此一游"邮戳。

### 3. 整张地图会"动"
**位置**：[components/ChinaMap.tsx:230-336](components/ChinaMap.tsx#L230-L336)

鼠标移动的时候，背景的云和太阳会**视差跟随**——鼠标往右，太阳往左，云缓缓飘。这是 [globals.css:669-677](app/globals.css#L669-L677) 的 `@keyframes entryFloat` + 鼠标事件桥接，做得不张扬但很到位。

我第一次移动鼠标的时候，是**有意识地**测试："我不动，它动不动？" 答案：不动。我一动，它就动。

**你做的不是"动效"，是"它有呼吸感"。**

### 4. 鼠标悬停时省份"亮起来"
**位置**：[components/ChinaMap.tsx:200-446](components/ChinaMap.tsx#L200-L446)

我把鼠标放在浙江上，整个浙江的轮廓被一圈柔光描出来（`feGaussianBlur` 软光晕），发出"去过"的心情色光——我们最近一次去杭州写的是「浪漫」🌹，所以发的是粉光。

**每个省份的发光颜色就是你们最近一次去那里的心情。**

这个细节让我看了一圈：四川是平静的雾蓝，山东是开心 🌟，福建是甜蜜的樱粉……整张地图变成了一张"心情地图"。

### 5. 旅行时间线（最电影感的部分）
**位置**：[components/TimelineOverlay.tsx:111-145](components/TimelineOverlay.tsx#L111-L145)

地图右下角有个按钮叫「时间线」。我点了一下。

**整张地图 zoom 1.35 倍放大，然后从我最早去过的城市开始——**
- 城市点一下高亮
- 1.8 秒后弹出一个拍立得相框（带 spring bounce，随机旋转 ±4°）
- 再 1.8 秒，画笔从那个城市画到下一个城市
- 1.8 秒，下一个城市亮起
- ……

**全部走完，渐变线把整条路径连起来，像 Apple Keynote 那种路径绘出动画。**

我看着那 12 个城市一个一个亮起来，相框一个一个弹出来，线一段一段连上——

> 我突然意识到，这不只是"我们去过的地方"，这是"我们的故事"。

### 6. "任意门"深链（最让人起鸡皮疙瘩的）
**位置**：[components/MemoryArchive.tsx:71-73](components/MemoryArchive.tsx#L71-L73) + [components/ProvinceMap.tsx:396-409](components/ProvinceMap.tsx#L396-L409) + [components/province/CityPanel.tsx:56-65](components/province/CityPanel.tsx#L56-L65)

相册页有一张我们 2024 年 3 月在武汉拍的照片。

我点了一下。

**不是放大。** 而是：
- 浏览器地址栏变成了 `/province/hubei?city=wuhan&memory=xxxx`
- 整张中国地图 fade out
- 湖北地图 fade in
- 自动 zoom 1.62 倍定位到武汉
- 右边滑出 CityPanel，里面**直接打开了我点的那张回忆**
- 选中的状态、滚动位置、Tab 全部回到那一天

**我以为我在相册，结果我被"任意门"传送回了那个下午。**

这种"跨时间的点对点回忆穿梭"，在所有我用过的 App 里是第一次见。

### 7. 情侣双头像独立放大
**位置**：[components/HomeProgress.tsx:537-577](components/HomeProgress.tsx#L537-L577)

侧栏顶部有一个情侣 logo，是两个人的头像拼起来的 SVG。

我**点了一下你那边的头像**——只有你那边放大到 1.08 倍，260ms 后回弹。
**我点了一下我这边**——只有我这边放大，中心点完全不同（`transform-origin: 33% 47%` vs `69% 45%`）。

**我们都是独立的人，但拼在一起是一张完整的图。**

这不是"双人 logo"能概括的，这是在说："你点我的时候只动我，不会动他。"

### 8. 6 种心情色全站联动
**位置**：[data/memories.ts:3-10](data/memories.ts#L3-L10) + [app/globals.css:8-19](app/globals.css#L8-L19)

加回忆的时候要选 6 种心情之一：开心 😁 / 浪漫 🌹 / 甜蜜 🥰 / 平静 😌 / 惊喜 🤩 / 悲伤 🥲。

我一开始以为这就是个 emoji 分类。

结果发现：
- 这个心情色会**驱动地图发光**（[ChinaMap.tsx:209-215](components/ChinaMap.tsx#L209-L215)）
- **时间线渐变**会取这个色（[TimelineOverlay.tsx:155-159](components/TimelineOverlay.tsx#L155-L159)）
- **相册角标**会显示这个 emoji（[MemoryArchive.tsx:92-96](components/MemoryArchive.tsx#L92-L96)）

我写「在西湖边看到日落」时选了 🌹，整张地图上浙江那一块就在发粉光，时间线那一段就是从粉到桃的渐变。

**同一个心情，从 5 个不同的角度反复呼应我。**

### 9. EXIF 智能批量导入（最贴心的技术活）
**位置**：[components/memory/BatchImportPhotosSection.tsx:68-214](components/memory/BatchImportPhotosSection.tsx#L68-L214)

我手机里有 800 多张照片。一张一张点城市点日期点心情，累死。

发现设置里有"批量导入"。**一次性选 200 张。**

它做了几件事让我起鸡皮疙瘩：
- 用 [exifr](package.json:70) 读每张照片的拍摄时间（`DateTimeOriginal`）
- 读 GPS 坐标
- 用**欧氏距离**匹配最近城市（[BatchImportPhotosSection.tsx:22-34](components/memory/BatchImportPhotosSection.tsx#L22-L34)）
- 5 张/页分页展示
- 拍立得风格预览 + 自动填好日期/城市/心情
- 串行上传，每张有 pending → uploading → success/error 状态

**我把 200 张照片丢进去，按"确定"——它自己整理成 47 个城市回忆，2 分钟后我看到地图上多了 47 个点。**

这省了我 8 小时的手动操作。

---

## 三、让我"啊这"的小卡顿（8 个影响体验的地方）

夸完了。说点"我遇到了会皱眉"的地方。

### 1. 没有新手引导（首次进入有点懵）
**位置**：[app/map/page.tsx](app/map/page.tsx) + [components/MemoryNav.tsx:90-189](components/MemoryNav.tsx#L90-L189)

输完密码进了地图，我盯着整张图看了 5 秒——

> 这是地图我知道。但是我能干嘛？我点哪里？我要加新回忆是点哪里？

没有引导、没有 tooltip、没有"上箭头指这里"。`MemorySidebar` 在桌面端常驻，但我不知道那些小图标分别是什么意思。

**建议**：加一个 5 秒的 onboarding 浮层，依次点出"点这里加回忆 / 这里看时间线 / 这里改密码"。

### 2. 错误反馈不统一（最让我出戏的地方）
**位置**：[components/EntryExperience.tsx:325](components/EntryExperience.tsx#L325) + [components/memory/Settings.tsx:116](components/memory/Settings.tsx#L116) + [components/memory/LoginPhotos.tsx:71](components/memory/LoginPhotos.tsx#L71) + [components/HomeProgress.tsx:287-303](components/HomeProgress.tsx#L287-L303)

错误反馈我数了一下，**至少有 5 种风格**：
1. 密码错 → 码盘抖动 + 粉色调情（"再想想"）
2. 管理员密码错 → 状态条变粉色（"密码不对"）
3. 文件上传失败 → **原生 `alert()` 弹窗**（破坏氛围！）
4. 天气接口挂了 → 静默 fallback 显示 24°，**完全没告诉我**网络有问题
5. 工具页保存成功 → 状态条一直挂在那儿，**3 分钟后还在那儿**

我刚被温柔的码盘宠坏，然后上传照片失败被原生 alert 拽回现实——这个落差让人想掀桌。

**建议**：统一做一个 `<Toast>` 组件，3 秒自动消失，错误用暖红（`#E8845A`），成功用主粉，自动消失 + 进度条。

### 3. 移动端登录页看不到"那个极简相册高潮"
**位置**：[components/EntryExperience.tsx:378-454](components/EntryExperience.tsx#L378-L454)

桌面端右半屏的拍立得相框 + 9 张印戳，那种「像一本相册在等你打开」的氛围，是整个项目的灵魂。

但移动端被压成左下角一个**可拖动可收起的小相框**，而且是默认收起的。

**我第一次在手机上打开，第一眼看到的就是一个密码盘 + 一个像素心，背景连云都没有。**

我以为这是个旅游 App，不是私人回忆 App。

**建议**：移动端登录页把"相册 9 印戳"作为**全屏横滑卡片**，密码盘浮在底部，和桌面端一样有"打开相册"的仪式感。

### 4. 移动端底部只有 3 个 tab（其他功能被埋了）
**位置**：[components/MobileBottomNav.tsx](components/MobileBottomNav.tsx) + [components/MemoryNav.tsx:208-246](components/MemoryNav.tsx#L208-L246)

手机打开，底部 3 个 tab：**地图 / 相册 / 我的**。

但是"纪念日"、"收藏"、"旅行倒数"、"时光宝盒"、"地标"、"天气"这些功能，**全部藏在「我的 → 设置 → ...」的二级菜单**里。

我想看纪念日要在手机上点 **3 次**（点"我的"→ 点设置 → 点纪念日）。

**建议**：底部 5 个 tab：**地图 / 相册 / 纪念日 / 时光宝盒 / 我的**。

### 5. 没有暗色主题（晚上打开太亮）
**位置**：[app/globals.css:8-19](app/globals.css#L8-L19)

背景写死 `#FAFBF7`（奶白）。

晚上 11 点我躺在床上打开应用想加个回忆，**整张地图白晃晃地照我脸**。

你们的字体是 Geist、动效是 spring 弹簧、整体走"高级感低饱和"路线——**这种调性的应用，**没有暗色主题是减分项**。

**建议**：用 CSS 变量（已经具备条件了！）加个 toggle，记忆在 localStorage。暗色模式色板用「月光」主题——主色改成 `#1A2030`（夜空），强调色用粉蓝双色光。

### 6. 空态没有插画（情感温度的最后一公里）
**位置**：[components/memory/MemoryToolPage.tsx:266-270](components/memory/MemoryToolPage.tsx#L266-L270)

我新建了一个纪念日分类，里面 0 条数据。空态显示：

> "这里还空着，点击右上方按钮新增一条吧。"

就这一行字。

**这种调性的项目，空态应该有**像素风的小情侣牵手走在空地中央，远处有座城市，**带个"我们去加第一个纪念日吧"的对话框。

参考你们 [public/sprites/characters/](public/sprites/characters/) 已经有 4 张像素情侣图了，**为什么主线流程里一张都没出现？**

**建议**：把 `sprites/characters/` 里的小情侣用在空态、404、加载占位、登录页 4 个位置，让"它们"成为这个 App 的主角。

### 7. 工具页没有 loading 骨架屏（闪一下很突兀）
**位置**：[components/memory/MemoryToolPage.tsx:212-271](components/memory/MemoryToolPage.tsx#L212-L271)

我点开"纪念日"页面：

1. 第一秒：列表是空的（`items=[]`）
2. 0.3 秒后：localStorage 数据加载完
3. 列表突然**啪**地出现 12 张卡片

**这中间会有一个"空态闪一下→突然满"的突兀感。**

**建议**：进入时显示 3 个灰色骨架卡片（高度自适应内容），数据回来后 fade-in 替换。

### 8. tooltip 缺失（首次使用靠猜）
**位置**：[components/MobileBottomNav.tsx:30-50](components/MobileBottomNav.tsx#L30-L50) + [components/ChinaMap.tsx:267-323](components/ChinaMap.tsx#L267-L323)

地图左下的"放大 / 缩小 / 重置"按钮，我没 hover 上去看，根本不知道哪个是哪个。

底部 3 个 tab 同样——`MapPin` / `Image` / `User` 三个 lucide 图标，**没文字标签**（< 1024px 隐藏文字）。

我第一次用以为"我的"是 `User` 是账户中心，结果是设置入口——**命名也不对**。

**建议**：tooltip 长按 / hover 显示完整名字；底部 tab 至少保留小字标签（"地图" "相册" "我的"）。

---

## 四、我给"小陈"打的体验分（10 分制）

| 维度 | 分数 | 评语 |
|---|---|---|
| **视觉设计** | 9/10 | 调性完全统一，像素手账风有记忆点，色板克制；扣 1 分是暗色主题缺失 |
| **情感温度** | 10/10 | 密码=纪念日、双头像独立放大、心情色联动——每一处都在"为两个人" |
| **首屏冲击** | 9/10 | 桌面端第一眼就是王炸（拍立得 + 9 印戳 + 视差背景），但**移动端首屏明显弱** |
| **操作流畅** | 8/10 | 主线流程（加回忆 / 看地图 / 看时间线）很顺，但工具页切换有 loading 闪烁 |
| **长期使用** | 7/10 | 数据导入导出做得到位，备份/OSS 都好；但**没有 daily nudge**（每天打开没理由） |
| **综合** | **8.6/10** | **作为礼物，它已经值 9 分**；作为长期日用的 App，差 1.4 分的距离在 onboarding、错误反馈、移动端、推送上 |

---

## 五、优化建议（按优先级 P0 / P1 / P2 排序）

### 🔴 P0：必须做（影响留存和首次体验）

#### P0-1. 加首启 onboarding 浮层
**对应文件**：[app/map/page.tsx](app/map/page.tsx)
**改法**：进入 `/map` 时检测 `localStorage["mapofus:onboarded"]`，未标记过时显示 5 步浮层（用 framer-motion AnimatePresence）：
1. 「点地图上任意省份开始」
2. 「点城市写第一条回忆」
3. 「按时间线看我们的故事」
4. 「试试修改密码，改成纪念日」  
5. 「完成」按钮写入标记，3 秒后自动消失

**预计工作量**：半天。

#### P0-2. 统一 Toast 反馈组件
**对应文件**：新增 [components/shared/Toast.tsx](components/shared/Toast.tsx) + [components/shared/ToastProvider.tsx](components/shared/ToastProvider.tsx)
**改法**：把所有 `alert()`、`setStatus("...")`、密码抖动、状态条统一封装为 `<Toast type="success | error | info" duration={3000} />`。

把 [globals.css:8-19](app/globals.css#L8-L19) 的 `@theme` 加 2 个语义色：
- `--color-error: #E8845A`（暖红，避免和粉色情感色冲突）
- `--color-success: #A8C89A`（薄荷绿，已有类似色）

**预计工作量**：1 天。

#### P0-3. 移动端底部 tab 改 5 个
**对应文件**：[components/MobileBottomNav.tsx](components/MobileBottomNav.tsx)
**改法**：把 3 tab 改成 5 tab：**地图 / 相册 / 纪念日 / 时光宝盒 / 我的**。
"收藏"和"旅行倒数"合并到"我的"二级，"地标 / 天气 / 登录照片 / 设置 / 修改密码"都在"我的"。

**预计工作量**：半天。

#### P0-4. 移动端登录页增加相册高潮可见性
**对应文件**：[components/EntryExperience.tsx:378-454](components/EntryExperience.tsx#L378-L454)
**改法**：把桌面端的"拍立得相框 + 9 印戳"在移动端做成**底部抽屉**，上滑展开 9 张城市卡片，左右滑切换城市。和桌面端同步，密码输完点击"解锁"时，相框做一个"翻牌"过渡到地图。

**预计工作量**：1 天。

---

### 🟡 P1：强烈推荐（提升长期使用率）

#### P1-1. 暗色主题
**对应文件**：[app/globals.css](app/globals.css)
**改法**：所有 `--color-*` 变量外包一层 `light` / `dark` class。
```css
:root { --color-cream: #FAFBF7; ... }
.dark  { --color-cream: #1A2030; --color-sakura: #5A3A45; ... }
```
设置页加一个 toggle，记忆在 `localStorage["mapofus:theme"]`。
暗色主题命名"**月光**"（呼应"我们是月光下相识的"——这种细节能赢）。

**预计工作量**：2 天。

#### P1-2. 工具页 loading 骨架屏
**对应文件**：[components/memory/MemoryToolPage.tsx](components/memory/MemoryToolPage.tsx)
**改法**：加 `loading` 状态，初次进入时显示 3 个骨架卡片（用 Tailwind `animate-pulse`），数据回来后 fade-in。

**预计工作量**：半天。

#### P1-3. 空态插画（用上 sprites/characters/）
**对应文件**：[components/memory/MemoryToolPage.tsx:266-270](components/memory/MemoryToolPage.tsx#L266-L270) + [components/RandomPhotoCard.tsx:212-220](components/RandomPhotoCard.tsx#L212-L220)
**改法**：4 个空态场景，每个用 `public/sprites/characters/` 里的像素小情侣：
- 纪念日空 → `couple-sitting.png` 坐在空地上，对话框「我们的第一个纪念日从今天开始」
- 收藏空 → `couple-pointing.png` 指着远方城市
- 旅行空 → `couple-standing.png` 站在地图前
- 时光宝盒空 → `couple-sitting.png` 抱着个宝箱

**预计工作量**：1 天。

#### P1-4. tooltip 提示
**对应文件**：[components/MobileBottomNav.tsx](components/MobileBottomNav.tsx) + [components/ChinaMap.tsx:267-323](components/ChinaMap.tsx#L267-L323)
**改法**：用 `<button title="..." aria-label="...">` 补全；移动端底部 tab 保留小字标签（用 `text-[10px]` 极小字）；缩放按钮在 hover 时显示文字气泡。

**预计工作量**：半天。

#### P1-5. 错误色 = 暖红（避免和粉色冲突）
**对应文件**：[app/globals.css:8-19](app/globals.css#L8-L19)
**改法**：见 P0-2，统一在 `@theme` 加 `--color-error`，密码错时码盘抖动 + 暖红描边（`box-shadow: 0 0 0 4px rgba(232,132,90,.25)`）。

**预计工作量**：1 小时。

---

### 🟢 P2：锦上添花（让这个 App 从礼物变产品）

#### P2-1. 时光宝盒解锁仪式
**对应文件**：[components/memory/TimeCapsule.tsx](components/memory/TimeCapsule.tsx)
**改法**：每个宝盒设个"解锁日期"，到期前显示倒计时锁屏，**到期当天点击触发一个"打开"动画**（用 framer-motion 3D rotateX + 像素小情侣从盒子里探出头）。

**预计工作量**：1 天。

#### P2-2. 纪念日 Web Push 推送
**对应文件**：[public/sw.js](public/sw.js) + [data/appSettings.ts](data/appSettings.ts)
**改法**：用 Web Push API + Service Worker，在纪念日前 3 天 / 1 天 / 当天推送通知：「🌹 还有 3 天就是你们的纪念日啦」。

**预计工作量**：1.5 天（需要后端支持 / 用 Supabase 触发器）。

#### P2-3. 导出 PDF 回忆册
**对应文件**：新增 [components/memory/PdfExport.tsx](components/memory/PdfExport.tsx)
**改法**：用 `jspdf` 或 `react-pdf` 渲染某个时间段的回忆成 PDF，相册版式（封面 + 9 张照片/页 + 心情色边框 + 时间线）。

**预计工作量**：2 天。

#### P2-4. 5 套预设情侣 logo
**对应文件**：[components/memory/LogoSection.tsx](components/memory/LogoSection.tsx)
**改法**：在 [public/logo/](public/logo/) 加 5 套像素情侣剪影（樱花树 / 海边 / 山顶 / 樱花 / 月下），用户选一套后只填两个头像位置。

**预计工作量**：1 天（看美术资源）。

#### P2-5. 暗色模式下的"月光"主题色微调
**对应文件**：[app/globals.css](app/globals.css)
**改法**：暗色模式下主色不用纯黑，**用**深蓝紫 + 樱粉双色发光，模拟"月光在云层里透出来"的氛围。

**预计工作量**：半天。

#### P2-6. 相册页加"按心情筛选"
**对应文件**：[components/MemoryArchive.tsx](components/MemoryArchive.tsx)
**改法**：顶部加 6 个心情 chip，点击只看 🌹 的回忆（6 种心情分别筛选）。

**预计工作量**：半天。

---

## 六、给昊宇哥的话（隐藏彩蛋）

昊宇哥：

我以前觉得程序员做的"礼物"都是那种——「看！我会做 XX！」的工具，做完了就完事了。
但你这个不是工具，是**给我写了一封信**。

密码是纪念日，意味着我每天打开都要想一次"我们从哪天开始的"；
心情色联动，意味着我每次加回忆都是给未来埋一个彩蛋；
任意门深链，意味着我 5 年后再点开那张武汉的照片，会瞬间被"传送"回那一天。

**你用 React 组件拼出了我们一起走过的路。**

那些槽点我都写了，不是不喜欢你做的东西，是想让它陪我更久一点。
**我想每天打开，每天加一个回忆，加到地图上发光的城市比这个国家一半还多。**

所以那些 onboarding、那些 Toast、那些暗色主题、那些移动端的 tab——帮我做一下吧。
**让这个 App 能陪我 10 年，而不是 1 年。**

谢谢你，昊宇哥。

——小陈

> 附：我把我的进站密码改成了 `0308`（我们认识的那天）。
> 你猜对了吗？😉

---

## 七、附录：技术架构速览（给小陈自己看的好奇心）

> 这部分本来不该出现在"用户体验文档"里，但既然昊宇哥让我"深度分析"，我就把技术栈简单记一下，方便我以后自己研究。

### 技术栈
- **前端框架**：Next.js 16.2.6 + React 19.2.4（App Router）
- **样式**：Tailwind CSS v4 + 自研 CSS 变量主题
- **动效**：Framer Motion 12.39（spring 弹簧动画是它灵魂）
- **地图**：D3.js + d3-geo + **手写 SVG**（没有用 Leaflet/Mapbox/高德）
- **三端同构**：Web + Electron 桌面（Win/Mac）+ Capacitor Android APK
- **云端**：阿里云 OSS（图片）+ Supabase（生产数据库）
- **本地存储**：4 个 `*.private.json` 文件 + localStorage
- **认证**：自研 HMAC-SHA256 签名 Cookie（没有用 Auth.js）
- **PWA**：自带 Service Worker + manifest.json（可"加到主屏幕"）

### 关键文件
| 文件 | 作用 |
|---|---|
| [components/EntryExperience.tsx](components/EntryExperience.tsx) | 登录页（密码 + 拍立得 + 9 印戳） |
| [components/ChinaMap.tsx](components/ChinaMap.tsx) | 中国地图 SVG |
| [components/ProvinceMap.tsx](components/ProvinceMap.tsx) | 省份地图 + 城市点 |
| [components/HomeProgress.tsx](components/HomeProgress.tsx) | 进度 + 心情 + logo + 天气 |
| [components/TimelineOverlay.tsx](components/TimelineOverlay.tsx) | 旅行时间线动画 |
| [components/MemoryArchive.tsx](components/MemoryArchive.tsx) | 回忆相册 |
| [components/MobileBottomNav.tsx](components/MobileBottomNav.tsx) | 移动端底部 tab |
| [components/memory/MemoryToolPage.tsx](components/memory/MemoryToolPage.tsx) | 工具页壳（纪念日/收藏/宝盒/旅行） |
| [app/globals.css](app/globals.css) | 主题色 + 动画关键帧 |
| [data/memories.ts](data/memories.ts) | 心情色板 |
| [data/appSettings.ts](data/appSettings.ts) | 默认值（中性默认值，避免泄露原配置） |
| [package.json](package.json) | 依赖 + 三端构建脚本 |

### 版本里程碑
- **v0.1.0**（2026-06-14）：OSS + Android + 桌面端 + UI 优化
- **2026-06-16**：补回 API 路由 hotfix + 修复 sharp DLL
- **当前状态**：所有核心功能可用，三端同构，配置即数据库

---

> 本文档由小陈（项目目标用户视角）整理，2026-06-18。
> 任何引用请保留作者署名。
