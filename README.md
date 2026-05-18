# AI同人灵感管理助手

基于 React + Supabase 的同人创作管理工具。

## 技术栈

- React 18
- Vite
- React Router
- Supabase

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Supabase

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

在 `.env` 文件中填入你的 Supabase 配置：

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── pages/          # 页面组件
│   ├── Home.jsx           # 首页
│   ├── CpList.jsx         # CP列表
│   ├── CreateCp.jsx       # 创建CP
│   └── AuDetail.jsx       # AU详情页（空页面）
├── supabase/       # Supabase 配置
│   └── client.js
├── App.jsx         # 主应用组件
├── main.jsx        # 入口文件
└── index.css       # 全局样式
```

## 当前功能

第一阶段已完成：
- ✅ 首页（显示快速开始信息和导航）
- ✅ CP列表页（展示CP卡片，支持搜索）
- ✅ 创建CP页（表单创建CP）
- ✅ AU详情页（空页面，待开发）

## 待开发功能

- Supabase 数据库集成
- CP 数据的增删改查
- AU 管理功能
- 灵感输入与管理
- AI 分类与标签
- AI 情感分析
- AI 扩写功能

## 设计风格

- 简洁、安静的编辑工具风格
- 中文界面
- 偏长期陪伴感
- 不社交化、不花哨
