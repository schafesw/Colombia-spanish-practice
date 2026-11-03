# Español · Colombia — Project Rules (`AGENTS.md`)

## 🔒 Strict Audio / TTS Freeze Rule (DO NOT TOUCH)
- **NEVER modify the voice, speech synthesis, or audio playback code** in `app.js` (`getSpanishVoices`, `chooseSpanishVoice`, `rememberVoice`, `syncVoiceSelectors`, `loadV`, `buildVoiceBars`, `chV`, `speak`, `rememberSpoken`, `VOICE_KEY`, or any `speak(...)` invocation pattern) unless the user explicitly asks for an audio change AND the upgrade fix is tested and validated on iPhone.
- **Why**: The current `v90.0` voice engine restores the proven `v45` iPhone Web Speech API (`window.speechSynthesis`) behavior:
  - Uses un-deduplicated `voices.filter(v=>/^es(?:-|_|$)/i.test(String(v.lang||"")))` so iOS `voiceURI` entries are never discarded.
  - Prioritizes `["es-CO","es-419","es-MX","es-US","es-AR","es-ES"]` without forcing a hardcoded voice name like `Paulina`.
  - Uses `VOICE_KEY = "esco-selected-voice-v45"`.
  - Calls `speechSynthesis.speak(u)` synchronously inside the user tap gesture (never wrapped in `setTimeout`).

## 📦 Deployment & Sync Locations
Whenever content, lessons, vocabulary, or UI changes are made (while keeping the audio block untouched):
1. Update the workspace at `c:\Users\schaf\Documents\antigravity\modest-maxwell`.
2. Export a clean folder and `.zip` to `C:\Users\schaf\OneDrive\Documents\Spanish app\`.
3. Push to the private Global Entry GitLab repo (`https://api.norvi.tech/gitlab/seth/espanol-colombia.git`).
