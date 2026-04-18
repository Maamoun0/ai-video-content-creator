# Tasks: AI Content Creator Tool

## Implementation Strategy
- **MVP First**: Focus on User Story 1 (Shorts creation) as the initial milestone.
- **Incremental Delivery**: Each phase (US1 to US6) represents a standalone, testable feature increment.
- **Parallel Execution**: Frontend and Backend components within the same user story can often be developed in parallel.

## Phase 1: Setup (Project Initialization)

- [x] T001 Initialize Frontend monorepo at `/frontend` using Vite + React + TypeScript
- [x] T002 Initialize Backend monorepo at `/backend` using Node.js + Express + TypeScript
- [x] T003 [P] Configure Tailwind CSS v3 and Cairo (Arabic) / Inter (English) fonts in `frontend/tailwind.config.js`
- [x] T004 Install Firebase SDK and initialize configuration in `frontend/src/services/firebase.ts`
- [x] T005 Setup Google Cloud SDK and environment variables in `backend/.env.local`

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T006 Configure GCS Object Lifecycle Policy (7-day TTL) for the media bucket via `gcloud`
- [x] T007 Implement Firebase Auth (Google Sign-In) provider in `frontend/src/stores/userStore.ts`
- [x] T008 [P] Setup Zustand `persist` middleware for local draft auto-save in `frontend/src/stores/projectStore.ts`
- [x] T009 Implement API Authentication middleware in `backend/src/middleware/auth.ts`
- [x] T010 Create base Dockerfile for Cloud Run with FFmpeg and Python/Whisper in `backend/Dockerfile`

## Phase 3: [US1] Create Short-Form Video (Priority: P1)
**Goal**: Take a text idea and produce a 1080p vertical video with all 7 pipeline steps.

- [ ] T011 [P] [US1] Create Setup form UI for Mode/Language/Duration in `frontend/src/components/steps/Step1_Setup.tsx`
- [ ] T012 [P] [US1] Create Idea input and content type chips in `frontend/src/components/steps/Step2_Idea.tsx`
- [ ] T013 [US1] Implement Gemini 2.5 Pro script generation route in `backend/src/routes/script.ts`
- [ ] T014 [US1] Create Script selection and edit UI in `frontend/src/components/steps/Step3_Script.tsx`
- [ ] T015 [US1] Implement Cloud TTS (AR) and OpenAI TTS (EN) service in `backend/src/services/voiceoverService.ts`
- [ ] T016 [US1] Create Voice selection UI with audio preview in `frontend/src/components/steps/Step4_Voiceover.tsx`
- [ ] T017 [US1] Implement Gemini/Imagen 3 asset planning and generation in `backend/src/services/assetService.ts`
- [ ] T018 [US1] Create Asset selection grid with "Use best" logic in `frontend/src/components/steps/Step5_Assets.tsx`
- [ ] T019 [US1] Implement Pixabay Music matching and preview service in `backend/src/routes/music.ts`
- [ ] T020 [US1] Create Music selection and volume control in `frontend/src/components/steps/Step6_Music.tsx`
- [ ] T021 [US1] Implement FFmpeg montage orchestration logic in `backend/src/services/ffmpegService.ts`
- [ ] T022 [US1] Implement Whisper caption generation and styling in `backend/src/services/captionService.ts`
- [ ] T023 [US1] Create Real-time progress screen using RTDB in `frontend/src/components/steps/Step7_Montage.tsx`
- [ ] T024 [US1] Implement MP4 download with signed GCS URLs in `frontend/src/services/videoService.ts`

## Phase 4: [US2] Create Long-Form Video (Priority: P2)
**Goal**: Support 16:9 aspect ratio and multi-minute scripts/montage.

- [ ] T025 [US2] Adjust Script generation prompt for extended durations in `backend/src/utils/prompts.ts`
- [ ] T026 [US2] Implement 16:9 scaling and padding logic in `backend/src/utils/ffmpegTemplates.ts`

## Phase 5: [US3] Enhance Existing Video (Priority: P3)
**Goal**: Analyze uploaded video and apply automated enhancements.

- [ ] T027 [US3] Implement Gemini Vision video analysis service in `backend/src/services/videoAnalysisService.ts`
- [ ] T028 [US3] Create Enhancement selection UI for external uploads in `frontend/src/pages/Creator.tsx`

## Phase 6: [US4] Manage Past Projects (Priority: P4)
**Goal**: View project history and project status monitoring.

- [ ] T029 [US4] Create Dashboard layout with project cards and thumbnails in `frontend/src/pages/Dashboard.tsx`
- [ ] T030 [US4] Implement Firestore project sync and status listener in `frontend/src/stores/projectStore.ts`

## Phase 7: [US5] Toggle Pipeline Features (Priority: P5)
**Goal**: Skip production steps (voice, music, etc.) based on user toggles.

- [ ] T031 [US5] Implement dynamic step navigation based on toggles in `frontend/src/pages/Creator.tsx`
- [ ] T032 [US5] Implement conditional montage mixing in `backend/src/services/ffmpegService.ts`

## Phase 8: [US6] Upload Personal Media (Priority: P6)
**Goal**: Mix user files with AI-generated assets.

- [ ] T033 [US6] Implement multi-file upload with progress bar in `frontend/src/components/ui/FileUpload.tsx`
- [ ] T034 [US6] Update Asset selector UI to highlight uploaded files in `frontend/src/components/steps/Step5_Assets.tsx`

## Phase 9: Polish & Cross-Cutting Concerns

- [ ] T035 Perform RTL layout audit and fix Arabic alignment in all `frontend` components
- [ ] T036 Implement cost tracking per-project and display in `frontend/src/components/ui/ProjectHeader.tsx`
- [ ] T037 Setup global Error Toast notification system in `frontend/src/App.tsx`
- [ ] T038 Add Ken Burns pan-and-zoom effect to static image scenes in `backend/src/utils/ffmpegTemplates.ts`

## Dependencies
- **Foundational (T006-T010)** must be completed before any User Story work.
- **US1 (T011-T024)** is a prerequisite for all other User Stories as they build on the core pipeline.
- **T027** depends on **T015 (TTS)** and **T022 (Captions)** logic.

## Parallel Execution Examples
- **Frontend Setup (T011, T012)** and **Backend Services (T013, T015)** can be built simultaneously.
- **Asset Generation (T017)** and **Music Matching (T019)** can proceed in parallel once the script is chosen.
- **Dashboard (T029)** and **Enhancement UI (T028)** are independent UI tasks.
