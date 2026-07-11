# pm-resume

## 项目概述

产品经理个人简历网站 — 单页 6 屏求职展示站。浅色高级科技风，使用 Next.js + TypeScript + Tailwind CSS + Framer Motion 技术栈。

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript (strict mode)
- **样式**: Tailwind CSS v4 + CSS Variables（主题色管理）
- **动效**: Framer Motion（入场/hover/浮动）
- **图标**: Lucide React
- **字体**: Geist Sans + Geist Mono

## 设计规范

### 色彩系统

```
--bg-main:       #F3F4E8   页面主背景（米灰绿）
--bg-soft:       #EEF1E3   柔和背景
--bg-cream:      #FBFBF4   奶油白
--card-bg:       rgba(255,255,248,0.86)  卡片底色（玻璃感）
--green-deep:    #1F3B34   最深绿（主标题、正文）
--green-main:    #819A91   中绿（次要文字、图标）
--green-soft:    #A7C1A8   浅绿（边框、光晕）
--green-pale:    #D1D8BE   最浅绿（装饰）
--orange:        #F29B58   暖橙（高亮节点、CTA强调）
--orange-soft:   #FFE3C9   浅橙（柔和强调）
--text-main:     #1F3B34   主文字
--text-secondary:#6F8178   次要文字
--text-muted:    #9DAEA5   弱化文字
--line-soft:     rgba(129,154,145,0.22)  细线
--shadow-soft:   rgba(31,59,52,0.08)     柔和阴影
```

### 视觉关键词

浅色高级科技风、低饱和青灰绿、鼠尾草绿、米灰/奶油白、柔和光晕、悬浮卡片、空间层次、有呼吸感、克制专业清爽。

### 禁止风格

深色赛博朋克、纯黑控制台、强烈荧光、厚重3D塑料感、杂乱粒子。

### 动效规范

- 入场: fadeInUp, 400-600ms
- hover: scale(1.03) + translateY(-2px), 250-350ms
- idle 呼吸: 3-6px 浮动, 4-6s
- 缓动函数: cubic-bezier(0.22, 0.61, 0.36, 1)

### 响应式

- Desktop (>1024px): 完整横向布局
- Tablet (768-1024px): 缩小尺寸
- Mobile (<768px): 纵向布局

## 目录结构

```
src/
├── app/            # Next.js App Router
├── components/     # React 组件
│   ├── common/     # 公共组件 (Button, GlassCard, Tag, etc.)
│   ├── layout/     # 布局组件 (Navbar)
│   ├── sections/   # 6 屏 Section 组件
│   ├── hero/       # Hero 屏子组件
│   ├── career/     # 工作经历屏子组件
│   ├── projects/   # 项目经历屏子组件
│   ├── vibe/       # Vibe Coding 屏子组件
│   └── capability/ # 能力画像屏子组件
├── data/           # 简历内容数据（与视图分离）
├── types/          # TypeScript 类型定义
└── hooks/          # 自定义 Hooks
```

## 6 屏结构

1. **Hero** — 个人介绍 + AI 岗位匹配器 + PM Command Center 视觉
2. **Career Path** — 横向职业轨迹，三张阶段卡片 + 发光时间轴
3. **Project Works** — 横向项目展厅，hover 放大 + 右侧详情 Drawer
4. **Vibe Coding** — AI Demo 轻量展示，1-2 个 Demo
5. **Capability Map** — 中央能力核心 + 四张能力卡片 hover 联动
6. **Contact** — 联系方式 + 教育经历 + 邮箱复制

## 关键交互

- 导航平滑滚动到对应 section
- AI 岗位匹配器点击打开居中 Modal（mock 结果）
- 项目卡片 hover 自动切换焦点，点击"查看详情"打开右侧 Drawer
- 能力卡片 hover 中央模块联动显示短语
- 联系卡片从首页跳转后触发高亮反馈
- Modal/Drawer 打开锁定滚动、ESC 关闭

## 开发 PRD

完整需求文档: `/Users/fjy/Downloads/产品经理个人简历网站_Claude开发PRD.md`

## 开发

```bash
cd pm-resume
npm run dev    # http://localhost:3000
npm run build  # 生产构建
```
