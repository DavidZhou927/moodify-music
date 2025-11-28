

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
# Moodify — Weekly AI Music Journal

Live demo: https://moodify-music-tau.vercel.app

Project Overview
----------------
Moodify is a single-page application (React + Vite + TypeScript) that helps users create short music snippets from daily mood entries and then combines the week's entries into a full weekly track.

How it works
- Enter a mood or short text each day.
- The app generates a ~30-second music clip for that day's mood (text-to-audio handled by backend/service code).
- At the end of the week, the app can generate a full song / weekly mix by combining the daily prompts or generated clips.

Key Features
- Daily mood input → 30s generated track
- Weekly summary → full weekly mix
- Frontend UI with audio playback and history

Full local run & build instructions
---------------------------------
Prerequisites
- Node.js (recommended 18+)
- npm

1) Clone the repository and enter the folder

```bash
git clone https://github.com/DavidZhou927/moodify-music.git
cd moodify-music
```

2) Install dependencies

```bash
npm install
```

3) Run in development mode

```bash
npm run dev
```

Open your browser at http://localhost:5173 (Vite will show a different port if 5173 is occupied).

4) Production build and preview

```bash
npm run build
npm run preview  # optional local preview of production build
```

Environment variables (optional)
--------------------------------
Only required if you want to enable cloud AI services (Gemini, Stability, etc.). Create a `.env` file in project root and add any required keys. Do not commit secrets.

Example `.env`

```text
# Gemini (optional)
GEMINI_API_KEY=your_gemini_api_key_here

# Stability API (optional)
STABILITY_API_KEY=your_stability_api_key_here
```

Project layout (short)
- `components/` — React components (`MoodInput`, `MusicCard`, `AudioPlayer`, ...)
- `services/` — Service wrappers for AI APIs (`geminiService.ts`, `stabilityService.ts`)
- `scripts/` — helper scripts used for debugging or generation

Security notes
- Never commit API keys to the repository. Use environment variables or a backend proxy.
- The project contains server-side protection around `@google/genai` so the SDK is not initialized in the browser bundle.

Repository
- https://github.com/DavidZhou927/moodify-music

If you want the README to include Vercel deployment steps, environment variable examples for production, or a short GIF demo, tell me and I will add it.
