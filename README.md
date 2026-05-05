# 练知 (Refiner)

<div align="center">

✦ **AI 驱动的学习助手** ✦

将你的课堂笔记转化为结构化知识卡片和练习题

[在线体验](https://diaojz.github.io/refind/app/) | [查看文档](./refiner-course/README.md)

</div>

---

## 📖 项目简介

**练知 (Refiner)** 是一个基于 AI 的学习助手应用，专为零基础 AI 开发课程设计。它能够：

- 📝 **笔记结构化** — 将混乱的课堂笔记自动整理成清晰的知识大纲
- 🎴 **知识卡片** — 生成 Tinder 式滑动闯关卡片，让复习更有趣
- 📊 **智能出题** — 根据知识点自动生成选择题、判断题和简答题
- ✅ **AI 评分** — 智能评估答案质量，给出针对性反馈

## 🎯 核心特性

### 1. 笔记结构化
粘贴你的课堂笔记，AI 自动提取知识点并生成结构化大纲。

### 2. 滑动闯关模式
- 一次只展示一张知识卡片，聚焦学习
- 左滑标记"掌握了"，右滑标记"待复习"
- 实时进度反馈，完成后显示学习总结

### 3. 智能练习题
- 混合题型：选择题 + 判断题 + 简答题
- AI 自动评分并给出鼓励性反馈
- 关联知识点，针对性巩固

## 🚀 快速开始

### 在线使用

访问 **https://diaojz.github.io/refind/app/**

首次使用需要配置 DeepSeek API Key：
1. 访问 [DeepSeek 平台](https://platform.deepseek.com) 获取 API Key
2. 在弹窗中输入你的 API Key
3. Key 仅存储在浏览器本地，不会上传到服务器

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/diaojz/refind.git
cd refind/refiner-course/app

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的 DEEPSEEK_API_KEY

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173/ 即可使用。

## 🛠️ 技术栈

- **前端框架**: Vue 3 + Vite
- **样式**: Tailwind CSS 4.x
- **AI 模型**: DeepSeek V4
- **部署**: GitHub Pages + GitHub Actions

## 📂 项目结构

```
refind/
├── refiner-course/
│   ├── app/                    # Vue 3 前端应用
│   │   ├── src/
│   │   │   ├── api/           # DeepSeek API 封装
│   │   │   ├── components/    # 页面组件
│   │   │   └── stores/        # 状态管理
│   │   └── .env.example       # 环境变量模板
│   └── prompts/               # 4 组核心提示词
│       ├── 01-笔记结构化.md
│       ├── 02-知识卡片生成.md
│       ├── 03-练习题生成.md
│       ├── 04-答题评分器.md
│       └── 05-体验优化-v1.1-交互升级.md
├── .github/workflows/         # GitHub Actions 自动部署
└── README.md
```

## 🎨 核心提示词

项目包含 5 个精心设计的提示词，覆盖完整学习流程：

| 提示词 | 功能 | 输入 | 输出 |
|--------|------|------|------|
| P1 笔记结构化 | 提取知识点 | 原始笔记文本 | 结构化大纲 JSON |
| P2 知识卡片生成 | 生成学习卡片 | 单个知识点 | 正反面卡片 JSON |
| P3 练习题生成 | 智能出题 | 知识点列表 | 练习题列表 JSON |
| P4 答题评分器 | 评估答案 | 题目 + 用户答案 | 评分 + 反馈 JSON |
| P5 体验优化 | 滑动闯关交互 | - | 组件重构指南 |

详细说明见 [prompts/00-prompt-index.md](./refiner-course/prompts/00-prompt-index.md)

## 🔒 安全说明

- ✅ API Key 存储在浏览器 localStorage，不会上传到服务器
- ✅ `.env` 文件已在 `.gitignore` 中，不会被提交到 Git
- ✅ 用户可随时在右上角 "⚙️ API Key" 按钮修改配置
- ⚠️ 前端直连 DeepSeek API，请勿在公共场合暴露你的 Key

## 📝 开发日志

- **v2.0.0** (2026-05-06) - 双路径部署与在线体验，GitHub Pages 自动化部署
- **v1.1** (2026-05-05) - 知识卡片改为滑动闯关模式，提示词文件中文命名
- **v1.0** (2026-05-04) - 初始版本，完成核心功能

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

<div align="center">

**用 AI 让学习更高效** ✨

Made with ❤️ by [diaojz](https://github.com/diaojz)

</div>
