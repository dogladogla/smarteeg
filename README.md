# SmartEEG — Standardised Paediatric EEG Reporting System

## What this is
A React single-page app for structured paediatric EEG reporting, with an AI-assisted
Conclusion drafting feature backed by Claude (via a secure serverless proxy, so the
API key never reaches the browser).

## Deploying (Vercel + GitHub, no CLI/token needed)

1. **Push this folder to a new GitHub repository.**
   Easiest way: create a new repo on github.com, then on the repo page click
   "uploading an existing file" and drag in all files from this folder
   (excluding `node_modules` and `dist` — already excluded via `.gitignore`).

2. **Import into Vercel.**
   Go to vercel.com/new, choose "Import Git Repository", select the repo you just
   created. Vercel auto-detects the Vite framework — leave build settings as default
   (Build Command: `npm run build`, Output Directory: `dist`).

3. **Add your Anthropic API key as an environment variable.**
   In the Vercel project → Settings → Environment Variables, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your key (starts with `sk-ant-...`)
   - Environment: Production (and Preview, if you want preview deployments to also work)

   This key is encrypted at rest by Vercel and is only readable by the serverless
   function in `api/generate.js` — it is never sent to the browser.

4. **Deploy.** Vercel builds and gives you a live URL (e.g. `smarteeg.vercel.app`)
   that works on any device with a browser. Share that link for feedback.

## Local development

```bash
npm install
npm run dev
```

The AI Conclusion feature won't work locally unless you also run `vercel dev`
with the env var set, since it depends on the serverless function. The rest of
the app (forms, PDF export, sign-off flow) works fully offline.

## Architecture notes

- `src/SmartEEG.jsx` — the entire application (single component tree)
- `api/generate.js` — serverless function proxying Claude API calls
- Reports/users currently live in React state only (not persisted to a database).
  Each browser session is independent; refreshing loses unsaved work. This is fine
  for UI/UX feedback but not for production clinical use — ask Claude to add a
  database (e.g. Supabase) if persistent, shared report storage is needed next.
