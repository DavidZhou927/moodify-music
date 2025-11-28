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
