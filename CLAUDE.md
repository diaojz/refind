# 练知 (Refiner) — Vue 项目

> AI 学习助手课堂案例

## 项目结构

```
refiner-course/
├── app/                 ← Vue 3 + Vite 前端项目
│   ├── src/
│   │   ├── api/         ← DeepSeek API 封装
│   │   ├── components/  ← 页面组件
│   │   └── stores/      ← 状态管理
│   └── .env.example     ← 环境变量模板
├── prompts/             ← 4 组核心提示词
└── README.md            ← 产品总文档
```

## 开发

```bash
cd refiner-course/app
cp .env.example .env    # 填入 DEEPSEEK_API_KEY
npm install
npm run dev
```

## 关键约定

- 每个功能完成时提交一次代码
- 不要直接提交 `.env` 文件
- API 调用封装在 `src/api/` 目录下
- 组件放在 `src/components/` 目录下
