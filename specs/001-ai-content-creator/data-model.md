# Data Model: AI Content Creator Tool

## Firestore Collections

### `projects/{projectId}`
The root document for a video creation session.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique project ID |
| `userId` | string | Owner UID from Firebase Auth |
| `status` | string | `draft`, `processing`, `completed`, `failed` |
| `mode` | string | `shorts`, `long`, `external_montage` |
| `language` | string | `ar`, `en` |
| `duration` | number | Target duration in seconds |
| `aspectRatio` | string | `9:16`, `16:9` |
| `idea` | object | `{ text, contentType: [], uploads: [] }` |
| `selectedScriptId` | string | ID of the chosen script version |
| `selectedVoiceId` | string | ID of the chosen voiceover identity |
| `music` | object | `{ trackId, volume, s3Url }` |
| `outputs` | array | List of generated video GCS URLs |
| `createdAt` | timestamp | Creation time |
| `expiresAt` | timestamp | Time for 7-day auto-purge |

### `projects/{projectId}/scripts/{scriptId}`
Stored options for script generation.

| Field | Type | Description |
|-------|------|-------------|
| `version` | number | 1, 2, or 3 |
| `style` | string | `direct`, `storytelling`, `question` |
| `fullText` | string | The narrated content |
| `scenes` | array | List of scene objects (text, duration, visual prompt) |

### `projects/{projectId}/assets/{sceneId}`
Media options for individual scenes.

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `image`, `video`, `upload` |
| `options` | array | List of GCS URLs for this scene |
| `selectedUrl` | string | The chosen asset for montage |

## State Transitions
1. **Drafting**: User moves through setup -> idea -> script -> voice -> assets -> music.
2. **Locked/Processing**: System begins Cloud Run montage. UI reflects real-time progress.
3. **Completed**: 3 MP4 versions available for download.
4. **Purged**: 7 days post-completion, assets are deleted; status remains `completed` but links expire.
