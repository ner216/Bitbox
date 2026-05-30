# Bitbox — Project Context

Short description
- Bitbox is a multi-part project for audio/music: a frontend (mobile/web app in `bitbox/app`), an audio backend in `audio-backend`, and AI tooling in `ai-logic-tools`.

Languages and runtimes
- Frontend: TypeScript / React (likely React Native / Expo). See `bitbox/app` for screens and components.
- Backend: Python (Flask/FastAPI style in `audio-backend/app`), and Docker for deployment.
- AI tools: Python utilities in `ai-logic-tools` for feature extraction and vector generation.

Key entrypoints
- Frontend app: `bitbox/app/index.tsx`, screens under `bitbox/app` (e.g., `home.tsx`, `MusicPlayer.tsx`).
- Backend service: `audio-backend/app/main.py` and `audio-backend/dockerfile`.
- Database interface: `audio-backend/app/db/interface.py` and `bitbox/app.json` / `db.json` for configs.
- AI processing: `ai-logic-tools/generate_vectors.py` and `ai-logic-tools/logic.py`.

Dev & run hints
- Use `docker-compose.yaml` at repo root for containerized services.
- Python deps live in `audio-backend/requirements.txt` and `ai-logic-tools/requirements.txt`.
- Frontend deps and scripts in `bitbox/package.json` and `bitbox/tsconfig.json`.

Tests
- Backend tests: `audio-backend/app/tests/` (contains `test_routes.py`, `db_interface_tests.py`).

Where to look first (for a new contributor or AI):
1. `README.md` at repo root for high-level context.
2. `audio-backend/app/main.py` to understand API routes.
3. `bitbox/app/index.tsx` to see how the UI starts and what data it expects.
4. `ai-logic-tools` for audio feature extraction and vector generation flow.

Notes for the assistant
- When asked to modify or reason about project behavior, prefer minimal, focused changes and run/tests if available.
- Use database schema at `audio-backend/app/db/bitbox_schema.sql` as source of truth for DB fields.
- If adding endpoints, update `audio-backend/app/routes.py` and add tests under `audio-backend/app/tests/`.

Contact points in code
- UI components: `bitbox/components` and `bitbox/components/ui`.
- Backend DB & tools: `audio-backend/app/db/interface.py`, `audio-backend/app/db/sound_tools.py`.

Last updated: 2026-05-30
