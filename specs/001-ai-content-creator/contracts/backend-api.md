# API Contracts: AI Content Creator (Backend)

## Base URL: `https://content-creator-backend-xyz.a.run.app/api`

### 1. Script Generation
`POST /script/generate`
- **Request**: `{ projectId, idea, language, duration, mode }`
- **Response**: `200 OK` with 3 script options and scene breakdowns.

### 2. Voiceover Generation
`POST /voiceover/generate`
- **Request**: `{ projectId, scriptId, voiceId, speed }`
- **Response**: `200 OK` with GCS URL to generated `.mp3`.

### 3. Asset Planning & Generation
`POST /assets/generate`
- **Request**: `{ projectId, scenes }`
- **Response**: `202 Accepted` (triggers background generation of Images/Video clips).

### 4. Video Montage Orchestration
`POST /montage/create`
- **Request**: 
  ```json
  {
    "projectId": "string",
    "selections": {
      "scenes": [{ "sceneId": "id", "assetUrl": "url" }],
      "voiceoverUrl": "url",
      "music": { "url": "url", "volume": 0.2 },
      "captionStyle": "modern"
    }
  }
  ```
- **Response**: `202 Accepted` (returns Firebase Realtime DB path for progress tracking).

### 5. Progress Tracking (Realtime DB)
`GET /projects/{projectId}/progress`
- **Shape**: `{ stage: "FFMPEG_MIXING", percentage: 45, error: null }`
