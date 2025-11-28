<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Moodify — Weekly AI Music Journal

Live demo: https://moodify-music-tau.vercel.app

项目简介
---------
这是一个前端应用，用户每天可以输入当天的心情（或短句），应用会基于该心情生成一段约 30 秒的短曲。每周结束时，应用会把该周每天生成的短曲或提示融合，生成一首完整的周末混音（完整歌曲）。

主要特点
- 每日心情输入 → 生成 30 秒单曲（文本到音频的调用由服务层处理）
- 每周汇总 → 生成一首完整的歌曲／周混音
- 单页面应用（React + Vite + TypeScript），前端负责 UI 与与后端服务的交互

运行和构建（完整步骤）
------------------
前提条件
- Node.js (推荐 18+)
- npm

1) 克隆仓库并进入目录

```bash
git clone https://github.com/DavidZhou927/moodify-music.git
cd moodify-music
```

2) 安装依赖

```bash
npm install
```

3) 本地开发

在开发模式下运行：

```bash
npm run dev
```

浏览器打开 http://localhost:5173 （Vite 默认端口，若被占用会提示其他端口）。

4) 生产构建

```bash
npm run build
npm run preview   # 可选：本地预览生产构建
```

5) 环境变量（可选，只有在你要启用 Gemini / Stability 等云服务时需要）

- 在项目根目录创建 `.env` 或其他你喜欢的环境文件。
- 常见变量：
   - `API_KEY` 或 `GEMINI_API_KEY`（如果你使用 Gemini 服务）
   - 程序内调用 Stability 或其他 AI 服务的密钥

示例 `.env`（不要提交到仓库）

```text
# Gemini（可选）
GEMINI_API_KEY=your_gemini_api_key_here

# Stability API（可选）
STABILITY_API_KEY=your_stability_api_key_here
```

6) 运行生产版本（可选）

```bash
npm run build
npm run preview
```

仓库布局（简短）
- `src` / 根文件：Vite + React 应用入口（包括 `App.tsx`, `index.tsx` 等）
- `components/`: React 组件（`MoodInput`, `MusicCard`, `AudioPlayer` 等）
- `services/`: 与外部 AI 服务对接的逻辑（`geminiService.ts`, `stabilityService.ts`）
- `scripts/`: 本地辅助脚本（例如用于调试或数据生成）

安全与注意事项
- 项目中不要把 API 密钥提交到远程仓库；把密钥放在环境变量里或通过后端代理调用。
- 当前项目示例中对 `@google/genai` 做了服务器端动态导入保护，避免在浏览器端直接初始化需要 API key 的 SDK。

联系方式
- 仓库： https://github.com/DavidZhou927/moodify-music

如果需要我把 README 再调整格式或添加部署说明（例如如何在 Vercel 上配置环境变量），告诉我我会继续更新。
