# Implementation Plan: AI Content Creator Tool

**Branch**: `001-ai-content-creator` | **Date**: 2026-04-18 | **Spec**: [spec.md](file:///c:/Users/Maamoun/Downloads/antygravity/aicontant/my-app/specs/001-ai-content-creator/spec.md)
**Input**: Feature specification from `/specs/001-ai-content-creator/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

The **AI Content Creator Tool** is a personal web application designed to automate professional video production from simple text ideas. It utilizes a 7-step pipeline—Script, Voiceover, Assets (Images/Video), Music, and Montage—leveraging Gemini 2.5, Imagen 3, Veo 2, and FFmpeg. The technical approach centers on a React frontend with a Node.js/Express backend deployed on Google Cloud Run to handle heavy video processing (FFmpeg), ensuring 1080p output and multi-language support (Arabic/English) with RTL layout compatibility.

**Language/Version**: TypeScript 5.x, Node.js 20.x, React 18.x  
**Primary Dependencies**: Vite, Tailwind CSS v3, Zustand, Express, FFmpeg, Firebase SDK, Google Cloud AI SDKs  
**Storage**: Firebase Firestore (Metadata), Firebase/Google Cloud Storage (Media)  
**Testing**: Vitest (Unit), Playwright (E2E)  
**Target Platform**: Web (Chrome/Safari), Desktop-first (1280px+)  
**Project Type**: web-service (Full-stack Monorepo)  
**Performance Goals**: <15 min total video generation; <5s progress updates; <10s fallback triggers  
**Constraints**: Dark mode only; RTL support for Arabic; 1080p resolution; 7-day data retention  
**Scale/Scope**: Personal use (1 user); Max 10 videos/day; Max 500MB uploads

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── routes/
│   ├── services/       # AI (Gemini/OpenAI), FFmpeg, Storage
│   ├── utils/          # Prompts, FFmpeg Templates
│   └── app.ts
├── tests/
└── Dockerfile          # Cloud Run configuration with FFmpeg

frontend/
├── src/
│   ├── components/     # UI, Pipeline steps
│   ├── stores/         # Zustand stores
│   ├── services/       # API wrappers
│   ├── pages/
│   └── main.tsx
└── tailwind.config.js
```

**Structure Decision**: Selected **Option 2: Web application** (frontend + backend) to decouple UI logic from resource-intensive video processing.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
