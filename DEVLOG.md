# 开发日志 — 产品经理个人简历网站

## 2026-05-22

### 项目初始化
- ✅ Next.js 16 + TypeScript + Tailwind CSS v4 脚手架
- ✅ 安装 framer-motion, lucide-react
- ✅ 目录结构创建

### 基础层完成
- ✅ `src/types/index.ts` — 全站类型定义 (ExperienceItem, ProjectItem, VibeProjectItem, CapabilityItem, MatchResult, Profile 等)
- ✅ `src/data/profile.ts` — 个人信息数据
- ✅ `src/data/experiences.ts` — 3 条工作经历（起点/成长/当下）
- ✅ `src/data/projects.ts` — 4 个项目详情
- ✅ `src/data/vibeProjects.ts` — 2 个 Vibe Coding Demo
- ✅ `src/data/capabilities.ts` — 4 张能力卡片
- ✅ `src/app/globals.css` — CSS 变量 + 全局样式 + 动画 keyframes
- ✅ `src/app/layout.tsx` — 根布局 + Metadata
- ✅ `CLAUDE.md` — 项目技术栈、设计规范、组件架构文档

### 公共组件完成
- ✅ Button — Framer Motion hover (scale 1.03, y -2px)，4 种 variant
- ✅ GlassCard — 玻璃态卡片，hover 上浮
- ✅ Tag — 标签芯片，3 种配色
- ✅ SectionHeader — 统一样式的 section 标题（英文标签 + 中文标题 + 副标题）
- ✅ ProgressIndicator — 项目进度指示条
- ✅ Navbar — 固定顶部导航，平滑滚动，像素风 logo

### 并行开发 (子 Agent)

#### Agent 1: Hero 屏
- ✅ HeroIntro — 左侧介绍面板 + 按钮
- ✅ JdMatcherCard — JD 输入卡片
- ✅ JdMatchModal — AI 岗位匹配弹窗（loading/result/error 三态）
- ✅ PMCommandCenterVisual — 指挥中枢视觉
- ✅ HeroSection — 组合 42%/58% 左右布局

#### Agent 2: Career + Contact 屏
- ✅ CareerCards — 三张阶段卡片 + 入场动效
- ✅ CareerTimeline — 发光时间轴
- ✅ CareerPathSection — 组合标题 + 卡片 + 时间轴
- ✅ ContactSection — 联系方式卡片 + 教育经历卡片 + 邮箱复制 + pulse 高亮

#### Agent 3: Projects + Vibe + Capability 屏
- ✅ ProjectAbstractVisual — 抽象背景视觉
- ✅ ProjectCard — 项目卡片 + hover 聚焦联动
- ✅ ProjectCarousel — 横向展厅 + 进度指示
- ✅ ProjectDetailDrawer — 右侧详情抽屉
- ✅ ProjectWorksSection — 组合背景 + 展厅 + Drawer
- ✅ VibeDemoCard — Demo 卡片（primary/secondary 变体）
- ✅ VibeCodingSection — IDEA→AI→DEMO 流程视觉 + Demo 卡片
- ✅ CapabilityCore — 中央能力核心模块
- ✅ CapabilityCard — 能力卡片 + hover 联动
- ✅ CapabilitySection — 3x3 十字 Grid 布局 + SVG 连接线

### 组装与构建验证
- ✅ `src/app/page.tsx` — 6 屏组合 + contactPulse 状态管理
- ✅ `src/hooks/useScrollToSection.ts` — 平滑滚动 hook
- ✅ `src/hooks/useReducedMotion.ts` — Reduced motion 媒体查询
- ✅ TypeScript 类型检查通过
- ✅ `npm run build` 构建成功，零错误
- ✅ 修复 ContactSection.tsx 重复 `transition` prop 编译错误

---

## 技术细节备忘

### Tailwind v4 注意
- 无 tailwind.config.ts，配置通过 CSS `@theme inline` 和 CSS 变量
- 任意值语法: `bg-[var(--bg-cream)]`, `text-[var(--green-deep)]`
- 全局动画通过 `@keyframes` 定义在 globals.css

### 组件约定
- 所有交互组件标记 `"use client"`
- 数据与视图分离：组件从 `@/data/*` 导入数据结构
- Framer Motion 缓动: `[0.22, 0.61, 0.36, 1]`

### 数据文件（占位内容，等待真实内容替换）
- `src/data/profile.ts` — 姓名、电话、邮箱、微信二维码、教育经历
- `src/data/experiences.ts` — 3 条工作经历
- `src/data/projects.ts` — 4 个项目
- `src/data/vibeProjects.ts` — 2 个 Vibe Coding Demo
- `src/data/capabilities.ts` — 4 张能力卡片
