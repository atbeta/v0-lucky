# 🎉 Lucky Draw 抽奖助手

Lucky Draw 是一个现代化、功能强大且界面精美的抽奖应用程序。它基于 **Next.js** 和 **Tauri** 构建，既可以作为 Web 应用运行，也可以作为原生桌面应用使用。

本项目专为年会、活动、直播抽奖等场景设计，支持多种抽奖模式、权重配置以及沉浸式的视听体验。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0.0-green.svg)

## 📸 界面预览

<div align="center">
  <img src="https://image.pbeta.me/2026/01/snapshot1.png" width="32%" alt="Snapshot 1" />
  <img src="https://image.pbeta.me/2026/01/snapshot2.png" width="32%" alt="Snapshot 2" />
  <img src="https://image.pbeta.me/2026/01/snapshot3.png" width="32%" alt="Snapshot 3" />
</div>

## ✨ 核心特性

### 🎯 多样的抽奖模式
- **经典模式 (Classic Mode)**：
  - **逐个抽取**：最具仪式感的方式，点击一次抽取一位。
  - **一次性全部**：效率最高，瞬间展示所有中奖者。
  - **分批抽取**：平衡速度与悬念，支持自定义每批抽取人数。
- **晋级模式 (Tournament Mode)**：
  - 支持多轮次配置（如：海选 -> 半决赛 -> 决赛）。
  - 自动管理晋级名单，上一轮的中奖者自动进入下一轮候选池。

### ⚖️ 权重抽奖系统
- **加权随机算法**：完全支持设置参与者权重（Weight）。权重越高，中奖概率越大。
- **公平性验证**：算法经过大量模拟验证，确保概率分布准确可靠。

### 👥 强大的名单管理
- **批量导入/导出**：支持 Excel (CSV/TXT) 和 JSON 格式导入。
- **数据管理**：支持添加、删除、编辑参与者及权重。
- **排除机制**：支持手动排除特定人员，或设置中奖后自动排除。
- **搜索与筛选**：快速查找特定参与者。

### 🎨 极致的用户体验
- **沉浸式 UI**：基于 Tailwind CSS 和 Radix UI 打造的现代化深色界面，磨砂玻璃质感。
- **视听特效**：
  - 🎰 名字滚动动画（支持隐藏真实名字增加悬念）。
  - 🎉 中奖粒子特效（Confetti）。
  - 🎵 背景音乐与音效控制。
- **实时概览**：侧边栏与 Inspector 面板实时展示当前抽奖进度与统计。

## 🛠️ 技术栈

- **框架**: [Next.js 14](https://nextjs.org/) (React)
- **桌面端引擎**: [Tauri v2](https://tauri.app/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **组件库**: [Shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **图标**: [Lucide React](https://lucide.dev/)
- **状态管理**: React Hooks

## 🚀 快速开始

### 环境要求
- Node.js (推荐 v18+)
- Rust (仅在构建桌面端应用时需要)

### 安装依赖

```bash
npm install
# 或者
pnpm install
# 或者
yarn install
```

### 开发模式运行

**Web 模式:**
```bash
npm run dev
```
访问 http://localhost:3000 即可使用。

**桌面应用模式 (Tauri):**
```bash
npm run tauri dev
```

### 构建生产版本

**Web 构建:**
```bash
npm run build
```

**桌面端构建:**
```bash
npm run tauri build
```

## 📖 使用指南

1.  **人员配置**：
    *   进入「参与人员」页面。
    *   点击导入按钮上传名单（支持 CSV/TXT/JSON），或手动添加。
    *   如需设置权重，可在导入文件中指定或在列表中手动修改。
2.  **抽奖配置**：
    *   进入「抽奖配置」页面。
    *   选择模式（经典/晋级）。
    *   设置中奖人数、抽取方式（逐个/分批）。
    *   自定义奖品名称。
3.  **开始抽奖**：
    *   进入主界面（抽奖台）。
    *   点击底部控制栏的 ▶️ 播放按钮开始滚动。
    *   再次点击 ⏹️ 停止按钮（或空格键）抽出中奖者。
4.  **历史记录**：
    *   抽奖结束后，结果会自动保存到「历史记录」页面，支持随时查看。

## 📂 目录结构

```
e:\Code\v0-lucky\
├── app/                # Next.js 应用主入口
├── components/         # React 组件
│   ├── ui/             # 基础 UI 组件 (Button, Input, etc.)
│   ├── views/          # 主要视图组件 (Draw, Config, Participants)
│   └── ...
├── src-tauri/          # Tauri 后端 (Rust)
├── public/             # 静态资源 (Audio, Images)
└── ...
```

## 📝 许可证

MIT License
