# 部署到 GitHub Pages

## 前置准备

1. **创建 GitHub 仓库**
   ```bash
   # 如果还没有推送到 GitHub
   git remote add origin https://github.com/你的用户名/vibe-coding.git
   git push -u origin main
   ```

2. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"

3. **配置 API Key（重要）**
   
   由于前端直连 DeepSeek API，有两种方案：

   ### 方案 A：用户自行输入 API Key（推荐）
   修改应用让用户在首次使用时输入自己的 DeepSeek API key，存储在 localStorage。

   ### 方案 B：使用演示 Key（有风险）
   在代码中硬编码一个限额较低的演示 key，但需要注意：
   - 会被所有访问者共享使用
   - 容易被滥用导致额度耗尽
   - 不适合生产环境

## 自动部署

推送到 `main` 分支后，GitHub Actions 会自动：
1. 安装依赖
2. 构建项目
3. 部署到 GitHub Pages

访问地址：`https://你的用户名.github.io/vibe-coding/`

## 本地测试构建

```bash
cd refiner-course/app
npm run build
npm run preview
```

## 注意事项

- ⚠️ **不要提交 `.env` 文件**（已在 `.gitignore` 中）
- ⚠️ **前端暴露 API key 有安全风险**，建议改为用户自行配置
- 首次部署后需要等待 1-2 分钟才能访问
- 如果 404，检查仓库名是否与 `vite.config.js` 中的 `base` 一致
